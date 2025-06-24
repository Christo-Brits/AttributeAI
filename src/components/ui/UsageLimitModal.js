import React from 'react';
import { X, Zap, Crown, Shield, ChevronRight, Check } from 'lucide-react';

const UsageLimitModal = ({ isOpen, onClose, limitType, currentUsage, limit, subscriptionTier, onUpgrade }) => {
  if (!isOpen) return null;

  const getLimitTypeDisplay = (type) => {
    switch (type) {
      case 'keywords_analyzed':
        return 'Keyword Analyses';
      case 'content_generated':
        return 'Content Pieces';
      case 'attribution_queries':
        return 'Attribution Queries';
      default:
        return 'Feature Usage';
    }
  };

  const getUpgradeOptions = () => {
    if (subscriptionTier === 'free') {
      return {
        currentPlan: 'Free Tier',
        recommendedPlan: 'Professional',
        price: '$47/month',
        savings: 'Save $50 vs pay-per-use',
        features: [
          '2,500 keyword analyses/month',
          '50 content pieces/month', 
          '500 attribution queries/month',
          'Advanced competitor analysis',
          'Unlimited AI model access',
          'Priority support'
        ]
      };
    } else {
      return {
        currentPlan: 'Professional',
        recommendedPlan: 'Enterprise',
        price: '$147/month',
        savings: 'Unlimited everything',
        features: [
          'Unlimited keyword analyses',
          'Unlimited content generation',
          'Unlimited attribution queries',
          'White-label customization',
          'Custom integrations',
          'Dedicated success manager'
        ]
      };
    }
  };

  const upgradeOptions = getUpgradeOptions();
  const limitTypeDisplay = getLimitTypeDisplay(limitType);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-auto border border-gray-600/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Usage Limit Reached</h3>
              <p className="text-sm text-gray-400">{upgradeOptions.currentPlan}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Limit Information */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {currentUsage}/{limit === -1 ? '∞' : limit}
            </div>
            <p className="text-gray-300 mb-4">
              {limitTypeDisplay} this month
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                style={{ width: limit === -1 ? '0%' : `${Math.min(100, (currentUsage / limit) * 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">
              You've reached your monthly limit for {limitTypeDisplay.toLowerCase()}. 
              Upgrade to continue with unlimited access.
            </p>
          </div>
        </div>

        {/* Upgrade Recommendation */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Crown className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">
                Recommended: {upgradeOptions.recommendedPlan}
              </span>
            </div>
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-2xl font-bold text-white">{upgradeOptions.price}</span>
              <span className="text-gray-400 text-sm">{upgradeOptions.savings}</span>
            </div>
            <div className="space-y-2">
              {upgradeOptions.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
              {upgradeOptions.features.length > 3 && (
                <p className="text-xs text-gray-400 mt-2">
                  +{upgradeOptions.features.length - 3} more features included
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transform"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade to {upgradeOptions.recommendedPlan}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-700 text-gray-300 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your limits reset automatically at the beginning of each month
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal;