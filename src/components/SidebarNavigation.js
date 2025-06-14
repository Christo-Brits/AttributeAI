import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, Activity, TrendingUp, Search, PenTool, Target, Eye, Settings, 
  User, Bell, Grid, LogOut, Globe, ChevronDown, Calendar, Menu, X,
  Brain, Zap, Users, Building, Phone, Mail, FileText, DollarSign,
  ChevronRight, Home, Sparkles
} from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import UserProfile from './auth/UserProfile';
import AttributeAILogo from './ui/AttributeAILogo';

const SidebarNavigation = ({ activeTab, setActiveTab, onViewChange, user: authUser }) => {
  const { user, logout } = useAuth();
  const { trackTool, trackPage } = useAnalytics();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    marketing: true,
    crm: false,
    content: false
  });
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const dropdownRef = useRef(null);

  // Use authUser if passed, otherwise use context user
  const currentUser = authUser || user;

  // Navigation structure with organized sections
  const navigationSections = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        {
          id: 'dashboard',
          title: 'Unified Dashboard',
          icon: Home,
          badge: null,
          description: 'Marketing intelligence overview'
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Intelligence',
      expandable: true,
      items: [
        {
          id: 'keyword-intelligence',
          title: 'Keyword Intelligence',
          icon: Search,
          badge: 'NEW',
          description: 'Unlimited keyword research'
        },
        {
          id: 'seo-analysis',
          title: 'AI SEO Analysis',
          icon: TrendingUp,
          description: 'Competitor SEO insights'
        },
        {
          id: 'attribution-engine',
          title: 'Attribution Engine',
          icon: BarChart3,
          description: 'Multi-touch attribution'
        },
        {
          id: 'journey-analytics',
          title: 'Journey Analytics',
          icon: Activity,
          description: 'Customer journey mapping'
        },
        {
          id: 'cro-analyzer',
          title: 'CRO Analyzer',
          icon: Target,
          description: 'Conversion optimization'
        }
      ]
    },
    {
      id: 'content',
      title: 'Content & AI',
      expandable: true,
      items: [
        {
          id: 'content-strategist',
          title: 'Content Strategist',
          icon: PenTool,
          description: 'AI content generation'
        },
        {
          id: 'enhanced-content',
          title: 'Enhanced Content',
          icon: Sparkles,
          description: 'Multi-model AI content'
        },
        {
          id: 'lead-magnet',
          title: 'Lead Magnet Generator',
          icon: Zap,
          description: 'Conversion-focused content'
        }
      ]
    },
    {
      id: 'crm',
      title: 'CRM & Revenue',
      expandable: true,
      badge: 'COMING SOON',
      items: [
        {
          id: 'contacts',
          title: 'Contacts',
          icon: Users,
          description: 'Contact management',
          disabled: true
        },
        {
          id: 'companies',
          title: 'Companies',
          icon: Building,
          description: 'Company profiles',
          disabled: true
        },
        {
          id: 'deals',
          title: 'Deal Pipeline',
          icon: DollarSign,
          description: 'Sales pipeline management',
          disabled: true
        },
        {
          id: 'activities',
          title: 'Activities',
          icon: Calendar,
          description: 'Activity timeline',
          disabled: true
        }
      ]
    }
  ];

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

  const handleNavigation = (itemId, itemTitle) => {
    if (setActiveTab) {
      setActiveTab(itemId);
    }
    if (onViewChange) {
      onViewChange(itemId);
    }
    
    // Track navigation
    trackTool('navigation', 'sidebar_click', { destination: itemId });
    trackPage(itemTitle, 'sidebar_navigation');
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLogoutSuccess(true);
      setTimeout(() => {
        setLogoutSuccess(false);
        setShowLogoutConfirm(false);
      }, 2000);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-16' : 'w-80 lg:w-72'}
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <AttributeAILogo className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AttributeAI</h1>
                <p className="text-xs text-gray-500">Marketing Intelligence</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationSections.map((section) => (
            <div key={section.id} className="mb-6">
              {/* Section Header */}
              {!sidebarCollapsed && (
                <div className="px-4 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {section.title}
                      </h3>
                      {section.badge && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    {section.expandable && (
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            expandedSections[section.id] ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Section Items */}
              {(!section.expandable || expandedSections[section.id] || sidebarCollapsed) && (
                <div className="space-y-1 px-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isDisabled = item.disabled;

                    return (
                      <button
                        key={item.id}
                        onClick={() => !isDisabled && handleNavigation(item.id, item.title)}
                        disabled={isDisabled}
                        className={`
                          w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                            : isDisabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                          ${sidebarCollapsed ? 'justify-center px-2' : ''}
                        `}
                        title={sidebarCollapsed ? item.title : undefined}
                      >
                        <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-700' : ''}`} />
                        
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{item.title}</span>
                              {item.badge && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  item.badge === 'NEW' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
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
        <div className="border-t border-gray-200 p-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={`
                w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.email || 'user@example.com'}
                  </p>
                </div>
              )}
              
              {!sidebarCollapsed && (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarCollapsed(false)}
        className={`
          fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-lg border border-gray-200 lg:hidden
          ${!sidebarCollapsed ? 'hidden' : ''}
        `}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Main Content Wrapper - Remove this section since App.js handles the layout */}
      {/* Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            {logoutSuccess ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Logged Out Successfully</h3>
                <p className="text-gray-600">Redirecting to login...</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to log out of AttributeAI?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarNavigation;
