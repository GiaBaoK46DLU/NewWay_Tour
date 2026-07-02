# QA — Phase 3: UX Enhancement

Nhánh: `feature/phase2-booking-management`
Phạm vi: 3 tính năng UX — **Lọc & sắp xếp tour nâng cao**, **Wishlist (tour yêu thích)**, **Đánh giá & nhận xét (Reviews & Ratings)**.

> ⚠️ **BẮT BUỘC:** chạy `supabase/migrations/0004_wishlists_and_reviews.sql` trong Supabase
> SQL Editor trước khi test — migration tạo bảng `wishlists` + `reviews` và RLS.
>
> **Kiến trúc lưu trữ (đã nâng cấp lên DB):**
> - **Wishlist**: bảng `wishlists` (per-user), **yêu cầu đăng nhập**, đồng bộ đa thiết bị. RLS: mỗi user chỉ đọc/ghi hàng của chính mình.
> - **Reviews**: bảng `reviews`, **ai cũng đọc được** (public), **chỉ user đăng nhập mới viết**; mỗi user 1 review/tour (upsert). Tên tác giả lấy từ hồ sơ, không tin client.
> - **Lọc & sắp xếp**: thuần client (URL-driven), không phụ thuộc DB.

---

## 1. Advanced Search / Filter / Sort

**Files:** `app/tours/page.tsx`, `components/sections/tour-toolbar.tsx`, `components/cards/tour-card.tsx`

- Giữ nguyên bộ lọc cũ của `SearchBox` (điểm đến `q`, loại tour `type`, khoảng giá `price`, ngày `date`).
- Thêm **toolbar**: **Thời lượng (`duration`)** sinh từ danh sách tour, và **Sắp xếp (`sort`)** = `popular`/`price-asc`/`price-desc`/`rating`.
- Toolbar là client component, cập nhật `searchParams` qua router và **giữ nguyên các filter khác**; trang Server Component đọc lại và lọc + sắp xếp (có empty state).

**Kiểm thử tay:**
1. `/tours` → "Giá thấp → cao": các thẻ sắp giá tăng dần; URL `sort=price-asc`.
2. "Giá cao → thấp": đảo thứ tự; URL `sort=price-desc`.
3. Chọn "Thời lượng": chỉ còn tour đúng thời lượng; URL `duration=...`; filter khác vẫn giữ.

---

## 2. Wishlist (Tour yêu thích) — Supabase, per-user

**Files:** `lib/wishlist.ts` (đọc DB), `lib/actions/wishlist.ts` (toggle/remove), `components/ui/wishlist-button.tsx`, `components/sections/wishlist-grid.tsx`, `app/wishlist/page.tsx`, `components/cards/tour-card.tsx`, `app/tours/[id]/page.tsx`, header + mobile nav.

- Nút trái tim overlay trên **tour card** + nút "Lưu tour yêu thích" trên **trang chi tiết**.
- Lưu vào bảng `wishlists (user_id, tour_id)` — **đồng bộ theo tài khoản trên mọi thiết bị**.
- **Chưa đăng nhập** bấm tim → chuyển tới `/login?next=<trang hiện tại>` (đăng nhập xong quay lại).
- Trang **`/wishlist`** yêu cầu đăng nhập; liệt kê tour đã lưu (join `tours`), nút "Bỏ lưu" (xoá lạc quan) + empty state.
- **Badge đếm** trên header/mobile nav lấy từ DB (server), cập nhật khi điều hướng.

**Kiểm thử tay:**
1. Chưa đăng nhập → `/tours` → bấm tim → bị chuyển tới `/login?next=/tours`.
2. Đăng nhập → bấm tim 1 thẻ → vào `/wishlist`: thấy đúng tour, badge = 1.
3. Đăng nhập trình duyệt/máy khác cùng tài khoản → vẫn thấy tour đã lưu (đồng bộ DB).
4. "Bỏ lưu" → thẻ biến mất, về empty state.

---

## 3. Reviews & Ratings — Supabase, công khai đọc / đăng nhập mới viết

**Files:** `lib/reviews.ts` (đọc DB), `lib/actions/reviews.ts` (upsert), `components/sections/tour-reviews.tsx` (server), `components/sections/review-form.tsx` (client), `app/tours/[id]/page.tsx`

- Khối "Đánh giá & nhận xét" server-render: **mọi khách (kể cả chưa đăng nhập) đều thấy** danh sách + điểm trung bình.
- **Chỉ user đăng nhập mới viết**; chưa đăng nhập thấy lời nhắc "Đăng nhập để viết đánh giá".
- Mỗi user **1 review/tour** (unique + upsert) → gửi lại = cập nhật. Tên tác giả lấy từ hồ sơ (chống giả mạo).
- Chấm **1–5 sao** + nhận xét; validate rỗng/quá ngắn ở server action.

**Kiểm thử tay:**
1. Chưa đăng nhập vào trang tour → thấy danh sách review + lời nhắc đăng nhập (không có form).
2. Đăng nhập → chọn 4 sao, viết nhận xét → "Gửi đánh giá" → review hiện ngay, tên = username.
3. Mở trình duyệt ẩn danh vào cùng tour → **vẫn thấy review vừa tạo** (công khai).
4. Gửi nhận xét rỗng → cảnh báo, không tạo review.

---

## E2E — Playwright

**File:** `e2e/phase3-ux.spec.ts` — 7 test. **Kết quả sau khi chạy migration 0004: ✅ 7/7 passed (~44s).**
**Yêu cầu:** migration `0004` đã chạy + Supabase cấu hình trong `.env.local` + dev server (Playwright tự khởi động `npm run dev`).

| # | Test | Cần login? | Kết quả |
|---|------|-----------|---------|
| 1 | Sort giá tăng/giảm sắp xếp lại lưới | Không | ✅ |
| 2 | Lọc thời lượng thu hẹp kết quả + phản ánh URL | Không | ✅ |
| 3 | Chưa đăng nhập bấm tim → chuyển login | Không | ✅ |
| 4 | Đăng nhập: lưu tour → `/wishlist` + badge → bỏ lưu → empty | Có | ✅ |
| 5 | Khách ẩn danh thấy lời nhắc login thay vì form review | Không | ✅ |
| 6 | Đăng nhập: từ chối review rỗng + lưu review hợp lệ | Có | ✅ |
| 7 | Review hiển thị công khai cho khách ẩn danh | Không | ✅ |

Chạy: `npx playwright test e2e/phase3-ux.spec.ts`.

> 💡 Máy RAM yếu: chạy từng file (`... e2e/phase3-ux.spec.ts`) thay vì cả bộ để tránh nặng.
> Có thể đóng bớt ứng dụng khác trước khi chạy `npx playwright test`.

**Không phá tính năng cũ:** bộ Phase 2 (`e2e/phase2-booking.spec.ts`) vẫn xanh (3/3). Đã chỉnh
selector nút đặt tour trong test Phase 2 thành `"Gửi yêu cầu đặt tour"` cho cụ thể, vì trang chi
tiết giờ có thêm form review (cũng có nút submit).

**Lưu ý dữ liệu QA:** mỗi lần chạy tạo user QA mới + 1 review trên `tour-langbiang` (tích luỹ trong DB thật, giống booking QA của Phase 2).

**Chất lượng code:** `npm run lint` sạch, `npm run build` OK (route `/wishlist` build thành công).

---

## Deferred

- **Task 10 — Tour Schedules management**: cần bảng `tour_schedules` + admin CRUD.
- **Coupon/Promo Code**: cần bảng DB + luồng checkout (dự án chưa có thanh toán trực tiếp).
- **SMS/Zalo Notification** (đánh dấu *Future*): cần tích hợp nhà cung cấp SMS/Zalo OA.
