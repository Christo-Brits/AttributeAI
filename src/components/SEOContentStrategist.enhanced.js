={24} className="mx-auto mb-2" />
                      <p>Complete signup to analyze content gaps</p>
                    </div>
                  )}
                </div>
              )}
              
              {userProfile && (
                <button
                  onClick={() => analyzeContentGaps(userProfile)}
                  disabled={isAnalyzing}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
                </button>
              )}
            </div>
          </div>

          {/* Content Generation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <PenTool className="mr-2 text-purple-600" size={20} />
                Content Generator
              </h2>

              <div className="space-y-4 mb-6">
                
                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Topic
                  </label>
                  {selectedTopic ? (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="font-medium text-blue-900">{selectedTopic}</span>
                      <button
                        onClick={() => setSelectedTopic('')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter your content topic or keyword..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                {/* Content Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="blog-post">Blog Post</option>
                      <option value="landing-page">Landing Page</option>
                      <option value="guide">How-to Guide</option>
                      <option value="case-study">Case Study</option>
                      <option value="faq">FAQ Page</option>
                      <option value="product-page">Product Page</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Small business owners"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateContent}
                  disabled={isGenerating || (!selectedTopic && !customTopic.trim())}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Generate AI Content</span>
                    </>
                  )}
                </button>

                {/* Generation Progress */}
                {isGenerating && generationStage && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm font-medium">{generationStage}</p>
                  </div>
                )}
              </div>

              {/* Content Results */}
              {contentResults && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <CheckCircle className="mr-2 text-green-600" size={20} />
                      Generated Content
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowVideoModal(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                      >
                        <Video size={16} />
                        <span>Generate Video Scripts</span>
                      </button>
                      
                      <button
                        onClick={() => setShowPolishModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <Sparkles size={16} />
                        <span>Polish for Publication</span>
                      </button>
                      
                      <div className="relative" ref={exportMenuRef}>
                        <button
                          onClick={() => setShowExportMenu(!showExportMenu)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                        >
                          <ExternalLink size={16} />
                          <span>Export</span>
                        </button>
                        
                        {showExportMenu && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => exportContent('html')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Export as HTML
                              </button>
                              <button
                                onClick={() => exportContent('markdown')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Export as Markdown
                              </button>
                              <button
                                onClick={() => exportContent('txt')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Export as Text
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {exportSuccess && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm">{exportSuccess}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {contentResults.content}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                    <span>Generated: {new Date(contentResults.timestamp).toLocaleString()}</span>
                    <span>Type: {contentResults.type} • Target: {contentResults.targetAudience}</span>
                  </div>
                </div>
              )}

              {/* Help Text */}
              {!userProfile && (
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start">
                    <Users className="text-yellow-600 mr-2 mt-1" size={16} />
                    <div>
                      <p className="text-yellow-800 text-sm font-medium">
                        Complete your signup for personalized content suggestions
                      </p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Provide your website and business details to get AI-powered content gap analysis and targeted content recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Polish Modal */}
      {showPolishModal && contentResults && (
        <ContentPolishModal
          content={contentResults.content}
          metadata={{
            keywords: contentResults.metadata?.focusKeyword || selectedTopic || customTopic,
            title: contentResults.metadata?.title,
            description: contentResults.metadata?.description,
            website: userProfile?.website
          }}
          onClose={() => setShowPolishModal(false)}
        />
      )}
      
      {/* Video Generation Modal */}
      {showVideoModal && contentResults && (
        <VideoGenerationModal
          content={contentResults.content}
          metadata={{
            keywords: contentResults.metadata?.focusKeyword || selectedTopic || customTopic,
            title: contentResults.metadata?.title,
            description: contentResults.metadata?.description,
            website: userProfile?.website
          }}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </div>
  );
};

export default SEOContentStrategist;