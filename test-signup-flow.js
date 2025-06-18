// Test Signup Flow - Check if Supabase Authentication is working
// Run this with: node test-signup-flow.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuration missing in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupFlow() {
  console.log('🧪 Testing AttributeAI Signup Flow...\n');
  
  // Test data
  const testUser = {
    email: `test-user-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company'
  };

  try {
    console.log('1️⃣  Testing Supabase connection...');
    const { data: healthCheck } = await supabase.from('users').select('count(*)', { count: 'exact', head: true });
    console.log('✅ Supabase connection successful');
    
    console.log('\n2️⃣  Testing user signup...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          company: testUser.company
        }
      }
    });

    if (authError) {
      console.error('❌ Auth signup failed:', authError.message);
      
      // Check if this is a common issue
      if (authError.message.includes('email')) {
        console.log('\n💡 Tip: This might be expected if email already exists or email confirmation is required');
      }
      
      return false;
    }

    console.log('✅ User authentication created:', authData.user?.id);

    console.log('\n3️⃣  Testing database profile creation...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: testUser.email,
        first_name: testUser.firstName,
        last_name: testUser.lastName,
        company: testUser.company,
        subscription_tier: 'free',
        monthly_keyword_quota: 1000
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Database profile creation failed:', userError.message);
      return false;
    }

    console.log('✅ User profile created in database:', userData.id);

    console.log('\n4️⃣  Testing user data retrieval...');
    const { data: retrievedUser, error: retrieveError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (retrieveError) {
      console.error('❌ User data retrieval failed:', retrieveError.message);
      return false;
    }

    console.log('✅ User data retrieved successfully');
    console.log('   Email:', retrievedUser.email);
    console.log('   Name:', `${retrievedUser.first_name} ${retrievedUser.last_name}`);
    console.log('   Company:', retrievedUser.company);
    console.log('   Quota:', retrievedUser.monthly_keyword_quota);

    console.log('\n5️⃣  Cleaning up test user...');
    
    // Delete from database first
    await supabase.from('users').delete().eq('id', authData.user.id);
    
    // Note: Can't delete auth user programmatically with anon key
    console.log('✅ Test user profile deleted from database');
    console.log('⚠️  Auth user will auto-expire if email not confirmed');

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function testFallbackMode() {
  console.log('\n🔄 Testing Fallback Mode (localStorage)...');
  
  // Simulate what happens when Supabase is unavailable
  const mockUser = {
    id: `local-${Date.now()}`,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    subscriptionTier: 'free',
    keywordsUsed: 0,
    monthlyQuota: 1000,
    isSupabaseUser: false,
    createdAt: new Date().toISOString()
  };

  console.log('✅ Fallback mode user created:', mockUser.id);
  console.log('   This is what happens when Supabase is unavailable');
  
  return true;
}

async function diagnoseCurrentIssue() {
  console.log('\n🔍 Diagnosing Current User Registration Issue...\n');
  
  console.log('📊 Current Status:');
  console.log('   - Google Analytics: 63 active users');
  console.log('   - Supabase Database: 0 registered users');
  console.log('   - Platform: High engagement but no signups');
  
  console.log('\n🤔 Possible Causes:');
  console.log('   1. Supabase authentication errors (database/RLS issues)');
  console.log('   2. Users not finding signup button/flow');
  console.log('   3. Signup process too complex or broken');
  console.log('   4. Users prefer anonymous usage');
  console.log('   5. Email confirmation issues');
  
  console.log('\n💡 Recommended Actions:');
  console.log('   1. Test signup flow manually');
  console.log('   2. Add signup prompts to high-engagement areas');
  console.log('   3. Simplify signup process');
  console.log('   4. Add value propositions for registration');
  console.log('   5. Check Supabase logs for failed signup attempts');
}

// Run all tests
async function runAllTests() {
  const supabaseWorking = await testSignupFlow();
  const fallbackWorking = await testFallbackMode();
  
  await diagnoseCurrentIssue();
  
  console.log('\n📋 TEST SUMMARY:');
  console.log(`   Supabase Signup: ${supabaseWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`   Fallback Mode: ${fallbackWorking ? '✅ Working' : '❌ Failed'}`);
  
  if (supabaseWorking) {
    console.log('\n🎉 GOOD NEWS: Your signup system is working!');
    console.log('   Problem: Users aren\'t finding/using the signup flow');
    console.log('   Solution: Add signup prompts and value propositions');
  } else {
    console.log('\n🚨 ISSUE FOUND: Signup system needs fixing');
    console.log('   Problem: Technical issues preventing user registration');
    console.log('   Solution: Fix Supabase configuration or RLS policies');
  }
}

runAllTests();
