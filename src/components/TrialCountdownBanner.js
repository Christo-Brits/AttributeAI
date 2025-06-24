import React, { useState, useEffect } from 'react';
import { Clock, Star, Zap, X, Calendar } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const TrialCountdownBanner = () => {
  const { user } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!user || isDismissed) return;

    // Calculate days remaining in trial
    const accountCreatedDate = new Date(user.createdAt || user.created_at);
    const trialEndDate = new Date(accountCreatedDate);
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial
    
    const today = new Date();
    const timeDiff = trialEndDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    setDaysRemaining(daysDiff);
    
    // Show banner if trial is ending soon (last 7 days) or expired
    if (daysDiff <= 7 && daysDiff >= 0) {
      setShowBanner(true);
    } else if (daysDiff < 0) {
      // Trial expired - show different message
      setShowBanner(true);
    }

    // Check if user dismissed this banner today
    const dismissedDate = localStorage.getItem('attributeai_trial_banner_dismissed');
    const today_str = today.toDateString();
    if (dismissedDate === today_str) {
      setShowBanner(false);
      setIsDismissed(true);
    }
  }, [user, isDismissed]);

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    localStorage.setItem('attributeai_trial_banner_dismissed', new Date().toDateString());
  };

  const handleUpgrade = () => {
    // Track upgrade intent
    console.log('User clicked upgrade from trial banner');
    // Could navigate to pricing page or open upgrade modal
    window.location.href = '/pricing';
  };

  if (!user || !showBanner) return null;

  const isExpired = daysRemaining < 0;
  const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

  return (
    <div className={`mx-4 mb-6 rounded-xl border-2 shadow-lg ${
      isExpired 
        ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
        : isUrgent 
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isExpired 
                ? 'bg-red-100' 
                : isUrgent 
                  ? 'bg-yellow-100' 
                  : 'bg-blue-100'
            }`}>
              {isExpired ? (
                <Star className="w-5 h-5 text-red-600" />
              ) : (
                <Clock className="w-5 h-5 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-semibold ${
                  isExpired ? 'text-red-800' : isUrgent ? 'text-yellow-800' : 'text-blue-800'
                }`}>
                  {isExpired ? (
                    '🔒 Free Trial Ended'
                  ) : (
                    <>
                      ⏰ Free Trial: {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                    </>
                  )}
                </h3>
                {!isExpired && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isUrgent 
                      ? 'bg-yellow-200 text-yellow-800' 
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {isUrgent ? 'Ending Soon!' : 'Trial Active'}
                  </span>
                )}
              </div>
              
              <p className={`text-sm mt-1 ${
                isExpired ? 'text-red-700' : isUrgent ? 'text-yellow-700' : 'text-blue-700'
              }`}>
                {isExpired ? (
                  'Upgrade to continue using unlimited keyword research and AI-powered insights'
                ) : (
                  `After your trial ends, you'll have limited access. Upgrade now to keep unlimited features!`
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpgrade}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                isExpired
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : isUrgent
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              {isExpired ? 'Upgrade Now' : 'Upgrade to Pro'}
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Dismiss for today"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Progress bar for visual countdown */}
        {!isExpired && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Trial Progress</span>
              <span>{14 - daysRemaining}/14 days used</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isUrgent ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${((14 - daysRemaining) / 14) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialCountdownBanner;