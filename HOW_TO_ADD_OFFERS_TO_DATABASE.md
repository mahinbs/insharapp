# 📝 How to Add Offers to the Database

This guide explains how to add restaurant/business offers to your Supabase database so they appear on the influencer dashboard.

## 🎯 Quick Methods

### Method 1: Create Offers from Frontend (Recommended) ⭐

**Easiest way - Use the application UI:**

1. **Log in as a Business:**
   - Go to `/auth`
   - Sign up or log in as a **Business** account
   - Complete your business profile

2. **Create an Offer:**
   - Go to `/business/post-offer` (or click "New Offer" from dashboard)
   - Fill in all the details:
     - Title: e.g., "Free 3-Course Dinner"
     - Category: Select "Restaurant"
     - Description: Describe the offer
     - Location: e.g., "Paris 75014"
     - Upload images (up to 5)
     - Set requirements
   - Click "Post Offer"

3. **Verify:**
   - Go to `/influencer/dashboard`
   - Your offer should appear in the "Near Me" section

### Method 2: Add via Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - Open your Supabase project
   - Navigate to **Table Editor** → **offers** table

2. **Insert New Row:**
   - Click **Insert** → **Insert row**
   - Fill in the fields:
     ```json
     {
       "business_id": "your-business-user-id",
       "title": "Free 3-Course Dinner",
       "description": "Experience our new seasonal menu...",
       "category": "Restaurant",
       "location": "Paris 75014",
       "service_offered": "3-course dinner for 2 people",
       "requirements": ["Minimum 10K followers", "Food niche", "Post 3 stories"],
       "status": "active",
       "main_image": "https://example.com/image.jpg",
       "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
       "business_name": "Bella Vista Restaurant",
       "business_logo": "https://example.com/logo.jpg"
     }
     ```

3. **Save:**
   - Click **Save**
   - The offer will appear on the dashboard

### Method 3: Use SQL Query

Run this in Supabase SQL Editor:

```sql
-- Insert a sample offer
INSERT INTO offers (
  business_id,
  title,
  description,
  category,
  location,
  service_offered,
  requirements,
  status,
  main_image,
  images,
  business_name,
  business_logo
) VALUES (
  'your-business-user-id-here',  -- Replace with actual business user ID
  'Free 3-Course Dinner',
  'Experience our new seasonal menu with a complimentary 3-course dinner for you and a guest.',
  'Restaurant',
  'Paris 75014',
  '3-course dinner for 2 people, complimentary drinks, chef special tasting menu',
  ARRAY['Minimum 10K followers', 'Food/Lifestyle niche', 'Post 3 Instagram stories', '1 Instagram post with tag'],
  'active',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop'
  ],
  'Bella Vista Restaurant',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
);
```

## 📋 Required Fields

### Must Have:
- `business_id` - UUID of the business user (from `auth.users` or `profiles` table)
- `title` - Offer title
- `description` - Detailed description
- `category` - One of: Restaurant, Beauty & Spa, Fashion, Fitness, Travel, Technology, Home & Garden, Entertainment
- `location` - Business location/address
- `status` - Must be `'active'` to show on dashboard

### Recommended:
- `main_image` - Primary image URL (shown on dashboard)
- `images` - Array of image URLs
- `service_offered` - What the business is offering
- `requirements` - Array of influencer requirements
- `business_name` - Business name (auto-filled if using frontend)
- `business_logo` - Business logo URL

## 🔍 Finding Your Business User ID

1. **From Supabase Dashboard:**
   - Go to **Authentication** → **Users**
   - Find your business account
   - Copy the **User UID**

2. **Or from Profiles Table:**
   - Go to **Table Editor** → **profiles**
   - Find your business profile
   - Copy the `id` field (this is the user ID)

## 🖼️ Adding Images

### Option 1: Use External URLs
- Use image URLs from Unsplash, Pexels, or your own hosting
- Example: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop`

### Option 2: Upload to Supabase Storage
1. Go to **Storage** → **images** bucket
2. Upload your images
3. Copy the **Public URL** of each image
4. Use those URLs in the `main_image` and `images` fields

## ✅ Verify Offers Are Showing

1. **Check Offer Status:**
   ```sql
   SELECT id, title, status, category FROM offers WHERE status = 'active';
   ```

2. **Check on Dashboard:**
   - Go to `/influencer/dashboard`
   - Offers should appear in:
     - "Near Me" section (first 3)
     - "Last Minute Offers" (next 3)
     - "Urgent Offers" (remaining)
     - "All Restaurants" section

3. **Troubleshooting:**
   - Ensure `status = 'active'`
   - Check that `business_id` exists in profiles table
   - Verify images are publicly accessible
   - Check browser console for errors

## 🎨 Sample Data

Here's a complete example for a restaurant offer:

```sql
INSERT INTO offers (
  business_id,
  title,
  description,
  category,
  location,
  service_offered,
  requirements,
  status,
  main_image,
  images,
  business_name,
  business_logo
) VALUES (
  (SELECT id FROM profiles WHERE user_type = 'business' LIMIT 1),
  'Weekend Brunch Package',
  'Enjoy our signature brunch menu featuring artisanal pastries, fresh coffee, and seasonal dishes. Perfect for content creators in the food and lifestyle niche.',
  'Restaurant',
  'London, UK',
  'Brunch for 2 people, complimentary mimosas, chef special pastries',
  ARRAY['Minimum 5K followers', 'Food/Lifestyle niche', 'Post 2 Instagram stories', 'Tag us in post'],
  'active',
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&h=800&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&h=800&fit=crop'
  ],
  'The Brunch Spot',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
);
```

## 💡 Tips

1. **Use High-Quality Images:** Better images = more engagement
2. **Set Main Image:** Always set `main_image` for best display
3. **Multiple Images:** Add 3-5 images for better presentation
4. **Clear Requirements:** Be specific about what you need
5. **Active Status:** Only offers with `status = 'active'` show on dashboard

## 🚨 Common Issues

### Offers Not Showing?
- ✅ Check `status = 'active'`
- ✅ Verify `business_id` exists
- ✅ Ensure images are accessible
- ✅ Check browser console for errors

### Images Not Loading?
- ✅ Use HTTPS URLs
- ✅ Verify images are publicly accessible
- ✅ Check image URLs in browser

### Wrong Business Name?
- ✅ Update `business_name` field
- ✅ Or update business profile in `profiles` table

## 📚 Related Guides

- `HOW_TO_CREATE_OFFERS.md` - Creating offers from frontend
- `HOW_TO_ADD_RESTAURANT_IMAGES.md` - Adding images to offers



