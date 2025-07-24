const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    const { keywords, analysis_type = 'full' } = JSON.parse(event.body);
    
    // Use GPT-4 for keyword analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'You are a keyword research expert. Analyze keywords and provide search volume estimates, difficulty scores, and strategic recommendations.'
        }, {
          role: 'user',
          content: `Analyze these keywords and provide detailed insights: ${keywords.join(', ')}`
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords: keywords,
        analysis: data.choices[0].message.content,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};