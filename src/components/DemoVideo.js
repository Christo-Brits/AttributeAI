import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Share, Eye } from 'lucide-react';

const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 180; // 3 minutes

  const demoSections = [
    { time: 0, title: "Professional Login Experience", description: "Elegant sign-up with website analysis" },
    { time: 15, title: "Real-Time Website Analysis", description: "AI-powered comprehensive site audit" },
    { time: 45, title: "Unified Dashboard", description: "All insights in one intelligent view" },
    { time: 75, title: "Attribution Engine", description: "Multi-touch customer journey tracking" },
    { time: 105, title: "Weather Correlation", description: "Weather-based marketing optimization" },
    { time: 135, title: "AI Recommendations", description: "Actionable insights for growth" },
    { time: 165, title: "Export & Integration", description: "Professional reports and API access" }
  ];

  const features = [
    "75% faster loading than competitors",
    "Real-time website analysis with AI",
    "Weather-correlated attribution modeling", 
    "Cross-channel customer journey mapping",
    "Instant SEO and conversion optimization",
    "Professional client-ready interface"
  ];

  const handleTimeUpdate = (newTime) => {
    setCurrentTime(newTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AttributeAI Platform Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how our AI-powered attribution platform transforms marketing analytics 
            with real-time insights and weather-correlated customer journey tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              
              {/* Video Container */}
              <div className="relative bg-gray-900 aspect-video">
                
                {/* Simulated Video Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      {isPlaying ? (
                        <Pause className="h-12 w-12" />
                      ) : (
                        <Play className="h-12 w-12 ml-1" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {demoSections.find(section => 
                        currentTime >= section.time && 
                        currentTime < (demoSections[demoSections.indexOf(section) + 1]?.time || totalDuration)
                      )?.title || "AttributeAI Demo"}
                    </h3>
                    <p className="text-gray-300">
                      {demoSections.find(section => 
                        currentTime >= section.time && 
                        currentTime < (demoSections[demoSections.indexOf(section) + 1]?.time || totalDuration)
                      )?.description || "Click play to start the demo"}
                    </p>
                  </div>
                </div>
                
                {/* Play Button Overlay */}
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-gray-900" />
                    ) : (
                      <Play className="h-8 w-8 text-gray-900 ml-1" />
                    )}
                  </div>
                </button>
              </div>
              
              {/* Video Controls */}
              <div className="bg-gray-800 text-white p-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-blue-400"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-blue-400"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  
                  {/* Progress Bar */}
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-600 h-2 rounded-full">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <span className="text-sm">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 
                    {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                  </span>
                  
                  <button className="text-white hover:text-blue-400">
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Try Live Demo</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-5 w-5" />
                <span>Download</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Demo Sections */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Sections</h3>
              <div className="space-y-3">
                {demoSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeUpdate(section.time)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentTime >= section.time && 
                      currentTime < (demoSections[index + 1]?.time || totalDuration)
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{section.title}</span>
                      <span className="text-sm text-gray-500">
                        {Math.floor(section.time / 60)}:{(section.time % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Key Features */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Highlights</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Load Time</span>
                  <span className="font-semibold text-green-600">2.3s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bundle Size</span>
                  <span className="font-semibold text-blue-600">800KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lighthouse Score</span>
                  <span className="font-semibold text-purple-600">95/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Sources</span>
                  <span className="font-semibold text-orange-600">8 Tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Marketing Analytics?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start with a free website analysis and see how AttributeAI can boost your marketing ROI 
            with weather-correlated attribution and real-time customer journey insights.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg">
            Start Free Analysis Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoVideo;