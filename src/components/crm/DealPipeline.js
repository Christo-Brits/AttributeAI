import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp, Users, Target, Plus, Edit, Eye, Building } from 'lucide-react';
import { Button } from '../ui/DesignSystem';

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
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Pipeline</h1>
                        <p className="text-gray-600">
                            Visual deal management with attribution intelligence
                            {demoMode && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                    Demo Mode
                                </span>
                            )}
                        </p>
                    </div>
                    
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <Plus size={16} />
                        Add Deal
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Total Pipeline</p>
                                <p className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.totalValue)}</p>
                            </div>
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Total Deals</p>
                                <p className="text-2xl font-bold text-purple-900">{metrics.totalDeals}</p>
                            </div>
                            <Target className="text-purple-600" size={24} />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Avg Deal Size</p>
                                <p className="text-2xl font-bold text-yellow-900">{formatCurrency(metrics.avgDealSize)}</p>
                            </div>
                            <TrendingUp className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading pipeline...</span>
                </div>
            ) : (
                <div className="text-center py-12">
                    <Target size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Deal Pipeline</h3>
                    <p className="text-gray-600">Visual deal pipeline coming soon</p>
                </div>
            )}
        </div>
    );
};

export default DealPipeline;