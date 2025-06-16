// Updated Navigation Item for Enhanced Content Cluster Generator
// Add this to your SidebarNavigation.js in the Content Intelligence section

// First, add Layers to the imports:
// import { 
//   BarChart3, Activity, TrendingUp, Search, PenTool, Target, Eye, Settings, 
//   User, Bell, Grid, LogOut, Globe, ChevronDown, Calendar, Menu, X,
//   Users, Building, DollarSign, GitBranch, ChevronRight, Mail, Layers
// } from 'lucide-react';

// Then add this navigation item to the Content Intelligence section:
{
  id: 'enhanced-content-cluster', 
  name: 'Content Campaigns', 
  icon: Layers, 
  new: true, 
  description: 'Complete marketing campaigns with n8n automation',
  competitive: 'Research → Content → Social → Attribution'
}

// The complete Content Intelligence section should look like this:
/*
{
  id: 'content',
  title: 'Content Intelligence',
  expandable: true,
  items: [
    { 
      id: 'keyword-intelligence', 
      name: 'Keyword Intelligence', 
      icon: Search, 
      new: true, 
      description: 'Unlimited keyword research',
      competitive: 'Keywords Everywhere killer'
    },
    { 
      id: 'enhanced-content', 
      name: 'Enhanced Content', 
      icon: PenTool, 
      new: true, 
      description: 'Multi-AI content generation',
      competitive: 'Outrank.so killer'
    },
    { 
      id: 'enhanced-content-cluster', 
      name: 'Content Campaigns', 
      icon: Layers, 
      new: true, 
      description: 'Complete marketing campaigns',
      competitive: 'n8n workflow automation'
    },
    { id: 'seo-enhanced', name: 'AI SEO Analysis', icon: TrendingUp, phase2: true, description: 'Advanced SEO insights' },
    { id: 'content', name: 'Content Strategy', icon: PenTool, description: 'Strategic planning' },
    { id: 'publishing', name: 'Publishing Pipeline', icon: Globe, phase2: true, description: 'Automated publishing' },
    { id: 'scheduler', name: 'Content Scheduler', icon: Calendar, phase2: true, description: 'Strategic timing' }
  ]
}
*/