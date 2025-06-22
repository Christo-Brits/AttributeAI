// Test Supabase User Creation Flow
// This script tests automatic user profile creation on signup

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserCreation() {
  console.log('🧪 Testing Supabase User Creation Flow...\n');

  try {
    // Test 1: Check if trigger exists
    console.log('1️⃣ Checking database trigger...');
    const { data: triggers, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('*')
      .eq('trigger_name', 'on_auth_user_created');

    if (triggerError) {
      console.log('⚠️  Cannot check triggers (this is normal for RLS)');
    } else if (triggers && triggers.length > 0) {
      console.log('✅ Database trigger exists');
    } else {
      console.log('❌ Database trigger missing - run fix-supabase-user-creation.sql');
    }

    // Test 2: Check existing auth users vs profile users
    console.log('\n2️⃣ Checking user count sync...');
    
    // Get auth users count (this might fail due to RLS, that's ok)
    let authCount = 'unknown';
    try {
      const { count: authUserCount } = await supabase.auth.admin.listUsers();
      authCount = authUserCount;
    } catch (err) {
      console.log('⚠️  Cannot access auth.users (normal with client key)');
    }

    // Get profile users count
    const { data: profileUsers, error: profileError } = await supabase
      .from('users')
      .select('id, email, created_at, subscription_tier')
      .order('created_at', { ascending: false })
      .limit(10);

    if (profileError) {
      console.error('❌ Error getting profile users:', profileError.message);
    } else {
      console.log(`✅ Found ${profileUsers.length} user profiles`);
      console.log('Recent users:');
      profileUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.subscription_tier}) - ${new Date(user.created_at).toLocaleDateString()}`);
      });
    }

    // Test 3: Test signup flow (with test email)
    console.log('\n3️⃣ Testing signup flow...');
    const testEmail = `test+${Date.now()}@attributeai.com`;
    const testPassword = 'Test123!@#';

    console.log(`Creating test user: ${testEmail}`);

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          company: 'Test Company',
          industry: 'Technology'
        }
      }
    });

    if (signupError) {
      console.error('❌ Signup failed:', signupError.message);
      return;
    }

    console.log('✅ Signup successful');
    console.log(`User ID: ${signupData.user?.id}`);
    console.log(`Email confirmed: ${signupData.user?.email_confirmed_at ? 'Yes' : 'No'}`);

    // Wait a moment for trigger to execute
    console.log('\n⏳ Waiting for trigger to create profile...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 4: Check if profile was created
    console.log('\n4️⃣ Checking if profile was created...');
    
    if (signupData.user?.id) {
      const { data: userProfile, error: profileCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signupData.user.id)
        .single();

      if (profileCheckError) {
        if (profileCheckError.code === 'PGRST116') {
          console.error('❌ Profile not created - trigger not working');
          console.log('💡 Run the SQL fix script in Supabase');
        } else {
          console.error('❌ Error checking profile:', profileCheckError.message);
        }
      } else {
        console.log('✅ Profile created successfully!');
        console.log('Profile details:');
        console.log(`  - Email: ${userProfile.email}`);
        console.log(`  - Name: ${userProfile.first_name} ${userProfile.last_name}`);
        console.log(`  - Company: ${userProfile.company}`);
        console.log(`  - Industry: ${userProfile.industry}`);
        console.log(`  - Subscription: ${userProfile.subscription_tier}`);
        console.log(`  - Status: ${userProfile.subscription_status}`);
        console.log(`  - Trial ends: ${userProfile.trial_ends_at}`);
        console.log(`  - Monthly quota: ${userProfile.monthly_keyword_quota}`);
      }
    }

    // Test 5: Test user profile record
    console.log('\n5️⃣ Checking user_profiles table...');
    
    if (signupData.user?.id) {
      const { data: userProfileRecord, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', signupData.user.id)
        .single();

      if (userProfileError) {
        if (userProfileError.code === 'PGRST116') {
          console.log('⚠️  user_profiles record not created (optional)');
        } else {
          console.error('❌ Error checking user_profiles:', userProfileError.message);
        }
      } else {
        console.log('✅ user_profiles record created');
        console.log(`  - Timezone: ${userProfileRecord.timezone}`);
        console.log(`  - Language: ${userProfileRecord.language}`);
        console.log(`  - Marketing emails: ${userProfileRecord.marketing_emails}`);
      }
    }

    // Test 6: Test quota functions
    console.log('\n6️⃣ Testing quota functions...');
    
    if (signupData.user?.id) {
      try {
        const { data: quotaInfo, error: quotaError } = await supabase
          .rpc('get_user_quota_info', { user_uuid: signupData.user.id });

        if (quotaError) {
          console.error('❌ Quota function error:', quotaError.message);
        } else {
          console.log('✅ Quota function working');
          console.log('Quota info:', quotaInfo);
        }
      } catch (err) {
        console.error('❌ Quota function failed:', err.message);
      }
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📋 Summary:');
    console.log('- If profile creation failed, run: fix-supabase-user-creation.sql');
    console.log('- If functions failed, check RLS policies');
    console.log('- Test user will need email confirmation in production');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the test
if (require.main === module) {
  testUserCreation()
    .then(() => {
      console.log('\n✅ Test script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testUserCreation };
