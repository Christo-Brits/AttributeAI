import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, TrendingUp, Target, Brain, Zap, BarChart3, 
  Globe, Users, DollarSign, Award, AlertCircle, CheckCircle,
  Download, Filter, RefreshCw, Lightbulb, ArrowRight,
  Cpu, Eye, Clock, Star, Database, Wifi, WifiOff
} from 'lucide-react';
import { Card, Button, ProgressIndicator } from './ui/DesignSystem';
import { useAttributeAIAnalytics } from '../hooks/useAttributeAIAnalytics';
import { ProgressSavePrompt, QuickSignupModal } from './immediate-conversion-system';

const KeywordIntelligenceEngine = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Initialize analytics for this component
  const { 
    trackKeywordAnalysis, 
    trackToolStart, 
    trackToolComplete, 
    trackToolError, 
    trackExport 
  } = useAttributeAIAnalytics('keyword_intelligence');

  // Simulate keyword analysis (in production, this would call your backend API)
  const analyzeKeyword = async (keyword) => {
    if (!keyword.trim()) return;
    
    setIsAnalyzing(true);
    trackToolStart();
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis results (replace with real API call)
      const mockResults = {
        keyword: keyword,
        volume: Math.floor(Math.random() * 10000) + 1000,
        difficulty: Math.floor(Math.random() * 100),
        cpc: (Math.random() * 5).toFixed(2),
        competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        intent: ['Informational', 'Commercial', 'Transactional'][Math.floor(Math.random() * 3)],
        aiInsights: {
          claude: `Strategic analysis: This keyword shows strong potential for content marketing with moderate competition.`,
          gpt4: `Creative approach: Consider long-tail variations and semantic keywords for better targeting.`,
          gemini: `Market intelligence: Trending upward in searches with good conversion potential.`
        },
        contentOpportunities: [
          {
            type: 'Blog Post',
            title: `Complete Guide to ${keyword}`,
            priority: 'High',
            difficulty: 'Medium',
            keywords: [keyword, `${keyword} guide`, `best ${keyword}`]
          },
          {
            type: 'Landing Page',
            title: `${keyword} Solutions & Services`,
            priority: 'Medium',
            difficulty: 'Low',
            keywords: [keyword, `${keyword} services`, `${keyword} company`]
          }
        ]
      };
      
      setResults(mockResults);
      trackToolComplete();
      trackKeywordAnalysis('analysis_completed', {
        'keyword': keyword,
        'volume': mockResults.volume,
        'difficulty': mockResults.difficulty
      });
      
      // Track user activity for conversion system
      const actions = parseInt(localStorage.getItem('attributeai_actions') || '0') + 1;
      localStorage.setItem('attributeai_actions', actions.toString());
      
      // Track features used
      const features = JSON.parse(localStorage.getItem('attributeai_features_used') || '[]');
      if (!features.includes('keyword_intelligence')) {
        features.push('keyword_intelligence');
        localStorage.setItem('attributeai_features_used', JSON.stringify(features));
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      trackToolError('analysis_failed', error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Brain className="w-8 h-8 mr-3 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Keyword Intelligence Engine</h1>
            <div className="ml-4 flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Multi-AI Analysis</span>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            Unlimited AI-powered keyword research with multi-model intelligence from Claude, GPT-4, and Gemini
          </p>
          
          {/* Competitive Advantage Banner */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">10x Better Than Keywords Everywhere</h3>
                <p className="text-green-100 text-sm">Unlimited research • Multi-AI insights • Attribution intelligence</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-xl">$0 Credit Limits</div>
                <div className="text-green-100 text-sm">vs $10/100k credits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="p-6 mb-8 bg-gray-800 border-gray-700">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeKeyword(query)}
                placeholder="Enter keyword to analyze (unlimited research)..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:placeholder-gray-400"
              />
            </div>
            <Button
              onClick={() => analyzeKeyword(query)}
              disabled={isAnalyzing || !query.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <ProgressIndicator size="sm" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Analyze Keyword</span>
                </div>
              )}
            </Button>
          </div>
        </Card>

        {/* Analysis Results */}
        {results && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Keyword Metrics: "{results.keyword}"
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{results.volume.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Search Volume</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{results.difficulty}%</div>
                  <div className="text-sm text-gray-400">Difficulty</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">${results.cpc}</div>
                  <div className="text-sm text-gray-400">CPC</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{results.competition}</div>
                  <div className="text-sm text-gray-400">Competition</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{results.intent}</div>
                  <div className="text-sm text-gray-400">Intent</div>
                </div>
              </div>
            </Card>

            {/* Multi-AI Insights */}
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                Multi-Model AI Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
                  <div className="flex items-center mb-3">
                    <Cpu className="w-5 h-5 mr-2 text-blue-400" />
                    <span className="font-semibold text-blue-300">Claude Sonnet</span>
                    <div className="ml-auto flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm">{results.aiInsights.claude}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
                  <div className="flex items-center mb-3">
                    <Zap className="w-5 h-5 mr-2 text-green-400" />
                    <span className="font-semibold text-green-300">GPT-4 Turbo</span>
                    <div className="ml-auto flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-green-100 text-sm">{results.aiInsights.gpt4}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
                  <div className="flex items-center mb-3">
                    <Globe className="w-5 h-5 mr-2 text-purple-400" />
                    <span className="font-semibold text-purple-300">Google Gemini</span>
                    <div className="ml-auto flex">
                      {[1,2,3,4].map(i => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <Star className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-purple-100 text-sm">{results.aiInsights.gemini}</p>
                </div>
              </div>
            </Card>

            {/* Content Opportunities */}
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Content Opportunities
              </h2>
              
              <div className="space-y-4">
                {results.contentOpportunities.map((opportunity, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                            {opportunity.type}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            opportunity.priority === 'High' ? 'bg-red-600 text-white' :
                            opportunity.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                            'bg-green-600 text-white'
                          }`}>
                            {opportunity.priority} Priority
                          </span>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{opportunity.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.keywords.map((keyword, kidx) => (
                            <span key={kidx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Example Keywords */}
        {!results && (
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
              Try These Popular Keywords
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'digital marketing',
                'SEO optimization',
                'content marketing',
                'digital marketing strategy',
                'competitor analysis',
                'social media marketing'
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-left p-3 border border-gray-600 rounded-lg bg-gray-700 hover:border-blue-400 hover:bg-gray-600 transition-colors"
                >
                  <div className="text-sm font-medium text-white">{example}</div>
                </button>
              ))}
            </div>
          </Card>
        )}
        
        {/* Progress Save Prompt - Shows after analysis */}
        {results && (
          <ProgressSavePrompt
            toolName="keyword analysis"
            onSignup={() => setShowSignupModal(true)}
          />
        )}
      </div>
      
      {/* Quick Signup Modal */}
      <QuickSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={(userData) => {
          console.log('User converted after keyword analysis:', userData);
          // Track the conversion
          if (window.gtag) {
            window.gtag('event', 'signup_completed', {
              event_category: 'conversion',
              event_label: 'keyword_analysis',
              value: 1
            });
          }
          // Refresh to show authenticated state
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }}
      />
    </div>
  );
};

export default KeywordIntelligenceEngine;