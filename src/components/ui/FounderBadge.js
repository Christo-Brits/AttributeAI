import React from 'react';
import { Crown, Zap, Infinity } from 'lucide-react';

const FounderBadge = ({ userProfile, showDetails = true }) => {
  const isFounder = userProfile?.is_founder || userProfile?.subscription_tier === 'founder';
  
  if (!isFounder) return null;

  return (
    <div className="founder-badge-container">
      {/* Main Founder Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-yellow-900 font-semibold rounded-lg shadow-lg border border-yellow-300">
        <Crown className="w-4 h-4" />
        <span className="text-sm font-bold">FOUNDER</span>
        <Infinity className="w-4 h-4" />
      </div>

      {showDetails && (
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Unlimited Access Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <Infinity className="w-3 h-3" />
            <span>Unlimited Access</span>
          </div>

          {/* All Features Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
            <Zap className="w-3 h-3" />
            <span>All Features</span>
          </div>

          {/* Beta Access Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <span>🚀</span>
            <span>Beta Access</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderBadge;
