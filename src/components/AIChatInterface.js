import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Target, TrendingUp, Lightbulb, BarChart3, Zap, X } from 'lucide-react';

const AIChatInterface = ({ userProfile, websiteAnalysis, isOpen, onClose }) => {
  // Generate or retrieve user ID for memory
  const [userId] = useState(() => {
    let id = localStorage.getItem('attributeai-user-id');
    if (!id) {
      id = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('attributeai-user-id', id);
    }
    return id;
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "👋 Hi there! I'm your AttributeAI marketing strategist. I remember our previous conversations, so we can pick up where we left off. What would you like to focus on today?",
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
  const [conversationCount, setConversationCount] = useState(0);
  const [memoryLoaded, setMemoryLoaded] = useState(false);
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

  // Load conversation memory when chat opens
  useEffect(() => {
    if (isOpen && !memoryLoaded) {
      loadConversationMemory();
    }
  }, [isOpen, memoryLoaded]);

  const loadConversationMemory = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/chat-memory/load/${userId}`);
      if (response.ok) {
        const result = await response.json();
        const { conversations, userProfile: storedProfile, websiteData, totalConversations } = result.data;

        setConversationCount(totalConversations);

        // Add a memory status message if there's previous conversation history
        if (conversations && conversations.length > 0) {
          const memoryMessage = {
            id: 0.5,
            type: 'ai',
            content: `💾 Welcome back! I found ${totalConversations} previous conversation${totalConversations > 1 ? 's' : ''} in my memory. I remember our discussions and can build on what we've talked about before.`,
            timestamp: new Date(),
            isMemoryStatus: true,
            suggestions: [
              "What did we discuss last time?",
              "Continue from where we left off",
              "Review my progress",
              "Start fresh conversation"
            ]
          };

          setMessages(prev => [prev[0], memoryMessage, ...prev.slice(1)]);
        }

        setMemoryLoaded(true);
      }
    } catch (error) {
      console.error('Failed to load conversation memory:', error);
      setMemoryLoaded(true);
    }
  };

  const clearMemory = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/chat-memory/clear/${userId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setConversationCount(0);
        const resetMessage = {
          id: Date.now(),
          type: 'ai',
          content: "🗑️ Memory cleared! I'll start fresh with our conversation. How can I help you with your marketing strategy today?",
          timestamp: new Date(),
          suggestions: [
            "Analyze my website performance",
            "Set new marketing goals", 
            "Review competitor strategies",
            "Optimize my conversions"
          ]
        };
        setMessages([resetMessage]);
      }
    } catch (error) {
      console.error('Failed to clear memory:', error);
    }
  };

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
      // Check if message contains a URL
      const urlRegex = /https?:\/\/[^\s]+/g;
      const urls = messageText.match(urlRegex);
      
      let websiteAnalysisData = null;
      
      // If message contains URLs, analyze the first one
      if (urls && urls.length > 0) {
        const url = urls[0];
        console.log('URL detected in message, analyzing:', url);
        
        // Show analysis status
        const analysisMessage = {
          id: Date.now() + 0.5,
          type: 'ai',
          content: `🔍 Analyzing website: ${url}\n\nPlease wait while I fetch and analyze the website content...`,
          timestamp: new Date(),
          isAnalyzing: true
        };
        setMessages(prev => [...prev, analysisMessage]);
        
        try {
          // Analyze the URL
          const analysisResponse = await fetch('http://localhost:3001/api/analyze-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
          });
          
          if (analysisResponse.ok) {
            const analysisResult = await analysisResponse.json();
            websiteAnalysisData = analysisResult.data;
            console.log('Website analysis completed:', websiteAnalysisData);
            
            // Remove the analysis status message
            setMessages(prev => prev.filter(msg => !msg.isAnalyzing));
          } else {
            console.log('Website analysis failed, continuing with chat');
            setMessages(prev => prev.filter(msg => !msg.isAnalyzing));
          }
        } catch (analysisError) {
          console.error('Website analysis error:', analysisError);
          setMessages(prev => prev.filter(msg => !msg.isAnalyzing));
        }
      }

      // Make real API call to Claude with enhanced context and memory
      const response = await fetch('http://localhost:3001/api/claude-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          userId: userId, // Include user ID for memory
          context: {
            userProfile,
            websiteAnalysis: websiteAnalysis || websiteAnalysisData,
            chatHistory: messages.slice(-10),
            userGoals: chatContext.userGoals,
            // Include fresh website analysis if available
            freshWebsiteAnalysis: websiteAnalysisData
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
        ],
        // Include website analysis data if available
        websiteData: websiteAnalysisData
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Update conversation count if memory response includes it
      if (result.conversationCount) {
        setConversationCount(result.conversationCount);
      }
      
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback response
      const fallbackResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I encountered a technical issue. Please try again in a moment, or let me know if you need any marketing strategy guidance.',
        timestamp: new Date(),
        suggestions: [
          "Try again",
          "Get marketing tips",
          "Review performance",
          "Set new goals"
        ]
      };
      setMessages(prev => [...prev, fallbackResponse]);
    }
    
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    console.log('Chat interface: isOpen is false, not rendering');
    return null;
  }

  console.log('Chat interface: isOpen is true, rendering modal');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-6 w-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">AttributeAI Marketing Strategist</h3>
              <p className="text-sm opacity-90">
                Your AI-powered marketing advisor
                {conversationCount > 0 && ` • ${conversationCount} conversations remembered`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Memory Status */}
            {conversationCount > 0 && (
              <button
                onClick={clearMemory}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                title="Clear conversation memory"
              >
                <span className="text-xs">🗑️</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.suggestions && message.type === 'ai' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs bg-white text-purple-600 px-3 py-1 rounded-full hover:bg-purple-50 border border-purple-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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