// AttributeAI Design System - Core Components
// This file establishes consistent styling across all components

import React from 'react';

// ============================================================================
// DESIGN TOKENS
// ============================================================================

export const designTokens = {
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main brand blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    
    // Secondary Colors by Function
    success: {
      50: '#f0fdf4',
      500: '#10b981',
      600: '#059669',
      700: '#047857'
    },
    
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706'
    },
    
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626'
    },
    
    // Grays
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem'   // 64px
  },
  
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem'       // 16px
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
};

// ============================================================================
// BASE COMPONENTS
// ============================================================================

// Button Component
export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  icon: Icon = null,
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 
    disabled:cursor-not-allowed relative overflow-hidden
  `;
  
  const variants = {
    primary: `
      bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500
      border border-transparent shadow-sm
    `,
    secondary: `
      bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500
      border border-gray-300
    `,
    success: `
      bg-green-600 text-white hover:bg-green-700 focus:ring-green-500
      border border-transparent shadow-sm
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
      border border-transparent shadow-sm
    `,
    outline: `
      bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500
      border border-blue-600
    `,
    ghost: `
      bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500
      border border-transparent
    `
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </span>
    </button>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '',
  padding = 'lg',
  shadow = 'md',
  hover = false
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5', 
    lg: 'p-6',
    xl: 'p-8'
  };
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 
      ${shadowClasses[shadow]} ${paddingClasses[padding]} ${hoverClass} ${className}
    `}>
      {children}
    </div>
  );
};

// Progress Indicator Component
export const ProgressIndicator = ({ 
  steps, 
  currentStep, 
  variant = 'dots',
  className = '' 
}) => {
  if (variant === 'dots') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index < currentStep
                ? 'bg-green-500'
                : index === currentStep
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
            title={step}
          />
        ))}
      </div>
    );
  }
  
  // Progress bar variant
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Step {currentStep + 1} of {steps.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Loading Skeleton Component
export const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${width} ${height} ${className}`} />
  );
};

export default {
  designTokens,
  Button,
  Card,
  ProgressIndicator,
  Skeleton
};