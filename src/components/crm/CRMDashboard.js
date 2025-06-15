// =============================================================================
// CRMDashboard.js - Main CRM Dashboard Component
// Central hub for AttributeAI's CRM functionality - The "HubSpot Killer"
// Features: Overview, quick actions, attribution intelligence
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Users, Building, DollarSign, TrendingUp, Activity, Calendar, Target, Plus, Eye, ArrowRight, Star, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '../ui/DesignSystem';

// Import CRM components
import ContactManager from './ContactManager';
import DealPipeline from './DealPipeline';

const CRMDashboard = () => {
    // State management
    const [activeTab, setActiveTab] = useState('overview');
    const [overviewData, setOverviewData] = useState({});
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [demoMode, setDemoMode] = useState(false);

    // Fetch overview data
    useEffect(() => {
        fetchOverviewData();
        fetchRecentActivities();
    }, []);

    const fetchOverviewData = async () => {
        try {
            const response = await fetch('/api/crm/overview');
            const result = await response.json();
            
            if (result.success) {
                setOverviewData(result.data);
                setDemoMode(result.demo_mode);
            } else {
                console.error('Failed to fetch overview:', result.error);
                setOverviewData(getDemoOverviewData());
                setDemoMode(true);
            }
        } catch (error) {
            console.error('Error fetching overview:', error);
            setOverviewData(getDemoOverviewData());
            setDemoMode(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentActivities = async () => {
        try {
            const response = await fetch('/api/crm/activities?limit=10');
            const result = await response.json();
            
            if (result.success) {
                setRecentActivities(result.data);
            } else {
                setRecentActivities(getDemoActivities());
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            setRecentActivities(getDemoActivities());
        }
    };

    // Demo data
    const getDemoOverviewData = () => ({
        total_companies: 3,
        total_contacts: 5,
        total_deals: 3,
        pipeline_value: 48000,
        closed_value: 15000,
        activities_this_week: 12,
        conversion_rate: 25,
        avg_deal_size: 16000
    });

    const getDemoActivities = () => [
        {
            id: 'activity-1',
            activity_type: 'call',
            subject: 'Discovery Call with TechCorp',
            description: 'Discussed their attribution needs and pain points',
            contact: { first_name: 'Sarah', last_name: 'Johnson' },
            company: { name: 'TechCorp Solutions' },
            created_at: '2024-06-14T10:30:00Z'
        },
        {
            id: 'activity-2',
            activity_type: 'email',
            subject: 'Proposal sent to Marketing Pro',
            description: 'Sent detailed proposal with pricing options',
            contact: { first_name: 'Mike', last_name: 'Chen' },
            company: { name: 'Marketing Agency Pro' },
            created_at: '2024-06-14T09:15:00Z'
        },
        {
            id: 'activity-3',
            activity_type: 'meeting',
            subject: 'Demo scheduled with E-commerce Plus',
            description: 'Product demo scheduled for next week',
            contact: { first_name: 'Lisa', last_name: 'Rodriguez' },
            company: { name: 'E-commerce Plus' },
            created_at: '2024-06-13T16:45:00Z'
        }
    ];

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Get activity icon
    const getActivityIcon = (type) => {
        const icons = {
            call: '📞',
            email: '📧',
            meeting: '🤝',
            demo_booked: '🎯',
            proposal_sent: '📄',
            note: '📝',
            task: '✅',
            linkedin_visit: '💼',
            website_visit: '🌐'
        };
        return icons[type] || '📋';
    };

    // Render overview tab
    const renderOverview = () => (
        <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Pipeline Value</p>
                            <p className="text-2xl font-bold text-blue-900">{formatCurrency(overviewData.pipeline_value)}</p>
                            <p className="text-xs text-blue-600 mt-1">
                                {overviewData.total_deals || 0} open deals
                            </p>
                        </div>
                        <DollarSign className="text-blue-600" size={28} />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Closed Revenue</p>
                            <p className="text-2xl font-bold text-green-900">{formatCurrency(overviewData.closed_value)}</p>
                            <p className="text-xs text-green-600 mt-1">
                                {overviewData.conversion_rate || 0}% conversion rate
                            </p>
                        </div>
                        <TrendingUp className="text-green-600" size={28} />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Total Contacts</p>
                            <p className="text-2xl font-bold text-purple-900">{overviewData.total_contacts || 0}</p>
                            <p className="text-xs text-purple-600 mt-1">
                                {overviewData.total_companies || 0} companies
                            </p>
                        </div>
                        <Users className="text-purple-600" size={28} />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
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