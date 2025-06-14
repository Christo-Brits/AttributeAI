// Phase 2 - Claude AI Integration Service
// Frontend API client for AttributeAI AI features
// Communicates with backend API instead of direct SDK usage

class ClaudeService {
  constructor() {
    this.initialized = true; // Always ready for API calls
    this.analysisCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  // Check if service is ready (always true for API client)
  isReady() {
    return this.initialized;
  }

  // Core AI analysis method with caching - calls backend API
  async analyzeData(analysisType, data, context = {}) {
    // Check cache first
    const cacheKey = this.getCacheKey(analysisType, data, context);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/claude-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: this.buildPrompt(analysisType, data, context),
          analysisType: analysisType,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      const parsedResult = this.parseResponse(result.response || result.content, analysisType);
      
      // Cache the result
      this.setCache(cacheKey, parsedResult);
      
      return parsedResult;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  // Specialized prompts for each AttributeAI tool
  buildPrompt(analysisType, data, context) {
    const baseContext = `
You are an expert marketing attribution analyst for AttributeAI.
Provide actionable insights in valid JSON format.
Focus on high-impact opportunities and specific recommendations.
Current context: ${JSON.stringify(context)}
    `;

    const prompts = {
      seo_analysis: `${baseContext}
Analyze this SEO data and provide insights:
${JSON.stringify(data)}

Return JSON with:
{
  "opportunities": [{"title": "string", "impact": 1-10, "effort": 1-10, "description": "string"}],
  "technicalIssues": [{"issue": "string", "priority": "high|medium|low", "solution": "string"}],
  "contentGaps": [{"keyword": "string", "searchVolume": number, "difficulty": 1-10}],
  "quickWins": [{"action": "string", "expectedImpact": "string", "timeToImplement": "string"}],
  "summary": "string"
}`,

      content_strategy: `${baseContext}
Create content strategy from this data:
${JSON.stringify(data)}

Return JSON with:
{
  "topicRecommendations": [{"topic": "string", "searchVolume": number, "competition": 1-10}],
  "contentCalendar": [{"week": number, "topics": ["string"], "contentType": "string"}],
  "distributionChannels": [{"channel": "string", "priority": 1-10, "reason": "string"}],
  "performancePredictions": {"expectedTraffic": number, "timeframe": "string"},
  "summary": "string"
}`,

      lead_magnet_optimization: `${baseContext}
Optimize lead magnet strategy:
${JSON.stringify(data)}

Return JSON with:
{
  "magnetIdeas": [{"title": "string", "type": "string", "conversionPotential": 1-10}],
  "optimizations": [{"element": "string", "improvement": "string", "expectedLift": "string"}],
  "audienceInsights": [{"segment": "string", "preference": "string", "messaging": "string"}],
  "testingStrategy": [{"test": "string", "hypothesis": "string", "metrics": ["string"]}],
  "summary": "string"
}`,

      cro_analysis: `${baseContext}
Analyze conversion optimization opportunities:
${JSON.stringify(data)}

Return JSON with:
{
  "conversionBottlenecks": [{"page": "string", "issue": "string", "impact": 1-10}],
  "testingPriorities": [{"test": "string", "expectedLift": "string", "effort": 1-10}],
  "uxImprovements": [{"element": "string", "recommendation": "string", "reasoning": "string"}],
  "audienceBehaviorInsights": [{"behavior": "string", "implication": "string"}],
  "summary": "string"
}`,

      attribution_analysis: `${baseContext}
Analyze attribution data for insights:
${JSON.stringify(data)}

Return JSON with:
{
  "topPerformingChannels": [{"channel": "string", "attribution": number, "trend": "string"}],
  "undervaluedTouchpoints": [{"touchpoint": "string", "hiddenValue": "string", "optimization": "string"}],
  "journeyOptimizations": [{"stage": "string", "improvement": "string", "impact": 1-10}],
  "budgetRecommendations": [{"channel": "string", "adjustment": "string", "reasoning": "string"}],
  "summary": "string"
}`
    };

    return prompts[analysisType] || `${baseContext}
Analyze this data: ${JSON.stringify(data)}
Provide actionable insights in JSON format.`;
  }

  // Parse and validate AI responses
  parseResponse(responseText, analysisType) {
    try {
      // Extract JSON from response (Claude sometimes adds explanation text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Add metadata
      return {
        ...parsed,
        analysisType,
        timestamp: new Date().toISOString(),
        confidence: this.calculateConfidence(parsed),
        source: 'claude-ai-api'
      };
    } catch (error) {
      console.error('Response parsing error:', error);
      return {
        error: 'Failed to parse AI response',
        rawResponse: responseText,
        analysisType,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Calculate confidence score based on response completeness
  calculateConfidence(data) {
    const expectedFields = {
      seo_analysis: ['opportunities', 'technicalIssues', 'contentGaps'],
      content_strategy: ['topicRecommendations', 'contentCalendar'],
      lead_magnet_optimization: ['magnetIdeas', 'optimizations'],
      cro_analysis: ['conversionBottlenecks', 'testingPriorities'],
      attribution_analysis: ['topPerformingChannels', 'journeyOptimizations']
    };
    
    const expected = expectedFields[data.analysisType] || [];
    const present = expected.filter(field => data[field] && data[field].length > 0);
    
    return Math.round((present.length / expected.length) * 100);
  }

  // Cache management
  getCacheKey(analysisType, data, context) {
    const dataHash = JSON.stringify(data).slice(0, 100);
    return `${analysisType}_${dataHash}_${Date.now()}`;
  }

  getFromCache(key) {
    const cached = this.analysisCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.analysisCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Enhanced Content Generation API calls
  async generateContent(contentType, targetKeyword, options = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/content/generate-multi-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create ${contentType} content optimized for "${targetKeyword}"`,
          targetKeyword,
          contentType,
          ...options
        })
      });

      if (!response.ok) {
        throw new Error(`Content generation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Content generation error:', error);
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  // Keyword Intelligence API calls
  async analyzeKeywords(keywords, options = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/keyword-intelligence/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: Array.isArray(keywords) ? keywords : [keywords],
          ...options
        })
      });

      if (!response.ok) {
        throw new Error(`Keyword analysis failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Keyword analysis error:', error);
      throw new Error(`Keyword analysis failed: ${error.message}`);
    }
  }
}

// Create singleton instance
const claudeService = new ClaudeService();

export default claudeService;

// Export class for testing
export { ClaudeService };
