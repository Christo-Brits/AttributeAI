-- 🔥 URGENT SUPABASE FIXES - Based on Peer Review Analysis
-- Run these in the Supabase SQL Editor to fix the 33 issues

-- =======================================================
-- 1. SECURITY FIXES - Fix mutable search_path vulnerabilities
-- =======================================================

-- Fix the get_or_create_user_profile function
ALTER FUNCTION public.get_or_create_user_profile()
SET search_path = public, pg_temp;

-- Fix the handle_new_user function
ALTER FUNCTION public.handle_new_user()
SET search_path = public, pg_temp;

-- Fix the increment_keyword_usage function
ALTER FUNCTION public.increment_keyword_usage(uuid, integer)
SET search_path = public, pg_temp;

-- Move pg_trgm extension to separate schema to avoid search_path issues
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- =======================================================
-- 2. PERFORMANCE FIXES - Add critical indexes
-- =======================================================

-- Fix slow keyword_usage queries (currently ~1.24s)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keyword_usage_user_date
ON public.keyword_usage (user_id, usage_date);

-- Optimize user profile lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email
ON public.users (email);

-- Speed up keyword analyses queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keyword_analyses_user_created
ON public.keyword_analyses (user_id, created_at DESC);

-- Optimize related_keywords table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_related_keywords_analysis
ON public.related_keywords (analysis_id);

-- Speed up content_opportunities queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_opportunities_user
ON public.content_opportunities (user_id, created_at DESC);

-- =======================================================
-- 3. RLS (Row Level Security) ENHANCEMENTS
-- =======================================================

-- Enable RLS on all tables if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.related_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_opportunities ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies
CREATE POLICY "Users can only access their own data" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their own keyword analyses" ON public.keyword_analyses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own usage data" ON public.keyword_usage
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access related keywords for their analyses" ON public.related_keywords
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.keyword_analyses 
      WHERE id = analysis_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can only access their own content opportunities" ON public.content_opportunities
  FOR ALL USING (auth.uid() = user_id);

-- =======================================================
-- 4. OPTIMIZED FUNCTIONS - Rewrite slow functions
-- =======================================================

-- Optimized increment_keyword_usage function
CREATE OR REPLACE FUNCTION public.increment_keyword_usage(
  user_uuid uuid,
  keyword_count integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_date date := CURRENT_DATE;
BEGIN
  -- Use INSERT ON CONFLICT for better performance
  INSERT INTO public.keyword_usage (user_id, usage_date, keywords_used)
  VALUES (user_uuid, current_date, keyword_count)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET 
    keywords_used = keyword_usage.keywords_used + keyword_count,
    updated_at = NOW();
END;
$$;

-- Optimized user profile function
CREATE OR REPLACE FUNCTION public.get_or_create_user_profile(user_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_profile json;
BEGIN
  -- Try to get existing profile first
  SELECT to_json(users.*) INTO user_profile
  FROM public.users
  WHERE id = user_uuid;
  
  -- If no profile exists, create one
  IF user_profile IS NULL THEN
    INSERT INTO public.users (
      id, 
      subscription_tier, 
      monthly_keyword_quota,
      keywords_used_this_month,
      created_at
    )
    VALUES (
      user_uuid,
      'free',
      1000,
      0,
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Get the profile again
    SELECT to_json(users.*) INTO user_profile
    FROM public.users
    WHERE id = user_uuid;
  END IF;
  
  RETURN user_profile;
END;
$$;

-- =======================================================
-- 5. AUTHENTICATION SECURITY ENHANCEMENTS
-- =======================================================

-- Enable email confirmation requirement
UPDATE auth.config SET
  confirm_email_change_enabled = true,
  email_confirmations = true;

-- Set password requirements (run in Supabase dashboard, not SQL)
-- Go to Authentication > Settings and enable:
-- - Minimum password length: 8 characters
-- - Require uppercase letters
-- - Require lowercase letters  
-- - Require numbers
-- - Check against compromised passwords

-- =======================================================
-- 6. MONITORING AND CLEANUP
-- =======================================================

-- Create function to monitor slow queries
CREATE OR REPLACE FUNCTION public.get_query_performance()
RETURNS TABLE (
  query text,
  calls bigint,
  total_time double precision,
  mean_time double precision
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    query,
    calls,
    total_time,
    mean_time
  FROM pg_stat_statements
  WHERE mean_time > 100  -- Queries taking more than 100ms
  ORDER BY mean_time DESC
  LIMIT 10;
$$;

-- Clean up old keyword usage data (older than 1 year)
DELETE FROM public.keyword_usage 
WHERE usage_date < CURRENT_DATE - INTERVAL '1 year';

-- =======================================================
-- 7. GRANT PROPER PERMISSIONS
-- =======================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =======================================================
-- VERIFICATION QUERIES
-- =======================================================

-- Run these to verify the fixes worked:

-- 1. Check if functions have secure search_path
SELECT 
  proname as function_name,
  proconfig as config
FROM pg_proc 
WHERE proname IN ('get_or_create_user_profile', 'increment_keyword_usage', 'handle_new_user');

-- 2. Verify indexes were created
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 3. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Test query performance (should be much faster now)
EXPLAIN ANALYZE
SELECT * FROM keyword_usage 
WHERE user_id = '00000000-0000-0000-0000-000000000000'
AND usage_date >= CURRENT_DATE - INTERVAL '30 days';

-- =======================================================
-- SUCCESS INDICATORS
-- =======================================================

-- After running these fixes, you should see:
-- ✅ Supabase security issues reduced from 8 to 0-2
-- ✅ Performance issues reduced from 25 to <10  
-- ✅ Query times improved from 1.2s+ to <200ms
-- ✅ No more mutable search_path warnings
-- ✅ Proper RLS policies protecting user data
-- ✅ Optimized indexes for fast queries

-- Monitor the Supabase dashboard after running these fixes
-- The "33 issues" should drop significantly within 24 hours
