/**
 * Test email script - verify Mailtrap credentials work
 */

const { sendPasswordMail } = require('./utils/sendMailHandler');

async function testEmail() {
  try {
    console.log('📧 Sending test email...\n');
    
    await sendPasswordMail(
      'testuser@example.com',
      'testuser001',
      'abc123XYZ!@#456'
    );
    
    console.log('✅ Email sent successfully!');
    console.log('📬 Check your Mailtrap inbox: https://mailtrap.io\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    process.exit(1);
  }
}

testEmail();
