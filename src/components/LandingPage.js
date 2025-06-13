import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  const [selectedPlan, setSelectedPlan] = useState('growth-monthly');
  const [isAnnual, setIsAnnual] = useState(false);

  // 💳 REAL STRIPE PRICE IDs:
  const pricingPlans = {
    'starter-monthly': 'price_1RZSDxFQSzigm7ZhwhKIhvYa',
    'starter-annual': 'price_1RZUYrFQSzigm7Zh85fcpAjO', 
    'growth-monthly': 'price_1RZSJIFQSzigm7ZhMBm0esKc',
    'growth-annual': 'price_1RZUZeFQSzigm7ZhULegNiEF',
    'scale-monthly': 'price_1RZSNiFQSzigm7ZhjVtqnhMo',
    'scale-annual': 'price_1RZUayFQSzigm7ZhA6CBroqF'
  };

  // Pricing data with monthly/annual options
  const pricing = {
    starter: {
      name: 'Starter',
      monthly: { price: 29, yearlyPrice: 29 * 12 },
      annual: { price: Math.round(29 * 12 * 0.84), yearlyPrice: 29 * 12, monthlyEquivalent: Math.round(29 * 0.84) },
      features: [
        'Up to 10 content pieces per month',
        'Basic attribution tracking',
        'AI content generation',
        'Email support'
      ]
    },
    growth: {
      name: 'Growth',
      monthly: { price: 97, yearlyPrice: 97 * 12 },
      annual: { price: Math.round(97 * 12 * 0.84), yearlyPrice: 97 * 12, monthlyEquivalent: Math.round(97 * 0.84) },
      popular: true,
      features: [
        'Unlimited content generation',
        'Advanced multi-touch attribution',
        'Multi-model AI (Claude + GPT-4 + Gemini)',
        'Predictive analytics',
        'Priority support',
        'Team collaboration (up to 5 users)'
      ]
    },
    scale: {
      name: 'Scale',
      monthly: { price: 297, yearlyPrice: 297 * 12 },
      annual: { price: Math.round(297 * 12 * 0.84), yearlyPrice: 297 * 12, monthlyEquivalent: Math.round(297 * 0.84) },
      features: [
        'Everything in Growth',
        'Unlimited team members',
        'Custom AI model training',
        'White-label options',
        'Dedicated account manager',
        'SLA guarantee'
      ]
    }
  };

  const handleFreeTrial = async (planKey = selectedPlan) => {
    console.log('🚀 Starting checkout for plan:', planKey);
    setIsLoading(true);
    try {
      const priceId = pricingPlans[planKey];
      console.log('💳 Price ID:', priceId);
      
      if (!priceId) {
        console.error('❌ No price ID found for plan:', planKey);
        alert('Invalid plan selected!');
        setIsLoading(false);
        return;
      }

      console.log('🌐 Making request to:', '/api/create-checkout-session');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          plan: planKey
        }),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const session = await response.json();
      console.log('✅ Session response:', session);
      
      if (session.url) {
        console.log('🔄 Redirecting to:', session.url);
        window.location.href = session.url;
      } else {
        console.error('❌ No URL in response:', session);
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('💥 Checkout error:', error);
      alert('Error creating checkout session: ' + error.message);
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
    <>
      <Helmet>
        <title>AttributeAI - AI-Powered Multi-Touch Marketing Attribution Platform | 14-Day Free Trial</title>
        <meta name="description" content="Revolutionary AI-powered marketing attribution platform. Track every customer touchpoint, predict performance with 94% accuracy, and create content that converts. Start your 14-day free trial today." />
        <meta name="keywords" content="marketing attribution, AI marketing tools, multi-touch attribution, customer journey analytics, predictive marketing, content marketing AI, marketing intelligence, ROI tracking, customer journey mapping, marketing analytics platform, attribution software, AI content generation" />
        <link rel="canonical" href="https://attributeai.app/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AttributeAI - AI-Powered Marketing Attribution Platform | 14-Day Free Trial" />
        <meta property="og:description" content="Revolutionary AI-powered marketing attribution platform. Track every customer touchpoint, predict performance with 94% accuracy, and create content that converts." />
        <meta property="og:url" content="https://attributeai.app/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="AttributeAI - AI-Powered Marketing Attribution Platform" />
        <meta name="twitter:description" content="Revolutionary AI-powered marketing attribution platform. Track every customer touchpoint, predict performance with 94% accuracy. Start your 14-day free trial today." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
      </Helmet>
      
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
                AI Marketing Attribution
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionary multi-touch attribution platform powered by advanced AI. Track every customer touchpoint, predict performance with 94% accuracy, and create content that converts using Claude, GPT-4, and Gemini AI.
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Win at Marketing Attribution</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combine the power of Claude, GPT-4, and Gemini AI models with real-time multi-touch attribution tracking, predictive analytics, and customer journey mapping.
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

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Start with our free trial, then choose the plan that scales with your business needs.
            </p>
            
            {/* Monthly/Annual Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-slate-800/50 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      !isAnnual 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isAnnual 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Annual
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Save 16%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{pricing.starter.name}</h3>
                <div className="mb-4">
                  {isAnnual ? (
                    <div>
                      <span className="text-4xl font-bold text-white">${pricing.starter.annual.monthlyEquivalent}</span>
                      <span className="text-gray-300 ml-2">/month</span>
                      <div className="text-sm text-gray-400 mt-1">
                        ${pricing.starter.annual.price} billed annually
                      </div>
                      <div className="text-green-400 text-sm font-medium">
                        Save ${pricing.starter.monthly.yearlyPrice - pricing.starter.annual.price}/year
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-white">${pricing.starter.monthly.price}</span>
                      <span className="text-gray-300 ml-2">/month</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-300">Perfect for small businesses</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pricing.starter.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleFreeTrial(isAnnual ? 'starter-annual' : 'starter-monthly')}
                disabled={isLoading}
                className="w-full border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all duration-200"
              >
                Start Free Trial
              </button>
            </div>
            
            {/* Growth Plan - Most Popular */}
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-8 rounded-2xl border-2 border-blue-500/50 backdrop-blur-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{pricing.growth.name}</h3>
                <div className="mb-4">
                  {isAnnual ? (
                    <div>
                      <span className="text-4xl font-bold text-white">${pricing.growth.annual.monthlyEquivalent}</span>
                      <span className="text-gray-300 ml-2">/month</span>
                      <div className="text-sm text-gray-400 mt-1">
                        ${pricing.growth.annual.price} billed annually
                      </div>
                      <div className="text-green-400 text-sm font-medium">
                        Save ${pricing.growth.monthly.yearlyPrice - pricing.growth.annual.price}/year
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-white">${pricing.growth.monthly.price}</span>
                      <span className="text-gray-300 ml-2">/month</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-300">For growing marketing teams</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pricing.growth.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleFreeTrial(isAnnual ? 'growth-annual' : 'growth-monthly')}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Start Free Trial'}
              </button>
            </div>
            
            {/* Scale Plan */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{pricing.scale.name}</h3>
                <div className="mb-4">
                  {isAnnual ? (
                    <div>
                      <span className="text-4xl font-bold text-white">${pricing.scale.annual.monthlyEquivalent}</span>
                      <span className="text-gray-300 ml-2">/month</span>
                      <div className="text-sm text-gray-400 mt-1">
                        ${pricing.scale.annual.price} billed annually
                      </div>
                      <div className="text-green-400 text-sm font-medium">
                        Save ${pricing.scale.monthly.yearlyPrice - pricing.scale.annual.price}/year
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-white">${pricing.scale.monthly.price}</span>
                      <span className="text-gray-300 ml-2">/month</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-300">For large organizations</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pricing.scale.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleFreeTrial(isAnnual ? 'scale-annual' : 'scale-monthly')}
                disabled={isLoading}
                className="w-full border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all duration-200"
              >
                Start Free Trial
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">✨ All plans include 14-day free trial • No credit card required</p>
            {isAnnual ? (
              <p className="text-sm text-green-400 font-medium">
                🎉 Save 16% with annual billing • Cancel anytime
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Save 16% with annual billing • Cancel anytime
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </>
  );
};

export default LandingPage;