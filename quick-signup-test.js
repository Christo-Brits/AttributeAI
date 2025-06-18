// Targeted test with proper email format
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function quickTest() {
  console.log('🧪 Quick Signup Test with proper email...\n');
  
  const testUser = {
    email: 'testuser123@gmail.com',
    password: 'TestPassword123!'
  };

  try {
    console.log('Testing signup with:', testUser.email);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password
    });

    if (authError) {
      console.error('❌ Signup failed:', authError.message);
      console.log('\n📝 Error details:', authError);
      
      // Check Supabase configuration
      console.log('\n🔍 Checking Supabase configuration...');
      const { data: configTest } = await supabase.auth.getSession();
      console.log('Session check completed');
      
    } else {
      console.log('✅ Signup successful!');
      console.log('User ID:', authData.user?.id);
      console.log('Email confirmed:', authData.user?.email_confirmed_at);
      console.log('Confirmation sent:', authData.user?.confirmation_sent_at);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

quickTest();
