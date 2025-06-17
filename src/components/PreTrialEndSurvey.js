// Pre-Trial End Survey Component (Day 12-14) - 50% Urgent Discount
// Final opportunity survey with maximum discount

import React, { useState } from 'react';
import { 
  AlertCircle, Clock, Zap, DollarSign, Heart, Target,
  X, ArrowRight, Gift, TrendingUp, Award, Star
} from 'lucide-react';
import { Card, Button } from '../ui/DesignSystem';

const PreTrialEndSurvey = ({ currentStep, responses, onNext, onComplete, onDismiss }) => {
  const [currentResponse, setCurrentResponse] = useState('');

  const questions = [
    {
      id: 'biggest_value',
      type: 'multiple_choice',
      question: 'What\'s been the biggest value from AttributeAI?',
      options: [
        'Unlimited keyword research (vs credit limits)',
        'Multi-AI insights (Claude + GPT-4 + Gemini)',
        'Time saved on content creation',
        'Better understanding of customer journey',
        'Revenue attribution and ROI tracking',
        'Professional reports and exports'
      ],
      reward: '50% OFF - Final Offer!'
    },
    {
      id: 'purchase_intent',
      type: 'rating',
      question: 'How likely are you to continue with a paid plan?',
      subtitle: 'Rate from 1 (not likely) to 5 (definitely will upgrade)',
      helpText: 'Be honest - this helps us understand your needs better'
    },
    {
      id: 'price_sensitivity',
      type: 'multiple_choice',
      question: 'What\'s the ideal price point for you?',
      options: [
        '$29/month - Basic plan with core features',
        '$47/month - Professional plan (current pricing)',
        '$97/month - Advanced plan with team features',
        '$197/month - Enterprise plan with white-label',
        'Would pay more for additional features'
      ]
    },
    {
      id: 'final_feedback',
      type: 'text',
      question: 'Any final thoughts or requests?',
      placeholder: 'What would make AttributeAI perfect for your needs? Feature requests, pricing feedback, anything...'
    }
  ];

  if (currentStep >= questions.length) {
    onComplete(responses);
    return null;
  }

  const question = questions[currentStep];

  return (
    <Card className="max-w-lg w-full bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 border-red-500 relative animate-pulse">
      <button 
        onClick={onDismiss}
        className="absolute top-4 right-4 text-white/70 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="p-6">
        {/* Urgent Header */}
        <div className="text-center mb-6">
          <div className="relative">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3 animate-bounce" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Trial Ending Soon! ⏰
          </h2>
          <p className="text-red-200 text-sm mb-2">
            {question.reward || 'Last chance for 50% OFF'}
          </p>
          <div className="bg-red-800/50 rounded px-3 py-1 inline-block">
            <span className="text-red-200 text-xs">⚡ This offer expires with your trial</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-orange-300 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-red-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            {question.question}
          </h3>
          {question.subtitle && (
            <p className="text-orange-200 text-sm mb-3">{question.subtitle}</p>
          )}
          {question.helpText && (
            <p className="text-yellow-200 text-xs mb-4 italic">{question.helpText}</p>
          )}

          {question.type === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options.map(option => (
                <button
                  key={option}
                  onClick={() => setCurrentResponse(option)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    currentResponse === option
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-yellow-400'
                      : 'border-red-400 text-red-100 hover:bg-red-400/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'rating' && (
            <div className="flex justify-center space-x-3">
              {[1,2,3,4,5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setCurrentResponse(rating)}
                  className={`w-14 h-14 rounded-full border-2 font-bold transition-all text-lg ${
                    currentResponse === rating 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-yellow-400 scale-110' 
                      : 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black hover:scale-105'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          )}

          {question.type === 'text' && (
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder={question.placeholder}
              className="w-full p-3 rounded-lg bg-red-800 text-white border-2 border-red-400 focus:border-yellow-400 focus:outline-none"
              rows={4}
            />
          )}
        </div>

        {/* Urgent Action Button */}
        <Button 
          onClick={() => {
            onNext({ [question.id]: currentResponse });
            setCurrentResponse('');
          }}
          disabled={!currentResponse}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 text-lg shadow-lg transform hover:scale-105 transition-all"
        >
          {currentStep === questions.length - 1 ? (
            <>
              <Gift className="w-6 h-6 mr-2" />
              Claim 50% OFF Now!
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5 mr-2" />
              Continue to Discount
            </>
          )}
        </Button>

        {/* Urgency Footer */}
        <div className="mt-4 text-center">
          <p className="text-red-200 text-xs">
            🔥 Biggest discount available • Limited time only
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PreTrialEndSurvey;