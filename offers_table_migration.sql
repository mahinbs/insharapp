-- ============================================
-- OFFERS TABLE MIGRATION
-- Add all fields used in offer-details page
-- Run this in your Supabase SQL Editor
-- ============================================

-- First, ensure the offers table exists with all required columns
DO $$
BEGIN
  -- Add business_website if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_website'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_website TEXT;
    RAISE NOTICE 'Added business_website column';
  END IF;

  -- Add business_instagram if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_instagram'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_instagram TEXT;
    RAISE NOTICE 'Added business_instagram column';
  END IF;

  -- Add business_tiktok if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_tiktok'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_tiktok TEXT;
    RAISE NOTICE 'Added business_tiktok column';
  END IF;

  -- Add business_rating if it doesn't exist (for quick access without join)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_rating'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_rating DECIMAL(3,2) DEFAULT 0;
    RAISE NOTICE 'Added business_rating column';
  END IF;

  -- Add total_collaborations if it doesn't exist (for quick access without join)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'total_collaborations'
  ) THEN
    ALTER TABLE offers ADD COLUMN total_collaborations INTEGER DEFAULT 0;
    RAISE NOTICE 'Added total_collaborations column';
  END IF;

  -- Add business_address if it doesn't exist (for location details)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_address'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_address TEXT;
    RAISE NOTICE 'Added business_address column';
  END IF;

  -- Add business_description if it doesn't exist (for about section)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_description'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_description TEXT;
    RAISE NOTICE 'Added business_description column';
  END IF;

  -- Add business_category if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_category'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_category TEXT;
    RAISE NOTICE 'Added business_category column';
  END IF;

  -- Add business_email if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_email'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_email TEXT;
    RAISE NOTICE 'Added business_email column';
  END IF;

  -- Add business_phone if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_phone'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_phone TEXT;
    RAISE NOTICE 'Added business_phone column';
  END IF;

  -- Ensure all existing columns are present
  -- These should already exist, but we'll check to be safe
  
  -- Ensure id exists (primary key)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'id'
  ) THEN
    ALTER TABLE offers ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();
    RAISE NOTICE 'Added id column';
  END IF;

  -- Ensure business_id exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_id'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added business_id column';
  END IF;

  -- Ensure title exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'title'
  ) THEN
    ALTER TABLE offers ADD COLUMN title TEXT NOT NULL;
    RAISE NOTICE 'Added title column';
  END IF;

  -- Ensure description exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'description'
  ) THEN
    ALTER TABLE offers ADD COLUMN description TEXT NOT NULL;
    RAISE NOTICE 'Added description column';
  END IF;

  -- Ensure category exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'category'
  ) THEN
    ALTER TABLE offers ADD COLUMN category TEXT NOT NULL;
    RAISE NOTICE 'Added category column';
  END IF;

  -- Ensure location exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'location'
  ) THEN
    ALTER TABLE offers ADD COLUMN location TEXT NOT NULL;
    RAISE NOTICE 'Added location column';
  END IF;

  -- Ensure service_offered exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'service_offered'
  ) THEN
    ALTER TABLE offers ADD COLUMN service_offered TEXT;
    RAISE NOTICE 'Added service_offered column';
  END IF;

  -- Ensure requirements exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'requirements'
  ) THEN
    ALTER TABLE offers ADD COLUMN requirements TEXT[];
    RAISE NOTICE 'Added requirements column';
  END IF;

  -- Ensure status exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'status'
  ) THEN
    ALTER TABLE offers ADD COLUMN status TEXT NOT NULL DEFAULT 'draft' 
      CHECK (status IN ('draft', 'active', 'paused', 'expired', 'closed'));
    RAISE NOTICE 'Added status column';
  END IF;

  -- Ensure views_count exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE offers ADD COLUMN views_count INTEGER DEFAULT 0;
    RAISE NOTICE 'Added views_count column';
  END IF;

  -- Ensure applications_count exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'applications_count'
  ) THEN
    ALTER TABLE offers ADD COLUMN applications_count INTEGER DEFAULT 0;
    RAISE NOTICE 'Added applications_count column';
  END IF;

  -- Ensure images exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'images'
  ) THEN
    ALTER TABLE offers ADD COLUMN images TEXT[];
    RAISE NOTICE 'Added images column';
  END IF;

  -- Ensure main_image exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'main_image'
  ) THEN
    ALTER TABLE offers ADD COLUMN main_image TEXT;
    RAISE NOTICE 'Added main_image column';
  END IF;

  -- Ensure business_name exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_name TEXT;
    RAISE NOTICE 'Added business_name column';
  END IF;

  -- Ensure business_logo exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'business_logo'
  ) THEN
    ALTER TABLE offers ADD COLUMN business_logo TEXT;
    RAISE NOTICE 'Added business_logo column';
  END IF;

  -- Ensure created_at exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE offers ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added created_at column';
  END IF;

  -- Ensure updated_at exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE offers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column';
  END IF;

  -- Ensure expires_at exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE offers ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added expires_at column';
  END IF;

  -- Ensure metadata exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE offers ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added metadata column';
  END IF;

  RAISE NOTICE 'Offers table migration completed successfully!';
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_offers_business_id ON offers(business_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_location ON offers(location);
CREATE INDEX IF NOT EXISTS idx_offers_expires_at ON offers(expires_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_offers_updated_at ON offers;
CREATE TRIGGER trigger_update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_offers_updated_at();

-- Optional: Create a function to sync business details from profiles to offers
-- This can be called when creating/updating an offer to keep business info in sync
CREATE OR REPLACE FUNCTION sync_offer_business_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Update offer with latest business details from profiles
  UPDATE offers
  SET
    business_name = p.business_name,
    business_logo = p.business_logo,
    business_rating = p.rating,
    business_website = p.business_website,
    business_instagram = p.business_instagram,
    business_tiktok = p.business_tiktok,
    business_address = p.business_address,
    business_description = p.business_description,
    business_category = p.business_category,
    business_email = p.business_email,
    business_phone = p.business_phone,
    total_collaborations = p.total_collaborations
  FROM profiles p
  WHERE offers.business_id = p.id
    AND offers.business_id = NEW.business_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger would run on profile updates, but it might be too aggressive
-- You may want to call this function manually or create a more selective trigger
-- Uncomment if you want automatic syncing:
-- DROP TRIGGER IF EXISTS trigger_sync_offer_business_details ON profiles;
-- CREATE TRIGGER trigger_sync_offer_business_details
--   AFTER UPDATE ON profiles
--   FOR EACH ROW
--   WHEN (OLD.business_name IS DISTINCT FROM NEW.business_name 
--         OR OLD.business_logo IS DISTINCT FROM NEW.business_logo
--         OR OLD.rating IS DISTINCT FROM NEW.rating)
--   EXECUTE FUNCTION sync_offer_business_details();

-- Final message
DO $$
BEGIN
  RAISE NOTICE 'All indexes and triggers created successfully!';
END $$;

