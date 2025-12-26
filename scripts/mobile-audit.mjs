import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function formatPx(value) {
  if (value == null || Number.isNaN(value)) return null;
  return Math.round(value);
}

function keyForTarget(t) {
  return [t.tag, t.role ?? "", t.ariaLabel ?? "", t.href ?? "", t.text ?? ""].join("|");
}

const baseUrl = process.argv[2] || "http://localhost:3000/bg";
const viewport = { width: 390, height: 844 };

const outDir = path.join(process.cwd(), "cleanup", `mobile-audit-${nowStamp()}`);
mkdirp(outDir);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

page.setDefaultTimeout(120_000);

// Some Next.js streaming pages can behave oddly with domcontentloaded in automation.
// Wait for the initial navigation to commit, then wait for stable UI anchors.
await page.goto(baseUrl, { waitUntil: "commit", timeout: 120_000 });
await page.waitForSelector("main", { state: "attached" });
// Best-effort: don't block forever on long-polling requests.
await page.waitForLoadState("domcontentloaded").catch(() => {});

// Ensure layout has settled (fonts/styles) before measurements.
await page
  .evaluate(async () => {
    try {
      // @ts-ignore
      if (document.fonts?.ready) {
        // @ts-ignore
        await document.fonts.ready
      }
    } catch {}
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  })
  .catch(() => {});

const documentInfo = await page.evaluate(() => {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  return {
    url: location.href,
    title: document.title,
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      dpr: window.devicePixelRatio,
    },
    root: {
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
      lineHeight: cs.lineHeight,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
    },
    userAgent: navigator.userAgent,
    doc: {
      scrollHeight: document.body.scrollHeight,
      clientHeight: root.clientHeight,
    },
  };
});

async function collectViewportMetrics(label) {
  return await page.evaluate((label) => {
    const px = (v) => (v == null ? null : Math.round(v));

    const isVisible = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
      const r = el.getBoundingClientRect();
      if (!isFinite(r.width) || !isFinite(r.height)) return false;
      if (r.width < 1 || r.height < 1) return false;
      const inViewport = r.bottom >= 0 && r.right >= 0 && r.top <= window.innerHeight && r.left <= window.innerWidth;
      return inViewport;
    };

    const elInfo = (el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
      return {
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute("role"),
        ariaLabel: el.getAttribute("aria-label"),
        href: el.getAttribute("href"),
        text,
        rect: { x: px(r.x), y: px(r.y), w: px(r.width), h: px(r.height) },
        styles: {
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          textTransform: cs.textTransform,
        },
      };
    };

    const clickables = Array.from(
      document.querySelectorAll("a,button,[role=\"button\"],input[type=button],input[type=submit]")
    ).filter(isVisible);

    const textEls = Array.from(document.querySelectorAll("main h1, main h2, main h3, main p, main span, main a, main button"))
      .filter(isVisible)
      .slice(0, 1200);

    const tapTargets = clickables
      .map(elInfo)
      .map((x) => ({
        ...x,
        tap: {
          meets44: x.rect.w >= 44 && x.rect.h >= 44,
          meets48: x.rect.w >= 48 && x.rect.h >= 48,
        },
      }));

    const failing44 = tapTargets
      .filter((t) => !t.tap.meets44)
      .sort((a, b) => (a.rect.y - b.rect.y) || (a.rect.w * a.rect.h - b.rect.w * b.rect.h))
      .slice(0, 80);

    const fontFamilies = new Map();
    const fontSizes = new Map();
    const lineHeights = new Map();

    for (const el of textEls) {
      const cs = getComputedStyle(el);
      const ff = cs.fontFamily;
      const fs = cs.fontSize;
      const lh = cs.lineHeight;
      fontFamilies.set(ff, (fontFamilies.get(ff) || 0) + 1);
      fontSizes.set(fs, (fontSizes.get(fs) || 0) + 1);
      lineHeights.set(lh, (lineHeights.get(lh) || 0) + 1);
    }

    const toSortedCounts = (m) =>
      Array.from(m.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => ({ value: k, count: v }));

    const largestText = textEls
      .map(elInfo)
      .map((x) => ({
        ...x,
        fontPx: parseFloat(x.styles.fontSize || "0") || 0,
      }))
      .sort((a, b) => b.fontPx - a.fontPx)
      .slice(0, 25);

    return {
      label,
      viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      counts: {
        clickablesInViewport: clickables.length,
        tapTargetsFailing44: tapTargets.filter((t) => !t.tap.meets44).length,
        textElementsSampled: textEls.length,
      },
      distributions: {
        fontFamilies: toSortedCounts(fontFamilies).slice(0, 6),
        fontSizes: toSortedCounts(fontSizes).slice(0, 12),
        lineHeights: toSortedCounts(lineHeights).slice(0, 12),
      },
      largestText,
      failingTapTargets44: failing44,
    };
  }, label);
}

const scrollHeight = documentInfo.doc.scrollHeight;
const step = Math.max(500, Math.floor(viewport.height * 0.85));
const scrollPoints = [0];
for (let y = step; y < scrollHeight; y += step) scrollPoints.push(y);

const sections = [];
for (let i = 0; i < Math.min(scrollPoints.length, 6); i++) {
  const y = scrollPoints[i];
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(150);
  await page
    .evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    .catch(() => {});

  const label = `scrollY=${y}`;
  const shotPath = path.join(outDir, `viewport-${String(i).padStart(2, "0")}.png`);
  await page.screenshot({ path: shotPath, fullPage: false });

  sections.push(await collectViewportMetrics(label));
}

// Full-page screenshot (useful for quick visual scan)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(250);
await page.screenshot({ path: path.join(outDir, "fullpage.png"), fullPage: true });

// Merge failing tap targets across scroll points, de-dupe
const allFailing = new Map();
for (const s of sections) {
  for (const t of s.failingTapTargets44) {
    const k = keyForTarget(t);
    const existing = allFailing.get(k);
    if (!existing) allFailing.set(k, t);
  }
}

const report = {
  documentInfo,
  viewport,
  sections,
  summary: {
    totalFailingTapTargets44: allFailing.size,
    topFailingTapTargets44: Array.from(allFailing.values())
      .sort((a, b) => (a.rect.w * a.rect.h) - (b.rect.w * b.rect.h))
      .slice(0, 30),
  },
};

writeJson(path.join(outDir, "report.json"), report);

// Console summary (kept compact)
console.log("Mobile audit complete:");
console.log(`- URL: ${documentInfo.url}`);
console.log(`- Output: ${outDir}`);
console.log(`- Viewport: ${viewport.width}x${viewport.height} @dpr2`);
console.log(`- Failing tap targets (<44x44): ${report.summary.totalFailingTapTargets44}`);

await context.close();
await browser.close();
