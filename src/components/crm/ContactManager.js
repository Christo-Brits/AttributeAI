await response.json();
            
            if (result.success) {
                fetchContacts(); // Refresh list
            } else {
                alert('Failed to delete contact: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact');
        }
    };

    // Get lifecycle stage badge styling
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

    // Get lead score styling
    const getLeadScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50';
        if (score >= 40) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    // Export contacts to CSV
    const exportContacts = () => {
        const csvData = filteredContacts.map(contact => ({
            'First Name': contact.first_name,
            'Last Name': contact.last_name,
            'Email': contact.email,
            'Phone': contact.phone,
            'Job Title': contact.job_title,
            'Company': contact.company?.name || '',
            'Lifecycle Stage': contact.lifecycle_stage,
            'Lead Score': contact.lead_score,
            'Last Activity': contact.last_activity_date,
            'Created Date': new Date(contact.created_at).toLocaleDateString()
        }));
        
        const csv = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attributeai-contacts.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Open contact details
    const openContactDetails = (contact) => {
        setSelectedContact(contact);
        setContactForm({
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone || '',
            job_title: contact.job_title || '',
            company_id: contact.company_id || '',
            lifecycle_stage: contact.lifecycle_stage,
            lead_source: contact.lead_source || '',
            notes: contact.notes || ''
        });
        setShowContactModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            {/* Header */}
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
                            onClick={() => setShowImportModal(true)}
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
                        >
                            <Upload size={16} />
                            Import
                        </Button>
                        
                        <Button
                            onClick={exportContacts}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <Download size={16} />
                            Export
                        </Button>
                        
                        <Button
                            onClick={() => {
                                setSelectedContact(null);
                                setContactForm({
                                    first_name: '',
                                    last_name: '',
                                    email: '',
                                    phone: '',
                                    job_title: '',
                                    company_id: '',
                                    lifecycle_stage: 'lead',
                                    lead_source: '',
                                    notes: ''
                                });
                                setShowContactModal(true);
                            }}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Add Contact
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
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
                    
                    {/* Lifecycle Filter */}
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
                    
                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-');
                            setSortBy(field);
                            setSortOrder(order);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="lead_score-desc">Lead Score (High to Low)</option>
                        <option value="lead_score-asc">Lead Score (Low to High)</option>
                        <option value="created_at-desc">Recently Added</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="last_activity_date-desc">Recently Active</option>
                        <option value="first_name-asc">Name (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
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

            {/* Contacts Table */}
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
                                                        onClick={() => openContactDetails(contact)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openContactDetails(contact)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                        title="Edit Contact"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteContact(contact.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete Contact"
                                                    >
                                                        <Trash2 size={16} />
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

            {/* Contact Modal */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedContact ? 'Edit Contact' : 'Add New Contact'}
                            </h2>
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={contactForm.first_name}
                                        onChange={(e) => setContactForm({ ...contactForm, first_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={contactForm.last_name}
                                        onChange={(e) => setContactForm({ ...contactForm, last_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={contactForm.phone}
                                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={contactForm.job_title}
                                    onChange={(e) => setContactForm({ ...contactForm, job_title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Lifecycle Stage
                                    </label>
                                    <select
                                        value={contactForm.lifecycle_stage}
                                        onChange={(e) => setContactForm({ ...contactForm, lifecycle_stage: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="subscriber">Subscriber</option>
                                        <option value="lead">Lead</option>
                                        <option value="qualified_lead">Qualified Lead</option>
                                        <option value="opportunity">Opportunity</option>
                                        <option value="customer">Customer</option>
                                        <option value="evangelist">Evangelist</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Lead Source
                                    </label>
                                    <input
                                        type="text"
                                        value={contactForm.lead_source}
                                        onChange={(e) => setContactForm({ ...contactForm, lead_source: e.target.value })}
                                        placeholder="e.g., Organic Search, LinkedIn, Referral"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={contactForm.notes}
                                    onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add any notes about this contact..."
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                onClick={() => setShowContactModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveContact}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {selectedContact ? 'Update Contact' : 'Create Contact'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactManager;