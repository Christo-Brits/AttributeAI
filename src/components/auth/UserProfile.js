import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { User, Globe, BarChart3, Facebook, Search, Edit3, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

const UserProfile = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update user profile via API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('attributeai_session') || sessionStorage.getItem('attributeai_session') || '{}').token}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser.user);
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
    setIsLoading(false);
  };

  const ConnectionStatus = ({ hasData, label, icon: Icon }) => (
    <div className="flex items-center space-x-2 p-3 border rounded-lg">
      <Icon size={20} className={hasData ? 'text-green-600' : 'text-gray-400'} />
      <div className="flex-1">
        <p className="font-medium text-gray-800">{label}</p>
        <p className={`text-sm ${hasData ? 'text-green-600' : 'text-gray-500'}`}>
          {hasData ? 'Connected' : 'Not Connected'}
        </p>
      </div>
      {hasData ? (
        <CheckCircle size={16} className="text-green-600" />
      ) : (
        <AlertCircle size={16} className="text-gray-400" />
      )}
    </div>
  );

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          
          {/* Profile Information */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <Edit3 size={16} />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(user);
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{user.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{user.lastName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.company || ''}
                    onChange={(e) => setEditData({...editData, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{user.company || 'Not specified'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                {isEditing ? (
                  <select
                    value={editData.industry || ''}
                    onChange={(e) => setEditData({...editData, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select industry</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Travel">Travel</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-800">{user.industry || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Connected Analytics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Analytics</h3>
            <div className="space-y-3">
              <ConnectionStatus
                hasData={user.websiteUrl}
                label="Website"
                icon={Globe}
              />
              {user.websiteUrl && (
                <div className="ml-10 text-sm text-gray-600">
                  <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {user.websiteUrl}
                  </a>
                </div>
              )}

              <ConnectionStatus
                hasData={user.analytics?.googleAnalyticsId}
                label="Google Analytics"
                icon={BarChart3}
              />
              {user.analytics?.googleAnalyticsId && (
                <div className="ml-10 text-sm text-gray-600">
                  ID: {user.analytics.googleAnalyticsId}
                </div>
              )}

              <ConnectionStatus
                hasData={user.analytics?.googleSearchConsoleUrl}
                label="Google Search Console"
                icon={Search}
              />

              <ConnectionStatus
                hasData={user.analytics?.metaBusinessId}
                label="Meta Business Manager"
                icon={Facebook}
              />
            </div>
          </div>

          {/* Marketing Goals */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Marketing Goals</h3>
            {user.primaryGoals && user.primaryGoals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.primaryGoals.map((goal, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No goals specified</p>
            )}
          </div>

          {/* Current Tools */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Tools</h3>
            {user.currentTools && user.currentTools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.currentTools.map((tool, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tools specified</p>
            )}
          </div>

          {/* AI Context Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🤖 AI Assistant Context</h4>
            <p className="text-blue-700 text-sm mb-2">
              Your AI assistant has access to the following information for personalized recommendations:
            </p>
            <ul className="text-blue-600 text-sm space-y-1">
              <li>• Website: {user.websiteUrl ? '✅ Connected' : '❌ Not connected'}</li>
              <li>• Industry: {user.industry ? '✅ Specified' : '❌ Not specified'}</li>
              <li>• Goals: {user.primaryGoals?.length ? `✅ ${user.primaryGoals.length} goals` : '❌ No goals set'}</li>
              <li>• Tools: {user.currentTools?.length ? `✅ ${user.currentTools.length} tools` : '❌ No tools specified'}</li>
              <li>• Analytics: {user.analytics?.googleAnalyticsId ? '✅ GA connected' : '❌ GA not connected'}</li>
            </ul>
            <p className="text-blue-600 text-xs mt-2">
              The more information you provide, the better your AI assistant can help you achieve your marketing goals.
            </p>
          </div>

          {/* Account Information */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              {user.lastLogin && (
                <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
              )}
              <p>Monthly Traffic: {user.monthlyTraffic || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;