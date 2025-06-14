import React, { useState } from 'react';
import { Mail, Lock, Globe, User, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import AttributeAILogo from './ui/AttributeAILogo';

const LoginPage = ({ onLogin }) => {
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    website: '',
    businessName: '',
    industry: '',
    rememberMe: false
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = isSignUp ? await signup(formData) : await login(formData);
      
      if (result.success) {
        // Call the parent callback with user data
        if (onLogin) {
          const userData = {
            email: formData.email,
            businessName: formData.businessName,
            industry: formData.industry,
            website: formData.website,
            userProfile: {
              firstName: formData.businessName?.split(' ')[0] || 'Demo',
              lastName: formData.businessName?.split(' ')[1] || 'User',
              company: formData.businessName || 'Demo Company',
              industry: formData.industry || 'Professional Services',
              websiteUrl: formData.website || '',
              email: formData.email
            }
          };
          onLogin(userData);
        }
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Login error:', err);
    }
    
    setIsLoading(false);
  };

  // Demo login for testing
  const handleDemoLogin = () => {
    const demoData = {
      email: 'demo@attributeai.app',
      password: 'demo123',
      businessName: 'Demo Marketing Agency',
      industry: 'Professional Services',
      website: 'https://demo-agency.com',
      rememberMe: true
    };
    setFormData(demoData);
    // Auto-submit with demo data
    setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-3">
              <AttributeAILogo size={40} />
              <span className="text-2xl font-bold text-white">AttributeAI</span>
            </div>
            <p className="text-blue-400 text-sm mt-2">Marketing Intelligence</p>
          </div>
          <p className="text-gray-300 text-lg">
            {isSignUp ? 'Start Your Free Analysis' : 'Welcome Back'}
          </p>
        </div>

        {/* Demo Login Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transform"
          >
            <Check className="h-5 w-5" />
            <span>Quick Demo Login</span>
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Skip the form and try the platform instantly
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-800 text-gray-400">or continue with your account</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-red-300 text-sm">{error}</p>
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
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                    placeholder="Your Business Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                    placeholder="https://yourwebsite.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white backdrop-blur-sm transition-all duration-200"
                  required
                >
                  <option value="" className="bg-gray-800">Select your industry</option>
                  <option value="Home Services" className="bg-gray-800">Home Services</option>
                  <option value="E-commerce" className="bg-gray-800">E-commerce</option>
                  <option value="SaaS & Technology" className="bg-gray-800">SaaS & Technology</option>
                  <option value="Professional Services" className="bg-gray-800">Professional Services</option>
                  <option value="Healthcare" className="bg-gray-800">Healthcare</option>
                  <option value="Real Estate" className="bg-gray-800">Real Estate</option>
                  <option value="Finance" className="bg-gray-800">Finance</option>
                  <option value="Education" className="bg-gray-800">Education</option>
                  <option value="Travel & Hospitality" className="bg-gray-800">Travel & Hospitality</option>
                  <option value="Manufacturing" className="bg-gray-800">Manufacturing</option>
                  <option value="Retail" className="bg-gray-800">Retail</option>
                  <option value="Non-profit" className="bg-gray-800">Non-profit</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 bg-gray-700 border-gray-600 rounded transition-colors"
              />
              <label className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            {!isSignUp && (
              <button 
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:scale-105 transform"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>By continuing, you agree to our 
            <button className="text-blue-400 hover:text-blue-300 mx-1">Terms of Service</button>
            and 
            <button className="text-blue-400 hover:text-blue-300 mx-1">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;