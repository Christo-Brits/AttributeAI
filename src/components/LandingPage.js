import React, { useState } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  Sparkles, 
  Check, 
  ArrowRight,
  Star,
  Globe,
  Shield,
  Clock
} from 'lucide-react';

const LandingPage = ({ onGetStarted, onFreeTrial }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFreeTrial = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1234567890', // Replace with actual Stripe price ID
          plan: 'pro'
        }),
      });
      
      const session = await response.json();
      
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to demo mode
      onGetStarted();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreemium = () => {
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">AttributeAI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleFreemium}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={handleFreeTrial}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Start Free Trial'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300 font-medium">Multi-Model AI Powered Attribution Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Marketing Attribution
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Track every customer touchpoint, predict performance with 94% accuracy, and create content that converts using advanced multi-model AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                onClick={handleFreeTrial}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-2xl hover:shadow-blue-500/25 flex items-center disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Start 14-Day Free Trial'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              
              <button 
                onClick={handleFreemium}
                className="border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
              >
                Try Demo (Free)
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                14-day money-back guarantee
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Setup in under 5 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Win at Marketing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combine the power of Claude, GPT-4, and Gemini AI models with real-time attribution tracking and predictive analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Multi-Model AI Content</h3>
              <p className="text-gray-300 leading-relaxed">
                Generate 2000+ word articles using Claude, GPT-4, and Gemini working together. Research-backed content with citations and SEO optimization.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real Attribution Tracking</h3>
              <p className="text-gray-300 leading-relaxed">
                Track every customer touchpoint with multi-touch attribution models. See exactly which channels drive conversions.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Predictive Analytics</h3>
              <p className="text-gray-300 leading-relaxed">
                AI-powered performance forecasting with 94% accuracy. Know which content will perform before you publish.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Automated Publishing</h3>
              <p className="text-gray-300 leading-relaxed">
                Batch generate and publish content across WordPress, Webflow, and custom platforms with intelligent interlinking.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-pink-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Customer Journey Mapping</h3>
              <p className="text-gray-300 leading-relaxed">
                Visualize complete customer journeys from first touch to conversion. Optimize every step of the funnel.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Scale</h3>
              <p className="text-gray-300 leading-relaxed">
                Built for enterprise with role-based access, team collaboration, and advanced security features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Footer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of marketers who have already revolutionized their attribution and content strategy with AttributeAI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleFreeTrial}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-2xl hover:shadow-blue-500/25 flex items-center disabled:opacity-50"
            >
              {isLoading ? 'Setting up your trial...' : 'Start Your Free Trial Today'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-white">AttributeAI</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            The world's most advanced multi-touch attribution platform, powered by multi-model AI.
          </p>
          <p className="text-gray-400 text-sm">
            © 2025 AttributeAI. All rights reserved. Built with ❤️ for marketers who want to win.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;