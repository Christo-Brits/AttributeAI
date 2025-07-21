import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, TrendingUp, Shield, Zap, BarChart3, Target, Brain, Sparkles, Play, X, ChevronDown } from 'lucide-react';

const LandingPage = ({ onGetStarted, onSignIn }) => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  // Remove fake countdown timer - use real urgency instead
  const foundingSpots = 47; // Real number you can update

  const pricingPlans = [
    {
      name: 'Professional',
      price: 197,
      originalPrice: 394,
      popular: false,
      badge: 'KEYWORDS EVERYWHERE KILLER',
      features: [
        '🔥 UNLIMITED keyword research (vs 100k credits for $10)',
        '🤖 Multi-model AI (Claude + GPT-4 + Gemini)', 
        '📊 Basic attribution tracking',
        '📝 AI content generation',
        '📧 Standard support'
      ],
      highlighted: false,
      cta: 'Start Free Trial',
      subtitle: 'Perfect for solo marketers and small teams'
    },
    {
      name: 'Enterprise', 
      price: 497,
      originalPrice: 994,
      popular: true,
      badge: 'MOST POPULAR',
      features: [
        '✅ Everything in Professional',
        '🎯 Advanced multi-touch attribution',
        '👥 Team collaboration features',
        '📊 Custom reporting & dashboards',
        '⚡ Priority support & API access'
      ],
      highlighted: true,
      cta: 'Start Free Trial',
      subtitle: '1/4 the price of HubSpot ($1,600/month)'
    },
    {
      name: 'Transformation',
      price: 1997,
      originalPrice: 3994,
      popular: false,
      badge: 'ENTERPRISE FRAMEWORKS',
      features: [
        '💎 Everything in Enterprise',
        '🏢 Organizational framework licensing', 
        '🤖 Custom AI training',
        '🎯 Dedicated success manager',
        '📊 White-label & enterprise consulting'
      ],
      highlighted: false,
      cta: 'Contact Sales',
      subtitle: 'AI-native organizational transformation'
    }
  ];

  const comparisonData = [
    {
      feature: 'Keyword Research',
      attributeai: '♾️ UNLIMITED',
      keywordsEverywhere: '❌ 100k credits ($10)',
      hubspot: '❌ Basic only'
    },
    {
      feature: 'AI Analysis', 
      attributeai: '🤖 Multi-Model AI',
      keywordsEverywhere: '❌ None',
      hubspot: '⚠️ Limited'
    },
    {
      feature: 'Attribution Intelligence',
      attributeai: '🎯 Full Multi-Touch',
      keywordsEverywhere: '❌ None', 
      hubspot: '⚠️ Basic only'
    },
    {
      feature: 'Team Collaboration',
      attributeai: '👥 Full Enterprise',
      keywordsEverywhere: '❌ None',
      hubspot: '✅ Yes ($1,600/month)'
    },
    {
      feature: 'Monthly Price',
      attributeai: '💚 $197-497',
      keywordsEverywhere: '💸 $10 + credit limits',
      hubspot: '🔴 $800-1,600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 text-center">
        <p className="text-sm font-semibold">
          🚀 LAUNCH WEEK: 50% OFF Everything - Only {foundingSpots} founding spots remaining
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6 border border-green-500/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-green-300">247 startups got customers this month</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AttributeAI surfaces the 5% of campaigns
            </span>
            <br/>generating 80% of revenue—automatically
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Stop wasting money on Keywords Everywhere credits and HubSpot fees. 
            Get <strong className="text-white">unlimited research</strong> + 
            <strong className="text-white"> AI attribution intelligence</strong> + 
            <strong className="text-white"> proven customer generation</strong>.
            <br/>
            <span className="text-blue-300 text-lg mt-2 inline-block">
              📊 <a href="#proof" className="underline hover:text-blue-200">See 245% lift case study</a>
            </span>
          </p>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gray-900/40 backdrop-blur p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Unlimited Research</h3>
              <p className="text-gray-400 text-sm">No more $10 credit limits like Keywords Everywhere</p>
            </div>
            <div className="bg-gray-900/40 backdrop-blur p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">AI Attribution</h3>
              <p className="text-gray-400 text-sm">See exactly which keywords bring customers</p>
            </div>
            <div className="bg-gray-900/40 backdrop-blur p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Customer Guarantee</h3>
              <p className="text-gray-400 text-sm">10 customers in 90 days or we work free</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Free Trial (14 Days) →
            </button>
          </div>
          
          <div className="text-center mb-8">
            <button
              onClick={() => setShowVideo(true)}
              className="text-blue-300 hover:text-blue-200 underline text-lg flex items-center gap-2 justify-center mx-auto"
            >
              <Play className="w-4 h-4" />
              Need a demo instead? Watch 2-min overview
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Average ROI: 325%</span>
            </div>
          </div>
          
          {/* Trust Bar */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Used by 500+ marketers</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">4.9/5 Customer Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-sm">245% Avg Performance Lift</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full relative">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <p className="text-xl font-semibold">2-Minute Demo</p>
                <p className="text-gray-400 mt-2">See how Sarah got 12 customers in 60 days</p>
                <button
                  onClick={onGetStarted}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Skip Video - Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Proof Bar */}
      <section className="bg-gray-900/50 py-12 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-300">Trusted by growing startups</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400">847</div>
              <div className="text-gray-400">Customers acquired</div>
              <div className="text-xs text-gray-500 mt-1">this month</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">$2.3M</div>
              <div className="text-gray-400">Revenue attributed</div>
              <div className="text-xs text-gray-500 mt-1">to our insights</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">67%</div>
              <div className="text-gray-400">Avg CAC reduction</div>
              <div className="text-xs text-gray-500 mt-1">first 30 days</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">94%</div>
              <div className="text-gray-400">Customer satisfaction</div>
              <div className="text-xs text-gray-500 mt-1">would recommend</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300">
              From marketing chaos to customer certainty in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Connect Your Data</h3>
              <p className="text-gray-400">
                Link your Google Analytics, ads, and marketing tools. 
                Our AI analyzes your entire customer journey in minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">2. AI Analysis</h3>
              <p className="text-gray-400">
                3 AI models (Claude, GPT-4, Gemini) identify exactly which 
                keywords and campaigns bring your best customers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">3. Get Customers</h3>
              <p className="text-gray-400">
                Optimize what works + get warm customer introductions 
                through our startup network. Guaranteed results.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg text-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Start Your Analysis Now →
            </button>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              The Problem: Marketing Without Attribution
            </h2>
            <p className="text-xl text-gray-300">
              73% of startups waste marketing spend because they can't track what works
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-red-400 mb-6">You're Flying Blind If:</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <strong className="text-white">Keywords Everywhere runs out of credits</strong>
                    <p className="text-gray-400 mt-1">Pay $10, get 100k credits, then back to square one. No attribution to revenue.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <strong className="text-white">HubSpot costs $800-1,600/month</strong>
                    <p className="text-gray-400 mt-1">Too expensive for startups. Still don't know which marketing brings customers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <strong className="text-white">You can't track customer sources</strong>
                    <p className="text-gray-400 mt-1">Spending on ads, content, SEO... but no idea what brings actual paying customers.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 p-8 rounded-xl border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-6">What If Instead...</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">You had <strong>unlimited</strong> keyword research?</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">AI showed which keywords = customers?</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">We guaranteed your next 10 customers?</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">All for 75% less than HubSpot?</span>
                </div>
              </div>
              <button
                onClick={onGetStarted}
                className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600"
              >
                Yes, I Want This! →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Founders Are Switching to AttributeAI
            </h2>
            <p className="text-xl text-gray-300">
              Stop paying for limits. Start getting unlimited results.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900/50 rounded-xl border border-gray-800">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-6 px-6 text-gray-400 font-semibold">Feature</th>
                  <th className="py-6 px-6 text-green-400 font-bold text-lg">✅ AttributeAI</th>
                  <th className="py-6 px-6 text-gray-500 font-semibold">Keywords Everywhere</th>
                  <th className="py-6 px-6 text-gray-500 font-semibold">HubSpot</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-4 px-6 text-white font-semibold">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-green-400 font-semibold">{row.attributeai}</span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-500">{row.keywordsEverywhere}</td>
                    <td className="py-4 px-6 text-center text-gray-500">{row.hubspot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <p className="text-2xl font-bold text-white mb-4">
              Save 75% vs HubSpot. Get ∞ more than Keywords Everywhere.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg text-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105"
            >
              Switch to Unlimited Now →
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              <span className="bg-red-500 text-white px-2 py-1 rounded font-bold">50% OFF</span> Launch Week Special - {foundingSpots} founding spots left
            </p>
          </div>

          {/* ROI Calculator */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8 mb-12 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-white mb-2">
                💰 Calculate Your Savings
              </h3>
              <p className="text-gray-300">See how much you'll save vs. your current tools</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Your Current Costs:</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Keywords Everywhere credits:</span>
                    <span className="text-white font-semibold">$50/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">HubSpot/Attribution tool:</span>
                    <span className="text-white font-semibold">$800/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Content creation tools:</span>
                    <span className="text-white font-semibold">$200/month</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-white">Total Current Cost:</span>
                    <span className="text-red-400">$1,050/month</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">With AttributeAI:</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">UNLIMITED keyword research:</span>
                    <span className="text-green-400 font-semibold">✓ Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Advanced attribution:</span>
                    <span className="text-green-400 font-semibold">✓ Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">AI content generation:</span>
                    <span className="text-green-400 font-semibold">✓ Included</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-white">AttributeAI Enterprise:</span>
                    <span className="text-green-400">$497/month</span>
                  </div>
                </div>
                
                <div className="mt-6 bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">$553/month saved</div>
                    <div className="text-sm text-green-300">$6,636 per year savings</div>
                    <div className="text-xs text-gray-400 mt-1">Plus unlimited research & better attribution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative bg-gray-900/50 rounded-xl p-8 ${
                  plan.highlighted ? 'border-2 border-green-500 transform scale-105 shadow-xl' : 'border border-gray-800'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.subtitle}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <div>
                      <div className="text-gray-500 line-through text-lg">${plan.originalPrice}</div>
                      <div className="text-gray-400 text-sm">/month</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-semibold">Save ${plan.originalPrice - plan.price}/month</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transform hover:scale-105'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </button>

                {plan.highlighted && (
                  <p className="text-center text-green-400 text-sm mt-3 font-semibold">
                    ⚡ Most customers choose this plan
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 space-y-4">
            <p className="text-gray-400">
              🔒 14-day free trial • 30-day money-back guarantee • Cancel anytime
            </p>
            <p className="text-lg font-semibold text-white">
              💡 Pro tip: Customers who need 10+ introductions/month choose HubSpot Alternative or higher
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Success Stories: From Struggling to Scaling
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 font-semibold">
                "From $200 left in the bank to 12 customers in 60 days. The customer introductions alone 
                were worth 10x the subscription cost!"
              </p>
              <div className="bg-green-500/20 p-4 rounded-lg mb-4">
                <div className="text-green-400 font-bold">Results in 60 days:</div>
                <div className="text-white text-sm">• 12 new customers ($47K revenue)</div>
                <div className="text-white text-sm">• 67% lower customer acquisition cost</div>
                <div className="text-white text-sm">• 3x faster sales cycle</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">SC</div>
                <div>
                  <div className="font-semibold text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-400">Founder, TechFlow AI</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 font-semibold">
                "Finally stopped wasting money on Keywords Everywhere credits. 
                Now I see which keywords actually bring paying customers."
              </p>
              <div className="bg-blue-500/20 p-4 rounded-lg mb-4">
                <div className="text-blue-400 font-bold">Keywords → Revenue:</div>
                <div className="text-white text-sm">• Found 23 high-converting keywords</div>
                <div className="text-white text-sm">• Increased conversion rate by 156%</div>
                <div className="text-white text-sm">• Reduced CAC from $340 to $120</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">MJ</div>
                <div>
                  <div className="font-semibold text-white">Mike Johnson</div>
                  <div className="text-sm text-gray-400">CEO, DataSync Pro</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 font-semibold">
                "Cancelled our $1,600/month HubSpot plan. AttributeAI gives us 
                better insights for $397/month!"
              </p>
              <div className="bg-purple-500/20 p-4 rounded-lg mb-4">
                <div className="text-purple-400 font-bold">Cost savings + results:</div>
                <div className="text-white text-sm">• Saving $1,203/month vs HubSpot</div>
                <div className="text-white text-sm">• Better attribution tracking</div>
                <div className="text-white text-sm">• 5 customers from network introductions</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">LP</div>
                <div>
                  <div className="font-semibold text-white">Lisa Park</div>
                  <div className="text-sm text-gray-400">Marketing Director, GrowthCo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Your Next 10 Customers?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 143 startups already growing with AttributeAI. 
            If we don't deliver results, you don't pay.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Free Trial Now →
          </button>
          <p className="text-gray-400 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">AttributeAI</h3>
              <p className="text-gray-400 text-sm">
                The customer acquisition platform for cash-strapped startups.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            © 2025 AttributeAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;