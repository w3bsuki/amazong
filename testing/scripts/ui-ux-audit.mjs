import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve('testing/reports/ui-ux-audit');
const REPORT_MD = path.resolve('testing/reports/ui-ux-audit.md');

/** @type {{ name: string; path: string; note?: string }[]} */
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'locale-root-en', path: '/en' },
  { name: 'search-en', path: '/en/search' },
  { name: 'category-en-fashion', path: '/en/categories/fashion', note: 'Representative category picked from homepage links.' },
  { name: 'product-en-shop4e-aysifon', path: '/en/shop4e/aysifon', note: 'Representative product picked from homepage links.' },
  { name: 'auth-sign-up-en', path: '/en/auth/sign-up' },
  { name: 'auth-sign-in-en', path: '/en/auth/login', note: 'App uses /en/auth/login for sign-in.' },
  { name: 'sell-en', path: '/en/sell' },
  { name: 'account-en', path: '/en/account' },
];

/** @type {{ name: string; viewport: { width: number; height: number }; tag: 'desktop' | 'mobile' }[]} */
const VIEWPORTS = [
  { name: 'desktop-1280x720', viewport: { width: 1280, height: 720 }, tag: 'desktop' },
  { name: 'mobile-390x844', viewport: { width: 390, height: 844 }, tag: 'mobile' },
];

function toUrl(p) {
  return new URL(p, BASE_URL).toString();
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '-');
}

function nowIsoCompact() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function contrastRatio(rgb1, rgb2) {
  const lum = (rgb) => {
    const srgb = rgb.map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };
  const L1 = lum(rgb1);
  const L2 = lum(rgb2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(cssColor) {
  // supports rgb/rgba
  const m = cssColor.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => s.trim());
  const r = Number.parseFloat(parts[0]);
  const g = Number.parseFloat(parts[1]);
  const b = Number.parseFloat(parts[2]);
  const a = parts.length >= 4 ? Number.parseFloat(parts[3]) : 1;
  return { r, g, b, a };
}

async function ensureOutDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

async function auditOne(page, { pageName, pagePath, viewportName, viewportTag }) {
  /** @type {{ type: string; text: string }[]} */
  const consoleMessages = [];
  /** @type {{ name: string; message: string; stack?: string }[]} */
  const pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (err) => {
    pageErrors.push({ name: err.name, message: err.message, stack: err.stack });
  });

  const url = toUrl(pagePath);
  const start = Date.now();

  let responseStatus = null;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    responseStatus = resp?.status() ?? null;
  } catch (e) {
    consoleMessages.push({ type: 'error', text: `goto failed: ${String(e)}` });
  }

  // Next dev/HMR keeps connections alive; treat networkidle as best-effort.
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(800);

  const finalUrl = page.url();
  const title = await page.title().catch(() => '');

  // Heuristic layout checks
  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const safeDocScrollW = doc?.scrollWidth ?? 0;
    const safeDocScrollH = doc?.scrollHeight ?? 0;
    const safeBodyScrollW = body?.scrollWidth ?? 0;
    const safeBodyScrollH = body?.scrollHeight ?? 0;

    const scrollW = Math.max(safeDocScrollW, safeBodyScrollW);
    const scrollH = Math.max(safeDocScrollH, safeBodyScrollH);

    const hasHOverflow = scrollW > viewportW + 1;

    const stickyCandidates = Array.from(document.querySelectorAll('*')).filter((el) => {
      const s = window.getComputedStyle(el);
      return s.position === 'sticky' || s.position === '-webkit-sticky';
    });

    const visibleDialogs = Array.from(document.querySelectorAll('[role="dialog"], [data-state="open"], dialog[open]')).filter((el) => {
      const r = (el).getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).slice(0, 5);

    return {
      viewport: { width: viewportW, height: viewportH },
      doc: { scrollWidth: scrollW, scrollHeight: scrollH },
      hasHOverflow,
      stickyCount: stickyCandidates.length,
      visibleDialogsCount: visibleDialogs.length,
    };
  });

  // Quick contrast sampling (heuristic): check buttons + primary links within viewport
  const contrastFindings = await page.evaluate(() => {
    const MAX = 25;

    const parseRgb = (cssColor) => {
      const m = cssColor.match(/rgba?\(([^)]+)\)/i);
      if (!m) return null;
      const parts = m[1].split(',').map((s) => s.trim());
      const r = Number.parseFloat(parts[0]);
      const g = Number.parseFloat(parts[1]);
      const b = Number.parseFloat(parts[2]);
      const a = parts.length >= 4 ? Number.parseFloat(parts[3]) : 1;
      return { r, g, b, a };
    };

    const contrastRatio = (rgb1, rgb2) => {
      const lum = (rgb) => {
        const srgb = rgb.map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
      };
      const L1 = lum(rgb1);
      const L2 = lum(rgb2);
      const lighter = Math.max(L1, L2);
      const darker = Math.min(L1, L2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    const isTransparent = (rgba) => rgba && rgba.a === 0;

    const effectiveBg = (el) => {
      let cur = el;
      while (cur) {
        const bg = getComputedStyle(cur).backgroundColor;
        const rgba = parseRgb(bg);
        if (rgba && !isTransparent(rgba)) return rgba;
        cur = cur.parentElement;
      }
      return parseRgb(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    };

    const elements = Array.from(document.querySelectorAll('button, a'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return r.width > 44 && r.height > 20 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .slice(0, 250);

    const findings = [];
    for (const el of elements) {
      if (findings.length >= MAX) break;
      const style = getComputedStyle(el);
      const fg = parseRgb(style.color);
      if (!fg) continue;
      const bg = effectiveBg(el);
      const ratio = contrastRatio([fg.r, fg.g, fg.b], [bg.r, bg.g, bg.b]);

      const fontSize = Number.parseFloat(style.fontSize);
      const fontWeight = Number.parseInt(style.fontWeight || '400', 10);
      const isLarge = fontSize >= 18.66 || (fontSize >= 14 && fontWeight >= 700);
      const needed = isLarge ? 3.0 : 4.5;

      if (ratio + 1e-6 < needed) {
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        findings.push({
          tag: el.tagName.toLowerCase(),
          text: text || '(no text)',
          ratio: Number(ratio.toFixed(2)),
          needed,
        });
      }
    }

    return findings;
  });

  // Keyboard focus checks
  /** @type {{ step: number; activeTag?: string; activeText?: string; focusVisible?: boolean; outline?: string; boxShadow?: string }[]} */
  const focusTrail = [];

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab').catch(() => {});
    await page.waitForTimeout(120);
    const snap = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return { step: 0 };
      const s = window.getComputedStyle(el);
      const outlineW = parseFloat(s.outlineWidth || '0');
      const outlineStyle = s.outlineStyle;
      const outlineColor = s.outlineColor;
      const boxShadow = s.boxShadow;
      const hasOutline = outlineW > 0 && outlineStyle !== 'none' && outlineColor !== 'rgba(0, 0, 0, 0)';
      const hasBoxShadow = boxShadow && boxShadow !== 'none';

      // best-effort: consider focus ring visible if outline or box-shadow exists
      const focusVisible = Boolean(hasOutline || hasBoxShadow);
      const text = (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);

      return {
        activeTag: el.tagName.toLowerCase(),
        activeText: text,
        focusVisible,
        outline: `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`,
        boxShadow,
      };
    });
    focusTrail.push({ step: i + 1, ...snap });
  }

  // Modal Esc close (if something that looks like a dialog is already open)
  const modalCheck = await page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
    };
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], dialog[open], [data-state="open"]')).filter(visible);
    return { hadDialog: dialogs.length > 0 };
  });

  if (modalCheck.hadDialog) {
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(250);
  }

  const ms = Date.now() - start;
  const screenshotFile = sanitizeFilename(`${pageName}__${viewportName}__${nowIsoCompact()}.png`);
  const screenshotPath = path.join(OUT_DIR, screenshotFile);
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch((e) => {
    consoleMessages.push({ type: 'error', text: `screenshot failed: ${String(e)}` });
  });

  return {
    pageName,
    pagePath,
    url,
    finalUrl,
    title,
    viewportName,
    viewportTag,
    responseStatus,
    durationMs: ms,
    screenshotFile,
    consoleMessages,
    pageErrors,
    layout,
    contrastFindings,
    focusTrail,
    modalCheck,
  };
}

async function main() {
  await ensureOutDir();

  const browser = await chromium.launch({ headless: true });

  /** @type {any[]} */
  const results = [];

  for (const v of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: v.viewport,
      deviceScaleFactor: v.tag === 'mobile' ? 2 : 1,
      isMobile: v.tag === 'mobile',
      hasTouch: v.tag === 'mobile',
      userAgent:
        v.tag === 'mobile'
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
          : undefined,
    });

    for (const p of PAGES) {
      const page = await context.newPage();
      const r = await auditOne(page, {
        pageName: p.name,
        pagePath: p.path,
        viewportName: v.name,
        viewportTag: v.tag,
      });
      r.note = p.note;
      results.push(r);
      await page.close().catch(() => {});
    }

    await context.close().catch(() => {});
  }

  await browser.close();

  // Summaries
  const allConsole = results.flatMap((r) => r.consoleMessages.map((m) => ({ ...m, page: r.pageName, viewport: r.viewportName })));
  const errors = allConsole.filter((m) => m.type === 'error');
  const warns = allConsole.filter((m) => m.type === 'warning' || m.type === 'warn');

  const byPage = new Map();
  for (const r of results) {
    if (!byPage.has(r.pageName)) byPage.set(r.pageName, []);
    byPage.get(r.pageName).push(r);
  }

  const report = [];
  report.push(`# UI/UX Audit (Desktop + Mobile)\n`);
  report.push(`- Base URL: ${BASE_URL}`);
  report.push(`- Generated: ${new Date().toISOString()}`);
  report.push(`- Assets dir: testing/reports/ui-ux-audit/\n`);

  report.push(`## Summary\n`);
  report.push(`### P0 (blockers)\n`);
  report.push(`- (Fill in after reviewing screenshots)\n`);
  report.push(`### P1 (serious)\n`);
  report.push(`- (Fill in after reviewing screenshots)\n`);
  report.push(`### P2 (polish)\n`);
  report.push(`- (Fill in after reviewing screenshots)\n`);

  report.push(`## Console\n`);
  report.push(`- Total console errors: ${errors.length}`);
  report.push(`- Total console warnings: ${warns.length}\n`);

  if (errors.length || warns.length) {
    report.push(`### Errors / Warnings (first 50)\n`);
    const first = [...errors, ...warns].slice(0, 50);
    for (const m of first) {
      report.push(`- [${m.type.toUpperCase()}] (${m.viewport}) ${m.page}: ${m.text}`);
    }
    report.push('');
  }

  report.push(`## Per-page Findings\n`);

  for (const [pageName, entries] of byPage.entries()) {
    const desktop = entries.find((e) => e.viewportTag === 'desktop');
    const mobile = entries.find((e) => e.viewportTag === 'mobile');

    report.push(`### ${pageName}\n`);
    report.push(`- Path: ${desktop?.pagePath ?? mobile?.pagePath}`);
    report.push(`- Final URL (desktop): ${desktop?.finalUrl ?? ''}`);
    report.push(`- Final URL (mobile): ${mobile?.finalUrl ?? ''}`);
    if (desktop?.note) report.push(`- Note: ${desktop.note}`);

    const hOverflow = [desktop, mobile].filter(Boolean).filter((r) => r.layout?.hasHOverflow);
    if (hOverflow.length) {
      report.push(`- Potential horizontal overflow: ${hOverflow.map((r) => r.viewportName).join(', ')}`);
    }

    const lowContrast = [desktop, mobile].flatMap((r) => (r?.contrastFindings ?? []).map((f) => ({ ...f, viewport: r.viewportName })));
    if (lowContrast.length) {
      report.push(`- Possible contrast failures (heuristic, first 10):`);
      for (const f of lowContrast.slice(0, 10)) {
        report.push(`  - (${f.viewport}) <${f.tag}> "${f.text}" contrast ${f.ratio}:1 (needs ≥ ${f.needed}:1)`);
      }
    }

    const focusIssues = [desktop, mobile]
      .filter(Boolean)
      .map((r) => ({ viewport: r.viewportName, missing: (r.focusTrail ?? []).filter((s) => s.activeTag && s.focusVisible === false).length }))
      .filter((x) => x.missing > 0);
    if (focusIssues.length) {
      report.push(`- Focus indicator may be missing on some tab stops: ${focusIssues.map((x) => `${x.viewport} (${x.missing})`).join(', ')}`);
    }

    report.push(`- Screenshots:`);
    if (desktop?.screenshotFile) report.push(`  - Desktop: testing/reports/ui-ux-audit/${desktop.screenshotFile}`);
    if (mobile?.screenshotFile) report.push(`  - Mobile: testing/reports/ui-ux-audit/${mobile.screenshotFile}`);

    const pageConsole = entries
      .flatMap((r) => r.consoleMessages.map((m) => ({ ...m, viewport: r.viewportName })))
      .filter((m) => m.type === 'error' || m.type === 'warning' || m.type === 'warn');
    if (pageConsole.length) {
      report.push(`- Console (errors/warnings):`);
      for (const m of pageConsole.slice(0, 12)) {
        report.push(`  - [${m.type.toUpperCase()}] (${m.viewport}) ${m.text}`);
      }
    }

    const authHint = entries.some((r) => /\/account/.test(r.pagePath))
      ? entries.map((r) => r.finalUrl).some((u) => /\/auth\//.test(u) || /\/login/.test(u))
      : false;
    if (authHint) {
      report.push(`- Note: /account appears to require auth (redirected to auth route).`);
    }

    report.push('');
  }

  report.push(`## Quick Review Checklist (manual)\n`);
  report.push(`- Verify header tab order is logical and no hidden focus traps.`);
  report.push(`- Check sticky bars (header/bottom nav) don’t cover CTAs on mobile.`);
  report.push(`- Confirm auth forms labels, error messages, and button states are readable.`);

  await fs.writeFile(REPORT_MD, report.join('\n'), 'utf8');

  // Also save raw JSON for debugging
  await fs.writeFile(path.join(OUT_DIR, 'ui-ux-audit.raw.json'), JSON.stringify({ baseUrl: BASE_URL, results }, null, 2), 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Wrote report: ${REPORT_MD}`);
  // eslint-disable-next-line no-console
  console.log(`Assets: ${OUT_DIR}`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
