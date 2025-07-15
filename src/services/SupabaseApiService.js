// src/services/SupabaseApiService.js
// Enterprise-grade API service using Supabase Edge Functions

const SUPABASE_FUNCTIONS_URL = 'https://xpyfoutwwjslivrmbflm.supabase.co/functions/v1';

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// API Configuration
const API_CONFIG = {
  // Production: Use Supabase Edge Functions (global deployment)
  // Development: Use localhost for testing
  baseURL: !isLocalhost && isProduction 
    ? SUPABASE_FUNCTIONS_URL 
    : 'http://localhost:3001/api',
  
  useSupabaseFunctions: !isLocalhost && isProduction
};

console.log(`🌐 API Mode: ${API_CONFIG.useSupabaseFunctions ? 'Supabase Edge Functions' : 'Local Development'}`);
console.log(`📍 Base URL: ${API_CONFIG.baseURL}`);

// Generic API client
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call to ${url} failed:`, error);
    throw error;
  }
};

// Claude AI Chat Service
export const claudeChatService = {
  async sendMessage(message, context = null, userId = null) {
    return await apiCall('/claude-chat', {
      body: JSON.stringify({ 
        message, 
        context, 
        userId: userId || localStorage.getItem('attributeai-user-id') 
      })
    });
  }
};

// Website Analysis Service  
export const websiteAnalysisService = {
  async analyzeWebsite(url) {
    return await apiCall('/analyze-website', {
      body: JSON.stringify({ url })
    });
  }
};

// Content Generation Service
export const contentGenerationService = {
  async generateContent(topic, keywords = [], contentType = 'blog post', targetAudience = 'business professionals') {
    return await apiCall('/generate-content', {
      body: JSON.stringify({ 
        topic, 
        keywords, 
        contentType, 
        targetAudience 
      })
    });
  }
};

// Keyword Analysis Service
export const keywordAnalysisService = {
  async analyzeKeywords(keywords, website = null) {
    return await apiCall('/keyword-analysis', {
      body: JSON.stringify({ 
        keywords, 
        website 
      })
    });
  }
};

// Export default service object
export default {
  claudeChat: claudeChatService,
  websiteAnalysis: websiteAnalysisService,
  contentGeneration: contentGenerationService,
  keywordAnalysis: keywordAnalysisService,
  
  // Configuration info
  config: API_CONFIG,
  
  // Helper methods
  isUsingSupabaseFunctions: () => API_CONFIG.useSupabaseFunctions,
  getBaseURL: () => API_CONFIG.baseURL
};
