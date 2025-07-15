// src/config/apiConfig.js
// Environment-based API configuration - NO LOCALHOST IN PRODUCTION

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// API Configuration based on environment
export const API_CONFIG = {
  // Never use localhost in production
  BASE_URL: isDevelopment && isLocalhost 
    ? 'http://localhost:3001/api'  // Only for local development
    : '/api',  // Production: use relative paths with Netlify redirects
  
  // Supabase direct integration (no localhost dependency)
  SUPABASE_FUNCTIONS: {
    BASE_URL: 'https://xpyfoutwwjslivrmbflm.supabase.co/functions/v1',
    ENDPOINTS: {
      claudeChat: '/claude-chat',
      analyzeWebsite: '/analyze-website', 
      generateContent: '/generate-content',
      keywordAnalysis: '/keyword-analysis'
    }
  },
  
  // Configuration flags
  USE_SUPABASE_FUNCTIONS: !isLocalhost, // Use Supabase in production
  USE_LOCALHOST: isDevelopment && isLocalhost
};

// Helper function to get the correct API URL
export const getApiUrl = (endpoint) => {
  // Production: use Supabase Functions or Netlify Functions
  if (!API_CONFIG.USE_LOCALHOST) {
    // Option 1: Supabase Edge Functions (if implemented)
    if (API_CONFIG.USE_SUPABASE_FUNCTIONS) {
      return `${API_CONFIG.SUPABASE_FUNCTIONS.BASE_URL}${endpoint}`;
    }
    // Option 2: Netlify Functions
    return `/.netlify/functions${endpoint}`;
  }
  
  // Development: use localhost
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API client with environment detection
export const apiClient = {
  async call(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    
    console.log(`🔗 API Call: ${url} (Production: ${!API_CONFIG.USE_LOCALHOST})`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API call to ${url} failed:`, error);
      throw error;
    }
  }
};

export default API_CONFIG;
