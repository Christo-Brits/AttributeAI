import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Zap, Brain, Target, BarChart3, Users, Shield, Star, Play, TrendingUp, Globe, Sparkles } from 'lucide-react';
import { Button } from './ui/DesignSystem';
import AttributeAILogo from './ui/AttributeAILogo';

const LandingPage = ({ onGetStarted, onSignIn }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director at TechFlow",
      content: "AttributeAI transformed our marketing ROI visibility. We increased conversions by 245% in just 3 months.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "CMO at GrowthScale",
      content: "The multi-model AI insights are game-changing. Finally, we can see which touchpoints actually drive revenue.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Performance Marketing Lead",
      content: "Switched from HubSpot to AttributeAI and saved $800/month while getting 10x better attribution data.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const pricing = {
    starter: {
      monthly: 29,
      yearly: 24,
      features: [
        "Up to 5 team members",
        "20GB storage", 
        "Basic analytics",
        "24/7 email support",
        "Standard integrations",
        "Basic attribution models"
      ]
    },
    growth: {
      monthly: 79,
      yearly: 63,
      features: [
        "Up to 20 team members",
        "100GB storage",
        "Advanced analytics", 
        "Priority support",
        "Custom integrations",
        "Multi-model AI attribution",
        "Predictive analytics",
        "Advanced reporting"
      ]
    },
    scale: {
      monthly: 199,
      yearly: 159,
      features: [
        "Unlimited team members",
        "1TB storage",
        "Enterprise analytics",
        "24/7 phone & email support", 
        "Dedicated account manager",
        "Custom AI model training",
        "White-label options",
        "API access & webhooks"
      ]
    }
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    }
  };

  // Stripe Product IDs - your actual Stripe product IDs
  const stripeProducts = {
    starter: 'prod_SUR69X5aaINViN',
    growth: 'prod_SURBKkpHySagT4', 
    scale: 'prod_SURGrl5AYS4Bpu'
  };

  // Handle Stripe checkout - Correctly Mapped Payment Links
  const handleStripeCheckout = async (planType) => {
    try {
      // Your Stripe Payment Links - Correctly Mapped
      const paymentLinks = {
        starter: isYearly 
          ? 'https://buy.stripe.com/28E7sL0xI6CIbcuc1lcZa03' // Starter Annual ✅
          : 'https://buy.stripe.com/28E7sL0xI6CIbcuc1lcZa03', // Starter Monthly - NEED TO CREATE THIS LINK
        growth: isYearly 
          ? 'https://buy.stripe.com/dRmaEXfsC4uAfsK9TdcZa05' // Growth Annual ✅
          : 'https://buy.stripe.com/dRmbJ1dku7GM4O6d5pcZa04', // Growth Monthly ✅
        scale: isYearly 
          ? 'https://buy.stripe.com/4gMdR9fsCgdi4O6c1lcZa07' // Scale Annual ✅
          : 'https://buy.stripe.com/5kQdR92FQ9OUcgyd5pcZa06'  // Scale Monthly ✅
      };
      
      const paymentUrl = paymentLinks[planType];
      
      if (paymentUrl) {
        // Add a note for Starter Monthly until you create the link
        if (planType === 'starter' && !isYearly) {
          alert('Starter Monthly payment link is being set up. For now, you can use the annual option or contact chris@attributeai.app');
          return;
        }
        
        // Redirect to Stripe checkout
        window.location.href = paymentUrl;
      } else {
        // Fallback message
        alert('Payment processing is being set up. Please contact chris@attributeai.app to proceed.');
      }
    } catch (error) {
      console.error('Payment redirect error:', error);
      alert('Sorry, there was an error processing your request. Please contact chris@attributeai.app for assistance.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AttributeAILogo size={40} />
            <span className="text-2xl font-bold text-white">AttributeAI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSignIn}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Multi-Model AI Powered Attribution Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">The Future of</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Marketing Attribution
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionary multi-touch attribution platform powered by advanced AI. Track 
            every customer touchpoint, predict performance with 94% accuracy, and 
            create content that converts using Claude, GPT-4, and Gemini AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-2xl"
            >
              <span className="flex items-center">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
            <button className="border border-gray-600 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-800/50 transition-all duration-200 backdrop-blur-sm">
              Try Demo (Free)
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Setup in under 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Teams Choose AttributeAI
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The only platform that connects every marketing touchpoint to actual revenue with AI-powered intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 hover:scale-105 transition-all duration-300 group">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Unlimited Research</h3>
              <p className="text-gray-400">No credit limits like Keywords Everywhere. Research unlimited keywords with multi-AI analysis.</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 hover:scale-105 transition-all duration-300 group">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multi-AI Analysis</h3>
              <p className="text-gray-400">Claude + GPT-4 + Gemini working together for superior insights and content generation.</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 hover:scale-105 transition-all duration-300 group">
              <div className="p-3 bg-gradient-to-r from-pink-600 to-blue-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Attribution Intelligence</h3>
              <p className="text-gray-400">Track every touchpoint to revenue. See which keywords and content drive actual deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, transparent <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">pricing</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Choose the perfect plan for your team's needs with no hidden fees or long-term commitments.
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                Yearly <span className="text-blue-400">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8 hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-gray-400 mb-6">Perfect for small teams getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  ${isYearly ? pricing.starter.yearly : pricing.starter.monthly}
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {pricing.starter.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleStripeCheckout('starter')}
                className="w-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Get Started
              </Button>
            </div>

            {/* Growth Plan - Most Popular */}
            <div className="bg-gradient-to-b from-gray-800/90 to-gray-700/90 backdrop-blur-sm border border-purple-500/50 rounded-xl p-8 hover:scale-105 transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
              <p className="text-gray-400 mb-6">Ideal for growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  ${isYearly ? pricing.growth.yearly : pricing.growth.monthly}
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {pricing.growth.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleStripeCheckout('growth')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Start Free Trial
              </Button>
            </div>

            {/* Scale Plan */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8 hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Scale</h3>
              <p className="text-gray-400 mb-6">For large-scale organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  ${isYearly ? pricing.scale.yearly : pricing.scale.monthly}
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {pricing.scale.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleStripeCheckout('scale')}
                className="w-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            Trusted by Marketing Teams Worldwide
          </h2>
          
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8">
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, index) => (
                <Star key={index} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-gray-300 mb-6">
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            <div>
              <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
              <div className="text-gray-400">{testimonials[currentTestimonial].role}</div>
            </div>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Marketing Attribution?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of marketing teams who've revolutionized their ROI tracking with AttributeAI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-2xl"
              >
                Start Your Free Trial
              </Button>
              <button className="text-gray-300 hover:text-white transition-colors font-medium">
                Schedule a Demo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <AttributeAILogo size={32} />
              <span className="text-xl font-bold text-white">AttributeAI</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 AttributeAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;