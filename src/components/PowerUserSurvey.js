// Power User Survey Component (Day 7-10) - 40% Discount
// Advanced survey for highly engaged users

import React, { useState } from 'react';
import { 
  Crown, Star, TrendingUp, Users, DollarSign, Target,
  X, ArrowRight, Gift, CheckCircle, Zap
} from 'lucide-react';
import { Card, Button } from '../ui/DesignSystem';

const PowerUserSurvey = ({ currentStep, responses, onNext, onComplete, onDismiss }) => {
  const [currentResponse, setCurrentResponse] = useState('');

  const questions = [
    {
      id: 'daily_usage_pattern',
      type: 'multiple_choice',
      question: 'How do you typically use AttributeAI?',
      options: [
        'Daily keyword research for content planning',
        'Weekly batch analysis for multiple clients', 
        'On-demand for specific projects',
        'Part of automated workflow/reporting',
        'Strategic planning and competitor analysis'
      ],
      reward: '40% off for 1 month!'
    },
    {
      id: 'workflow_integration',
      type: 'text',
      question: 'How has AttributeAI integrated into your workflow?',
      placeholder: 'Describe how you use it with other tools, team processes, client work...'
    },
    {
      id: 'feature_priorities',
      type: 'ranking',
      question: 'Rank these features by importance to you:',
      options: [
        'Unlimited keyword research',
        'Multi-AI content generation', 
        'Revenue attribution tracking',
        'Team collaboration features',
        'API access for automation',
        'Advanced reporting dashboards'
      ]
    },
    {
      id: 'team_size',
      type: 'multiple_choice',
      question: 'What\'s your team/company size?',
      options: [
        'Just me (solo)',
        '2-5 people',
        '6-20 people', 
        '21-100 people',
        '100+ people'
      ]
    },
    {
      id: 'budget_range',
      type: 'multiple_choice',
      question: 'What\'s your monthly budget for marketing tools?',
      options: [
        'Under $100/month',
        '$100-300/month',
        '$300-1000/month',
        '$1000-3000/month',
        '$3000+/month'
      ]
    }
  ];

  // Handle ranking responses
  const [rankings, setRankings] = useState([]);
  
  const handleRanking = (option) => {
    const newRankings = [...rankings];
    const index = newRankings.indexOf(option);
    
    if (index > -1) {
      newRankings.splice(index, 1);
    } else {
      newRankings.push(option);
    }
    
    setRankings(newRankings);
    setCurrentResponse(newRankings);
  };

  if (currentStep >= questions.length) {
    onComplete(responses);
    return null;
  }

  const question = questions[currentStep];

  return (
    <Card className="max-w-lg w-full bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 border-purple-500 relative">
      <button 
        onClick={onDismiss}
        className="absolute top-4 right-4 text-white/70 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">
            Power User Exclusive! 👑
          </h2>
          <p className="text-purple-200 text-sm">
            {question.reward || 'Help us improve = 40% off for 1 month'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-purple-300 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-purple-800 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            {question.question}
          </h3>

          {question.type === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options.map(option => (
                <button
                  key={option}
                  onClick={() => setCurrentResponse(option)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    currentResponse === option
                      ? 'bg-purple-400 text-black border-purple-400'
                      : 'border-purple-400 text-purple-100 hover:bg-purple-400/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'text' && (
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder={question.placeholder}
              className="w-full p-3 rounded-lg bg-purple-800 text-white border-2 border-purple-400 focus:border-yellow-400 focus:outline-none"
              rows={4}
            />
          )}

          {question.type === 'ranking' && (
            <div className="space-y-2">
              <p className="text-purple-200 text-sm mb-3">
                Click to rank (1 = most important):
              </p>
              {question.options.map((option, index) => {
                const rankPosition = rankings.indexOf(option) + 1;
                return (
                  <button
                    key={option}
                    onClick={() => handleRanking(option)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                      rankPosition > 0
                        ? 'bg-purple-400 text-black border-purple-400'
                        : 'border-purple-400 text-purple-100 hover:bg-purple-400/20'
                    }`}
                  >
                    <span>{option}</span>
                    {rankPosition > 0 && (
                      <span className="bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {rankPosition}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => {
            onNext({ [question.id]: currentResponse });
            setCurrentResponse('');
            setRankings([]);
          }}
          disabled={!currentResponse || (Array.isArray(currentResponse) && currentResponse.length === 0)}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3"
        >
          {currentStep === questions.length - 1 ? (
            <>
              <Gift className="w-5 h-5 mr-2" />
              Get 40% Discount!
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5 mr-2" />
              Next Question
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default PowerUserSurvey;