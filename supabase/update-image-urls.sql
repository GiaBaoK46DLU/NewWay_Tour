-- Point tour images at the local files in /public/images/tours/, which hold
-- real photos of the actual Da Lat landmarks (downloaded from Wikimedia Commons,
-- CC-licensed). Serving them from the app avoids Wikimedia's hotlink throttling
-- (HTTP 429). Run in the Supabase SQL Editor.
-- Matches by slug so it only touches the seeded tours and keeps all other data.

UPDATE public.tours SET image_url = '/images/tours/cau-dat.jpg'
WHERE slug = 'tour-san-may-cau-dat';

UPDATE public.tours SET image_url = '/images/tours/langbiang.jpg'
WHERE slug = 'tour-langbiang';

UPDATE public.tours SET image_url = '/images/tours/datanla.jpg'
WHERE slug = 'tour-thac-datanla';

UPDATE public.tours SET image_url = '/images/tours/tuyen-lam.jpg'
WHERE slug = 'tour-ho-tuyen-lam';

UPDATE public.tours SET image_url = '/images/tours/xuan-huong.jpg'
WHERE slug = 'tour-city-da-lat-1-ngay';

UPDATE public.tours SET image_url = '/images/tours/rung-thong.jpg'
WHERE slug = 'tour-camping-da-lat';

-- Verify:
SELECT slug, title, image_url FROM public.tours ORDER BY created_at DESC;
