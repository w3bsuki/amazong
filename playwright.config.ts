import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Production Readiness Testing
 * 
 * This configuration supports:
 * - Smoke testing against dev server (pnpm dev)
 * - Production testing against build (pnpm start)
 * - Cross-browser testing (Chromium, Firefox, WebKit)
 * - Mobile viewport testing
 * - Accessibility testing with axe-core
 * - Console error capture
 */

const baseURL = process.env.BASE_URL || 'http://localhost:3000'
const isCI = !!process.env.CI
const isProdTest = process.env.TEST_PROD === 'true'

export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,

  // Retry on CI only
  retries: isCI ? 2 : 0,

  // Opt out of parallel tests on CI for stability
  workers: isCI ? 1 : (isProdTest ? undefined : 1),

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(isCI ? [['github'] as const] : []),
  ],

  // Global timeout for each test
  timeout: 30_000,

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL,

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'on-first-retry',

    // Viewport
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Test projects for different browsers/viewports
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Accessibility-focused project (runs subset of tests)
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /accessibility\.spec\.ts/,
    },
  ],

  // Web server configuration
  webServer: {
    command: process.env.TEST_PROD === 'true' 
      ? 'pnpm start' 
      : 'cross-env NEXT_PUBLIC_E2E=true pnpm exec next dev',
    url: baseURL,
    reuseExistingServer: !isCI, // Reuse existing server for local development
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output directory for test artifacts
  outputDir: 'test-results',

  // Expect configuration
  expect: {
    // Increase timeout for accessibility tests
    timeout: 10_000,
  },
})
