# 🎨 Hệ Thống Quản Lý Bán Quần Áo Online

## 🚀 Tính Năng Mới (Vừa Thêm)

### ✅ 4 Models Mới Được Tạo:

1. **📏 Sizes** - Quản lý kích cỡ quần áo
   - ✅ CRUD đầy đủ
   - ✅ Kích thước chi tiết (bust, waist, hips, length)
   - ✅ Phân quyền: ADMIN/MODERATOR tạo/sửa/xóa

2. **🎨 Colors** - Quản lý màu sắc
   - ✅ CRUD đầy đủ
   - ✅ Upload ảnh minh họa màu
   - ✅ Quản lý tồn kho theo màu
   - ✅ Phân quyền: ADMIN tạo/sửa/xóa

3. **🧵 Materials** - Quản lý chất liệu
   - ✅ CRUD đầy đủ
   - ✅ Phần trăm thành phần chất liệu
   - ✅ Hướng dẫn giặt ủi
   - ✅ Điều chỉnh giá theo chất liệu
   - ✅ Phân quyền: ADMIN tạo/sửa/xóa

4. **⭐ Reviews** - Hệ thống đánh giá sản phẩm
   - ✅ CRUD đầy đủ
   - ✅ Upload tới 5 ảnh/đánh giá
   - ✅ Rating 1-5 sao
   - ✅ Phê duyệt đánh giá (ADMIN/MODERATOR)
   - ✅ Mark helpful votes
   - ✅ Phân quyền: USER tạo/sửa/xóa riêng của mình, ADMIN quản lý tất cả

---

## 🔐 Hệ Thống Bảo Mật Hoàn Chỉnh

### ✅ Authentication (Xác Thực)

- ✅ Login/Register
- ✅ JWT Token (1 giờ hết hạn)
- ✅ Cookie support
- ✅ Password hashing (bcrypt)

### ✅ Authorization (Phân Quyền)

- ✅ ADMIN - Toàn quyền
- ✅ MODERATOR - Quản lý nội dung
- ✅ USER - Người dùng thường

### ✅ Upload & File Management

- ✅ Single image upload (Colors)
- ✅ Multiple images upload (Reviews)
- ✅ Image validation (chỉ hình ảnh)
- ✅ Size limit (5MB/file)
- ✅ Automatic cleanup

---

## 📂 Toàn Bộ Files Được Tạo

### Schemas (Cơ sở dữ liệu)

```
schemas/
├── sizes.js        ← NEW
├── colors.js       ← NEW
├── materials.js    ← NEW
└── reviews.js      ← NEW
```

### Controllers (Logic xử lý)

```
controllers/
├── sizes.js        ← NEW
├── colors.js       ← NEW
├── materials.js    ← NEW
└── reviews.js      ← NEW
```

### Routes (API Endpoints)

```
routes/
├── sizes.js        ← NEW
├── colors.js       ← NEW
├── materials.js    ← NEW
└── reviews.js      ← NEW
```

### Documentation

```
API_DOCUMENTATION.md   ← NEW (Chi tiết tất cả API)
SETUP_GUIDE.md         ← Tệp này
```

---

## 🛠️ Cách Sử Dụng

### 1. Cài Đặt Phụ Thuộc (nếu cần)

```bash
npm install
```

### 2. Khởi Động Server

```bash
npm start
# Server sẽ chạy trên http://localhost:3000
```

### 3. Đăng Nhập để lấy Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "YourPassword123!"
  }'
```

### 4. Sử Dụng Token trong Requests

```bash
curl -X GET http://localhost:3000/api/v1/sizes \
  -H "Authorization: Bearer <token_từ_login>"
```

---

## 📋 Các Endpoints Chính

### Sizes (Kích Cỡ)

```
GET    /api/v1/sizes           - Lấy tất cả (PUBLIC)
GET    /api/v1/sizes/:id       - Lấy chi tiết (PUBLIC)
POST   /api/v1/sizes           - Tạo mới (ADMIN/MOD)
PUT    /api/v1/sizes/:id       - Cập nhật (ADMIN/MOD)
DELETE /api/v1/sizes/:id       - Xóa (ADMIN)
```

### Colors (Màu Sắc)

```
GET    /api/v1/colors          - Lấy tất cả (PUBLIC)
GET    /api/v1/colors/:id      - Lấy chi tiết (PUBLIC)
POST   /api/v1/colors          - Tạo với upload (ADMIN)
PUT    /api/v1/colors/:id      - Cập nhật (ADMIN)
PATCH  /api/v1/colors/:id/stock - Update stock (ADMIN)
DELETE /api/v1/colors/:id      - Xóa (ADMIN)
```

### Materials (Chất Liệu)

```
GET    /api/v1/materials       - Lấy tất cả (PUBLIC)
GET    /api/v1/materials/:id   - Lấy chi tiết (PUBLIC)
POST   /api/v1/materials       - Tạo mới (ADMIN)
PUT    /api/v1/materials/:id   - Cập nhật (ADMIN)
DELETE /api/v1/materials/:id   - Xóa (ADMIN)
```

### Reviews (Đánh Giá)

```
GET    /api/v1/reviews/product/:productId      - Lấy reviews sản phẩm (PUBLIC)
GET    /api/v1/reviews/admin/all              - Lấy tất cả (ADMIN)
GET    /api/v1/reviews/my-reviews             - Lấy my reviews (USER)
GET    /api/v1/reviews/:id                    - Lấy chi tiết (PUBLIC)
POST   /api/v1/reviews                        - Tạo mới (USER)
PUT    /api/v1/reviews/:id                    - Cập nhật (USER/ADMIN)
PATCH  /api/v1/reviews/:id/approve            - Phê duyệt (ADMIN)
PATCH  /api/v1/reviews/:id/reject             - Từ chối (ADMIN)
PATCH  /api/v1/reviews/:id/helpful            - Mark helpful (USER)
DELETE /api/v1/reviews/:id                    - Xóa (USER/ADMIN)
```

---

## 📊 Mối Liên Kết Giữa Models

```
Products
  ├─── Sizes (1-N)
  ├─── Colors (1-N)
  ├─── Materials (1-N)
  └─── Reviews (1-N)
        └─── Users (N-1)
```

---

## 🧪 Test API Nhanh

### 1. Test tạo Size

```bash
curl -X POST http://localhost:3000/api/v1/sizes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "L",
    "description": "Large",
    "measurements": {
      "bust": 95,
      "waist": 80,
      "hips": 100,
      "length": 68
    }
  }'
```

### 2. Test tạo Color với Upload

```bash
curl -X POST http://localhost:3000/api/v1/colors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Đen" \
  -F "hexCode=#000000" \
  -F "stock=100" \
  -F "image=@/path/to/black.jpg"
```

### 3. Test tạo Review với Upload

```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "product=PRODUCT_ID" \
  -F "rating=5" \
  -F "title=Sản phẩm tuyệt vời" \
  -F "comment=Chất liệu tốt, giao hàng nhanh" \
  -F "images=@/path/to/photo1.jpg" \
  -F "images=@/path/to/photo2.jpg"
```

---

## 🔍 Database Schema Details

### Size Schema

```javascript
{
  name: String (unique),
  description: String,
  measurements: {
    bust: Number,
    waist: Number,
    hips: Number,
    length: Number
  },
  isActive: Boolean,
  isDeleted: Boolean,
  timestamps: true
}
```

### Color Schema

```javascript
{
  name: String (unique),
  hexCode: String (#RRGGBB format),
  imageUrl: String,
  stock: Number,
  isActive: Boolean,
  isDeleted: Boolean,
  timestamps: true
}
```

### Material Schema

```javascript
{
  name: String (unique),
  description: String,
  percentage: Number (0-100),
  care: String,
  priceModifier: Number,
  isActive: Boolean,
  isDeleted: Boolean,
  timestamps: true
}
```

### Review Schema

```javascript
{
  product: ObjectId (ref: Product),
  user: ObjectId (ref: User),
  rating: Number (1-5),
  title: String,
  comment: String,
  images: [String],
  helpful: Number,
  status: String (pending/approved/rejected),
  isDeleted: Boolean,
  timestamps: true
}
```

---

## ⚙️ Configuration

### Cấu hình Upload

```javascript
// utils/uploadHandler.js
- Đường dẫn: uploads/
- Giới hạn: 5MB/file
- Format: image/*, spreadsheetml
```

### Cấu hình Database

```javascript
// app.js
mongoose.connect("mongodb://localhost:27017/NNPTUD-C2");
```

### Cấu hình JWT

```javascript
// utils/authHandler.js
- Secret: 'secret'
- Expire: '1h'
```

---

## ✨ Thêm Vào Dự Án

Tất cả 4 models đã được:
✅ Tích hợp vào app.js
✅ Đặt trong cấu trúc thư mục đúng
✅ Cung cấp CRUD đầy đủ
✅ Có authentication & authorization
✅ Hỗ trợ upload files
✅ DocumentService đầy đủ

---

## 📚 Tài Liệu

**Chi tiết đầy đủ**: Xem file [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

Bao gồm:

- Tất cả endpoints
- Ví dụ curl requests
- Response formats
- Error handling
- Upload examples

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module"

```bash
npm install
npm start
```

### Lỗi: "MongoDB connection error"

- Kiểm tra MongoDB service đã chạy
- `brew services start mongodb-community` (Mac)

### Lỗi: "Unauthorized"

- Kiểm tra đã gửi token trong header
- `Authorization: Bearer <your_token>`

---

## 🎯 Tóm Tắt

| Yêu Cầu           | Trạng Thái |
| ----------------- | ---------- |
| ✅ CRUD           | Hoàn thành |
| ✅ Authentication | Hoàn thành |
| ✅ Authorization  | Hoàn thành |
| ✅ Upload         | Hoàn thành |
| ✅ 4 New Models   | Hoàn thành |

---

**Các lệnh hữu dụng:**

```bash
npm start           # Start server
npm test            # Run tests (if available)
npm install         # Install dependencies
```

---

**Tạo: 27/03/2024**
**Phiên bản: 1.0**
**Trạng thái: ✅ Hoàn thành**
