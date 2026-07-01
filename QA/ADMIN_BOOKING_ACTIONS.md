# QA: Admin xác nhận / hủy booking (Action Buttons)

**Branch:** `feature/admin-booking-actions`
**Ngày:** 2026-06-30

## 1. Chức năng đã làm

Trước đây bảng `/dashboard/bookings` chỉ **hiển thị** danh sách booking, admin không có cách nào đổi trạng thái ngoài việc vào thẳng Supabase Table Editor sửa tay. Server Action `updateBookingStatus()` đã được viết sẵn từ trước nhưng **chưa từng được gọi từ UI nào** (dead code).

Nay thêm:

| Thành phần | Mô tả |
|---|---|
| **Nút "Xác nhận"** | Chỉ hiện khi `status = "new"`. Đổi `status → "confirmed"`, gửi email "Booking đã được xác nhận" cho khách |
| **Nút "Hủy"** | Luôn hiện (trừ booking đã hủy — không còn trong danh sách). Có hộp xác nhận (`window.confirm`) trước khi thực hiện. Set `cancelled_at`, gửi email "Booking đã bị hủy" cho khách |
| **Toast kết quả** | Hiện thông báo thành công/lỗi sau mỗi thao tác (tái sử dụng component `Toast` từ Phase 1) |

### Files thay đổi / thêm mới
- `components/dashboard/booking-actions.tsx` — **mới**: nút Confirm/Cancel (Client Component, gọi server action trực tiếp qua `useTransition`, không cần `<form>`)
- `app/dashboard/bookings/page.tsx` — thêm cột "Thao tác", render `<BookingActions />`
- `lib/actions/bookings.ts` — `updateBookingStatus()`: fetch thêm thông tin booking + tour trước khi update, gửi email trạng thái sau khi update thành công
- `lib/email/templates.ts` — thêm `bookingConfirmedEmail()`, `bookingCancelledEmail()`
- `lib/email/index.ts` — thêm `sendBookingStatusEmail(data, status)`
- `lib/constants.ts` — thêm `EMAIL_SUBJECTS.BOOKING_CONFIRMED` / `BOOKING_CANCELLED`

### Lưu ý thiết kế quan trọng
- **Booking đã hủy biến mất khỏi danh sách** — đây là hành vi **có sẵn từ trước** (`getBookings()` filter `cancelled_at is null`), không phải lỗi mới. Sau khi bấm "Hủy", row sẽ **không còn xuất hiện** ở lần tải lại tiếp theo. Nếu cần xem lại booking đã hủy, phải vào thẳng Supabase Table Editor.
- Gửi email là **best-effort**: nếu Resend lỗi, **trạng thái booking vẫn được cập nhật thành công**, chỉ log lỗi, không rollback.
- Admin **được phép SELECT** bảng `bookings` (khác với khách hàng ẩn danh), nên `updateBookingStatus()` lấy lại được thông tin tour (title, location, duration, price) để build email — không gặp vấn đề RLS như ở `createBooking()`.

---

## 2. Chuẩn bị trước khi test

1. Cần tài khoản có `role = 'admin'` trong bảng `profiles` (xem `supabase/promote-admin.sql`)
2. `.env.local` đã cấu hình `RESEND_API_KEY` + domain verified (xem [BOOKING_EMAIL_NOTIFICATION.md](BOOKING_EMAIL_NOTIFICATION.md)) nếu muốn test gửi email thật
3. `npm run dev`

---

## 3. Test case 1 — Xác nhận booking (happy path)

1. Đăng nhập admin → vào `/dashboard/bookings`
2. Tìm 1 booking có trạng thái `new`
3. Bấm nút **"Xác nhận"**

**Kết quả mong đợi:**
- Nút chuyển sang trạng thái loading (icon xoay) trong lúc xử lý
- Toast hiện góc phải: **"Booking đã được xác nhận."**
- Cột "Trạng thái" của row đó đổi thành `confirmed` (không cần reload trang — nhờ `revalidatePath`)
- Nút "Xác nhận" **biến mất** khỏi row đó (chỉ hiện khi status = new), chỉ còn nút "Hủy"
- Khách hàng (email trong booking) nhận được email **"Đã xác nhận: [tên tour]"**

---

## 4. Test case 2 — Hủy booking (happy path)

1. Từ 1 booking bất kỳ (status `new` hoặc `confirmed`), bấm nút **"Hủy"**

**Kết quả mong đợi:**
- Hộp thoại xác nhận của trình duyệt hiện ra: *"Hủy booking này? Khách sẽ nhận email thông báo."*
- Nếu bấm **Cancel** trên hộp thoại đó → **không có gì xảy ra**, booking giữ nguyên
- Nếu bấm **OK**:
  - Toast hiện: **"Booking đã được hủy."**
  - Reload lại `/dashboard/bookings` → **row này không còn xuất hiện trong danh sách** (đây là hành vi đúng, do soft-delete filter có sẵn)
  - Khách hàng nhận được email **"Đã hủy: [tên tour]"**

---

## 5. Test case 3 — Trạng thái loading & chống double-click

1. Bấm "Xác nhận" hoặc "Hủy", **bấm liên tục nhiều lần** trong lúc đang xử lý

**Kết quả mong đợi:**
- Cả 2 nút bị **disable** (không bấm được) trong lúc đang xử lý (`isPending`)
- Chỉ có **1 lần** cập nhật trạng thái được thực hiện, không bị gọi server action nhiều lần

---

## 6. Test case 4 — Lỗi khi cập nhật (booking ID không hợp lệ)

Không có cách tạo trực tiếp từ UI (button luôn truyền đúng `booking.id` từ DB), nhưng về mặt code: `updateBookingStatus()` validate UUID trước khi update — nếu bookingId sai định dạng, trả về lỗi `"ID booking không hợp lệ."` mà không động vào DB. Test này chỉ cần xác nhận qua code review, không cần thao tác UI.

---

## 7. Test case 5 — Email vẫn gửi đúng nội dung

1. Sau Test case 1 (confirm) và Test case 2 (cancel), kiểm tra hộp mail của khách

**Kết quả mong đợi:**
- Email "Đã xác nhận: ..." có tiêu đề thân thiện, lời chào theo tên khách, bảng chi tiết tour đầy đủ (tour, địa điểm, ngày, số khách, giá)
- Email "Đã hủy: ..." có nội dung xin lỗi + chi tiết booking đã hủy + gợi ý liên hệ nếu là nhầm lẫn
- Cả 2 email **khác nội dung rõ ràng** với email "Đã nhận yêu cầu đặt tour" gốc (Phase 1) — không bị nhầm lẫn giữa 3 loại email

---

## 8. Đã kiểm tra trong quá trình phát triển (Playwright, end-to-end thật)

- ✅ `npm run build` + `npm run lint` sạch
- ✅ Tạo 1 tài khoản test, promote admin qua SQL, login thành công, vào được `/dashboard/bookings`
- ✅ Tạo booking thật → bấm "Xác nhận" → toast đúng "Booking đã được xác nhận." → cột trạng thái đổi `new → confirmed` ngay lập tức (không cần F5)
- ✅ Bấm "Hủy" → dialog xác nhận tự động accept → reload lại danh sách → **row biến mất đúng như thiết kế**
- ✅ Cả 2 lần gọi `updateBookingStatus()` chạy thành công (log server: `updateBookingStatus("...", "confirmed")` và `("...", "cancelled")`, không có lỗi `[email]` nào) → email gửi qua Resend thật không lỗi

## 9. Giới hạn đã biết

- Chưa có trang "Lịch sử booking đã hủy" cho admin xem lại — hiện chỉ Supabase Table Editor mới xem được (đây là tính năng riêng, chưa nằm trong scope).
- Chưa có modal "Xem chi tiết booking" riêng (mục 1 trong Phase 2 gốc) — bảng hiện đã hiển thị gần như đầy đủ thông tin nên độ ưu tiên thấp, để task sau nếu cần.
- Nút "Gửi lại email xác nhận" thủ công (phòng trường hợp email tự động lúc tạo booking bị lỗi/không tới) — chưa làm, có thể bổ sung sau.
