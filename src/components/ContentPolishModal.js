import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader, Download, Copy, Sparkles, Image, Share2, FileText } from 'lucide-react';
import ContentPolishService from '../services/ContentPolishService';

const ContentPolishModal = ({ content, metadata, onClose }) => {
  const [isPolishing, setIsPolishing] = useState(true);
  const [polishStage, setPolishStage] = useState('Analyzing content structure...');
  const [polishedData, setPolishedData] = useState(null);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const polishService = new ContentPolishService();

  useEffect(() => {
    polishContent();
  }, []);

  const polishContent = async () => {
    try {
      setIsPolishing(true);
      
      // Stage 1
      setPolishStage('Analyzing content structure...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 2
      setPolishStage('Optimizing structure and SEO...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 3
      setPolishStage('Generating optimized images...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stage 4
      setPolishStage('Creating social media posts...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 5
      setPolishStage('Finalizing publication package...');
      
      // Perform actual polish
      const result = await polishService.polishContent(content, metadata);
      
      setPolishedData(result);
      setIsPolishing(false);
    } catch (err) {
      console.error('Polish error:', err);
      setError('Failed to polish content. Please try again.');
      setIsPolishing(false);
    }
  };

  const copyToClipboard = () => {
    if (polishedData) {
      navigator.clipboard.writeText(polishedData.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const downloadHTML = () => {
    if (polishedData) {
      const html = polishService.generateHTMLExport(
        polishedData.content, 
        polishedData.images, 
        polishedData.metadata,
        polishedData.socialPosts
      );
      
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${polishedData.metadata.slug || 'content'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Content Polish Studio</h2>
            </div>
            <button              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {isPolishing ? (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Polishing your content...</p>
              <p className="text-sm text-gray-500">{polishStage}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
                <p>{error}</p>
              </div>
            </div>
          ) : polishedData ? (
            <div className="space-y-6">
              {/* SEO Metadata */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  SEO Metadata
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Title Tag:</p>
                    <p className="text-gray-900">{polishedData.metadata.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Meta Description:</p>                          src={img.url} 
                          alt={img.alt || `Generated image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm text-gray-600">{img.caption || `Image ${index + 1}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media Posts */}
              {polishedData.socialPosts && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-600" />
                    Social Media Posts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(polishedData.socialPosts).map(([platform, post]) => (
                      <div key={platform} className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-gray-900 capitalize mb-2">{platform}</h4>
                        <p className="text-sm text-gray-700 mb-2">{post.text}</p>
                        <p className="text-xs text-gray-500">{post.hashtags.join(' ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements Applied */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Improvements Applied
                </h3>
                <ul className="space-y-2">
                  {polishedData.improvements.map((improvement, index) => (                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Polished Content Preview */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Polished Content Preview</h3>
                <div 
                  className="prose prose-sm max-w-none bg-white p-6 rounded-lg border border-gray-200 max-h-64 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: polishedData.content.substring(0, 1000) + '...' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button
                  onClick={downloadHTML}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download HTML
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContentPolishModal;