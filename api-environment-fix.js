// Quick fix: Add environment-based API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-server.netlify.app/.netlify/functions'  // Production API
  : 'http://localhost:3001/api';  // Local development

// Update all API calls to use this base URL
export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    claudeChat: `${API_BASE_URL}/claude-chat`,
    analyzeUrl: `${API_BASE_URL}/analyze-url`,
    generateContent: `${API_BASE_URL}/generate-content`,
    keywordIntelligence: `${API_BASE_URL}/keyword-intelligence/analyze`
  }
};

// For production, we can either:
// 1. Deploy API server as Netlify Functions
// 2. Use Supabase Edge Functions  
// 3. Deploy to dedicated server (Railway, Render, etc.)
