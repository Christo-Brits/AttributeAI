import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, TrendingUp, Search, BarChart3, Download, AlertCircle, CheckCircle, Calendar, Target, Users, Globe } from 'lucide-react';

const GSCAnalyzer = () => {
  const [currentStep, setCurrentStep] = useState('input'); // input, processing, results
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisSettings, setAnalysisSettings] = useState({
    timeframe_focus: '',
    business_goal: ''
  });
  const [gscData, setGscData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      // In real implementation, parse CSV here
      const mockParsedData = {
        totalRows: 15432,
        dateRange: '2023-01-01 to 2024-12-31',
        totalClicks: 245678,
        totalImpressions: 2456789,
        avgCTR: 2.1,
        avgPosition: 12.3
      };
      setGscData(mockParsedData);
    } else {
      alert('Please upload a CSV file from Google Search Console');
    }
  };

  // Mock GSC analysis function
  const performGSCAnalysis = async () => {
    setIsProcessing(true);
    setCurrentStep('processing');
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Mock comprehensive analysis results
    const mockResults = {
      executiveSummary: "Organic traffic shows 23% growth over the analyzed period with 245,678 total clicks. Strong performance in product-related queries, but opportunity exists in low-CTR keywords (47 queries with >1,000 impressions at <1.2% CTR). Mobile traffic dominates at 68% of clicks. Quick wins available in positions 5-15 could drive additional 15-20% traffic growth.",
      
      trafficTrend: {
        summary: "Steady growth with seasonal peaks",
        totalClicks: 245678,
        totalImpressions: 2456789,
        avgCTR: 2.1,
        avgPosition: 12.3,
        growthRate: 23.4,
        outlierDays: 8
      },

      keyFindings: [
        "23% increase in organic clicks year-over-year",
        "Mobile traffic accounts for 68% of total clicks",
        "47 high-impression, low-CTR keywords identified as quick wins",
        "Top 10 pages drive 34% of total traffic",
        "Brand queries show 89% CTR vs 1.8% for non-brand",
        "Position 5-15 pages have untapped potential (+500 impressions each)"
      ],

      interestingInsights: [
        {
          metric: "Query Seasonality",
          insight: "Product queries peak in Q4 (+45% vs baseline)",
          evidence: "Black Friday related terms show 340% spike in November"
        },
        {
          metric: "Content Gap",
          insight: "How-to queries underperforming despite high search volume",
          evidence: "Tutorial keywords avg position 18.5 vs site avg 12.3"
        },
        {
          metric: "Featured Snippets",
          insight: "Lost 12 featured snippets to competitors in Q3",
          evidence: "Comparison and definition queries dropping from position 1"
        },
        {
          metric: "Page Speed Impact",
          insight: "Slower pages correlate with higher bounce in mobile search",
          evidence: "Pages >3s load time show 23% lower CTR"
        }
      ],

      topQueries: [
        { query: "best marketing software", clicks: 3456, impressions: 45678, ctr: 7.6, position: 3.2 },
        { query: "marketing automation tools", clicks: 2890, impressions: 38901, ctr: 7.4, position: 4.1 },
        { query: "email marketing platform", clicks: 2567, impressions: 51234, ctr: 5.0, position: 5.8 },
        { query: "crm software comparison", clicks: 2234, impressions: 67890, ctr: 3.3, position: 8.9 },
        { query: "social media management", clicks: 1987, impressions: 45123, ctr: 4.4, position: 6.7 },
        { query: "content marketing strategy", clicks: 1876, impressions: 38456, ctr: 4.9, position: 7.2 },
        { query: "lead generation tools", clicks: 1654, impressions: 29876, ctr: 5.5, position: 5.9 },
        { query: "marketing analytics dashboard", clicks: 1543, impressions: 41234, ctr: 3.7, position: 9.1 },
        { query: "customer journey mapping", clicks: 1432, impressions: 28765, ctr: 5.0, position: 6.8 },
        { query: "marketing attribution software", clicks: 1321, impressions: 23456, ctr: 5.6, position: 5.4 }
      ],

      lowCTROpportunities: [
        { query: "marketing software pricing", impressions: 12456, ctr: 1.2, position: 8.5, potential: "High" },
        { query: "best email marketing tools 2024", impressions: 9876, ctr: 1.4, position: 9.2, potential: "High" },
        { query: "marketing automation benefits", impressions: 8765, ctr: 0.9, position: 11.3, potential: "Medium" },
        { query: "crm vs marketing automation", impressions: 7654, ctr: 1.1, position: 10.8, potential: "Medium" },
        { query: "social media marketing tools", impressions: 6543, ctr: 1.3, position: 12.1, potential: "Medium" }
      ],

      topPages: [
        { page: "/marketing-automation-guide", clicks: 8765, impressions: 98765, ctr: 8.9, position: 3.1 },
        { page: "/best-crm-software", clicks: 7654, impressions: 87654, ctr: 8.7, position: 3.4 },
        { page: "/email-marketing-templates", clicks: 6543, impressions: 76543, ctr: 8.5, position: 3.8 },
        { page: "/social-media-calendar", clicks: 5432, impressions: 65432, ctr: 8.3, position: 4.2 },
        { page: "/lead-scoring-guide", clicks: 4321, impressions: 54321, ctr: 8.0, position: 4.6 }
      ],

      decliningPages: [
        { page: "/old-marketing-trends", clicksChange: -34.5, reason: "Outdated content" },
        { page: "/deprecated-tools-list", clicksChange: -28.7, reason: "Tools no longer relevant" },
        { page: "/2022-marketing-stats", clicksChange: -45.2, reason: "Seasonal content aging" }
      ],

      quickWinPages: [
        { page: "/marketing-budget-calculator", position: 8.5, impressions: 3456, opportunity: "Optimize title tag" },
        { page: "/roi-calculator", position: 9.2, impressions: 2987, opportunity: "Add schema markup" },
        { page: "/campaign-planner", position: 10.1, impressions: 2456, opportunity: "Improve meta description" },
        { page: "/competitor-analysis-tool", position: 11.3, impressions: 1987, opportunity: "Update content freshness" }
      ],

      devicePerformance: {
        mobile: { clicks: 167161, impressions: 1670838, ctr: 2.3, share: 68 },
        desktop: { clicks: 61517, impressions: 614673, ctr: 2.1, share: 25 },
        tablet: { clicks: 17000, impressions: 171278, ctr: 1.9, share: 7 }
      },

      actionPlan: [
        {
          action: "Optimize title tags for 5 low-CTR, high-impression queries",
          category: "On-page",
          effort: "Low",
          impact: 4,
          owner: "Content",
          timeline: "Week 1-2"
        },
        {
          action: "Create comparison content for 'vs' queries in positions 5-15",
          category: "Content",
          effort: "Medium", 
          impact: 5,
          owner: "Content",
          timeline: "Week 3-6"
        },
        {
          action: "Add FAQ schema to tutorial pages to reclaim featured snippets",
          category: "Tech",
          effort: "Low",
          impact: 4,
          owner: "Dev",
          timeline: "Week 1-3"
        },
        {
          action: "Refresh outdated content causing traffic decline",
          category: "Content",
          effort: "Medium",
          impact: 3,
          owner: "Content", 
          timeline: "Week 4-8"
        },
        {
          action: "Improve mobile page speed for high-traffic pages",
          category: "Tech",
          effort: "High",
          impact: 4,
          owner: "Dev",
          timeline: "Week 6-12"
        },
        {
          action: "Create seasonal content calendar for Q4 product queries",
          category: "Content",
          effort: "Medium",
          impact: 4,
          owner: "Content",
          timeline: "Week 8-12"
        }
      ]
    };
    
    setAnalysisResults(mockResults);
    setIsProcessing(false);
    setCurrentStep('results');
  };

  const handleAnalysisSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert('Please upload a GSC CSV file');
      return;
    }
    performGSCAnalysis();
  };

  const renderInputForm = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <TrendingUp className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">GSC Data Analyzer</h2>
        <p className="text-lg text-gray-600">
          Upload your Google Search Console data for comprehensive SEO insights and action plans
        </p>
      </div>

      <form onSubmit={handleAnalysisSubmit} className="space-y-8">
        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Google Search Console Data
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
              >
                {uploadedFile ? (
                  <div>
                    <FileSpreadsheet className="mx-auto h-12 w-12 text-green-600 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload GSC Performance CSV
                    </p>
                    <p className="text-sm text-gray-600">
                      Export from Search Console → Performance → Download
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {gscData && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Data Preview:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                    <div>Rows: {gscData.totalRows.toLocaleString()}</div>
                    <div>Period: {gscData.dateRange}</div>
                    <div>Clicks: {gscData.totalClicks.toLocaleString()}</div>
                    <div>Impressions: {gscData.totalImpressions.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe Focus (Optional)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={analysisSettings.timeframe_focus}
                  onChange={(e) => setAnalysisSettings({...analysisSettings, timeframe_focus: e.target.value})}
                >
                  <option value="">Analyze full dataset</option>
                  <option value="last_3_months">Last 3 months</option>
                  <option value="last_6_months">Last 6 months</option>
                  <option value="last_12_months">Last 12 months</option>
                  <option value="last_16_months">Last 16 months</option>
                  <option value="last_3_quarters">Last 3 quarters</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Goal (Optional)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={analysisSettings.business_goal}
                  onChange={(e) => setAnalysisSettings({...analysisSettings, business_goal: e.target.value})}
                >
                  <option value="">General SEO optimization</option>
                  <option value="grow_non_brand">Grow non-brand clicks</option>
                  <option value="boost_product_pages">Boost product page traffic</option>
                  <option value="improve_ctr">Improve click-through rates</option>
                  <option value="increase_impressions">Increase impressions</option>
                  <option value="featured_snippets">Win more featured snippets</option>
                  <option value="mobile_optimization">Optimize mobile performance</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Expected Analysis:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Traffic trends and outlier detection</li>
                  <li>• Top performing queries and pages</li>
                  <li>• Low-CTR optimization opportunities</li>
                  <li>• Quick-win page improvements</li>
                  <li>• 90-day prioritized action plan</li>
                  <li>• Downloadable charts and reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!uploadedFile}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          Analyze GSC Data
        </button>
      </form>
    </div>
  );
  const renderProcessing = () => (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
          <span className="text-green-700 font-medium">Processing GSC Data</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Search Performance</h2>
        <p className="text-gray-600">
          Running comprehensive analysis on {gscData?.totalRows.toLocaleString()} data points...
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-green-600 mr-3" />
              <span>Loading and cleaning data</span>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
              <span>Computing traffic trends and outliers</span>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-blue-600 mr-3" />
              <span>Analyzing query performance</span>
            </div>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <span>Identifying page opportunities</span>
            </div>
            <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-gray-400 mr-3" />
              <span>Generating action plan</span>
            </div>
            <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Executive Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
          GSC Analysis Results
        </h2>
        
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Executive Summary</h3>
          <p className="text-gray-700">{analysisResults?.executiveSummary}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {analysisResults?.trafficTrend.totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">Total Clicks</div>
            <div className="text-xs text-green-600">+{analysisResults?.trafficTrend.growthRate}% YoY</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">
              {(analysisResults?.trafficTrend.totalImpressions / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-purple-600">Impressions</div>
            <div className="text-xs text-gray-600">Search visibility</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-700">
              {analysisResults?.trafficTrend.avgCTR}%
            </div>
            <div className="text-sm text-orange-600">Average CTR</div>
            <div className="text-xs text-gray-600">Click-through rate</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {analysisResults?.trafficTrend.avgPosition}
            </div>
            <div className="text-sm text-green-600">Avg Position</div>
            <div className="text-xs text-gray-600">Search ranking</div>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Findings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisResults?.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <span className="text-gray-700">{finding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interesting Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Interesting Insights</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysisResults?.interestingInsights.map((insight, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {insight.metric}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {insight.insight}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {insight.evidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Queries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Queries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Query
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysisResults?.topQueries.slice(0, 10).map((query, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    {query.query}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {query.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {query.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {query.ctr}%
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {query.position}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low CTR Opportunities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Low-CTR Optimization Opportunities</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Query
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Potential
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysisResults?.lowCTROpportunities.map((opportunity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    {opportunity.query}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {opportunity.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-red-600 font-medium">
                    {opportunity.ctr}%
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {opportunity.position}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      opportunity.potential === 'High' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {opportunity.potential}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Quick Win Pages */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Win Pages (Positions 5-20)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysisResults?.quickWinPages.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    {page.page}
                  </td>
                  <td className="px-4 py-4 text-sm text-yellow-600 font-medium">
                    {page.position}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {page.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-green-700">
                    {page.opportunity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Device Performance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-700">
              {analysisResults?.devicePerformance.mobile.share}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Mobile</div>
            <div className="text-xs text-gray-500">
              {analysisResults?.devicePerformance.mobile.clicks.toLocaleString()} clicks
              <br />
              {analysisResults?.devicePerformance.mobile.ctr}% CTR
            </div>
          </div>
          <div className="text-center">
            <Globe className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-700">
              {analysisResults?.devicePerformance.desktop.share}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Desktop</div>
            <div className="text-xs text-gray-500">
              {analysisResults?.devicePerformance.desktop.clicks.toLocaleString()} clicks
              <br />
              {analysisResults?.devicePerformance.desktop.ctr}% CTR
            </div>
          </div>
          <div className="text-center">
            <FileSpreadsheet className="mx-auto h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-700">
              {analysisResults?.devicePerformance.tablet.share}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Tablet</div>
            <div className="text-xs text-gray-500">
              {analysisResults?.devicePerformance.tablet.clicks.toLocaleString()} clicks
              <br />
              {analysisResults?.devicePerformance.tablet.ctr}% CTR
            </div>
          </div>
        </div>
      </div>

      {/* 90-Day Action Plan */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">90-Day Action Plan</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effort
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysisResults?.actionPlan.map((action, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    {action.action}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      action.category === 'On-page' ? 'bg-blue-100 text-blue-800' :
                      action.category === 'Content' ? 'bg-green-100 text-green-800' :
                      action.category === 'Tech' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {action.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      action.effort === 'Low' ? 'bg-green-100 text-green-800' :
                      action.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {action.effort}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center">
                      <div className={`w-8 h-2 rounded ${
                        action.impact >= 4 ? 'bg-green-500' :
                        action.impact >= 3 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="ml-2 text-gray-700">{action.impact}/5</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {action.owner}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {action.timeline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Downloads */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Downloadable Charts & Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors">
            <div className="text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <div className="font-medium text-gray-900">Traffic Trend Chart</div>
              <div className="text-sm text-gray-500">gsc-trend.png</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
            <div className="text-center">
              <BarChart3 className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <div className="font-medium text-gray-900">CTR vs Impressions</div>
              <div className="text-sm text-gray-500">gsc-scatter.png</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors">
            <div className="text-center">
              <Search className="mx-auto h-8 w-8 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900">Top Queries Chart</div>
              <div className="text-sm text-gray-500">gsc-top-queries.png</div>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center">
          <Download className="h-5 w-5 mr-2" />
          Download Full Report
        </button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          Export Action Plan CSV
        </button>
        <button 
          onClick={() => {
            setCurrentStep('input');
            setUploadedFile(null);
            setGscData(null);
            setAnalysisResults(null);
            setAnalysisSettings({
              timeframe_focus: '',
              business_goal: ''
            });
          }}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Analyze New Dataset
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GSC Data Analyzer</h1>
            <p className="text-gray-600">Upload Google Search Console data for comprehensive SEO insights</p>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentStep === 'input' ? 'bg-green-600' : currentStep === 'processing' || currentStep === 'results' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentStep === 'processing' ? 'bg-green-600' : currentStep === 'results' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentStep === 'results' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>

      {currentStep === 'input' && renderInputForm()}
      {currentStep === 'processing' && renderProcessing()}
      {currentStep === 'results' && renderResults()}
    </div>
  );
};

export default GSCAnalyzer;