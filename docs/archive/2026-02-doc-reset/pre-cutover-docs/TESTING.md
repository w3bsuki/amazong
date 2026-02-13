# TESTING.md — Testing Strategy & QA Plan

> How to test Treido: commands, frameworks, coverage, and the full QA protocol.

| Scope | Unit tests, E2E tests, QA process |
|-------|-----------------------------------|
| Audience | AI agents, developers |
| Type | Reference + How-To |
| Last verified | 2026-02-08 |

---

## Quick Commands

```bash
# Unit tests
pnpm -s test:unit                    # Run all unit tests (Vitest)
pnpm -s test:unit -- --watch         # Watch mode
pnpm -s test:unit:coverage           # With coverage enforcement

# E2E tests
pnpm -s test:e2e                     # Full Playwright (all browsers)
pnpm -s test:e2e:smoke               # Smoke tests only (auto-starts server)
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke   # Against running dev server

# Accessibility
pnpm -s test:a11y                    # Accessibility project (axe-core)

# Quality gates (run after every change)
pnpm -s typecheck                    # TypeScript (tsc --noEmit)
pnpm -s lint                         # ESLint
pnpm -s styles:gate                  # Tailwind palette/token scan
```

---

## Guide Quickstart (Merged from Legacy Testing Guide)

This section replaces the old `docs/guides/testing.md` doc.

### Typical Test Locations

```text
__tests__/
e2e/
lib/**/*.test.ts
hooks/**/*.test.tsx
components/**/*.test.tsx
```

### Practical Run Order

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
pnpm -s test:a11y
```

### Merge Checklist

- [ ] Unit tests pass
- [ ] Smoke E2E passes
- [ ] No flaky behavior introduced
- [ ] New logic has tests
- [ ] Coverage thresholds remain satisfied

---

## Unit Tests (Vitest)

### Configuration

| Setting | Value |
|---------|-------|
| Framework | Vitest + jsdom |
| Setup file | `test/setup.ts` |
| Config | `vitest.config.ts` |
| Plugins | `@vitejs/plugin-react`, `vite-tsconfig-paths` |

### File Locations

```
__tests__/**/*.{test,spec}.{ts,tsx}    # Primary test directory
lib/**/*.{test,spec}.{ts,tsx}          # Co-located lib tests
hooks/**/*.{test,spec}.{ts,tsx}        # Co-located hook tests
components/**/*.{test,spec}.{ts,tsx}   # Co-located component tests
```

### Coverage Thresholds

| Metric | Threshold |
|--------|-----------|
| Lines | 80% |
| Functions | 70% |
| Branches | 60% |
| Statements | 80% |

Coverage provider: **v8**. Reports: text, html, lcov.

Coverage scope: `lib/**` and `hooks/**` (excludes Supabase clients, Stripe setup, server-only data fetching, AI integrations, auth helpers, and other runtime-dependent modules — see `vitest.config.ts` for full exclusion list).

### Writing Unit Tests

```tsx
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/lib/currency'

describe('formatPrice', () => {
  it('formats BGN correctly', () => {
    expect(formatPrice(1999, 'BGN')).toBe('19,99 лв.')
  })

  it('formats EUR correctly', () => {
    expect(formatPrice(1999, 'EUR')).toBe('€19.99')
  })
})
```

### Component Tests

```tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/shared/product/product-card'

describe('ProductCard', () => {
  it('renders product info', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
})
```

### Mocking

Vitest is configured with `clearMocks: true`, `restoreMocks: true`, `mockReset: true`. Mocks auto-reset between tests.

`next-intl` is inlined via Vitest server deps for ESM compatibility.

---

## E2E Tests (Playwright)

### Configuration

| Setting | Value |
|---------|-------|
| Framework | Playwright |
| Config | `playwright.config.ts` |
| Test directory | `e2e/` |
| Global setup | `e2e/global-setup.ts` (warms key routes) |
| Test timeout | 60s |
| Navigation timeout | 60s (Next.js dev compilation) |
| Web server readiness | 120s timeout |

### Browser Projects

| Project | Device | Notes |
|---------|--------|-------|
| `chromium` | Desktop Chrome | Primary |
| `firefox` | Desktop Firefox | Cross-browser |
| `webkit` | Desktop Safari | Cross-browser |
| `mobile-chrome` | Pixel 5 | Mobile viewport |
| `mobile-safari` | iPhone 12 | Mobile viewport |
| `accessibility` | Desktop Chrome | axe-core subset |

### Test Files

```
e2e/
├── smoke.spec.ts          # Critical path smoke tests
├── auth.spec.ts           # Authentication flows
├── seller-routes.spec.ts  # Seller journey
└── ...
```

### Running E2E

```bash
# Full suite (all browsers)
pnpm -s test:e2e

# Smoke only (Chromium, reuse running server)
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

# Specific file
pnpm -s test:e2e e2e/auth.spec.ts

# With Playwright UI
pnpm -s test:e2e -- --ui

# Debug mode
pnpm -s test:e2e -- --debug
```

### Server Management

- By default, Playwright starts its own dev server (port auto-detected).
- Set `REUSE_EXISTING_SERVER=true` to test against an already-running server.
- Safety check: refuses to run against non-local URLs unless `PW_ALLOW_NON_LOCAL=true`.

### Artifacts

| Artifact | When |
|----------|------|
| Screenshots | On failure |
| Video | On first retry |
| Trace | On first retry |
| HTML report | Always (`playwright-report/`) |

---

## Quality Gates

Run after every code change:

```bash
pnpm -s typecheck        # TypeScript compiler check
pnpm -s lint             # ESLint (0 errors required)
pnpm -s styles:gate      # Tailwind token/palette compliance
```

Risk-based (when touching business logic):

```bash
pnpm -s test:unit                                      # All unit tests
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke       # E2E smoke
```

Full pre-deploy:

```bash
pnpm -s lint && pnpm -s typecheck && pnpm -s styles:gate && pnpm -s test:unit && pnpm build
```

---

## QA Verification Protocol

Condensed from the 13-phase production test plan. Work through phases in order; fix all failures before advancing.

### Severity Legend

| Tag | Meaning |
|-----|---------|
| 🔴 P0 | Blocks launch — must fix |
| 🟠 P1 | Major UX issue — should fix before launch |
| 🟡 P2 | Polish — fix if time allows |
| 🟢 P3 | Nice-to-have — post-launch |

### Phase Summary

| Phase | Area | Key Checks |
|-------|------|------------|
| 1 | Auth & Sessions | Sign up, login, email confirmation, session persistence, protected routes |
| 2 | Onboarding | First-login redirect, account type selection, public routes not gated |
| 3 | Profile & Account | Profile editing, address book, payment methods, security settings |
| 4 | Selling | Sell wizard (category → details → price → images → publish), Connect setup |
| 5 | Discovery & PDP | Home feed, categories, search + filters, product detail, image gallery |
| 6 | Cart & Checkout | Add to cart, Stripe checkout, webhook order creation, idempotency |
| 7 | Orders | Buyer order tracking, seller ship/deliver, confirm received → payout |
| 8 | Social | Wishlist, real-time messaging, reviews & ratings, following |
| 9 | Business Dashboard | Plan subscription, dashboard gating, analytics, inventory |
| 10 | Trust & Admin | Reporting, blocking, admin moderation, admin route gating |
| 11 | i18n & Legal | Locale switching, translations, legal pages, keyboard navigation |
| 12 | Styling Audit | shadcn/Tailwind v4 compliance sweep, mobile responsiveness (375px) |
| 13 | Final Verification | All gates pass, E2E smoke, manual critical-path spot-checks |

### Execution Priority

1. **Round 1** — Fix P0 blockers across all phases first
2. **Round 2** — Fix P1 UX issues
3. **Round 3** — Phase-by-phase systematic testing, logging new issues
4. **Final** — Phase 13 verification

### Gate Check (between phases)

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

→ Full test plan with per-phase checklists: `docs/PRODUCTION-TEST-PLAN.md`
→ Route-by-route execution tracker: `production-audit/master.md`

---

## Current Test Health

### Automated Gates (2026-02-08)

| Gate | Status | Details |
|------|--------|---------|
| TypeScript (`pnpm -s typecheck`) | ✅ Pass | Zero errors |
| ESLint (`pnpm -s lint`) | ✅ Pass | 0 errors, 335 warnings (non-blocking) |
| Tailwind (`pnpm -s styles:gate`) | ✅ Pass | 0 violations across all scanners |
| Unit tests (`pnpm -s test:unit`) | ✅ Pass | 29 files, 405 tests, 87s |
| E2E smoke | 🟡 Partial | 22 passed, 1 failed (HYDRA-001 fixed), 3 skipped (auth-gated) |
| Build (`pnpm build`) | ⬜ Deferred | Active dev session |

### Route Health (58 routes verified)

| Category | Count | Result |
|----------|-------|--------|
| Public EN routes (`/en/*`) | 31 | All 200 ✅ |
| BG locale routes (`/bg/*`) | 11 | All 200 ✅ |
| Account routes (unauthenticated) | 11 | All 307 redirect ✅ |
| Dashboard + Admin | 2 | 200 ✅ |
| API endpoints (`/api/*`) | 3 | 200 ✅ |

### Open Test Issues

| ID | Severity | Description |
|----|----------|-------------|
| AUTH-001 | 🔴 P0 | Login doesn't reflect auth state without hard refresh |
| SELL-001 | 🔴 P0 | Sell form stuck on last step, cannot publish |
| CAT-001 | 🔴 P0 | Product cards show L4 subcategory instead of L0 root |
| AUTH-002/003 | 🟠 P1 | Auth forms: shadcn styling + mobile responsiveness |
| ONB-001/002 | 🟠 P1 | Onboarding: hardcoded styles + public route gating |
| SELL-002 | 🟠 P1 | Sell wizard needs shadcn refactor |

---

## Test Checklist (Before Merging)

- [ ] All unit tests pass (`pnpm -s test:unit`)
- [ ] E2E smoke passes (`pnpm -s test:e2e:smoke`)
- [ ] No flaky tests introduced
- [ ] New features have corresponding tests
- [ ] Coverage thresholds maintained
- [ ] All quality gates pass (typecheck + lint + styles:gate)

---

## See Also

- `docs/PRODUCTION-TEST-PLAN.md` — Full 13-phase QA checklist with per-test-case tracking
- `production-audit/master.md` — Execution board for 18 phase audit files
- `docs/PRODUCTION.md` — Production readiness tracker
- `vitest.config.ts` — Unit test configuration
- `playwright.config.ts` — E2E test configuration

---

*Last updated: 2026-02-11*
