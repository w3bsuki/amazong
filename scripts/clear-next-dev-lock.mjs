import fs from 'node:fs'
import path from 'node:path'

const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock')

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
