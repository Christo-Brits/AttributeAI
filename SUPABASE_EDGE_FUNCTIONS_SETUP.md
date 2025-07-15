# 🔐 Supabase Edge Functions Setup for AttributeAI

## Overview
Move all API keys to Supabase Edge Functions to keep them secure and out of your codebase.

## Step 1: Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

## Step 2: Login to Supabase
```bash
supabase login
```

## Step 3: Initialize Supabase in your project
```bash
cd C:\Users\chris\Projects\AttributeAI
supabase init
```

## Step 4: Create Edge Functions

### Claude Chat Function
```bash
supabase functions new claude-chat
```

### Website Analysis Function  
```bash
supabase functions new analyze-website
```

### Content Generation Function
```bash
supabase functions new generate-content
```

### Keyword Intelligence Function
```bash
supabase functions new keyword-intelligence
```

## Step 5: Set Environment Variables in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Settings → Edge Functions
3. Add these secrets:

```
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 6: Update your frontend to use Supabase Edge Functions

Instead of calling `http://localhost:3001/api/...`, you'll call:
```javascript
const { data, error } = await supabase.functions.invoke('claude-chat', {
  body: { message: userMessage }
})
```

## Step 7: Deploy the Edge Functions
```bash
supabase functions deploy claude-chat
supabase functions deploy analyze-website
supabase functions deploy generate-content
supabase functions deploy keyword-intelligence
```

## Benefits:
- ✅ No API keys in your codebase
- ✅ Automatic CORS handling
- ✅ Built-in authentication with Supabase
- ✅ Scales automatically
- ✅ No need to run a separate backend server
- ✅ Free tier includes 500K invocations/month