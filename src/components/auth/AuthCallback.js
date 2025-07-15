// src/components/auth/AuthCallback.js
// OAuth Callback Handler for Social Sign-In

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import SocialAuthService from '../../services/SocialAuthService';

const AuthCallback = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  // Mock navigation for testing
  const navigate = (path) => {
    console.log(`Would navigate to: ${path}`);
    window.location.href = path;
  };

  // Mock search params for testing
  const getSearchParam = (name) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
    return null;
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for OAuth callback parameters
        const code = getSearchParam('code');
        const error_description = getSearchParam('error_description');
        
        if (error_description) {
          setError(error_description);
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        // Exchange code for session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (sessionError) {
          console.error('Session exchange error:', sessionError);
          setError(sessionError.message);
          setStatus('error');
          return;
        }

        if (data.user) {
          // Check if user profile exists, create if not
          const { data: profile, error: profileError } = await SocialAuthService.getUserProfile(data.user.id);
          
          if (!profile && !profileError) {
            // Create profile for new social user
            await SocialAuthService.createUserProfile(data.user, {
              createdVia: data.user.app_metadata?.provider || 'oauth'
            });
          }

          setStatus('success');
          
          // Redirect to dashboard after brief success message
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setError('No user data received');
          setStatus('error');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, []);

  // Handle error state - redirect to login after delay
  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              Completing Sign-In...
            </h2>
            <p style={{
              color: '#6b7280',
              margin: 0
            }}>
              Please wait while we set up your account
            </p>
          </div>
        );

      case 'success':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <span style={{
                color: '#fff',
                fontSize: '1.5rem'
              }}>
                ✓
              </span>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              Welcome to AttributeAI!
            </h2>
            <p style={{
              color: '#6b7280',
              margin: 0
            }}>
              Redirecting you to your dashboard...
            </p>
          </div>
        );

      case 'error':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{
                color: '#fff',
                fontSize: '1.5rem'
              }}>
                ✕
              </span>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              Sign-In Failed
            </h2>
            <p style={{
              color: '#6b7280',
              margin: '0 0 1rem 0'
            }}>
              {error || 'Something went wrong during authentication'}
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.75rem',
              margin: '1rem 0 0 0'
            }}>
              Automatically redirecting in 5 seconds...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '3rem 2rem',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 25px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AttributeAI
            </h1>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;