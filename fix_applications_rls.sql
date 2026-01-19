-- Fix RLS policy for applications table
-- This ensures influencers can create applications

-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Influencers can create applications" ON applications;

-- Recreate the policy with better error handling
CREATE POLICY "Influencers can create applications"
  ON applications FOR INSERT
  WITH CHECK (
    -- Ensure the user is authenticated
    auth.uid() IS NOT NULL AND
    -- Ensure the influencer_id matches the authenticated user
    auth.uid() = influencer_id AND
    -- Ensure the user has a profile with user_type = 'influencer'
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'influencer'
      AND is_active = true
    ) AND
    -- Ensure the offer exists and is active
    EXISTS (
      SELECT 1 
      FROM offers 
      WHERE id = offer_id 
      AND status = 'active'
    )
  );

-- Also ensure users can view their own applications
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (
    auth.uid() = influencer_id OR
    auth.uid() IN (SELECT business_id FROM offers WHERE id = offer_id)
  );

-- Ensure businesses can update applications to their offers
DROP POLICY IF EXISTS "Businesses can update applications to their offers" ON applications;
CREATE POLICY "Businesses can update applications to their offers"
  ON applications FOR UPDATE
  USING (
    auth.uid() IN (SELECT business_id FROM offers WHERE id = offer_id)
  );

-- Allow influencers to update their own applications (to cancel, etc.)
DROP POLICY IF EXISTS "Influencers can update their own applications" ON applications;
CREATE POLICY "Influencers can update their own applications"
  ON applications FOR UPDATE
  USING (auth.uid() = influencer_id)
  WITH CHECK (auth.uid() = influencer_id);

