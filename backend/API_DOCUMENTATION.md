# 📚 API Documentation - Quản Lý Quần Áo Online

## 🎯 Tổng Quan Hệ Thống

Hệ thống bán quần áo trực tuyến đã được mở rộng với 4 model mới:

### Models mới:

1. **Sizes** (Kích cỡ)
2. **Colors** (Màu sắc)
3. **Materials** (Chất liệu)
4. **Reviews** (Đánh giá)

---

## 🔐 Xác Thực & Phân Quyền

### Token

- Token được gửi qua header: `Authorization: Bearer <token>`
- Hoặc qua cookie: `token`
- Hết hạn sau 1 giờ

### Các Roles

- **ADMIN**: Quản lý toàn bộ hệ thống
- **MODERATOR**: Quản lý nội dung (phê duyệt reviews, etc.)
- **USER**: Người dùng thường (tạo đánh giá, mua sắm)

---

## 📏 API: SIZES (Kích Cỡ)

### GET /api/v1/sizes

**Lấy danh sách tất cả size**

```bash
GET /api/v1/sizes?isActive=true
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "M",
    "description": "Medium size",
    "measurements": {
      "bust": 90,
      "waist": 75,
      "hips": 95,
      "length": 65
    },
    "isActive": true,
    "createdAt": "2024-03-27T10:00:00Z"
  }
]
```

### GET /api/v1/sizes/:id

**Lấy chi tiết size**

```bash
GET /api/v1/sizes/507f1f77bcf86cd799439011
```

### POST /api/v1/sizes

**Tạo size mới (ADMIN/MODERATOR)**

```bash
curl -X POST http://localhost:3000/api/v1/sizes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "L",
    "description": "Large size",
    "measurements": {
      "bust": 95,
      "waist": 80,
      "hips": 100,
      "length": 68
    }
  }'
```

### PUT /api/v1/sizes/:id

**Cập nhật size (ADMIN/MODERATOR)**

```bash
curl -X PUT http://localhost:3000/api/v1/sizes/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "measurements": {
      "bust": 98,
      "waist": 82,
      "hips": 102,
      "length": 69
    },
    "isActive": true
  }'
```

### DELETE /api/v1/sizes/:id

**Xóa size (ADMIN)**

```bash
curl -X DELETE http://localhost:3000/api/v1/sizes/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

---

## 🎨 API: COLORS (Màu Sắc)

### GET /api/v1/colors

**Lấy danh sách màu sắc**

```bash
GET /api/v1/colors?isActive=true
```

### GET /api/v1/colors/:id

**Lấy chi tiết màu**

```bash
GET /api/v1/colors/507f1f77bcf86cd799439012
```

### POST /api/v1/colors

**Tạo màu mới với upload ảnh (ADMIN)**

```bash
curl -X POST http://localhost:3000/api/v1/colors \
  -H "Authorization: Bearer <token>" \
  -F "name=Xanh Dương" \
  -F "hexCode=#0000FF" \
  -F "stock=100" \
  -F "image=@color_blue.jpg"
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Xanh Dương",
  "hexCode": "#0000FF",
  "imageUrl": "uploads/1711525200000-123456789.jpg",
  "stock": 100,
  "isActive": true
}
```

### PUT /api/v1/colors/:id

**Cập nhật màu (ADMIN)**

```bash
curl -X PUT http://localhost:3000/api/v1/colors/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <token>" \
  -F "name=Xanh Dương Tối" \
  -F "hexCode=#00008B" \
  -F "image=@new_color.jpg"
```

### PATCH /api/v1/colors/:id/stock

**Cập nhật tồn kho màu (ADMIN)**

```bash
curl -X PATCH http://localhost:3000/api/v1/colors/507f1f77bcf86cd799439012/stock \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "stock": 150 }'
```

### DELETE /api/v1/colors/:id

**Xóa màu (ADMIN)**

```bash
curl -X DELETE http://localhost:3000/api/v1/colors/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <token>"
```

---

## 🧵 API: MATERIALS (Chất Liệu)

### GET /api/v1/materials

**Lấy danh sách chất liệu**

```bash
GET /api/v1/materials?isActive=true
```

### GET /api/v1/materials/:id

**Lấy chi tiết chất liệu**

```bash
GET /api/v1/materials/507f1f77bcf86cd799439013
```

### POST /api/v1/materials

**Tạo chất liệu mới (ADMIN)**

```bash
curl -X POST http://localhost:3000/api/v1/materials \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cotton 100%",
    "description": "Chất liệu cotton nguyên chất",
    "percentage": 100,
    "care": "Giặt bằng nước lạnh, không tay",
    "priceModifier": 0
  }'
```

### PUT /api/v1/materials/:id

**Cập nhật chất liệu (ADMIN)**

```bash
curl -X PUT http://localhost:3000/api/v1/materials/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "percentage": 95,
    "priceModifier": 50000
  }'
```

### DELETE /api/v1/materials/:id

**Xóa chất liệu (ADMIN)**

```bash
curl -X DELETE http://localhost:3000/api/v1/materials/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer <token>"
```

---

## ⭐ API: REVIEWS (Đánh Giá)

### GET /api/v1/reviews/product/:productId

**Lấy tất cả đánh giá của sản phẩm (PUBLIC)**

```bash
GET /api/v1/reviews/product/507f1f77bcf86cd799439014
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "product": { "_id": "507f1f77bcf86cd799439014", "title": "Áo thun nam" },
    "user": {
      "_id": "507f1f77bcf86cd799439001",
      "fullName": "Nguyễn Văn A",
      "avatarUrl": "..."
    },
    "rating": 5,
    "title": "Sản phẩm tuyệt vời",
    "comment": "Chất liệu mềm và thoáng mát, hoàn toàn yên tâm khi mua",
    "images": ["uploads/review1.jpg"],
    "helpful": 12,
    "status": "approved",
    "createdAt": "2024-03-27T10:00:00Z"
  }
]
```

### GET /api/v1/reviews/admin/all

**Lấy tất cả đánh giá (ADMIN - bao gồm pending/rejected)**

```bash
curl -X GET http://localhost:3000/api/v1/reviews/admin/all \
  -H "Authorization: Bearer <token>"
```

### GET /api/v1/reviews/my-reviews

**Lấy các đánh giá của tôi (USER - phải login)**

```bash
curl -X GET http://localhost:3000/api/v1/reviews/my-reviews \
  -H "Authorization: Bearer <token>"
```

### GET /api/v1/reviews/:id

**Lấy chi tiết đánh giá (PUBLIC)**

```bash
GET /api/v1/reviews/507f1f77bcf86cd799439015
```

### POST /api/v1/reviews

**Tạo đánh giá mới (USER - phải login)**

```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer <token>" \
  -F "product=507f1f77bcf86cd799439014" \
  -F "rating=5" \
  -F "title=Sản phẩm tuyệt vời" \
  -F "comment=Chất liệu mềm, bền bỉ, màu sắc đẹp, giao hàng nhanh!" \
  -F "images=@review1.jpg" \
  -F "images=@review2.jpg"
```

### PUT /api/v1/reviews/:id

**Cập nhật đánh giá của tôi (USER - owner hoặc ADMIN)**

```bash
curl -X PUT http://localhost:3000/api/v1/reviews/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer <token>" \
  -F "rating=4" \
  -F "title=Sản phẩm tốt" \
  -F "comment=Chất liệu tốt, nhưng giao hàng hơi lâu" \
  -F "images=@newreview.jpg"
```

### PATCH /api/v1/reviews/:id/approve

**Phê duyệt đánh giá (ADMIN)**

```bash
curl -X PATCH http://localhost:3000/api/v1/reviews/507f1f77bcf86cd799439015/approve \
  -H "Authorization: Bearer <token>"
```

### PATCH /api/v1/reviews/:id/reject

**Từ chối đánh giá (ADMIN)**

```bash
curl -X PATCH http://localhost:3000/api/v1/reviews/507f1f77bcf86cd799439015/reject \
  -H "Authorization: Bearer <token>"
```

### PATCH /api/v1/reviews/:id/helpful

**Đánh dấu đánh giá hữu ích (USER)**

```bash
curl -X PATCH http://localhost:3000/api/v1/reviews/507f1f77bcf86cd799439015/helpful \
  -H "Authorization: Bearer <token>"
```

### DELETE /api/v1/reviews/:id

**Xóa đánh giá (USER - owner hoặc ADMIN)**

```bash
curl -X DELETE http://localhost:3000/api/v1/reviews/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer <token>"
```

---

## 📤 Upload Images

### Hỗ trợ Upload

- **Colors**: Hỗ trợ single image upload
- **Reviews**: Hỗ trợ multiple images upload (tối đa 5)

### Giới Hạn

- Kích thước: 5MB/file
- Format: Chỉ image (png, jpg, jpeg, gif, webp)
- Lưu tại: `uploads/` folder

### Ví dụ Upload

```bash
# Single file
curl -X POST http://localhost:3000/api/v1/colors \
  -H "Authorization: Bearer <token>" \
  -F "name=Đen" \
  -F "hexCode=#000000" \
  -F "image=@/path/to/black.jpg"

# Multiple files
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer <token>" \
  -F "product=507f1f77bcf86cd799439014" \
  -F "rating=5" \
  -F "title=Tuyệt vời" \
  -F "comment=Sản phẩm rất tốt" \
  -F "images=@/path/to/photo1.jpg" \
  -F "images=@/path/to/photo2.jpg" \
  -F "images=@/path/to/photo3.jpg"
```

---

## 🔍 Lỗi Thường Gặp

### 403 - Unauthorized

```json
{ "message": "bạn chưa đăng nhập" }
```

**Giải pháp**: Gửi token trong header Authorization

### 403 - Forbidden

```json
{ "message": "bạn không có quyền" }
```

**Giải pháp**: Role của bạn không đủ quyền thực hiện hành động

### 404 - Not Found

```json
{ "message": "ID không hợp lệ" }
```

**Giải pháp**: Kiểm tra ID có tồn tại không

### 400 - Bad Request

```json
{ "message": "Tên size là bắt buộc" }
```

**Giải pháp**: Kiểm tra lại dữ liệu gửi lên

---

## 💾 Database Schema

### Sizes

```javascript
{
  name: String,
  description: String,
  measurements: {
    bust: Number,
    waist: Number,
    hips: Number,
    length: Number
  },
  isActive: Boolean,
  isDeleted: Boolean
}
```

### Colors

```javascript
{
  name: String,
  hexCode: String,      // #RRGGBB
  imageUrl: String,     // Path to uploaded image
  stock: Number,
  isActive: Boolean,
  isDeleted: Boolean
}
```

### Materials

```javascript
{
  name: String,
  description: String,
  percentage: Number,   // 0-100
  care: String,
  priceModifier: Number,
  isActive: Boolean,
  isDeleted: Boolean
}
```

### Reviews

```javascript
{
  product: ObjectId,      // Reference to product
  user: ObjectId,         // Reference to user
  rating: Number,         // 1-5
  title: String,
  comment: String,
  images: [String],       // Array of image paths
  helpful: Number,        // Count of helpful marks
  status: String,         // pending, approved, rejected
  isDeleted: Boolean
}
```

---

## ✅ Kiểm Tra Hệ Thống

Để kiểm tra hệ thống đang hoạt động:

```bash
# Test login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YourPassword123!"}'

# Test get sizes
curl http://localhost:3000/api/v1/sizes

# Test create size (cần token)
curl -X POST http://localhost:3000/api/v1/sizes \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"M","measurements":{"bust":90,"waist":75,"hips":95,"length":65}}'
```

---

## 📚 Tổng Hợp Endpoints

| Method | Endpoint             | Auth | Role       | Mô Tả                    |
| ------ | -------------------- | ---- | ---------- | ------------------------ |
| GET    | /sizes               | ❌   | -          | Lấy tất cả sizes         |
| POST   | /sizes               | ✅   | ADMIN/MOD  | Tạo size                 |
| PUT    | /sizes/:id           | ✅   | ADMIN/MOD  | Cập nhật size            |
| DELETE | /sizes/:id           | ✅   | ADMIN      | Xóa size                 |
| GET    | /colors              | ❌   | -          | Lấy tất cả colors        |
| POST   | /colors              | ✅   | ADMIN      | Tạo color (with upload)  |
| PUT    | /colors/:id          | ✅   | ADMIN      | Cập nhật color           |
| PATCH  | /colors/:id/stock    | ✅   | ADMIN      | Cập nhật stock           |
| DELETE | /colors/:id          | ✅   | ADMIN      | Xóa color                |
| GET    | /materials           | ❌   | -          | Lấy tất cả materials     |
| POST   | /materials           | ✅   | ADMIN      | Tạo material             |
| PUT    | /materials/:id       | ✅   | ADMIN      | Cập nhật material        |
| DELETE | /materials/:id       | ✅   | ADMIN      | Xóa material             |
| GET    | /reviews/product/:id | ❌   | -          | Lấy reviews sản phẩm     |
| GET    | /reviews/admin/all   | ✅   | ADMIN      | Lấy tất cả reviews       |
| GET    | /reviews/my-reviews  | ✅   | USER       | Lấy my reviews           |
| POST   | /reviews             | ✅   | USER       | Tạo review (with upload) |
| PUT    | /reviews/:id         | ✅   | USER/ADMIN | Cập nhật review          |
| PATCH  | /reviews/:id/approve | ✅   | ADMIN      | Phê duyệt review         |
| PATCH  | /reviews/:id/reject  | ✅   | ADMIN      | Từ chối review           |
| PATCH  | /reviews/:id/helpful | ✅   | USER       | Mark helpful             |
| DELETE | /reviews/:id         | ✅   | USER/ADMIN | Xóa review               |

---

**Cập nhật: 27/03/2024**
**Version: 1.0**
