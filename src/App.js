import React, { lazy, Suspense, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { ImprovedAuthProvider } from './components/auth/ImprovedAuthContext';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import { FullPageLoader, LoadingSpinner } from './components/ui/LoadingComponents';
import AuthCallback from './components/auth/AuthCallback';

// Security imports - YC Production Ready
import envValidator from './utils/EnvironmentValidator';
import secureStorage from './utils/SecureStorage';

// Mobile optimization imports
import { useViewport } from './hooks/useViewport';
import MobileNavigation from './components/MobileNavigation';
import MobileUnifiedDashboard from './components/MobileUnifiedDashboard';
import { 
  MobileOptimizationProvider, 
  TouchFeedback, 
  MobilePerformanceMonitor, 
  OfflineSupport, 
  PWAFeatures 
} from './components/MobileOptimizations';

// Core components - Load immediately for better UX
import SidebarNavigation from './components/SidebarNavigation';
import UnifiedDashboard from './components/UnifiedDashboard';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/EnhancedSignupPage';
import LandingPage from './components/LandingPage';
import AccountPage from './components/AccountPage';
import SuccessPage from './components/SuccessPage';
import UpgradePage from './components/UpgradePage';
import FloatingChatButton from './components/FloatingChatButton';
import { useAttributeAIAnalytics } from './hooks/useAttributeAIAnalytics';
import { ConversionManager } from './components/immediate-conversion-system';
import ConversionTracker, { initializeFunnelTracking } from './utils/ConversionTracker';

// Survey & Discount System
import { useSurveyManager, SurveyDisplay } from './components/surveys/SurveyIntegration';
import UserSurveySystem from './components/surveys/UserSurveySystem';

// Optimized lazy loading with performance tracking
const createLazyComponent = (importFunc, componentName) => {
  const LazyComponent = lazy(() => {
    const startTime = performance.now();
    return importFunc().then(module => {
      const loadTime = performance.now() - startTime;
      if (loadTime > 500) {
        console.warn(`⚠️ Slow component load: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }
      return module;
    });
  });
  LazyComponent.displayName = componentName;
  return LazyComponent;
};

// Priority-based lazy loading
const UserAnalyticsDashboard = createLazyComponent(
  () => import('./components/UserAnalyticsDashboard'), 
  'UserAnalyticsDashboard'
);

const KeywordIntelligenceEngine = createLazyComponent(
  () => import('./components/KeywordIntelligenceEngine'), 
  'KeywordIntelligenceEngine'
);

const SEOAnalysisEnhanced = createLazyComponent(
  () => import('./components/SEOCompetitorAnalysis.enhanced'), 
  'SEOAnalysisEnhanced'
);

const AttributionEngine = createLazyComponent(
  () => import('./components/AttributionEngine'), 
  'AttributionEngine'
);

const EnhancedContentGenerator = createLazyComponent(
  () => import('./components/EnhancedContentGenerator'), 
  'EnhancedContentGenerator'
);

const ContentOptimizationEngine = createLazyComponent(
  () => import('./components/ContentOptimizationEngine'), 
  'ContentOptimizationEngine'
);

const SEOContentStrategist = createLazyComponent(
  () => import('./components/SEOContentStrategist.enhanced'), 
  'SEOContentStrategist'
);

const CompetitorAnalysisEngine = createLazyComponent(
  () => import('./components/CompetitorAnalysisEngine'), 
  'CompetitorAnalysisEngine'
);

const LocalSEOMatrixGenerator = createLazyComponent(
  () => import('./components/LocalSEOMatrixGenerator'), 
  'LocalSEOMatrixGenerator'
);

const EnhancedContentClusterGenerator = createLazyComponent(
  () => import('./components/EnhancedContentClusterGenerator'), 
  'EnhancedContentClusterGenerator'
);

const RealTimeJourneyTracker = createLazyComponent(
  () => import('./components/RealTimeJourneyTracker'), 
  'RealTimeJourneyTracker'
);

const JourneyAnalytics = createLazyComponent(
  () => import('./components/JourneyAnalytics'), 
  'JourneyAnalytics'
);

const LeadMagnetGenerator = createLazyComponent(
  () => import('./components/LeadMagnetGenerator'), 
  'LeadMagnetGenerator'
);

const CROAnalyzer = createLazyComponent(
  () => import('./components/CROAnalyzer'), 
  'CROAnalyzer'
);

const PublishingDashboard = createLazyComponent(
  () => import('./components/PublishingDashboard'), 
  'PublishingDashboard'
);

const ContentScheduler = createLazyComponent(
  () => import('./components/ContentScheduler'), 
  'ContentScheduler'
);

const CRMDashboard = createLazyComponent(
  () => import('./components/crm/CRMDashboard'), 
  'CRMDashboard'
);

const ContactManager = createLazyComponent(
  () => import('./components/crm/ContactManager'), 
  'ContactManager'
);

const DealPipeline = createLazyComponent(
  () => import('./components/crm/DealPipeline'), 
  'DealPipeline'
);

const RevenueAttribution = createLazyComponent(
  () => import('./components/crm/RevenueAttribution'), 
  'RevenueAttribution'
);

const EmailSequenceBuilder = createLazyComponent(
  () => import('./components/email/EmailSequenceBuilder'), 
  'EmailSequenceBuilder'
);

const EmailAnalytics = createLazyComponent(
  () => import('./components/email/EmailAnalytics'), 
  'EmailAnalytics'
);

const AnalyticsDashboard = createLazyComponent(
  () => import('./components/AnalyticsDashboard'), 
  'AnalyticsDashboard'
);

const AutomatedSignupPrompts = createLazyComponent(
  () => import('./components/AutomatedSignupPrompts'), 
  'AutomatedSignupPrompts'
);

// Enhanced loading component
const ComponentLoader = ({ componentName }) => (
  <FullPageLoader 
    message={`Loading ${componentName || 'Component'}...`}
    subMessage="Preparing your marketing intelligence tools"
  />
);

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [websiteAnalysisResults, setWebsiteAnalysisResults] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, updateUser } = useAuth();
  
  // Mobile optimization
  const { isMobile, isTablet, isDesktop } = useViewport();
  
  const { trackFeatureClick, trackButtonClick, analytics } = useAttributeAIAnalytics('main_app');

  const {
    surveyTriggers,
    userMetrics,
    trackToolUsage,
    trackSession,
    checkSurveyTriggers,
    completeSurvey,
    generateDiscountCode
  } = useSurveyManager();

  useEffect(() => {
    // SECURITY: Environment validation on startup
    const envReport = envValidator.validateOnStartup();
    if (!envReport.summary.ready && process.env.NODE_ENV === 'production') {
      console.error('❌ Production environment validation failed');
    }
    
    if (!sessionStorage.getItem('session_initialized')) {
      sessionStorage.setItem('session_initialized', 'true');
      
      analytics.trackFunnelStep('app_initialized', {
        'user_authenticated': !!user,
        'user_type': user ? 'registered' : 'guest',
        'initial_view': currentView,
        'has_previous_session': !!secureStorage.getItem('session_count'),
        'environment_valid': envReport.summary.ready
      });
    }

    const sessionCount = (secureStorage.getItem('session_count') || 0) + 1;
    secureStorage.setItem('session_count', sessionCount);

    checkSurveyTriggers();
    trackSession();
  }, [user, currentView, analytics, checkSurveyTriggers, trackSession]);

  const handleTabChange = (newTab) => {
    trackFeatureClick(newTab, {
      'previous_tab': activeTab,
      'navigation_method': 'sidebar_click'
    });
    
    const toolNames = {
      'keyword-intelligence': 'Keyword Intelligence',
      'enhanced-content': 'Enhanced Content Generator',
      'content-optimization': 'Content Optimization',
      'competitor-analysis': 'Competitor Analysis',
      'seo-enhanced': 'SEO Analysis',
      'attribution': 'Attribution Engine',
      'leadmagnet': 'Lead Magnet Generator',
      'cro': 'CRO Analyzer'
    };
    
    if (toolNames[newTab]) {
      trackToolUsage(toolNames[newTab]);
    }
    
    setActiveTab(newTab);
  };

  const handleViewChange = (newView) => {
    trackButtonClick(`view_${newView}`, 'main_navigation');
    setCurrentView(newView);
  };

  const renderActiveComponent = () => {
    if (currentView === 'account') {
      return <AccountPage 
        user={user} 
        onUpdateUser={updateUser} 
        onBackToApp={() => handleViewChange('dashboard')} 
      />;
    }
    
    if (currentView === 'success') {
      return <SuccessPage 
        onGetStarted={() => handleViewChange('dashboard')} 
        onGoToAccount={() => handleViewChange('account')} 
      />;
    }
    
    if (currentView === 'upgrade') {
      return <UpgradePage 
        onBack={() => handleViewChange('dashboard')} 
      />;
    }

    const components = {
      dashboard: () => isMobile 
        ? <MobileUnifiedDashboard 
            websiteAnalysis={websiteAnalysisResults} 
            onNavigateToTab={handleTabChange}
          />
        : <UnifiedDashboard 
            websiteAnalysis={websiteAnalysisResults} 
            onNavigateToTab={handleTabChange}
          />,
      'user-analytics': UserAnalyticsDashboard,
      'keyword-intelligence': KeywordIntelligenceEngine,
      'local-seo-matrix': LocalSEOMatrixGenerator,
      'enhanced-content-cluster': EnhancedContentClusterGenerator,
      'content-optimization': ContentOptimizationEngine,
      'competitor-analysis': CompetitorAnalysisEngine,
      'enhanced-content': EnhancedContentGenerator,
      'seo-enhanced': SEOAnalysisEnhanced,
      attribution: AttributionEngine,
      realtime: RealTimeJourneyTracker,
      analytics: JourneyAnalytics,
      'funnel-analytics': AnalyticsDashboard,
      content: SEOContentStrategist,
      leadmagnet: LeadMagnetGenerator,
      cro: CROAnalyzer,
      publishing: PublishingDashboard,
      scheduler: ContentScheduler,
      'crm-dashboard': CRMDashboard,
      'crm-contacts': ContactManager,
      'crm-pipeline': DealPipeline,
      'crm-attribution': RevenueAttribution,
      'email-sequences': EmailSequenceBuilder,
      'email-analytics': EmailAnalytics
    };

    const Component = components[activeTab] || (() => <UnifiedDashboard websiteAnalysis={websiteAnalysisResults} />);

    if (activeTab === 'dashboard') {
      return <Component />;
    }

    return (
      <Suspense fallback={<ComponentLoader componentName={activeTab} />}>
        <Component />
      </Suspense>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900" style={{ background: 'linear-gradient(135deg, #0a0b0f 0%, #111218 100%)' }}>
      {/* Mobile Navigation */}
      {currentView === 'dashboard' && isMobile && (
        <MobileNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          user={user}
        />
      )}

      {/* Desktop Navigation */}
      {currentView === 'dashboard' && !isMobile && (
        <SidebarNavigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          onViewChange={handleViewChange}
          user={user}
        />
      )}
      
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isMobile && currentView === 'dashboard' ? 'main-content-mobile' : ''}
        ${currentView === 'dashboard' && !isMobile ? 'md:ml-0 pt-16 md:pt-0' : 'ml-0'}
      `} style={{ background: 'var(--bg-primary)' }}>
        {renderActiveComponent()}
        
        {currentView === 'dashboard' && (
          <>
            <UserSurveySystem />
            
            <SurveyDisplay 
              surveyType="first_impression"
              isVisible={surveyTriggers.firstImpression}
              onComplete={completeSurvey}
              onDismiss={() => checkSurveyTriggers()}
            />
            
            <SurveyDisplay 
              surveyType="early_feedback"
              isVisible={surveyTriggers.earlyFeedback}
              onComplete={completeSurvey}
              onDismiss={() => checkSurveyTriggers()}
            />
            
            <SurveyDisplay 
              surveyType="power_user"
              isVisible={surveyTriggers.powerUser}
              onComplete={completeSurvey}
              onDismiss={() => checkSurveyTriggers()}
            />
            
            <SurveyDisplay 
              surveyType="pre_trial_end"
              isVisible={surveyTriggers.preTrialEnd}
              onComplete={completeSurvey}
              onDismiss={() => checkSurveyTriggers()}
            />
            
            <ConversionManager />
          </>
        )}
        
        {currentView === 'dashboard' && (
          <FloatingChatButton 
            websiteAnalysis={websiteAnalysisResults}
          />
        )}
        
        <Suspense fallback={null}>
          <AutomatedSignupPrompts />
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <MobileOptimizationProvider>
          <OfflineSupport>
            <ImprovedAuthProvider>
              <AuthProvider>
                <BrowserRouter>
                  <AppRouter />
                </BrowserRouter>
                <MobilePerformanceMonitor />
                <PWAFeatures />
              </AuthProvider>
            </ImprovedAuthProvider>
          </OfflineSupport>
        </MobileOptimizationProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

function AppRouter() {
  const { isAuthenticated, isLoading, updateUser } = useAuth();
  const [appView, setAppView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [currentView, setCurrentView] = useState('dashboard');

  // All React hooks must be called before any conditional returns
  React.useEffect(() => {
    initializeFunnelTracking();
    
    if (appView === 'landing') {
      ConversionTracker.trackLandingPageView();
    }
  }, [appView]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      setAppView('success');
    } else if (isAuthenticated) {
      setAppView('app');
    }
  }, [isAuthenticated]);

  // Handle OAuth callback - moved after all hooks
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  const handleGetStarted = (plan) => {
    ConversionTracker.trackCTAClick('free_account');
    
    setAuthMode('signup');
    if (plan === 'freemium') {
      setAppView('login');
    } else if (plan === 'pro') {
      setAppView('login');
    } else {
      setAppView('login');
    }
  };

  const handleLogin = (userData) => {
    updateUser(userData.userProfile);
    setAppView('app');
  };

  const handleSuccess = () => {
    setAppView('app');
  };

  if (isLoading) {
    return (
      <FullPageLoader 
        message="Initializing AttributeAI..."
        subMessage="Setting up your marketing attribution platform"
      />
    );
  }

  if (appView === 'success') {
    return <SuccessPage 
      onGetStarted={handleSuccess} 
      onGoToAccount={() => {
        handleSuccess();
      }} 
    />;
  }

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  if (appView === 'landing') {
    return <LandingPage 
      onGetStarted={() => setAppView('login')} 
      onSignIn={() => setAppView('login')} 
    />;
  }

  if (appView === 'login') {
    if (authMode === 'signup') {
      return (
        <SignupPage 
          onSignupSuccess={() => {
            setAppView('landing');
          }}
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      );
    } else {
      return (
        <LoginPage 
          onLoginSuccess={() => setAppView('app')} 
          onSwitchToSignup={() => setAuthMode('signup')} 
        />
      );
    }
  }

  return <LandingPage 
    onGetStarted={() => {
      setAuthMode('signup');
      setAppView('login');
    }} 
    onSignIn={() => {
      setAuthMode('login');
      setAppView('login');
    }} 
  />;
}

export default App;
