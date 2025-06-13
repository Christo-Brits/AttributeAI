const express = require('express');
const router = express.Router();

// Multi-Model Content Generation Routes
// Designed to crush Outrank.so with unlimited generation and attribution intelligence

// Claude content generation endpoint
router.post('/generate-claude', async (req, res) => {
  try {
    const { prompt, maxTokens = 4000, temperature = 0.3 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Enhanced Claude prompt for strategic content
    const enhancedPrompt = `You are an expert content strategist creating high-quality, SEO-optimized content that outranks competitors like Outrank.so.

${prompt}

Additional Requirements:
- Focus on E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- Include strategic insights and actionable advice
- Ensure logical flow and professional structure
- Optimize for both search engines and human readers
- Include relevant statistics and examples where appropriate

Generate comprehensive, authoritative content that demonstrates clear expertise in the subject matter.`;

    const claudeResponse = await generateWithClaude(enhancedPrompt, maxTokens, temperature);
    
    res.json({
      success: true,
      content: claudeResponse.content,
      model: 'claude',
      wordCount: countWords(claudeResponse.content),
      timestamp: Date.now(),
      usage: claudeResponse.usage
    });

  } catch (error) {
    console.error('Claude generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Claude content generation failed',
      details: error.message
    });
  }
});

// GPT-4 content generation endpoint
router.post('/generate-gpt4', async (req, res) => {
  try {
    const { prompt, maxTokens = 4000, temperature = 0.7 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Enhanced GPT-4 prompt for creative, engaging content
    const enhancedPrompt = `You are a creative content writer specializing in engaging, reader-friendly content that converts visitors into customers.

${prompt}

Creative Enhancement Requirements:
- Use compelling storytelling techniques
- Include engaging hooks and transitions
- Vary sentence structure for better readability
- Add emotional resonance and human connection
- Include practical examples and case studies
- Optimize for user engagement and time-on-page
- Create content that readers want to share

Generate creative, engaging content that captures attention and drives action while maintaining SEO optimization.`;

    const gpt4Response = await generateWithGPT4(enhancedPrompt, maxTokens, temperature);
    
    res.json({
      success: true,
      content: gpt4Response.content,
      model: 'gpt4',
      wordCount: countWords(gpt4Response.content),
      timestamp: Date.now(),
      usage: gpt4Response.usage
    });

  } catch (error) {
    console.error('GPT-4 generation error:', error);
    res.status(500).json({
      success: false,
      error: 'GPT-4 content generation failed',
      details: error.message
    });
  }
});

// Gemini content generation endpoint
router.post('/generate-gemini', async (req, res) => {
  try {
    const { prompt, maxTokens = 4000, temperature = 0.5 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Enhanced Gemini prompt for market intelligence and trends
    const enhancedPrompt = `You are a market intelligence expert creating data-driven content with current trends and competitive insights.

${prompt}

Market Intelligence Requirements:
- Incorporate current market trends and data
- Include competitive landscape insights
- Reference industry statistics and benchmarks
- Highlight emerging opportunities and threats
- Provide forward-looking market predictions
- Include relevant market research and studies
- Focus on timely relevance and market context

Generate market-intelligent content that demonstrates deep understanding of current industry dynamics and future trends.`;

    const geminiResponse = await generateWithGemini(enhancedPrompt, maxTokens, temperature);
    
    res.json({
      success: true,
      content: geminiResponse.content,
      model: 'gemini',
      wordCount: countWords(geminiResponse.content),
      timestamp: Date.now(),
      usage: geminiResponse.usage
    });

  } catch (error) {
    console.error('Gemini generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Gemini content generation failed',
      details: error.message
    });
  }
});

// Multi-model content generation endpoint (combines all three)
router.post('/generate-multi-model', async (req, res) => {
  try {
    const { prompt, maxTokens = 4000, primaryModel = 'claude' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const results = {};
    const errors = {};

    // Generate with all three models in parallel
    const generationPromises = [
      generateWithClaude(prompt, maxTokens, 0.3).then(result => {
        results.claude = result;
      }).catch(error => {
        errors.claude = error.message;
      }),
      
      generateWithGPT4(prompt, maxTokens, 0.7).then(result => {
        results.gpt4 = result;
      }).catch(error => {
        errors.gpt4 = error.message;
      }),
      
      generateWithGemini(prompt, maxTokens, 0.5).then(result => {
        results.gemini = result;
      }).catch(error => {
        errors.gemini = error.message;
      })
    ];

    await Promise.allSettled(generationPromises);

    // Determine the best result based on primary model preference
    let primaryContent = null;
    let successfulModels = Object.keys(results);
    
    if (results[primaryModel]) {
      primaryContent = results[primaryModel];
    } else if (successfulModels.length > 0) {
      primaryContent = results[successfulModels[0]];
    } else {
      return res.status(500).json({
        success: false,
        error: 'All AI models failed to generate content',
        errors: errors
      });
    }

    // Calculate attribution score based on content quality metrics
    const attributionScore = calculateAttributionScore(primaryContent, successfulModels.length);

    res.json({
      success: true,
      content: primaryContent.content,
      model: 'multi-model-optimized',
      primaryModel: primaryModel,
      modelsUsed: successfulModels,
      wordCount: countWords(primaryContent.content),
      attributionScore: attributionScore,
      timestamp: Date.now(),
      alternativeVersions: successfulModels.filter(m => m !== primaryModel).map(model => ({
        model: model,
        content: results[model]?.content,
        wordCount: countWords(results[model]?.content || '')
      })),
      errors: Object.keys(errors).length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Multi-model generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Multi-model content generation failed',
      details: error.message
    });
  }
});

// Content optimization endpoint (enhance existing content)
router.post('/optimize', async (req, res) => {
  try {
    const { content, targetKeyword, optimizationType = 'seo' } = req.body;
    
    if (!content || !targetKeyword) {
      return res.status(400).json({
        success: false,
        error: 'Content and target keyword are required'
      });
    }

    const optimizationPrompt = `Optimize the following content for the keyword "${targetKeyword}" and ${optimizationType} best practices:

Original Content:
${content}

Optimization Requirements:
- Improve keyword integration and density
- Enhance readability and user engagement
- Optimize heading structure (H1, H2, H3)
- Add relevant semantic keywords
- Improve meta description and title suggestions
- Enhance E-E-A-T signals
- Maintain natural flow and readability

Provide the optimized content along with specific improvements made.`;

    const optimizedResult = await generateWithClaude(optimizationPrompt, 4000, 0.3);
    
    res.json({
      success: true,
      originalContent: content,
      optimizedContent: optimizedResult.content,
      targetKeyword: targetKeyword,
      optimizationType: optimizationType,
      wordCountOriginal: countWords(content),
      wordCountOptimized: countWords(optimizedResult.content),
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Content optimization error:', error);
    res.status(500).json({
      success: false,
      error: 'Content optimization failed',
      details: error.message
    });
  }
});

// Batch content generation endpoint
router.post('/generate-batch', async (req, res) => {
  try {
    const { keywords, contentType = 'blog-post', maxTokens = 2000 } = req.body;
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keywords array is required'
      });
    }

    if (keywords.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 keywords allowed per batch'
      });
    }

    const batchResults = [];
    
    for (const keyword of keywords) {
      try {
        const prompt = `Create a ${contentType} optimized for the keyword "${keyword}". The content should be approximately ${maxTokens/2} words, SEO-optimized, and valuable for readers interested in ${keyword}.`;
        
        const result = await generateWithClaude(prompt, maxTokens, 0.3);
        
        batchResults.push({
          keyword: keyword,
          content: result.content,
          wordCount: countWords(result.content),
          success: true
        });
        
        // Small delay between generations to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        batchResults.push({
          keyword: keyword,
          error: error.message,
          success: false
        });
      }
    }

    const successfulCount = batchResults.filter(r => r.success).length;
    
    res.json({
      success: true,
      totalRequested: keywords.length,
      successfulGenerated: successfulCount,
      results: batchResults,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Batch generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Batch content generation failed',
      details: error.message
    });
  }
});
// Helper Functions for AI Model Integration

async function generateWithClaude(prompt, maxTokens, temperature) {
  const anthropic = require('@anthropic-ai/sdk');
  
  const client = new anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
  });

  const response = await client.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: maxTokens,
    temperature: temperature,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return {
    content: response.content[0].text,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens
    }
  };
}

async function generateWithGPT4(prompt, maxTokens, temperature) {
  const OpenAI = require('openai');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: maxTokens,
    temperature: temperature
  });

  return {
    content: response.choices[0].message.content,
    usage: {
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens
    }
  };
}

async function generateWithGemini(prompt, maxTokens, temperature) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const generationConfig = {
    temperature: temperature,
    topK: 1,
    topP: 1,
    maxOutputTokens: maxTokens,
  };

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });

  const response = await result.response;
  
  return {
    content: response.text(),
    usage: {
      inputTokens: 0, // Gemini doesn't provide token counts in the same way
      outputTokens: 0
    }
  };
}

function countWords(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function calculateAttributionScore(content, modelCount = 1) {
  if (!content || !content.content) return 70;
  
  const wordCount = countWords(content.content);
  const baseScore = 70;
  
  // Bonus for word count (up to 15 points)
  const wordCountBonus = Math.min((wordCount / 1000) * 5, 15);
  
  // Bonus for multiple models (up to 10 points)
  const multiModelBonus = (modelCount - 1) * 3;
  
  // Bonus for content quality indicators (up to 5 points)
  const qualityBonus = content.content.includes('expertise') || 
                      content.content.includes('research') || 
                      content.content.includes('data') ? 5 : 0;
  
  return Math.round(Math.min(baseScore + wordCountBonus + multiModelBonus + qualityBonus, 100));
}

// Content analysis endpoint for competitive intelligence
router.post('/analyze-competitor', async (req, res) => {
  try {
    const { url, targetKeyword } = req.body;
    
    if (!url || !targetKeyword) {
      return res.status(400).json({
        success: false,
        error: 'URL and target keyword are required'
      });
    }

    // This is a placeholder for competitor content analysis
    // In a real implementation, you would scrape the URL and analyze the content
    const analysisPrompt = `Analyze the competitive landscape for the keyword "${targetKeyword}" and provide strategic recommendations for creating superior content.

Consider:
- Content gaps in the current market
- Opportunities for better user experience
- Unique angles not covered by competitors
- Advanced topics that could establish authority
- User intent fulfillment improvements

Provide specific, actionable recommendations for outranking existing content.`;

    const analysis = await generateWithClaude(analysisPrompt, 2000, 0.3);
    
    res.json({
      success: true,
      targetKeyword: targetKeyword,
      competitorUrl: url,
      analysis: analysis.content,
      recommendations: extractRecommendations(analysis.content),
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Competitor analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Competitor analysis failed',
      details: error.message
    });
  }
});

function extractRecommendations(analysisText) {
  // Simple extraction of action items from analysis text
  const lines = analysisText.split('\n');
  const recommendations = [];
  
  lines.forEach(line => {
    if (line.includes('recommend') || line.includes('should') || line.includes('consider')) {
      recommendations.push(line.trim());
    }
  });
  
  return recommendations.slice(0, 5); // Return top 5 recommendations
}

// Content calendar generation endpoint
router.post('/generate-calendar', async (req, res) => {
  try {
    const { industry, targetAudience, monthsAhead = 3, contentTypeMix = {} } = req.body;
    
    if (!industry || !targetAudience) {
      return res.status(400).json({
        success: false,
        error: 'Industry and target audience are required'
      });
    }

    const calendarPrompt = `Create a comprehensive ${monthsAhead}-month content calendar for a ${industry} business targeting ${targetAudience}.

Include:
- 20-25 content ideas per month
- Mix of content types (blog posts, social media, email, video)
- SEO-optimized titles and topics
- Seasonal relevance and trending topics
- Strategic content distribution across the customer journey
- Keyword opportunities for each piece

Format as a structured monthly breakdown with specific publishing dates and content types.`;

    const calendar = await generateWithClaude(calendarPrompt, 4000, 0.4);
    
    res.json({
      success: true,
      industry: industry,
      targetAudience: targetAudience,
      monthsAhead: monthsAhead,
      calendar: calendar.content,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Calendar generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Content calendar generation failed',
      details: error.message
    });
  }
});

// Export the router
module.exports = router;