const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured' })
    };
  }

  try {
    const { prompt, model = 'gpt-4', temperature = 0.7, max_tokens = 2000 } = JSON.parse(event.body);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature,
        max_tokens: max_tokens
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error || 'OpenAI API error' })
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
