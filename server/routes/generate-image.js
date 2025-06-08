const express = require('express');
const router = express.Router();

// Image generation endpoint using OpenAI DALL-E
router.post('/', async (req, res) => {
  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        fallbackMessage: 'Image generation requires OpenAI API key configuration'
      });
    }

    // Call OpenAI GPT-4o Image Generation API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to generate image',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();
    
    if (data.data && data.data[0] && data.data[0].url) {
      res.json({
        success: true,
        imageUrl: data.data[0].url,
        prompt: prompt,
        size: size,
        quality: quality,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        error: 'Unexpected response format from OpenAI',
        data: data
      });
    }

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error during image generation',
      message: error.message
    });
  }
});

module.exports = router;
