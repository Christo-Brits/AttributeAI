// Phase 2 - Claude AI Integration Demo
import React, { useState } from 'react';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { useClaudeAnalysis } from '../utils/useClaudeAnalysis';
import AIInsights from './ui/AIInsights';

const ClaudeAIDemo = () => {
  const { analyzeWithClaude, loading, error, isReady } = useClaudeAnalysis();
  const [selectedDemo, setSelectedDemo] = useState('seo');
  const [aiResults, setAiResults] = useState(null);

  const demoData = {
    seo: {
      title: "SEO Analysis Demo",
      icon: Target,
      data: {
        targetSite: "example.com",
        keywords: ["digital marketing", "SEO tools", "analytics"],
        competitors: [
          { domain: "competitor1.com", rank: 1, strength: 95 },
          { domain: "competitor2.com", rank: 2, strength: 89 }
        ],
        technicalIssues: [
          { issue: "Page speed optimization needed", priority: "high" },
          { issue: "Missing meta descriptions", priority: "medium" }
        ]
      }
    },
    content: {
      title: "Content Strategy Demo", 
      icon: TrendingUp,
      data: {
        currentContent: ["blog posts", "case studies", "whitepapers"],
        targetAudience: "B2B marketers",
        keywords: ["content marketing", "lead generation", "conversion optimization"],
        competitors: ["hubspot.com", "marketo.com"]
      }
    },
    attribution: {
      title: "Attribution Analysis Demo",
      icon: Brain,
      data: {
        channels: [
          { name: "Organic Search", attribution: 35, trend: "up" },
          { name: "Paid Social", attribution: 25, trend: "stable" },
          { name: "Email", attribution: 20, trend: "down" },
          { name: "Direct", attribution: 20, trend: "up" }
        ],
        conversions: 1250,
        revenue: 125000
      }
    }
  };

  const runDemo = async () => {
    const demo = demoData[selectedDemo];
    const analysisType = selectedDemo === 'seo' ? 'seo_analysis' : 
                        selectedDemo === 'content' ? 'content_strategy' : 
                        'attribution_analysis';

    try {
      const result = await analyzeWithClaude(analysisType, demo.data, {
        demoMode: true,
        timestamp: new Date().toISOString()
      });
      
      setAiResults(result);
    } catch (err) {
      console.error('Demo failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AttributeAI Phase 2: Claude AI Integration
        </h1>
        <p className="text-gray-600">
          Test the new AI-powered analysis capabilities
        </p>
      </div>

      {/* AI Status */}
      <div className={`p-4 rounded-lg border ${isReady ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center space-x-3">
          <Brain className={`h-5 w-5 ${isReady ? 'text-green-600' : 'text-red-600'}`} />
          <span className={`font-medium ${isReady ? 'text-green-900' : 'text-red-900'}`}>
            Claude AI Status: {isReady ? 'Ready' : 'Not Available'}
          </span>
        </div>
        {!isReady && (
          <p className="text-sm text-red-700 mt-2">
            Please check your REACT_APP_ANTHROPIC_API_KEY in the .env file
          </p>
        )}
      </div>
      {/* Demo Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Demo Analysis</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {Object.entries(demoData).map(([key, demo]) => {
            const Icon = demo.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedDemo(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedDemo === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-900">{demo.title}</p>
              </button>
            );
          })}
        </div>

        {/* Run Demo Button */}
        <button
          onClick={runDemo}
          disabled={!isReady || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Claude is analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Run AI Analysis Demo</span>
            </>
          )}
        </button>
      </div>

      {/* Demo Data Preview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-3">Sample Data for {demoData[selectedDemo].title}</h4>
        <pre className="text-sm text-gray-700 bg-white p-4 rounded border overflow-x-auto">
          {JSON.stringify(demoData[selectedDemo].data, null, 2)}
        </pre>
      </div>

      {/* AI Results */}
      {(aiResults || loading || error) && (
        <AIInsights
          analysis={aiResults}
          loading={loading}
          error={error}
          title={`Claude AI Analysis: ${demoData[selectedDemo].title}`}
        />
      )}
    </div>
  );
};

export default ClaudeAIDemo;