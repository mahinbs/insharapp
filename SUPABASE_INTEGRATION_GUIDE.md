# Supabase Integration Guide for Inshaar App

## Overview
This guide provides a complete database schema and authentication setup for integrating Supabase serverless backend into your Inshaar application.

---

## 1. SUPABASE SETUP

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key
   - Service Role Key (keep secret!)

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js
```

---

## 2. DATABASE TABLES SCHEMA

### Table 1: `profiles` (User Profiles)
Stores both influencer and business user profiles.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('influencer', 'business')),
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  -- Influencer specific fields
  username TEXT,
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  niche TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  website_url TEXT,
  
  -- Business specific fields
  business_name TEXT,
  business_logo TEXT,
  business_description TEXT,
  business_category TEXT,
  business_location TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  business_website TEXT,
  business_instagram TEXT,
  business_tiktok TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_collaborations INTEGER DEFAULT 0,
  
  -- Common fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_business_name ON profiles(business_name);
```

### Table 2: `offers`
Stores collaboration offers posted by businesses.

```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  service_offered TEXT,
  requirements TEXT[],
  
  -- Offer details
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'expired', 'closed')),
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  -- Images
  images TEXT[],
  main_image TEXT,
  
  -- Business info (denormalized for performance)
  business_name TEXT,
  business_logo TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_offers_business_id ON offers(business_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_category ON offers(category);
CREATE INDEX idx_offers_created_at ON offers(created_at DESC);
CREATE INDEX idx_offers_location ON offers(location);
```

### Table 3: `applications`
Stores influencer applications to business offers.

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Application details
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'expired')),
  message TEXT,
  
  -- Booking details (if accepted)
  scheduled_date DATE,
  scheduled_time TIME,
  number_of_people INTEGER DEFAULT 1,
  
  -- Timestamps
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(offer_id, influencer_id)
);

-- Indexes
CREATE INDEX idx_applications_offer_id ON applications(offer_id);
CREATE INDEX idx_applications_influencer_id ON applications(influencer_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_scheduled_date ON applications(scheduled_date);
```

### Table 4: `collaborations`
Stores completed/accepted collaborations with full details.

```sql
CREATE TABLE collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Collaboration status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
  
  -- Visit/Check-in details
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  is_on_time BOOLEAN,
  qr_code_scanned BOOLEAN DEFAULT FALSE,
  
  -- Content submission
  content_video_url TEXT,
  content_video_filename TEXT,
  social_media_post_url TEXT,
  has_tagged_business BOOLEAN DEFAULT FALSE,
  has_sent_collab_request BOOLEAN DEFAULT FALSE,
  proof_image_url TEXT,
  content_submitted_at TIMESTAMP WITH TIME ZONE,
  
  -- Completion
  completed_at TIMESTAMP WITH TIME ZONE,
  business_verified BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_collaborations_business_id ON collaborations(business_id);
CREATE INDEX idx_collaborations_influencer_id ON collaborations(influencer_id);
CREATE INDEX idx_collaborations_status ON collaborations(status);
CREATE INDEX idx_collaborations_scheduled_date ON collaborations(scheduled_date);
```

### Table 5: `messages`
Stores chat messages between businesses and influencers.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Message content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'offer', 'application')),
  
  -- Related entities
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);
```

### Table 6: `conversations`
Manages conversation threads between users.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Last message info
  last_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  
  -- Unread counts
  participant_1_unread_count INTEGER DEFAULT 0,
  participant_2_unread_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(participant_1_id, participant_2_id),
  CHECK (participant_1_id != participant_2_id)
);

-- Indexes
CREATE INDEX idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
```

### Table 7: `reviews`
Stores reviews/ratings between users.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Review type
  review_type TEXT NOT NULL CHECK (review_type IN ('influencer_to_business', 'business_to_influencer')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(collaboration_id, reviewer_id)
);

-- Indexes
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_collaboration_id ON reviews(collaboration_id);
```

### Table 8: `business_establishments`
Stores multiple locations for businesses.

```sql
CREATE TABLE business_establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Location details
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  
  -- Location coordinates
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Timings (stored as JSONB for flexibility)
  weekly_timings JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_establishments_business_id ON business_establishments(business_id);
```

### Table 9: `qr_codes`
Stores QR codes for business check-ins.

```sql
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  collaboration_id UUID REFERENCES collaborations(id) ON DELETE SET NULL,
  
  -- QR code data
  qr_data TEXT NOT NULL UNIQUE,
  qr_image_url TEXT,
  
  -- Validity
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Usage tracking
  scan_count INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_qr_codes_business_id ON qr_codes(business_id);
CREATE INDEX idx_qr_codes_qr_data ON qr_codes(qr_data);
CREATE INDEX idx_qr_codes_collaboration_id ON qr_codes(collaboration_id);
```

### Table 10: `notifications`
Stores user notifications.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Notification content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('application', 'message', 'collaboration', 'offer', 'system')),
  
  -- Related entities
  related_offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  related_application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  related_collaboration_id UUID REFERENCES collaborations(id) ON DELETE CASCADE,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### Table 11: `categories`
Stores offer/business categories.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, display_order) VALUES
  ('Restaurant', 'restaurant', 1),
  ('Beauty & Spa', 'beauty-spa', 2),
  ('Fashion', 'fashion', 3),
  ('Fitness', 'fitness', 4),
  ('Travel', 'travel', 5),
  ('Technology', 'technology', 6),
  ('Home & Garden', 'home-garden', 7),
  ('Entertainment', 'entertainment', 8);
```

---

## 3. ROW LEVEL SECURITY (RLS) POLICIES

Enable RLS on all tables and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Offers policies
CREATE POLICY "Businesses can create their own offers"
  ON offers FOR INSERT
  WITH CHECK (auth.uid() = business_id);

CREATE POLICY "Businesses can update their own offers"
  ON offers FOR UPDATE
  USING (auth.uid() = business_id);

CREATE POLICY "Anyone can view active offers"
  ON offers FOR SELECT
  USING (status = 'active' OR auth.uid() = business_id);

-- Applications policies
CREATE POLICY "Influencers can create applications"
  ON applications FOR INSERT
  WITH CHECK (
    auth.uid() = influencer_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'influencer')
  );

CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (
    auth.uid() = influencer_id OR
    auth.uid() IN (SELECT business_id FROM offers WHERE id = offer_id)
  );

CREATE POLICY "Businesses can update applications to their offers"
  ON applications FOR UPDATE
  USING (
    auth.uid() IN (SELECT business_id FROM offers WHERE id = offer_id)
  );

-- Similar policies for other tables...
```

---

## 4. AUTHENTICATION SETUP

### Step 1: Configure Supabase Auth
1. Go to Authentication > Settings in Supabase Dashboard
2. Enable Email provider
3. Configure email templates
4. Enable OAuth providers (Instagram, Google) if needed

### Step 2: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (for API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

### Step 3: Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 5. AUTHENTICATION FLOWS

### Influencer Signup/Login

```typescript
// lib/auth.ts

// Sign up as Influencer
export async function signUpInfluencer(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: 'influencer',
        full_name: fullName
      }
    }
  })

  if (error) throw error

  // Create profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        user_type: 'influencer',
        email: data.user.email!,
        full_name: fullName
      })

    if (profileError) throw profileError
  }

  return data
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}
```

### Business Signup/Login

```typescript
// Sign up as Business
export async function signUpBusiness(
  email: string,
  password: string,
  businessName: string,
  businessCategory: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: 'business',
        business_name: businessName
      }
    }
  })

  if (error) throw error

  // Create profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        user_type: 'business',
        email: data.user.email!,
        business_name: businessName,
        business_category: businessCategory
      })

    if (profileError) throw profileError
  }

  return data
}
```

### OAuth Authentication (Instagram/Google)

```typescript
// Sign in with OAuth
export async function signInWithOAuth(provider: 'instagram' | 'google') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) throw error
  return data
}
```

---

## 6. DATABASE FUNCTIONS & TRIGGERS

### Auto-update updated_at timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... repeat for other tables
```

### Auto-create profile on signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type, full_name, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'influencer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Update application count on offer

```sql
CREATE OR REPLACE FUNCTION update_offer_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE offers
    SET applications_count = applications_count + 1
    WHERE id = NEW.offer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE offers
    SET applications_count = GREATEST(applications_count - 1, 0)
    WHERE id = OLD.offer_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_offer_application_count
  AFTER INSERT OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_offer_application_count();
```

---

## 7. STORAGE BUCKETS

Create storage buckets for file uploads:

```sql
-- Images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Storage policies
CREATE POLICY "Public images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 8. INTEGRATION CHECKLIST

- [ ] Create Supabase project
- [ ] Install @supabase/supabase-js
- [ ] Create all database tables
- [ ] Set up RLS policies
- [ ] Create database functions and triggers
- [ ] Set up storage buckets
- [ ] Configure authentication providers
- [ ] Create Supabase client utility
- [ ] Update auth pages to use Supabase
- [ ] Update API calls throughout the app
- [ ] Test authentication flows
- [ ] Test CRUD operations
- [ ] Set up real-time subscriptions (if needed)

---

## 9. NEXT STEPS

1. **Update Auth Pages**: Modify `/app/auth/page.tsx` to use Supabase auth functions
2. **Create API Routes**: Create Next.js API routes for server-side operations
3. **Update Components**: Replace localStorage with Supabase calls
4. **Add Real-time**: Use Supabase real-time for chat and notifications
5. **Add File Uploads**: Use Supabase Storage for images/videos
6. **Error Handling**: Implement proper error handling throughout
7. **Loading States**: Add loading states for async operations

---

## 10. EXAMPLE USAGE

### Creating an Offer (Business)

```typescript
const createOffer = async (offerData: {
  title: string;
  description: string;
  category: string;
  location: string;
  requirements: string[];
}) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('offers')
    .insert({
      business_id: user?.id,
      ...offerData,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Applying to an Offer (Influencer)

```typescript
const applyToOffer = async (offerId: string, message?: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('applications')
    .insert({
      offer_id: offerId,
      influencer_id: user?.id,
      message,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Fetching Offers

```typescript
const getOffers = async (filters?: {
  category?: string;
  location?: string;
  limit?: number;
}) => {
  let query = supabase
    .from('offers')
    .select(`
      *,
      profiles:business_id (
        business_name,
        business_logo,
        rating
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}
```

---

This guide provides a complete foundation for integrating Supabase into your Inshaar application. Start with authentication, then gradually migrate your data operations to use Supabase.



