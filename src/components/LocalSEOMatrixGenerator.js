import React, { useState, useEffect } from 'react';
import { 
  MapPin, Building2, Search, Zap, Target, Download, Settings, 
  Plus, Trash2, Edit3, Globe, Users, TrendingUp, BarChart3,
  CheckCircle, Clock, ArrowRight, FileText, ExternalLink
} from 'lucide-react';
import { Card, Button, ProgressIndicator } from './ui/DesignSystem';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { localSEOService } from '../services/LocalSEOMatrixService';

const LocalSEOMatrixGenerator = () => {
  const { user } = useAuth();
  const { trackPage, trackFeature } = useAnalytics();
  
  // State Management
  const [services, setServices] = useState([
    { 
      id: 1, 
      name: 'Web Design', 
      description: 'Custom website design and development services',
      keywords: ['web design', 'website development', 'custom websites'],
      pricing: 'Starting at $2,500'
    },
    { 
      id: 2, 
      name: 'SEO Services', 
      description: 'Search engine optimization and digital marketing',
      keywords: ['SEO', 'search optimization', 'digital marketing'],
      pricing: 'Starting at $1,200/month'
    }
  ]);
  
  const [areas, setAreas] = useState([
    { 
      id: 1, 
      name: 'Downtown Chicago', 
      state: 'IL',
      demographics: 'Urban professionals, tech startups, corporate offices',
      population: '2.7M',
      avgIncome: '$65,000',
      keyNeighborhoods: ['Loop', 'River North', 'West Loop']
    },
    { 
      id: 2, 
      name: 'Naperville', 
      state: 'IL',
      demographics: 'Suburban families, established businesses, professionals',
      population: '148,000',
      avgIncome: '$89,000',
      keyNeighborhoods: ['Downtown Naperville', 'Highlands', 'Country Lakes']
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('setup');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPages, setGeneratedPages] = useState([]);
  const [selectedCombinations, setSelectedCombinations] = useState([]);

  useEffect(() => {
    trackPage('Local SEO Matrix Generator', 'local_seo');
    initializeSelectedCombinations();
  }, [trackPage, services, areas]);

  const initializeSelectedCombinations = () => {
    const combinations = [];
    services.forEach(service => {
      areas.forEach(area => {
        combinations.push({
          serviceId: service.id,
          areaId: area.id,
          selected: true,
          priority: 'medium'
        });
      });
    });
    setSelectedCombinations(combinations);
  };

  const addService = () => {
    const newService = {
      id: Date.now(),
      name: '',
      description: '',
      keywords: [],
      pricing: ''
    };
    setServices([...services, newService]);
  };

  const updateService = (id, field, value) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const removeService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const addArea = () => {
    const newArea = {
      id: Date.now(),
      name: '',
      state: '',
      demographics: '',
      population: '',
      avgIncome: '',
      keyNeighborhoods: []
    };
    setAreas([...areas, newArea]);
  };

  const updateArea = (id, field, value) => {
    setAreas(areas.map(area => 
      area.id === id ? { ...area, [field]: value } : area
    ));
  };

  const removeArea = (id) => {
    setAreas(areas.filter(area => area.id !== id));
  };

  const toggleCombination = (serviceId, areaId) => {
    setSelectedCombinations(combinations =>
      combinations.map(combo =>
        combo.serviceId === serviceId && combo.areaId === areaId
          ? { ...combo, selected: !combo.selected }
          : combo
      )
    );
  };

  const getSelectedCount = () => {
    return selectedCombinations.filter(combo => combo.selected).length;
  };

  const generateAllPages = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    trackFeature('Local SEO Matrix', 'bulk_generation_started', `${getSelectedCount()}_pages`);

    try {
      const result = await localSEOService.generateCompleteCampaign(
        services,
        areas,
        selectedCombinations,
        (progress) => {
          const percentage = (progress.current / progress.total) * 100;
          setGenerationProgress(percentage);
        }
      );

      setGeneratedPages(result.results);
      setActiveTab('results');
      trackFeature('Local SEO Matrix', 'bulk_generation_completed', `${result.totalGenerated}_pages`);
      
    } catch (error) {
      console.error('Generation failed:', error);
      trackFeature('Local SEO Matrix', 'bulk_generation_failed', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)' 
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Local SEO Matrix Generator
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Generate unique, research-backed service pages for every combination of your services and local areas. 
            Scale your local SEO with AI-powered content that Google loves.
          </p>
        </div>

        {/* Value Proposition Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-500/20">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">{services.length} × {areas.length}</div>
              <div className="text-blue-300">= {services.length * areas.length} Unique Pages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">$0</div>
              <div className="text-green-300">vs $500+ per page manually</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">30 min</div>
              <div className="text-purple-300">vs 50+ hours manual work</div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'setup', name: 'Setup Services & Areas', icon: Settings },
              { id: 'matrix', name: 'Page Matrix', icon: BarChart3 },
              { id: 'generate', name: 'Generate Pages', icon: Zap },
              { id: 'results', name: 'Generated Pages', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Services Management */}
            <Card className="p-6 bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-400" />
                  Your Services
                </h3>
                <Button onClick={addService} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(service.id, 'name', e.target.value)}
                          placeholder="Service name (e.g., Web Design)"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) => updateService(service.id, 'description', e.target.value)}
                          placeholder="Service description"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={service.pricing}
                          onChange={(e) => updateService(service.id, 'pricing', e.target.value)}
                          placeholder="Pricing (e.g., Starting at $2,500)"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeService(service.id)}
                        className="ml-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Areas Management */}
            <Card className="p-6 bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-400" />
                  Service Areas
                </h3>
                <Button onClick={addArea} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Area
                </Button>
              </div>
              
              <div className="space-y-4">
                {areas.map((area) => (
                  <div key={area.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={area.name}
                            onChange={(e) => updateArea(area.id, 'name', e.target.value)}
                            placeholder="Area name (e.g., Downtown Chicago)"
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={area.state}
                            onChange={(e) => updateArea(area.id, 'state', e.target.value)}
                            placeholder="State (e.g., IL)"
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                          />
                        </div>
                        <textarea
                          value={area.demographics}
                          onChange={(e) => updateArea(area.id, 'demographics', e.target.value)}
                          placeholder="Target demographics (e.g., Urban professionals, tech startups)"
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={area.population}
                            onChange={(e) => updateArea(area.id, 'population', e.target.value)}
                            placeholder="Population (e.g., 2.7M)"
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={area.avgIncome}
                            onChange={(e) => updateArea(area.id, 'avgIncome', e.target.value)}
                            placeholder="Avg Income (e.g., $65,000)"
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeArea(area.id)}
                        className="ml-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Matrix Tab */}
        {activeTab === 'matrix' && (
          <Card className="p-6 bg-gray-800/50 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
              Page Generation Matrix
            </h3>
            
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-blue-300">
                    {getSelectedCount()} pages selected for generation
                  </div>
                  <div className="text-blue-400 text-sm">
                    Estimated manual cost: ${getSelectedCount() * 500} | Time saved: {getSelectedCount() * 3} hours
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedCombinations(combinations => combinations.map(c => ({...c, selected: true})))}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedCombinations(combinations => combinations.map(c => ({...c, selected: false})))}
                  >
                    Select None
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Services ↓ / Areas →</th>
                    {areas.map(area => (
                      <th key={area.id} className="text-center py-3 px-4 text-gray-300 font-medium min-w-[150px]">
                        <div>{area.name}</div>
                        <div className="text-xs text-gray-400">{area.state}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id} className="border-b border-gray-700">
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{service.name}</div>
                        <div className="text-sm text-gray-400">{service.description}</div>
                      </td>
                      {areas.map(area => {
                        const combination = selectedCombinations.find(
                          c => c.serviceId === service.id && c.areaId === area.id
                        );
                        return (
                          <td key={area.id} className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleCombination(service.id, area.id)}
                              className={`w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                                combination?.selected
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              }`}
                            >
                              {combination?.selected ? (
                                <div className="flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Generate
                                </div>
                              ) : (
                                'Skip'
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <Card className="p-8 bg-gray-800/50 border border-gray-700 text-center">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-400" />
              Generate Your Local SEO Pages
            </h3>
            
            {!isGenerating ? (
              <div>
                <div className="mb-8 space-y-4">
                  <div className="text-6xl">🚀</div>
                  <div className="text-lg text-gray-300">
                    Ready to generate {getSelectedCount()} unique, research-backed service pages
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-400">{getSelectedCount()}</div>
                      <div className="text-blue-300 text-sm">Pages to Generate</div>
                    </div>
                    <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">~25 min</div>
                      <div className="text-green-300 text-sm">Estimated Time</div>
                    </div>
                    <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">800-1200</div>
                      <div className="text-purple-300 text-sm">Words per Page</div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-900/50 rounded-lg text-left">
                    <h4 className="font-semibold text-white mb-4">Generation Process:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Search className="h-5 w-5 mr-3 text-blue-400" />
                        <span className="text-gray-300">Local research using Perplexity AI for each area</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-5 w-5 mr-3 text-green-400" />
                        <span className="text-gray-300">Demographics and market analysis</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-purple-400" />
                        <span className="text-gray-300">Multi-AI content generation (Claude + GPT-4)</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-3 text-yellow-400" />
                        <span className="text-gray-300">Local SEO optimization and schema markup</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={generateAllPages}
                  disabled={getSelectedCount() === 0}
                  className="px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-green-500/25"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Generate {getSelectedCount()} Pages Now
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-6xl">⚡</div>
                <h4 className="text-xl font-semibold text-white">
                  Generating Your Local SEO Pages...
                </h4>
                <div className="max-w-md mx-auto">
                  <ProgressIndicator progress={generationProgress} />
                  <div className="text-sm text-gray-400 mt-2">
                    {Math.round(generationProgress)}% complete
                  </div>
                </div>
                <div className="text-gray-300">
                  This process includes local research, content generation, and SEO optimization.
                  Each page is unique and tailored to the specific area and service combination.
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {generatedPages.length > 0 ? (
              <>
                <Card className="p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Successfully Generated {generatedPages.filter(p => p.status === 'completed').length} Pages!
                    </h3>
                    <p className="text-gray-300">
                      Your unique, research-backed local SEO pages are ready for deployment
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {generatedPages.filter(p => p.status === 'completed').length}
                      </div>
                      <div className="text-green-300 text-sm">Pages Generated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {generatedPages.reduce((total, page) => total + (page.content?.wordCount || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-blue-300 text-sm">Total Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        ${(generatedPages.filter(p => p.status === 'completed').length * 500).toLocaleString()}
                      </div>
                      <div className="text-purple-300 text-sm">Value Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {generatedPages.length > 0 ? Math.round(generatedPages.reduce((total, page) => total + (page.content?.seoScore || 0), 0) / generatedPages.length) : 0}
                      </div>
                      <div className="text-yellow-300 text-sm">Avg SEO Score</div>
                    </div>
                  </div>
                </Card>

                <div className="text-center">
                  <Button className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Pages
                  </Button>
                </div>
              </>
            ) : (
              <Card className="p-8 bg-gray-800/50 border border-gray-700 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Pages Generated Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Set up your services and areas, then generate your local SEO pages
                </p>
                <Button 
                  onClick={() => setActiveTab('setup')}
                  className="flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Setup
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalSEOMatrixGenerator;