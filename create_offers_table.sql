-- ============================================
-- CREATE OFFERS TABLE
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop table if exists (use with caution in production)
DROP TABLE IF EXISTS offers CASCADE;

-- Create the offers table
CREATE TABLE offers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Key to Business Profile
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- ============================================
  -- OFFER DETAILS
  -- ============================================
  
  -- Basic Information
  title TEXT NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  category TEXT NOT NULL CHECK (category IN (
    'Restaurant',
    'Beauty & Spa',
    'Fashion',
    'Fitness',
    'Travel',
    'Technology',
    'Home & Garden',
    'Entertainment'
  )),
  location TEXT NOT NULL,
  service_offered TEXT CHECK (char_length(service_offered) <= 500),
  
  -- Requirements (stored as array)
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Images (stored as array of URLs)
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  main_image TEXT,
  
  -- Business Info (denormalized for performance)
  business_name TEXT,
  business_logo TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'expired', 'closed')),
  
  -- Metrics
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata (for future use)
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for business_id (foreign key lookups)
CREATE INDEX idx_offers_business_id ON offers(business_id);

-- Index for status (filtering active offers)
CREATE INDEX idx_offers_status ON offers(status);

-- Index for category (filtering by category)
CREATE INDEX idx_offers_category ON offers(category);

-- Index for created_at (sorting by newest)
CREATE INDEX idx_offers_created_at ON offers(created_at DESC);

-- Index for location (searching by location)
CREATE INDEX idx_offers_location ON offers(location);

-- Index for expires_at (filtering expired offers)
CREATE INDEX idx_offers_expires_at ON offers(expires_at) WHERE expires_at IS NOT NULL;

-- Composite index for common queries
CREATE INDEX idx_offers_status_category ON offers(status, category) WHERE status = 'active';

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active offers
CREATE POLICY "Anyone can view active offers"
ON offers FOR SELECT
USING (status = 'active');

-- Policy: Businesses can view their own offers (all statuses)
CREATE POLICY "Businesses can view own offers"
ON offers FOR SELECT
USING (auth.uid() = business_id);

-- Policy: Businesses can insert their own offers
CREATE POLICY "Businesses can create own offers"
ON offers FOR INSERT
WITH CHECK (auth.uid() = business_id);

-- Policy: Businesses can update their own offers
CREATE POLICY "Businesses can update own offers"
ON offers FOR UPDATE
USING (auth.uid() = business_id)
WITH CHECK (auth.uid() = business_id);

-- Policy: Businesses can delete their own offers
CREATE POLICY "Businesses can delete own offers"
ON offers FOR DELETE
USING (auth.uid() = business_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON offers
FOR EACH ROW
EXECUTE FUNCTION update_offers_updated_at();

-- Function to check if offer is expired
CREATE OR REPLACE FUNCTION check_offer_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at < NOW() AND NEW.status = 'active' THEN
    NEW.status = 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically expire offers
CREATE TRIGGER check_offer_expiration
BEFORE INSERT OR UPDATE ON offers
FOR EACH ROW
EXECUTE FUNCTION check_offer_expiration();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE offers IS 'Stores collaboration offers posted by businesses';
COMMENT ON COLUMN offers.images IS 'Array of image URLs stored in Supabase Storage';
COMMENT ON COLUMN offers.requirements IS 'Array of requirement strings';
COMMENT ON COLUMN offers.status IS 'Offer status: draft, active, paused, expired, or closed';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Offers table created successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Table: offers';
  RAISE NOTICE 'RLS: Enabled';
  RAISE NOTICE 'Indexes: Created';
  RAISE NOTICE 'Triggers: Created';
  RAISE NOTICE '========================================';
END $$;

