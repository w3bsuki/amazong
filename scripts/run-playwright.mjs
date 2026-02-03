import { spawn } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const READY_PATH = process.env.PW_READY_PATH || '/api/health/env'

async function detectRunningBaseURL() {
  if (process.env.BASE_URL) return process.env.BASE_URL

  const host = process.env.PW_E2E_HOST || '127.0.0.1'

  // If a port is explicitly provided, prefer it.
  if (process.env.PORT) {
    return `http://${host}:${process.env.PORT}`
  }

  // Only attempt auto-detection when the caller asked to reuse an existing server.
  if (process.env.REUSE_EXISTING_SERVER !== 'true') return undefined

  const portsToTry = Array.from({ length: 11 }, (_, i) => 3000 + i)

  for (const port of portsToTry) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 800)

    try {
      // Prefer a lightweight endpoint so cold starts don't time out on Windows.
      const res = await fetch(`http://${host}:${port}${READY_PATH}`, {
        method: 'GET',
        signal: controller.signal,
      })

      if (res.ok) {
        return `http://${host}:${port}`
      }
    } catch {
      // ignore
    } finally {
      clearTimeout(timeout)
    }
  }

  return undefined
}

async function isPortFree(port) {
  return await new Promise((resolve) => {
    const server = net.createServer()
    server.unref()
    server.on('error', () => resolve(false))
    server.listen({ port, host: '127.0.0.1' }, () => {
      server.close(() => resolve(true))
    })
  })
}

async function findFreePort(startPort = 3000, attempts = 20) {
  for (let offset = 0; offset < attempts; offset++) {
    const port = startPort + offset
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) return port
  }
  return startPort
}

async function waitForServerReady(baseURL, timeoutMs = 120_000) {
  const startedAt = Date.now()
  const url = `${baseURL}${READY_PATH}`

  while (Date.now() - startedAt < timeoutMs) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2_500)

    try {
      const res = await fetch(url, { method: 'GET', signal: controller.signal })
      if (res.ok) return
    } catch {
      // ignore
    } finally {
      clearTimeout(timeout)
    }

    // eslint-disable-next-line no-await-in-loop
    await delay(250)
  }

  throw new Error(`[e2e] Timed out waiting for server readiness at ${url}`)
}

const args = process.argv.slice(2)

// pnpm forwards a literal "--" into script args on this setup.
// Playwright treats it as a positional test-file pattern and reports "No tests found".
const cleanedArgs = args.filter(a => a !== '--')

const isWin = process.platform === 'win32'

const repoRoot = process.cwd()
const host = process.env.PW_E2E_HOST || '127.0.0.1'

const detectedBaseURL = await detectRunningBaseURL()
const env = { ...process.env }

// Force Playwright to not manage webServer; we manage it here for Windows reliability.
env.PW_SKIP_WEBSERVER = 'true'

let serverProc = null
let startedServer = false

try {
  if (detectedBaseURL) {
    env.BASE_URL = detectedBaseURL
  } else {
    const requestedPort = process.env.PORT ? Number(process.env.PORT) : undefined
    const port = Number.isFinite(requestedPort) ? requestedPort : await findFreePort(3000)
    const baseURL = `http://${host}:${port}`

    const webServerEnv = {
      ...process.env,
      NEXT_PUBLIC_E2E: 'true',
      PORT: String(port),
      HOSTNAME: host,
    }

    const serverScript = path.join(repoRoot, 'scripts', 'playwright-web-server.mjs')
    serverProc = spawn(process.execPath, [serverScript], {
      stdio: 'inherit',
      env: webServerEnv,
    })
    startedServer = true
    env.BASE_URL = baseURL

    await waitForServerReady(baseURL, 120_000)
  }

  const child = isWin
    ? spawn('cmd.exe', ['/d', '/s', '/c', 'pnpm', 'exec', 'playwright', ...cleanedArgs], {
        stdio: 'inherit',
        env,
      })
    : spawn('pnpm', ['exec', 'playwright', ...cleanedArgs], {
        stdio: 'inherit',
        env,
      })

  const code = await new Promise((resolve) => {
    child.on('exit', (exitCode, signal) => {
      if (typeof exitCode === 'number') return resolve(exitCode)
      resolve(signal ? 1 : 0)
    })
  })

  process.exit(code)
} finally {
  if (startedServer && serverProc && !serverProc.killed) {
    if (isWin) {
      // Ensure the entire process tree is terminated on Windows.
      spawn('cmd.exe', ['/d', '/s', '/c', 'taskkill', '/PID', String(serverProc.pid), '/T', '/F'], {
        stdio: 'ignore',
      })
    } else {
      try {
        serverProc.kill('SIGTERM')
      } catch {}
    }
  }
}
