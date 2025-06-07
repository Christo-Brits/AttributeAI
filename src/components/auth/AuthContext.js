import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check for stored session
      const session = localStorage.getItem('attributeai_session') || sessionStorage.getItem('attributeai_session');
      
      if (session) {
        const sessionData = JSON.parse(session);
        
        // Check if session is expired
        if (sessionData.expiresAt > Date.now()) {
          // Verify session with backend
          const response = await fetch('/api/verify-session', {
            headers: {
              'Authorization': `Bearer ${sessionData.token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
            
            // Store updated user data
            localStorage.setItem('attributeai_user', JSON.stringify(userData));
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuth();
    }
    
    setIsLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Store session
        const sessionData = {
          token: data.token,
          expiresAt: Date.now() + (credentials.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
        };

        if (credentials.rememberMe) {
          localStorage.setItem('attributeai_session', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('attributeai_session', JSON.stringify(sessionData));
        }

        localStorage.setItem('attributeai_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Auto-login after signup
        const sessionData = {
          token: data.token,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        sessionStorage.setItem('attributeai_session', JSON.stringify(sessionData));
        localStorage.setItem('attributeai_user', JSON.stringify(data.user));
        
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('attributeai_session');
    sessionStorage.removeItem('attributeai_session');
    localStorage.removeItem('attributeai_user');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('attributeai_user', JSON.stringify(newUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;