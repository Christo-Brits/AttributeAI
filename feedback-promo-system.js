// Feedback + Promo Code System for AttributeAI
// Convert anonymous users with value exchange

import React, { useState, useEffect } from 'react';
import { Star, Gift, MessageSquare, Mail, CheckCircle, Clock } from 'lucide-react';

const FeedbackPromoModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    rating: 0,
    favoriteFeature: '',
    improvementSuggestion: '',
    useCase: '',
    comparedTo: '',
    wouldRecommend: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const features = [
    'Keyword Intelligence Engine',
    'Content Strategy Generator', 
    'Attribution Analytics',
    'SEO Competitor Analysis',
    'Lead Magnet Creator',
    'Real-time Journey Tracking',
    'CRO Analyzer',
    'Unified Dashboard'
  ];

  const competitors = [
    'Keywords Everywhere',
    'Ahrefs',
    'SEMrush',
    'Surfer SEO',
    'HubSpot',
    'Google Analytics',
    'Other'
  ];

  const generatePromoCode = () => {
    const codes = [
      'EARLYUSER50', 'FEEDBACK50', 'PIONEER50', 'INSIDER50', 
      'BETA50', 'VALUED50', 'CHAMPION50', 'ELITE50'
    ];
    return codes[Math.floor(Math.random() * codes.length)];
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Generate promo code
      const code = generatePromoCode();
      setPromoCode(code);
      
      // Store feedback data
      const feedbackData = {
        ...formData,
        timestamp: new Date().toISOString(),
        promoCode: code,
        userAgent: navigator.userAgent,
        sessionId: sessionStorage.getItem('attributeai_session') || 'anonymous'
      };
      
      // Save to localStorage (in production, send to backend)
      const existingFeedback = JSON.parse(localStorage.getItem('attributeai_feedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('attributeai_feedback', JSON.stringify(existingFeedback));
      
      // Track event
      if (window.gtag) {
        window.gtag('event', 'feedback_submitted', {
          event_category: 'engagement',
          event_label: 'promo_feedback',
          value: formData.rating
        });
      }
      
      // Call parent submit handler
      if (onSubmit) {
        await onSubmit(feedbackData);
      }
      
      setStep(3); // Show success step
      
    } catch (error) {
      console.error('Feedback submission failed:', error);
      alert('Feedback submission failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Gift size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">🎁 Exclusive Offer for You!</h2>
              <p className="text-purple-100">Share feedback → Get 50% off premium</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4 flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`h-2 flex-1 rounded ${
                  step >= s ? 'bg-white' : 'bg-purple-400'
                }`} 
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Contact & Rating */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Help us improve AttributeAI
                </h3>
                <p className="text-gray-600">
                  Your feedback is incredibly valuable. As a thank you, get 50% off any premium plan!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email Address (for promo code delivery)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Overall experience with AttributeAI?
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      className={`p-2 transition-colors ${
                        formData.rating >= rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      <Star size={32} fill={formData.rating >= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {formData.rating === 0 && 'Click to rate'}
                  {formData.rating === 1 && 'Poor'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 5 && 'Excellent'}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Detailed Feedback */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tell us more (optional but helpful!)
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which feature did you find most valuable?
                </label>
                <select
                  value={formData.favoriteFeature}
                  onChange={(e) => setFormData(prev => ({ ...prev, favoriteFeature: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a feature</option>
                  {features.map(feature => (
                    <option key={feature} value={feature}>{feature}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your primary use case?
                </label>
                <textarea
                  value={formData.useCase}
                  onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="e.g., Keyword research for blog content, competitor analysis for client campaigns..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How does AttributeAI compare to other tools you've used?
                </label>
                <select
                  value={formData.comparedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, comparedTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select comparison</option>
                  {competitors.map(competitor => (
                    <option key={competitor} value={competitor}>{competitor}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What could we improve?
                </label>
                <textarea
                  value={formData.improvementSuggestion}
                  onChange={(e) => setFormData(prev => ({ ...prev, improvementSuggestion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Any suggestions for new features, improvements, or fixes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Would you recommend AttributeAI to others?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wouldRecommend"
                      checked={formData.wouldRecommend === true}
                      onChange={() => setFormData(prev => ({ ...prev, wouldRecommend: true }))}
                      className="mr-2 text-purple-600"
                    />
                    <span>Yes, definitely</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wouldRecommend"
                      checked={formData.wouldRecommend === false}
                      onChange={() => setFormData(prev => ({ ...prev, wouldRecommend: false }))}
                      className="mr-2 text-purple-600"
                    />
                    <span>Not yet</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success & Promo Code */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Thank you for your feedback!
                </h3>
                <p className="text-green-700">
                  Your insights help us build better tools for marketers like you.
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                <Gift className="mx-auto text-purple-600 mb-4" size={48} />
                <h4 className="text-lg font-bold text-purple-800 mb-2">
                  Your Exclusive Promo Code
                </h4>
                <div className="bg-white p-4 rounded-lg border border-purple-300 mb-4">
                  <code className="text-2xl font-bold text-purple-600 tracking-wider">
                    {promoCode}
                  </code>
                </div>
                <div className="text-purple-700 space-y-2">
                  <p className="font-medium">🎉 50% off any premium plan</p>
                  <p className="text-sm">✨ Valid for 30 days</p>
                  <p className="text-sm">📧 Code sent to your email</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Ready to upgrade?</h5>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>✅ Unlimited keyword research (no more credit limits!)</p>
                  <p>✅ Advanced attribution analytics</p>
                  <p>✅ Export in multiple formats</p>
                  <p>✅ Priority support</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            {step === 1 && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Maybe later
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.email || !formData.rating}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Gift size={16} />
                  <span>{isLoading ? 'Generating Code...' : 'Get My Promo Code'}</span>
                </button>
              </>
            )}

            {step === 3 && (
              <button
                onClick={onClose}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Start Using Premium Features
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Feedback trigger component
const FeedbackPromoTrigger = ({ onTrigger }) => {
  const [shouldShow, setShouldShow] = useState(false);
  
  useEffect(() => {
    // Check if user has been active and hasn't given feedback
    const hasGivenFeedback = localStorage.getItem('attributeai_feedback');
    const sessionActions = parseInt(localStorage.getItem('attributeai_actions') || '0');
    const firstVisit = localStorage.getItem('attributeai_first_visit');
    
    // Show after user has been active for 5+ actions and it's been 2+ minutes
    if (!hasGivenFeedback && sessionActions >= 5 && firstVisit) {
      const timeSinceFirst = Date.now() - parseInt(firstVisit);
      if (timeSinceFirst > 120000) { // 2 minutes
        setShouldShow(true);
      }
    }
  }, []);

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-xl">
        <div className="flex items-start space-x-3">
          <Gift className="text-yellow-300 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-bold mb-1">🎁 Special Offer!</h4>
            <p className="text-sm text-purple-100 mb-3">
              Share quick feedback and get 50% off premium features
            </p>
            <div className="flex space-x-2">
              <button
                onClick={onTrigger}
                className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
              >
                Get 50% Off
              </button>
              <button
                onClick={() => setShouldShow(false)}
                className="text-purple-200 px-3 py-1 text-sm hover:text-white"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FeedbackPromoModal, FeedbackPromoTrigger };
