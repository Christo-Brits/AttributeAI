@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"
echo Current directory: %CD%
git add src/styles/globals.css
git add src/components/KeywordIntelligenceEngine.js
git add src/components/EnhancedContentGenerator.js
git add src/components/SEOContentStrategist.enhanced.js
git add src/components/ContentClusterStrategist.js
git add src/components/email/OneToOneEmail.js
git add src/utils/AttributeAIAnalytics.js
git status
git commit -m "🎨 Improved contrast and accessibility across all components

- Enhanced color contrast for dark mode compliance (WCAG AA/AAA)
- Updated text colors from gray-900/gray-600 to white/gray-400
- Fixed form inputs with proper dark backgrounds and placeholders
- Improved keyword/content example cards visibility
- Enhanced Quick Start Examples section contrast
- Updated all metric cards and analytics displays
- Fixed React Hook compliance in OneToOneEmail component
- Improved gtag accessibility with proper window checks
- Added comprehensive accessibility utility classes
- Updated button and interactive element styling

All components now meet professional accessibility standards."
git push origin main
echo Commit and push completed!
pause
