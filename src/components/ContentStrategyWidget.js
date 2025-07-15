import React, { useState, useEffect } from 'react';
import { PenTool, FileText, Link, Target, TrendingUp, CheckCircle, Hash } from 'lucide-react';

const ContentStrategyWidget = () => {
  const [contentMetrics, setContentMetrics] = useState(null);
  const [lastGeneration, setLastGeneration] = useState(null);

  useEffect(() => {
    // Load existing content strategy data
    const loadContentData = () => {
      const storedMetrics = localStorage.getItem('seoContentMetrics');
      if (storedMetrics) {
        const metrics = JSON.parse(storedMetrics);
        setContentMetrics(metrics);
        setLastGeneration(new Date(metrics.timestamp));
      }
    };

    // Listen for new content generation completion
    const handleContentComplete = (event) => {
      setContentMetrics(event.detail);
      setLastGeneration(new Date());
    };

    loadContentData();
    window.addEventListener('seoContentComplete', handleContentComplete);

    return () => {
      window.removeEventListener('seoContentComplete', handleContentComplete);
    };
  }, []);

  if (!contentMetrics) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <PenTool className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Content Strategy</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <FileText className="h-12 w-12 mx-auto mb-3" />
          </div>
          <p className="text-gray-500 text-sm">Generate SEO content to see performance insights</p>
        </div>
      </div>
    );
  }

  const getTimeSinceGeneration = () => {
    if (!lastGeneration) return '';
    const now = new Date();
    const diffHours = Math.floor((now - lastGeneration) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <PenTool className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Content Strategy</h3>
        </div>
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>{getTimeSinceGeneration()}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">{contentMetrics.wordCount}</div>
          <div className="text-xs text-gray-600">Words</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">{contentMetrics.keywordCount}</div>
          <div className="text-xs text-gray-600">Keywords</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">{contentMetrics.internalLinks}</div>
          <div className="text-xs text-gray-600">Internal Links</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">{contentMetrics.seoScore}</div>
          <div className="text-xs text-gray-600">SEO Score</div>
        </div>
      </div>

      {/* Content Insights */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Target Site:</span>
          <span className="font-medium text-gray-900">{contentMetrics.targetSite}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Content Structure:</span>
          <span className="font-medium text-blue-600">{contentMetrics.h2Count} H2s, {contentMetrics.h3Count} H3s</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Link Strategy:</span>
          <span className="font-medium text-green-600">{contentMetrics.internalLinks + contentMetrics.externalLinks} total links</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Readability Score:</span>
          <span className="font-medium text-purple-600">{contentMetrics.readabilityScore}/10</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            <span>Ready for publication</span>
          </div>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
            <span>View Content</span>
            <FileText className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentStrategyWidget;