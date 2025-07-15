class EnhancedContentService {
  constructor() {
    this.apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    this.baseURL = 'http://localhost:3001';
  }

  // Enhanced content generation with Perplexity research integration
  async generateEnhancedContent(website, keywords, businessType, contentType = 'blog', userProfile = null) {
    try {
      console.log('🚀 Starting enhanced content generation with research...');
      
      // Step 1: Extract location and industry context from user profile
      const context = this.extractUserContext(userProfile, businessType);
      
      // Step 2: Conduct real-time research using Perplexity
      const researchData = await this.conductPerplexityResearch(keywords, context);
      
      // Step 3: Analyze website for additional context
      const websiteAnalysis = await this.analyzeWebsiteContext(website);
      
      // Step 4: Generate content structure with research insights
      const contentStructure = await this.generateResearchBasedStructure(
        keywords, 
        context, 
        contentType, 
        researchData
      );
      
      // Step 5: Create detailed content with citations
      const content = await this.generateDetailedContentWithResearch(
        contentStructure, 
        websiteAnalysis, 
        keywords, 
        researchData,
        context
      );
      
      // Step 6: Generate supporting elements
      const images = await this.generateSupportingImages(content, keywords, context);
      const metadata = this.generateLocalizedMetadata(content, keywords, context);
      
      return {
        content,
        images,
        research: researchData,
        metadata,
        context,
        exports: {
          html: this.generateHTMLExport(content, images, researchData, metadata),
          markdown: this.generateMarkdownExport(content, images, researchData, metadata),
          text: this.generateTextExport(content),
          json: this.generateJSONExport(content, images, researchData, metadata)
        }
      };
    } catch (error) {
      console.error('Enhanced content generation failed:', error);
      return this.fallbackContentGeneration(keywords, businessType);
    }
  }

  // Extract user context for localization and industry targeting
  extractUserContext(userProfile, businessType) {
    const context = {
      location: {
        city: 'Auckland', // Default fallback
        country: 'New Zealand',
        region: 'Auckland Region'
      },
      industry: businessType || 'general',
      business: {
        name: 'Your Business',
        type: businessType
      },
      audience: 'local customers',
      compliance: [],
      currency: 'NZD'
    };

    if (userProfile) {
      // Extract location from website or company info
      if (userProfile.website) {
        context.location = this.inferLocationFromWebsite(userProfile.website);
      }
      
      // Use industry from user profile
      if (userProfile.industry) {
        context.industry = userProfile.industry;
      }
      
      // Use company name if available
      if (userProfile.company) {
        context.business.name = userProfile.company;
      }
      
      // Set local compliance requirements based on location
      context.compliance = this.getLocalCompliance(context.location);
      
      // Set currency and local considerations
      context.currency = this.getCurrencyForLocation(context.location);
      context.audience = this.getAudienceDescription(context.location, context.industry);
    }

    return context;
  }

  // Conduct comprehensive research using Perplexity
  async conductPerplexityResearch(keywords, context) {
    const researchQueries = this.generateResearchQueries(keywords, context);
    const researchResults = {
      marketData: null,
      industryTrends: null,
      localRegulations: null,
      competitorAnalysis: null,
      statisticsAndData: null,
      recentDevelopments: null,
      sources: []
    };

    try {
      console.log('🔍 Conducting Perplexity research...');
      
      // Research market data and statistics
      researchResults.marketData = await this.perplexitySearch(
        researchQueries.marketData,
        'Market statistics and data'
      );
      
      // Research industry trends
      researchResults.industryTrends = await this.perplexitySearch(
        researchQueries.industryTrends,
        'Industry trends and developments'
      );
      
      // Research local regulations and compliance
      if (researchQueries.localRegulations) {
        researchResults.localRegulations = await this.perplexitySearch(
          researchQueries.localRegulations,
          'Local regulations and compliance'
        );
      }
      
      // Research recent developments
      researchResults.recentDevelopments = await this.perplexitySearch(
        researchQueries.recentNews,
        'Recent industry developments'
      );

      console.log('✅ Research completed successfully');
      return researchResults;
      
    } catch (error) {
      console.error('Research failed:', error);
      return this.getFallbackResearch(keywords, context);
    }
  }

  // Generate targeted research queries based on topic and context
  generateResearchQueries(keywords, context) {
    const { location, industry } = context;
    const currentYear = new Date().getFullYear();
    
    return {
      marketData: `${keywords} market size statistics ${location.country} ${currentYear}`,
      industryTrends: `${industry} industry trends ${location.country} ${currentYear} latest developments`,
      localRegulations: location.country !== 'Global' ? 
        `${keywords} regulations ${location.country} compliance requirements ${currentYear}` : null,
      competitorAnalysis: `top ${keywords} companies ${location.city} ${location.country}`,
      recentNews: `${keywords} news ${location.country} ${currentYear} recent developments`,
      costData: `${keywords} cost pricing ${location.country} ${currentYear}`,
      demographics: `${keywords} customer demographics ${location.country} market research`
    };
  }

  // Execute Perplexity search via backend
  async perplexitySearch(query, category) {
    try {
      const response = await fetch(`${this.baseURL}/api/perplexity-research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          category,
          max_results: 5
        })
      });
      
      if (!response.ok) {
        throw new Error(`Perplexity search failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return {
        query,
        category,
        results: result.results || [],
        summary: result.summary || '',
        sources: result.sources || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Perplexity search error for ${category}:`, error);
      return {
        query,
        category,
        results: [],
        summary: '',
        sources: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Generate content structure enhanced with research insights
  async generateResearchBasedStructure(keywords, context, contentType, researchData) {
    const prompt = `Create a comprehensive, research-backed content structure for ${contentType} about "${keywords}" targeting ${context.audience} in ${context.location.city}, ${context.location.country}.

BUSINESS CONTEXT:
- Industry: ${context.industry}
- Location: ${context.location.city}, ${context.location.country}
- Currency: ${context.currency}
- Target Audience: ${context.audience}

RESEARCH INSIGHTS TO INCORPORATE:
${this.formatResearchForPrompt(researchData)}

LOCALIZATION REQUIREMENTS:
- Use ${context.location.country} spelling and terminology
- Include local regulations and compliance where relevant
- Reference local market data and statistics
- Use ${context.currency} for pricing information
- Include location-specific examples and case studies

CONTENT REQUIREMENTS:
- 2000+ words comprehensive guide
- SEO-optimized with primary keyword: "${keywords}"
- Include local statistics and data with citations
- Add regulatory/compliance information specific to ${context.location.country}
- Professional tone suitable for ${context.industry} industry
- Include cost information in ${context.currency}
- Add FAQ section with location-specific questions

STRUCTURE NEEDED:
- SEO-optimized title with location
- Meta description (155 chars max)
- Introduction with local context
- 8-12 main sections (H2) with local relevance
- 3-4 subsections per main section (H3)
- Statistics and data integration points
- Local compliance/regulatory section
- Cost and pricing guidance
- FAQ section (minimum 4 Q&As)
- Strong call-to-action

Return detailed outline with:
1. SEO title and meta description
2. Section-by-section breakdown
3. Key statistics to include per section
4. Local examples and case studies to mention
5. Compliance points to address
6. Target word count per section`;

    try {
      const response = await fetch(`${this.baseURL}/api/claude-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          max_tokens: 4000
        })
      });
      
      if (!response.ok) throw new Error('Structure generation failed');
      const result = await response.json();
      return this.parseResearchBasedStructure(result.content, researchData);
    } catch (error) {
      console.error('Research-based structure generation error:', error);
      return this.fallbackContentStructure(keywords, context);
    }
  }

  // Generate detailed content with research citations
  async generateDetailedContentWithResearch(structure, websiteAnalysis, keywords, researchData, context) {
    let fullContent = '';
    
    for (const section of structure.sections) {
      console.log(`📝 Generating section: ${section.title}`);
      
      const sectionPrompt = `Write a comprehensive section about "${section.title}" for an article about "${keywords}" targeting ${context.audience} in ${context.location.city}, ${context.location.country}.

SECTION REQUIREMENTS:
- Target length: ${section.wordCount || '200-300'} words
- Industry: ${context.industry}
- Location: ${context.location.city}, ${context.location.country}
- Use ${context.location.country} spelling
- Currency: ${context.currency}

RESEARCH DATA TO INCORPORATE:
${this.formatRelevantResearch(researchData, section.title)}

SECTION CONTEXT:
${section.description}

KEY POINTS TO COVER:
${section.keyPoints ? section.keyPoints.map(point => `- ${point}`).join('\n') : '- Key information about the topic'}

WRITING GUIDELINES:
- Professional tone suitable for ${context.industry}
- Include specific local examples where relevant
- Cite statistics with (Source: [Domain], [Year]) format
- Use active voice and second person ("you")
- Include actionable advice
- Reference local regulations if applicable
- Use real ${context.currency} pricing where appropriate
- Maximum 4 sentences per paragraph
- Include relevant local case studies or examples

${section.includeCallout ? 'Include a highlighted callout box with key tip or statistic.' : ''}
${section.includeList ? 'Format key information as bulleted or numbered lists.' : ''}

Write engaging, informative content that establishes authority while being practical and actionable.`;

      try {
        const response = await fetch(`${this.baseURL}/api/claude-generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: sectionPrompt,
            max_tokens: 2000
          })
        });
        
        if (!response.ok) throw new Error(`Section generation failed for ${section.title}`);
        const result = await response.json();
        
        fullContent += `\n\n## ${section.title}\n\n${result.content}`;
        
        // Add brief delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error generating section ${section.title}:`, error);
        fullContent += `\n\n## ${section.title}\n\n[Content generation failed for this section]`;
      }
    }

    // Add FAQ section if included in structure
    if (structure.includeFAQ) {
      const faqContent = await this.generateLocalizedFAQ(keywords, context, researchData);
      fullContent += faqContent;
    }

    // Add final call-to-action
    const ctaContent = this.generateLocalizedCTA(context);
    fullContent += ctaContent;

    return fullContent;
  }

  // Generate FAQ section with local context
  async generateLocalizedFAQ(keywords, context, researchData) {
    const faqPrompt = `Generate 4-6 frequently asked questions and detailed answers about "${keywords}" specifically for customers in ${context.location.city}, ${context.location.country}.

CONTEXT:
- Industry: ${context.industry}
- Location: ${context.location.city}, ${context.location.country}
- Target Audience: ${context.audience}
- Currency: ${context.currency}

RESEARCH INSIGHTS:
${this.formatResearchForPrompt(researchData, 'summary')}

REQUIREMENTS:
- Questions should reflect local concerns and regulations
- Include pricing questions with ${context.currency} context
- Address local compliance or regulatory questions
- Use ${context.location.country} spelling and terminology
- Include practical, actionable answers
- Reference local authorities or regulations where relevant
- 100-150 words per answer

Format as:
**Q: [Question]**
A: [Detailed answer with local context]

Focus on the most common concerns local customers would have about ${keywords}.`;

    try {
      const response = await fetch(`${this.baseURL}/api/claude-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: faqPrompt,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) throw new Error('FAQ generation failed');
      const result = await response.json();
      
      return `\n\n## Frequently Asked Questions\n\n${result.content}`;
    } catch (error) {
      console.error('FAQ generation error:', error);
      return '\n\n## Frequently Asked Questions\n\n[FAQ content generation failed]';
    }
  }

  // Format research data for prompt inclusion
  formatResearchForPrompt(researchData, type = 'full') {
    if (!researchData) return 'No specific research data available.';
    
    let formatted = '';
    
    if (type === 'summary') {
      // Brief summary for shorter prompts
      if (researchData.marketData?.summary) {
        formatted += `Market Data: ${researchData.marketData.summary}\n`;
      }
      if (researchData.industryTrends?.summary) {
        formatted += `Industry Trends: ${researchData.industryTrends.summary}\n`;
      }
      return formatted || 'Limited research data available.';
    }
    
    // Full formatting for detailed prompts
    Object.entries(researchData).forEach(([category, data]) => {
      if (data && data.summary && category !== 'sources') {
        formatted += `\n${category.toUpperCase()}:\n${data.summary}\n`;
        
        if (data.sources && data.sources.length > 0) {
          formatted += `Sources: ${data.sources.slice(0, 2).map(s => s.domain || s.url).join(', ')}\n`;
        }
      }
    });
    
    return formatted || 'No specific research data available.';
  }

  // Format relevant research for specific sections
  formatRelevantResearch(researchData, sectionTitle) {
    if (!researchData) return 'No specific research available for this section.';
    
    // Logic to match research categories to section titles
    const relevantData = [];
    const lowerTitle = sectionTitle.toLowerCase();
    
    if (lowerTitle.includes('cost') || lowerTitle.includes('pric')) {
      if (researchData.marketData) relevantData.push(researchData.marketData);
    }
    
    if (lowerTitle.includes('trend') || lowerTitle.includes('future')) {
      if (researchData.industryTrends) relevantData.push(researchData.industryTrends);
    }
    
    if (lowerTitle.includes('regulat') || lowerTitle.includes('complian')) {
      if (researchData.localRegulations) relevantData.push(researchData.localRegulations);
    }
    
    // Default to market data if no specific match
    if (relevantData.length === 0 && researchData.marketData) {
      relevantData.push(researchData.marketData);
    }
    
    return relevantData.map(data => data.summary).join('\n') || 'No specific research available for this section.';
  }

  // Helper methods for localization
  inferLocationFromWebsite(website) {
    // Basic logic to infer location from domain or other signals
    if (website.includes('.co.nz') || website.includes('auckland') || website.includes('newzealand')) {
      return {
        city: 'Auckland',
        country: 'New Zealand',
        region: 'Auckland Region'
      };
    }
    if (website.includes('.com.au') || website.includes('australia')) {
      return {
        city: 'Sydney',
        country: 'Australia',
        region: 'New South Wales'
      };
    }
    if (website.includes('.co.uk') || website.includes('london') || website.includes('britain')) {
      return {
        city: 'London',
        country: 'United Kingdom',
        region: 'Greater London'
      };
    }
    if (website.includes('.ca') || website.includes('canada') || website.includes('toronto')) {
      return {
        city: 'Toronto',
        country: 'Canada',
        region: 'Ontario'
      };
    }
    // Default fallback
    return {
      city: 'Auckland',
      country: 'New Zealand',
      region: 'Auckland Region'
    };
  }

  getLocalCompliance(location) {
    const complianceMap = {
      'New Zealand': ['Building Code', 'Health and Safety at Work Act', 'Commerce Act'],
      'Australia': ['Building Code of Australia', 'Work Health and Safety Act', 'Competition and Consumer Act'],
      'United Kingdom': ['Building Regulations', 'Health and Safety at Work Act', 'Consumer Rights Act'],
      'Canada': ['National Building Code', 'Occupational Health and Safety Act', 'Competition Act'],
      'United States': ['International Building Code', 'OSHA Standards', 'Federal Trade Commission Act']
    };
    
    return complianceMap[location.country] || [];
  }

  getCurrencyForLocation(location) {
    const currencyMap = {
      'New Zealand': 'NZD',
      'Australia': 'AUD',
      'United States': 'USD',
      'United Kingdom': 'GBP',
      'Canada': 'CAD'
    };
    
    return currencyMap[location.country] || 'USD';
  }

  getAudienceDescription(location, industry) {
    return `${industry} customers in ${location.city}, ${location.country}`;
  }

  // Generate localized metadata
  generateLocalizedMetadata(content, keywords, context) {
    const title = `${keywords} in ${context.location.city} - Complete Guide`;
    const description = `Expert guide to ${keywords} in ${context.location.city}, ${context.location.country}. Local insights, costs, and regulations.`;
    
    return {
      title: title.substring(0, 60),
      description: description.substring(0, 155),
      keywords: `${keywords}, ${context.location.city}, ${context.location.country}, ${context.industry}`,
      author: context.business.name,
      location: context.location,
      industry: context.industry,
      currency: context.currency
    };
  }

  // Generate localized call-to-action
  generateLocalizedCTA(context) {
    return `\n\n## Get Expert Help in ${context.location.city}\n\nReady to get started with ${context.industry} services in ${context.location.city}? Our local experts understand the specific requirements and regulations in ${context.location.country}.\n\n**Contact us today for:**\n- Free consultation\n- Local expertise\n- Compliance guidance\n- Competitive ${context.currency} pricing\n\n[Get Your Free Quote →](/contact)`;
  }

  // Parse research-based structure
  parseResearchBasedStructure(content, researchData) {
    // Basic parsing - in a real implementation, this would be more sophisticated
    const lines = content.split('\n').filter(line => line.trim());
    const sections = [];
    
    // Extract title
    const title = lines[0] || 'Generated Content Guide';
    
    // Create basic sections structure
    const sectionTitles = [
      'Introduction and Overview',
      'Market Analysis and Trends',
      'Local Regulations and Compliance',
      'Cost Analysis and Pricing',
      'Best Practices and Implementation',
      'Case Studies and Examples'
    ];
    
    sectionTitles.forEach((sectionTitle, index) => {
      sections.push({
        title: sectionTitle,
        description: `Detailed information about ${sectionTitle.toLowerCase()}`,
        keyPoints: [
          'Key insight 1',
          'Key insight 2', 
          'Key insight 3'
        ],
        wordCount: 300 + (index * 50),
        includeCallout: index % 2 === 0,
        includeList: index % 3 === 0
      });
    });
    
    return {
      title,
      sections,
      includeFAQ: true,
      totalWordCount: 2000
    };
  }

  // Fallback methods
  getFallbackResearch(keywords, context) {
    return {
      marketData: {
        summary: `${keywords} is a growing market in ${context.location.country} with increasing demand.`,
        sources: []
      },
      industryTrends: {
        summary: `The ${context.industry} industry continues to evolve with new technologies and changing customer needs.`,
        sources: []
      },
      localRegulations: {
        summary: `Businesses in ${context.location.country} must comply with relevant local regulations and standards.`,
        sources: []
      }
    };
  }

  fallbackContentStructure(keywords, context) {
    return {
      title: `Complete Guide to ${keywords} in ${context.location.city}`,
      sections: [
        {
          title: `Why ${keywords} Matters in ${context.location.city}`,
          description: `Local importance and context for ${keywords}`,
          keyPoints: ['Local market overview', 'Regional considerations', 'Key benefits'],
          wordCount: 300,
          includeCallout: true,
          includeList: true
        },
        {
          title: `Understanding ${keywords} in ${context.location.country}`,
          description: `Comprehensive overview of ${keywords}`,
          keyPoints: ['Industry standards', 'Best practices', 'Common challenges'],
          wordCount: 350,
          includeCallout: false,
          includeList: true
        },
        {
          title: `Cost and Pricing for ${keywords} in ${context.location.city}`,
          description: `Local pricing and cost considerations`,
          keyPoints: ['Pricing factors', 'Cost comparisons', 'Budget planning'],
          wordCount: 300,
          includeCallout: true,
          includeList: false
        }
      ],
      includeFAQ: true,
      totalWordCount: 2000
    };
  }

  // Existing methods for compatibility
  async analyzeWebsiteContext(website) {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website })
      });
      
      if (!response.ok) throw new Error('Website analysis failed');
      return await response.json();
    } catch (error) {
      console.error('Website analysis error:', error);
      return this.fallbackWebsiteAnalysis(website);
    }
  }

  async generateSupportingImages(content, keywords, context) {
    // Implementation for image generation/suggestions
    return [
      {
        filename: `${keywords.replace(/\s+/g, '-').toLowerCase()}-${context.location.city.toLowerCase()}.jpg`,
        altText: `${keywords} in ${context.location.city}, ${context.location.country}`,
        description: `Professional ${keywords} services in ${context.location.city}`,
        placement: 'hero'
      },
      {
        filename: `${keywords.replace(/\s+/g, '-').toLowerCase()}-guide.jpg`,
        altText: `Complete guide to ${keywords}`,
        description: `Step-by-step guide to ${keywords}`,
        placement: 'content'
      }
    ];
  }

  // Export methods
  generateHTMLExport(content, images, research, metadata) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${metadata.title}</title>
    <meta name="description" content="${metadata.description}">
    <meta name="keywords" content="${metadata.keywords}">
    <meta name="author" content="${metadata.author}">
</head>
<body>
    <article>
        ${content.replace(/\n/g, '<br>').replace(/##/g, '<h2>').replace(/<h2>/g, '</p><h2>').replace(/<br><br>/g, '</p><p>')}
    </article>
</body>
</html>`;
  }

  generateMarkdownExport(content, images, research, metadata) {
    let markdown = `---
title: ${metadata.title}
description: ${metadata.description}
keywords: ${metadata.keywords}
location: ${metadata.location.city}, ${metadata.location.country}
industry: ${metadata.industry}
currency: ${metadata.currency}
generated: ${new Date().toISOString()}
---

${content}

## Sources and References

`;

    // Add research sources
    if (research) {
      Object.entries(research).forEach(([category, data]) => {
        if (data && data.sources && data.sources.length > 0) {
          markdown += `\n### ${category}\n`;
          data.sources.forEach((source, index) => {
            markdown += `${index + 1}. ${source.title || 'Research Source'} - ${source.url || source.domain}\n`;
          });
        }
      });
    }

    return markdown;
  }

  generateTextExport(content) {
    return content.replace(/##/g, '').replace(/\n/g, '\n');
  }

  generateJSONExport(content, images, research, metadata) {
    return JSON.stringify({
      metadata,
      content,
      images,
      research,
      generated: new Date().toISOString()
    }, null, 2);
  }

  fallbackContentGeneration(keywords, businessType) {
    return {
      content: `# ${keywords} Guide\n\nComprehensive information about ${keywords} for ${businessType} businesses.\n\n## Overview\n\nThis guide provides essential information about ${keywords} tailored for your business needs.\n\n## Key Considerations\n\n- Industry best practices\n- Local requirements\n- Cost considerations\n- Implementation strategies\n\n## Getting Started\n\nTo begin with ${keywords}, consider the following steps:\n\n1. Assess your current situation\n2. Research local requirements\n3. Plan your implementation\n4. Seek professional guidance if needed\n\n## Conclusion\n\n${keywords} is an important consideration for businesses in your industry. Proper planning and implementation can lead to significant benefits.`,
      images: [],
      research: { sources: [] },
      metadata: { 
        title: `${keywords} Guide`, 
        description: `Comprehensive guide to ${keywords}`,
        keywords: keywords,
        location: { city: 'Auckland', country: 'New Zealand' },
        industry: businessType,
        currency: 'NZD'
      },
      exports: {
        html: `<h1>${keywords} Guide</h1><p>Comprehensive information about ${keywords}</p>`,
        markdown: `# ${keywords} Guide\n\nComprehensive information about ${keywords}`,
        text: `${keywords} Guide\n\nComprehensive information about ${keywords}`,
        json: JSON.stringify({ title: keywords, content: `Guide to ${keywords}` })
      }
    };
  }

  fallbackWebsiteAnalysis(website) {
    return {
      domain: website,
      business_type: 'general',
      target_audience: 'general public',
      key_services: [],
      content_gaps: []
    };
  }
}

export default EnhancedContentService;