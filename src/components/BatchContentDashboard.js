          {researchData ? (
            <div className="text-right">
              <p className="text-sm text-gray-500">Research Topic</p>
              <p className="font-medium">{researchData.topic}</p>
              <p className="text-sm text-gray-500">
                {researchData.clusterRecommendations ? 'Enhanced with research' : 'Basic research available'}
              </p>
            </div>
          ) : (
            <div className="text-right text-gray-500">
              <p className="text-sm">No research data available</p>
              <p className="text-xs">Complete advanced research first</p>
            </div>
          )}
        </div>
      </div>

      {/* Research Enhancement Notice */}
      {!researchData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-2 mt-0.5" size={16} />
            <div>
              <p className="text-yellow-800 text-sm font-medium">
                Research Data Required
              </p>
              <p className="text-yellow-700 text-xs mt-1">
                Complete advanced research first to generate high-quality content clusters with market insights and competitive analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Start Content Generation */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Play className="mr-2 text-green-600" size={20} />
            Start New Content Cluster
          </h2>
          {researchData && researchData.clusterRecommendations && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">
              Research Enhanced
            </div>
          )}
        </div>

        {researchData ? (
          <>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Research Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div>
                  <span className="font-medium">Topic:</span> {researchData.topic}
                </div>
                <div>
                  <span className="font-medium">Research Phases:</span> {Object.keys(researchData.results || {}).length}
                </div>
                <div>
                  <span className="font-medium">Generated:</span> {new Date(researchData.timestamp).toLocaleDateString()}
                </div>
              </div>
              {researchData.clusterRecommendations && (
                <div className="mt-2 text-sm text-blue-700">
                  <span className="font-medium">Content Strategy:</span> {' '}
                  {researchData.clusterRecommendations.pillar_content?.length || 0} pillar + {' '}
                  {researchData.clusterRecommendations.supporting_content?.length || 0} supporting + {' '}
                  {researchData.clusterRecommendations.rapid_content?.length || 0} rapid content pieces
                </div>
              )}
            </div>

            <button
              onClick={startContentCluster}
              disabled={isStarting || activeJobs.length >= 3}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isStarting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Starting Content Generation...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Generate Content Cluster</span>
                </>
              )}
            </button>

            {activeJobs.length >= 3 && (
              <p className="mt-2 text-sm text-orange-600 text-center">
                Maximum concurrent jobs reached. Please wait for current jobs to complete.
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 size={32} className="mx-auto mb-2 text-gray-300" />
            <p>Complete advanced research to start content cluster generation</p>
            <p className="text-sm mt-1">Research provides the foundation for high-quality, strategic content</p>
          </div>
        )}
      </div>

      {/* Cluster Configuration */}
      {researchData && renderClusterConfig()}

      {/* Active Jobs */}
      {renderActiveJobs()}

      {/* Completed Jobs */}
      {renderCompletedJobs()}

      {/* Job Details Modal */}
      {renderJobDetailsModal()}

      {/* Help Information */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Target className="mr-2 text-purple-500" size={20} />
          How Batch Content Generation Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <BarChart3 className="text-blue-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Research Integration</h4>
              <p className="text-sm text-gray-600">Uses comprehensive research to create strategic content clusters</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FileText className="text-green-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Content Hierarchy</h4>
              <p className="text-sm text-gray-600">Generates pillar, supporting, and rapid content with dependencies</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Link className="text-purple-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Automated Interlinking</h4>
              <p className="text-sm text-gray-600">Creates strategic internal linking between related content</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="text-orange-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Publication Schedule</h4>
              <p className="text-sm text-gray-600">Generates optimal publishing timeline for maximum impact</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="text-indigo-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">SEO Optimization</h4>
              <p className="text-sm text-gray-600">Each piece optimized for target keywords and search intent</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Download className="text-cyan-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Export Package</h4>
              <p className="text-sm text-gray-600">Complete cluster with content, strategy, and implementation guide</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white border border-purple-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Content Cluster Benefits:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Topic Authority:</strong> Comprehensive coverage establishes expertise</li>
            <li>• <strong>SEO Performance:</strong> Interlinking boosts search rankings</li>
            <li>• <strong>User Journey:</strong> Guides visitors from awareness to conversion</li>
            <li>• <strong>Content Efficiency:</strong> Batch generation saves time and ensures consistency</li>
            <li>• <strong>Strategic Publishing:</strong> Optimal timeline maximizes impact</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BatchContentDashboard;