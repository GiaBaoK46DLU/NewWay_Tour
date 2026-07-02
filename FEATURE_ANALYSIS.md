# 📊 Phân Tích Chức Năng Website Booking Tour

## 📌 So Sánh NewWay Tourist vs Hướng Tiên Tourist

### **1. Tổng Quan Kiến Trúc**

| Tiêu Chí         | NewWay Tourist (Hiện tại)  | Hướng Tiên Tourist (Tham khảo) | Trạng Thái                        |
| ---------------- | -------------------------- | ------------------------------ | --------------------------------- |
| Phạm vi          | Tour Đà Lạt chuyên biệt    | Tour toàn Việt + Quốc tế       | ✅ NewWay nhỏ hơn là OK           |
| Quy mô           | Nhỏ, startup               | Lớn, đã phát triển             | ✅ NewWay trong giai đoạn phù hợp |
| Model thanh toán | Không thanh toán trực tiếp | Hỗ trợ nhiều cách thanh toán   | ⚠️ NewWay có thể thêm sau         |

---

## 🔍 Chi Tiết So Sánh Chức Năng

### **A. Frontend - Khách Hàng (Client-side)**

#### ✅ Đã Có

- Trang chủ (Home) với danh sách tour nổi bật
- Trang danh sách tour (Tours listing)
- **Trang chi tiết tour (Tour detail) + BOOKING FORM** ✨ (form nằm trong aside)
  - Fields: full_name, email, phone, travel_date, guests, note
  - Server Action: `createBooking()` đã wired
  - Redirect: `/tours?booking=success`
- Trang blog/cẩm nang
- Trang điểm đến (Destinations)
- Trang contact

#### ❌ Chưa Có - CẤP ĐỘ 1 (THIẾT YẾU - Phải làm)

| Chức Năng                        | Hướng Tiên Có | NewWay Có                                | Trạng Thái                       | Ưu Tiên     |
| -------------------------------- | ------------- | ---------------------------------------- | -------------------------------- | ----------- |
| **Booking Form**                 | ✅            | ✅ **Đã có (tours/[id]/page.tsx)**       | ✅ Hoạt động nhưng cần cải thiện | -           |
| **Validation Form**              | ✅            | ❌ KHÔNG                                 | 🔴 CẤP THIẾT                     | 🔴 TUẦN 1   |
| **Error Handling**               | ✅            | ❌ KHÔNG (try/catch?)                    | 🔴 CẤP THIẾT                     | 🔴 TUẦN 1   |
| **Confirmation Page**            | ✅            | ❌ Chỉ redirect `/tours?booking=success` | 🔴 CẤP THIẾT                     | 🔴 TUẦN 1   |
| **Email xác nhận khách**         | ✅            | ❌ KHÔNG                                 | 🔴 CẤP THIẾT                     | 🔴 TUẦN 1-2 |
| **Giỏ Hàng (Cart)**              | ✅            | ❌                                       | 🟡 CÓ THỂ                        | 🟡 TUẦN 3+  |
| **User Account / Profile**       | ✅            | ✅ **Đã có (hồ sơ + lịch sử đặt tour)**  | ✅ XONG                          | -           |
| **Lựa chọn số người lớn/trẻ em** | ✅            | ❌ (chỉ có field "guests" chung)         | 🟡 CÓ THỂ                        | 🟡 TUẦN 2-3 |
| **Thêm dịch vụ bổ sung**         | ✅            | ❌                                       | 🟡 TƯƠNG LAI                     | 🟡 TUẦN 4+  |
| **Bộ lọc tour nâng cao**         | ✅            | ❌                                       | 🟡 CÓ THỂ                        | 🟡 TUẦN 3+  |

#### ❌ Chưa Có - LEVEL 2 (NỢP CẦN)

- Chuyên mục **Đánh giá & Review** (star rating, comment từ khách đã đi)
- **Khuyến mãi/Coupon** (discount code, giảm giá theo mùa)
- **Wishlist/Save Tour** (lưu tour yêu thích)
- **Share on Social** (chia sẻ tour lên Facebook, Instagram, WhatsApp)

---

### **B. Backend - Server Logic**

#### ✅ Đã Có

- Supabase Auth (đăng nhập/đăng ký)
- Database: tours, bookings, profiles
- RLS policies (Row Level Security)

#### ❌ Chưa Có / Cần Cải Thiện - CẤP ĐỘ 1

| Chức Năng                               | Hiện Tại                    | Tác Dụng                                                           | Ưu Tiên          |
| --------------------------------------- | --------------------------- | ------------------------------------------------------------------ | ---------------- |
| **Server Action: createBooking()**      | ✅ Tồn tại nhưng sơ sài     | Lưu booking vào database + validation                              | 🔴 CẦN CẢI THIỆN |
| **Validation form**                     | ❌ KHÔNG                    | Kiểm tra email format, phone format, guests > 0, travel_date valid | 🔴 CẤP THIẾT     |
| **Error handling**                      | ❌ KHÔNG                    | Bắt exception, return error message rõ ràng                        | 🔴 CẤP THIẾT     |
| **Email Integration**                   | ❌ KHÔNG                    | Setup email service (Resend, SendGrid, v.v.)                       | 🔴 CẤP THIẾT     |
| **Server Action: sendBookingEmail()**   | ❌ KHÔNG                    | Gửi email xác nhận tự động khi booking thành công                  | 🔴 CẤP THIẾT     |
| **Server Action: notifyAdminBooking()** | ❌ KHÔNG                    | Gửi email thông báo admin khi có booking mới                       | 🔴 CẤP THIẾT     |
| **Server Action: getUserBookings()**    | ✅ **Đã có (lib/tours.ts)** | Lấy danh sách booking của user hiện tại (theo user_id + RLS)       | ✅ XONG          |

---

### **C. Admin Dashboard**

#### ✅ Đã Có

- Trang quản lý tour (CRUD tours)
- Trang quản lý booking (xem danh sách)
- Đã setup authentication + authorization (admin only)

#### ❌ Chưa Có - CẤP ĐỘ 1

| Chức Năng                                | Hướng Tiên Có | Tác Dụng                                                | Ưu Tiên                              |
| ---------------------------------------- | ------------- | ------------------------------------------------------- | ------------------------------------ |
| **Action: Update booking status**        | ✅            | Admin thay đổi trạng thái (new → confirmed → cancelled) | ✅ XONG                              |
| **Chi tiết booking (Detail page/Modal)** | ✅            | Xem toàn bộ info khách + ghi chú (modal BookingDetail)  | ✅ XONG                              |
| **Gửi email xác nhận từ admin**          | ✅            | Admin gửi email "Booking đã xác nhận" cho khách         | ✅ XONG (tự động khi confirm/cancel) |
| **Export booking list (CSV/Excel)**      | ✅            | Xuất danh sách booking để báo cáo (nút Xuất CSV)        | ✅ XONG                              |

#### ❌ Chưa Có - LEVEL 2

- Quản lý **Tour Schedules** (lịch khởi hành cụ thể, số chỗ, giá theo ngày)
- Quản lý **Coupon/Promotion**
- Quản lý **User** (xem profile customer, role, active status)
- **Analytics/Reports** (doanh số, booking trends, top tours)

---

### **D. Email & Notification**

#### ✅ Đã Có

- Supabase Auth Email (đăng ký/đăng nhập)

#### ❌ Chưa Có - CẤP ĐỘ 1

| Chức Năng                  | Hướng Tiên Có | Tác Dụng                                                    | Ưu Tiên          |
| -------------------------- | ------------- | ----------------------------------------------------------- | ---------------- |
| **Email xác nhận booking** | ✅            | Gửi cho khách: mã booking, chi tiết tour, hướng dẫn liên hệ | 🔴 PHẢI LÀM NGAY |
| **Email thông báo admin**  | ✅            | Gửi cho owner khi có booking mới                            | 🔴 PHẢI LÀM NGAY |
| **Email marketing**        | ✅            | Newsletter, khuyến mãi cho khách đã đặt                     | 🟡 Tương lai     |

---

### **E. Dịch Vụ Bổ Sung (Optional)**

Hướng Tiên cung cấp:

- 🛫 Đặt vé máy bay
- 🏨 Đặt khách sạn
- 🚗 Thuê xe du lịch
- 🛂 Hộ chiếu online
- 📋 Dịch vụ Visa

**Đánh giá cho NewWay:** Tạm thời bỏ qua (quá phức tạp cho giai đoạn startup). Focus vào core tour booking trước.

---

## 🎯 GỢI Ý CHỈNH SỬA PRIORITIZED

### **PHASE 1: MVP Enhancement (1-2 tuần)**

**Mục tiêu:** Hoàn thiện flow đặt tour (booking form đã tồn tại, cần cải thiện)

1. 🔨 **Cải Thiện Booking Form** (tours/[id]/page.tsx + createBooking action)
   - ✅ Form đã có: full_name, email, phone, travel_date, guests, note
   - ❌ **Thêm validation** (email format, phone format, guests > 0, travel_date >= hôm nay)
   - ❌ **Thêm error handling** (try/catch, return error message)
   - ❌ **Thêm loading state** (disable button khi đang submit, show spinner)
   - ❌ **Improve UI/UX** (success/error toast notification)

2. ❌ **Tạo Confirmation Page/Success Page**
   - Thay vì redirect `/tours?booking=success` (không rõ ràng)
   - Tạo page: `/booking-confirmed/[id]` hoặc `/confirmation`
   - Hiển thị: mã booking, tour name, ngày đi, số khách, thông tin liên hệ
   - Thông báo: "Yêu cầu đã gửi, chủ sẽ liên hệ qua email trong 24h"
   - Button: Quay lại home, xem tour khác

3. ❌ **Setup Email Service + Send Emails**
   - Chọn: **Resend.com** (recommended - dễ setup, free tier)
   - Tạo: `sendBookingConfirmationEmail()` (gửi email cho khách)
   - Tạo: `sendBookingNotificationEmail()` (gửi email cho admin)
   - Tạo: Email templates (HTML)
   - Gọi hàm email trong `createBooking()` sau khi insert thành công

4. 🟡 **Tạo User Profile Page** (optional - có thể skip tuần này)
   - Page: `/profile` hoặc `/dashboard/my-bookings`
   - Xem lịch sử booking của user (chỉ booking của user đó)
   - Hiển thị: booking ID, tour name, date, status

5. ✅ **Cập nhật Server Actions**
   - `createBooking()` - thêm validation + error handling + gọi email functions
   - `getUserBookings()` - tạo function này để lấy booking của user hiện tại

---

### **PHASE 2: Admin Enhancement (Tuần 3-4)**

**Mục tiêu:** Admin có thể quản lý bookings tốt hơn

1. ✅ **Add Action Buttons trong Bookings Table**
   - Update status: dropdown (new → confirmed → cancelled)
   - Xem chi tiết: modal/page (full booking info)
   - Gửi email xác nhận: button để gửi email khi xác nhận

2. ✅ **Server Action: updateBookingStatus()**
   - Admin cập nhật status
   - Tự động gửi email cho khách khi status = "confirmed"?

3. ✅ **Optional: Tour Schedules Management**
   - Tạo bảng: `tour_schedules` (tour_id, start_date, price, available_seats)
   - Admin thêm/sửa/xóa schedule
   - Booking liên kết với schedule (không chỉ tour chung chung)

---

### **PHASE 3: UX Enhancement (Tuần 5+)**

**Mục tiêu:** Tăng conversion và user satisfaction

> ✅ **Phase 3 (phần UX client-side) hoàn thành** trên nhánh `feature/phase2-booking-management`.
> Chi tiết + hướng dẫn QA: [`QA/PHASE3_UX_ENHANCEMENT.md`](QA/PHASE3_UX_ENHANCEMENT.md).
> E2E: `e2e/phase3-ux.spec.ts` (5 test, all green).

1. ✅ **Advanced Search/Filter** — XONG
   - Filter: loại tour, khoảng giá, ngày đi (SearchBox) + **thời lượng (duration)** mới
   - Sort: **Phổ biến / Giá thấp→cao / Giá cao→thấp / Đánh giá cao** (toolbar mới, URL-driven)
   - Files: `app/tours/page.tsx`, `components/sections/tour-toolbar.tsx`

2. ✅ **Wishlist/Save Tours** — XONG (**Supabase, per-user, đồng bộ đa thiết bị** — yêu cầu đăng nhập)
   - Nút trái tim trên tour card + trang chi tiết; trang `/wishlist`; badge đếm trên header/mobile nav
   - Khách chưa đăng nhập bấm tim → chuyển tới `/login?next=...`
   - Files: `lib/wishlist.ts`, `lib/actions/wishlist.ts`, `components/ui/wishlist-button.tsx`, `components/sections/wishlist-grid.tsx`, `app/wishlist/page.tsx`

3. ✅ **Reviews & Ratings** — XONG (**Supabase — mọi người đọc, user đăng nhập mới viết**, 1 review/user/tour)
   - Form chấm sao 1–5 + nhận xét; điểm trung bình + danh sách công khai trên trang chi tiết tour
   - Files: `lib/reviews.ts`, `lib/actions/reviews.ts`, `components/sections/tour-reviews.tsx` (server), `components/sections/review-form.tsx` (client)

4. 🟡 **Coupon/Promo Code** — HOÃN (cần bảng DB + không có checkout thanh toán trực tiếp)

5. 🟡 **SMS/Zalo Notification** (Future) — HOÃN (cần tích hợp nhà cung cấp SMS/Zalo OA)

> ⚠️ **Cần chạy migration** `supabase/migrations/0004_wishlists_and_reviews.sql`
> trong Supabase SQL Editor để tạo bảng `wishlists` + `reviews` và RLS.
> Tên tác giả review lấy từ hồ sơ (không tin client) để chống giả mạo.

---

## 📋 So Sánh Chi Tiết Chức Năng (Bảng Tóm Tắt)

| Chức Năng                       | NewWay Hiện Tại            | Hướng Tiên  | Trạng Thái        | Timeline     |
| ------------------------------- | -------------------------- | ----------- | ----------------- | ------------ |
| Trang home + danh sách tour     | ✅ Có                      | ✅ Có       | XONG              | -            |
| Trang chi tiết tour             | ✅ Có                      | ✅ Có       | XONG              | -            |
| **Booking Form**                | ✅ CÓ nhưng sơ sài         | ✅ Có       | ⚠️ CẦN CẢI THIỆN  | **Week 1**   |
| **Validation Form**             | ❌ KHÔNG                   | ✅ Có       | 🔴 CẤP THIẾT      | **Week 1**   |
| **Error Handling**              | ❌ KHÔNG                   | ✅ Có       | 🔴 CẤP THIẾT      | **Week 1**   |
| **Confirmation Page**           | ❌ Chỉ redirect            | ✅ Có       | 🔴 CẤP THIẾT      | **Week 1**   |
| **Email xác nhận cho khách**    | ❌ KHÔNG                   | ✅ Có       | 🔴 CẤP THIẾT      | **Week 1-2** |
| **Email thông báo admin**       | ❌ KHÔNG                   | ✅ Có       | 🔴 CẤP THIẾT      | **Week 1-2** |
| User Profile / Booking History  | ✅ Có                      | ✅ Có       | ✅ XONG           | -            |
| Admin update booking status     | ✅ Có                      | ✅ Có       | ✅ XONG           | -            |
| Chi tiết booking modal          | ✅ Có                      | ✅ Có       | ✅ XONG           | -            |
| Export booking CSV              | ✅ Có                      | ✅ Có       | ✅ XONG           | -            |
| **Đổi mật khẩu**                | ❌ KHÔNG                   | ✅ Có       | 🟡 Phase 4        | **Sắp tới**  |
| **Chỉnh sửa thông tin cá nhân** | ❌ KHÔNG                   | ✅ Có       | 🟡 Phase 4        | **Sắp tới**  |
| **Autofill thông tin đặt tour** | ❌ KHÔNG                   | ❌ Không    | 🟡 Phase 4        | **Sắp tới**  |
| **Số chỗ còn + tổng tiền form** | ❌ KHÔNG                   | ⚠️ Một phần | 🟡 Phase 4        | **Sắp tới**  |
| **Floating Zalo/Phone button**  | ❌ KHÔNG                   | ✅ Có       | 🟡 Phase 4        | **Sắp tới**  |
| **Tự hủy booking từ /profile**  | ❌ KHÔNG                   | ❌ Không    | 🟡 Phase 4        | **Sắp tới**  |
| **Open Graph / SEO tour pages** | ❌ KHÔNG                   | ✅ Có       | 🟡 Phase 4        | **Sắp tới**  |
| Lọc tour nâng cao               | ✅ Có (sort+duration)      | ✅ Có       | ✅ XONG (Phase 3) | -            |
| Wishlist/Lưu tour               | ✅ Có (Supabase/user)      | ✅ Có       | ✅ XONG (Phase 3) | -            |
| Review/Rating tours             | ✅ Có (Supabase/công khai) | ✅ Có       | ✅ XONG (Phase 3) | -            |
| Coupon/Promotion                | ❌ KHÔNG                   | ✅ Có       | 🟡 CÓ THỂ         | **Week 5+**  |
| Tour Schedules                  | ❌ KHÔNG (schema có)       | ✅ Có       | 🟡 CÓ THỂ         | **Week 4+**  |
| Thanh toán trực tiếp            | ❌ KHÔNG (bỏ qua)          | ✅ Có       | ❌ SKIP           | -            |
| Dịch vụ bổ sung                 | ❌ KHÔNG                   | ✅ Có       | ❌ SKIP (future)  | -            |

---

## 🚀 KHUYẾN NGHỊ HÀNH ĐỘNG

### **Tuần 1 (CRITICAL - PRIORITIZE):**

```
[ ] Task 1: Cải thiện createBooking() - Thêm validation + error handling
[ ] Task 2: Cải thiện booking form UI (loading state, toast notification)
[ ] Task 3: Setup Email Service - Integrat Resend.com
[ ] Task 4: Tạo email templates + Server Actions gửi email
[ ] Task 5: Tạo Confirmation Page (/booking-confirmed/[id])
[ ] Task 6: Testing end-to-end flow (form → email → confirmation)
```

### **Tuần 2 (IMPORTANT):**

```
[x] Task 7: Tạo User Profile page + getUserBookings() Server Action (lịch sử đặt tour trên /profile)
[x] Task 8: Admin page: Cải thiện booking list (modal chi tiết + xuất CSV + status badge)
[x] Task 9: Server Action: updateBookingStatus() (Confirm/Cancel + email cho khách)
```

> ✅ **Phase 2 hoàn thành** trên nhánh `feature/phase2-booking-management`.
> ⚠️ Cần chạy migration `supabase/migrations/0003_link_bookings_to_users.sql`
> trong Supabase SQL Editor để bật cột `user_id` + RLS "Users can read own bookings".

### **Tuần 3+ (NICE-TO-HAVE):**

```
[ ] Task 10: Tour Schedules management        (HOÃN - cần bảng tour_schedules + migration)
[x] Task 11: Lọc tour nâng cao                (Phase 3 - sort + duration filter)
[x] Task 12: Wishlist/Save tours              (Phase 3 - localStorage + /wishlist)
[x] Task 13: Reviews & ratings                (Phase 3 - localStorage trên trang chi tiết)
```

### **PHASE 4: Account Self-Service + UX Improvements (Tuần tiếp theo)**

```
[ ] Task 14: Đổi mật khẩu (Change Password)
[ ] Task 15: Chỉnh sửa thông tin cá nhân (username, email)
[ ] Task 16: Lưu thông tin đặt tour để điền sẵn vào form lần sau (Autofill từ profile)
[ ] Task 17: Hiển thị số chỗ còn lại + tính tổng tiền realtime trên form đặt tour
[ ] Task 18: Nút liên hệ nhanh Zalo / điện thoại (floating button)
[ ] Task 19: Cho phép khách tự hủy booking từ /profile (status = new)
[ ] Task 20: Open Graph / SEO metadata cho trang tour (chia sẻ mạng xã hội)
```

---

### **PHASE 4: Account Self-Service**

**Mục tiêu:** Cho phép user tự quản lý tài khoản mà không cần admin can thiệp

#### 1. Đổi mật khẩu

| Tiêu chí          | Chi tiết                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **Trang**         | Mục riêng trong `/profile` hoặc `/profile/change-password`                                      |
| **Server Action** | `changePassword()` — gọi `supabase.auth.updateUser({ password })`                               |
| **Validation**    | Mật khẩu mới tối thiểu 6 ký tự; xác nhận mật khẩu phải khớp                                     |
| **UX**            | Toast thành công/lỗi; ô nhập có toggle show/hide                                                |
| **Lưu ý**         | Supabase không yêu cầu mật khẩu cũ khi đã có session hợp lệ — người dùng chỉ cần đang đăng nhập |

#### 2. Chỉnh sửa thông tin cá nhân

| Tiêu chí          | Chi tiết                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trang**         | Form inline trong `/profile` (edit mode toggle)                                                                                                   |
| **Fields**        | `username` (bảng `profiles`); `email` (qua `supabase.auth.updateUser`)                                                                            |
| **Server Action** | `updateProfile()` — update bảng `profiles`; nếu đổi email thì thêm bước xác nhận (Supabase gửi email verify link)                                 |
| **Validation**    | Username 2–50 ký tự; email đúng format                                                                                                            |
| **Lưu ý**         | Đổi email cần Supabase gửi xác nhận tới địa chỉ mới trước khi có hiệu lực (cân nhắc bỏ qua tính năng đổi email nếu không muốn bật xác nhận email) |

#### 3. Lưu thông tin đặt tour để điền sẵn (Autofill)

| Tiêu chí          | Chi tiết                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| **Cơ chế**        | Thêm cột `booking_name`, `booking_phone` vào bảng `profiles` — lưu thông tin liên lạc mặc định cho booking      |
| **Booking form**  | Khi user đăng nhập và có dữ liệu đã lưu, form tự điền `full_name` + `phone` từ profile; email điền từ tài khoản |
| **Server Action** | `createBooking()` có thể kéo defaults từ profile; `updateProfile()` lưu thêm `booking_name`/`booking_phone`     |
| **UX**            | Checkbox "Lưu thông tin này cho lần sau" trong form đặt tour; hoặc chỉnh trong trang `/profile`                 |
| **Migration**     | Thêm `booking_name text`, `booking_phone text` vào `profiles` qua migration `0004`                              |
| **Lưu ý**         | Khách vẫn **có thể sửa** thông tin trước khi gửi — autofill chỉ là gợi ý, không lock cứng                       |

#### 4. Hiển thị số chỗ còn lại + tính tổng tiền realtime trên form đặt tour

| Tiêu chí           | Chi tiết                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Tổng tiền**      | Client component: khi user chọn số khách, hiện `số khách × tour.price` bằng `formatPrice()` ngay dưới ô guests         |
| **Số chỗ còn lại** | Server Component truyền `availableSeats` xuống form; tính từ `tour.capacity - SUM(guests active bookings cho ngày đó)` |
| **Ngày đi**        | Khi user đổi `travel_date`, cần fetch lại capacity cho ngày mới — có thể dùng Server Action trả về remaining seats     |
| **UX**             | Badge "Còn X chỗ" đổi màu theo ngưỡng (xanh > 10, vàng ≤ 10, đỏ ≤ 3); disable nút gửi nếu = 0                          |
| **Lưu ý**          | Logic capacity check đã có trong `createBooking()`, chỉ cần expose ra UI — không tốn thêm DB query mới                 |

#### 5. Nút liên hệ nhanh Zalo / điện thoại (floating button)

| Tiêu chí      | Chi tiết                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Vị trí**    | Cố định góc phải màn hình (`fixed bottom-6 right-6 z-40`), hiện trên tất cả các trang                                      |
| **Nội dung**  | 2 nút: icon Zalo (link `https://zalo.me/[số OA]`) + icon điện thoại (`tel:[số]`), lấy số từ biến môi trường hoặc constants |
| **Component** | `components/ui/contact-fab.tsx` — Client Component (hover tooltip), render trong `app/layout.tsx`                          |
| **UX**        | Tooltip hiện khi hover ("Chat Zalo" / "Gọi ngay"); nút Zalo màu xanh Zalo (`#0068FF`), nút phone màu forest                |
| **Lưu ý**     | Số điện thoại/Zalo OA nên đặt trong `lib/constants.ts` hoặc `.env.local` để dễ thay đổi sau                                |

#### 6. Cho phép khách tự hủy booking từ `/profile`

| Tiêu chí          | Chi tiết                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Điều kiện**     | Chỉ cho hủy khi `status = "new"` (chưa được admin xác nhận) — booking đã `confirmed` không tự hủy được, phải liên hệ trực tiếp |
| **Server Action** | `cancelOwnBooking(bookingId)` — kiểm tra `user_id = auth.uid()` + `status = new` trước khi update `cancelled_at`               |
| **RLS**           | Thêm policy UPDATE trên `bookings`: `USING (user_id = auth.uid() AND status = 'new' AND cancelled_at IS NULL)`                 |
| **UX**            | Nút "Yêu cầu hủy" trong card booking ở `/profile`; `window.confirm` xác nhận trước; email thông báo admin                      |
| **Migration**     | Thêm RLS policy mới vào migration `0004` (cùng với Autofill)                                                                   |
| **Lưu ý**         | Sau khi hủy, booking vẫn hiện trong lịch sử với badge "Đã hủy" — nhất quán với hành vi admin cancel                            |

#### 7. Open Graph / SEO metadata cho trang tour

| Tiêu chí          | Chi tiết                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **Trang áp dụng** | `app/tours/[id]/page.tsx` — dùng `generateMetadata()` của Next.js                                     |
| **Tags cần có**   | `og:title` (tên tour), `og:description` (mô tả ngắn), `og:image` (ảnh tour), `og:url`, `twitter:card` |
| **Dữ liệu**       | Lấy từ `getTourBySlug()` đã có — không tốn thêm query                                                 |
| **Hiệu ứng**      | Link tour share qua Messenger/Zalo/Facebook hiện preview ảnh + tên + giá đẹp thay vì link trắng       |
| **Cũng nên làm**  | `app/page.tsx` (trang chủ) + `app/tours/page.tsx` (danh sách) — static metadata đơn giản              |
| **Lưu ý**         | `og:image` nên là URL tuyệt đối — cần `NEXT_PUBLIC_SITE_URL` trong `.env.local`                       |

---

## 💡 Kết Luận

**NewWay Tourist so với Hướng Tiên Tourist:**

- ✅ **NewWay có nền tảng tốt** (Next.js, Supabase, auth, tour management)
- ❌ **Thiếu flow đặt tour hoàn chỉnh** (Booking form → Confirmation → Email)
- 🎯 **Prioritize:** Hoàn thành Phase 1 (MVP booking flow) trong 2 tuần
- 📈 **Sau đó:** Tiếp tục Phase 2 & 3 tuỳ theo feedback từ khách

**Điểm khác biệt:**

- Hướng Tiên: Quản lý nhiều loại tour (nước ngoài, dịch vụ bổ sung) → phức tạp
- **NewWay: Focus Đà Lạt → đơn giản, dễ quản lý** ✨ Đây là lợi thế!
