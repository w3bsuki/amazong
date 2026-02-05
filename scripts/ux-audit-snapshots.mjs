import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { chromium } from "@playwright/test"

function getArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function parseViewportPreset(raw) {
  if (!raw) return { width: 390, height: 844 }

  const normalized = String(raw).trim().toLowerCase()
  if (normalized === "desktop") return { width: 1280, height: 720 }
  if (normalized === "mobile" || normalized === "iphone") return { width: 390, height: 844 }

  const match = normalized.match(/^(\d{2,4})x(\d{2,4})$/)
  if (match) {
    const width = Number.parseInt(match[1], 10)
    const height = Number.parseInt(match[2], 10)
    if (Number.isFinite(width) && Number.isFinite(height)) {
      return { width, height }
    }
  }

  return { width: 390, height: 844 }
}

function formatDateFolder(d) {
  return d.toISOString().slice(0, 10)
}

const baseUrlRaw = getArg("--base-url") ?? process.env.BASE_URL ?? "http://127.0.0.1:3000"
const locale = getArg("--locale") ?? "bg"
const outDirRaw = getArg("--out-dir") ?? path.join("cleanup", "ux-snapshots", formatDateFolder(new Date()))
const viewportPreset = getArg("--viewport")
const timeoutMs = Number(getArg("--timeout") ?? "60000")
const headless = !hasFlag("--headed")

const baseUrl = String(baseUrlRaw).replace(/\/+$/, "")
const outDir = path.isAbsolute(outDirRaw) ? outDirRaw : path.join(process.cwd(), outDirRaw)
const viewport = parseViewportPreset(viewportPreset)

async function captureShot(page, { name, urlPath, prepare }) {
  const url = `${baseUrl}/${locale}${urlPath}`.replace(/\/{2,}/g, "/").replace(/^https:\//, "https://").replace(/^http:\//, "http://")
  const outPng = path.join(outDir, `${name}.png`)
  const outConsole = path.join(outDir, `${name}.console.json`)

  const consoleMessages = []
  const onConsole = (msg) => {
    const type = msg.type()
    if (type === "error" || type === "warning") {
      consoleMessages.push({ type, text: msg.text(), location: msg.location() })
    }
  }

  page.on("console", onConsole)
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs })
    if (prepare) await prepare(page)

    await page.screenshot({ path: outPng, fullPage: false, scale: "css", type: "png" })
    await writeFile(
      outConsole,
      JSON.stringify({ url, capturedAt: new Date().toISOString(), messages: consoleMessages }, null, 2),
      "utf8"
    )

    return { name, url, screenshot: outPng, console: outConsole, warningsErrors: consoleMessages.length }
  } finally {
    page.off("console", onConsole)
  }
}

async function waitForDrawer(page) {
  await page.locator('[data-slot="drawer-content"]').first().waitFor({ state: "visible", timeout: timeoutMs })
}

async function closeDrawer(page) {
  await page.keyboard.press("Escape").catch(() => {})
  await page.locator('[data-slot="drawer-content"]').first().waitFor({ state: "hidden", timeout: timeoutMs }).catch(() => {})
}

async function openQuickViewFromSearch(page) {
  const grid = page.locator("#product-grid").first()
  await grid.waitFor({ state: "visible", timeout: timeoutMs })
  const link = grid.locator('a[data-slot="product-card-link"], a[aria-label]').first()
  await link.waitFor({ state: "visible", timeout: timeoutMs })
  await link.scrollIntoViewIfNeeded()
  await link.click()
  await waitForDrawer(page)
}

async function openCategoryDrawerRoot(page) {
  const chips = page.locator('button[aria-pressed]').first()
  await chips.waitFor({ state: "visible", timeout: timeoutMs })
  await chips.click()
  await waitForDrawer(page)
}

async function openCategoryDrawerScoped(page) {
  const chips = page.locator('button[aria-pressed]')
  await chips.nth(1).waitFor({ state: "visible", timeout: timeoutMs })
  await chips.nth(1).click()
  await waitForDrawer(page)
}

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless })
const context = await browser.newContext({
  viewport,
  isMobile: viewport.width <= 500,
  hasTouch: viewport.width <= 500,
})
const page = await context.newPage()

try {
  const results = []

  results.push(
    await captureShot(page, {
      name: "home",
      urlPath: "",
      prepare: async (p) => {
        await p.locator("#main-content").first().waitFor({ state: "visible", timeout: timeoutMs })
      },
    })
  )

  results.push(
    await captureShot(page, {
      name: "quick-view",
      urlPath: "/search?q=test",
      prepare: async (p) => {
        await openQuickViewFromSearch(p)
      },
    })
  )
  await closeDrawer(page)

  results.push(
    await captureShot(page, {
      name: "category-drawer-root",
      urlPath: "",
      prepare: async (p) => {
        await openCategoryDrawerRoot(p)
      },
    })
  )
  await closeDrawer(page)

  results.push(
    await captureShot(page, {
      name: "category-drawer-scoped",
      urlPath: "",
      prepare: async (p) => {
        await openCategoryDrawerScoped(p)
      },
    })
  )
  await closeDrawer(page)

  console.log(JSON.stringify({ ok: true, outDir, viewport, results }, null, 2))
} finally {
  await page.close().catch(() => {})
  await context.close().catch(() => {})
  await browser.close().catch(() => {})
}

