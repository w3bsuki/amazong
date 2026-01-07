# Testing Guide

Reference for verification gates, unit tests, and E2E tests on Treido. This is the **canonical testing guide** for both humans and agents.

---

## Required Gates

**Every non-trivial change MUST pass:**

```bash
# 1. Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# 2. E2E Smoke (with dev server running)
pnpm test:e2e:smoke
```

## Running Tests

### VS Code Tasks (Preferred)
| Task | Purpose |
|------|---------|
| `Dev Server (pnpm dev)` | Start dev server |
| `Typecheck (tsc --noEmit)` | Type checking |
| `E2E Smoke (reuse existing server)` | Quick E2E gate |
| `Unit Tests (pnpm test:unit)` | Unit tests |
| `Run E2E Tests` | Full E2E suite |

### Terminal Commands
```bash
# Unit tests
pnpm test:unit

# E2E smoke only
pnpm test:e2e:smoke

# Full E2E suite
pnpm test:e2e

# Specific E2E file
pnpm -s exec playwright test e2e/auth.spec.ts --project=chromium
```

## When to Run What

| Change Type | Minimum Gates | Additional |
|-------------|---------------|------------|
| Any code change | tsc + e2e:smoke | - |
| Auth changes | tsc + e2e:smoke | `e2e/auth.spec.ts` |
| Checkout changes | tsc + e2e:smoke | `e2e/orders.spec.ts` |
| Seller flows | tsc + e2e:smoke | `e2e/seller-routes.spec.ts` |
| Data fetching | tsc + e2e:smoke | Relevant unit tests |
| Pure utilities | tsc | Unit tests in `__tests__/` |

## Unit Tests (Vitest)

### Location
`__tests__/*.test.ts` and `__tests__/*.test.tsx`

### Running
```bash
# All unit tests
pnpm test:unit

# Specific file
pnpm -s exec vitest run __tests__/currency.test.ts

# Watch mode
pnpm -s exec vitest __tests__/currency.test.ts
```

### Existing Test Files
- `currency.test.ts` - Currency formatting
- `format-price.test.ts` - Price display
- `geolocation.test.ts` - Geo utilities
- `image-utils.test.ts` - Image URL handling
- `order-status.test.ts` - Order state logic
- `safe-json.test.ts` - JSON parsing
- `shipping.test.ts` - Shipping calculations
- `url-utils.test.ts` - URL manipulation
- `validations-auth.test.ts` - Auth validation schemas

### Writing Unit Tests
```tsx
import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/lib/format-price';

describe('formatPrice', () => {
  it('formats BGN correctly', () => {
    expect(formatPrice(1999, 'BGN')).toBe('19.99 лв.');
  });
});
```

## E2E Tests (Playwright)

### Location
`e2e/*.spec.ts`

### Test Files
| File | Purpose |
|------|---------|
| `smoke.spec.ts` | Critical path (ALWAYS RUN) |
| `auth.spec.ts` | Authentication flows |
| `orders.spec.ts` | Order/checkout flows |
| `seller-routes.spec.ts` | Seller dashboard |
| `profile.spec.ts` | User profile |
| `reviews.spec.ts` | Product reviews |
| `mobile-responsiveness.spec.ts` | Mobile layouts |
| `accessibility.spec.ts` | A11y checks |

### Running E2E
```bash
# Smoke tests only
pnpm test:e2e:smoke

# Specific spec
pnpm -s exec playwright test e2e/auth.spec.ts --project=chromium

# With UI (debugging)
pnpm -s exec playwright test e2e/smoke.spec.ts --ui

# Full suite
pnpm test:e2e
```

### Reusing Dev Server
```bash
REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 pnpm -s exec playwright test e2e/smoke.spec.ts --project=chromium
```

## Debugging Failed Tests

### Typecheck Errors
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit 2>&1 | head -50
```

### E2E Failures
```bash
# Headed browser
pnpm -s exec playwright test e2e/smoke.spec.ts --headed

# UI debugger
pnpm -s exec playwright test e2e/smoke.spec.ts --ui

# View trace
pnpm -s exec playwright show-trace test-results/*/trace.zip

# View report
pnpm exec playwright show-report playwright-report
```

### Unit Test Failures
```bash
pnpm -s exec vitest run __tests__/currency.test.ts --reporter=verbose
```

## Common Issues

### Port 3000 in Use
```powershell
# Kill existing process (PowerShell)
$pid = (Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object -First 1 -ExpandProperty OwningProcess)
if($pid){Stop-Process -Id $pid -Force}
```

Or use VS Code task: `Kill Port 3000`

### E2E Timeout
- Increase timeout: `test.setTimeout(60000)`
- Check if dev server is running
- Check network/database connectivity

### Flaky Tests
- Add explicit waits: `await page.waitForSelector('.loaded')`
- Use `expect.poll()` for async assertions
- Avoid time-based waits

## E2E-Only UI Behavior

Some UI is disabled during E2E to avoid blocking tests (e.g., cookie consent).
Search for `NEXT_PUBLIC_E2E` usage if a UI element seems missing.

## Verification Summary

**Minimum for any PR:**
- [x] `pnpm -s exec tsc -p tsconfig.json --noEmit` passes
- [x] `pnpm test:e2e:smoke` passes

**For auth/checkout/seller changes:**
- [x] Above, plus relevant E2E spec passes

**For utility/lib changes:**
- [x] Above, plus relevant unit tests pass
