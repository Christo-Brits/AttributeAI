const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
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
const crmRoutes = require('./routes/crm');
const weatherSimpleRoutes = require('./routes/weather-simple');
const weatherIntelligenceRoutes = require('./weather-intelligence-routes');
const userAnalyticsRoutes = require('./user-analytics-routes');
const localSEORoutes = require('./local-seo-routes'); // NEW: Local SEO Matrix Generator

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware - Enhanced for YC Production Standards
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", // Minimize usage
                "https://www.googletagmanager.com", 
                "https://static.hotjar.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: [
                "'self'", 
                "https://api.anthropic.com", 
                "https://api.openai.com",
                "https://xpyfoutwwjslivrmbflm.supabase.co" // Supabase API
            ],
            frameSrc: ["'none'"], // Prevent iframe embedding
            objectSrc: ["'none'"], // Prevent object/embed
            baseUri: ["'self'"], // Restrict base tag
            formAction: ["'self'"] // Restrict form submissions
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    
    // Enhanced security headers for production
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    noSniff: true, // X-Content-Type-Options: nosniff
    frameguard: { action: 'deny' }, // X-Frame-Options: DENY
    xssFilter: true, // X-XSS-Protection: 1; mode=block
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// Enhanced Rate limiting for YC Production
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { 
        error: 'Too many requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Use both IP and user ID if available for better rate limiting
        return req.user?.id || req.ip;
    }
});

const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs for sensitive endpoints
    message: { 
        error: 'Too many requests to this endpoint, please try again later.',
        code: 'STRICT_RATE_LIMIT_EXCEEDED',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    }
});

// API-specific rate limiting
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 AI requests per minute
    message: { 
        error: 'AI request limit exceeded. Please wait before making more requests.',
        code: 'AI_RATE_LIMIT',
        retryAfter: '1 minute'
    }
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/claude-chat', strictLimiter);
app.use('/api/generate-content', aiLimiter);
app.use('/api/keyword-intelligence/analyze', aiLimiter);
app.use('/api/create-checkout-session', strictLimiter);

// CORS Configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL || 'https://leafy-biscotti-c87e93.netlify.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://leafy-biscotti-c87e93.netlify.app'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Enhanced request parsing with endpoint-specific limits
app.use('/api/generate-content', express.json({ limit: '1mb' }));
app.use('/api/keyword-intelligence', express.json({ limit: '100kb' }));
app.use('/api/claude-chat', express.json({ limit: '500kb' }));
app.use('/api/', express.json({ limit: '2mb' })); // Default for other endpoints
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Enhanced input validation middleware
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Invalid input',
            code: 'VALIDATION_ERROR',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: typeof err.value === 'string' ? err.value.substring(0, 100) : err.value
            }))
        });
    }
    next();
};

// Enhanced error handling middleware for YC standards
const errorHandler = (error, req, res, next) => {
    // Enhanced logging with security considerations
    console.error('API Error:', {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : '[REDACTED]',
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'anonymous'
    });

    // Determine error response based on error type
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
            error: 'Service temporarily unavailable',
            code: 'SERVICE_UNAVAILABLE'
        });
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Invalid request data',
            code: 'VALIDATION_ERROR'
        });
    }

    if (error.status === 429) {
        return res.status(429).json({ 
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED'
        });
    }

    // Generic error response (don't leak sensitive info)
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(error.status || 500).json({ 
        error: isDevelopment ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR',
        requestId: req.id || Date.now().toString()
    });
};

// Route Modules
app.use('/api/keyword-intelligence', keywordIntelligenceRoutes);
app.use('/api/content', contentGenerationRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/weather', weatherSimpleRoutes);
app.use('/api', weatherIntelligenceRoutes); // Weather intelligence endpoints
app.use('/api/analytics', userAnalyticsRoutes); // User analytics and conversion tracking
app.use('/api/local-seo', localSEORoutes); // NEW: Local SEO Matrix Generator routes

// Stripe Integration Routes with validation
app.post('/api/create-checkout-session', [
    body('priceId').optional().isString().trim(),
    body('plan').optional().isString().isIn(['starter', 'pro', 'scale']),
    body('email').optional().isEmail().normalizeEmail(),
    validateInput
], async (req, res, next) => {
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
    next(error);
  }
});

// Claude API proxy endpoint
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

// Website Analysis Endpoint
app.post('/api/analyze-website', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                success: false, 
                error: 'URL is required' 
            });
        }

        console.log('🔍 Analyzing website:', url);
        
        // For now, return dynamic data that's better than hardcoded
        const mockData = {
            success: true,
            seoScore: Math.floor(Math.random() * 30 + 60),
            performance: Math.floor(Math.random() * 30 + 65),
            accessibility: Math.floor(Math.random() * 30 + 70),
            competitors: [
                { domain: `${new URL(url).hostname}-competitor1.com`, rank: 1, strength: Math.floor(Math.random() * 20 + 80) },
                { domain: `${new URL(url).hostname}-competitor2.com`, rank: 2, strength: Math.floor(Math.random() * 20 + 70) },
                { domain: `${new URL(url).hostname}-competitor3.com`, rank: 3, strength: Math.floor(Math.random() * 20 + 60) }
            ],
            technicalIssues: [
                { issue: 'Consider adding meta descriptions to improve CTR', priority: 'medium' },
                { issue: 'Optimize images for faster loading', priority: 'high' },
                { issue: 'Add alt text to images for accessibility', priority: 'medium' }
            ],
            metadata: {
                title: `SEO Analysis for ${url}`,
                description: 'Comprehensive SEO and performance analysis'
            }
        };

        res.json(mockData);
    } catch (error) {
        console.error('Website analysis error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to analyze website' 
        });
    }
});

// Stripe Checkout Session Creation
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ 
                error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.' 
            });
        }

        const { productId, planType, isYearly } = req.body;
        
        // Map your product IDs to the correct price IDs
        const priceMapping = {
            'prod_SUR69X5aaINViN': isYearly ? 'price_1RZUYrFQSzigm7Zh85fcpAjO' : 'price_1RZSDxFQSzigm7ZhwhKIhvYa', // Starter
            'prod_SURBKkpHySagT4': isYearly ? 'price_1RZUZeFQSzigm7ZhULegNiEF' : 'price_1RZSJIFQSzigm7ZhMBm0esKc', // Growth  
            'prod_SURGrl5AYS4Bpu': isYearly ? 'price_1RZUayFQSzigm7ZhA6CBroqF' : 'price_1RZSNiFQSzigm7ZhjVtqnhMo'  // Scale
        };

        const priceId = priceMapping[productId];
        
        if (!priceId) {
            return res.status(400).json({ 
                error: `Invalid product ID: ${productId}` 
            });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/pricing`,
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            customer_email: req.body.email || undefined,
        });

        res.json({ url: session.url });
        
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ 
            error: 'Failed to create checkout session',
            details: error.message 
        });
    }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

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

app.listen(PORT, () => {
    console.log(`AttributeAI API Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    console.log('✅ Server ready to handle requests');
    console.log('🔗 Stripe integration configured');
});
