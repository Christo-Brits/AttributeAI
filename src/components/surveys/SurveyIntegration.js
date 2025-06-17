// Survey Integration Manager
// Handles survey display timing, user tracking, and discount delivery

import { useState, useEffect } from 'react';

export const useSurveyManager = () => {
  const [surveyTriggers, setSurveyTriggers] = useState({
    firstImpression: false,
    earlyFeedback: false,
    powerUser: false,
    preTrialEnd: false
  });

  const [userMetrics, setUserMetrics] = useState({
    signupDate: null,
    toolsUsed: new Set(),
    sessionsCount: 0,
    lastActivity: null,
    surveysCompleted: new Set(),
    discountsEarned: new Set()
  });

  // Initialize user tracking
  useEffect(() => {
    const initializeTracking = () => {
      const existing = localStorage.getItem('attributeai_user_metrics');
      if (existing) {
        const parsed = JSON.parse(existing);
        setUserMetrics({
          ...parsed,
          toolsUsed: new Set(parsed.toolsUsed),
          surveysCompleted: new Set(parsed.surveysCompleted),
          discountsEarned: new Set(parsed.discountsEarned)
        });
      } else {
        const newMetrics = {
          signupDate: new Date().toISOString(),
          toolsUsed: new Set(),
          sessionsCount: 1,
          lastActivity: new Date().toISOString(),
          surveysCompleted: new Set(),
          discountsEarned: new Set()
        };
        setUserMetrics(newMetrics);
        saveMetrics(newMetrics);
      }
    };

    initializeTracking();
  }, []);

  // Save metrics to localStorage
  const saveMetrics = (metrics) => {
    const toSave = {
      ...metrics,
      toolsUsed: Array.from(metrics.toolsUsed),
      surveysCompleted: Array.from(metrics.surveysCompleted),
      discountsEarned: Array.from(metrics.discountsEarned)
    };
    localStorage.setItem('attributeai_user_metrics', JSON.stringify(toSave));
  };

  // Track tool usage
  const trackToolUsage = (toolName) => {
    setUserMetrics(prev => {
      const updated = {
        ...prev,
        toolsUsed: new Set([...prev.toolsUsed, toolName]),
        lastActivity: new Date().toISOString()
      };
      saveMetrics(updated);
      return updated;
    });
  };

  // Track session
  const trackSession = () => {
    setUserMetrics(prev => {
      const updated = {
        ...prev,
        sessionsCount: prev.sessionsCount + 1,
        lastActivity: new Date().toISOString()
      };
      saveMetrics(updated);
      return updated;
    });
  };

  // Check survey triggers
  const checkSurveyTriggers = () => {
    if (!userMetrics.signupDate) return;

    const daysSinceSignup = Math.floor(
      (new Date() - new Date(userMetrics.signupDate)) / (1000 * 60 * 60 * 24)
    );

    const triggers = {
      // First Impression Survey (Day 1-3)
      firstImpression: daysSinceSignup >= 1 && daysSinceSignup <= 3 && 
                      !userMetrics.surveysCompleted.has('first_impression'),
      
      // Early Feedback Survey (Day 4-6)
      earlyFeedback: daysSinceSignup >= 4 && daysSinceSignup <= 6 && 
                     !userMetrics.surveysCompleted.has('early_feedback'),
      
      // Power User Survey (5+ tools used)
      powerUser: userMetrics.toolsUsed.size >= 5 && 
                 !userMetrics.surveysCompleted.has('power_user'),
      
      // Pre-Trial End Survey (Day 12-14)
      preTrialEnd: daysSinceSignup >= 12 && daysSinceSignup <= 14 && 
                   !userMetrics.surveysCompleted.has('pre_trial_end')
    };

    setSurveyTriggers(triggers);
    return triggers;
  };

  // Mark survey as completed
  const completeSurvey = (surveyType, discountCode) => {
    setUserMetrics(prev => {
      const updated = {
        ...prev,
        surveysCompleted: new Set([...prev.surveysCompleted, surveyType]),
        discountsEarned: new Set([...prev.discountsEarned, discountCode])
      };
      saveMetrics(updated);
      return updated;
    });
  };

  // Generate discount codes
  const generateDiscountCode = (surveyType) => {
    const codes = {
      first_impression: 'WELCOME20',
      early_feedback: 'FEEDBACK30',
      power_user: 'POWERUSER40',
      pre_trial_end: 'LASTHANCE50'
    };
    return codes[surveyType] || 'SURVEY15';
  };

  return {
    surveyTriggers,
    userMetrics,
    trackToolUsage,
    trackSession,
    checkSurveyTriggers,
    completeSurvey,
    generateDiscountCode
  };
};

// Survey Display Component
export const SurveyDisplay = ({ 
  surveyType, 
  isVisible, 
  onComplete, 
  onDismiss 
}) => {
  if (!isVisible) return null;

  const surveyConfig = {
    first_impression: {
      title: "Quick Question - 20% OFF Waiting! 🎁",
      subtitle: "Help us improve your experience",
      discount: "20% OFF",
      validDays: 7
    },
    early_feedback: {
      title: "Your Feedback = 30% Savings! 💰",
      subtitle: "2-minute survey, big discount",
      discount: "30% OFF", 
      validDays: 10
    },
    power_user: {
      title: "Power User Bonus - 40% OFF! ⭐",
      subtitle: "You're amazing! Quick survey for huge savings",
      discount: "40% OFF",
      validDays: 14
    },
    pre_trial_end: {
      title: "Last Chance - 50% OFF! 🔥",
      subtitle: "Help us improve before you decide",
      discount: "50% OFF",
      validDays: 3
    }
  };

  const config = surveyConfig[surveyType];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-blue-500 p-6 max-w-sm animate-pulse-soft">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {config.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {config.subtitle}
            </p>
          </div>
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg mb-4 text-center">
          <div className="font-bold text-xl">{config.discount}</div>
          <div className="text-sm opacity-90">Valid for {config.validDays} days</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onComplete(surveyType)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Take Survey
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

// Integration with main app
export const initializeSurveySystem = () => {
  // Add this to your main App.js or dashboard component
  console.log('Survey system initialized');
  
  // Track page views
  const trackPageView = (pageName) => {
    // Implementation for tracking
  };

  return { trackPageView };
};