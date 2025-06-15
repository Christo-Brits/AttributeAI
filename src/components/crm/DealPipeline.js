import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp, Users, Target, Plus, Edit, Eye, Building } from 'lucide-react';
import { Button, Card, Badge } from '../ui/DesignSystem';

const DealPipeline = () => {
    const [pipelineData, setPipelineData] = useState({ stages: [] });
    const [loading, setLoading] = useState(true);
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        fetchPipelineData();
    }, []);

    const fetchPipelineData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/crm/pipeline');
            const result = await response.json();
            
            if (result.success) {
                setPipelineData(result.data);
                setDemoMode(result.demo_mode);
            } else {
                setPipelineData(getDemoPipelineData());
                setDemoMode(true);
            }
        } catch (error) {
            setPipelineData(getDemoPipelineData());
            setDemoMode(true);
        } finally {
            setLoading(false);
        }
    };

    const getDemoPipelineData = () => ({
        stages: [
            {
                id: 'demo-stage-1',
                name: 'Lead',
                probability: 10,
                color: '#ef4444',
                stage_order: 1,
                deals: [
                    {
                        id: 'demo-deal-1',
                        title: 'E-commerce Plus Trial Conversion',
                        deal_value: 8000,
                        probability: 25,
                        expected_close_date: '2024-07-30',
                        contact: { first_name: 'Lisa', last_name: 'Rodriguez' },
                        company: { name: 'E-commerce Plus' },
                        created_at: '2024-06-01T10:00:00Z',
                        original_keyword: 'keyword research tool'
                    }
                ]
            }
        ]
    });

    const calculateMetrics = () => {
        const allDeals = pipelineData.stages.flatMap(stage => stage.deals || []);
        
        return {
            totalDeals: allDeals.length,
            totalValue: allDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0),
            avgDealSize: allDeals.length > 0 ? 
                allDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0) / allDeals.length : 0
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
                    
                    <Button variant="primary" className="flex items-center gap-2">
                        <Plus size={16} />
                        Add Deal
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                <p className="text-purple-400 text-sm font-medium mb-2">Total Deals</p>
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
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="loading-spinner h-8 w-8"></div>
                    <span className="ml-3 text-gray-400">Loading pipeline...</span>
                </div>
            ) : (
                <div className="text-center py-12">
                    <Card className="max-w-md mx-auto p-8">
                        <Target size={48} className="mx-auto text-blue-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Deal Pipeline</h3>
                        <p className="text-gray-400 mb-4">Visual deal pipeline coming soon</p>
                        <Button variant="primary">
                            Request Early Access
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default DealPipeline;