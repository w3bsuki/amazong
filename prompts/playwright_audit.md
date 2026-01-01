# PLAYWRIGHT E2E TESTING AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING

```
1. mcp_context7_resolve-library-id → libraryName: "playwright"
2. mcp_context7_get-library-docs → topics: "best practices", "fixtures", "Page Object Model"
3. Check playwright.config.ts configuration
```

---

## AUDIT SCOPE

### 1. CONFIGURATION CHECK
**`playwright.config.ts` essentials:**
```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

**Questions:**
- [ ] Is `webServer` configured for automatic server start?
- [ ] Is `reuseExistingServer` set correctly for local vs CI?
- [ ] Are retries configured for CI?
- [ ] Is trace enabled for debugging?

### 2. TEST STRUCTURE
**Expected structure:**
```
e2e/
├── fixtures/
│   ├── index.ts          # Custom fixtures
│   └── auth.fixture.ts   # Auth fixture
├── pages/
│   ├── home.page.ts      # Page Object
│   └── product.page.ts
├── smoke.spec.ts         # Critical path tests
├── auth.spec.ts          # Auth flow tests
└── ...
```

**Questions:**
- [ ] Are fixtures used for common setup?
- [ ] Are Page Objects used (or simple locator patterns)?
- [ ] Are tests organized by feature?
- [ ] Is there a smoke test suite for CI?

### 3. LOCATOR BEST PRACTICES

**Good patterns:**
```typescript
// ✅ Role-based (most resilient)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: /Sign in/i })
page.getByRole('heading', { level: 1 })

// ✅ Text-based (user-centric)
page.getByText('Welcome back')
page.getByLabel('Email address')
page.getByPlaceholder('Enter your email')

// ✅ Test IDs (when no semantic option)
page.getByTestId('product-card')
```

**Anti-patterns:**
```typescript
// ❌ CSS selectors (brittle)
page.locator('.btn-primary')
page.locator('#submit-button')
page.locator('div > span.price')

// ❌ XPath (hard to maintain)
page.locator('//div[@class="product"]//button')

// ❌ nth-child (position-dependent)
page.locator('.item:nth-child(3)')
```

### 4. ASSERTION PATTERNS

**Good patterns:**
```typescript
// ✅ Web-first assertions (auto-retry)
await expect(page.getByRole('heading')).toBeVisible()
await expect(page.getByRole('button')).toBeEnabled()
await expect(page.getByText('Success')).toBeVisible()

// ✅ Specific assertions
await expect(page).toHaveURL(/\/products\//)
await expect(page).toHaveTitle('Product Name')
await expect(locator).toHaveText('Expected text')
await expect(locator).toHaveAttribute('href', '/path')
```

**Anti-patterns:**
```typescript
// ❌ Manual waits
await page.waitForTimeout(2000)

// ❌ Non-retrying assertions
const text = await locator.textContent()
expect(text).toBe('Expected')  // No auto-retry!

// ❌ Checking visibility with isVisible()
if (await locator.isVisible()) { ... }  // Race condition
```

### 5. TEST ISOLATION

**Good patterns:**
```typescript
// ✅ Each test is independent
test('can add to cart', async ({ page }) => {
  // Full setup within test
  await page.goto('/products/1')
  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await expect(page.getByText('Added')).toBeVisible()
})

// ✅ Use fixtures for common setup
test('checkout', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
})
```

**Anti-patterns:**
```typescript
// ❌ Tests depending on each other
test('add to cart', async ({ page }) => { ... })
test('checkout', async ({ page }) => {
  // Assumes cart has items from previous test!
})

// ❌ Shared state between tests
let productId: string
test('create product', async () => {
  productId = await createProduct()
})
test('view product', async ({ page }) => {
  await page.goto(`/products/${productId}`)  // Depends on previous test!
})
```

### 6. FIXTURES

**Custom fixture example:**
```typescript
// e2e/fixtures/index.ts
import { test as base } from '@playwright/test'

type Fixtures = {
  authenticatedPage: Page
  testProduct: { id: string; title: string }
}

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Dashboard')).toBeVisible()
    await use(page)
  },
  
  testProduct: async ({ }, use) => {
    const product = await createTestProduct()
    await use(product)
    await deleteTestProduct(product.id)  // Cleanup
  },
})

export { expect } from '@playwright/test'
```

### 7. CI CONSIDERATIONS
**Check for:**
- [ ] Is `forbidOnly` set for CI?
- [ ] Are flaky tests handled with retries?
- [ ] Is screenshot on failure enabled?
- [ ] Is trace enabled for debugging failures?
- [ ] Are tests parallelized appropriately?

---

## SPECIFIC SEARCHES

```typescript
// Find CSS selector locators
grep_search: "page\.locator\('\.|page\.locator\('#|page\.\$\("

// Find waitForTimeout (anti-pattern)
grep_search: "waitForTimeout|wait\(\d"

// Find non-web-first assertions
grep_search: "\.textContent\(\)|\.innerText\(\)|\.getAttribute\("

// Find test dependencies
grep_search: "test\.describe\.serial|beforeAll.*=.*test"
```

---

## RUN TESTS

```bash
# Run all tests
pnpm test:e2e

# Run specific file
pnpm test:e2e e2e/smoke.spec.ts

# Run with UI mode
pnpm -s exec playwright test --ui

# Run headed
pnpm test:e2e:headed

# Show report
pnpm -s exec playwright show-report
```

---

## DELIVERABLES

1. **BRITTLE**: Tests using CSS/XPath selectors
2. **FLAKY**: Tests with timing issues or dependencies
3. **MISSING**: Coverage gaps in critical flows
4. **SLOW**: Tests that could be parallelized
5. **STRUCTURE**: Fixture/Page Object improvements
6. **FIXES**: Specific test refactors

---

## TEST HEALTH CHECKLIST

| Check | Status | Notes |
|-------|--------|-------|
| No CSS selectors | ✅/❌ |    |
| No waitForTimeout | ✅/❌ |   |
| Web-first assertions | ✅/❌ | |
| Isolated tests | ✅/❌ |      |
| Fixtures used | ✅/❌ |       |
| Smoke suite exists | ✅/❌ |   |
| CI optimized | ✅/❌ |        |
