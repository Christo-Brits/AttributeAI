import React, { useState } from 'react';
import { Mail, Lock, User, Globe, Eye, EyeOff, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { signInWithProvider, socialProviders, signUpWithEmailVerification } from '../../lib/supabase';
import GoogleAdsTracking from '../../utils/GoogleAdsTracking';
import EmailVerificationPage from './EmailVerificationPage';

const SignupPage = ({ onSignupSuccess, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    website: '',
    industry: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Only use Supabase - no fallback to demo mode
      await signUpWithEmailVerification(formData.email, formData.password, {
        full_name: `${formData.firstName} ${formData.lastName}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        website: formData.website,
        industry: formData.industry
      });
      
      setEmailSent(true);
      
      // Track signup conversion in Google Ads
      GoogleAdsTracking.trackSignup('freemium', 0);
      
      // Track trial start (14-day free trial)
      GoogleAdsTracking.trackTrialStart('growth');
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ 
        general: error.message || 'Failed to create account. Please check your database setup.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    setSocialLoading(provider);
    
    try {
      await signInWithProvider(provider);
      // The onAuthStateChange in AuthContext will handle the rest
    } catch (error) {
      setErrors({ 
        general: `Failed to sign up with ${socialProviders[provider].name}. Please try again.` 
      });
      console.error(`${provider} signup error:`, error);
    } finally {
      setSocialLoading(null);
    }
  };

  if (emailSent) {
    return (
      <EmailVerificationPage
        email={formData.email}
        onBackToSignup={() => setEmailSent(false)}
        onResendSuccess={() => {
          console.log('✅ Verification email resent to:', formData.email);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join AttributeAI</h1>
          <p className="text-gray-400 text-sm">Start your free marketing intelligence journey</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-400 text-center text-sm">
            Get started with 100 free keyword analyses per month
          </p>
        </div>

        {/* Social Signup Options - Temporarily Disabled */}
        {false && (
        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-400 text-center mb-4">
            Quick signup with your existing account
          </p>
          
          {Object.entries(socialProviders).map(([provider, config]) => (
            <button
              key={provider}
              onClick={() => handleSocialSignup(provider)}
              disabled={socialLoading === provider}
              className={`w-full bg-gradient-to-r ${config.color} text-white py-3 rounded-xl hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center space-x-3 shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              <span className="text-lg">{config.icon}</span>
              <span>
                {socialLoading === provider ? 'Connecting...' : `Continue with ${config.name}`}
              </span>
              {socialLoading === provider && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            </button>
          ))}
        </div>
        )}

        {/* Removed divider since social login is disabled */}
        {false && (
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-800 text-gray-400">or sign up with email</span>
          </div>
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{errors.general}</p>
            </div>
          )}
          
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm ${
                  errors.firstName ? 'border-red-500' : 'border-gray-600/50'
                }`}
                placeholder="John"
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm ${
                  errors.lastName ? 'border-red-500' : 'border-gray-600/50'
                }`}
                placeholder="Doe"
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-9 pr-4 py-2.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-600/50'
                }`}
                placeholder="your@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-9 pr-10 py-2.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                  placeholder="8+ characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-9 pr-10 py-2.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Company (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-sm"
                placeholder="Your Company"
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
            />
            <label className="text-xs text-gray-300">
              I agree to the{' '}
              <a href="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-400">{errors.agreeToTerms}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;