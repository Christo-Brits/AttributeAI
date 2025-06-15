import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, Mail, Users, Target, Calendar, Filter, Download, Search, ArrowUpRight, ArrowDownRight, DollarSign, MousePointer } from 'lucide-react';
import { Button, Card, Badge } from '../ui/DesignSystem';

const EmailAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [selectedCampaign, setSelectedCampaign] = useState('all');

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedTimeframe, selectedCampaign]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setAnalyticsData(getDemoAnalyticsData());
            setLoading(false);
        }, 1000);
    };

    const getDemoAnalyticsData = () => ({
        overview: {
            totalSent: 1247,
            totalDelivered: 1186,
            totalOpens: 412,
            totalClicks: 89,
            totalReplies: 23,
            totalUnsubscribes: 8,
            deliveryRate: 95.1,
            openRate: 34.7,
            clickRate: 7.5,
            replyRate: 1.9,
            unsubscribeRate: 0.6
        },
        campaigns: [
            {
                id: 'attribution-demo',
                name: 'Attribution Platform Demo Sequence',
                type: 'sequence',
                status: 'active',
                sent: 435,
                delivered: 413,
                opens: 178,
                clicks: 42,
                replies: 12,
                conversions: 8,
                openRate: 43.1,
                clickRate: 10.2,
                replyRate: 2.9,
                conversionRate: 1.9,
                revenue: 64000,
                lastSent: '2024-06-15T09:00:00Z'
            },
            {
                id: 'content-upsell',
                name: 'Content Marketing Upsell',
                type: 'sequence',
                status: 'active',
                sent: 187,
                delivered: 182,
                opens: 94,
                clicks: 23,
                replies: 7,
                conversions: 5,
                openRate: 51.6,
                clickRate: 12.6,
                replyRate: 3.8,
                conversionRate: 2.7,
                revenue: 35000,
                lastSent: '2024-06-14T14:30:00Z'
            },
            {
                id: 'one-to-one',
                name: 'One-to-One Outreach',
                type: 'individual',
                status: 'ongoing',
                sent: 625,
                delivered: 591,
                opens: 140,
                clicks: 24,
                replies: 4,
                conversions: 2,
                openRate: 23.7,
                clickRate: 4.1,
                replyRate: 0.7,
                conversionRate: 0.3,
                revenue: 18000,
                lastSent: '2024-06-16T11:15:00Z'
            }
        ],
        topPerformingEmails: [
            {
                id: 'email-1',
                subject: 'Case Study: How TechCorp increased ROI by 340%',
                campaign: 'Attribution Platform Demo Sequence',
                sent: 87,
                opens: 52,
                clicks: 18,
                replies: 5,
                openRate: 59.8,
                clickRate: 20.7,
                replyRate: 5.7
            },
            {
                id: 'email-2',
                subject: 'Your custom attribution analysis is ready',
                campaign: 'Attribution Platform Demo Sequence',
                sent: 87,
                opens: 43,
                clicks: 15,
                replies: 4,
                openRate: 49.4,
                clickRate: 17.2,
                replyRate: 4.6
            },
            {
                id: 'email-3',
                subject: 'New: AI content generation inside AttributeAI',
                campaign: 'Content Marketing Upsell',
                sent: 34,
                opens: 21,
                clicks: 8,
                replies: 3,
                openRate: 61.8,
                clickRate: 23.5,
                replyRate: 8.8
            }
        ],
        attributionData: [
            {
                campaign: 'Attribution Platform Demo Sequence',
                revenue: 64000,
                deals: 8,
                avgDealSize: 8000,
                costPerLead: 45,
                roi: 342
            },
            {
                campaign: 'Content Marketing Upsell',
                revenue: 35000,
                deals: 5,
                avgDealSize: 7000,
                costPerLead: 38,
                roi: 287
            },
            {
                campaign: 'One-to-One Outreach',
                revenue: 18000,
                deals: 2,
                avgDealSize: 9000,
                costPerLead: 125,
                roi: 145
            }
        ]
    });

    const formatPercentage = (value) => `${value.toFixed(1)}%`;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getTrendIcon = (value) => {
        return value > 0 ? ArrowUpRight : ArrowDownRight;
    };

    const getTrendColor = (value) => {
        return value > 0 ? 'text-green-400' : 'text-red-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="loading-spinner h-8 w-8"></div>
                <span className="ml-3 text-gray-400">Loading email analytics...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Email Analytics
                    </h1>
                    <p className="text-gray-400">
                        Track email performance and revenue attribution
                        <Badge variant="warning" className="ml-2">Demo Mode</Badge>
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <select 
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-1 text-sm"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <Button variant="outline" size="sm">
                        <Download size={16} className="mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <Card className="p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
                    <div className="text-center">
                        <Mail className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{analyticsData.overview.totalSent}</div>
                        <div className="text-xs text-blue-400">Emails Sent</div>
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30">
                    <div className="text-center">
                        <Target className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{formatPercentage(analyticsData.overview.deliveryRate)}</div>
                        <div className="text-xs text-green-400">Delivery Rate</div>
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30">
                    <div className="text-center">
                        <Eye className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{formatPercentage(analyticsData.overview.openRate)}</div>
                        <div className="text-xs text-purple-400">Open Rate</div>
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-orange-500/30">
                    <div className="text-center">
                        <MousePointer className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{formatPercentage(analyticsData.overview.clickRate)}</div>
                        <div className="text-xs text-orange-400">Click Rate</div>
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-pink-900/40 to-pink-800/40 border-pink-500/30">
                    <div className="text-center">
                        <Users className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{formatPercentage(analyticsData.overview.replyRate)}</div>
                        <div className="text-xs text-pink-400">Reply Rate</div>
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border-yellow-500/30">
                    <div className="text-center">
                        <DollarSign className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{formatCurrency(117000)}</div>
                        <div className="text-xs text-yellow-400">Total Revenue</div>
                    </div>
                </Card>
            </div>

            {/* Campaign Performance */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="mr-2 text-blue-400" size={20} />
                    Campaign Performance
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 text-gray-400 font-medium">Campaign</th>
                                <th className="text-right py-3 text-gray-400 font-medium">Sent</th>
                                <th className="text-right py-3 text-gray-400 font-medium">Open Rate</th>
                                <th className="text-right py-3 text-gray-400 font-medium">Click Rate</th>
                                <th className="text-right py-3 text-gray-400 font-medium">Reply Rate</th>
                                <th className="text-right py-3 text-gray-400 font-medium">Revenue</th>
                                <th className="text-right py-3 text-gray-400 font-medium">ROI</th>
                                <th className="text-center py-3 text-gray-400 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData.campaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="py-3">
                                        <div>
                                            <div className="font-medium text-white">{campaign.name}</div>
                                            <div className="text-sm text-gray-400">{campaign.type}</div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-right text-white">{campaign.sent}</td>
                                    <td className="py-3 text-right text-purple-400 font-medium">{formatPercentage(campaign.openRate)}</td>
                                    <td className="py-3 text-right text-orange-400 font-medium">{formatPercentage(campaign.clickRate)}</td>
                                    <td className="py-3 text-right text-pink-400 font-medium">{formatPercentage(campaign.replyRate)}</td>
                                    <td className="py-3 text-right text-green-400 font-bold">{formatCurrency(campaign.revenue)}</td>
                                    <td className="py-3 text-right text-yellow-400 font-bold">
                                        {analyticsData.attributionData.find(a => a.campaign === campaign.name)?.roi || 0}%
                                    </td>
                                    <td className="py-3 text-center">
                                        <Badge variant={campaign.status === 'active' ? 'success' : 'outline'}>
                                            {campaign.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performing Emails */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <TrendingUp className="mr-2 text-green-400" size={20} />
                        Top Performing Emails
                    </h3>
                    <div className="space-y-4">
                        {analyticsData.topPerformingEmails.map((email, index) => (
                            <div key={email.id} className="p-4 bg-gray-800 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="font-medium text-white text-sm">{email.subject}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 mb-3">{email.campaign}</div>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div>
                                        <div className="text-sm font-bold text-white">{email.sent}</div>
                                        <div className="text-xs text-gray-400">Sent</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-purple-400">{formatPercentage(email.openRate)}</div>
                                        <div className="text-xs text-gray-400">Opens</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-orange-400">{formatPercentage(email.clickRate)}</div>
                                        <div className="text-xs text-gray-400">Clicks</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-pink-400">{formatPercentage(email.replyRate)}</div>
                                        <div className="text-xs text-gray-400">Replies</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Revenue Attribution */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <DollarSign className="mr-2 text-yellow-400" size={20} />
                        Revenue Attribution
                    </h3>
                    <div className="space-y-4">
                        {analyticsData.attributionData.map((item, index) => (
                            <div key={index} className="p-4 bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-medium text-white text-sm">{item.campaign}</div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-400">{formatCurrency(item.revenue)}</div>
                                        <div className="text-xs text-gray-400">{item.deals} deals</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <div className="text-sm font-bold text-blue-400">{formatCurrency(item.avgDealSize)}</div>
                                        <div className="text-xs text-gray-400">Avg Deal</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-purple-400">{formatCurrency(item.costPerLead)}</div>
                                        <div className="text-xs text-gray-400">Cost/Lead</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-orange-400">{item.roi}%</div>
                                        <div className="text-xs text-gray-400">ROI</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Email Tracking Integration Notice */}
            <Card className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Browser Extension Email Tracking</h3>
                        <p className="text-gray-400">
                            Install the AttributeAI browser extension to automatically track opens and clicks 
                            from your Gmail and Outlook emails directly to contact timelines.
                        </p>
                    </div>
                    <Button variant="primary">
                        Install Extension
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default EmailAnalytics;