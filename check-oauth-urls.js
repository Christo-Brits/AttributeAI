// Run this in your browser console to check OAuth redirect URLs

console.log(`
🔍 OAuth Redirect URL Check:

Current domain: ${window.location.origin}
Expected callback: ${window.location.origin}/auth/callback

✅ Make sure this URL is added to:
1. Google Cloud Console OAuth settings
2. Supabase Authentication settings

For localhost testing:
- http://localhost:3000/auth/callback

For Netlify testing:
- https://leafy-biscotti-c87e93.netlify.app/auth/callback
`);
