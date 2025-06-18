// Test if database trigger is working
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function testDatabaseTrigger() {
  console.log('🧪 Testing if database trigger is working...\n');
  
  const testEmail = `trigger-test-${Date.now()}@example.com`;
  
  try {
    console.log('1️⃣  Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          first_name: 'Database',
          last_name: 'Test'
        }
      }
    });

    if (authError) {
      console.error('❌ Auth creation failed:', authError.message);
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Wait a moment for trigger to execute
    console.log('\n2️⃣  Waiting for database trigger...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('3️⃣  Checking if public user was auto-created...');
    const { data: publicUser, error: publicError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (publicError || !publicUser) {
      console.log('❌ DATABASE TRIGGER NOT WORKING');
      console.log('   Public user not found - you need to apply the database fix');
      console.log('   Action: Copy supabase-signup-fix.sql to Supabase SQL Editor and run it');
      console.log('   Error:', publicError?.message || 'User not found');
    } else {
      console.log('✅ DATABASE TRIGGER WORKING!');
      console.log('   Public user auto-created successfully');
      console.log('   User details:');
      console.log('   • ID:', publicUser.id);
      console.log('   • Email:', publicUser.email);
      console.log('   • Name:', `${publicUser.first_name} ${publicUser.last_name}`);
      console.log('   • Tier:', publicUser.subscription_tier);
      console.log('   • Quota:', publicUser.monthly_keyword_quota);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDatabaseTrigger();
