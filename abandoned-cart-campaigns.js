// AttributeAI Abandoned Cart Recovery System
// Automated email sequences for users who didn't complete onboarding

const abandonedCartCampaigns = {
  // Day 1: Immediate welcome + completion incentive
  day1: {
    subject: "🚀 Complete your AttributeAI setup (2 minutes left)",
    timing: "1 hour after signup",
    incentive: "Unlock 500 bonus keyword analyses",
    template: `
    Hi {{first_name}},
    
    I noticed you started setting up your AttributeAI account but didn't finish the last step.
    
    Good news: You're just 2 minutes away from unlimited keyword research! 
    
    🎁 BONUS: Complete your setup in the next 24 hours and get:
    ✅ 500 bonus keyword analyses (normally $50 value)
    ✅ Priority access to new AI features
    ✅ Free strategy consultation call
    
    [Complete Setup Now - 2 Minutes] → {{completion_link}}
    
    Questions? Just reply to this email.
    
    Best,
    Chris
    Founder, AttributeAI
    `
  },

  // Day 3: Social proof + case study
  day3: {
    subject: "See how Sarah got 340% more organic traffic",
    timing: "3 days after signup",
    strategy: "Social proof + FOMO",
    template: `
    Hi {{first_name}},
    
    Quick question: What's holding you back from completing your AttributeAI setup?
    
    While you've been thinking it over, here's what happened to Sarah (similar business to yours):
    
    📈 340% increase in organic traffic in 60 days
    📈 2.4x more qualified leads from content
    📈 $180k additional revenue attributed to keyword optimization
    
    Her secret? She used AttributeAI's unlimited keyword research to find gaps her competitors missed.
    
    The same opportunity is waiting in your account:
    [Complete Setup → Get Results Like Sarah] {{completion_link}}
    
    Still have questions? Book a free 15-min strategy call: {{calendar_link}}
    
    Best,
    Chris
    `
  },

  // Day 7: Urgency + competitor angle
  day7: {
    subject: "Your competitors found 1,247 new keywords this week",
    timing: "7 days after signup",
    strategy: "Competitive urgency",
    template: `
    Hi {{first_name}},
    
    Uncomfortable truth: While your account has been inactive, your competitors have been busy.
    
    This week alone, businesses like yours discovered:
    🔍 1,247 new profitable keywords
    📝 Generated 89 pieces of AI-optimized content  
    💰 Identified $2.3M in new revenue opportunities
    
    Meanwhile, your AttributeAI account is gathering digital dust.
    
    Don't let your competitors get further ahead:
    [Activate Your Account Now] {{completion_link}}
    
    ⏰ REMINDER: Your bonus 500 keyword analyses expire in 24 hours.
    
    Last chance to turn the tables,
    Chris
    `
  },

  // Day 14: Final offer + account expiry
  day14: {
    subject: "Account expiring in 48 hours (final notice)",
    timing: "14 days after signup", 
    strategy: "Final urgency + loss aversion",
    template: `
    Hi {{first_name}},
    
    This is my final email about your inactive AttributeAI account.
    
    In 48 hours, we'll need to:
    ❌ Release your account slot to our waitlist
    ❌ Cancel your bonus keyword analyses
    ❌ Remove you from early access to new features
    
    I hate to see potential go to waste, especially when you're this close to unlimited keyword research.
    
    If you want to keep your account active:
    [Complete Setup (Final 48 Hours)] {{completion_link}}
    
    If not, I understand. No hard feelings.
    
    But if you change your mind later, you'll join the back of our waitlist.
    
    Your choice,
    Chris
    
    P.S. If there's a specific reason you haven't completed setup, just reply and tell me. I read every email personally.
    `
  }
};

// Segmentation for targeting
const userSegments = {
  hotLeads: {
    criteria: "Signed up within 24 hours",
    priority: "HIGH",
    campaign: "Immediate follow-up with bonus offer",
    expectedConversion: "45-60%"
  },
  
  warmLeads: {
    criteria: "Signed up 2-7 days ago", 
    priority: "MEDIUM",
    campaign: "Social proof + case studies",
    expectedConversion: "25-35%"
  },
  
  coolLeads: {
    criteria: "Signed up 8-30 days ago",
    priority: "MEDIUM", 
    campaign: "Competitive urgency + incentives",
    expectedConversion: "15-25%"
  },
  
  coldLeads: {
    criteria: "Signed up 30+ days ago",
    priority: "LOW",
    campaign: "Final offer + account expiry",
    expectedConversion: "5-15%"
  }
};

// Implementation strategy
const implementationPlan = {
  immediate: [
    "Run abandoned-cart-analysis.sql to identify targets",
    "Export email list with signup dates and methods",
    "Set up automated email sequences in your email platform",
    "Create personalized completion links with tracking"
  ],
  
  tracking: [
    "UTM parameters for email click tracking",
    "Conversion tracking for completed setups",
    "A/B testing different subject lines and incentives",
    "Revenue attribution from recovered users"
  ],
  
  optimization: [
    "Monitor open rates and adjust send times",
    "Test different incentive amounts (500 vs 1000 bonus analyses)",
    "Personalize by signup method (Google vs email vs social)",
    "Create industry-specific templates"
  ]
};
