-- Check the actual structure of user_profiles table
-- Run this in Supabase SQL Editor to see what columns exist

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
