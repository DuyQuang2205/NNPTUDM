/**
 * Script to import users with random passwords and send emails
 * Usage: node importUsersScript.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('./schemas/users');
const roleModel = require('./schemas/roles');
const cartModel = require('./schemas/cart');
const userController = require('./controllers/users');
const { sendPasswordMail } = require('./utils/sendMailHandler');

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/NNPTUD-C2';

// Sample data to import - You can modify this
const usersToImport = [
  {
    username: 'user001',
    email: 'user001@example.com',
    fullName: 'Nguyen Van A'
  },
  {
    username: 'user002',
    email: 'user002@example.com',
    fullName: 'Tran Thi B'
  },
  {
    username: 'user003',
    email: 'user003@example.com',
    fullName: 'Le Van C'
  }
];

async function importUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the "user" role
    let userRole = await roleModel.findOne({ name: 'user' });
    
    if (!userRole) {
      console.log('⚠️  "user" role not found. Creating it...');
      userRole = new roleModel({
        name: 'user',
        description: 'Regular user role'
      });
      await userRole.save();
      console.log('✅ "user" role created');
    }

    console.log(`\n📝 Starting to import ${usersToImport.length} users...\n`);

    const results = {
      success: [],
      failed: []
    };

    // Import each user
    for (const userData of usersToImport) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Check if user already exists
        const existingUser = await userModel.findOne({
          $or: [
            { username: userData.username },
            { email: userData.email }
          ],
          isDeleted: false
        });

        if (existingUser) {
          session.abortTransaction();
          session.endSession();
          results.failed.push({
            username: userData.username,
            email: userData.email,
            error: 'Username or email already exists'
          });
          console.log(`❌ ${userData.username} - Username or email already exists`);
          continue;
        }

        // Create user with random password
        const { user, plainPassword } = await userController.CreateUserWithRandomPassword(
          userData.username,
          userData.email,
          userRole._id,
          session,
          "https://i.sstatic.net/l60Hf.png",
          userData.fullName || ""
        );

        // Create cart for user
        const newCart = new cartModel({
          user: user._id
        });
        await newCart.save({ session });

        // Send email with password
        try {
          await sendPasswordMail(userData.email, userData.username, plainPassword);
          console.log(`✅ ${userData.username} - User created and email sent`);
        } catch (emailError) {
          console.log(`⚠️  ${userData.username} - User created but email failed: ${emailError.message}`);
          await session.commitTransaction();
          session.endSession();
          results.success.push({
            username: userData.username,
            email: userData.email,
            password: plainPassword,
            emailSent: false
          });
          continue;
        }

        await session.commitTransaction();
        session.endSession();

        results.success.push({
          username: userData.username,
          email: userData.email,
          password: plainPassword,
          emailSent: true
        });

      } catch (err) {
        session.abortTransaction();
        session.endSession();
        results.failed.push({
          username: userData.username,
          email: userData.email,
          error: err.message
        });
        console.log(`❌ ${userData.username} - Error: ${err.message}`);
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully imported: ${results.success.length} users`);
    console.log(`❌ Failed: ${results.failed.length} users`);
    console.log('='.repeat(60));

    if (results.success.length > 0) {
      console.log('\n✅ Successfully imported users:');
      results.success.forEach(user => {
        console.log(`  - ${user.username} (${user.email})`);
        console.log(`    Password: ${user.password}`);
        console.log(`    Email sent: ${user.emailSent ? 'Yes' : 'No'}`);
      });
    }

    if (results.failed.length > 0) {
      console.log('\n❌ Failed imports:');
      results.failed.forEach(user => {
        console.log(`  - ${user.username} (${user.email}): ${user.error}`);
      });
    }

    console.log('\n✅ Import process completed!\n');

  } catch (err) {
    console.error('❌ Error during import:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the import
importUsers();
