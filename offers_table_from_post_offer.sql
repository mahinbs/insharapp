-- ============================================
-- OFFERS TABLE - Based on /business/post-offer form
-- This table stores all data collected from the post-offer form
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the offers table if it doesn't exist
CREATE TABLE IF NOT EXISTS offers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Key to Business Profile
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- ============================================
  -- FORM FIELDS FROM /business/post-offer
  -- ============================================
  
  -- 1. Offer Title (Required)
  -- Form field: title
  -- Input type: text
  -- Placeholder: "e.g., Free 3-Course Dinner"
  title TEXT NOT NULL,
  
  -- 2. Category (Required)
  -- Form field: category
  -- Input type: select dropdown
  -- Options: Restaurant, Beauty & Spa, Fashion, Fitness, Travel, Technology, Home & Garden, Entertainment
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
  
  -- 3. Description (Required, Max 500 characters)
  -- Form field: description
  -- Input type: textarea
  -- Placeholder: "Describe what the influencer will receive and experience..."
  -- Max length: 500
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  
  -- 4. Service Offered (Required, Max 500 characters)
  -- Form field: serviceOffered
  -- Input type: textarea
  -- Placeholder: "Detail the specific service or product you're providing..."
  -- Max length: 500
  service_offered TEXT CHECK (char_length(service_offered) <= 500),
  
  -- 5. Location (Required)
  -- Form field: location
  -- Input type: text
  -- Placeholder: "e.g., Downtown Plaza, 123 Main Street"
  location TEXT NOT NULL,
  
  -- 6. Requirements (Required, Max 500 characters, stored as array)
  -- Form field: requirements
  -- Input type: textarea
  -- Placeholder: "Enter each requirement on a new line..."
  -- Max length: 500 (for input), stored as TEXT[] array
  -- Format: Each line becomes an array element
  requirements TEXT[] NOT NULL DEFAULT '{}',
  
  -- 7. Expiration Date (Optional)
  -- Form field: expiresAt
  -- Input type: date
  -- Min date: today
  -- Optional: Can be NULL
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- 8. Images (Optional, up to 5 images)
  -- Form field: imageFiles (uploaded files)
  -- Input type: file (multiple, accept="image/*")
  -- Max: 5 images
  -- Stored as: Array of public URLs after upload
  images TEXT[] DEFAULT '{}',
  
  -- Main image (first image from images array)
  main_image TEXT,
  
  -- ============================================
  -- AUTO-POPULATED FIELDS
  -- ============================================
  
  -- Business details (auto-populated from profiles table)
  business_name TEXT,
  business_logo TEXT,
  
  -- Status (default: 'active' when created)
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'draft',
    'active',
    'paused',
    'expired',
    'closed'
  )),
  
  -- Counters
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata for additional data
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Index on business_id for quick lookups
CREATE INDEX IF NOT EXISTS idx_offers_business_id ON offers(business_id);

-- Index on status for filtering active offers
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

-- Index on category for category-based filtering
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);

-- Index on location for location-based searches
CREATE INDEX IF NOT EXISTS idx_offers_location ON offers(location);

-- Index on created_at for sorting by newest
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC);

-- Index on expires_at for finding expired offers
CREATE INDEX IF NOT EXISTS idx_offers_expires_at ON offers(expires_at);

-- Composite index for common queries (active offers by category)
CREATE INDEX IF NOT EXISTS idx_offers_status_category ON offers(status, category);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on any update
DROP TRIGGER IF EXISTS trigger_update_offers_updated_at ON offers;
CREATE TRIGGER trigger_update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_offers_updated_at();

-- Function to automatically set main_image from first image
CREATE OR REPLACE FUNCTION set_offers_main_image()
RETURNS TRIGGER AS $$
BEGIN
  -- If main_image is not set and images array has at least one image
  IF NEW.main_image IS NULL AND array_length(NEW.images, 1) > 0 THEN
    NEW.main_image = NEW.images[1];
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set main_image automatically
DROP TRIGGER IF EXISTS trigger_set_offers_main_image ON offers;
CREATE TRIGGER trigger_set_offers_main_image
  BEFORE INSERT OR UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION set_offers_main_image();

-- Function to automatically sync business details from profiles
CREATE OR REPLACE FUNCTION sync_offer_business_info()
RETURNS TRIGGER AS $$
BEGIN
  -- When an offer is created, automatically populate business details
  IF TG_OP = 'INSERT' THEN
    SELECT 
      business_name,
      business_logo
    INTO 
      NEW.business_name,
      NEW.business_logo
    FROM profiles
    WHERE id = NEW.business_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync business info on insert
DROP TRIGGER IF EXISTS trigger_sync_offer_business_info ON offers;
CREATE TRIGGER trigger_sync_offer_business_info
  BEFORE INSERT ON offers
  FOR EACH ROW
  EXECUTE FUNCTION sync_offer_business_info();

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS on offers table
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view active offers" ON offers;
DROP POLICY IF EXISTS "Business owners can view their own offers" ON offers;
DROP POLICY IF EXISTS "Business owners can create offers" ON offers;
DROP POLICY IF EXISTS "Business owners can update their own offers" ON offers;
DROP POLICY IF EXISTS "Business owners can delete their own offers" ON offers;

-- Policy: Users can view all active offers
CREATE POLICY "Anyone can view active offers"
  ON offers
  FOR SELECT
  USING (status = 'active');

-- Policy: Business owners can view their own offers (any status)
CREATE POLICY "Business owners can view their own offers"
  ON offers
  FOR SELECT
  USING (
    auth.uid() = business_id
  );

-- Policy: Business owners can insert their own offers
CREATE POLICY "Business owners can create offers"
  ON offers
  FOR INSERT
  WITH CHECK (
    auth.uid() = business_id
  );

-- Policy: Business owners can update their own offers
CREATE POLICY "Business owners can update their own offers"
  ON offers
  FOR UPDATE
  USING (
    auth.uid() = business_id
  );

-- Policy: Business owners can delete their own offers
CREATE POLICY "Business owners can delete their own offers"
  ON offers
  FOR DELETE
  USING (
    auth.uid() = business_id
  );

-- ============================================
-- COMMENTS for Documentation
-- ============================================

COMMENT ON TABLE offers IS 'Stores all offers created by businesses through the /business/post-offer form';
COMMENT ON COLUMN offers.title IS 'Offer title (required, from form field: title)';
COMMENT ON COLUMN offers.category IS 'Offer category (required, from form field: category)';
COMMENT ON COLUMN offers.description IS 'Offer description (required, max 500 chars, from form field: description)';
COMMENT ON COLUMN offers.service_offered IS 'Service being offered (required, max 500 chars, from form field: serviceOffered)';
COMMENT ON COLUMN offers.location IS 'Offer location (required, from form field: location)';
COMMENT ON COLUMN offers.requirements IS 'Influencer requirements (required, stored as array, from form field: requirements)';
COMMENT ON COLUMN offers.expires_at IS 'Offer expiration date (optional, from form field: expiresAt)';
COMMENT ON COLUMN offers.images IS 'Offer images (up to 5, stored as array of URLs, from form field: imageFiles)';
COMMENT ON COLUMN offers.main_image IS 'Main/featured image (automatically set from first image in images array)';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Offers table created successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Form Fields Mapped:';
  RAISE NOTICE '  - title → title (TEXT, required)';
  RAISE NOTICE '  - category → category (TEXT, required, with CHECK constraint)';
  RAISE NOTICE '  - description → description (TEXT, required, max 500)';
  RAISE NOTICE '  - serviceOffered → service_offered (TEXT, required, max 500)';
  RAISE NOTICE '  - location → location (TEXT, required)';
  RAISE NOTICE '  - requirements → requirements (TEXT[], required)';
  RAISE NOTICE '  - expiresAt → expires_at (TIMESTAMP, optional)';
  RAISE NOTICE '  - imageFiles → images (TEXT[], optional, up to 5)';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Indexes, triggers, and RLS policies created!';
  RAISE NOTICE '========================================';
END $$;

