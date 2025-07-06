-- COMPLETE ATTRIBUTEAI SCHEMA + USER SYNC FIX
-- Run this entire script to ensure everything is properly set up

-- First check if the users table has the right structure
DO $$
BEGIN
    -- Check if monthly_keyword_quota column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' 
                   AND column_name = 'monthly_keyword_quota' 
                   AND table_schema = 'public') THEN
        
        RAISE NOTICE 'Users table missing columns - will recreate with full schema';
        
        -- Drop existing users table if it exists with wrong schema
        DROP TABLE IF EXISTS public.users CASCADE;
        
        -- Create users table with correct schema
        CREATE TABLE public.users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            first_name TEXT,
            last_name TEXT,
            company TEXT,
            industry TEXT,
            website_url TEXT,
            subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'professional', 'enterprise', 'agency')),
            subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing')),
            trial_ends_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Keyword Intelligence specific fields
            monthly_keyword_quota INTEGER DEFAULT 1000,
            keywords_used_this_month INTEGER DEFAULT 0,
            quota_reset_date DATE DEFAULT DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
            
            -- Preferences
            primary_goals TEXT[],
            current_tools TEXT[],
            onboarding_completed BOOLEAN DEFAULT FALSE,
            
            -- Metadata
            metadata JSONB DEFAULT '{}'::jsonb
        );
        
        RAISE NOTICE 'Users table recreated with correct schema';
    ELSE
        RAISE NOTICE 'Users table already has correct schema';
    END IF;
END
$$;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

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
    monthly_keyword_quota,
    keywords_used_this_month,
    quota_reset_date,
    created_at,
    updated_at,
    last_active_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'free',
    1000,
    0,
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    NEW.created_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- Prevent duplicate key errors
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
  monthly_keyword_quota,
  keywords_used_this_month,
  quota_reset_date,
  created_at,
  updated_at,
  last_active_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', ''),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  'free',
  1000,
  0,
  DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
  au.created_at,
  NOW(),
  NOW()
FROM auth.users au
ON CONFLICT (id) DO NOTHING;  -- Skip existing users

-- Verify the sync worked
SELECT 
  'Auth Users' as source, 
  COUNT(*) as count 
FROM auth.users
UNION ALL
SELECT 
  'Database Users' as source, 
  COUNT(*) as count 
FROM public.users
UNION ALL
SELECT 
  'Sample User Data' as source,
  1 as count;

-- Show sample of synced users
SELECT 
  id, 
  email, 
  first_name, 
  last_name,
  subscription_tier,
  monthly_keyword_quota,
  keywords_used_this_month
FROM public.users 
LIMIT 5;
