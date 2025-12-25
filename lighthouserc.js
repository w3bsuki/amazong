/**
 * Lighthouse CI Configuration
 * 
 * This configuration runs Lighthouse audits for:
 * - Performance (Core Web Vitals)
 * - Accessibility
 * - Best Practices
 * - SEO
 * 
 * Run with: pnpm test:lighthouse
 * 
 * Prerequisites:
 * - Build the project first: pnpm build
 * - Start the production server: pnpm start
 * - Or use autorun which handles this automatically
 */

module.exports = {
  ci: {
    // ========================================================================
    // Collect Configuration
    // ========================================================================
    collect: {
      // Start production server before collecting
      startServerCommand: 'cross-env PORT=3001 pnpm start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 60000,
      
      // URLs to audit
      url: [
        'http://localhost:3001/en',
        'http://localhost:3001/en/categories',
        'http://localhost:3001/en/search?q=phone',
        'http://localhost:3001/en/cart',
      ],
      
      // Number of runs per URL (median is used)
      numberOfRuns: 3,
      
      // Lighthouse settings
      settings: {
        // Use desktop preset for more realistic results
        preset: 'desktop',
        
        // Chrome flags for CI environments
        chromeFlags: process.env.CI ? '--no-sandbox --headless' : '',
        
        // Disable network throttling in CI for stability
        // (production throttling can be enabled for more accurate results)
        throttlingMethod: process.env.CI ? 'provided' : 'simulate',
        
        // Skip audits that don't apply or are flaky
        skipAudits: [
          'uses-http2', // Often blocked by infrastructure
          'valid-source-maps', // Dev tooling concern
        ],
      },
    },

    // ========================================================================
    // Assert Configuration (Quality Gates)
    // ========================================================================
    assert: {
      // Explicit assertions only.
      // (Avoid presets here: Lighthouse/LHCI versions can introduce new "insight" audits
      // that are frequently N/A or renamed, causing noisy failures unrelated to app quality.)
      assertions: {
        // ====================================================================
        // Category Scores (0-1)
        // ====================================================================
        
        // Performance: enforce a real floor (blocking), while docs still target 80+
        'categories:performance': ['error', { minScore: 0.7 }],
        
        // Accessibility: Target 90+ (error at 85)
        'categories:accessibility': ['error', { minScore: 0.85 }],
        
        // Best Practices: Target 90+
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        
        // SEO: Target 90+
        'categories:seo': ['error', { minScore: 0.9 }],

        // ====================================================================
        // Core Web Vitals (specific thresholds)
        // ====================================================================
        
        // First Contentful Paint: < 2.5s
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        
        // Largest Contentful Paint: < 4s (error), < 2.5s (warn)
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        
        // Cumulative Layout Shift: < 0.1
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Total Blocking Time: < 600ms (proxy for INP)
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],
        
        // Speed Index: < 4s
        'speed-index': ['warn', { maxNumericValue: 4000 }],

        // ====================================================================
        // Accessibility Audits (supplement axe-core testing)
        // ====================================================================
        
        // Critical accessibility
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'button-name': 'error',
        'label': 'error',

        // Important accessibility
        'heading-order': 'warn',
        'duplicate-id-aria': 'error',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr': 'error',
        'aria-valid-attr-value': 'error',

        // ====================================================================
        // SEO Audits
        // ====================================================================
        
        'meta-description': 'error',
        'hreflang': 'warn', // i18n support
        'canonical': 'warn',
        'robots-txt': 'error',
        'crawlable-anchors': 'warn',

        // ====================================================================
        // Best Practices Audits
        // ====================================================================
        
        'errors-in-console': 'error',
        'deprecations': 'warn',
        'is-on-https': 'off', // Disabled for localhost testing
        // Varies by Lighthouse version / not always available in LHCI assertions.
        'no-vulnerable-libraries': 'off',
        'csp-xss': 'off',
        'js-libraries': 'off', // Informational only

        // Dev-tooling / environment-dependent audits (avoid noisy failures)
        'valid-source-maps': 'off',
        'unminified-javascript': 'off',
        'uses-text-compression': 'off',

        // ====================================================================
        // Performance Audits (specific)
        // ====================================================================
        
        // Images
        'uses-responsive-images': 'warn',
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'offscreen-images': 'off', // Lazy loading handled by Next.js
        
        // Network
        'render-blocking-resources': 'off',
        'uses-rel-preconnect': 'off', // Often not applicable
        'uses-rel-preload': 'off', // Often not applicable
        
        // JavaScript
        'unused-javascript': 'warn',
        'mainthread-work-breakdown': 'warn',
        'bootup-time': 'warn',
        
        // Caching
        'uses-long-cache-ttl': 'warn',
        
        // Fonts
        'font-display': 'warn',

        // ====================================================================
        // PWA (Optional - disable if not targeting PWA)
        // ====================================================================
        
        'installable-manifest': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'off',
        'viewport': 'error',
      },
    },

    // ========================================================================
    // Upload Configuration
    // ========================================================================
    upload: {
      // Use temporary public storage (reports accessible for 7 days)
      target: 'temporary-public-storage',
      
      // Alternatively, use filesystem for local reports
      // target: 'filesystem',
      // outputDir: './lighthouse-reports',
    },
  },
}
