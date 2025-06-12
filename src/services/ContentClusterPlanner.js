class ContentClusterPlanner {
  constructor() {
    this.contentTypes = {
      pillar: {
        wordCount: 3000,
        sections: 8,
        internalLinks: 5,
        externalLinks: 8
      },
      supporting: {
        wordCount: 1500,
        sections: 5,
        internalLinks: 3,
        externalLinks: 4
      },
      listicle: {
        wordCount: 2000,
        sections: 6,
        internalLinks: 4,
        externalLinks: 5
      }
    };
  }

  // Generate comprehensive article outlines for a content cluster
  async generateClusterOutlines(cluster, keywordClusters) {
    try {
      const outlines = [];
      
      // Generate pillar article outline
      const pillarOutline = await this.generatePillarArticleOutline(
        cluster.topic, 
        cluster.keywords,
        keywordClusters
      );
      outlines.push(pillarOutline);

      // Generate supporting article outlines
      for (const keywordCluster of keywordClusters.slice(1)) {
        const supportingOutline = await this.generateSupportingArticleOutline(
          keywordCluster,
          cluster.topic,
          cluster.keywords
        );
        outlines.push(supportingOutline);
      }

      return {
        success: true,
        outlines: outlines,
        totalArticles: outlines.length,
        estimatedWords: outlines.reduce((sum, outline) => sum + outline.estimatedWordCount, 0)
      };
    } catch (error) {
      console.error('Error generating cluster outlines:', error);
      return {
        success: false,
        error: error.message,
        outlines: []
      };
    }
  }

  // Generate comprehensive pillar article outline
  async generatePillarArticleOutline(topic, keywords, keywordClusters) {
    const outline = {
      id: `pillar-${Date.now()}`,
      type: 'pillar',
      title: this.generatePillarTitle(topic),
      slug: this.generateSlug(topic),
      targetKeyword: topic,
      relatedKeywords: keywords.slice(0, 10).map(kw => kw.keyword),
      estimatedWordCount: this.contentTypes.pillar.wordCount,
      readingTime: Math.ceil(this.contentTypes.pillar.wordCount / 200),
      seoScore: this.calculateInitialSEOScore('pillar', keywords),
      contentGaps: this.identifyContentGaps(topic, keywordClusters),
      outline: this.generatePillarStructure(topic, keywordClusters),
      internalLinkingPlan: this.planInternalLinks('pillar', keywordClusters),
      externalResources: this.planExternalResources(topic),
      metaData: this.generateMetaData(topic, 'pillar'),
      publishingPriority: 1,
      dependencies: [],
      createdAt: new Date().toISOString()
    };

    return outline;
  }

  // Generate supporting article outline
  async generateSupportingArticleOutline(keywordCluster, mainTopic, allKeywords) {
    const primaryKeyword = keywordCluster.primaryKeyword.keyword;
    
    const outline = {
      id: `supporting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'supporting',
      title: this.generateSupportingTitle(primaryKeyword, keywordCluster.intent),
      slug: this.generateSlug(primaryKeyword),
      targetKeyword: primaryKeyword,
      relatedKeywords: keywordCluster.keywords.slice(0, 5).map(kw => kw.keyword),
      estimatedWordCount: this.contentTypes.supporting.wordCount,
      readingTime: Math.ceil(this.contentTypes.supporting.wordCount / 200),
      seoScore: this.calculateInitialSEOScore('supporting', keywordCluster.keywords),
      searchIntent: keywordCluster.intent,
      difficulty: keywordCluster.avgDifficulty,
      searchVolume: keywordCluster.totalVolume,
      outline: this.generateSupportingStructure(keywordCluster),
      internalLinkingPlan: this.planSupportingInternalLinks(primaryKeyword, mainTopic),
      externalResources: this.planExternalResources(primaryKeyword),
      metaData: this.generateMetaData(primaryKeyword, 'supporting'),
      publishingPriority: this.calculatePublishingPriority(keywordCluster),
      dependencies: ['pillar-article'],
      createdAt: new Date().toISOString()
    };

    return outline;
  }

  // Generate pillar article title variations
  generatePillarTitle(topic) {
    const templates = [
      `The Complete Guide to ${topic}`,
      `${topic}: Everything You Need to Know`,
      `The Ultimate ${topic} Guide for 2024`,
      `Master ${topic}: A Comprehensive Guide`,
      `${topic} Explained: The Definitive Guide`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Generate supporting article titles based on intent
  generateSupportingTitle(keyword, intent) {
    const templates = {
      informational: [
        `How to ${keyword}`,
        `What is ${keyword}?`,
        `${keyword}: A Beginner's Guide`,
        `Understanding ${keyword}`,
        `${keyword} Explained Simply`
      ],
      commercial: [
        `Best ${keyword} Solutions`,
        `${keyword} Review: Top Options`,
        `${keyword} Comparison Guide`,
        `Choosing the Right ${keyword}`,
        `${keyword} vs Alternatives`
      ],
      transactional: [
        `Buy ${keyword}: Complete Guide`,
        `${keyword} Pricing & Plans`,
        `Get ${keyword} Today`,
        `${keyword} Deals & Discounts`,
        `Where to Buy ${keyword}`
      ]
    };

    const intentTemplates = templates[intent] || templates.informational;
    return intentTemplates[Math.floor(Math.random() * intentTemplates.length)];
  }

  // Generate SEO-friendly slug
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Generate comprehensive pillar article structure
  generatePillarStructure(topic, keywordClusters) {
    const sections = [
      {
        id: 'introduction',
        title: `Introduction to ${topic}`,
        type: 'introduction',
        wordCount: 300,
        keyPoints: [
          `What is ${topic} and why it matters`,
          'Key benefits and applications',
          'What you\'ll learn in this guide'
        ],
        keywords: [topic],
        internalLinks: 1
      },
      {
        id: 'fundamentals',
        title: `${topic} Fundamentals`,
        type: 'educational',
        wordCount: 400,
        keyPoints: [
          'Core concepts and terminology',
          'How it works',
          'Common misconceptions'
        ],
        keywords: [topic, `${topic} basics`],
        internalLinks: 2
      },
      {
        id: 'benefits',
        title: `Benefits of ${topic}`,
        type: 'persuasive',
        wordCount: 350,
        keyPoints: [
          'Primary advantages',
          'ROI and value proposition',
          'Real-world impact'
        ],
        keywords: [`${topic} benefits`, `why ${topic}`],
        internalLinks: 1
      },
      {
        id: 'implementation',
        title: `How to Implement ${topic}`,
        type: 'tutorial',
        wordCount: 500,
        keyPoints: [
          'Step-by-step process',
          'Best practices',
          'Common pitfalls to avoid'
        ],
        keywords: [`how to ${topic}`, `${topic} implementation`],
        internalLinks: 3
      },
      {
        id: 'tools',
        title: `Best ${topic} Tools and Software`,
        type: 'comparison',
        wordCount: 400,
        keyPoints: [
          'Top tools comparison',
          'Features and pricing',
          'Recommendations by use case'
        ],
        keywords: [`${topic} tools`, `best ${topic} software`],
        internalLinks: 2
      },
      {
        id: 'case-studies',
        title: `${topic} Case Studies and Examples`,
        type: 'case-study',
        wordCount: 450,
        keyPoints: [
          'Real success stories',
          'Lessons learned',
          'Actionable insights'
        ],
        keywords: [`${topic} examples`, `${topic} case studies`],
        internalLinks: 2
      },
      {
        id: 'advanced',
        title: `Advanced ${topic} Strategies`,
        type: 'advanced',
        wordCount: 400,
        keyPoints: [
          'Expert-level techniques',
          'Optimization strategies',
          'Future trends'
        ],
        keywords: [`advanced ${topic}`, `${topic} strategies`],
        internalLinks: 2
      },
      {
        id: 'conclusion',
        title: 'Conclusion and Next Steps',
        type: 'conclusion',
        wordCount: 200,
        keyPoints: [
          'Key takeaways',
          'Recommended next actions',
          'Additional resources'
        ],
        keywords: [topic],
        internalLinks: 3
      }
    ];

    return sections;
  }

  // Generate supporting article structure based on intent
  generateSupportingStructure(keywordCluster) {
    const primaryKeyword = keywordCluster.primaryKeyword.keyword;
    const intent = keywordCluster.intent;

    const structures = {
      informational: [
        {
          id: 'introduction',
          title: `What is ${primaryKeyword}?`,
          type: 'introduction',
          wordCount: 200,
          keyPoints: [
            'Definition and overview',
            'Why it matters',
            'Preview of content'
          ]
        },
        {
          id: 'fundamentals',
          title: `Understanding ${primaryKeyword}`,
          type: 'educational',
          wordCount: 400,
          keyPoints: [
            'Core concepts',
            'How it works',
            'Key components'
          ]
        },
        {
          id: 'benefits',
          title: `Benefits of ${primaryKeyword}`,
          type: 'benefits',
          wordCount: 300,
          keyPoints: [
            'Primary advantages',
            'Use cases',
            'Value proposition'
          ]
        },
        {
          id: 'implementation',
          title: `How to Get Started with ${primaryKeyword}`,
          type: 'tutorial',
          wordCount: 400,
          keyPoints: [
            'Step-by-step guide',
            'Best practices',
            'Common mistakes'
          ]
        },
        {
          id: 'conclusion',
          title: 'Conclusion',
          type: 'conclusion',
          wordCount: 200,
          keyPoints: [
            'Summary',
            'Next steps',
            'Resources'
          ]
        }
      ],
      commercial: [
        {
          id: 'introduction',
          title: `Best ${primaryKeyword} Options`,
          type: 'introduction',
          wordCount: 200,
          keyPoints: [
            'Market overview',
            'Selection criteria',
            'What to expect'
          ]
        },
        {
          id: 'comparison',
          title: `Top ${primaryKeyword} Comparison`,
          type: 'comparison',
          wordCount: 500,
          keyPoints: [
            'Feature comparison',
            'Pricing analysis',
            'Pros and cons'
          ]
        },
        {
          id: 'recommendations',
          title: `Our ${primaryKeyword} Recommendations`,
          type: 'recommendation',
          wordCount: 400,
          keyPoints: [
            'Best for beginners',
            'Best for advanced users',
            'Best value option'
          ]
        },
        {
          id: 'buying-guide',
          title: `${primaryKeyword} Buying Guide`,
          type: 'guide',
          wordCount: 300,
          keyPoints: [
            'What to look for',
            'Questions to ask',
            'Red flags to avoid'
          ]
        },
        {
          id: 'conclusion',
          title: 'Final Thoughts',
          type: 'conclusion',
          wordCount: 100,
          keyPoints: [
            'Top pick',
            'Final recommendation',
            'Get started'
          ]
        }
      ],
      transactional: [
        {
          id: 'introduction',
          title: `Why Choose ${primaryKeyword}`,
          type: 'introduction',
          wordCount: 200,
          keyPoints: [
            'Value proposition',
            'Why now',
            'What you get'
          ]
        },
        {
          id: 'features',
          title: `${primaryKeyword} Features`,
          type: 'features',
          wordCount: 400,
          keyPoints: [
            'Key features',
            'Benefits',
            'Unique advantages'
          ]
        },
        {
          id: 'pricing',
          title: `${primaryKeyword} Pricing`,
          type: 'pricing',
          wordCount: 300,
          keyPoints: [
            'Pricing plans',
            'Value for money',
            'Special offers'
          ]
        },
        {
          id: 'how-to-buy',
          title: `How to Get ${primaryKeyword}`,
          type: 'tutorial',
          wordCount: 400,
          keyPoints: [
            'Purchase process',
            'Setup guide',
            'Getting started'
          ]
        },
        {
          id: 'conclusion',
          title: 'Get Started Today',
          type: 'cta',
          wordCount: 200,
          keyPoints: [
            'Call to action',
            'Next steps',
            'Support options'
          ]
        }
      ]
    };

    return structures[intent] || structures.informational;
  }

  // Calculate initial SEO score based on keyword data
  calculateInitialSEOScore(type, keywords) {
    let baseScore = 60;
    
    if (type === 'pillar') baseScore += 10;
    
    // Adjust based on keyword difficulty
    const avgDifficulty = keywords.reduce((sum, kw) => sum + (kw.difficulty || 50), 0) / keywords.length;
    if (avgDifficulty < 30) baseScore += 15;
    else if (avgDifficulty > 70) baseScore -= 10;
    
    // Adjust based on search volume
    const totalVolume = keywords.reduce((sum, kw) => sum + (kw.searchVolume || 0), 0);
    if (totalVolume > 10000) baseScore += 10;
    else if (totalVolume < 1000) baseScore -= 5;
    
    return Math.max(40, Math.min(100, Math.round(baseScore)));
  }

  // Plan internal linking strategy
  planInternalLinks(type, keywordClusters) {
    const linkPlan = {
      outgoingLinks: [],
      incomingLinks: [],
      anchorTexts: [],
      linkingStrategy: type === 'pillar' ? 'hub' : 'spoke'
    };

    if (type === 'pillar') {
      // Pillar article links to all supporting articles
      keywordClusters.slice(1).forEach(cluster => {
        linkPlan.outgoingLinks.push({
          targetKeyword: cluster.primaryKeyword.keyword,
          anchorText: cluster.primaryKeyword.keyword,
          contextHint: `Learn more about ${cluster.primaryKeyword.keyword}`,
          section: this.findBestSectionForLink(cluster.primaryKeyword.keyword)
        });
      });
    } else {
      // Supporting articles link back to pillar and relevant supporting articles
      linkPlan.outgoingLinks.push({
        targetKeyword: 'pillar-article',
        anchorText: 'complete guide',
        contextHint: 'For comprehensive information',
        section: 'conclusion'
      });
    }

    return linkPlan;
  }

  // Plan supporting article internal links
  planSupportingInternalLinks(keyword, mainTopic) {
    return {
      outgoingLinks: [
        {
          targetKeyword: mainTopic,
          anchorText: `${mainTopic} guide`,
          contextHint: 'Complete guide',
          section: 'introduction'
        },
        {
          targetKeyword: mainTopic,
          anchorText: `learn more about ${mainTopic}`,
          contextHint: 'Additional information',
          section: 'conclusion'
        }
      ],
      incomingLinks: [
        {
          sourceKeyword: mainTopic,
          anchorText: keyword,
          contextHint: `Detailed information about ${keyword}`,
          section: 'implementation'
        }
      ],
      anchorTexts: [keyword, `${keyword} guide`, `how to ${keyword}`],
      linkingStrategy: 'spoke'
    };
  }

  // Find best section for internal link placement
  findBestSectionForLink(keyword) {
    const sections = ['implementation', 'tools', 'benefits', 'fundamentals'];
    return sections[Math.floor(Math.random() * sections.length)];
  }

  // Plan external resources and citations
  planExternalResources(topic) {
    const resourceTypes = [
      'authoritative-source',
      'research-paper',
      'industry-report',
      'official-documentation',
      'case-study',
      'expert-quote',
      'statistics-source',
      'tool-reference'
    ];

    const resources = [];
    const numResources = 4 + Math.floor(Math.random() * 4);

    for (let i = 0; i < numResources; i++) {
      resources.push({
        type: resourceTypes[i % resourceTypes.length],
        placeholder: `${resourceTypes[i % resourceTypes.length]}-for-${this.generateSlug(topic)}`,
        description: `Reference for ${topic} - ${resourceTypes[i % resourceTypes.length]}`,
        priority: Math.floor(Math.random() * 5) + 1,
        section: this.findBestSectionForLink(topic)
      });
    }

    return resources;
  }

  // Generate meta data for SEO
  generateMetaData(keyword, type) {
    const titleLength = 55 + Math.floor(Math.random() * 5);
    const descriptionLength = 155 + Math.floor(Math.random() * 5);

    return {
      title: this.generateMetaTitle(keyword, type, titleLength),
      description: this.generateMetaDescription(keyword, type, descriptionLength),
      focusKeyword: keyword,
      keywordDensity: 1.5,
      readabilityScore: 70 + Math.floor(Math.random() * 20),
      schema: this.determineSchemaType(type),
      openGraph: {
        title: keyword,
        description: `Learn everything about ${keyword}`,
        type: 'article'
      }
    };
  }

  // Generate SEO-optimized meta title
  generateMetaTitle(keyword, type, maxLength) {
    const templates = {
      pillar: [
        `${keyword} Guide: Everything You Need to Know`,
        `Complete ${keyword} Guide for 2024`,
        `${keyword}: The Ultimate Guide`,
        `Master ${keyword} - Complete Guide`
      ],
      supporting: [
        `${keyword} - Complete Guide`,
        `How to ${keyword}: Step-by-Step Guide`,
        `${keyword} Explained: Quick Guide`,
        `Best ${keyword} Guide 2024`
      ]
    };

    const typeTemplates = templates[type] || templates.supporting;
    let title = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
    
    if (title.length > maxLength) {
      title = title.substring(0, maxLength - 3) + '...';
    }
    
    return title;
  }

  // Generate SEO-optimized meta description
  generateMetaDescription(keyword, type, maxLength) {
    const templates = {
      pillar: `Comprehensive guide to ${keyword}. Learn everything you need to know with expert tips, best practices, and actionable strategies.`,
      supporting: `Learn about ${keyword} with our detailed guide. Get expert insights, practical tips, and step-by-step instructions.`
    };

    let description = templates[type] || templates.supporting;
    
    if (description.length > maxLength) {
      description = description.substring(0, maxLength - 3) + '...';
    }
    
    return description;
  }

  // Determine appropriate schema type
  determineSchemaType(type) {
    const schemas = {
      pillar: 'Article',
      supporting: 'Article',
      comparison: 'Review',
      tutorial: 'HowTo'
    };
    
    return schemas[type] || 'Article';
  }

  // Calculate publishing priority based on keyword metrics
  calculatePublishingPriority(keywordCluster) {
    let priority = 5; // Default medium priority
    
    // High volume keywords get higher priority
    if (keywordCluster.totalVolume > 5000) priority += 2;
    else if (keywordCluster.totalVolume > 1000) priority += 1;
    
    // Lower difficulty keywords get higher priority
    if (keywordCluster.avgDifficulty < 30) priority += 2;
    else if (keywordCluster.avgDifficulty < 50) priority += 1;
    
    // Commercial intent gets higher priority for conversion
    if (keywordCluster.intent === 'commercial') priority += 1;
    
    // Opportunities increase priority
    if (keywordCluster.opportunities.includes('golden_keyword')) priority += 3;
    if (keywordCluster.opportunities.includes('featured_snippet')) priority += 1;
    
    return Math.max(1, Math.min(10, priority));
  }

  // Identify content gaps in the market
  identifyContentGaps(topic, keywordClusters) {
    const gaps = [];
    
    // Simulate content gap analysis
    const potentialGaps = [
      'beginner-friendly content',
      'advanced strategies',
      'case studies',
      'tool comparisons',
      'pricing information',
      'implementation guides',
      'troubleshooting content',
      'best practices',
      'industry trends',
      'expert interviews'
    ];

    // Randomly select 3-5 gaps for demonstration
    const numGaps = 3 + Math.floor(Math.random() * 3);
    const selectedGaps = potentialGaps
      .sort(() => 0.5 - Math.random())
      .slice(0, numGaps);

    selectedGaps.forEach(gap => {
      gaps.push({
        type: gap,
        opportunity: `high`,
        description: `Market lacks comprehensive ${gap} for ${topic}`,
        estimatedTraffic: 1000 + Math.floor(Math.random() * 5000),
        difficulty: 30 + Math.floor(Math.random() * 40)
      });
    });

    return gaps;
  }

  // Generate content calendar for cluster
  generateContentCalendar(outlines, startDate = new Date()) {
    const calendar = [];
    const publishingSchedule = this.optimizePublishingSchedule(outlines);

    publishingSchedule.forEach((outline, index) => {
      const publishDate = new Date(startDate);
      publishDate.setDate(startDate.getDate() + (index * 7)); // Weekly publishing

      calendar.push({
        articleId: outline.id,
        title: outline.title,
        type: outline.type,
        publishDate: publishDate.toISOString(),
        status: 'scheduled',
        priority: outline.publishingPriority,
        estimatedHours: this.estimateWorkingHours(outline),
        dependencies: outline.dependencies,
        assignee: null
      });
    });

    return calendar;
  }

  // Optimize publishing schedule based on dependencies and priority
  optimizePublishingSchedule(outlines) {
    // Sort by priority (high to low) and dependencies
    const sortedOutlines = [...outlines].sort((a, b) => {
      // Pillar articles first
      if (a.type === 'pillar' && b.type !== 'pillar') return -1;
      if (b.type === 'pillar' && a.type !== 'pillar') return 1;
      
      // Then by priority
      return b.publishingPriority - a.publishingPriority;
    });

    return sortedOutlines;
  }

  // Estimate working hours for article creation
  estimateWorkingHours(outline) {
    const baseHours = {
      pillar: 12,
      supporting: 6,
      listicle: 8
    };

    let hours = baseHours[outline.type] || baseHours.supporting;
    
    // Adjust for word count
    hours += Math.floor(outline.estimatedWordCount / 500);
    
    // Adjust for complexity (number of sections)
    hours += outline.outline.length * 0.5;
    
    return Math.round(hours);
  }
}

export default ContentClusterPlanner;