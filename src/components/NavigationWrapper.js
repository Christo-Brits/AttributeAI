import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, Activity, TrendingUp, Search, PenTool, Target, Eye, Settings, User, Bell, Grid, LogOut, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import UserProfile from './auth/UserProfile';
import AttributeAILogo from './ui/AttributeAILogo';

const NavigationWrapper = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const dropdownRef = useRef(null);

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

  const tabs = [
    { id: 'dashboard', name: 'Unified Dashboard', icon: Grid },
    { id: 'seo-enhanced', name: 'AI SEO Analysis', icon: Search, phase2: true },
    { id: 'content', name: 'Content Strategy', icon: PenTool },
    { id: 'attribution', name: 'Attribution Engine', icon: BarChart3 },
    { id: 'realtime', name: 'Real-Time Tracking', icon: Activity },
    { id: 'analytics', name: 'Journey Analytics', icon: TrendingUp },
    { id: 'leadmagnet', name: 'Lead Magnet Generator', icon: Target },
    { id: 'cro', name: 'CRO Analyzer', icon: Eye }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AttributeAILogo 
                width={220} 
                height={40} 
                className="text-gray-900"
                showText={true}
                variant="horizontal"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? tab.phase2 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {tab.phase2 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1 rounded-full">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
            
            {/* Website Badge */}
            {user?.websiteUrl && (
              <div className="hidden lg:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  {(() => {
                    try {
                      return new URL(user.websiteUrl).hostname;
                    } catch {
                      return user.websiteUrl.replace(/^https?:\/\//, '');
                    }
                  })()}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 relative">
              {/* User Profile Button with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email || 'Demo User'}
                    </span>
                    <p className="text-xs text-gray-500">
                      {user?.company || user?.industry || 'Free Trial'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setShowProfile(true);
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        // Add settings functionality later
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Quick Logout Button */}
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Quick Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
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
    </nav>
  );
};

export default NavigationWrapper;