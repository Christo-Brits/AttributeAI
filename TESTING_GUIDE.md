# 🧪 AttributeAI Testing Guide

## 🚀 Quick Start Testing

### **1. Start the API Server**
```bash
cd server
npm start
```
This will start the API server on `http://localhost:3001`

### **2. Start the React App**
```bash
cd ..
npm start
```
This will start the frontend on `http://localhost:3000`

## 🔧 Testing AI Chat Interface

### **What to Test:**
1. **Click the purple chat button** in the bottom right corner
2. **Try these test messages:**
   - "Analyze my website performance"
   - "How can I improve my SEO?"
   - "What are my biggest opportunities?"
   - "Help me create a content strategy"

### **Expected Behavior:**
- ✅ **Real AI responses** from Claude API (not static text)
- ✅ **Contextual suggestions** based on your message
- ✅ **Typing indicators** while AI is thinking
- ✅ **Personalized responses** based on your profile data

### **Troubleshooting:**
- **Chat not working?** Check that the server is running on port 3001
- **Generic responses?** API key might not be configured properly
- **No response?** Check browser console for errors

## 📝 Testing Content Generation

### **What to Test:**
1. **Go to "AI Content Strategist"** tab
2. **Fill in the form:**
   - **Target Website:** `https://infinitebuildsolutions.co.nz`
   - **Keywords:** `property maintenance Auckland`
   - **Location:** `Chicago, IL` (optional)
   - **User Stories:** Add some testimonials (optional)

3. **Enable Enhanced Features:**
   - ✅ **Deep Research with Real Citations**
   - ✅ **Custom AI-Generated Images**

4. **Click "Generate SEO Content"**

### **Expected Behavior:**
- ✅ **Progress stages** showing real research steps
- ✅ **2000+ word content** generated using real AI
- ✅ **Download buttons** appear after generation
- ✅ **Multiple export formats:** HTML, Markdown, Text, JSON
- ✅ **Professional content** with citations and images
- ✅ **SEO optimization** with proper keywords

### **Download Testing:**
After content generation, test all export formats:
- **HTML:** Full webpage with styling
- **Markdown:** Blog-ready format
- **Text:** Plain text version  
- **JSON:** Structured data format

### **Troubleshooting:**
- **Generation stuck?** Check that Enhanced Content Service is calling the right API
- **No download buttons?** Content generation might have failed
- **Empty content?** API might not be responding properly

## 🔍 API Server Health Check

### **Test API Endpoints:**
1. **Health Check:** `http://localhost:3001/health`
   - Should show API key status
   
2. **Chat Test:** Use browser console:
```javascript
fetch('http://localhost:3001/api/claude-chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    message: 'Hello',
    context: {userProfile: {}, websiteAnalysis: {}}
  })
}).then(r => r.json()).then(console.log)
```

## 💡 Pro Testing Tips

### **Test Realistic Scenarios:**
1. **Property Maintenance Business:**
   - Website: `https://infinitebuildsolutions.co.nz`
   - Keywords: `property maintenance Auckland`
   
2. **Tech Startup:**
   - Website: `https://stripe.com`
   - Keywords: `payment processing solutions`
   
3. **Local Restaurant:**
   - Website: `https://example-restaurant.com`
   - Keywords: `best pizza Chicago`

### **Chat Testing Scenarios:**
- **Performance Analysis:** "Review my current marketing performance"
- **Goal Setting:** "Help me set realistic traffic goals for next quarter"
- **Competitor Research:** "Who are my main competitors and what are they doing better?"
- **Conversion Optimization:** "How can I improve my landing page conversion rates?"

## 🚨 Known Issues & Workarounds

### **If Chat Interface Not Working:**
1. Check browser console for CORS errors
2. Ensure server is running on correct port (3001)
3. Verify API keys in `server/.env`

### **If Content Generation Not Working:**
1. Check that Claude API key is valid
2. Try with simpler websites first
3. Check Enhanced Content Service console logs

### **If Downloads Not Working:**
1. Check browser download permissions
2. Try different export formats
1. Clear browser cache

## 📊 Success Metrics

### **AI Chat Interface:**
- ✅ Responds within 3-5 seconds
- ✅ Provides relevant, personalized advice
- ✅ Generates contextual follow-up suggestions
- ✅ Maintains conversation context

### **Content Generation:**
- ✅ Completes in 15-30 seconds
- ✅ Generates 2000+ words of quality content
- ✅ Includes proper SEO optimization
- ✅ All export formats download successfully
- ✅ Content is publication-ready

## 🔗 Next Steps After Testing

1. **If everything works:** Ready for production deployment!
2. **If issues found:** Check console logs and API configurations
3. **For optimization:** Monitor API usage and response times
4. **For scaling:** Consider implementing caching for common queries

---

**🎯 Target: Both features should work seamlessly with real AI integration!**