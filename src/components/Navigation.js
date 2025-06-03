import React, { useState } from 'react';
import { BarChart3, Activity, TrendingUp, Search, PenTool, Target, Eye, FileSpreadsheet, Settings, User, Bell, Grid, Brain, Sparkles, LogOut, Globe } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, userProfile, onLogout }) => {
  const tabs = [
    { id: 'dashboard', name: 'Unified Dashboard', icon: Grid },
    { id: 'demo-video', name: 'Demo Video', icon: Eye },
    { id: 'api-test', name: 'API Test', icon: Brain },
    { id: 'claude-demo', name: 'Claude AI Demo', icon: Brain, phase2: true },
    { id: 'dashboard-enhanced', name: 'Enhanced Dashboard', icon: Sparkles, phase2: true },
    { id: 'seo-enhanced', name: 'AI SEO Analysis', icon: Search, phase2: true },
    { id: 'attribution', name: 'Attribution Engine', icon: BarChart3 },
    { id: 'realtime', name: 'Real-Time Tracking', icon: Activity },
    { id: 'analytics', name: 'Journey Analytics', icon: TrendingUp },
    { id: 'seo', name: 'SEO Analysis', icon: Search },
    { id: 'content', name: 'Content Strategy', icon: PenTool },
    { id: 'leadmagnet', name: 'Lead Magnet Generator', icon: Target },
    { id: 'cro', name: 'CRO Analyzer', icon: Eye },
    { id: 'gsc', name: 'GSC Data Analyzer', icon: FileSpreadsheet }
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
            {userProfile?.website && (
              <div className="hidden lg:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  {(() => {
                    try {
                      return new URL(userProfile.website).hostname;
                    } catch {
                      return userProfile.website.replace(/^https?:\/\//, '');
                    }
                  })()}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-gray-700">
                  {userProfile?.businessName || userProfile?.email || 'Demo User'}
                </span>
                <p className="text-xs text-gray-500">
                  {userProfile?.industry || 'Free Trial'}
                </p>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="ml-3 p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;