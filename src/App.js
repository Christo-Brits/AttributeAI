import React, { lazy, Suspense, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import NavigationWrapper from './components/NavigationWrapper';
import UnifiedDashboard from './components/UnifiedDashboard';
import LoginPage from './components/LoginPage';
import FloatingChatButton from './components/FloatingChatButton';

// Phase 2: Enhanced components with Claude AI  
const SEOAnalysisEnhanced = lazy(() => import('./components/SEOCompetitorAnalysis.enhanced'));
const SEOContentStrategist = lazy(() => import('./components/SEOContentStrategist.enhanced'));

// Lazy load components for better performance
const AttributionEngine = lazy(() => import('./components/AttributionEngine'));
const RealTimeJourneyTracker = lazy(() => import('./components/RealTimeJourneyTracker'));
const JourneyAnalytics = lazy(() => import('./components/JourneyAnalytics'));
const LeadMagnetGenerator = lazy(() => import('./components/LeadMagnetGenerator'));
const CROAnalyzer = lazy(() => import('./components/CROAnalyzer'));

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

  const renderActiveComponent = () => {
    const components = {
      dashboard: () => <UnifiedDashboard websiteAnalysis={websiteAnalysisResults} />,
      'seo-enhanced': SEOAnalysisEnhanced,
      attribution: AttributionEngine,
      realtime: RealTimeJourneyTracker,
      analytics: JourneyAnalytics,
      content: SEOContentStrategist,
      leadmagnet: LeadMagnetGenerator,
      cro: CROAnalyzer
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
    <div className="App">
      <NavigationWrapper 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      <main className="min-h-screen bg-gray-50">
        {renderActiveComponent()}
        
        {/* Floating Chat Button - Available on all pages */}
        <FloatingChatButton 
          websiteAnalysis={websiteAnalysisResults}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

function AppRouter() {
  const { isAuthenticated, isLoading, updateUser } = useAuth();

  const handleLogin = (userData) => {
    // Store user data and mark as authenticated
    updateUser(userData.userProfile);
    // The AuthContext will handle the authentication state
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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return <AuthenticatedApp />;
}

export default App;