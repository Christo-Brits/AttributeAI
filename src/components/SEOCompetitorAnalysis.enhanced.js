// Phase 2 Enhanced - SEO Analysis with Claude AI Integration
import React, { useState, useContext, createContext } from 'react';
import { Search, Globe, TrendingUp, Target, Clock, CheckCircle, AlertCircle, ArrowRight, ExternalLink, Brain, Zap } from 'lucide-react';
import { useClaudeAnalysis } from '../utils/useClaudeAnalysis';
import AIInsights from './ui/AIInsights';

// Create a context for sharing SEO data with other components
export const SEOAnalysisContext = createContext();

const SEOCompetitorAnalysis = () => {
  const [targetSite, setTargetSite] = useState('');
  const [coreKeywords, setCoreKeywords] = useState('');
  const [locale, setLocale] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisStage, setAnalysisStage] = useState('');

  // Phase 2: Claude AI Integration
  const { analyzeWithClaude, loading: aiLoading, error: aiError, lastAnalysis } = useClaudeAnalysis();
  const [aiInsights, setAiInsights] = useState(null);

  // Enhanced analysis function with Claude AI
  const runAnalysis = async () => {
    if (!targetSite) {
      alert('Please enter a target website URL');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStage('Initializing SEO analysis...');

    try {
      // Stage 1: Basic SEO analysis (existing logic)
      setAnalysisStage('Analyzing site structure...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysisStage('Checking technical SEO...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysisStage('Analyzing competitors...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis results
      const mockResults = {
        targetSite,
        coreKeywords,
        locale,
        competitors: [
          { domain: 'competitor1.com', rank: 1, strength: 95 },
          { domain: 'competitor2.com', rank: 2, strength: 89 },
          { domain: 'competitor3.com', rank: 3, strength: 84 }
        ],
        technicalIssues: [
          { issue: 'Page speed optimization needed', priority: 'high' },
          { issue: 'Missing meta descriptions', priority: 'medium' }
        ],
        keywordGaps: [
          { keyword: 'target keyword 1', difficulty: 7, volume: 12000 },
          { keyword: 'target keyword 2', difficulty: 5, volume: 8500 }
        ]
      };

      setAnalysisResults(mockResults);

      // Stage 2: Claude AI Enhancement
      setAnalysisStage('🧠 Generating AI insights...');
      
      const aiAnalysis = await analyzeWithClaude('seo_analysis', {
        targetSite,
        keywords: coreKeywords,
        locale,
        competitors: mockResults.competitors,
        technicalIssues: mockResults.technicalIssues,
        keywordGaps: mockResults.keywordGaps
      });

      if (aiAnalysis) {
        setAiInsights(aiAnalysis);
        setAnalysisStage('✅ Analysis complete with AI insights');
      } else {
        setAnalysisStage('✅ Analysis complete (AI insights unavailable)');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisStage('❌ Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <SEOAnalysisContext.Provider value={{ 
      analysisResults, 
      aiInsights, 
      targetSite, 
      coreKeywords 
    }}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Search className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">SEO Competitor Analysis</h1>
                <p className="text-blue-100 mt-2">Enhanced with Claude AI Intelligence</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Input Form */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Website URL
                </label>
                <input
                  type="url"
                  value={targetSite}
                  onChange={(e) => setTargetSite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Core Keywords
                </label>
                <input
                  type="text"
                  value={coreKeywords}
                  onChange={(e) => setCoreKeywords(e.target.value)}
                  placeholder="digital marketing, SEO tools"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locale/Region
                </label>
                <input
                  type="text"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  placeholder="US, UK, Global"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Analysis Button */}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing || !targetSite}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{analysisStage}</span>
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  <span>Run AI-Enhanced SEO Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
        {/* Phase 2: AI Insights Section */}
        {(aiInsights || aiLoading || aiError) && (
          <AIInsights
            analysis={aiInsights}
            loading={aiLoading}
            error={aiError}
            title="Claude AI SEO Insights"
            className="mb-6"
          />
        )}

        {/* Existing Analysis Results */}
        {analysisResults && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Competitors */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 text-blue-600 mr-2" />
                Top Competitors
              </h3>
              <div className="space-y-3">
                {analysisResults.competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{competitor.domain}</p>
                      <p className="text-sm text-gray-600">Rank #{competitor.rank}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{competitor.strength}/100</div>
                      <div className="text-xs text-gray-500">Strength Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Issues */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                Technical Issues
              </h3>
              <div className="space-y-3">
                {analysisResults.technicalIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-red-900">{issue.issue}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        issue.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SEOAnalysisContext.Provider>
  );
};

export default SEOCompetitorAnalysis;