import React, { useState } from 'react';
import { ChevronRight, Globe, BarChart3, Facebook, Search, Mail, User, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const SignupPage = ({ onSignupComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    
    // Website & Analytics
    websiteUrl: '',
    googleAnalyticsId: '',
    googleSearchConsoleUrl: '',
    metaBusinessId: '',
    facebookPixelId: '',
    
    // Additional Info
    industry: '',
    monthlyTraffic: '',
    primaryGoals: [],
    currentTools: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    website: null,
    analytics: null,
    searchConsole: null,
    meta: null
  });

  const industries = [
    'E-commerce', 'SaaS', 'Healthcare', 'Finance', 'Education', 
    'Real Estate', 'Travel', 'Food & Beverage', 'Technology', 'Other'
  ];

  const trafficRanges = [
    'Less than 1K/month', '1K-10K/month', '10K-50K/month', 
    '50K-100K/month', '100K-500K/month', '500K+/month'
  ];

  const goalOptions = [
    'Increase Organic Traffic', 'Improve Conversion Rate', 'Generate More Leads',
    'Better Attribution', 'Content Marketing', 'Paid Ad Optimization'
  ];

  const toolOptions = [
    'Google Analytics', 'Google Ads', 'Facebook Ads', 'HubSpot',
    'Mailchimp', 'Shopify', 'WordPress', 'Salesforce'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleMultiSelect = (field, option) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!formData.websiteUrl.trim()) newErrors.websiteUrl = 'Website URL is required';
      else if (!/^https?:\/\/.+/.test(formData.websiteUrl)) newErrors.websiteUrl = 'Please enter a valid URL with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verifyConnections = async () => {
    setIsLoading(true);
    const status = { ...connectionStatus };

    try {
      // Verify website accessibility
      if (formData.websiteUrl) {
        try {
          const response = await fetch('/api/verify-website', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: formData.websiteUrl })
          });
          status.website = response.ok ? 'success' : 'warning';
        } catch {
          status.website = 'warning';
        }
      }

      // Verify Google Analytics
      if (formData.googleAnalyticsId) {
        status.analytics = 'success'; // In real app, verify with GA API
      }

      // Verify Search Console
      if (formData.googleSearchConsoleUrl) {
        status.searchConsole = 'success'; // In real app, verify with GSC API
      }

      // Verify Meta Business
      if (formData.metaBusinessId) {
        status.meta = 'success'; // In real app, verify with Meta API
      }

      setConnectionStatus(status);
    } catch (error) {
      console.error('Verification error:', error);
    }

    setIsLoading(false);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        verifyConnections();
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Save user data to backend
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Store user data locally for chatbot access
        localStorage.setItem('attributeai_user', JSON.stringify({
          id: userData.id,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          company: formData.company,
          website: formData.websiteUrl,
          industry: formData.industry,
          goals: formData.primaryGoals,
          tools: formData.currentTools,
          analytics: {
            googleAnalyticsId: formData.googleAnalyticsId,
            searchConsoleUrl: formData.googleSearchConsoleUrl,
            metaBusinessId: formData.metaBusinessId,
            facebookPixelId: formData.facebookPixelId
          },
          monthlyTraffic: formData.monthlyTraffic,
          registeredAt: new Date().toISOString()
        }));

        if (onSignupComplete) {
          onSignupComplete(userData);
        }
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Signup failed. Please try again.' });
    }

    setIsLoading(false);
  };

  const ConnectionStatus = ({ status, label }) => {
    if (status === 'success') return <div className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> {label} Connected</div>;
    if (status === 'warning') return <div className="flex items-center text-yellow-600"><AlertCircle size={16} className="mr-1" /> {label} Issue</div>;
    return <div className="text-gray-500">{label} Not Verified</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to AttributeAI</h1>
          <p className="text-blue-100">Set up your account and connect your analytics for personalized AI insights</p>
          
          {/* Progress Bar */}
          <div className="mt-4 flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                  {step}
                </div>
                {step < 4 && <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-white' : 'bg-blue-500'}`} />}
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-sm text-blue-100">
            Step {currentStep}: {['Basic Information', 'Website & Analytics', 'Verification', 'Complete Setup'][currentStep - 1]}
          </div>
        </div>

        <div className="p-8">
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tell us about yourself</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Smith"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="john@company.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Company Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Minimum 8 characters"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Website & Analytics */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Connect Your Digital Assets</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe size={16} className="inline mr-1" />
                  Website URL *
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${errors.websiteUrl ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="https://yourwebsite.com"
                />
                {errors.websiteUrl && <p className="text-red-500 text-sm mt-1">{errors.websiteUrl}</p>}
                <p className="text-gray-600 text-sm mt-1">We'll analyze your website to provide personalized recommendations</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BarChart3 size={16} className="inline mr-1" />
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={formData.googleAnalyticsId}
                    onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXX-X"
                  />
                  <p className="text-gray-600 text-xs mt-1">Found in Google Analytics → Admin → Tracking Info</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Search size={16} className="inline mr-1" />
                    Search Console Property
                  </label>
                  <input
                    type="url"
                    value={formData.googleSearchConsoleUrl}
                    onChange={(e) => handleInputChange('googleSearchConsoleUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourwebsite.com"
                  />
                  <p className="text-gray-600 text-xs mt-1">Your verified property in Google Search Console</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Facebook size={16} className="inline mr-1" />
                    Meta Business Manager ID
                  </label>
                  <input
                    type="text"
                    value={formData.metaBusinessId}
                    onChange={(e) => handleInputChange('metaBusinessId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123456789012345"
                  />
                  <p className="text-gray-600 text-xs mt-1">Business Manager → Business Settings → Business Info</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                  <input
                    type="text"
                    value={formData.facebookPixelId}
                    onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123456789012345"
                  />
                  <p className="text-gray-600 text-xs mt-1">Events Manager → Data Sources → Pixels</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Why do we need this information?</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Provide personalized marketing recommendations based on your actual data</li>
                  <li>• Identify optimization opportunities across your digital ecosystem</li>
                  <li>• Generate insights tailored to your industry and traffic patterns</li>
                  <li>• Track attribution across all your marketing channels</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Status</h2>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <ConnectionStatus status={connectionStatus.website} label="Website" />
                  {formData.websiteUrl && (
                    <p className="text-sm text-gray-600 mt-1">{formData.websiteUrl}</p>
                  )}
                </div>

                {formData.googleAnalyticsId && (
                  <div className="p-4 border rounded-lg">
                    <ConnectionStatus status={connectionStatus.analytics} label="Google Analytics" />
                    <p className="text-sm text-gray-600 mt-1">{formData.googleAnalyticsId}</p>
                  </div>
                )}

                {formData.googleSearchConsoleUrl && (
                  <div className="p-4 border rounded-lg">
                    <ConnectionStatus status={connectionStatus.searchConsole} label="Search Console" />
                    <p className="text-sm text-gray-600 mt-1">{formData.googleSearchConsoleUrl}</p>
                  </div>
                )}

                {formData.metaBusinessId && (
                  <div className="p-4 border rounded-lg">
                    <ConnectionStatus status={connectionStatus.meta} label="Meta Business" />
                    <p className="text-sm text-gray-600 mt-1">{formData.metaBusinessId}</p>
                  </div>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Great! Your connections are being verified.</h3>
                <p className="text-green-700 text-sm">
                  Don't worry if some connections show warnings - you can always update them later in your settings.
                  The AI chatbot will work with whatever information is available.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tell us more about your business</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Website Traffic</label>
                  <select
                    value={formData.monthlyTraffic}
                    onChange={(e) => handleInputChange('monthlyTraffic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select traffic range</option>
                    {trafficRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Primary Marketing Goals (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {goalOptions.map(goal => (
                    <label key={goal} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.primaryGoals.includes(goal)}
                        onChange={() => handleMultiSelect('primaryGoals', goal)}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tools Currently Using (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {toolOptions.map(tool => (
                    <label key={tool} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.currentTools.includes(tool)}
                        onChange={() => handleMultiSelect('currentTools', tool)}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Processing...' : 'Next Step'}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Setup'}</span>
                <CheckCircle size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;