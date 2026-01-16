-- ============================================
-- BUSINESS-SIDE SUPABASE MIGRATION SCRIPT
-- ============================================
-- This script ensures all tables needed for business-side functionality exist
-- It's safe to run even if tables already exist
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VERIFY/CREATE ALL BUSINESS TABLES
-- ============================================
-- Note: Most tables are already created in supabase_migration_complete.sql
-- This script verifies they exist and adds any business-specific enhancements

-- ============================================
-- TABLE: PROFILES (Business Profile Fields)
-- ============================================
-- Ensure business fields exist in profiles table
DO $$
BEGIN
  -- Add business fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_name') THEN
    ALTER TABLE profiles ADD COLUMN business_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_logo') THEN
    ALTER TABLE profiles ADD COLUMN business_logo TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_description') THEN
    ALTER TABLE profiles ADD COLUMN business_description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_category') THEN
    ALTER TABLE profiles ADD COLUMN business_category TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_location') THEN
    ALTER TABLE profiles ADD COLUMN business_location TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_address') THEN
    ALTER TABLE profiles ADD COLUMN business_address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_phone') THEN
    ALTER TABLE profiles ADD COLUMN business_phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_email') THEN
    ALTER TABLE profiles ADD COLUMN business_email TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_website') THEN
    ALTER TABLE profiles ADD COLUMN business_website TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_instagram') THEN
    ALTER TABLE profiles ADD COLUMN business_instagram TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_tiktok') THEN
    ALTER TABLE profiles ADD COLUMN business_tiktok TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rating') THEN
    ALTER TABLE profiles ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_collaborations') THEN
    ALTER TABLE profiles ADD COLUMN total_collaborations INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'metadata') THEN
    ALTER TABLE profiles ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- ============================================
-- TABLE: OFFERS (Business Offers)
-- ============================================
-- Verify offers table exists (should already exist)
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

-- ============================================
-- TABLE: APPLICATIONS (Business Applications Management)
-- ============================================
-- Verify applications table exists
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: COLLABORATIONS (Business Agenda/Calendar)
-- ============================================
-- Verify collaborations table exists
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

-- ============================================
-- TABLE: BUSINESS_ESTABLISHMENTS (Multiple Locations)
-- ============================================
-- Verify business_establishments table exists
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

-- ============================================
-- TABLE: QR_CODES (Check-in Management)
-- ============================================
-- Verify qr_codes table exists
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

-- ============================================
-- TABLE: CONVERSATIONS & MESSAGES (Business Chat)
-- ============================================
-- Verify conversations table exists
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Verify messages table exists
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

-- ============================================
-- TABLE: NOTIFICATIONS (Business Notifications)
-- ============================================
-- Verify notifications table exists
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

-- ============================================
-- CREATE INDEXES FOR BUSINESS QUERIES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_offers_business_id ON offers(business_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_applications_offer_id ON applications(offer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_collaborations_business_id ON collaborations(business_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_scheduled_date ON collaborations(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);
CREATE INDEX IF NOT EXISTS idx_business_establishments_business_id ON business_establishments(business_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_business_id ON qr_codes(business_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_collaboration_id ON qr_codes(collaboration_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- BUSINESS-SPECIFIC FUNCTIONS
-- ============================================

-- Function to get business statistics
CREATE OR REPLACE FUNCTION get_business_stats(business_user_id UUID)
RETURNS TABLE (
  total_offers BIGINT,
  active_offers BIGINT,
  total_applications BIGINT,
  pending_applications BIGINT,
  accepted_applications BIGINT,
  total_collaborations BIGINT,
  upcoming_collaborations BIGINT,
  completed_collaborations BIGINT,
  total_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM offers WHERE business_id = business_user_id)::BIGINT as total_offers,
    (SELECT COUNT(*) FROM offers WHERE business_id = business_user_id AND status = 'active')::BIGINT as active_offers,
    (SELECT COUNT(*) FROM applications WHERE offer_id IN (SELECT id FROM offers WHERE business_id = business_user_id))::BIGINT as total_applications,
    (SELECT COUNT(*) FROM applications WHERE offer_id IN (SELECT id FROM offers WHERE business_id = business_user_id) AND status = 'pending')::BIGINT as pending_applications,
    (SELECT COUNT(*) FROM applications WHERE offer_id IN (SELECT id FROM offers WHERE business_id = business_user_id) AND status = 'accepted')::BIGINT as accepted_applications,
    (SELECT COUNT(*) FROM collaborations WHERE business_id = business_user_id)::BIGINT as total_collaborations,
    (SELECT COUNT(*) FROM collaborations WHERE business_id = business_user_id AND status = 'active' AND scheduled_date >= CURRENT_DATE)::BIGINT as upcoming_collaborations,
    (SELECT COUNT(*) FROM collaborations WHERE business_id = business_user_id AND status = 'completed')::BIGINT as completed_collaborations,
    (SELECT COALESCE(SUM(views_count), 0) FROM offers WHERE business_id = business_user_id)::BIGINT as total_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- All business-side tables and functions are now ready
-- You can now use the business integration functions in your application
-- ============================================

