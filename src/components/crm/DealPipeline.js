'Marketing Pro Annual Subscription',
                        deal_value: 15000,
                        probability: 75,
                        expected_close_date: '2024-06-30',
                        contact: { first_name: 'Mike', last_name: 'Chen', email: 'mike@marketingpro.com' },
                        company: { name: 'Marketing Agency Pro', domain: 'marketingpro.com' },
                        created_at: '2024-05-01T09:00:00Z',
                        original_keyword: 'attribution software'
                    }
                ]
            },
            {
                id: 'demo-stage-5',
                name: 'Closed Won',
                probability: 100,
                color: '#22c55e',
                stage_order: 5,
                deals: []
            }
        ]
    });

    // Calculate pipeline metrics
    const calculateMetrics = () => {
        const allDeals = pipelineData.stages.flatMap(stage => stage.deals || []);
        const openDeals = allDeals.filter(deal => deal.status !== 'won' && deal.status !== 'lost');
        
        return {
            totalDeals: allDeals.length,
            totalValue: allDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0),
            weightedValue: allDeals.reduce((sum, deal) => 
                sum + ((deal.deal_value || 0) * (deal.probability || 0) / 100), 0),
            avgDealSize: allDeals.length > 0 ? 
                allDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0) / allDeals.length : 0
        };
    };

    const metrics = calculateMetrics();

    // Handle drag and drop
    const handleDragStart = (e, deal) => {
        setDraggedDeal(deal);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetStageId) => {
        e.preventDefault();
        
        if (!draggedDeal) return;
        
        try {
            const response = await fetch(`/api/crm/deals/${draggedDeal.id}/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    stage_id: targetStageId,
                    notes: `Deal moved to new stage via pipeline drag & drop`
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                fetchPipelineData(); // Refresh pipeline
            } else {
                alert('Failed to move deal: ' + result.error);
            }
        } catch (error) {
            console.error('Error moving deal:', error);
            alert('Error moving deal');
        }
        
        setDraggedDeal(null);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Get days until close date
    const getDaysUntilClose = (closeDate) => {
        if (!closeDate) return null;
        const today = new Date();
        const close = new Date(closeDate);
        const diffTime = close - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get urgency styling
    const getUrgencyColor = (days) => {
        if (days < 0) return 'text-red-600 bg-red-50'; // Overdue
        if (days <= 7) return 'text-orange-600 bg-orange-50'; // This week
        if (days <= 30) return 'text-yellow-600 bg-yellow-50'; // This month
        return 'text-gray-600 bg-gray-50'; // Future
    };

    // Open deal details
    const openDealDetails = (deal) => {
        setSelectedDeal(deal);
        setDealForm({
            title: deal.title,
            deal_value: deal.deal_value || '',
            probability: deal.probability || 50,
            expected_close_date: deal.expected_close_date || '',
            contact_id: deal.contact_id || '',
            company_id: deal.company_id || '',
            description: deal.description || '',
            deal_source: deal.deal_source || ''
        });
        setShowDealModal(true);
    };

    // Save deal
    const handleSaveDeal = async () => {
        try {
            const url = selectedDeal ? 
                `/api/crm/deals/${selectedDeal.id}` : 
                '/api/crm/deals';
            
            const method = selectedDeal ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dealForm)
            });
            
            const result = await response.json();
            
            if (result.success) {
                setShowDealModal(false);
                setSelectedDeal(null);
                setDealForm({
                    title: '',
                    deal_value: '',
                    probability: 50,
                    expected_close_date: '',
                    contact_id: '',
                    company_id: '',
                    description: '',
                    deal_source: ''
                });
                fetchPipelineData(); // Refresh pipeline
            } else {
                alert('Failed to save deal: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving deal:', error);
            alert('Error saving deal');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            {/* Header */}
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
                    
                    <Button
                        onClick={() => {
                            setSelectedDeal(null);
                            setDealForm({
                                title: '',
                                deal_value: '',
                                probability: 50,
                                expected_close_date: '',
                                contact_id: '',
                                company_id: '',
                                description: '',
                                deal_source: ''
                            });
                            setShowDealModal(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Add Deal
                    </Button>
                </div>

                {/* Pipeline Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Total Pipeline</p>
                                <p className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.totalValue)}</p>
                            </div>
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Weighted Pipeline</p>
                                <p className="text-2xl font-bold text-green-900">{formatCurrency(metrics.weightedValue)}</p>
                            </div>
                            <TrendingUp className="text-green-600" size={24} />
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
                            <Star className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pipeline Stages */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading pipeline...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {pipelineData.stages.map((stage) => {
                        const stageValue = stage.deals?.reduce((sum, deal) => sum + (deal.deal_value || 0), 0) || 0;
                        const dealCount = stage.deals?.length || 0;
                        
                        return (
                            <div
                                key={stage.id}
                                className="bg-gray-50 rounded-xl p-4 min-h-96"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage.id)}
                            >
                                {/* Stage Header */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: stage.color }}
                                        ></div>
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Deals:</span>
                                            <span className="font-medium">{dealCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Value:</span>
                                            <span className="font-medium">{formatCurrency(stageValue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Probability:</span>
                                            <span className="font-medium">{stage.probability}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deals in Stage */}
                                <div className="space-y-3">
                                    {stage.deals?.map((deal) => {
                                        const daysUntilClose = getDaysUntilClose(deal.expected_close_date);
                                        const urgencyColor = daysUntilClose ? getUrgencyColor(daysUntilClose) : '';
                                        
                                        return (
                                            <div
                                                key={deal.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, deal)}
                                                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                                            >
                                                {/* Deal Title */}
                                                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                                    {deal.title}
                                                </h4>
                                                
                                                {/* Deal Value */}
                                                <div className="text-lg font-bold text-green-600 mb-2">
                                                    {formatCurrency(deal.deal_value)}
                                                </div>
                                                
                                                {/* Contact & Company */}
                                                {deal.contact && (
                                                    <div className="text-xs text-gray-600 mb-1">
                                                        <Users size={10} className="inline mr-1" />
                                                        {deal.contact.first_name} {deal.contact.last_name}
                                                    </div>
                                                )}
                                                
                                                {deal.company && (
                                                    <div className="text-xs text-gray-600 mb-2">
                                                        <building size={10} className="inline mr-1" />
                                                        {deal.company.name}
                                                    </div>
                                                )}
                                                
                                                {/* Attribution Keyword */}
                                                {deal.original_keyword && (
                                                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mb-2">
                                                        🎯 {deal.original_keyword}
                                                    </div>
                                                )}
                                                
                                                {/* Close Date */}
                                                {deal.expected_close_date && (
                                                    <div className={`text-xs px-2 py-1 rounded-full ${urgencyColor} mb-2`}>
                                                        <Calendar size={10} className="inline mr-1" />
                                                        {daysUntilClose < 0 ? 
                                                            `${Math.abs(daysUntilClose)} days overdue` :
                                                            daysUntilClose === 0 ? 'Due today' :
                                                            `${daysUntilClose} days to close`
                                                        }
                                                    </div>
                                                )}
                                                
                                                {/* Probability */}
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                    <span>Probability: {deal.probability}%</span>
                                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-blue-500 h-1.5 rounded-full"
                                                            style={{ width: `${deal.probability}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(deal.created_at).toLocaleDateString()}
                                                    </div>
                                                    
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDealDetails(deal);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                            title="View Details"
                                                        >
                                                            <Eye size={12} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDealDetails(deal);
                                                            }}
                                                            className="text-gray-600 hover:text-gray-800 p-1"
                                                            title="Edit Deal"
                                                        >
                                                            <Edit size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Empty state for stage */}
                                    {dealCount === 0 && (
                                        <div className="text-center py-8 text-gray-400">
                                            <Target size={24} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No deals in this stage</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Deal Modal */}
            {showDealModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedDeal ? 'Edit Deal' : 'Add New Deal'}
                            </h2>
                            <button
                                onClick={() => setShowDealModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deal Title *
                                </label>
                                <input
                                    type="text"
                                    value={dealForm.title}
                                    onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter deal title..."
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deal Value *
                                    </label>
                                    <input
                                        type="number"
                                        value={dealForm.deal_value}
                                        onChange={(e) => setDealForm({ ...dealForm, deal_value: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Probability (%)
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={dealForm.probability}
                                        onChange={(e) => setDealForm({ ...dealForm, probability: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-center text-sm text-gray-600 mt-1">
                                        {dealForm.probability}%
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expected Close Date
                                </label>
                                <input
                                    type="date"
                                    value={dealForm.expected_close_date}
                                    onChange={(e) => setDealForm({ ...dealForm, expected_close_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deal Source
                                </label>
                                <input
                                    type="text"
                                    value={dealForm.deal_source}
                                    onChange={(e) => setDealForm({ ...dealForm, deal_source: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Organic Search, LinkedIn, Referral"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={dealForm.description}
                                    onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Deal details, requirements, next steps..."
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                onClick={() => setShowDealModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveDeal}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {selectedDeal ? 'Update Deal' : 'Create Deal'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealPipeline;