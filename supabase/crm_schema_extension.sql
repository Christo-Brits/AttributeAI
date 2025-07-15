CASE WHEN d.status = 'open' THEN d.deal_value ELSE 0 END) as pipeline_value,
    SUM(CASE WHEN d.status = 'won' THEN d.deal_value ELSE 0 END) as closed_value,
    
    -- Attribution metrics
    COUNT(DISTINCT da.keyword) as attributed_keywords,
    COUNT(DISTINCT da.touchpoint_source) as touchpoint_sources,
    
    -- Activity metrics
    COUNT(DISTINCT a.id) as total_activities,
    COUNT(DISTINCT CASE WHEN a.created_at > NOW() - INTERVAL '7 days' THEN a.id END) as activities_this_week
    
FROM public.users u
LEFT JOIN public.companies co ON u.id = co.user_id AND co.status = 'active'
LEFT JOIN public.contacts c ON u.id = c.user_id AND c.status = 'active'
LEFT JOIN public.deals d ON u.id = d.user_id
LEFT JOIN public.deal_attribution da ON u.id = da.user_id
LEFT JOIN public.activities a ON u.id = a.user_id
GROUP BY u.id, u.email;

-- Sales Pipeline Performance
CREATE VIEW pipeline_performance AS
SELECT 
    p.id as pipeline_id,
    p.user_id,
    p.name as pipeline_name,
    ds.id as stage_id,
    ds.name as stage_name,
    ds.stage_order,
    ds.probability,
    
    -- Deal metrics per stage
    COUNT(d.id) as deals_count,
    SUM(d.deal_value) as total_value,
    AVG(d.deal_value) as avg_deal_size,
    AVG(d.days_in_stage) as avg_days_in_stage,
    
    -- Conversion metrics
    COUNT(CASE WHEN d.status = 'won' THEN 1 END) as won_deals,
    COUNT(CASE WHEN d.status = 'lost' THEN 1 END) as lost_deals,
    
    -- Time metrics
    AVG(CASE WHEN d.actual_close_date IS NOT NULL 
        THEN EXTRACT(DAYS FROM d.actual_close_date - d.created_at) 
        END) as avg_sales_cycle_days
        
FROM public.pipelines p
JOIN public.deal_stages ds ON p.id = ds.pipeline_id
LEFT JOIN public.deals d ON ds.id = d.stage_id
WHERE p.status = 'active'
GROUP BY p.id, p.user_id, p.name, ds.id, ds.name, ds.stage_order, ds.probability
ORDER BY p.id, ds.stage_order;

-- Revenue Attribution Analysis
CREATE VIEW revenue_attribution AS
SELECT 
    da.user_id,
    da.keyword,
    da.touchpoint_type,
    da.touchpoint_source,
    
    -- Deal metrics
    COUNT(DISTINCT da.deal_id) as deals_influenced,
    SUM(da.attribution_value) as total_attributed_revenue,
    AVG(da.attribution_value) as avg_attributed_revenue,
    
    -- Marketing efficiency
    SUM(da.marketing_cost) as total_marketing_cost,
    SUM(da.roi_contribution) as total_roi_contribution,
    
    -- Performance metrics
    CASE WHEN SUM(da.marketing_cost) > 0 
        THEN SUM(da.roi_contribution) / SUM(da.marketing_cost) 
        ELSE 0 END as roas,
    
    -- Keyword intelligence connection
    COUNT(DISTINCT da.keyword_analysis_id) as keyword_analyses_connected,
    
    -- Time metrics
    DATE_TRUNC('month', da.touchpoint_date) as attribution_month
    
FROM public.deal_attribution da
JOIN public.deals d ON da.deal_id = d.id
WHERE d.status IN ('won', 'open')
GROUP BY da.user_id, da.keyword, da.touchpoint_type, da.touchpoint_source, DATE_TRUNC('month', da.touchpoint_date)
ORDER BY total_attributed_revenue DESC;

-- Contact Engagement Scoring
CREATE VIEW contact_engagement AS
SELECT 
    c.id as contact_id,
    c.user_id,
    c.first_name || ' ' || c.last_name as full_name,
    c.email,
    c.company_id,
    c.lead_score,
    c.lifecycle_stage,
    
    -- Activity metrics
    COUNT(DISTINCT a.id) as total_activities,
    COUNT(DISTINCT CASE WHEN a.created_at > NOW() - INTERVAL '30 days' THEN a.id END) as activities_last_30_days,
    MAX(a.created_at) as last_activity_date,
    
    -- Email engagement
    COUNT(DISTINCT ei.id) as total_emails,
    COUNT(DISTINCT CASE WHEN ei.status = 'opened' THEN ei.id END) as emails_opened,
    COUNT(DISTINCT CASE WHEN ei.status = 'clicked' THEN ei.id END) as emails_clicked,
    COUNT(DISTINCT CASE WHEN ei.status = 'replied' THEN ei.id END) as emails_replied,
    
    -- Engagement scoring
    CASE 
        WHEN COUNT(DISTINCT a.id) = 0 THEN 'Cold'
        WHEN COUNT(DISTINCT CASE WHEN a.created_at > NOW() - INTERVAL '7 days' THEN a.id END) > 0 THEN 'Hot'
        WHEN COUNT(DISTINCT CASE WHEN a.created_at > NOW() - INTERVAL '30 days' THEN a.id END) > 0 THEN 'Warm'
        ELSE 'Cool'
    END as engagement_level,
    
    -- Deal connection
    COUNT(DISTINCT d.id) as associated_deals,
    SUM(CASE WHEN d.status = 'open' THEN d.deal_value ELSE 0 END) as pipeline_value
    
FROM public.contacts c
LEFT JOIN public.activities a ON c.id = a.contact_id
LEFT JOIN public.email_interactions ei ON c.id = ei.contact_id
LEFT JOIN public.deals d ON c.id = d.contact_id
WHERE c.status = 'active'
GROUP BY c.id, c.user_id, c.first_name, c.last_name, c.email, c.company_id, c.lead_score, c.lifecycle_stage
ORDER BY c.lead_score DESC, total_activities DESC;

-- =============================================================================
-- DEFAULT DATA FOR NEW CRM USERS
-- =============================================================================

-- Function to initialize CRM for new users
CREATE OR REPLACE FUNCTION initialize_user_crm(user_uuid UUID)
RETURNS void AS $$
DECLARE
    pipeline_id UUID;
BEGIN
    -- Create default pipeline and stages
    SELECT create_default_pipeline(user_uuid) INTO pipeline_id;
    
    -- Log initialization
    INSERT INTO public.user_activity (user_id, activity_type, activity_data)
    VALUES (user_uuid, 'crm_initialization', 
        jsonb_build_object('pipeline_id', pipeline_id, 'initialized_at', NOW()));
        
END;
$$ language 'plpgsql';

-- =============================================================================
-- SAMPLE DATA FOR TESTING
-- =============================================================================

-- Insert sample companies for demo user
INSERT INTO public.companies (user_id, name, domain, website_url, industry, company_size, lifecycle_stage, lead_source, original_keyword, total_deal_value) VALUES
('00000000-0000-0000-0000-000000000001', 'TechCorp Solutions', 'techcorp.com', 'https://techcorp.com', 'Technology', '51-200', 'prospect', 'Organic Search', 'saas marketing tools', 25000.00),
('00000000-0000-0000-0000-000000000001', 'Marketing Agency Pro', 'marketingpro.com', 'https://marketingpro.com', 'Marketing & Advertising', '11-50', 'customer', 'LinkedIn', 'attribution software', 15000.00),
('00000000-0000-0000-0000-000000000001', 'E-commerce Plus', 'ecommerceplus.com', 'https://ecommerceplus.com', 'E-commerce', '201-1000', 'lead', 'Content Marketing', 'keyword research tool', 0.00)
ON CONFLICT DO NOTHING;

-- Get company IDs for sample contacts
DO $$
DECLARE
    techcorp_id UUID;
    marketing_id UUID;
    ecommerce_id UUID;
    demo_pipeline_id UUID;
    stage_qualified_id UUID;
    stage_proposal_id UUID;
    stage_negotiation_id UUID;
BEGIN
    -- Get company IDs
    SELECT id INTO techcorp_id FROM public.companies WHERE domain = 'techcorp.com' AND user_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO marketing_id FROM public.companies WHERE domain = 'marketingpro.com' AND user_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO ecommerce_id FROM public.companies WHERE domain = 'ecommerceplus.com' AND user_id = '00000000-0000-0000-0000-000000000001';
    
    -- Create default pipeline for demo user if it doesn't exist
    SELECT id INTO demo_pipeline_id FROM public.pipelines WHERE user_id = '00000000-0000-0000-0000-000000000001' AND is_default = TRUE;
    IF demo_pipeline_id IS NULL THEN
        SELECT create_default_pipeline('00000000-0000-0000-0000-000000000001') INTO demo_pipeline_id;
    END IF;
    
    -- Get stage IDs
    SELECT id INTO stage_qualified_id FROM public.deal_stages WHERE pipeline_id = demo_pipeline_id AND name = 'Qualified';
    SELECT id INTO stage_proposal_id FROM public.deal_stages WHERE pipeline_id = demo_pipeline_id AND name = 'Proposal';
    SELECT id INTO stage_negotiation_id FROM public.deal_stages WHERE pipeline_id = demo_pipeline_id AND name = 'Negotiation';
    
    -- Insert sample contacts
    INSERT INTO public.contacts (user_id, company_id, first_name, last_name, email, job_title, lifecycle_stage, lead_source, original_keyword, lead_score) VALUES
    ('00000000-0000-0000-0000-000000000001', techcorp_id, 'Sarah', 'Johnson', 'sarah@techcorp.com', 'Marketing Director', 'qualified_lead', 'Organic Search', 'saas marketing tools', 75),
    ('00000000-0000-0000-0000-000000000001', marketing_id, 'Mike', 'Chen', 'mike@marketingpro.com', 'CEO', 'customer', 'LinkedIn', 'attribution software', 90),
    ('00000000-0000-0000-0000-000000000001', ecommerce_id, 'Lisa', 'Rodriguez', 'lisa@ecommerceplus.com', 'Head of Growth', 'lead', 'Content Marketing', 'keyword research tool', 45)
    ON CONFLICT DO NOTHING;
    
    -- Get contact IDs for deals
    DECLARE
        sarah_id UUID;
        mike_id UUID;
        lisa_id UUID;
    BEGIN
        SELECT id INTO sarah_id FROM public.contacts WHERE email = 'sarah@techcorp.com' AND user_id = '00000000-0000-0000-0000-000000000001';
        SELECT id INTO mike_id FROM public.contacts WHERE email = 'mike@marketingpro.com' AND user_id = '00000000-0000-0000-0000-000000000001';
        SELECT id INTO lisa_id FROM public.contacts WHERE email = 'lisa@ecommerceplus.com' AND user_id = '00000000-0000-0000-0000-000000000001';
        
        -- Insert sample deals
        INSERT INTO public.deals (user_id, company_id, contact_id, pipeline_id, stage_id, title, deal_value, probability, expected_close_date, original_keyword, deal_source, status) VALUES
        ('00000000-0000-0000-0000-000000000001', techcorp_id, sarah_id, demo_pipeline_id, stage_proposal_id, 'TechCorp Enterprise License', 25000.00, 50, CURRENT_DATE + INTERVAL '30 days', 'saas marketing tools', 'Organic Search', 'open'),
        ('00000000-0000-0000-0000-000000000001', marketing_id, mike_id, demo_pipeline_id, stage_negotiation_id, 'Marketing Pro Annual Subscription', 15000.00, 75, CURRENT_DATE + INTERVAL '15 days', 'attribution software', 'LinkedIn', 'open'),
        ('00000000-0000-0000-0000-000000000001', ecommerce_id, lisa_id, demo_pipeline_id, stage_qualified_id, 'E-commerce Plus Trial Conversion', 8000.00, 25, CURRENT_DATE + INTERVAL '45 days', 'keyword research tool', 'Content Marketing', 'open')
        ON CONFLICT DO NOTHING;
        
        -- Insert sample activities
        INSERT INTO public.activities (user_id, contact_id, company_id, activity_type, subject, description, created_at) VALUES
        ('00000000-0000-0000-0000-000000000001', sarah_id, techcorp_id, 'call', 'Discovery Call', 'Initial needs assessment call. Discussed current marketing stack and attribution challenges.', NOW() - INTERVAL '2 days'),
        ('00000000-0000-0000-0000-000000000001', mike_id, marketing_id, 'demo_booked', 'Product Demo Scheduled', 'Demo scheduled for next week to show attribution features.', NOW() - INTERVAL '1 day'),
        ('00000000-0000-0000-0000-000000000001', lisa_id, ecommerce_id, 'email', 'Follow-up Email Sent', 'Sent case study about e-commerce attribution success stories.', NOW() - INTERVAL '3 hours')
        ON CONFLICT DO NOTHING;
        
    END;
END $$;

-- =============================================================================
-- CRM SCHEMA COMPLETION
-- =============================================================================

-- Update schema version
INSERT INTO public.schema_version (version, description) VALUES 
(2, 'CRM extension: Companies, Contacts, Deals, Attribution, Browser Extension Integration');

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '🚀 AttributeAI CRM Schema Extension Complete!';
    RAISE NOTICE '📊 Added: Companies, Contacts, Deals, Pipelines, Attribution, Activities';
    RAISE NOTICE '🔗 Integration: Keywords → Attribution → Deals → Revenue';
    RAISE NOTICE '🌐 Browser Extension: Website visits, LinkedIn tracking';
    RAISE NOTICE '📈 Analytics: Revenue attribution, pipeline performance, engagement scoring';
    RAISE NOTICE '🎯 Ready to become the "HubSpot Killer" with superior attribution intelligence!';
END $$;