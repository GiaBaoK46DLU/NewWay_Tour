-- Diagnostic: find rows that would VIOLATE the new constraints in
-- 0001_add_constraints_and_columns.sql. Run this in the Supabase SQL Editor
-- BEFORE running the migration.
--
-- IMPORTANT: this is ONE query (UNION ALL) on purpose. The Supabase SQL Editor
-- only shows the result of the LAST statement when several are run together,
-- so multiple separate SELECTs would hide violations. A single query shows them
-- all at once. An empty result = all constraints are safe to add.

SELECT 'price_positive' AS violated_rule, 'tours' AS tbl, id::text AS row_id,
       'price=' || COALESCE(price::text, 'NULL') AS detail
FROM public.tours
WHERE price IS NULL OR price <= 0

UNION ALL
SELECT 'rating_range', 'tours', id::text,
       'rating=' || COALESCE(rating::text, 'NULL')
FROM public.tours
WHERE rating IS NULL OR rating < 0 OR rating > 5

UNION ALL
SELECT 'email_format', 'bookings', id::text, 'email=' || COALESCE(email, 'NULL')
FROM public.bookings
WHERE email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'

UNION ALL
SELECT 'phone_format', 'bookings', id::text, 'phone=' || COALESCE(phone, 'NULL')
FROM public.bookings
WHERE phone !~* '^\+?[0-9\s\.\-()]{10,15}$'

UNION ALL
SELECT 'note_length', 'bookings', id::text,
       'note_len=' || char_length(note)::text
FROM public.bookings
WHERE note IS NOT NULL AND char_length(note) > 5000

UNION ALL
SELECT 'guests_limit', 'bookings', id::text, 'guests=' || guests::text
FROM public.bookings
WHERE guests > 100

UNION ALL
SELECT 'orphan_tour_id', 'bookings', b.id::text,
       'tour_id=' || COALESCE(b.tour_id::text, 'NULL')
FROM public.bookings b
LEFT JOIN public.tours t ON t.id = b.tour_id
WHERE b.tour_id IS NOT NULL AND t.id IS NULL

ORDER BY violated_rule;
