import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const nextCliPath = path.join(repoRoot, 'node_modules', 'next', 'dist', 'bin', 'next')

const lockDir = path.join(repoRoot, '.codex', 'locks')
const lockPath = path.join(lockDir, 'next-build.lock')

// `pnpm <script> -- <args>` can include a literal `--` in argv; don’t forward it to Next.
const args = process.argv.slice(2).filter((arg) => arg !== '--')
if (args.includes('--webpack')) {
  console.error('[build] Refusing to run with --webpack (Turbopack-only repo policy).')
  process.exit(1)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isPidRunning(pid) {
  if (!Number.isFinite(pid) || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (err) {
    // EPERM can happen in restricted environments; treat as "running" to be safe.
    if (err && typeof err === 'object' && 'code' in err && err.code === 'EPERM') return true
    return false
  }
}

async function acquireRepoBuildLock() {
  fs.mkdirSync(lockDir, { recursive: true })

  const waitMs = Number(process.env.NEXT_BUILD_LOCK_WAIT_MS ?? 5 * 60 * 1000)
  const startedAt = Date.now()

  const payload = JSON.stringify({
    pid: process.pid,
    createdAt: new Date().toISOString(),
    argv: process.argv,
  }) + '\n'

  while (true) {
    try {
      fs.writeFileSync(lockPath, payload, { flag: 'wx' })
      return () => {
        try {
          fs.rmSync(lockPath, { force: true })
        } catch {}
      }
    } catch (err) {
      if (!(err && typeof err === 'object' && 'code' in err && err.code === 'EEXIST')) {
        throw err
      }

      // Try to clear stale locks (e.g. power loss / hard crash).
      try {
        const existing = JSON.parse(fs.readFileSync(lockPath, 'utf8'))
        const existingPid = Number(existing?.pid)
        if (!Number.isNaN(existingPid) && !isPidRunning(existingPid)) {
          fs.rmSync(lockPath, { force: true })
          continue
        }
      } catch {
        // If the lock is unreadable, don't delete it blindly; just wait.
      }

      if (Date.now() - startedAt > waitMs) {
        console.error(`[build] Timed out waiting for repo build lock at ${lockPath}`)
        console.error('[build] Stop the other build process and try again.')
        process.exit(1)
      }

      await sleep(250)
    }
  }
}

async function removeNextDirWithRetries() {
  const distDir = path.join(repoRoot, '.next')
  if (!fs.existsSync(distDir)) return
  if (process.env.NEXT_BUILD_SKIP_CLEAN === 'true') return

  // Windows can report ENOTEMPTY/EPERM briefly if previous workers are still exiting.
  const retryable = new Set(['ENOTEMPTY', 'EPERM', 'EBUSY'])
  for (let attempt = 1; attempt <= 12; attempt++) {
    try {
      fs.rmSync(distDir, { recursive: true, force: true })
      return
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? err.code : undefined
      if (!retryable.has(code)) throw err
      await sleep(250 * attempt)
    }
  }

  // Last try (surface the error)
  fs.rmSync(distDir, { recursive: true, force: true })
}

async function main() {
  const releaseLock = await acquireRepoBuildLock()

  try {
    await removeNextDirWithRetries()

    const nextArgs = ['build', '--turbopack', ...args]
    const child = spawn(process.execPath, [nextCliPath, ...nextArgs], {
      stdio: 'inherit',
      env: {
        ...process.env,
        // Helps Next.js pick Turbopack-specific messaging/paths consistently.
        TURBOPACK: process.env.TURBOPACK ?? '1',
      },
    })

    const code = await new Promise((resolve) => {
      child.on('exit', (exitCode) => resolve(exitCode ?? 1))
    })
    process.exit(code)
  } finally {
    releaseLock()
  }
}

main().catch((err) => {
  console.error('[build] Fatal error:', err)
  process.exit(1)
})
