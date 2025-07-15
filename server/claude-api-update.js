// Updated Claude API endpoint with REAL API integration
// Replace the existing claude-chat endpoint in server/api-proxy.js

// Claude API proxy endpoint - REAL API INTEGRATION
app.post('/api/claude-chat', async (req, res) => {
    try {
        const { message, context, userId } = req.body;
        
        const claudeApiKey = process.env.CLAUDE_API_KEY;
        
        if (!claudeApiKey || claudeApiKey.includes('your-claude-api-key')) {
            // Fallback to demo response if no API key
            const demoResponse = {
                content: `Thanks for your message: "${message}". Demo mode active - add CLAUDE_API_KEY to enable real AI responses.`,
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
            return res.json(demoResponse);
        }

        console.log('🤖 Making real Claude API call...');

        // Real Claude API call
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': claudeApiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: `You are an expert marketing attribution specialist for AttributeAI platform.

Context: ${context || 'General marketing consultation'}
User ID: ${userId || 'anonymous'}

User message: ${message}

Provide helpful, actionable marketing insights focused on attribution, performance optimization, and strategic recommendations. Be specific and professional.`
                    }
                ]
            })
        });

        if (!claudeResponse.ok) {
            const errorText = await claudeResponse.text();
            console.error('Claude API Error:', claudeResponse.status, errorText);
            throw new Error(`Claude API error: ${claudeResponse.status} ${claudeResponse.statusText}`);
        }

        const claudeData = await claudeResponse.json();
        console.log('✅ Claude API success!');
        
        const response = {
            content: claudeData.content[0].text,
            suggestions: [
                "Analyze my attribution data",
                "Optimize conversion paths",
                "Review marketing performance", 
                "Plan next quarter strategy"
            ],
            timestamp: new Date().toISOString(),
            hasMemory: true,
            conversationCount: 1,
            aiModel: 'claude-3-sonnet'
        };

        res.json(response);
        
    } catch (error) {
        console.error('Claude Chat Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate AI response',
            details: error.message
        });
    }
});
