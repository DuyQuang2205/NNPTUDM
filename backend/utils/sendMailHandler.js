let nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "a94edac861078d",
        pass: "3f0789c96b5d23",
    },
});

module.exports = {
    sendMail: async function (to, url) {
        await transporter.sendMail({
            from: '"admin@" <admin@nnptud.com>',
            to: to,
            subject: "mail reset passwrod",
            text: "lick vo day de doi passs", // Plain-text version of the message
            html: "lick vo <a href=" + url + ">day</a> de doi passs", // HTML version of the message
        });
    },
    sendPasswordMail: async function (to, username, password) {
        const htmlContent = `
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Tài khoản đã được tạo thành công</h2>
                <p>Xin chào <strong>${username}</strong>,</p>
                <p>Tài khoản của bạn đã được tạo tại hệ thống. Dưới đây là thông tin đăng nhập:</p>
                <table style="border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Username:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${username}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Password:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${password}</strong></td>
                    </tr>
                </table>
                <p style="color: red;"><strong>Lưu ý:</strong> Vui lòng thay đổi mật khẩu sau lần đăng nhập đầu tiên.</p>
                <p>Nếu bạn không tạo tài khoản này, vui lòng liên hệ với chúng tôi.</p>
            </body>
        </html>
        `;
        
        await transporter.sendMail({
            from: '"Admin NNPTUD" <admin@nnptud.com>',
            to: to,
            subject: "Tài khoản đã được tạo - Thông tin đăng nhập",
            text: `Username: ${username}, Password: ${password}`,
            html: htmlContent
        });
    }
}