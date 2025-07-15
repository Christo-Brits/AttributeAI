import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, createUserProfile, onAuthStateChange, isSupabaseConfigured } from '../../lib/supabase';
import secureStorage from '../../utils/SecureStorage'; // SECURE: Use encrypted storage

// Session timeout: 30 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000;

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
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Session timeout management - SECURE VERSION
  const updateLastActivity = () => {
    if (isAuthenticated) {
      secureStorage.setItem('lastActivity', Date.now(), { 
        expiresAt: Date.now() + SESSION_TIMEOUT 
      });
    }
  };

  const checkSessionTimeout = () => {
    if (!isAuthenticated) return;
    
    const lastActivity = secureStorage.getItem('lastActivity');
    if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
      console.log('Session expired due to inactivity');
      logout();
      return true;
    }
    return false;
  };

  // Set up session timeout checking and activity tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial activity timestamp
    updateLastActivity();

    // Check session timeout every minute
    const timeoutCheck = setInterval(checkSessionTimeout, 60000);

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const throttledUpdateActivity = throttle(updateLastActivity, 30000); // Update at most every 30 seconds

    activityEvents.forEach(event => {
      document.addEventListener(event, throttledUpdateActivity, true);
    });

    return () => {
      clearInterval(timeoutCheck);
      activityEvents.forEach(event => {
        document.removeEventListener(event, throttledUpdateActivity, true);
      });
    };
  }, [isAuthenticated]);

  // Simple throttle function
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      if (isSupabaseConfigured()) {
        // Set up Supabase auth state listener
        const unsubscribe = onAuthStateChange(async (user) => {
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
            
            // Load user profile
            try {
              const profile = await loadUserProfile(user.id);
              setUserProfile(profile);
            } catch (error) {
              console.error('Error loading user profile:', error);
            }
          } else {
            setUser(null);
            setUserProfile(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
        });

        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          try {
            const profile = await loadUserProfile(session.user.id);
            setUserProfile(profile);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        }

        return unsubscribe;
      } else {
        // For development without Supabase, require manual account creation
        console.log('⚠️ Development mode: Supabase not configured');
        // Don't auto-create demo accounts - users must register
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    if (!isSupabaseConfigured()) {
      const profile = JSON.parse(localStorage.getItem('attributeai_user_profile') || '{}');
      return profile;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const signup = async (userData) => {
    try {
      if (isSupabaseConfigured()) {
        // Get current URL for proper verification redirect
        const redirectUrl = window.location.origin + '/dashboard';
        
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.full_name,
              first_name: userData.first_name,
              last_name: userData.last_name,
            },
            emailRedirectTo: redirectUrl // This fixes the verification redirect!
          }
        });

        if (error) throw error;

        if (data.user) {
          // Create user profile
          const profileData = await createUserProfile(data.user, {
            company: userData.company,
            website: userData.website,
            industry: userData.industry,
          });

          setUser(data.user);
          setUserProfile(profileData);
          setIsAuthenticated(true);

          return { user: data.user, profile: profileData };
        }
      } else {
        // Fallback to localStorage for development - with proper free tier setup
        const newUser = {
          id: `user_${Date.now()}`,
          email: userData.email,
          full_name: userData.full_name || `${userData.first_name} ${userData.last_name}`,
          first_name: userData.first_name,
          last_name: userData.last_name,
          company: userData.company,
          website: userData.website,
          industry: userData.industry,
          created_at: new Date().toISOString(),
          subscription_tier: 'free',
          monthly_usage: {
            keywords_analyzed: 0,
            content_generated: 0,
            attribution_queries: 0,
            last_reset: new Date().toISOString()
          },
          usage_limits: {
            keywords_per_month: 100,
            content_pieces_per_month: 5,
            attribution_queries_per_month: 50
          },
          features_enabled: ['basic_keyword_analysis', 'basic_content_generation', 'basic_attribution']
        };

        localStorage.setItem('attributeai_user_profile', JSON.stringify(newUser));
        setUser(newUser);
        setUserProfile(newUser);
        setIsAuthenticated(true);

        return { user: newUser, profile: newUser };
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);

          // Load user profile
          const profile = await loadUserProfile(data.user.id);
          setUserProfile(profile);

          return { user: data.user, profile };
        }
      } else {
        // Development mode fallback - allow creating test account
        console.log('⚠️ Supabase not configured - using localStorage fallback');
        
        // Check if this is a signup attempt (has userData properties) 
        if (typeof email === 'object' && email.email) {
          // This is likely a signup call, handle it
          const userData = email; // The "email" parameter is actually the full userData object
          const newUser = {
            id: `user_${Date.now()}`,
            email: userData.email,
            full_name: userData.full_name || `${userData.first_name} ${userData.last_name}`,
            first_name: userData.first_name,
            last_name: userData.last_name,
            company: userData.company,
            website: userData.website,
            industry: userData.industry,
            created_at: new Date().toISOString(),
            subscription_tier: 'free',
            monthly_usage: {
              keywords_analyzed: 0,
              content_generated: 0,
              attribution_queries: 0,
              last_reset: new Date().toISOString()
            },
            usage_limits: {
              keywords_per_month: 100,
              content_pieces_per_month: 5,
              attribution_queries_per_month: 50
            },
            features_enabled: ['basic_keyword_analysis', 'basic_content_generation', 'basic_attribution']
          };

          localStorage.setItem('attributeai_user_profile', JSON.stringify(newUser));
          setUser(newUser);
          setUserProfile(newUser);
          setIsAuthenticated(true);
          return { user: newUser, profile: newUser };
        }
        
        // Regular login attempt
        const storedUser = localStorage.getItem('attributeai_user_profile');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.email === email) {
            setUser(userData);
            setUserProfile(userData);
            setIsAuthenticated(true);
            return { user: userData, profile: userData };
          }
        }
        
        // If no existing account found, throw error - no test accounts allowed
        throw new Error('Invalid email or password. Please check your credentials or sign up for a new account.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        // Clear localStorage for development
        localStorage.removeItem('attributeai_user_profile');
      }

      // Clear session data
      localStorage.removeItem('lastActivity');
      
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if Supabase logout fails
      localStorage.removeItem('lastActivity');
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;

        setUserProfile(data);
        return data;
      } else {
        // Update localStorage
        const updatedProfile = { ...userProfile, ...updates };
        localStorage.setItem('attributeai_user_profile', JSON.stringify(updatedProfile));
        setUserProfile(updatedProfile);
        return updatedProfile;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const resetPassword = async (email) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Password reset not available in demo mode');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { message: 'Password reset email sent' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send password reset email');
    }
  };

  const value = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    signup,
    login,
    logout,
    updateProfile,
    resetPassword,
    isSupabaseConfigured: isSupabaseConfigured()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;