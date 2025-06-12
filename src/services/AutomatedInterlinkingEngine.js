    
    // Check pillar prominence
    const pillarArticles = cluster.articles.filter(a => a.type === 'pillar');
    const pillarLinks = optimizedLinks.filter(a => a.articleType === 'pillar');
    const avgPillarLinks = pillarLinks.reduce((sum, article) => sum + article.outboundLinks.length, 0) / (pillarLinks.length || 1);
    
    if (avgPillarLinks < 4) {
      recommendations.push({
        type: 'weak_pillar_links',
        priority: 'high',
        message: 'Pillar articles should link to more supporting content to establish topical authority.',
        suggestion: 'Pillar articles should link to 4-6 supporting articles minimum'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate implementation notes for an article
   */
  generateImplementationNotes(articleLinks) {
    const notes = [];
    
    if (articleLinks.linkDensity.percentage > 2) {
      notes.push('⚠️ High link density detected. Consider reducing links or increasing content length.');
    }
    
    if (articleLinks.outboundLinks.length < 2) {
      notes.push('📈 Low link count. Consider adding more relevant internal links.');
    }
    
    if (articleLinks.articleType === 'pillar') {
      notes.push('🏛️ Pillar article: Focus on linking to comprehensive supporting content.');
    }
    
    return notes;
  }

  /**
   * Generate SEO notes for individual links
   */
  generateSEONotes(link) {
    const notes = [];
    
    if (link.linkValue > 0.7) {
      notes.push('🎯 High-value link: Prioritize this connection');
    }
    
    if (link.similarity > 0.8) {
      notes.push('🔗 Highly related content: Natural linking opportunity');
    }
    
    if (link.linkType === 'supporting_to_pillar') {
      notes.push('📊 Supporting to pillar: Use branded anchor text');
    }
    
    return notes;
  }

  /**
   * Generate implementation recommendations
   */
  generateImplementationRecommendations(optimizedLinks) {
    const recommendations = [];
    
    // Check for consistency
    const linkCounts = optimizedLinks.map(article => article.outboundLinks.length);
    const maxLinks = Math.max(...linkCounts);
    const minLinks = Math.min(...linkCounts);
    
    if (maxLinks - minLinks > 4) {
      recommendations.push({
        priority: 'medium',
        message: 'Link distribution is uneven across articles. Consider balancing the number of internal links.',
        action: 'Review articles with very few or very many links'
      });
    }
    
    // Check for anchor text diversity
    const allAnchors = optimizedLinks.flatMap(article => 
      article.outboundLinks.map(link => link.recommendedAnchor)
    );
    const uniqueAnchors = new Set(allAnchors);
    
    if (uniqueAnchors.size / allAnchors.length < 0.7) {
      recommendations.push({
        priority: 'low',
        message: 'Consider more diverse anchor text to avoid over-optimization.',
        action: 'Use the provided anchor text variations'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate fallback strategy for failed linking generation
   */
  generateFallbackStrategy(cluster) {
    const fallbackLinks = [];
    
    cluster.articles.forEach(article => {
      const otherArticles = cluster.articles.filter(a => a.id !== article.id);
      const targetCount = Math.min(3, otherArticles.length);
      
      // Simple fallback: link to first few articles
      const targets = otherArticles.slice(0, targetCount).map(target => ({
        targetId: target.id,
        targetTitle: target.title,
        linkType: 'sequential',
        priority: 0.5,
        similarity: 0.5,
        linkValue: 0.5,
        recommendedAnchor: target.title,
        seoValue: 50
      }));
      
      fallbackLinks.push({
        articleId: article.id,
        articleTitle: article.title,
        articleType: article.type,
        targetLinkCount: targetCount,
        actualLinkCount: targets.length,
        outboundLinks: targets,
        linkDensity: { percentage: 0.5, status: 'low', recommendation: 'add_more_links' },
        seoScore: 50
      });
    });
    
    return {
      strategy: {
        clusterTopic: cluster.topic,
        totalArticles: cluster.articles.length,
        totalLinks: fallbackLinks.reduce((sum, article) => sum + article.outboundLinks.length, 0),
        avgLinksPerArticle: Math.round(fallbackLinks.reduce((sum, article) => sum + article.outboundLinks.length, 0) / cluster.articles.length),
        optimizedLinks: fallbackLinks,
        seoScore: { overall: 50, grade: 'D', recommendations: ['Use advanced linking engine for better results'] },
        recommendations: [{
          type: 'fallback_mode',
          priority: 'high',
          message: 'Basic linking strategy applied. Use the full engine for optimized results.'
        }]
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        engineVersion: '1.0.0-fallback'
      }
    };
  }

  /**
   * Apply interlinking strategy to existing cluster
   */
  async applyLinkingStrategy(cluster, strategy) {
    try {
      console.log('🔗 Applying interlinking strategy to cluster:', cluster.topic);
      
      // Update cluster with linking information
      const updatedCluster = { ...cluster };
      
      // Add interlinking data to each article
      updatedCluster.articles = cluster.articles.map(article => {
        const linkData = strategy.optimizedLinks.find(link => link.articleId === article.id);
        
        if (linkData) {
          return {
            ...article,
            internalLinks: linkData.outboundLinks,
            linkDensity: linkData.linkDensity,
            linkSeoScore: linkData.seoScore,
            linkingStrategy: 'automated',
            updatedAt: new Date().toISOString()
          };
        }
        
        return article;
      });
      
      // Add cluster-level linking metadata
      updatedCluster.interlinkingStrategy = {
        applied: true,
        strategy: strategy,
        appliedAt: new Date().toISOString(),
        totalLinks: strategy.totalLinks,
        seoScore: strategy.seoScore
      };
      
      return {
        success: true,
        updatedCluster,
        summary: {
          articlesUpdated: strategy.totalArticles,
          linksAdded: strategy.totalLinks,
          avgLinksPerArticle: strategy.avgLinksPerArticle,
          seoScore: strategy.seoScore.overall,
          grade: strategy.seoScore.grade
        }
      };
      
    } catch (error) {
      console.error('Error applying linking strategy:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate linking report for cluster
   */
  generateLinkingReport(cluster, strategy) {
    const report = {
      clusterOverview: {
        topic: cluster.topic,
        totalArticles: cluster.articles.length,
        pillarArticles: cluster.articles.filter(a => a.type === 'pillar').length,
        supportingArticles: cluster.articles.filter(a => a.type === 'supporting').length
      },
      linkingMetrics: {
        totalLinks: strategy.totalLinks,
        avgLinksPerArticle: strategy.avgLinksPerArticle,
        linkDensityRange: this.calculateDensityRange(strategy.optimizedLinks),
        seoScore: strategy.seoScore.overall,
        grade: strategy.seoScore.grade
      },
      implementationPlan: {
        totalPhases: strategy.implementationPlan.phases.length,
        estimatedTime: strategy.implementationPlan.estimatedImplementationTime,
        priorityBreakdown: this.calculatePriorityBreakdown(strategy.implementationPlan)
      },
      recommendations: strategy.recommendations,
      linkingMatrix: this.createSimplifiedMatrix(strategy.linkingMatrix),
      generatedAt: new Date().toISOString()
    };
    
    return report;
  }

  /**
   * Calculate density range from optimized links
   */
  calculateDensityRange(optimizedLinks) {
    const densities = optimizedLinks.map(article => article.linkDensity.percentage);
    return {
      min: Math.min(...densities),
      max: Math.max(...densities),
      avg: densities.reduce((sum, d) => sum + d, 0) / densities.length
    };
  }

  /**
   * Calculate priority breakdown from implementation plan
   */
  calculatePriorityBreakdown(implementationPlan) {
    const breakdown = { high: 0, medium: 0, low: 0 };
    
    implementationPlan.phases.forEach(phase => {
      breakdown[phase.priority] += phase.articles.length;
    });
    
    return breakdown;
  }

  /**
   * Create simplified linking matrix for reports
   */
  createSimplifiedMatrix(linkingMatrix) {
    const simplified = {};
    
    Object.keys(linkingMatrix).forEach(articleId => {
      const data = linkingMatrix[articleId];
      simplified[articleId] = {
        title: data.title,
        type: data.type,
        targetCount: data.recommendedTargets.length,
        topTargets: data.recommendedTargets.slice(0, 3).map(target => ({
          title: target.title,
          priority: Math.round(target.priority * 100) / 100
        }))
      };
    });
    
    return simplified;
  }
}

export default AutomatedInterlinkingEngine;