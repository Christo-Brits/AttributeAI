import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { signInWithProvider, socialProviders, resetPassword } from '../../lib/supabase';

const LoginPage = ({ onLoginSuccess, onSwitchToSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      setErrors({ resetEmail: 'Email is required' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setErrors({ resetEmail: 'Please enter a valid email address' });
      return;
    }
    
    try {
      await resetPassword(resetEmail);
      setResetEmailSent(true);
      setErrors({});
    } catch (error) {
      setErrors({ resetEmail: error.message || 'Failed to send reset email' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      onLoginSuccess?.();
    } catch (error) {
      // Improved error messaging with helpful suggestions
      let errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
      
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('email not found') ||
          error.message?.includes('user not found')) {
        errorMessage = "We didn't find that account. Want to sign up instead?";
        // Auto-suggest signup option
        setErrors({ 
          general: errorMessage,
          suggestSignup: true
        });
      } else if (error.message?.includes('wrong password') || 
                 error.message?.includes('invalid password')) {
        errorMessage = "Password doesn't match. Try again or reset your password.";
        setErrors({ 
          general: errorMessage,
          suggestReset: true
        });
      } else {
        setErrors({ 
          general: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    
    try {
      await signInWithProvider(provider);
      // The onAuthStateChange in AuthContext will handle the rest
    } catch (error) {
      setErrors({ 
        general: `Failed to sign in with ${socialProviders[provider].name}. Please try again.` 
      });
      console.error(`${provider} login error:`, error);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AttributeAI</h1>
          <p className="text-gray-400 text-sm">Marketing Intelligence Attribution</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-center text-sm">
            Sign in to access your marketing intelligence dashboard
          </p>
        </div>

        {/* Social Login Options - Direct Implementation */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-400 text-center mb-4">
            Quick sign in with your existing account
          </p>
          
          {/* Google Sign-In Button */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading === 'google'}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center space-x-3 shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="text-lg">🔗</span>
            <span>
              {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </span>
            {socialLoading === 'google' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
          </button>

          {/* GitHub Sign-In Button */}
          <button
            onClick={() => handleSocialLogin('github')}
            disabled={socialLoading === 'github'}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-xl hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center space-x-3 shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="text-lg">🐙</span>
            <span>
              {socialLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
            </span>
            {socialLoading === 'github' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
          </button>

          {/* Facebook Sign-In Button */}
          <button
            onClick={() => handleSocialLogin('facebook')}
            disabled={socialLoading === 'facebook'}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center space-x-3 shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="text-lg">📘</span>
            <span>
              {socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </span>
            {socialLoading === 'facebook' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
          </button>
        </div>

        {/* Social/Email Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-800 text-gray-400">or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Social Login Options */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading === 'google'}
              className="w-full bg-white text-gray-900 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium flex items-center justify-center space-x-3 shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === 'google' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
            
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-3 text-sm text-gray-400 bg-gray-800">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>
          </div>

          {errors.general && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-300 text-sm">{errors.general}</p>
                  {errors.suggestSignup && (
                    <button
                      type="button"
                      onClick={onSwitchToSignup}
                      className="mt-2 text-blue-300 hover:text-blue-200 underline text-sm"
                    >
                      Create new account instead →
                    </button>
                  )}
                  {errors.suggestReset && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="mt-2 text-blue-300 hover:text-blue-200 underline text-sm"
                    >
                      Reset password instead →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-600/50'
                }`}
                placeholder="your@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-gray-600/50'
                }`}
                placeholder="••••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign up for free
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-auto border border-gray-600/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Reset Password</h3>
              
              {resetEmailSent ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Reset link sent to <strong>{resetEmail}</strong>
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                      setResetEmail('');
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <p className="text-gray-400 text-sm mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <div className="mb-4">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="your@email.com"
                      required
                    />
                    {errors.resetEmail && (
                      <p className="mt-2 text-sm text-red-400">{errors.resetEmail}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail('');
                        setErrors({});
                      }}
                      className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;