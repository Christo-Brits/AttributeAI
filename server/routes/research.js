// Enhanced Research API Endpoints for Advanced Research Service
const express = require('express');
const router = express.Router();

// Web search endpoint using multiple sources
router.post('/web-search', async (req, res) => {
  try {
    const { query, num_results = 8, include_snippets = true } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`🔍 Conducting web search for: ${query}`);

    // Simulate web search results (in production, integrate with Brave Search API or similar)
    const results = await simulateWebSearch(query, num_results);
    
    const response = {
      query,
      results: results.map(result => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        domain: extractDomain(result.url),
        relevance_score: result.relevance || 0.8
      })),
      summary: generateSearchSummary(results, query),
      timestamp: new Date().toISOString(),
      total_results: results.length
    };

    res.json(response);

  } catch (error) {
    console.error('Web search error:', error);
    res.status(500).json({ 
      error: 'Web search failed',
      details: error.message 
    });
  }
});

// Perplexity research endpoint for authoritative information
router.post('/perplexity-research', async (req, res) => {
  try {
    const { query, search_type = 'comprehensive', include_citations = true } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`🧠 Conducting Perplexity research for: ${query}`);

    // Simulate Perplexity API response (in production, integrate with Perplexity API)
    const researchData = await simulatePerplexityResearch(query, search_type);
    
    const response = {
      query,
      answer: researchData.answer,
      citations: researchData.citations,
      confidence: researchData.confidence,
      search_type,
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Perplexity research error:', error);
    res.status(500).json({ 
      error: 'Perplexity research failed',
      details: error.message 
    });
  }
});

// Market data analysis endpoint
router.post('/market-analysis', async (req, res) => {
  try {
    const { topic, location = 'New Zealand', industry = 'general' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`📊 Conducting market analysis for: ${topic} in ${location}`);

    const marketData = await analyzeMarketData(topic, location, industry);
    
    res.json({
      topic,
      location,
      industry,
      market_size: marketData.market_size,
      growth_rate: marketData.growth_rate,
      key_players: marketData.key_players,
      trends: marketData.trends,
      opportunities: marketData.opportunities,
      challenges: marketData.challenges,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Market analysis error:', error);
    res.status(500).json({ 
      error: 'Market analysis failed',
      details: error.message 
    });
  }
});

// Competitor analysis endpoint
router.post('/competitor-analysis', async (req, res) => {
  try {
    const { topic, location = 'New Zealand', num_competitors = 10 } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`🎯 Conducting competitor analysis for: ${topic}`);

    const competitors = await analyzeCompetitors(topic, location, num_competitors);
    
    res.json({
      topic,
      location,
      competitors: competitors.map(comp => ({
        name: comp.name,
        website: comp.website,
        description: comp.description,
        strengths: comp.strengths,
        weaknesses: comp.weaknesses,
        content_strategy: comp.content_strategy,
        market_position: comp.market_position
      })),
      competitive_gaps: identifyCompetitiveGaps(competitors, topic),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Competitor analysis error:', error);
    res.status(500).json({ 
      error: 'Competitor analysis failed',
      details: error.message 
    });
  }
});

// Content gap analysis endpoint
router.post('/content-gap-analysis', async (req, res) => {
  try {
    const { topic, competitor_urls = [], target_audience = 'general' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`📝 Conducting content gap analysis for: ${topic}`);

    const contentGaps = await analyzeContentGaps(topic, competitor_urls, target_audience);
    
    res.json({
      topic,
      target_audience,
      analyzed_competitors: competitor_urls.length,
      content_gaps: contentGaps.gaps,
      opportunities: contentGaps.opportunities,
      recommendations: contentGaps.recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content gap analysis error:', error);
    res.status(500).json({ 
      error: 'Content gap analysis failed',
      details: error.message 
    });
  }
});

// Trend analysis endpoint
router.post('/trend-analysis', async (req, res) => {
  try {
    const { topic, timeframe = '12_months', industry = 'general' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`📈 Conducting trend analysis for: ${topic}`);

    const trends = await analyzeTrends(topic, timeframe, industry);
    
    res.json({
      topic,
      timeframe,
      industry,
      emerging_trends: trends.emerging,
      declining_trends: trends.declining,
      stable_trends: trends.stable,
      predictions: trends.predictions,
      innovation_areas: trends.innovations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Trend analysis error:', error);
    res.status(500).json({ 
      error: 'Trend analysis failed',
      details: error.message 
    });
  }
});

// Regulatory analysis endpoint
router.post('/regulatory-analysis', async (req, res) => {
  try {
    const { topic, location = 'New Zealand', industry = 'general' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`⚖️ Conducting regulatory analysis for: ${topic} in ${location}`);

    const regulations = await analyzeRegulations(topic, location, industry);
    
    res.json({
      topic,
      location,
      industry,
      applicable_regulations: regulations.applicable,
      compliance_requirements: regulations.compliance,
      recent_changes: regulations.recent_changes,
      upcoming_changes: regulations.upcoming,
      impact_assessment: regulations.impact,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Regulatory analysis error:', error);
    res.status(500).json({ 
      error: 'Regulatory analysis failed',
      details: error.message 
    });
  }
});

// ==================== SIMULATION FUNCTIONS ====================

// Simulate web search results
async function simulateWebSearch(query, num_results) {
  // In production, this would call actual search APIs
  const baseResults = [
    {
      title: `Complete Guide to ${query}`,
      url: `https://example.com/guide-${query.replace(/\s+/g, '-').toLowerCase()}`,
      snippet: `Comprehensive information about ${query} including best practices, strategies, and implementation guidelines.`,
      relevance: 0.95
    },
    {
      title: `${query} Best Practices for 2024`,
      url: `https://industry-blog.com/${query.replace(/\s+/g, '-')}-best-practices`,
      snippet: `Latest best practices and trends in ${query} for businesses looking to improve their strategy.`,
      relevance: 0.92
    },
    {
      title: `How to Choose the Right ${query} Solution`,
      url: `https://business-insights.com/choosing-${query.replace(/\s+/g, '-')}`,
      snippet: `Expert advice on selecting the best ${query} solution for your business needs and budget.`,
      relevance: 0.88
    },
    {
      title: `${query} Market Analysis and Statistics`,
      url: `https://market-research.com/${query.replace(/\s+/g, '-')}-market-analysis`,
      snippet: `Detailed market analysis with statistics, growth projections, and industry insights for ${query}.`,
      relevance: 0.85
    },
    {
      title: `Common ${query} Mistakes to Avoid`,
      url: `https://expert-advice.com/${query.replace(/\s+/g, '-')}-mistakes`,
      snippet: `Learn about the most common mistakes businesses make with ${query} and how to avoid them.`,
      relevance: 0.82
    },
    {
      title: `${query} Case Studies and Success Stories`,
      url: `https://case-studies.com/${query.replace(/\s+/g, '-')}-success`,
      snippet: `Real-world case studies showcasing successful ${query} implementations and their results.`,
      relevance: 0.80
    },
    {
      title: `${query} Pricing and Cost Analysis`,
      url: `https://pricing-guide.com/${query.replace(/\s+/g, '-')}-costs`,
      snippet: `Comprehensive pricing guide and cost analysis for ${query} solutions and services.`,
      relevance: 0.78
    },
    {
      title: `Future of ${query}: Trends and Predictions`,
      url: `https://future-trends.com/${query.replace(/\s+/g, '-')}-future`,
      snippet: `Expert predictions and emerging trends shaping the future of ${query} industry.`,
      relevance: 0.75
    }
  ];

  return baseResults.slice(0, num_results);
}

// Simulate Perplexity research
async function simulatePerplexityResearch(query, search_type) {
  const researchAnswers = {
    comprehensive: `Based on current market research and industry analysis, ${query} represents a significant growth opportunity. Recent studies indicate strong demand with emerging trends pointing toward increased adoption. Key factors driving growth include technological advancement, changing consumer behavior, and regulatory support.`,
    
    statistical: `Current market data for ${query} shows: Market size of $2.3B globally, 15.2% CAGR over last 3 years, 67% adoption rate among target businesses, and projected 25% growth by 2025.`,
    
    trends: `Emerging trends in ${query} include: AI integration (78% of companies planning adoption), sustainability focus (52% prioritizing green solutions), remote accessibility (89% requiring cloud-based options), and automation capabilities (43% seeking workflow automation).`
  };

  return {
    answer: researchAnswers[search_type] || researchAnswers.comprehensive,
    citations: [
      {
        title: `${query} Market Research Report 2024`,
        url: `https://market-research.com/${query.replace(/\s+/g, '-')}-report`,
        domain: 'market-research.com',
        snippet: `Authoritative market research on ${query} trends and statistics.`
      },
      {
        title: `Industry Analysis: ${query} Growth Projections`,
        url: `https://industry-insights.com/${query.replace(/\s+/g, '-')}-analysis`,
        domain: 'industry-insights.com',
        snippet: `Professional analysis of ${query} market dynamics and future outlook.`
      },
      {
        title: `${query} Business Impact Study`,
        url: `https://business-studies.com/${query.replace(/\s+/g, '-')}-impact`,
        domain: 'business-studies.com',
        snippet: `Comprehensive study on business impact and ROI of ${query} initiatives.`
      }
    ],
    confidence: 0.87
  };
}

// Analyze market data
async function analyzeMarketData(topic, location, industry) {
  return {
    market_size: {
      value: Math.floor(Math.random() * 5000 + 1000),
      currency: location === 'New Zealand' ? 'NZD' : 'USD',
      unit: 'millions',
      year: 2024
    },
    growth_rate: {
      annual: `${(Math.random() * 20 + 5).toFixed(1)}%`,
      projected_3_year: `${(Math.random() * 30 + 10).toFixed(1)}%`,
      trend: 'increasing'
    },
    key_players: [
      `Leading ${topic} Provider A`,
      `${topic} Solutions Inc.`,
      `Global ${topic} Corp`,
      `Local ${topic} Specialists`
    ],
    trends: [
      `AI integration in ${topic}`,
      `Sustainable ${topic} practices`,
      `Remote ${topic} solutions`,
      `Automated ${topic} workflows`
    ],
    opportunities: [
      `Small business ${topic} market underserved`,
      `Growing demand for ${topic} consulting`,
      `Mobile ${topic} solutions needed`,
      `Integration with existing tools`
    ],
    challenges: [
      `High implementation costs`,
      `Skills shortage in ${topic}`,
      `Regulatory complexity`,
      `Technology adoption barriers`
    ]
  };
}

// Analyze competitors
async function analyzeCompetitors(topic, location, num_competitors) {
  const competitors = [];
  
  for (let i = 1; i <= Math.min(num_competitors, 8); i++) {
    competitors.push({
      name: `${topic} Expert ${i}`,
      website: `https://${topic.replace(/\s+/g, '')}-expert${i}.com`,
      description: `Leading provider of ${topic} solutions with ${Math.floor(Math.random() * 15 + 3)} years experience`,
      strengths: [
        `Strong ${topic} expertise`,
        `Established market presence`,
        `Comprehensive service offering`
      ],
      weaknesses: [
        `Limited digital presence`,
        `Higher pricing than competitors`,
        `Slow adoption of new technologies`
      ],
      content_strategy: {
        blog_frequency: `${Math.floor(Math.random() * 4 + 1)} posts/month`,
        social_presence: Math.random() > 0.5 ? 'Active' : 'Limited',
        seo_strength: ['Weak', 'Moderate', 'Strong'][Math.floor(Math.random() * 3)]
      },
      market_position: ['Leader', 'Challenger', 'Follower'][Math.floor(Math.random() * 3)]
    });
  }
  
  return competitors;
}

// Analyze content gaps
async function analyzeContentGaps(topic, competitor_urls, target_audience) {
  return {
    gaps: [
      {
        gap_type: 'Educational Content',
        description: `Lack of comprehensive beginner guides for ${topic}`,
        opportunity_size: 'High',
        difficulty: 'Medium'
      },
      {
        gap_type: 'Case Studies',
        description: `Missing real-world success stories in ${topic}`,
        opportunity_size: 'Medium',
        difficulty: 'Low'
      },
      {
        gap_type: 'Comparison Content',
        description: `No detailed comparison guides for ${topic} solutions`,
        opportunity_size: 'High',
        difficulty: 'Medium'
      },
      {
        gap_type: 'Cost Information',
        description: `Limited transparent pricing information for ${topic}`,
        opportunity_size: 'Medium',
        difficulty: 'Low'
      }
    ],
    opportunities: [
      `Create comprehensive ${topic} learning path`,
      `Develop ${topic} ROI calculator`,
      `Build ${topic} comparison tool`,
      `Produce ${topic} video tutorials`
    ],
    recommendations: [
      {
        content_type: 'Ultimate Guide',
        title: `Complete Guide to ${topic}`,
        priority: 'High',
        estimated_traffic: '10,000+ monthly visits'
      },
      {
        content_type: 'Interactive Tool',
        title: `${topic} Cost Calculator`,
        priority: 'Medium',
        estimated_traffic: '5,000+ monthly visits'
      },
      {
        content_type: 'Video Series',
        title: `${topic} Masterclass`,
        priority: 'Medium',
        estimated_traffic: '15,000+ video views'
      }
    ]
  };
}

// Analyze trends
async function analyzeTrends(topic, timeframe, industry) {
  return {
    emerging: [
      `AI-powered ${topic} automation`,
      `Sustainable ${topic} practices`,
      `Mobile-first ${topic} solutions`,
      `Integration-focused ${topic} platforms`
    ],
    declining: [
      `Traditional ${topic} methods`,
      `Manual ${topic} processes`,
      `Desktop-only ${topic} software`
    ],
    stable: [
      `Core ${topic} fundamentals`,
      `Best practice frameworks`,
      `Industry standard protocols`
    ],
    predictions: [
      `${topic} market will grow 25% by 2025`,
      `AI integration will reach 80% adoption`,
      `Mobile solutions will dominate by 2026`,
      `Sustainability will become mandatory`
    ],
    innovations: [
      `Blockchain integration in ${topic}`,
      `IoT connectivity for ${topic}`,
      `Machine learning optimization`,
      `Voice-activated ${topic} controls`
    ]
  };
}

// Analyze regulations
async function analyzeRegulations(topic, location, industry) {
  const locationRegulations = {
    'New Zealand': {
      applicable: [
        'Privacy Act 2020',
        'Health and Safety at Work Act 2015',
        'Commerce Act 1986'
      ],
      compliance: [
        'Data protection requirements',
        'Consumer rights obligations',
        'Workplace safety standards'
      ]
    },
    'Australia': {
      applicable: [
        'Privacy Act 1988',
        'Australian Consumer Law',
        'Work Health and Safety Act'
      ],
      compliance: [
        'Privacy principle compliance',
        'Consumer guarantee requirements',
        'Workplace safety obligations'
      ]
    },
    'United States': {
      applicable: [
        'Federal Trade Commission Act',
        'Americans with Disabilities Act',
        'State-specific regulations'
      ],
      compliance: [
        'Truth in advertising',
        'Accessibility requirements',
        'State compliance obligations'
      ]
    }
  };

  const regulations = locationRegulations[location] || locationRegulations['New Zealand'];

  return {
    applicable: regulations.applicable.map(reg => ({
      name: reg,
      relevance_to_topic: `Applies to ${topic} operations`,
      compliance_level: 'Required'
    })),
    compliance: regulations.compliance.map(comp => ({
      requirement: comp,
      impact_on_topic: `Affects ${topic} implementation`,
      implementation_difficulty: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
    })),
    recent_changes: [
      {
        change: `Updated ${topic} guidelines`,
        date: '2024-01-15',
        impact: 'Medium'
      }
    ],
    upcoming: [
      {
        change: `New ${topic} compliance requirements`,
        expected_date: '2024-07-01',
        preparation_needed: 'Review current practices'
      }
    ],
    impact: {
      compliance_cost: 'Medium',
      implementation_time: '3-6 months',
      business_impact: 'Moderate',
      competitive_advantage: 'Compliance can be differentiator'
    }
  };
}

// Helper functions
function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown-domain.com';
  }
}

function generateSearchSummary(results, query) {
  return `Found ${results.length} relevant results for "${query}". Results include comprehensive guides, best practices, market analysis, and expert insights covering various aspects of the topic.`;
}

function identifyCompetitiveGaps(competitors, topic) {
  return [
    {
      gap: 'Limited educational content',
      opportunity: `Create comprehensive ${topic} learning resources`,
      competitors_addressing: Math.floor(competitors.length * 0.3)
    },
    {
      gap: 'Weak social media presence',
      opportunity: `Build strong social media strategy for ${topic}`,
      competitors_addressing: Math.floor(competitors.length * 0.4)
    },
    {
      gap: 'No interactive tools',
      opportunity: `Develop ${topic} calculators and assessment tools`,
      competitors_addressing: Math.floor(competitors.length * 0.2)
    }
  ];
}

module.exports = router; job.created_at,
      completed_at: job.completed_at
    },
    content_files: job.content_results
      .filter(r => r.status === 'completed')
      .map(result => ({
        filename: `${result.content.item.id}_${result.content.item.title.replace(/[^a-z0-9]/gi, '_')}.md`,
        content: result.content.export_formats.markdown,
        metadata: result.content.metadata
      })),
    cluster_strategy: job.cluster_plan,
    interlinking_guide: generateInterlinkingGuide(job.cluster_plan.interlinking_strategy),
    publication_calendar: job.cluster_plan.publication_schedule,
    seo_checklist: generateSEOChecklist(job.cluster_plan.seo_strategy)
  };
}

// Finalize content cluster
function finalizeContentCluster(batchJob) {
  console.log(`🎯 Finalizing content cluster: ${batchJob.id}`);
  
  batchJob.cluster_summary = {
    total_content_pieces: batchJob.content_results.length,
    successful_generations: batchJob.content_results.filter(r => r.status === 'completed').length,
    failed_generations: batchJob.failed_items,
    total_word_count: batchJob.content_results
      .filter(r => r.status === 'completed')
      .reduce((total, result) => total + (result.content?.word_count || 0), 0),
    cluster_seo_score: calculateClusterSEOScore(batchJob.content_results),
    estimated_traffic_potential: estimateTrafficPotential(batchJob.cluster_plan.content_items),
    publication_timeline: batchJob.cluster_plan.publication_schedule.timeline_weeks,
    content_types_generated: getContentTypesGenerated(batchJob.content_results)
  };

  // Generate cluster export package
  batchJob.export_package = generateExportPackage(batchJob);
}

// Helper functions
function estimateCompletionTime(itemCount) {
  const minutesPerItem = 3;
  const estimatedMinutes = itemCount * minutesPerItem;
  const completionTime = new Date(Date.now() + estimatedMinutes * 60 * 1000);
  return completionTime.toISOString();
}

function sortContentItemsByDependencies(contentItems) {
  const pillar = contentItems.filter(item => item.type === 'pillar');
  const supporting = contentItems.filter(item => item.type === 'supporting');
  const rapid = contentItems.filter(item => item.type === 'rapid');
  
  return [...pillar, ...supporting, ...rapid];
}

function createProcessingBatches(sortedItems, batchSize = 3) {
  const batches = [];
  
  for (let i = 0; i < sortedItems.length; i += batchSize) {
    batches.push(sortedItems.slice(i, i + batchSize));
  }
  
  return batches;
}

function inferTargetAudience(item, userProfile) {
  if (userProfile?.targetAudience) return userProfile.targetAudience;
  
  const audienceMap = {
    'how-to': 'beginners and DIY enthusiasts',
    'guide': 'professionals and decision-makers',
    'case-study': 'business professionals',
    'comparison': 'potential customers and evaluators'
  };
  
  return audienceMap[item.content_type] || 'business professionals';
}

function generateInterlinkingStrategy(contentItems) {
  const strategy = {
    hub_and_spoke: {},
    lateral_connections: [],
    content_hierarchy: {}
  };

  const pillarContent = contentItems.filter(item => item.type === 'pillar');
  const supportingContent = contentItems.filter(item => item.type === 'supporting');
  const rapidContent = contentItems.filter(item => item.type === 'rapid');

  // Create hub and spoke connections
  pillarContent.forEach(pillar => {
    strategy.hub_and_spoke[pillar.id] = {
      hub: pillar,
      spokes: [
        ...supportingContent.filter(item => 
          item.target_keyword.includes(pillar.target_keyword.split(' ')[0])
        ),
        ...rapidContent.filter(item => 
          item.target_keyword.includes(pillar.target_keyword.split(' ')[0])
        )
      ]
    };
  });

  // Create lateral connections
  strategy.lateral_connections = findLateralConnections(contentItems);

  // Define content hierarchy
  strategy.content_hierarchy = {
    level_1: pillarContent.map(item => item.id),
    level_2: supportingContent.map(item => item.id),
    level_3: rapidContent.map(item => item.id)
  };

  return strategy;
}

function generatePublicationSchedule(contentItems) {
  const schedule = {
    strategy: 'pillar_first',
    timeline_weeks: Math.ceil(contentItems.length / 2),
    schedule: []
  };

  let currentDate = new Date();
  
  // Schedule pillar content first
  const pillarContent = contentItems.filter(item => item.type === 'pillar');
  pillarContent.forEach((item, index) => {
    schedule.schedule.push({
      content_id: item.id,
      publish_date: new Date(currentDate.getTime() + (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      priority: 'high',
      preparation_days: 3
    });
  });

  // Schedule supporting content
  const supportingContent = contentItems.filter(item => item.type === 'supporting');
  supportingContent.forEach((item, index) => {
    const weeksOffset = pillarContent.length + Math.floor(index / 2);
    schedule.schedule.push({
      content_id: item.id,
      publish_date: new Date(currentDate.getTime() + (weeksOffset * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      priority: 'medium',
      preparation_days: 2
    });
  });

  // Schedule rapid content
  const rapidContent = contentItems.filter(item => item.type === 'rapid');
  rapidContent.forEach((item, index) => {
    const weeksOffset = pillarContent.length + supportingContent.length + Math.floor(index / 3);
    schedule.schedule.push({
      content_id: item.id,
      publish_date: new Date(currentDate.getTime() + (weeksOffset * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      priority: 'low',
      preparation_days: 1
    });
  });

  return schedule;
}

function generateSEOStrategy(contentItems, researchData) {
  return {
    primary_keywords: contentItems.map(item => ({
      keyword: item.target_keyword,
      content_id: item.id,
      difficulty: item.difficulty,
      search_intent: inferSearchIntent(item.target_keyword, item.content_type)
    })),
    long_tail_opportunities: generateLongTailKeywords(contentItems),
    content_gaps_addressed: researchData.results?.contentGapAnalysis?.opportunities || [],
    internal_linking_plan: generateInternalLinkingPlan(contentItems),
    technical_seo_recommendations: [
      'Implement schema markup for articles',
      'Optimize images with descriptive alt text',
      'Create XML sitemap for content cluster',
      'Implement breadcrumb navigation',
      'Optimize page loading speed',
      'Ensure mobile responsiveness'
    ]
  };
}

function generateInterlinkingGuide(interlinkingStrategy) {
  return {
    overview: 'Strategic internal linking plan for content cluster',
    hub_and_spoke_connections: interlinkingStrategy.hub_and_spoke,
    lateral_connections: interlinkingStrategy.lateral_connections,
    implementation_guidelines: [
      'Link from pillar content to relevant supporting articles',
      'Create contextual links within content body',
      'Use descriptive anchor text with target keywords',
      'Maintain 3-5 internal links per article',
      'Link to higher-authority pages when relevant'
    ]
  };
}

function generateSEOChecklist(seoStrategy) {
  return {
    keyword_optimization: seoStrategy.primary_keywords,
    technical_requirements: seoStrategy.technical_seo_recommendations,
    content_guidelines: [
      'Ensure target keyword in title and first paragraph',
      'Use keyword variations throughout content',
      'Include related keywords in headings',
      'Optimize meta descriptions for each article',
      'Add alt text to all images'
    ],
    internal_linking: seoStrategy.internal_linking_plan,
    monitoring_metrics: [
      'Organic traffic growth',
      'Keyword ranking improvements',
      'Time on page and engagement',
      'Internal link click-through rates',
      'Conversion rates from content'
    ]
  };
}

function calculateClusterSEOScore(contentResults) {
  const completedContent = contentResults.filter(r => r.status === 'completed');
  if (completedContent.length === 0) return 0;

  const totalScore = completedContent.reduce((sum, result) => {
    return sum + (result.content?.seo_analysis?.seo_score || 0);
  }, 0);

  return Math.round(totalScore / completedContent.length);
}

function estimateTrafficPotential(contentItems) {
  const difficultyMultiplier = {
    'Low': 1000,
    'Medium': 500,
    'High': 200
  };

  return contentItems.reduce((total, item) => {
    const multiplier = difficultyMultiplier[item.difficulty] || 500;
    return total + multiplier;
  }, 0);
}

function getContentTypesGenerated(contentResults) {
  const types = {};
  contentResults
    .filter(r => r.status === 'completed')
    .forEach(result => {
      const contentType = result.content?.item?.content_type || 'unknown';
      types[contentType] = (types[contentType] || 0) + 1;
    });
  return types;
}

function findLateralConnections(contentItems) {
  const connections = [];
  
  contentItems.forEach((item1, index1) => {
    contentItems.forEach((item2, index2) => {
      if (index1 !== index2 && item1.type === item2.type) {
        const keywordOverlap = calculateKeywordOverlap(item1.target_keyword, item2.target_keyword);
        if (keywordOverlap > 0.3) {
          connections.push({
            from: item1.id,
            to: item2.id,
            strength: keywordOverlap,
            reason: 'Related keywords and topics'
          });
        }
      }
    });
  });
  
  return connections;
}

function calculateKeywordOverlap(keyword1, keyword2) {
  const words1 = keyword1.toLowerCase().split(' ');
  const words2 = keyword2.toLowerCase().split(' ');
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  return intersection.length / union.length;
}

function inferSearchIntent(keyword, contentType) {
  if (keyword.startsWith('how to') || keyword.startsWith('what is')) return 'informational';
  if (keyword.includes('best') || keyword.includes('review')) return 'commercial';
  if (keyword.includes('buy') || keyword.includes('price')) return 'transactional';
  return 'informational';
}

function generateLongTailKeywords(contentItems) {
  return contentItems.map(item => ({
    primary: item.target_keyword,
    long_tail_variations: [
      `${item.target_keyword} guide`,
      `best ${item.target_keyword}`,
      `${item.target_keyword} tips`,
      `how to choose ${item.target_keyword}`
    ],
    content_id: item.id
  }));
}

function generateInternalLinkingPlan(contentItems) {
  const plan = {};
  
  contentItems.forEach(item => {
    plan[item.id] = {
      outbound_links: contentItems
        .filter(other => other.id !== item.id && other.type !== item.type)
        .slice(0, 3)
        .map(other => ({
          target_id: other.id,
          anchor_text: other.title,
          context: `Related to ${other.target_keyword}`
        }))
    };
  });
  
  return plan;
}

// Content analysis functions
function countWords(content) {
  return content.trim().split(/\s+/).length;
}

function calculateReadabilityScore(content) {
  const sentences = content.split(/[.!?]+/).length;
  const words = countWords(content);
  const avgWordsPerSentence = words / sentences;
  
  const score = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
  return Math.round(score);
}

function analyzeSEO(content, targetKeyword) {
  const keywordDensity = calculateKeywordDensity(content, targetKeyword);
  const hasH1 = content.includes('# ') || content.includes('<h1');
  const hasH2 = content.includes('## ') || content.includes('<h2');
  
  return {
    keyword_density: keywordDensity,
    has_h1: hasH1,
    has_h2: hasH2,
    content_length: countWords(content),
    seo_score: calculateSEOScore(content, targetKeyword)
  };
}

function calculateKeywordDensity(content, keyword) {
  const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
  const totalWords = countWords(content);
  return ((keywordCount / totalWords) * 100).toFixed(2);
}

function calculateSEOScore(content, targetKeyword) {
  let score = 0;
  
  if (content.toLowerCase().includes(targetKeyword.toLowerCase())) score += 20;
  
  const wordCount = countWords(content);
  if (wordCount >= 1000) score += 30;
  
  if (content.includes('##')) score += 20;
  
  const density = parseFloat(calculateKeywordDensity(content, targetKeyword));
  if (density >= 1 && density <= 3) score += 30;
  
  return Math.min(100, score);
}

function generateHTMLExport(content, metadata) {
  return `<!DOCTYPE html>
<html>
<head>
    <title>${metadata.title}</title>
    <meta name="description" content="Generated content for ${metadata.target_keyword}">
    <meta name="keywords" content="${metadata.target_keyword}">
    <meta name="author" content="AttributeAI Content Generator">
</head>
<body>
    <article>
        ${content.replace(/\n/g, '<br>').replace(/##/g, '<h2>').replace(/<h2>/g, '</p><h2>').replace(/<br><br>/g, '</p><p>')}
    </article>
</body>
</html>`;
}

function generateMarkdownExport(content, metadata) {
  return `---
title: ${metadata.title}
target_keyword: ${metadata.target_keyword}
content_type: ${metadata.content_type}
generated_at: ${metadata.generated_at}
research_enhanced: ${metadata.research_enhanced}
cluster_id: ${metadata.content_cluster_id}
---

${content}`;
}

module.exports = router;