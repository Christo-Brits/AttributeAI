#!/usr/bin/env node

/**
 * Supabase Signup Debug Script
 * Tests the signup flow to identify issues
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Debugging Supabase Signup Issues...\n');

// Test Supabase connection
async function testSupabaseConnection() {
    console.log('📡 Testing Supabase connection...');
    console.log(`URL: ${supabaseUrl}`);
    console.log(`Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET'}\n`);
    
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Missing Supabase environment variables');
        return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    try {
        // Test database connection
        const { data, error } = await supabase
            .from('user_profiles')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
        
        console.log('✅ Database connection successful');
        console.log(`📊 Current user profiles: ${data || 0}\n`);
        return true;
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        return false;
    }
}

// Test signup flow
async function testSignupFlow() {
    console.log('📝 Testing signup flow...');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const testEmail = `test+${Date.now()}@attributeai.app`;
    const testPassword = 'TestPassword123!';
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    full_name: 'Test User',
                    first_name: 'Test',
                    last_name: 'User',
                }
            }
        });
        
        if (error) {
            console.error('❌ Signup failed:', error.message);
            console.error('Error details:', error);
            return false;
        }
        
        console.log('✅ Signup successful!');
        console.log('User ID:', data.user?.id);
        console.log('Email confirmation needed:', !data.user?.email_confirmed_at);
        console.log('User data:', data.user);
        
        return true;
    } catch (error) {
        console.error('❌ Signup test failed:', error.message);
        return false;
    }
}

// Check authentication settings
async function checkAuthSettings() {
    console.log('🔐 Checking authentication settings...');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    try {
        // Try to get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('❌ Session check failed:', error.message);
        } else {
            console.log('✅ Session check successful');
            console.log('Current session:', session ? 'Active' : 'None');
        }
        
        // Check if email confirmation is required
        console.log('\n📧 Email confirmation settings:');
        console.log('- Email confirmation is likely required in Supabase');
        console.log('- Users must click email link before account is active');
        console.log('- Check Supabase dashboard > Authentication > Settings');
        
    } catch (error) {
        console.error('❌ Auth settings check failed:', error.message);
    }
}

// Main debugging function
async function debugSignupIssues() {
    console.log('🚀 AttributeAI Supabase Signup Debugging\n');
    
    const connectionOk = await testSupabaseConnection();
    if (!connectionOk) {
        console.log('\n🔧 Fix connection issues first before testing signup');
        return;
    }
    
    await checkAuthSettings();
    
    console.log('\n' + '='.repeat(50));
    console.log('🧪 TESTING SIGNUP FLOW');
    console.log('='.repeat(50));
    
    await testSignupFlow();
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 COMMON ISSUES & SOLUTIONS');
    console.log('='.repeat(50));
    
    console.log(`
🔍 POSSIBLE ISSUES:

1. EMAIL CONFIRMATION REQUIRED
   - Check Supabase dashboard > Authentication > Settings
   - If "Email confirmation" is enabled, users must click email link
   - Users won't appear in user_profiles table until confirmed

2. RLS (Row Level Security) POLICIES
   - Check if RLS is enabled on user_profiles table
   - Ensure proper policies allow INSERT operations
   - Anonymous users might not have insert permissions

3. DATABASE TRIGGERS
   - Check if triggers are working properly
   - User profile should be auto-created after email confirmation
   - Look for trigger errors in Supabase logs

4. EMAIL DELIVERY ISSUES
   - Check spam folders
   - Verify email templates are set up
   - Check Supabase email logs

5. FORM VALIDATION ERRORS
   - Check browser console for JavaScript errors
   - Verify all required fields are filled
   - Check password requirements

📊 TO CHECK USER STATUS:
1. Go to Supabase dashboard
2. Authentication > Users
3. Look for unconfirmed users
4. Check if user_profiles table has entries

🔧 IMMEDIATE FIXES:
1. Check browser console for errors during signup
2. Verify email confirmation emails are sent
3. Test with a different email domain
4. Check Supabase authentication logs
    `);
}

// Run the debugging
debugSignupIssues().catch(console.error);
