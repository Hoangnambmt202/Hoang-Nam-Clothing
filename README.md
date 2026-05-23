# 🛍️ Hoang Nam Clothing Shop

## 📖 Giới thiệu
**Hoang Nam Clothing Shop** là một nền tảng thương mại điện tử hiện đại chuyên về **thời trang và phụ kiện**.  
Dự án được xây dựng nhằm mang lại trải nghiệm mua sắm trực tuyến trực quan, nhanh chóng và thân thiện với người dùng.  

Với giao diện tối giản và tinh tế, khách hàng có thể dễ dàng duyệt sản phẩm, tìm kiếm, lọc theo nhu cầu và thanh toán an toàn.  
Hệ thống quản trị (**Admin Panel**) được thiết kế để đội ngũ quản lý có thể quản lý sản phẩm, đơn hàng và thông tin khách hàng một cách hiệu quả.  

---

## 🚀 Mục đích
Mục đích của dự án là xây dựng một nền tảng thương mại điện tử hoàn chỉnh, từ giao diện người dùng (**Frontend**) đến hệ thống xử lý logic phía máy chủ (**Backend**), nhằm cung cấp một giải pháp bán hàng trực tuyến toàn diện cho ngành thời trang.  

Dự án hướng đến sự **hiệu quả, ổn định và khả năng mở rộng** trong tương lai.  

---

## ✨ Tính năng nổi bật
- 👗 **Quản trị Catalog (Admin Panel)**: 
  - CRUD hoàn chỉnh và tích hợp API thực tế cho Sản phẩm (Products), Danh mục (Categories), và Thương hiệu (Brands).
  - Hỗ trợ tạo và quản lý Biến thể (Variants) với tự động sinh SKU, quản lý kho, giá linh hoạt.
  - Tích hợp Upload hình ảnh sản phẩm lên **Cloudinary**.
- 🛒 **Giỏ hàng Thông minh (Shopping Cart)**:
  - Quản lý trạng thái giỏ hàng nội bộ bằng **Redux Toolkit** & LocalStorage.
  - Hỗ trợ thay đổi số lượng, **chọn lại loại biến thể (màu sắc/kích cỡ) trực tiếp trong giỏ hàng**.
  - Hiển thị hóa đơn chi tiết, áp dụng mã giảm giá và chọn Quà tặng đi kèm.
- 🔎 **Tìm kiếm & Lọc sản phẩm**: Bộ lọc nâng cao giúp tìm sản phẩm theo danh mục, giá, size, màu sắc.  
- 💳 **Thanh toán & Vận chuyển (Checkout)**:
  - Hỗ trợ **Guest Checkout** (mua không cần tài khoản) với tự động tạo tài khoản ngầm.
  - Tích hợp API Tỉnh/Thành/Phường/Xã thực tế.
  - **Quản lý Shipping Methods & Payment Methods**:
    - Hiển thị động các phương thức thanh toán (COD, VNPAY, v.v.) và phương thức vận chuyển theo API.
    - Giao diện cấu hình/bật/tắt thanh toán, vận chuyển dành riêng cho Admin.
  - Quản lý State bằng Redux và tự động làm sạch giỏ hàng khi đặt thành công.
- 📦 **Quản lý Đơn hàng (Order Management)**:
  - **Giao diện Admin chuyên nghiệp**: Theo dõi, tìm kiếm, lọc đơn hàng theo trạng thái (Pending, Processing, Shipped, Delivered, Cancelled). Quản lý chi tiết từng Order Item liên kết chặt chẽ với Product Variants.
  - **Giao diện User**: Trang `Đơn hàng của tôi` giúp người dùng dễ dàng theo dõi lịch sử, trạng thái đơn hàng, xem chi tiết và hủy đơn khi đang chờ xử lý.
- 📱 **Thiết kế Responsive**: Giao diện sang trọng (UI Glassmorphism), hoạt động tốt trên desktop, tablet và mobile.  
- 🔐 **Xác thực người dùng**: Đăng ký, đăng nhập (JWT) và phân quyền (Admin/User).  

---

## 🛠️ Công nghệ sử dụng

### **Frontend**
- ⚡ **Next.js** – Framework React mạnh mẽ cho ứng dụng web.  
- ⚛️ **React** – Thư viện UI phổ biến để xây dựng giao diện người dùng.  
- 🎨 **Tailwind CSS** – Framework CSS tiện ích giúp thiết kế nhanh chóng và responsive.  
- 🔄 **Redux** – Quản lý trạng thái ứng dụng nhất quán và dễ dàng.  

### **Backend**
- 🟢 **NestJS** – Framework Node.js hiệu quả, cấu trúc tốt, viết bằng TypeScript.  
- 🔐 **Passport.js** – Thư viện xác thực linh hoạt cho Node.js.  
- 🔑 **JWT (JSON Web Token)** – Cơ chế xác thực người dùng an toàn.  

### **Database**
- 🍃 **PostgreSQL** – Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, ổn định và mở rộng tốt.  
- 💻 **TypeORM** – ORM cho TypeScript, giúp thao tác với cơ sở dữ liệu dễ dàng.  

---
👨‍💻 Người thực hiện

Hoang Nam – Fullstack Web Developer

### 📬 Contact

Tác giả: Nam CoderToData

Email: nam23062002@gmail.com

Portfolio: https://codertodata.dev

👉 Nếu bạn có dự án nào hãy liên hệ với tôi nhé 

📜 License: MIT
