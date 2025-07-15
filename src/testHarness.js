// Test harness for development and build processes
// This file ensures compatibility with build systems that expect it

import _ from 'lodash';

// Basic utility functions for testing and development
export const testUtils = {
  // Lodash utilities for data manipulation
  debounce: _.debounce,
  throttle: _.throttle,
  cloneDeep: _.cloneDeep,
  merge: _.merge,
  
  // Test helpers
  mockApiCall: (data) => Promise.resolve(data),
  generateTestData: (count = 10) => {
    return _.range(count).map(i => ({
      id: i,
      name: `Test Item ${i}`,
      timestamp: Date.now() + i
    }));
  },
  
  // Development utilities
  log: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[TestHarness] ${message}`, data);
    }
  }
};

// Export for compatibility
export default testUtils;
