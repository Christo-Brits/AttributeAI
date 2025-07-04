// OAuth Callback Handler
// Add this to your App.js or routing logic

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we're coming from an OAuth redirect
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Supabase OAuth returns tokens in the URL hash
        if (hashParams.get('access_token')) {
          console.log('✅ OAuth callback received');
          
          // Let Supabase handle the OAuth callback
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ OAuth error:', error);
            navigate('/login?error=' + encodeURIComponent(error.message));
          } else if (session) {
            console.log('✅ OAuth successful, user:', session.user.email);
            
            // Redirect to dashboard or intended destination
            const redirectTo = searchParams.get('redirectTo') || '/dashboard';
            navigate(redirectTo);
          }
        } else {
          // No OAuth tokens found, redirect to login
          console.log('❌ No OAuth tokens in URL');
          navigate('/login');
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        navigate('/login?error=' + encodeURIComponent('Authentication failed'));
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          margin: '0 auto 1rem',
          border: '3px solid #667eea',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
          Completing sign in...
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Please wait while we authenticate your account.
        </p>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;
