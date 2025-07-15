# 🔑 How to Create n8n API Key - Step by Step Guide

## 🎯 **Quick Access Links**
- **n8n Interface:** http://localhost:5678
- **API Playground:** http://localhost:5678/api/v1/docs
- **Your n8n Environment:** Self-hosted (API features available!)

---

## 📋 **Step-by-Step API Key Creation**

### **Method 1: Through n8n Web Interface (Recommended)**

#### **Step 1: Access n8n**
1. **Open your browser** → Go to http://localhost:5678
2. **Log in** if you haven't already (or create account if first time)

#### **Step 2: Navigate to Settings**
1. **Click your profile icon** → Top right corner of n8n interface
2. **Select "Settings"** from the dropdown menu
3. **Look for "Personal" or "API"** section in the left sidebar

#### **Step 3: Generate API Key**
1. **Find "API Keys" section** → Should be under Personal settings
2. **Click "Create API Key"** or "Generate New Key"
3. **Give it a name** → e.g., "Weather Intelligence Integration"
4. **Copy the key immediately** → You won't see it again!

---

### **Method 2: Through API Playground (Alternative)**

#### **Step 1: Access API Playground**
1. **Open:** http://localhost:5678/api/v1/docs
2. **You should see Swagger UI** → Interactive API documentation

#### **Step 2: Create User/Login First**
If you haven't set up a user account yet:
1. **Go back to main interface** → http://localhost:5678
2. **Complete setup wizard** → Create your admin account
3. **Return to API playground** → http://localhost:5678/api/v1/docs

#### **Step 3: Use API Playground**
1. **Look for authentication endpoints** → Usually `/auth` or similar
2. **Try login endpoint** → To get session token
3. **Use session for API key creation** → Through user management endpoints

---

## 🛠️ **Troubleshooting Common Issues**

### **If you can't find API Key section:**
Your n8n might need to be updated or configured differently. Try:

#### **Option A: Check n8n Version**
```bash
docker exec n8n-mcp n8n --version
```

#### **Option B: Enable API Features**
```bash
# Stop current container
docker stop n8n-mcp

# Start with API explicitly enabled
docker run -d --name n8n-mcp-api \
  -p 5678:5678 \
  -e N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true \
  -e N8N_API_ENABLED=true \
  -e N8N_DISABLE_UI=false \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n:latest
```

### **If API playground shows 404:**
The path structure might be different. Try:
- http://localhost:5678/docs
- http://localhost:5678/swagger
- http://localhost:5678/api/docs

---

## 🔍 **What to Look For**

### **In n8n Web Interface:**
Look for these menu items:
- **"Settings"** → Usually gear icon or profile dropdown
- **"Personal"** or **"Account"** → User-specific settings
- **"API Keys"** or **"Tokens"** → Authentication management
- **"Integrations"** → Sometimes API keys are here

### **Common API Key Names:**
- Personal Access Token
- API Key
- Authentication Token
- Integration Key

---

## 📊 **Once You Have the API Key**

### **Test the Connection:**
```bash
# Replace YOUR_API_KEY with the actual key
curl -H "X-N8N-API-KEY: YOUR_API_KEY" http://localhost:5678/api/v1/workflows
```

### **Expected Response:**
```json
{
  "data": [],
  "nextCursor": null
}
```

### **What I Can Do With It:**
- ✅ **List all your workflows**
- ✅ **Show workflow details and execution history**
- ✅ **Create new workflows programmatically**
- ✅ **Import the 4 weather intelligence workflows**
- ✅ **Monitor and optimize workflow performance**

---

## 🚀 **Alternative: Let's Check What You Currently Have**

### **Manual Check (No API Key Needed):**
1. **Go to:** http://localhost:5678
2. **Click "Workflows"** in the left sidebar
3. **Tell me what you see:**
   - How many workflows are listed?
   - What are their names?
   - Are any currently active/running?

### **This Tells Me:**
- Whether you have existing automation
- How to best integrate weather intelligence
- What workflows we should create or optimize

---

## 🎯 **Quick Decision Guide**

### **If n8n is completely new to you:**
1. **Go to:** http://localhost:5678
2. **Complete the setup wizard** (create admin account)
3. **Look for API keys in settings**
4. **Start with importing weather workflows**

### **If you're familiar with n8n:**
1. **Find API keys** in your personal settings
2. **Generate new key** for this integration
3. **Share it with me** → I'll show you everything immediately

### **If you can't find API key options:**
1. **Tell me what version** you're running
2. **Check what menu options** you see in settings
3. **We can try alternative methods**

---

## 💡 **Pro Tip**

The API key gives us the most powerful integration - I can:
- **Automatically import** all 4 weather workflows
- **Set up monitoring** and optimization
- **Create custom workflows** based on your needs
- **Show real-time analytics** of your automation

**But even without it, we can still get your weather intelligence system running by manually importing the workflow JSON files!**

---

## 🎉 **Next Steps**

1. **Try accessing:** http://localhost:5678
2. **Look for settings/API options**
3. **Report back** what you see
4. **We'll get your weather intelligence** running either way!

**Ready to unlock the full power of AI-controlled n8n automation! 🤖⚡**