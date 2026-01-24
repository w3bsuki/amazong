import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium, devices } from '@playwright/test'

function getArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

const baseURL = getArg('--base-url') ?? 'http://127.0.0.1:3000'
const locale = getArg('--locale') ?? 'en'
const outDirArg = getArg('--out-dir')
const timeoutMs = Number(getArg('--timeout') ?? '120000')
const headless = !hasFlag('--headed')

const outDir = outDirArg
  ? path.isAbsolute(outDirArg)
    ? outDirArg
    : path.join(process.cwd(), outDirArg)
  : path.join(process.cwd(), 'test-results', `pdp-audit-${Date.now()}`)

await mkdir(outDir, { recursive: true })

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`Fetch ${url} failed (${res.status})`)
  return res.json()
}

let seller = getArg('--seller')
let productSlug = getArg('--slug')

if (!seller || !productSlug) {
  const newest = await fetchJson(new URL('/api/products/newest', baseURL))
  const products = Array.isArray(newest?.products) ? newest.products : []
  const first = products.find((p) => p?.storeSlug && (p?.slug || p?.id))
  if (!first) {
    throw new Error('No products returned from /api/products/newest')
  }
  seller = String(first.storeSlug)
  productSlug = String(first.slug || first.id)
}

const productUrl = new URL(`/${locale}/${seller}/${productSlug}`, baseURL).toString()

const scenarios = [
  { name: 'desktop-light', device: devices['Desktop Chrome'], dark: false },
  { name: 'desktop-dark', device: devices['Desktop Chrome'], dark: true },
  { name: 'mobile-light', device: devices['iPhone 12'], dark: false },
  { name: 'mobile-dark', device: devices['iPhone 12'], dark: true },
]

const browser = await chromium.launch({ headless })

try {
  for (const scenario of scenarios) {
    const consoleMessages = []

    const context = await browser.newContext({
      ...scenario.device,
      locale: locale === 'bg' ? 'bg-BG' : 'en-US',
      // Ensure stable screenshots regardless of host OS fonts.
      // Use the device profile viewport; avoid scaling mismatches.
      deviceScaleFactor: scenario.device.deviceScaleFactor ?? 1,
    })

    if (scenario.dark) {
      await context.addInitScript(() => {
        document.documentElement.classList.add('dark')
      })
    }

    const page = await context.newPage()

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

    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: timeoutMs })
    await page.waitForSelector('main, #main-content', { timeout: timeoutMs })

    const fullPath = path.join(outDir, `${scenario.name}.png`)
    const consolePath = path.join(outDir, `${scenario.name}.console.json`)

    await page.screenshot({ path: fullPath, fullPage: true, scale: 'css', type: 'png' })

    // Mobile-specific: capture the tabs states (if present)
    if (scenario.name.startsWith('mobile')) {
      const tabsList = page.locator('[data-slot="tabs-list"]').first()
      const hasTabs = (await tabsList.count()) > 0

      if (hasTabs) {
        await tabsList.scrollIntoViewIfNeeded()
        await page.waitForTimeout(250)

        const tabsAreaPath = path.join(outDir, `${scenario.name}-tabs-specs.png`)
        await page.screenshot({ path: tabsAreaPath, fullPage: false, scale: 'css', type: 'png' })

        const descriptionTab = page.getByRole('tab', { name: /description/i }).first()
        if ((await descriptionTab.count()) > 0) {
          await descriptionTab.click()
          await page.waitForTimeout(250)
          const descPath = path.join(outDir, `${scenario.name}-tabs-description.png`)
          await page.screenshot({ path: descPath, fullPage: false, scale: 'css', type: 'png' })
        }
      }
    }

    await writeFile(
      consolePath,
      JSON.stringify(
        {
          scenario: scenario.name,
          url: productUrl,
          capturedAt: new Date().toISOString(),
          messages: consoleMessages,
        },
        null,
        2,
      ),
      'utf8',
    )

    await page.close().catch(() => {})
    await context.close().catch(() => {})
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        outDir,
        productUrl,
      },
      null,
      2,
    ),
  )
} finally {
  await browser.close().catch(() => {})
}

