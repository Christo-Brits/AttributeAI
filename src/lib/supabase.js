import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Fallback for development - will use localStorage if Supabase not configured
let supabase = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here') {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
  console.log('✅ Supabase client initialized');
} else {
  console.log('⚠️ Supabase not configured - using localStorage fallback');
}

export { supabase };

// Helper function to check if Supabase is available
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Error handler for Supabase operations
export const handleSupabaseError = (error, fallbackMessage = 'Database operation failed') => {
  console.error('Supabase error:', error);
  
  if (error?.message?.includes('Invalid API key')) {
    return 'Invalid database configuration. Please check your API keys.';
  }
  
  if (error?.message?.includes('Network')) {
    return 'Network error. Please check your internet connection.';
  }
  
  return error?.message || fallbackMessage;
};

// Database schema validation
export const validateSupabaseConnection = async () => {
  if (!supabase) {
    return { isValid: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      return { 
        isValid: false, 
        error: `Database connection failed: ${error.message}` 
      };
    }
    
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: `Connection test failed: ${error.message}` 
    };
  }
};

export default supabase;