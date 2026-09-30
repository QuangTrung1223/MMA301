# BÀI LAB 01 - LẬP TRÌNH DI ĐỘNG ĐA NỀN TẢNG (MMA301)

Dự án mẫu thực hành Lab 01 hoàn chỉnh bằng **React Native (Expo)**, tích hợp đầy đủ yêu cầu từ tài liệu học tập của FPT University.

---

## 📱 Các Màn hình được tích hợp

Ứng dụng được tích hợp thanh điều hướng nhanh (**HeaderNav**) ở đầu màn hình, cho phép chuyển đổi tức thì giữa 3 màn hình:

1. **🔐 LoginScreen** (Theo mẫu [Lab_Layout.docx]):
   - **Form đăng nhập**: Ô nhập Email và Mật khẩu có biểu tượng minh họa.
   - **Validation lỗi trực quan**:
     - Email: Bắt buộc nhập (`Email is required.`) và kiểm tra đúng định dạng email (`Invalid email format.`).
     - Mật khẩu: Bắt buộc nhập (`Password is required.`) và tối thiểu 8 ký tự (`Password must be at least 8 characters long.`).
   - **Tính năng mở rộng**: Nút bật/tắt hiển thị mật khẩu (con mắt), ô Checkbox *Remember password*.
   - **Xử lý nút bấm**:
     - Nút **Login**: Kiểm tra lỗi, nếu hợp lệ sẽ hiển thị thông báo thành công và tự động chuyển sang giỏ hàng.
     - Nút **Cancel**: Xóa sạch toàn bộ dữ liệu đang nhập (Reset form).

2. **🛒 ShoppingCartScreen** (Theo mẫu [Lab_Layout.docx]):
   - **Danh sách sản phẩm**: Hiển thị ảnh sản phẩm, tên, mô tả, đơn giá đỏ.
   - **Bộ đếm số lượng**: Nút `+` và `-` thay đổi số lượng từng sản phẩm (tối thiểu là 1).
   - **Lựa chọn sản phẩm (Selection)**: Checkbox ở từng món để chọn món cần xử lý.
   - **Nút Delete (góc phải trên)**: Xóa toàn bộ những món đang được tick chọn khỏi giỏ hàng.
   - **Thanh Total**: Tự động tính toán tổng giá trị đơn hàng theo công thức `∑(đơn giá × số lượng)`.
   - **Nút Checkout**: Xác nhận đặt hàng và hoàn tất thanh toán.

3. **📝 TaskManagerScreen** (Theo yêu cầu [Assignment1_ListTask.docx]):
   - **Quản lý công việc (Todo List)** bằng React Hook `useState`.
   - **Thêm công việc mới**: Ô nhập nội dung và nút Thêm (`+`).
   - **Đánh dấu hoàn thành**: Bấm vào công việc để chuyển đổi trạng thái (chữ gạch ngang khi đã xong).
   - **Xóa công việc**: Nút thùng rác với hộp thoại xác nhận xóa.
   - **Bộ lọc thông minh (Thử thách mở rộng)**: Lọc danh sách theo `"Tất cả"`, `"Chưa xong"`, `"Đã xong"`.
   - **Chỉnh sửa công việc (Edit)**: Nút cây bút cho phép sửa tên công việc ngay trên danh sách.

---

## 📂 Cấu trúc thư mục Lab01

```text
Lab01/
├── assets/                  # Tài nguyên hình ảnh, biểu tượng
├── src/
│   ├── components/
│   │   └── HeaderNav.js     # Thanh Tab Switcher chuyển màn hình
│   ├── data/
│   │   └── mockData.js      # Dữ liệu khởi tạo mẫu (giỏ hàng, danh sách công việc)
│   └── screens/
│       ├── LoginScreen.js          # Màn hình Đăng nhập
│       ├── ShoppingCartScreen.js   # Màn hình Giỏ hàng
│       └── TaskManagerScreen.js    # Màn hình Quản lý công việc (Todo List)
├── App.js                   # Điểm khởi chạy chính kết nối các màn hình
├── package.json             # Cấu hình gói và thư viện (Expo, React Native, @expo/vector-icons)
└── README.md                # Hướng dẫn chi tiết này
```

---

## 🚀 Hướng dẫn chạy ứng dụng

Từ thư mục gốc `MMA301`, bạn di chuyển vào thư mục `Lab01`:

```bash
cd Lab01
```

Khởi động dự án Expo:

```bash
npx expo start
```

### Các cách xem ứng dụng hoạt động:
- **Cách 1 - Xem trên điện thoại thật (Khuyên dùng, tiện nhất)**:
  - Tải app **Expo Go** từ Google Play Store (Android) hoặc App Store (iOS).
  - Mở app Expo Go và quét mã QR hiển thị trên màn hình terminal.
- **Cách 2 - Xem trên máy ảo Android (Android Emulator)**:
  - Mở Android Studio và bật máy ảo.
  - Nhấn phím `a` trên bàn phím trong cửa sổ chạy terminal.
- **Cách 3 - Xem trên trình duyệt Web**:
  - Nhấn phím `w` trên bàn phím trong cửa sổ chạy terminal.

---

## 💡 Giải thích các kiến thức trọng tâm trong bài

### 1. Quản lý trạng thái với `useState`
- Mọi dữ liệu có thể thay đổi trên giao diện (chữ trong ô input, danh sách sản phẩm, số lượng, danh sách việc cần làm) đều được quản lý bằng Hook `useState`:
```javascript
const [tasks, setTasks] = useState(INITIAL_TASKS);
```
- Khi gọi `setTasks(...)`, React Native sẽ tự động vẽ lại (re-render) giao diện tương ứng với dữ liệu mới.

### 2. Các hàm xử lý mảng quan trọng (Array Methods)
- **`map`**: Dùng để cập nhật thuộc tính của một phần tử trong danh sách mà không làm thay đổi trực tiếp mảng gốc (Tính chất bất biến - Immutability):
  ```javascript
  // Ví dụ: Tăng số lượng của sản phẩm có id tương ứng
  setItems(prevItems =>
    prevItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
  );
  ```
- **`filter`**: Dùng để loại bỏ các phần tử bị xóa hoặc lọc theo điều kiện:
  ```javascript
  // Ví dụ: Xóa các phần tử đang được tick chọn (item.selected === true)
  setItems(prevItems => prevItems.filter(item => !item.selected));
  ```
- **`reduce`**: Dùng để tính tổng tiền giỏ hàng một cách gọn gàng:
  ```javascript
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  ```

### 3. Bố cục Flexbox trong React Native
- Mặc định mọi thẻ `<View>` trong React Native đều có `display: 'flex'` và chiều sắp xếp mặc định là theo chiều dọc (`flexDirection: 'column'`).
- Muốn đặt các phần tử nằm ngang (như icon và ô text, hoặc nút `+` và `-`), ta dùng `flexDirection: 'row'`.
- `alignItems: 'center'` dùng để căn giữa các phần tử theo trục phụ (chiều cao).
- `justifyContent: 'space-between'` dùng để đẩy các phần tử ra 2 đầu (như nhãn "Total" bên trái và giá tiền bên phải).
