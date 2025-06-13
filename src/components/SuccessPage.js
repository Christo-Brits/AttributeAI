import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Shield, 
  Zap,
  Gift,
  Calendar,
  CreditCard
} from 'lucide-react';

const SuccessPage = ({ onGetStarted, onGoToAccount }) => {
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // In a real app, you'd verify the session with Stripe
      // For demo purposes, we'll simulate session data
      setTimeout(() => {
        setSessionData({
          sessionId: sessionId,
          plan: 'Pro',
          amount: '$97.00',
          trialDays: 14,
          nextBilling: '2025-06-27',
          features: [
            'Unlimited content generation',
            'Multi-model AI (Claude + GPT-4 + Gemini)',
            'Advanced attribution tracking',
            'Predictive analytics',
            'Priority support',
            'Team collaboration (up to 5 users)'
          ]
        });
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to AttributeAI Pro! 🎉
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your subscription is confirmed! You now have access to our complete suite of AI-powered marketing tools.
          </p>

          {sessionData && (
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-500/30 mb-8">
              <Gift className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-300 font-medium">
                14-day free trial started • Next billing: {sessionData.nextBilling}
              </span>
            </div>
          )}
        </div>

        {/* What's Included */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What's Included in Your Pro Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessionData?.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Get Started in 3 Easy Steps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Complete Setup</h3>
              <p className="text-gray-300 text-sm">
                Connect your website and configure your marketing goals in the dashboard.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Generate Content</h3>
              <p className="text-gray-300 text-sm">
                Use our AI tools to create high-converting content and optimize your campaigns.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Track & Optimize</h3>
              <p className="text-gray-300 text-sm">
                Monitor your attribution data and optimize based on AI-powered insights.
              </p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30 backdrop-blur-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 text-blue-400 mr-2" />
            Trial Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">14-day free trial period</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">First billing: {sessionData?.nextBilling}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Cancel anytime, no questions asked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Full access to all Pro features</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Using AttributeAI
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button
            onClick={onGoToAccount}
            className="border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
          >
            Manage Account
          </button>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm mb-2">
            Need help getting started? Our team is here to help!
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="mailto:support@attributeai.app" className="text-blue-400 hover:text-blue-300 transition-colors">
              Email Support
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Live Chat
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;