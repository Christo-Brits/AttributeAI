import React, { useState } from 'react';
import { BarChart3, Activity, TrendingUp, Search, PenTool, Target, Eye, Settings, User, Bell, Grid, LogOut, Globe } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import UserProfile from './auth/UserProfile';

const Navigation = ({ activeTab, setActiveTab, userProfile }) => {
  const { logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
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
              <h1 className="text-xl font-bold text-gray-900">AttributeAI</h1>
              <p className="text-xs text-gray-500">Weather Intelligence Attribution</p>
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
            {userProfile?.websiteUrl && (
              <div className="hidden lg:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  {(() => {
                    try {
                      return new URL(userProfile.websiteUrl).hostname;
                    } catch {
                      return userProfile.websiteUrl.replace(/^https?:\/\//, '');
                    }
                  })()}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-sm font-medium text-gray-700">
                    {userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : userProfile?.email || 'Demo User'}
                  </span>
                  <p className="text-xs text-gray-500">
                    {userProfile?.company || userProfile?.industry || 'Free Trial'}
                  </p>
                </div>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="ml-3 p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Logout"
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
    </nav>
  );
};

export default Navigation;