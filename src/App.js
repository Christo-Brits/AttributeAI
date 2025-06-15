import React, { lazy, Suspense, useState } from 'react';
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

// NEW: Enhanced Content Generator (Outrank.so killer)
const EnhancedContentGenerator = lazy(() => import('./components/EnhancedContentGenerator'));

// NEW: Content Optimization Engine (Outranking.io killer)
const ContentOptimizationEngine = lazy(() => import('./components/ContentOptimizationEngine'));

// NEW: Competitor Analysis Engine
const CompetitorAnalysisEngine = lazy(() => import('./components/CompetitorAnalysisEngine'));

// NEW: Keyword Intelligence Engine
const KeywordIntelligenceEngine = lazy(() => import('./components/KeywordIntelligenceEngine'));

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

  const renderActiveComponent = () => {
    // Handle special views first
    if (currentView === 'account') {
      return <AccountPage 
        user={user} 
        onUpdateUser={updateUser} 
        onBackToApp={() => setCurrentView('dashboard')} 
      />;
    }
    
    if (currentView === 'success') {
      return <SuccessPage 
        onGetStarted={() => setCurrentView('dashboard')} 
        onGoToAccount={() => setCurrentView('account')} 
      />;
    }

    // Regular dashboard components
    const components = {
      dashboard: () => <UnifiedDashboard 
        websiteAnalysis={websiteAnalysisResults} 
        onNavigateToTab={setActiveTab}
      />,
      'keyword-intelligence': KeywordIntelligenceEngine,
      'content-optimization': ContentOptimizationEngine, // NEW: Outranking.io killer
      'competitor-analysis': CompetitorAnalysisEngine, // NEW: Competitor Analysis Engine
      'enhanced-content': EnhancedContentGenerator, // NEW: Outrank.so killer
      'seo-enhanced': SEOAnalysisEnhanced,
      attribution: AttributionEngine,
      realtime: RealTimeJourneyTracker,
      analytics: JourneyAnalytics,
      content: SEOContentStrategist,
      leadmagnet: LeadMagnetGenerator,
      cro: CROAnalyzer,
      publishing: PublishingDashboard,
      scheduler: ContentScheduler,
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
          setActiveTab={setActiveTab}
          onViewChange={setCurrentView}
          user={user}
        />
      )}
      
      {/* Main Content Area */}
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${currentView === 'dashboard' ? 'md:ml-0 pt-16 md:pt-0' : 'ml-0'}
      `} style={{ background: 'var(--bg-primary)' }}>
        {renderActiveComponent()}
        
        {/* Floating Chat Button - Available on dashboard pages only */}
        {currentView === 'dashboard' && (
          <FloatingChatButton 
            websiteAnalysis={websiteAnalysisResults}
          />
        )}
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
    }
  }, []);

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

  if (appView === 'landing' && !isAuthenticated) {
    return <LandingPage 
      onGetStarted={() => setAppView('login')} 
      onSignIn={() => setAppView('login')} 
    />;
  }

  if (appView === 'login' || (!isAuthenticated && appView !== 'landing')) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return <AuthenticatedApp />;
}

export default App;