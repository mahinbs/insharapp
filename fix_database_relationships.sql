-- ============================================
-- FIX DATABASE RELATIONSHIPS AND FUNCTIONS
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE OFFERS TABLE (if it doesn't exist)
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the offers table
CREATE TABLE IF NOT EXISTS offers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Key to Business Profile
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
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
-- 2. FIX FOREIGN KEY RELATIONSHIPS
-- ============================================

-- Check if applications table exists and has offer_id column
DO $$
DECLARE
  constraint_name_var TEXT;
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications') THEN
    -- Drop any existing foreign key constraints on offer_id
    FOR constraint_name_var IN 
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'applications' 
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name LIKE '%offer%'
    LOOP
      EXECUTE format('ALTER TABLE applications DROP CONSTRAINT IF EXISTS %I', constraint_name_var);
      RAISE NOTICE 'Dropped constraint: %', constraint_name_var;
    END LOOP;
    
    -- Add foreign key if offer_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'offer_id'
    ) THEN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'applications_offer_id_fkey' 
        AND table_name = 'applications'
      ) THEN
        ALTER TABLE applications 
        ADD CONSTRAINT applications_offer_id_fkey 
        FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: applications_offer_id_fkey';
      END IF;
    ELSE
      RAISE NOTICE 'Warning: applications table does not have offer_id column';
    END IF;
  END IF;
END $$;

-- Check if collaborations table exists and has offer_id column
DO $$
DECLARE
  constraint_name_var TEXT;
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'collaborations') THEN
    -- Drop any existing foreign key constraints on offer_id
    FOR constraint_name_var IN 
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'collaborations' 
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name LIKE '%offer%'
    LOOP
      EXECUTE format('ALTER TABLE collaborations DROP CONSTRAINT IF EXISTS %I', constraint_name_var);
      RAISE NOTICE 'Dropped constraint: %', constraint_name_var;
    END LOOP;
    
    -- Add foreign key if offer_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'collaborations' AND column_name = 'offer_id'
    ) THEN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'collaborations_offer_id_fkey' 
        AND table_name = 'collaborations'
      ) THEN
        ALTER TABLE collaborations 
        ADD CONSTRAINT collaborations_offer_id_fkey 
        FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: collaborations_offer_id_fkey';
      END IF;
    ELSE
      RAISE NOTICE 'Warning: collaborations table does not have offer_id column';
    END IF;
  END IF;
END $$;

-- ============================================
-- 3. CREATE INDEXES FOR OFFERS TABLE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_offers_business_id ON offers(business_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_location ON offers(location);
CREATE INDEX IF NOT EXISTS idx_offers_expires_at ON offers(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================
-- 4. CREATE RPC FUNCTION: get_business_stats
-- ============================================

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
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_business_stats(UUID) TO authenticated;

-- ============================================
-- 5. ENABLE RLS ON OFFERS TABLE
-- ============================================

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active offers" ON offers;
DROP POLICY IF EXISTS "Businesses can view own offers" ON offers;
DROP POLICY IF EXISTS "Businesses can create own offers" ON offers;
DROP POLICY IF EXISTS "Businesses can update own offers" ON offers;
DROP POLICY IF EXISTS "Businesses can delete own offers" ON offers;

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
-- 6. CREATE TRIGGERS FOR OFFERS TABLE
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;

-- Create trigger
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

-- Drop trigger if exists
DROP TRIGGER IF EXISTS check_offer_expiration ON offers;

-- Create trigger
CREATE TRIGGER check_offer_expiration
BEFORE INSERT OR UPDATE ON offers
FOR EACH ROW
EXECUTE FUNCTION check_offer_expiration();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Database fixes applied successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ Offers table created/verified';
  RAISE NOTICE '✓ Foreign key relationships fixed';
  RAISE NOTICE '✓ get_business_stats function created';
  RAISE NOTICE '✓ RLS policies applied';
  RAISE NOTICE '✓ Triggers created';
  RAISE NOTICE '========================================';
END $$;

