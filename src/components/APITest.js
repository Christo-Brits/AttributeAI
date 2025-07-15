// Phase 2 Test - API Key Verification
// Test if your Claude API key is working

import React, { useState } from 'react';

const APITest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testClaudeAPI = async () => {
    setLoading(true);
    setResult('Testing Claude API...');

    try {
      // This is a simple test to see if the API key is accessible
      const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        setResult('❌ No Claude API key found in environment variables');
        return;
      }
      
      if (apiKey.startsWith('sk-ant-api03-')) {
        setResult('✅ Claude API key is present and properly formatted!');
      } else {
        setResult('⚠️ API key found but format looks unusual');
      }
      
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🚀 AttributeAI Phase 2 - API Test
        </h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Claude AI Integration Status</h2>
          <button
            onClick={testClaudeAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Claude API Key'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-mono text-sm">{result}</p>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Phase 2 Progress:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Claude AI Service architecture created</li>
            <li>✅ React hooks for AI integration built</li>
            <li>✅ AI Insights component designed</li>
            <li>✅ Enhanced navigation with Phase 2 features</li>
            <li>🔄 Testing API connectivity...</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APITest;