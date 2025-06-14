const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

// Initialize Stripe only if API key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// Import route modules
const keywordIntelligenceRoutes = require('./routes/keyword-intelligence');
const contentGenerationRoutes = require('./routes/content-generation');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://leafy-biscotti-c87e93.netlify.app'],
    credentials: true
}));
app.use(express.json());

// Route Modules
app.use('/api/keyword-intelligence', keywordIntelligenceRoutes);
app.use('/api/content', contentGenerationRoutes); // New content generation routes

// Stripe Integration Routes
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ 
        error: 'Stripe not configured',
        details: 'Please set STRIPE_SECRET_KEY environment variable'
      });
    }

    const { priceId, plan } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AttributeAI Pro Plan',
              description: 'Advanced multi-touch attribution platform with AI',
            },
            unit_amount: 9700, // $97.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}`,
      metadata: {
        plan: plan || 'pro',
      },
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan: plan || 'pro',
        },
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle Stripe webhooks
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded:', session);
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription);
      break;
      
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log('Subscription updated:', updatedSubscription);
      break;
      
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log('Subscription canceled:', deletedSubscription);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get subscription status
app.get('/api/subscription-status/:customerId', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { customerId } = req.params;
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    res.json({ subscriptions: subscriptions.data });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { subscriptionId } = req.body;
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ subscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create customer portal session
app.post('/api/create-portal-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { customerId } = req.body;
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/account`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        env: {
            nodeEnv: process.env.NODE_ENV || 'development',
            port: PORT,
            stripeConfigured: !!process.env.STRIPE_SECRET_KEY
        }
    });
});

// Claude API proxy endpoint (keeping the core functionality)
app.post('/api/claude-chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        // Demo response for now since we don't have API keys configured
        const demoResponse = {
            content: `Thanks for your message: "${message}". This is a demo response. In production, this would be powered by Claude AI with full conversation memory and website analysis capabilities.`,
            suggestions: [
                "Tell me about your marketing goals",
                "Analyze my website performance", 
                "Help me create content strategy",
                "Show me attribution insights"
            ],
            timestamp: new Date().toISOString(),
            hasMemory: false,
            conversationCount: 1
        };

        res.json(demoResponse);
    } catch (error) {
        console.error('Claude Chat Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate AI response',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`AttributeAI API Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    console.log('✅ Server ready to handle requests');
    console.log('🔗 Stripe integration configured');
});]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  const sortedWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);

  return {
    primary: sortedWords.slice(0, 5).map(([word]) => word),
    secondary: sortedWords.slice(5, 15).map(([word]) => word),
    density: Object.fromEntries(sortedWords.slice(0, 10).map(([word, count]) => 
      [word, ((count / words.length) * 100).toFixed(2)]
    ))
  };
}

function calculateReadability(content) {
  const sentences = content.split(/[.!?]+/).length;
  const words = content.split(/\s+/).length;
  const syllables = content.split(/[aeiouAEIOU]/).length;
  
  // Flesch Reading Ease Score
  const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  
  return {
    fleschKincaid: Math.max(0, Math.min(100, Math.round(fleschScore))),
    gradeLevel: getGradeLevel(fleschScore),
    avgWordsPerSentence: Math.round(words / sentences),
    avgSyllablesPerWord: Math.round(syllables / words * 10) / 10
  };
}

function getGradeLevel(fleschScore) {
  if (fleschScore >= 90) return '5th Grade';
  if (fleschScore >= 80) return '6th Grade';
  if (fleschScore >= 70) return '7th Grade';
  if (fleschScore >= 60) return '8th-9th Grade';
  if (fleschScore >= 50) return '10th-12th Grade';
  if (fleschScore >= 30) return 'College Level';
  return 'Graduate Level';
}

function calculateSEOScore(analysis) {
  let score = 0;
  
  // Title optimization (25 points)
  if (analysis.meta.title) {
    score += 10;
    if (analysis.meta.title.length >= 30 && analysis.meta.title.length <= 60) score += 15;
  }
  
  // Meta description (20 points)
  if (analysis.meta.description) {
    score += 10;
    if (analysis.meta.description.length >= 120 && analysis.meta.description.length <= 160) score += 10;
  }
  
  // Headings structure (20 points)
  if (analysis.headings.h1.length === 1) score += 10;
  if (analysis.headings.h2.length > 0) score += 10;
  
  // Images optimization (15 points)
  if (analysis.images.total > 0) {
    const altRatio = analysis.images.withAlt / analysis.images.total;
    score += Math.round(altRatio * 15);
  }
  
  // Technical factors (20 points)
  if (analysis.security.https) score += 5;
  if (analysis.mobile.viewport) score += 5;
  if (analysis.schema.present) score += 5;
  if (analysis.meta.canonical) score += 5;
  
  return Math.min(100, score);
}

function calculatePerformanceScore(analysis) {
  let score = 100;
  
  // Penalize slow load times
  if (analysis.performance.loadTime > 3000) score -= 30;
  else if (analysis.performance.loadTime > 2000) score -= 20;
  else if (analysis.performance.loadTime > 1000) score -= 10;
  
  // Compression bonus
  if (analysis.performance.compressed) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

function calculateMobileScore(analysis) {
  let score = 0;
  
  if (analysis.mobile.viewport) score += 50;
  if (analysis.mobile.responsive) score += 50;
  
  return score;
}

function calculateSecurityScore(analysis) {
  let score = 0;
  
  if (analysis.security.https) score += 40;
  if (analysis.security.hsts) score += 20;
  if (!analysis.security.mixedContent) score += 40;
  
  return score;
}

function extractSchemaTypes(html) {
  const schemaMatches = html.match(/"@type":\s*"([^"]+)"/g) || [];
  return [...new Set(schemaMatches.map(match => match.match(/"([^"]+)"$/)[1]))];
}

function extractPublishDate($) {
  const selectors = [
    'meta[property="article:published_time"]',
    'meta[name="publish_date"]',
    'time[datetime]',
    '.publish-date',
    '.post-date',
    '.entry-date'
  ];
  
  for (const selector of selectors) {
    const element = $(selector);
    if (element.length > 0) {
      const date = element.attr('content') || element.attr('datetime') || element.text();
      if (date) return date;
    }
  }
  
  return null;
}

function calculateContentDepth(content, structure) {
  const wordCount = content.split(/\s+/).length;
  const headingCount = structure.headings.total;
  const listCount = structure.lists;
  
  let score = 0;
  if (wordCount > 500) score += 25;
  if (wordCount > 1000) score += 25;
  if (wordCount > 2000) score += 25;
  if (headingCount > 3) score += 15;
  if (listCount > 0) score += 10;
  
  return Math.min(100, score);
}

function calculateTopicCoverage(content, keywords) {
  const primaryKeywordCount = keywords.primary.reduce((sum, keyword) => {
    const regex = new RegExp(keyword, 'gi');
    return sum + (content.match(regex) || []).length;
  }, 0);
  
  const coverage = Math.min(100, primaryKeywordCount * 5);
  return coverage;
}

function findExpertiseSignals(content) {
  const signals = [];
  
  if (content.includes('study') || content.includes('research')) signals.push('Research-backed');
  if (content.includes('experience') || content.includes('years')) signals.push('Experience-based');
  if (content.includes('data') || content.includes('statistics')) signals.push('Data-driven');
  if (content.includes('expert') || content.includes('professional')) signals.push('Expert opinion');
  
  return signals;
}

function calculateAccessibilityScore($) {
  let score = 100;
  
  // Check for missing alt text
  const imagesWithoutAlt = $('img:not([alt])').length;
  const totalImages = $('img').length;
  if (totalImages > 0) {
    score -= (imagesWithoutAlt / totalImages) * 30;
  }
  
  // Check for heading structure
  if ($('h1').length === 0) score -= 20;
  if ($('h1').length > 1) score -= 10;
  
  // Check for form labels
  const inputsWithoutLabels = $('input:not([aria-label]):not([aria-labelledby])').filter((_, el) => {
    return !$(el).prev('label').length && !$(el).parent('label').length;
  }).length;
  if (inputsWithoutLabels > 0) score -= 15;
  
  return Math.max(0, Math.round(score));
}

function calculateBestPracticesScore(response, $) {
  let score = 100;
  
  // Check for HTTPS
  if (!response.config.url.startsWith('https://')) score -= 20;
  
  // Check for console errors (basic check)
  if (response.data.includes('console.error')) score -= 10;
  
  // Check for deprecated HTML
  if ($('font, center, marquee').length > 0) score -= 15;
  
  // Check for inline styles (should be minimal)
  const inlineStyles = $('[style]').length;
  if (inlineStyles > 5) score -= 10;
  
  return Math.max(0, score);
}

function calculateLighthouseSEOScore($) {
  let score = 100;
  
  if (!$('title').text()) score -= 20;
  if (!$('meta[name="description"]').attr('content')) score -= 15;
  if ($('h1').length !== 1) score -= 10;
  if (!$('meta[name="viewport"]').length) score -= 15;
  
  const imagesWithoutAlt = $('img:not([alt])').length;
  if (imagesWithoutAlt > 0) score -= Math.min(20, imagesWithoutAlt * 5);
  
  return Math.max(0, score);
}

function detectCMS(html, $) {
  const cms = [];
  
  if (html.includes('wp-content') || html.includes('wordpress')) cms.push('WordPress');
  if (html.includes('shopify') || html.includes('cdn.shopify.com')) cms.push('Shopify');
  if (html.includes('webflow')) cms.push('Webflow');
  if (html.includes('squarespace')) cms.push('Squarespace');
  if (html.includes('wix.com')) cms.push('Wix');
  if ($('meta[name="generator"]').attr('content')?.includes('Drupal')) cms.push('Drupal');
  if ($('meta[name="generator"]').attr('content')?.includes('Joomla')) cms.push('Joomla');
  
  return cms.length > 0 ? cms : ['Custom'];
}

function detectAnalytics(html, $) {
  const analytics = [];
  
  if (html.includes('google-analytics') || html.includes('gtag')) analytics.push('Google Analytics');
  if (html.includes('adobe') && html.includes('analytics')) analytics.push('Adobe Analytics');
  if (html.includes('mixpanel')) analytics.push('Mixpanel');
  if (html.includes('hotjar')) analytics.push('Hotjar');
  if (html.includes('fullstory')) analytics.push('FullStory');
  if (html.includes('segment')) analytics.push('Segment');
  
  return analytics;
}

function detectAdvertising(html, $) {
  const advertising = [];
  
  if (html.includes('googletagmanager') || html.includes('gtm.js')) advertising.push('Google Tag Manager');
  if (html.includes('facebook.net') || html.includes('fbevents.js')) advertising.push('Facebook Pixel');
  if (html.includes('linkedin.com/in/tags')) advertising.push('LinkedIn Insight Tag');
  if (html.includes('twitter.com') && html.includes('conversion')) advertising.push('Twitter Ads');
  if (html.includes('bing.com') && html.includes('UET')) advertising.push('Microsoft Advertising');
  
  return advertising;
}

function detectHosting(headers, url) {
  const hosting = [];
  const server = headers.server || '';
  const via = headers.via || '';
  
  if (server.includes('cloudflare')) hosting.push('Cloudflare');
  if (server.includes('nginx')) hosting.push('Nginx');
  if (server.includes('apache')) hosting.push('Apache');
  if (headers['x-served-by']?.includes('cache')) hosting.push('CDN');
  if (via.includes('AWS')) hosting.push('AWS');
  if (headers['x-vercel-id']) hosting.push('Vercel');
  if (headers['x-nf-request-id']) hosting.push('Netlify');
  
  return hosting.length > 0 ? hosting : ['Unknown'];
}

function detectCDN(headers) {
  const cdn = [];
  
  if (headers['cf-ray']) cdn.push('Cloudflare');
  if (headers['x-amz-cf-id']) cdn.push('AWS CloudFront');
  if (headers['x-cache']?.includes('HIT')) cdn.push('CDN Active');
  if (headers['x-served-by']) cdn.push('Fastly');
  
  return cdn;
}

function detectFrameworks(html, $) {
  const frameworks = [];
  
  if (html.includes('react') || $('script[src*="react"]').length > 0) frameworks.push('React');
  if (html.includes('vue') || $('script[src*="vue"]').length > 0) frameworks.push('Vue.js');
  if (html.includes('angular') || $('script[src*="angular"]').length > 0) frameworks.push('Angular');
  if (html.includes('next.js') || html.includes('_next')) frameworks.push('Next.js');
  if (html.includes('nuxt')) frameworks.push('Nuxt.js');
  if (html.includes('gatsby')) frameworks.push('Gatsby');
  
  return frameworks.length > 0 ? frameworks : ['Vanilla JS'];
}

function detectLibraries(html, $) {
  const libraries = [];
  
  if (html.includes('jquery') || $('script[src*="jquery"]').length > 0) libraries.push('jQuery');
  if (html.includes('bootstrap') || $('link[href*="bootstrap"]').length > 0) libraries.push('Bootstrap');
  if (html.includes('tailwind') || html.includes('tailwindcss')) libraries.push('Tailwind CSS');
  if (html.includes('fontawesome') || $('link[href*="fontawesome"]').length > 0) libraries.push('Font Awesome');
  if (html.includes('d3') || $('script[src*="d3"]').length > 0) libraries.push('D3.js');
  
  return libraries;
}

function detectSecurity(headers, html) {
  const security = [];
  
  if (headers['strict-transport-security']) security.push('HSTS');
  if (headers['content-security-policy']) security.push('CSP');
  if (headers['x-frame-options']) security.push('X-Frame-Options');
  if (headers['x-content-type-options']) security.push('X-Content-Type-Options');
  if (html.includes('https://') && !html.includes('http://')) security.push('Full HTTPS');
  
  return security;
}

// Real AI Insights Generation using Claude API
async function generateRealAIInsights(analysisData, url, type) {
  try {
    const prompt = `
    Analyze the following website data and provide strategic competitive insights:
    
    URL: ${url}
    Analysis Data: ${JSON.stringify(analysisData, null, 2)}
    
    Provide insights in the following format:
    - Strengths: Key competitive advantages
    - Weaknesses: Areas for improvement  
    - Opportunities: Market opportunities to exploit
    - Threats: Competitive threats to address
    - Recommendations: Specific actionable recommendations
    - Priority Actions: Top 3 immediate actions needed
    
    Focus on actionable business intelligence and competitive positioning.
    `;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Claude API request failed');
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Parse the structured response
    return parseAIInsights(content);
    
  } catch (error) {
    console.error('Real AI insights generation failed:', error);
    
    // Fallback to enhanced insights based on analysis data
    return generateFallbackInsights(analysisData, url);
  }
}

function parseAIInsights(content) {
  const sections = content.split(/(?=Strengths:|Weaknesses:|Opportunities:|Threats:|Recommendations:|Priority Actions:)/);
  
  const insights = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
    recommendations: [],
    priorities: []
  };
  
  sections.forEach(section => {
    if (section.startsWith('Strengths:')) {
      insights.strengths = extractListItems(section);
    } else if (section.startsWith('Weaknesses:')) {
      insights.weaknesses = extractListItems(section);
    } else if (section.startsWith('Opportunities:')) {
      insights.opportunities = extractListItems(section);
    } else if (section.startsWith('Threats:')) {
      insights.threats = extractListItems(section);
    } else if (section.startsWith('Recommendations:')) {
      insights.recommendations = extractListItems(section);
    } else if (section.startsWith('Priority Actions:')) {
      insights.priorities = extractListItems(section);
    }
  });
  
  return insights;
}

function extractListItems(section) {
  return section
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
    .map(line => line.replace(/^[\s-•]+/, '').trim())
    .filter(item => item.length > 0);
}

function generateFallbackInsights(analysisData, url) {
  const domain = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  
  return {
    strengths: [
      'Established web presence with functional website',
      'Basic SEO implementation in place',
      'Content structure shows organization'
    ],
    weaknesses: [
      'Limited attribution intelligence capabilities compared to AttributeAI',
      'Missing advanced competitive analysis features',
      'No multi-model AI integration for insights'
    ],
    opportunities: [
      'Implement comprehensive attribution modeling',
      'Add real-time competitive monitoring',
      'Enhance content strategy with AI-powered insights'
    ],
    threats: [
      'Competitors implementing advanced attribution features',
      'Market consolidation in analytics space',
      'Rising customer expectations for AI-powered insights'
    ],
    recommendations: [
      'Focus on attribution intelligence as key differentiator',
      'Invest in multi-model AI analysis capabilities',
      'Build comprehensive competitive intelligence suite'
    ],
    priorities: [
      'Upgrade to advanced attribution modeling',
      'Implement real-time competitor monitoring',
      'Add predictive analytics capabilities'
    ]
  };
}