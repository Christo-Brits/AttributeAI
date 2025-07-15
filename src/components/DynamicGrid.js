import React from 'react';
import { useViewport } from '../hooks/useViewport';

const DynamicGrid = ({ 
  children, 
  minCardWidth = 300, 
  className = '',
  gap = 'responsive' // 'responsive', 'small', 'medium', 'large'
}) => {
  const { width, isMobile, isTablet } = useViewport();
  
  const getColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (width < 1200) return 2;
    return Math.floor(width / minCardWidth) || 3;
  };

  const getGap = () => {
    if (gap === 'small') return isMobile ? '0.5rem' : '1rem';
    if (gap === 'medium') return isMobile ? '1rem' : '1.5rem';
    if (gap === 'large') return isMobile ? '1.5rem' : '2rem';
    // responsive default
    return isMobile ? '1rem' : '1.5rem';
  };

  return (
    <div 
      className={`dynamic-card-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
        gap: getGap(),
        padding: isMobile ? '1rem' : '1.5rem'
      }}
    >
      {children}
    </div>
  );
};

export default DynamicGrid;
