import { spawn } from 'node:child_process'

const args = process.argv.slice(2)

// pnpm forwards a literal "--" into script args on this setup.
// Playwright treats it as a positional test-file pattern and reports "No tests found".
const cleanedArgs = args.filter(a => a !== '--')

const isWin = process.platform === 'win32'

const child = isWin
  ? spawn('cmd.exe', ['/d', '/s', '/c', 'pnpm', 'exec', 'playwright', ...cleanedArgs], {
      stdio: 'inherit',
      env: process.env,
    })
  : spawn('pnpm', ['exec', 'playwright', ...cleanedArgs], {
      stdio: 'inherit',
      env: process.env,
    })

child.on('exit', (code, signal) => {
  if (typeof code === 'number') process.exit(code)
  process.exit(signal ? 1 : 0)
})
