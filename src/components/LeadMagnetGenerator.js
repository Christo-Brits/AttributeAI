import React, { useState } from 'react';
import { Search, Globe, Palette, Download, ExternalLink, Lightbulb, Code, Target, Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button, Card, ProgressIndicator } from './ui/DesignSystem';

const LeadMagnetGenerator = () => {
  const [currentStep, setCurrentStep] = useState('input'); // input, research, ideas, building, complete
  const [formData, setFormData] = useState({
    target_site_url: '',
    business_info: '',
    niche: '',
    products_services: '',
    target_audience: '',
    contact_url: '',
    color_palette: '',
    brand_fonts: ''
  });
  const [researchResults, setResearchResults] = useState(null);
  const [leadMagnetIdeas, setLeadMagnetIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [generatedTool, setGeneratedTool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock research function (replace with real web search)
  const conductNicheResearch = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock research results
    const mockResearch = {
      niche: 'Digital Marketing Agency',
      painPoints: [
        'ROI measurement difficulty',
        'Lead quality assessment',
        'Campaign attribution confusion',
        'Budget allocation uncertainty',
        'Competitive analysis gaps'
      ],
      commonTools: [
        'ROI Calculators',
        'Budget Planners',
        'Audit Checklists',
        'Quote Generators',
        'Performance Graders'
      ],
      audience: 'Small to medium business owners seeking marketing efficiency'
    };
    
    setResearchResults(mockResearch);
    setIsLoading(false);
    return mockResearch;
  };

  // Generate lead magnet ideas based on research
  const generateIdeas = async (research) => {
    setIsLoading(true);
    
    // Simulate ideation process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const ideas = [
      {
        id: 1,
        name: 'Marketing ROI Calculator',
        benefit: 'Calculate exact return on marketing spend across all channels',
        inputs: 'Ad spend, conversion rate, average order value, time period',
        outputs: 'ROI percentage, profit/loss, recommendations for optimization',
        ctaCopy: 'Get Your Custom Marketing Strategy',
        value: 9,
        simplicity: 8
      },
      {
        id: 2,
        name: 'Lead Quality Scoring Tool',
        benefit: 'Score and rank leads based on conversion probability',
        inputs: 'Lead source, engagement metrics, demographic data, behavior',
        outputs: 'Quality score (1-100), priority ranking, next action suggestions',
        ctaCopy: 'Boost Your Lead Conversion Rate',
        value: 8,
        simplicity: 7
      },
      {
        id: 3,
        name: 'Campaign Budget Optimizer',
        benefit: 'Optimize marketing budget allocation across channels',
        inputs: 'Total budget, channel performance, business goals, seasonality',
        outputs: 'Recommended budget split, expected results, timeline',
        ctaCopy: 'Maximize Your Marketing Budget',
        value: 9,
        simplicity: 6
      },
      {
        id: 4,
        name: 'Website Conversion Audit',
        benefit: 'Identify conversion blockers and optimization opportunities',
        inputs: 'Website URL, current conversion rate, traffic sources',
        outputs: 'Audit score, priority fixes, potential lift estimation',
        ctaCopy: 'Double Your Website Conversions',
        value: 8,
        simplicity: 9
      },
      {
        id: 5,
        name: 'Marketing Attribution Model',
        benefit: 'Understand which touchpoints drive conversions',
        inputs: 'Customer journey data, touchpoint types, conversion events',
        outputs: 'Attribution model, channel impact scores, optimization plan',
        ctaCopy: 'Uncover Your Best Marketing Channels',
        value: 9,
        simplicity: 5
      }
    ];
    
    setLeadMagnetIdeas(ideas);
    setIsLoading(false);
    setCurrentStep('ideas');
  };

  // Generate the actual tool code
  const buildLeadMagnet = async (idea) => {
    setIsLoading(true);
    setCurrentStep('building');
    
    // Simulate build process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated tool (replace with actual HTML generation)
    const mockTool = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${idea.name}</title>
    <!-- Complete functional tool would be generated here -->
</head>
<body>
    <!-- Tool implementation -->
    <div class="container">
        <h1>${idea.name}</h1>
        <p>${idea.benefit}</p>
        <!-- Form inputs, calculations, results display -->
        <!-- CTA section -->
    </div>
</body>
</html>`,
      fileSize: '42 KB',
      features: [
        'Responsive design',
        'WCAG-AA accessibility',
        'Real-time calculations',
        'Form validation',
        'Export functionality',
        'CTA integration'
      ]
    };
    
    setGeneratedTool(mockTool);
    setIsLoading(false);
    setCurrentStep('complete');
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    setCurrentStep('research');
    const research = await conductNicheResearch();
    await generateIdeas(research);
  };

  const handleIdeaSelection = (idea) => {
    setSelectedIdea(idea);
    buildLeadMagnet(idea);
  };

  const renderInputForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Target className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lead Magnet Generator</h2>
        <p className="text-lg text-gray-600">
          Create high-converting web app lead magnets tailored to your niche
        </p>
      </div>

      <form onSubmit={handleInputSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Business Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Website URL (Optional)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourwebsite.com"
                value={formData.target_site_url}
                onChange={(e) => setFormData({...formData, target_site_url: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Niche *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Digital Marketing"
                  value={formData.niche}
                  onChange={(e) => setFormData({...formData, niche: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Small business owners"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products/Services
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Describe what you offer..."
                value={formData.products_services}
                onChange={(e) => setFormData({...formData, products_services: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact URL
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="/contact or mailto:you@company.com"
                value={formData.contact_url}
                onChange={(e) => setFormData({...formData, contact_url: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Brand Styling (Optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Palette
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., #3B82F6, #1E40AF"
                value={formData.color_palette}
                onChange={(e) => setFormData({...formData, color_palette: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Fonts
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Inter, Roboto"
                value={formData.brand_fonts}
                onChange={(e) => setFormData({...formData, brand_fonts: e.target.value})}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          icon={Target}
        >
          Generate Lead Magnet Ideas
        </Button>
      </form>
    </div>
  );

  const renderResearch = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-blue-600 mr-2" />
          <Loader className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Researching Your Niche</h2>
        <p className="text-gray-600">Analyzing market opportunities and pain points...</p>
      </div>

      {researchResults && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Research Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Common Pain Points</h4>
              <ul className="space-y-1">
                {researchResults.painPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Popular Tool Types</h4>
              <ul className="space-y-1">
                {researchResults.commonTools.map((tool, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderIdeas = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Lightbulb className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lead Magnet Ideas</h2>
        <p className="text-lg text-gray-600">
          Choose a lead magnet to build for your audience
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tool Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benefit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inputs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outputs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CTA Copy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leadMagnetIdeas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{idea.name}</div>
                  <div className="text-sm text-gray-500">
                    Value: {idea.value}/10 | Simplicity: {idea.simplicity}/10
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {idea.benefit}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {idea.inputs}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {idea.outputs}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  "{idea.ctaCopy}"
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleIdeaSelection(idea)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Build This Tool
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBuilding = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-center mb-4">
        <Code className="h-8 w-8 text-blue-600 mr-2" />
        <Loader className="h-6 w-6 text-blue-600 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Building Your Lead Magnet</h2>
      <p className="text-gray-600 mb-8">
        Creating a fully-functional web application: <strong>{selectedIdea?.name}</strong>
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Generating HTML structure</span>
          </div>
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Adding responsive CSS styling</span>
          </div>
          <div className="flex items-center text-blue-600">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            <span>Implementing JavaScript functionality</span>
          </div>
          <div className="flex items-center text-gray-400">
            <div className="h-5 w-5 mr-2 border-2 border-gray-300 rounded-full"></div>
            <span>Adding accessibility features</span>
          </div>
          <div className="flex items-center text-gray-400">
            <div className="h-5 w-5 mr-2 border-2 border-gray-300 rounded-full"></div>
            <span>Integrating CTA section</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lead Magnet Complete!</h2>
        <p className="text-lg text-gray-600">
          Your <strong>{selectedIdea?.name}</strong> is ready to deploy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Tool Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">File Size:</span>
              <span className="font-medium">{generatedTool?.fileSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Format:</span>
              <span className="font-medium">Single HTML File</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Compatibility:</span>
              <span className="font-medium">All Modern Browsers</span>
            </div>
          </div>

          <h4 className="font-medium mt-6 mb-3">Included Features:</h4>
          <ul className="space-y-2">
            {generatedTool?.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Download & Deploy</h3>
          
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
              <Download className="h-5 w-5 mr-2" />
              Download lead-magnet-tool.html
            </button>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Deployment Options:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Upload directly to your website
                </div>
                <div className="flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Embed with iframe: <code className="bg-gray-100 px-1 rounded">&lt;iframe src="tool.html"&gt;</code>
                </div>
                <div className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Host on subdomain: tools.yoursite.com
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• A/B test different CTAs</li>
                <li>• Add schema markup for SEO</li>
                <li>• Track conversion events</li>
                <li>• Promote on social media</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setCurrentStep('input');
            setFormData({
              target_site_url: '',
              business_info: '',
              niche: '',
              products_services: '',
              target_audience: '',
              contact_url: '',
              color_palette: '',
              brand_fonts: ''
            });
            setResearchResults(null);
            setLeadMagnetIdeas([]);
            setSelectedIdea(null);
            setGeneratedTool(null);
          }}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Create Another Lead Magnet
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Magnet Generator</h1>
            <p className="text-gray-600">Create high-converting web app lead magnets for your business</p>
          </div>
          
          {/* Progress indicator using new design system */}
          <ProgressIndicator 
            steps={['Input', 'Research', 'Ideas', 'Building', 'Complete']}
            currentStep={['input', 'research', 'ideas', 'building', 'complete'].indexOf(currentStep)}
          />
        </div>
      </div>

      {currentStep === 'input' && renderInputForm()}
      {currentStep === 'research' && renderResearch()}
      {currentStep === 'ideas' && renderIdeas()}
      {currentStep === 'building' && renderBuilding()}
      {currentStep === 'complete' && renderComplete()}
    </div>
  );
};

export default LeadMagnetGenerator;