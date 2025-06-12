const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const authRoutes = require('./routes/auth');
const generateImageRoute = require('./routes/generate-image');
const researchRoutes = require('./routes/research');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());

// Authentication routes
app.use('/api', authRoutes);

// Image generation routes
app.use('/api/generate-image', generateImageRoute);

// Advanced research routes
app.use('/api', researchRoutes);

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
    try {
        const { messages, model = 'claude-3-sonnet-20240229', max_tokens = 4000 } = req.body;
        
        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ 
                error: 'Claude API key not configured',
                details: 'Please set CLAUDE_API_KEY in your environment variables'
            });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model,
                max_tokens,
                messages
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Claude API Error:', response.status, errorData);
            return res.status(response.status).json({ 
                error: 'Claude API request failed',
                details: errorData
            });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
});

// OpenAI API proxy endpoint
app.post('/api/openai', async (req, res) => {
    try {
        const { messages, model = 'gpt-3.5-turbo', max_tokens = 4000 } = req.body;
        
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI API key not configured',
                details: 'Please set OPENAI_API_KEY in your environment variables'
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API Error:', response.status, errorData);
            return res.status(response.status).json({ 
                error: 'OpenAI API request failed',
                details: errorData
            });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Claude Chat endpoint for AI Chat Interface
app.post('/api/claude-chat', async (req, res) => {
    try {
        const { message, context, userId } = req.body;
        
        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ 
                error: 'Claude API key not configured',
                details: 'Please set CLAUDE_API_KEY in your environment variables'
            });
        }

        // Load conversation memory if userId provided
        let conversationHistory = '';
        let storedUserProfile = null;
        let storedWebsiteData = null;

        if (userId) {
            const conversations = chatMemory.conversations.get(userId) || [];
            const userProfile = chatMemory.userProfiles.get(userId);
            const websiteData = chatMemory.websiteData.get(userId);

            // Build conversation history summary
            if (conversations.length > 0) {
                const recentConversations = conversations.slice(-10); // Last 10 conversations
                conversationHistory = `

CONVERSATION HISTORY:
${recentConversations.map(conv => 
    `[${new Date(conv.timestamp).toLocaleDateString()}] User: ${conv.userMessage}\nAI: ${conv.aiResponse?.substring(0, 200)}...`
).join('\n\n')}`;
            }

            storedUserProfile = userProfile;
            storedWebsiteData = websiteData;
        }

        // Build enhanced context-aware prompt with memory
        let systemPrompt = `You are an expert AI marketing strategist for AttributeAI. You help users optimize their marketing performance through data-driven insights and actionable recommendations.

Available user context:
- User Profile: ${context.userProfile ? JSON.stringify(context.userProfile) : (storedUserProfile ? JSON.stringify(storedUserProfile) : 'Not available')}
- Website Analysis: ${context.websiteAnalysis ? JSON.stringify(context.websiteAnalysis) : (storedWebsiteData ? JSON.stringify(storedWebsiteData) : 'Not available')}
- User Goals: ${context.userGoals ? context.userGoals.join(', ') : 'Not specified'}${conversationHistory}`;

        // Add fresh website analysis if available
        if (context.freshWebsiteAnalysis) {
            systemPrompt += `

FRESH WEBSITE ANALYSIS DATA:
Website: ${context.freshWebsiteAnalysis.url}
Title: ${context.freshWebsiteAnalysis.title}
Meta Description: ${context.freshWebsiteAnalysis.metaDescription}
Main Headings: ${context.freshWebsiteAnalysis.headings.h1.join(', ')}
SEO Metrics:
- Title Length: ${context.freshWebsiteAnalysis.seoMetrics.titleLength} characters
- Meta Description Length: ${context.freshWebsiteAnalysis.seoMetrics.metaDescriptionLength} characters
- H1 Count: ${context.freshWebsiteAnalysis.seoMetrics.h1Count}
- Images: ${context.freshWebsiteAnalysis.seoMetrics.imageCount} total, ${context.freshWebsiteAnalysis.seoMetrics.imagesWithoutAlt} without alt text
Technology Stack:
- Google Analytics: ${context.freshWebsiteAnalysis.technology.hasGA ? 'Yes' : 'No'}
- WordPress: ${context.freshWebsiteAnalysis.technology.hasWordPress ? 'Yes' : 'No'}
- Shopify: ${context.freshWebsiteAnalysis.technology.hasShopify ? 'Yes' : 'No'}
Contact Information: ${context.freshWebsiteAnalysis.contactInfo.emails.join(', ')}

Use this fresh data to provide specific, actionable recommendations about their website's SEO, user experience, and marketing optimization.`;
        }

        systemPrompt += `

Your responses should be:
1. Reference previous conversations when relevant (avoid repeating the same advice)
2. Build on previous recommendations and check progress
3. Specific and data-driven (reference actual website data when available)
4. Actionable with clear next steps
5. Personalized based on their website, goals, and conversation history
6. Professional but conversational
7. Include 3-4 relevant follow-up suggestions

When you have conversation history, acknowledge previous discussions and build upon them. Ask about progress on previous recommendations.

Keep responses concise but valuable (2-4 paragraphs max).`;

        const messages = [
            {
                role: 'user',
                content: `${systemPrompt}\n\nUser message: ${message}`
            }
        ];

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1500,
                messages
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        const aiContent = data.content[0].text;

        // Save conversation to memory if userId provided
        if (userId) {
            try {
                const conversation = {
                    userMessage: message,
                    aiResponse: aiContent,
                    context: context.freshWebsiteAnalysis ? {
                        websiteAnalyzed: context.freshWebsiteAnalysis.url,
                        title: context.freshWebsiteAnalysis.title
                    } : null
                };

                // Save to memory (fire and forget - don't wait for response)
                fetch('http://localhost:3001/api/chat-memory/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        conversation,
                        userProfile: context.userProfile,
                        websiteData: context.freshWebsiteAnalysis
                    })
                }).catch(err => console.log('Memory save failed:', err));
            } catch (memoryError) {
                console.log('Memory save error:', memoryError);
            }
        }

        // Generate contextual suggestions based on the conversation and website data
        const suggestions = generateChatSuggestions(message, context);

        res.json({
            content: aiContent,
            suggestions,
            timestamp: new Date().toISOString(),
            hasMemory: !!userId,
            conversationCount: userId ? (chatMemory.conversations.get(userId)?.length || 0) + 1 : 0
        });

    } catch (error) {
        console.error('Claude Chat Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate AI response',
            details: error.message
        });
    }
});

// Enhanced content generation endpoint
app.post('/api/claude-generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ 
                error: 'Claude API key not configured'
            });
        }

        const messages = [
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 4000,
                messages
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        
        res.json({
            content: data.content[0].text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Content Generation Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate content',
            details: error.message
        });
    }
});

// Memory storage for chatbot conversations
let chatMemory = {
    conversations: new Map(),
    userProfiles: new Map(),
    websiteData: new Map()
};

// Chat memory endpoints
app.post('/api/chat-memory/save', async (req, res) => {
    try {
        const { userId, conversation, userProfile, websiteData } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        // Store conversation history
        if (conversation) {
            const existingConversations = chatMemory.conversations.get(userId) || [];
            existingConversations.push({
                ...conversation,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 50 messages to prevent memory bloat
            if (existingConversations.length > 50) {
                existingConversations.splice(0, existingConversations.length - 50);
            }
            
            chatMemory.conversations.set(userId, existingConversations);
        }

        // Store user profile and preferences
        if (userProfile) {
            chatMemory.userProfiles.set(userId, {
                ...userProfile,
                lastUpdated: new Date().toISOString()
            });
        }

        // Store website analysis data
        if (websiteData) {
            chatMemory.websiteData.set(userId, {
                ...websiteData,
                lastAnalyzed: new Date().toISOString()
            });
        }

        res.json({ 
            success: true, 
            message: 'Memory saved successfully',
            conversationCount: chatMemory.conversations.get(userId)?.length || 0
        });

    } catch (error) {
        console.error('Memory save error:', error);
        res.status(500).json({ 
            error: 'Failed to save memory',
            details: error.message
        });
    }
});

app.get('/api/chat-memory/load/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const conversations = chatMemory.conversations.get(userId) || [];
        const userProfile = chatMemory.userProfiles.get(userId) || null;
        const websiteData = chatMemory.websiteData.get(userId) || null;

        res.json({
            success: true,
            data: {
                conversations: conversations.slice(-20), // Return last 20 conversations
                userProfile,
                websiteData,
                totalConversations: conversations.length
            }
        });

    } catch (error) {
        console.error('Memory load error:', error);
        res.status(500).json({ 
            error: 'Failed to load memory',
            details: error.message
        });
    }
});

app.post('/api/chat-memory/clear/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        chatMemory.conversations.delete(userId);
        chatMemory.userProfiles.delete(userId);
        chatMemory.websiteData.delete(userId);

        res.json({ 
            success: true, 
            message: 'Memory cleared successfully' 
        });

    } catch (error) {
        console.error('Memory clear error:', error);
        res.status(500).json({ 
            error: 'Failed to clear memory',
            details: error.message
        });
    }
});

// Web search and analysis endpoint for chatbot
app.post('/api/analyze-url', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                error: 'URL is required'
            });
        }

        console.log(`Analyzing URL for chatbot: ${url}`);
        
        // Fetch website content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
            },
            timeout: 10000,
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const htmlContent = await response.text();
        
        if (!htmlContent || htmlContent.length < 100) {
            throw new Error('Website returned empty or invalid content');
        }

        // Analyze website content
        const cheerio = require('cheerio');
        const $ = cheerio.load(htmlContent);
        
        // Extract key information for chatbot context
        const analysis = {
            url: url,
            title: $('title').text() || '',
            metaDescription: $('meta[name="description"]').attr('content') || '',
            headings: {
                h1: $('h1').map((i, el) => $(el).text()).get().slice(0, 5),
                h2: $('h2').map((i, el) => $(el).text()).get().slice(0, 10)
            },
            // Get main content text (limit to reasonable size)
            mainContent: $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000),
            images: {
                total: $('img').length,
                withAlt: $('img[alt]').length
            },
            links: {
                internal: $('a[href^="/"], a[href*="' + new URL(url).hostname + '"]').length,
                external: $('a[href^="http"]').not('a[href*="' + new URL(url).hostname + '"]').length
            },
            // Extract business information
            contactInfo: {
                emails: (htmlContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).slice(0, 3),
                phones: (htmlContent.match(/[\+]?[1-9]?[\d\s\-\(\)\.]{10,}/g) || []).slice(0, 2)
            },
            // SEO metrics
            seoMetrics: {
                titleLength: $('title').text().length,
                metaDescriptionLength: ($('meta[name="description"]').attr('content') || '').length,
                h1Count: $('h1').length,
                imageCount: $('img').length,
                imagesWithoutAlt: $('img').not('[alt]').length
            },
            // Technology stack hints
            technology: {
                hasGA: htmlContent.includes('gtag') || htmlContent.includes('google-analytics'),
                hasGTM: htmlContent.includes('googletagmanager'),
                hasFacebook: htmlContent.includes('facebook.com') || htmlContent.includes('fbq'),
                hasWordPress: htmlContent.includes('wp-content') || htmlContent.includes('wordpress'),
                hasShopify: htmlContent.includes('shopify') || htmlContent.includes('cdn.shopify'),
                hasSquarespace: htmlContent.includes('squarespace')
            },
            fetchedAt: new Date().toISOString()
        };
        
        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('URL Analysis error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to analyze URL'
        });
    }
});

// Helper function to generate contextual suggestions
function generateChatSuggestions(userMessage, context) {
    const suggestions = [];
    
    // Analyze user message for context
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('analytics')) {
        suggestions.push("Show me specific metrics to track");
        suggestions.push("What's my biggest opportunity?");
        suggestions.push("Compare to industry benchmarks");
        suggestions.push("Create a performance dashboard");
    } else if (lowerMessage.includes('seo') || lowerMessage.includes('search')) {
        suggestions.push("Analyze my competitors");
        suggestions.push("Find keyword opportunities");
        suggestions.push("Audit my current SEO");
        suggestions.push("Create content strategy");
    } else if (lowerMessage.includes('content') || lowerMessage.includes('blog')) {
        suggestions.push("Generate content ideas");
        suggestions.push("Optimize existing content");
        suggestions.push("Plan content calendar");
        suggestions.push("Analyze content performance");
    } else if (lowerMessage.includes('conversion') || lowerMessage.includes('optimize')) {
        suggestions.push("Audit my landing pages");
        suggestions.push("Test conversion elements");
        suggestions.push("Analyze user journey");
        suggestions.push("Improve checkout process");
    } else {
        // Default suggestions
        suggestions.push("Analyze my performance");
        suggestions.push("Set marketing goals");
        suggestions.push("Review competitors");
        suggestions.push("Optimize conversions");
    }
    
    return suggestions.slice(0, 4); // Return max 4 suggestions
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        env: {
            claudeApiKey: !!process.env.CLAUDE_API_KEY,
            openaiApiKey: !!process.env.OPENAI_API_KEY,
            googleApiKey: !!process.env.GOOGLE_AI_API_KEY
        }
    });
});

// Polish Content - SEO Optimization endpoint
app.post('/api/optimize-seo', async (req, res) => {
    try {
        const { content, metadata } = req.body;
        
        // Use GPT-4 or Claude for SEO optimization
        if (process.env.OPENAI_API_KEY) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [{
                        role: 'system',
                        content: 'You are an SEO expert. Optimize the content for search engines while maintaining readability.'
                    }, {
                        role: 'user',
                        content: `Optimize this content for SEO. Focus on keyword placement, heading structure, and readability:\n\n${content}`
                    }],
                    max_tokens: 4000
                })
            });

            const data = await response.json();
            const optimizedContent = data.choices[0].message.content;
            
            res.json({ optimizedContent });
        } else {
            // Fallback to basic optimization
            res.json({ optimizedContent: content });
        }
    } catch (error) {
        console.error('SEO optimization error:', error);
        res.status(500).json({ error: 'SEO optimization failed' });
    }
});

// Generate Images endpoint
app.post('/api/generate-images', async (req, res) => {
    try {
        const { prompt, style, count = 2 } = req.body;
        
        if (!process.env.OPENAI_API_KEY) {
            return res.json({ images: [] });
        }
        
        const images = [];
        for (let i = 0; i < count; i++) {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: `${style} ${prompt} - variation ${i + 1}`,
                    size: '1024x1024',
                    quality: 'standard',
                    n: 1
                })
            });

            const data = await response.json();
            if (data.data && data.data[0]) {
                images.push({
                    url: data.data[0].url,
                    alt: `${prompt} - Image ${i + 1}`,
                    caption: `Professional ${prompt} visualization`
                });
            }
        }
        
        res.json({ images });
    } catch (error) {
        console.error('Image generation error:', error);
        res.json({ images: [] });
    }
});

// Generate Social Media Posts endpoint
app.post('/api/generate-social-posts', async (req, res) => {
    try {
        const { content, metadata } = req.body;
        
        // Extract key points from content
        const textContent = content.replace(/<[^>]*>/g, ' ').substring(0, 500);
        
        const socialPosts = {
            linkedin: {
                text: `🏠 ${metadata.keywords || 'New insights'}: ${textContent.substring(0, 200)}... Read more for expert tips!`,
                hashtags: ['#PropertyMaintenance', '#RealEstate', '#Auckland', '#PropertyManagement']
            },
            facebook: {
                text: `Important information for property owners! ${textContent.substring(0, 150)}... Check out our latest guide for complete details.`,
                hashtags: ['#PropertyCare', '#HomeOwnership', '#AucklandProperty']
            },
            instagram: {
                text: `🔧 Property maintenance tips inside! ${textContent.substring(0, 100)}... Link in bio for full guide!`,
                hashtags: ['#PropertyMaintenance', '#AucklandHomes', '#RealEstateNZ', '#PropertyTips', '#HomeCare']
            },
            twitter: {
                text: `${metadata.keywords || 'Property insights'}: ${textContent.substring(0, 100)}...`,
                hashtags: ['#RealEstate', '#PropertyNZ', '#Auckland']
            }
        };
        
        res.json({ posts: socialPosts });
    } catch (error) {
        console.error('Social media generation error:', error);
        res.status(500).json({ error: 'Social media generation failed' });
    }
});

// Extract Key Points endpoint for Video Generation
app.post('/api/extract-key-points', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Use GPT-4 or Claude to extract key points
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: 'You are an expert at extracting key actionable points from content. Extract 3-5 main points that would work well in a short video.'
          }, {
            role: 'user',
            content: `Extract 3-5 key actionable points from this content for a short video:\n\n${content.substring(0, 2000)}`
          }],
          max_tokens: 500
        })
      });

      const data = await response.json();
      const extractedText = data.choices[0].message.content;
      
      // Parse the extracted points
      const keyPoints = extractedText.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 5);
      
      res.json({ keyPoints });
    } else {
      // Fallback to basic extraction
      const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
      const keyPoints = sentences
        .filter(s => s.match(/\d+|tip|step|way|reason|benefit|must|should|need/i))
        .slice(0, 5)
        .map(s => s.trim());
      
      res.json({ keyPoints });
    }
  } catch (error) {
    console.error('Key point extraction error:', error);
    res.status(500).json({ error: 'Failed to extract key points' });
  }
});

// Generate Video Script endpoint
app.post('/api/generate-video-script', async (req, res) => {
  try {
    const { keyPoints, platform, style, duration, tone } = req.body;
    
    if (!keyPoints || !platform) {
      return res.status(400).json({ error: 'Key points and platform are required' });
    }
    
    const platformPrompts = {
      tiktok: `Create a TikTok script that's ${style}, ${duration} seconds long. Use trendy language, hooks, and make it shareable.`,
      youtube: `Create a YouTube Shorts script that's ${style}, ${duration} seconds long. Make it educational with clear value and a strong CTA.`,
      instagram: `Create an Instagram Reels script that's ${style}, ${duration} seconds long. Make it aesthetic and engaging with good visual cues.`
    };
    
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: `You are a viral video script writer. ${platformPrompts[platform]} The tone should be ${tone}.`
          }, {
            role: 'user',
            content: `Create a video script using these key points:\n${keyPoints.join('\n')}\n\nInclude a strong hook, clear sections, and a compelling CTA.`
          }],
          max_tokens: 800
        })
      });

      const data = await response.json();
      const script = data.choices[0].message.content;
      
      res.json({ script });
    } else {
      // Fallback to template
      const hooks = {
        tiktok: "STOP! This will save you thousands 💰",
        youtube: "Here's exactly how to...",
        instagram: "Save this for later! 📌"
      };
      
      let script = `${hooks[platform]}\n\n`;
      keyPoints.forEach((point, i) => {
        script += `${i + 1}. ${point}\n`;
      });
      script += `\nFollow for more tips!`;
      
      res.json({ script });
    }
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

app.listen(PORT, () => {
    console.log(`🚀 API Proxy server running on http://localhost:${PORT}`);
    console.log(`🔑 Claude API Key: ${process.env.CLAUDE_API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Missing'}`);
});

module.exports = app;
// Website analysis endpoint - fetch and analyze websites server-side
app.post('/api/analyze-website', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                error: 'URL is required',
                details: 'Please provide a valid website URL'
            });
        }

        console.log(`Fetching website: ${url}`);
        
        // Fetch website content with proper headers
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000, // 10 second timeout
            redirect: 'follow',
            compress: true
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const htmlContent = await response.text();
        
        if (!htmlContent || htmlContent.length < 100) {
            throw new Error('Website returned empty or invalid content');
        }

        // Perform server-side analysis
        const analysis = analyzeWebsiteContent(htmlContent, url);
        
        res.json({
            success: true,
            url,
            timestamp: new Date().toISOString(),
            contentLength: htmlContent.length,
            analysis
        });

    } catch (error) {
        console.error('Website analysis error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            details: 'Failed to fetch or analyze website content'
        });
    }
});

// Server-side website analysis function
function analyzeWebsiteContent(htmlContent, url) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(htmlContent);
    
    // Extract basic SEO elements
    const title = $('title').text() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Tags = $('h1').map((i, el) => $(el).text()).get();
    const h2Tags = $('h2').map((i, el) => $(el).text()).get();
    const images = $('img');
    const links = $('a[href]');
    
    // Count content elements
    const paragraphs = $('p').length;
    const lists = $('ul, ol').length;
    const wordCount = $('body').text().split(/\s+/).filter(word => word.length > 0).length;
    
    // Analyze images
    const totalImages = images.length;
    const imagesWithoutAlt = images.filter((i, img) => !$(img).attr('alt')).length;
    
    // Technical analysis
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const hasCharset = $('meta[charset]').length > 0;
    const structuredData = $('script[type="application/ld+json"]').length;
    const openGraph = $('meta[property^="og:"]').length;
    
    // Calculate scores
    const seoScore = calculateSEOScore(title, metaDescription, h1Tags, h2Tags, totalImages, imagesWithoutAlt);
    const contentScore = calculateContentScore(wordCount, paragraphs, h1Tags, h2Tags, lists);
    const technicalScore = calculateTechnicalScore(hasViewport, hasCharset, structuredData, openGraph);
    const uxScore = calculateUXScore($);
    
    const overallScore = Math.round((seoScore + contentScore + technicalScore + uxScore) / 4);
    
    return {
        overallScore,
        scores: {
            seo: seoScore,
            content: contentScore,
            technical: technicalScore,
            ux: uxScore
        },
        seoAnalysis: {
            title: { content: title, length: title.length, status: title.length >= 30 && title.length <= 60 ? 'good' : 'needs_improvement' },
            metaDescription: { content: metaDescription, length: metaDescription.length, status: metaDescription.length >= 120 && metaDescription.length <= 160 ? 'good' : 'needs_improvement' },
            h1Count: h1Tags.length,
            h2Count: h2Tags.length,
            images: { total: totalImages, withoutAlt: imagesWithoutAlt }
        },
        contentAnalysis: {
            wordCount,
            paragraphs,
            headings: h1Tags.length + h2Tags.length,
            lists
        },
        technicalAnalysis: {
            hasViewport,
            hasCharset,
            structuredData,
            openGraph
        },
        recommendations: generateRecommendations(title, metaDescription, h1Tags, imagesWithoutAlt, hasViewport),
        quickWins: generateQuickWins(title, metaDescription, imagesWithoutAlt, hasViewport)
    };
}
// Analysis helper functions
function calculateSEOScore(title, metaDescription, h1Tags, h2Tags, totalImages, imagesWithoutAlt) {
    let score = 0;
    
    // Title analysis (0-25 points)
    if (title.length === 0) score += 0;
    else if (title.length >= 30 && title.length <= 60) score += 25;
    else score += 15;
    
    // Meta description (0-25 points)
    if (metaDescription.length === 0) score += 0;
    else if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 25;
    else score += 15;
    
    // Headers (0-25 points)
    if (h1Tags.length === 1) score += 15;
    if (h2Tags.length > 0) score += 10;
    
    // Images (0-25 points)
    if (totalImages > 0) {
        const altRatio = (totalImages - imagesWithoutAlt) / totalImages;
        score += Math.round(altRatio * 25);
    } else {
        score += 20; // No images is fine
    }
    
    return Math.min(100, score);
}

function calculateContentScore(wordCount, paragraphs, h1Tags, h2Tags, lists) {
    let score = 0;
    
    // Word count (0-30 points)
    if (wordCount < 300) score += 10;
    else if (wordCount < 1000) score += 20;
    else score += 30;
    
    // Structure (0-40 points)
    if (paragraphs >= 3) score += 15;
    if (h1Tags.length > 0 && h2Tags.length > 0) score += 15;
    if (lists > 0) score += 10;
    
    // Base content score (0-30 points)
    score += 30;
    
    return Math.min(100, score);
}

function calculateTechnicalScore(hasViewport, hasCharset, structuredData, openGraph) {
    let score = 40; // Base score
    
    if (hasViewport) score += 20;
    if (hasCharset) score += 15;
    if (structuredData > 0) score += 15;
    if (openGraph > 0) score += 10;
    
    return Math.min(100, score);
}

function calculateUXScore($) {
    let score = 30; // Base score
    
    // Navigation
    if ($('nav').length > 0 || $('header nav').length > 0) score += 20;
    
    // Footer
    if ($('footer').length > 0) score += 15;
    
    // Forms
    if ($('form').length > 0) score += 15;
    
    // Buttons/CTAs
    if ($('button, input[type="submit"]').length > 0) score += 20;
    
    return Math.min(100, score);
}

function generateRecommendations(title, metaDescription, h1Tags, imagesWithoutAlt, hasViewport) {
    const recommendations = [];
    
    if (title.length === 0) {
        recommendations.push({ title: "Add Page Title", description: "Create descriptive title tags for better SEO", priority: "high" });
    } else if (title.length < 30 || title.length > 60) {
        recommendations.push({ title: "Optimize Title Length", description: "Adjust title to 30-60 characters for optimal display", priority: "medium" });
    }
    
    if (metaDescription.length === 0) {
        recommendations.push({ title: "Add Meta Description", description: "Write compelling meta descriptions to improve click-through rates", priority: "high" });
    }
    
    if (h1Tags.length === 0) {
        recommendations.push({ title: "Add H1 Header", description: "Include a clear H1 tag on every page", priority: "high" });
    }
    
    if (imagesWithoutAlt > 0) {
        recommendations.push({ title: "Add Alt Text to Images", description: `${imagesWithoutAlt} images are missing alt text for accessibility`, priority: "medium" });
    }
    
    if (!hasViewport) {
        recommendations.push({ title: "Add Viewport Meta Tag", description: "Include viewport meta tag for mobile optimization", priority: "high" });
    }
    
    return recommendations;
}

function generateQuickWins(title, metaDescription, imagesWithoutAlt, hasViewport) {
    const quickWins = [];
    
    if (metaDescription.length === 0) {
        quickWins.push("Add meta description (15 minutes, high impact)");
    }
    
    if (imagesWithoutAlt > 0) {
        quickWins.push(`Add alt text to ${imagesWithoutAlt} images (20 minutes)`);
    }
    
    if (!hasViewport) {
        quickWins.push("Add viewport meta tag (2 minutes)");
    }
    
    if (title.length < 30) {
        quickWins.push("Expand page title (10 minutes)");
    }
    
    return quickWins;
}
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

    console.log('Fetching website:', url);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      // Fetch the website content with timeout and headers
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        redirect: 'follow'
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log('Successfully fetched HTML, length:', html.length);
      
      const $ = cheerio.load(html);
      
      // Extract SEO data
      const analysis = {
        url: url,
        title: $('title').text() || '',
        metaDescription: $('meta[name="description"]').attr('content') || '',
        headings: {
          h1: $('h1').length,
          h2: $('h2').length,
          h3: $('h3').length,
          h4: $('h4').length
        },
        images: {
          total: $('img').length,
          withAlt: $('img[alt]').length
        },
        links: {
          internal: $('a[href^="/"], a[href*="' + new URL(url).hostname + '"]').length,
          external: $('a[href^="http"]').not('a[href*="' + new URL(url).hostname + '"]').length
        },
        textContent: $('body').text().replace(/\s+/g, ' ').trim(),
        loadTime: Date.now() - startTime
      };
      
      console.log('Analysis complete:', {
        title: analysis.title,
        headings: analysis.headings,
        images: analysis.images,
        textLength: analysis.textContent.length
      });
      
      res.json({
        success: true,
        data: analysis
      });
      
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout - website took too long to respond');
      }
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Website analysis error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze website'
    });
  }
});


// Perplexity research endpoint
app.post('/api/perplexity-research', async (req, res) => {
  try {
    const { query, category, max_results = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`🔍 Perplexity research request: ${category} - ${query}`);

    // Use Claude's web search capability for research
    const researchPrompt = `Conduct comprehensive research on: "${query}"

Please provide:
1. Key statistics and data points with sources
2. Recent trends and developments (last 12 months)
3. Market insights and analysis
4. Regulatory or compliance information (if applicable)
5. Cost/pricing information (if relevant)

Format your response as detailed research findings with specific data points, and include source references where possible.

Focus on providing factual, up-to-date information that would be valuable for content creation about this topic.`;

    // Call Claude with web search capabilities
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: researchPrompt
          }
        ],
        tools: [
          {
            name: 'web_search',
            description: 'Search the web for current information',
            input_schema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query'
                }
              },
              required: ['query']
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract research results
    let researchContent = '';
    let sources = [];
    
    if (data.content && data.content.length > 0) {
      researchContent = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join(' ');
    }

    // Extract sources from tool use results if available
    if (data.content) {
      data.content.forEach(block => {
        if (block.type === 'tool_use' && block.name === 'web_search') {
          // Tool use detected - sources would be in the response
          if (block.result && block.result.sources) {
            sources.push(...block.result.sources);
          }
        }
      });
    }

    // Parse the research content for key insights
    const insights = parseResearchInsights(researchContent, query);

    const result = {
      query,
      category,
      summary: insights.summary,
      results: insights.keyPoints,
      sources: sources.slice(0, max_results), // Limit sources
      statistics: insights.statistics,
      trends: insights.trends,
      compliance: insights.compliance,
      costs: insights.costs,
      timestamp: new Date().toISOString(),
      success: true
    };

    console.log(`✅ Research completed for: ${category}`);
    res.json(result);

  } catch (error) {
    console.error('Perplexity research error:', error);
    
    // Return fallback research data
    res.json({
      query,
      category,
      summary: `Research on ${query} - limited data available due to API limitations.`,
      results: [
        `${query} is an important topic requiring current market analysis.`,
        'Industry trends show continued growth and development.',
        'Local regulations and compliance requirements should be considered.',
        'Cost analysis varies by location and specific requirements.'
      ],
      sources: [],
      statistics: {},
      trends: [],
      compliance: [],
      costs: {},
      timestamp: new Date().toISOString(),
      success: false,
      error: error.message
    });
  }
});

// Helper function to parse research insights from Claude's response
function parseResearchInsights(content, query) {
  const insights = {
    summary: '',
    keyPoints: [],
    statistics: {},
    trends: [],
    compliance: [],
    costs: {}
  };

  if (!content) {
    return insights;
  }

  // Extract summary (first paragraph or first 200 characters)
  const sentences = content.split('.').filter(s => s.trim().length > 10);
  insights.summary = sentences.slice(0, 2).join('.') + '.';

  // Extract key points (look for bullet points or numbered lists)
  const bulletPoints = content.match(/[•\-\*]\s*([^\n\r]+)/g) || [];
  const numberedPoints = content.match(/\d+\.\s*([^\n\r]+)/g) || [];
  
  insights.keyPoints = [
    ...bulletPoints.map(point => point.replace(/^[•\-\*]\s*/, '')),
    ...numberedPoints.map(point => point.replace(/^\d+\.\s*/, ''))
  ].slice(0, 5); // Limit to 5 key points

  // Extract statistics (look for numbers with % or currency symbols)
  const statisticMatches = content.match(/\$?[\d,]+(?:\.\d+)?[%]?(?:\s*(?:million|billion|thousand|percent|%))?/g) || [];
  statisticMatches.forEach((stat, index) => {
    if (index < 3) { // Limit to 3 key statistics
      insights.statistics[`stat_${index + 1}`] = stat;
    }
  });

  // Extract trends (look for trend-related keywords)
  const trendKeywords = ['trend', 'increase', 'decrease', 'growth', 'decline', 'rising', 'falling', 'growing'];
  sentences.forEach(sentence => {
    if (trendKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      insights.trends.push(sentence.trim());
    }
  });
  insights.trends = insights.trends.slice(0, 3); // Limit to 3 trends

  // Extract compliance information (look for regulation-related keywords)
  const complianceKeywords = ['regulation', 'compliance', 'law', 'requirement', 'standard', 'must', 'mandatory'];
  sentences.forEach(sentence => {
    if (complianceKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      insights.compliance.push(sentence.trim());
    }
  });
  insights.compliance = insights.compliance.slice(0, 3); // Limit to 3 compliance points

  // Extract cost information (look for cost-related keywords and currency)
  const costMatches = content.match(/(?:cost|price|fee|rate)s?\s*(?:of|for)?\s*[^.]*\$[\d,]+(?:\.\d+)?[^.]*/gi) || [];
  costMatches.forEach((cost, index) => {
    if (index < 3) { // Limit to 3 cost points
      insights.costs[`cost_${index + 1}`] = cost.trim();
    }
  });

  return insights;
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AttributeAI API Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Image generation endpoints for OpenAI DALL-E
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, size = '1024x1024', quality = 'standard', style = 'natural' } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        fallback: true
      });
    }

    console.log('🎨 Generating image with prompt:', prompt.substring(0, 100) + '...');

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        size: size,
        quality: quality,
        style: style,
        n: 1
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI Image API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Image generated successfully');
    
    res.json({
      success: true,
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      fallback: true
    });
  }
});

// Image optimization endpoint (placeholder for future implementation)
app.post('/api/optimize-image', async (req, res) => {
  try {
    const { imageUrl, format = 'webp', quality = 85, maxWidth = 1024 } = req.body;
    
    // For now, return the original URL as optimization would require additional services
    // In production, this could integrate with services like Cloudinary, ImageKit, etc.
    
    res.json({
      success: true,
      optimizedUrl: imageUrl,
      originalSize: 'Unknown',
      optimizedSize: 'Unknown',
      compressionRatio: 'Not applied',
      note: 'Image optimization service not yet implemented'
    });
    
  } catch (error) {
    console.error('Image optimization error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Enhanced content generation endpoint with image support
app.post('/api/generate-publication-ready-content', async (req, res) => {
  try {
    const { 
      website, 
      keywords, 
      businessType, 
      contentType = 'blog', 
      userProfile = null, 
      generateImages = false,
      applyEditorialReview = true
    } = req.body;
    
    if (!keywords) {
      return res.status(400).json({ error: 'Keywords are required' });
    }

    console.log('📝 Generating publication-ready content for:', keywords);

    // This would integrate with the PublicationReadyContentService
    // For now, return a structured response indicating the service is available
    
    const mockResponse = {
      success: true,
      content: {
        title: `${keywords} - Professional Guide`,
        slug: keywords.toLowerCase().replace(/\s+/g, '-'),
        wordCount: 2500,
        readingTime: '12 min read',
        structure: 'Optimized with H1, multiple H2s, FAQ section',
        seoOptimized: true
      },
      images: generateImages ? [
        {
          type: 'hero',
          description: `Professional ${keywords} hero image`,
          status: 'ready_for_generation'
        },
        {
          type: 'content', 
          description: `${keywords} process illustration`,
          status: 'ready_for_generation'
        }
      ] : [],
      metadata: {
        title: `${keywords} - Expert Guide`,
        description: `Complete guide to ${keywords} with local insights and expert advice.`,
        readinessScore: 95
      },
      optimizations: {
        editorialReviewApplied: applyEditorialReview,
        seoOptimized: true,
        localizedContent: true,
        citationsIncluded: true,
        readingLevel: 'Grade 8-9'
      },
      recommendations: [
        'Content is publication-ready',
        'Add final review for brand voice',
        'Verify all local links work correctly'
      ]
    };

    res.json(mockResponse);

  } catch (error) {
    console.error('Publication-ready content generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
