import React, { useState } from 'react';
import { Search, Globe, TrendingUp, Target, Clock, CheckCircle, AlertCircle, ArrowRight, ExternalLink, Brain, Zap, Plus, X, BarChart3, Lightbulb, Users, Award } from 'lucide-react';

const SEOCompetitorAnalysis = () => {
  const [targetSite, setTargetSite] = useState('');
  const [keywords, setKeywords] = useState('');
  const [region, setRegion] = useState('US');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [currentAnalyzing, setCurrentAnalyzing] = useState('');

  const handleAutoDiscovery = async () => {
    if (!targetSite || !keywords) {
      setError('Please enter both website URL and keywords');
      return;
    }

    setAnalysisResults(null);
    setError(null);
    setIsAnalyzing(true);
    
    try {
      setCurrentAnalyzing('🔍 Discovering top competitors for your keywords...');
      
      const response = await fetch('http://localhost:3001/api/discover-competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: targetSite,
          keywords: keywords,
          region: region 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Competitor discovery failed');
      }

      console.log('🎯 Competitor discovery successful:', data);
      
      // Now analyze the target website
      setCurrentAnalyzing('📊 Analyzing your website...');
      let targetUrl = targetSite;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }

      const targetResponse = await fetch('http://localhost:3001/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl })
      });

      let targetAnalysis = null;
      if (targetResponse.ok) {
        const targetData = await targetResponse.json();
        targetAnalysis = targetData.data;
      }

      setCurrentAnalyzing('🧠 Generating competitive insights and gap analysis...');

      // Calculate scores and generate comprehensive analysis
      const targetScore = targetAnalysis ? calculateSEOScore(targetAnalysis) : 0;
      const competitorScores = data.data.competitors
        .filter(comp => comp.analysis)
        .map(comp => ({
          ...comp,
          score: calculateSEOScore(comp.analysis)
        }));

      const avgCompetitorScore = competitorScores.length > 0 
        ? competitorScores.reduce((sum, comp) => sum + comp.score, 0) / competitorScores.length 
        : 0;

      const topCompetitor = competitorScores.length > 0 
        ? competitorScores.reduce((top, comp) => comp.score > top.score ? comp : top, competitorScores[0])
        : null;

      setAnalysisResults({
        target: {
          url: targetUrl,
          analysis: targetAnalysis,
          score: targetScore
        },
        competitors: data.data.competitors,
        competitorScores: competitorScores,
        contentGaps: data.data.contentGaps,
        keywordOpportunities: data.data.keywordOpportunities,
        keywords: data.data.keywords,
        region: data.data.region,
        avgCompetitorScore: avgCompetitorScore,
        topCompetitor: topCompetitor,
        discoveryMode: true
      });
      
    } catch (error) {
      console.error('Analysis Error:', error);
      setError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
      setCurrentAnalyzing('');
    }
  };

  const calculateSEOScore = (analysis) => {
    let score = 0;

    // Title optimization (25 points)
    if (analysis.title) {
      if (analysis.title.length >= 30 && analysis.title.length <= 60) score += 25;
      else if (analysis.title.length > 0) score += 15;
    }

    // Meta description (25 points)
    if (analysis.metaDescription) {
      if (analysis.metaDescription.length >= 120 && analysis.metaDescription.length <= 160) score += 25;
      else if (analysis.metaDescription.length > 0) score += 15;
    }

    // Headings structure (20 points)
    if (analysis.headings) {
      if (analysis.headings.h1 === 1) score += 10;
      if (analysis.headings.h2 > 0) score += 5;
      if (analysis.headings.h3 > 0) score += 5;
    }

    // Images with alt text (15 points)
    if (analysis.images && analysis.images.total > 0) {
      const altRatio = analysis.images.withAlt / analysis.images.total;
      score += Math.round(altRatio * 15);
    }

    // Content quality (15 points)
    if (analysis.textContent && analysis.textContent.length > 300) score += 15;

    return Math.min(100, score);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getImpactColor = (impact) => {
    if (impact === 'high') return 'text-red-600 bg-red-50';
    if (impact === 'medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 AI-Powered Competitor Discovery
        </h1>
        <p className="text-lg text-gray-600">
          Enter your website and keywords - we'll find your top competitors and identify content gaps automatically
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Target Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline w-4 h-4 mr-1" />
              Your Website URL
            </label>
            <input
              type="text"
              value={targetSite}
              onChange={(e) => setTargetSite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline w-4 h-4 mr-1" />
              Target Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="seo tools, digital marketing, analytics"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <small className="text-gray-500 mt-1">Separate multiple keywords with commas</small>
          </div>
        </div>

        {/* Region Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline w-4 h-4 mr-1" />
            Target Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="NZ">New Zealand</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="GLOBAL">Global</option>
          </select>
        </div>

        <button
          onClick={handleAutoDiscovery}
          disabled={isAnalyzing || !targetSite || !keywords}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              {currentAnalyzing || 'Discovering competitors...'}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Brain className="w-5 h-5 mr-2" />
              🚀 Discover Competitors & Identify Gaps
            </span>
          )}
        </button>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-900">Auto-Discovery</h3>
              <p className="text-sm text-blue-700">Finds top 5 competitors automatically</p>
            </div>
          </div>
          <div className="flex items-center">
            <Lightbulb className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-semibold text-purple-900">Gap Analysis</h3>
              <p className="text-sm text-purple-700">Identifies content & keyword opportunities</p>
            </div>
          </div>
          <div className="flex items-center">
            <Award className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-green-900">Actionable Insights</h3>
              <p className="text-sm text-green-700">Prioritized recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {analysisResults && (
        <div className="space-y-6">
          {/* Competitive Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">🏆 Competitive Landscape</h2>
              <div className="text-sm text-gray-500">
                Keywords: {analysisResults.keywords.join(', ')} | Region: {analysisResults.region}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Your Score */}
              <div className={`p-4 rounded-lg border-2 ${analysisResults.target.analysis ? getScoreBackground(analysisResults.target.score) : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Your Website</div>
                  <div className={`text-2xl font-bold ${analysisResults.target.analysis ? getScoreColor(analysisResults.target.score) : 'text-gray-400'}`}>
                    {analysisResults.target.analysis ? analysisResults.target.score : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">SEO Score</div>
                </div>
              </div>

              {/* Competitor Average */}
              <div className={`p-4 rounded-lg border-2 ${getScoreBackground(analysisResults.avgCompetitorScore)}`}>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Competitor Avg</div>
                  <div className={`text-2xl font-bold ${getScoreColor(analysisResults.avgCompetitorScore)}`}>
                    {Math.round(analysisResults.avgCompetitorScore)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">SEO Score</div>
                </div>
              </div>

              {/* Top Competitor */}
              {analysisResults.topCompetitor && (
                <div className={`p-4 rounded-lg border-2 ${getScoreBackground(analysisResults.topCompetitor.score)}`}>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">Top Competitor</div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResults.topCompetitor.score)}`}>
                      {analysisResults.topCompetitor.score}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">{analysisResults.topCompetitor.domain}</div>
                  </div>
                </div>
              )}

              {/* Discovery Stats */}
              <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Discovered</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResults.competitors.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Competitors</div>
                </div>
              </div>
            </div>

            {/* Discovered Competitors */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 Discovered Competitors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysisResults.competitors.map((competitor, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 truncate">
                        {competitor.domain}
                      </div>
                      <div className="text-sm text-gray-500">
                        {competitor.relevance}% match
                      </div>
                    </div>
                    {competitor.analysis && (
                      <div className="text-sm text-gray-600">
                        SEO Score: <span className={`font-bold ${getScoreColor(calculateSEOScore(competitor.analysis))}`}>
                          {calculateSEOScore(competitor.analysis)}
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Keywords: {competitor.matchingKeywords?.join(', ') || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Gaps */}
          {analysisResults.contentGaps && analysisResults.contentGaps.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Content Gaps & Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResults.contentGaps.map((gap, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{gap.opportunity}</h4>
                      <div className="flex gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(gap.impact)}`}>
                          {gap.impact} impact
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{gap.description}</p>
                    <div className="mt-2 text-xs text-gray-500 capitalize">
                      Category: {gap.type.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Opportunities */}
          {analysisResults.keywordOpportunities && analysisResults.keywordOpportunities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Keyword Opportunities
              </h3>
              <div className="space-y-4">
                {analysisResults.keywordOpportunities.map((opportunity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {opportunity.type.replace(/_/g, ' ')} Keywords
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{opportunity.reason}</p>
                      </div>
                      <div className="flex gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          opportunity.difficulty === 'low' ? 'bg-green-50 text-green-600' :
                          opportunity.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {opportunity.difficulty} difficulty
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          opportunity.potential === 'high' ? 'bg-purple-50 text-purple-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {opportunity.potential} potential
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {opportunity.variants.map((variant, vIndex) => (
                        <div key={vIndex} className="bg-gray-50 rounded px-3 py-2 text-sm text-gray-700">
                          "{variant}"
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SEOCompetitorAnalysis;