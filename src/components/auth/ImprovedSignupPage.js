import React, { useState } from 'react';
import { ArrowRight, Mail, Chrome, Shield, Zap, Check } from 'lucide-react';
import { useImprovedAuth } from './ImprovedAuthContext';

const ImprovedSignupPage = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('magic'); // 'magic', 'google', 'password'
  
  const { signInWithMagicLink, signInWithGoogle, signUpWithPassword } = useImprovedAuth();

  const handleMagicLinkSignup = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    const result = await signInWithMagicLink(email);
    
    if (result.success) {
      setMessage(result.message);
      
      // Track conversion event
      if (window.gtag) {
        window.gtag('event', 'sign_up_attempt', {
          method: 'magic_link',
          email: email
        });
      }
      
      // Auto-complete after 3 seconds to show success
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    const result = await signInWithGoogle();
    
    if (result.success) {
      setMessage('Redirecting to Google...');
      
      // Track conversion event
      if (window.gtag) {
        window.gtag('event', 'sign_up_attempt', {
          method: 'google_oauth'
        });
      }
    } else {
      setError(result.error || 'Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join AttributeAI
          </h1>
          <p className="text-gray-300">
            Start your unlimited keyword research journey
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-black/20 rounded-xl p-6 mb-6 backdrop-blur-sm border border-gray-700">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-400" />
            What you get instantly:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span>Unlimited keyword research (no credits needed)</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span>Multi-AI analysis (Claude + GPT-4 + Gemini)</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span>Attribution intelligence & revenue tracking</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span>Free forever plan + premium trial</span>
            </div>
          </div>
        </div>

        {/* Main Signup Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          {/* Quick Signup Methods */}
          <div className="space-y-4 mb-6">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <Chrome className="h-5 w-5" />
              <span>Continue with Google</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">or use email</span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLinkSignup} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="text-center text-xs text-gray-400 space-y-2">
            <p>✅ No credit card required • ✅ Cancel anytime • ✅ GDPR compliant</p>
            <p>🔒 Secure authentication • 📧 Passwordless login • ⚡ Instant access</p>
          </div>
        </div>

        {/* Competitive Positioning */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Join <span className="text-white font-semibold">130+ marketers</span> who switched from expensive, limited tools to unlimited AttributeAI
          </p>
        </div>

        {/* Alternative Methods (Expandable) */}
        <div className="mt-6">
          <button 
            onClick={() => setSelectedMethod(selectedMethod === 'password' ? 'magic' : 'password')}
            className="text-gray-400 text-sm underline hover:text-white transition-colors"
          >
            {selectedMethod === 'password' ? 'Use magic link instead' : 'Prefer password? Click here'}
          </button>
          
          {selectedMethod === 'password' && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-sm mb-3">
                Traditional email + password signup (less secure)
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Create password"
                  className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <button className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                  Create Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImprovedSignupPage;
