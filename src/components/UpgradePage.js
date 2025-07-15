import React from 'react';
import { Crown, Zap, Shield, Check, ChevronRight, ArrowLeft } from 'lucide-react';

const UpgradePage = ({ onBack }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying AttributeAI',
      features: [
        '100 keyword analyses/month',
        '5 content pieces/month',
        '50 attribution queries/month',
        'Basic AI models',
        'Email support'
      ],
      limitations: [
        'Limited keyword research',
        'Basic content generation',
        'Standard attribution models'
      ],
      buttonText: 'Current Plan',
      buttonClass: 'bg-gray-600 text-gray-300 cursor-not-allowed',
      badge: null,
      current: true
    },
    {
      name: 'Professional',
      price: '$47',
      period: 'per month',
      description: 'For growing marketing teams',
      features: [
        '2,500 keyword analyses/month',
        '50 content pieces/month',
        '500 attribution queries/month',
        'All AI models (Claude, GPT-4, Gemini)',
        'Advanced competitor analysis',
        'Content clusters & strategies',
        'Priority support'
      ],
      limitations: [],
      buttonText: 'Upgrade to Professional',
      buttonClass: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
      badge: 'Most Popular',
      badgeClass: 'bg-gradient-to-r from-blue-500 to-purple-500',
      current: false
    },
    {
      name: 'Enterprise',
      price: '$147',
      period: 'per month',
      description: 'For agencies and large teams',
      features: [
        'Unlimited keyword analyses',
        'Unlimited content generation',
        'Unlimited attribution queries',
        'All Professional features',
        'White-label customization',
        'Custom integrations',
        'Dedicated success manager',
        'SLA guarantee'
      ],
      limitations: [],
      buttonText: 'Upgrade to Enterprise',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
      badge: 'Best Value',
      badgeClass: 'bg-gradient-to-r from-purple-500 to-pink-500',
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Upgrade Your AttributeAI Experience
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock unlimited marketing intelligence with advanced AI models and enterprise features
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-800/90 backdrop-blur-sm border rounded-xl p-6 transition-all duration-200 hover:scale-105 ${
                plan.current 
                  ? 'border-gray-600/50' 
                  : 'border-gray-600/50 hover:border-blue-500/50'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium text-white ${plan.badgeClass}`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  {index === 0 && <Zap className="w-8 h-8 text-gray-400" />}
                  {index === 1 && <Crown className="w-8 h-8 text-blue-400" />}
                  {index === 2 && <Shield className="w-8 h-8 text-purple-400" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limitations (for free plan) */}
              {plan.limitations.length > 0 && (
                <div className="border-t border-gray-700/50 pt-4 mb-6">
                  <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                  <div className="space-y-2">
                    {plan.limitations.map((limitation, limIndex) => (
                      <div key={limIndex} className="flex items-start space-x-3">
                        <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        </div>
                        <span className="text-gray-500 text-xs">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                disabled={plan.current}
                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${plan.buttonClass} ${
                  !plan.current ? 'shadow-lg hover:scale-105 transform' : ''
                }`}
              >
                <span>{plan.buttonText}</span>
                {!plan.current && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-300 text-sm">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What happens to my data?
              </h3>
              <p className="text-gray-300 text-sm">
                All your data, including keyword analyses and content, remains accessible even if you downgrade. You just won't be able to create new items beyond the free limits.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-300 text-sm">
                We offer a 30-day money-back guarantee. If you're not satisfied with AttributeAI, contact us within 30 days for a full refund.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Need a custom plan?
              </h3>
              <p className="text-gray-300 text-sm">
                For teams larger than 50 users or special requirements, contact us for a custom enterprise solution with volume discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Questions about upgrading? We're here to help.
          </p>
          <div className="flex items-center justify-center space-x-6">
            <a
              href="mailto:support@attributeai.app"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@attributeai.app
            </a>
            <span className="text-gray-600">•</span>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;