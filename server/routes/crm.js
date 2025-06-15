// =============================================================================
// AttributeAI CRM API Routes
// Complete backend for CRM functionality with Supabase integration
// Target: HubSpot-killer with superior attribution intelligence
// =============================================================================

const express = require('express');
const router = express.Router();

// Initialize Supabase client (optional)
let supabase = null;
try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
    }
} catch (error) {
    console.warn('⚠️ Supabase not available - CRM will run in demo mode');
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Get user ID from auth header or use demo user
const getUserId = (req) => {
    return req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
};

// Error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Demo data fallback
const getDemoData = (type) => {
    const demoData = {
        companies: [
            {
                id: 'demo-company-1',
                name: 'TechCorp Solutions',
                domain: 'techcorp.com',
                industry: 'Technology',
                lifecycle_stage: 'prospect',
                total_deal_value: 25000,
                created_at: new Date().toISOString()
            }
        ],
        contacts: [
            {
                id: 'demo-contact-1',
                company_id: 'demo-company-1',
                first_name: 'Sarah',
                last_name: 'Johnson',
                email: 'sarah@techcorp.com',
                job_title: 'Marketing Director',
                lifecycle_stage: 'qualified_lead',
                lead_score: 75,
                company: { name: 'TechCorp Solutions', domain: 'techcorp.com', industry: 'Technology' },
                activities: [{ count: 8 }],
                deals: [{ count: 1, deal_value: 25000 }],
                created_at: '2024-06-01T10:00:00Z'
            }
        ],
        deals: [
            {
                id: 'demo-deal-1',
                title: 'TechCorp Enterprise License',
                deal_value: 25000,
                probability: 50,
                status: 'open',
                stage_name: 'Proposal',
                contact: { first_name: 'Sarah', last_name: 'Johnson' },
                company: { name: 'TechCorp Solutions' },
                created_at: new Date().toISOString()
            }
        ]
    };
    return demoData[type] || [];
};

// =============================================================================
// COMPANIES ENDPOINTS
// =============================================================================

// GET /api/crm/companies - List all companies
router.get('/companies', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    
    if (!supabase) {
        return res.json({
            success: true,
            data: getDemoData('companies'),
            demo_mode: true
        });
    }
    
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({
        success: true,
        data: data || [],
        demo_mode: false
    });
}));

// POST /api/crm/companies - Create new company
router.post('/companies', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const companyData = req.body;
    
    if (!companyData.name) {
        return res.status(400).json({
            success: false,
            error: 'Company name is required'
        });
    }
    
    if (!supabase) {
        return res.json({
            success: true,
            data: {
                id: `demo-company-${Date.now()}`,
                user_id: userId,
                ...companyData,
                created_at: new Date().toISOString()
            },
            demo_mode: true
        });
    }
    
    const { data, error } = await supabase
        .from('companies')
        .insert([{
            user_id: userId,
            ...companyData
        }])
        .select()
        .single();
    
    if (error) throw error;
    
    res.json({
        success: true,
        data: data,
        demo_mode: false
    });
}));

// =============================================================================
// CONTACTS ENDPOINTS
// =============================================================================

// GET /api/crm/contacts - List all contacts
router.get('/contacts', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    
    if (!supabase) {
        return res.json({
            success: true,
            data: getDemoData('contacts'),
            demo_mode: true
        });
    }
    
    const { data, error } = await supabase
        .from('contacts')
        .select(`
            *,
            company:companies(name, domain, industry)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('lead_score', { ascending: false })
        .limit(50);
    
    if (error) throw error;
    
    res.json({
        success: true,
        data: data || [],
        demo_mode: false
    });
}));

// POST /api/crm/contacts - Create new contact
router.post('/contacts', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const contactData = req.body;
    
    if (!contactData.first_name || !contactData.last_name) {
        return res.status(400).json({
            success: false,
            error: 'First name and last name are required'
        });
    }
    
    if (!supabase) {
        return res.json({
            success: true,
            data: {
                id: `demo-contact-${Date.now()}`,
                user_id: userId,
                ...contactData,
                created_at: new Date().toISOString()
            },
            demo_mode: true
        });
    }
    
    const { data, error } = await supabase
        .from('contacts')
        .insert([{
            user_id: userId,
            ...contactData
        }])
        .select()
        .single();
    
    if (error) throw error;
    
    res.json({
        success: true,
        data: data,
        demo_mode: false
    });
}));

// =============================================================================
// DEALS ENDPOINTS
// =============================================================================

// GET /api/crm/deals - List all deals
router.get('/deals', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    
    if (!supabase) {
        return res.json({
            success: true,
            data: getDemoData('deals'),
            demo_mode: true
        });
    }
    
    const { data, error } = await supabase
        .from('deals')
        .select(`
            *,
            contact:contacts(first_name, last_name, email),
            company:companies(name, domain)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({
        success: true,
        data: data || [],
        demo_mode: false
    });
}));

// GET /api/crm/pipeline - Get pipeline view
router.get('/pipeline', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    
    if (!supabase) {
        return res.json({
            success: true,
            data: {
                stages: [
                    {
                        id: 'demo-stage-1',
                        name: 'Lead',
                        probability: 10,
                        color: '#ef4444',
                        stage_order: 1,
                        deals: []
                    },
                    {
                        id: 'demo-stage-2',
                        name: 'Qualified',
                        probability: 25,
                        color: '#f97316',
                        stage_order: 2,
                        deals: []
                    },
                    {
                        id: 'demo-stage-3',
                        name: 'Proposal',
                        probability: 50,
                        color: '#eab308',
                        stage_order: 3,
                        deals: getDemoData('deals')
                    },
                    {
                        id: 'demo-stage-4',
                        name: 'Negotiation',
                        probability: 75,
                        color: '#3b82f6',
                        stage_order: 4,
                        deals: []
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
            },
            demo_mode: true
        });
    }
    
    // For now, return demo pipeline structure
    // TODO: Implement real pipeline query when Supabase is configured
    res.json({
        success: true,
        data: {
            stages: [
                {
                    id: 'stage-1',
                    name: 'Lead',
                    probability: 10,
                    color: '#ef4444',
                    stage_order: 1,
                    deals: []
                },
                {
                    id: 'stage-2',
                    name: 'Qualified',
                    probability: 25,
                    color: '#f97316',
                    stage_order: 2,
                    deals: []
                },
                {
                    id: 'stage-3',
                    name: 'Proposal',
                    probability: 50,
                    color: '#eab308',
                    stage_order: 3,
                    deals: []
                },
                {
                    id: 'stage-4',
                    name: 'Negotiation',
                    probability: 75,
                    color: '#3b82f6',
                    stage_order: 4,
                    deals: []
                },
                {
                    id: 'stage-5',
                    name: 'Closed Won',
                    probability: 100,
                    color: '#22c55e',
                    stage_order: 5,
                    deals: []
                }
            ]
        },
        demo_mode: false
    });
}));

// POST /api/crm/deals - Create new deal
router.post('/deals', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const dealData = req.body;
    
    if (!dealData.title || !dealData.deal_value) {
        return res.status(400).json({
            success: false,
            error: 'Deal title and value are required'
        });
    }
    
    if (!supabase) {
        return res.json({
            success: true,
            data: {
                id: `demo-deal-${Date.now()}`,
                user_id: userId,
                ...dealData,
                created_at: new Date().toISOString()
            },
            demo_mode: true
        });
    }
    
    const { data, error } = await supabase
        .from('deals')
        .insert([{
            user_id: userId,
            ...dealData
        }])
        .select()
        .single();
    
    if (error) throw error;
    
    res.json({
        success: true,
        data: data,
        demo_mode: false
    });
}));

// =============================================================================
// OVERVIEW & ANALYTICS
// =============================================================================

// GET /api/crm/overview - Dashboard overview
router.get('/overview', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    
    // Always return demo data for now
    res.json({
        success: true,
        data: {
            total_companies: 3,
            total_contacts: 5,
            total_deals: 3,
            pipeline_value: 48000,
            closed_value: 15000,
            activities_this_week: 12,
            conversion_rate: 25,
            avg_deal_size: 16000
        },
        demo_mode: !supabase
    });
}));

// GET /api/crm/activities - List activities
router.get('/activities', asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    
    // Return demo activities
    res.json({
        success: true,
        data: [
            {
                id: 'activity-1',
                activity_type: 'call',
                subject: 'Discovery Call with TechCorp',
                description: 'Discussed their attribution needs and pain points',
                contact: { first_name: 'Sarah', last_name: 'Johnson' },
                company: { name: 'TechCorp Solutions' },
                created_at: '2024-06-14T10:30:00Z'
            },
            {
                id: 'activity-2',
                activity_type: 'email',
                subject: 'Proposal sent to Marketing Pro',
                description: 'Sent detailed proposal with pricing options',
                contact: { first_name: 'Mike', last_name: 'Chen' },
                company: { name: 'Marketing Agency Pro' },
                created_at: '2024-06-14T09:15:00Z'
            }
        ],
        demo_mode: !supabase
    });
}));

// =============================================================================
// ERROR HANDLING
// =============================================================================

// Error handler
router.use((error, req, res, next) => {
    console.error('CRM API Error:', error);
    
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal server error',
        demo_mode: !supabase
    });
});

module.exports = router;