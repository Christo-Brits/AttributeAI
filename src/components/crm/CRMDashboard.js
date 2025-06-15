justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Avg Deal Size</p>
                            <p className="text-2xl font-bold text-yellow-900">{formatCurrency(overviewData.avg_deal_size)}</p>
                            <p className="text-xs text-yellow-600 mt-1">
                                {overviewData.activities_this_week || 0} activities this week
                            </p>
                        </div>
                        <Target className="text-yellow-600" size={28} />
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    
                    <div className="space-y-3">
                        <Button
                            onClick={() => setActiveTab('contacts')}
                            className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                        >
                            <div className="flex items-center gap-3">
                                <Plus className="text-blue-600" size={20} />
                                <span>Add New Contact</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                        
                        <Button
                            onClick={() => setActiveTab('pipeline')}
                            className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                        >
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-green-600" size={20} />
                                <span>Create New Deal</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                        
                        <Button
                            onClick={() => setActiveTab('attribution')}
                            className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 className="text-purple-600" size={20} />
                                <span>View Attribution Report</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                        
                        <Button
                            onClick={() => setActiveTab('contacts')}
                            className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200"
                        >
                            <div className="flex items-center gap-3">
                                <Activity className="text-yellow-600" size={20} />
                                <span>Log Activity</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                        <Button
                            onClick={() => setActiveTab('activities')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View All
                        </Button>
                    </div>
                    
                    <div className="space-y-4">
                        {recentActivities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                <div className="text-lg">{getActivityIcon(activity.activity_type)}</div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.subject}
                                    </p>
                                    
                                    {activity.contact && (
                                        <p className="text-sm text-gray-600">
                                            {activity.contact.first_name} {activity.contact.last_name}
                                            {activity.company && (
                                                <span className="text-gray-400"> • {activity.company.name}</span>
                                            )}
                                        </p>
                                    )}
                                    
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(activity.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        
                        {recentActivities.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <Activity size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No recent activities</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Attribution Intelligence Preview */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-900">Attribution Intelligence</h3>
                        <p className="text-indigo-600 text-sm">See which marketing activities drive real revenue</p>
                    </div>
                    <Button
                        onClick={() => setActiveTab('attribution')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        View Full Report
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/60 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🎯</span>
                            <span className="text-sm font-medium text-indigo-900">Top Keyword</span>
                        </div>
                        <p className="text-indigo-800 font-semibold">saas marketing tools</p>
                        <p className="text-xs text-indigo-600">$25k in pipeline</p>
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📊</span>
                            <span className="text-sm font-medium text-indigo-900">Best Channel</span>
                        </div>
                        <p className="text-indigo-800 font-semibold">Organic Search</p>
                        <p className="text-xs text-indigo-600">65% of deals</p>
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">💰</span>
                            <span className="text-sm font-medium text-indigo-900">Marketing ROI</span>
                        </div>
                        <p className="text-indigo-800 font-semibold">12.5x</p>
                        <p className="text-xs text-indigo-600">$48k revenue / $3.8k cost</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Main component render
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
                        <p className="text-gray-600">
                            Complete customer relationship management with attribution intelligence
                            {demoMode && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                    Demo Mode
                                </span>
                            )}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setActiveTab('contacts')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Add Contact
                        </Button>
                        
                        <Button
                            onClick={() => setActiveTab('pipeline')}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <DollarSign size={16} />
                            Add Deal
                        </Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', name: 'Overview', icon: BarChart3 },
                            { id: 'contacts', name: 'Contacts', icon: Users },
                            { id: 'pipeline', name: 'Pipeline', icon: Target },
                            { id: 'attribution', name: 'Attribution', icon: TrendingUp },
                            { id: 'activities', name: 'Activities', icon: Activity }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading CRM data...</span>
                </div>
            ) : (
                <div className="tab-content">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'contacts' && <ContactManager />}
                    {activeTab === 'pipeline' && <DealPipeline />}
                    {activeTab === 'attribution' && (
                        <div className="text-center py-12">
                            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Attribution Analytics</h3>
                            <p className="text-gray-600 mb-4">Coming soon - Revenue attribution analysis</p>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Request Early Access
                            </Button>
                        </div>
                    )}
                    {activeTab === 'activities' && (
                        <div className="text-center py-12">
                            <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Activity Management</h3>
                            <p className="text-gray-600 mb-4">Coming soon - Complete activity tracking</p>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Request Early Access
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CRMDashboard;