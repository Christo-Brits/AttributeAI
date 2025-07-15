import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp, Users, Target, Plus, Edit, Eye, Building, Search, Filter, MoreVertical, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Card, Badge } from '../ui/DesignSystem';

const DealPipeline = () => {
    const [pipelineData, setPipelineData] = useState({ stages: [] });
    const [loading, setLoading] = useState(true);
    const [demoMode, setDemoMode] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [showAddDeal, setShowAddDeal] = useState(false);
    const [draggedDeal, setDraggedDeal] = useState(null);

    useEffect(() => {
        // Simulate loading then show demo data
        setTimeout(() => {
            setPipelineData(getDemoPipelineData());
            setLoading(false);
        }, 1000);
    }, []);

    const getDemoPipelineData = () => ({
        stages: [
            {
                id: 'lead',
                name: 'Lead',
                probability: 10,
                color: '#ef4444',
                stage_order: 1,
                deals: [
                    {
                        id: 'deal-1',
                        title: 'E-commerce Plus Attribution Setup',
                        deal_value: 8000,
                        probability: 25,
                        expected_close_date: '2024-07-30',
                        contact: { first_name: 'Lisa', last_name: 'Rodriguez', email: 'lisa@ecommerceplus.com' },
                        company: { name: 'E-commerce Plus', domain: 'ecommerceplus.com' },
                        created_at: '2024-06-01T10:00:00Z',
                        attribution_source: 'Keyword: "attribution software"',
                        status: 'active'
                    },
                    {
                        id: 'deal-2',
                        title: 'TechStart Attribution Platform',
                        deal_value: 15000,
                        probability: 15,
                        expected_close_date: '2024-08-15',
                        contact: { first_name: 'Michael', last_name: 'Chen', email: 'michael@techstart.io' },
                        company: { name: 'TechStart', domain: 'techstart.io' },
                        created_at: '2024-06-10T14:30:00Z',
                        attribution_source: 'Content: "Multi-touch Attribution Guide"',
                        status: 'active'
                    }
                ]
            },
            {
                id: 'qualified',
                name: 'Qualified',
                probability: 25,
                color: '#f59e0b',
                stage_order: 2,
                deals: [
                    {
                        id: 'deal-3',
                        title: 'Digital Agency Pro Package',
                        deal_value: 12000,
                        probability: 35,
                        expected_close_date: '2024-07-20',
                        contact: { first_name: 'Sarah', last_name: 'Johnson', email: 'sarah@digitalagency.com' },
                        company: { name: 'Digital Agency Pro', domain: 'digitalagency.com' },
                        created_at: '2024-05-15T09:00:00Z',
                        attribution_source: 'Demo Request: Website Form',
                        status: 'active'
                    }
                ]
            },
            {
                id: 'proposal',
                name: 'Proposal',
                probability: 50,
                color: '#3b82f6',
                stage_order: 3,
                deals: [
                    {
                        id: 'deal-4',
                        title: 'MarketingCorp Enterprise',
                        deal_value: 25000,
                        probability: 65,
                        expected_close_date: '2024-07-10',
                        contact: { first_name: 'David', last_name: 'Wilson', email: 'david@marketingcorp.com' },
                        company: { name: 'MarketingCorp', domain: 'marketingcorp.com' },
                        created_at: '2024-05-01T11:00:00Z',
                        attribution_source: 'LinkedIn: Sponsored Content',
                        status: 'active'
                    }
                ]
            },
            {
                id: 'negotiation',
                name: 'Negotiation',
                probability: 75,
                color: '#8b5cf6',
                stage_order: 4,
                deals: [
                    {
                        id: 'deal-5',
                        title: 'ScaleUp Attribution Suite',
                        deal_value: 18000,
                        probability: 80,
                        expected_close_date: '2024-06-25',
                        contact: { first_name: 'Emma', last_name: 'Davis', email: 'emma@scaleup.com' },
                        company: { name: 'ScaleUp Solutions', domain: 'scaleup.com' },
                        created_at: '2024-04-20T16:00:00Z',
                        attribution_source: 'Referral: Existing Customer',
                        status: 'active'
                    }
                ]
            },
            {
                id: 'closed-won',
                name: 'Closed Won',
                probability: 100,
                color: '#10b981',
                stage_order: 5,
                deals: [
                    {
                        id: 'deal-6',
                        title: 'GrowthTech Attribution Implementation',
                        deal_value: 22000,
                        probability: 100,
                        expected_close_date: '2024-06-01',
                        contact: { first_name: 'Alex', last_name: 'Thompson', email: 'alex@growthtech.com' },
                        company: { name: 'GrowthTech', domain: 'growthtech.com' },
                        created_at: '2024-03-15T10:00:00Z',
                        attribution_source: 'Google Ads: "attribution platform"',
                        status: 'won'
                    }
                ]
            }
        ]
    });

    const calculateMetrics = () => {
        const allDeals = pipelineData.stages.flatMap(stage => stage.deals || []);
        const activeDeals = allDeals.filter(deal => deal.status === 'active');
        
        return {
            totalDeals: activeDeals.length,
            totalValue: activeDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0),
            avgDealSize: activeDeals.length > 0 ? 
                activeDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0) / activeDeals.length : 0,
            wonDeals: allDeals.filter(deal => deal.status === 'won').length,
            wonValue: allDeals.filter(deal => deal.status === 'won').reduce((sum, deal) => sum + (deal.deal_value || 0), 0)
        };
    };

    const metrics = calculateMetrics();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getDealCardStyle = (deal) => {
        const baseClasses = "bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-lg";
        if (draggedDeal?.id === deal.id) {
            return baseClasses + " opacity-50 transform rotate-2";
        }
        return baseClasses;
    };

    const handleDragStart = (e, deal) => {
        setDraggedDeal(deal);
        e.dataTransfer.setData('text/plain', deal.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetStage) => {
        e.preventDefault();
        if (draggedDeal) {
            // Move deal to new stage
            const newPipelineData = { ...pipelineData };
            
            // Remove from current stage
            newPipelineData.stages.forEach(stage => {
                stage.deals = (stage.deals || []).filter(deal => deal.id !== draggedDeal.id);
            });
            
            // Add to target stage
            const targetStageData = newPipelineData.stages.find(stage => stage.id === targetStage.id);
            if (targetStageData) {
                if (!targetStageData.deals) targetStageData.deals = [];
                targetStageData.deals.push({
                    ...draggedDeal,
                    probability: targetStage.probability
                });
            }
            
            setPipelineData(newPipelineData);
            setDraggedDeal(null);
        }
    };

    const DealCard = ({ deal }) => (
        <div
            className={getDealCardStyle(deal)}
            draggable
            onDragStart={(e) => handleDragStart(e, deal)}
            onClick={() => setSelectedDeal(deal)}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white text-sm">{deal.title}</h4>
                <Button variant="ghost" size="sm" className="p-1">
                    <MoreVertical size={14} className="text-gray-400" />
                </Button>
            </div>
            
            <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                    <span>{deal.company.name}</span>
                    <span className="font-medium text-green-400">{formatCurrency(deal.deal_value)}</span>
                </div>
                <div className="flex justify-between">
                    <span>{deal.contact.first_name} {deal.contact.last_name}</span>
                    <span>{formatDate(deal.expected_close_date)}</span>
                </div>
                <div className="text-blue-400 text-xs mt-2">
                    {deal.attribution_source}
                </div>
            </div>
        </div>
    );

    const DealModal = ({ deal, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">{deal.title}</h2>
                        <Badge variant="success">{formatCurrency(deal.deal_value)}</Badge>
                    </div>
                    <Button variant="ghost" onClick={onClose}>×</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-white mb-3">Deal Information</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-400">Expected Close:</span>
                                <span className="text-white ml-2">{formatDate(deal.expected_close_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Probability:</span>
                                <span className="text-white ml-2">{deal.probability}%</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Created:</span>
                                <span className="text-white ml-2">{formatDate(deal.created_at)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-white mb-3">Contact & Company</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-400">Contact:</span>
                                <span className="text-white ml-2">{deal.contact.first_name} {deal.contact.last_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Email:</span>
                                <span className="text-blue-400 ml-2">{deal.contact.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Company:</span>
                                <span className="text-white ml-2">{deal.company.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6">
                    <h3 className="font-semibold text-white mb-3">Attribution Intelligence</h3>
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <Target className="text-blue-400 mr-2" size={16} />
                            <span className="text-blue-400 font-medium">Original Source</span>
                        </div>
                        <p className="text-white">{deal.attribution_source}</p>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button variant="primary">
                        <Edit size={16} className="mr-2" />
                        Edit Deal
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Sales Pipeline</h1>
                        <p className="text-gray-400">
                            Visual deal management with attribution intelligence
                            {demoMode && (
                                <Badge variant="warning" className="ml-2">
                                    Demo Mode
                                </Badge>
                            )}
                        </p>
                    </div>
                    
                    <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddDeal(true)}>
                        <Plus size={16} />
                        Add Deal
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30 hover-glow-blue">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-400 text-sm font-medium mb-2">Total Pipeline</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(metrics.totalValue)}</p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <DollarSign className="text-blue-400" size={24} />
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30 hover-glow-purple">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-400 text-sm font-medium mb-2">Active Deals</p>
                                <p className="text-2xl font-bold text-white">{metrics.totalDeals}</p>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Target className="text-purple-400" size={24} />
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-br from-yellow-900/40 to-orange-800/40 border-yellow-500/30 hover-glow-pink">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-400 text-sm font-medium mb-2">Avg Deal Size</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(metrics.avgDealSize)}</p>
                            </div>
                            <div className="p-3 bg-yellow-500/20 rounded-xl">
                                <TrendingUp className="text-yellow-400" size={24} />
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30 hover-glow-green">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-400 text-sm font-medium mb-2">Won This Month</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(metrics.wonValue)}</p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <CheckCircle className="text-green-400" size={24} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="loading-spinner h-8 w-8"></div>
                    <span className="ml-3 text-gray-400">Loading pipeline...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {pipelineData.stages.map((stage) => (
                            <div
                                key={stage.id}
                                className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div 
                                            className="w-3 h-3 rounded-full mr-2" 
                                            style={{ backgroundColor: stage.color }}
                                        ></div>
                                        <h3 className="font-semibold text-white">{stage.name}</h3>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {(stage.deals || []).length}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-3">
                                    {(stage.deals || []).map((deal) => (
                                        <DealCard key={deal.id} deal={deal} />
                                    ))}
                                </div>
                                
                                {(!stage.deals || stage.deals.length === 0) && (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        No deals in this stage
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {selectedDeal && (
                <DealModal 
                    deal={selectedDeal} 
                    onClose={() => setSelectedDeal(null)} 
                />
            )}
        </div>
    );
};

export default DealPipeline;