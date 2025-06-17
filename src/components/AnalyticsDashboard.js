import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, Button } from './ui/DesignSystem';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    funnelData: [
      { stage: 'Visitors', count: 10000, conversionRate: 100 },
      { stage: 'Engaged', count: 3500, conversionRate: 35 },
      { stage: 'Leads', count: 850, conversionRate: 8.5 },
      { stage: 'Qualified', count: 280, conversionRate: 2.8 },
      { stage: 'Customers', count: 95, conversionRate: 0.95 }
    ],
    userSegments: [
      { name: 'New Users', count: 4200, conversionRate: 12 },
      { name: 'Returning Users', count: 5800, conversionRate: 28 },
      { name: 'Power Users', count: 1500, conversionRate: 45 }
    ],
    insights: [
      { type: 'opportunity', title: 'High Drop-off at Lead Stage', description: 'Consider improving lead capture forms' },
      { type: 'success', title: 'Strong Returning User Performance', description: 'Retention strategy is working well' },
      { type: 'warning', title: 'New User Conversion Below Target', description: 'Onboarding experience needs optimization' }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
            Advanced Analytics Dashboard
          </h1>
          <p className="text-gray-400">
            Deep insights into your marketing funnel performance and user behavior
          </p>
        </div>

        {/* Funnel Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Conversion Funnel
            </h2>
            <div className="space-y-4">
              {analyticsData.funnelData.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{stage.stage}</span>
                    <span className="text-blue-400 font-bold">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stage.conversionRate}%` }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm text-gray-400">{stage.conversionRate}% conversion</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              User Segments
            </h2>
            <div className="space-y-4">
              {analyticsData.userSegments.map((segment) => (
                <div key={segment.name} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{segment.name}</span>
                    <span className="text-purple-400 font-bold">{segment.count.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-400">Conversion Rate:</span>
                    <span className={`text-sm font-medium ${
                      segment.conversionRate > 50 ? 'text-green-400' :
                      segment.conversionRate > 25 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {segment.conversionRate}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        segment.conversionRate > 50 ? 'bg-green-500' :
                        segment.conversionRate > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${segment.conversionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Insights & Recommendations */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-yellow-400" />
            AI-Powered Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'opportunity' ? 'bg-blue-900 border-blue-400' :
                insight.type === 'success' ? 'bg-green-900 border-green-400' :
                'bg-yellow-900 border-yellow-400'
              }`}>
                <div className="flex items-start space-x-3">
                  {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-blue-400 mt-1" />}
                  {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400 mt-1" />}
                  {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />}
                  <div>
                    <h3 className="font-medium text-white mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-300">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Items */}
        <div className="mt-8 text-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            onClick={() => console.log('Export analytics report')}
          >
            Export Analytics Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;