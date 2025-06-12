// Step 4: Advanced Research Integration Service
class AdvancedResearchService {
  constructor() {
    this.baseURL = 'http://localhost:3001';
    this.cache = new Map();
    this.researchSources = {
      web: ['web_search', 'perplexity'],
      social: ['twitter', 'reddit', 'linkedin'],
      academic: ['scholar', 'pubmed', 'arxiv'],
      news: ['news_api', 'google_news'],
      market: ['statista', 'semrush', 'ahrefs']
    };
  }

  // Main research orchestration method
  async conductComprehensiveResearch(topic, clusterContext, userProfile = null) {
    console.log(`🔬 Starting comprehensive research for: ${topic}`);
    
    try {
      const researchPlan = this.generateResearchPlan(topic, clusterContext, userProfile);
      
      const research = {
        topic,
        timestamp: new Date().toISOString(),
        context: clusterContext,
        plan: researchPlan,
        results: {}
      };

      // Execute research plan in parallel for efficiency
      const researchPromises = researchPlan.phases.map(phase => 
        this.executeResearchPhase(phase, topic, userProfile)
      );

      const phaseResults = await Promise.allSettled(researchPromises);
      
      // Process results
      phaseResults.forEach((result, index) => {
        const phaseName = researchPlan.phases[index].name;
        if (result.status === 'fulfilled') {
          research.results[phaseName] = result.value;
        } else {
          console.error(`Research phase ${phaseName} failed:`, result.reason);
          research.results[phaseName] = { error: result.reason.message };
        }
      });

      // Generate synthesized insights
      research.insights = await this.synthesizeResearchInsights(research.results, topic);
      
      // Generate content cluster recommendations
      research.clusterRecommendations = await this.generateClusterRecommendations(
        research.results, 
        research.insights, 
        topic
      );

      console.log('✅ Comprehensive research completed');
      return research;

    } catch (error) {
      console.error('Research orchestration failed:', error);
      return this.fallbackResearch(topic, clusterContext);
    }
  }

  // Generate structured research plan based on topic and context
  generateResearchPlan(topic, clusterContext, userProfile) {
    const location = userProfile?.location || { country: 'New Zealand', city: 'Auckland' };
    const industry = userProfile?.industry || 'general';
    
    return {
      objective: `Comprehensive research for content cluster: ${topic}`,
      timeline: '15-20 minutes',
      phases: [
        {
          name: 'marketAnalysis',
          priority: 'high',
          duration: '3-5 minutes',
          sources: ['web_search', 'market_data'],
          queries: [
            `${topic} market size statistics ${location.country} 2024`,
            `${topic} industry trends ${location.country}`,
            `${topic} market growth forecast 2024-2025`,
            `${topic} customer demographics ${location.country}`
          ]
        },
        {
          name: 'competitorAnalysis',
          priority: 'high', 
          duration: '4-6 minutes',
          sources: ['web_search', 'social_listening'],
          queries: [
            `top ${topic} companies ${location.city} ${location.country}`,
            `best ${topic} services ${location.country}`,
            `${topic} competitor analysis ${industry}`,
            `${topic} pricing comparison ${location.country}`
          ]
        },
        {
          name: 'contentGapAnalysis',
          priority: 'medium',
          duration: '3-4 minutes', 
          sources: ['web_search', 'content_analysis'],
          queries: [
            `${topic} comprehensive guide missing information`,
            `${topic} frequently asked questions unanswered`,
            `${topic} common problems solutions`,
            `${topic} beginner mistakes guide`
          ]
        },
        {
          name: 'trendAnalysis',
          priority: 'medium',
          duration: '2-3 minutes',
          sources: ['news_api', 'social_trends'],
          queries: [
            `${topic} latest developments 2024`,
            `${topic} emerging trends ${industry}`,
            `${topic} innovation ${location.country}`,
            `${topic} future predictions 2025`
          ]
        },
        {
          name: 'regulatoryAnalysis',
          priority: 'low',
          duration: '2-3 minutes',
          sources: ['government_sources', 'legal_databases'],
          queries: [
            `${topic} regulations ${location.country} 2024`,
            `${topic} compliance requirements`,
            `${topic} legal considerations ${industry}`,
            `${topic} standards ${location.country}`
          ]
        }
      ],
      deliverables: [
        'Market size and growth data',
        'Competitive landscape analysis',
        'Content gap identification',
        'Trend and innovation insights',
        'Regulatory and compliance overview',
        'Content cluster strategy',
        'Keyword opportunity matrix'
      ]
    };
  }

  // Execute individual research phase
  async executeResearchPhase(phase, topic, userProfile) {
    console.log(`🔍 Executing research phase: ${phase.name}`);
    
    const phaseResults = {
      name: phase.name,
      queries: phase.queries,
      results: [],
      summary: '',
      keyFindings: [],
      sources: [],
      timestamp: new Date().toISOString()
    };

    try {
      // Execute queries in parallel for this phase
      const queryPromises = phase.queries.map(query => 
        this.executeResearchQuery(query, phase.sources[0] || 'web_search')
      );

      const queryResults = await Promise.allSettled(queryPromises);
      
      // Process query results
      queryResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          phaseResults.results.push({
            query: phase.queries[index],
            data: result.value
          });
          
          // Collect sources
          if (result.value.sources) {
            phaseResults.sources.push(...result.value.sources);
          }
        }
      });

      // Generate phase summary
      phaseResults.summary = await this.generatePhaseSummary(
        phaseResults.results, 
        phase.name, 
        topic
      );

      // Extract key findings
      phaseResults.keyFindings = this.extractKeyFindings(
        phaseResults.results, 
        phase.name
      );

      return phaseResults;

    } catch (error) {
      console.error(`Phase ${phase.name} execution failed:`, error);
      throw error;
    }
  }

  // Execute individual research query
  async executeResearchQuery(query, source = 'web_search') {
    // Check cache first
    const cacheKey = `${source}:${query}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let result;
      
      switch (source) {
        case 'web_search':
          result = await this.webSearch(query);
          break;
        case 'perplexity':
          result = await this.perplexitySearch(query);
          break;
        case 'market_data':
          result = await this.marketDataSearch(query);
          break;
        case 'social_listening':
          result = await this.socialListeningSearch(query);
          break;
        case 'content_analysis':
          result = await this.contentAnalysisSearch(query);
          break;
        case 'news_api':
          result = await this.newsApiSearch(query);
          break;
        default:
          result = await this.webSearch(query);
      }

      // Cache result for 1 hour
      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), 3600000);

      return result;

    } catch (error) {
      console.error(`Query execution failed for ${query}:`, error);
      return { error: error.message, query, source };
    }
  }

  // Web search implementation
  async webSearch(query) {
    try {
      const response = await fetch(`${this.baseURL}/api/web-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          num_results: 8,
          include_snippets: true
        })
      });

      if (!response.ok) throw new Error(`Web search failed: ${response.statusText}`);
      
      const data = await response.json();
      
      return {
        query,
        source: 'web_search',
        results: data.results || [],
        summary: data.summary || '',
        sources: data.results?.map(r => ({
          title: r.title,
          url: r.url,
          domain: new URL(r.url).hostname,
          snippet: r.snippet
        })) || [],
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Web search error:', error);
      throw error;
    }
  }

  // Perplexity search for authoritative research
  async perplexitySearch(query) {
    try {
      const response = await fetch(`${this.baseURL}/api/perplexity-research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          search_type: 'comprehensive',
          include_citations: true
        })
      });

      if (!response.ok) throw new Error(`Perplexity search failed: ${response.statusText}`);
      
      const data = await response.json();
      
      return {
        query,
        source: 'perplexity',
        summary: data.answer || '',
        citations: data.citations || [],
        sources: data.citations?.map(c => ({
          title: c.title,
          url: c.url,
          domain: c.domain,
          snippet: c.snippet
        })) || [],
        confidence: data.confidence || 0.8,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Perplexity search error:', error);
      return {
        query,
        source: 'perplexity',
        error: error.message,
        fallback: await this.webSearch(query)
      };
    }
  }

  // Market data search for statistics and trends
  async marketDataSearch(query) {
    try {
      // Combine multiple market data approaches
      const webResults = await this.webSearch(`${query} statistics market research`);
      const trendResults = await this.webSearch(`${query} market trends data 2024`);

      return {
        query,
        source: 'market_data',
        web_results: webResults,
        trend_results: trendResults,
        combined_sources: [...(webResults.sources || []), ...(trendResults.sources || [])],
        summary: this.combineMarketDataSummaries(webResults, trendResults),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Market data search error:', error);
      throw error;
    }
  }

  // Social listening search
  async socialListeningSearch(query) {
    try {
      // Search for social discussions and sentiment
      const socialQuery = `${query} discussion opinions reviews site:reddit.com OR site:twitter.com`;
      const webResults = await this.webSearch(socialQuery);

      return {
        query,
        source: 'social_listening',
        discussions: webResults.results || [],
        sentiment: 'neutral', // Would implement sentiment analysis
        sources: webResults.sources || [],
        summary: `Social discussion analysis for ${query}`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Social listening search error:', error);
      throw error;
    }
  }

  // Content analysis search
  async contentAnalysisSearch(query) {
    try {
      // Search for existing content to identify gaps
      const contentQuery = `${query} guide comprehensive tutorial how-to`;
      const webResults = await this.webSearch(contentQuery);

      const contentGaps = await this.analyzeContentGaps(webResults.results, query);

      return {
        query,
        source: 'content_analysis',
        existing_content: webResults.results || [],
        content_gaps: contentGaps,
        sources: webResults.sources || [],
        summary: `Content gap analysis for ${query}`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Content analysis search error:', error);
      throw error;
    }
  }

  // News API search for recent developments
  async newsApiSearch(query) {
    try {
      const newsQuery = `${query} news latest developments 2024`;
      const webResults = await this.webSearch(newsQuery);

      return {
        query,
        source: 'news_api',
        articles: webResults.results || [],
        recent_developments: this.extractRecentDevelopments(webResults.results),
        sources: webResults.sources || [],
        summary: `Recent news and developments for ${query}`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('News API search error:', error);
      throw error;
    }
  }

  // Generate phase summary using AI
  async generatePhaseSummary(results, phaseName, topic) {
    try {
      const prompt = `Analyze research results for ${phaseName} phase on topic "${topic}".

RESEARCH RESULTS:
${results.map(r => `Query: ${r.query}\nResults: ${JSON.stringify(r.data, null, 2)}`).join('\n\n')}

Generate a concise summary (150-200 words) highlighting:
1. Key insights and findings
2. Important statistics or data points
3. Trends and patterns identified
4. Actionable information
5. Notable sources and authorities

Focus on information that would be valuable for content creation and strategy development.`;

      const response = await fetch(`${this.baseURL}/api/claude-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          max_tokens: 1000
        })
      });

      if (!response.ok) throw new Error('Summary generation failed');
      
      const result = await response.json();
      return result.content || `Summary for ${phaseName} phase on ${topic}`;

    } catch (error) {
      console.error('Phase summary generation error:', error);
      return `Research phase ${phaseName} completed for ${topic}. Analysis of results in progress.`;
    }
  }

  // Extract key findings from research results
  extractKeyFindings(results, phaseName) {
    const findings = [];

    results.forEach(result => {
      if (result.data && result.data.sources) {
        result.data.sources.forEach(source => {
          if (source.snippet && source.snippet.length > 50) {
            findings.push({
              finding: source.snippet.substring(0, 150) + '...',
              source: source.domain,
              url: source.url,
              confidence: 0.8
            });
          }
        });
      }
    });

    // Limit to top 5 findings per phase
    return findings.slice(0, 5);
  }

  // Synthesize research insights across all phases
  async synthesizeResearchInsights(results, topic) {
    try {
      const prompt = `Synthesize comprehensive insights from multi-phase research on "${topic}".

RESEARCH PHASES COMPLETED:
${Object.entries(results).map(([phase, data]) => 
  `${phase.toUpperCase()}:\n${data.summary || 'Phase completed'}\n`
).join('\n')}

Generate strategic insights including:
1. Market opportunity assessment
2. Competitive landscape overview  
3. Content strategy recommendations
4. Target audience insights
5. Key differentiators to emphasize
6. Potential challenges and solutions
7. Content cluster opportunities

Provide actionable insights for content marketing strategy. Format as structured insights with clear headers.`;

      const response = await fetch(`${this.baseURL}/api/claude-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          max_tokens: 2000
        })
      });

      if (!response.ok) throw new Error('Insights synthesis failed');
      
      const result = await response.json();
      return this.parseInsights(result.content);

    } catch (error) {
      console.error('Insights synthesis error:', error);
      return this.fallbackInsights(topic);
    }
  }

  // Generate content cluster recommendations
  async generateClusterRecommendations(results, insights, topic) {
    try {
      const prompt = `Based on comprehensive research, generate content cluster recommendations for "${topic}".

RESEARCH SUMMARY:
${Object.entries(results).map(([phase, data]) => 
  `${phase}: ${data.summary || 'Completed'}`
).join('\n')}

STRATEGIC INSIGHTS:
${typeof insights === 'string' ? insights : JSON.stringify(insights)}

Generate a content cluster strategy including:

1. PILLAR CONTENT (1-2 comprehensive guides):
   - Topics that can serve as authoritative resources
   - 3000+ word comprehensive guides
   - High search volume, medium competition

2. SUPPORTING CONTENT (8-12 articles):
   - Specific aspects of the main topic
   - 1500-2000 word detailed articles
   - Target long-tail keywords

3. RAPID CONTENT (15-20 pieces):
   - Quick answers and specific questions
   - 800-1200 word focused articles
   - Target question-based searches

For each content piece, provide:
- Suggested title
- Target keyword
- Content type (guide/article/FAQ)
- Estimated difficulty (Low/Medium/High)
- Business value (High/Medium/Low)
- Content brief (2-3 sentences)

Format as JSON structure for easy processing.`;

      const response = await fetch(`${this.baseURL}/api/claude-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          max_tokens: 3000
        })
      });

      if (!response.ok) throw new Error('Cluster recommendations failed');
      
      const result = await response.json();
      return this.parseClusterRecommendations(result.content, topic);

    } catch (error) {
      console.error('Cluster recommendations error:', error);
      return this.fallbackClusterRecommendations(topic);
    }
  }

  // Parse insights from AI response
  parseInsights(content) {
    try {
      // Try to parse as structured data
      if (content.includes('{') && content.includes('}')) {
        return JSON.parse(content);
      }
      
      // Parse as text with headers
      const sections = content.split('\n').filter(line => line.trim());
      const insights = {
        market_opportunity: '',
        competitive_landscape: '',
        content_strategy: '',
        target_audience: '',
        key_differentiators: [],
        challenges: [],
        opportunities: []
      };

      let currentSection = '';
      sections.forEach(line => {
        if (line.includes('Market') || line.includes('Opportunity')) {
          currentSection = 'market_opportunity';
        } else if (line.includes('Competitive') || line.includes('Competition')) {
          currentSection = 'competitive_landscape';
        } else if (line.includes('Content') || line.includes('Strategy')) {
          currentSection = 'content_strategy';
        } else if (line.includes('Audience') || line.includes('Target')) {
          currentSection = 'target_audience';
        } else if (currentSection && line.trim()) {
          insights[currentSection] += line + ' ';
        }
      });

      return insights;

    } catch (error) {
      console.error('Insights parsing error:', error);
      return { summary: content };
    }
  }

  // Parse cluster recommendations
  parseClusterRecommendations(content, topic) {
    try {
      // Try to parse as JSON first
      if (content.includes('{') && content.includes('[')) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }

      // Fallback to structured parsing
      return this.fallbackClusterRecommendations(topic);

    } catch (error) {
      console.error('Cluster recommendations parsing error:', error);
      return this.fallbackClusterRecommendations(topic);
    }
  }

  // Helper methods
  combineMarketDataSummaries(webResults, trendResults) {
    const webSummary = webResults.summary || '';
    const trendSummary = trendResults.summary || '';
    return `${webSummary} ${trendSummary}`.trim() || 'Market data analysis completed';
  }

  analyzeContentGaps(existingContent, topic) {
    // Simple gap analysis - in production would be more sophisticated
    const commonTopics = [
      'beginner guide',
      'advanced techniques', 
      'common mistakes',
      'cost analysis',
      'comparison guide',
      'best practices',
      'case studies',
      'tools and resources'
    ];

    const gaps = commonTopics.filter(topicArea => {
      return !existingContent.some(content => 
        content.title?.toLowerCase().includes(topicArea.toLowerCase())
      );
    });

    return gaps.map(gap => ({
      gap_area: gap,
      opportunity: `Create comprehensive content about ${gap} for ${topic}`,
      priority: 'medium'
    }));
  }

  extractRecentDevelopments(articles) {
    return articles.slice(0, 5).map(article => ({
      title: article.title,
      date: article.date || new Date().toISOString(),
      summary: article.snippet || '',
      source: article.domain || '',
      url: article.url
    }));
  }

  // Fallback methods
  fallbackResearch(topic, clusterContext) {
    return {
      topic,
      timestamp: new Date().toISOString(),
      context: clusterContext,
      results: {
        marketAnalysis: {
          summary: `Market analysis for ${topic} shows growing demand and opportunities.`,
          keyFindings: [
            { finding: `${topic} market is expanding`, confidence: 0.7 }
          ]
        }
      },
      insights: this.fallbackInsights(topic),
      clusterRecommendations: this.fallbackClusterRecommendations(topic)
    };
  }

  fallbackInsights(topic) {
    return {
      market_opportunity: `${topic} presents significant market opportunities for content marketing.`,
      competitive_landscape: `Competition exists but opportunities for differentiation remain.`,
      content_strategy: `Focus on comprehensive, authoritative content that addresses user needs.`,
      target_audience: `Business professionals and decision-makers interested in ${topic}.`
    };
  }

  fallbackClusterRecommendations(topic) {
    return {
      pillar_content: [
        {
          title: `Complete Guide to ${topic}`,
          target_keyword: `${topic} guide`,
          content_type: 'comprehensive guide',
          difficulty: 'Medium',
          business_value: 'High',
          brief: `Authoritative resource covering all aspects of ${topic}.`
        }
      ],
      supporting_content: [
        {
          title: `How to Get Started with ${topic}`,
          target_keyword: `${topic} for beginners`,
          content_type: 'how-to guide',
          difficulty: 'Low',
          business_value: 'High',
          brief: `Step-by-step guide for newcomers to ${topic}.`
        },
        {
          title: `${topic} Best Practices`,
          target_keyword: `${topic} best practices`,
          content_type: 'listicle',
          difficulty: 'Medium',
          business_value: 'Medium',
          brief: `Expert recommendations and proven strategies.`
        }
      ],
      rapid_content: [
        {
          title: `What is ${topic}?`,
          target_keyword: `what is ${topic}`,
          content_type: 'definition',
          difficulty: 'Low',
          business_value: 'Medium',
          brief: `Clear explanation of ${topic} fundamentals.`
        }
      ]
    };
  }
}

export default AdvancedResearchService;