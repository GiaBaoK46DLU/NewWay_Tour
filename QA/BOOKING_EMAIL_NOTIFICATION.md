# QA: Email xác nhận đặt tour & thông báo Admin

**Branch:** `feature/email-service-booking`
**Commit:** `037aefc`
**Ngày:** 2026-06-30

## 1. Chức năng đã làm

Khi khách gửi form đặt tour thành công, hệ thống tự động gửi 2 email qua **Resend**:

| Email | Người nhận | Nội dung |
|---|---|---|
| Xác nhận đặt tour | Khách hàng (email khách điền trong form) | Mã đặt tour, tên tour, địa điểm, thời lượng, ngày đi, số khách, đơn giá, ghi chú |
| Thông báo booking mới | Admin (`ADMIN_EMAIL`) | Thông tin khách (tên, email, SĐT — có link bấm gọi/mail nhanh) + chi tiết tour. Reply-to trỏ thẳng về email khách |

**Nguyên tắc quan trọng:** gửi email là **best-effort** — nếu Resend lỗi, chưa cấu hình API key, hoặc mạng timeout, **booking vẫn được lưu thành công**, hệ thống chỉ ghi log cảnh báo, không bao giờ làm hỏng luồng đặt tour.

### Files thay đổi
- `lib/email/client.ts` — gọi Resend REST API
- `lib/email/templates.ts` — 2 mẫu email HTML
- `lib/email/index.ts` — `sendBookingConfirmationEmail()`, `sendBookingNotificationEmail()`
- `lib/actions/bookings.ts` — gọi 2 hàm trên sau khi insert booking thành công
- `lib/constants.ts` — cấu hình `EMAIL_CONFIG`, `EMAIL_SUBJECTS`
- `.env.example` — template biến môi trường (không chứa secret)

### Bug đã sửa kèm theo
Việc lấy `bookingId` bằng `.select().single()` sau khi insert đã vi phạm RLS (khách ẩn danh chỉ được phép INSERT bảng `bookings`, không được SELECT) → gây lỗi `"new row violates row-level security policy"` ngay khi đặt tour. Đã sửa bằng cách tự sinh UUID (`crypto.randomUUID()`) trước khi insert, không cần đọc lại row.

---

## 2. Chuẩn bị môi trường trước khi test

Mở `.env.local` (xem mẫu ở `.env.example`), điền:

```
RESEND_API_KEY=re_xxxxxxxxxxxx     # Tạo free tại https://resend.com/api-keys
EMAIL_FROM="NewWay Tourist <onboarding@resend.dev>"   # Sandbox sender, không cần verify domain
ADMIN_EMAIL=email-nhan-thong-bao@gmail.com
```

> Nếu để trống `RESEND_API_KEY` hoặc `ADMIN_EMAIL`, hệ thống **vẫn hoạt động bình thường** (xem mục 4 — Test case 2 & 3).

Chạy server: `npm run dev`

---

## 3. Test case 1 — Happy path (có cấu hình email đầy đủ)

1. Vào `/tours`, mở 1 tour bất kỳ (VD: `/tours/tour-camping-da-lat`)
2. Điền form đặt tour: họ tên, email **thật của bạn** (để nhận mail test), SĐT hợp lệ (VD: `0912345678`), ngày đi (từ hôm nay trở đi), số khách hợp lệ (1–100)
3. Bấm "Gửi yêu cầu đặt tour"

**Kết quả mong đợi:**
- Redirect về `/tours?booking=success`
- Booking mới xuất hiện trong `/dashboard/bookings` (đăng nhập admin để xem)
- Hộp mail của **khách** (email vừa điền) nhận được mail "Đã nhận yêu cầu đặt tour ..." — kiểm tra đúng mã đặt tour, tên tour, ngày đi, số khách
- Hộp mail `ADMIN_EMAIL` nhận được mail "Booking mới: ..." — kiểm tra thông tin khách đúng, link `mailto:`/`tel:` bấm được, reply-to trỏ về email khách
- Terminal chạy `npm run dev` **không có** log lỗi `[email] ... failed`

---

## 4. Test case 2 — Thiếu `RESEND_API_KEY` (chưa cấu hình email)

1. Xoá hoặc để trống `RESEND_API_KEY` trong `.env.local`, restart `npm run dev`
2. Lặp lại bước đặt tour như Test case 1

**Kết quả mong đợi:**
- Booking **vẫn lưu thành công**, vẫn redirect `/tours?booking=success`
- Terminal log: `[email] RESEND_API_KEY is not set — skipping email send...` (2 lần — cả confirmation và notification đều bị skip vì dùng chung client gửi mail)
- Không có email nào được gửi (đúng như mong đợi)
- Không có lỗi 500 / crash trang

---

## 5. Test case 3 — Có `RESEND_API_KEY` nhưng thiếu `ADMIN_EMAIL`

1. Điền `RESEND_API_KEY` hợp lệ, để trống `ADMIN_EMAIL`, restart server
2. Đặt tour

**Kết quả mong đợi:**
- Booking thành công
- Khách **vẫn nhận được** email xác nhận
- Terminal log: `[email] ADMIN_EMAIL is not set — skipping admin booking notification.`
- Admin **không nhận** email (đúng như mong đợi)

---

## 6. Test case 4 — Email/SĐT không hợp lệ (kiểm tra validation không bị ảnh hưởng)

1. Điền email sai định dạng (VD: `abc@`) hoặc SĐT sai (VD: `123`)
2. Bấm gửi

**Kết quả mong đợi:**
- Form hiển thị lỗi validation ngay (không insert booking, không gửi email)
- Không có log liên quan đến email trong terminal (vì chưa tới bước gửi email)

---

## 7. Test case 5 — Hết chỗ tour (capacity exceeded)

1. Đặt tour với số khách lớn hơn `capacity` còn lại của tour trong cùng 1 ngày đi
2. Bấm gửi

**Kết quả mong đợi:**
- Hiển thị lỗi "Chỉ còn X chỗ trống cho ngày đi này"
- Không insert booking, không gửi email

---

## 8. Giới hạn đã biết / chưa kiểm tra

- Chưa test với Resend API key thật trong môi trường review này (không có sẵn key) — đã verify: code build/lint sạch, luồng redirect đúng, log skip đúng khi thiếu key. **QA cần tự verify Test case 1 với key thật.**
- Chưa có Confirmation Page riêng (`/tours?booking=success` hiện chưa hiển thị banner xác nhận cho người dùng) — đây là task khác, chưa nằm trong phạm vi chức năng này.
- Email gửi đồng bộ trong server action (khách phải chờ 2 email gửi xong mới redirect) — nếu Resend chậm, có thể làm chậm redirect vài giây. Chưa đo độ trễ thực tế.
