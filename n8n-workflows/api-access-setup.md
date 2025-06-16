# 🔍 n8n API Access Setup for MCP Integration

## Current Status
I can see that your n8n instance is running, but I need API access to view and manage your workflows programmatically. Here's how to enable this:

## 🔧 Quick Setup Steps

### Step 1: Enable n8n API Access
1. **Open n8n** → http://localhost:5678
2. **Go to Settings** → Click your profile icon (top right)
3. **Select "Personal"** → Look for "API Keys" section
4. **Generate API Key** → Click "Create API Key"
5. **Copy the key** → Save it securely

### Step 2: Configure API Access
Once you have the API key, I can use it to:
- ✅ **View all your workflows**
- ✅ **Create new workflows programmatically**
- ✅ **Modify existing workflows**
- ✅ **Execute workflows remotely**
- ✅ **Monitor workflow status**

### Step 3: Test API Connection
After you get the API key, I can run:
```bash
curl -H "X-N8N-API-KEY: your-api-key" http://localhost:5678/api/v1/workflows
```

## 🎯 Alternative: Direct Database Access

### Current Database Status:
- **Database:** SQLite located at `/home/node/.n8n/database.sqlite`
- **Workflows Table:** `workflow_entity`
- **Status:** Contains your workflow data

### To Check Workflows Without API:
```bash
# Enter the container
docker exec -it n8n-mcp /bin/sh

# Install sqlite3 if needed
apk add sqlite

# Query workflows
sqlite3 /home/node/.n8n/database.sqlite "SELECT id, name, active FROM workflow_entity;"
```

## 🚀 What I Can Do Once Connected

### Immediate Capabilities:
- **List all workflows** → See what you currently have
- **Analyze workflow structure** → Understand your automation setup
- **Suggest optimizations** → Improve performance and reliability
- **Create new workflows** → Build weather intelligence automation
- **Import the 4 weather workflows** → Automatically add them to your n8n

### Advanced Features:
- **Workflow monitoring** → Real-time execution status
- **Error debugging** → Identify and fix workflow issues
- **Performance optimization** → Improve execution speed
- **Integration management** → Connect new services automatically

## 📊 Current Setup Analysis

### What I Know:
- ✅ **n8n is running** on port 5678
- ✅ **MCP integration installed** and configured
- ✅ **Community nodes enabled** for advanced functionality
- ✅ **Database active** with workflow storage
- ✅ **Weather workflows ready** for import

### What I Need:
- 🔑 **API Key** → To access workflows programmatically
- 📋 **Workflow list** → To see what you currently have
- ⚙️ **Configuration access** → To optimize settings

## 🎯 Next Actions

### Option A: Get API Key (Recommended - 2 minutes)
1. **Go to n8n** → http://localhost:5678
2. **Generate API key** → In personal settings
3. **Share with me** → I can then show you all workflows
4. **Full automation** → I can manage everything programmatically

### Option B: Manual Check (1 minute)
1. **Open n8n interface** → http://localhost:5678
2. **Go to Workflows** → See what's currently there
3. **Tell me what you see** → I can guide you from there
4. **Import workflows** → Add the 4 weather intelligence workflows

## 💡 What You'll See

### If n8n is Empty:
- **No workflows yet** → Perfect time to import the weather intelligence system
- **Clean slate** → We can build everything from scratch optimally

### If You Have Existing Workflows:
- **Current automation** → I can analyze and optimize
- **Integration opportunities** → Connect with weather intelligence
- **Workflow consolidation** → Combine related automations

## 🌟 Expected Result

Once I have API access, you'll see something like:
```
📊 Your n8n Workflows:
1. ✅ Weather Intelligence Main (Active)
2. ✅ Daily Insights Analysis (Scheduled: 9 AM)
3. ✅ Customer Segmentation (Every 6 hours)
4. ✅ Campaign Optimization (Every 2 hours)
5. 🔄 [Any existing workflows you have]

📈 Total Executions: [number]
⚡ Performance Score: [percentage]
🎯 Optimization Opportunities: [suggestions]
```

## 🎉 Ready to Connect!

**Choose your preferred method:**
- **Fast Track:** Get API key and I'll show you everything instantly
- **Manual:** Tell me what you see in the n8n interface

Either way, we'll have your weather intelligence automation running perfectly! 🌤️⚡
