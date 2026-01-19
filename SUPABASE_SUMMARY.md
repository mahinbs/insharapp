# Supabase Integration Summary for Inshaar App

## Quick Overview

This document provides a concise summary of the Supabase integration requirements for your Inshaar influencer-business collaboration platform.

---

## 📊 Required Database Tables (11 Tables)

### Core Tables:
1. **`profiles`** - User profiles (both influencers & businesses)
2. **`offers`** - Business collaboration offers
3. **`applications`** - Influencer applications to offers
4. **`collaborations`** - Accepted collaborations with full details
5. **`conversations`** - Chat conversation threads
6. **`messages`** - Individual chat messages
7. **`reviews`** - Reviews/ratings between users
8. **`business_establishments`** - Multiple business locations
9. **`qr_codes`** - QR codes for check-ins
10. **`notifications`** - User notifications
11. **`categories`** - Offer/business categories

---

## 🔐 Authentication Flow

### For Influencers:
1. **Sign Up**: Email/Password → Creates auth user → Auto-creates profile with `user_type='influencer'`
2. **Sign In**: Email/Password → Returns session → Redirects to `/influencer/dashboard`
3. **OAuth**: Instagram/Google → Redirects to callback → Creates/links profile

### For Businesses:
1. **Sign Up**: Email/Password + Business Name → Creates auth user → Auto-creates profile with `user_type='business'`
2. **Sign In**: Email/Password → Returns session → Redirects to `/business/home`
3. **OAuth**: Instagram/Google → Redirects to callback → Creates/links profile

---

## 🔑 Key Features Per Table

### `profiles` Table
- **Purpose**: Single table for both user types
- **Key Fields**: 
  - `user_type`: 'influencer' or 'business'
  - Influencer: username, followers_count, engagement_rate, niche
  - Business: business_name, business_category, rating, total_collaborations

### `offers` Table
- **Purpose**: Business posts collaboration offers
- **Key Fields**: title, description, category, location, requirements, status
- **Relationships**: Links to `business_id` (profile)

### `applications` Table
- **Purpose**: Influencers apply to offers
- **Key Fields**: status (pending/accepted/declined), scheduled_date, scheduled_time
- **Relationships**: Links to `offer_id` and `influencer_id`

### `collaborations` Table
- **Purpose**: Tracks accepted collaborations
- **Key Fields**: 
  - Check-in: checked_in_at, is_on_time, qr_code_scanned
  - Content: content_video_url, social_media_post_url, proof_image_url
- **Relationships**: Links to application, offer, business, and influencer

### `messages` & `conversations` Tables
- **Purpose**: Chat between businesses and influencers
- **Key Features**: Real-time messaging, unread counts, message types

### `qr_codes` Table
- **Purpose**: QR codes for business check-ins
- **Key Fields**: qr_data, business_id, collaboration_id, scan_count

---

## 📝 Authentication Implementation Steps

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client
Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Update Auth Page
Modify `/app/auth/page.tsx` to:
- Use `supabase.auth.signUp()` for signup
- Use `supabase.auth.signInWithPassword()` for login
- Use `supabase.auth.signInWithOAuth()` for OAuth
- Handle user type selection (influencer/business)

---

## 🗄️ Database Setup Steps

### Step 1: Run Migration
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase_migration.sql`
3. Run the script
4. Verify all tables are created

### Step 2: Configure Storage
1. Go to Storage → Create buckets:
   - `images` (public)
   - `videos` (public)
2. Storage policies are included in migration

### Step 3: Configure Auth
1. Go to Authentication → Settings
2. Enable Email provider
3. Configure email templates
4. Enable OAuth providers (Instagram, Google) if needed

---

## 🔄 Data Flow Examples

### Business Creates Offer:
```
Business → POST /offers → Supabase → Insert into offers table → Return offer
```

### Influencer Applies:
```
Influencer → POST /applications → Supabase → Insert into applications → 
Auto-increment offer.applications_count → Return application
```

### Business Accepts Application:
```
Business → PATCH /applications/:id → Update status to 'accepted' → 
Create collaboration record → Send notification to influencer
```

### Influencer Checks In:
```
Influencer → Scan QR → POST /collaborations/:id/checkin → 
Update checked_in_at, is_on_time → Send notification to business
```

### Influencer Submits Content:
```
Influencer → Upload video/image → Supabase Storage → 
Update collaboration with URLs → Send notification to business
```

---

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only see/edit their own data
- Businesses can only manage their own offers
- Influencers can only see their own applications
- Public data (active offers) is viewable by all

### Authentication
- Email/Password authentication
- OAuth (Instagram, Google)
- Session management via Supabase
- Auto-profile creation on signup

---

## 📱 Integration Checklist

- [ ] Create Supabase project
- [ ] Run `supabase_migration.sql`
- [ ] Install `@supabase/supabase-js`
- [ ] Create `lib/supabase.ts`
- [ ] Add environment variables
- [ ] Update `/app/auth/page.tsx`
- [ ] Replace localStorage with Supabase calls
- [ ] Update all API operations
- [ ] Test authentication flows
- [ ] Test CRUD operations
- [ ] Set up file uploads (Storage)
- [ ] Configure real-time (if needed)

---

## 🚀 Next Steps

1. **Start with Authentication**: Update auth page first
2. **Migrate Data Operations**: Replace mock data with Supabase queries
3. **Add File Uploads**: Use Supabase Storage for images/videos
4. **Implement Real-time**: Use Supabase real-time for chat
5. **Add Notifications**: Use Supabase functions for push notifications

---

## 📚 Additional Resources

- Full guide: `SUPABASE_INTEGRATION_GUIDE.md`
- SQL migration: `supabase_migration.sql`
- Supabase Docs: https://supabase.com/docs

---

## 💡 Key Points to Remember

1. **Single Profile Table**: Both influencers and businesses use the same `profiles` table, differentiated by `user_type`
2. **Auto-Profile Creation**: Trigger automatically creates profile when user signs up
3. **RLS is Critical**: All tables have RLS enabled for security
4. **Storage for Files**: Use Supabase Storage buckets for images/videos
5. **Real-time Optional**: Can add real-time subscriptions for chat/notifications later

---

For detailed implementation, refer to `SUPABASE_INTEGRATION_GUIDE.md`



