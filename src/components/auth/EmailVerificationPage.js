import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { resendEmailVerification } from '../../lib/supabase';

const EmailVerificationPage = ({ email, onBackToSignup, onResendSuccess }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');
    
    try {
      await resendEmailVerification(email);
      setResendMessage('✅ Verification email sent! Check your inbox.');
      if (onResendSuccess) onResendSuccess();
    } catch (error) {
      setResendMessage('❌ Failed to resend email. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-gray-300">
            We've sent a verification link to
          </p>
          <p className="text-blue-400 font-semibold mt-1">{email}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3 text-gray-300">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Click the verification link in your email</span>
          </div>
          <div className="flex items-start space-x-3 text-gray-300">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Return to this page after verifying</span>
          </div>
          <div className="flex items-start space-x-3 text-gray-300">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Start your 14-day free trial!</span>
          </div>
        </div>

        {/* Email not received section */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-2">Didn't receive the email?</h3>
          <ul className="text-gray-300 text-sm space-y-1 mb-4">
            <li>• Check your spam/junk folder</li>
            <li>• Wait 2-3 minutes for delivery</li>
            <li>• Add no-reply@supabase.io to your contacts</li>
          </ul>
          
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Sending...' : 'Resend Verification Email'}</span>
          </button>
          
          {resendMessage && (
            <p className="text-center mt-2 text-sm text-gray-300">{resendMessage}</p>
          )}
        </div>

        {/* Back to signup */}
        <div className="text-center">
          <button
            onClick={onBackToSignup}
            className="text-gray-400 hover:text-white flex items-center justify-center space-x-2 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign Up</span>
          </button>
        </div>

        {/* Pro tip */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <p className="text-purple-300 text-sm text-center">
            💡 <strong>Pro tip:</strong> Add our emails to your allowlist to ensure you receive important updates about your AttributeAI account!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
