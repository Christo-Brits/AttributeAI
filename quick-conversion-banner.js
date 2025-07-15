// Quick Conversion Banner - Add this to your UnifiedDashboard.js

import React, { useState } from 'react';
import { X, Users, Zap, Database } from 'lucide-react';

const QuickConversionBanner = ({ onSignup }) => {
  const [dismissed, setDismissed] = useState(false);
  
  // Don't show if user is already registered or dismissed
  if (dismissed || localStorage.getItem('attributeai_user')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg mb-6 relative">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-white hover:text-gray-200"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <Database className="mr-2" size={20} />
            🎉 Account Creation Fixed!
          </h3>
          <p className="text-green-100 mb-3">
            Save your research + get unlimited keyword analysis (no more credit limits!)
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <Users className="mr-1" size={16} />
              <span>Join 63+ active users</span>
            </div>
            <div className="flex items-center">
              <Zap className="mr-1" size={16} />
              <span>Beat Keywords Everywhere</span>
            </div>
          </div>
        </div>
        
        <div className="ml-6">
          <button
            onClick={onSignup}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Get Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickConversionBanner;

// USAGE: Add this to the top of your UnifiedDashboard component:
// <QuickConversionBanner onSignup={() => setShowSignupModal(true)} />
