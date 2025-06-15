import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, Activity, TrendingUp, Search, PenTool, Target, Eye, Settings, 
  User, Bell, Grid, LogOut, Globe, ChevronDown, Calendar, Menu, X,
  Users, Building, DollarSign, GitBranch, ChevronRight, Mail
} from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import UserProfile from './auth/UserProfile';
import AttributeAILogo from './ui/AttributeAILogo';

const SidebarNavigation = ({ activeTab, setActiveTab, onViewChange, user: authUser, children }) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  
  // Initialize sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; // Open by default on desktop, closed on mobile
    }
    return true;
  });
  
  const [expandedSections, setExpandedSections] = useState({
    marketing: true,
    content: true,
    email: false,
    crm: false // Ready for future CRM implementation
  });
  const dropdownRef = useRef(null);

  // Use authUser if passed, otherwise use context user
  const currentUser = authUser || user;

  // Handle window resize to auto-adjust sidebar
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Always open on desktop
      } else {
        setSidebarOpen(false); // Always closed on mobile initially
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setShowUserDropdown(false);
  };

  const confirmLogout = () => {
    setLogoutSuccess(true);
    setTimeout(() => {
      logout();
      setShowLogoutConfirm(false);
      setLogoutSuccess(false);
    }, 1500);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationSections = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: Grid, description: 'Unified insights' }
      ]
    },
    {
      id: 'content',
      title: 'Content Intelligence',
      expandable: true,
      items: [
        { 
          id: 'keyword-intelligence', 
          name: 'Keyword Intelligence', 
          icon: Search, 
          new: true, 
          description: 'Unlimited keyword research',
          competitive: 'Keywords Everywhere killer'
        },
        { 
          id: 'enhanced-content', 
          name: 'Enhanced Content', 
          icon: PenTool, 
          new: true, 
          description: 'Multi-AI content generation',
          competitive: 'Outrank.so killer'
        },
        { id: 'seo-enhanced', name: 'AI SEO Analysis', icon: TrendingUp, phase2: true, description: 'Advanced SEO insights' },
        { id: 'content', name: 'Content Strategy', icon: PenTool, description: 'Strategic planning' },
        { id: 'publishing', name: 'Publishing Pipeline', icon: Globe, phase2: true, description: 'Automated publishing' },
        { id: 'scheduler', name: 'Content Scheduler', icon: Calendar, phase2: true, description: 'Strategic timing' }
      ]
    },
    {
      id: 'email',
      title: 'Email Marketing',
      expandable: true,
      disabled: false,
      items: [
        { id: 'email-sequences', name: 'Email Sequences', icon: Mail, description: 'Automated email campaigns' },
        { id: 'email-analytics', name: 'Email Analytics', icon: BarChart3, description: 'Performance tracking' }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Attribution',
      expandable: true,
      items: [
        { id: 'attribution', name: 'Attribution Engine', icon: BarChart3, description: 'Multi-touch attribution' },
        { id: 'realtime', name: 'Real-Time Tracking', icon: Activity, description: 'Live performance' },
        { id: 'analytics', name: 'Journey Analytics', icon: TrendingUp, description: 'Customer journeys' },
        { id: 'leadmagnet', name: 'Lead Magnet Generator', icon: Target, description: 'Conversion tools' },
        { id: 'cro', name: 'CRO Analyzer', icon: Eye, description: 'Optimization insights' },
        { 
          id: 'weather-intelligence', 
          name: 'Weather Intelligence', 
          icon: '🌤️', 
          new: true, 
          description: 'Weather-based spend optimization',
          competitive: 'First-of-its-kind'
        }
      ]
    },
    {
      id: 'crm',
      title: 'CRM & Revenue Intelligence',
      expandable: true,
      disabled: false,
      items: [
        { id: 'crm-dashboard', name: 'CRM Dashboard', icon: Users, description: 'Complete CRM overview' },
        { id: 'crm-contacts', name: 'Contacts', icon: Users, description: 'Contact management' },
        { id: 'crm-pipeline', name: 'Deal Pipeline', icon: GitBranch, description: 'Sales pipeline' },
        { id: 'crm-attribution', name: 'Revenue Attribution', icon: DollarSign, description: 'Marketing ROI' }
      ]
    }
  ];

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Mobile Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 glass-effect hover-glow-blue rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        style={{ 
          background: 'rgba(26, 27, 35, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }}
      >
        {sidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-60 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`shadow-2xl transition-all duration-300 flex flex-col z-40 ${
        // Desktop: normal sidebar behavior
        // Mobile: fixed positioned sidebar that slides in from left
        sidebarOpen 
          ? 'w-80 md:relative fixed left-0 top-0 h-full' 
          : 'w-0 md:w-16 -translate-x-full md:translate-x-0'
      }`} style={{ 
        background: 'linear-gradient(180deg, rgba(26, 27, 35, 0.95) 0%, rgba(37, 39, 48, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(55, 65, 81, 0.3)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ 
          borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
          background: 'rgba(37, 39, 48, 0.5)'
        }}>
          {sidebarOpen && (
            <AttributeAILogo 
              width={180} 
              height={32} 
              className="text-white"
              showText={true}
              variant="horizontal"
            />
          )}
          
          {/* Desktop toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationSections.map((section) => (
            <div key={section.id} className="mb-6">
              {/* Section Header */}
              {sidebarOpen && (
                <div className="px-4 mb-2">
                  {section.expandable ? (
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                        section.disabled 
                          ? 'opacity-50 cursor-not-allowed text-gray-500' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                      disabled={section.disabled}
                    >
                      <span>{section.title}</span>
                      <ChevronRight className={`h-3 w-3 transition-transform ${
                        expandedSections[section.id] ? 'rotate-90' : ''
                      }`} />
                    </button>
                  ) : (
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {section.title}
                    </h3>
                  )}
                </div>
              )}

              {/* Section Items */}
              {(!section.expandable || expandedSections[section.id]) && (
                <div className="space-y-1 px-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isDisabled = item.disabled || section.disabled;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (!isDisabled) {
                            setActiveTab(item.id);
                            // Auto-close sidebar on mobile after selection
                            const isMobile = window.matchMedia('(max-width: 767px)').matches;
                            if (isMobile) {
                              setSidebarOpen(false);
                            }
                          }
                        }}
                        disabled={isDisabled}
                        className={`w-full flex items-center space-x-3 px-3 py-3 md:py-2.5 rounded-lg text-left transition-all duration-200 relative touch-manipulation group ${
                          isActive
                            ? item.phase2 
                              ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                              : 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                            : isDisabled
                              ? 'text-gray-500 cursor-not-allowed opacity-50'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800/50 active:bg-gray-700/50 hover:shadow-md'
                        } ${!isActive && !isDisabled ? 'hover:border hover:border-gray-600/30' : ''}`}
                        title={!sidebarOpen ? item.name : ''}
                      >
                        <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                          isActive && item.phase2 ? 'text-purple-400' : 
                          isActive ? 'text-blue-400' : 'group-hover:text-white'
                        }`} />
                        
                        {sidebarOpen && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{item.name}</span>
                              <div className="flex items-center space-x-1">
                                {item.new && (
                                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg shadow-pink-500/25 animate-pulse">
                                    NEW
                                  </span>
                                )}
                                {item.phase2 && (
                                  <span className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg shadow-purple-500/25">
                                    AI
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate group-hover:text-gray-300">
                                {item.description}
                              </p>
                            )}
                            {item.competitive && (
                              <p className="text-xs text-green-400 mt-0.5 font-medium">
                                {item.competitive}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Active indicator */}
                        {isActive && (
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r ${
                            item.phase2 ? 'bg-purple-600' : 'bg-blue-600'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile Section */}
        <div style={{ 
          borderTop: '1px solid rgba(55, 65, 81, 0.3)',
          background: 'rgba(37, 39, 48, 0.5)',
          padding: '1rem'
        }}>
          {/* Website Badge */}
          {sidebarOpen && currentUser?.websiteUrl && (
            <div className="mb-3 flex items-center space-x-2 rounded-lg border" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              padding: '0.5rem 0.75rem'
            }}>
              <Globe className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="text-sm text-green-300 truncate">
                {(() => {
                  try {
                    return new URL(currentUser.websiteUrl).hostname;
                  } catch {
                    return currentUser.websiteUrl.replace(/^https?:\/\//, '');
                  }
                })()}
              </span>
            </div>
          )}

          {/* User Profile Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-full flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-sm font-medium text-gray-700 block truncate">
                      {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser?.email || 'Demo User'}
                    </span>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.company || currentUser?.industry || 'Free Trial'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </>
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 py-2 z-50">
                <button
                  onClick={() => {
                    if (onViewChange) {
                      onViewChange('account');
                    }
                    setShowUserDropdown(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-200 rounded-lg"
                >
                  <User className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setShowUserDropdown(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-200 rounded-lg"
                >
                  <User className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    // Add settings functionality later
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-200 rounded-lg"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <hr className="my-1 border-gray-700/50" />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:text-white transition-all duration-200 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {sidebarOpen && (
            <div className="flex items-center justify-center space-x-2 mt-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <Bell className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Quick Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationSections
                  .flatMap(section => section.items)
                  .find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {navigationSections
                  .flatMap(section => section.items)
                  .find(item => item.id === activeTab)?.description || 'Unified marketing intelligence'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Real-time status indicator */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            {logoutSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Signing Out...</h3>
                <p className="text-gray-600">
                  You've been successfully signed out. Redirecting to login page...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <LogOut className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
                    <p className="text-sm text-gray-500">Confirm your action</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to sign out? You'll need to sign in again to access your AttributeAI dashboard.
                </p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarNavigation;