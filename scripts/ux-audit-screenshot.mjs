import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'

function getArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

const url = getArg('--url')
const outPath = getArg('--out')
const waitForSelector = getArg('--wait-for')
const timeoutMs = Number(getArg('--timeout') ?? '60000')
const fullPage = !hasFlag('--no-full-page')
const headless = !hasFlag('--headed')

if (!url || !outPath) {
  console.error('Usage: pnpm -s exec node scripts/ux-audit-screenshot.mjs --url <url> --out <path> [--wait-for <css>] [--timeout <ms>] [--headed] [--no-full-page]')
  process.exit(2)
}

const outAbs = path.isAbsolute(outPath) ? outPath : path.join(process.cwd(), outPath)
const consoleOutAbs = outAbs.replace(/\.png$/i, '') + '.console.json'

await mkdir(path.dirname(outAbs), { recursive: true })

const browser = await chromium.launch({ headless })
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const page = await context.newPage()

const consoleMessages = []
page.on('console', (msg) => {
  const type = msg.type()
  if (type === 'error' || type === 'warning') {
    consoleMessages.push({
      type,
      text: msg.text(),
      location: msg.location(),
    })
  }
})

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs })
  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, { timeout: timeoutMs })
  }

  await page.screenshot({ path: outAbs, fullPage, scale: 'css', type: 'png' })
  await writeFile(consoleOutAbs, JSON.stringify({ url, capturedAt: new Date().toISOString(), messages: consoleMessages }, null, 2), 'utf8')

  console.log(JSON.stringify({ ok: true, url, screenshot: outAbs, console: consoleOutAbs, warningsErrors: consoleMessages.length }))
} finally {
  await page.close().catch(() => {})
  await context.close().catch(() => {})
  await browser.close().catch(() => {})
}
