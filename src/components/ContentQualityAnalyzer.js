import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  BarChart3,
  Award,
  Book,
  Search,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const ContentQualityAnalyzer = ({ content, targetKeywords = [], onQualityUpdate }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [improvements, setImprovements] = useState([]);
  const [showAllImprovements, setShowAllImprovements] = useState(false);

  useEffect(() => {
    if (content) {
      analyzeContent();
    }
  }, [content, targetKeywords]);

  const analyzeContent = async () => {
    setLoading(true);
    try {
      const qualityAnalysis = await performContentAnalysis(content, targetKeywords);
      setAnalysis(qualityAnalysis);
      setOverallScore(qualityAnalysis.overallScore);
      setImprovements(qualityAnalysis.improvements);
      
      if (onQualityUpdate) {
        onQualityUpdate(qualityAnalysis);
      }
    } catch (error) {
      console.error('Content analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const performContentAnalysis = async (content, keywords) => {
    // Simulate comprehensive analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const text = stripHTML(content);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Readability Analysis
    const avgSentenceLength = words.length / sentences.length;
    const syllables = countSyllables(text);
    const avgSyllablesPerWord = syllables / words.length;
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    const readabilityScore = Math.max(0, Math.min(100, Math.round(fleschScore)));

    // SEO Analysis
    const headings = extractHeadings(content);
    let seoScore = 50;
    if (words.length >= 300) seoScore += 15;
    if (words.length >= 500) seoScore += 10;
    if (headings.h1 === 1) seoScore += 10;
    if (headings.h2 >= 2) seoScore += 15;

    // Engagement Analysis
    const questions = (text.match(/\?/g) || []).length;
    const powerWords = countPowerWords(text);
    const hasCallToAction = detectCallToAction(text);
    let engagementScore = 60;
    if (questions >= 3) engagementScore += 15;
    if (powerWords >= 5) engagementScore += 15;
    if (hasCallToAction) engagementScore += 10;

    // Structure Analysis
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const lists = (content.match(/<ul|<ol|<li/g) || []).length;
    let structureScore = 50;
    if (headings.h1 === 1) structureScore += 15;
    if (headings.h2 >= 2) structureScore += 15;
    if (lists >= 2) structureScore += 10;
    if (paragraphs.length >= 3) structureScore += 10;

    // Quality Analysis
    const grammarIssues = detectGrammarIssues(text);
    let qualityScore = 80;
    qualityScore -= grammarIssues * 5;
    if (text.includes('according to') || text.includes('research shows')) qualityScore += 10;

    // Uniqueness Analysis
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
    const uniqueRatio = uniqueWords / words.length;
    const uniquenessScore = Math.round(uniqueRatio * 100);

    // Technical SEO
    const images = (content.match(/<img/g) || []).length;
    const alts = (content.match(/alt="/g) || []).length;
    const internalLinks = (content.match(/<a href="[^"]*"[^>]*>/g) || []).length;
    let technicalScore = 80;
    if (images > 0 && alts / images >= 0.8) technicalScore += 10;
    if (internalLinks >= 3) technicalScore += 10;

    const analysis = {
      readability: {
        score: readabilityScore,
        grade: getReadabilityGrade(fleschScore),
        metrics: {
          sentences: sentences.length,
          words: words.length,
          avgSentenceLength: Math.round(avgSentenceLength),
          fleschScore: Math.round(fleschScore)
        }
      },
      seo: {
        score: Math.min(100, seoScore),
        wordCount: words.length,
        headingStructure: headings,
        issues: words.length < 300 ? ['Content too short'] : []
      },
      engagement: {
        score: Math.min(100, engagementScore),
        metrics: {
          questions,
          powerWords,
          hasCallToAction
        }
      },
      structure: {
        score: Math.min(100, structureScore),
        metrics: {
          headings,
          paragraphs: paragraphs.length,
          lists
        }
      },
      quality: {
        score: Math.max(0, Math.min(100, qualityScore)),
        metrics: {
          grammarIssues,
          factualIndicators: text.includes('research') ? 1 : 0
        }
      },
      uniqueness: {
        score: Math.min(100, uniquenessScore),
        uniqueWords,
        totalWords: words.length,
        uniqueRatio: uniqueRatio.toFixed(2)
      },
      technical: {
        score: Math.min(100, technicalScore),
        metrics: {
          images,
          altsRatio: images > 0 ? (alts / images).toFixed(2) : 'N/A',
          internalLinks
        }
      }
    };

    const scores = [
      analysis.readability.score,
      analysis.seo.score, 
      analysis.engagement.score,
      analysis.structure.score,
      analysis.quality.score,
      analysis.uniqueness.score,
      analysis.technical.score
    ];
    
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Generate improvements
    const improvements = [];
    if (readabilityScore < 70) improvements.push('Simplify language and shorten sentences');
    if (seoScore < 80) improvements.push('Optimize keyword usage and heading structure');
    if (engagementScore < 75) improvements.push('Add more questions and engaging elements');
    if (structureScore < 80) improvements.push('Improve content organization with better headings');
    if (qualityScore < 85) improvements.push('Review grammar and add more authoritative sources');
    if (uniquenessScore < 70) improvements.push('Increase vocabulary diversity');
    if (technicalScore < 85) improvements.push('Add alt text to images and more internal links');

    return {
      ...analysis,
      overallScore,
      improvements,
      grade: getGrade(overallScore),
      timestamp: new Date().toISOString()
    };
  };

  // Helper functions
  const stripHTML = (html) => {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
  };

  const extractHeadings = (content) => {
    return {
      h1: (content.match(/<h1/g) || []).length,
      h2: (content.match(/<h2/g) || []).length,
      h3: (content.match(/<h3/g) || []).length
    };
  };

  const countSyllables = (text) => {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiouy]+/g, 'a')
      .replace(/[^a]/g, '')
      .length || 1;
  };

  const countPowerWords = (text) => {
    const powerWords = [
      'amazing', 'awesome', 'incredible', 'outstanding', 'essential',
      'crucial', 'proven', 'guaranteed', 'effective', 'powerful'
    ];
    
    const textLower = text.toLowerCase();
    return powerWords.filter(word => textLower.includes(word)).length;
  };

  const detectCallToAction = (text) => {
    const ctaPatterns = [
      /click here/i, /learn more/i, /get started/i, /sign up/i,
      /contact us/i, /download/i, /subscribe/i, /book now/i
    ];
    
    return ctaPatterns.some(pattern => pattern.test(text));
  };

  const detectGrammarIssues = (text) => {
    const issues = [
      /\b(it's|its)\b/g,
      /\b(there|their|they're)\b/g,
      /\b(your|you're)\b/g
    ];
    
    return issues.reduce((count, pattern) => {
      return count + (text.match(pattern) || []).length;
    }, 0);
  };

  const getReadabilityGrade = (score) => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    return 'Difficult';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    return 'D';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-600">Analyzing content quality...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No content to analyze</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Overall Score */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Quality Analysis</h3>
            <p className="text-gray-600">Comprehensive analysis of content quality, SEO, and engagement</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)} mb-1`}>
              {overallScore}
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
            <div className={`text-lg font-semibold ${getScoreColor(overallScore)}`}>
              Grade: {analysis.grade}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readability */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Book className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Readability</h4>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.readability.score)}`}>
                {analysis.readability.score}
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Grade: {analysis.readability.grade}
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Sentences: {analysis.readability.metrics.sentences}</div>
              <div>Words: {analysis.readability.metrics.words}</div>
              <div>Avg Sentence Length: {analysis.readability.metrics.avgSentenceLength}</div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Search className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-900">SEO Optimization</h4>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.seo.score)}`}>
                {analysis.seo.score}
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Word Count: {analysis.seo.wordCount}</div>
              <div>H1: {analysis.seo.headingStructure.h1}, H2: {analysis.seo.headingStructure.h2}</div>
              <div>H3: {analysis.seo.headingStructure.h3}</div>
            </div>
          </div>

          {/* Engagement */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Engagement</h4>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.engagement.score)}`}>
                {analysis.engagement.score}
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Questions: {analysis.engagement.metrics.questions}</div>
              <div>Power Words: {analysis.engagement.metrics.powerWords}</div>
              <div>CTA: {analysis.engagement.metrics.hasCallToAction ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Structure */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-orange-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Structure</h4>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.structure.score)}`}>
                {analysis.structure.score}
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Paragraphs: {analysis.structure.metrics.paragraphs}</div>
              <div>Lists: {analysis.structure.metrics.lists}</div>
            </div>
          </div>

          {/* Quality */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Quality</h4>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.quality.score)}`}>
                {analysis.quality.score}
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Grammar Issues: {analysis.quality.metrics.grammarIssues}</div>
              <div>Factual Indicators: {analysis.quality.metrics.factualIndicators}</div>
            </div>
          </div>

          {/* Uniqueness */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-pink-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Uniqueness</h4>
              </div>
              <div className={`text-xl font-bold ${getScoreColor(analysis.uniqueness.score)}`}>
                {analysis.uniqueness.score}
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Unique Words: {analysis.uniqueness.uniqueWords}</div>
              <div>Total Words: {analysis.uniqueness.totalWords}</div>
              <div>Unique Ratio: {analysis.uniqueness.uniqueRatio}</div>
            </div>
          </div>
        </div>

        {/* Improvement Recommendations */}
        {improvements.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              Improvement Recommendations
            </h4>
            <div className="space-y-2">
              {improvements.slice(0, showAllImprovements ? improvements.length : 5).map((improvement, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{improvement}</p>
                </div>
              ))}
            </div>
            {improvements.length > 5 && (
              <button 
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setShowAllImprovements(!showAllImprovements)}
              >
                {showAllImprovements ? 'Show Less' : `Show ${improvements.length - 5} More`}
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={analyzeContent}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-analyze
          </button>
          
          <button
            onClick={() => console.log('Export report', analysis)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentQualityAnalyzer;