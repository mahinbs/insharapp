-- Add location column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location TEXT;
    RAISE NOTICE 'Added location column to profiles table';
  ELSE
    RAISE NOTICE 'Location column already exists in profiles table';
  END IF;
END $$;


