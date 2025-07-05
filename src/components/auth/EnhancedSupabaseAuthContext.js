// src/components/auth/EnhancedSupabaseAuthContext.js
// Enhanced Authentication Context with Social Sign-In

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import SocialAuthService from '../../services/SocialAuthService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        setIsSupabaseConnected(!error);
      } catch (error) {
        console.log('Supabase not connected, using demo mode');
        setIsSupabaseConnected(false);
      }
    };
    
    checkConnection();
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (isSupabaseConnected) {
          // Use Supabase authentication
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user && mounted) {
            const { profile } = await SocialAuthService.getCurrentUser();
            setUser(session.user);
            setProfile(profile);
          }
        } else {
          // Fallback to localStorage demo mode
          const demoUser = localStorage.getItem('attributeai-demo-user');
          if (demoUser && mounted) {
            const userData = JSON.parse(demoUser);
            setUser(userData);
            setProfile(userData.profile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener for Supabase
    let authListener = null;
    if (isSupabaseConnected) {
      authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          const { profile } = await SocialAuthService.getCurrentUser();
          setUser(session.user);
          setProfile(profile);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
    }

    return () => {
      mounted = false;
      if (authListener) {
        authListener.data?.subscription?.unsubscribe();
      }
    };
  }, [isSupabaseConnected]);

  // Social Sign-In
  const signInWithProvider = async (provider) => {
    try {
      if (isSupabaseConnected) {
        const { data, error } = await SocialAuthService.signInWithProvider(provider);
        if (error) throw error;
        
        // The auth state change listener will handle setting user/profile
        return { data, error: null };
      } else {
        // Demo mode - simulate social sign-in
        const demoUser = {
          id: `demo-${provider}-${Date.now()}`,
          email: `demo@${provider}.com`,
          user_metadata: {
            first_name: 'Demo',
            last_name: 'User',
            avatar_url: `https://via.placeholder.com/150?text=${provider.toUpperCase()}`,
            provider: provider
          },
          app_metadata: {
            provider: provider
          }
        };

        const demoProfile = {
          ...demoUser,
          first_name: 'Demo',
          last_name: 'User',
          company: `${provider} Company`,
          provider: provider,
          subscription_tier: 'free',
          quota_used: 0,
          quota_limit: 1000
        };

        const userData = { ...demoUser, profile: demoProfile };
        localStorage.setItem('attributeai-demo-user', JSON.stringify(userData));
        
        setUser(demoUser);
        setProfile(demoProfile);
        
        return { data: { user: demoUser }, error: null };
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      return { data: null, error };
    }
  };
  // Email Sign-In
  const signInWithEmail = async (email, password) => {
    try {
      if (isSupabaseConnected) {
        const { data, error } = await SocialAuthService.signInWithEmail(email, password);
        if (error) throw error;
        
        return { data, error: null };
      } else {
        // Demo mode
        const demoUser = {
          id: `demo-email-${Date.now()}`,
          email: email,
          user_metadata: {
            first_name: 'Demo',
            last_name: 'User'
          }
        };

        const demoProfile = {
          ...demoUser,
          first_name: 'Demo',
          last_name: 'User',
          subscription_tier: 'free',
          quota_used: 0,
          quota_limit: 1000
        };

        const userData = { ...demoUser, profile: demoProfile };
        localStorage.setItem('attributeai-demo-user', JSON.stringify(userData));
        
        setUser(demoUser);
        setProfile(demoProfile);
        
        return { data: { user: demoUser }, error: null };
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { data: null, error };
    }
  };

  // Email Sign-Up
  const signUpWithEmail = async (userData) => {
    try {
      if (isSupabaseConnected) {
        const { data, error } = await SocialAuthService.signUpWithEmail(userData);
        if (error) throw error;
        
        return { data, error: null };
      } else {
        // Demo mode
        const demoUser = {
          id: `demo-signup-${Date.now()}`,
          email: userData.email,
          user_metadata: {
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        };

        const demoProfile = {
          ...demoUser,
          first_name: userData.firstName,
          last_name: userData.lastName,
          company: userData.company,
          subscription_tier: 'free',
          quota_used: 0,
          quota_limit: 1000
        };

        const userDataObj = { ...demoUser, profile: demoProfile };
        localStorage.setItem('attributeai-demo-user', JSON.stringify(userDataObj));
        
        setUser(demoUser);
        setProfile(demoProfile);
        
        return { data: { user: demoUser }, error: null };
      }
    } catch (error) {
      console.error('Email sign-up error:', error);
      return { data: null, error };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      if (isSupabaseConnected) {
        const { error } = await SocialAuthService.signOut();
        if (error) throw error;
      } else {
        localStorage.removeItem('attributeai-demo-user');
      }
      
      setUser(null);
      setProfile(null);
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  // Update Profile
  const updateProfile = async (updates) => {
    try {
      if (isSupabaseConnected && user) {
        const { data, error } = await supabase
          .from('users')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        setProfile(data);
        return { data, error: null };
      } else if (profile) {
        // Demo mode
        const updatedProfile = { ...profile, ...updates };
        const userData = { ...user, profile: updatedProfile };
        localStorage.setItem('attributeai-demo-user', JSON.stringify(userData));
        
        setProfile(updatedProfile);
        return { data: updatedProfile, error: null };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  // Update Quota Usage
  const updateQuotaUsage = async (increment = 1) => {
    try {
      if (profile) {
        const newUsage = (profile.quota_used || 0) + increment;
        await updateProfile({ quota_used: newUsage });
        return newUsage;
      }
      return 0;
    } catch (error) {
      console.error('Update quota usage error:', error);
      return profile?.quota_used || 0;
    }
  };

  // Check if user has quota remaining
  const hasQuotaRemaining = () => {
    if (!profile) return false;
    const used = profile.quota_used || 0;
    const limit = profile.quota_limit || 1000;
    return used < limit;
  };

  // Get remaining quota
  const getRemainingQuota = () => {
    if (!profile) return 0;
    const used = profile.quota_used || 0;
    const limit = profile.quota_limit || 1000;
    return Math.max(0, limit - used);
  };

  const value = {
    // State
    user,
    profile,
    loading,
    isSupabaseConnected,
    
    // Authentication methods
    signInWithProvider,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    
    // Profile methods
    updateProfile,
    
    // Quota management
    updateQuotaUsage,
    hasQuotaRemaining,
    getRemainingQuota,
    
    // Utility
    isAuthenticated: !!user,
    isDemo: !isSupabaseConnected
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;