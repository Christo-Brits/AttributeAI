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
const crmRoutes = require('./routes/crm');
const weatherSimpleRoutes = require('./routes/weather-simple');
const weatherIntelligenceRoutes = require('./weather-intelligence-routes');
const userAnalyticsRoutes = require('./user-analytics-routes');
const localSEORoutes = require('./local-seo-routes'); // NEW: Local SEO Matrix Generator

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
app.use('/api/content', contentGenerationRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/weather', weatherSimpleRoutes);
app.use('/api', weatherIntelligenceRoutes); // Weather intelligence endpoints
app.use('/api/analytics', userAnalyticsRoutes); // User analytics and conversion tracking
app.use('/api/local-seo', localSEORoutes); // NEW: Local SEO Matrix Generator routes

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
