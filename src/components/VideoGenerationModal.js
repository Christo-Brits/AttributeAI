import React, { useState, useEffect } from 'react';
import { X, Video, Loader, Download, Copy, PlayCircle, Music, Hash, Image, Clock } from 'lucide-react';
import VideoGenerationService from '../services/VideoGenerationService';

const VideoGenerationModal = ({ content, metadata, onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('script');
  
  const videoService = new VideoGenerationService();

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube Shorts', icon: '📹' },
    { id: 'instagram', name: 'Instagram Reels', icon: '📸' }
  ];

  useEffect(() => {
    generateVideo();
  }, [selectedPlatform]);

  const generateVideo = async () => {
    try {
      setIsGenerating(true);
      setError(null);      
      // Stage 1
      setGenerationStage('Analyzing content...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 2
      setGenerationStage('Extracting key points...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 3
      setGenerationStage('Creating video script...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 4
      setGenerationStage('Breaking down scenes...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 5
      setGenerationStage('Generating captions and hashtags...');
      
      // Generate actual video content
      const result = await videoService.generateVideoContent(content, selectedPlatform, {
        tone: 'engaging',
        keywords: metadata?.keywords
      });
      
      setVideoData(result);
      setIsGenerating(false);
    } catch (err) {
      console.error('Video generation error:', err);      setError('Failed to generate video content. Please try again.');
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const downloadContent = (format) => {
    if (!videoData) return;
    
    let content, filename, mimeType;
    
    switch (format) {
      case 'json':
        content = videoService.exportAsJSON(videoData);
        filename = `video-script-${selectedPlatform}.json`;
        mimeType = 'application/json';
        break;
      case 'text':
        content = videoService.exportAsText(videoData);
        filename = `video-script-${selectedPlatform}.txt`;
        mimeType = 'text/plain';
        break;
      case 'srt':
        content = videoData.captions.srt;
        filename = `captions-${selectedPlatform}.srt`;        mimeType = 'text/plain';
        break;
      default:
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'script', label: 'Script', icon: <Video className="w-4 h-4" /> },
    { id: 'scenes', label: 'Scenes', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'captions', label: 'Captions', icon: <Clock className="w-4 h-4" /> },
    { id: 'hashtags', label: 'Hashtags', icon: <Hash className="w-4 h-4" /> },
    { id: 'audio', label: 'Audio', icon: <Music className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Video Script Generator</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Platform selector */}
          <div className="flex gap-2 mt-4">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlatform === platform.id
                    ? 'bg-white text-purple-600'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                <span className="mr-2">{platform.icon}</span>
                {platform.name}
              </button>
            ))}
          </div> font-medium text-gray-700 mb-2">Generating video content...</p>
                <p className="text-sm text-gray-500">{generationStage}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
                  <p>{error}</p>
                </div>
              </div>
            ) : videoData ? (
              <div>
                {/* Script Tab */}
                {activeTab === 'script' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Full Script</h3>
                      <button
                        onClick={() => copyToClipboard(videoData.script)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Copy className="w-4 h-4" />
                        {copySuccess ? 'Copied!' : 'Copy Script'}
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap font-sans">{videoData.script}</pre>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium">Duration</p>
                        <p className="text-2xl font-bold text-blue-900">{videoData.metadata.totalDuration}s</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 font-medium">Scenes</p>
                        <p className="text-2xl font-bold text-green-900">{videoData.metadata.sceneCount}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-purple-600 font-medium">Words</p>
                        <p className="text-2xl font-bold text-purple-900">{videoData.metadata.wordCount}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scenes Tab */}
                {activeTab === 'scenes' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Scene Breakdown</h3>
                    <div className="space-y-4">
                      {videoData.scenes.map((scene, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-purple-700">
                              Scene {index + 1} - {scene.type.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                              {scene.duration}s
                            </span>                          </div>
                          <p className="text-gray-800 mb-2">{scene.text}</p>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Visual:</strong> {scene.visual}</p>
                            <p><strong>Caption:</strong> {scene.caption}</p>
                            <p><strong>Transition:</strong> {scene.transition}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Captions Tab */}
                {activeTab === 'captions' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Captions</h3>
                      <button
                        onClick={() => downloadContent('srt')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Download className="w-4 h-4" />
                        Download SRT
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap font-mono text-sm">{videoData.captions.srt}</pre>
                    </div>
                  </div>
                )}
                {/* Hashtags Tab */}
                {activeTab === 'hashtags' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Hashtags</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Required Platform Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {videoData.hashtags.required.map((tag, index) => (
                            <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Topical Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {videoData.hashtags.topical.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Trending Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {videoData.hashtags.trending.map((tag, index) => (                            <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(videoData.hashtags.recommended.join(' '))}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Copy className="w-4 h-4" />
                        Copy All Hashtags
                      </button>
                    </div>
                  </div>
                )}

                {/* Audio Tab */}
                {activeTab === 'audio' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Audio Suggestions</h3>
                    <div className="space-y-4">
                      {videoData.audioSuggestions.map((audio, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{audio.name}</h4>
                            <p className="text-sm text-gray-600">{audio.description}</p>
                          </div>
                          <div className="text-right">
                            {audio.trending && (                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                Trending
                              </span>
                            )}
                            <p className="text-sm text-gray-500 mt-1">{audio.uses} uses</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Thumbnail Ideas */}
                    <h3 className="text-lg font-semibold mt-8 mb-4">Thumbnail Ideas</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {videoData.thumbnailIdeas.map((idea, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <Image className="w-8 h-8 text-purple-600 mb-2" />
                          <h4 className="font-medium text-gray-900 mb-1">{idea.concept}</h4>
                          <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                          <p className="text-xs text-purple-600 font-medium">{idea.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        {videoData && (          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Generated for {videoData.platform.name} • {videoData.platform.aspectRatio} • 
                {videoData.platform.duration.optimal}s optimal duration
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadContent('json')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => downloadContent('text')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export Text
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGenerationModal;