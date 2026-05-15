-- Run this file in Supabase SQL Editor.
-- It creates tables, sample data, RLS policies and a public storage bucket for tour images.

create extension if not exists "pgcrypto";

create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  location text not null,
  duration text not null,
  price integer not null check (price >= 0),
  rating numeric(2, 1) not null default 4.8,
  image_url text not null,
  itinerary text[] not null default '{}',
  included_services text[] not null default '{}',
  tour_type text not null default 'Khám phá',
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references public.tours(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  travel_date date not null,
  guests integer not null check (guests > 0),
  note text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.tours enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Public can read tours" on public.tours;
create policy "Public can read tours"
on public.tours for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can manage tours" on public.tours;
create policy "Authenticated users can manage tours"
on public.tours for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
on public.bookings for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated users can read bookings" on public.bookings;
create policy "Authenticated users can read bookings"
on public.bookings for select
to authenticated
using (true);

drop policy if exists "Authenticated users can update bookings" on public.bookings;
create policy "Authenticated users can update bookings"
on public.bookings for update
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('tour-images', 'tour-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view tour images" on storage.objects;
create policy "Public can view tour images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'tour-images');

drop policy if exists "Authenticated users can upload tour images" on storage.objects;
create policy "Authenticated users can upload tour images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'tour-images');

drop policy if exists "Authenticated users can update tour images" on storage.objects;
create policy "Authenticated users can update tour images"
on storage.objects for update
to authenticated
using (bucket_id = 'tour-images')
with check (bucket_id = 'tour-images');

delete from public.tours;

insert into public.tours
  (title, slug, description, location, duration, price, rating, image_url, itinerary, included_services, tour_type)
values
  (
    'Tour săn mây Cầu Đất',
    'tour-san-may-cau-dat',
    'Khởi hành sớm để đón bình minh trên biển mây, ghé đồi chè Cầu Đất và thưởng thức cà phê nóng giữa không khí cao nguyên.',
    'Cầu Đất',
    '1 ngày',
    690000,
    4.9,
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85',
    array['04:30 đón khách tại khách sạn trung tâm Đà Lạt', '05:30 săn mây và ngắm bình minh tại Cầu Đất', '07:30 ăn sáng, tham quan đồi chè và vườn hồng', '10:30 check-in quán cà phê view thung lũng', '12:00 trả khách tại trung tâm'],
    array['Xe đưa đón', 'Hướng dẫn viên địa phương', 'Vé tham quan', 'Nước suối'],
    'Săn mây'
  ),
  (
    'Tour Langbiang và văn hóa bản địa',
    'tour-langbiang',
    'Chinh phục nóc nhà Đà Lạt, khám phá làng nghề địa phương và thưởng thức đặc sản cao nguyên trong hành trình nhẹ nhàng.',
    'Langbiang',
    '1 ngày',
    820000,
    4.8,
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85',
    array['08:00 đón khách tại khách sạn', '09:00 tham quan khu du lịch Langbiang', '11:30 ăn trưa với món địa phương', '13:30 ghé làng văn hóa và vườn dâu', '16:30 kết thúc tour'],
    array['Xe du lịch', 'Bữa trưa', 'Vé cổng', 'Bảo hiểm du lịch'],
    'Khám phá'
  ),
  (
    'Tour thác Datanla mạo hiểm',
    'tour-thac-datanla',
    'Trải nghiệm máng trượt xuyên rừng, ngắm thác Datanla và tham gia các hoạt động ngoài trời phù hợp nhóm bạn trẻ.',
    'Thác Datanla',
    'Nửa ngày',
    550000,
    4.7,
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1400&q=85',
    array['08:30 đón khách tại trung tâm', '09:00 trải nghiệm máng trượt Datanla', '10:30 tham quan thác và chụp ảnh', '11:30 nghỉ cà phê ven rừng', '12:30 trả khách'],
    array['Xe đưa đón', 'Vé tham quan', 'Hướng dẫn viên', 'Nước suối'],
    'Mạo hiểm'
  ),
  (
    'Tour hồ Tuyền Lâm chill trong ngày',
    'tour-ho-tuyen-lam',
    'Một ngày chậm rãi bên hồ Tuyền Lâm, rừng thông và các điểm check-in yên tĩnh dành cho cặp đôi hoặc gia đình.',
    'Hồ Tuyền Lâm',
    '1 ngày',
    760000,
    4.8,
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85',
    array['08:00 đón khách', '09:00 dạo hồ Tuyền Lâm và rừng thông', '11:30 ăn trưa tại nhà hàng ven hồ', '14:00 ghé Thiền viện Trúc Lâm', '16:00 trả khách'],
    array['Xe riêng', 'Bữa trưa', 'Vé điểm tham quan', 'Hỗ trợ chụp ảnh'],
    'Nghỉ dưỡng'
  ),
  (
    'Tour city Đà Lạt 1 ngày',
    'tour-city-da-lat-1-ngay',
    'Lịch trình gọn, đẹp và đủ chất Đà Lạt với hồ Xuân Hương, nhà thờ Con Gà, quảng trường Lâm Viên và vườn hoa.',
    'Trung tâm Đà Lạt',
    '1 ngày',
    640000,
    4.6,
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
    array['08:00 đón khách', '08:30 hồ Xuân Hương và quảng trường Lâm Viên', '10:30 nhà thờ Con Gà, dinh Bảo Đại', '12:00 ăn trưa', '14:00 vườn hoa thành phố và chợ Đà Lạt'],
    array['Xe đưa đón', 'Bữa trưa', 'Vé tham quan', 'Hướng dẫn viên'],
    'City tour'
  ),
  (
    'Tour camping Đà Lạt',
    'tour-camping-da-lat',
    'Cắm trại qua đêm giữa rừng thông, tiệc BBQ, lửa trại và ngắm bình minh trong không gian cao nguyên riêng tư.',
    'Rừng thông Đà Lạt',
    '2 ngày 1 đêm',
    1490000,
    4.9,
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1400&q=85',
    array['Ngày 1: đón khách, trekking nhẹ, dựng trại', 'Ngày 1: BBQ tối và lửa trại', 'Ngày 2: ngắm bình minh, ăn sáng', 'Ngày 2: cà phê rừng thông, trả khách'],
    array['Lều trại', 'BBQ tối', 'Bữa sáng', 'Xe đưa đón', 'Hướng dẫn viên'],
    'Camping'
  );
