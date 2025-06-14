import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AIChatInterface from './AIChatInterface';

const FloatingChatButton = ({ websiteAnalysis }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    console.log('Floating chat button clicked!', { isChatOpen, websiteAnalysis });
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleChatToggle}
          className={`relative p-4 rounded-full shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 ${
            isChatOpen 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
          }`}
          title={isChatOpen ? "Close AI Chat" : "Chat with AI Marketing Strategist"}
        >
          {isChatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
        
        {/* Pulse Animation - only when closed */}
        {!isChatOpen && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-20 pointer-events-none"></div>
        )}

        {/* Notification Badge */}
        {!isChatOpen && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            AI
          </div>
        )}
      </div>

      {/* AI Chat Interface */}
      {isChatOpen && (
        <AIChatInterface 
          websiteAnalysis={websiteAnalysis}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingChatButton;