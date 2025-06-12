import React from 'react';

const AttributeAILogoDark = ({ 
  width = 200, 
  height = 50, 
  className = '', 
  showText = true,
  variant = 'horizontal' // 'horizontal', 'icon-only', 'stacked'
}) => {
  const iconSize = variant === 'icon-only' ? width : height;
  
  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 96 96" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Hexagonal Icon - White version */}
          <g>
            {/* Outer hexagon frame */}
            <path 
              d="M48 8L72 22V54L48 68L24 54V22L48 8Z" 
              stroke="white" 
              strokeWidth="3" 
              fill="none"
            />
            
            {/* Inner geometric pattern */}
            <path 
              d="M32 32L48 24L64 32V48L48 56L32 48V32Z" 
              stroke="white" 
              strokeWidth="2.5" 
              fill="none"
            />
            
            {/* A Letter */}
            <path 
              d="M40 44L48 28L56 44M42 40H54" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 96 96" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm mb-2"
        >
          <path 
            d="M48 8L72 22V54L48 68L24 54V22L48 8Z" 
            stroke="white" 
            strokeWidth="3" 
            fill="none"
          />
          <path 
            d="M32 32L48 24L64 32V48L48 56L32 48V32Z" 
            stroke="white" 
            strokeWidth="2.5" 
            fill="none"
          />
          <path 
            d="M40 44L48 28L56 44M42 40H54" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        {showText && (
          <div className="text-center text-white">
            <div className="font-bold text-lg tracking-tight">AttributeAI</div>
            <div className="text-xs text-gray-300 mt-1">Marketing Intelligence</div>
          </div>
        )}
      </div>
    );
  }

  // Default horizontal layout
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width={height} 
        height={height} 
        viewBox="0 0 96 96" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Hexagonal Icon */}
        <g>
          {/* Outer hexagon frame */}
          <path 
            d="M48 8L72 22V54L48 68L24 54V22L48 8Z" 
            stroke="white" 
            strokeWidth="3" 
            fill="none"
          />
          
          {/* Inner geometric pattern */}
          <path 
            d="M32 32L48 24L64 32V48L48 56L32 48V32Z" 
            stroke="white" 
            strokeWidth="2.5" 
            fill="none"
          />
          
          {/* A Letter */}
          <path 
            d="M40 44L48 28L56 44M42 40H54" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>
      </svg>
      
      {showText && (
        <div className="ml-3 text-white">
          <div className="font-bold text-xl tracking-tight">AttributeAI</div>
          <div className="text-xs text-gray-300 -mt-1">Marketing Intelligence Attribution</div>
        </div>
      )}
    </div>
  );
};

export default AttributeAILogoDark;