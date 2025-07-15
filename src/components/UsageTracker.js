import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, Crown, TrendingUp, CheckCircle, X } from 'lucide-react';
import { checkUsageLimit, trackUsage } from '../lib/supabase';
import { useAuth } from './auth/AuthContext';

const UsageLimitModal = ({ isOpen, onClose, usageType, onUpgrade }) => {
  const limits = {
    keywords_analyzed: {
      name: 'Keyword Analysis',
      icon: TrendingUp,
      description: 'Unlimited keyword research and analysis'
    },
    content_generated: {
      name: 'Content Generation', 
      icon: Zap,
      description: 'AI-powered content creation'
    },
    attribution_queries: {
      name: 'Attribution Queries',
      icon: Crown,
      description: 'Advanced attribution modeling'
    }
  };

  const currentLimit = limits[usageType];

  if (!isOpen || !currentLimit) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-600 max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <currentLimit.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Free Limit Reached
              </h3>
              <p className="text-gray-400 text-sm">
                {currentLimit.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            You've reached your monthly limit for {currentLimit.name.toLowerCase()}. 
            Upgrade to continue with unlimited access.
          </p>
          
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4 border border-blue-500/30">
            <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              Professional Plan - $47/month
            </h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Unlimited keyword analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Unlimited content generation
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Unlimited attribution queries
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Priority AI processing
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Advanced analytics & reporting
              </li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Continue with Free
          </button>
          <button
            onClick={onUpgrade}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

const UsageTracker = ({ children, usageType, onLimitReached }) => {
  const { user } = useAuth();
  const [usageInfo, setUsageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadUsageInfo();
    }
  }, [user, usageType]);

  const loadUsageInfo = async () => {
    if (!user) return;
    
    try {
      const info = await checkUsageLimit(user.id, usageType);
      setUsageInfo(info);
    } catch (error) {
      console.error('Error loading usage info:', error);
    }
  };

  const handleUsage = async (amount = 1) => {
    if (!user) return true;
    
    setIsLoading(true);
    
    try {
      // Check current limit
      const currentInfo = await checkUsageLimit(user.id, usageType);
      
      if (currentInfo.exceeded) {
        setShowLimitModal(true);
        onLimitReached?.(currentInfo);
        return false;
      }
      
      // Track usage
      await trackUsage(user.id, usageType, amount);
      
      // Reload usage info
      await loadUsageInfo();
      
      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return true; // Allow operation to continue on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Redirect to upgrade page or open Stripe checkout
    window.open('/upgrade', '_blank');
    setShowLimitModal(false);
  };

  return (
    <>
      {React.cloneElement(children, {
        onBeforeAction: handleUsage,
        usageInfo,
        isLoading: isLoading || children.props.isLoading
      })}
      
      <UsageLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        usageType={usageType}
        onUpgrade={handleUpgrade}
      />
    </>
  );
};

const UsageProgressBar = ({ usageType, className = "" }) => {
  const { user } = useAuth();
  const [usageInfo, setUsageInfo] = useState(null);

  useEffect(() => {
    if (user) {
      loadUsageInfo();
    }
  }, [user, usageType]);

  const loadUsageInfo = async () => {
    if (!user) return;
    
    try {
      const info = await checkUsageLimit(user.id, usageType);
      setUsageInfo(info);
    } catch (error) {
      console.error('Error loading usage info:', error);
    }
  };

  if (!usageInfo) return null;

  const percentage = Math.min((usageInfo.current / usageInfo.limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;

  return (
    <div className={`bg-gray-800/50 rounded-lg p-4 border border-gray-600/50 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          {usageType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        <span className={`text-sm font-semibold ${
          isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-400'
        }`}>
          {usageInfo.current} / {usageInfo.limit}
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isOverLimit 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : isNearLimit 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isNearLimit && (
        <div className={`flex items-center text-xs ${
          isOverLimit ? 'text-red-400' : 'text-yellow-400'
        }`}>
          <AlertCircle className="w-3 h-3 mr-1" />
          {isOverLimit 
            ? 'Monthly limit reached' 
            : `${usageInfo.remaining} uses remaining`
          }
        </div>
      )}
    </div>
  );
};

// Hook for checking usage before performing actions
export const useUsageLimit = (usageType) => {
  const { user } = useAuth();
  
  const checkAndTrack = async (amount = 1) => {
    if (!user) return { allowed: true, showUpgrade: false };
    
    try {
      const currentInfo = await checkUsageLimit(user.id, usageType);
      
      if (currentInfo.exceeded) {
        return { 
          allowed: false, 
          showUpgrade: true, 
          message: `You've reached your monthly limit for ${usageType.replace('_', ' ')}. Upgrade for unlimited access.`
        };
      }
      
      // Track the usage
      await trackUsage(user.id, usageType, amount);
      
      return { allowed: true, showUpgrade: false };
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return { allowed: true, showUpgrade: false }; // Allow on error
    }
  };
  
  return { checkAndTrack };
};

export { UsageTracker, UsageProgressBar, UsageLimitModal };
export default UsageTracker;