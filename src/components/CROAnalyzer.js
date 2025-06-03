import React, { useState, useRef } from 'react';
import { Upload, Globe, Eye, Search, Target, FileText, Download, Camera, ExternalLink, AlertTriangle, CheckCircle, TrendingUp, Zap } from 'lucide-react';

const CROAnalyzer = () => {
  const [currentStep, setCurrentStep] = useState('input'); // input, analyzing, results
  const [formData, setFormData] = useState({
    page_url: '',
    niche_info: '',
    industry: '',
    audience: '',
    conversion_goal: ''
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock CRO analysis function
  const performCROAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep('analyzing');
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Mock analysis results
    const mockResults = {
      summary: "Homepage shows strong product messaging but suffers from CTA confusion and trust signal gaps. Hero area clarity is good, but conversion path has 3 major friction points that could improve conversion rates by 25-40%.",
      
      visualScanFindings: {
        heroArea: {
          headline: "Clear value proposition present",
          subCopy: "Supporting text too verbose - 47 words vs. recommended 15-20",
          cta: "Primary CTA lacks contrast (AA rating: 3.2:1 vs. required 4.5:1)",
          trustBadges: "No visible security badges or testimonials above fold"
        },
        layout: {
          clutterScore: 7.2,
          ctaVisibility: "Medium",
          mobileOptimization: "Good"
        }
      },

      technicalFindings: {
        titleTag: "Current: 'Best Marketing Software | Company Name' (52 chars)",
        metaDescription: "Missing conversion-focused meta description",
        headingStructure: "H1 present, but H2 hierarchy unclear",
        accessibility: {
          altTextMissing: 3,
          contrastIssues: 2,
          focusIndicators: "Adequate"
        }
      },

      competitorInsights: [
        {
          competitor: "ConvertFlow",
          heroHeadline: "Turn More Visitors Into Customers",
          ctaText: "Start Free Trial",
          uniqueElements: "Social proof counter, video testimonial"
        },
        {
          competitor: "Unbounce", 
          heroHeadline: "Build Landing Pages That Convert",
          ctaText: "Get Started Free",
          uniqueElements: "Trust badges, A/B test results"
        }
      ],

      keyIssues: [
        {
          area: "Hero Section",
          issue: "CTA button low contrast",
          evidence: "Color contrast ratio 3.2:1 (fails WCAG AA)",
          impact: 4
        },
        {
          area: "Trust Signals",
          issue: "No social proof above fold",
          evidence: "Screenshot shows no testimonials, reviews, or badges",
          impact: 4
        },
        {
          area: "Copy Length",
          issue: "Verbose sub-headline",
          evidence: "47 words in supporting text vs. optimal 15-20 words",
          impact: 3
        },
        {
          area: "Navigation",
          issue: "Too many menu options",
          evidence: "8 primary nav items vs. recommended 5-7",
          impact: 2
        },
        {
          area: "Technical",
          issue: "Missing meta description",
          evidence: "HTML source shows no meta description tag",
          impact: 2
        }
      ],

      actionPlan: [
        {
          change: "Increase CTA button contrast to #0066CC",
          category: "Visual Design",
          effort: "Low",
          impact: 4,
          timeline: "Week 1"
        },
        {
          change: "Add customer testimonial carousel above fold",
          category: "Trust Signals",
          effort: "Medium", 
          impact: 4,
          timeline: "Week 2"
        },
        {
          change: "Reduce sub-headline from 47 to 18 words",
          category: "Copy",
          effort: "Low",
          impact: 3,
          timeline: "Week 1"
        },
        {
          change: "Add security badges near CTA",
          category: "Trust Signals", 
          effort: "Low",
          impact: 3,
          timeline: "Week 1"
        },
        {
          change: "Simplify navigation to 6 items max",
          category: "UX Design",
          effort: "Medium",
          impact: 2,
          timeline: "Week 3"
        },
        {
          change: "Write conversion-focused meta description",
          category: "Technical SEO",
          effort: "Low", 
          impact: 2,
          timeline: "Week 1"
        }
      ],

      titleSuggestions: [
        {
          current: "Best Marketing Software | Company Name",
          proposed: "Increase Sales 40% with Smart Marketing Automation | Company Name",
          reason: "Benefit-focused with specific outcome"
        }
      ],

      ctaSuggestions: [
        "Start My Free 14-Day Trial →",
        "Get My Custom Demo →", 
        "See Results in 24 Hours →",
        "Claim My Free Account →"
      ],

      beforeAfter: {
        before: "Hero with low-contrast blue CTA, no social proof, 47-word sub-headline",
        after: "High-contrast CTA, testimonial carousel, concise 18-word value prop, security badges"
      }
    };
    
    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
    setCurrentStep('results');
  };

  const handleAnalysisSubmit = (e) => {
    e.preventDefault();
    if (!uploadedImage || !formData.page_url) {
      alert('Please upload a screenshot and provide the page URL');
      return;
    }
    performCROAnalysis();
  };

  const renderInputForm = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Eye className="mx-auto h-12 w-12 text-purple-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">CRO Page Analyzer</h2>
        <p className="text-lg text-gray-600">
          Upload a screenshot and get expert conversion optimization recommendations
        </p>
      </div>

      <form onSubmit={handleAnalysisSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Page Screenshot
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
              >
                {imagePreview ? (
                  <div>
                    <img 
                      src={imagePreview} 
                      alt="Page screenshot" 
                      className="max-w-full h-auto rounded-lg mb-4"
                      style={{ maxHeight: '300px' }}
                    />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload page screenshot
                    </p>
                    <p className="text-sm text-gray-600">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live Page URL *
                </label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://yourwebsite.com/page"
                  value={formData.page_url}
                  onChange={(e) => setFormData({...formData, page_url: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll fetch HTML source for technical analysis
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Conversion Goal
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={formData.conversion_goal}
                  onChange={(e) => setFormData({...formData, conversion_goal: e.target.value})}
                >
                  <option value="">Select goal...</option>
                  <option value="signups">Free Trial/Signup</option>
                  <option value="purchases">Product Purchase</option>
                  <option value="leads">Lead Generation</option>
                  <option value="demo">Demo Request</option>
                  <option value="contact">Contact Form</option>
                  <option value="download">Download/Subscribe</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Business Context Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Business Context (Optional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry/Niche
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., SaaS, E-commerce"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., Small business owners"
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Special considerations..."
                value={formData.niche_info}
                onChange={(e) => setFormData({...formData, niche_info: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!uploadedImage || !formData.page_url}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          <Eye className="h-5 w-5 mr-2" />
          Analyze Page for CRO Opportunities
        </button>
      </form>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          <span className="text-purple-700 font-medium">Analyzing Your Page</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CRO Analysis in Progress</h2>
        <p className="text-gray-600">
          Performing visual scan, technical audit, and competitive research...
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-green-600 mr-3" />
              <span>Visual screenshot analysis</span>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-green-600 mr-3" />
              <span>Live page HTML inspection</span>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-blue-600 mr-3" />
              <span>Competitive benchmarking</span>
            </div>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <span>Generating recommendations</span>
            </div>
            <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CROAnalyzer;