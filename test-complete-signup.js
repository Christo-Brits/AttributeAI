// Create a test user to verify database trigger is working
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function createTestUser() {
  console.log('🧪 Creating test user to verify database trigger...\n');
  
  const testEmail = `dbtest-${Date.now()}@attributeai.app`;
  
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

    // Wait for trigger
    console.log('\n2️⃣  Waiting 3 seconds for database trigger...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('3️⃣  Checking if user was auto-created in public.users...');
    const { data: publicUser, error: publicError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (publicError || !publicUser) {
      console.log('❌ TRIGGER NOT WORKING');
      console.log('   Error:', publicError?.message || 'User not found');
      console.log('   The database fix may need to be re-applied');
    } else {
      console.log('✅ DATABASE TRIGGER WORKING PERFECTLY!');
      console.log('   Public user auto-created:');
      console.log('   • ID:', publicUser.id);
      console.log('   • Email:', publicUser.email);
      console.log('   • Name:', `${publicUser.first_name} ${publicUser.last_name}`);
      console.log('   • Tier:', publicUser.subscription_tier);
      console.log('   • Quota:', publicUser.monthly_keyword_quota);
      
      console.log('\n🎉 YOUR SIGNUP SYSTEM IS READY!');
      console.log('   Users who signup will now be automatically created in the database');
      console.log('   Time to implement conversion prompts and capture those 63 anonymous users!');
    }

    console.log('\n4️⃣  Checking total users in database...');
    const { data: allUsers, error: countError } = await supabase
      .from('users')
      .select('id, email, created_at, subscription_tier')
      .order('created_at', { ascending: false });

    if (countError) {
      console.log('❌ Error counting users:', countError.message);
    } else {
      console.log(`✅ Total users in database: ${allUsers.length}`);
      if (allUsers.length > 0) {
        console.log('   Recent users:');
        allUsers.slice(0, 3).forEach(user => {
          console.log(`   • ${user.email} (${user.subscription_tier}) - ${user.created_at}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createTestUser();
