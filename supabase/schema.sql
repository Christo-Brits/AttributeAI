-- AttributeAI Supabase Database Schema
-- Production-ready schema for Keyword Intelligence Engine
-- Designed to scale to 1M+ users (Keywords Everywhere migration)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- USERS & AUTHENTICATION
-- =============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    industry TEXT,
    website_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'professional', 'enterprise', 'agency')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Keyword Intelligence specific fields
    monthly_keyword_quota INTEGER DEFAULT 1000,
    keywords_used_this_month INTEGER DEFAULT 0,
    quota_reset_date DATE DEFAULT DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    
    -- Preferences
    primary_goals TEXT[],
    current_tools TEXT[],
    onboarding_completed BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- User profiles (for additional data)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    marketing_emails BOOLEAN DEFAULT TRUE,
    feature_updates BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- KEYWORD INTELLIGENCE CORE TABLES
-- =============================================================================

-- Keyword analyses (main keyword research data)
CREATE TABLE public.keyword_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Core keyword data
    keyword TEXT NOT NULL,
    normalized_keyword TEXT NOT NULL, -- lowercase, trimmed
    search_volume INTEGER,
    difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
    cpc DECIMAL(10,2),
    competition TEXT CHECK (competition IN ('Low', 'Medium', 'High')),
    intent TEXT CHECK (intent IN ('Informational', 'Commercial', 'Transactional', 'Navigational')),
    seasonality INTEGER CHECK (seasonality >= 0 AND seasonality <= 100),
    trend_direction TEXT CHECK (trend_direction IN ('Rising', 'Stable', 'Declining')),
    
    -- AI insights (JSONB for flexibility)
    ai_insights JSONB DEFAULT '{}'::jsonb,
    
    -- Analysis metadata
    analysis_type TEXT DEFAULT 'comprehensive',
    models_used TEXT[] DEFAULT ARRAY['claude', 'gpt4', 'gemini'],
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    
    -- Performance predictions
    predicted_traffic INTEGER,
    predicted_conversions DECIMAL(5,2),
    predicted_roi INTEGER,
    time_to_rank TEXT,
    
    -- Attribution data
    attribution_potential_score INTEGER CHECK (attribution_potential_score >= 0 AND attribution_potential_score <= 100),
    conversion_likelihood TEXT CHECK (conversion_likelihood IN ('Low', 'Medium', 'High')),
    funnel_stage TEXT CHECK (funnel_stage IN ('Awareness', 'Consideration', 'Decision')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, normalized_keyword)
);

-- Related keywords (keyword variations and suggestions)
CREATE TABLE public.related_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_keyword_id UUID REFERENCES public.keyword_analyses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    keyword TEXT NOT NULL,
    search_volume INTEGER,
    difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
    cpc DECIMAL(10,2),
    competition TEXT CHECK (competition IN ('Low', 'Medium', 'High')),
    intent TEXT CHECK (intent IN ('Informational', 'Commercial', 'Transactional', 'Navigational')),
    
    relationship_type TEXT CHECK (relationship_type IN ('related', 'long_tail', 'competitor', 'variation')),
    similarity_score DECIMAL(3,2) CHECK (similarity_score >= 0 AND similarity_score <= 1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword research sessions (user research history)
CREATE TABLE public.keyword_research_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    session_name TEXT,
    keywords_analyzed TEXT[],
    total_keywords INTEGER DEFAULT 0,
    
    -- Session metadata
    analysis_type TEXT DEFAULT 'comprehensive',
    models_used TEXT[],
    session_data JSONB DEFAULT '{}'::jsonb,
    
    -- Export data
    exported_formats TEXT[],
    export_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content opportunities (AI-generated content suggestions)
CREATE TABLE public.content_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword_analysis_id UUID REFERENCES public.keyword_analyses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    content_type TEXT CHECK (content_type IN ('Blog Post', 'Pillar Page', 'Landing Page', 'Comparison Post', 'How-to Guide', 'Case Study')),
    title TEXT NOT NULL,
    description TEXT,
    target_keywords TEXT[],
    
    -- Opportunity scoring
    difficulty TEXT CHECK (difficulty IN ('Low', 'Medium', 'High')),
    potential TEXT CHECK (potential IN ('Low', 'Medium', 'High', 'Very High')),
    priority_score INTEGER CHECK (priority_score >= 0 AND priority_score <= 100),
    estimated_traffic INTEGER,
    
    -- Content metadata
    estimated_word_count INTEGER,
    suggested_outline TEXT[],
    competitor_analysis TEXT,
    
    -- Status
    status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'planned', 'in_progress', 'completed', 'rejected')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- COMPETITOR ANALYSIS
-- =============================================================================

-- Competitor analyses
CREATE TABLE public.competitor_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    domain TEXT NOT NULL,
    analysis_data JSONB DEFAULT '{}'::jsonb,
    
    -- Top competitor keywords
    top_keywords JSONB DEFAULT '[]'::jsonb,
    keyword_gaps JSONB DEFAULT '[]'::jsonb,
    content_gaps JSONB DEFAULT '[]'::jsonb,
    
    -- Competitive metrics
    authority_score INTEGER CHECK (authority_score >= 0 AND authority_score <= 100),
    estimated_traffic INTEGER,
    total_keywords INTEGER,
    opportunity_score INTEGER CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for fast lookups
    UNIQUE(user_id, domain)
);

-- =============================================================================
-- ATTRIBUTION & PERFORMANCE TRACKING
-- =============================================================================

-- Keyword performance tracking
CREATE TABLE public.keyword_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword_analysis_id UUID REFERENCES public.keyword_analyses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Performance metrics
    current_ranking INTEGER,
    previous_ranking INTEGER,
    ranking_change INTEGER,
    traffic_estimate INTEGER,
    click_through_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    
    -- Attribution data
    attributed_conversions INTEGER DEFAULT 0,
    attributed_revenue DECIMAL(10,2) DEFAULT 0,
    cost_per_acquisition DECIMAL(10,2),
    
    -- Tracking period
    tracked_date DATE DEFAULT CURRENT_DATE,
    tracking_period TEXT DEFAULT 'monthly',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per keyword per tracking period
    UNIQUE(keyword_analysis_id, tracked_date)
);

-- =============================================================================
-- USAGE TRACKING & ANALYTICS
-- =============================================================================

-- User activity tracking
CREATE TABLE public.user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    activity_type TEXT NOT NULL CHECK (activity_type IN ('keyword_analysis', 'bulk_analysis', 'competitor_analysis', 'content_generation', 'export', 'login')),
    activity_data JSONB DEFAULT '{}'::jsonb,
    
    -- Resource usage
    keywords_analyzed INTEGER DEFAULT 0,
    api_calls_made INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    
    -- Session tracking
    session_id TEXT,
    user_agent TEXT,
    ip_address INET,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking (for rate limiting and billing)
CREATE TABLE public.api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    
    -- Rate limiting
    requests_this_minute INTEGER DEFAULT 1,
    requests_this_hour INTEGER DEFAULT 1,
    requests_this_day INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Keyword analyses indexes
CREATE INDEX idx_keyword_analyses_user_id ON public.keyword_analyses(user_id);
CREATE INDEX idx_keyword_analyses_keyword ON public.keyword_analyses(normalized_keyword);
CREATE INDEX idx_keyword_analyses_created_at ON public.keyword_analyses(created_at);
CREATE INDEX idx_keyword_analyses_search_volume ON public.keyword_analyses(search_volume DESC);
CREATE INDEX idx_keyword_analyses_difficulty ON public.keyword_analyses(difficulty);
CREATE INDEX idx_keyword_analyses_intent ON public.keyword_analyses(intent);

-- Full-text search index for keywords
CREATE INDEX idx_keyword_analyses_keyword_trgm ON public.keyword_analyses USING gin(normalized_keyword gin_trgm_ops);

-- Related keywords indexes
CREATE INDEX idx_related_keywords_parent ON public.related_keywords(parent_keyword_id);
CREATE INDEX idx_related_keywords_user_id ON public.related_keywords(user_id);

-- Session indexes
CREATE INDEX idx_research_sessions_user_id ON public.keyword_research_sessions(user_id);
CREATE INDEX idx_research_sessions_created_at ON public.keyword_research_sessions(created_at);

-- Performance tracking indexes
CREATE INDEX idx_keyword_performance_keyword_id ON public.keyword_performance(keyword_analysis_id);
CREATE INDEX idx_keyword_performance_tracked_date ON public.keyword_performance(tracked_date);

-- Activity tracking indexes
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all user-specific tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.related_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own keyword analyses" ON public.keyword_analyses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own related keywords" ON public.related_keywords FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own research sessions" ON public.keyword_research_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own content opportunities" ON public.content_opportunities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own competitor analyses" ON public.competitor_analyses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own keyword performance" ON public.keyword_performance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own activity" ON public.user_activity FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own API usage" ON public.api_usage FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_keyword_analyses_updated_at BEFORE UPDATE ON public.keyword_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_sessions_updated_at BEFORE UPDATE ON public.keyword_research_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_opportunities_updated_at BEFORE UPDATE ON public.content_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitor_analyses_updated_at BEFORE UPDATE ON public.competitor_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to reset monthly keyword usage
CREATE OR REPLACE FUNCTION reset_monthly_keyword_usage()
RETURNS void AS $$
BEGIN
    UPDATE public.users 
    SET 
        keywords_used_this_month = 0,
        quota_reset_date = DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
    WHERE quota_reset_date <= CURRENT_DATE;
END;
$$ language 'plpgsql';

-- Function to increment keyword usage
CREATE OR REPLACE FUNCTION increment_keyword_usage(user_uuid UUID, keyword_count INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
    UPDATE public.users 
    SET 
        keywords_used_this_month = keywords_used_this_month + keyword_count,
        last_active_at = NOW()
    WHERE id = user_uuid;
END;
$$ language 'plpgsql';

-- =============================================================================
-- VIEWS FOR ANALYTICS
-- =============================================================================

-- User analytics view
CREATE VIEW user_analytics AS
SELECT 
    u.id,
    u.email,
    u.subscription_tier,
    u.keywords_used_this_month,
    u.monthly_keyword_quota,
    u.created_at,
    u.last_active_at,
    COUNT(ka.id) as total_keyword_analyses,
    COUNT(krs.id) as total_research_sessions,
    COUNT(ca.id) as total_competitor_analyses
FROM public.users u
LEFT JOIN public.keyword_analyses ka ON u.id = ka.user_id
LEFT JOIN public.keyword_research_sessions krs ON u.id = krs.user_id
LEFT JOIN public.competitor_analyses ca ON u.id = ca.user_id
GROUP BY u.id, u.email, u.subscription_tier, u.keywords_used_this_month, u.monthly_keyword_quota, u.created_at, u.last_active_at;

-- Popular keywords view
CREATE VIEW popular_keywords AS
SELECT 
    normalized_keyword,
    COUNT(*) as analysis_count,
    AVG(search_volume) as avg_search_volume,
    AVG(difficulty) as avg_difficulty,
    MODE() WITHIN GROUP (ORDER BY intent) as most_common_intent
FROM public.keyword_analyses
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY normalized_keyword
HAVING COUNT(*) >= 5
ORDER BY analysis_count DESC, avg_search_volume DESC;

-- =============================================================================
-- INITIAL DATA & CONFIGURATION
-- =============================================================================

-- Insert subscription tiers configuration
INSERT INTO public.users (id, email, subscription_tier, monthly_keyword_quota) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@attributeai.com', 'free', 50),
('00000000-0000-0000-0000-000000000002', 'pro@attributeai.com', 'professional', 5000),
('00000000-0000-0000-0000-000000000003', 'enterprise@attributeai.com', 'enterprise', 50000)
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- COMMENTS & DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.users IS 'Core user accounts with subscription and quota management';
COMMENT ON TABLE public.keyword_analyses IS 'Individual keyword analysis results with AI insights';
COMMENT ON TABLE public.related_keywords IS 'Related keywords and variations for each analysis';
COMMENT ON TABLE public.keyword_research_sessions IS 'User research sessions and history';
COMMENT ON TABLE public.content_opportunities IS 'AI-generated content suggestions based on keyword research';
COMMENT ON TABLE public.competitor_analyses IS 'Competitor keyword and content analysis results';
COMMENT ON TABLE public.keyword_performance IS 'Performance tracking for individual keywords over time';
COMMENT ON TABLE public.user_activity IS 'User activity and engagement tracking';
COMMENT ON TABLE public.api_usage IS 'API usage tracking for rate limiting and billing';

COMMENT ON COLUMN public.keyword_analyses.ai_insights IS 'JSON object containing Claude, GPT-4, and Gemini analysis results';
COMMENT ON COLUMN public.keyword_analyses.attribution_potential_score IS 'Score 0-100 indicating likelihood of driving conversions';
COMMENT ON COLUMN public.users.monthly_keyword_quota IS 'Monthly keyword analysis quota based on subscription tier';
COMMENT ON COLUMN public.users.keywords_used_this_month IS 'Current month keyword analysis usage count';

-- Schema version for migrations
CREATE TABLE IF NOT EXISTS public.schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT
);

INSERT INTO public.schema_version (version, description) VALUES 
(1, 'Initial AttributeAI schema with keyword intelligence engine support');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ AttributeAI database schema created successfully!';
    RAISE NOTICE '🎯 Ready to scale to 1M+ users for keyword intelligence';
    RAISE NOTICE '📊 Features: Multi-user auth, keyword analytics, competitor analysis, performance tracking';
    RAISE NOTICE '🔒 Security: Row Level Security enabled for all user data';
END $$;