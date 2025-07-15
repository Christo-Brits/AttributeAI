-- AttributeAI Abandoned Cart Analysis
-- Find users who authenticated but never completed onboarding

SELECT 
  'COMPLETE USERS' as user_type,
  COUNT(*) as count,
  'Users who completed full signup process' as description
FROM auth.users au
INNER JOIN public.users pu ON au.id = pu.id

UNION ALL

SELECT 
  'ABANDONED CARTS' as user_type,
  COUNT(*) as count,
  'Users who signed up but never completed onboarding' as description
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL

UNION ALL

SELECT 
  'TOTAL AUTH USERS' as user_type,
  COUNT(*) as count,
  'Total users who attempted signup' as description
FROM auth.users;

-- Show the abandoned cart users (re-engagement targets)
SELECT 
  'ABANDONED CART USERS - RE-ENGAGEMENT TARGETS' as analysis,
  au.email,
  au.created_at as signup_date,
  EXTRACT(days FROM (NOW() - au.created_at)) as days_since_signup,
  au.raw_user_meta_data->>'provider' as signup_method,
  CASE 
    WHEN EXTRACT(days FROM (NOW() - au.created_at)) <= 1 THEN 'HOT - Contact within 24h'
    WHEN EXTRACT(days FROM (NOW() - au.created_at)) <= 7 THEN 'WARM - Week-old lead'
    WHEN EXTRACT(days FROM (NOW() - au.created_at)) <= 30 THEN 'COOL - Month-old lead'
    ELSE 'COLD - Old lead, needs strong incentive'
  END as engagement_priority
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;
