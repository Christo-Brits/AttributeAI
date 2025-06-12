  // SEO basics analysis
  analyzeSEOBasics(content, text) {
    let score = 50; // Base score
    const issues = [];
    const recommendations = [];

    // Word count
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 1000) score += 15;
    else if (wordCount >= 500) score += 10;
    else if (wordCount < 300) {
      score -= 10;
      issues.push('Content too short for optimal SEO');
      recommendations.push('Expand content to at least 500 words');
    }

    // Title tag
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const titleLength = titleMatch[1].length;
      if (titleLength >= 30 && titleLength <= 60) score += 10;
      else recommendations.push('Optimize title length (30-60 characters)');
    } else {
      issues.push('Missing title tag');
      recommendations.push('Add SEO-optimized title tag');
    }

    // Meta description
    const metaMatch = content.match(/<meta[^>]*name=['"']description['"'][^>]*content=['"']([^'"]+)['"']/i);
    if (metaMatch) {
      const metaLength = metaMatch[1].length;
      if (metaLength >= 120 && metaLength <= 160) score += 10;
      else recommendations.push('Optimize meta description length (120-160 characters)');
    } else {
      issues.push('Missing meta description');
      recommendations.push('Add compelling meta description');
    }

    // Header structure
    const h1Count = (content.match(/<h1/g) || []).length;
    if (h1Count === 1) score += 10;
    else if (h1Count > 1) {
      issues.push('Multiple H1 tags found');
      recommendations.push('Use only one H1 tag per page');
    } else {
      issues.push('Missing H1 tag');
      recommendations.push('Add H1 tag for main heading');
    }

    // Image optimization
    const images = content.match(/<img[^>]*>/g) || [];
    const imagesWithAlt = images.filter(img => img.includes('alt=')).length;
    if (images.length > 0) {
      const altRatio = imagesWithAlt / images.length;
      if (altRatio >= 0.8) score += 10;
      else {
        issues.push('Some images missing alt text');
        recommendations.push('Add descriptive alt text to all images');
      }
    }

    return {
      score: Math.min(100, score),
      wordCount,
      issues,
      recommendations,
      metrics: {
        titleLength: titleMatch ? titleMatch[1].length : 0,
        metaLength: metaMatch ? metaMatch[1].length : 0,
        h1Count,
        imagesTotal: images.length,
        imagesWithAlt
      }
    };
  }

  // Engagement factors analysis
  analyzeEngagementFactors(text) {
    let score = 60; // Base score
    const metrics = {};

    // Questions
    const questions = (text.match(/\?/g) || []).length;
    metrics.questions = questions;
    if (questions >= 3) score += 10;
    else if (questions === 0) score -= 5;

    // Power words
    const powerWords = this.countPowerWords(text);
    metrics.powerWords = powerWords;
    if (powerWords >= 5) score += 10;
    else if (powerWords < 2) score -= 5;

    // Emotional words
    const emotionalWords = this.countEmotionalWords(text);
    metrics.emotionalWords = emotionalWords;
    if (emotionalWords >= 3) score += 8;

    // Call-to-action
    const hasCallToAction = this.detectCallToAction(text);
    metrics.hasCallToAction = hasCallToAction;
    if (hasCallToAction) score += 12;
    else score -= 8;

    // Storytelling elements
    const storyElements = this.detectStoryElements(text);
    metrics.storyElements = storyElements;
    score += Math.min(10, storyElements * 2);

    return {
      score: Math.min(100, score),
      metrics
    };
  }

  // Technical factors analysis
  analyzeTechnicalFactors(content) {
    let score = 80; // Base score
    const issues = [];
    const recommendations = [];

    // Internal links
    const internalLinks = (content.match(/<a[^>]*href=[^>]*>/g) || []).length;
    if (internalLinks >= 3) score += 10;
    else if (internalLinks === 0) {
      score -= 10;
      issues.push('No internal links found');
      recommendations.push('Add internal links to related content');
    }

    // External links
    const externalLinks = (content.match(/<a[^>]*href=['"']https?:\/\/[^'"]*['"'][^>]*>/g) || []).length;
    if (externalLinks >= 1) score += 5;

    // Schema markup indicators
    const hasSchema = content.includes('schema.org') || content.includes('application/ld+json');
    if (hasSchema) score += 10;
    else recommendations.push('Consider adding schema markup');

    // Mobile-friendly indicators
    const hasMobileViewport = content.includes('viewport') && content.includes('width=device-width');
    if (hasMobileViewport) score += 5;
    else recommendations.push('Add mobile viewport meta tag');

    return {
      score: Math.min(100, score),
      issues,
      recommendations,
      metrics: {
        internalLinks,
        externalLinks,
        hasSchema,
        hasMobileViewport
      }
    };
  }

  // Helper methods
  stripHTML(html) {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
  }

  countSyllables(text) {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiouy]+/g, 'a')
      .replace(/[^a]/g, '')
      .length || 1;
  }

  countPowerWords(text) {
    const powerWords = [
      'amazing', 'awesome', 'incredible', 'outstanding', 'remarkable',
      'essential', 'crucial', 'vital', 'important', 'critical',
      'proven', 'guaranteed', 'effective', 'powerful', 'successful',
      'exclusive', 'limited', 'urgent', 'immediate', 'instant',
      'revolutionary', 'breakthrough', 'game-changing', 'ultimate',
      'secret', 'hidden', 'revealed', 'exposed', 'unleashed'
    ];

    const textLower = text.toLowerCase();
    return powerWords.filter(word => textLower.includes(word)).length;
  }

  countEmotionalWords(text) {
    const emotionalWords = [
      'love', 'hate', 'excited', 'thrilled', 'amazed', 'shocked',
      'disappointed', 'frustrated', 'delighted', 'pleased', 'satisfied',
      'angry', 'happy', 'sad', 'worried', 'confident', 'proud',
      'grateful', 'inspired', 'motivated', 'passionate', 'determined'
    ];

    const textLower = text.toLowerCase();
    return emotionalWords.filter(word => textLower.includes(word)).length;
  }

  detectCallToAction(text) {
    const ctaPatterns = [
      /click here/i, /learn more/i, /get started/i, /sign up/i,
      /contact us/i, /call now/i, /download/i, /subscribe/i,
      /book now/i, /try now/i, /join us/i, /discover/i,
      /find out/i, /explore/i, /start today/i, /take action/i
    ];

    return ctaPatterns.some(pattern => pattern.test(text));
  }

  detectStoryElements(text) {
    const storyPatterns = [
      /once upon a time/i, /imagine/i, /picture this/i, /let me tell you/i,
      /story/i, /experience/i, /journey/i, /adventure/i,
      /challenge/i, /struggle/i, /overcome/i, /success/i,
      /lesson learned/i, /realized/i, /discovered/i
    ];

    return storyPatterns.filter(pattern => pattern.test(text)).length;
  }

  getReadingLevel(fleschScore) {
    if (fleschScore >= 90) return 'Very Easy (5th grade)';
    if (fleschScore >= 80) return 'Easy (6th grade)';
    if (fleschScore >= 70) return 'Fairly Easy (7th grade)';
    if (fleschScore >= 60) return 'Standard (8th-9th grade)';
    if (fleschScore >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (fleschScore >= 30) return 'Difficult (College level)';
    return 'Very Difficult (Graduate level)';
  }

  getLetterGrade(score) {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 65) return 'D';
    return 'F';
  }

  getGradeDescription(score) {
    if (score >= 90) return 'Excellent - This content exceeds industry standards';
    if (score >= 80) return 'Good - This content meets most best practices';
    if (score >= 70) return 'Average - This content needs some improvements';
    if (score >= 60) return 'Below Average - This content needs significant work';
    return 'Poor - This content requires major improvements';
  }

  identifyStrengths(scores) {
    const strengths = [];
    Object.entries(scores).forEach(([key, score]) => {
      if (score >= 85) {
        strengths.push({
          area: key,
          score: score,
          description: this.getStrengthDescription(key, score)
        });
      }
    });
    return strengths;
  }

  identifyWeaknesses(scores) {
    const weaknesses = [];
    Object.entries(scores).forEach(([key, score]) => {
      if (score < 70) {
        weaknesses.push({
          area: key,
          score: score,
          description: this.getWeaknessDescription(key, score),
          priority: score < 50 ? 'high' : score < 60 ? 'medium' : 'low'
        });
      }
    });
    return weaknesses.sort((a, b) => a.score - b.score);
  }

  getStrengthDescription(area, score) {
    const descriptions = {
      readability: 'Content is highly readable and accessible',
      seo: 'SEO optimization is excellent',
      engagement: 'Content is highly engaging for readers',
      structure: 'Content structure is well-organized',
      uniqueness: 'Content offers unique value and insights',
      expertise: 'Content demonstrates strong expertise',
      competitive: 'Content outperforms competitors significantly'
    };
    return descriptions[area] || 'Strong performance in this area';
  }

  getWeaknessDescription(area, score) {
    const descriptions = {
      readability: 'Content may be too complex for target audience',
      seo: 'SEO optimization needs improvement',
      engagement: 'Content lacks engaging elements',
      structure: 'Content structure needs better organization',
      uniqueness: 'Content needs more unique insights',
      expertise: 'Content should demonstrate more expertise',
      competitive: 'Content falls behind competitor standards'
    };
    return descriptions[area] || 'This area needs improvement';
  }

  generateGradeRecommendations(scores) {
    const recommendations = [];
    
    // Priority recommendations based on scores
    if (scores.seo < 70) {
      recommendations.push({
        priority: 'high',
        area: 'SEO',
        action: 'Optimize keyword usage, meta tags, and heading structure',
        impact: 'High',
        effort: 'Medium'
      });
    }

    if (scores.readability < 70) {
      recommendations.push({
        priority: 'high',
        area: 'Readability',
        action: 'Simplify language and shorten sentences',
        impact: 'High',
        effort: 'Low'
      });
    }

    if (scores.engagement < 70) {
      recommendations.push({
        priority: 'medium',
        area: 'Engagement',
        action: 'Add more questions, stories, and call-to-action elements',
        impact: 'Medium',
        effort: 'Low'
      });
    }

    if (scores.structure < 70) {
      recommendations.push({
        priority: 'medium',
        area: 'Structure',
        action: 'Improve heading hierarchy and add more lists',
        impact: 'Medium',
        effort: 'Low'
      });
    }

    if (scores.uniqueness < 70) {
      recommendations.push({
        priority: 'low',
        area: 'Uniqueness',
        action: 'Add more original insights and unique perspectives',
        impact: 'High',
        effort: 'High'
      });
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  generateImprovementRoadmap(grade, basic, ai) {
    const roadmap = {
      quickWins: [],
      mediumTermGoals: [],
      longTermStrategy: [],
      timeline: '2-4 weeks for significant improvement'
    };

    // Quick wins (0-1 week)
    if (grade.scores.readability < 70) {
      roadmap.quickWins.push('Simplify language and break up long sentences');
    }
    if (grade.scores.engagement < 70) {
      roadmap.quickWins.push('Add 3-5 engaging questions throughout content');
    }
    if (basic.seoBasics.issues.length > 0) {
      roadmap.quickWins.push('Fix basic SEO issues (title, meta, headings)');
    }

    // Medium-term goals (1-2 weeks)
    if (grade.scores.structure < 80) {
      roadmap.mediumTermGoals.push('Restructure content with better heading hierarchy');
    }
    if (grade.scores.seo < 80) {
      roadmap.mediumTermGoals.push('Conduct keyword research and optimize content');
    }
    if (basic.structure.media.total === 0) {
      roadmap.mediumTermGoals.push('Add relevant images and visual elements');
    }

    // Long-term strategy (2-4 weeks)
    if (grade.scores.uniqueness < 80) {
      roadmap.longTermStrategy.push('Research and add unique industry insights');
    }
    if (grade.scores.expertise < 80) {
      roadmap.longTermStrategy.push('Include expert quotes and authoritative sources');
    }
    if (grade.scores.competitive < 80) {
      roadmap.longTermStrategy.push('Analyze top competitors and differentiate content');
    }

    return roadmap;
  }

  // Mock AI analysis for fallback
  getMockAIAnalysis() {
    return {
      uniqueness: { score: 75 },
      expertise: { score: 70 },
      sentiment: 'neutral',
      topics: ['content marketing', 'SEO', 'digital strategy'],
      readingTime: '5 minutes',
      complexity: 'intermediate'
    };
  }

  // Fallback grade calculation
  getFallbackGrade(content) {
    const text = this.stripHTML(content);
    const wordCount = text.split(/\s+/).length;
    
    let score = 60; // Base score
    if (wordCount >= 500) score += 15;
    if (wordCount >= 1000) score += 10;
    
    return {
      overallScore: score,
      grade: this.getLetterGrade(score),
      gradeDescription: this.getGradeDescription(score),
      error: 'Limited analysis due to service unavailability'
    };
  }
}

export default ContentGradingService;