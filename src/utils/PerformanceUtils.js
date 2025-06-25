/**
 * Performance Utilities
 * Tools for monitoring and optimizing component performance
 */

// Component performance tracker
export const trackComponentPerformance = (componentName, operation = 'render') => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`⚛️ ${componentName} ${operation}: ${duration.toFixed(2)}ms`);
      
      if (duration > 100) {
        console.warn(`⚠️ Slow ${operation} detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }
      
      // Track in Google Analytics if available
      if (window.gtag) {
        window.gtag('event', 'component_performance', {
          component_name: componentName,
          operation: operation,
          duration: Math.round(duration),
          custom_parameter: 'attributeai_performance'
        });
      }
      
      return duration;
    }
  };
};

// Bundle size monitoring
export const reportBundleMetrics = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && 
      !resource.name.includes('analytics') &&
      !resource.name.includes('gtag')
    );
    
    const totalJSSize = jsResources.reduce((sum, resource) => {
      return sum + (resource.transferSize || 0);
    }, 0);
    
    console.log(`📦 Total JS Bundle Size: ${(totalJSSize / 1024).toFixed(2)} KB`);
    console.log(`🔢 JS Resources Loaded: ${jsResources.length}`);
    console.log(`⏱️ DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.fetchStart}ms`);
    console.log(`🏁 Page Load Complete: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
    
    return {
      totalJSSize: totalJSSize,
      resourceCount: jsResources.length,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      pageLoadComplete: navigation.loadEventEnd - navigation.fetchStart
    };
  }
};

// Component size analyzer
export const analyzeComponentSize = async (componentName, importFunction) => {
  const startTime = performance.now();
  
  try {
    const module = await importFunction();
    const loadTime = performance.now() - startTime;
    
    console.log(`📄 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    
    if (loadTime > 1000) {
      console.warn(`🐌 Large component detected: ${componentName} took ${loadTime.toFixed(2)}ms to load`);
    }
    
    return { module, loadTime };
  } catch (error) {
    console.error(`❌ Failed to load ${componentName}:`, error);
    throw error;
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = (componentName) => {
  if ('memory' in performance) {
    const memory = performance.memory;
    
    console.log(`🧠 Memory usage for ${componentName}:`);
    console.log(`  Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
    
    return memory;
  }
};

// Lazy loading optimizer
export const createOptimizedLazy = (importFunction, componentName, options = {}) => {
  const { preloadDelay = 100, retryAttempts = 3 } = options;
  
  let preloaded = false;
  let preloadPromise = null;
  
  const preload = () => {
    if (!preloaded && !preloadPromise) {
      preloadPromise = setTimeout(() => {
        importFunction().catch(error => {
          console.warn(`⚠️ Preload failed for ${componentName}:`, error);
        });
        preloaded = true;
      }, preloadDelay);
    }
  };
  
  const LazyComponent = React.lazy(() => {
    let attempts = 0;
    
    const loadWithRetry = async () => {
      try {
        const result = await analyzeComponentSize(componentName, importFunction);
        return result.module;
      } catch (error) {
        attempts++;
        if (attempts < retryAttempts) {
          console.warn(`🔄 Retrying load for ${componentName} (attempt ${attempts + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return loadWithRetry();
        }
        throw error;
      }
    };
    
    return loadWithRetry();
  });
  
  LazyComponent.preload = preload;
  LazyComponent.displayName = componentName;
  
  return LazyComponent;
};

export default {
  trackComponentPerformance,
  reportBundleMetrics,
  analyzeComponentSize,
  monitorMemoryUsage,
  createOptimizedLazy
};
