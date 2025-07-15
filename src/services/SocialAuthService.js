// src/services/SocialAuthService.js
// Enhanced Supabase Authentication Service with Social Sign-In

import { supabase } from '../lib/supabase';

class SocialAuthService {
  // Social OAuth Sign-In
  static async signInWithProvider(provider, redirectTo = null) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // Add additional scopes if needed
          scopes: provider === 'google' ? 'email profile' : undefined
        }
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Social sign-in error (${provider}):`, error);
      return { data: null, error };
    }
  }

  // Enhanced Email Sign-Up with Profile Creation
  static async signUpWithEmail(userData) {
    try {
      const { email, password, firstName, lastName, company } = userData;

      // 1. Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company: company || null,
            avatar_url: null,
            created_via: 'email_signup'
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      // 2. If user created successfully, create profile
      if (authData.user) {
        await this.createUserProfile(authData.user, {
          firstName,
          lastName,
          company,
          createdVia: 'email_signup'
        });
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Email signup error:', error);
      return { data: null, error };
    }
  }

  // Enhanced Email Sign-In
  static async signInWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Email signin error:', error);
        throw error;
      }

      // Update last login
      if (data.user) {
        await this.updateLastLogin(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Email signin error:', error);
      return { data: null, error };
    }
  }

  // Create User Profile (Enhanced for Social + Email)
  static async createUserProfile(user, additionalData = {}) {
    try {
      // Extract data from OAuth or email signup
      const profileData = {
        id: user.id,
        email: user.email,
        first_name: additionalData.firstName || user.user_metadata?.first_name || null,
        last_name: additionalData.lastName || user.user_metadata?.last_name || null,
        company: additionalData.company || user.user_metadata?.company || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || 'email',
        created_via: additionalData.createdVia || user.app_metadata?.provider || 'email',
        subscription_tier: 'free',
        quota_used: 0,
        quota_limit: 1000, // Free tier limit
        last_login: new Date().toISOString(),
        preferences: {
          primary_goals: [],
          current_tools: [],
          industry: null,
          website_url: null
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Profile creation error:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Create profile error:', error);
      return { data: null, error };
    }
  }

  // Get Enhanced User Profile
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is OK
        console.error('Get profile error:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return { data: null, error };
    }
  }

  // Update Last Login
  static async updateLastLogin(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

      return { data, error };
    } catch (error) {
      console.error('Update last login error:', error);
      return { data: null, error };
    }
  }

  // Link Social Account to Existing User
  static async linkAccount(provider) {
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider: provider
      });

      if (error) {
        console.error(`Link ${provider} error:`, error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Link account error (${provider}):`, error);
      return { data: null, error };
    }
  }

  // Get Current User with Profile
  static async getCurrentUser() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { user: null, profile: null, error: authError };
      }

      const { data: profile, error: profileError } = await this.getUserProfile(user.id);

      return { 
        user, 
        profile, 
        error: profileError 
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, profile: null, error };
    }
  }

  // Sign Out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      // Clear any local storage
      localStorage.removeItem('attributeai-demo-user');
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }

  // Password Reset
  static async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { data: null, error };
    }
  }

  // Get User's Linked Identities
  static async getLinkedIdentities() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { identities: [], error };
      }

      return { 
        identities: user.identities || [], 
        error: null 
      };
    } catch (error) {
      console.error('Get linked identities error:', error);
      return { identities: [], error };
    }
  }
}

export default SocialAuthService;