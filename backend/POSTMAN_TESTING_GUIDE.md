# 📘 Hướng Dẫn Test API Chi Tiết - Postman

## 🚀 Bước 1: Import Collection vào Postman

1. Mở **Postman** (tải từ https://www.postman.com/downloads/ nếu chưa có)
2. Click **File** → **Import**
3. Chọn file `Postman_All_Models.json`
4. Click **Import**
5. Bây giờ bạn sẽ thấy collection với 12 folders

---

## 🔑 Bước 2: Đăng Nhập & Lấy Token (BẮT BUỘC)

**Tất cả requests cần token để hoạt động!**

### Cách lấy token:

1. **Mở folder "🔐 Authentication"**
2. **Click vào request "POST - Login"**
3. **Nhập credentials:**
   ```json
   {
     "username": "admin",
     "password": "Admin@123"
   }
   ```
4. **Click tombol "Send"**
5. **Response sẽ trả về:**
   ```json
   {
     "access_token": "eyJhbGc...",
     "expiresIn": "1h"
   }
   ```

### Lưu token vào biến (QUAN TRỌNG):

Để tất cả requests khác có thể sử dụng token:

**Cách 1: Lưu thủ công (đơn giản)**

1. Copy toàn bộ access_token value (không có dấu ngoặc kép)
2. Click tab **Variables** ở phía dưới
3. Tìm dòng `token` → dán vào cột `Current Value`
4. Click **Save** (Ctrl+S)

**Cách 2: Lưu tự động với Script (nâng cao)**

1. Click request "POST - Login"
2. Chuyển sang tab **Tests** (phía bên phải)
3. Dán code này:

```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.access_token);
}
```

4. Lần tiếp theo khi run Login, token sẽ tự lưu!

---

## 📝 Bước 3: Test Từng Model

### **A. Test Users Model**

**1️⃣ GET - All Users**

- Click: **Users** → **GET - All Users**
- Header đã có: `Authorization: Bearer {{token}}`
- Click **Send**
- Xem response danh sách users

**2️⃣ POST - Create User (Tạo user mới)**

- Click: **Users** → **POST - Create User**
- Body đã setup sẵn, click **Send**
- Response sẽ trả user_id mới, **COPY ID này**

**3️⃣ Lưu user_id vào biến**

- Click **Variables** (phía dưới)
- Dán user_id vào `Current Value` của dòng `user_id`
- Save

**4️⃣ GET - User by ID**

- Click: **Users** → **GET - User by ID**
- URL tự động dùng `{{user_id}}`
- Click **Send**

**5️⃣ PUT - Update User**

- Click: **Users** → **PUT - Update User**
- Sửa body nếu muốn
- Click **Send**

**6️⃣ DELETE - User**

- Click: **Users** → **DELETE - User**
- Click **Send**

---

### **B. Test Products Model (Tương tự)**

1. **POST - Create Product** → Get `product_id`
2. Lưu vào Variables → `product_id`
3. **GET - Product by ID** (dùng product_id)
4. **PUT - Update Product**
5. **DELETE - Product**

---

### **C. Test Reviews Model (Có upload file)**

**1️⃣ POST - Create Review**

- Click: **Reviews** → **POST - Create Review**
- Body type: **formdata** (không phải raw JSON)
- Đã setup sẵn các fields:
  - `product`: `{{product_id}}`
  - `rating`: `5`
  - `title`: "Sản phẩm xuất sắc..."
  - `comment`: "Áo thun rất thoáng..."
  - `images`: Tùy chọn upload file

**Cách upload hình:**

- Hover vào dòng `images`
- Chọn type: **File** (nếu chưa chọn)
- Click **Select Files** → chọn ảnh từ máy
- Click **Send**

---

## 🔄 QUY TRÌNH TEST HOÀN CHỈNH

### **Workflow 1: Kiểm tra toàn bộ API**

```
1. Login → Lấy token
2. Create Category → Lưu category_id
3. Create Product (với category_id) → Lưu product_id
4. Create Sizes, Colors, Materials
5. Create Review (với product_id) → Lưu review_id
6. GET lại để verify dữ liệu
7. UPDATE các item
8. DELETE các item
```

### **Workflow 2: Test từng model riêng biệt**

Chọn một model (ví dụ Sizes):

```
GET All → GET by ID → POST Create → PUT Update → DELETE
```

---

## 🎯 TIPS QUAN TRỌNG

### **1. Luôn lưu ID khi Create**

Mỗi lần POST create (Users, Products, Reviews, etc.):

- Response trả về ID mới
- **COPY ID** → Paste vào Variables
- Sử dụng cho GET, PUT, DELETE tiếp theo

**Ví dụ Response:**

```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "M",
  ...
}
```

Copy `65a1b2c3d4e5f6g7h8i9j0k1` → Paste vào `size_id`

### **2. Test theo thứ tự logic**

❌ **SAI:** Test DELETE trước POST
✅ **ĐÚNG:**

- POST Create
- GET lấy data
- PUT Update
- DELETE xoá

### **3. Kiểm tra Status Code**

| Code    | Ý nghĩa      | Hành động           |
| ------- | ------------ | ------------------- |
| **200** | OK           | ✅ Thành công       |
| **201** | Created      | ✅ Tạo thành công   |
| **400** | Bad Request  | ❌ Body sai         |
| **401** | Unauthorized | ❌ Token thiếu/sai  |
| **403** | Forbidden    | ❌ Quyền không đủ   |
| **404** | Not Found    | ❌ ID không tồn tại |
| **500** | Server Error | ❌ Lỗi server       |

### **4. Xem Response Body**

Luôn click tab **Body** để xem kết quả:

```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "name": "...",
    ...
  }
}
```

---

## 🔍 TEST AUTHORIZATION (Quyền)

Một số requests chỉ admin được dùng:

- POST/PUT/DELETE Users → Cần ADMIN
- POST/PUT/DELETE Products → Cần ADMIN
- POST/PUT/DELETE Reviews → ADMIN/MODERATOR/Owner

**Cách test:**

1. Tạo user với role USER
2. Login thành user này (lấy token mới)
3. Cố gắng DELETE product → Sẽ bị từ chối (403 Forbidden)

---

## 📊 TEST EXAMPLES

### **Example 1: Test Sizes Model Hoàn Chỉnh**

```
1. GET - All Sizes → Xem danh sách hiện tại
   ✓ Status: 200
   ✓ Response: array rỗng hoặc có dữ liệu

2. POST - Create Size → Tạo size XXL
   Body: {"name": "XXL", "measurements": {...}}
   ✓ Status: 201
   ✓ Response có _id → Copy vào size_id variable

3. GET - Size by ID → Xem size vừa tạo
   URL: /sizes/{{size_id}}
   ✓ Status: 200
   ✓ Response: {"name": "XXL", ...}

4. PUT - Update Size → Thay đổi measurements
   Body: {"measurements": {"bust": 112, ...}}
   ✓ Status: 200
   ✓ Response: measurements được update

5. DELETE - Size → Xoá size
   URL: /sizes/{{size_id}}
   ✓ Status: 200
   ✓ Size không còn toàn tại (GET sẽ 404)
```

### **Example 2: Test Products + Reviews (Liên quan)**

```
1. Create Category → category_id
2. Create Product (category_id) → product_id
3. Create Review (product_id) → review_id
4. GET Reviews Product (product_id) → Thấy review vừa tạo
5. Approve Review (admin) → Status: approved
6. GET Reviews Product lại → Thấy status approved
```

---

## 🚨 TROUBLESHOOTING

### **❌ Error: "Cannot read property 'access_token'"**

→ Login sai credentials, check username/password

### **❌ Error 401: Unauthorized**

→ Token sai/hết hạn, cần login lại

### **❌ Error 403: Forbidden**

→ Bạn không có quyền, cần role khác

### **❌ Error 404: Not Found**

→ ID không tồn tại, check lại {{id}} variable

### **❌ Error 400: Bad Request**

→ Body JSON sai format, check Body tab

---

## 💡 ADVANCED TIPS

### **1. Được ghi chú requests**

Click request → Mô tả đã có sẵn (phía dưới)
Ví dụ: "Tạo product mới (ADMIN)"

### **2. Environment Variables**

Ngoài Variables có sẵn, bạn có thể thêm:

- `base_url`: http://localhost:3000
- `api_v1`: /api/v1
- Sau đó dùng: `{{base_url}}{{api_v1}}/users`

### **3. Pre-request Script**

Chạy code trước khi gửi request
Ví dụ: Thiết lập timestamp, random ID, etc.

### **4. Tests Script**

Kiểm tra response tự động:

```javascript
pm.test("Status is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has data", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.data).to.exist;
});
```

---

## ✅ CHECKLIST TRƯỚC KHI SUBMIT

- [ ] Đã import Postman_All_Models.json
- [ ] Đã login và lấy token
- [ ] Đã test ít nhất 1 GET request
- [ ] Đã test 1 POST (create) request
- [ ] Đã lưu được ID vào variables
- [ ] Đã test PUT (update) request
- [ ] Đã test DELETE request
- [ ] Tất cả 12 models đã test ít nhất 1 request

---

## 📞 CẦN GIÚP?

Nếu có lỗi:

1. Check status code (200, 201, 4xx, 5xx)
2. Xem response body chi tiết
3. Verify token còn hạn hay không
4. Check ID variables có đúng không
5. Xem console (Postman có built-in console)

**Happy Testing! 🎉**
