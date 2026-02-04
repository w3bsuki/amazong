---
title: Testing Patterns & Decisions
impact: high
impactDescription: Consistent patterns prevent flaky tests and improve maintainability
tags: [patterns, isolation, naming, what-to-test]
---

# patterns.md — Testing Patterns & Decisions

> Guidelines for what to test where, naming conventions, and isolation strategies.

## What to Test Where

### E2E Tests (Playwright)

**Use for:**
- Critical user journeys (auth, checkout, purchase)
- Multi-page flows
- Integration between frontend and backend
- Visual regressions
- Accessibility compliance

**Examples:**
- User can browse products → add to cart → checkout
- User can sign in → view orders → track shipment
- Mobile navigation works correctly

### Unit Tests (Vitest)

**Use for:**
- Pure functions and utilities
- Hooks (isolated from components)
- Data transformations
- Validation logic
- Edge cases and error handling

**Examples:**
- `formatPrice(29.99, 'bg')` returns correct format
- `useCart` hook adds/removes items correctly
- `validateEmail` rejects invalid formats

### Decision Matrix

| Scenario | E2E | Unit |
|----------|-----|------|
| Price formatting | | ✅ |
| Cart calculations | | ✅ |
| Checkout flow | ✅ | |
| Form validation | | ✅ |
| Auth login flow | ✅ | |
| URL parsing | | ✅ |
| Mobile navigation | ✅ | |
| API response mapping | | ✅ |
| i18n message parity | | ✅ |

---

## Test Isolation (`test-isolation`)

### Principles

1. **Tests run independently** — No test depends on another's outcome
2. **No shared mutable state** — Each test starts fresh
3. **Deterministic** — Same inputs = same outputs
4. **Parallel-safe** — Can run in any order

### E2E Isolation

```tsx
// ✅ Correct: Clear state before each test
test.beforeEach(async ({ app }) => {
  await app.clearAuthSession();
});

// ✅ Correct: Use unique test data
const uniqueEmail = `test-${Date.now()}@example.com`;
```

### Unit Test Isolation

```tsx
// ✅ Correct: Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

// ✅ Correct: Create fresh data each test
const createMockProduct = () => ({
  id: crypto.randomUUID(),
  name: 'Test Product',
});
```

### Anti-Patterns

```tsx
// ❌ Wrong: Shared mutable state
let globalCart = [];

describe('cart', () => {
  it('adds item', () => {
    globalCart.push(item);  // Leaks to next test!
  });
});

// ❌ Wrong: Test depends on previous test
it('adds item', async () => { /* adds item */ });
it('removes item', async () => { /* assumes item exists */ });
```

---

## Hardcoded Waits (`test-no-hardcoded-wait`)

### Why Forbidden

1. **Flaky** — Arbitrary timing doesn't match real conditions
2. **Slow** — Always waits full duration even when ready sooner
3. **CI variance** — Different machines have different speeds

### Correct Alternatives

```tsx
// ❌ Wrong
await page.waitForTimeout(3000);

// ✅ Correct: Wait for condition
await expect(page.getByRole('button')).toBeEnabled();
await app.waitForHydration();
await page.waitForResponse('**/api/products');
```

### When Timeouts Are Acceptable

```tsx
// Short delays for debounce (< 100ms)
await page.waitForTimeout(50);  // Only in specific debounce scenarios
```

---

## Test Naming (`test-naming`)

### Format

```
[unit under test] [expected behavior] [context/condition]
```

### Good Examples

```tsx
// ✅ Describes behavior
it('returns formatted price in EUR for BG locale', () => {});
it('throws error when input is negative', () => {});
it('adds item to cart when product is in stock', () => {});
it('redirects to login when session expires', async () => {});
```

### Bad Examples

```tsx
// ❌ Too vague
it('works', () => {});
it('test1', () => {});

// ❌ Implementation-focused
it('calls setState with new value', () => {});
it('updates the items array', () => {});
```

### describe Blocks

```tsx
// ✅ Groups related tests
describe('formatPrice', () => {
  describe('with valid input', () => {
    it('formats integers', () => {});
    it('formats decimals', () => {});
  });
  
  describe('with invalid input', () => {
    it('throws on negative values', () => {});
    it('throws on NaN', () => {});
  });
});
```

---

## Test Data Patterns

### Factories

```tsx
// test/factories.ts
export function createProduct(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Test Product',
    price: 29.99,
    status: 'active',
    ...overrides,
  };
}

// Usage
const product = createProduct({ price: 49.99 });
```

### Fixtures (Static Data)

```tsx
// test/fixtures/products.ts
export const MOCK_PRODUCTS = [
  { id: '1', name: 'iPhone 15', price: 999 },
  { id: '2', name: 'Samsung Galaxy', price: 899 },
];
```

### Unique Data for Parallel Tests

```tsx
// E2E: Timestamp-based IDs
const testEmail = `user-${Date.now()}@test.com`;

// Unit: crypto.randomUUID()
const product = createProduct({ id: crypto.randomUUID() });
```

---

## Assertion Patterns

### Positive Assertions

```tsx
// ✅ Be specific
expect(result).toBe('expected');
expect(items).toHaveLength(3);
expect(page.getByRole('button')).toBeVisible();
```

### Negative Assertions

```tsx
// ✅ Assert absence
expect(error).toBeNull();
expect(page.getByRole('alert')).not.toBeVisible();
```

### Async Assertions

```tsx
// ✅ Await expectations
await expect(asyncFn()).resolves.toBe('value');
await expect(asyncFn()).rejects.toThrow('error');
```

---

## Coverage Strategy

### What to Cover

- Business logic (100%)
- Data transformations (100%)
- Edge cases (all known)
- Error paths (all handlers)

### What NOT to Cover

- Framework code (Next.js, React internals)
- Third-party libraries
- Type definitions
- Static configuration files

### Coverage Thresholds

| Metric | Threshold |
|--------|-----------|
| Lines | 80% |
| Functions | 70% |
| Branches | 60% |
| Statements | 80% |

---

## Flaky Test Prevention

### Common Causes

1. **Network timing** — Use proper waits, not timeouts
2. **Animation delays** — Disable animations in tests
3. **Race conditions** — Ensure proper sequencing
4. **Shared state** — Reset between tests

### Debug Strategies

1. Run test in isolation: `pnpm test -- --run -t "test name"`
2. Add console.log for state inspection
3. Use Playwright trace viewer
4. Check for missing `await`
