// Quick database trigger test with proper email
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function quickTriggerTest() {
  console.log('🧪 Quick Database Trigger Test\n');
  
  try {
    // Try to create a user with proper email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'triggertest@gmail.com',
      password: 'TestPassword123!',
      options: {
        data: {
          first_name: 'Trigger',
          last_name: 'Test'
        }
      }
    });

    if (authError) {
      console.log('Auth error (might be expected if user exists):', authError.message);
      return;
    }

    console.log('✅ Auth user created/exists:', authData.user?.id);

    // Check public users table
    setTimeout(async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select('count(*)', { count: 'exact', head: true });

      if (error) {
        console.log('❌ DATABASE TRIGGER NOT APPLIED YET');
        console.log('   Cannot access users table - you need to apply the database fix');
        console.log('   Action: Copy supabase-signup-fix.sql to Supabase SQL Editor');
      } else {
        console.log('✅ DATABASE ACCESSIBLE');
        console.log('   Users table exists and accessible');
        console.log('   Total users in database:', users || 0);
        
        if (users === 0) {
          console.log('⚠️  No users in database yet - trigger may not be working');
          console.log('   Apply database fix to auto-create user profiles');
        }
      }
    }, 2000);

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

quickTriggerTest();
