// Phase 2 - AI Insights Component
import React from 'react';
import { Brain, TrendingUp, AlertCircle, Clock, Zap } from 'lucide-react';

const AIInsights = ({ 
  analysis, 
  loading = false, 
  error = null, 
  title = "AI Insights",
  className = "" 
}) => {
  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="mt-4 animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-2/3"></div>
          <p className="text-sm text-blue-600 mt-2">Claude is analyzing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Analysis Error</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mt-2">No AI analysis available yet.</p>
      </div>
    );
  }
  // Main analysis display
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {analysis.confidence && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {analysis.confidence}% confidence
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date(analysis.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Summary */}
      {analysis.summary && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-blue-100">
          <h4 className="font-medium text-gray-900 mb-2">Executive Summary</h4>
          <p className="text-gray-700">{analysis.summary}</p>
        </div>
      )}

      {/* Quick Wins */}
      {analysis.quickWins && analysis.quickWins.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Zap className="h-4 w-4 text-yellow-500 mr-2" />
            Quick Wins
          </h4>
          <div className="space-y-2">
            {analysis.quickWins.slice(0, 3).map((win, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="font-medium text-sm">{win.action}</p>
                <p className="text-xs text-gray-600 mt-1">{win.expectedImpact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {analysis.opportunities && analysis.opportunities.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
            Top Opportunities
          </h4>
          <div className="space-y-2">
            {analysis.opportunities.slice(0, 3).map((opp, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm">{opp.title}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Impact: {opp.impact}/10
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{opp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Technical Issues */}
      {analysis.technicalIssues && analysis.technicalIssues.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            Technical Issues
          </h4>
          <div className="space-y-2">
            {analysis.technicalIssues.slice(0, 3).map((issue, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-red-100">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm">{issue.issue}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                    issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{issue.solution}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;