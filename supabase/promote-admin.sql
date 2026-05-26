-- Run after the target account has registered via /register.
-- Replace with your real admin email:
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';

-- Verify:
select id, email, role
from public.profiles
order by created_at desc;
