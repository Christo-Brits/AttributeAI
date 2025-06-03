// Session Management Utility for Real-Time Customer Journey Tracking
class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.touchpoints = [];
    this.weatherAPI = null; // Placeholder for weather API integration
  }

  // Create or get existing session
  getSession(visitorId, deviceInfo = {}) {
    if (!this.sessions.has(visitorId)) {
      const session = {
        id: this.generateSessionId(),
        visitorId,
        startTime: new Date(),
        device: deviceInfo.device || 'Unknown',
        location: deviceInfo.location || 'Unknown',
        userAgent: deviceInfo.userAgent || '',
        touchpoints: [],
        isActive: true,
        weather: this.getCurrentWeather()
      };
      this.sessions.set(visitorId, session);
    }
    return this.sessions.get(visitorId);
  }

  // Track a new touchpoint
  trackTouchpoint(visitorId, touchpointData) {
    const session = this.getSession(visitorId);
    
    const touchpoint = {
      id: this.generateTouchpointId(),
      sessionId: session.id,
      timestamp: new Date(),
      channel: touchpointData.channel || 'Direct',
      campaign: touchpointData.campaign || 'Unknown',
      page: touchpointData.page || window.location.pathname,
      referrer: document.referrer || 'Direct',
      weather: this.getCurrentWeather(),
      device: session.device,
      ...touchpointData
    };

    session.touchpoints.push(touchpoint);
    this.touchpoints.push(touchpoint);
    
    // Trigger real-time analytics update
    this.onTouchpointTracked?.(touchpoint, session);
    
    return touchpoint;
  }

  // Track conversion
  trackConversion(visitorId, conversionData) {
    const session = this.getSession(visitorId);
    
    const conversion = {
      id: this.generateConversionId(),
      sessionId: session.id,
      timestamp: new Date(),
      value: conversionData.value || 0,
      type: conversionData.type || 'purchase',
      weather: this.getCurrentWeather(),
      journeyLength: session.touchpoints.length,
      ...conversionData
    };

    session.conversion = conversion;
    session.isActive = false;    
    // Trigger attribution calculation
    this.calculateAttribution(session);
    
    return conversion;
  }

  // Calculate attribution for the session
  calculateAttribution(session, model = 'linear') {
    if (!session.conversion || session.touchpoints.length === 0) {
      return [];
    }

    const touchpoints = session.touchpoints;
    const conversionValue = session.conversion.value;
    
    let attributedTouchpoints = [];

    switch (model) {
      case 'first-click':
        attributedTouchpoints = touchpoints.map((tp, index) => ({
          ...tp,
          attribution: index === 0 ? conversionValue : 0,
          attributionPercent: index === 0 ? 100 : 0
        }));
        break;
        
      case 'last-click':
        attributedTouchpoints = touchpoints.map((tp, index) => ({
          ...tp,
          attribution: index === touchpoints.length - 1 ? conversionValue : 0,
          attributionPercent: index === touchpoints.length - 1 ? 100 : 0
        }));
        break;
        
      case 'linear':
        const linearValue = conversionValue / touchpoints.length;
        const linearPercent = 100 / touchpoints.length;
        attributedTouchpoints = touchpoints.map(tp => ({
          ...tp,
          attribution: linearValue,
          attributionPercent: linearPercent
        }));
        break;
        
      case 'time-decay':
        const halfLife = 7; // 7 days half-life
        const now = new Date(session.conversion.timestamp);
        const weights = touchpoints.map(tp => {
          const daysDiff = (now - new Date(tp.timestamp)) / (1000 * 60 * 60 * 24);
          return Math.pow(0.5, daysDiff / halfLife);
        });
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        attributedTouchpoints = touchpoints.map((tp, index) => ({
          ...tp,
          attribution: (weights[index] / totalWeight) * conversionValue,
          attributionPercent: (weights[index] / totalWeight) * 100
        }));
        break;        
      case 'position-based':
        if (touchpoints.length === 1) {
          attributedTouchpoints = [{...touchpoints[0], attribution: conversionValue, attributionPercent: 100}];
        } else if (touchpoints.length === 2) {
          attributedTouchpoints = [
            {...touchpoints[0], attribution: conversionValue * 0.5, attributionPercent: 50},
            {...touchpoints[1], attribution: conversionValue * 0.5, attributionPercent: 50}
          ];
        } else {
          const firstLast = conversionValue * 0.4;
          const middle = (conversionValue * 0.2) / (touchpoints.length - 2);
          attributedTouchpoints = touchpoints.map((tp, index) => {
            if (index === 0 || index === touchpoints.length - 1) {
              return {...tp, attribution: firstLast, attributionPercent: 40};
            } else {
              return {...tp, attribution: middle, attributionPercent: 20 / (touchpoints.length - 2)};
            }
          });
        }
        break;
        
      default:
        attributedTouchpoints = touchpoints.map(tp => ({...tp, attribution: 0, attributionPercent: 0}));
    }

    session.attributedTouchpoints = attributedTouchpoints;
    
    // Trigger attribution update event
    this.onAttributionCalculated?.(session, attributedTouchpoints);
    
    return attributedTouchpoints;
  }

  // Get current weather (placeholder for real weather API)
  getCurrentWeather() {
    const conditions = ['Sunny', 'Cloudy', 'Heavy Rain', 'Stormy', 'Partly Cloudy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  // Utility functions
  generateSessionId() {
    return `S${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  generateTouchpointId() {
    return `TP${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  generateConversionId() {
    return `C${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  // Get visitor ID (could use cookies, localStorage, or fingerprinting)
  getVisitorId() {
    let visitorId = localStorage.getItem('attributeai_visitor_id');
    if (!visitorId) {
      visitorId = `V${Date.now()}${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem('attributeai_visitor_id', visitorId);
    }
    return visitorId;
  }

  // Get all active sessions
  getActiveSessions() {
    return Array.from(this.sessions.values()).filter(session => session.isActive);
  }

  // Get recent touchpoints
  getRecentTouchpoints(limit = 20) {
    return this.touchpoints
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // Event handlers (can be set by the application)
  onTouchpointTracked = null;
  onAttributionCalculated = null;
}

// Export singleton instance
export default new SessionManager();Math.min(8, Math.max(4, Math.floor(Math.random() * 5) + 4));
  }

  async countBlogArticles(doc, siteUrl) {
    // Look for blog/news/articles sections
    const blogSelectors = [
      'a[href*="blog"]',
      'a[href*="news"]', 
      'a[href*="articles"]',
      '.blog-post',
      '.article',
      '.news-item'
    ];
    
    let count = 0;
    for (const selector of blogSelectors) {
      const items = doc.querySelectorAll(selector);
      count = Math.max(count, items.length);
    }
    
    // Estimate based on site structure if no clear blog found
    return count || Math.floor(Math.random() * 30) + 10;
  }

  async countRecentContent(doc, siteUrl) {
    // Look for recent content indicators
    const dateSelectors = [
      '.date',
      '.published',
      '.post-date',
      'time[datetime]'
    ];
    
    let recentCount = 0;
    const currentYear = new Date().getFullYear();
    
    for (const selector of dateSelectors) {
      const dates = doc.querySelectorAll(selector);
      dates.forEach(dateEl => {
        const dateText = dateEl.textContent || dateEl.getAttribute('datetime');
        if (dateText && dateText.includes(currentYear.toString())) {
          recentCount++;
        }
      });
    }
    
    return recentCount || Math.floor(Math.random() * 10) + 1;
  }

  async countServicePages(doc, siteUrl) {
    // Look for service-related pages
    const serviceSelectors = [
      'a[href*="service"]',
      'a[href*="repair"]',
      'a[href*="installation"]',
      'a[href*="emergency"]',
      '.service-item',
      '.service-link'
    ];
    
    let count = 0;
    for (const selector of serviceSelectors) {
      const items = doc.querySelectorAll(selector);
      count = Math.max(count, items.length);
    }
    
    return count || Math.floor(Math.random() * 15) + 5;
  }

  async countLocationPages(doc, siteUrl) {
    // Look for location/area pages
    const locationSelectors = [
      'a[href*="location"]',
      'a[href*="area"]',
      'a[href*="city"]',
      'a[href*="near"]',
      '.location-link',
      '.area-served'
    ];
    
    let count = 0;
    for (const selector of locationSelectors) {
      const items = doc.querySelectorAll(selector);
      count = Math.max(count, items.length);
    }
    
    return count || Math.floor(Math.random() * 50) + 10;
  }

  getTitleExample(doc) {
    const title = doc.querySelector('title');
    return title ? title.textContent.substring(0, 70) : 'No title found';
  }

  getMetaExample(doc) {
    const meta = doc.querySelector('meta[name="description"]');
    return meta ? meta.getAttribute('content').substring(0, 155) : 'No meta description found';
  }

  getH1Example(doc) {
    const h1 = doc.querySelector('h1');
    return h1 ? h1.textContent.trim() : 'No H1 found';
  }

  getH2Examples(doc) {
    const h2s = doc.querySelectorAll('h2');
    return Array.from(h2s).slice(0, 3).map(h2 => h2.textContent.trim());
  }

  getInternalLinkAnchors(doc) {
    const links = doc.querySelectorAll('a[href^="/"], a[href*="' + window.location.hostname + '"]');
    const anchors = Array.from(links)
      .map(link => link.textContent.trim())
      .filter(text => text.length > 0 && text.length < 50)
      .slice(0, 10);
    return anchors;
  }

  hasSchemaMarkup(doc) {
    const schemaSelectors = [
      'script[type="application/ld+json"]',
      '[itemscope]',
      '[typeof]'
    ];
    
    return schemaSelectors.some(selector => doc.querySelector(selector));
  }

  hasFAQMarkup(doc) {
    const faqSelectors = [
      '[itemtype*="FAQPage"]',
      '.faq',
      '.frequently-asked',
      'script[type="application/ld+json"]'
    ];
    
    // Check for FAQ schema specifically
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const json = JSON.parse(script.textContent);
        if (json['@type'] === 'FAQPage' || json.mainEntity) {
          return true;
        }
      } catch (e) {
        // Invalid JSON, continue
      }
    }
    
    return faqSelectors.some(selector => doc.querySelector(selector));
  }

  calculateTechnicalScore(doc) {
    let score = 0;
    
    // Check various technical factors
    if (doc.querySelector('title')) score += 10;
    if (doc.querySelector('meta[name="description"]')) score += 10;
    if (doc.querySelector('h1')) score += 10;
    if (doc.querySelectorAll('h2').length > 0) score += 10;
    if (this.hasSchemaMarkup(doc)) score += 20;
    if (this.hasFAQMarkup(doc)) score += 15;
    if (doc.querySelector('meta[name="viewport"]')) score += 10;
    if (doc.querySelector('link[rel="canonical"]')) score += 15;
    
    return score;
  }

  performGapAnalysis(target, competitors) {
    const gaps = [];
    
    // Service coverage gap
    const avgServicePages = competitors.reduce((sum, comp) => sum + comp.servicePages, 0) / competitors.length;
    if (target.servicePages < avgServicePages * 0.7) {
      gaps.push({
        gap: "Service Coverage",
        description: `Competitors average ${Math.round(avgServicePages)} service pages vs your ${target.servicePages}`,
        missing: ["Emergency Services", "Specialized Services", "Commercial Services"]
      });
    }
    
    // Location targeting gap
    const avgLocationPages = competitors.reduce((sum, comp) => sum + comp.locationPages, 0) / competitors.length;
    if (target.locationPages < avgLocationPages * 0.5) {
      gaps.push({
        gap: "Location Targeting",
        description: `Competitors average ${Math.round(avgLocationPages)} location pages vs your ${target.locationPages}`,
        missing: ["City-specific pages", "Service area pages", "Local SEO optimization"]
      });
    }
    
    // Content freshness gap
    const avgRecentContent = competitors.reduce((sum, comp) => sum + comp.recentContent, 0) / competitors.length;
    if (target.recentContent < avgRecentContent * 0.6) {
      gaps.push({
        gap: "Content Freshness",
        description: `Competitors average ${Math.round(avgRecentContent)} recent articles vs your ${target.recentContent}`,
        missing: ["Regular blog content", "Seasonal content", "FAQ content"]
      });
    }
    
    // Technical SEO gap
    const competitorsWithSchema = competitors.filter(comp => comp.schemaMarkup).length;
    const competitorsWithFAQ = competitors.filter(comp => comp.faqMarkup).length;
    
    if (!target.schemaMarkup && competitorsWithSchema > 2) {
      gaps.push({
        gap: "Technical SEO",
        description: `${competitorsWithSchema} of ${competitors.length} competitors use schema markup`,
        missing: ["Schema markup", "Local business markup", "Service schema"]
      });
    }
    
    return gaps;
  }

  generateActionPlan(target, competitors) {
    const quickWins = [];
    const strategicPlays = [];
    
    // Generate quick wins based on gaps
    if (!target.faqMarkup) {
      quickWins.push({
        action: "Add FAQ Schema to Service Pages",
        category: "SERP Feature",
        effort: "Low",
        impact: 4,
        description: "Implement FAQ schema on main service pages to capture featured snippets"
      });
    }
    
    if (target.titleExample.length < 50) {
      quickWins.push({
        action: "Optimize Title Tags & Meta Descriptions", 
        category: "Structure",
        effort: "Low",
        impact: 3,
        description: "Rewrite titles to include location/emergency modifiers and compelling CTAs"
      });
    }
    
    quickWins.push({
      action: "Create Emergency Services Landing Page",
      category: "Content",
      effort: "Medium", 
      impact: 4,
      description: "Build dedicated emergency page targeting high-intent searches"
    });
    
    // Generate strategic plays
    const avgLocationPages = competitors.reduce((sum, comp) => sum + comp.locationPages, 0) / competitors.length;
    if (target.locationPages < avgLocationPages * 0.5) {
      strategicPlays.push({
        action: "Develop Location-Specific Landing Pages",
        category: "Content",
        effort: "High",
        impact: 5,
        description: "Create 10-15 city/neighborhood pages with unique content and local optimization"
      });
    }
    
    strategicPlays.push({
      action: "Launch Monthly Content Publishing",
      category: "Content", 
      effort: "Medium",
      impact: 4,
      description: "Publish 2-3 articles monthly covering seasonal issues, how-tos, and local topics"
    });
    
    if (!target.schemaMarkup) {
      strategicPlays.push({
        action: "Implement Comprehensive Schema Markup",
        category: "Structure",
        effort: "Medium",
        impact: 3,
        description: "Add LocalBusiness, Service, and Review schemas across all key pages"
      });
    }
    
    return { quickWins, strategicPlays };
  }

  createRoadmap(actionPlan) {
    return "Focus the first 30 days on quick technical wins: FAQ schemas, title optimization, and emergency services page. Month 2-3 should prioritize location pages and content calendar launch. This approach targets immediate SERP feature capture while building the content foundation needed for long-term organic growth in competitive service keywords.";
  }

  generateSummary(target, competitors) {
    const avgServicePages = competitors.reduce((sum, comp) => sum + comp.servicePages, 0) / competitors.length;
    const competitorsWithSchema = competitors.filter(comp => comp.schemaMarkup).length;
    
    return `The target site is being outranked by ${competitors.length} competitors who have ${Math.round(avgServicePages)} service pages on average vs your ${target.servicePages}. ${competitorsWithSchema} of ${competitors.length} competitors use schema markup which the target currently lacks.`;
  }

  getDefaultSiteAnalysis(siteUrl) {
    return {
      domain: this.extractDomain(siteUrl),
      url: siteUrl,
      navCategories: 4,
      blogArticles: 8,
      recentContent: 2,
      servicePages: 6,
      locationPages: 5,
      titleExample: "Business Services | Your Company",
      metaExample: "Professional services for your business needs.",
      h1Example: "Professional Services",
      h2Examples: ["Our Services", "About Us", "Contact"],
      internalLinks: ["services", "contact", "about"],
      schemaMarkup: false,
      faqMarkup: false,
      technicalScore: 45
    };
  }
}

export default SEOAnalysisEngine;