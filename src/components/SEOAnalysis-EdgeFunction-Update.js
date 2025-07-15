// Updated runAnalysis function for SEOCompetitorAnalysis.enhanced.js
// This version uses Supabase Edge Functions instead of direct API calls

import EdgeFunctionsService from '../../services/EdgeFunctionsService';

// Replace the existing runAnalysis function with this:
const runAnalysis = async () => {
  if (!url) return;
  
  setIsLoading(true);
  setAnalysisStage('Analyzing website structure...');
  setAiError(null);
  
  try {
    // Use Edge Function for website analysis
    const data = await EdgeFunctionsService.analyzeWebsite(url);
    
    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    // Process the real data from the Edge Function
    const results = {
      seoScore: data.analysis?.seoScore || 0,
      performance: data.analysis?.performance || 0,
      accessibility: data.analysis?.accessibility || 0,
      competitors: data.competitors || [],
      technicalIssues: data.technicalIssues || [],
      metadata: data.metadata || {},
      analysis: data.analysis || {}
    };
    
    setAnalysisResults(results);
    setAnalysisStage('Analysis complete!');
  } catch (error) {
    console.error('Analysis failed:', error);
    setAnalysisStage('');
    alert(`Analysis failed: ${error.message}. Please ensure the website URL is correct and try again.`);
  } finally {
    setIsLoading(false);
    setTimeout(() => setAnalysisStage(''), 2000);
  }
};

// Replace the existing runAIAnalysis function with this:
const runAIAnalysis = async () => {
  if (!analysisResults) {
    setAiError('Please run the basic analysis first');
    return;
  }
  
  setAiLoading(true);
  setAiError(null);
  
  try {
    // Use Edge Function for AI analysis
    const message = `Analyze this SEO data and provide strategic insights, opportunities, and priority actions: ${JSON.stringify(analysisResults)}`;
    const data = await EdgeFunctionsService.callClaude(message, 'SEO Analysis Enhancement');
    
    // Parse the AI response to extract structured insights
    const aiResponse = data.response || '';
    
    // Try to extract structured data from the response
    const insights = {
      strategicInsights: '',
      opportunities: [],
      priorityActions: []
    };
    
    // Simple parsing logic
    const lines = aiResponse.split('\n').filter(line => line.trim());
    let currentSection = 'strategic';
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('opportunit')) {
        currentSection = 'opportunities';
      } else if (line.toLowerCase().includes('action') || line.toLowerCase().includes('priorit')) {
        currentSection = 'actions';
      } else {
        if (currentSection === 'strategic' && line.trim()) {
          insights.strategicInsights += line + ' ';
        } else if (currentSection === 'opportunities' && line.trim() && !line.toLowerCase().includes('opportunit')) {
          insights.opportunities.push(line.replace(/^[-•*]\s*/, '').trim());
        } else if (currentSection === 'actions' && line.trim() && !line.toLowerCase().includes('action')) {
          insights.priorityActions.push(line.replace(/^[-•*]\s*/, '').trim());
        }
      }
    });
    
    // Ensure we have some content
    if (!insights.strategicInsights) {
      insights.strategicInsights = aiResponse || 'Analysis completed successfully.';
    }
    
    setAiInsights(insights);
  } catch (error) {
    console.error('AI analysis failed:', error);
    setAiError(error.message || 'Failed to generate AI insights. Please check your configuration.');
  } finally {
    setAiLoading(false);
  }
};