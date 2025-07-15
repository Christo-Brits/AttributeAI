-- AttributeAI User Sync Fix
-- This connects Supabase Auth users to your custom users table

-- Create or replace function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    subscription_tier,
    monthly_quota,
    quota_used,
    quota_reset_date,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'free',
    1000,
    0,
    CURRENT_DATE + INTERVAL '1 month',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically sync new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync existing auth users to users table (one-time migration)
INSERT INTO public.users (
  id,
  email,
  first_name,
  last_name,
  subscription_tier,
  monthly_quota,
  quota_used,
  quota_reset_date,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', ''),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  'free',
  1000,
  0,
  CURRENT_DATE + INTERVAL '1 month',
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Verify the sync worked
SELECT 
  'Auth Users' as source, 
  COUNT(*) as count 
FROM auth.users
UNION ALL
SELECT 
  'Public Users' as source, 
  COUNT(*) as count 
FROM public.users;
