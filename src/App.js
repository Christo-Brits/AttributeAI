import React, { lazy, Suspense, useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import UnifiedDashboard from './components/UnifiedDashboard';
import AuthenticatedApp from './components/auth/AuthWrapper';
import { useAuth } from './components/auth/AuthContext';
import WebsiteAnalysisComponent from './components/WebsiteAnalysisComponent';
import FloatingChatButton from './components/FloatingChatButton';

// Phase 2: Enhanced components with Claude AI  
const SEOAnalysisEnhanced = lazy(() => import('./components/SEOCompetitorAnalysis.enhanced'));

// Lazy load components for better performance
const AttributionEngine = lazy(() => import('./components/AttributionEngine'));
const RealTimeJourneyTracker = lazy(() => import('./components/RealTimeJourneyTracker'));
const JourneyAnalytics = lazy(() => import('./components/JourneyAnalytics'));
const SEOContentStrategist = lazy(() => import('./components/SEOContentStrategist'));
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

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [websiteAnalysisResults, setWebsiteAnalysisResults] = useState(null);

  const handleAnalysisComplete = (results) => {
    setWebsiteAnalysisResults(results);
    setShowAnalysis(false);
    setActiveTab('dashboard'); // Navigate to dashboard with results
  };

  // Show website analysis if user just signed up with a website
  if (showAnalysis && user?.websiteUrl) {
    return (
      <WebsiteAnalysisComponent 
        userProfile={user}
        onAnalysisComplete={handleAnalysisComplete}
      />
    );
  }

  const renderActiveComponent = () => {
    const components = {
      dashboard: () => <UnifiedDashboard userProfile={user} websiteAnalysis={websiteAnalysisResults} />,
      'seo-enhanced': SEOAnalysisEnhanced,
      attribution: AttributionEngine,
      realtime: RealTimeJourneyTracker,
      analytics: JourneyAnalytics,
      content: SEOContentStrategist,
      leadmagnet: LeadMagnetGenerator,
      cro: CROAnalyzer
    };

    const Component = components[activeTab] || (() => <UnifiedDashboard userProfile={user} websiteAnalysis={websiteAnalysisResults} />);

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
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userProfile={user}
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
    <AuthenticatedApp>
      <AppContent />
    </AuthenticatedApp>
  );
}

export default App;