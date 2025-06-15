import React, { useState, useEffect } from 'react';
import { Mail, Send, Paperclip, Eye, Zap, Clock, Target, BarChart3, Users, Calendar, Smile, Bold, Italic, Link, Image, FileText, History, Settings, Save } from 'lucide-react';
import { Button, Card, Badge } from '../ui/DesignSystem';

const OneToOneEmail = ({ contact, onClose, onSend }) => {
    const [emailData, setEmailData] = useState({
        to: contact?.email || '',
        subject: '',
        content: '',
        template: '',
        trackOpens: true,
        trackClicks: true,
        sendNow: true,
        scheduleDate: '',
        priority: 'normal'
    });
    const [generating, setGenerating] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [emailHistory, setEmailHistory] = useState([]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchTemplates();
        fetchEmailHistory();
    }, [contact]);

    const fetchTemplates = () => {
        setTemplates([
            {
                id: 'intro',
                name: 'Introduction Email',
                subject: 'Quick introduction from {{sender_name}}',
                content: `Hi {{first_name}},

I hope this email finds you well. I'm reaching out because I noticed {{company_name}} might benefit from better marketing attribution insights.

Many companies like yours struggle to connect marketing activities to actual revenue. We've helped similar businesses increase their marketing ROI by 200-400% by showing exactly which campaigns drive real deals.

Would you be interested in a quick 15-minute conversation to explore how this might work for {{company_name}}?

Best regards,
{{sender_name}}`
            },
            {
                id: 'demo-follow-up',
                name: 'Demo Follow-up',
                subject: 'Follow-up: Your AttributeAI demo insights',
                content: `Hi {{first_name}},

Thank you for taking the time to see AttributeAI in action yesterday. I hope the demo provided valuable insights into how you could track marketing ROI more effectively.

As we discussed, the key benefits for {{company_name}} would be:
• Clear visibility into which campaigns drive revenue
• Multi-touch attribution across all channels
• Real-time ROI tracking and optimization

I'd love to answer any questions that came up after our conversation. Are you available for a brief follow-up call this week?

Best regards,
{{sender_name}}`
            },
            {
                id: 'case-study',
                name: 'Relevant Case Study',
                subject: 'Case Study: How {{similar_company}} increased ROI by 340%',
                content: `Hi {{first_name}},

I wanted to share a relevant case study that might interest you, given {{company_name}}'s focus on {{industry}}.

{{similar_company}}, a company similar to yours, was struggling to measure marketing effectiveness across multiple channels. After implementing AttributeAI:

✓ 340% increase in marketing ROI visibility
✓ 60% improvement in budget allocation efficiency  
✓ 85% faster reporting and decision-making

The key was having complete visibility into their customer journey from first touch to closed deal.

Would you like to see how this might work for {{company_name}}? I can prepare a custom analysis of your current attribution challenges.

Best regards,
{{sender_name}}`
            },
            {
                id: 'value-prop',
                name: 'Value Proposition',
                subject: 'Stop guessing which marketing actually works',
                content: `Hi {{first_name}},

Most marketing teams are flying blind. They pour budget into campaigns but can't tell which ones actually drive revenue.

Sound familiar?

That's the exact problem AttributeAI solves. Instead of hoping your campaigns work, you'll see exactly:

→ Which keywords bring in the highest-value customers
→ Which content pieces influence deals
→ Which touchpoints matter most in your sales cycle
→ ROI by channel, campaign, and even individual pieces of content

For companies like {{company_name}}, this typically means 200-400% better marketing ROI within 90 days.

Interested in seeing how this would work for your team? I can show you a custom analysis in just 15 minutes.

Best regards,
{{sender_name}}`
            }
        ]);
    };

    const fetchEmailHistory = () => {
        if (!contact) return;
        
        setEmailHistory([
            {
                id: 'hist-1',
                subject: 'Introduction: AttributeAI marketing analytics',
                sentDate: '2024-06-10T10:00:00Z',
                status: 'opened',
                openCount: 2,
                clickCount: 1,
                replyReceived: false
            },
            {
                id: 'hist-2', 
                subject: 'Follow-up: Demo availability this week?',
                sentDate: '2024-06-13T14:30:00Z',
                status: 'opened',
                openCount: 1,
                clickCount: 0,
                replyReceived: false
            }
        ]);
    };

    const generateAIContent = async () => {
        setGenerating(true);
        
        // Simulate AI generation based on contact and deal context
        setTimeout(() => {
            const aiContent = `Hi ${contact?.first_name || '{{first_name}}'},

I've been following ${contact?.company?.name || '{{company_name}}'}'s growth in the ${contact?.company?.industry || '{{industry}}'} space, and I'm impressed by your recent initiatives.

I'm reaching out because I noticed that companies like yours often struggle with one key challenge: connecting marketing activities to actual revenue. Most teams know their campaigns are generating traffic, but they can't see which efforts actually drive deals.

That's exactly why we built AttributeAI. We help ${contact?.company?.industry || 'companies in your industry'} see the complete picture:

✓ Which keywords and content pieces influence your highest-value customers
✓ Complete customer journey visualization from first touch to closed deal  
✓ Real-time ROI tracking by channel, campaign, and touchpoint
✓ Multi-touch attribution that shows true marketing impact

For context, we recently helped a similar ${contact?.company?.industry || 'company'} increase their marketing ROI by 280% by identifying which campaigns were actually driving revenue versus just traffic.

Given ${contact?.company?.name || '{{company_name}}'}'s focus on growth, I think there could be significant value in a quick conversation. Would you be open to a 15-minute call to explore how this might apply to your current marketing efforts?

I can even prepare a preliminary analysis of your industry's attribution patterns before we speak.

Best regards,
{{sender_name}}

P.S. I noticed you recently ${contact?.last_activity || 'engaged with our content about attribution analytics'}. Happy to dive deeper into any specific questions that raised.`;

            setEmailData(prev => ({
                ...prev,
                content: aiContent,
                subject: prev.subject || `${contact?.company?.name || '{{company_name}}'}: Increase marketing ROI by 280% (15-min chat?)`
            }));
            setGenerating(false);
        }, 3000);
    };

    const useTemplate = (template) => {
        setEmailData(prev => ({
            ...prev,
            subject: template.subject,
            content: template.content,
            template: template.id
        }));
        setShowTemplates(false);
    };

    const personalizeContent = (content) => {
        return content
            .replace(/\{\{first_name\}\}/g, contact?.first_name || '[First Name]')
            .replace(/\{\{company_name\}\}/g, contact?.company?.name || '[Company Name]')
            .replace(/\{\{industry\}\}/g, contact?.company?.industry || '[Industry]')
            .replace(/\{\{sender_name\}\}/g, 'Your Name')
            .replace(/\{\{similar_company\}\}/g, 'TechCorp Solutions');
    };

    const handleSend = () => {
        const emailToSend = {
            ...emailData,
            content: personalizeContent(emailData.content),
            subject: personalizeContent(emailData.subject),
            sentAt: new Date().toISOString(),
            contactId: contact?.id
        };
        
        onSend && onSend(emailToSend);
        onClose && onClose();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'sent': 'text-blue-400',
            'delivered': 'text-green-400',
            'opened': 'text-purple-400',
            'clicked': 'text-orange-400',
            'replied': 'text-green-400'
        };
        return colors[status] || 'text-gray-400';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Send Email</h2>
                        <p className="text-gray-400">
                            To: {contact?.first_name} {contact?.last_name} ({contact?.email})
                        </p>
                    </div>
                    <Button variant="ghost" onClick={onClose}>×</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Email Composer */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Email Header */}
                        <div className="space-y-4">
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
                        </div>

                        {/* Content Editor */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-300">Email Content</label>
                                <div className="flex space-x-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setShowTemplates(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <FileText size={14} />
                                        Templates
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={generateAIContent}
                                        disabled={generating}
                                        className="flex items-center gap-2"
                                    >
                                        <Zap size={14} />
                                        {generating ? 'Generating...' : 'AI Generate'}
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Simple Formatting Toolbar */}
                            <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-800 rounded border border-gray-600">
                                <Button variant="ghost" size="sm"><Bold size={14} /></Button>
                                <Button variant="ghost" size="sm"><Italic size={14} /></Button>
                                <Button variant="ghost" size="sm"><Link size={14} /></Button>
                                <div className="w-px h-4 bg-gray-600"></div>
                                <Button variant="ghost" size="sm"><Smile size={14} /></Button>
                            </div>
                            
                            <textarea
                                value={emailData.content}
                                onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                                rows={15}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                                placeholder="Enter email content... Use {{first_name}}, {{company_name}}, etc. for personalization"
                            />
                        </div>

                        {/* Email Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                <select
                                    value={emailData.priority}
                                    onChange={(e) => setEmailData(prev => ({ ...prev, priority: e.target.value }))}
                                    className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="normal">Normal Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Send Options</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={emailData.trackOpens}
                                            onChange={(e) => setEmailData(prev => ({ ...prev, trackOpens: e.target.checked }))}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-300">Track opens</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={emailData.trackClicks}
                                            onChange={(e) => setEmailData(prev => ({ ...prev, trackClicks: e.target.checked }))}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-300">Track clicks</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Send Actions */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                    <Paperclip size={16} className="mr-2" />
                                    Attach
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Settings size={16} className="mr-2" />
                                    Options
                                </Button>
                            </div>
                            <div className="flex space-x-3">
                                <Button variant="outline" onClick={onClose}>Cancel</Button>
                                <Button variant="primary" onClick={handleSend}>
                                    <Send size={16} className="mr-2" />
                                    Send Email
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <Card className="p-4">
                            <h3 className="font-semibold text-white mb-3">Contact Details</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-400">Name:</span>
                                    <span className="text-white ml-2">{contact?.first_name} {contact?.last_name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Company:</span>
                                    <span className="text-white ml-2">{contact?.company?.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Title:</span>
                                    <span className="text-white ml-2">{contact?.title || 'Not specified'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Industry:</span>
                                    <span className="text-white ml-2">{contact?.company?.industry || 'Not specified'}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Email History */}
                        <Card className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-white">Email History</h3>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setShowHistory(!showHistory)}
                                >
                                    <History size={14} />
                                </Button>
                            </div>
                            
                            {emailHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {emailHistory.slice(0, showHistory ? emailHistory.length : 2).map((email) => (
                                        <div key={email.id} className="p-3 bg-gray-800 rounded-lg">
                                            <div className="font-medium text-white text-sm mb-1">{email.subject}</div>
                                            <div className="text-xs text-gray-400 mb-2">{formatDate(email.sentDate)}</div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className={getStatusColor(email.status)}>
                                                    {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                                                </span>
                                                <div className="flex space-x-2 text-gray-400">
                                                    <span>👁 {email.openCount}</span>
                                                    <span>🔗 {email.clickCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {emailHistory.length > 2 && !showHistory && (
                                        <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)}>
                                            View {emailHistory.length - 2} more...
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No previous emails sent</p>
                            )}
                        </Card>

                        {/* Attribution Context */}
                        <Card className="p-4">
                            <h3 className="font-semibold text-white mb-3">Attribution Context</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-400">Original Source:</span>
                                    <span className="text-blue-400 ml-2">{contact?.attribution_source || 'Organic Search'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Last Activity:</span>
                                    <span className="text-white ml-2">{contact?.last_activity || 'Website visit'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Deal Stage:</span>
                                    <span className="text-white ml-2">{contact?.deal_stage || 'Lead'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Lead Score:</span>
                                    <span className="text-green-400 ml-2">{contact?.lead_score || '85'}/100</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Templates Modal */}
                {showTemplates && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Email Templates</h3>
                                <Button variant="ghost" onClick={() => setShowTemplates(false)}>×</Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {templates.map((template) => (
                                    <Card key={template.id} className="p-4 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => useTemplate(template)}>
                                        <h4 className="font-semibold text-white mb-2">{template.name}</h4>
                                        <p className="text-gray-400 text-sm mb-3">{personalizeContent(template.subject)}</p>
                                        <div className="text-xs text-gray-500 line-clamp-3">
                                            {personalizeContent(template.content).substring(0, 150)}...
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OneToOneEmail;