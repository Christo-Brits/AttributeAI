import React from 'react';
import { useViewport } from '../hooks/useViewport';

/**
 * Mobile Status Indicator
 * Shows users when they're in mobile mode and provides mobile-specific info
 */
export const MobileStatusIndicator = ({ show = true }) => {
  const { isMobile, isTablet, width, height } = useViewport();

  if (!show || (!isMobile && !isTablet)) {
    return null;
  }

  const deviceType = isMobile ? 'Mobile' : 'Tablet';
  const orientation = height > width ? 'Portrait' : 'Landscape';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px', // Above bottom tabs
        right: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 500,
        zIndex: 998,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <span style={{ fontSize: '1rem' }}>📱</span>
      <span>{deviceType} • {orientation}</span>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileStatusIndicator;