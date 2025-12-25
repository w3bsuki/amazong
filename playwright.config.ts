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
// Local dev defaults to reusing an already-running Next.js dev server.
// Override explicitly via REUSE_EXISTING_SERVER=true/false.
const reuseExistingServer =
  process.env.REUSE_EXISTING_SERVER != null
    ? process.env.REUSE_EXISTING_SERVER === 'true'
    : !isCI
const base = new URL(baseURL)
const basePort =
  base.port ||
  (base.hostname === 'localhost' || base.hostname === '127.0.0.1'
    ? '3000'
    : base.protocol === 'https:'
      ? '443'
      : '80')
// Use an endpoint that should reliably return 2xx once Next is up.
// NOTE: /robots.txt can be affected by app metadata/route issues; /en is a
// better readiness signal for this app.
const webServerURL = `${base.origin}/en`
const htmlReportFolder = isCI ? 'playwright-report' : `playwright-report-${Date.now()}`

export default defineConfig({
  // Warm key routes once before all tests so first-hit Next.js dev compilation
  // does not cause early test timeouts.
  globalSetup: require.resolve('./e2e/global-setup'),

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
    ['html', { outputFolder: htmlReportFolder, open: 'never' }],
    ['list'],
    ...(isCI ? [['github'] as const] : []),
  ],

  // Global timeout for each test
  // Next.js dev mode can spend significant time compiling routes on first hit.
  // Keep tests stable by allowing more time for initial navigations.
  timeout: 60_000,

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL,

    // Next.js dev-mode route compilation can exceed Playwright's 30s default.
    navigationTimeout: 60_000,

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

    // Standardize test-id selector across the suite.
    // Prefer page.getByTestId('...') over brittle CSS.
    testIdAttribute: 'data-testid',
  },

  // Test projects for different browsers/viewports
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      testIgnore: /accessibility\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /accessibility\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /accessibility\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      testIgnore: /accessibility\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      testIgnore: /accessibility\.spec\.ts/,
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
  // - If the server is already running, reuse it.
  // - If not, start it using the command below.
  webServer: {
    command:
      process.env.TEST_PROD === 'true'
        ? `pnpm -s build && cross-env PORT=${basePort} pnpm -s start`
        : `cross-env NEXT_PUBLIC_E2E=true PORT=${basePort} pnpm dev`,
    url: webServerURL,
    reuseExistingServer,
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
