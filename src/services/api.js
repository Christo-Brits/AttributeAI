// Central API Configuration
// This file manages all API endpoints and configurations

// Determine if we're in production or development
const isProduction = process.env.NODE_ENV === 'production';

// API Base URL - uses relative path in production, localhost in development
const API_BASE_URL = isProduction 
  ? '/api'  // This will use Netlify Functions in production
  : 'http://localhost:3001/api';

// Check if demo mode is enabled
const isDemoMode = process.env.REACT_APP_DEMO_MODE === 'true';

// Export configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  isDemoMode,
  isProduction,
  
  // API Endpoints
  endpoints: {
    // Claude AI
    claudeChat: `${API_BASE_URL}/claude-chat`,
    
    // OpenAI
    openaiChat: `${API_BASE_URL}/openai-chat`,
    generateContent: `${API_BASE_URL}/generate-content`,
    generateImage: `${API_BASE_URL}/generate-image`,
    
    // Analysis
    analyzeUrl: `${API_BASE_URL}/analyze-url`,
    analyzeKeywords: `${API_BASE_URL}/keyword-intelligence`,
    
    // Content
    polishContent: `${API_BASE_URL}/polish-content`,
    generateVideo: `${API_BASE_URL}/generate-video`,
    
    // Attribution
    attribution: `${API_BASE_URL}/attribution`,
    journey: `${API_BASE_URL}/journey-analytics`,
  }
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

// Claude API wrapper
export const callClaudeAPI = async (messages) => {
  if (isDemoMode) {
    console.log('Demo mode: Simulating Claude API response');
    return {
      content: "This is a demo response. Connect your API keys to see real AI responses.",
      model: "demo-mode"
    };
  }

  return apiCall(API_CONFIG.endpoints.claudeChat, {
    method: 'POST',
    body: JSON.stringify({ messages })
  });
};

// OpenAI API wrapper
export const callOpenAIAPI = async (prompt, options = {}) => {
  if (isDemoMode) {
    console.log('Demo mode: Simulating OpenAI API response');
    return {
      choices: [{
        message: {
          content: "This is a demo response. Connect your API keys to see real AI responses."
        }
      }]
    };
  }

  return apiCall(API_CONFIG.endpoints.openaiChat, {
    method: 'POST',
    body: JSON.stringify({ prompt, ...options })
  });
};

// Export all API functions
export default {
  API_CONFIG,
  apiCall,
  callClaudeAPI,
  callOpenAIAPI,
};