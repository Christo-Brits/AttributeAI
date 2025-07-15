import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const ImprovedAuthContext = createContext();

export const useImprovedAuth = () => {
  const context = useContext(ImprovedAuthContext);
  if (!context) {
    throw new Error('useImprovedAuth must be used within an ImprovedAuthProvider');
  }
  return context;
};

export const ImprovedAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState('supabase'); // 'supabase' or 'localStorage'

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (isSupabaseConfigured()) {
      await initializeSupabaseAuth();
    } else {
      initializeLocalStorageAuth();
    }
  };

  const initializeSupabaseAuth = async () => {
    try {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        setUser(session.user);
        await ensureUserProfile(session.user);
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (session?.user) {
            setUser(session.user);
            await ensureUserProfile(session.user);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      );

      setAuthMethod('supabase');
      setIsLoading(false);

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Supabase auth initialization failed:', error);
      initializeLocalStorageAuth();
    }
  };

  const initializeLocalStorageAuth = () => {
    const storedUser = localStorage.getItem('attributeai_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setAuthMethod('localStorage');
    setIsLoading(false);
  };

  const ensureUserProfile = async (user) => {
    if (!supabase) return;

    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile
        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            company: user.user_metadata?.company || '',
            subscription_tier: 'free',
            monthly_keyword_quota: 1000,
            keywords_used_this_month: 0,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  // 🚀 MAGIC LINK AUTHENTICATION (Recommended by peer review)
  const signInWithMagicLink = async (email) => {
    if (!supabase) {
      return { success: false, error: 'Authentication service not available' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          shouldCreateUser: true
        }
      });

      if (error) throw error;

      // Track conversion event
      if (window.gtag) {
        window.gtag('event', 'sign_up', {
          method: 'magic_link',
          user_id: email
        });
      }

      return { 
        success: true, 
        message: 'Check your email for a magic sign-in link! 📧' 
      };
    } catch (error) {
      console.error('Magic link error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // 🔐 GOOGLE OAUTH (Recommended by peer review)
  const signInWithGoogle = async () => {
    if (!supabase) {
      return { success: false, error: 'Authentication service not available' };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;

      // Track conversion event
      if (window.gtag) {
        window.gtag('event', 'sign_up', {
          method: 'google_oauth'
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Google OAuth error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Traditional email/password signup (with enhanced security)
  const signUpWithPassword = async (email, password, metadata = {}) => {
    if (!supabase) {
      return createLocalStorageUser(email, metadata);
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      // Track conversion event
      if (window.gtag) {
        window.gtag('event', 'sign_up', {
          method: 'email_password',
          user_id: data.user?.id
        });
      }

      return { 
        success: true, 
        user: data.user,
        message: 'Account created! Check your email to verify.' 
      };
    } catch (error) {
      console.error('Password signup error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Fallback localStorage user creation
  const createLocalStorageUser = (email, metadata) => {
    const newUser = {
      id: `local_${Date.now()}`,
      email,
      ...metadata,
      isSupabaseUser: false,
      subscriptionTier: 'free',
      keywordsUsed: 0,
      monthlyQuota: 1000,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('attributeai_user', JSON.stringify(newUser));
    setUser(newUser);

    // Track conversion event
    if (window.gtag) {
      window.gtag('event', 'sign_up', {
        method: 'demo_mode',
        user_id: newUser.id
      });
    }

    return {
      success: true,
      user: newUser,
      message: 'Account created in demo mode!'
    };
  };

  const signOut = async () => {
    try {
      if (supabase && authMethod === 'supabase') {
        await supabase.auth.signOut();
      }
      
      localStorage.removeItem('attributeai_user');
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  // Enhanced quota management
  const incrementKeywordUsage = async (count = 1) => {
    if (!user) return;

    try {
      if (supabase && user.id && authMethod === 'supabase') {
        const { error } = await supabase.rpc('increment_keyword_usage', {
          user_uuid: user.id,
          keyword_count: count
        });

        if (error) throw error;
      }

      // Update local state
      const updatedUser = {
        ...user,
        keywordsUsed: (user.keywordsUsed || 0) + count
      };
      
      setUser(updatedUser);
      
      if (authMethod === 'localStorage') {
        localStorage.setItem('attributeai_user', JSON.stringify(updatedUser));
      }

    } catch (error) {
      console.error('Usage increment error:', error);
    }
  };

  const checkQuotaStatus = () => {
    if (!user) return { hasQuota: false, usage: 0, limit: 0 };

    const usage = user.keywordsUsed || 0;
    const limit = user.monthlyQuota || 1000;
    
    return {
      hasQuota: usage < limit,
      usage,
      limit,
      remaining: Math.max(0, limit - usage),
      percentUsed: Math.round((usage / limit) * 100)
    };
  };

  const value = {
    user,
    isLoading,
    authMethod,
    isSupabaseUser: authMethod === 'supabase',
    
    // Authentication methods
    signInWithMagicLink,
    signInWithGoogle,
    signUpWithPassword,
    signOut,
    
    // Usage management
    incrementKeywordUsage,
    checkQuotaStatus
  };

  return (
    <ImprovedAuthContext.Provider value={value}>
      {children}
    </ImprovedAuthContext.Provider>
  );
};

export default ImprovedAuthProvider;
