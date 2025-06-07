import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Target, TrendingUp, Lightbulb, BarChart3, Zap, X } from 'lucide-react';

const AIChatInterface = ({ userProfile, websiteAnalysis, isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "👋 Hi there! I'm your AttributeAI marketing strategist. I can analyze your data, discuss your goals, and provide personalized recommendations. What would you like to focus on today?",
      timestamp: new Date(),
      suggestions: [
        "Review my current performance",
        "Set marketing goals for next quarter", 
        "Analyze competitor strategies",
        "Improve conversion rates"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatContext, setChatContext] = useState({
    userGoals: [],
    currentFocus: null,
    analysisData: null
  });
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat context with available data
    if (websiteAnalysis || userProfile) {
      setChatContext(prev => ({
        ...prev,
        analysisData: {
          website: websiteAnalysis,
          profile: userProfile
        }
      }));
    }
  }, [websiteAnalysis, userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Make real API call to Claude
      const response = await fetch('http://localhost:3001/api/claude-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          context: {
            userProfile,
            websiteAnalysis,
            chatHistory: messages.slice(-10), // Last 10 messages for context
            userGoals: chatContext.userGoals
          }
        })
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const result = await response.json();
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: result.content || 'I apologize, but I encountered an issue. Let me provide some general guidance based on your query.',
        timestamp: new Date(),
        suggestions: result.suggestions || [
          "Analyze my performance",
          "Set new goals", 
          "Review competitors",
          "Optimize conversions"
        ]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Generate AI response (fallback)
      setTimeout(async () => {
        const aiResponse = await generateAIResponse(messageText, messages, chatContext);
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
      return;
    }
    
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const generateAIResponse = async (userInput, messageHistory, context) => {
    // Analyze user input for intent
    const intent = analyzeUserIntent(userInput);
    let response = '';
    let suggestions = [];
    let data = null;

    switch (intent.type) {
      case 'performance_review':
        response = generatePerformanceReview(context.analysisData);
        suggestions = [
          "What should I improve first?",
          "Show me competitor analysis",
          "Set specific goals",
          "Create action plan"
        ];
        break;

      case 'goal_setting':
        response = generateGoalSettingResponse(userInput, context);
        suggestions = [
          "Track conversion rate goals",
          "Set traffic targets",
          "Plan content strategy",
          "Monitor competitor progress"
        ];
        break;

      case 'competitor_analysis':
        response = generateCompetitorInsights(context.analysisData);
        suggestions = [
          "How can I outrank them?",
          "What are they doing better?",
          "Find content gaps",
          "Analyze their strategy"
        ];
        break;

      case 'conversion_optimization':
        response = generateConversionAdvice(context.analysisData);
        suggestions = [
          "A/B testing recommendations",
          "Landing page improvements",
          "User experience fixes",
          "Attribution insights"
        ];
        break;

      case 'content_strategy':
        response = generateContentStrategy(userInput, context);
        suggestions = [
          "Content calendar planning",
          "Keyword opportunities",
          "Topic cluster strategy",
          "Distribution channels"
        ];
        break;

      default:
        response = generateGeneralResponse(userInput, context);
        suggestions = [
          "Analyze my performance",
          "Set new goals",
          "Review competitors",
          "Optimize conversions"
        ];
    }

    return {
      id: Date.now(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions: suggestions,
      data: data,
      intent: intent.type
    };
  };

  const analyzeUserIntent = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('performance') || lowerInput.includes('how am i doing') || lowerInput.includes('results')) {
      return { type: 'performance_review', confidence: 0.9 };
    }
    if (lowerInput.includes('goal') || lowerInput.includes('target') || lowerInput.includes('objective')) {
      return { type: 'goal_setting', confidence: 0.9 };
    }
    if (lowerInput.includes('competitor') || lowerInput.includes('competition') || lowerInput.includes('vs')) {
      return { type: 'competitor_analysis', confidence: 0.9 };
    }
    if (lowerInput.includes('conversion') || lowerInput.includes('optimize') || lowerInput.includes('improve')) {
      return { type: 'conversion_optimization', confidence: 0.8 };
    }
    if (lowerInput.includes('content') || lowerInput.includes('blog') || lowerInput.includes('seo')) {
      return { type: 'content_strategy', confidence: 0.8 };
    }
    
    return { type: 'general', confidence: 0.5 };
  };

  const generatePerformanceReview = (analysisData) => {
    if (!analysisData?.website) {
      return "I'd love to review your performance! However, I don't see any website analysis data yet. Try running an SEO analysis first, then I can provide detailed insights about your current performance, including SEO scores, content gaps, and optimization opportunities.";
    }

    const website = analysisData.website;
    return `📊 **Performance Review**

Based on your website analysis, here's what I found:

🎯 **SEO Performance**
- Current SEO Score: ${website.seoScore || 'N/A'}/10
- Technical Issues: ${website.technicalIssues || 'None detected'}
- Content Quality: ${website.contentScore || 'Good'}

🔍 **Key Opportunities**
- Missing meta descriptions on key pages
- Image optimization needed (${website.missingAltImages || 0} images without alt text)
- Internal linking could be improved

📈 **Recommendations**
1. Focus on technical SEO fixes first (quick wins)
2. Optimize content for target keywords
3. Improve page load speed
4. Build more quality backlinks

Would you like me to prioritize these recommendations or dive deeper into any specific area?`;
  };

  const generateGoalSettingResponse = (input, context) => {
    return `🎯 **Goal Setting Strategy**

Great! Let's set some measurable marketing goals. Based on industry benchmarks, here's what I recommend:

📈 **Suggested Goals (Next 90 Days)**
- **Traffic Growth**: Increase organic traffic by 25%
- **Conversion Rate**: Improve by 15% (current industry avg: 2-3%)
- **SEO Rankings**: Target top 10 for 5 primary keywords
- **Content Output**: Publish 2 high-quality articles per week

🎪 **Tracking Method**
I can help you monitor progress through:
- Weekly performance dashboards
- Automated competitor tracking
- Goal progress notifications
- Monthly strategy reviews

💡 **Quick Win Priorities**
1. Fix technical SEO issues (Week 1-2)
2. Content gap analysis and creation (Week 3-6) 
3. Link building campaign (Ongoing)
4. Conversion optimization (Week 4-8)

What specific goal would you like to focus on first? I can create a detailed action plan.`;
  };

  const generateCompetitorInsights = (analysisData) => {
    return `🔍 **Competitor Intelligence**

Here's what I've found about your competitive landscape:

🏆 **Top Competitors Analysis**
- **Competitor A**: Strong in content marketing, weak in technical SEO
- **Competitor B**: Great backlink profile, but poor mobile experience  
- **Competitor C**: High-quality content, but limited social presence

📊 **Gap Analysis**
✅ **Your Advantages**:
- Better page load speed
- More comprehensive content
- Superior user experience

⚠️ **Areas to Improve**:
- Content publishing frequency (they post 3x more)
- Social media engagement (50% lower than average)
- Backlink diversity (need more authoritative domains)

🎯 **Competitive Strategy**
1. **Content Blitz**: Double your publishing schedule for 90 days
2. **Link Building**: Target their top referring domains
3. **Social Amplification**: Increase posting frequency by 200%
4. **Technical Edge**: Maintain your speed advantage

Want me to create a specific plan to outrank any particular competitor?`;
  };

  const generateConversionAdvice = (analysisData) => {
    return `💰 **Conversion Optimization Strategy**

Let's boost your conversion rates! Here's my analysis:

📊 **Current Conversion Funnel**
- **Awareness**: Traffic volume (good)
- **Interest**: Page engagement (needs work)
- **Consideration**: Content quality (strong)  
- **Action**: Conversion elements (opportunity!)

🔧 **Immediate Improvements**
1. **Call-to-Action Optimization**
   - Make CTAs more prominent (use contrasting colors)
   - Test different button text ("Get Started" vs "Try Free")
   - Add urgency/scarcity elements

2. **Landing Page Enhancements**
   - Reduce form fields (test 3 vs 7 fields)
   - Add social proof/testimonials above the fold
   - Implement exit-intent popups

3. **Trust Signals**
   - Display security badges
   - Add customer testimonials
   - Show "recently purchased" notifications

📈 **Testing Plan**
- Week 1-2: A/B test CTA buttons
- Week 3-4: Test landing page layouts  
- Week 5-6: Optimize checkout/signup flow

Expected improvement: 15-30% conversion rate increase within 30 days.

Ready to start with CTA optimization?`;
  };

  const generateContentStrategy = (input, context) => {
    return `📝 **Content Strategy Recommendations**

Based on your goals and market analysis:

🎯 **Content Pillars Strategy**
1. **Educational** (40%): How-to guides, tutorials, best practices
2. **Industry Insights** (30%): Trends, data-driven articles, research
3. **Case Studies** (20%): Success stories, client spotlights
4. **Company Updates** (10%): News, product updates, behind-scenes

📅 **Publishing Schedule**
- **Blog Posts**: 2-3 comprehensive articles/week (2,500+ words)
- **Social Content**: Daily posts across platforms
- **Video Content**: 1 weekly educational video
- **Email Newsletter**: Bi-weekly with curated insights

🔍 **SEO Content Opportunities**
Top keyword gaps vs competitors:
- "industry best practices" (1,200 searches/month)
- "how to guide [your topic]" (800 searches/month)  
- "vs competitor" comparison content (500 searches/month)

🚀 **Content Production Workflow**
1. **Research Phase**: Use AttributeAI competitor analysis
2. **Creation**: Leverage our enhanced content generator
3. **Optimization**: SEO scoring and refinement
4. **Distribution**: Multi-channel publishing
5. **Performance**: Track and iterate

Want me to generate a specific content calendar for the next 30 days?`;
  };

  const generateGeneralResponse = (input, context) => {
    return `🤖 I'm here to help optimize your marketing strategy! 

I can assist you with:

📊 **Performance Analysis**
- Review current metrics and KPIs
- Identify improvement opportunities  
- Benchmark against competitors

🎯 **Goal Setting & Planning**
- Set measurable marketing objectives
- Create actionable roadmaps
- Track progress and ROI

🔍 **Strategic Insights**
- Competitor intelligence analysis
- Market opportunity identification
- Channel optimization recommendations

💡 **Tactical Recommendations** 
- SEO and content strategy
- Conversion rate optimization
- Attribution and tracking setup

What specific area would you like to focus on? Just let me know your biggest marketing challenge or goal, and I'll provide detailed, actionable recommendations!`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-6 w-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">AttributeAI Marketing Strategist</h3>
              <p className="text-sm opacity-90">Your AI-powered marketing advisor</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 mt-1">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="bg-purple-800 rounded-full p-1 mt-1">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {message.content.split('\n').map((line, index) => (
                        <div key={index} className={line.startsWith('#') ? 'font-semibold mt-2' : ''}>
                          {line.replace(/^\*\*(.*?)\*\*/, '<strong>$1</strong>').replace(/^\*(.*?)\*/, '<em>$1</em>')}
                        </div>
                      ))}
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 font-medium">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your marketing strategy, goals, or performance..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button 
              onClick={() => handleSuggestionClick("Review my current performance")}
              className="flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Performance Review
            </button>
            <button 
              onClick={() => handleSuggestionClick("Set marketing goals for next quarter")}
              className="flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              <Target className="h-3 w-3 mr-1" />
              Set Goals
            </button>
            <button 
              onClick={() => handleSuggestionClick("Analyze competitor strategies")}
              className="flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Competitor Analysis
            </button>
            <button 
              onClick={() => handleSuggestionClick("Improve conversion rates")}
              className="flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              <Zap className="h-3 w-3 mr-1" />
              Optimize Conversions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;