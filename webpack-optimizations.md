# Webpack Optimizations for AttributeAI

## Current Bundle Analysis
- Main bundle: ~130KB gzipped (excellent)
- Largest chunk: ~103KB (needs investigation)
- Total chunks: 28 (good code splitting)

## Optimization Opportunities

### 1. Bundle Splitting Strategy
```javascript
// In craco.config.js (if using CRACO)
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3|chart\.js)/,
            name: 'charts',
            chunks: 'all',
            priority: 20
          },
          ui: {
            test: /[\\/]node_modules[\\/](react-bootstrap|lucide-react)/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 15
          }
        }
      };
      return webpackConfig;
    }
  }
};
```

### 2. Tree Shaking Optimizations
- Import only specific functions from lodash
- Use individual lucide-react icons instead of full package
- Avoid importing entire libraries when only using parts

### 3. Dynamic Imports for Heavy Features
```javascript
// Instead of:
import { ComplexChart } from 'recharts';

// Use:
const ComplexChart = lazy(() => 
  import('recharts').then(module => ({ default: module.ComplexChart }))
);
```

### 4. Service Worker for Caching
```javascript
// Enable service worker in src/index.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```
