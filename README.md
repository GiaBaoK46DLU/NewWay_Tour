# NewWay Tourist 🌴

**NewWay Tourist** là nền tảng Đặt tour du lịch trực tuyến (Online Tour Booking Platform) được xây dựng dành riêng cho các tuyến du lịch tại Đà Lạt và các điểm đến nổi bật. Hệ thống phục vụ cho cả khách hàng (đặt tour, quản lý booking) và quản trị viên (quản lý sản phẩm, đơn hàng, khách hàng).

---

## 🎯 1. Tổng quan các Phân hệ (Core Modules)

### Phân hệ Khách hàng (Client / User)
- **Tìm kiếm & Khám phá:** Tìm tour theo điểm đến, mức giá, thời gian khởi hành.
- **Chi tiết Tour:** Xem lịch trình chi tiết từng ngày, thông tin bao gồm/không bao gồm, chính sách hoàn hủy.
- **Giỏ hàng & Đặt chỗ (Booking):** Đặt số lượng vé (Người lớn, Trẻ em), giữ chỗ (Lock Seat) và quy trình Checkout.
- **Quản lý Tài khoản:** Đăng nhập/Đăng ký, lịch sử đặt tour, trạng thái thanh toán, và đánh giá (Review) sau khi đi tour.

### Phân hệ Quản trị (Admin Dashboard)
- **Quản lý Tour:** Thêm, sửa, xóa thông tin gốc của Tour (hình ảnh, mô tả, lộ trình).
- **Quản lý Lịch trình (Schedules):** Mở bán các lịch khởi hành cụ thể, set giá theo thời điểm, kiểm soát số chỗ trống.
- **Quản lý Đơn hàng (Bookings):** Theo dõi danh sách đặt tour, duyệt/hủy, thay đổi trạng thái thanh toán.
- **Quản lý Người dùng:** Phân quyền (Admin, Staff, Customer), hỗ trợ khách hàng.

---

## 🛠 2. Tech Stack (Công nghệ sử dụng)

Dự án được phát triển dựa trên các công nghệ hiện đại nhất (Full-stack TypeScript):
- **Frontend Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`
- **Icons:** Lucide React
- **Backend/API:** Next.js Server Components & Server Actions
- **Database & Auth:** Supabase (PostgreSQL under the hood)
- **Môi trường & Deploy:** Docker, Docker Compose

---

## 📂 3. Cấu trúc thư mục (Folder Structure)

```text
├── app/               # Next.js App Router (Chứa các Pages, Layouts, API Routes)
│   ├── (client)/      # Các trang dành cho Khách hàng (Home, Tour, Checkout...)
│   ├── (admin)/       # Các trang dành cho Admin (Dashboard, Tour management...)
│   └── api/           # (Nếu có) Next.js API endpoints
├── components/        # Các UI Components dùng chung (Buttons, Cards, Modals...)
├── lib/               # Các utility functions, helper, config
├── public/            # Static assets (Images, Fonts, Icons)
├── supabase/          # Chứa các file SQL schema, migrations của Supabase
├── types/             # TypeScript definitions & Interfaces
└── ...
```

---

## 🚀 4. Hướng dẫn thiết lập chạy Local (Development)

### Yêu cầu môi trường
- Node.js >= 18.x
- Npm hoặc Yarn
- Tài khoản [Supabase](https://supabase.com/)

### Bước 1: Clone & Cài đặt dependencies
```bash
git clone <repo-url>
cd NewWay_Tour
npm install
```

### Bước 2: Thiết lập Supabase
1. Tạo một project mới trên Supabase.
2. Copy file `.env.example` thành `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Điền các giá trị môi trường vào `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
4. Chạy script SQL để tạo bảng:
   Vào Supabase SQL Editor, chạy nội dung trong file `supabase/schema.sql`.
5. Đảm bảo đã bật **Email Provider** trong phần Authentication của Supabase.

### Bước 3: Tạo tài khoản Admin
1. Chạy dự án: `npm run dev`
2. Mở trình duyệt, đăng ký 1 tài khoản bình thường tại `/register`.
3. Chạy file `supabase/rls-admin-migration.sql` (nếu cần setup Role-Level Security).
4. Sửa email của bạn vào file `supabase/promote-admin.sql` và chạy nó để nâng cấp tài khoản của bạn lên `role = 'admin'`.
5. Đăng nhập lại và truy cập `/dashboard`.

---

## 🐳 5. Chạy dự án bằng Docker (Dành cho Deploy/Testing)

Yêu cầu: Máy đã cài đặt Docker và Docker Compose.

### Build và chạy:
```bash
docker-compose up --build
```
Dự án sẽ khởi chạy tại: `http://localhost:3000`

### Dừng và xóa container:
```bash
docker-compose down
```

### Ghi chú khi Deploy lên VPS:
1. Copy mã nguồn lên VPS.
2. Tạo file `.env.local` với các biến môi trường Production.
3. Chạy lệnh: `docker-compose up -d --build`.
4. (Khuyến nghị) Thiết lập Nginx hoặc Caddy làm Reverse Proxy để gắn Domain và SSL (HTTPS).

---
*Dự án NewWay Tourist - Phát triển bởi đội ngũ Fullstack Developer.*
