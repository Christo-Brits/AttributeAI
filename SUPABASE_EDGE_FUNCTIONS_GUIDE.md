# 🔐 Using Supabase Edge Functions for Secure API Keys

## Why Use Edge Functions?

Instead of exposing API keys in your codebase or running a separate backend server, Supabase Edge Functions provide:
- ✅ **Secure API key storage** - Keys never exposed in frontend
- ✅ **No backend server needed** - Edge Functions handle all API calls
- ✅ **Automatic scaling** - Handles any load automatically
- ✅ **Built-in CORS** - No more CORS issues
- ✅ **Free tier** - 500K invocations/month included

## Quick Setup Guide

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free)
3. Save your project URL and anon key

### 2. Set Up Environment Variables
Create `.env.local` in your project root:
```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Install Supabase CLI
```bash
npm install -g supabase
```

### 4. Link Your Project
```bash
supabase link --project-ref your-project-ref
```

### 5. Set Secret Keys in Supabase
```bash
# Set your API keys as secrets
supabase secrets set ANTHROPIC_API_KEY=your_claude_key
supabase secrets set OPENAI_API_KEY=your_openai_key
supabase secrets set GOOGLE_GEMINI_API_KEY=your_gemini_key
```

### 6. Deploy Edge Functions
```bash
# Deploy all functions
supabase functions deploy claude-chat
supabase functions deploy analyze-website
supabase functions deploy generate-content
supabase functions deploy keyword-intelligence
```

### 7. Update Your Components
Replace API calls with Edge Function calls:

**Before (Direct API):**
```javascript
const response = await fetch('http://localhost:3001/api/claude-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message })
});
```

**After (Edge Function):**
```javascript
import EdgeFunctionsService from '../services/EdgeFunctionsService';

const data = await EdgeFunctionsService.callClaude(message);
```

## Benefits for AttributeAI

1. **No More API Key Exposure** - Keys stored securely in Supabase
2. **Simplified Deployment** - No need to manage backend servers
3. **Better Performance** - Edge Functions run close to users
4. **Cost Effective** - Free tier covers most startup needs
5. **Easy Key Rotation** - Update keys without code changes

## Testing Locally

During development, you can test Edge Functions locally:

```bash
# Serve functions locally
supabase functions serve

# Your functions will be available at:
# http://localhost:54321/functions/v1/function-name
```

## Migration Steps

1. **Set up Supabase project** ✅
2. **Copy Edge Functions to supabase/functions/** ✅
3. **Deploy Edge Functions** 
4. **Update frontend to use EdgeFunctionsService**
5. **Test all features**
6. **Remove API keys from codebase**
7. **Push to GitHub safely**

## Cost Comparison

### Current Setup (Backend Server):
- Server hosting: $5-20/month
- API key management: Manual
- Scaling: Manual
- CORS issues: Yes

### Supabase Edge Functions:
- Hosting: Free (500K calls/month)
- API key management: Automatic
- Scaling: Automatic
- CORS issues: None

## Next Steps

1. Create your Supabase project
2. Deploy the Edge Functions
3. Update your `.env.local` file
4. Test the integration
5. Remove all API keys from codebase
6. Push to GitHub without security warnings!

---

This approach makes AttributeAI more secure, scalable, and easier to deploy while keeping your API keys completely safe.