// Check current OAuth configuration and URLs
// Run this to diagnose the redirect issue

const checkOAuthConfig = () => {
  console.log('🔍 OAUTH CONFIGURATION DIAGNOSIS');
  console.log('================================');
  console.log('');
  
  console.log('📍 Current URL Info:');
  console.log('Window Location:', window.location.href);
  console.log('Window Origin:', window.location.origin);
  console.log('Current Host:', window.location.host);
  console.log('');
  
  console.log('🔧 Environment Variables:');
  console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
  console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
  console.log('Auth Callback URL:', process.env.REACT_APP_AUTH_CALLBACK_URL);
  console.log('Redirect URL:', process.env.REACT_APP_REDIRECT_URL);
  console.log('Site URL:', process.env.REACT_APP_SITE_URL);
  console.log('');
  
  console.log('✅ Expected Redirect URLs in Google Console:');
  console.log('1. https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback (MAIN)');
  console.log('2. https://leafy-biscotti-c87e93.netlify.app/auth/callback (APP)');
  console.log('3. http://localhost:3000/auth/callback (DEV)');
  console.log('');
  
  console.log('🎯 Main Issue Likely:');
  console.log('- Google OAuth Client ID redirect URLs not updated for production');
  console.log('- Still pointing to localhost instead of production domain');
  console.log('');
  
  console.log('🛠️ Quick Fix:');
  console.log('1. Open Google Cloud Console');
  console.log('2. Update OAuth redirect URLs');
  console.log('3. Save changes');
  console.log('4. Clear browser cache');
  console.log('5. Test again');
  console.log('');
  
  // Check if we're in production
  const isProduction = window.location.hostname !== 'localhost';
  const expectedDomain = isProduction ? 'leafy-biscotti-c87e93.netlify.app' : 'localhost:3000';
  
  console.log(`🌐 Current Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`Expected Domain: ${expectedDomain}`);
  console.log(`Actual Domain: ${window.location.host}`);
  console.log('');
  
  if (isProduction && window.location.host !== 'leafy-biscotti-c87e93.netlify.app') {
    console.log('⚠️ WARNING: Production domain mismatch!');
  }
  
  // Test Google OAuth URL generation
  try {
    const testURL = new URL('https://accounts.google.com/oauth/authorize');
    testURL.searchParams.set('client_id', process.env.REACT_APP_GOOGLE_CLIENT_ID || 'MISSING');
    testURL.searchParams.set('redirect_uri', 'https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback');
    testURL.searchParams.set('response_type', 'code');
    testURL.searchParams.set('scope', 'openid email profile');
    
    console.log('🔗 Google OAuth URL that SHOULD work:');
    console.log(testURL.toString());
  } catch (e) {
    console.log('❌ Error generating OAuth URL:', e.message);
  }
};

// Run the diagnosis
checkOAuthConfig();

// Also check local storage for any cached auth data
console.log('💾 Local Storage Auth Data:');
console.log('Supabase Session:', localStorage.getItem('sb-xpyfoutwwjslivrmbflm-auth-token'));
console.log('AttributeAI User:', localStorage.getItem('attributeai_user_profile'));
