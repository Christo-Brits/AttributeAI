// API Service for AttributeAI
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class APIService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Test API connection
    async testConnection(provider = 'claude') {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            const data = await response.json();
            
            if (provider === 'claude' && !data.env.claudeApiKey) {
                throw new Error('Claude API key not configured');
            }
            if (provider === 'openai' && !data.env.openaiApiKey) {
                throw new Error('OpenAI API key not configured');
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Connection test failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Call Claude API through proxy
    async callClaude(messages, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/api/claude`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                    model: options.model || 'claude-3-sonnet-20240229',
                    max_tokens: options.max_tokens || 4000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Claude API request failed');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Claude API call failed:', error);
            return { success: false, error: error.message };
        }
    }
    // Call OpenAI API through proxy
    async callOpenAI(messages, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/api/openai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                    model: options.model || 'gpt-3.5-turbo',
                    max_tokens: options.max_tokens || 4000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'OpenAI API request failed');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('OpenAI API call failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Website Analysis with AI
    async analyzeWebsite(url, analysisType = 'comprehensive') {
        const prompt = this.buildAnalysisPrompt(url, analysisType);
        
        const messages = [
            {
                role: 'user',
                content: prompt
            }
        ];

        return await this.callClaude(messages);
    }

    // SEO Analysis
    async analyzeSEO(url, content) {
        const prompt = `Analyze the SEO of this website: ${url}

Website content: ${content}

Please provide a comprehensive SEO analysis including:
1. Title and meta description optimization
2. Keyword opportunities
3. Content structure improvements
4. Technical SEO recommendations
5. Specific action items with priority levels

Format your response as structured JSON with clear recommendations.`;

        const messages = [
            {
                role: 'user',
                content: prompt
            }
        ];

        return await this.callClaude(messages);
    }
}
    // Build analysis prompt based on type
    buildAnalysisPrompt(url, analysisType) {
        const basePrompt = `Analyze this website: ${url}`;
        
        switch (analysisType) {
            case 'seo':
                return `${basePrompt}\n\nFocus on SEO analysis including keywords, meta tags, content structure, and technical SEO factors.`;
            case 'content':
                return `${basePrompt}\n\nFocus on content quality, strategy, and optimization opportunities.`;
            case 'conversion':
                return `${basePrompt}\n\nFocus on conversion optimization, user experience, and lead generation opportunities.`;
            case 'comprehensive':
            default:
                return `${basePrompt}\n\nProvide a comprehensive analysis covering SEO, content, user experience, conversion optimization, and technical performance. Include specific, actionable recommendations.`;
        }
    }
}

// Export singleton instance
export default new APIService();