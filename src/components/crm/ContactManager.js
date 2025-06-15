import React, { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, Building, User, Star, Activity, Eye, Edit, Trash2, Download, Upload, CheckCircle } from 'lucide-react';
import { Button } from '../ui/DesignSystem';

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [filters, setFilters] = useState({
        lifecycle_stage: 'all'
    });
    const [sortBy, setSortBy] = useState('lead_score');
    const [sortOrder, setSortOrder] = useState('desc');
    const [demoMode, setDemoMode] = useState(false);

    const [contactForm, setContactForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        job_title: '',
        lifecycle_stage: 'lead',
        lead_source: '',
        notes: ''
    });

    useEffect(() => {
        fetchContacts();
    }, [filters, sortBy, sortOrder]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.lifecycle_stage !== 'all') params.append('lifecycle_stage', filters.lifecycle_stage);
            
            const response = await fetch(`/api/crm/contacts?${params.toString()}`);
            const result = await response.json();
            
            if (result.success) {
                setContacts(result.data);
                setDemoMode(result.demo_mode);
            } else {
                setContacts(getDemoContacts());
                setDemoMode(true);
            }
        } catch (error) {
            setContacts(getDemoContacts());
            setDemoMode(true);
        } finally {
            setLoading(false);
        }
    };

    const getDemoContacts = () => [
        {
            id: 'demo-1',
            first_name: 'Sarah',
            last_name: 'Johnson',
            email: 'sarah@techcorp.com',
            phone: '+1 (555) 123-4567',
            job_title: 'Marketing Director',
            company: { name: 'TechCorp Solutions', domain: 'techcorp.com', industry: 'Technology' },
            lifecycle_stage: 'qualified_lead',
            lead_score: 75,
            last_activity_date: '2024-06-13',
            activities: [{ count: 8 }],
            deals: [{ count: 1, deal_value: 25000 }],
            created_at: '2024-06-01T10:00:00Z'
        },
        {
            id: 'demo-2',
            first_name: 'Mike',
            last_name: 'Chen',
            email: 'mike@marketingpro.com',
            phone: '+1 (555) 987-6543',
            job_title: 'CEO',
            company: { name: 'Marketing Agency Pro', domain: 'marketingpro.com', industry: 'Marketing' },
            lifecycle_stage: 'customer',
            lead_score: 90,
            last_activity_date: '2024-06-14',
            activities: [{ count: 15 }],
            deals: [{ count: 2, deal_value: 45000 }],
            created_at: '2024-05-15T14:30:00Z'
        }
    ];

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = searchTerm === '' || 
            `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLifecycle = filters.lifecycle_stage === 'all' || contact.lifecycle_stage === filters.lifecycle_stage;
        
        return matchesSearch && matchesLifecycle;
    });

    const getLifecycleBadge = (stage) => {
        const badges = {
            subscriber: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Subscriber' },
            lead: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Lead' },
            qualified_lead: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Qualified Lead' },
            opportunity: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Opportunity' },
            customer: { bg: 'bg-green-100', text: 'text-green-800', label: 'Customer' },
            evangelist: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Evangelist' },
            lost: { bg: 'bg-red-100', text: 'text-red-800', label: 'Lost' }
        };
        return badges[stage] || badges.lead;
    };

    const getLeadScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50';
        if (score >= 40) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Manager</h1>
                        <p className="text-gray-600">
                            Manage your contacts with superior attribution intelligence
                            {demoMode && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                    Demo Mode
                                </span>
                            )}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowContactModal(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Add Contact
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search contacts, emails, companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <select
                        value={filters.lifecycle_stage}
                        onChange={(e) => setFilters({ ...filters, lifecycle_stage: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Stages</option>
                        <option value="subscriber">Subscriber</option>
                        <option value="lead">Lead</option>
                        <option value="qualified_lead">Qualified Lead</option>
                        <option value="opportunity">Opportunity</option>
                        <option value="customer">Customer</option>
                        <option value="evangelist">Evangelist</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Contacts</p>
                            <p className="text-2xl font-bold text-blue-900">{contacts.length}</p>
                        </div>
                        <User className="text-blue-600" size={24} />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Qualified Leads</p>
                            <p className="text-2xl font-bold text-green-900">
                                {contacts.filter(c => c.lifecycle_stage === 'qualified_lead').length}
                            </p>
                        </div>
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Average Lead Score</p>
                            <p className="text-2xl font-bold text-yellow-900">
                                {contacts.length > 0 ? 
                                    Math.round(contacts.reduce((sum, c) => sum + (c.lead_score || 0), 0) / contacts.length) : 
                                    0
                                }
                            </p>
                        </div>
                        <Star className="text-yellow-600" size={24} />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Customers</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {contacts.filter(c => c.lifecycle_stage === 'customer').length}
                            </p>
                        </div>
                        <Building className="text-purple-600" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Contacts ({filteredContacts.length})
                    </h3>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading contacts...</p>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="p-8 text-center">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search or filters.' : 'Get started by adding your first contact.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lead Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Activity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredContacts.map((contact) => {
                                    const lifecycleBadge = getLifecycleBadge(contact.lifecycle_stage);
                                    
                                    return (
                                        <tr key={contact.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-600 font-medium text-sm">
                                                                {contact.first_name?.[0]}{contact.last_name?.[0]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {contact.first_name} {contact.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-4">
                                                            {contact.email && (
                                                                <span className="flex items-center gap-1">
                                                                    <Mail size={12} />
                                                                    {contact.email}
                                                                </span>
                                                            )}
                                                            {contact.phone && (
                                                                <span className="flex items-center gap-1">
                                                                    <Phone size={12} />
                                                                    {contact.phone}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {contact.job_title && (
                                                            <div className="text-xs text-gray-400">
                                                                {contact.job_title}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                {contact.company ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {contact.company.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {contact.company.industry}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No company</span>
                                                )}
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${lifecycleBadge.bg} ${lifecycleBadge.text}`}>
                                                    {lifecycleBadge.label}
                                                </span>
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLeadScoreColor(contact.lead_score || 0)}`}>
                                                    <Star size={12} className="mr-1" />
                                                    {contact.lead_score || 0}
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={12} />
                                                    <span>
                                                        {contact.activities?.[0]?.count || 0} activities
                                                    </span>
                                                </div>
                                                {contact.last_activity_date && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Last: {new Date(contact.last_activity_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="text-gray-600 hover:text-gray-900"
                                                        title="Edit Contact"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManager;