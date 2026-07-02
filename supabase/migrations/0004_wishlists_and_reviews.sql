-- Migration: Phase 3 DB upgrade — wishlists (per-user favourites) + reviews
-- (public tour reviews). Run this file in the Supabase SQL Editor. Safe to re-run.
--
-- Replaces the earlier localStorage-only MVP so that:
--   * a signed-in customer's wishlist follows them across devices, and
--   * every visitor sees the same reviews written by signed-in customers.

-- ─────────────────────────────────────────────────────────────────────────────
-- WISHLISTS: one row per (user, tour) the user has saved.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishlists (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tour_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- A signed-in user can only see and manage their OWN saved tours.
DROP POLICY IF EXISTS "Users can read own wishlist" ON public.wishlists;
CREATE POLICY "Users can read own wishlist"
ON public.wishlists FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can add to own wishlist" ON public.wishlists;
CREATE POLICY "Users can add to own wishlist"
ON public.wishlists FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can remove from own wishlist" ON public.wishlists;
CREATE POLICY "Users can remove from own wishlist"
ON public.wishlists FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- REVIEWS: one review per (user, tour). Publicly readable; only the signed-in
-- author can write/update/delete their own row.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tour_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_tour_id ON public.reviews(tour_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Everyone (even anonymous visitors) can read all reviews.
DROP POLICY IF EXISTS "Public can read reviews" ON public.reviews;
CREATE POLICY "Public can read reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (true);

-- Only signed-in users can write, and only as themselves.
DROP POLICY IF EXISTS "Users can create own review" ON public.reviews;
CREATE POLICY "Users can create own review"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own review" ON public.reviews;
CREATE POLICY "Users can update own review"
ON public.reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own review" ON public.reviews;
CREATE POLICY "Users can delete own review"
ON public.reviews FOR DELETE
TO authenticated
USING (user_id = auth.uid());
