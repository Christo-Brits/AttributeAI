// src/components/auth/SocialAuthTest.js
// Simple test page for social authentication

import React, { useState } from 'react';
import { AuthProvider } from './EnhancedSupabaseAuthContext';
import EnhancedLogin from './EnhancedLogin';
import EnhancedSignup from './EnhancedSignup';

const SocialAuthTest = () => {
  const [view, setView] = useState('login');
  const [message, setMessage] = useState('');

  const handleSuccess = () => {
    setMessage('Authentication successful! Social auth is working.');
    console.log('✅ Social authentication test successful');
  };

  return (
    <AuthProvider>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem'
      }}>
        {/* Test Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#fff'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>
            🧪 Social Authentication Test
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Testing Google, GitHub, and Facebook sign-in integration
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div style={{
            maxWidth: '400px',
            margin: '0 auto 2rem auto',
            padding: '1rem',
            background: '#dcfce7',
            border: '1px solid #16a34a',
            borderRadius: '8px',
            color: '#166534',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Authentication Components */}
        {view === 'login' ? (
          <EnhancedLogin
            onSwitchToSignup={() => setView('signup')}
            onSuccess={handleSuccess}
          />
        ) : (
          <EnhancedSignup
            onSwitchToLogin={() => setView('login')}
            onSuccess={handleSuccess}
          />
        )}

        {/* Test Navigation */}
        <div style={{
          maxWidth: '400px',
          margin: '2rem auto',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setView('login')}
            style={{
              padding: '0.5rem 1rem',
              background: view === 'login' ? '#fff' : 'transparent',
              color: view === 'login' ? '#333' : '#fff',
              border: '1px solid #fff',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Test Login
          </button>
          <button
            onClick={() => setView('signup')}
            style={{
              padding: '0.5rem 1rem',
              background: view === 'signup' ? '#fff' : 'transparent',
              color: view === 'signup' ? '#333' : '#fff',
              border: '1px solid #fff',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Test Signup
          </button>
        </div>

        {/* Test Instructions */}
        <div style={{
          maxWidth: '600px',
          margin: '2rem auto',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: '#fff'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>🔧 Test Instructions:</h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li><strong>Demo Mode:</strong> All buttons should load and show demo placeholders</li>
            <li><strong>Social Buttons:</strong> Click should show "Connecting..." loading state</li>
            <li><strong>Email Forms:</strong> Should validate input and show appropriate errors</li>
            <li><strong>Error Handling:</strong> Invalid inputs should show helpful error messages</li>
            <li><strong>UI Consistency:</strong> Design should match AttributeAI branding</li>
          </ol>
          
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px'
          }}>
            <strong>✅ Expected Behavior (Demo Mode):</strong><br/>
            • Social buttons work and show simulated authentication<br/>
            • Email forms validate and create demo accounts<br/>
            • Success message appears on completion<br/>
            • No console errors in browser dev tools
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default SocialAuthTest;