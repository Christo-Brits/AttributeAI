// =============================================================================
// CRMDashboard.js - Main CRM Dashboard Component
// Central hub for AttributeAI's CRM functionality - The "HubSpot Killer"
// Features: Overview, quick actions, attribution intelligence
// Updated with consistent dark theme styling
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Users, Building, DollarSign, TrendingUp, Activity, Calendar, Target, Plus, Eye, ArrowRight, Star, CheckCircle, AlertTriangle, BarChart3, Zap, Mail, Phone } from 'lucide-react';
import { Button, Card, Badge } from '../ui/DesignSystem';

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
                {/* Pipeline Value Card */}
                <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30 hover-glow-blue">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm font-medium mb-2">Pipeline Value</p>
                            <p className="text-2xl font-bold text-white">{formatCurrency(overviewData.pipeline_value)}</p>
                            <p className="text-xs text-blue-300 mt-1">
                                {overviewData.total_deals || 0} open deals
                            </p>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <DollarSign className="text-blue-400" size={28} />
                        </div>
                    </div>
                </Card>
                
                {/* Closed Revenue Card */}
                <Card className="p-6 bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-green-500/30 hover-glow-green">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-400 text-sm font-medium mb-2">Closed Revenue</p>
                            <p className="text-2xl font-bold text-white">{formatCurrency(overviewData.closed_value)}</p>
                            <p className="text-xs text-green-300 mt-1">
                                {overviewData.conversion_rate || 0}% conversion rate
                            </p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <TrendingUp className="text-green-400" size={28} />
                        </div>
                    </div>
                </Card>
                
                {/* Total Contacts Card */}
                <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30 hover-glow-purple">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400 text-sm font-medium mb-2">Total Contacts</p>
                            <p className="text-2xl font-bold text-white">{overviewData.total_contacts || 0}</p>
                            <p className="text-xs text-purple-300 mt-1">
                                {overviewData.total_companies || 0} companies
                            </p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Users className="text-purple-400" size={28} />
                        </div>
                    </div>
                </Card>
                
                {/* Average Deal Size Card */}
                <Card className="p-6 bg-gradient-to-br from-orange-900/40 to-yellow-800/40 border-orange-500/30 hover-glow-pink">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-400 text-sm font-medium mb-2">Avg Deal Size</p>
                            <p className="text-2xl font-bold text-white">{formatCurrency(overviewData.avg_deal_size)}</p>
                            <p className="text-xs text-orange-300 mt-1">
                                {overviewData.activities_this_week || 0} activities this week
                            </p>
                        </div>
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                            <Target className="text-orange-400" size={28} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Zap className="text-blue-400" size={20} />
                        Quick Actions
                    </h3>
                    
                    <div className="space-y-3">
                        <Button
                            onClick={() => setActiveTab('contacts')}
                            variant="outline"
                            className="w-full flex items-center justify-between p-4 bg-blue-900/20 hover:bg-blue-800/30 text-blue-300 border-blue-500/30 hover:border-blue-400/50"
                        >
                            <div className="flex items-center gap-3">
                                <Plus className="text-blue-400" size={20} />
                                <span>Add New Contact</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                        
                        <Button
                            onClick={() => setActiveTab('pipeline')}
                            variant="outline"
                            className="w-full flex items-center justify-between p-4 bg-green-900/20 hover:bg-green-800/30 text-green-300 border-green-500/30 hover:border-green-400/50"
                        >
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-green-400" size={20} />
                                <span>Create New Deal</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                        
                        <Button
                            onClick={() => setActiveTab('attribution')}
                            variant="outline"
                            className="w-full flex items-center justify-between p-4 bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-500/30 hover:border-purple-400/50"
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 className="text-purple-400" size={20} />
                                <span>View Attribution Report</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                        
                        <Button
                            onClick={() => setActiveTab('contacts')}
                            variant="outline"
                            className="w-full flex items-center justify-between p-4 bg-orange-900/20 hover:bg-orange-800/30 text-orange-300 border-orange-500/30 hover:border-orange-400/50"
                        >
                            <div className="flex items-center gap-3">
                                <Activity className="text-orange-400" size={20} />
                                <span>Log Activity</span>
                            </div>
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </Card>

                {/* Recent Activities */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Activity className="text-blue-400" size={20} />
                            Recent Activities
                        </h3>
                        <Button
                            onClick={() => setActiveTab('activities')}
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            View All
                        </Button>
                    </div>
                    
                    <div className="space-y-4">
                        {recentActivities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                                <div className="text-lg">{getActivityIcon(activity.activity_type)}</div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">
                                        {activity.subject}
                                    </p>
                                    
                                    {activity.contact && (
                                        <p className="text-sm text-gray-300">
                                            {activity.contact.first_name} {activity.contact.last_name}
                                            {activity.company && (
                                                <span className="text-gray-400"> • {activity.company.name}</span>
                                            )}
                                        </p>
                                    )}
                                    
                                    <p className="text-xs text-gray-500 mt-1">
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
                </Card>
            </div>

            {/* Attribution Intelligence Preview */}
            <Card className="p-6 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border-indigo-500/30 glow-purple">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <BarChart3 className="text-indigo-400" size={20} />
                            Attribution Intelligence
                        </h3>
                        <p className="text-indigo-300 text-sm">See which marketing activities drive real revenue</p>
                    </div>
                    <Button
                        onClick={() => setActiveTab('attribution')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg"
                    >
                        View Full Report
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🎯</span>
                            <span className="text-sm font-medium text-indigo-300">Top Keyword</span>
                        </div>
                        <p className="text-white font-semibold">saas marketing tools</p>
                        <p className="text-xs text-indigo-400">$25k in pipeline</p>
                    </div>
                    
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📊</span>
                            <span className="text-sm font-medium text-purple-300">Best Channel</span>
                        </div>
                        <p className="text-white font-semibold">Organic Search</p>
                        <p className="text-xs text-purple-400">65% of deals</p>
                    </div>
                    
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">💰</span>
                            <span className="text-sm font-medium text-pink-300">Marketing ROI</span>
                        </div>
                        <p className="text-white font-semibold">12.5x</p>
                        <p className="text-xs text-pink-400">$48k revenue / $3.8k cost</p>
                    </div>
                </div>
            </Card>
        </div>
    );

    // Main component render
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                CRM Dashboard
                            </h1>
                            <p className="text-gray-400">
                                Complete customer relationship management with attribution intelligence
                                {demoMode && (
                                    <Badge variant="warning" className="ml-2">
                                        Demo Mode
                                    </Badge>
                                )}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setActiveTab('contacts')}
                                className="flex items-center gap-2"
                                variant="primary"
                            >
                                <Plus size={16} />
                                Add Contact
                            </Button>
                            
                            <Button
                                onClick={() => setActiveTab('pipeline')}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                            >
                                <DollarSign size={16} />
                                Add Deal
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-700/50">
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
                                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-400'
                                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
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
                        <div className="loading-spinner h-8 w-8"></div>
                        <span className="ml-3 text-gray-400">Loading CRM data...</span>
                    </div>
                ) : (
                    <div className="tab-content">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'contacts' && <ContactManager />}
                        {activeTab === 'pipeline' && <DealPipeline />}
                        {activeTab === 'attribution' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Card className="p-6 bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-400 text-sm font-medium mb-2">Total Attributed Revenue</p>
                                            <p className="text-2xl font-bold text-white">$132,300</p>
                                        </div>
                                        <div className="p-3 bg-green-500/20 rounded-xl">
                                            <DollarSign className="text-green-400" size={24} />
                                        </div>
                                    </div>
                                </Card>
                                
                                <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-400 text-sm font-medium mb-2">Attribution Rate</p>
                                            <p className="text-2xl font-bold text-white">90%</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/20 rounded-xl">
                                            <Target className="text-blue-400" size={24} />
                                        </div>
                                    </div>
                                </Card>
                                
                                <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-400 text-sm font-medium mb-2">Top Channel</p>
                                            <p className="text-xl font-bold text-white">Organic Search</p>
                                            <p className="text-sm text-purple-400">$45,600 revenue</p>
                                        </div>
                                        <div className="p-3 bg-purple-500/20 rounded-xl">
                                            <TrendingUp className="text-purple-400" size={24} />
                                        </div>
                                    </div>
                                </Card>
                                
                                <Card className="md:col-span-2 lg:col-span-3 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-white">Revenue Attribution by Channel</h3>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => window.location.hash = '#crm-attribution'}
                                        >
                                            View Full Report
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                            <span className="text-white">Organic Search</span>
                                            <span className="text-green-400 font-semibold">$45,600 (34.5%)</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                            <span className="text-white">Paid Search</span>
                                            <span className="text-green-400 font-semibold">$38,200 (28.9%)</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                            <span className="text-white">LinkedIn</span>
                                            <span className="text-green-400 font-semibold">$28,500 (21.5%)</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                            <span className="text-white">Content Marketing</span>
                                            <span className="text-green-400 font-semibold">$20,000 (15.1%)</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                        {activeTab === 'activities' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-400 text-sm font-medium mb-2">Total Activities</p>
                                            <p className="text-2xl font-bold text-white">247</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/20 rounded-xl">
                                            <Activity className="text-blue-400" size={24} />
                                        </div>
                                    </div>
                                </Card>
                                
                                <Card className="p-6 bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-400 text-sm font-medium mb-2">This Week</p>
                                            <p className="text-2xl font-bold text-white">42</p>
                                        </div>
                                        <div className="p-3 bg-green-500/20 rounded-xl">
                                            <Calendar className="text-green-400" size={24} />
                                        </div>
                                    </div>
                                </Card>
                                
                                <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-400 text-sm font-medium mb-2">Email Activities</p>
                                            <p className="text-2xl font-bold text-white">89</p>
                                        </div>
                                        <div className="p-3 bg-purple-500/20 rounded-xl">
                                            <Mail className="text-purple-400" size={24} />
                                        </div>
                                    </div>
                                </Card>
                                
                                <Card className="md:col-span-2 lg:col-span-3 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                                            <Mail className="text-blue-400" size={16} />
                                            <div className="flex-1">
                                                <p className="text-white text-sm">Email sent to Lisa Rodriguez</p>
                                                <p className="text-gray-400 text-xs">E-commerce Plus • 2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                                            <Eye className="text-green-400" size={16} />
                                            <div className="flex-1">
                                                <p className="text-white text-sm">Email opened by Michael Chen</p>
                                                <p className="text-gray-400 text-xs">TechStart • 4 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                                            <Phone className="text-orange-400" size={16} />
                                            <div className="flex-1">
                                                <p className="text-white text-sm">Call scheduled with Sarah Johnson</p>
                                                <p className="text-gray-400 text-xs">Digital Agency Pro • 6 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CRMDashboard;