import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Zap, AlertCircle, CheckCircle } from 'lucide-react';

const SEODashboardWidget = () => {
  const [seoMetrics, setSeoMetrics] = useState(null);
  const [lastAnalysis, setLastAnalysis] = useState(null);

  useEffect(() => {
    // Load existing SEO analysis data
    const loadSEOData = () => {
      const storedMetrics = localStorage.getItem('seoAnalysisMetrics');
      if (storedMetrics) {
        const metrics = JSON.parse(storedMetrics);
        setSeoMetrics(metrics);
        setLastAnalysis(new Date(metrics.timestamp));
      }
    };

    // Listen for new SEO analysis completion
    const handleSEOComplete = (event) => {
      setSeoMetrics(event.detail);
      setLastAnalysis(new Date());
    };

    loadSEOData();
    window.addEventListener('seoAnalysisComplete', handleSEOComplete);

    return () => {
      window.removeEventListener('seoAnalysisComplete', handleSEOComplete);
    };
  }, []);

  if (!seoMetrics) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Brain className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">SEO Intelligence</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Target className="h-12 w-12 mx-auto mb-3" />
          </div>
          <p className="text-gray-500 text-sm">Run SEO analysis to see competitive insights</p>
        </div>
      </div>
    );
  }

  const getTimeSinceAnalysis = () => {
    if (!lastAnalysis) return '';
    const now = new Date();
    const diffHours = Math.floor((now - lastAnalysis) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">SEO Intelligence</h3>
        </div>
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>{getTimeSinceAnalysis()}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">{seoMetrics.competitorCount}</div>
          <div className="text-xs text-gray-600">Competitors</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">{seoMetrics.gapsIdentified}</div>
          <div className="text-xs text-gray-600">Gaps Found</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">
            {seoMetrics.quickWinsCount + seoMetrics.strategicPlaysCount}
          </div>
          <div className="text-xs text-gray-600">Actions</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">{seoMetrics.totalImpactScore}</div>
          <div className="text-xs text-gray-600">Impact Score</div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Target Site:</span>
          <span className="font-medium text-gray-900">{seoMetrics.targetSite}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Quick Wins Available:</span>
          <span className="font-medium text-green-600">{seoMetrics.quickWinsCount} actions</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Competitive Advantages Found:</span>
          <span className="font-medium text-blue-600">{seoMetrics.competitiveAdvantages} opportunities</span>
        </div>
      </div>

      {/* Action Indicator */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
            <span>Ready for implementation</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            <span>View Details</span>
            <TrendingUp className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEODashboardWidget;