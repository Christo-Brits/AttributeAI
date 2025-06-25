import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Core components - load immediately
import { AuthProvider } from './components/auth/AuthContext';
import { ImprovedAuthProvider } from './components/auth/ImprovedAuthContext';
import SidebarNavigation from './components/SidebarNavigation';
import FloatingChatButton from './components/FloatingChatButton';

// Optimized imports - only what we need
import { BarChart3, TrendingUp, Target, Zap, Users } from 'lucide-react';

// Lazy load all heavy components for better performance
const UnifiedDashboard = lazy(() => import('./components/UnifiedDashboard'));
const SEOCompetitorAnalysis = lazy(() => import('./components/SEOCompetitorAnalysis.enhanced'));
const AttributionEngine = lazy(() => import('./components/AttributionEngine'));
const JourneyAnalytics = lazy(() => import('./components/JourneyAnalytics'));
const RealTimeJourneyTracker = lazy(() => import('./components/RealTimeJourneyTracker'));
const LeadMagnetGenerator = lazy(() => import('./components/LeadMagnetGenerator'));
const CROAnalyzer = lazy(() => import('./components/CROAnalyzer'));
const SEOContentStrategist = lazy(() => import('./components/SEOContentStrategist.enhanced'));
const WebsiteAnalysisComponent = lazy(() => import('./components/WebsiteAnalysisComponent'));
const UserProfile = lazy(() => import('./components/auth/UserProfile'));
const ConversionManager = lazy(() => import('./components/immediate-conversion-system'));
const UserAnalyticsDashboard = lazy(() => import('./components/UserAnalyticsDashboard'));
const AutomatedSignupPrompts = lazy(() => import('./components/AutomatedSignupPrompts'));
const EnhancedContentGenerator = lazy(() => import('./components/EnhancedContentGenerator'));
const ContentOptimizationEngine = lazy(() => import('./components/ContentOptimizationEngine'));
const CompetitorAnalysisEngine = lazy(() => import('./components/CompetitorAnalysisEngine'));
const KeywordIntelligenceEngine = lazy(() => import('./components/KeywordIntelligenceEngine'));
const EnhancedContentClusterGenerator = lazy(() => import('./components/EnhancedContentClusterGenerator'));
const LocalSEOMatrixGenerator = lazy(() => import('./components/LocalSEOMatrixGenerator'));
const ContentClusterStrategist = lazy(() => import('./components/ContentClusterStrategist'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const EnhancedSignupPage = lazy(() => import('./components/auth/EnhancedSignupPage'));
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const PasswordResetPage = lazy(() => import('./components/auth/PasswordResetPage'));
const SuccessPage = lazy(() => import('./components/SuccessPage'));

// Optimized loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-300">Loading AttributeAI...</p>
    </div>
  </div>
);

// Memoized AuthenticatedApp for better performance
const AuthenticatedApp = React.memo(() => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [websiteAnalysisResults, setWebsiteAnalysisResults] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, updateUser } = useAuth();
  
  // Memoize heavy computations
  const tabComponents = React.useMemo(() => ({
    'dashboard': <UnifiedDashboard websiteAnalysis={websiteAnalysisResults} onNavigateToTab={setActiveTab} />,
    'seo-analysis': <SEOCompetitorAnalysis />,
    'attribution-engine': <AttributionEngine />,
    'journey-analytics': <JourneyAnalytics />,
    'real-time-tracker': <RealTimeJourneyTracker />,
    'lead-magnet': <LeadMagnetGenerator />,
    'cro-analyzer': <CROAnalyzer />,
    'content-strategist': <SEOContentStrategist />,
    'website-analysis': <WebsiteAnalysisComponent onAnalysisComplete={setWebsiteAnalysisResults} />,
    'keyword-intelligence': <KeywordIntelligenceEngine />,
    'enhanced-content': <EnhancedContentGenerator />,
    'content-optimization': <ContentOptimizationEngine />,
    'competitor-analysis': <CompetitorAnalysisEngine />,
    'content-clusters': <EnhancedContentClusterGenerator />,
    'local-seo': <LocalSEOMatrixGenerator />,
    'content-cluster-strategist': <ContentClusterStrategist />,
    'account': <UserProfile user={user} onUserUpdate={updateUser} onViewChange={setCurrentView} />,
    'user-analytics': <UserAnalyticsDashboard />
  }), [activeTab, websiteAnalysisResults, user, updateUser]);

  const CurrentComponent = tabComponents[activeTab] || tabComponents['dashboard'];

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <SidebarNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <main className="flex-1 overflow-y-auto relative">
        <Suspense fallback={<LoadingSpinner />}>
          {CurrentComponent}
        </Suspense>
        
        {currentView === 'dashboard' && (
          <>
            <Suspense fallback={null}>
              <ConversionManager />
            </Suspense>
          </>
        )}
        
        {currentView === 'dashboard' && (
          <Suspense fallback={null}>
            <FloatingChatButton websiteAnalysis={websiteAnalysisResults} />
          </Suspense>
        )}
        
        <Suspense fallback={null}>
          <AutomatedSignupPrompts />
        </Suspense>
      </main>
    </div>
  );
});

function AppRouter() {
  const { isAuthenticated, isLoading, updateUser } = useAuth();
  const [appView, setAppView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [currentView, setCurrentView] = useState('dashboard');

  // Optimized effect with proper dependencies
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      setAppView('success');
    } else if (window.location.pathname === '/pricing') {
      setAppView('landing');
    } else if (window.location.pathname === '/upgrade') {
      setAppView('app');
      setCurrentView('upgrade');
    } else if (isAuthenticated) {
      setAppView('app');
    }
  }, [isAuthenticated]);

  const handleGetStarted = React.useCallback((plan) => {
    setAuthMode('signup');
    if (plan === 'freemium') {
      setAppView('login');
    } else if (plan === 'pro') {
      setAppView('login');
    } else {
      setAppView('login');
    }
  }, []);

  const handleLogin = React.useCallback((userData) => {
    updateUser(userData.userProfile);
    setAppView('app');
  }, [updateUser]);

  const handleSuccess = React.useCallback(() => {
    setAppView('app');
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {appView === 'landing' && (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onLogin={() => setAppView('login')}
        />
      )}
      
      {appView === 'login' && (
        <>
          {authMode === 'signup' ? (
            <EnhancedSignupPage
              onSignupSuccess={handleLogin}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          ) : authMode === 'reset' ? (
            <PasswordResetPage
              onBackToLogin={() => setAuthMode('login')}
            />
          ) : (
            <LoginPage
              onLoginSuccess={handleLogin}
              onSwitchToSignup={() => setAuthMode('signup')}
              onForgotPassword={() => setAuthMode('reset')}
            />
          )}
        </>
      )}
      
      {appView === 'success' && (
        <SuccessPage onContinue={handleSuccess} />
      )}
      
      {appView === 'app' && <AuthenticatedApp />}
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ImprovedAuthProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ImprovedAuthProvider>
    </HelmetProvider>
  );
}

export default App;