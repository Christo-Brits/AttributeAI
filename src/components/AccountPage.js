import React, { useState, useEffect } from 'react';
import { 
  User, 
  CreditCard, 
  Shield, 
  Settings, 
  Download, 
  BarChart3, 
  Calendar,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  Check,
  X,
  Edit2,
  Save,
  Trash2,
  AlertCircle
} from 'lucide-react';

const AccountPage = ({ onBackToApp }) => {
  const [user, setUser] = useState({
    email: 'user@example.com',
    name: 'Demo User',
    plan: 'Pro',
    status: 'Active',
    trialEndsAt: '2025-06-27',
    customerId: 'cus_demo123',
    subscriptionId: 'sub_demo456'
  });

  const [billingInfo, setBillingInfo] = useState({
    nextBilling: '2025-07-13',
    amount: '$97.00',
    method: '•••• 4242',
    status: 'Active'
  });

  const [usage, setUsage] = useState({
    contentGenerated: 47,
    contentLimit: 'Unlimited',
    apiCalls: 1250,
    apiLimit: 10000,
    storageUsed: '2.4 GB',
    storageLimit: '100 GB'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.customerId,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: user.subscriptionId,
        }),
      });

      const data = await response.json();
      
      if (data.subscription) {
        alert('Subscription will be canceled at the end of your billing period.');
        setIsCanceling(false);
        // Update user status
        setUser(prev => ({ ...prev, status: 'Canceling' }));
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Error canceling subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
    alert('Profile updated successfully!');
  };

  const handleExportData = () => {
    // Create a sample export
    const exportData = {
      user: user,
      usage: usage,
      billingInfo: billingInfo,
      exportDate: new Date().toISOString(),
      contentGenerated: 47,
      insights: 'Sample export data'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `attributeai-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onBackToApp}
                className="text-gray-300 hover:text-white mr-4 transition-colors"
              >
                ← Back to App
              </button>
              <h1 className="text-xl font-bold text-white">Account Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Plan: {user.plan}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.status === 'Active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{user.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{user.email}</p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Usage & Analytics */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Usage & Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{usage.contentGenerated}</div>
                  <div className="text-gray-300">Content Generated</div>
                  <div className="text-sm text-gray-400">Limit: {usage.contentLimit}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{usage.apiCalls.toLocaleString()}</div>
                  <div className="text-gray-300">API Calls</div>
                  <div className="text-sm text-gray-400">Limit: {usage.apiLimit.toLocaleString()}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{usage.storageUsed}</div>
                  <div className="text-gray-300">Storage Used</div>
                  <div className="text-sm text-gray-400">Limit: {usage.storageLimit}</div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleExportData}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Billing Information */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4">Billing</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Plan</span>
                  <span className="text-white font-semibold">{user.plan}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Next Billing</span>
                  <span className="text-white">{billingInfo.nextBilling}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amount</span>
                  <span className="text-white font-semibold">{billingInfo.amount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Payment Method</span>
                  <span className="text-white">{billingInfo.method}</span>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleManageBilling}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 mb-3"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isLoading ? 'Loading...' : 'Manage Billing'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  
                  {user.status === 'Active' && (
                    <button
                      onClick={() => setIsCanceling(true)}
                      className="w-full text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 text-left p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">View Analytics</div>
                    <div className="text-gray-400 text-sm">Performance insights</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 text-left p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Export Data</div>
                    <div className="text-gray-400 text-sm">Download your data</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 text-left p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">API Settings</div>
                    <div className="text-gray-400 text-sm">Configure integrations</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 text-left p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">Security</div>
                    <div className="text-gray-400 text-sm">Privacy & security</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4">Support</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 text-left p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Contact Support</div>
                    <div className="text-gray-400 text-sm">Get help from our team</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 text-left p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <Globe className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Help Center</div>
                    <div className="text-gray-400 text-sm">Documentation & guides</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {isCanceling && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Cancel Subscription</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel your subscription? You'll continue to have access until your current billing period ends on {billingInfo.nextBilling}.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setIsCanceling(false)}
                className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;