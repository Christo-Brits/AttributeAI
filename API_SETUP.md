# 🚀 AttributeAI API Integration Setup

## Quick Start (3 Steps)

### 1. Add Your API Keys
Edit `server/.env` and add your real API keys:

```env
CLAUDE_API_KEY=sk-ant-api03-your-actual-claude-key-here
OPENAI_API_KEY=sk-your-actual-openai-key-here
GOOGLE_AI_API_KEY=your-google-ai-key-here
```

### 2. Run the Platform
Double-click `start.bat` or run:

```bash
# Option A: Use the startup script
start.bat

# Option B: Manual startup
cd server
npm install
npm start

# In another terminal:
cd ..
npm start
```

### 3. Test the Integration
- Open http://localhost:3000
- Navigate to "API Test" 
- Click "Test Claude API Connection"
- Test website analysis with a real URL

## What This Fixes

✅ **CORS Issues Resolved**: Backend proxy handles all API calls
✅ **Secure API Keys**: Keys stored server-side, never exposed to browser  
✅ **Real Website Analysis**: Test Claude integration with actual websites
✅ **Professional Architecture**: Production-ready API structure

## File Structure Created

```
AttributeAI/
├── server/                  # New API proxy server
│   ├── api-proxy.js        # Express server handling CORS + API calls
│   ├── package.json        # Server dependencies
│   └── .env               # API keys (configure this!)
├── src/utils/
│   └── apiService.js      # Updated to use proxy server
├── src/components/
│   └── APIIntegrationTest.js  # Updated test component
└── start.bat              # Easy startup script
```

## Testing Real Websites

Once your API keys are configured, you can:

1. **Test any website URL** - Input real URLs like your competitors
2. **Get AI-powered analysis** - Claude will analyze SEO, content, UX
3. **See structured insights** - Professional recommendations and action items
4. **Verify integration** - Confirm all systems working before demos

## API Endpoints Available

- `GET /health` - Check server status and API key configuration
- `POST /api/claude` - Claude API proxy (handles CORS + security)
- `POST /api/openai` - OpenAI API proxy (future use)

## Next Steps

After testing the API integration:

1. **Demo Mode**: Show real website analysis to clients
2. **Data Integration**: Connect insights to your unified dashboard  
3. **Export Features**: Add PDF reports and data downloads
4. **Advanced Analytics**: Build cross-tool intelligence

## Troubleshooting

**"Connection failed"**: Check API keys in `server/.env`
**"CORS error"**: Make sure proxy server is running on port 3001
**"Module not found"**: Run `npm install` in the server directory

---

Your AttributeAI platform now has **real AI integration**! 🎉

Test it with actual websites and see the professional analysis that will wow your clients.