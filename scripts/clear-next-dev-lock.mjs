import fs from 'node:fs'
import path from 'node:path'

const devDir = path.join(process.cwd(), '.next', 'dev')
const lockPath = path.join(devDir, 'lock')
const logsDir = path.join(devDir, 'logs')

try {
  if (fs.existsSync(lockPath)) {
    fs.rmSync(lockPath, { force: true })
    // Keep output minimal; Playwright webServer logs can get noisy.
    if (process.env.PW_DEBUG_CONFIG === 'true') {
      console.log('[preflight] Removed .next/dev/lock')
    }
  }
} catch (err) {
  if (process.env.PW_DEBUG_CONFIG === 'true') {
    console.warn('[preflight] Failed removing .next/dev/lock:', err)
  }
}

try {
  if (fs.existsSync(logsDir)) {
    fs.rmSync(logsDir, { recursive: true, force: true })
    if (process.env.PW_DEBUG_CONFIG === 'true') {
      console.log('[preflight] Removed .next/dev/logs')
    }
  }
} catch (err) {
  if (process.env.PW_DEBUG_CONFIG === 'true') {
    console.warn('[preflight] Failed removing .next/dev/logs:', err)
  }
}
