                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Revenue */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Daily Revenue (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dashboardData.trends.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#00AA44" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Funnel Tab */}
        {activeTab === 'funnel' && conversionFunnel && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-6">Conversion Funnel Analysis</h3>
              
              {/* Funnel Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{conversionFunnel.summary.totalVisitors}</div>
                  <div className="text-sm text-blue-800">Total Visitors</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{conversionFunnel.summary.totalConverted}</div>
                  <div className="text-sm text-green-800">Paid Customers</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{conversionFunnel.summary.overallConversionRate}%</div>
                  <div className="text-sm text-purple-800">Overall Conversion Rate</div>
                </div>
              </div>

              {/* Funnel Visualization */}
              <div className="space-y-4">
                {conversionFunnel.funnel.map((stage, index) => {
                  const prevStage = index > 0 ? conversionFunnel.funnel[index - 1] : null;
                  const width = Math.max(20, (stage.count / conversionFunnel.funnel[0].count) * 100);
                  
                  return (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center">
                        <div className="w-32 text-sm font-medium text-gray-700">
                          {stage.name}
                        </div>
                        <div className="flex-1 relative">
                          <div 
                            className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-r-lg flex items-center justify-between px-4 text-white font-semibold"
                            style={{ width: `${width}%` }}
                          >
                            <span>{stage.count} users</span>
                            {index > 0 && (
                              <span className="text-sm">
                                {stage.conversionRate}% conversion
                              </span>
                            )}
                          </div>
                          {index > 0 && stage.dropoffRate > 0 && (
                            <div className="absolute top-12 left-0 text-xs text-red-600">
                              {stage.dropoffRate}% drop-off
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Biggest Dropoff Alert */}
              {conversionFunnel.summary.biggestDropoff.rate > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-600 mr-2">⚠️</span>
                    <div>
                      <div className="text-red-800 font-semibold">Biggest Conversion Opportunity</div>
                      <div className="text-red-700 text-sm">
                        {conversionFunnel.summary.biggestDropoff.rate}% drop-off at "{conversionFunnel.summary.biggestDropoff.stage}" stage
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Optimization Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">🎯 Conversion Optimization Recommendations</h3>
              <div className="space-y-3">
                <RecommendationCard
                  priority="High"
                  title="Improve Feature Activation"
                  description="Focus on getting more signups to use their first feature within 24 hours"
                  impact="Could increase conversion by 15-25%"
                />
                <RecommendationCard
                  priority="Medium"
                  title="Enhance Onboarding Flow"
                  description="Guide users through 3+ features to reach 'engaged' status faster"
                  impact="Could improve engagement by 20%"
                />
                <RecommendationCard
                  priority="Low"
                  title="Trial Extension for Qualified Users"
                  description="Extend trial period for users with high engagement scores"
                  impact="Could recover 10-15% of trial expires"
                />
              </div>
            </div>
          </div>
        )}

        {/* User Details Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">User Details & Conversion Stages</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engagement Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trial Days Left
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Features Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        LTV
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">{user.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.accountType === 'free' ? 'bg-gray-100 text-gray-800' :
                            user.accountType === 'professional' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {user.accountType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ConversionStageIndicator stage={user.conversionStage} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${user.engagementScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{user.engagementScore}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.trialDaysRemaining !== null ? (
                            <span className={user.trialDaysRemaining < 3 ? 'text-red-600 font-semibold' : ''}>
                              {user.trialDaysRemaining} days
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.featuresUsed.map((feature) => (
                              <span key={feature} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                                {feature.replace('-', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${user.lifetimeValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Behavior Tab */}
        {activeTab === 'behavior' && dashboardData && (
          <div className="space-y-6">
            {/* Feature Adoption Timeline */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Feature Adoption Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.trends.featureAdoption}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#0066CC" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent User Activity</h3>
              <div className="space-y-3">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {activity.action === 'login' ? '🔐' : 
                           activity.action === 'feature_used' ? '⚡' : 
                           activity.action === 'subscription_upgraded' ? '💰' : '📊'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          User {activity.userId} - {activity.action.replace('_', ' ')}
                        </div>
                        {activity.feature && (
                          <div className="text-xs text-gray-500">
                            Feature: {activity.feature.replace('-', ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">User Engagement Distribution</h3>
                <div className="space-y-3">
                  <EngagementBar label="High Engagement (80-100)" count={users.filter(u => u.engagementScore >= 80).length} color="bg-green-500" />
                  <EngagementBar label="Medium Engagement (50-79)" count={users.filter(u => u.engagementScore >= 50 && u.engagementScore < 80).length} color="bg-yellow-500" />
                  <EngagementBar label="Low Engagement (0-49)" count={users.filter(u => u.engagementScore < 50).length} color="bg-red-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Trial Urgency Status</h3>
                <div className="space-y-3">
                  <EngagementBar 
                    label="Expiring Soon (≤3 days)" 
                    count={users.filter(u => u.trialDaysRemaining !== null && u.trialDaysRemaining <= 3).length} 
                    color="bg-red-500" 
                  />
                  <EngagementBar 
                    label="Expiring This Week (4-7 days)" 
                    count={users.filter(u => u.trialDaysRemaining !== null && u.trialDaysRemaining > 3 && u.trialDaysRemaining <= 7).length} 
                    color="bg-yellow-500" 
                  />
                  <EngagementBar 
                    label="Active Trial (>7 days)" 
                    count={users.filter(u => u.trialDaysRemaining !== null && u.trialDaysRemaining > 7).length} 
                    color="bg-green-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const MetricCard = ({ title, value, change, positive, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4 flex-1">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
    </div>
  </div>
);

const ConversionStageIndicator = ({ stage }) => {
  const stageConfig = {
    visitor: { color: 'bg-gray-100 text-gray-800', icon: '👁️' },
    signup: { color: 'bg-blue-100 text-blue-800', icon: '✍️' },
    activated: { color: 'bg-green-100 text-green-800', icon: '⚡' },
    engaged: { color: 'bg-purple-100 text-purple-800', icon: '🎯' },
    qualified: { color: 'bg-orange-100 text-orange-800', icon: '🏆' },
    converted: { color: 'bg-emerald-100 text-emerald-800', icon: '💰' }
  };

  const config = stageConfig[stage] || stageConfig.visitor;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {stage}
    </span>
  );
};

const RecommendationCard = ({ priority, title, description, impact }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
            priority === 'High' ? 'bg-red-100 text-red-800' :
            priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {priority} Priority
          </span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <p className="text-xs text-blue-600 font-medium">{impact}</p>
      </div>
    </div>
  </div>
);

const EngagementBar = ({ label, count, color }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="flex items-center">
      <div className={`w-4 h-4 ${color} rounded mr-2`}></div>
      <span className="text-sm font-semibold">{count}</span>
    </div>
  </div>
);

export default UserAnalyticsDashboard;