import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, Eye, Search } from 'lucide-react';
import { Button, Card, Badge } from '../ui/DesignSystem';

const RevenueAttribution = () => {
    const [attributionData, setAttributionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [selectedModel, setSelectedModel] = useState('linear');
    const [demoMode, setDemoMode] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState(null);

    useEffect(() => {
        fetchAttributionData();
    }, [selectedTimeframe, selectedModel]);

    const fetchAttributionData = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setAttributionData(getDemoAttributionData());
            setLoading(false);
        }, 1000);
    };

    const getDemoAttributionData = () => ({
        totalRevenue: 147000,
        attributedRevenue: 132300,
        attributionRate: 90,
        topChannels: [
            {
                id: 'organic-search',
                name: 'Organic Search',
                revenue: 45600,
                percentage: 34.5,
                deals: 8,
                avgDealSize: 5700,
                trend: 'up',
                trendValue: 12.5,
                topKeywords: ['attribution software', 'marketing analytics', 'multi-touch attribution']
            },
            {
                id: 'paid-search',
                name: 'Paid Search',
                revenue: 38200,
                percentage: 28.9,
                deals: 6,
                avgDealSize: 6367,
                trend: 'up',
                trendValue: 8.3,
                topKeywords: ['attribution platform', 'marketing attribution', 'revenue tracking']
            },
            {
                id: 'linkedin',
                name: 'LinkedIn',
                revenue: 28500,
                percentage: 21.5,
                deals: 4,
                avgDealSize: 7125,
                trend: 'down',
                trendValue: -3.2,
                topKeywords: ['B2B attribution', 'enterprise analytics', 'marketing ROI']
            },
            {
                id: 'content-marketing',
                name: 'Content Marketing',
                revenue: 20000,
                percentage: 15.1,
                deals: 5,
                avgDealSize: 4000,
                trend: 'up',
                trendValue: 22.1,
                topKeywords: ['attribution guide', 'marketing insights', 'analytics blog']
            }
        ],
        touchpointAnalysis: [
            {
                touchpoint: 'First Touch',
                revenue: 52800,
                percentage: 39.9,
                deals: 12,
                channels: ['Organic Search', 'Paid Search', 'LinkedIn']
            },
            {
                touchpoint: 'Middle Touch',
                revenue: 42300,
                percentage: 32.0,
                deals: 18,
                channels: ['Content Marketing', 'Email', 'Social Media']
            },
            {
                touchpoint: 'Last Touch',
                revenue: 37200,
                percentage: 28.1,
                deals: 9,
                channels: ['Direct', 'Referral', 'Demo Request']
            }
        ],
        recentDeals: [
            {
                id: 'deal-1',
                company: 'GrowthTech',
                value: 22000,
                closedDate: '2024-06-01',
                attributionPath: [
                    { channel: 'Organic Search', keyword: 'attribution platform', touchpoint: 'First' },
                    { channel: 'Content Marketing', content: 'Attribution Guide', touchpoint: 'Middle' },
                    { channel: 'Demo Request', source: 'Website', touchpoint: 'Last' }
                ]
            },
            {
                id: 'deal-2',
                company: 'MarketingCorp',
                value: 25000,
                closedDate: '2024-05-28',
                attributionPath: [
                    { channel: 'LinkedIn', campaign: 'Sponsored Content', touchpoint: 'First' },
                    { channel: 'Email Marketing', campaign: 'Nurture Sequence', touchpoint: 'Middle' },
                    { channel: 'Sales Call', source: 'Direct', touchpoint: 'Last' }
                ]
            },
            {
                id: 'deal-3',
                company: 'ScaleUp Solutions',
                value: 18000,
                closedDate: '2024-05-20',
                attributionPath: [
                    { channel: 'Paid Search', keyword: 'marketing attribution', touchpoint: 'First' },
                    { channel: 'Content Marketing', content: 'ROI Calculator', touchpoint: 'Middle' },
                    { channel: 'Referral', source: 'Partner', touchpoint: 'Last' }
                ]
            }
        ],
        keywordROI: [
            { keyword: 'attribution software', revenue: 28500, cost: 3200, roi: 791 },
            { keyword: 'marketing analytics', revenue: 22000, cost: 2800, roi: 686 },
            { keyword: 'multi-touch attribution', revenue: 18500, cost: 2400, roi: 671 },
            { keyword: 'revenue tracking', revenue: 15200, cost: 2100, roi: 624 },
            { keyword: 'marketing ROI', revenue: 12800, cost: 1900, roi: 574 }
        ]
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatPercentage = (value) => {
        return `${value.toFixed(1)}%`;
    };

    const getChannelIcon = (channelName) => {
        const icons = {
            'Organic Search': Search,
            'Paid Search': Target,
            'LinkedIn': TrendingUp,
            'Content Marketing': BarChart3,
            'Email Marketing': Calendar,
            'Direct': ArrowUpRight
        };
        return icons[channelName] || Target;
    };

    const AttributionModelSelector = () => (
        <div className="flex space-x-2">
            {['linear', 'first-touch', 'last-touch', 'time-decay'].map((model) => (
                <Button
                    key={model}
                    variant={selectedModel === model ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedModel(model)}
                    className="text-xs"
                >
                    {model.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
            ))}
        </div>
    );

    const DealAttributionModal = ({ deal, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Attribution Journey: {deal.company}</h2>
                        <Badge variant="success">{formatCurrency(deal.value)}</Badge>
                    </div>
                    <Button variant="ghost" onClick={onClose}>×</Button>
                </div>
                
                <div className="space-y-6">
                    <h3 className="font-semibold text-white">Customer Journey Touchpoints</h3>
                    <div className="space-y-4">
                        {deal.attributionPath.map((touchpoint, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-white">{touchpoint.channel}</div>
                                    <div className="text-sm text-gray-400">
                                        {touchpoint.keyword && `Keyword: ${touchpoint.keyword}`}
                                        {touchpoint.content && `Content: ${touchpoint.content}`}
                                        {touchpoint.campaign && `Campaign: ${touchpoint.campaign}`}
                                        {touchpoint.source && `Source: ${touchpoint.source}`}
                                    </div>
                                </div>
                                <Badge variant="outline">{touchpoint.touchpoint} Touch</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="loading-spinner h-8 w-8"></div>
                <span className="ml-3 text-gray-400">Loading attribution data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Revenue Attribution</h1>
                        <p className="text-gray-400">
                            Marketing ROI analysis with multi-touch attribution
                            {demoMode && (
                                <Badge variant="warning" className="ml-2">
                                    Demo Mode
                                </Badge>
                            )}
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
                            <option value="1y">Last year</option>
                        </select>
                        <Button variant="outline" size="sm">
                            <Download size={16} className="mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30 hover-glow-green">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-400 text-sm font-medium mb-2">Total Revenue</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(attributionData.totalRevenue)}</p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <DollarSign className="text-green-400" size={24} />
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30 hover-glow-blue">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-400 text-sm font-medium mb-2">Attributed Revenue</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(attributionData.attributedRevenue)}</p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Target className="text-blue-400" size={24} />
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30 hover-glow-purple">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-400 text-sm font-medium mb-2">Attribution Rate</p>
                                <p className="text-2xl font-bold text-white">{attributionData.attributionRate}%</p>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <BarChart3 className="text-purple-400" size={24} />
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-orange-500/30 hover-glow-orange">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-400 text-sm font-medium mb-2">Avg Customer Value</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(attributionData.attributedRevenue / 20)}</p>
                            </div>
                            <div className="p-3 bg-orange-500/20 rounded-xl">
                                <TrendingUp className="text-orange-400" size={24} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Attribution Model Selector */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Attribution Model</h3>
                    <AttributionModelSelector />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Channels */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <BarChart3 className="mr-2 text-blue-400" size={20} />
                        Top Revenue Channels
                    </h3>
                    <div className="space-y-4">
                        {attributionData.topChannels.map((channel) => {
                            const IconComponent = getChannelIcon(channel.name);
                            return (
                                <div key={channel.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <IconComponent className="text-blue-400" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{channel.name}</div>
                                            <div className="text-sm text-gray-400">
                                                {channel.deals} deals • Avg: {formatCurrency(channel.avgDealSize)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">{formatCurrency(channel.revenue)}</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-400 mr-2">{formatPercentage(channel.percentage)}</span>
                                            {channel.trend === 'up' ? (
                                                <span className="text-green-400 flex items-center">
                                                    <ArrowUpRight size={14} />
                                                    {formatPercentage(channel.trendValue)}
                                                </span>
                                            ) : (
                                                <span className="text-red-400 flex items-center">
                                                    <ArrowDownRight size={14} />
                                                    {formatPercentage(Math.abs(channel.trendValue))}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Touchpoint Analysis */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Target className="mr-2 text-purple-400" size={20} />
                        Touchpoint Analysis
                    </h3>
                    <div className="space-y-4">
                        {attributionData.touchpointAnalysis.map((touchpoint, index) => (
                            <div key={index} className="p-4 bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-white">{touchpoint.touchpoint}</span>
                                    <span className="font-bold text-white">{formatCurrency(touchpoint.revenue)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                                    <span>{touchpoint.deals} deals</span>
                                    <span>{formatPercentage(touchpoint.percentage)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                                        style={{ width: `${touchpoint.percentage}%` }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    Top channels: {touchpoint.channels.join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Deals with Attribution */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Eye className="mr-2 text-green-400" size={20} />
                    Recent Deals with Attribution Paths
                </h3>
                <div className="space-y-4">
                    {attributionData.recentDeals.map((deal) => (
                        <div key={deal.id} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="font-medium text-white">{deal.company}</div>
                                    <div className="text-sm text-gray-400">Closed: {new Date(deal.closedDate).toLocaleDateString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-green-400">{formatCurrency(deal.value)}</div>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setSelectedDeal(deal)}
                                        className="mt-1"
                                    >
                                        View Journey
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                                {deal.attributionPath.map((step, index) => (
                                    <React.Fragment key={index}>
                                        <Badge variant="outline" className="text-xs">
                                            {step.channel}
                                        </Badge>
                                        {index < deal.attributionPath.length - 1 && (
                                            <ArrowUpRight size={12} className="text-gray-500" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Keyword ROI Table */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Search className="mr-2 text-yellow-400" size={20} />
                    Top Keyword ROI
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 text-gray-400 font-medium">Keyword</th>
                                <th className="text-right py-3 text-gray-400 font-medium">Revenue</th>
                                <th className="text-right py-3 text-gray-400 font-medium">Cost</th>
                                <th className="text-right py-3 text-gray-400 font-medium">ROI%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attributionData.keywordROI.map((keyword, index) => (
                                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="py-3 text-white">{keyword.keyword}</td>
                                    <td className="py-3 text-right text-green-400 font-medium">{formatCurrency(keyword.revenue)}</td>
                                    <td className="py-3 text-right text-gray-400">{formatCurrency(keyword.cost)}</td>
                                    <td className="py-3 text-right text-blue-400 font-bold">{keyword.roi}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {selectedDeal && (
                <DealAttributionModal 
                    deal={selectedDeal} 
                    onClose={() => setSelectedDeal(null)} 
                />
            )}
        </div>
    );
};

export default RevenueAttribution;