import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, TrendingUp, Shield, Zap, BarChart3, Target, Brain, Sparkles } from 'lucide-react';

const LandingPage = ({ onGetStarted, onSignIn }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 23, minutes: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const pricingPlans = [
    {
      name: 'Startup Survival',
      price: 197,
      originalPrice: 394,
      features: [
        'AI Attribution Analysis',
        'Up to 5 Customer Introductions/month',
        'Basic Implementation Support',
        'Weekly Performance Reports',
        'Email Support'
      ],
      highlighted: false,
      cta: 'Start Surviving'
    },
    {
      name: 'Startup Growth',
      price: 397,
      originalPrice: 794,
      features: [
        'Everything in Survival',
        'Up to 15 Customer Introductions/month',
        'Priority Implementation Support',
        'AI Strategy Calls (2x/month)',
        'Slack Support Channel'
      ],
      highlighted: true,
      badge: 'Most Popular',
      cta: 'Start Growing'
    },
    {
      name: 'Startup Acceleration',
      price: 697,
      originalPrice: 1394,
      features: [
        'Everything in Growth',
        'Unlimited Customer Introductions',
        'White-Glove Implementation',
        'Weekly Strategy Calls',
        'Direct Founder Access'
      ],
      highlighted: false,
      cta: 'Start Accelerating'
    }
  ];

  const comparisonData = [
    {
      feature: 'Keyword Research',
      attributeai: 'Unlimited',
      keywordsEverywhere: '100k credits for $10',
      hubspot: 'Basic only'
    },
    {
      feature: 'AI Analysis',
      attributeai: '3 AI Models',
      keywordsEverywhere: 'None',
      hubspot: 'Limited'
    },
    {
      feature: 'Customer Attribution',
      attributeai: 'Full Journey',
      keywordsEverywhere: 'None',
      hubspot: 'Basic'
    },
    {
      feature: 'Content Generation',
      attributeai: 'Unlimited AI',
      keywordsEverywhere: 'None',
      hubspot: 'Templates only'
    },
    {
      feature: 'Price',
      attributeai: '$197/month',
      keywordsEverywhere: '$10 + limits',
      hubspot: '$800/month'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 text-center">
        <p className="text-sm font-semibold">
          🔥 Limited Launch Offer: 50% OFF All Plans - Only {timeLeft.days} days {timeLeft.hours}h {timeLeft.minutes}m left!
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-blue-300">Customer Generation Guarantee</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get Your Next 10 Customers<br />in 90 Days
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered attribution + our startup network = guaranteed customer growth. 
            We'll work for free until you succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Free Trial - No Credit Card
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-gray-800 text-white font-bold rounded-lg text-lg hover:bg-gray-700 transition-all border border-gray-700"
            >
              Watch 2-Min Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>50 founding spots left</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-gray-900/50 py-8 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">325%</div>
              <div className="text-gray-400">Avg. ROI</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">67%</div>
              <div className="text-gray-400">CAC Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">2.8x</div>
              <div className="text-gray-400">More Conversions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">143</div>
              <div className="text-gray-400">Happy Startups</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Stop Guessing. Start Growing.
            </h2>
            <p className="text-xl text-gray-300">
              Cash-strapped startups waste 73% of marketing spend because they can't track what works
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">The Problem</h3>
              <p className="text-gray-400">
                You're spending on marketing but have no idea which efforts bring customers. 
                Keywords Everywhere gives you data but not revenue. HubSpot costs $800/month.
              </p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Solution</h3>
              <p className="text-gray-400">
                AI analyzes your entire customer journey, identifies what's working, 
                and connects you with customers through our startup network.
              </p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">The Result</h3>
              <p className="text-gray-400">
                Know exactly where customers come from, optimize what works, 
                and get warm introductions to your next customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Startups Choose AttributeAI
            </h2>
            <p className="text-xl text-gray-300">
              10x better value than the alternatives
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 text-gray-400">Feature</th>
                  <th className="py-4 px-6 text-blue-400 font-bold">AttributeAI</th>
                  <th className="py-4 px-6 text-gray-500">Keywords Everywhere</th>
                  <th className="py-4 px-6 text-gray-500">HubSpot</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-800/50">
                    <td className="py-4 px-6 text-gray-300">{row.feature}</td>
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
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple Pricing, Massive Value
            </h2>
            <p className="text-xl text-gray-300">
              50% off for the first 50 founding customers (only 12 spots left!)
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative bg-gray-900/50 rounded-xl p-8 ${
                  plan.highlighted ? 'border-2 border-blue-500 transform scale-105' : 'border border-gray-800'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-500 line-through ml-2">${plan.originalPrice}</span>
                  <span className="text-gray-400">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 space-y-4">
            <p className="text-gray-400">
              🔒 30-day money-back guarantee • Cancel anytime • No hidden fees
            </p>
            <p className="text-blue-400 font-semibold">
              ⚡ Average customer sees positive ROI in first 30 days
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Startups Love AttributeAI
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "From 0 to 12 customers in 60 days. The customer introductions alone 
                paid for the entire year!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                <div>
                  <div className="font-semibold text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-400">Founder, TechFlow</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Cut our CAC by 67% in the first month. Finally know which keywords 
                actually bring paying customers."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full" />
                <div>
                  <div className="font-semibold text-white">Mike Johnson</div>
                  <div className="text-sm text-gray-400">CEO, DataSync</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "The AI insights are incredible. It's like having a CMO and data 
                scientist for $197/month."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                <div>
                  <div className="font-semibold text-white">Lisa Park</div>
                  <div className="text-sm text-gray-400">Founder, AITools</div>
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