import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
page.setDefaultTimeout(120_000);

await page.goto("http://localhost:3000/bg", { waitUntil: "commit", timeout: 120_000 });
await page.waitForSelector('[data-testid="language-switcher"]');
await page.waitForSelector('header');

const info = await page.evaluate(() => {
  const language = document.querySelector('[data-testid="language-switcher"]');
  const logo = Array.from(document.querySelectorAll('a')).find((a) => (a.textContent || "").trim() === "AMZN");

  const elInfo = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      className: el.getAttribute('class'),
      rect: { w: Math.round(r.width), h: Math.round(r.height) },
    };
  };

  return {
    language: elInfo(language),
    logo: elInfo(logo),
  };
});

console.log(JSON.stringify(info, null, 2));

await context.close();
await browser.close();
