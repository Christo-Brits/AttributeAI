# 🗑️ Supabase User Cleanup Guide

## How to Delete Test Users from Supabase

### **Method 1: Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Login to your project

2. **Navigate to Authentication**
   - Click "Authentication" in the left sidebar
   - Click "Users" tab

3. **Delete Users**
   - Select users you want to delete
   - Click the trash icon or "Delete" button
   - Confirm deletion

### **Method 2: SQL Query (Bulk Delete)**

If you have many test users, you can use SQL:

```sql
-- ⚠️ DANGER: This deletes ALL users! Use carefully
-- Go to SQL Editor in Supabase Dashboard

-- Delete all users (USE WITH EXTREME CAUTION)
DELETE FROM auth.users;

-- Or delete specific users by email pattern
DELETE FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%fake%';

-- Or delete users created today (if they're all test users)
DELETE FROM auth.users 
WHERE created_at >= CURRENT_DATE;
```

### **Method 3: Delete Specific Test Emails**

```sql
-- Delete specific test email addresses
DELETE FROM auth.users 
WHERE email IN (
  'test@example.com',
  'demo@attributeai.app',
  'infinitebuildsolutions2024@gmail.com'  -- if this was a test
);
```

### **Method 4: Keep Only Production Users**

```sql
-- If you know which users are real, keep only those
DELETE FROM auth.users 
WHERE email NOT IN (
  'your-real-email@domain.com',
  'another-real-user@domain.com'
);
```

## ✅ **After Cleanup - New User Flow**

Once you clean up test users, the new authentication flow will:

1. **Force Real Registration** - No more demo accounts
2. **Email Verification** - Users must verify email before access  
3. **Password Reset** - Forgot password functionality works
4. **Supabase Storage** - All new users stored in database
5. **Usage Limits** - Free tier enforced from day 1

## 🔧 **Recommended Cleanup Steps**

1. **Backup First** (if you have any real users)
   ```sql
   -- Export user data first
   SELECT * FROM auth.users;
   ```

2. **Delete Test Users**
   - Use Supabase Dashboard for safety
   - Delete one by one to avoid mistakes

3. **Verify Cleanup**
   ```sql
   -- Check remaining users
   SELECT email, created_at FROM auth.users ORDER BY created_at DESC;
   ```

4. **Test New Flow**
   - Try signing up with a real email
   - Verify email verification works
   - Test password reset functionality

## 🎯 **What Happens Next**

After cleanup, every new user will:
- ✅ Create account via proper Supabase registration
- ✅ Receive email verification link
- ✅ Be stored in user_profiles table
- ✅ Have proper usage limits enforced
- ✅ Go through upgrade funnel when limits reached

**The demo account loophole is completely closed! 🔐**