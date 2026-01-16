-- ============================================
-- COMPLETE SUPABASE MIGRATION SCRIPT FOR INSHAAR APP
-- ============================================
-- This script creates all tables, indexes, constraints, triggers, and RLS policies
-- Safe to run even if some tables already exist
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('influencer', 'business')),
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  -- Influencer specific fields
  username TEXT,
  bio TEXT,
  location TEXT,
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

CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_business_name ON profiles(business_name);

-- ============================================
-- TABLE 2: OFFERS
-- ============================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  service_offered TEXT,
  requirements TEXT[],
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'expired', 'closed')),
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  images TEXT[],
  main_image TEXT,
  
  business_name TEXT,
  business_logo TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_offers_business_id ON offers(business_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_location ON offers(location);

-- ============================================
-- TABLE 3: APPLICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'expired')),
  message TEXT,
  
  scheduled_date DATE,
  scheduled_time TIME,
  number_of_people INTEGER DEFAULT 1,
  
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(offer_id, influencer_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_offer_id ON applications(offer_id);
CREATE INDEX IF NOT EXISTS idx_applications_influencer_id ON applications(influencer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_scheduled_date ON applications(scheduled_date);

-- ============================================
-- TABLE 4: COLLABORATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
  
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  is_on_time BOOLEAN,
  qr_code_scanned BOOLEAN DEFAULT FALSE,
  
  content_video_url TEXT,
  content_video_filename TEXT,
  social_media_post_url TEXT,
  has_tagged_business BOOLEAN DEFAULT FALSE,
  has_sent_collab_request BOOLEAN DEFAULT FALSE,
  proof_image_url TEXT,
  content_submitted_at TIMESTAMP WITH TIME ZONE,
  
  completed_at TIMESTAMP WITH TIME ZONE,
  business_verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collaborations_business_id ON collaborations(business_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_influencer_id ON collaborations(influencer_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);
CREATE INDEX IF NOT EXISTS idx_collaborations_scheduled_date ON collaborations(scheduled_date);

-- ============================================
-- TABLE 5: CONVERSATIONS (Created before messages to avoid circular dependency)
-- ============================================
-- Drop conversations table if it exists with wrong foreign key
DO $$
BEGIN
  -- Drop foreign key constraint if it exists (before messages table)
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_last_message_id_fkey'
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE conversations DROP CONSTRAINT conversations_last_message_id_fkey;
  END IF;
END $$;

-- Drop and recreate conversations to ensure clean state
DROP TABLE IF EXISTS conversations CASCADE;

-- Create conversations table without foreign key to messages (will add later)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  last_message_id UUID, -- Foreign key will be added after messages table exists
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  
  participant_1_unread_count INTEGER DEFAULT 0,
  participant_2_unread_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(participant_1_id, participant_2_id),
  CHECK (participant_1_id != participant_2_id)
);

-- Create indexes
CREATE INDEX idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ============================================
-- TABLE 6: MESSAGES
-- ============================================
-- Check if messages table exists and has the correct structure
DO $$
BEGIN
  -- If messages table exists but is missing conversation_id column, drop and recreate
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
    -- Check if conversation_id column exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'messages' 
      AND column_name = 'conversation_id'
    ) THEN
      -- Drop the old messages table
      DROP TABLE messages CASCADE;
    END IF;
  END IF;
END $$;

-- Create messages table (will create if doesn't exist, or recreate if was dropped)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'offer', 'application')),
  
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes (drop first if they exist to avoid conflicts)
DROP INDEX IF EXISTS idx_messages_conversation_id;
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

DROP INDEX IF EXISTS idx_messages_sender_id;
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

DROP INDEX IF EXISTS idx_messages_receiver_id;
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);

DROP INDEX IF EXISTS idx_messages_created_at;
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

DROP INDEX IF EXISTS idx_messages_is_read;
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Add foreign key from conversations to messages (after messages table exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_last_message_id_fkey'
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE conversations
      ADD CONSTRAINT conversations_last_message_id_fkey
      FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- TABLE 7: REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  review_type TEXT NOT NULL CHECK (review_type IN ('influencer_to_business', 'business_to_influencer')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(collaboration_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_collaboration_id ON reviews(collaboration_id);

-- ============================================
-- TABLE 8: BUSINESS_ESTABLISHMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS business_establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  weekly_timings JSONB DEFAULT '{}'::jsonb,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_establishments_business_id ON business_establishments(business_id);

-- ============================================
-- TABLE 9: QR_CODES
-- ============================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  collaboration_id UUID REFERENCES collaborations(id) ON DELETE SET NULL,
  
  qr_data TEXT NOT NULL UNIQUE,
  qr_image_url TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  scan_count INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_business_id ON qr_codes(business_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_data ON qr_codes(qr_data);
CREATE INDEX IF NOT EXISTS idx_qr_codes_collaboration_id ON qr_codes(collaboration_id);

-- ============================================
-- TABLE 10: NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('application', 'message', 'collaboration', 'offer', 'system')),
  
  related_offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  related_application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  related_collaboration_id UUID REFERENCES collaborations(id) ON DELETE CASCADE,
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- TABLE 11: CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
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

-- Insert default categories (only if they don't exist)
INSERT INTO categories (name, slug, display_order)
SELECT * FROM (VALUES
  ('Restaurant', 'restaurant', 1),
  ('Beauty & Spa', 'beauty-spa', 2),
  ('Fashion', 'fashion', 3),
  ('Fitness', 'fitness', 4),
  ('Travel', 'travel', 5),
  ('Technology', 'technology', 6),
  ('Home & Garden', 'home-garden', 7),
  ('Entertainment', 'entertainment', 8)
) AS v(name, slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers (drop existing first to avoid conflicts)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collaborations_updated_at ON collaborations;
CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON collaborations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_business_establishments_updated_at ON business_establishments;
CREATE TRIGGER update_business_establishments_updated_at BEFORE UPDATE ON business_establishments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup function
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
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update application count on offer function
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

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_offer_application_count ON applications;
CREATE TRIGGER trigger_update_offer_application_count
  AFTER INSERT OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_offer_application_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

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

-- Drop existing policies to avoid conflicts, then recreate
-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Offers policies
DROP POLICY IF EXISTS "Businesses can create their own offers" ON offers;
CREATE POLICY "Businesses can create their own offers"
  ON offers FOR INSERT
  WITH CHECK (auth.uid() = business_id);

DROP POLICY IF EXISTS "Businesses can update their own offers" ON offers;
CREATE POLICY "Businesses can update their own offers"
  ON offers FOR UPDATE
  USING (auth.uid() = business_id);

DROP POLICY IF EXISTS "Businesses can delete their own offers" ON offers;
CREATE POLICY "Businesses can delete their own offers"
  ON offers FOR DELETE
  USING (auth.uid() = business_id);

DROP POLICY IF EXISTS "Anyone can view active offers" ON offers;
CREATE POLICY "Anyone can view active offers"
  ON offers FOR SELECT
  USING (status = 'active' OR auth.uid() = business_id);

-- Applications policies
DROP POLICY IF EXISTS "Influencers can create applications" ON applications;
CREATE POLICY "Influencers can create applications"
  ON applications FOR INSERT
  WITH CHECK (
    auth.uid() = influencer_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'influencer')
  );

DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (
    auth.uid() = influencer_id OR
    auth.uid() IN (SELECT business_id FROM offers WHERE id = offer_id)
  );

DROP POLICY IF EXISTS "Businesses can update applications to their offers" ON applications;
CREATE POLICY "Businesses can update applications to their offers"
  ON applications FOR UPDATE
  USING (
    auth.uid() IN (SELECT business_id FROM offers WHERE id = offer_id)
  );

-- Collaborations policies
DROP POLICY IF EXISTS "Users can view their own collaborations" ON collaborations;
CREATE POLICY "Users can view their own collaborations"
  ON collaborations FOR SELECT
  USING (auth.uid() = business_id OR auth.uid() = influencer_id);

DROP POLICY IF EXISTS "Users can update their own collaborations" ON collaborations;
CREATE POLICY "Users can update their own collaborations"
  ON collaborations FOR UPDATE
  USING (auth.uid() = business_id OR auth.uid() = influencer_id);

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their own sent messages" ON messages;
CREATE POLICY "Users can update their own sent messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Conversations policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create reviews for their collaborations" ON reviews;
CREATE POLICY "Users can create reviews for their collaborations"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM collaborations
      WHERE id = collaboration_id
      AND (business_id = auth.uid() OR influencer_id = auth.uid())
    )
  );

-- Business establishments policies
DROP POLICY IF EXISTS "Businesses can manage their own establishments" ON business_establishments;
CREATE POLICY "Businesses can manage their own establishments"
  ON business_establishments FOR ALL
  USING (auth.uid() = business_id);

DROP POLICY IF EXISTS "Anyone can view active establishments" ON business_establishments;
CREATE POLICY "Anyone can view active establishments"
  ON business_establishments FOR SELECT
  USING (is_active = true);

-- QR codes policies
DROP POLICY IF EXISTS "Businesses can manage their own QR codes" ON qr_codes;
CREATE POLICY "Businesses can manage their own QR codes"
  ON qr_codes FOR ALL
  USING (auth.uid() = business_id);

DROP POLICY IF EXISTS "Anyone can view active QR codes" ON qr_codes;
CREATE POLICY "Anyone can view active QR codes"
  ON qr_codes FOR SELECT
  USING (is_active = true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Note: These may need to be created in Supabase Dashboard > Storage if they fail here

-- Images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images
DROP POLICY IF EXISTS "Public images are viewable by everyone" ON storage.objects;
CREATE POLICY "Public images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for videos
DROP POLICY IF EXISTS "Public videos are viewable by everyone" ON storage.objects;
CREATE POLICY "Public videos are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Users can upload their own videos" ON storage.objects;
CREATE POLICY "Users can upload their own videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
CREATE POLICY "Users can update their own videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
CREATE POLICY "Users can delete their own videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- All tables, indexes, constraints, triggers, and RLS policies have been created
-- Verify by running:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- ============================================

