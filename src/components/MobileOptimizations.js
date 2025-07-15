import React, { useState, useEffect, useCallback } from 'react';
import { useViewport } from '../hooks/useViewport';

/**
 * Enhanced Mobile Performance & UX Optimization Component
 * Provides advanced mobile features and optimizations for AttributeAI
 */
export const MobileOptimizationProvider = ({ children }) => {
  const { isMobile, isTablet } = useViewport();
  const [orientation, setOrientation] = useState('portrait');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [touchStartTime, setTouchStartTime] = useState(null);

  // Handle device orientation
  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
      
      // Store orientation for analytics
      if (isMobile) {
        localStorage.setItem('mobile_orientation', newOrientation);
      }
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    handleOrientationChange(); // Initial check

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Optimize scroll performance on mobile
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Add scroll-based optimizations here
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener('scroll', optimizeScroll, { passive: true });
    return () => document.removeEventListener('scroll', optimizeScroll);
  }, [isMobile]);

  // Prevent zoom on input focus (iOS)
  useEffect(() => {
    if (!isMobile) return;

    const preventZoom = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.target.style.fontSize = '16px';
      }
    };

    document.addEventListener('focusin', preventZoom);
    return () => document.removeEventListener('focusin', preventZoom);
  }, [isMobile]);

  return children;
};

/**
 * Enhanced Touch Feedback Component
 * Provides improved touch interactions for mobile users
 */
export const TouchFeedback = ({ children, onTouch, feedback = 'haptic' }) => {
  const [isTouching, setIsTouching] = useState(false);
  const { isMobile } = useViewport();

  const handleTouchStart = useCallback((e) => {
    if (!isMobile) return;
    
    setIsTouching(true);
    
    // Haptic feedback if supported
    if (feedback === 'haptic' && navigator.vibrate) {
      navigator.vibrate(10); // Very short vibration
    }
    
    // Add visual feedback
    e.target.style.transform = 'scale(0.98)';
    
    if (onTouch) onTouch(e);
  }, [isMobile, feedback, onTouch]);

  const handleTouchEnd = useCallback((e) => {
    if (!isMobile) return;
    
    setIsTouching(false);
    e.target.style.transform = 'scale(1)';
  }, [isMobile]);

  if (!isMobile) {
    return children;
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        transition: 'transform 0.1s ease',
        opacity: isTouching ? 0.8 : 1
      }}
    >
      {children}
    </div>
  );
};

/**
 * Mobile Performance Monitor
 * Tracks and optimizes performance metrics for mobile users
 */
export const MobilePerformanceMonitor = () => {
  const { isMobile } = useViewport();
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    if (!isMobile) return;

    const measurePerformance = () => {
      const metrics = {
        loadTime: performance.now(),
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
        } : null,
        connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
        timestamp: new Date().toISOString()
      };

      setPerformanceMetrics(metrics);
      
      // Store for analytics
      localStorage.setItem('mobile_performance', JSON.stringify(metrics));
    };

    // Measure on mount and periodically
    measurePerformance();
    const interval = setInterval(measurePerformance, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  return null; // This is a monitoring component
};

/**
 * Offline Support Component
 * Handles offline functionality for mobile users
 */
export const OfflineSupport = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const { isMobile } = useViewport();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process offline queue
      if (offlineQueue.length > 0) {
        console.log('Processing offline queue:', offlineQueue.length, 'items');
        // Here you would implement offline sync logic
        setOfflineQueue([]);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue]);

  if (!isOnline && isMobile) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#fbbf24',
        color: '#92400e',
        padding: '0.5rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        zIndex: 9999
      }}>
        📡 You're offline. Some features may be limited.
      </div>
    );
  }

  return children;
};

/**
 * Mobile Analytics Hook
 * Provides enhanced analytics specifically for mobile users
 */
export const useMobileAnalytics = () => {
  const { isMobile, isTablet, width, height } = useViewport();

  const trackMobileEvent = useCallback((event, data = {}) => {
    if (!isMobile && !isTablet) return;

    const mobileData = {
      ...data,
      device_type: isMobile ? 'mobile' : 'tablet',
      screen_width: width,
      screen_height: height,
      orientation: height > width ? 'portrait' : 'landscape',
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent.substring(0, 100)
    };

    // Store in localStorage for now (would integrate with actual analytics)
    const existingEvents = JSON.parse(localStorage.getItem('mobile_analytics') || '[]');
    existingEvents.push({ event, data: mobileData });
    
    // Keep only last 100 events
    if (existingEvents.length > 100) {
      existingEvents.splice(0, existingEvents.length - 100);
    }
    
    localStorage.setItem('mobile_analytics', JSON.stringify(existingEvents));
    
    console.log('📱 Mobile Analytics:', event, mobileData);
  }, [isMobile, isTablet, width, height]);

  return { trackMobileEvent };
};

/**
 * Mobile Navigation Gestures
 * Provides swipe and gesture support for mobile navigation
 */
export const useMobileGestures = (onSwipeLeft, onSwipeRight) => {
  const { isMobile } = useViewport();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = useCallback((e) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [isMobile]);

  const onTouchMove = useCallback((e) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [isMobile]);

  const onTouchEndHandler = useCallback(() => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  }, [isMobile, touchStart, touchEnd, onSwipeLeft, onSwipeRight]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd: onTouchEndHandler
  };
};

/**
 * PWA Features for Mobile
 * Adds Progressive Web App functionality
 */
export const PWAFeatures = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { isMobile } = useViewport();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt for mobile users after some time
      if (isMobile) {
        setTimeout(() => setShowInstallPrompt(true), 10000); // After 10 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt || !isMobile) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem',
      borderRadius: '12px',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <div>
        <strong>Install AttributeAI</strong>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
          Add to home screen for quick access
        </p>
      </div>
      <div>
        <button
          onClick={handleInstallClick}
          style={{
            background: 'white',
            color: '#667eea',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 600,
            marginRight: '0.5rem'
          }}
        >
          Install
        </button>
        <button
          onClick={() => setShowInstallPrompt(false)}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '0.5rem',
            borderRadius: '6px'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Export everything as a comprehensive mobile optimization suite
export default {
  MobileOptimizationProvider,
  TouchFeedback,
  MobilePerformanceMonitor,
  OfflineSupport,
  PWAFeatures,
  useMobileAnalytics,
  useMobileGestures
};