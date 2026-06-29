-- Migration: add username to profiles and capture it on signup.
-- Safe to re-run.

-- 1. Add username column to profiles (nullable for existing rows).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;

-- Enforce a reasonable length when present.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS username_length;
ALTER TABLE public.profiles ADD CONSTRAINT username_length
  CHECK (username IS NULL OR char_length(username) BETWEEN 2 AND 50);

-- 2. Update the new-user trigger so the username chosen at registration
--    (passed via auth metadata) is persisted into public.profiles.
--    New accounts always default to the 'user' (customer) role. An account is
--    promoted to 'admin' manually in Supabase (see supabase/promote-admin.sql).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'username', ''),
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = excluded.email,
      username = coalesce(excluded.username, public.profiles.username);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Allow users to keep their username on profile self-update (role stays 'user').
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = 'user');
