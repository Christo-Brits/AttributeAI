// AttributeAI Clarity Dark Theme Design System
// Based on modern dark UI with blue/purple/pink gradients

import React from 'react';

// ============================================================================
// CLARITY DARK THEME TOKENS
// ============================================================================

export const clarityTheme = {
  colors: {
    // Base Colors - Dark Theme
    background: {
      primary: '#0a0b0f',     // Main dark background
      secondary: '#111218',   // Slightly lighter dark
      tertiary: '#1a1b23',    // Card backgrounds
      elevated: '#252730',    // Elevated cards/modals
    },
    
    // Brand Colors - Electric Blue Primary
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',   // Main primary blue
      500: '#3b82f6',   // Core brand blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Secondary Colors - Purple Gradients
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',   // Core purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },

    // Accent Colors - Electric Pink
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',   // Main accent pink
      500: '#ec4899',   // Core accent
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },

    // Text Colors
    text: {
      primary: '#ffffff',     // Pure white for headers
      secondary: '#e5e7eb',   // Light gray for body text
      tertiary: '#9ca3af',    // Medium gray for captions
      quaternary: '#6b7280',  // Darker gray for subtle text
      inverse: '#111218',     // Dark text for light backgrounds
    },

    // Border Colors
    border: {
      primary: '#374151',     // Subtle borders
      secondary: '#4b5563',   // Stronger borders
      accent: '#60a5fa',      // Blue accent borders
      focus: '#3b82f6',       // Focus ring color
    },

    // Status Colors
    success: {
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
    },
    warning: {
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
    },

    // Gradient Definitions
    gradients: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
      primarySubtle: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #be185d 100%)',
      blue: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      purple: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
      pink: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
      surface: 'linear-gradient(135deg, #1a1b23 0%, #252730 100%)',
    }
  },

  // Spacing Scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
    '5xl': '3rem',    // 48px
    '6xl': '4rem',    // 64px
  },

  // Border Radius
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',   // Full round
  },

  // Shadows - Enhanced for dark theme
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.3)',
    glowPink: '0 0 20px rgba(236, 72, 153, 0.3)',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
  },
};

// ============================================================================
// ENHANCED BUTTON COMPONENT - CLARITY THEME
// ============================================================================

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white 
      hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500
      border border-transparent backdrop-blur-sm
    `,
    secondary: `
      bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600
      hover:from-gray-700 hover:to-gray-600 hover:shadow-lg hover:shadow-gray-500/25
      focus:ring-gray-500
    `,
    outline: `
      bg-transparent text-gray-300 border border-gray-600 
      hover:bg-gray-800 hover:text-white hover:border-blue-500
      focus:ring-blue-500 hover:shadow-lg hover:shadow-blue-500/10
    `,
    ghost: `
      bg-transparent text-gray-300 border-transparent
      hover:bg-gray-800 hover:text-white focus:ring-gray-500
    `,
    success: `
      bg-gradient-to-r from-green-600 to-emerald-600 text-white
      hover:shadow-lg hover:shadow-green-500/25 focus:ring-green-500
      border border-transparent
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-pink-600 text-white
      hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500
      border border-transparent
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================================================
// ENHANCED CARD COMPONENT - CLARITY THEME
// ============================================================================

export const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  hover = true,
  glow = false,
  ...props 
}) => {
  const baseClasses = `
    bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl
    border border-gray-700/50 rounded-xl transition-all duration-300
    ${hover ? 'hover:border-gray-600/50 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1' : ''}
    ${glow ? 'shadow-lg shadow-blue-500/10' : ''}
  `;

  const variants = {
    default: '',
    elevated: 'shadow-xl shadow-black/30 bg-gradient-to-br from-gray-800/95 to-gray-700/95',
    accent: 'border-blue-500/30 shadow-lg shadow-blue-500/10',
    success: 'border-green-500/30 shadow-lg shadow-green-500/10',
    warning: 'border-yellow-500/30 shadow-lg shadow-yellow-500/10',
    danger: 'border-red-500/30 shadow-lg shadow-red-500/10',
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// ENHANCED PROGRESS INDICATOR - CLARITY THEME
// ============================================================================

export const ProgressIndicator = ({ 
  progress = 0, 
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'from-blue-600 via-purple-600 to-pink-600',
    secondary: 'from-gray-600 to-gray-500',
    success: 'from-green-600 to-emerald-600',
    warning: 'from-yellow-600 to-orange-600',
    danger: 'from-red-600 to-pink-600',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className={`bg-gray-800 rounded-full ${sizes[size]} overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${variants[variant]} rounded-full transition-all duration-500 ease-out relative`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
      {showLabel && (
        <div className="mt-2 text-sm text-gray-400 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GRADIENT TEXT UTILITY
// ============================================================================

export const GradientText = ({ children, gradient = 'primary', className = '', ...props }) => {
  const gradients = {
    primary: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
    blue: 'bg-gradient-to-r from-blue-400 to-cyan-400',
    purple: 'bg-gradient-to-r from-purple-400 to-pink-400',
    success: 'bg-gradient-to-r from-green-400 to-emerald-400',
  };

  return (
    <span
      className={`${gradients[gradient]} bg-clip-text text-transparent font-semibold ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// ============================================================================
// ENHANCED INPUT COMPONENT - CLARITY THEME
// ============================================================================

export const Input = ({
  type = 'text',
  placeholder = '',
  className = '',
  error = false,
  success = false,
  ...props
}) => {
  const baseClasses = `
    w-full px-4 py-3 bg-gray-900/80 border rounded-lg backdrop-blur-sm
    text-white placeholder-gray-400 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
  `;

  const stateClasses = error
    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
    : success
    ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/50'
    : 'border-gray-700/50 focus:border-blue-500 focus:ring-blue-500/50 hover:border-gray-600/50';

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${baseClasses} ${stateClasses} ${className}`}
      {...props}
    />
  );
};

// ============================================================================
// BADGE COMPONENT - CLARITY THEME
// ============================================================================

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    primary: 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border-blue-500/30',
    success: 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border-green-500/30',
    warning: 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border-red-500/30',
    new: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow-lg shadow-pink-500/25',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center border rounded-full font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default {
  Button,
  Card,
  ProgressIndicator,
  GradientText,
  Input,
  Badge,
  clarityTheme,
};
