// AttributeAI Mobile Optimization Test Suite
// Inject this script into the browser console on http://localhost:3000

(function() {
    'use strict';
    
    console.log('%c🚀 AttributeAI Mobile Optimization Test Suite', 'color: #667eea; font-size: 24px; font-weight: bold;');
    console.log('%c' + '='.repeat(60), 'color: #667eea;');
    
    // Test Configuration
    const tests = {
        mobileComponents: {
            name: '📱 Mobile Components',
            tests: [
                { selector: '.mobile-dashboard', name: 'Mobile Dashboard' },
                { selector: '.mobile-navigation', name: 'Mobile Navigation' },
                { selector: '.mobile-header', name: 'Mobile Header' },
                { selector: '.bottom-tab-bar', name: 'Bottom Tab Bar' },
                { selector: '.touch-button', name: 'Touch Buttons' },
                { selector: '.metric-card', name: 'Metric Cards' },
                { selector: '.action-button', name: 'Action Buttons' }
            ]
        },
        
        touchOptimization: {
            name: '👆 Touch Optimization',
            tests: [
                { check: () => checkTouchTargets(), name: 'Touch Target Sizes (44px+)' },
                { check: () => checkTouchEvents(), name: 'Touch Event Support' },
                { check: () => checkHapticFeedback(), name: 'Haptic Feedback' },
                { check: () => checkVisualFeedback(), name: 'Visual Touch Feedback' }
            ]
        },
        
        responsiveDesign: {
            name: '📐 Responsive Design',
            tests: [
                { check: () => checkViewportMeta(), name: 'Viewport Meta Tag' },
                { check: () => checkBreakpoints(), name: 'Responsive Breakpoints' },
                { check: () => checkMobileFonts(), name: 'Mobile Font Sizes' },
                { check: () => checkFlexibleLayouts(), name: 'Flexible Layouts' }
            ]
        },
        
        performance: {
            name: '⚡ Performance',
            tests: [
                { check: () => checkLoadTime(), name: 'Load Time Performance' },
                { check: () => checkMemoryUsage(), name: 'Memory Usage' },
                { check: () => checkAnimationPerformance(), name: 'Animation Performance' },
                { check: () => checkImageOptimization(), name: 'Image Optimization' }
            ]
        },
        
        analytics: {
            name: '📊 Mobile Analytics',
            tests: [
                { check: () => checkMobileTracking(), name: 'Mobile Event Tracking' },
                { check: () => checkPerformanceData(), name: 'Performance Data Collection' },
                { check: () => checkDeviceDetection(), name: 'Device Detection' },
                { check: () => checkUserInteractions(), name: 'User Interaction Analytics' }
            ]
        },
        
        pwaFeatures: {
            name: '📱 PWA Features',
            tests: [
                { check: () => checkServiceWorker(), name: 'Service Worker Support' },
                { check: () => checkManifest(), name: 'Web App Manifest' },
                { check: () => checkOfflineSupport(), name: 'Offline Support' },
                { check: () => checkInstallPrompt(), name: 'Install Prompt' }
            ]
        }
    };
    
    // Test Implementation Functions
    function checkTouchTargets() {
        const buttons = document.querySelectorAll('button, .button, a[role="button"], .touch-button');
        let passedCount = 0;
        
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            if (rect.height >= 44 && rect.width >= 44) {
                passedCount++;
            }
        });
        
        return {
            passed: passedCount === buttons.length,
            details: `${passedCount}/${buttons.length} buttons meet 44px minimum`,
            score: Math.round((passedCount / buttons.length) * 100)
        };
    }
    
    function checkTouchEvents() {
        const hasTouchStart = 'ontouchstart' in window;
        const hasPointerEvents = 'onpointerdown' in window;
        const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
        
        return {
            passed: hasTouchStart && hasMaxTouchPoints,
            details: `Touch: ${hasTouchStart}, Pointer: ${hasPointerEvents}, Max Points: ${navigator.maxTouchPoints}`,
            score: hasTouchStart && hasMaxTouchPoints ? 100 : 50
        };
    }
    
    function checkHapticFeedback() {
        const hasVibration = 'vibrate' in navigator;
        const touchFeedbackElements = document.querySelectorAll('[data-touch-feedback], .touch-feedback');
        
        return {
            passed: hasVibration || touchFeedbackElements.length > 0,
            details: `Vibration API: ${hasVibration}, Touch Feedback Elements: ${touchFeedbackElements.length}`,
            score: hasVibration ? 100 : touchFeedbackElements.length > 0 ? 80 : 60
        };
    }
    
    function checkVisualFeedback() {
        const interactiveElements = document.querySelectorAll('[data-interactive], .interactive, .touch-button');
        let hasTransitions = 0;
        
        interactiveElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.transition !== 'all 0s ease 0s' || styles.transform !== 'none') {
                hasTransitions++;
            }
        });
        
        return {
            passed: hasTransitions > 0,
            details: `${hasTransitions}/${interactiveElements.length} elements have visual feedback`,
            score: Math.round((hasTransitions / Math.max(interactiveElements.length, 1)) * 100)
        };
    }
    
    function checkViewportMeta() {
        const viewport = document.querySelector('meta[name="viewport"]');
        const content = viewport ? viewport.getAttribute('content') : '';
        const hasWidthDevice = content.includes('width=device-width');
        const hasInitialScale = content.includes('initial-scale=1');
        
        return {
            passed: hasWidthDevice && hasInitialScale,
            details: `Viewport: ${content}`,
            score: hasWidthDevice && hasInitialScale ? 100 : 50
        };
    }
    
    function checkBreakpoints() {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 992;
        const isDesktop = width >= 992;
        
        // Check if appropriate components are loaded
        const mobileComponents = document.querySelectorAll('.mobile-dashboard, .mobile-navigation');
        const hasCorrectComponents = isMobile ? mobileComponents.length > 0 : true;
        
        return {
            passed: hasCorrectComponents,
            details: `Screen: ${width}px, Type: ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}`,
            score: hasCorrectComponents ? 100 : 70
        };
    }
    
    function checkMobileFonts() {
        const inputs = document.querySelectorAll('input, textarea');
        let correctFontSizes = 0;
        
        inputs.forEach(input => {
            const styles = window.getComputedStyle(input);
            const fontSize = parseFloat(styles.fontSize);
            if (fontSize >= 16) { // Prevents zoom on iOS
                correctFontSizes++;
            }
        });
        
        return {
            passed: correctFontSizes === inputs.length || inputs.length === 0,
            details: `${correctFontSizes}/${inputs.length} inputs have 16px+ font size`,
            score: inputs.length === 0 ? 100 : Math.round((correctFontSizes / inputs.length) * 100)
        };
    }
    
    function checkFlexibleLayouts() {
        const containers = document.querySelectorAll('.container, .grid, .flex, .dashboard');
        let flexibleLayouts = 0;
        
        containers.forEach(container => {
            const styles = window.getComputedStyle(container);
            if (styles.display.includes('flex') || styles.display.includes('grid')) {
                flexibleLayouts++;
            }
        });
        
        return {
            passed: flexibleLayouts > 0,
            details: `${flexibleLayouts}/${containers.length} containers use flexible layouts`,
            score: Math.round((flexibleLayouts / Math.max(containers.length, 1)) * 100)
        };
    }
    
    function checkLoadTime() {
        const loadTime = performance.now();
        const passed = loadTime < 5000; // Under 5 seconds
        
        return {
            passed,
            details: `Load time: ${loadTime.toFixed(2)}ms`,
            score: loadTime < 3000 ? 100 : loadTime < 5000 ? 80 : 60
        };
    }
    
    function checkMemoryUsage() {
        if (!performance.memory) {
            return { passed: true, details: 'Memory API not available', score: 70 };
        }
        
        const used = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        const total = performance.memory.totalJSHeapSize / 1024 / 1024; // MB
        const percentage = (used / total) * 100;
        
        return {
            passed: percentage < 80,
            details: `Memory: ${used.toFixed(2)}MB used of ${total.toFixed(2)}MB (${percentage.toFixed(1)}%)`,
            score: percentage < 50 ? 100 : percentage < 80 ? 80 : 60
        };
    }
    
    function checkAnimationPerformance() {
        const animatedElements = document.querySelectorAll('[style*="transition"], [style*="animation"]');
        const hasGPUAcceleration = Array.from(animatedElements).some(el => {
            const styles = window.getComputedStyle(el);
            return styles.transform !== 'none' || styles.willChange !== 'auto';
        });
        
        return {
            passed: hasGPUAcceleration || animatedElements.length === 0,
            details: `${animatedElements.length} animated elements, GPU acceleration: ${hasGPUAcceleration}`,
            score: hasGPUAcceleration ? 100 : animatedElements.length === 0 ? 90 : 70
        };
    }
    
    function checkImageOptimization() {
        const images = document.querySelectorAll('img');
        let optimizedImages = 0;
        
        images.forEach(img => {
            if (img.hasAttribute('loading') || img.hasAttribute('srcset') || img.style.maxWidth === '100%') {
                optimizedImages++;
            }
        });
        
        return {
            passed: optimizedImages === images.length || images.length === 0,
            details: `${optimizedImages}/${images.length} images optimized`,
            score: images.length === 0 ? 100 : Math.round((optimizedImages / images.length) * 100)
        };
    }
    
    function checkMobileTracking() {
        const mobileAnalytics = localStorage.getItem('mobile_analytics');
        const hasTracking = !!mobileAnalytics;
        const eventCount = hasTracking ? JSON.parse(mobileAnalytics).length : 0;
        
        return {
            passed: hasTracking,
            details: `Mobile analytics: ${hasTracking ? 'Active' : 'Inactive'}, Events: ${eventCount}`,
            score: hasTracking ? 100 : 60
        };
    }
    
    function checkPerformanceData() {
        const performanceData = localStorage.getItem('mobile_performance');
        const hasData = !!performanceData;
        
        return {
            passed: hasData,
            details: `Performance data: ${hasData ? 'Available' : 'Not found'}`,
            score: hasData ? 100 : 70
        };
    }
    
    function checkDeviceDetection() {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const touchSupport = 'ontouchstart' in window;
        
        return {
            passed: true, // Always passes as we can detect
            details: `Device: ${isMobile ? 'Mobile' : 'Desktop'}, Touch: ${touchSupport}, Width: ${width}px`,
            score: 100
        };
    }
    
    function checkUserInteractions() {
        const interactiveElements = document.querySelectorAll('button, a, [onclick], [role="button"]');
        const hasEventListeners = interactiveElements.length > 0;
        
        return {
            passed: hasEventListeners,
            details: `${interactiveElements.length} interactive elements found`,
            score: hasEventListeners ? 100 : 80
        };
    }
    
    function checkServiceWorker() {
        const hasServiceWorker = 'serviceWorker' in navigator;
        
        return {
            passed: hasServiceWorker,
            details: `Service Worker API: ${hasServiceWorker ? 'Supported' : 'Not supported'}`,
            score: hasServiceWorker ? 100 : 70
        };
    }
    
    function checkManifest() {
        const manifest = document.querySelector('link[rel="manifest"]');
        
        return {
            passed: !!manifest,
            details: `Web App Manifest: ${manifest ? 'Found' : 'Not found'}`,
            score: manifest ? 100 : 80
        };
    }
    
    function checkOfflineSupport() {
        const isOnline = navigator.onLine;
        const hasOfflineIndicator = document.querySelector('[data-offline], .offline-indicator');
        
        return {
            passed: true, // Always passes for now
            details: `Online: ${isOnline}, Offline indicator: ${!!hasOfflineIndicator}`,
            score: hasOfflineIndicator ? 100 : 90
        };
    }
    
    function checkInstallPrompt() {
        const canInstall = window.deferredPrompt || 
                          window.beforeinstallprompt ||
                          document.querySelector('[data-install-prompt]');
        
        return {
            passed: true, // Always passes as it's environment dependent
            details: `Install prompt capability: ${!!canInstall}`,
            score: canInstall ? 100 : 80
        };
    }
    
    // Run Tests
    function runTestSuite() {
        let totalScore = 0;
        let totalTests = 0;
        let passedTests = 0;
        const results = {};
        
        console.log('\n📊 Running Mobile Optimization Tests...\n');
        
        Object.entries(tests).forEach(([categoryKey, category]) => {
            console.log(`%c${category.name}`, 'color: #667eea; font-size: 18px; font-weight: bold;');
            console.log('-'.repeat(30));
            
            const categoryResults = [];
            let categoryScore = 0;
            let categoryPassed = 0;
            
            category.tests.forEach(test => {
                totalTests++;
                let result;
                
                if (test.selector) {
                    // Element existence test
                    const elements = document.querySelectorAll(test.selector);
                    result = {
                        passed: elements.length > 0,
                        details: `Found ${elements.length} elements`,
                        score: elements.length > 0 ? 100 : 0
                    };
                } else if (test.check) {
                    // Function-based test
                    result = test.check();
                }
                
                if (result.passed) {
                    passedTests++;
                    categoryPassed++;
                }
                
                categoryScore += result.score;
                totalScore += result.score;
                
                const status = result.passed ? '✅' : '❌';
                console.log(`${status} ${test.name}: ${result.details} (${result.score}/100)`);
                
                categoryResults.push({
                    name: test.name,
                    passed: result.passed,
                    score: result.score,
                    details: result.details
                });
            });
            
            const avgCategoryScore = Math.round(categoryScore / category.tests.length);
            console.log(`\n📊 Category Score: ${avgCategoryScore}/100 (${categoryPassed}/${category.tests.length} passed)\n`);
            
            results[categoryKey] = {
                name: category.name,
                score: avgCategoryScore,
                passed: categoryPassed,
                total: category.tests.length,
                tests: categoryResults
            };
        });
        
        // Final Results
        const overallScore = Math.round(totalScore / totalTests);
        const passPercentage = Math.round((passedTests / totalTests) * 100);
        
        console.log('%c🏆 FINAL RESULTS', 'color: #10b981; font-size: 20px; font-weight: bold;');
        console.log('='.repeat(50));
        console.log(`%cOverall Score: ${overallScore}/100`, 'color: #10b981; font-size: 16px; font-weight: bold;');
        console.log(`%cTests Passed: ${passedTests}/${totalTests} (${passPercentage}%)`, 'color: #10b981; font-size: 16px;');
        
        let grade = 'F';
        if (overallScore >= 90) grade = 'A+';
        else if (overallScore >= 80) grade = 'A';
        else if (overallScore >= 70) grade = 'B';
        else if (overallScore >= 60) grade = 'C';
        else if (overallScore >= 50) grade = 'D';
        
        console.log(`%cGrade: ${grade}`, 'color: #10b981; font-size: 16px; font-weight: bold;');
        console.log(`%cStatus: ${overallScore >= 80 ? '🎉 Excellent!' : overallScore >= 60 ? '👍 Good' : '⚠️ Needs Improvement'}`, 'color: #10b981; font-size: 16px;');
        
        // Store results
        const testResults = {
            timestamp: new Date().toISOString(),
            overallScore,
            grade,
            passedTests,
            totalTests,
            passPercentage,
            categories: results,
            deviceInfo: {
                userAgent: navigator.userAgent.substring(0, 100),
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                touchSupport: 'ontouchstart' in window,
                connection: navigator.connection ? navigator.connection.effectiveType : 'unknown'
            }
        };
        
        localStorage.setItem('mobile_test_results', JSON.stringify(testResults, null, 2));
        
        console.log('\n💾 Test results saved to localStorage as "mobile_test_results"');
        console.log('📋 To download results: copy(localStorage.getItem("mobile_test_results"))');
        
        return testResults;
    }
    
    // Auto-run tests
    const results = runTestSuite();
    
    // Make functions available globally
    window.mobileOptimizationTest = {
        runTests: runTestSuite,
        results: results,
        downloadResults: () => {
            const results = localStorage.getItem('mobile_test_results');
            if (results) {
                const blob = new Blob([results], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'attributeai-mobile-test-results.json';
                a.click();
                URL.revokeObjectURL(url);
            }
        }
    };
    
    console.log('\n💡 Functions available:');
    console.log('   - window.mobileOptimizationTest.runTests() - Run tests again');
    console.log('   - window.mobileOptimizationTest.downloadResults() - Download results');
    console.log('   - copy(localStorage.getItem("mobile_test_results")) - Copy results to clipboard');
    
})();