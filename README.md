# MMA301 - Lập trình Di Động Đa Nền Tảng (React Native)

Kho lưu trữ bài tập và thực hành môn **MMA301** (Multiplatform Mobile App Development with React Native) - FPT University.

## 📁 Danh sách bài thực hành

- [Lab01](./Lab01/): Bài tập Lab 01 tích hợp đầy đủ 3 màn hình:
  - **LoginScreen**: Form đăng nhập, validation lỗi thời gian thực, ẩn/hiện mật khẩu.
  - **ShoppingCartScreen**: Giỏ hàng sản phẩm, tăng/giảm số lượng, checkbox chọn sản phẩm, xóa và tính tổng tiền tự động.
  - **TaskManagerScreen**: Quản lý công việc (Todo List) với `useState`, bộ lọc trạng thái và chỉnh sửa công việc.
- [Lab02](./Lab02/): Bài tập Lab 02 làm chủ các thành phần UI và Navigation nâng cao:
  - **SectionListComp**: Danh sách phân nhóm với sticky header, tùy biến styles row & header.
  - **StackNavigator**: Điều hướng Stack giữa Screen1 và Screen2, truyền nhận tham số `{ name }` và `goBack()`.
  - **DrawerLayoutAndroid**: Menu trượt Drawer gốc của React Native với `useRef`, nút mở và đóng drawer.
  - **SafeAreaViewComp**: Xử lý vùng hiển thị an toàn trên thiết bị có tai thỏ / notch.
  - **Login & ShoppingCart**: Tích hợp các màn hình từ tài liệu mở rộng với luồng điều hướng chuẩn.
- [Assignment02](./Assignment02/): Bài tập Assignment 2 & Lab SQLite nâng cấp toàn diện:
  - **Todo List SQLite**: Lưu trữ Task bền vững vào SQLite (`openDatabaseAsync`, CRUD, toggle completion gạch ngang, xóa, lọc).
  - **Phone Contacts App (LAB_sqlite)**: Quản lý danh bạ (FR01-FR08) với SQLite (Thêm, Xem chi tiết, Sửa, Xóa, Tìm kiếm theo tên/SĐT, Validate dữ liệu).
  - **Auto-Login / Remember Password**: Tự động đăng nhập qua `AsyncStorage` khi mở lại ứng dụng.

## 📖 Tài liệu dự án

- [GLOSSARY.md](./GLOSSARY.md): Từ điển thuật ngữ domain của môn học.
- [docs/adr/0001-lab01-unified-expo-app.md](./docs/adr/0001-lab01-unified-expo-app.md): Quyết định kiến trúc ứng dụng Lab01.
- [docs/adr/0002-lab02-navigation-and-components.md](./docs/adr/0002-lab02-navigation-and-components.md): Quyết định kiến trúc Navigation và UI Components cho Lab02.
- [docs/adr/0003-assignment02-sqlite-persistence.md](./docs/adr/0003-assignment02-sqlite-persistence.md): Quyết định kiến trúc lưu trữ bền vững SQLite và Auto-Login cho Assignment02.


