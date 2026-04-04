const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/NNPTUD-C2");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "❌ Connection error:"));
db.once("open", async () => {
  console.log("✅ Connected to MongoDB");

  try {
    // Import schemas
    const User = require("./schemas/users");
    const Role = require("./schemas/roles");

    // Clear existing data (optional)
    // await User.deleteMany({});
    // await Role.deleteMany({});

    // Create default roles
    const roles = await Role.find();
    if (roles.length === 0) {
      await Role.create([
        { name: "ADMIN", description: "Administrator role" },
        { name: "MODERATOR", description: "Moderator role" },
        { name: "USER", description: "User role" },
      ]);
      console.log("✅ Roles created");
    }

    // Create admin user
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      const adminRole = await Role.findOne({ name: "ADMIN" });

      const hashedPassword = await bcrypt.hash("admin@123", 10);

      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        fullName: "Administrator",
        role: adminRole._id,
        status: true,
      });
      console.log(
        "✅ Admin user created - username: admin, password: Admin@123",
      );
    } else {
      console.log("⚠️  Admin user already exists");
    }

    // Create a new user
    const newuserExists = await User.findOne({ username: "newuser" });
    if (!newuserExists) {
      const userRole = await Role.findOne({ name: "USER" });
      const hashedPasswordNewUser = await bcrypt.hash("Pass@123", 10);

      await User.create({
        username: "newuser",
        email: "newuser@example.com",
        password: hashedPasswordNewUser,
        fullName: "New User",
        role: userRole._id,
        status: true,
      });
      console.log(
        "✅ New user created - username: newuser, password: Pass@123",
      );
    } else {
      console.log("⚠️  New user already exists");
    }

    console.log("✅ Seed data completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
});
