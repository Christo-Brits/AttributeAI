# 🔐 Supabase Configuration Guide

## ✅ **Environment Variables Setup**

Your AttributeAI platform needs these environment variables to connect to Supabase:

### **Local Development (.env file):**
```env
REACT_APP_SUPABASE_URL=https://xpyfoutwwjslivrmbflm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWZvdXR3d2pzbGl2cm1iZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDMyODcsImV4cCI6MjA2NTQxOTI4N30.SmuHFfvlbgvU0rWsPZyn-UuZ3l135g3nKkZJqFA_bpc
```

### **Netlify Production Setup:**

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com
   - Select your AttributeAI site

2. **Add Environment Variables:**
   - Go to: Site Settings → Environment Variables
   - Click "Add a variable"

3. **Add These Variables:**
   ```
   Key: REACT_APP_SUPABASE_URL
   Value: https://xpyfoutwwjslivrmbflm.supabase.co
   
   Key: REACT_APP_SUPABASE_ANON_KEY  
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWZvdXR3d2pzbGl2cm1iZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDMyODcsImV4cCI6MjA2NTQxOTI4N30.SmuHFfvlbgvU0rWsPZyn-UuZ3l135g3nKkZJqFA_bpc
   ```

4. **Deploy:** 
   - Save the variables
   - Trigger a new deploy (or push a commit to GitHub)

## 🔧 **Supabase Database Setup**

Your Supabase project needs the user_profiles table. Run this SQL in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  monthly_usage JSONB DEFAULT '{"keywords_analyzed": 0, "content_generated": 0, "attribution_queries": 0, "last_reset": "2025-01-01T00:00:00Z"}',
  usage_limits JSONB DEFAULT '{"keywords_per_month": 100, "content_pieces_per_month": 5, "attribution_queries_per_month": 50}',
  features_enabled TEXT[] DEFAULT ARRAY['basic_keyword_analysis', 'basic_content_generation', 'basic_attribution'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 📧 **Email Configuration**

In your Supabase dashboard:

1. **Go to Authentication → Settings**
2. **Configure Site URL:**
   - Site URL: `https://your-netlify-url.netlify.app`

3. **Add Redirect URLs:**
   - `https://your-netlify-url.netlify.app/auth/verify`
   - `https://your-netlify-url.netlify.app/auth/reset-password`

4. **Customize Email Templates** (optional):
   - Confirm signup template
   - Password recovery template

## ✅ **Testing Connection**

After setup, test that Supabase is working:

1. **Check Console:** Look for "✅ Supabase client initialized" message
2. **Test Signup:** Create a new account and verify email verification works
3. **Test Login:** Login with your account
4. **Check Database:** Verify user appears in Supabase auth.users table

## 🔒 **Security Notes**

- The anon key is safe to expose in frontend code
- Row Level Security (RLS) protects user data
- Users can only access their own profiles
- Email verification prevents fake accounts

## 🎯 **Expected Result**

After configuration:
- ✅ **Real user accounts** stored in Supabase
- ✅ **Email verification** on signup
- ✅ **Password reset** functionality
- ✅ **Usage limits** persisted in database
- ✅ **No more localStorage fallback**

**Your authentication will be production-ready! 🚀**