import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  BarChart3, 
  FileText, 
  Zap, 
  Download,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Play,
  Target,
  Link,
  Calendar
} from 'lucide-react';

const BatchContentDashboard = ({ researchData, userProfile, onComplete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const [activeJobs, setActiveJobs] = useState([]);
  const [batchSettings, setBatchSettings] = useState({
    contentTypes: ['blog-post'],
    quantity: 5,
    quality: 'high',
    generateImages: true,
    applyEditorialReview: true
  });

  const startContentCluster = async () => {
    setIsStarting(true);
    setIsGenerating(true);
    setCurrentStep('Initializing batch generation...');
    
    try {
      // Simulate batch generation process
      const steps = [
        'Analyzing research data...',
        'Creating content outlines...',
        'Generating article content...',
        'Optimizing for SEO...',
        'Applying editorial review...',
        'Finalizing content...'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setGenerationProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Mock generated content
      const mockContent = Array.from({ length: batchSettings.quantity }, (_, index) => ({
        id: `content-${index + 1}`,
        title: `Generated Article ${index + 1}`,
        type: batchSettings.contentTypes[0],
        status: 'completed',
        wordCount: 1200 + (index * 100),
        createdAt: new Date(),
        quality: batchSettings.quality
      }));
      
      setGeneratedContent(mockContent);
      setCurrentStep('Batch generation completed!');
      
      if (onComplete) {
        onComplete(mockContent);
      }
      
    } catch (error) {
      console.error('Batch generation failed:', error);
      setCurrentStep('Generation failed');
    } finally {
      setIsGenerating(false);
      setIsStarting(false);
    }
  };

  const renderClusterConfig = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Types
          </label>
          <select 
            value={batchSettings.contentTypes[0]}
            onChange={(e) => setBatchSettings(prev => ({ ...prev, contentTypes: [e.target.value] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="blog-post">Blog Posts</option>
            <option value="article">Articles</option>
            <option value="guide">Guides</option>
            <option value="tutorial">Tutorials</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity: {batchSettings.quantity}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={batchSettings.quantity}
            onChange={(e) => setBatchSettings(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality Level
          </label>
          <select 
            value={batchSettings.quality}
            onChange={(e) => setBatchSettings(prev => ({ ...prev, quality: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="high">High Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="standard">Standard Quality</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderActiveJobs = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Generation</h3>
      {isGenerating ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{currentStep}</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(generationProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No active generation jobs</p>
      )}
    </div>
  );

  const renderCompletedJobs = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Content</h3>
      {generatedContent.length > 0 ? (
        <div className="space-y-3">
          {generatedContent.map((content) => (
            <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{content.title}</h4>
                <p className="text-sm text-gray-600">
                  {content.wordCount} words • {content.type} • {content.quality} quality
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No completed content yet</p>
      )}
    </div>
  );

  const renderJobDetailsModal = () => null; // Placeholder for future modal

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Batch Content Generation</h1>
            <p className="text-gray-600">Generate multiple high-quality content pieces simultaneously</p>
          </div>
          {researchData ? (
            <div className="text-right">
              <p className="text-sm text-gray-500">Research Topic</p>
              <p className="font-medium">{researchData.topic}</p>
              <p className="text-sm text-gray-500">
                {researchData.clusterRecommendations ? 'Enhanced with research' : 'Basic research available'}
              </p>
            </div>
          ) : (
            <div className="text-right text-gray-500">
              <p className="text-sm">No research data available</p>
              <p className="text-xs">Complete advanced research first</p>
            </div>
          )}
        </div>
      </div>

      {/* Research Enhancement Notice */}
      {!researchData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-2 mt-0.5" size={16} />
            <div>
              <p className="text-yellow-800 text-sm font-medium">
                Research Data Required
              </p>
              <p className="text-yellow-700 text-xs mt-1">
                Complete advanced research first to generate high-quality content clusters with market insights and competitive analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Start Generation Button */}
      <div className="text-center">
        <button
          onClick={startContentCluster}
          disabled={isStarting || !researchData || activeJobs.length > 0}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            isStarting || !researchData || activeJobs.length > 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isStarting ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Starting Generation...
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start Batch Generation
            </>
          )}
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderClusterConfig()}
        {renderActiveJobs()}
      </div>

      {/* Completed Jobs */}
      {renderCompletedJobs()}

      {/* Job Details Modal */}
      {renderJobDetailsModal()}

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Batch Generation Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Time Efficient</h4>
            <p className="text-sm text-gray-600">Generate multiple pieces simultaneously</p>
          </div>
          <div className="text-center">
            <Link className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Consistent Quality</h4>
            <p className="text-sm text-gray-600">Maintain standards across all content</p>
          </div>
          <div className="text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Strategic Planning</h4>
            <p className="text-sm text-gray-600">Coordinated content calendar</p>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Research Integration:</strong> Leverage advanced research for informed content</li>
            <li>• <strong>Quality Control:</strong> Automated editorial review and optimization</li>
            <li>• <strong>SEO Optimization:</strong> Each piece optimized for search engines</li>
            <li>• <strong>Content Efficiency:</strong> Batch generation saves time and ensures consistency</li>
            <li>• <strong>Strategic Publishing:</strong> Optimal timeline maximizes impact</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BatchContentDashboard;