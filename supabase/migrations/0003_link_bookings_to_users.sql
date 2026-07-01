-- Migration: link bookings to the authenticated customer who created them.
-- This powers the "Lịch sử đặt tour" (booking history) section on /profile.
-- Safe to re-run.

-- Add a nullable user_id. Anonymous bookings (customer not logged in) keep it
-- NULL; only bookings placed while signed in are linked to an account. ON DELETE
-- SET NULL keeps the booking row for the admin even if the account is removed.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);

-- RLS: a signed-in customer can read ONLY the bookings they own (user_id equals
-- their auth uid). This widens SELECT beyond the existing admin-only policy
-- ("Admins can read bookings") without exposing other customers' rows. Matching
-- by user_id (not email) is deliberate: email confirmation is disabled on this
-- project, so an email-based rule could leak bookings to anyone who registers
-- with a victim's address.
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
CREATE POLICY "Users can read own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (user_id = auth.uid());
