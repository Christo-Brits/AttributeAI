import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Zap, AlertCircle, CheckCircle, Clock, Users, Globe, Brain, MessageCircle, Search, Eye, PenTool, Edit3, Shield } from 'lucide-react';
import { Card, Button } from './ui/DesignSystem';
import { useDataBridge } from '../utils/DataBridge';
import { useAuth } from './auth/AuthContext';
import AIChatInterface from './AIChatInterface';
import AttributeAILogo from './ui/AttributeAILogo';

const UnifiedDashboard = ({ websiteAnalysis, onNavigateToTab }) => {
  const { user } = useAuth();
  const { data, generateUnifiedInsights } = useDataBridge();
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handle navigation to keyword intelligence
  const handleKeywordIntelligenceClick = () => {
    if (onNavigateToTab) {
      onNavigateToTab('keyword-intelligence');
    } else {
      // Fallback: try to find and click the navigation tab
      const navButton = document.querySelector('[data-tab="keyword-intelligence"]');
      if (navButton) {
        navButton.click();
      }
    }
  };

  // Handle navigation to enhanced content generator
  const handleEnhancedContentClick = () => {
    if (onNavigateToTab) {
      onNavigateToTab('enhanced-content');
    } else {
      // Fallback: try to find and click the navigation tab
      const navButton = document.querySelector('[data-tab="enhanced-content"]');
      if (navButton) {
        navButton.click();
      }
    }
  };

  // Handle navigation to content optimization engine
  const handleContentOptimizationClick = () => {
    if (onNavigateToTab) {
      onNavigateToTab('content-optimization');
    } else {
      // Fallback: try to find and click the navigation tab
      const navButton = document.querySelector('[data-tab="content-optimization"]');
      if (navButton) {
        navButton.click();
      }
    }
  };

  // Handle navigation to competitor analysis engine
  const handleCompetitorAnalysisClick = () => {
    if (onNavigateToTab) {
      onNavigateToTab('competitor-analysis');
    } else {
      // Fallback: try to find and click the navigation tab
      const navButton = document.querySelector('[data-tab="competitor-analysis"]');
      if (navButton) {
        navButton.click();
      }
    }
  };

  useEffect(() => {
    // Generate unified insights when data changes
    const generateInsights = () => {
      try {
        const unifiedInsights = generateUnifiedInsights();
        setInsights(unifiedInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [data, generateUnifiedInsights]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8">
              <AttributeAILogo 
                width={200} 
                height={60} 
                className="text-blue-600 mx-auto mb-4"
                showText={true}
                variant="stacked"
              />
            </div>
            <div className="loading-spinner h-8 w-8 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your marketing intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Marketing Intelligence Dashboard</h1>
          <p className="text-lg text-gray-600">
            Unified insights from all your marketing analysis tools
          </p>
          
          {/* AI Chat Button */}
          <div className="mt-4">
            {/* Test Button */}
            <button
              onClick={() => alert('Test button works!')}
              className="bg-red-500 text-white px-4 py-2 rounded mb-2 mr-2"
            >
              TEST BUTTON
            </button>
            
            <button
              onClick={() => {
                console.log('Chat button clicked! Opening chat...');
                setIsChatOpen(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center mx-auto space-x-2 shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat with AI Marketing Strategist</span>
            </button>
            <p className="text-sm text-gray-500 mt-2">Get personalized recommendations and strategy advice</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {insights?.performanceScore || 0}
            </div>
            <div className="text-sm text-gray-600">Overall Performance Score</div>
            <div className="text-xs text-green-600 mt-1">
              {insights?.performanceScore > 70 ? '↗ Excellent' : 
               insights?.performanceScore > 50 ? '→ Good' : '↘ Needs Work'}
            </div>
          </Card>

          <Card className="text-center">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {insights?.topOpportunities?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Top Opportunities</div>
            <div className="text-xs text-blue-600 mt-1">Ready to capture</div>
          </Card>

          <Card className="text-center">
            <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {insights?.quickWins?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Quick Wins</div>
            <div className="text-xs text-orange-600 mt-1">Low effort, high impact</div>
          </Card>

          <Card className="text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {insights?.dataFreshness?.avgAgeHours || 0}h
            </div>
            <div className="text-sm text-gray-600">Data Age</div>
            <div className={`text-xs mt-1 ${
              insights?.dataFreshness?.freshness === 'Fresh' ? 'text-green-600' :
              insights?.dataFreshness?.freshness === 'Recent' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {insights?.dataFreshness?.freshness || 'Unknown'}
            </div>
          </Card>
        </div>

        {/* NEW: Keyword Intelligence Engine Feature Callout */}
        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🚀 NEW: AI Keyword Intelligence Engine
            </h2>
            
            <p className="text-lg text-gray-700 mb-4 max-w-3xl mx-auto">
              Surpass Keywords Everywhere with unlimited AI-powered keyword research. 
              Multi-model analysis from Claude, GPT-4, and Gemini with attribution-connected insights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
                <Zap className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Unlimited Research</div>
                <div className="text-sm text-gray-600">No credit limits like Keywords Everywhere</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
                <Brain className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Multi-AI Analysis</div>
                <div className="text-sm text-gray-600">Claude + GPT-4 + Gemini intelligence</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Attribution Connected</div>
                <div className="text-sm text-gray-600">Link keywords to actual conversions</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleKeywordIntelligenceClick}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
              >
                <Search className="w-5 h-5 mr-2" />
                Try Keyword Intelligence
              </Button>
              
              <Button 
                variant="secondary"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => alert('Demo coming soon! Click "Try Keyword Intelligence" to access the full feature.')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                ✨ 10x better value than Keywords Everywhere
              </span>
            </div>
          </div>
        </Card>

        {/* NEW: Enhanced Content Generator Feature Callout */}
        <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <PenTool className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🔥 NEW: Enhanced Content Generator
            </h2>
            
            <p className="text-lg text-gray-700 mb-4 max-w-3xl mx-auto">
              Destroy Outrank.so with unlimited AI content generation. Multi-model AI creates SEO-optimized content 
              with attribution tracking and competitive intelligence.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
                <Zap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Unlimited Generation</div>
                <div className="text-sm text-gray-600">No credit limits like Outrank.so</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-pink-100">
                <Brain className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Multi-Model AI</div>
                <div className="text-sm text-gray-600">Claude + GPT-4 + Gemini working together</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Attribution Intelligence</div>
                <div className="text-sm text-gray-600">Track content → conversions → revenue</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleEnhancedContentClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Try Enhanced Content
              </Button>
              
              <Button 
                variant="secondary"
                className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => alert('Multi-model content generation ready! Click "Try Enhanced Content" to start creating.')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Features
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                🎯 Outrank.so Killer - Better features, lower cost
              </span>
            </div>
          </div>
        </Card>

        {/* NEW: Content Intelligence Engine Feature Callout */}
        <Card className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-2 border-orange-200">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                <Edit3 className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ⚡ NEW: Content Intelligence Engine
            </h2>
            
            <p className="text-lg text-gray-700 mb-4 max-w-3xl mx-auto">
              Crush Outranking.io with unlimited content optimization. Multi-model AI analysis with 
              attribution intelligence and revenue tracking. No credit limits, better insights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
                <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Unlimited Optimization</div>
                <div className="text-sm text-gray-600">No document credits like Outranking.io</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-red-100">
                <Brain className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Multi-Model Analysis</div>
                <div className="text-sm text-gray-600">Claude + GPT-4 + Gemini consensus</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
                <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Revenue Attribution</div>
                <div className="text-sm text-gray-600">Track content performance → conversions</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleContentOptimizationClick}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Try Content Intelligence
              </Button>
              
              <Button 
                variant="secondary"
                className="border-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => alert('Content optimization engine ready! Unlimited analysis vs Outranking.io credit limits.')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                🚀 Outranking.io Killer - $47/month unlimited vs their $79+ with limits
              </span>
            </div>
          </div>
        </Card>

        {/* NEW: Competitor Analysis Engine Feature Callout */}
        <Card className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-2 border-slate-200">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-slate-500 to-gray-600 p-3 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🛡️ NEW: Competitor Analysis Engine
            </h2>
            
            <p className="text-lg text-gray-700 mb-4 max-w-3xl mx-auto">
              Advanced competitor intelligence with multi-model AI analysis. Strategic insights, 
              market positioning, and actionable opportunities to outperform any competitor.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg border border-slate-100">
                <Brain className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Multi-Model AI</div>
                <div className="text-sm text-gray-600">Claude + GPT-4 + Gemini intelligence</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
                <Target className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Strategic Gaps</div>
                <div className="text-sm text-gray-600">Actionable competitive opportunities</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-slate-100">
                <Shield className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Threat Assessment</div>
                <div className="text-sm text-gray-600">Market positioning & defense strategy</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleCompetitorAnalysisClick}
                className="bg-gradient-to-r from-slate-500 to-gray-600 text-white px-6 py-3 text-lg font-semibold hover:from-slate-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-2" />
                Analyze Competitors
              </Button>
              
              <Button 
                variant="secondary"
                className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => alert('Competitor analysis engine ready! Multi-model AI intelligence for strategic advantage.')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Features
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                🎯 All-in-One Intelligence - Complete competitor analysis vs fragmented tools
              </span>
            </div>
          </div>
        </Card>

        {/* Website Analysis Summary */}
        {websiteAnalysis && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                Enhanced Website Analysis Results
                {websiteAnalysis.analysisType === 'enhanced-local-analysis' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Real Content Analysis
                  </span>
                )}
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {websiteAnalysis.overallScore}/100
                </div>
                <div className="text-xs text-gray-500">Overall Score</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {websiteAnalysis.seoAnalysis.score}/100
                </div>
                <div className="text-sm text-gray-600">SEO Score</div>
                {websiteAnalysis.seoAnalysis.metrics && (
                  <div className="text-xs text-blue-700 mt-1">
                    {websiteAnalysis.seoAnalysis.metrics.titleOptimal ? '✓' : '⚠'} Title Optimization
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {websiteAnalysis.contentAnalysis.score}/100
                </div>
                <div className="text-sm text-gray-600">Content Quality</div>
                {websiteAnalysis.contentAnalysis.strengths && (
                  <div className="text-xs text-purple-700 mt-1">
                    {websiteAnalysis.contentAnalysis.strengths.length} Strengths Found
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {websiteAnalysis.conversionAnalysis.score}/100
                </div>
                <div className="text-sm text-gray-600">Conversion Potential</div>
                {websiteAnalysis.conversionAnalysis.estimatedImpact && (
                  <div className="text-xs text-green-700 mt-1">
                    {websiteAnalysis.conversionAnalysis.estimatedImpact}
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  {websiteAnalysis.technicalAnalysis?.score || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Technical Score</div>
                <div className="text-xs text-orange-700 mt-1">
                  {websiteAnalysis.apiUsed || 'Analysis Engine'}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="h-4 w-4 text-blue-600 mr-2" />
                AI-Powered Recommendations:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {websiteAnalysis.aiRecommendations.slice(0, 6).map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      rec.priority === 'High' ? 'bg-red-500' :
                      rec.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900 truncate">{rec.action}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      {rec.description && (
                        <p className="text-xs text-gray-600 leading-relaxed">{rec.description}</p>
                      )}
                      {rec.impact && rec.effort && (
                        <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                          <span>Impact: {rec.impact}</span>
                          <span>Effort: {rec.effort}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {websiteAnalysis.analysisType === 'enhanced-local-analysis' && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">
                      ✨ Enhanced analysis using {websiteAnalysis.apiUsed} at {new Date(websiteAnalysis.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-blue-600 font-medium">
                      Real Website Data Analysis
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Top Opportunities */}
        {insights?.topOpportunities?.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 text-green-600 mr-2" />
              Top Opportunities
            </h2>
            
            <div className="space-y-3">
              {insights.topOpportunities.slice(0, 5).map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{opportunity.opportunity}</div>
                    <div className="text-sm text-gray-600">
                      {opportunity.type} • From {opportunity.source}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-16 h-2 rounded ${
                      opportunity.impact >= 4 ? 'bg-green-500' :
                      opportunity.impact >= 3 ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-600">Impact: {opportunity.impact}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Wins */}
        {insights?.quickWins?.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-yellow-600 mr-2" />
              Quick Wins (Low Effort, High Impact)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.quickWins.slice(0, 6).map((win, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-gray-900">{win.title || win.action || win.opportunity}</div>
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {win.description || win.issue || win.benefit}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="badge badge-success">Low Effort</span>
                    <span className="text-gray-500">Impact: {win.impact || 'High'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommended Actions */}
        {insights?.recommendedActions?.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              Recommended Action Plan
            </h2>
            
            <div className="space-y-4">
              {insights.recommendedActions.slice(0, 8).map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`badge ${
                      action.priority === 'High' ? 'badge-danger' :
                      action.priority === 'Medium' ? 'badge-warning' : 'badge-gray'
                    }`}>
                      {action.priority}
                    </span>
                    <span className="text-sm text-gray-500">{action.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Data Sources */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-purple-600 mr-2" />
            Active Data Sources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data || {}).map(([key, value]) => {
              const sourceMap = {
                attribution_insights: { name: 'Attribution Engine', color: 'blue' },
                seo_findings: { name: 'SEO Analysis', color: 'green' },
                content_insights: { name: 'Content Strategy', color: 'purple' },
                cro_findings: { name: 'CRO Analysis', color: 'orange' },
                gsc_insights: { name: 'GSC Data', color: 'blue' },
                lead_magnet_insights: { name: 'Lead Magnets', color: 'pink' }
              };
              
              const source = sourceMap[key] || { name: key.replace(/_/g, ' '), color: 'gray' };
              const isActive = value?.metadata?.timestamp;
              
              return (
                <div key={key} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{source.name}</div>
                    <div className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isActive ? 
                      `Updated ${new Date(value.metadata.timestamp).toLocaleDateString()}` :
                      'No data available'
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Empty State */}
        {(!insights || (
          !insights.topOpportunities?.length && 
          !insights.quickWins?.length && 
          !insights.recommendedActions?.length
        )) && (
          <Card className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
            <p className="text-gray-600 mb-6">
              Run analysis in any of the marketing intelligence tools to see unified insights here.
            </p>
            <div className="flex justify-center space-x-3">
              <Button variant="outline" size="sm">
                Run SEO Analysis
              </Button>
              <Button variant="outline" size="sm">
                Generate Content
              </Button>
              <Button variant="outline" size="sm">
                Analyze CRO
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
    
    {/* AI Chat Interface */}
    <AIChatInterface 
      websiteAnalysis={websiteAnalysis}
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
    />
    </>
  );
};

export default UnifiedDashboard;