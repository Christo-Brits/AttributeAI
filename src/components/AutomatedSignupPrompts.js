import React, { useState, useEffect } from 'react';
import { X, Gift, Star, TrendingUp } from 'lucide-react';
import { useAuth } from './auth/AuthContext';

const AutomatedSignupPrompts = () => {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState('trial');

  useEffect(() => {
    // Don't show prompts for authenticated users
    if (user) return;
    
    // Check if user has already seen prompts
    const hasSeenPrompts = localStorage.getItem('attributeai_seen_signup_prompts');
    if (hasSeenPrompts) return;

    // Show prompt after 30 seconds of usage
    const timer = setTimeout(() => {
      setShowPrompt(true);
      localStorage.setItem('attributeai_seen_signup_prompts', 'true');
    }, 30000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  const handleSignup = () => {
    // Redirect to signup/pricing page
    window.location.href = '/pricing';
  };

  // Don't render anything for authenticated users
  if (user) return null;
  
  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <div className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-6 animate-slideInFromRight">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              🚀 Ready to Unlock Full Power?
            </h3>
            <p className="text-gray-600 text-sm">
              Get unlimited access to all attribution tools
            </p>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mb-4 text-center">
          <div className="font-bold">Start Free Trial</div>
          <div className="text-sm opacity-90">No credit card required</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSignup}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Get Started Free
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomatedSignupPrompts;