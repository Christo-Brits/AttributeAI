const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Website Analysis Endpoint
app.post('/api/analyze-website', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }

    console.log('🔍 Analyzing website:', url);
    
    // Create timeout for request
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      console.log('⏰ Request timed out for:', url);
    }, 8000); // 8 second timeout
    
    try {
      // Fetch with proper headers and timeout
      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive'
        },
        redirect: 'follow',
        timeout: 8000
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log('✅ HTML fetched successfully, length:', html.length);
      
      // Parse HTML
      const $ = cheerio.load(html);
      
      // Extract SEO data
      const title = $('title').text().trim();
      const metaDesc = $('meta[name="description"]').attr('content')?.trim() || '';
      const h1Count = $('h1').length;
      const h2Count = $('h2').length;
      const h3Count = $('h3').length;
      const h4Count = $('h4').length;
      const totalImages = $('img').length;
      const imagesWithAlt = $('img[alt]').filter((i, el) => $(el).attr('alt')?.trim().length > 0).length;
      const textContent = $('body').text().replace(/\s+/g, ' ').trim();
      
      // Count links
      const hostname = new URL(url).hostname;
      const internalLinks = $('a[href^="/"], a[href*="' + hostname + '"]').length;
      const externalLinks = $('a[href^="http"]').not('a[href*="' + hostname + '"]').length;
      
      const analysis = {
        url: url,
        title: title,
        metaDescription: metaDesc,
        headings: {
          h1: h1Count,
          h2: h2Count,
          h3: h3Count,
          h4: h4Count
        },
        images: {
          total: totalImages,
          withAlt: imagesWithAlt
        },
        links: {
          internal: internalLinks,
          external: externalLinks
        },
        textContent: textContent,
        loadTime: Date.now() - startTime
      };
      
      console.log('📊 Analysis complete:', {
        title: title.substring(0, 50) + (title.length > 50 ? '...' : ''),
        headings: `H1:${h1Count} H2:${h2Count} H3:${h3Count}`,
        images: `${totalImages} total, ${imagesWithAlt} with alt`,
        textLength: textContent.length
      });
      
      res.json({
        success: true,
        data: analysis
      });
      
    } catch (fetchError) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Website took too long to respond (8s timeout). Try a different website.');
      }
      
      if (fetchError.code === 'ENOTFOUND') {
        throw new Error('Website not found. Please check the URL.');
      }
      
      if (fetchError.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Website may be blocking requests.');
      }
      
      throw new Error(`Network error: ${fetchError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze website'
    });
  }
});

// Enhanced Competitor Discovery Endpoint
app.post('/api/discover-competitors', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { url, keywords, region = 'US' } = req.body;
    
    if (!url || !keywords) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL and keywords are required' 
      });
    }

    console.log('🔍 Discovering competitors for:', { url, keywords, region });
    
    const keywordList = keywords.split(',').map(k => k.trim().toLowerCase());
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    
    // Enhanced competitor pool with broader matching
    const competitorPool = [
      // Construction & Building
      { domain: 'buildersauckland.co.nz', relevance: 95, keywords: ['building', 'construction', 'renovation', 'property', 'maintenance', 'builders', 'auckland'] },
      { domain: 'aucklandbuilders.com', relevance: 92, keywords: ['builders', 'construction', 'renovation', 'property maintenance', 'auckland'] },
      { domain: 'nzbuildpro.co.nz', relevance: 89, keywords: ['building', 'construction', 'property', 'maintenance', 'renovation', 'new zealand'] },
      { domain: 'propertycare.co.nz', relevance: 94, keywords: ['property maintenance', 'building maintenance', 'property care', 'maintenance'] },
      { domain: 'maintenancenz.co.nz', relevance: 91, keywords: ['maintenance', 'property maintenance', 'building maintenance', 'property'] },
      
      // General Services
      { domain: 'trademe.co.nz', relevance: 87, keywords: ['property', 'real estate', 'nz property', 'new zealand'] },
      { domain: 'realestate.co.nz', relevance: 85, keywords: ['property', 'real estate', 'property management'] },
      { domain: 'propertymanagement.co.nz', relevance: 90, keywords: ['property management', 'property maintenance', 'rental', 'property'] },
      
      // SEO/Marketing (for testing)
      { domain: 'semrush.com', relevance: 88, keywords: ['seo', 'keyword research', 'digital marketing', 'marketing', 'tools'] },
      { domain: 'ahrefs.com', relevance: 86, keywords: ['backlinks', 'seo analysis', 'seo', 'marketing', 'tools'] },
      { domain: 'moz.com', relevance: 84, keywords: ['seo tools', 'domain authority', 'seo', 'marketing'] },
    ];

    // Improved keyword matching algorithm
    const discoveredCompetitors = competitorPool
      .map(comp => {
        let matchScore = 0;
        const matchingKeywords = [];
        
        keywordList.forEach(keyword => {
          comp.keywords.forEach(compKeyword => {
            // Exact match
            if (compKeyword.toLowerCase() === keyword.toLowerCase()) {
              matchScore += 10;
              matchingKeywords.push(compKeyword);
            }
            // Partial match
            else if (compKeyword.toLowerCase().includes(keyword.toLowerCase()) || 
                     keyword.toLowerCase().includes(compKeyword.toLowerCase())) {
              matchScore += 5;
              matchingKeywords.push(compKeyword);
            }
            // Word-level matching
            else {
              const keywordWords = keyword.toLowerCase().split(/\s+/);
              const compKeywordWords = compKeyword.toLowerCase().split(/\s+/);
              keywordWords.forEach(word => {
                compKeywordWords.forEach(compWord => {
                  if (word.length > 2 && compWord.length > 2 && 
                      (word.includes(compWord) || compWord.includes(word))) {
                    matchScore += 2;
                    if (!matchingKeywords.includes(compKeyword)) {
                      matchingKeywords.push(compKeyword);
                    }
                  }
                });
              });
            }
          });
        });
        
        return {
          ...comp,
          matchScore,
          matchingKeywords: [...new Set(matchingKeywords)]
        };
      })
      .filter(comp => comp.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
      .map(comp => ({
        url: `https://${comp.domain}`,
        domain: comp.domain,
        relevance: Math.min(99, comp.relevance + Math.round(comp.matchScore / 2)),
        matchingKeywords: comp.matchingKeywords
      }));

    console.log('🎯 Found competitors:', discoveredCompetitors.map(c => `${c.domain} (${c.relevance}%)`));

    // Analyze each competitor
    const competitorAnalyses = [];
    for (const competitor of discoveredCompetitors) {
      try {
        console.log(`📊 Analyzing competitor: ${competitor.domain}`);
        
        const response = await fetch(`http://localhost:3001/api/analyze-website`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: competitor.url })
        });

        if (response.ok) {
          const data = await response.json();
          competitorAnalyses.push({
            ...competitor,
            analysis: data.data,
            status: 'success'
          });
        } else {
          competitorAnalyses.push({
            ...competitor,
            analysis: null,
            status: 'failed',
            error: 'Analysis failed'
          });
        }
      } catch (error) {
        console.error(`Failed to analyze ${competitor.domain}:`, error.message);
        competitorAnalyses.push({
          ...competitor,
          analysis: null,
          status: 'failed',
          error: error.message
        });
      }
    }

    // Generate content gaps and opportunities
    const contentGaps = generateContentGaps(keywordList, competitorAnalyses);
    const keywordOpportunities = generateKeywordOpportunities(keywordList, competitorAnalyses);
    
    res.json({
      success: true,
      data: {
        targetDomain: domain,
        keywords: keywordList,
        region: region,
        competitors: competitorAnalyses,
        contentGaps: contentGaps,
        keywordOpportunities: keywordOpportunities,
        analysisTime: Date.now() - startTime
      }
    });
    
  } catch (error) {
    console.error('❌ Competitor discovery error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to discover competitors'
    });
  }
});

function generateContentGaps(keywords, competitors) {
  const gaps = [];
  
  // Analyze content patterns from successful competitors
  const successfulCompetitors = competitors.filter(c => c.analysis && c.relevance > 85);
  
  if (successfulCompetitors.length > 0) {
    // Title patterns
    const titlePatterns = successfulCompetitors.map(c => c.analysis.title?.toLowerCase() || '');
    const commonTitleWords = extractCommonWords(titlePatterns);
    
    gaps.push({
      type: 'title_optimization',
      opportunity: 'Title Keyword Integration',
      description: `Top competitors commonly use these words in titles: ${commonTitleWords.slice(0, 5).join(', ')}`,
      impact: 'high',
      effort: 'low'
    });

    // Content length analysis
    const contentLengths = successfulCompetitors
      .map(c => c.analysis.textContent?.length || 0)
      .filter(length => length > 0);
    
    if (contentLengths.length > 0) {
      const avgLength = contentLengths.reduce((sum, len) => sum + len, 0) / contentLengths.length;
      const maxLength = Math.max(...contentLengths);
      
      gaps.push({
        type: 'content_expansion',
        opportunity: 'Content Depth Opportunity',
        description: `Competitors average ${Math.round(avgLength)} characters. Top performer has ${maxLength} characters.`,
        impact: 'high',
        effort: 'medium'
      });
    }

    // Heading structure analysis
    const h2Counts = successfulCompetitors.map(c => c.analysis.headings?.h2 || 0);
    const avgH2 = h2Counts.reduce((sum, count) => sum + count, 0) / h2Counts.length;
    
    if (avgH2 > 2) {
      gaps.push({
        type: 'content_structure',
        opportunity: 'Heading Structure Enhancement',
        description: `Top competitors use an average of ${Math.round(avgH2)} H2 headings for better content organization.`,
        impact: 'medium',
        effort: 'low'
      });
    }
  }

  // Keyword-specific gaps
  keywords.forEach(keyword => {
    gaps.push({
      type: 'keyword_targeting',
      opportunity: `"${keyword}" Content Gap`,
      description: `Create comprehensive content targeting "${keyword}" - competitors show strong performance in this area`,
      impact: 'high',
      effort: 'high'
    });
  });

  return gaps.slice(0, 6); // Return top 6 opportunities
}

function generateKeywordOpportunities(keywords, competitors) {
  const opportunities = [];
  
  // Long-tail keyword opportunities
  keywords.forEach(keyword => {
    const longTailVariants = [
      `best ${keyword}`,
      `${keyword} services`,
      `${keyword} auckland`,
      `professional ${keyword}`,
      `${keyword} near me`,
      `${keyword} cost`
    ];

    opportunities.push({
      type: 'long_tail',
      keyword: keyword,
      variants: longTailVariants.slice(0, 4),
      difficulty: 'medium',
      potential: 'high',
      reason: 'Long-tail keywords often have lower competition and higher conversion rates'
    });
  });

  // Geographic opportunities
  const geoModifiers = ['auckland', 'wellington', 'christchurch', 'new zealand'];
  opportunities.push({
    type: 'geographic',
    keyword: keywords[0],
    variants: geoModifiers.map(geo => `${keywords[0]} ${geo}`),
    difficulty: 'low',
    potential: 'medium',
    reason: 'Geographic targeting helps capture local search traffic'
  });

  return opportunities;
}

function extractCommonWords(texts) {
  const wordCounts = {};
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
  
  texts.forEach(text => {
    const words = text.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .map(word => word.replace(/[^\w]/g, ''));
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });
  
  return Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([word]) => word)
    .slice(0, 10);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Enhanced Website Analysis Server running on http://localhost:${PORT}`);
});
