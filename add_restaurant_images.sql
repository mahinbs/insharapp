-- ============================================
-- QUICK SCRIPT: Add Restaurant Images to Offers
-- ============================================
-- This script adds sample restaurant images to offers that don't have images
-- Run this in your Supabase SQL Editor
-- ============================================

-- Update offers with sample restaurant images
-- You can replace these URLs with your own restaurant images

UPDATE offers
SET 
  main_image = CASE 
    WHEN category = 'Restaurant' THEN 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop'
    WHEN category = 'Beauty & Spa' THEN 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=800&fit=crop'
    WHEN category = 'Fashion' THEN 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop'
    WHEN category = 'Fitness' THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop'
  END,
  images = CASE 
    WHEN category = 'Restaurant' THEN ARRAY[
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop'
    ]
    WHEN category = 'Beauty & Spa' THEN ARRAY[
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop'
    ]
    WHEN category = 'Fashion' THEN ARRAY[
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop'
    ]
    WHEN category = 'Fitness' THEN ARRAY[
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=800&fit=crop'
    ]
    ELSE ARRAY[
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop'
    ]
  END,
  updated_at = NOW()
WHERE 
  (main_image IS NULL OR main_image = '')
  AND status = 'active';

-- Verify the update
SELECT 
  id,
  title,
  category,
  main_image,
  array_length(images, 1) as image_count,
  status
FROM offers
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- To add custom images, replace the URLs above with your own:
-- 
-- For Supabase Storage URLs:
-- 'https://your-project.supabase.co/storage/v1/object/public/images/user-id/filename.jpg'
--
-- For external URLs:
-- 'https://example.com/your-restaurant-image.jpg'
-- ============================================



