# Test Architecture Audit & Refactoring Plan

**Date:** December 31, 2025  
**Goal:** Create a brutally honest, real-world testing strategy with tests that FAIL when things are broken.

---

## Current State Analysis

### Test Files Inventory (15 spec files!)

| File | Lines | Purpose | Verdict |
|------|-------|---------|---------|
| `smoke.spec.ts` | 446 | Basic route/console checks | **BLOATED** - Too many soft assertions |
| `accessibility.spec.ts` | 405 | axe-core a11y scans | **GOOD** - Keep but tighten |
| `auth.spec.ts` | 739 | Auth flows | **MIXED** - Some real, some flaky |
| `full-flow.spec.ts` | 890 | User journeys | **BLOATED** - Never runs fully |
| `orders.spec.ts` | 302 | Order management | **SKIPPED** - Most tests skip |
| `sales.spec.ts` | 557 | Seller orders | **SKIPPED** - Almost all `.skip` |
| `reviews.spec.ts` | 208 | Product reviews | **OK** - But fragile |
| `profile.spec.ts` | 680 | Profile/account | **MIXED** - Lots of unauthenticated |
| `mobile-responsiveness.spec.ts` | 492 | Mobile viewport | **GOOD** - Real assertions |
| `seller-routes.spec.ts` | 63 | Seller route checks | **LIGHT** - Needs more |
| `seller-create-listing.spec.ts` | 58 | Create listing | **REAL** - Good flow |
| `account-phase5.spec.ts` | 98 | Account pages | **REAL** - Good pattern |
| `ux-audit-phase2.spec.ts` | 249 | UX audit snapshot | **DELETE** - One-off audit |
| `ux-phase2-search-categories.spec.ts` | 289 | UX audit #2 | **DELETE** - One-off audit |

### Critical Problems Found

#### 1. **Soft Assertions That Never Fail**
```typescript
// BAD - This passes even when broken
const hasCards = await productCards.first().isVisible().catch(() => false)
const hasEmpty = await emptyState.isVisible().catch(() => false)
expect(hasCards || hasEmpty, 'Expected...').toBeTruthy()  // Always passes!
```

#### 2. **Skipped Tests Everywhere**
```typescript
// In sales.spec.ts - 90% of tests are skipped
test.skip("displays seller orders page with header", async ({ page }) => {
  // This never runs!
})
```

#### 3. **One-Off Audit Files**
- `ux-audit-phase2.spec.ts` - Screenshots to `cleanup/` folder
- `ux-phase2-search-categories.spec.ts` - Same
- These are NOT tests, they're audit scripts that screenshot things

#### 4. **Overly Generous Timeouts**
```typescript
test.setTimeout(180_000)  // 3 minutes per test?!
```

#### 5. **Tests That Test Nothing**
```typescript
// This "passes" with zero real assertions
test("navigates with search query", async ({ page }) => {
  await page.goto("/en/account/orders?q=test")
  expect(page.url()).toContain("/account/orders")  // So what?
})
```

#### 6. **Console Error Suppression**
```typescript
const IGNORED_CONSOLE_PATTERNS = [
  // 7+ patterns suppressed - hiding real bugs?
]
```

---

## Unit Tests Analysis (`__tests__/`)

| File | Coverage | Quality |
|------|----------|---------|
| `format-price.test.ts` | Good | **REAL** - Tests actual functions |
| `safe-json.test.ts` | Good | **REAL** - Tests edge cases |
| `url-utils.test.ts` | Good | **REAL** - Tests URL building |
| `product-price.test.tsx` | Minimal | **WEAK** - Only 2 tests |

**Problem:** Only 4 unit test files for the entire codebase. We need way more.

---

## Final Architecture Decision

### **HYBRID APPROACH: Separate files, unified purpose**

```
e2e/
├── smoke.spec.ts         # Critical path only (5-10 tests max)
├── auth.spec.ts          # Auth flows
├── buyer.spec.ts         # Buyer journeys (consolidated)
├── seller.spec.ts        # Seller journeys (consolidated)
├── a11y.spec.ts          # Accessibility
├── api.spec.ts           # API route tests
├── mobile.spec.ts        # Mobile-specific
└── fixtures/
    ├── base.ts           # Core fixture
    ├── auth.ts           # Auth helpers
    ├── db.ts             # Database seeding
    └── assertions.ts     # Custom strict assertions

__tests__/
├── lib/                  # Library function tests
│   ├── format-price.test.ts
│   ├── safe-json.test.ts
│   ├── url-utils.test.ts
│   ├── currency.test.ts
│   └── ...
├── components/           # Component unit tests
│   ├── ui/
│   └── shared/
└── hooks/                # Hook tests
```

### **Files to DELETE**
1. `ux-audit-phase2.spec.ts` - One-off audit
2. `ux-phase2-search-categories.spec.ts` - One-off audit
3. `full-flow.spec.ts` - Bloated, never completes

### **Files to CONSOLIDATE**
1. `orders.spec.ts` + `sales.spec.ts` → `buyer.spec.ts` + `seller.spec.ts`
2. `reviews.spec.ts` → Merge into `buyer.spec.ts`
3. `profile.spec.ts` → Keep, but strip soft assertions
4. `account-phase5.spec.ts` → Merge into `profile.spec.ts`

### **Files to KEEP (cleaned)**
1. `smoke.spec.ts` - Stripped to essentials
2. `auth.spec.ts` - With real validation
3. `accessibility.spec.ts` - As-is
4. `mobile-responsiveness.spec.ts` - As-is
5. `seller-routes.spec.ts` - Expanded
6. `seller-create-listing.spec.ts` - As-is

---

## Test Philosophy

### Rules for REAL Tests

1. **NO `.catch(() => false)` patterns** - Let it fail!
2. **NO `test.skip` for working features** - If it's skipped, delete it
3. **NO soft "or" assertions** - Pick one truth
4. **Console errors = test failure** - No exceptions
5. **Timeouts max 30s per test** - If it takes longer, it's broken
6. **Every test MUST have failure conditions** - What makes it fail?
7. **Auth tests need real credentials** - Skip gracefully otherwise

### Assertion Categories

```typescript
// STRICT: Test fails if this is false
await expect(page.locator('h1')).toBeVisible()

// SOFT: Test continues (use sparingly for diagnostics)
await expect.soft(page.locator('.optional')).toBeVisible()

// NEVER: Don't do this
const visible = await element.isVisible().catch(() => false)
if (visible) { /* soft check */ }
```

---

## Implementation Plan

### Phase 1: Clean House (30 min)
- [ ] Delete audit files
- [ ] Remove all `.skip` tests that won't be fixed
- [ ] Strip console error suppression (be selective)

### Phase 2: Core Fixtures (1 hour)
- [ ] Create `base.ts` with strict assertions
- [ ] Create `db.ts` with seeding helpers
- [ ] Update `auth.ts` with better error handling

### Phase 3: Smoke Tests (30 min)
- [ ] Reduce to 5-10 critical tests
- [ ] Add console error failure
- [ ] Add response status assertions

### Phase 4: Integration Tests (2 hours)
- [ ] `buyer.spec.ts` - Real shopping flow
- [ ] `seller.spec.ts` - Real listing flow
- [ ] Remove all soft assertions

### Phase 5: Unit Tests (1 hour)
- [ ] Add tests for `lib/currency.ts`
- [ ] Add tests for `lib/geolocation.ts`
- [ ] Add tests for key components

### Phase 6: Run & Fix (ongoing)
- [ ] Run full suite
- [ ] Document real failures
- [ ] Fix code, not tests

---

## Test Scripts (Final)

```json
{
  "test": "pnpm test:unit && pnpm test:e2e:smoke",
  "test:unit": "vitest run",
  "test:e2e": "playwright test --grep-invert @accessibility",
  "test:e2e:smoke": "playwright test e2e/smoke.spec.ts",
  "test:e2e:auth": "playwright test e2e/auth.spec.ts",
  "test:a11y": "playwright test --grep @accessibility",
  "test:all": "pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:e2e && pnpm test:a11y",
  "test:ci": "pnpm test:unit && playwright test"
}
```

---

## Success Criteria

When this refactor is complete:

1. ✅ Running `pnpm test:e2e:smoke` shows real failures if app is broken
2. ✅ No tests use `.catch(() => false)` patterns
3. ✅ Zero `test.skip` for working features
4. ✅ Console errors cause test failures
5. ✅ Each test file has < 200 lines
6. ✅ Unit test coverage for all `lib/` functions
7. ✅ Auth tests work with real credentials or skip cleanly

---

## Next Actions

Starting implementation now. Will update this doc with findings.
