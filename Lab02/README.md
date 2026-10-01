# BÀI LAB 02 - LẬP TRÌNH DI ĐỘNG ĐA NỀN TẢNG (MMA301)

Dự án mẫu thực hành Lab 02 hoàn chỉnh bằng **React Native (Expo)**, tích hợp đầy đủ yêu cầu từ tài liệu học tập PDF (`23_09_2026`) và DOCX (`28_09_2026`) của FPT University.

---

## 📱 Các Màn hình và Bài thực hành được tích hợp

Ứng dụng được trang bị thanh điều hướng nhanh (**HeaderNav**) ở đầu màn hình, cho phép giảng viên và học viên chuyển đổi tức thì giữa các bài tập:

1. **📋 1. SectionList (Slide 1-2)**:
   - Component: `SectionListComp.js`
   - Hiển thị danh sách phân nhóm các thành phần:
     - Nhóm **Basic Components**: `View`, `Text`, `Image`
     - Nhóm **List Components**: `ScrollView`, `ListView`
   - Sticky Header phân cấp rõ ràng với màu nền `steelblue` và text trắng đậm.
   - Các dòng (row) có nền `skyblue`, padding và margin phân cách chuẩn thiết kế.

2. **🧭 2. Navigator - React Navigation Stack (Slide 3)**:
   - Component: `NavigatorDemo.js`, `NavigatorScreen1.js`, `NavigatorScreen2.js`
   - Sử dụng thư viện chuẩn `@react-navigation/native` & `@react-navigation/native-stack`.
   - **Screen1**: Nhập họ tên vào ô `TextInput` (mặc định *"NamNV"*), bấm nút **SUBMIT**.
   - **Chuyển màn hình và truyền tham số**: Sử dụng `navigation.navigate('Screen2', { name })`.
   - **Screen2**: Nhận dữ liệu thông qua `route.params.name`, hiển thị *"Hello, {name}!"* và nút **GO BACK** gọi `navigation.goBack()`.

3. **📂 3. DrawerLayoutAndroid (Slide 4)**:
   - Component: `DrawerLayoutAndroidComp.js`
   - Header bar có biểu tượng 3 gạch (hamburger button) mở Drawer qua `drawerRef.current.openDrawer()`.
   - Màn hình chính hiển thị tiêu đề `DrawerLayoutAndroid`.
   - Ngăn kéo trượt (Navigation View) chứa danh sách các mục: `Item 1`, `Item 2` và nút **Close Drawer** gọi `drawerRef.current.closeDrawer()`.
   - Tích hợp cơ chế fallback animation mượt mà cho iOS / Web để tránh crash trên các nền tảng ngoài Android.

4. **📱 4. SafeAreaView (Slide 5)**:
   - Component: `SafeAreaViewComp.js`
   - Minh họa cách `SafeAreaView` tự động điều chỉnh padding/margin để bảo vệ nội dung không bị tai thỏ (notch), Dynamic Island hoặc thanh trạng thái (status bar) che khuất.
   - Kèm bảng giải thích trực quan về nguyên lý hoạt động của Safe Area Insets.

5. **🛒 5. Login & Shopping Cart (Tài liệu mở rộng 28_09_2026)**:
   - Component: `AuthCartDemo.js`, `LoginScreen.js`, `ShoppingCartScreen.js`
   - Tích hợp 2 màn hình từ bài tập giao diện:
     - Form đăng nhập với validation thời gian thực, ẩn/hiện mật khẩu, checkbox ghi nhớ mật khẩu.
     - Giỏ hàng sản phẩm đầy đủ tính năng: tăng/giảm số lượng, checkbox chọn sản phẩm, xóa mục đã chọn và tính tổng tiền tự động.

---

## 📂 Cấu trúc thư mục Lab02

```text
Lab02/
├── assets/                     # Biểu tượng và tài nguyên hình ảnh Expo
├── src/
│   ├── components/
│   │   └── HeaderNav.js        # Thanh chuyển đổi nhanh các bài thực hành
│   ├── data/
│   │   └── mockData.js         # Dữ liệu mẫu giỏ hàng
│   └── screens/
│       ├── SectionListComp.js          # Bài 1: Danh sách phân nhóm SectionList
│       ├── NavigatorDemo.js            # Bài 2: Stack Navigator Container
│       ├── NavigatorScreen1.js         # Bài 2: Màn hình 1 (Nhập tên & Submit)
│       ├── NavigatorScreen2.js         # Bài 2: Màn hình 2 (Nhận params & Go Back)
│       ├── DrawerLayoutAndroidComp.js  # Bài 3: Menu trượt Drawer gốc
│       ├── SafeAreaViewComp.js         # Bài 4: Kiểm soát Safe Area
│       ├── AuthCartDemo.js             # Bài 5: Hub tích hợp Login & Giỏ hàng
│       ├── LoginScreen.js              # Màn hình Đăng nhập
│       └── ShoppingCartScreen.js       # Màn hình Giỏ hàng
├── App.js                      # Điểm khởi chạy chính kết nối toàn bộ bài tập
├── app.json                    # Cấu hình dự án Expo
├── package.json                # Danh sách thư viện (React Navigation, Expo, Vector Icons)
└── README.md                   # Tài liệu hướng dẫn chi tiết
```

---

## 🚀 Hướng dẫn chạy ứng dụng

### 1. Di chuyển vào thư mục Lab02
```bash
cd Lab02
```

### 2. Cài đặt các gói phụ thuộc (nếu chưa cài)
```bash
npm install
```

### 3. Khởi động ứng dụng Expo
```bash
npm start
# hoặc
npx expo start
```

### 4. Lựa chọn môi trường chạy
- **Android**: Nhấn phím `a` trên terminal (yêu cầu mở sẵn Android Emulator hoặc cắm máy thật bật USB Debugging).
- **iOS**: Nhấn phím `i` trên terminal (yêu cầu máy Mac mở Xcode Simulator).
- **Web**: Nhấn phím `w` trên terminal để xem trực tiếp trên trình duyệt.
- **Expo Go (Điện thoại thật)**: Mở ứng dụng Expo Go trên điện thoại và quét mã QR hiển thị ở terminal.
