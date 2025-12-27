# Phase 6: Testing & QA - Comprehensive Best Practices Guide

> **Priority:** 🟢 Medium  
> **Estimated Time:** 4-6 hours  
> **Goal:** Production-grade test suite with CI/CD confidence  
> **Tech Stack:** Vitest + React Testing Library (Unit), Playwright (E2E), axe-core (a11y)  
> **Last Updated:** December 27, 2025

---

## 📚 Testing Philosophy

### Core Principles (from Context7 Best Practices)

1. **Test User Behavior, Not Implementation** - Test what the user sees and does
2. **Web-First Assertions** - Use auto-waiting assertions that retry until conditions are met
3. **Isolation** - Each test should be independent and not rely on others
4. **Accessibility First** - Query by role, label, and semantic attributes
5. **No Flaky Tests** - If a test is flaky, fix it or delete it

---

## 📋 Current State Assessment

### ✅ What's Working Well
- **Unit Tests:** 4 tests, 100% passing (format-price, product-price, safe-json, url-utils)
- **E2E Tests:** 9/10 passing in smoke suite
- **Infrastructure:** Vitest + jsdom, Playwright with global warmup
- **a11y:** axe-core integration via Playwright

### ⚠️ Issues to Address
| Issue | Severity | File(s) |
|-------|----------|---------|
| Duplicate vitest configs | Medium | `vitest.config.ts` + `.mts` |
| Test output clutter | Low | `e2e-smoke-output*.txt` |
| Timestamped report folders | Low | `playwright-report-*` |
| 1 failing E2E test | High | Sell page Performance API |
| Low unit test coverage | Medium | Auth, Cart, Forms |

---

## 🧪 Unit Testing Strategy (Vitest + React Testing Library)

### Configuration Best Practices

**Current Config (`vitest.config.ts`):**

Repo reality: `vitest.config.ts` uses dynamic imports so it can load in both ESM and CJS contexts (important because some Vitest/plugin loading paths are still CJS).

There is also a `vitest.config.mts` that mainly adds the `next-intl` inline-deps workaround. The production cleanup plan is to **merge that snippet into `vitest.config.ts`**, then delete `vitest.config.mts`.

### Action: Delete Duplicate Config
```bash
# 1) Add the next-intl inline deps snippet to vitest.config.ts
# 2) Delete vitest.config.mts
rm vitest.config.mts
```

### Unit Test Best Practices (React Testing Library)

#### ✅ DO: Query by Accessible Roles
```tsx
// ✅ Good - queries like a user would
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('submits form with valid data', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn()
  
  render(<ContactForm onSubmit={handleSubmit} />)
  
  // Query by role - accessible and stable
  await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
})
```

#### ❌ DON'T: Query by Implementation Details
```tsx
// ❌ Bad - brittle, not how users find elements
const input = container.querySelector('.input-class')
const button = getByTestId('submit-btn')  // use sparingly
```

#### Query Priority (Context7 RTL Best Practices)
1. `getByRole` - buttons, links, headings, form elements
2. `getByLabelText` - form inputs with labels
3. `getByPlaceholderText` - inputs with placeholders
4. `getByText` - non-interactive elements
5. `getByTestId` - escape hatch (last resort)

### Missing Unit Tests to Add

| Category | Files to Test | Priority |
|----------|---------------|----------|
| **Auth Utilities** | `lib/supabase/server.ts`, `lib/supabase/client.ts` | 🔴 High |
| **Cart Logic** | `lib/cart-utils.ts` (if exists) | 🔴 High |
| **Form Validation** | Zod schemas in `lib/validations/` | 🟡 Medium |
| **i18n Helpers** | `lib/i18n-utils.ts` | 🟡 Medium |
| **Price Calculations** | Already covered ✅ | Done |

### Example: Testing Auth Helper (MSW for Mocking)
```tsx
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createClient } from '@/lib/supabase/client'

// Mock Supabase client
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a singleton browser client', () => {
    const client1 = createClient()
    const client2 = createClient()
    expect(client1).toBe(client2) // Singleton pattern
  })

  it('returns null user when not authenticated', async () => {
    const client = createClient()
    const { data } = await client.auth.getUser()
    expect(data.user).toBeNull()
  })
})
```

---

## 🎭 E2E Testing Strategy (Playwright)

### Configuration Highlights

**Current Config (`playwright.config.ts`):**
- ✅ Global warmup (`globalSetup`) to precompile Next.js routes
- ✅ Console error capture in smoke tests
- ✅ Trace/screenshot/video on failure
- ✅ 60s timeout for dev mode compilation
- ✅ Chromium, Firefox, WebKit projects
- ✅ Accessibility project with axe-core

### Playwright Best Practices (Context7)

#### ✅ DO: Use Web-First Assertions
```typescript
// ✅ Good - auto-retries until condition is met
await expect(page.getByText('welcome')).toBeVisible()
await expect(page.getByRole('heading')).toHaveText('Products')

// ❌ Bad - no auto-retry, flaky
expect(await page.getByText('welcome').isVisible()).toBe(true)
```

#### ✅ DO: Use Locators by Role
```typescript
// ✅ Good - semantic, resilient to DOM changes
await page.getByRole('button', { name: /add to cart/i }).click()
await page.getByRole('link', { name: /sign in/i }).click()
await page.getByLabel('Email').fill('test@example.com')

// ❌ Bad - brittle CSS selectors
await page.locator('button.btn-primary.add-cart').click()
await page.locator('.nav-link:nth-child(3)').click()
```

#### ✅ DO: Use beforeEach for Test Isolation
```typescript
import { test, expect } from '@playwright/test'

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts fresh
    await page.goto('/en/cart')
  })

  test('shows empty cart message', async ({ page }) => {
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
  })

  test('displays cart items when added', async ({ page }) => {
    // ... add items via API or UI
  })
})
```

#### ✅ DO: Mock External APIs
```typescript
// Mock third-party API in Playwright
await page.route('**/api/stripe/checkout', route => route.fulfill({
  status: 200,
  body: JSON.stringify({ sessionId: 'test_session_123' }),
}))
```

### Current E2E Test Structure
```
e2e/
├── fixtures/
│   └── test.ts          # Extended test with fixtures
├── global-setup.ts      # Warmup key routes before tests
├── smoke.spec.ts        # 🔥 Critical routes (9 tests)
├── full-flow.spec.ts    # Complete user journeys
├── auth.spec.ts         # Login, signup, logout
├── orders.spec.ts       # Order management
├── profile.spec.ts      # User profile
├── reviews.spec.ts      # Review system
├── sales.spec.ts        # Seller dashboard
└── accessibility.spec.ts # axe-core a11y
```

### Fix: Sell Page Performance API Error

**Current Failure:**
```
page error: Failed to execute 'measure' on 'Performance':
'SellPage [Prerender]' cannot have a negative time stamp.
```

**Root Cause:** Using `performance.measure()` in a way that conflicts with Next.js prerendering.

**Fix Options:**

1. **Option A: Fix in Component** (Recommended)
```typescript
// components/seller/SellPage.tsx
useEffect(() => {
  // Only measure in browser, not during SSR/prerender
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.mark('SellPage:mount')
      // ... your performance logic
    } catch (e) {
      // Silently fail during prerender
      console.debug('Performance API unavailable:', e)
    }
  }
}, [])
```

2. **Option B: Filter in Test** (Temporary)
```typescript
// e2e/smoke.spec.ts - add to IGNORED_CONSOLE_PATTERNS
const IGNORED_CONSOLE_PATTERNS = [
  // ... existing patterns
  /Failed to execute 'measure' on 'Performance'/i,
]
```

---

## ♿ Accessibility Testing (axe-core)

### Current Setup
- Integrated via `@axe-core/playwright`
- Runs with `pnpm test:a11y`

### Best Practices (Context7)

#### Create a Custom Fixture for Consistent Config
```typescript
// e2e/fixtures/axe-test.ts
import { test as base, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder
}

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('.ad-banner') // Exclude third-party elements
    
    await use(makeAxeBuilder)
  },
})

export { expect }
```

#### Use in Tests
```typescript
import { test, expect } from './fixtures/axe-test'

test('home page is accessible', async ({ page, makeAxeBuilder }) => {
  await page.goto('/en')
  
  const results = await makeAxeBuilder()
    .include('#main-content') // Focus on your content
    .analyze()
  
  expect(results.violations).toEqual([])
})
```

### Pages to Test for a11y

| Page | Route | Priority |
|------|-------|----------|
| Home | `/en` | 🔴 Critical |
| Product | `/en/product/[slug]` | 🔴 Critical |
| Search | `/en/search` | 🔴 Critical |
| Cart | `/en/cart` | 🔴 Critical |
| Checkout | `/en/checkout` | 🔴 Critical |
| Login | `/en/login` | 🔴 Critical |
| Register | `/en/register` | 🔴 Critical |
| Categories | `/en/categories` | 🟡 High |
| Account | `/en/account` | 🟡 High |

---

## 📊 Coverage Requirements

### Unit Test Coverage Targets

```typescript
// vitest.config.ts - Add thresholds
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov'],
  include: ['lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  thresholds: {
    // Global thresholds
    lines: 70,
    functions: 70,
    branches: 60,
    statements: 70,
    // Critical paths need higher coverage
    'lib/supabase/**/*.ts': {
      lines: 80,
      functions: 80,
    },
    'lib/utils/**/*.ts': {
      lines: 90,
      functions: 90,
    },
  },
}
```

### Run Coverage Report
```bash
pnpm test:unit:coverage
# Opens HTML report showing uncovered lines
```

---

## 🔧 Test Commands Reference

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# UNIT TESTS (Vitest + React Testing Library)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pnpm test:unit              # Run all unit tests once
pnpm test:unit:watch        # Watch mode (interactive)
pnpm test:unit:coverage     # Generate coverage report

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# E2E TESTS (Playwright)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pnpm test:e2e               # Chromium only, skip a11y
pnpm test:e2e:all           # All browsers (Chrome, FF, Safari)
pnpm test:e2e:headed        # Run with visible browser
pnpm test:a11y              # Accessibility tests only

# Debug specific test
pnpm exec playwright test smoke.spec.ts:42 --debug

# View test report
pnpm exec playwright show-report

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FULL TEST SUITE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pnpm test:all               # lint + typecheck + unit + e2e + a11y
pnpm test:full              # lint + typecheck + unit + prod build + e2e + a11y

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CI-SPECIFIC
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pnpm test:ci                # Build + E2E + Lighthouse (CI)
```

---

## 🗂️ Cleanup Actions

### Immediate Cleanup Tasks

```bash
# 1. Delete scattered test outputs
rm e2e-smoke-output*.txt
rm -rf playwright-report-*[0-9]  # Keep only playwright-report/

# 2. Delete duplicate vitest config
rm vitest.config.ts  # Keep .mts

# 3. Update .gitignore (ensure these are present)
cat >> .gitignore << 'EOF'

# Test outputs
playwright-report/
test-results/
coverage/
*.log

# Don't commit timestamped reports
playwright-report-*/
e2e-smoke-output*.txt
EOF
```

### Directory Structure (After Cleanup)
```
amazong/
├── __tests__/              # Unit tests (Vitest)
│   ├── format-price.test.ts
│   ├── product-price.test.tsx
│   ├── safe-json.test.ts
│   └── url-utils.test.ts
├── e2e/                    # E2E tests (Playwright)
│   ├── fixtures/
│   ├── smoke.spec.ts
│   ├── auth.spec.ts
│   └── ...
├── test/                   # Test setup
│   └── setup.ts            # Vitest setup (jest-dom, etc.)
├── playwright-report/      # (gitignored) HTML reports
├── test-results/           # (gitignored) Artifacts
├── coverage/               # (gitignored) Coverage reports
└── vitest.config.ts        # Single Vitest config
```

---

## 📈 Test Metrics & Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Unit test pass rate | 100% | 100% | ✅ |
| E2E smoke pass rate | 100% | 90% (9/10) | ⚠️ |
| E2E full flow pass rate | 100% | Measure with `pnpm test:e2e:all` | ⬜ |
| Accessibility violations | 0 critical | Measure with `pnpm test:a11y` | ⬜ |
| Unit test coverage | 70%+ | Measure with `pnpm test:unit:coverage` | ⬜ |
| Test run time (unit) | < 30s | ~5s | ✅ |
| Test run time (e2e smoke) | < 2min | ~90s | ✅ |

---

## 🧑‍💻 Writing New Tests

### Unit Test Template

```typescript
// __tests__/my-feature.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('MyFeature', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Cleanup after each test
  })

  it('should do something expected', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = myFunction(input)
    
    // Assert
    expect(result).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow()
  })
})
```

### Component Test Template

```typescript
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    
    expect(screen.getByRole('heading', { name: /test/i })).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### E2E Test Template

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/my-feature')
  })

  test('should display main content', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /my feature/i })).toBeVisible()
  })

  test('should handle form submission', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByRole('button', { name: /submit/i }).click()
    
    await expect(page.getByText(/success/i)).toBeVisible()
  })
})
```

---

## ✅ Phase 6 Completion Checklist

### Cleanup
- [ ] Delete `e2e-smoke-output*.txt` files
- [ ] Delete timestamped playwright report folders
- [ ] Remove `vitest.config.ts` (keep `.mts`)
- [ ] Update `.gitignore` with test output patterns

### Unit Tests
- [ ] All existing tests passing
- [ ] Add auth utility tests (`lib/supabase/`)
- [ ] Add cart utility tests (if applicable)
- [ ] Configure coverage thresholds
- [ ] Coverage report shows 70%+ on critical paths

### E2E Tests
- [ ] Fix Sell page Performance API error
- [ ] All smoke tests passing (10/10)
- [ ] Full flow tests passing
- [ ] Tests use web-first assertions
- [ ] Tests use role-based selectors

### Accessibility
- [ ] axe-core tests run on all critical pages
- [ ] Zero critical/serious violations
- [ ] Modal focus trap tested
- [ ] Keyboard navigation tested

### CI/CD Ready
- [ ] `pnpm test:all` passes locally
- [ ] Tests run in parallel where safe
- [ ] Flaky tests identified and fixed
- [ ] Test artifacts properly gitignored

---

## 🏁 Next Step

→ Proceed to [Phase 7: Performance & SEO](./07-performance.md)
