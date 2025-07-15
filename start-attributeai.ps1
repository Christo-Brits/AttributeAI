# PowerShell script to start AttributeAI
Write-Host "🚀 Starting AttributeAI Platform..." -ForegroundColor Green

# Navigate to project directory
Set-Location "C:\Users\chris\Projects\AttributeAI"

# Start API server in new window
Write-Host "`n🔧 Starting API proxy server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\chris\Projects\AttributeAI\server'; node api-proxy.js"

# Wait a moment
Start-Sleep -Seconds 3

# Start React frontend in new window
Write-Host "`n🌐 Starting React frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\chris\Projects\AttributeAI'; npm start"

Write-Host "`n✅ AttributeAI Platform is starting up!" -ForegroundColor Green
Write-Host "`n🔗 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 API Proxy: http://localhost:3001" -ForegroundColor Cyan
Write-Host "`n📝 The browser should open automatically" -ForegroundColor Gray

Read-Host "`nPress Enter to close this window"
