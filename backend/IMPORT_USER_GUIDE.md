# Hướng dẫn Import User với Mật khẩu Ngẫu nhiên

## 📋 Yêu cầu
- Username và email
- Mật khẩu: Chuỗi ngẫu nhiên 16 ký tự (tự động generate)
- Role: user
- Gửi email chứa mật khẩu

## 🛠️ Cách sử dụng

### 1. **Sử dụng Script (importUsersScript.js)**

#### Bước 1: Chỉnh sửa danh sách users cần import
Mở file `importUsersScript.js` và chỉnh sửa array `usersToImport`:

```javascript
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
  }
];
```

#### Bước 2: Chạy script
```bash
node importUsersScript.js
```

#### Kết quả:
- ✅ Users được tạo với mật khẩu 16 ký tự ngẫu nhiên
- ✅ Mật khẩu được gửi qua email
- ✅ Tài khoản cart tự động được tạo cho mỗi user
- ✅ Hiển thị báo cáo import (thành công/thất bại)

### 2. **Sử dụng API Endpoint**

#### POST `/api/v1/users/import-user/send-email`

**Request body:**
```json
{
  "username": "user001",
  "email": "user001@example.com",
  "roleId": "64f123abc456def789ghi012",
  "fullName": "Nguyen Van A",
  "avatarUrl": "https://i.sstatic.net/l60Hf.png"
}
```

**Response:**
```json
{
  "message": "User created successfully and password sent to email",
  "user": {
    "_id": "...",
    "username": "user001",
    "email": "user001@example.com",
    "role": "...",
    "fullName": "Nguyen Van A",
    "avatarUrl": "..."
  },
  "passwordSent": true,
  "note": "Password has been sent to the user's email address"
}
```

## 📧 Cấu hình Email (MailTrap)

File: `utils/sendMailHandler.js`

```javascript
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: "your_mailtrap_username",
        pass: "your_mailtrap_password",
    },
});
```

### Lấy thông tin MailTrap:
1. Đăng nhập tại https://mailtrap.io
2. Chọn Inbox → Settings → Integrations
3. Chọn Node.js/Nodemailer
4. Copy username và password

## 🔑 Mật khẩu được tự động tạo như sau:

```
- Độ dài: 16 ký tự
- Bao gồm: A-Z, a-z, 0-9, !@#$%^&*
- Được hash bằng bcrypt trước khi lưu
- Gửi dạng plain text trong email
```

## 📝 Chức năng tạo mật khẩu

Nằm trong file `controllers/users.js`:

```javascript
function generateRandomPassword(length = 16) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}
```

## 📧 Template Email

Email gửi cho user bao gồm:
- Tiêu đề: "Tài khoản đã được tạo - Thông tin đăng nhập"
- Nội dung hiển thị: Username và Password
- Lưu ý thay đổi mật khẩu sau lần đăng nhập đầu tiên

## ✅ Các bước đã hoàn thành

1. ✅ Tạo hàm `generateRandomPassword()` - tạo mật khẩu 16 ký tự
2. ✅ Thêm hàm `CreateUserWithRandomPassword()` - tạo user với mật khẩu ngẫu nhiên
3. ✅ Thêm hàm `sendPasswordMail()` - gửi email với password
4. ✅ Tạo endpoint `/import-user/send-email` - import user qua API
5. ✅ Tạo script `importUsersScript.js` - import bulk users từ file
6. ✅ Cấu hình MailTrap credentials

## 🧪 Test

### Test bằng cURL:
```bash
curl -X POST http://localhost:3000/api/v1/users/import-user/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "roleId": "64f123abc456def789ghi012",
    "fullName": "Test User"
  }'
```

### Test bằng Postman:
1. Method: POST
2. URL: `http://localhost:3000/api/v1/users/import-user/send-email`
3. Body (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@test.com",
  "roleId": "64f123abc456def789ghi012",
  "fullName": "Test User"
}
```

## 🐛 Troubleshooting

### Email không được gửi?
- Kiểm tra MailTrap credentials trong `sendMailHandler.js`
- Kiểm tra kết nối internet
- Xem logs trong MailTrap dashboard

### User không được tạo?
- Kiểm tra `roleId` tồn tại trong database
- Kiểm tra username/email chưa tồn tại
- Kiểm tra kết nối MongoDB

### Lỗi trùng username/email
- Script sẽ báo lỗi "Username or email already exists"
- Sử dụng username/email khác
