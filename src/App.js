import React, { lazy, Suspense, useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import SidebarNavigation from './components/SidebarNavigation';
import UnifiedDashboard from './components/UnifiedDashboard';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import AccountPage from './components/AccountPage';
import SuccessPage from './components/SuccessPage';
import FloatingChatButton from './components/FloatingChatButton';
import { useAttributeAIAnalytics } from './hooks/useAttributeAIAnalytics';

// NEW: Survey & Discount System
import { useSurveyManager, SurveyDisplay } from './components/surveys/SurveyIntegration';
import UserSurveySystem from './components/surveys/UserSurveySystem';

// NEW: User Analytics Dashboard
const UserAnalyticsDashboard = lazy(() => import('./components/UserAnalyticsDashboard'));

// NEW: Automated Signup Prompts
const AutomatedSignupPrompts = lazy(() => import('./components/AutomatedSignupPrompts'));

// NEW: Enhanced Content Generator (Outrank.so killer)
const EnhancedContentGenerator = lazy(() => import('./components/EnhancedContentGenerator'));

// NEW: Content Optimization Engine (Outranking.io killer)
const ContentOptimizationEngine = lazy(() => import('./components/ContentOptimizationEngine'));

// NEW: Competitor Analysis Engine
const CompetitorAnalysisEngine = lazy(() => import('./components/CompetitorAnalysisEngine'));

// NEW: Keyword Intelligence Engine
const KeywordIntelligenceEngine = lazy(() => import('./components/KeywordIntelligenceEngine'));

// NEW: Enhanced Content Cluster Generator (n8n Integration)
const EnhancedContentClusterGenerator = lazy(() => import('./components/EnhancedContentClusterGenerator'));

// NEW: Local SEO Matrix Generator (Revolutionary local page generator)
const LocalSEOMatrixGenerator = lazy(() => import('./components/LocalSEOMatrixGenerator'));

// Phase 2: Enhanced components with Claude AI  
const SEOAnalysisEnhanced = lazy(() => import('./components/SEOCompetitorAnalysis.enhanced'));
const SEOContentStrategist = lazy(() => import('./components/SEOContentStrategist.enhanced'));
const PublishingDashboard = lazy(() => import('./components/PublishingDashboard'));
const ContentScheduler = lazy(() => import('./components/ContentScheduler'));

// Lazy load components for better performance
const AttributionEngine = lazy(() => import('./components/AttributionEngine'));
const RealTimeJourneyTracker = lazy(() => import('./components/RealTimeJourneyTracker'));
const JourneyAnalytics = lazy(() => import('./components/JourneyAnalytics'));
const LeadMagnetGenerator = lazy(() => import('./components/LeadMagnetGenerator'));
const CROAnalyzer = lazy(() => import('./components/CROAnalyzer'));

// CRM Components
const CRMDashboard = lazy(() => import('./components/crm/CRMDashboard'));
const ContactManager = lazy(() => import('./components/crm/ContactManager'));
const DealPipeline = lazy(() => import('./components/crm/DealPipeline'));
const RevenueAttribution = lazy(() => import('./components/crm/RevenueAttribution'));

// Email Components
const EmailSequenceBuilder = lazy(() => import('./components/email/EmailSequenceBuilder'));
const EmailAnalytics = lazy(() => import('./components/email/EmailAnalytics'));

// Analytics Dashboard
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));

// Weather Intelligence Components - TEMPORARILY DISABLED FOR DEBUGGING
// const WeatherIntelligence = lazy(() => import('./components/weather/WeatherIntelligence'));
// const WeatherAnalytics = lazy(() => import('./components/weather/WeatherAnalytics'));

// Loading component
const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="loading-spinner h-12 w-12 border-blue-600 mb-4 mx-auto"></div>
      <p className="text-gray-600">Loading marketing intelligence...</p>
    </div>
  </div>
);

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [websiteAnalysisResults, setWebsiteAnalysisResults] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, account, success
  const { user, updateUser } = useAuth();
  
  // Initialize analytics tracking
  const { trackFeatureClick, trackButtonClick, analytics } = useAttributeAIAnalytics('main_app');

  // NEW: Survey & Discount System Integration
  const {
    surveyTriggers,
    userMetrics,
    trackToolUsage,
    trackSession,
    checkSurveyTriggers,
    completeSurvey,
    generateDiscountCode
  } = useSurveyManager();

  // Track session initialization and user info
  useEffect(() => {
    // Initialize session tracking
    if (!sessionStorage.getItem('session_initialized')) {
      sessionStorage.setItem('session_initialized', 'true');
      
      // Track user type and session start
      analytics.trackFunnelStep('app_initialized', {
        'user_authenticated': !!user,
        'user_type': user ? 'registered' : 'guest',
        'initial_view': currentView,
        'has_previous_session': !!localStorage.getItem('session_count')
      });
    }

    // Update session count
    const sessionCount = parseInt(localStorage.getItem('session_count') || '0') + 1;
    localStorage.setItem('session_count', sessionCount.toString());

    // NEW: Initialize survey system
    checkSurveyTriggers();
    trackSession();
    
  }, [user, currentView, analytics, checkSurveyTriggers, trackSession]);

  // Track tab navigation
  const handleTabChange = (newTab) => {
    trackFeatureClick(newTab, {
      'previous_tab': activeTab,
      'navigation_method': 'sidebar_click'
    });
    
    // NEW: Track tool usage for survey system
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

  // Track view changes
  const handleViewChange = (newView) => {
    trackButtonClick(`view_${newView}`, 'main_navigation');
    setCurrentView(newView);
  };

  const renderActiveComponent = () => {
    // Handle special views first
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

    // Regular dashboard components
    const components = {
      dashboard: () => <UnifiedDashboard 
        websiteAnalysis={websiteAnalysisResults} 
        onNavigateToTab={handleTabChange}
      />,
      'user-analytics': UserAnalyticsDashboard,
      'keyword-intelligence': KeywordIntelligenceEngine,
      'local-seo-matrix': LocalSEOMatrixGenerator, // NEW: Revolutionary local SEO page generator
      'enhanced-content-cluster': EnhancedContentClusterGenerator, // NEW: n8n Content Cluster Generator
      'content-optimization': ContentOptimizationEngine, // NEW: Outranking.io killer
      'competitor-analysis': CompetitorAnalysisEngine, // NEW: Competitor Analysis Engine
      'enhanced-content': EnhancedContentGenerator, // NEW: Outrank.so killer
      'seo-enhanced': SEOAnalysisEnhanced,
      attribution: AttributionEngine,
      realtime: RealTimeJourneyTracker,
      analytics: JourneyAnalytics,
      'funnel-analytics': AnalyticsDashboard, // NEW: Enhanced funnel tracking dashboard
      content: SEOContentStrategist,
      leadmagnet: LeadMagnetGenerator,
      cro: CROAnalyzer,
      publishing: PublishingDashboard,
      scheduler: ContentScheduler,
      // Weather Intelligence Components - TEMPORARILY DISABLED FOR DEBUGGING
      // 'weather-intelligence': WeatherIntelligence,
      // 'weather-analytics': WeatherAnalytics,
      // CRM Components
      'crm-dashboard': CRMDashboard,
      'crm-contacts': ContactManager,
      'crm-pipeline': DealPipeline,
      'crm-attribution': RevenueAttribution,
      // Email Marketing Components
      'email-sequences': EmailSequenceBuilder,
      'email-analytics': EmailAnalytics
    };

    const Component = components[activeTab] || (() => <UnifiedDashboard websiteAnalysis={websiteAnalysisResults} />);

    // Don't wrap dashboard in Suspense since it's not lazy loaded
    if (activeTab === 'dashboard') {
      return <Component />;
    }

    return (
      <Suspense fallback={<ComponentLoader />}>
        <Component />
      </Suspense>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900" style={{ background: 'linear-gradient(135deg, #0a0b0f 0%, #111218 100%)' }}>
      {/* Sidebar Navigation - Always visible for dashboard */}
      {currentView === 'dashboard' && (
        <SidebarNavigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          onViewChange={handleViewChange}
          user={user}
        />
      )}
      
      {/* Main Content Area */}
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${currentView === 'dashboard' ? 'md:ml-0 pt-16 md:pt-0' : 'ml-0'}
      `} style={{ background: 'var(--bg-primary)' }}>
        {renderActiveComponent()}
        
        {/* NEW: Survey & Discount System */}
        {currentView === 'dashboard' && (
          <>
            <UserSurveySystem />
            
            {/* Survey Trigger Displays */}
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
          </>
        )}
        
        {/* Floating Chat Button - Available on dashboard pages only */}
        {currentView === 'dashboard' && (
          <FloatingChatButton 
            websiteAnalysis={websiteAnalysisResults}
          />
        )}
        
        {/* Automated Signup Prompts - Show across all views */}
        <Suspense fallback={null}>
          <AutomatedSignupPrompts />
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </HelmetProvider>
  );
}

function AppRouter() {
  const { isAuthenticated, isLoading, updateUser } = useAuth();
  const [appView, setAppView] = useState('landing'); // landing, login, app, success

  // Check URL for success page
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      setAppView('success');
    } else if (window.location.pathname === '/pricing') {
      setAppView('landing');
    } else if (isAuthenticated) {
      setAppView('app');
    }
  }, [isAuthenticated]);

  const handleGetStarted = (plan) => {
    if (plan === 'freemium') {
      setAppView('login');
    } else if (plan === 'pro') {
      // This will be handled by the LandingPage component's Stripe integration
      // The user will be redirected to Stripe and then back to success page
      setAppView('login');
    } else {
      setAppView('login');
    }
  };

  const handleLogin = (userData) => {
    // Store user data and mark as authenticated
    updateUser(userData.userProfile);
    setAppView('app');
    // The AuthContext will handle the authentication state
  };

  const handleSuccess = () => {
    setAppView('app');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner h-12 w-12 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading AttributeAI...</p>
        </div>
      </div>
    );
  }

  // Handle different app views
  if (appView === 'success') {
    return <SuccessPage 
      onGetStarted={handleSuccess} 
      onGoToAccount={() => {
        handleSuccess();
        // This will be handled by the authenticated app's account view
      }} 
    />;
  }

  // Force app view if authenticated
  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  // Show landing page by default for non-authenticated users
  if (appView === 'landing') {
    return <LandingPage 
      onGetStarted={() => setAppView('login')} 
      onSignIn={() => setAppView('login')} 
    />;
  }

  // Show login page
  if (appView === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Fallback to landing page to prevent blank screen
  return <LandingPage 
    onGetStarted={() => setAppView('login')} 
    onSignIn={() => setAppView('login')} 
  />;
}

export default App;