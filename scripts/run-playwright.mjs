import { spawn } from 'node:child_process'

async function detectRunningBaseURL() {
  if (process.env.BASE_URL) return process.env.BASE_URL

  // If a port is explicitly provided, prefer it.
  if (process.env.PORT) {
    return `http://localhost:${process.env.PORT}`
  }

  // Only attempt auto-detection when the caller asked to reuse an existing server.
  if (process.env.REUSE_EXISTING_SERVER !== 'true') return undefined

  const portsToTry = Array.from({ length: 11 }, (_, i) => 3000 + i)

  for (const port of portsToTry) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 800)

    try {
      // Prefer a localized route as a readiness signal for this app.
      const res = await fetch(`http://localhost:${port}/en`, {
        method: 'GET',
        signal: controller.signal,
      })

      if (res.ok) {
        return `http://localhost:${port}`
      }
    } catch {
      // ignore
    } finally {
      clearTimeout(timeout)
    }
  }

  return undefined
}

const args = process.argv.slice(2)

// pnpm forwards a literal "--" into script args on this setup.
// Playwright treats it as a positional test-file pattern and reports "No tests found".
const cleanedArgs = args.filter(a => a !== '--')

const isWin = process.platform === 'win32'

const detectedBaseURL = await detectRunningBaseURL()
const env = detectedBaseURL ? { ...process.env, BASE_URL: detectedBaseURL } : process.env

const child = isWin
  ? spawn('cmd.exe', ['/d', '/s', '/c', 'pnpm', 'exec', 'playwright', ...cleanedArgs], {
      stdio: 'inherit',
      env,
    })
  : spawn('pnpm', ['exec', 'playwright', ...cleanedArgs], {
      stdio: 'inherit',
      env,
    })

child.on('exit', (code, signal) => {
  if (typeof code === 'number') process.exit(code)
  process.exit(signal ? 1 : 0)
})
