// src/components/auth/EnhancedLogin.js
// Enhanced Login Component with Social Sign-In

import React, { useState } from 'react';
import { useAuth } from './EnhancedSupabaseAuthContext';

const SocialButton = ({ provider, icon, label, loading, onClick }) => {
  const getProviderColor = (provider) => {
    const colors = {
      google: '#4285f4',
      github: '#333',
      facebook: '#1877f2'
    };
    return colors[provider] || '#666';
  };

  return (
    <button
      onClick={() => onClick(provider)}
      disabled={loading}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        background: loading ? '#f9fafb' : '#fff',
        color: '#374151',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: loading ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.target.style.borderColor = getProviderColor(provider);
          e.target.style.backgroundColor = '#f9fafb';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.backgroundColor = '#fff';
        }
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span style={{ fontSize: '1rem' }}>{icon}</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

const EnhancedLogin = ({ onSwitchToSignup, onSuccess }) => {
  const { signInWithEmail, signInWithProvider, isDemo } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [error, setError] = useState('');

  const socialProviders = [
    {
      name: 'google',
      label: 'Continue with Google',
      icon: '🔍'
    },
    {
      name: 'github',
      label: 'Continue with GitHub',
      icon: '🐙'
    },
    {
      name: 'facebook',
      label: 'Continue with Facebook',
      icon: '📘'
    }
  ];

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);
    setError('');
    
    try {
      const { data, error } = await signInWithProvider(provider);
      
      if (error) {
        setError(error.message || `Failed to sign in with ${provider}`);
      } else if (data) {
        onSuccess?.();
      }
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleEmailSignIn = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await signInWithEmail(formData.email, formData.password);
      
      if (error) {
        setError(error.message || 'Failed to sign in');
      } else if (data) {
        onSuccess?.();
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user types
  };
  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
        <p style={{
          color: '#6b7280',
          margin: 0,
          fontSize: '0.875rem'
        }}>
          Sign in to your marketing intelligence platform
        </p>
        {isDemo && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#92400e'
          }}>
            Demo Mode - Database not connected
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#fef2f2',
          border: '1px solid #f87171',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* Social Sign-In Buttons */}
      <div style={{ marginBottom: '1.5rem' }}>
        {socialProviders.map((provider) => (
          <SocialButton
            key={provider.name}
            provider={provider.name}
            icon={provider.icon}
            label={provider.label}
            loading={socialLoading === provider.name}
            onClick={handleSocialSignIn}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        <span style={{
          padding: '0 1rem',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          or continue with email
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>

      {/* Email Sign-In Form */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            placeholder="you@company.com"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            placeholder="Enter your password"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleEmailSignIn();
              }
            }}
          />
        </div>

        <button
          onClick={handleEmailSignIn}
          disabled={loading || !formData.email || !formData.password}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#6b7280',
          fontSize: '0.875rem',
          margin: 0
        }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
          >
            Sign up here
          </button>
        </p>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLogin;