const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.' 
        }),
      };
    }

    const { productId, planType, isYearly } = JSON.parse(event.body);
    
    // Map your product IDs to the correct price IDs
    const priceMapping = {
      'prod_SUR69X5aaINViN': isYearly ? 'price_1RZUYrFQSzigm7Zh85fcpAjO' : 'price_1RZSDxFQSzigm7ZhwhKIhvYa', // Starter
      'prod_SURBKkpHySagT4': isYearly ? 'price_1RZUZeFQSzigm7ZhULegNiEF' : 'price_1RZSJIFQSzigm7ZhMBm0esKc', // Growth  
      'prod_SURGrl5AYS4Bpu': isYearly ? 'price_1RZUayFQSzigm7ZhA6CBroqF' : 'price_1RZSNiFQSzigm7ZhjVtqnhMo'  // Scale
    };

    const priceId = priceMapping[productId];
    
    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: `Invalid product ID: ${productId}` 
        }),
      };
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
      success_url: `https://attributeai.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://attributeai.app`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: error.message 
      }),
    };
  }
};
