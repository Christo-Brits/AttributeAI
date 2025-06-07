import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import AIChatInterface from './AIChatInterface';

const FloatingChatButton = ({ websiteAnalysis }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            console.log('Floating chat button clicked!');
            setIsChatOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
          title="Chat with AI Marketing Strategist"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
        
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-20"></div>
      </div>

      {/* AI Chat Interface */}
      <AIChatInterface 
        websiteAnalysis={websiteAnalysis}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default FloatingChatButton;