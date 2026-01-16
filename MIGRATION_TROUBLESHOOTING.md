# Migration Troubleshooting Guide

## Common Errors and Solutions

### Error: "column sender_id does not exist"
**Cause**: Circular dependency - `conversations` table tried to reference `messages` before it existed.

**Solution**: Run `supabase_fix.sql` in Supabase SQL Editor.

---

### Error: "relation messages already exists"
**Cause**: You've partially run the migration, and some tables already exist.

**Solution**: Run `supabase_fix.sql` - it handles existing tables gracefully.

---

### Error: "relation X already exists"
**Cause**: You've already run part of the migration.

**Solutions**:

**Option 1 (Recommended)**: Use the fix script
- Run `supabase_fix.sql` - it checks for existing tables and only creates what's missing

**Option 2**: Start fresh (⚠️ Deletes all data)
```sql
-- WARNING: This deletes ALL tables and data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
Then run `supabase_migration.sql` again.

---

### Error: "constraint X already exists"
**Cause**: Foreign key or constraint was already created.

**Solution**: The fix script handles this by checking if constraints exist before creating them.

---

### Error: "policy X already exists"
**Cause**: RLS policies were already created.

**Solution**: The fix script uses `DROP POLICY IF EXISTS` before recreating policies.

---

## Step-by-Step Fix Process

1. **Go to Supabase Dashboard** → SQL Editor

2. **Run the fix script**:
   - Open `supabase_fix.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click "Run"

3. **Verify tables exist**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
   
   You should see:
   - profiles
   - offers
   - applications
   - collaborations
   - conversations
   - messages
   - reviews
   - business_establishments
   - qr_codes
   - notifications
   - categories

4. **Check for errors**: If you see any errors, note the table name and error message, then:
   - Check if the table exists
   - Check if foreign keys are correct
   - Verify RLS is enabled

---

## What the Fix Script Does

1. ✅ Safely drops and recreates `conversations` table
2. ✅ Checks if `messages` table exists before creating
3. ✅ Creates indexes only if they don't exist
4. ✅ Adds foreign keys only if they don't exist
5. ✅ Drops and recreates RLS policies
6. ✅ Creates triggers only if they don't exist

---

## If Nothing Works

1. **Check your Supabase project status**:
   - Make sure project is active
   - Check if you have proper permissions

2. **Try running tables one by one**:
   - Start with `profiles` table
   - Then `offers`
   - Then `applications`
   - Continue in order

3. **Contact Support**:
   - Share the exact error message
   - Share which tables already exist
   - Share the SQL you're trying to run

---

## Prevention Tips

- ✅ Always run migrations in a fresh database first
- ✅ Test on a development project before production
- ✅ Keep backups of your database
- ✅ Run migrations in order
- ✅ Don't skip steps

---

## Quick Check Commands

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profiles', 'offers', 'applications', 'collaborations',
  'conversations', 'messages', 'reviews', 'business_establishments',
  'qr_codes', 'notifications', 'categories'
)
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'offers', 'applications', 'collaborations', 'conversations', 'messages');

-- Check foreign keys
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public';
```



