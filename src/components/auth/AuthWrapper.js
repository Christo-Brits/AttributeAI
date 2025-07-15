import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AttributeAI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authMode === 'login' ? (
          <LoginPage
            onLoginSuccess={() => {
              // Authentication context will handle the state update
            }}
            onSwitchToSignup={() => setAuthMode('signup')}
          />
        ) : (
          <SignupPage
            onSignupComplete={() => {
              // Authentication context will handle the state update
            }}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </>
    );
  }

  return children;
};

const AuthenticatedApp = ({ children }) => {
  return (
    <AuthProvider>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </AuthProvider>
  );
};

export default AuthenticatedApp;