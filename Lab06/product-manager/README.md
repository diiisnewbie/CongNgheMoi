# 🛒 ShopManager — Quản Lý Sản Phẩm

Ứng dụng web quản lý sản phẩm xây dựng với **Node.js + Express + EJS** theo mô hình **MVC**, sử dụng **DynamoDB Local** chạy trên Docker.

---

## 📁 Cấu Trúc Dự Án (MVC)

```
product-manager/
├── app.js                    ← Entry point
├── docker-compose.yml        ← DynamoDB Local + Admin UI
├── package.json
│
├── config/
│   ├── dynamodb.js           ← Kết nối DynamoDB Client
│   └── initDB.js             ← Tạo bảng Products tự động
│
├── models/
│   └── Product.js            ← Model: CRUD + Validation
│
├── controllers/
│   └── productController.js  ← Controller: xử lý logic
│
├── routes/
│   └── products.js           ← Routes + Multer upload
│
├── views/
│   ├── partials/
│   │   ├── layout.ejs
│   │   └── flash.ejs
│   └── products/
│       ├── index.ejs         ← Danh sách sản phẩm
│       ├── new.ejs           ← Thêm sản phẩm
│       ├── edit.ejs          ← Sửa sản phẩm
│       └── show.ejs          ← Chi tiết sản phẩm
│
├── public/
│   ├── css/style.css
│   └── js/main.js
│
└── uploads/                  ← File ảnh upload
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### Bước 1 — Khởi động DynamoDB Local bằng Docker

```bash
docker-compose up -d
```

Kiểm tra container đang chạy:
```bash
docker ps
```

Kết quả mong muốn:
```
dynamodb-local   → port 8000
dynamodb-admin   → port 8001
```

> **DynamoDB Admin UI:** http://localhost:8001 (giao diện xem dữ liệu)

---

### Bước 2 — Cài đặt dependencies

```bash
npm install
```

---

### Bước 3 — Chạy ứng dụng

```bash
npm start
```

Hoặc dùng nodemon (tự reload khi thay đổi code):
```bash
npm run dev
```

> **Ứng dụng:** http://localhost:3000

---

## ✅ Chức Năng

| Tính năng | Route | Mô tả |
|---|---|---|
| Danh sách sản phẩm | `GET /` | Table có ảnh, tên, giá, tồn kho |
| Thêm sản phẩm | `GET/POST /products/new` | Form + upload ảnh |
| Chi tiết sản phẩm | `GET /products/:id` | Xem đầy đủ thông tin |
| Sửa sản phẩm | `GET/PUT /products/:id/edit` | Cập nhật + đổi ảnh |
| Xóa sản phẩm | `DELETE /products/:id` | Xóa DB + xóa file ảnh |
| Tìm kiếm | `GET /?search=...` | Tìm theo tên/mô tả |

---

## 🗄️ DynamoDB — Bảng Products

| Thuộc tính | Kiểu | Mô tả |
|---|---|---|
| `id` | String (PK) | UUID tự sinh |
| `name` | String | Tên sản phẩm |
| `price` | Number | Giá |
| `unit_in_stock` | Number | Số lượng tồn kho |
| `url_image` | String | Đường dẫn ảnh |
| `description` | String | Mô tả (tuỳ chọn) |
| `createdAt` | String | ISO timestamp |
| `updatedAt` | String | ISO timestamp |

---

## 🎯 Điểm Cộng Khuyến Khích Đã Làm

- ✅ **Kiểm tra dữ liệu nhập** — validate tên, giá, tồn kho với thông báo lỗi cụ thể
- ✅ **Thông báo thành công/thất bại** — flash messages tự tắt sau 4 giây
- ✅ **Tìm kiếm sản phẩm** — tìm theo tên và mô tả
- ✅ **Xử lý xóa ảnh cũ** — khi sửa hoặc xóa sản phẩm, file ảnh cũ bị xóa khỏi disk
- ✅ **Giao diện đẹp** — dark theme, drag & drop upload, modal xác nhận xóa

---

## ⚠️ Lưu Ý

- Đảm bảo Docker đang chạy trước khi `npm start`
- File ảnh được lưu vào thư mục `uploads/`, đường dẫn lưu vào DynamoDB
- DynamoDB Local dùng `-inMemory` → dữ liệu mất khi restart container. Bỏ flag này nếu muốn lưu persistent.
