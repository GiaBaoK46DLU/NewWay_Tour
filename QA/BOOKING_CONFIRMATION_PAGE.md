# QA: Trang xác nhận đặt tour (Confirmation Page) & Toast thông báo

**Branch:** `feature/email-service-booking`
**Ngày:** 2026-06-30

## 1. Chức năng đã làm

Trước đây sau khi đặt tour thành công, hệ thống redirect âm thầm về `/tours?booking=success` nhưng **trang tours không hiển thị gì** → khách không biết đã đặt thành công hay chưa.

Nay thêm:

| Thành phần | Mô tả |
|---|---|
| **Trang xác nhận** `/booking-confirmed` | Trang riêng hiển thị sau khi đặt tour thành công: icon ✓, mã đặt tour, tên tour, ngày khởi hành (định dạng tiếng Việt), số khách, nhắc kiểm tra email, 2 nút điều hướng |
| **Toast thông báo** | Hộp thông báo nhỏ trượt vào góc phải trên "Đã gửi yêu cầu đặt tour thành công!", tự ẩn sau 5 giây, có nút đóng (X). Component tái sử dụng được cho các tính năng khác |

### Files thay đổi / thêm mới
- `app/booking-confirmed/page.tsx` — **mới**: trang xác nhận (Server Component)
- `components/ui/toast.tsx` — **mới**: component Toast tái sử dụng (Client Component)
- `lib/actions/bookings.ts` — đổi đích redirect từ `/tours?booking=success` sang `/booking-confirmed?ref=...&tour=...&date=...&guests=...`
- `lib/utils.ts` — thêm `getBookingReference()` (mã đặt tour ngắn) + `formatBookingDate()` (định dạng ngày tiếng Việt), dùng chung cho cả email và trang xác nhận
- `lib/constants.ts` — thêm `BOOKING_CONFIRMATION` (đường dẫn + tên query params)
- `lib/email/templates.ts` — refactor dùng helper chung từ `utils.ts` (bỏ hàm trùng lặp)

### Lưu ý thiết kế quan trọng
Do **RLS** chặn khách ẩn danh đọc bảng `bookings` (chỉ admin được SELECT), trang xác nhận **không truy vấn lại booking từ database** mà nhận thông tin hiển thị qua **query params**. Chỉ truyền dữ liệu **không nhạy cảm** (mã đặt tour, tên tour, ngày, số khách) — **KHÔNG** truyền họ tên / email / SĐT qua URL để tránh lộ thông tin cá nhân (PII) trong lịch sử trình duyệt.

> Mã đặt tour (VD `#C969F12B`) là **8 ký tự đầu của UUID** booking, viết hoa — không phải cột riêng. Khi khách báo mã này, admin tìm booking có `id` **bắt đầu bằng** `c969f12b` trong bảng `bookings`.

---

## 2. Test case 1 — Happy path (đặt tour thành công)

1. `npm run dev`, vào `/tours`, mở 1 tour (VD `/tours/tour-camping-da-lat`)
2. Điền form đầy đủ và hợp lệ, bấm "Gửi yêu cầu đặt tour"

**Kết quả mong đợi:**
- Chuyển sang trang `/booking-confirmed?ref=XXXXXXXX&tour=...&date=...&guests=...`
- Hiển thị thẻ xác nhận: icon ✓ xanh, tiêu đề "Đã nhận yêu cầu đặt tour!", câu "Chủ tour sẽ liên hệ ... trong vòng 24 giờ"
- **Mã đặt tour** `#XXXXXXXX` hiển thị đúng (8 ký tự, viết hoa)
- Phần tóm tắt hiển thị đúng: **Tour** (tên tour), **Ngày khởi hành** (định dạng "Thứ X, dd/mm/yyyy"), **Số khách** (N người)
- **Toast** trượt vào góc phải trên: "Đã gửi yêu cầu đặt tour thành công!" và **tự biến mất sau ~5 giây**
- Có hộp nhắc "Email xác nhận ... kiểm tra cả hộp thư Spam"
- 2 nút: "Xem thêm tour khác" (→ `/tours`), "Về trang chủ" (→ `/`)

---

## 3. Test case 2 — Toast tự ẩn & nút đóng

1. Sau khi vào trang xác nhận (test case 1)
2. Quan sát toast trong ~5 giây → toast tự trượt ra và biến mất
3. Lặp lại, nhưng bấm nút **X** trên toast ngay khi nó hiện

**Kết quả mong đợi:**
- Toast tự ẩn sau ~5s nếu không tương tác
- Bấm X → toast ẩn ngay lập tức
- Thẻ xác nhận (card) **vẫn còn nguyên** sau khi toast ẩn (toast và card độc lập)

---

## 4. Test case 3 — Truy cập trực tiếp không có mã đặt tour

1. Gõ thẳng URL `http://localhost:3000/booking-confirmed` (không kèm `?ref=...`)

**Kết quả mong đợi:**
- Tự động chuyển hướng (redirect) về `/tours`
- KHÔNG hiển thị trang xác nhận rỗng / lỗi

---

## 5. Test case 4 — Truy cập với mã nhưng thiếu thông tin phụ

1. Gõ URL chỉ có ref: `http://localhost:3000/booking-confirmed?ref=TEST1234`

**Kết quả mong đợi:**
- Trang **vẫn hiển thị** thẻ xác nhận với mã `#TEST1234`
- Phần tóm tắt (Tour / Ngày / Số khách) **tự ẩn** các dòng thiếu dữ liệu, không hiển thị "undefined" hay dòng trống
- Toast vẫn xuất hiện bình thường

---

## 6. Test case 5 — Ngày hiển thị đúng múi giờ

1. Đặt tour với ngày đi cụ thể (VD chọn 15/07/2026)
2. Xem trang xác nhận

**Kết quả mong đợi:**
- Ngày hiển thị đúng **15/07/2026** (không bị lệch 1 ngày do timezone), kèm thứ trong tuần đúng (VD "Thứ Tư, 15/07/2026")

---

## 7. Test case 6 — Email & redirect vẫn liên thông

1. Đặt tour thành công (đã cấu hình `RESEND_API_KEY` + `ADMIN_EMAIL` — xem [BOOKING_EMAIL_NOTIFICATION.md](BOOKING_EMAIL_NOTIFICATION.md))
2. So sánh mã đặt tour trên trang xác nhận với mã trong email khách nhận được

**Kết quả mong đợi:**
- Mã đặt tour `#XXXXXXXX` trên trang xác nhận **trùng khớp** với "Mã đặt tour" trong email xác nhận gửi cho khách
- Booking xuất hiện trong `/dashboard/bookings`

---

## 8. Đã kiểm tra trong quá trình phát triển

- ✅ `npm run build` + `npm run lint` sạch, route `/booking-confirmed` được tạo
- ✅ Trang xác nhận render đúng (icon, mã đặt tour, tóm tắt tour/ngày/khách) — kiểm tra bằng Playwright
- ✅ Toast hiển thị đúng text, tự ẩn, có nút đóng
- ✅ Truy cập không có `ref` → redirect về `/tours`
- ✅ Full flow: form đặt tour → redirect đúng `/booking-confirmed?ref=...` với mã thật sinh từ booking
- ✅ Định dạng ngày tiếng Việt đúng múi giờ (UTC, không lệch ngày)

## 9. Giới hạn đã biết

- Trang xác nhận hiển thị thông tin từ query params, **không xác thực** mã đặt tour với database (do RLS). Nghĩa là về lý thuyết ai cũng có thể mở `/booking-confirmed?ref=BATKY` và thấy trang xác nhận với mã tùy ý — đây là trang thông báo, **không phải** trang tra cứu booking, nên không coi là lỗ hổng. Việc tra cứu booking thật vẫn nằm trong `/dashboard/bookings` (chỉ admin).
- Toast hiện chỉ dùng ở trang xác nhận. Component đã viết tổng quát (`success`/`error`, tùy chỉnh thời gian) để tái sử dụng cho các tính năng sau (VD admin cập nhật trạng thái booking).
