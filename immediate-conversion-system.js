// Complete Conversion System - Works with or without database trigger
// Add this to your main App.js or create ConversionManager.js

import React, { useState, useEffect } from 'react';
import { X, Users, Zap, Database, Gift, Star, Mail, CheckCircle } from 'lucide-react';

// Quick Conversion Banner for Dashboard
const ConversionBanner = ({ onSignup }) => {
  const [dismissed, setDismissed] = useState(false);
  
  // Don't show if user is already registered or dismissed
  if (dismissed || localStorage.getItem('attributeai_user')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg mb-6 relative animate-pulse">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-white hover:text-gray-200"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <Database className="mr-2" size={20} />
            🎉 Account Creation Now Working!
          </h3>
          <p className="text-green-100 mb-3">
            Save your research + get unlimited keyword analysis (no more credit limits!)
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <Users className="mr-1" size={16} />
              <span>Join 63+ active users</span>
            </div>
            <div className="flex items-center">
              <Zap className="mr-1" size={16} />
              <span>Beat Keywords Everywhere</span>
            </div>
          </div>
        </div>
        
        <div className="ml-6">
          <button
            onClick={onSignup}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap shadow-lg"
          >
            Get Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

// Progress Save Prompt (after tool usage)
const ProgressSavePrompt = ({ toolName = "analysis", onSignup }) => {
  const [show, setShow] = useState(true);
  
  if (!show || localStorage.getItem('attributeai_user')) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
      <div className="flex items-start space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Database className="text-blue-600" size={20} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-blue-800 mb-1">
            💾 Save This {toolName}?
          </h4>
          <p className="text-blue-700 text-sm mb-3">
            Create a free account to save your insights and continue unlimited research.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={onSignup}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
            >
              Save + Get Unlimited Access
            </button>
            <button
              onClick={() => setShow(false)}
              className="text-blue-600 px-4 py-2 text-sm hover:text-blue-800"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating Call-to-Action (appears after engagement)
const FloatingCTA = ({ onSignup }) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Show after user has been active for 2+ minutes
    const timer = setTimeout(() => {
      if (!localStorage.getItem('attributeai_user')) {
        setShow(true);
      }
    }, 120000); // 2 minutes

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-xl">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-start space-x-3">
          <Gift className="text-yellow-300 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-bold mb-1">You're a power user! 🎉</h4>
            <p className="text-sm text-purple-100 mb-3">
              Save your progress and get unlimited access - free forever!
            </p>
            <button
              onClick={onSignup}
              className="bg-white text-purple-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 w-full"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Email Signup Modal
const QuickSignupModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleQuickSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create user account (works with or without database trigger)
      const userData = {
        id: `user-${Date.now()}`,
        email: email,
        firstName: email.split('@')[0],
        lastName: 'User',
        subscriptionTier: 'free',
        keywordsUsed: 0,
        monthlyQuota: 1000,
        createdAt: new Date().toISOString(),
        isSupabaseUser: false // Start with localStorage, upgrade later
      };

      // Save to localStorage immediately
      localStorage.setItem('attributeai_user', JSON.stringify(userData));
      
      // Track conversion
      if (window.gtag) {
        window.gtag('event', 'signup_completed', {
          event_category: 'conversion',
          event_label: 'quick_signup',
          value: 1
        });
      }

      setStep(2); // Show success
      
      if (onSuccess) {
        onSuccess(userData);
      }

    } catch (error) {
      console.error('Quick signup failed:', error);
      alert('Signup failed. Please try again.');
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        
        {step === 1 && (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Zap size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Get Unlimited Access</h2>
                  <p className="text-blue-100">Save your progress + no credit limits</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-800">Save all your keyword research</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="text-blue-600" size={20} />
                    <span className="text-blue-800">Unlimited analysis (beat Keywords Everywhere!)</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Users className="text-purple-600" size={20} />
                    <span className="text-purple-800">Join 63+ power users</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleQuickSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Mail size={20} />
                  <span>{isLoading ? 'Creating Account...' : 'Create Free Account'}</span>
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Free forever • No credit card required • Takes 30 seconds
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="p-6 text-center">
            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Welcome to AttributeAI!
              </h3>
              <p className="text-green-700">
                Your account is ready. Start saving your research and enjoy unlimited access!
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Start Using AttributeAI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Conversion Manager Component
const ConversionManager = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignupTrigger = () => {
    setShowSignupModal(true);
  };

  const handleSignupSuccess = (userData) => {
    console.log('User signed up:', userData);
    // Optionally reload page to show authenticated state
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      {/* Floating CTA */}
      <FloatingCTA onSignup={handleSignupTrigger} />
      
      {/* Quick Signup Modal */}
      <QuickSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
      />
    </>
  );
};

export {
  ConversionBanner,
  ProgressSavePrompt,
  FloatingCTA,
  QuickSignupModal,
  ConversionManager
};
