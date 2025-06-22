// Enhanced Real Supabase Authentication Context
// Improved user creation and error handling

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

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
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        }
        
        if (mounted) {
          setSession(session);
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

      setSession(session);
      setError(null);
      
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUserProfile(session.user.id);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile from database with retries
  const loadUserProfile = async (userId, retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      console.log(`Loading user profile for ${userId}, attempt ${retryCount + 1}`);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User not found - this should be created by trigger, but let's create manually
          console.log('User profile not found, creating...');
          await createUserProfile(userId);
          return;
        }
        throw error;
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          company: data.company,
          industry: data.industry,
          websiteUrl: data.website_url,
          subscriptionTier: data.subscription_tier || 'free',
          subscriptionStatus: data.subscription_status || 'trialing',
          trialEndsAt: data.trial_ends_at,
          monthlyQuota: data.monthly_keyword_quota || 1000,
          keywordsUsed: data.keywords_used_this_month || 0,
          quotaResetDate: data.quota_reset_date,
          onboardingCompleted: data.onboarding_completed || false,
          isSupabaseUser: true,
          createdAt: data.created_at,
          lastActiveAt: data.last_active_at
        });
        
        console.log('User profile loaded successfully');
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Retry logic for network issues
      if (retryCount < maxRetries && error.message.includes('network')) {
        console.log(`Retrying profile load in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => loadUserProfile(userId, retryCount + 1), (retryCount + 1) * 1000);
        return;
      }
      
      setError(`Failed to load user profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create user profile in database
  const createUserProfile = async (userId) => {
    try {
      console.log('Creating user profile for:', userId);
      
      const userMetadata = session?.user?.user_metadata || {};
      const email = session?.user?.email;
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: email,
            first_name: userMetadata.first_name || '',
            last_name: userMetadata.last_name || '',
            company: userMetadata.company || '',
            industry: userMetadata.industry || '',
            subscription_tier: 'free',
            subscription_status: 'trialing',
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
            monthly_keyword_quota: 1000,
            keywords_used_this_month: 0,
            quota_reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0],
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_active_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      console.log('User profile created successfully:', data);

      // Set user state
      setUser({
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        company: data.company,
        industry: data.industry,
        websiteUrl: data.website_url,
        subscriptionTier: 'free',
        subscriptionStatus: 'trialing',
        trialEndsAt: data.trial_ends_at,
        monthlyQuota: 1000,
        keywordsUsed: 0,
        quotaResetDate: data.quota_reset_date,
        onboardingCompleted: false,
        isSupabaseUser: true,
        createdAt: data.created_at,
        lastActiveAt: data.last_active_at
      });

      // Also create user profile record
      try {
        await supabase
          .from('user_profiles')
          .insert([
            {
              user_id: userId,
              timezone: 'UTC',
              language: 'en',
              marketing_emails: true,
              feature_updates: true
            }
          ]);
      } catch (profileError) {
        console.warn('Could not create user_profiles record:', profileError);
        // Non-critical error
      }

    } catch (error) {
      console.error('Error creating user profile:', error);
      setError(`Failed to create user profile: ${error.message}`);
      throw error;
    }
  };

  // Sign up new user with improved error handling
  const signUp = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: additionalData.firstName || '',
            last_name: additionalData.lastName || '',
            company: additionalData.company || '',
            industry: additionalData.industry || ''
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data.user?.email);

      // If user is immediately confirmed (development mode), create profile
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User needs email confirmation');
      } else if (data.user && data.user.email_confirmed_at) {
        console.log('User immediately confirmed, creating profile...');
        // Give the trigger a moment to run, then check
        setTimeout(async () => {
          try {
            await loadUserProfile(data.user.id);
          } catch (err) {
            console.log('Trigger might not have run, creating profile manually...');
            await createUserProfile(data.user.id);
          }
        }, 1000);
      }

      return {
        success: true,
        user: data.user,
        message: data.user?.email_confirmed_at 
          ? 'Registration successful! Welcome to AttributeAI.'
          : 'Registration successful! Please check your email to verify your account.'
      };

    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error.message || 'An error occurred during registration';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Signing in user:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data.user?.email);

      return {
        success: true,
        user: data.user,
        session: data.session
      };

    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error.message || 'An error occurred during sign in';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setError(null);
      
      console.log('Sign out successful');
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Update user profile
  const updateUser = async (updates) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          company: updates.company,
          industry: updates.industry,
          website_url: updates.websiteUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        firstName: data.first_name,
        lastName: data.last_name,
        company: data.company,
        industry: data.industry,
        websiteUrl: data.website_url
      }));

      return { success: true };

    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password reset email sent'
      };

    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Upgrade subscription
  const upgradeSubscription = async (tier) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const quotaMap = {
        'free': 1000,
        'professional': 10000,
        'enterprise': 100000,
        'agency': 500000
      };

      const { error } = await supabase
        .from('users')
        .update({
          subscription_tier: tier,
          monthly_keyword_quota: quotaMap[tier] || 1000,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        subscriptionTier: tier,
        monthlyQuota: quotaMap[tier] || 1000
      }));

      return { success: true };

    } catch (error) {
      console.error('Subscription upgrade error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Track keyword usage
  const incrementKeywordUsage = async (count = 1) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase.rpc('increment_keyword_usage', {
        user_uuid: user.id,
        keyword_count: count
      });

      if (error) throw error;

      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        keywordsUsed: (prevUser.keywordsUsed || 0) + count
      }));

    } catch (error) {
      console.error('Usage increment error:', error);
    }
  };

  // Check quota status
  const checkQuotaStatus = () => {
    if (!user) return { hasQuota: false, remaining: 0 };

    const used = user.keywordsUsed || 0;
    const quota = user.monthlyQuota || 1000;
    const remaining = Math.max(0, quota - used);

    return {
      hasQuota: remaining > 0,
      remaining,
      used,
      quota,
      percentage: Math.min(100, (used / quota) * 100),
      tier: user.subscriptionTier || 'free',
      status: user.subscriptionStatus || 'trialing',
      trialEndsAt: user.trialEndsAt
    };
  };

  // Helper methods
  const isAuthenticated = () => !!user && !!session;
  const isPremiumUser = () => user?.subscriptionTier !== 'free';
  const clearError = () => setError(null);

  const value = {
    // State
    user,
    session,
    loading,
    error,
    
    // Authentication methods
    signUp,
    signIn,
    signOut,
    updateUser,
    resetPassword,
    
    // Subscription management
    upgradeSubscription,
    
    // Usage tracking
    incrementKeywordUsage,
    checkQuotaStatus,
    
    // Helper methods
    isAuthenticated,
    isPremiumUser,
    clearError,
    
    // Configuration
    isSupabaseConfigured: isSupabaseConfigured()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
