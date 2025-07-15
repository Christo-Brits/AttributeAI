// Supabase Edge Functions Service
// This replaces direct API calls with secure Supabase Edge Function calls

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project details
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xpyfoutwwjslivrmbflm.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWZvdXR3d2pzbGl2cm1iZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDMyODcsImV4cCI6MjA2NTQxOTI4N30.SmuHFfvlbgvU0rWsPZyn-UuZ3l135g3nKkZJqFA_bpc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class EdgeFunctionsService {
  /**
   * Call Claude AI through Supabase Edge Function
   */
  async callClaude(message, context = null, userId = null) {
    try {
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: { 
          message, 
          context,
          userId 
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Claude Edge Function error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }

  /**
   * Analyze website through Supabase Edge Function
   */
  async analyzeWebsite(url) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: { url }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Website Analysis Edge Function error:', error);
      throw new Error(`Failed to analyze website: ${error.message}`);
    }
  }

  /**
   * Generate content through Supabase Edge Function
   */
  async generateContent(topic, options = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          topic,
          ...options 
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Content Generation Edge Function error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  /**
   * Analyze keywords through Supabase Edge Function
   */
  async analyzeKeywords(keywords, options = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('keyword-intelligence', {
        body: { 
          keywords,
          ...options 
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Keyword Intelligence Edge Function error:', error);
      throw new Error(`Failed to analyze keywords: ${error.message}`);
    }
  }

  /**
   * Check if Edge Functions are available
   */
  async healthCheck() {
    try {
      // Try to invoke a simple function to check connectivity
      const { data, error } = await supabase.functions.invoke('health-check', {
        body: { test: true }
      });
      
      return { available: !error, error: error?.message };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  /**
   * Get Supabase client instance (for other operations like auth, database)
   */
  getClient() {
    return supabase;
  }
}

export default new EdgeFunctionsService();