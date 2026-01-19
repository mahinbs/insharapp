# 📝 How to Create Offers from the Frontend

This guide explains how businesses can create collaboration offers directly from the application.

## 🎯 Overview

Businesses can create offers through the **Post New Offer** page, which allows them to:
- Fill in offer details (title, description, category, location)
- Upload restaurant/business images
- Set influencer requirements
- Set expiration dates (optional)
- Save everything to Supabase

## 🚀 How to Access

1. **From Business Dashboard:**
   - Go to `/business/home`
   - Click the **"New Offer"** button in the "Offers & Applications" section

2. **From Business Offers Page:**
   - Go to `/business/offers`
   - Click the **"+"** icon in the header

3. **Direct URL:**
   - Navigate to `/business/post-offer`

## 📋 Form Fields

### Required Fields:
- **Offer Title**: e.g., "Free 3-Course Dinner"
- **Category**: Select from dropdown (Restaurant, Beauty & Spa, Fashion, etc.)
- **Description**: Detailed description of what the influencer will receive
- **What You're Offering**: Specific service or product details
- **Location**: Business location/address
- **Influencer Requirements**: List requirements (one per line)

### Optional Fields:
- **Photos**: Upload up to 5 images (recommended for better engagement)
- **Expiration Date**: Set when the offer expires (optional)

## 🖼️ Image Upload

### Features:
- Upload up to **5 images** per offer
- Supported formats: PNG, JPG, WebP
- Max file size: 10MB per image
- Images are automatically uploaded to Supabase Storage
- First image becomes the main image shown on home page

### How it Works:
1. Click "Choose Photos" button
2. Select one or more images from your device
3. Images will show previews immediately
4. Remove images by hovering and clicking the X button
5. Images are uploaded when you submit the form

## ✅ Step-by-Step Process

1. **Fill in Basic Information:**
   ```
   Title: Free 3-Course Dinner
   Category: Restaurant
   Location: Downtown Plaza, 123 Main Street
   ```

2. **Add Description:**
   ```
   Description: Experience our new seasonal menu with a 
   complimentary 3-course dinner for you and a guest.
   ```

3. **Specify What You're Offering:**
   ```
   What You're Offering: 
   - 3-course dinner for 2 people
   - Complimentary drinks
   - Chef's special tasting menu
   ```

4. **Set Requirements:**
   ```
   Influencer Requirements:
   • Minimum 10K followers
   • Food/Lifestyle niche
   • Post 3 Instagram stories
   • 1 Instagram post with tag
   • Share experience within 7 days
   ```

5. **Upload Images:**
   - Click "Choose Photos"
   - Select restaurant photos (interior, food, ambiance)
   - Review previews
   - Remove any unwanted images

6. **Set Expiration (Optional):**
   - Select a date when the offer expires
   - Leave empty for no expiration

7. **Submit:**
   - Click "Post Offer" button
   - Wait for confirmation
   - You'll be redirected to business dashboard

## 🔒 Authentication

- You must be **logged in as a business** to create offers
- The system automatically:
  - Links the offer to your business profile
  - Uses your business name and logo
  - Sets the offer status to "active"

## 📊 After Creation

Once created, your offer will:
- ✅ Appear on the influencer dashboard (home page)
- ✅ Show in the "Near Me" section for relevant influencers
- ✅ Be searchable by category and location
- ✅ Display with your uploaded images
- ✅ Show your business name and logo

## 🐛 Troubleshooting

### "Not authenticated" Error
- Make sure you're logged in
- Verify you're logged in as a business account (not influencer)
- Try logging out and back in

### "Business profile not found" Error
- Complete your business profile setup first
- Go to `/business/profile` and fill in business details

### Images Not Uploading
- Check file size (must be under 10MB)
- Verify image format (PNG, JPG, WebP)
- Check your internet connection
- Try uploading one image at a time

### Form Not Submitting
- Check that all required fields are filled
- Verify category is selected
- Ensure description and requirements are not empty
- Check browser console for errors

## 💡 Tips

1. **Use High-Quality Images**: Better images = more applications
2. **Be Specific**: Clear requirements attract the right influencers
3. **Set Realistic Requirements**: Don't ask for too much
4. **Add Expiration**: Creates urgency and helps manage availability
5. **Update Regularly**: Keep your offers fresh and relevant

## 📱 Mobile Experience

The form is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

## 🔄 Editing Offers

Currently, offers can be created from the frontend. To edit existing offers:
- Use the Supabase dashboard
- Or implement an edit page (similar to create page)

## 📚 Related Files

- `app/business/post-offer/page.tsx` - The offer creation form
- `lib/supabase-offers.ts` - API functions for offers
- `lib/supabase-examples.ts` - Image upload utilities
- `lib/supabase-offer-images.ts` - Image management functions

## 🎨 Form Validation

The form includes:
- ✅ Required field validation
- ✅ Character limits (500 chars for descriptions)
- ✅ Image count limits (max 5)
- ✅ File type validation
- ✅ Date validation (expiration must be future date)

## 🚨 Error Handling

The form shows:
- Authentication errors
- Validation errors
- Upload errors
- Network errors

All errors are displayed in a user-friendly format at the bottom of the form.



