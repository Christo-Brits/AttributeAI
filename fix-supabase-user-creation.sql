-- Fix Supabase Automatic User Creation
-- This script adds the missing database trigger to automatically create user profiles

-- =============================================================================
-- AUTOMATIC USER CREATION TRIGGER
-- =============================================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user profile when auth.users record is created
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    company,
    industry,
    subscription_tier,
    subscription_status,
    trial_ends_at,
    monthly_keyword_quota,
    keywords_used_this_month,
    quota_reset_date,
    onboarding_completed,
    created_at,
    updated_at,
    last_active_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'industry', ''),
    'free',
    'trialing',
    NOW() + INTERVAL '14 days', -- 14-day trial
    1000, -- Free tier quota
    0,
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    FALSE,
    NEW.created_at,
    NEW.updated_at,
    NEW.created_at
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    company = COALESCE(EXCLUDED.company, users.company),
    industry = COALESCE(EXCLUDED.industry, users.industry),
    updated_at = NOW();

  -- Also create user profile record
  INSERT INTO public.user_profiles (
    user_id,
    timezone,
    language,
    marketing_emails,
    feature_updates,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    'UTC',
    'en',
    TRUE,
    TRUE,
    NEW.created_at,
    NEW.updated_at
  ) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- UPDATE EXISTING USERS WITHOUT PROFILES
-- =============================================================================

-- Create profiles for any existing auth users that don't have profiles
INSERT INTO public.users (
  id,
  email,
  subscription_tier,
  subscription_status,
  trial_ends_at,
  monthly_keyword_quota,
  keywords_used_this_month,
  quota_reset_date,
  onboarding_completed,
  created_at,
  updated_at,
  last_active_at
)
SELECT 
  au.id,
  au.email,
  'free',
  'trialing',
  NOW() + INTERVAL '14 days',
  1000,
  0,
  DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
  FALSE,
  au.created_at,
  au.updated_at,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Create user profiles for existing users
INSERT INTO public.user_profiles (
  user_id,
  timezone,
  language,
  marketing_emails,
  feature_updates,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'UTC',
  'en',
  TRUE,
  TRUE,
  u.created_at,
  u.updated_at
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own records
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT WITH CHECK (TRUE); -- Allow trigger to insert

-- User profiles policies
CREATE POLICY "Users can view own user_profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own user_profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert user_profiles" ON public.user_profiles
  FOR INSERT WITH CHECK (TRUE); -- Allow trigger to insert

-- =============================================================================
-- HELPFUL FUNCTIONS
-- =============================================================================

-- Function to check user quota and usage
CREATE OR REPLACE FUNCTION public.get_user_quota_info(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', id,
    'subscription_tier', subscription_tier,
    'monthly_quota', monthly_keyword_quota,
    'used_this_month', keywords_used_this_month,
    'remaining', (monthly_keyword_quota - keywords_used_this_month),
    'percentage_used', ROUND((keywords_used_this_month::float / monthly_keyword_quota::float) * 100, 2),
    'quota_reset_date', quota_reset_date
  )
  INTO result
  FROM public.users
  WHERE id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment keyword usage
CREATE OR REPLACE FUNCTION public.increment_keyword_usage(user_uuid UUID, keyword_count INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET 
    keywords_used_this_month = keywords_used_this_month + keyword_count,
    last_active_at = NOW(),
    updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly quotas (for scheduled job)
CREATE OR REPLACE FUNCTION public.reset_monthly_quotas()
RETURNS INTEGER AS $$
DECLARE
  reset_count INTEGER;
BEGIN
  UPDATE public.users
  SET 
    keywords_used_this_month = 0,
    quota_reset_date = DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    updated_at = NOW()
  WHERE quota_reset_date <= CURRENT_DATE;
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Count auth users vs profile users
DO $$
DECLARE
  auth_count INTEGER;
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.users;
  
  RAISE NOTICE 'Auth users: %, Profile users: %', auth_count, profile_count;
  
  IF auth_count = profile_count THEN
    RAISE NOTICE '✅ All auth users have profiles!';
  ELSE
    RAISE NOTICE '⚠️  Mismatch: % auth users missing profiles', (auth_count - profile_count);
  END IF;
END $$;

-- Success message
SELECT 
  'Supabase automatic user creation fix applied!' as status,
  'New signups will automatically get user profiles' as note;
