import React, { useState } from 'react';
import { useViewport } from '../hooks/useViewport';

const MobileNavigation = ({ activeTab, onTabChange, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useViewport();

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'keyword-intelligence', name: 'Keywords', icon: '🎯' },
    { id: 'enhanced-content', name: 'Content', icon: '✍️' },
    { id: 'seo-enhanced', name: 'SEO', icon: '🔍' },
    { id: 'attribution', name: 'Attribution', icon: '📈' },
    { id: 'analytics', name: 'Journey', icon: '🛣️' },
    { id: 'leadmagnet', name: 'Lead Gen', icon: '🧲' },
    { id: 'cro', name: 'CRO', icon: '⚡' },
    { id: 'crm-dashboard', name: 'CRM', icon: '👥' },
    { id: 'publishing', name: 'Publishing', icon: '📝' }
  ];

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  const handleNavigation = (tabId) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  return (
    <div className="mobile-navigation">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">AttributeAI</span>
        </div>
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Slide-out Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
        <div className="menu-content">
          {/* User info section */}
          {user && (
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '0.5rem'
            }}>
              <div style={{ fontWeight: 600, color: '#374151' }}>
                {user.firstName || user.email}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {user.company || 'AttributeAI User'}
              </div>
            </div>
          )}

          <div className="menu-items">
            {navigationItems.map(item => (
              <button
                key={item.id}
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id)}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-name">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar for Quick Access */}
      <div className="bottom-tab-bar">
        {navigationItems.slice(0, 4).map(item => (
          <button
            key={item.id}
            className={`tab-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleNavigation(item.id)}
          >
            <span className="tab-icon">{item.icon}</span>
            <span className="tab-label">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
