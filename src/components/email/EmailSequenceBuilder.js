import React, { useState, useEffect } from 'react';
import { Mail, Plus, Edit, Trash2, Send, Calendar, Users, BarChart3, Eye, Clock, ArrowRight, Zap, Target, Copy, Settings, Save } from 'lucide-react';
import { Button, Card, Badge } from '../ui/DesignSystem';

const EmailSequenceBuilder = () => {
    const [sequences, setSequences] = useState([]);
    const [selectedSequence, setSelectedSequence] = useState(null);
    const [showCreateSequence, setShowCreateSequence] = useState(false);
    const [showEmailEditor, setShowEmailEditor] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSequences();
    }, []);

    const fetchSequences = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSequences(getDemoSequences());
            setLoading(false);
        }, 1000);
    };

    const getDemoSequences = () => [
        {
            id: 'seq-1',
            name: 'Attribution Platform Demo Sequence',
            description: 'Nurture leads interested in attribution analytics',
            status: 'active',
            totalEmails: 5,
            subscribers: 87,
            openRate: 34.5,
            clickRate: 8.2,
            conversionRate: 12.1,
            createdAt: '2024-06-01',
            emails: [
                {
                    id: 'email-1',
                    subject: 'See exactly which marketing drives revenue',
                    delay: 0,
                    status: 'active',
                    openRate: 42.3,
                    clickRate: 12.1,
                    content: 'Welcome to attribution intelligence...'
                },
                {
                    id: 'email-2', 
                    subject: 'Case Study: How TechCorp increased ROI by 340%',
                    delay: 2,
                    status: 'active',
                    openRate: 38.7,
                    clickRate: 9.4,
                    content: 'See real results from companies like yours...'
                },
                {
                    id: 'email-3',
                    subject: 'Your custom attribution analysis is ready',
                    delay: 5,
                    status: 'active', 
                    openRate: 28.9,
                    clickRate: 15.3,
                    content: 'Based on your industry and size...'
                },
                {
                    id: 'email-4',
                    subject: 'Demo: See your marketing ROI in real-time',
                    delay: 8,
                    status: 'active',
                    openRate: 31.2,
                    clickRate: 18.7,
                    content: 'Book a personalized demo to see...'
                },
                {
                    id: 'email-5',
                    subject: 'Last chance: Attribution insights for your business',
                    delay: 12,
                    status: 'active',
                    openRate: 25.1,
                    clickRate: 22.4,
                    content: 'This is your final opportunity...'
                }
            ]
        },
        {
            id: 'seq-2',
            name: 'Content Marketing Upsell',
            description: 'Existing customers - content generation features',
            status: 'active',
            totalEmails: 3,
            subscribers: 34,
            openRate: 48.2,
            clickRate: 15.6,
            conversionRate: 23.5,
            createdAt: '2024-05-15',
            emails: [
                {
                    id: 'email-6',
                    subject: 'New: AI content generation inside AttributeAI',
                    delay: 0,
                    status: 'active',
                    openRate: 52.1,
                    clickRate: 18.2,
                    content: 'Generate unlimited content with attribution data...'
                },
                {
                    id: 'email-7',
                    subject: 'Case study: 10x faster content with AI',
                    delay: 3,
                    status: 'active',
                    openRate: 46.8,
                    clickRate: 14.3,
                    content: 'See how existing customers are using...'
                },
                {
                    id: 'email-8',
                    subject: 'Ready to upgrade? Special pricing inside',
                    delay: 7,
                    status: 'active',
                    openRate: 45.7,
                    clickRate: 24.1,
                    content: 'Exclusive offer for existing customers...'
                }
            ]
        },
        {
            id: 'seq-3',
            name: 'CRM Features Announcement',
            description: 'Announce new CRM capabilities to user base',
            status: 'draft',
            totalEmails: 4,
            subscribers: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
            createdAt: '2024-06-15',
            emails: [
                {
                    id: 'email-9',
                    subject: 'AttributeAI just became your complete revenue platform',
                    delay: 0,
                    status: 'draft',
                    openRate: 0,
                    clickRate: 0,
                    content: 'Introducing CRM with attribution intelligence...'
                }
            ]
        }
    ];

    const formatPercentage = (value) => `${value.toFixed(1)}%`;

    const getStatusColor = (status) => {
        const colors = {
            'active': 'bg-green-500',
            'draft': 'bg-yellow-500', 
            'paused': 'bg-red-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const SequenceCard = ({ sequence }) => (
        <Card className="p-6 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => setSelectedSequence(sequence)}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-white mb-1">{sequence.name}</h3>
                    <p className="text-gray-400 text-sm">{sequence.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(sequence.status)}`}></div>
                    <Badge variant={sequence.status === 'active' ? 'success' : sequence.status === 'draft' ? 'warning' : 'outline'}>
                        {sequence.status}
                    </Badge>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <div className="text-xl font-bold text-white">{sequence.totalEmails}</div>
                    <div className="text-xs text-gray-400">Emails</div>
                </div>
                <div>
                    <div className="text-xl font-bold text-blue-400">{sequence.subscribers}</div>
                    <div className="text-xs text-gray-400">Subscribers</div>
                </div>
                <div>
                    <div className="text-xl font-bold text-green-400">{formatPercentage(sequence.openRate)}</div>
                    <div className="text-xs text-gray-400">Open Rate</div>
                </div>
                <div>
                    <div className="text-xl font-bold text-purple-400">{formatPercentage(sequence.conversionRate)}</div>
                    <div className="text-xs text-gray-400">Conversion</div>
                </div>
            </div>
        </Card>
    );

    const EmailEditor = ({ email, onSave, onClose }) => {
        const [emailData, setEmailData] = useState(email || {
            subject: '',
            content: '',
            delay: 0,
            status: 'draft'
        });
        const [generating, setGenerating] = useState(false);

        const generateEmailContent = async () => {
            setGenerating(true);
            // Simulate AI generation
            setTimeout(() => {
                setEmailData(prev => ({
                    ...prev,
                    content: `Hi {{first_name}},

I noticed you've been exploring attribution analytics solutions, and I wanted to share something that might interest you.

Most marketing teams are flying blind when it comes to ROI. They know traffic is coming in, but they can't connect the dots to actual revenue. Sound familiar?

That's exactly why we built AttributeAI. Instead of guessing which campaigns work, you'll see exactly which keywords, content pieces, and touchpoints drive real deals.

Here's what makes it different:
✓ Multi-touch attribution connecting marketing to closed revenue
✓ AI-powered insights from your actual data  
✓ Complete customer journey visualization
✓ Real-time ROI tracking by channel and campaign

Want to see how this would work for {{company_name}}? I can show you a custom analysis of your current marketing in just 15 minutes.

Book a demo here: [Demo Link]

Best regards,
{{sender_name}}

P.S. We're seeing companies increase marketing ROI by 200-400% within 90 days. Happy to share specific examples during our call.`
                }));
                setGenerating(false);
            }, 2000);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {email ? 'Edit Email' : 'Create New Email'}
                        </h2>
                        <Button variant="ghost" onClick={onClose}>×</Button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Subject Line</label>
                            <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                                placeholder="Enter email subject..."
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-300">Email Content</label>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={generateEmailContent}
                                    disabled={generating}
                                    className="flex items-center gap-2"
                                >
                                    <Zap size={14} />
                                    {generating ? 'Generating...' : 'AI Generate'}
                                </Button>
                            </div>
                            <textarea
                                value={emailData.content}
                                onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                                rows={15}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                                placeholder="Enter email content... Use {{first_name}}, {{company_name}}, {{sender_name}} for personalization"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Send Delay (days)</label>
                                <input
                                    type="number"
                                    value={emailData.delay}
                                    onChange={(e) => setEmailData(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                                    className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                <select
                                    value={emailData.status}
                                    onChange={(e) => setEmailData(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={() => onSave(emailData)}>
                            <Save size={16} className="mr-2" />
                            Save Email
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const SequenceDetail = ({ sequence, onBack }) => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={onBack}>←</Button>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{sequence.name}</h2>
                        <p className="text-gray-400">{sequence.description}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <Settings size={16} className="mr-2" />
                        Settings
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setShowEmailEditor(true)}>
                        <Plus size={16} className="mr-2" />
                        Add Email
                    </Button>
                </div>
            </div>

            {/* Sequence Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm">Active Subscribers</p>
                            <p className="text-2xl font-bold text-white">{sequence.subscribers}</p>
                        </div>
                        <Users className="text-blue-400" size={20} />
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-400 text-sm">Open Rate</p>
                            <p className="text-2xl font-bold text-white">{formatPercentage(sequence.openRate)}</p>
                        </div>
                        <Eye className="text-green-400" size={20} />
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400 text-sm">Click Rate</p>
                            <p className="text-2xl font-bold text-white">{formatPercentage(sequence.clickRate)}</p>
                        </div>
                        <Target className="text-purple-400" size={20} />
                    </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-orange-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-400 text-sm">Conversion Rate</p>
                            <p className="text-2xl font-bold text-white">{formatPercentage(sequence.conversionRate)}</p>
                        </div>
                        <BarChart3 className="text-orange-400" size={20} />
                    </div>
                </Card>
            </div>

            {/* Email Sequence Flow */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Email Sequence Flow</h3>
                <div className="space-y-4">
                    {sequence.emails.map((email, index) => (
                        <div key={email.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-white">{email.subject}</div>
                                <div className="text-sm text-gray-400">
                                    {email.delay === 0 ? 'Immediate' : `${email.delay} days delay`} • 
                                    Open: {formatPercentage(email.openRate)} • 
                                    Click: {formatPercentage(email.clickRate)}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant={email.status === 'active' ? 'success' : 'outline'}>
                                    {email.status}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(email)}>
                                    <Edit size={14} />
                                </Button>
                            </div>
                            {index < sequence.emails.length - 1 && (
                                <ArrowRight className="text-gray-500" size={16} />
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="loading-spinner h-8 w-8"></div>
                <span className="ml-3 text-gray-400">Loading email sequences...</span>
            </div>
        );
    }

    if (selectedSequence) {
        return (
            <>
                <SequenceDetail 
                    sequence={selectedSequence} 
                    onBack={() => setSelectedSequence(null)} 
                />
                {(showEmailEditor || selectedEmail) && (
                    <EmailEditor
                        email={selectedEmail}
                        onSave={(emailData) => {
                            console.log('Save email:', emailData);
                            setShowEmailEditor(false);
                            setSelectedEmail(null);
                        }}
                        onClose={() => {
                            setShowEmailEditor(false);
                            setSelectedEmail(null);
                        }}
                    />
                )}
            </>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Email Sequences
                    </h1>
                    <p className="text-gray-400">
                        Build automated email campaigns with AI-powered content generation
                        <Badge variant="warning" className="ml-2">Demo Mode</Badge>
                    </p>
                </div>
                <Button variant="primary" onClick={() => setShowCreateSequence(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Sequence
                </Button>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm font-medium mb-2">Active Sequences</p>
                            <p className="text-2xl font-bold text-white">{sequences.filter(s => s.status === 'active').length}</p>
                        </div>
                        <Mail className="text-blue-400" size={24} />
                    </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-400 text-sm font-medium mb-2">Total Subscribers</p>
                            <p className="text-2xl font-bold text-white">{sequences.reduce((sum, s) => sum + s.subscribers, 0)}</p>
                        </div>
                        <Users className="text-green-400" size={24} />
                    </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400 text-sm font-medium mb-2">Avg Open Rate</p>
                            <p className="text-2xl font-bold text-white">
                                {formatPercentage(sequences.reduce((sum, s) => sum + s.openRate, 0) / sequences.length)}
                            </p>
                        </div>
                        <Eye className="text-purple-400" size={24} />
                    </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-orange-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-400 text-sm font-medium mb-2">Avg Conversion</p>
                            <p className="text-2xl font-bold text-white">
                                {formatPercentage(sequences.reduce((sum, s) => sum + s.conversionRate, 0) / sequences.length)}
                            </p>
                        </div>
                        <Target className="text-orange-400" size={24} />
                    </div>
                </Card>
            </div>

            {/* Sequences List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sequences.map(sequence => (
                    <SequenceCard key={sequence.id} sequence={sequence} />
                ))}
            </div>
        </div>
    );
};

export default EmailSequenceBuilder;