// Phase 2 Enhanced - Unified Dashboard with Claude AI Intelligence
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Zap, AlertCircle, CheckCircle, Clock, Users, Brain, Sparkles } from 'lucide-react';
import { Card, Button } from './ui/DesignSystem';
import { useDataBridge } from '../utils/DataBridge';
import { useClaudeAnalysis } from '../utils/useClaudeAnalysis';
import AIInsights from './ui/AIInsights';

const UnifiedDashboard = () => {
  const { data, generateUnifiedInsights } = useDataBridge();
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Phase 2: Claude AI Integration
  const { analyzeWithClaude, loading: aiLoading, error: aiError } = useClaudeAnalysis();
  const [aiDashboardInsights, setAiDashboardInsights] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(true);

  useEffect(() => {
    // Generate unified insights when data changes
    const generateInsights = () => {
      try {
        const unifiedInsights = generateUnifiedInsights();
        setInsights(unifiedInsights);
        
        // Phase 2: Generate AI insights from unified data
        generateAIInsights(unifiedInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [data, generateUnifiedInsights]);

  // Phase 2: Generate AI insights for the dashboard
  const generateAIInsights = async (unifiedData) => {
    if (!unifiedData || Object.keys(unifiedData).length === 0) return;

    try {
      const aiAnalysis = await analyzeWithClaude('attribution_analysis', {
        performanceData: unifiedData.performance,
        opportunities: unifiedData.opportunities,
        toolsData: data,
        lastUpdated: new Date().toISOString()
      }, {
        analysisScope: 'unified_dashboard',
        focus: 'cross_tool_optimization'
      });

      if (aiAnalysis) {
        setAiDashboardInsights(aiAnalysis);
      }
    } catch (error) {
      console.error('AI insights generation failed:', error);
    }
  };

  // Manual AI analysis trigger
  const triggerAIAnalysis = async () => {
    if (insights) {
      await generateAIInsights(insights);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with AI Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AttributeAI Dashboard</h1>
            <p className="text-gray-600 mt-1">Phase 2: Enhanced with Claude AI Intelligence</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowAiPanel(!showAiPanel)}
              variant={showAiPanel ? "primary" : "secondary"}
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>AI Insights</span>
            </Button>
            <Button
              onClick={triggerAIAnalysis}
              loading={aiLoading}
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Refresh AI</span>
            </Button>
          </div>
        </div>

        {/* Phase 2: AI Intelligence Panel */}
        {showAiPanel && (
          <div className="grid md:grid-cols-2 gap-6">
            <AIInsights
              analysis={aiDashboardInsights}
              loading={aiLoading}
              error={aiError}
              title="Cross-Tool AI Intelligence"
            />
            
            {/* AI Status Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Analysis Status</h3>
              </div>
              
              <div className="space-y-3">
                {Object.keys(data).map((toolName) => (
                  <div key={toolName} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{toolName.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center space-x-2">
                      {data[toolName] && Object.keys(data[toolName]).length > 0 ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600">Data Available</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">No Data</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg border border-purple-100">
                <p className="text-sm text-gray-700">
                  <strong>AI Enhancement:</strong> Claude analyzes data across all tools to identify 
                  cross-platform opportunities and optimization strategies.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Existing Dashboard Content */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Performance Score */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Overall Performance</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {insights.performance?.overallScore || 0}/100
                  </p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Progress</span>
                  <span className="text-blue-600">{insights.performance?.overallScore || 0}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${insights.performance?.overallScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* Top Opportunities */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Top Opportunities</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {insights.opportunities?.length || 0}
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                {insights.opportunities?.slice(0, 2).map((opp, index) => (
                  <div key={index} className="text-sm text-green-700 mb-1">
                    • {opp.title || opp}
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Wins */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Quick Wins</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-1">
                    {insights.quickWins?.length || 0}
                  </p>
                </div>
                <div className="bg-yellow-200 p-3 rounded-full">
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedDashboard;