import React, { lazy, Suspense, useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import UnifiedDashboard from './components/UnifiedDashboard';
import LoginPage from './components/LoginPage';
import WebsiteAnalysisComponent from './components/WebsiteAnalysisComponent';
import DemoVideo from './components/DemoVideo';
import APITestComponent from './components/APITestComponent';

// Phase 2: Enhanced components with Claude AI
const ClaudeAIDemo = lazy(() => import('./components/ClaudeAIDemo'));
const UnifiedDashboardEnhanced = lazy(() => import('./components/UnifiedDashboard.enhanced'));
const SEOAnalysisEnhanced = lazy(() => import('./components/SEOCompetitorAnalysis.enhanced'));
const APITest = lazy(() => import('./components/APITest'));

// Lazy load components for better performance
const AttributionEngine = lazy(() => import('./components/AttributionEngine'));
const RealTimeJourneyTracker = lazy(() => import('./components/RealTimeJourneyTracker'));
const JourneyAnalytics = lazy(() => import('./components/JourneyAnalytics'));
const SEOCompetitorAnalysis = lazy(() => import('./components/SEOCompetitorAnalysis'));
const SEOContentStrategist = lazy(() => import('./components/SEOContentStrategist'));
const LeadMagnetGenerator = lazy(() => import('./components/LeadMagnetGenerator'));
const CROAnalyzer = lazy(() => import('./components/CROAnalyzer'));
const GSCAnalyzer = lazy(() => import('./components/GSCAnalyzer'));

// Loading component
const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="loading-spinner h-12 w-12 border-blue-600 mb-4 mx-auto"></div>
      <p className="text-gray-600">Loading marketing intelligence...</p>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [websiteAnalysisResults, setWebsiteAnalysisResults] = useState(null);

  const handleLogin = (userData) => {
    setUserProfile(userData);
    setIsAuthenticated(true);
    
    // If user signed up with website, show analysis
    if (userData.website) {
      setShowAnalysis(true);
    }
  };

  const handleAnalysisComplete = (results) => {
    setWebsiteAnalysisResults(results);
    setShowAnalysis(false);
    setActiveTab('dashboard'); // Navigate to dashboard with results
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show website analysis if needed
  if (showAnalysis && userProfile.website) {
    return (
      <WebsiteAnalysisComponent 
        userProfile={userProfile}
        onAnalysisComplete={handleAnalysisComplete}
      />
    );
  }

  const renderActiveComponent = () => {
    const components = {
      dashboard: () => <UnifiedDashboard userProfile={userProfile} websiteAnalysis={websiteAnalysisResults} />,
      'demo-video': () => <DemoVideo />,
      'api-test': () => <APITestComponent />,
      'dashboard-enhanced': UnifiedDashboardEnhanced,
      'claude-demo': ClaudeAIDemo,
      'seo-enhanced': SEOAnalysisEnhanced,
      attribution: AttributionEngine,
      realtime: RealTimeJourneyTracker,
      analytics: JourneyAnalytics,
      seo: SEOCompetitorAnalysis,
      content: SEOContentStrategist,
      leadmagnet: LeadMagnetGenerator,
      cro: CROAnalyzer,
      gsc: GSCAnalyzer
    };

    const Component = components[activeTab] || (() => <UnifiedDashboard userProfile={userProfile} websiteAnalysis={websiteAnalysisResults} />);

    // Don't wrap dashboard or demo-video or api-test in Suspense since they're not lazy loaded
    if (activeTab === 'dashboard' || activeTab === 'demo-video' || activeTab === 'api-test') {
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
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onLogout={() => {
          setIsAuthenticated(false);
          setUserProfile(null);
          setWebsiteAnalysisResults(null);
          setActiveTab('dashboard');
        }}
      />
      <main className="min-h-screen bg-gray-50">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;