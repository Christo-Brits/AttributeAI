// Check if users are being created in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function checkUsers() {
  console.log('🔍 Checking Supabase users table...\n');
  
  try {
    // Check auth users (this might be limited)
    console.log('1️⃣  Checking authentication users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Cannot access auth users with anon key (expected)');
    } else {
      console.log('✅ Auth users found:', authUsers?.users?.length || 0);
    }

    // Check our users table
    console.log('\n2️⃣  Checking public.users table...');
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at, subscription_tier')
      .order('created_at', { ascending: false })
      .limit(10);

    if (publicError) {
      console.error('❌ Error accessing users table:', publicError.message);
    } else {
      console.log('✅ Public users found:', publicUsers?.length || 0);
      
      if (publicUsers && publicUsers.length > 0) {
        console.log('\n📋 Recent users:');
        publicUsers.forEach(user => {
          console.log(`   • ${user.email} (${user.first_name} ${user.last_name}) - ${user.subscription_tier} - ${user.created_at}`);
        });
      } else {
        console.log('   No users found in public.users table');
      }
    }

    // Check for any test users we just created
    console.log('\n3️⃣  Checking for test users...');
    const { data: testUsers, error: testError } = await supabase
      .from('users')
      .select('*')
      .like('email', '%test%')
      .or('email.like.%example%,email.like.%gmail%');

    if (testError) {
      console.error('❌ Error checking test users:', testError.message);
    } else {
      console.log('✅ Test users found:', testUsers?.length || 0);
      if (testUsers && testUsers.length > 0) {
        testUsers.forEach(user => {
          console.log(`   • ${user.email} - Created: ${user.created_at}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkUsers();
