import { defineConfig, devices } from '@playwright/test'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

// Capture shell environment BEFORE dotenv runs
const shellReuseServer = process.env.REUSE_EXISTING_SERVER
const shellBaseURL = process.env.BASE_URL
// Internal latch: when we auto-pick a port, persist it so subsequent config
// evaluations (Playwright can load config in multiple processes) stay consistent.
const latchedBaseURL = process.env.PW_LATCHED_BASE_URL
const latchedPort = process.env.PW_LATCHED_PORT

/**
 * Check if a port is currently in use (synchronous via spawnSync).
 * Returns true if port is occupied, false if available.
 */
function isPortInUse(port: number): boolean {
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
const debugConfig =
  process.env.PW_DEBUG_CONFIG === 'true' || process.env.PW_DEBUG_CONFIG === '1'
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
// Prefer 127.0.0.1 over localhost on Windows to avoid IPv6 ::1 resolution
// mismatches when the dev server is bound to IPv4 only.
const defaultBaseURL = 'http://127.0.0.1:3000'
const rawBaseURL = explicitBaseURL || latchedBaseURL || defaultBaseURL
const parsedBase = new URL(rawBaseURL)
const isLocalHost =
  parsedBase.hostname === 'localhost' || parsedBase.hostname === '127.0.0.1'
const defaultPort = latchedPort
  ? Number.parseInt(latchedPort, 10)
  : Number.parseInt(parsedBase.port || '3000', 10)

// Auto-pick logic: find a free port if conditions are met
let finalPort = defaultPort
let didAutoPickPort = false

if (
  !reuseExistingServer &&
  !explicitBaseURL &&
  !latchedBaseURL &&
  isLocalHost &&
  isPortInUse(defaultPort)
) {
  finalPort = findFreePort(defaultPort + 1)
  didAutoPickPort = true
}

// Construct the final baseURL
const baseURL = explicitBaseURL
  ? explicitBaseURL
  : latchedBaseURL
    ? latchedBaseURL
    : `${parsedBase.protocol}//${parsedBase.hostname}:${finalPort}`

const basePort = String(finalPort)

// Latch computed baseURL/port for consistency across Playwright processes.
// Do not override a user-provided BASE_URL.
if (!explicitBaseURL) {
  process.env.PW_LATCHED_BASE_URL = baseURL
  process.env.PW_LATCHED_PORT = basePort
}

// Propagate resolved values so fixtures that read process.env directly stay in sync.
process.env.BASE_URL = baseURL
process.env.PORT = basePort

// Safety: avoid accidentally running E2E against production/staging (can create data).
// Override explicitly when you really intend to run against a remote environment.
const allowNonLocalE2E =
  process.env.PW_ALLOW_NON_LOCAL === 'true' ||
  process.env.PW_ALLOW_NON_LOCAL === '1' ||
  process.env.E2E_ALLOW_NON_LOCAL === 'true' ||
  process.env.E2E_ALLOW_NON_LOCAL === '1'

const finalBase = new URL(baseURL)
const isFinalLocalHost =
  finalBase.hostname === 'localhost' || finalBase.hostname === '127.0.0.1'

if (!isFinalLocalHost && !allowNonLocalE2E) {
  throw new Error(
    `[Playwright Config] Refusing to run against non-local BASE_URL (${baseURL}). ` +
      `Set PW_ALLOW_NON_LOCAL=true (or E2E_ALLOW_NON_LOCAL=true) to override.`
  )
}

if (debugConfig) {
  // Debug: Log the configuration (quiet by default for CI/tooling like knip)
  console.log(
    '[Playwright Config] REUSE_EXISTING_SERVER:',
    process.env.REUSE_EXISTING_SERVER,
    '-> reuseExistingServer:',
    reuseExistingServer
  )
  if (didAutoPickPort) {
    console.log(
      `[Playwright Config] Port ${defaultPort} is busy, auto-picked port: ${finalPort}`
    )
  }
  console.log('[Playwright Config] baseURL:', baseURL)
}
// Use an endpoint that should reliably return 2xx once Next is up.
// NOTE: /robots.txt can be affected by app metadata/route issues; /en is a
// better readiness signal for this app.
const webServerURL = `${baseURL}/en`
const timestampedReport =
  process.env.PW_TIMESTAMPED_REPORT === 'true' ||
  process.env.PW_TIMESTAMPED_REPORT === '1'

const skipWebServer =
  process.env.PW_SKIP_WEBSERVER === 'true' || process.env.PW_SKIP_WEBSERVER === '1'

const htmlReportFolder =
  process.env.PW_HTML_REPORT_DIR ||
  (timestampedReport ? `playwright-report-${Date.now()}` : 'playwright-report')

function envWith(overrides: Record<string, string>): Record<string, string> {
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string') env[key] = value
  }
  for (const [key, value] of Object.entries(overrides)) env[key] = value
  return env
}

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
  //
  // With `exactOptionalPropertyTypes: true`, avoid `webServer: undefined`.
  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command:
            process.env.TEST_PROD === 'true'
              ? `pnpm -s build && pnpm -s start`
              : `node scripts/playwright-web-server.mjs`,
          url: webServerURL,
          reuseExistingServer,
          env:
            process.env.TEST_PROD === 'true'
              ? envWith({ PORT: basePort })
              : envWith({
                  NEXT_PUBLIC_E2E: 'true',
                  PW_USE_WEBPACK: 'true',
                  PORT: basePort,
                  HOSTNAME: '127.0.0.1',
                }),
          // Even when reusing an existing dev server, the first request to a route can
          // trigger slow on-demand compilation. Keep the readiness timeout generous.
          timeout: 120_000,
          ...(isCI ? { stdout: 'pipe', stderr: 'pipe' } : {}),
        },
      }),

  // Output directory for test artifacts
  outputDir,

  // Expect configuration
  expect: {
    // Increase timeout for accessibility tests
    timeout: 10_000,
  },
})
