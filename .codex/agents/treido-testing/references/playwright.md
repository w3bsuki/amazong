---
title: Playwright E2E Testing
impact: critical
impactDescription: E2E tests verify critical user journeys work end-to-end
tags: [e2e, playwright, fixtures, selectors, auth]
---

# playwright.md — Playwright E2E Testing

> Treido-specific Playwright patterns, fixtures, and selectors.

## Treido Fixture System

### Base Fixture (`e2e/fixtures/base.ts`)

All E2E tests MUST use the extended `test` from base.ts:

```tsx
import { test, expect } from '@/e2e/fixtures/base';

test('can browse products', async ({ app }) => {
  await app.goto('/en/search');
  await app.waitForHydration();
  // ... assertions
  app.assertNoConsoleErrors();
});
```

### `app` Fixture Utilities

| Method | Purpose |
|--------|---------|
| `app.goto(url)` | Navigate with retry logic (up to 3 attempts) |
| `app.waitForHydration()` | Wait for Next.js RSC hydration |
| `app.clearAuthSession()` | Clear cookies + localStorage auth tokens |
| `app.assertNoConsoleErrors()` | Fail test if console errors detected |

### Why Use Base Fixture

1. **Auto-dismisses modals** — Cookie consent, geo-welcome dialogs
2. **Console error capture** — Catches runtime errors
3. **Retry logic** — Handles dev-mode compilation delays
4. **Hydration safety** — Waits for RSC hydration

---

## Selectors (`test-e2e-selector`)

### Priority Order

| Priority | Method | When to Use |
|----------|--------|-------------|
| 1 | `getByRole()` | Always prefer for accessibility |
| 2 | `getByLabel()` | Form inputs with labels |
| 3 | `getByText()` | Static text content |
| 4 | `getByTestId()` | Last resort for dynamic elements |

### Correct Examples

```tsx
// ✅ Role-based (best)
page.getByRole('button', { name: 'Add to Cart' })
page.getByRole('link', { name: 'Products' })
page.getByRole('heading', { name: /shopping cart/i })

// ✅ Label-based (forms)
page.getByLabel('Email')
page.getByLabel('Password')

// ✅ Test ID (last resort)
page.getByTestId('mobile-tab-bar')
page.getByTestId('order-card')
```

### Forbidden Selectors

```tsx
// ❌ CSS selectors (brittle)
page.locator('.btn-primary')
page.locator('#submit-button')

// ❌ XPath (fragile)
page.locator('//button[@class="submit"]')

// ❌ nth-child (breaks on DOM changes)
page.locator('.products > div:nth-child(3)')
```

### Treido data-testid Conventions

| Pattern | Usage |
|---------|-------|
| `mobile-tab-*` | Bottom navigation tabs |
| `mobile-menu-*` | Mobile menu elements |
| `search-input` | Search box |
| `order-card` | Order list items |
| `cookie-consent` | Cookie banner |

---

## Authentication (`test-e2e-auth`)

### Auth Fixtures (`e2e/fixtures/auth.ts`)

```tsx
import { getTestUserCredentials, loginWithPassword } from '@/e2e/fixtures/auth';

test('authenticated user sees dashboard', async ({ page }) => {
  const creds = getTestUserCredentials();
  if (!creds) test.skip(true, 'No test credentials');
  
  await loginWithPassword(page, creds);
  await page.goto('/en/account');
  // ...
});
```

### Environment Variables

| Variable | Fallback | Purpose |
|----------|----------|---------|
| `TEST_USER_EMAIL` | `E2E_USER_EMAIL` | Test account email |
| `TEST_USER_PASSWORD` | `E2E_USER_PASSWORD` | Test account password |

### Auth Session Clearing

```tsx
// Clear auth between tests
await app.clearAuthSession();
```

This clears:
- All cookies
- Supabase tokens (`sb-*` localStorage keys)
- Session storage

---

## Waiting Strategies (`test-e2e-hydration`)

### Correct Patterns

```tsx
// ✅ Wait for hydration (recommended)
await app.waitForHydration();

// ✅ Auto-waiting assertions
await expect(page.getByRole('button')).toBeVisible();
await expect(page.getByRole('button')).toBeEnabled();

// ✅ Wait for specific URL
await expect(page).toHaveURL(/\/account/);

// ✅ Wait for network response
await page.waitForResponse('**/api/products');
```

### Forbidden Patterns

```tsx
// ❌ Hardcoded waits (flaky)
await page.waitForTimeout(5000);

// ❌ Arbitrary delays
await new Promise(r => setTimeout(r, 2000));
```

---

## Configuration Reference

### Key Settings (`playwright.config.ts`)

| Setting | Value | Notes |
|---------|-------|-------|
| `testDir` | `./e2e` | All E2E specs here |
| `testIdAttribute` | `data-testid` | Use `getByTestId()` |
| `timeout` | 60000ms | Per-test timeout |
| `navigationTimeout` | 60000ms | Page.goto timeout |
| `workers` | 1 (CI) | Parallel on local |
| `retries` | 2 (CI), 0 (local) | Auto-retry on failure |

### Projects

| Project | Viewport | When Used |
|---------|----------|-----------|
| `chromium` | Desktop Chrome | Default |
| `firefox` | Desktop Firefox | Cross-browser |
| `webkit` | Desktop Safari | Cross-browser |
| `mobile-chrome` | Pixel 5 | Mobile testing |
| `mobile-safari` | iPhone 12 | Mobile testing |
| `accessibility` | Desktop Chrome | A11y testing only |

### Web Server

Auto-starts dev server unless `REUSE_EXISTING_SERVER=true`:
- Auto-picks free port if 3000 is busy
- Uses `http://127.0.0.1` (not localhost) to avoid IPv6 issues on Windows

---

## Global Setup (`e2e/global-setup.ts`)

Warms key routes before tests run:
- `/en` — Home page
- `/en/search` — Search page
- `/en/categories` — Categories

This prevents first-hit compilation timeouts during actual tests.

---

## Test File Organization

```
e2e/
├── fixtures/
│   ├── base.ts        # Extended test with app utilities
│   ├── auth.ts        # Auth helpers
│   └── test.ts        # Re-exports for backwards compatibility
├── smoke.spec.ts      # Critical path smoke tests
├── auth.spec.ts       # Authentication flows
├── seller-routes.spec.ts
├── accessibility.spec.ts
└── global-setup.ts    # Route warming
```

---

## Debugging

### Interactive Mode

```bash
pnpm test:e2e:headed   # See browser
pnpm test:e2e --debug  # Pause on failure
pnpm test:e2e --ui     # Interactive UI
```

### Trace Files

Generated on failure in `test-results/`:
- Screenshots
- Videos
- Trace files (view with `pnpm playwright show-trace`)
