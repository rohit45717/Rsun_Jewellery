-- Update product images to use local paths instead of Lovable asset URLs
-- This migration updates all product image URLs to use local files in the public folder

-- Update products to use local image paths
UPDATE public.products 
SET image_url = 
  CASE 
    WHEN image_url LIKE '%br-%' THEN '/product-bracelet.jpg'
    WHEN image_url LIKE '%nn-%' THEN '/product-necklace.jpg'
    WHEN image_url LIKE '%pn-%' THEN '/product-pendant.jpg'
    WHEN image_url LIKE '%er-%' THEN '/product-earrings.jpg'
    WHEN image_url LIKE '%ri-%' THEN '/product-ring.jpg'
    WHEN image_url LIKE '%gc-%' THEN '/product-cuff.jpg'
    ELSE image_url
  END
WHERE image_url LIKE '%__l5e%' OR image_url LIKE '%lovable%';

-- Update site content home images to use local paths
UPDATE public.site_content 
SET value = 
  CASE 
    WHEN key = 'home_hero_image' THEN '/hero.jpg'
    WHEN key = 'home_lifestyle_image' THEN '/lifestyle.jpg'
    ELSE value
  END
WHERE key IN ('home_hero_image', 'home_lifestyle_image')
AND (value LIKE '%__l5e%' OR value LIKE '%lovable%');
