import { spawn } from 'node:child_process'
import path from 'node:path'
import './clear-next-dev-lock.mjs'

const repoRoot = process.cwd()
const nextCliPath = path.join(repoRoot, 'node_modules', 'next', 'dist', 'bin', 'next')

const port = process.env.PORT || '3000'
const hostname = process.env.HOSTNAME || '127.0.0.1'
const useTurbo = process.env.PW_USE_WEBPACK !== 'true'

const nextArgs = ['dev', ...(useTurbo ? ['--turbo'] : ['--webpack']), '-H', hostname, '-p', port]

const child = spawn(process.execPath, [nextCliPath, ...nextArgs], {
  stdio: 'inherit',
  env: process.env,
})

const shutdownSignals = ['SIGINT', 'SIGTERM']
for (const signal of shutdownSignals) {
  process.on(signal, () => {
    try {
      child.kill(signal)
    } catch {}
  })
}

child.on('exit', (code, signal) => {
  if (typeof code === 'number') process.exit(code)
  process.exit(signal ? 1 : 0)
})

