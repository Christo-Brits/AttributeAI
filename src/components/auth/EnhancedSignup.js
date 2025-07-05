// src/components/auth/EnhancedSignup.js
// Enhanced Signup Component with Social Sign-In

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
          <span>Creating account...</span>
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

const EnhancedSignup = ({ onSwitchToLogin, onSuccess }) => {
  const { signUpWithEmail, signInWithProvider, isDemo } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const socialProviders = [
    {
      name: 'google',
      label: 'Sign up with Google',
      icon: '🔍'
    },
    {
      name: 'github',
      label: 'Sign up with GitHub',
      icon: '🐙'
    },
    {
      name: 'facebook',
      label: 'Sign up with Facebook',
      icon: '📘'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);
    setErrors({});
    
    try {
      const { data, error } = await signInWithProvider(provider);
      
      if (error) {
        setErrors({ general: error.message || `Failed to sign up with ${provider}` });
      } else if (data) {
        onSuccess?.();
      }
    } catch (err) {
      setErrors({ general: `Failed to sign up with ${provider}. Please try again.` });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleEmailSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await signUpWithEmail(formData);
      
      if (error) {
        setErrors({ general: error.message || 'Failed to create account' });
      } else if (data) {
        onSuccess?.();
      }
    } catch (err) {
      setErrors({ general: 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
          Create your account and unlock unlimited marketing intelligence
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
      {errors.general && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#fef2f2',
          border: '1px solid #f87171',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '0.875rem'
        }}>
          {errors.general}
        </div>
      )}

      {/* Social Sign-Up Buttons */}
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
          or create with email
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>

      {/* Email Sign-Up Form */}
      <div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.firstName ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              placeholder="John"
            />
            {errors.firstName && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                {errors.firstName}
              </span>
            )}
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.lastName ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              placeholder="Doe"
            />
            {errors.lastName && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                {errors.lastName}
              </span>
            )}
          </div>
        </div>

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
              border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none'
            }}
            placeholder="you@company.com"
          />
          {errors.email && (
            <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Company (Optional)
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => updateField('company', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none'
            }}
            placeholder="Your Company"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
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
              border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none'
            }}
            placeholder="Create a strong password"
          />
          {errors.password && (
            <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
              {errors.password}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none'
            }}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <button
          onClick={handleEmailSignUp}
          disabled={loading}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#6b7280',
          fontSize: '0.875rem',
          margin: 0
        }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default EnhancedSignup;