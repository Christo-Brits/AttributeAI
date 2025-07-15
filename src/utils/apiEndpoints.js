// Quick fix for all localhost references
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api'  // Production: Use Netlify redirects or functions
  : 'http://localhost:3001/api';  // Development only

// Replace all localhost:3001 with dynamic API_BASE
export const API_ENDPOINTS = {
  claudeChat: `${API_BASE}/claude-chat`,
  analyzeUrl: `${API_BASE}/analyze-url`, 
  generateContent: `${API_BASE}/generate-content`,
  keywordAnalysis: `${API_BASE}/keyword-intelligence/analyze`,
  websiteAnalysis: `${API_BASE}/website-analysis`
};
