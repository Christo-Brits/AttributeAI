// Quick Supabase connection test
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not set properly');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('User profiles table accessible');
    
    // Test auth signup (this will show us if auth is properly configured)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (authError) {
      console.error('❌ Auth signup test error:', authError.message);
    } else {
      console.log('✅ Auth signup test successful (user may already exist)');
    }
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testConnection();
