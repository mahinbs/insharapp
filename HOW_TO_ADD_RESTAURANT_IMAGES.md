# 🖼️ How to Add Restaurant Images to Home Page

This guide explains how to add restaurant images to offers that appear on the influencer dashboard (home page).

## 📋 Overview

The home page displays offers from the `offers` table in Supabase. Each offer can have:
- **`main_image`**: The primary image shown on the home page
- **`images`**: An array of additional images for the offer

## 🎯 Method 1: Add Images via Supabase Dashboard (Quick)

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **Table Editor** → **offers** table

### Step 2: Find Your Offer
1. Find the offer you want to add images to
2. Click on the row to edit it

### Step 3: Add Image URLs
1. **For `main_image` field:**
   - Paste a direct image URL (e.g., `https://example.com/restaurant.jpg`)
   - This will be the primary image shown on the home page

2. **For `images` array:**
   - Click on the `images` field
   - Add image URLs as an array: `["https://example.com/img1.jpg", "https://example.com/img2.jpg"]`
   - Or use the array editor in Supabase

### Step 4: Save
- Click **Save** to update the offer
- The images will appear on the home page immediately

## 🎯 Method 2: Upload Images to Supabase Storage (Recommended)

### Step 1: Upload Images to Storage
1. Go to **Storage** → **images** bucket in Supabase
2. Click **Upload file**
3. Select your restaurant images
4. After upload, click on each image to get the **Public URL**

### Step 2: Update Offer with Image URLs
1. Go to **Table Editor** → **offers** table
2. Edit your offer
3. Paste the public URLs in:
   - `main_image`: The primary image URL
   - `images`: Array of all image URLs

### Example:
```json
{
  "main_image": "https://your-project.supabase.co/storage/v1/object/public/images/user-id/1234567890.jpg",
  "images": [
    "https://your-project.supabase.co/storage/v1/object/public/images/user-id/1234567890.jpg",
    "https://your-project.supabase.co/storage/v1/object/public/images/user-id/1234567891.jpg"
  ]
}
```

## 🎯 Method 3: Use SQL Query (Bulk Update)

If you have multiple offers to update, you can use SQL:

```sql
-- Update a specific offer with images
UPDATE offers
SET 
  main_image = 'https://example.com/restaurant-main.jpg',
  images = ARRAY[
    'https://example.com/restaurant-main.jpg',
    'https://example.com/restaurant-interior.jpg',
    'https://example.com/restaurant-food.jpg'
  ],
  updated_at = NOW()
WHERE id = 'your-offer-id-here';

-- Update all offers in a category with default images
UPDATE offers
SET 
  main_image = 'https://example.com/default-restaurant.jpg',
  images = ARRAY['https://example.com/default-restaurant.jpg'],
  updated_at = NOW()
WHERE category = 'Restaurant' 
  AND (main_image IS NULL OR main_image = '');
```

## 🎯 Method 4: Use the API Functions (Programmatic)

You can use the provided utility functions in your code:

```typescript
import { uploadOfferImages, updateOfferImages } from '@/lib/supabase-offer-images'

// Upload images from files
const imageFiles = [file1, file2, file3] // File objects from input
const { data, error } = await uploadOfferImages(offerId, imageFiles)

// Or update with direct URLs
const { data, error } = await updateOfferImages(
  offerId,
  [
    'https://example.com/img1.jpg',
    'https://example.com/img2.jpg'
  ],
  'https://example.com/img1.jpg' // main image
)
```

## 📝 Image Requirements

### Recommended Image Specifications:
- **Format**: JPG, PNG, or WebP
- **Size**: 1200x800px or larger (will be resized automatically)
- **Aspect Ratio**: 3:2 or 16:9 works best
- **File Size**: Under 5MB per image
- **Content**: High-quality restaurant photos (interior, food, ambiance)

### Image Sources:
- Upload your own restaurant photos
- Use free stock photos from:
  - Unsplash (https://unsplash.com)
  - Pexels (https://pexels.com)
  - Pixabay (https://pixabay.com)

## 🔍 Verify Images Are Showing

1. Go to the influencer dashboard (`/influencer/dashboard`)
2. Check the "Near Me" section
3. Your offer should display with the `main_image`
4. If not showing:
   - Check browser console for errors
   - Verify the image URL is accessible
   - Ensure the offer status is `'active'`

## 🐛 Troubleshooting

### Images Not Showing?
1. **Check image URLs**: Make sure they're publicly accessible
2. **Check offer status**: Must be `'active'` to show on home page
3. **Check browser console**: Look for 404 errors or CORS issues
4. **Verify Supabase Storage**: If using storage, ensure bucket is public

### Image URLs Not Working?
- Use direct image URLs (not HTML pages)
- Ensure URLs start with `http://` or `https://`
- For Supabase Storage, use the full public URL

### Need to Update Multiple Offers?
Use the SQL method (Method 3) or create a script using the API functions.

## 💡 Tips

1. **Use High-Quality Images**: Better images = more engagement
2. **Set Main Image**: Always set `main_image` for best display
3. **Multiple Images**: Add multiple images to the `images` array for offer details page
4. **Optimize Images**: Compress images before uploading for faster loading
5. **Consistent Style**: Use similar style/quality images for all offers

## 📚 Related Files

- `lib/supabase-offer-images.ts` - Image management functions
- `lib/supabase-offers.ts` - Offer fetching functions
- `app/influencer/dashboard/page.tsx` - Home page that displays offers



