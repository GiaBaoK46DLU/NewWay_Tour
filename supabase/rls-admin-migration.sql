-- Safe migration for existing projects.
-- This file updates role-based access control without resetting tours data.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email, role)
select id, email, 'user' from auth.users
on conflict (id) do update
set email = excluded.email;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid and role = 'admin'
  );
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.tours enable row level security;
alter table public.bookings enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can manage tours" on public.tours;
drop policy if exists "Admins can manage tours" on public.tours;
create policy "Admins can manage tours"
on public.tours for all
to authenticated
using ((select public.is_admin(auth.uid())))
with check ((select public.is_admin(auth.uid())));

drop policy if exists "Authenticated users can read bookings" on public.bookings;
drop policy if exists "Admins can read bookings" on public.bookings;
create policy "Admins can read bookings"
on public.bookings for select
to authenticated
using ((select public.is_admin(auth.uid())));

drop policy if exists "Authenticated users can update bookings" on public.bookings;
drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings"
on public.bookings for update
to authenticated
using ((select public.is_admin(auth.uid())))
with check ((select public.is_admin(auth.uid())));

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles for select
to authenticated
using ((select public.is_admin(auth.uid())));

drop policy if exists "Authenticated users can upload tour images" on storage.objects;
drop policy if exists "Admins can upload tour images" on storage.objects;
create policy "Admins can upload tour images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'tour-images'
  and (select public.is_admin(auth.uid()))
);

drop policy if exists "Authenticated users can update tour images" on storage.objects;
drop policy if exists "Admins can update tour images" on storage.objects;
create policy "Admins can update tour images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'tour-images'
  and (select public.is_admin(auth.uid()))
)
with check (
  bucket_id = 'tour-images'
  and (select public.is_admin(auth.uid()))
);
