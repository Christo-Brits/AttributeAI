// OAuth Debug Test
// Run this in your browser console to test OAuth configuration

const testOAuth = async () => {
  console.log('🔍 Testing OAuth Configuration...\n');
  
  // Check environment
  console.log('📍 Current URL:', window.location.origin);
  console.log('🔗 Expected callback:', `${window.location.origin}/auth/callback`);
  console.log('🌐 Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
  
  // Import supabase
  const { supabase } = await import('./src/lib/supabase');
  
  // Check if supabase is configured
  console.log('\n✅ Supabase configured:', !!supabase);
  
  // Test Google OAuth
  console.log('\n🚀 Attempting Google OAuth...');
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile'
      }
    });
    
    if (error) {
      console.error('❌ OAuth Error:', error);
    } else {
      console.log('✅ OAuth initiated successfully!');
      console.log('📋 OAuth data:', data);
    }
  } catch (err) {
    console.error('❌ Caught error:', err);
  }
};

// Instructions
console.log(`
📝 To test OAuth:
1. Open your browser console (F12)
2. Copy and paste this entire script
3. Run: testOAuth()
4. Check the console output for any errors
`);

// Export for browser console
window.testOAuth = testOAuth;
