# QA: Lịch sử đặt tour (khách) + Chi tiết booking & Xuất CSV (admin)

**Branch:** `feature/phase2-booking-management`
**Ngày:** 2026-07-01

## 1. Chức năng đã làm

Hoàn thành nốt các mục còn lại của **Phase 2** trong `FEATURE_ANALYSIS.md`. Ba nhóm chức năng:

| Thành phần                                   | Mô tả                                                                                                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Lịch sử đặt tour** (`/profile`)            | Khách đã đăng nhập xem lại toàn bộ booking của **chính mình** (kể cả booking đã hủy), với mã đặt chỗ, tên tour, ngày đi, số khách, ghi chú, badge trạng thái |
| **Modal "Chi tiết"** (`/dashboard/bookings`) | Admin bấm xem đầy đủ thông tin 1 booking (tên, email, SĐT, tour, ngày đi, số khách, ghi chú đầy đủ, ngày tạo) mà không rời trang                             |
| **Nút "Xuất CSV"** (`/dashboard/bookings`)   | Admin tải toàn bộ danh sách booking ra file CSV mở được bằng Excel (đúng tiếng Việt) để làm báo cáo                                                          |

### Cơ chế liên kết booking ↔ tài khoản (quan trọng nhất)

Trước đây bảng `bookings` **không có** cột liên kết với tài khoản (chỉ lưu `email`), và RLS chặn mọi SELECT của khách. Nay:

- Thêm cột **`user_id`** vào `bookings` (migration `0003`).
- `createBooking()` gán `user_id = ID tài khoản` **nếu khách đang đăng nhập** lúc đặt; nếu đặt **ẩn danh** thì `user_id = NULL`.
- Thêm RLS policy **"Users can read own bookings"** (`user_id = auth.uid()`) → khách chỉ đọc được booking của chính mình.
- Liên kết bằng **`user_id`**, **KHÔNG** phải email — có chủ đích, vì dự án tắt xác nhận email nên so khớp theo email sẽ hở bảo mật.

### Files thay đổi / thêm mới

- `supabase/migrations/0003_link_bookings_to_users.sql` — **mới**: cột `user_id` + index + RLS policy
- `components/dashboard/booking-detail.tsx` — **mới**: modal chi tiết (Client Component, đóng bằng nền/X/Esc, khóa cuộn trang)
- `components/dashboard/bookings-export.tsx` — **mới**: nút Xuất CSV (build file ngay trên trình duyệt, có BOM UTF-8 cho Excel)
- `components/ui/booking-status-badge.tsx` — **mới**: badge trạng thái dùng chung
- `lib/actions/bookings.ts` — `createBooking()` gán thêm `user_id`
- `lib/tours.ts` — thêm `getUserBookings()`
- `app/profile/page.tsx` — thêm mục "Lịch sử đặt tour"
- `app/dashboard/bookings/page.tsx` — thêm nút Xuất CSV + nút Chi tiết + badge trạng thái
- `lib/constants.ts` — thêm `BOOKING_STATUS_META` (nhãn + màu trạng thái)
- `lib/utils.ts` — thêm `getBookingDisplayStatus()`
- `types/index.ts` — `Booking` thêm `user_id`, `BookingStatus`

### Lưu ý thiết kế quan trọng

- **Booking đặt khi CHƯA đăng nhập sẽ KHÔNG hiện trong lịch sử** của bất kỳ ai (`user_id = NULL`) — chỉ admin thấy ở dashboard. Đây là hành vi **đúng theo thiết kế**, không phải lỗi.
- **Badge trạng thái xử lý soft-delete:** nút "Hủy" của admin chỉ set `cancelled_at`, KHÔNG đổi cột `status`. Helper `getBookingDisplayStatus()` ưu tiên `cancelled_at` → booking bị hủy luôn hiện **"Đã hủy"** dù `status` vẫn là `new`/`confirmed`. (Lưu ý: booking đã hủy biến mất khỏi **dashboard admin** do filter `cancelled_at is null` có sẵn, nhưng **vẫn hiện** trong lịch sử của khách với nhãn "Đã hủy".)
- **Xuất CSV chạy 100% phía trình duyệt** — dùng lại dữ liệu server đã tải sẵn, không gọi thêm API. Có prepend BOM UTF-8 để Excel không lỗi font tiếng Việt, escape đúng chuẩn RFC 4180 (dấu `"`, phẩy, xuống dòng trong ghi chú).
- Modal chi tiết **không gọi thêm request** — dữ liệu đã có sẵn trong trang.

---

## 2. Chuẩn bị trước khi test

1. **🔴 BẮT BUỘC: Chạy migration `supabase/migrations/0003_link_bookings_to_users.sql` trong Supabase SQL Editor.** Chưa chạy thì lịch sử đặt tour luôn trống (cột `user_id` và RLS policy chưa tồn tại). Đặt tour vẫn hoạt động bình thường, chỉ là không lưu được `user_id`.
2. Cần **ít nhất 2 tài khoản khách** (để test bảo mật RLS ở TC7) + 1 tài khoản `role = 'admin'` (xem `supabase/promote-admin.sql`).
3. `.env.local` cấu hình Supabase như bình thường. Email (`RESEND_API_KEY`) không bắt buộc cho các test này.
4. `npm run dev`

> ⚠️ Booking cũ tạo **trước khi** chạy migration sẽ có `user_id = NULL` → không hiện trong lịch sử. Để test cần **tạo booking mới sau khi đã chạy migration và đang đăng nhập**.

---

## 3. Test case 1 — Lịch sử đặt tour hiển thị (happy path)

1. **Đăng nhập** bằng tài khoản khách (User A)
2. Vào `/tours/[bất kỳ]` → điền form đặt tour → gửi → tới trang xác nhận
3. Vào `/profile`, kéo xuống mục **"Lịch sử đặt tour"**

**Kết quả mong đợi:**

- Booking vừa tạo xuất hiện trong danh sách
- Hiển thị đúng: tên tour (bấm được, dẫn tới trang tour), **mã đặt chỗ** (VD `A1B2C3D4`), ngày đi (định dạng tiếng Việt), số khách, ngày đặt, ghi chú (nếu có)
- Badge trạng thái hiện **"Chờ xác nhận"** (màu vàng/gold)
- Số đếm "N yêu cầu" ở góc phải khớp số booking

---

## 4. Test case 2 — Booking ẩn danh KHÔNG hiện trong lịch sử

1. **Đăng xuất** hoàn toàn
2. Vào `/tours/[bất kỳ]` → đặt tour (với email bất kỳ, kể cả email trùng tài khoản User A)
3. Đăng nhập lại User A → vào `/profile`

**Kết quả mong đợi:**

- Booking vừa đặt ẩn danh **KHÔNG** xuất hiện trong lịch sử của User A (vì `user_id = NULL`)
- Admin vào `/dashboard/bookings` thì **vẫn thấy** booking này (đúng thiết kế)

---

## 5. Test case 3 — Trạng thái "Đã hủy" hiển thị đúng trong lịch sử khách

1. User A có 1 booking (từ TC1)
2. Đăng nhập **admin** → `/dashboard/bookings` → bấm **"Hủy"** booking đó → xác nhận
3. Đăng nhập lại **User A** → `/profile`

**Kết quả mong đợi:**

- Trong lịch sử của User A, booking đó **vẫn hiện** nhưng badge chuyển thành **"Đã hủy"** (màu đỏ)
- (Đối chiếu: ở dashboard admin, booking này đã **biến mất** khỏi bảng — hành vi đúng do soft-delete filter)

---

## 6. Test case 4 — Empty state (chưa có booking)

1. Đăng nhập bằng tài khoản khách **chưa từng đặt tour nào** (khi đã đăng nhập)
2. Vào `/profile`

**Kết quả mong đợi:**

- Mục "Lịch sử đặt tour" hiện khung nét đứt với dòng "Bạn chưa có yêu cầu đặt tour nào khi đăng nhập bằng tài khoản này." + nút **"Khám phá tour ngay"** dẫn tới `/tours`
- Không có số đếm "N yêu cầu"

---

## 7. Test case 5 — Modal "Chi tiết" của admin

1. Đăng nhập admin → `/dashboard/bookings`
2. Bấm nút **"Chi tiết"** ở 1 row bất kỳ

**Kết quả mong đợi:**

- Modal mở giữa màn hình, nền mờ phía sau, trang **không cuộn được** khi modal mở
- Hiển thị đầy đủ: mã đặt chỗ, badge trạng thái, họ tên, email, SĐT, tour, ngày đi, số khách, ngày tạo (có giờ), và **ghi chú đầy đủ** (không bị cắt như ngoài bảng)
- Nếu booking không có ghi chú → hiện "Khách không để lại ghi chú."
- Đóng modal được bằng **cả 3 cách**: bấm nút X, bấm ra vùng nền mờ, nhấn phím **Esc**

---

## 8. Test case 6 — Xuất CSV

1. Ở `/dashboard/bookings`, bấm nút **"Xuất CSV"** góc trên phải
2. Mở file `bookings-YYYY-MM-DD.csv` vừa tải bằng **Microsoft Excel** (hoặc Google Sheets)

**Kết quả mong đợi:**

- File tải về ngay, tên có ngày hôm nay
- 10 cột: Mã, Khách hàng, Email, Số điện thoại, Tour, Ngày đi, Số khách, Trạng thái, Ghi chú, Ngày tạo
- **Tiếng Việt hiển thị đúng** trong Excel (không bị lỗi font kiểu `TÃªn`) — nhờ BOM UTF-8
- Số dòng khớp số booking đang hiển thị trong bảng
- Cột "Trạng thái" ghi tiếng Việt ("Chờ xác nhận" / "Đã xác nhận"), không phải `new`/`confirmed`
- **Test escape:** tạo 1 booking có ghi chú chứa dấu phẩy và dấu ngoặc kép, VD: `Đi 2 người, cần xe "loại tốt"` → trong CSV ô ghi chú vẫn nguyên vẹn, không bị vỡ cột
- Nếu **chưa có booking nào** → nút "Xuất CSV" bị **disable** (mờ, không bấm được)

---

## 9. Test case 7 — Bảo mật RLS (KHÔNG xem được booking người khác) 🔒

1. User A đặt 1 booking (đã đăng nhập) → ghi lại mã đặt chỗ
2. **Đăng xuất**, đăng nhập bằng **User B** (tài khoản khác)
3. Vào `/profile` của User B

**Kết quả mong đợi:**

- Lịch sử của User B **KHÔNG** chứa booking của User A
- User B chỉ thấy booking do chính User B tạo (hoặc empty state nếu chưa có)

> Đây là test bảo mật quan trọng nhất: xác nhận RLS policy `user_id = auth.uid()` hoạt động đúng, một khách không thể đọc booking của khách khác.

---

## 10. Đã kiểm tra trong quá trình phát triển

- ✅ `npm run lint` sạch
- ✅ `npm run build` thành công (TypeScript compile không lỗi)
- ✅ **Đã test end-to-end tự động (Playwright, Chromium thật + Supabase thật)** — 3/3 pass:
  1. User A đăng ký → đăng nhập → đặt tour → thấy booking trong `/profile` với badge "Chờ xác nhận", mã đặt chỗ + ghi chú đúng
  2. User B **không** thấy booking của User A (RLS isolation)
  3. Admin: modal "Chi tiết" hiện đúng email/SĐT/ghi chú + đóng bằng Esc; nút "Xuất CSV" tải file có BOM UTF-8, đúng header + dữ liệu
- Bộ test nằm ở `e2e/phase2-booking.spec.ts`. Chạy lại: `npm run test:e2e` (cần dev server đang chạy ở `localhost:3000` + migration `0003` đã áp).

> ℹ️ Test tự động tạo 1 booking gắn nhãn `QA-E2E-<timestamp>` + 2 tài khoản `qa-e2e-a/b-*@newwaytourist.test` trong DB thật. Xóa được trong Supabase nếu muốn dọn.

---

## 11. Giới hạn đã biết

- **Booking đặt lúc chưa đăng nhập** không bao giờ vào được lịch sử của khách (user_id NULL). Chưa có tính năng "gộp booking ẩn danh theo email vào tài khoản" — cố tình bỏ qua vì lý do bảo mật (email confirmation đang tắt).
- Lịch sử đặt tour hiện **chưa phân trang** — nếu 1 khách có rất nhiều booking sẽ hiện hết trong 1 trang. Đủ dùng cho giai đoạn hiện tại.
- Khách **không thể tự hủy** booking từ `/profile` (chỉ xem). Việc hủy vẫn do admin thực hiện. Có thể bổ sung sau nếu cần.
- Xuất CSV chỉ xuất các booking **đang hiển thị** ở dashboard (đã lọc bỏ booking đã hủy). Muốn xuất cả booking đã hủy phải điều chỉnh `getBookings()` — ngoài scope.
