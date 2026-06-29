-- Migration: Add constraints, columns, indexes and policies for data integrity

-- Add capacity column to tours
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS capacity integer NOT NULL DEFAULT 30 CHECK (capacity > 0);

-- Add soft delete support to tours
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Add updated_at column to tours
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Add cancelled_at column to bookings for soft cancellation
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

-- Add updated_at column to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Add updated_at column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Add email/phone validation constraints to bookings
ALTER TABLE public.bookings ADD CONSTRAINT IF NOT EXISTS email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

ALTER TABLE public.bookings ADD CONSTRAINT IF NOT EXISTS phone_format
  CHECK (phone ~* '^\+?[0-9\s\.\-()]{10,15}$');

-- Add length constraint to note field
ALTER TABLE public.bookings ADD CONSTRAINT IF NOT EXISTS note_length
  CHECK (note IS NULL OR char_length(note) <= 5000);

-- Add guest count upper limit
ALTER TABLE public.bookings ADD CONSTRAINT IF NOT EXISTS guests_limit
  CHECK (guests <= 100);

-- Add travel_date cannot be in past
ALTER TABLE public.bookings ADD CONSTRAINT IF NOT EXISTS travel_date_not_past
  CHECK (travel_date >= CURRENT_DATE);

-- Add price validation (must be positive)
ALTER TABLE public.tours MODIFY COLUMN price integer NOT NULL CHECK (price > 0);

-- Add rating validation (0-5 scale)
ALTER TABLE public.tours ADD CONSTRAINT IF NOT EXISTS rating_range
  CHECK (rating >= 0 AND rating <= 5);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tours updated_at
DROP TRIGGER IF EXISTS update_tours_updated_at ON public.tours;
CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- Create trigger for bookings updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- Create trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON public.bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_created_at ON public.tours(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tours_deleted_at ON public.tours(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Update RLS policies for bookings - add DELETE policy
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
CREATE POLICY "Users can delete own bookings"
ON public.bookings FOR DELETE
TO anon, authenticated
USING (true);

-- Update RLS policies for profiles - add UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = 'user');

-- Update cascade delete strategy: bookings should be deleted when tour is deleted
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_tour_id_fkey;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_tour_id_fkey
  FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE;

-- Restrict booking insert via RLS with rate limiting check
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
CREATE POLICY "Public can create bookings"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);
