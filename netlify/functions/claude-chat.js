const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;
  
  if (!CLAUDE_API_KEY) {
    console.error('Claude API key not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Claude API key not configured' })
    };
  }

  try {
    const { messages } = JSON.parse(event.body);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: messages,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Claude API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error || 'Claude API error' })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};