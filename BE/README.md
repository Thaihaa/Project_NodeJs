# Backend - Hệ Thống Quản Lý Nhà Hàng

Phần backend của ứng dụng quản lý nhà hàng với kiến trúc microservice, được xây dựng bằng Node.js/Express và MongoDB.

## Cấu trúc dự án

```
/BE
├── services/        # Các microservices
│   ├── auth/        # Dịch vụ xác thực
│   ├── restaurant/  # Dịch vụ quản lý nhà hàng
│   ├── menu/        # Dịch vụ quản lý thực đơn
│   ├── order/       # Dịch vụ đặt bàn/đặt món
│   └── review/      # Dịch vụ đánh giá
├── middlewares/     # Middleware chung
├── utils/           # Tiện ích chung
├── uploads/         # Thư mục lưu trữ tệp tải lên
└── logs/            # Thư mục nhật ký
```

## Các dịch vụ

1. **Auth Service**: Quản lý người dùng và xác thực
2. **Restaurant Service**: Quản lý thông tin nhà hàng
3. **Menu Service**: Quản lý danh mục món ăn và món ăn
4. **Order Service**: Quản lý đặt bàn và đặt món
5. **Review Service**: Quản lý đánh giá và bình luận

## Cài đặt và chạy ứng dụng

### Yêu cầu

- Node.js (v14.x hoặc cao hơn)
- MongoDB (v4.x hoặc cao hơn)
- npm hoặc yarn

### Cài đặt

1. **Cài đặt các gói phụ thuộc cho Backend**
   ```bash
   npm install
   ```

2. **Cài đặt các gói phụ thuộc cho cả Backend và Frontend**
   ```bash
   npm run install:all
   ```

3. **Cấu hình môi trường**
   - Tạo file `.env` dựa trên file `.env.example`

### Chạy ứng dụng

1. **Chạy tất cả các dịch vụ backend cùng lúc**
   ```bash
   npm run dev:all
   ```

2. **Chạy cả Backend và Frontend**
   ```bash
   npm run start:all
   ```

3. **Chỉ chạy Frontend từ thư mục Backend**
   ```bash
   npm run start:fe
   ```

4. **Chạy riêng từng dịch vụ**
   ```bash
   # API Gateway chính
   npm run dev
   
   # Auth Service
   npm run auth
   
   # Restaurant Service
   npm run restaurant
   
   # Menu Service
   npm run menu
   
   # Order Service
   npm run order
   
   # Review Service
   npm run review
   ```

## API Endpoints

### Auth Service
- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới token
- `GET /api/users/profile` - Lấy thông tin người dùng
- `PUT /api/users/profile` - Cập nhật thông tin người dùng

### Restaurant Service
- `GET /api/nha-hang` - Lấy danh sách nhà hàng
- `GET /api/nha-hang/:id` - Lấy thông tin một nhà hàng
- `POST /api/nha-hang` - Tạo nhà hàng mới
- `PUT /api/nha-hang/:id` - Cập nhật nhà hàng
- `DELETE /api/nha-hang/:id` - Xóa nhà hàng

### Menu Service
- `GET /api/loai-mon-an` - Lấy danh sách danh mục món ăn
- `POST /api/loai-mon-an` - Tạo danh mục món ăn mới
- `GET /api/mon-an` - Lấy danh sách món ăn
- `GET /api/mon-an/:id` - Lấy thông tin một món ăn
- `POST /api/mon-an` - Tạo món ăn mới
- `PUT /api/mon-an/:id` - Cập nhật món ăn
- `DELETE /api/mon-an/:id` - Xóa món ăn

### Order Service
- `GET /api/dat-ban` - Lấy danh sách đặt bàn
- `POST /api/dat-ban` - Tạo đơn đặt bàn mới
- `GET /api/dat-ban/:id` - Lấy thông tin đặt bàn
- `PUT /api/dat-ban/:id` - Cập nhật đặt bàn
- `DELETE /api/dat-ban/:id` - Hủy đặt bàn

### Review Service
- `GET /api/danh-gia` - Lấy danh sách đánh giá
- `POST /api/danh-gia` - Tạo đánh giá mới
- `PUT /api/danh-gia/:id` - Cập nhật đánh giá
- `POST /api/danh-gia/:id/tra-loi` - Thêm phản hồi cho đánh giá
- `DELETE /api/danh-gia/:id` - Xóa đánh giá

## Công nghệ sử dụng

- **Node.js & Express**: Framework web
- **MongoDB & Mongoose**: Cơ sở dữ liệu và ODM
- **JWT**: Xác thực và ủy quyền
- **Express Validator**: Xác thực dữ liệu
- **Multer**: Xử lý tải lên tệp
- **Winston**: Ghi nhật ký
- **Mailer**: Xác thực mail

## Tài khoản Admin và staff
admin1:
- Username: admin1
- Email: admin1@nhahang.com
- Vai trò: admin
- Password: Admin@123
admin2:
- Username: admin2
- Email: admin2@nhahang.com
- Vai trò: admin
- Password:    
staff1:
- Username: staff1
- Email: staff1@nhahang.com
- Vai trò: staff
- Password: Staff@123
staff2:
- Username: staff2
- Email: staff2@nhahang.com
- Vai trò: staff
- Password: Staff@123
