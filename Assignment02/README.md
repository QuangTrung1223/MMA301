# ASSIGNMENT 02 & LAB SQLITE - MMA301

Ứng dụng thực hành hoàn chỉnh kết hợp **Assignment 2** (`Assignment2_Login_database.pdf`) và **LAB SQLite** (`LAB_sqlite.docx`), xây dựng trên nền tảng **React Native (Expo)** và cơ sở dữ liệu cục bộ **SQLite (`expo-sqlite`)**.

---

## 📱 Các tính năng chính được tích hợp

### 1. 🔐 Xác thực & Auto-Login (Assignment 2)
- **Màn hình Login**: Ô nhập Tên đăng nhập (Username) và Mật khẩu (Password).
- **Kiểm tra hợp lệ (Validation)**: Yêu cầu bắt buộc nhập cả username và password, hiển thị thông báo lỗi nếu để trống.
- **Tính năng Ghi nhớ mật khẩu (Remember Password)**:
  - Nếu tick chọn: Thông tin đăng nhập được lưu an toàn trong `AsyncStorage`.
  - Khi mở lại ứng dụng (Reload/Restart App): Hệ thống tự động kiểm tra thông tin và điều hướng thẳng vào màn hình chính (**Auto-Login**), bỏ qua màn hình đăng nhập.
  - Nếu không tick: Không lưu thông tin, người dùng bắt buộc phải đăng nhập lại mỗi khi khởi động app.
- **Đăng xuất (Logout)**: Nút đăng xuất xóa sạch thông tin ghi nhớ và chuyển người dùng về lại màn hình đăng nhập.

### 2. 📝 Quản lý công việc Todo List với SQLite (Assignment 2 & Assignment 1 nâng cấp)
- **Lưu trữ bền vững (Persistent Storage)**: Toàn bộ danh sách công việc được lưu trực tiếp vào bảng `tasks` trong SQLite (`mma301_app.db`). Dữ liệu được bảo toàn nguyên vẹn 100% khi đóng và mở lại app.
- **Thêm công việc (Create)**: Ô nhập tên công việc và nút **ADD**, thực hiện câu lệnh `INSERT INTO tasks ...`.
- **Hiển thị danh sách (Read)**: Sử dụng `FlatList` tối ưu hiệu năng, đọc từ `SELECT * FROM tasks ORDER BY id DESC`.
- **Đánh dấu hoàn thành (Update)**: Nút tích chọn chuyển đổi trạng thái hoàn thành (`UPDATE tasks SET completed = ...`), tiêu đề công việc hiển thị gạch ngang (`textDecorationLine: 'line-through'`).
- **Xóa công việc (Delete)**: Nút thùng rác với hộp thoại `Alert` xác nhận trước khi thực hiện `DELETE FROM tasks WHERE id = ...`.
- **Chỉnh sửa công việc (Edit)**: Modal chỉnh sửa tên công việc trực tiếp.
- **Bộ lọc thông minh (Filter)**: Lọc công việc theo 3 chế độ: **"Tất cả"**, **"Chưa xong"**, **"Đã xong"**.

### 3. 📇 Quản lý danh bạ Phone Contacts bằng SQLite (LAB_sqlite.docx)
Đáp ứng trọn vẹn 8 yêu cầu chức năng (FR01 - FR08):
- **FR01 (View Contacts)**: Hiển thị danh sách người liên hệ với avatar chữ cái đầu, tên, SĐT, email.
- **FR02 (Add Contact)**: Form modal nhập thông tin liên hệ mới lưu vào bảng `contacts` trong SQLite.
- **FR03 (View Contact Details)**: Bấm vào thẻ liên hệ để mở popup xem toàn bộ thông tin chi tiết (tên, SĐT, email, ghi chú).
- **FR04 (Update Contact)**: Cho phép chỉnh sửa thông tin liên hệ và cập nhật lại vào SQLite.
- **FR05 (Delete Contact)**: Xóa liên hệ sau khi người dùng xác nhận trong hộp thoại.
- **FR06 (Search Contacts)**: Thanh tìm kiếm lọc thời gian thực theo Tên hoặc Số điện thoại bằng câu lệnh `LIKE ?`.
- **FR07 (Data Validation)**: Bắt buộc nhập Họ tên và Số điện thoại hợp lệ (từ 8 đến 15 ký tự số).
- **FR08 (Persistent Storage)**: Toàn bộ danh bạ lưu trên SQLite thiết bị, không phụ thuộc vào Internet.

---

## 📂 Cấu trúc thư mục Assignment02

```text
Assignment02/
├── assets/                     # Biểu tượng, icon và splash screen
├── src/
│   ├── services/
│   │   ├── db.js               # Service quản lý kết nối SQLite, tạo bảng và các hàm CRUD
│   │   └── authStorage.js      # Service quản lý lưu trữ AsyncStorage cho Auto-Login
│   └── screens/
│       ├── LoginScreen.js      # Màn hình Đăng nhập & Auto-Login
│       ├── TodoListScreen.js   # Màn hình Quản lý công việc SQLite (Assignment 2)
│       ├── ContactsScreen.js   # Màn hình Quản lý danh bạ SQLite (LAB_sqlite)
│       └── MainAppScreen.js    # Hub trung tâm chứa tab switch giữa Todo và Contacts
├── App.js                      # Root Component kết nối React Navigation
├── app.json                    # Cấu hình dự án Expo
├── package.json                # Dependencies (expo-sqlite, async-storage, react-navigation)
└── README.md                   # Hướng dẫn chi tiết
```

---

## 🚀 Hướng dẫn khởi chạy ứng dụng

### 1. Di chuyển vào thư mục Assignment02
```bash
cd Assignment02
```

### 2. Cài đặt các gói thư viện
```bash
npm install
```

### 3. Khởi động ứng dụng Expo
```bash
npx expo start
```
- Nhấn **`a`**: Chạy trên máy ảo Android hoặc thiết bị thật kết nối cáp USB (khuyến nghị để kiểm tra chuẩn SQLite native).
- Nhấn **`w`**: Chạy thử nghiệm trên trình duyệt Web.
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại.
