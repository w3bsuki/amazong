import { defineConfig, devices } from '@playwright/test'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import dotenv from 'dotenv'

// Capture shell environment BEFORE dotenv runs
const shellReuseServer = process.env.REUSE_EXISTING_SERVER
const shellBaseURL = process.env.BASE_URL

/**
 * Check if a port is currently in use (synchronous via spawnSync).
 * Returns true if port is occupied, false if available.
 */
function isPortInUse(port: number): boolean {
  // Use a quick TCP connection attempt to check if port is listening
  const { execSync } = require('node:child_process')
  try {
    if (process.platform === 'win32') {
      // Windows: use netstat to check if port is listening
      const result = execSync(
        `netstat -ano | findstr ":${port}" | findstr "LISTENING"`,
        { encoding: 'utf8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] }
      )
      return result.trim().length > 0
    } else {
      // Unix: use lsof
      execSync(`lsof -i :${port} -sTCP:LISTEN`, {
        encoding: 'utf8',
        timeout: 5000,
        stdio: ['pipe', 'pipe', 'pipe'],
      })
      return true
    }
  } catch {
    // Command failed = port not in use (or command not found, assume available)
    return false
  }
}

/**
 * Find a free port starting from the given port.
 * Returns the first available port.
 */
function findFreePort(startPort: number, maxAttempts = 20): number {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    if (!isPortInUse(port)) {
      return port
    }
  }
  // Fallback: return a port in the dynamic range
  return 3000 + Math.floor(Math.random() * 1000)
}

// Ensure Playwright has access to the same env vars as Next.js dev.
// - Does not override already-set process.env (CI or shell takes precedence).
// - Keeps E2E runs deterministic without requiring cross-env for every command.
for (const file of ['.env.local', '.env']) {
  const fullPath = path.join(process.cwd(), file)
  if (fs.existsSync(fullPath)) dotenv.config({ path: fullPath, override: false })
}

// Restore shell value if it was set (dotenv should NOT have overridden it, but just in case)
if (shellReuseServer != null) {
  process.env.REUSE_EXISTING_SERVER = shellReuseServer
}

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

const isCI = !!process.env.CI
const isProdTest = process.env.TEST_PROD === 'true'
const outputDir = process.env.PW_OUTPUT_DIR || 'test-results'
// E2E should be self-contained by default (start its own server) to avoid
// flakiness when no dev server is running.
// Override explicitly via REUSE_EXISTING_SERVER=true/false.
const reuseExistingServer =
  process.env.REUSE_EXISTING_SERVER != null
    ? process.env.REUSE_EXISTING_SERVER === 'true'
    : false

// Determine if we should auto-pick a free port:
// - Only when NOT reusing an existing server
// - Only when BASE_URL was NOT explicitly set by the user
// - Only for local hosts (localhost / 127.0.0.1)
const explicitBaseURL = shellBaseURL // captured before dotenv
const defaultBaseURL = 'http://localhost:3000'
const rawBaseURL = explicitBaseURL || defaultBaseURL
const parsedBase = new URL(rawBaseURL)
const isLocalHost =
  parsedBase.hostname === 'localhost' || parsedBase.hostname === '127.0.0.1'
const defaultPort = parseInt(parsedBase.port || '3000', 10)

// Auto-pick logic: find a free port if conditions are met
let finalPort = defaultPort
let didAutoPickPort = false

if (!reuseExistingServer && !explicitBaseURL && isLocalHost) {
  // Check if the default port is in use
  if (isPortInUse(defaultPort)) {
    finalPort = findFreePort(defaultPort + 1)
    didAutoPickPort = true
  }
}

// Construct the final baseURL
const baseURL = explicitBaseURL
  ? explicitBaseURL
  : `${parsedBase.protocol}//${parsedBase.hostname}:${finalPort}`

const basePort = String(finalPort)

// Debug: Log the configuration
console.log('[Playwright Config] REUSE_EXISTING_SERVER:', process.env.REUSE_EXISTING_SERVER, '-> reuseExistingServer:', reuseExistingServer)
if (didAutoPickPort) {
  console.log(`[Playwright Config] Port ${defaultPort} is busy, auto-picked port: ${finalPort}`)
}
console.log('[Playwright Config] baseURL:', baseURL)
// Use an endpoint that should reliably return 2xx once Next is up.
// NOTE: /robots.txt can be affected by app metadata/route issues; /en is a
// better readiness signal for this app.
const webServerURL = `${baseURL}/en`
const timestampedReport =
  process.env.PW_TIMESTAMPED_REPORT === 'true' ||
  process.env.PW_TIMESTAMPED_REPORT === '1'

const htmlReportFolder =
  process.env.PW_HTML_REPORT_DIR ||
  (timestampedReport ? `playwright-report-${Date.now()}` : 'playwright-report')

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
  ...(isProdTest && !isCI ? {} : { workers: 1 }),

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
    // Even when reusing an existing dev server, the first request to a route can
    // trigger slow on-demand compilation. Keep the readiness timeout generous.
    timeout: 120_000,
    ...(isCI ? { stdout: 'pipe', stderr: 'pipe' } : {}),
  },

  // Output directory for test artifacts
  outputDir,

  // Expect configuration
  expect: {
    // Increase timeout for accessibility tests
    timeout: 10_000,
  },
})
