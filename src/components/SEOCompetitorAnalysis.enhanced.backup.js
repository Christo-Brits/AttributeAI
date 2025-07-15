// SEO Competitor Analysis Enhanced Component
import React, { useState } from 'react';
import { Search, Target, TrendingUp, AlertCircle, Brain, CheckCircle, ArrowRight } from 'lucide-react';

const AIInsights = ({ analysis, loading, error, title, className = "" }) => {
  if (loading) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          <h3 className="text-lg font-semibold text-white">Generating AI Insights...</h3>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-700/50 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-700/50 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-red-300 mb-2">{title}</h3>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Brain className="h-5 w-5 text-purple-400 mr-2" />
        {title}
      </h3>
      
      <div className="space-y-4">
        {/* Strategic Insights */}
        {analysis.strategicInsights && (
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
            <h4 className="font-semibold text-blue-300 mb-2">Strategic Insights</h4>
            <p className="text-blue-200 text-sm">{analysis.strategicInsights}</p>
          </div>
        )}

        {/* Key Opportunities */}
        {analysis.opportunities && analysis.opportunities.length > 0 && (
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30">
            <h4 className="font-semibold text-green-300 mb-2">Key Opportunities</h4>
            <ul className="space-y-1">
              {analysis.opportunities.map((opportunity, index) => (
                <li key={index} className="text-green-200 text-sm flex items-start">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2 mt-1 flex-shrink-0" />
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Priority Actions */}
        {analysis.priorityActions && analysis.priorityActions.length > 0 && (
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700/30">
            <h4 className="font-semibold text-purple-300 mb-2">Priority Actions</h4>
            <ul className="space-y-2">
              {analysis.priorityActions.map((action, index) => (
                <li key={index} className="text-purple-200 text-sm flex items-start">
                  <ArrowRight className="h-3 w-3 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const SEOAnalysisContext = React.createContext();

const SEOCompetitorAnalysis = () => {
  const [url, setUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const runAnalysis = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setAnalysisStage('Analyzing website structure...');
    
    try {
      // Simulate analysis stages
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisStage('Gathering competitor data...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisStage('Calculating SEO metrics...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock analysis results
      const results = {
        seoScore: 78,
        performance: 85,
        accessibility: 92,
        competitors: [
          { domain: 'competitor1.com', rank: 1, strength: 95 },
          { domain: 'competitor2.com', rank: 2, strength: 88 },
          { domain: 'competitor3.com', rank: 3, strength: 82 }
        ],
        technicalIssues: [
          { issue: 'Missing meta descriptions on 15 pages', priority: 'high' },
          { issue: 'Images missing alt text', priority: 'medium' },
          { issue: 'Slow loading speed on mobile', priority: 'high' }
        ]
      };
      
      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
      setAnalysisStage('');
    }
  };

  const runAIAnalysis = async () => {
    if (!analysisResults) {
      setAiError('Please run the basic analysis first');
      return;
    }
    
    setAiLoading(true);
    setAiError(null);
    
    try {
      const response = await fetch('/api/claude-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze this SEO data and provide strategic insights: ${JSON.stringify(analysisResults)}`,
          context: 'SEO Analysis Enhancement'
        })
      });
      
      if (!response.ok) throw new Error('Failed to get AI insights');
      
      const data = await response.json();
      setAiInsights({
        strategicInsights: data.response || 'AI analysis completed',
        opportunities: [
          'Optimize meta descriptions for better click-through rates',
          'Improve mobile page speed performance',
          'Create content targeting competitor keywords'
        ],
        priorityActions: [
          'Fix high-priority technical issues first',
          'Conduct keyword gap analysis against top competitors',
          'Implement structured data markup'
        ]
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAiError('Failed to generate AI insights. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <SEOAnalysisContext.Provider value={{ analysisResults, runAnalysis, runAIAnalysis }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              AI-Enhanced SEO Analysis
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get comprehensive competitor insights and AI-powered optimization recommendations
            </p>
          </div>

          {/* Analysis Input */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL to analyze..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={runAnalysis}
                disabled={isLoading || !url}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 min-w-[180px] justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{analysisStage}</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Analyze Website</span>
                  </>
                )}
              </button>
            </div>
            
            {/* AI Analysis Button */}
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <button
                onClick={runAIAnalysis}
                disabled={aiLoading || !analysisResults}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating AI Insights...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    <span>Get AI Insights</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Insights Section */}
          {(aiInsights || aiLoading || aiError) && (
            <AIInsights
              analysis={aiInsights}
              loading={aiLoading}
              error={aiError}
              title="Claude AI SEO Insights"
              className="mb-6"
            />
          )}

          {/* Analysis Results */}
          {analysisResults && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
              
              {/* SEO Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <div className="text-sm text-gray-400 mb-1">SEO Score</div>
                  <div className="text-2xl font-bold text-blue-400">{analysisResults.seoScore}/100</div>
                  <div className="text-xs text-gray-500 mt-1">Overall optimization</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <div className="text-sm text-gray-400 mb-1">Performance</div>
                  <div className="text-2xl font-bold text-green-400">{analysisResults.performance}/100</div>
                  <div className="text-xs text-gray-500 mt-1">Page speed score</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <div className="text-sm text-gray-400 mb-1">Accessibility</div>
                  <div className="text-2xl font-bold text-purple-400">{analysisResults.accessibility}/100</div>
                  <div className="text-xs text-gray-500 mt-1">Compliance score</div>
                </div>
              </div>

              {/* Competitors and Issues Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Competitors */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 text-blue-400 mr-2" />
                    Top Competitors
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.competitors.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                        <div>
                          <p className="font-medium text-white">{competitor.domain}</p>
                          <p className="text-sm text-gray-400">Rank #{competitor.rank}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-400">{competitor.strength}/100</div>
                          <div className="text-xs text-gray-500">Strength Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Issues */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    Technical Issues
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.technicalIssues.map((issue, index) => (
                      <div key={index} className="p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-red-200">{issue.issue}</p>
                          <span className={issue.priority === 'high' ? 'text-xs px-2 py-1 rounded bg-red-800/50 text-red-300' : 'text-xs px-2 py-1 rounded bg-yellow-800/50 text-yellow-300'}>
                            {issue.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SEOAnalysisContext.Provider>
  );
};

export default SEOCompetitorAnalysis;