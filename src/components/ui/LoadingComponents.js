import React from 'react';
import { Loader, Brain, Zap } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {message && <span className="text-gray-600 text-sm">{message}</span>}
    </div>
  );
};

const FullPageLoader = ({ message = 'Loading AttributeAI...', subMessage = null }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Branding */}
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AttributeAI</h1>
          <p className="text-gray-600 text-sm">Marketing Attribution & Intelligence Platform</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <Zap className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
          <div className="text-lg font-medium text-gray-800 mb-2">{message}</div>
          {subMessage && <div className="text-sm text-gray-600">{subMessage}</div>}
        </div>

        {/* Progress Bar Animation */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="mt-8 text-xs text-gray-500">
          Preparing your marketing intelligence dashboard
        </div>
      </div>
    </div>
  );
};

const InlineLoader = ({ message = 'Processing...', color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    gray: 'text-gray-600'
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader className={`w-6 h-6 animate-spin ${colorClasses[color]} mx-auto mb-3`} />
        <div className="text-sm text-gray-600">{message}</div>
      </div>
    </div>
  );
};

const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

export { LoadingSpinner, FullPageLoader, InlineLoader, SkeletonLoader };
export default LoadingSpinner;