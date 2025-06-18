// Conversion Recovery Implementation - Part 2
// Continue from the floating button...

            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 animate-pulse"
          >
            <Database size={20} />
            <span className="font-medium">Save Your Research!</span>
          </button>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ConversionRecoveryModal 
        isOpen={showExitIntent}
        onClose={() => setShowExitIntent(false)}
        onSignup={onTriggerSignup}
      />
    </>
  );
};

// In-App Conversion Banners
const ConversionBanner = ({ onSignup, variant = "top" }) => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed || localStorage.getItem('attributeai_user')) return null;

  const bannerContent = {
    top: {
      bg: "bg-gradient-to-r from-blue-600 to-indigo-600",
      text: "🎉 Account creation fixed! Save your progress with a free account",
      cta: "Sign Up Free"
    },
    results: {
      bg: "bg-gradient-to-r from-green-600 to-emerald-600", 
      text: "💾 Save these results + get unlimited keyword research",
      cta: "Get Unlimited Access"
    },
    feature: {
      bg: "bg-gradient-to-r from-purple-600 to-pink-600",
      text: "⚡ Join 63+ users already using AttributeAI unlimited",
      cta: "Join Free"
    }
  };

  const config = bannerContent[variant];

  return (
    <div className={`${config.bg} text-white p-3 text-center relative`}>
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-white hover:text-gray-200"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-center justify-center space-x-4">
        <span className="text-sm font-medium">{config.text}</span>
        <button
          onClick={onSignup}
          className="bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          {config.cta}
        </button>
      </div>
    </div>
  );
};

// Progress Save Prompts (for after tool usage)
const ProgressSavePrompt = ({ onSignup, toolName = "analysis" }) => {
  const [show, setShow] = useState(true);
  
  if (!show || localStorage.getItem('attributeai_user')) return null;

  return (
    <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
      <div className="flex items-start space-x-3">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <Database className="text-yellow-600" size={20} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-yellow-800 mb-1">
            Save This {toolName}?
          </h4>
          <p className="text-yellow-700 text-sm mb-3">
            Create a free account to save your progress and continue unlimited research.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={onSignup}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
            >
              Save + Continue Free
            </button>
            <button
              onClick={() => setShow(false)}
              className="text-yellow-600 px-4 py-2 text-sm hover:text-yellow-800"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Session-based conversion tracking
const ConversionTracker = ({ onSignup }) => {
  useEffect(() => {
    // Track returning users
    const visitCount = parseInt(localStorage.getItem('attributeai_visits') || '0') + 1;
    localStorage.setItem('attributeai_visits', visitCount.toString());

    // Show returning user prompt
    if (visitCount >= 2 && !localStorage.getItem('attributeai_user')) {
      setTimeout(() => {
        const shouldShow = window.confirm(
          "Welcome back! 👋\n\nYou've used AttributeAI before - would you like to create a free account to save your progress?"
        );
        
        if (shouldShow) {
          onSignup();
        }
      }, 3000);
    }

    // Track feature usage
    const trackFeatureUsage = (featureName) => {
      const features = JSON.parse(localStorage.getItem('attributeai_features_used') || '[]');
      if (!features.includes(featureName)) {
        features.push(featureName);
        localStorage.setItem('attributeai_features_used', JSON.stringify(features));
        
        // Trigger signup prompt after using 3+ features
        if (features.length >= 3 && !localStorage.getItem('attributeai_user')) {
          setTimeout(() => {
            onSignup();
          }, 2000);
        }
      }
    };

    // Export tracking function globally
    window.trackFeatureUsage = trackFeatureUsage;

  }, [onSignup]);

  return null; // This is a tracking component, no UI
};

export {
  ConversionRecoveryModal,
  ConversionPrompts,
  ConversionBanner,
  ProgressSavePrompt,
  ConversionTracker
};
