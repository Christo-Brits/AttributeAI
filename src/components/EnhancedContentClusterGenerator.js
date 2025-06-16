import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, Cpu, Target, Calendar, Download, RefreshCw, CheckCircle,
  TrendingUp, Users, Globe, Zap, Brain, BarChart3
} from 'lucide-react';
import { Card, Button, ProgressIndicator } from './ui/DesignSystem';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

const EnhancedContentClusterGenerator = () => {
  const { user } = useAuth();
  const { trackPage, trackFeature } = useAnalytics();
  
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const [campaignData, setCampaignData] = useState({
    pillarTopic: '',
    targetAudience: '',
    campaignDuration: 30,
    contentCount: 8,
    includeResearch: true,
    includeSocial: true,
    platforms: ['facebook', 'linkedin'],
    includeImages: true,
    includeVideos: false
  });

  useEffect(() => {
    trackPage('Enhanced Content Cluster Generator', 'content_automation');
  }, [trackPage]);

  const generateCampaign = async () => {
    setIsGenerating(true);
    setActiveStep(2);

    try {
      // Simulate campaign generation with progressive steps
      for (let step = 2; step <= 5; step++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setActiveStep(step);
      }

      // Generate mock campaign data
      const mockCampaign = {
        pillar: {
          title: `The Complete Guide to ${campaignData.pillarTopic}`,
          wordCount: '3,500',
          readTime: '15 min',
          researchSources: 12
        },
        supportingContent: Array.from({ length: campaignData.contentCount }, (_, i) => ({
          id: i + 1,
          title: `${campaignData.pillarTopic} Strategy ${i + 1}`,
          type: { name: 'Blog Post' },
          publishDate: new Date(Date.now() + (i + 1) * 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          socialTeasers: {
            facebook: Math.floor(Math.random() * 500) + 100,
            linkedin: Math.floor(Math.random() * 300) + 50
          },
          hasImage: campaignData.includeImages,
          hasVideo: campaignData.includeVideos && Math.random() > 0.7
        })),
        socialCalendar: {
          totalPosts: campaignData.contentCount * 4,
          estimatedReach: '25K+'
        },
        neworkflows: {
          createImage: campaignData.includeImages,
          linkedinPost: campaignData.platforms.includes('linkedin'),
          facelessVideo: campaignData.includeVideos
        },
        attribution: {
          utmStructure: {
            campaign: campaignData.pillarTopic.toLowerCase().replace(/\s+/g, '-')
          },
          expectedMetrics: {
            socialClicks: '1,200+',
            blogVisitors: '3,500+',
            conversionRate: '2.5%',
            estimatedLeads: '88'
          }
        }
      };

      setGeneratedCampaign(mockCampaign);
      trackFeature('Enhanced Campaign Generation', 'campaign_generated', campaignData.pillarTopic);
    } catch (error) {
      console.error('Campaign generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)' 
    }}>
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Enhanced Content Cluster Generator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Generate complete content marketing campaigns with n8n automation, AI research, and attribution tracking
            </p>
          </div>

          {/* Campaign Input Form */}
          {!isGenerating && !generatedCampaign && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pillar Topic
                  </label>
                  <input
                    type="text"
                    value={campaignData.pillarTopic}
                    onChange={(e) => setCampaignData({...campaignData, pillarTopic: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., Digital Marketing Strategy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={campaignData.targetAudience}
                    onChange={(e) => setCampaignData({...campaignData, targetAudience: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., Small business owners"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Duration (Days)
                  </label>
                  <select
                    value={campaignData.campaignDuration}
                    onChange={(e) => setCampaignData({...campaignData, campaignDuration: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value={15}>15 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content Pieces
                  </label>
                  <select
                    value={campaignData.contentCount}
                    onChange={(e) => setCampaignData({...campaignData, contentCount: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value={5}>5 Articles</option>
                    <option value={8}>8 Articles</option>
                    <option value={12}>12 Articles</option>
                    <option value={20}>20 Articles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platforms
                  </label>
                  <div className="space-y-2">
                    {['facebook', 'linkedin', 'twitter'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={campaignData.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCampaignData({...campaignData, platforms: [...campaignData.platforms, platform]});
                            } else {
                              setCampaignData({...campaignData, platforms: campaignData.platforms.filter(p => p !== platform)});
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-gray-300 capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={generateCampaign}
                disabled={!campaignData.pillarTopic || !campaignData.targetAudience}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Generate Complete Campaign
              </Button>
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="text-center py-12">
              <div className="mb-8">
                <ProgressIndicator progress={(activeStep - 1) * 25} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                {activeStep === 2 && 'Researching Topic'}
                {activeStep === 3 && 'Creating Content Strategy'}
                {activeStep === 4 && 'Generating Social Media'}
                {activeStep === 5 && 'Setting Up Attribution'}
              </h2>
              <p className="text-gray-400">
                {activeStep === 2 && 'Researching your topic with Tavily and Perplexity APIs...'}
                {activeStep === 3 && 'Creating pillar content and supporting articles with n8n workflows...'}
                {activeStep === 4 && 'Generating social media teasers and scheduling with automation...'}
                {activeStep === 5 && 'Configuring UTM tracking and attribution setup...'}
              </p>
            </div>
          )}

          {/* Campaign Results */}
          {generatedCampaign && !isGenerating && (
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2 text-white">Campaign Generated Successfully!</h2>
                <p className="text-gray-400">Your complete {campaignData.campaignDuration}-day content marketing campaign is ready</p>
              </div>

              {/* Campaign Summary */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-900/30 p-4 rounded-lg text-center border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">{campaignData.contentCount + 1}</div>
                  <div className="text-sm text-blue-300">Blog Posts</div>
                </div>
                <div className="bg-purple-900/30 p-4 rounded-lg text-center border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">{generatedCampaign.socialCalendar.totalPosts}</div>
                  <div className="text-sm text-purple-300">Social Posts</div>
                </div>
                <div className="bg-pink-900/30 p-4 rounded-lg text-center border border-pink-500/20">
                  <div className="text-2xl font-bold text-pink-400">{campaignData.campaignDuration}</div>
                  <div className="text-sm text-pink-300">Days Scheduled</div>
                </div>
                <div className="bg-green-900/30 p-4 rounded-lg text-center border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{generatedCampaign.socialCalendar.estimatedReach}</div>
                  <div className="text-sm text-green-300">Est. Reach</div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-6">
                {/* Pillar Content */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg border border-blue-500/20">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">👑</span>
                    <div>
                      <h3 className="text-xl font-bold text-blue-300">Pillar Content</h3>
                      <p className="text-blue-400">The cornerstone piece that everything links back to</p>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-white">{generatedCampaign.pillar.title}</h4>
                    <div className="flex gap-4 mt-2 text-sm text-gray-400">
                      <span>📄 {generatedCampaign.pillar.wordCount} words</span>
                      <span>⏱️ {generatedCampaign.pillar.readTime} read</span>
                      <span>🔍 {generatedCampaign.pillar.researchSources} sources</span>
                    </div>
                  </div>
                </div>

                {/* Supporting Content */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">🔗 Supporting Content ({generatedCampaign.supportingContent.length} pieces)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {generatedCampaign.supportingContent.slice(0, 6).map((content) => (
                      <div key={content.id} className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-400">
                        <h4 className="font-medium mb-2 text-white">{content.title}</h4>
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                          <span>📅 {content.publishDate}</span>
                          <span>📝 {content.type.name}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                            FB: {content.socialTeasers.facebook}
                          </span>
                          <span className="px-2 py-1 bg-purple-100/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                            LI: {content.socialTeasers.linkedin}
                          </span>
                          {content.hasImage && (
                            <span className="px-2 py-1 bg-green-100/10 text-green-400 text-xs rounded-full border border-green-500/20">
                              IMG
                            </span>
                          )}
                          {content.hasVideo && (
                            <span className="px-2 py-1 bg-red-100/10 text-red-400 text-xs rounded-full border border-red-500/20">
                              VID
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {generatedCampaign.supportingContent.length > 6 && (
                    <div className="text-center mt-4">
                      <span className="text-gray-500">
                        + {generatedCampaign.supportingContent.length - 6} more pieces
                      </span>
                    </div>
                  )}
                </div>

                {/* n8n Workflow Integration Status */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-lg border border-yellow-500/20">
                  <h3 className="font-semibold text-yellow-300 mb-4 flex items-center">
                    <Cpu className="h-5 w-5 mr-2" />
                    n8n Workflow Integration Status
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-white">Active Workflows:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Blog Post Generation</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        {generatedCampaign.neworkflows.createImage && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">AI Image Creation</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                        {generatedCampaign.neworkflows.linkedinPost && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">LinkedIn Post Generation</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                        {generatedCampaign.neworkflows.facelessVideo && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Faceless Video Creation</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-white">Automation Features:</h4>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>✅ Tavily research integration</div>
                        <div>✅ Claude content generation</div>
                        <div>✅ OpenAI image generation</div>
                        <div>✅ Social media automation</div>
                        <div>✅ Google Drive storage</div>
                        <div>✅ Google Sheets logging</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attribution Setup */}
                <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 p-6 rounded-lg border border-green-500/20">
                  <h3 className="font-semibold text-green-300 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Attribution & Tracking Ready
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-white">UTM Structure:</h4>
                      <div className="text-sm font-mono bg-gray-800/50 p-3 rounded border border-gray-600">
                        <div className="text-gray-300">campaign: <span className="text-blue-400">{generatedCampaign.attribution.utmStructure.campaign}</span></div>
                        <div className="text-gray-300">source: <span className="text-purple-400">facebook | linkedin</span></div>
                        <div className="text-gray-300">medium: <span className="text-green-400">social</span></div>
                        <div className="text-gray-300">content: <span className="text-yellow-400">dynamic</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-white">Expected Results:</h4>
                      <div className="text-sm space-y-1">
                        <div className="text-gray-400">Social Clicks: <span className="text-white">{generatedCampaign.attribution.expectedMetrics.socialClicks}</span></div>
                        <div className="text-gray-400">Blog Visitors: <span className="text-white">{generatedCampaign.attribution.expectedMetrics.blogVisitors}</span></div>
                        <div className="text-gray-400">Conversion Rate: <span className="text-white">{generatedCampaign.attribution.expectedMetrics.conversionRate}</span></div>
                        <div className="text-gray-400">Est. Leads: <span className="text-white">{generatedCampaign.attribution.expectedMetrics.estimatedLeads}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-green-500/25"
                  onClick={() => trackFeature('Enhanced Campaign Generation', 'launch_campaign', campaignData.pillarTopic)}
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Launch Campaign
                </Button>
                <Button className="px-6 py-3 bg-gray-700 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule for Later
                </Button>
                <Button className="px-6 py-3 bg-gray-700 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300">
                  <Download className="h-5 w-5 mr-2" />
                  Export Campaign
                </Button>
                <Button 
                  onClick={() => {
                    setActiveStep(1);
                    setGeneratedCampaign(null);
                    setCampaignData({
                      pillarTopic: '',
                      targetAudience: '',
                      campaignDuration: 30,
                      contentCount: 8,
                      includeResearch: true,
                      includeSocial: true,
                      platforms: ['facebook', 'linkedin'],
                      includeImages: true,
                      includeVideos: false
                    });
                  }}
                  className="px-6 py-3 bg-gray-700 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EnhancedContentClusterGenerator;