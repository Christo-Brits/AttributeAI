import React, { useState, useEffect } from 'react';
import { Star, Gift, MessageSquare, TrendingUp, Target, X } from 'lucide-react';

const UserSurveySystem = () => {
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [surveyData, setSurveyData] = useState({});
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  // Survey configurations
  const surveys = {
    first_impression: {
      title: "Quick Question - 20% OFF Waiting! 🎁",
      subtitle: "Help us improve your experience",
      discount: "20% OFF",
      validDays: 7,
      totalSteps: 4,
      questions: [
        {
          id: 'how_heard',
          question: 'How did you first hear about AttributeAI?',
          type: 'multiple_choice',
          options: [
            'Google Search',
            'Social Media',
            'Friend/Colleague Recommendation', 
            'Industry Blog/Article',
            'Other'
          ]
        },
        {
          id: 'primary_goal',
          question: "What's your primary goal with AttributeAI?",
          type: 'multiple_choice',
          options: [
            'Improve SEO Performance',
            'Track Marketing Attribution',
            'Generate Better Content',
            'Analyze Competitor Strategies',
            'Other'
          ]
        },
        {
          id: 'rating',
          question: 'Rate your first impression (1-5 stars)',
          type: 'star_rating',
          max: 5
        },
        {
          id: 'feedback',
          question: 'Any immediate feedback? (Optional)',
          type: 'text',
          optional: true
        }
      ]
    },
    early_feedback: {
      title: "Your Feedback = 30% Savings! 💰",
      subtitle: "2-minute survey, big discount",
      discount: "30% OFF",
      validDays: 10,
      totalSteps: 4,
      questions: [
        {
          id: 'features_used',
          question: 'Which features have you used?',
          type: 'multiple_select',
          options: [
            'SEO Analysis',
            'Keyword Intelligence', 
            'Content Generation',
            'Attribution Tracking',
            'Competitor Analysis',
            'Lead Magnet Generator'
          ]
        },
        {
          id: 'working_well',
          question: "What's working well for you?",
          type: 'text'
        },
        {
          id: 'improvements',
          question: 'What could be improved?',
          type: 'text'
        },
        {
          id: 'nps',
          question: 'How likely are you to recommend AttributeAI? (1-10)',
          type: 'nps_scale',
          min: 1,
          max: 10
        }
      ]
    },
    power_user: {
      title: "Power User Bonus - 40% OFF! ⭐",
      subtitle: "You're amazing! Quick survey for huge savings",
      discount: "40% OFF",
      validDays: 14,
      totalSteps: 4,
      questions: [
        {
          id: 'favorite_feature',
          question: "You've used 5+ tools! What's your favorite feature?",
          type: 'text'
        },
        {
          id: 'results_achieved',
          question: 'What results have you achieved?',
          type: 'multiple_choice',
          options: [
            'Improved SEO Rankings',
            'Better Content Performance',
            'Increased Traffic',
            'Better Attribution Insights',
            'Time Savings',
            'Other'
          ]
        },
        {
          id: 'missing_features',
          question: 'What features are missing?',
          type: 'text'
        },
        {
          id: 'enterprise_interest',
          question: 'Interest in team/enterprise features?',
          type: 'yes_no'
        }
      ]
    },
    pre_trial_end: {
      title: "Last Chance - 50% OFF! 🔥",
      subtitle: "Help us improve before you decide",
      discount: "50% OFF",
      validDays: 3,
      totalSteps: 4,
      questions: [
        {
          id: 'biggest_value',
          question: 'Biggest value received from AttributeAI?',
          type: 'multiple_choice',
          options: [
            'Better SEO Understanding',
            'Time-saving Content Creation',
            'Marketing Attribution Insights',
            'Competitive Intelligence',
            'Professional Tools Access',
            'Other'
          ]
        },
        {
          id: 'purchase_intent',
          question: 'How likely are you to subscribe? (1-5)',
          type: 'rating_scale',
          min: 1,
          max: 5,
          labels: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
        },
        {
          id: 'price_preference',
          question: 'What price would be most attractive?',
          type: 'multiple_choice',
          options: [
            '$29/month',
            '$49/month', 
            '$67/month',
            '$97/month',
            'Annual discount preferred'
          ]
        },
        {
          id: 'final_feedback',
          question: 'Final feedback before you decide?',
          type: 'text',
          optional: true
        }
      ]
    }
  };

  const handleSurveyStart = (surveyType) => {
    setCurrentSurvey(surveyType);
    setStep(1);
    setSurveyData({});
    setIsVisible(true);
  };

  const handleAnswerChange = (questionId, value) => {
    setSurveyData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const survey = surveys[currentSurvey];
    if (step < survey.totalSteps) {
      setStep(step + 1);
    } else {
      handleSurveyComplete();
    }
  };

  const handleSurveyComplete = () => {
    const survey = surveys[currentSurvey];
    const discountCode = generateDiscountCode(currentSurvey);
    
    // Save survey response
    const response = {
      surveyType: currentSurvey,
      completedAt: new Date().toISOString(),
      responses: surveyData,
      discountEarned: discountCode
    };
    
    localStorage.setItem(`attributeai_survey_${currentSurvey}`, JSON.stringify(response));
    
    // Update user metrics
    const userMetrics = JSON.parse(localStorage.getItem('attributeai_user_metrics') || '{}');
    userMetrics.surveysCompleted = userMetrics.surveysCompleted || [];
    userMetrics.discountsEarned = userMetrics.discountsEarned || [];
    
    if (!userMetrics.surveysCompleted.includes(currentSurvey)) {
      userMetrics.surveysCompleted.push(currentSurvey);
      userMetrics.discountsEarned.push(discountCode);
      localStorage.setItem('attributeai_user_metrics', JSON.stringify(userMetrics));
    }
    
    // Show success with discount code
    showSuccessModal(discountCode, survey.discount, survey.validDays);
    setIsVisible(false);
    setCurrentSurvey(null);
  };

  const generateDiscountCode = (surveyType) => {
    const codes = {
      first_impression: 'WELCOME20',
      early_feedback: 'FEEDBACK30',
      power_user: 'POWERUSER40',
      pre_trial_end: 'LASTCHANCE50'
    };
    return codes[surveyType] || 'SURVEY15';
  };

  const showSuccessModal = (code, discount, validDays) => {
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center animate-slideInFromRight">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p class="text-gray-600 mb-6">Your feedback helps us improve AttributeAI</p>
        
        <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg mb-6">
          <div class="text-2xl font-bold">${discount}</div>
          <div class="text-sm opacity-90">Code: ${code}</div>
          <div class="text-sm opacity-90">Valid for ${validDays} days</div>
        </div>
        
        <button onclick="this.parentElement.parentElement.remove()" 
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Continue to AttributeAI
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 10000);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'multiple_select':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value={option}
                  onChange={(e) => {
                    const current = surveyData[question.id] || [];
                    if (e.target.checked) {
                      handleAnswerChange(question.id, [...current, option]);
                    } else {
                      handleAnswerChange(question.id, current.filter(item => item !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'star_rating':
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  (surveyData[question.id] || 0) >= star 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
                onClick={() => handleAnswerChange(question.id, star)}
              />
            ))}
          </div>
        );
        
      case 'text':
        return (
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
            placeholder="Your answer..."
            value={surveyData[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );
        
      case 'yes_no':
        return (
          <div className="flex justify-center space-x-6">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-lg font-medium text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (!currentSurvey || !isVisible) {
    return null;
  }

  const survey = surveys[currentSurvey];
  const question = survey.questions[step - 1];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full animate-slideInFromRight">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {survey.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {survey.subtitle}
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg mt-4 text-center">
            <div className="font-bold text-lg">{survey.discount}</div>
            <div className="text-sm opacity-90">Valid for {survey.validDays} days</div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {step} of {survey.totalSteps}</span>
            <span>{Math.round((step / survey.totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / survey.totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-6">
            {question.question}
          </h4>
          
          {renderQuestion(question)}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!surveyData[question.id] && !question.optional}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {step === survey.totalSteps ? 'Complete Survey' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSurveySystem;