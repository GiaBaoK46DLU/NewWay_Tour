# BÁO CÁO ĐỒ ÁN CUỐI KỲ

**Đề tài:** Xây dựng website đặt tour du lịch Đà Lạt NewWay Tourist  
**Môn học:** Các công nghệ mới trong phát triển phần mềm  
**Lớp:** CTK46-PM  
**Sinh viên thực hiện:** [Điền họ và tên]  
**Mã sinh viên:** [Điền mã sinh viên]  
**Giảng viên hướng dẫn:** [Điền tên giảng viên]  
**Ngày hoàn thiện:** 26/05/2026  

---PAGE---

# MỤC LỤC

1. Giới thiệu đề tài
2. Công nghệ sử dụng
3. Kiến trúc hệ thống
4. Thiết kế cơ sở dữ liệu
5. Phân tích chức năng
6. Phân quyền và Row Level Security
7. Giao diện người dùng
8. Docker và triển khai
9. Kiểm thử và đánh giá
10. AI trong quá trình phát triển
11. Kết luận và hướng phát triển
12. Tài liệu tham khảo
13. Phụ lục

Ghi chú: Sau khi chỉnh sửa thông tin cá nhân và chèn hình minh họa, có thể dùng chức năng References > Table of Contents trong Microsoft Word để tạo mục lục tự động.

---PAGE---

# 1. GIỚI THIỆU ĐỀ TÀI

NewWay Tourist là website đặt tour du lịch Đà Lạt được xây dựng dưới dạng ứng dụng web full-stack. Đề tài mô phỏng nhu cầu thực tế của một đơn vị du lịch địa phương: giới thiệu tour, hỗ trợ khách hàng tìm kiếm tour phù hợp, tiếp nhận yêu cầu đặt tour và cung cấp khu vực quản trị để nhân sự nội bộ cập nhật dữ liệu tour.

Đà Lạt là điểm đến có nhiều trải nghiệm nổi bật như săn mây Cầu Đất, khám phá Langbiang, tham quan thác Datanla, hồ Tuyền Lâm, hồ Xuân Hương và các tour cắm trại. Vì vậy, website cần tạo cảm giác du lịch thiên nhiên, hiện đại và đáng tin cậy ở phần giao diện công khai. Đồng thời, phần dashboard cần rõ ràng, dễ thao tác để người quản trị thêm, sửa, xóa tour và xem booking.

Mục tiêu kỹ thuật của đồ án là vận dụng Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, Supabase Database, Supabase Storage, Supabase RLS và Docker để tạo một sản phẩm hoàn chỉnh. Ứng dụng có khả năng chạy local, chạy bằng Docker Compose và đã được triển khai public với domain HTTPS.

Phạm vi nghiệp vụ của đồ án gồm: người dùng xem trang chủ, xem danh sách tour, lọc tour, xem chi tiết tour, gửi yêu cầu booking; admin đăng nhập, truy cập dashboard, quản lý tour, upload ảnh tour và xem booking. Các chức năng như thanh toán trực tuyến, gửi email tự động, quản lý số ghế theo lịch khởi hành và thống kê doanh thu chưa nằm trong phạm vi hiện tại.

| Thông tin | Nội dung |
|---|---|
| Tên sản phẩm | NewWay Tourist |
| Loại ứng dụng | Website đặt tour du lịch Đà Lạt |
| Frontend | Next.js App Router, TypeScript, Tailwind CSS |
| Backend | Supabase Auth, Database, Storage, RLS |
| Repository | https://github.com/GiaBaoK46DLU/NewWay_Tour.git |
| Demo production | https://dalattour.giabaodalat.id.vn/ |

---PAGE---

# 2. CÔNG NGHỆ SỬ DỤNG

Next.js App Router được sử dụng làm nền tảng chính. App Router giúp tổ chức route theo thư mục trong `app/`, hỗ trợ Server Components, Client Components, dynamic route và Server Actions. Trong dự án, các route chính gồm `/`, `/tours`, `/tours/[id]`, `/destinations`, `/blog`, `/login`, `/register`, `/dashboard`, `/dashboard/tours` và `/dashboard/bookings`.

TypeScript được sử dụng để định nghĩa kiểu dữ liệu và giảm lỗi trong quá trình phát triển. Các kiểu như Tour, Destination, BlogPost và Booking được đặt trong thư mục `types/`. Việc có type rõ ràng giúp form, card, page và server action truyền dữ liệu nhất quán.

Tailwind CSS được dùng để xây dựng giao diện responsive. Website sử dụng nhóm màu xanh lá đậm, kem, trắng và vàng nhẹ để phù hợp với cảm giác du lịch thiên nhiên, cao cấp, gắn với Đà Lạt. Các component giao diện được chia nhỏ để dễ bảo trì, gồm Header, Footer, HeroSection, SearchBox, TourCard, DestinationCard, BlogCard và TestimonialSection.

Supabase đóng vai trò backend-as-a-service. Supabase Auth xử lý đăng ký, đăng nhập và đăng xuất. Supabase Database lưu bảng `tours`, `bookings`, `profiles`. Supabase Storage lưu ảnh tour trong bucket `tour-images`. Supabase RLS được dùng để phân quyền giữa admin và user thường ở tầng database.

Docker được dùng để đóng gói ứng dụng. Dockerfile multi-stage giúp cài dependencies, build ứng dụng Next.js và chạy production bằng output standalone. docker-compose.yml giúp chạy ứng dụng bằng một lệnh, phù hợp khi demo hoặc triển khai trên VPS.

| Công nghệ | Vai trò |
|---|---|
| Next.js App Router | Xây dựng route, server rendering, Server Actions |
| TypeScript | Tăng an toàn kiểu dữ liệu |
| Tailwind CSS | Xây dựng giao diện responsive |
| Supabase Auth | Đăng ký, đăng nhập, đăng xuất |
| Supabase Database | Lưu tour, booking, profile |
| Supabase Storage | Upload ảnh tour |
| Supabase RLS | Phân quyền dữ liệu |
| Docker | Đóng gói và chạy production |

---PAGE---

# 3. KIẾN TRÚC HỆ THỐNG

Hệ thống được thiết kế theo mô hình Next.js full-stack kết hợp Supabase. Trình duyệt gửi request đến ứng dụng Next.js. Với các trang public, Next.js render giao diện và lấy dữ liệu tour từ Supabase hoặc dữ liệu mẫu khi chưa cấu hình backend. Khi người dùng gửi form booking hoặc admin thao tác CRUD tour, Server Actions chạy ở phía server sẽ gọi Supabase để ghi dữ liệu.

Dự án không dùng custom backend như Express.js hoặc NestJS. Các chức năng backend như xác thực, truy vấn database, lưu file và phân quyền được giao cho Supabase. Cách tiếp cận này phù hợp với yêu cầu môn học vì vẫn thể hiện đầy đủ kiến thức full-stack nhưng giảm độ phức tạp hạ tầng.

Cấu trúc thư mục được chia theo trách nhiệm rõ ràng. `app/` chứa route và page. `components/` chứa giao diện tái sử dụng. `lib/` chứa Supabase client, action, auth helper và hàm truy vấn. `supabase/` chứa schema, migration RLS và script nâng quyền admin. `types/` chứa định nghĩa TypeScript.

Luồng xem tour: người dùng vào `/tours`, TourCard hiển thị dữ liệu và link đến `/tours/[id]`. Trang chi tiết gọi `getTourBySlug()` để lấy tour theo slug. Người dùng gửi form booking, Server Action `createBooking()` insert dữ liệu vào bảng `bookings`.

Luồng quản trị: admin đăng nhập qua Supabase Auth. Dashboard layout gọi `requireAdmin()` để kiểm tra role trong `profiles`. Các action `createTour`, `updateTour`, `deleteTour` cũng kiểm tra `requireAdmin()` trước khi thao tác. Database tiếp tục kiểm tra RLS bằng hàm `is_admin(auth.uid())`.

| Lớp | Thành phần | Mô tả |
|---|---|---|
| Presentation | app/, components/ | Page, layout, card, form |
| Application logic | lib/actions, lib/auth, lib/tours | Auth flow, CRUD, booking, role check |
| Backend service | Supabase | Auth, Database, Storage, RLS |
| Deployment | Docker, domain HTTPS | Đóng gói và chạy production |

---PAGE---

# 4. THIẾT KẾ CƠ SỞ DỮ LIỆU

Cơ sở dữ liệu được thiết kế trên PostgreSQL thông qua Supabase. Các bảng chính gồm `tours`, `bookings` và `profiles`. Bảng `tours` lưu dữ liệu tour du lịch. Bảng `bookings` lưu yêu cầu đặt tour của khách hàng. Bảng `profiles` mở rộng thông tin người dùng Supabase Auth và lưu role để phân quyền.

| Bảng | Mục đích | Trường chính |
|---|---|---|
| tours | Lưu thông tin tour | id, title, slug, description, location, duration, price, rating, image_url, itinerary, included_services, tour_type |
| bookings | Lưu yêu cầu đặt tour | id, tour_id, full_name, email, phone, travel_date, guests, note, status |
| profiles | Lưu role người dùng | id, email, role, created_at |

Quan hệ dữ liệu gồm: `bookings.tour_id` tham chiếu `tours.id`; `profiles.id` tham chiếu `auth.users.id`. Khi một user mới được tạo trong Supabase Auth, trigger `handle_new_user()` tự động insert một profile với role mặc định là `user`. Admin được cấp quyền bằng script `promote-admin.sql` sau khi tài khoản đã đăng ký.

Trường `slug` trong `tours` có unique constraint để hỗ trợ URL thân thiện như `/tours/tour-san-may-cau-dat`. Trường `itinerary` và `included_services` dùng kiểu `text[]`, phù hợp với dữ liệu dạng danh sách lịch trình và dịch vụ bao gồm. Trường `status` của booking có các giá trị `new`, `confirmed`, `cancelled` để chuẩn bị cho quản lý trạng thái booking.

ERD có thể mô tả bằng chữ như sau: `auth.users` quan hệ 1-1 với `profiles`; `tours` quan hệ 1-n với `bookings`. User không bắt buộc đăng nhập để gửi booking vì website du lịch thường cần form tư vấn nhanh cho khách vãng lai. Tuy nhiên, chỉ admin mới được đọc danh sách booking trong dashboard.

---PAGE---

# 5. PHÂN TÍCH CHỨC NĂNG

Trang chủ là landing page chính. Trang này có hero section lớn, CTA, form tìm kiếm/filter tour, danh sách tour nổi bật, điểm đến nổi bật, lý do chọn dịch vụ, đánh giá khách hàng, blog và footer. Mục tiêu của trang chủ là tạo ấn tượng chuyên nghiệp và dẫn người dùng đến trang tour.

Trang `/tours` hiển thị danh sách tour. Người dùng có thể tìm theo điểm đến, loại tour và khoảng giá. Mỗi tour được hiển thị bằng card gồm ảnh, tên, địa điểm, thời lượng, rating, giá và nút xem chi tiết.

Trang `/tours/[id]` hiển thị chi tiết tour theo slug. Nội dung gồm ảnh lớn, tên tour, địa điểm, thời lượng, rating, mô tả, lịch trình, dịch vụ bao gồm, giá và form booking. Form booking gọi Server Action `createBooking()` để lưu vào bảng `bookings`.

Trang `/login` và `/register` dùng Supabase Auth. Sau khi đăng nhập, hệ thống kiểm tra role trong bảng `profiles`. Nếu role là `admin`, người dùng được vào dashboard. Nếu role là `user`, người dùng được chuyển về trang chủ và không có quyền quản trị.

Dashboard gồm `/dashboard`, `/dashboard/tours` và `/dashboard/bookings`. Dashboard tổng quan hiển thị số tour và booking. Trang quản lý tour cho phép thêm, sửa, xóa tour và upload ảnh. Trang booking hiển thị danh sách yêu cầu đặt tour từ khách hàng.

| Route | Chức năng |
|---|---|
| / | Landing page |
| /tours | Danh sách tour và filter |
| /tours/[id] | Chi tiết tour và form booking |
| /destinations | Điểm đến nổi bật |
| /blog | Blog du lịch |
| /login | Đăng nhập |
| /register | Đăng ký |
| /dashboard | Tổng quan admin |
| /dashboard/tours | CRUD tour và upload ảnh |
| /dashboard/bookings | Xem booking |

---PAGE---

# 6. PHÂN QUYỀN VÀ ROW LEVEL SECURITY

Phân quyền được triển khai ở hai tầng: tầng ứng dụng và tầng database. Ở tầng ứng dụng, dashboard layout gọi `requireAdmin()` để kiểm tra user hiện tại. Các Server Actions quản trị tour cũng gọi `requireAdmin()` để tránh việc user thường gọi action trực tiếp. Ở tầng database, RLS policy chỉ cho admin quản lý tours, đọc bookings và upload ảnh tour.

Bảng `profiles` lưu role của người dùng. Khi đăng ký, user mới được tạo profile với role mặc định là `user`. Để tạo admin, người quản trị chạy script `promote-admin.sql` sau khi tài khoản đã tồn tại. Cách này tránh việc người dùng tự chọn role khi đăng ký.

Policy `Public can read tours` cho phép mọi người xem tour vì đây là dữ liệu công khai. Policy `Public can create bookings` cho phép khách gửi yêu cầu booking mà không cần đăng nhập. Các policy quản trị dùng hàm `is_admin(auth.uid())` để kiểm tra role.

Một điểm quan trọng là không cho user tự sửa role trong `profiles`. Nếu user có quyền update role, họ có thể tự nâng quyền thành admin. Vì vậy thiết kế hiện tại cho user đọc profile của mình, admin đọc profiles, còn việc nâng quyền admin được thực hiện bằng SQL có kiểm soát trong Supabase SQL Editor.

| Đối tượng | Quyền |
|---|---|
| Anonymous user | Xem tour, gửi booking |
| User role=user | Xem tour, gửi booking, không vào dashboard |
| User role=admin | Vào dashboard, CRUD tour, upload ảnh, xem booking |

Việc kết hợp kiểm tra role ở ứng dụng và RLS ở database giúp tăng độ an toàn. Nếu một request vượt qua tầng giao diện, database vẫn kiểm tra policy trước khi cho phép ghi dữ liệu.

---PAGE---

# 7. GIAO DIỆN NGƯỜI DÙNG

Giao diện công khai được thiết kế theo phong cách travel booking landing page. Trang chủ sử dụng ảnh hero lớn, tiêu đề nổi bật, CTA rõ ràng, spacing rộng và card tour có hover animation. Palette màu gồm xanh lá đậm, kem, trắng và vàng nhẹ nhằm tạo cảm giác thiên nhiên và cao cấp.

Các component được tách riêng để dễ tái sử dụng: Header, Footer, HeroSection, SearchBox, TourCard, DestinationCard, BlogCard và TestimonialSection. Việc chia component giúp code dễ bảo trì, dễ mở rộng và giảm trùng lặp.

Dashboard có giao diện thiên về vận hành: sidebar điều hướng, bảng booking, form quản lý tour, nút xóa và upload ảnh. Dashboard ưu tiên thao tác nhanh và thông tin rõ ràng thay vì hiệu ứng marketing.

Website responsive trên desktop, tablet và mobile. Header có mobile navigation. Các grid tour, destination và blog chuyển từ nhiều cột sang một cột trên màn hình nhỏ. Form tìm kiếm và form booking cũng được thiết kế dạng grid có thể co giãn.

Các màn hình nên chụp để đưa vào bản nộp cuối cùng: trang chủ, danh sách tour, chi tiết tour, form booking, login, dashboard tổng quan, quản lý tour, upload ảnh và danh sách booking.

---PAGE---

# 8. DOCKER VÀ TRIỂN KHAI

Dự án đã có Dockerfile multi-stage. Giai đoạn `deps` chạy `npm ci` để cài dependencies theo `package-lock.json`. Giai đoạn `builder` copy source và chạy `npm run build`. Giai đoạn `runner` dùng output standalone của Next.js để chạy ứng dụng production bằng `node server.js`.

File `next.config.mjs` cấu hình `output: "standalone"` để Next.js tạo thư mục `.next/standalone`. Dockerfile copy `public`, `.next/standalone` và `.next/static` vào image runner. Container chạy bằng user `nextjs` thay vì root.

`docker-compose.yml` định nghĩa service `web`, build từ Dockerfile, đọc biến môi trường từ `.env.local`, expose cổng 3000 và restart `unless-stopped`. Khi chạy `docker-compose up --build`, ứng dụng được build và phục vụ tại `http://localhost:3000`.

Dự án đã deploy public tại `https://dalattour.giabaodalat.id.vn/`. Kết quả kiểm tra HTTP cho thấy trang chủ, trang login và trang chi tiết tour trả về `200 OK` qua HTTPS. Nếu giảng viên yêu cầu đúng VPS tự quản, Dockerfile và docker-compose hiện tại có thể dùng để triển khai thêm lên VPS với Caddy hoặc Nginx reverse proxy.

| Lệnh | Mục đích |
|---|---|
| npm run build | Build ứng dụng |
| docker-compose up --build | Build và chạy container |
| docker-compose down | Dừng container |
| docker build -t newway-tourist:latest . | Build image thủ công |
| docker run --env-file .env.local -p 3000:3000 newway-tourist:latest | Chạy image thủ công |

---PAGE---

# 9. KIỂM THỬ VÀ ĐÁNH GIÁ

Trong quá trình phát triển, dự án được kiểm tra bằng `npm run lint` và `npm run build`. Lint giúp phát hiện lỗi coding style và một số lỗi phổ biến của Next.js. Build giúp xác nhận TypeScript, dynamic route, Server Components và Server Actions hoạt động ở production.

Các luồng kiểm thử chức năng cần thực hiện trước khi nộp bài gồm: đăng ký user mới, đăng nhập user thường, xác nhận user thường không vào được dashboard, nâng quyền admin, đăng nhập admin, thêm tour, sửa tour, xóa tour, upload ảnh, gửi booking từ trang chi tiết và xem booking trong dashboard.

| Test case | Kết quả mong đợi |
|---|---|
| Anonymous mở trang chủ | Trang chủ hiển thị bình thường |
| Anonymous xem chi tiết tour | Trang chi tiết trả về 200 OK |
| Anonymous gửi booking | Booking được lưu vào bảng bookings |
| User thường vào dashboard | Bị chuyển hướng vì không có quyền admin |
| Admin vào dashboard | Truy cập dashboard thành công |
| Admin thêm tour | Tour mới xuất hiện trong danh sách |
| Admin upload ảnh | Ảnh được lưu trong bucket tour-images |

Kết quả triển khai public đã được kiểm tra bằng HTTP request: trang chủ, trang login và trang chi tiết tour đều trả về HTTP 200 OK. Đây là bằng chứng cơ bản cho thấy ứng dụng có thể demo trực tiếp trên môi trường production.

---PAGE---

# 10. AI TRONG QUÁ TRÌNH PHÁT TRIỂN

AI được sử dụng như công cụ hỗ trợ lập trình, phân tích yêu cầu, thiết kế giao diện, tạo cấu trúc code, rà soát quy chế cuối kỳ, đề xuất Dockerfile và thiết kế RLS. AI không thay thế hoàn toàn quá trình phát triển; sinh viên vẫn cần kiểm tra code, chạy build, chạy lint, cấu hình Supabase, deploy và đánh giá kết quả.

Việc sử dụng AI giúp tăng tốc ở các bước như phác thảo kiến trúc, chia component, viết SQL policy, tạo Dockerfile và lập checklist báo cáo. Tuy nhiên, kết quả AI cần được kiểm chứng bằng công cụ thực tế như build, lint, HTTP request đến domain production và test trên Supabase.

| Prompt | Mục đích | Kết quả sử dụng |
|---|---|---|
| Code lại giao diện website theo phong cách modern travel booking landing page | Tạo UI landing page | Tạo HeroSection, SearchBox, TourCard, DestinationCard |
| Tích hợp Supabase Auth, Database, Storage | Xây dựng backend | Tạo Supabase client, actions, schema.sql |
| Hướng dẫn link dự án với Supabase | Cấu hình env và auth | Tạo .env.local, test login/register |
| Sửa lỗi 404 khi vào chi tiết tour | Debug dynamic route | Sửa params Promise trong Next.js 16 |
| Làm Dockerfile và docker-compose | Đóng gói production | Tạo Dockerfile multi-stage và docker-compose.yml |
| Chỉnh sửa RLS, phân quyền admin/user | Tăng bảo mật | Tạo profiles(role), is_admin(), policy admin-only |
| Rà soát quy chế thi cuối kỳ | Xác định phần còn thiếu | Lập checklist báo cáo, AI, Docker, deploy |

Phụ lục prompt chi tiết có thể nộp kèm báo cáo. Mỗi prompt nên ghi rõ mục đích, kết quả và phần nào của sản phẩm được tạo hoặc chỉnh sửa từ prompt đó.

---PAGE---

# 11. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

Đồ án NewWay Tourist đã xây dựng được một website du lịch Đà Lạt full-stack với giao diện hiện đại, dữ liệu tour, chi tiết tour, booking, xác thực, dashboard quản trị, CRUD tour, upload ảnh, RLS phân quyền admin/user, Dockerfile, docker-compose và domain HTTPS để demo. Sản phẩm đáp ứng các yêu cầu công nghệ cốt lõi của môn học.

Hạn chế hiện tại là nghiệp vụ booking mới ở mức gửi yêu cầu, chưa có thanh toán trực tuyến, chưa có email xác nhận tự động, chưa có quản lý lịch khởi hành chi tiết theo ngày và số chỗ còn lại. Dashboard cũng chưa có giao diện cập nhật trạng thái booking chi tiết dù database đã có trường `status`.

Hướng phát triển tiếp theo gồm: tích hợp thanh toán, gửi email tự động khi booking thành công, thêm quản lý lịch khởi hành, thêm lọc booking theo trạng thái, thêm upload nhiều ảnh cho một tour, thêm blog động từ database, thêm realtime notification khi có booking mới và triển khai VPS bằng Docker với reverse proxy.

Qua đồ án, sinh viên rèn luyện được quy trình xây dựng ứng dụng web full-stack từ phân tích yêu cầu, thiết kế UI, tổ chức code, kết nối backend-as-a-service, phân quyền dữ liệu, đóng gói Docker, deploy production và chuẩn bị báo cáo bảo vệ.

---PAGE---

# 12. TÀI LIỆU THAM KHẢO

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Docker Documentation: https://docs.docker.com/
- React Documentation: https://react.dev/
- Lucide Icons: https://lucide.dev/
- GitHub Repository: https://github.com/GiaBaoK46DLU/NewWay_Tour.git
- Production Demo: https://dalattour.giabaodalat.id.vn/

---PAGE---

# 13. PHỤ LỤC

## 13.1. Cấu trúc thư mục chính

| Thư mục/File | Mô tả |
|---|---|
| app/ | Các route App Router và page chính |
| components/ | Component giao diện tái sử dụng |
| lib/ | Supabase client, actions, auth, truy vấn dữ liệu |
| types/ | TypeScript type definitions |
| supabase/ | Schema, migration RLS, script promote admin |
| Dockerfile | Build image production |
| docker-compose.yml | Chạy ứng dụng bằng Docker Compose |

## 13.2. Lệnh chạy dự án

| Lệnh | Ý nghĩa |
|---|---|
| npm install | Cài dependencies |
| npm run dev | Chạy development server |
| npm run lint | Kiểm tra lint |
| npm run build | Build production |
| docker-compose up --build | Chạy bằng Docker Compose |

## 13.3. Checklist demo 5 phút

1. Mở domain production và giới thiệu trang chủ NewWay Tourist.
2. Vào danh sách tour, filter nhanh và mở chi tiết tour săn mây Cầu Đất.
3. Gửi một booking mẫu từ form chi tiết tour.
4. Đăng nhập bằng tài khoản admin.
5. Mở dashboard, xem thống kê và xem booking vừa gửi.
6. Thêm hoặc sửa một tour, upload ảnh tour nếu cần.
7. Giải thích ngắn về Supabase Auth, Database, Storage, RLS và Docker.

## 13.4. Nội dung cần chèn screenshot

- [Screenshot] Trang chủ production.
- [Screenshot] Danh sách tour.
- [Screenshot] Chi tiết tour và form booking.
- [Screenshot] Supabase bảng tours/bookings/profiles.
- [Screenshot] Dashboard quản trị.
- [Screenshot] Dockerfile và docker-compose.
- [Screenshot] Domain HTTPS đang chạy.

---PAGE---

## 13.5. Use case chi tiết

| Use case | Tác nhân | Tiền điều kiện | Luồng chính | Kết quả |
|---|---|---|---|---|
| Xem danh sách tour | Khách truy cập | Website hoạt động | Mở /tours, xem danh sách, dùng filter | Danh sách tour phù hợp hiển thị |
| Xem chi tiết tour | Khách truy cập | Có tour trong database | Bấm Xem chi tiết từ TourCard | Trang chi tiết tour mở bằng slug |
| Gửi booking | Khách truy cập | Tour tồn tại | Điền form họ tên, email, số điện thoại, ngày đi, số khách | Booking được lưu với status new |
| Đăng ký tài khoản | Người dùng | Supabase Auth bật Email provider | Vào /register, nhập email và mật khẩu | User được tạo trong auth.users và profiles |
| Đăng nhập admin | Admin | Tài khoản có profiles.role = admin | Vào /login, nhập email và mật khẩu | Chuyển đến /dashboard |
| Thêm tour | Admin | Đã đăng nhập admin | Vào /dashboard/tours, điền form, upload ảnh nếu có | Tour mới được lưu vào tours |
| Sửa tour | Admin | Đã đăng nhập admin và tour tồn tại | Sửa form của tour, bấm lưu | Dữ liệu tour được cập nhật |
| Xóa tour | Admin | Đã đăng nhập admin và tour tồn tại | Bấm xóa tour | Tour bị xóa khỏi database |
| Xem booking | Admin | Đã đăng nhập admin | Vào /dashboard/bookings | Danh sách booking hiển thị |

Các use case trên thể hiện đủ ba nhóm người dùng chính của hệ thống: khách chưa đăng nhập, user thường và admin. Khách chưa đăng nhập vẫn có thể xem tour và gửi yêu cầu booking, giúp giảm rào cản chuyển đổi trong website du lịch. User thường có tài khoản nhưng không có quyền quản trị. Admin là tài khoản được cấp role trong bảng profiles và là đối tượng duy nhất được thao tác dữ liệu quản trị.

Trong buổi demo, nên chọn một use case ngắn nhưng thể hiện đầy đủ stack: mở trang chủ, xem tour, gửi booking, đăng nhập admin, xem booking, thêm tour. Luồng này chứng minh được frontend, database, auth, RLS và dashboard đều hoạt động.

---PAGE---

## 13.6. Kịch bản kiểm thử chi tiết

| Mã test | Mục tiêu | Các bước | Kết quả mong đợi |
|---|---|---|---|
| TC01 | Kiểm tra trang chủ | Mở domain production | Header, hero, search box, tour nổi bật hiển thị |
| TC02 | Kiểm tra route tour | Vào /tours | Danh sách tour hiển thị, không lỗi 404 |
| TC03 | Kiểm tra chi tiết tour | Bấm tour săn mây Cầu Đất | URL /tours/tour-san-may-cau-dat trả về 200 |
| TC04 | Kiểm tra booking public | Gửi form booking | Bản ghi mới xuất hiện trong bảng bookings |
| TC05 | Kiểm tra đăng ký | Tạo tài khoản bằng /register | Tài khoản được tạo trong Supabase Auth |
| TC06 | Kiểm tra profile trigger | Sau khi đăng ký, xem bảng profiles | Profile role=user được tạo tự động |
| TC07 | Kiểm tra user thường | Login user role=user và vào /dashboard | Bị chuyển hướng, không được vào dashboard |
| TC08 | Kiểm tra admin | Promote role=admin và login | Admin vào được dashboard |
| TC09 | Kiểm tra CRUD tour | Admin thêm/sửa/xóa tour | Database tours thay đổi tương ứng |
| TC10 | Kiểm tra upload ảnh | Admin upload ảnh tour | File xuất hiện trong Storage bucket tour-images |
| TC11 | Kiểm tra RLS trực tiếp | User thường thử thao tác tours | Database từ chối do policy |
| TC12 | Kiểm tra build | Chạy npm run build | Build production thành công |
| TC13 | Kiểm tra Docker | Chạy docker-compose up --build | Container chạy tại port 3000 |

Kết quả kiểm thử cần được ghi lại bằng screenshot hoặc mô tả ngắn trong phụ lục. Đối với các test liên quan đến RLS, nên chụp bảng policies trong Supabase hoặc kết quả user thường không vào được dashboard. Đây là bằng chứng tốt khi giảng viên hỏi về phân quyền.

---PAGE---

## 13.7. Câu hỏi vấn đáp dự kiến

**Câu hỏi 1: Vì sao dùng Next.js App Router thay vì Pages Router?**  
App Router là hướng tổ chức mới của Next.js, hỗ trợ Server Components, nested layout, dynamic route và Server Actions tốt hơn. Dự án dùng App Router để tách route theo thư mục trong app/ và xử lý form bằng Server Actions.

**Câu hỏi 2: Server Actions trong dự án dùng để làm gì?**  
Server Actions được dùng cho login, register, logout, tạo booking và CRUD tour. Khi form submit, action chạy ở server và gọi Supabase client để thao tác dữ liệu.

**Câu hỏi 3: RLS là gì?**  
RLS là Row Level Security, cơ chế phân quyền ở cấp dòng dữ liệu trong PostgreSQL/Supabase. Dù user gọi request trực tiếp, database vẫn kiểm tra policy trước khi cho đọc hoặc ghi dữ liệu.

**Câu hỏi 4: Admin và user khác nhau ở đâu?**  
Role được lưu trong bảng profiles. User thường có role=user, chỉ xem tour và gửi booking. Admin có role=admin, được vào dashboard, CRUD tour, xem booking và upload ảnh.

**Câu hỏi 5: Vì sao không cho user tự sửa role?**  
Nếu user tự sửa được role, họ có thể nâng quyền thành admin. Vì vậy role chỉ được cập nhật bằng SQL có kiểm soát trong Supabase SQL Editor hoặc quy trình quản trị riêng.

**Câu hỏi 6: Dockerfile multi-stage có lợi gì?**  
Multi-stage tách giai đoạn cài dependencies, build và chạy production. Image cuối chỉ chứa phần cần thiết để chạy app, gọn hơn và phù hợp triển khai.

**Câu hỏi 7: Supabase Storage dùng để làm gì?**  
Storage lưu ảnh tour. Khi admin upload ảnh trong dashboard, file được upload vào bucket tour-images, sau đó lấy public URL lưu vào bảng tours.

**Câu hỏi 8: Hạn chế hiện tại của dự án là gì?**  
Booking mới ở mức gửi yêu cầu, chưa có thanh toán, email tự động, quản lý số chỗ theo ngày và cập nhật trạng thái booking bằng UI.

---PAGE---

## 13.8. Nội dung bổ sung cho báo cáo chính thức

Trước khi nộp, báo cáo nên được bổ sung ảnh chụp thực tế để minh chứng sản phẩm. Mỗi ảnh nên có chú thích rõ ràng. Ví dụ: “Hình 1. Trang chủ NewWay Tourist trên domain production”, “Hình 2. Dashboard quản trị tour”, “Hình 3. RLS policies trong Supabase”.

Phần triển khai nên ghi rõ môi trường thực tế. Nếu sử dụng Vercel với custom domain, cần trình bày đúng là triển khai production trên Vercel. Nếu giảng viên yêu cầu VPS, cần triển khai thêm bản VPS bằng Docker Compose và ghi lại domain, cấu hình reverse proxy, SSL. Không nên ghi VPS nếu thực tế chưa deploy VPS.

Phần AI nên trình bày trung thực: AI hỗ trợ tạo code, phân tích yêu cầu, debug và viết báo cáo; sinh viên kiểm chứng lại bằng build, lint, test domain và cấu hình Supabase. Cách trình bày này giúp tránh cảm giác phụ thuộc hoàn toàn vào AI.

Ghi chú hoàn thiện: trước khi nộp chính thức, cần thay các placeholder ở trang bìa bằng thông tin cá nhân, chèn screenshot thực tế và xuất PDF từ Microsoft Word.
