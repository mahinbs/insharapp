# Fix Database Errors - Instructions

## Issues Fixed

### 1. ✅ Authentication Hang in createOffer
- **Problem**: `getSession()` was hanging during offer creation
- **Fix**: Changed to use `getUser()` instead, which is more reliable
- **File**: `lib/supabase-offers.ts`

### 2. ✅ Foreign Key Relationship Errors
- **Problem**: Supabase couldn't find relationships between:
  - `collaborations` and `offers`
  - `applications` and `offers`
- **Fix**: 
  - Updated queries to use explicit foreign key names (`collaborations_offer_id_fkey`, `applications_offer_id_fkey`)
  - Created SQL script to add missing foreign keys
- **Files**: 
  - `lib/supabase-business.ts` (updated queries)
  - `fix_database_relationships.sql` (SQL to run)

### 3. ✅ Missing RPC Function
- **Problem**: `get_business_stats` function returns 404
- **Fix**: SQL script includes creation of this function
- **File**: `fix_database_relationships.sql`

### 4. ✅ Missing Offers Table
- **Problem**: Offers table returns 404
- **Fix**: SQL script creates the table if it doesn't exist
- **File**: `fix_database_relationships.sql`

## Steps to Fix

### Step 1: Run the SQL Script
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `fix_database_relationships.sql`
4. Copy and paste the entire contents
5. Click **Run** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
6. Check for success messages in the output

### Step 2: Verify the Fixes
After running the SQL, verify:

1. **Offers table exists**:
   ```sql
   SELECT * FROM offers LIMIT 1;
   ```

2. **Foreign keys are created**:
   ```sql
   SELECT 
     tc.constraint_name, 
     tc.table_name, 
     kcu.column_name,
     ccu.table_name AS foreign_table_name
   FROM information_schema.table_constraints AS tc 
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   WHERE tc.constraint_type = 'FOREIGN KEY' 
     AND (tc.table_name = 'applications' OR tc.table_name = 'collaborations')
     AND kcu.column_name = 'offer_id';
   ```

3. **RPC function exists**:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'get_business_stats';
   ```

### Step 3: Test the Application
1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Test offer creation:
   - Navigate to `/business/post-offer`
   - Fill in the form
   - Upload images
   - Click "Post Offer"
   - Should no longer hang at authentication step

3. Test business dashboard:
   - Navigate to `/business/home`
   - Should load without foreign key errors
   - Statistics should load correctly

4. Test applications page:
   - Navigate to `/business/applications`
   - Should load without foreign key errors

5. Test collaborations/agenda:
   - Navigate to `/business/agenda`
   - Should load without foreign key errors

## What the SQL Script Does

1. **Creates offers table** (if it doesn't exist):
   - All necessary columns
   - Proper data types
   - Default values
   - Check constraints

2. **Adds foreign key relationships**:
   - `applications.offer_id` → `offers.id`
   - `collaborations.offer_id` → `offers.id`
   - Both with `ON DELETE CASCADE`

3. **Creates indexes** for performance:
   - Business ID
   - Status
   - Category
   - Created date
   - Location
   - Expiration date

4. **Creates RPC function** `get_business_stats`:
   - Returns business statistics
   - Used by business dashboard

5. **Sets up Row Level Security (RLS)**:
   - Policies for viewing, creating, updating, deleting offers
   - Public can view active offers
   - Businesses can manage their own offers

6. **Creates triggers**:
   - Auto-update `updated_at` timestamp
   - Auto-expire offers past expiration date

## Troubleshooting

### If foreign keys still don't work:
1. Check that the `offers` table exists first
2. Verify that `applications` and `collaborations` tables have `offer_id` columns
3. Run the foreign key creation part of the SQL again

### If RPC function still returns 404:
1. Check that the function was created:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'get_business_stats';
   ```
2. Grant permissions:
   ```sql
   GRANT EXECUTE ON FUNCTION get_business_stats(UUID) TO authenticated;
   ```

### If offers table still returns 404:
1. Check table exists:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'offers';
   ```
2. Check RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'offers';
   ```
3. Verify your user has the right permissions

## Code Changes Made

### `lib/supabase-offers.ts`
- Changed `getSession()` to `getUser()` for more reliable authentication

### `lib/supabase-business.ts`
- Updated `getBusinessCollaborations()` to use explicit foreign key: `offers!collaborations_offer_id_fkey`
- Updated `getBusinessApplications()` to use explicit foreign key: `offers!applications_offer_id_fkey`

## Next Steps

After running the SQL script:
1. ✅ All foreign key errors should be resolved
2. ✅ `get_business_stats` should work
3. ✅ Offers table should be accessible
4. ✅ Offer creation should no longer hang

If you encounter any issues, check the Supabase logs in the dashboard for detailed error messages.

