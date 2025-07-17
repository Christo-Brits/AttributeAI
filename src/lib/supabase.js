import { createClient } from '@supabase/supabase-js';
import { isFounderEmail, getFounderProfile } from '../config/founderConfig';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = (url) => {
  if (!url || url.includes('your_') || url.includes('placeholder')) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Get the correct redirect URL based on environment
const getRedirectURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin for verification redirects
    return window.location.origin;
  }
  
  // Server-side or fallback
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_SITE_URL || 'https://leafy-biscotti-c87e93.netlify.app';
  }
  
  return 'http://localhost:3000';
};

// Fallback for development - will use localStorage if Supabase not configured
let supabase = null;

if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && !supabaseAnonKey.includes('your_')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      redirectTo: getRedirectURL() // This fixes the verification redirect!
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
  console.log('✅ Supabase client initialized with redirect URL:', getRedirectURL());
} else {
  console.log('📱 Demo Mode: Supabase not configured - using localStorage fallback for mobile demo');
  if (!supabaseUrl || supabaseUrl.includes('your_')) {
    console.log('💡 To enable full features, add REACT_APP_SUPABASE_URL to .env file');
  }
  if (!supabaseAnonKey || supabaseAnonKey.includes('your_')) {
    console.log('💡 To enable full features, add REACT_APP_SUPABASE_ANON_KEY to .env file');
  }
}

// Social authentication providers configuration
export const socialProviders = {
  google: {
    name: 'Google',
    icon: '🔗',
    color: 'from-red-500 to-red-600'
  },
  github: {
    name: 'GitHub', 
    icon: '🐙',
    color: 'from-gray-700 to-gray-800'
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: 'from-blue-600 to-blue-700'
  }
};

// Social login helper
export const signInWithProvider = async (provider) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your environment variables.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

// Enhanced user profile creation with email verification
export const createUserProfile = async (user, additionalData = {}) => {
  // Check if this is a founder account
  const isFounder = isFounderEmail(user.email);
  
  if (!supabase) {
    // Fallback to localStorage for demo
    if (isFounder) {
      const founderProfile = getFounderProfile(user, additionalData);
      localStorage.setItem('attributeai_user_profile', JSON.stringify(founderProfile));
      console.log('🎉 Founder account activated with unlimited access!');
      return founderProfile;
    }
    
    const profileData = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || additionalData.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      created_at: new Date().toISOString(),
      subscription_tier: 'free',
      monthly_usage: {
        keywords_analyzed: 0,
        content_generated: 0,
        attribution_queries: 0
      },
      usage_limits: {
        keywords_per_month: 100,
        content_pieces_per_month: 5,
        attribution_queries_per_month: 50
      },
      ...additionalData
    };
    
    localStorage.setItem('attributeai_user_profile', JSON.stringify(profileData));
    return profileData;
  }

  // Create/update user profile in Supabase
  if (isFounder) {
    // Founder gets unlimited access
    const founderProfile = getFounderProfile(user, additionalData);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(founderProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating founder profile:', error);
      throw error;
    }

    console.log('🎉 Founder account activated in database with unlimited access!');
    return data;
  }
  
  // Regular user profile
  const profileData = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || additionalData.full_name,
    avatar_url: user.user_metadata?.avatar_url,
    subscription_tier: 'free',
    is_founder: false,
    monthly_usage: {
      keywords_analyzed: 0,
      content_generated: 0,
      attribution_queries: 0
    },
    usage_limits: {
      keywords_per_month: 100,
      content_pieces_per_month: 5,
      attribution_queries_per_month: 50
    },
    ...additionalData
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profileData)
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data;
};

// Email verification and password reset functions
export const signUpWithEmailVerification = async (email, password, additionalData = {}) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Email verification requires Supabase.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/verify`,
      data: {
        full_name: additionalData.full_name,
        first_name: additionalData.first_name,
        last_name: additionalData.last_name,
      }
    }
  });

  if (error) throw error;

  return data;
};

export const resendEmailVerification = async (email) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Email verification requires Supabase.');
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/verify`
    }
  });

  if (error) throw error;

  return { message: 'Verification email sent' };
};

export const resetPassword = async (email) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Password reset requires Supabase.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;

  return { message: 'Password reset email sent' };
};

export const updatePassword = async (newPassword) => {
  if (!supabase) {
    throw new Error('Supabase not configured.');
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;

  return { message: 'Password updated successfully' };
};

// Usage tracking helpers
export const trackUsage = async (userId, usageType, amount = 1) => {
  if (!supabase) {
    // Update localStorage usage
    const profile = JSON.parse(localStorage.getItem('attributeai_user_profile') || '{}');
    
    // Founder accounts don't track usage (unlimited)
    if (profile.is_founder || profile.subscription_tier === 'founder') {
      console.log('🎉 Founder account - unlimited usage, not tracking');
      return profile;
    }
    
    if (profile.monthly_usage) {
      profile.monthly_usage[usageType] = (profile.monthly_usage[usageType] || 0) + amount;
      localStorage.setItem('attributeai_user_profile', JSON.stringify(profile));
    }
    return profile;
  }

  // Check if founder first
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('is_founder, subscription_tier, email')
    .eq('id', userId)
    .single();

  if (userProfile?.is_founder || userProfile?.subscription_tier === 'founder' || 
      isFounderEmail(userProfile?.email)) {
    console.log('🎉 Founder account - unlimited usage, not tracking');
    return { unlimited: true };
  }

  const { data, error } = await supabase.rpc('increment_usage', {
    user_id: userId,
    usage_type: usageType,
    amount: amount
  });

  if (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }

  return data;
};

// Check if user has exceeded limits
export const checkUsageLimit = async (userId, usageType) => {
  if (!supabase) {
    const profile = JSON.parse(localStorage.getItem('attributeai_user_profile') || '{}');
    
    // Founder accounts have unlimited usage
    if (profile.is_founder || profile.subscription_tier === 'founder') {
      return {
        current: 0,
        limit: 999999,
        exceeded: false,
        remaining: 999999,
        unlimited: true
      };
    }
    
    const current = profile.monthly_usage?.[usageType] || 0;
    const limit = profile.usage_limits?.[usageType] || 0;
    return {
      current,
      limit,
      exceeded: current >= limit,
      remaining: Math.max(0, limit - current)
    };
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('monthly_usage, usage_limits, is_founder, subscription_tier, email')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking usage limit:', error);
    return { exceeded: false, remaining: 0 };
  }

  // Check if founder account
  if (data.is_founder || data.subscription_tier === 'founder' || 
      isFounderEmail(data.email)) {
    return {
      current: 0,
      limit: 999999,
      exceeded: false,
      remaining: 999999,
      unlimited: true
    };
  }

  const current = data.monthly_usage?.[usageType] || 0;
  const limit = data.usage_limits?.[usageType] || 0;
  
  return {
    current,
    limit,
    exceeded: current >= limit,
    remaining: Math.max(0, limit - current)
  };
};

export { supabase };

// Helper function to check if Supabase is available
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
  if (!supabase) {
    // Fallback for localStorage
    const checkAuth = () => {
      const user = localStorage.getItem('attributeai_user_profile');
      callback(user ? JSON.parse(user) : null);
    };
    
    checkAuth();
    return () => {}; // No cleanup needed for localStorage
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Create/update user profile when user signs in
        try {
          await createUserProfile(session.user);
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      }
      callback(session?.user || null);
    }
  );

  return () => subscription.unsubscribe();
};