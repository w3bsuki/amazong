# Treido Production Readiness — Master Plan

> **Consolidated**: Jan 18, 2026  
> **Sources**: execution-plan-2026-01-18.md, final.md, supabase-audit, track-a/b/c reports, knip-report

---

## Execution Order

**Plan B (Backend) → Plan A (Frontend) → Plan C (Infra)**

Rationale: Backend fixes (data integrity, security) must land first. Frontend polish depends on stable APIs. Infra/quality cleanup is lowest risk, done last.

---

## P0 Blockers (Fix Before Launch)

| # | Issue | Location | Fix | Time |
|---|-------|----------|-----|------|
| 1 | Double stock decrement | `supabase/migrations/` | Remove duplicate trigger | 30m |
| 2 | Avatars bucket not in prod | Missing migration | Apply migration to production | 5m |
| 3 | Leaked password protection | Supabase Dashboard | Enable in Auth settings | 2m |
| 4 | Untrusted Origin redirect | `app/[locale]/(checkout)/` | Use env var `NEXT_PUBLIC_BASE_URL` | 1h |

**Total P0 time: ~2 hours**

---

## Plan B — Backend & Data (8 items)

### B1. Payment Redirect Safety (P0)
- **Files**: `app/[locale]/(checkout)/checkout/success/page.tsx`, `cancel/page.tsx`
- **Issue**: Uses `request.headers.get('Origin')` which can be spoofed
- **Fix**: Replace with `process.env.NEXT_PUBLIC_BASE_URL`

### B2. Username .ilike() Injection (P1)
- **Files**: `app/actions/profile-actions.ts`, `lib/supabase/queries/users.ts`
- **Issue**: `.ilike('username', value)` without escaping `%` or `_`
- **Fix**: Escape wildcards or use exact `.eq()` match

### B3. Stock Decrement Duplicate (P0)
- **Files**: `supabase/migrations/`
- **Issue**: Two triggers both decrementing stock
- **Fix**: Remove one trigger, verify with test order

### B4. Avatars Bucket Migration (P0)
- **Status**: Migration exists locally but not applied to prod
- **Fix**: Run migration in Supabase Dashboard or CLI

### B5. Edge Function JWT Disabled
- **Files**: `supabase/functions/`
- **Issue**: Some functions have `verify_jwt: false`
- **Fix**: Review each function, enable JWT where appropriate

### B6. Price Formatting Duplication (P2)
- **Files**: `lib/currency.ts`, `lib/price.ts`, `utils/format.ts`
- **Fix**: Consolidate to single `formatPrice()` in `lib/currency.ts`

### B7. Order Queries Duplication (P2)
- **Files**: Multiple order query implementations
- **Fix**: Consolidate to `lib/supabase/queries/orders.ts`

### B8. Shipping Calculator Drift (P2)
- **Files**: `lib/shipping.ts`, `lib/shipping/calculator.ts`
- **Fix**: Single source of truth for shipping logic

---

## Plan A — Frontend & UI (7 items)

### A1. Server Action Boundary Violations (P1)
- **Issue**: 6 components import server actions directly
- **Files**:
  - `components/products/ProductDetailClient.tsx`
  - `components/products/ProductPageClient.tsx`
  - `components/profile/ProfileContent.tsx`
  - `components/chat/ChatWindow.tsx`
  - `components/notifications/NotificationBell.tsx`
  - `components/orders/OrderActions.tsx`
- **Fix**: Pass actions as props from parent Server Components

### A2. i18n Bypass — Hardcoded Strings (P1)
- **Files**: Various components with hardcoded Bulgarian/English text
- **Fix**: Move all user-facing strings to `messages/en.json` and `messages/bg.json`

### A3. Hardcoded Colors (P2)
- **Files**: Multiple components using `#hex` or `rgb()` values
- **Fix**: Replace with Tailwind CSS variables from design system

### A4. Mobile Home Shell Duplication (P2)
- **Files**: `components/home/MobileHomeShell.tsx`, `components/layout/MobileHomeShell.tsx`
- **Fix**: Delete one, keep canonical version in `components/layout/`

### A5. Product Page Duplication (P2)
- **Files**: `app/[locale]/(main)/p/[slug]/` has multiple similar implementations
- **Fix**: Consolidate to single ProductPage component

### A6. Desktop Feed Polish (P3)
- **Files**: `app/[locale]/(main)/page.tsx`, feed components
- **Fix**: Improve layout, loading states, empty states

### A7. Touch Target Sizing (P3)
- **Files**: Various mobile components
- **Fix**: Ensure 44px minimum touch targets per WCAG

---

## Plan C — Infra & Quality (4 items)

### C1. Config Duplication (P2)
- **Files**: `config/`, root config files
- **Fix**: Consolidate environment config to single source

### C2. Hardcoded Paths (P2)
- **Files**: Scripts with absolute paths
- **Fix**: Use relative paths or environment variables

### C3. Dead Code Removal (P2)
- **Source**: knip-report.md
- **32 unused files** to delete
- **2 unused deps**: `@capacitor/android`, `@capacitor/core`
- **5 unused exports** to remove

### C4. Test Coverage Gaps (P3)
- **Fix**: Add tests for critical paths (checkout, auth, orders)

---

## Validation Gates

Run after every change:

```bash
# 1. Type check
pnpm -s exec tsc -p tsconfig.json --noEmit

# 2. Lint
pnpm -s lint

# 3. Unit tests
pnpm test:unit

# 4. E2E smoke
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# 5. Production build (before deploy)
pnpm -s build
```

---

## Files to Keep in /codex

| File | Purpose |
|------|---------|
| `MASTER-PLAN.md` | This consolidated plan |
| `supabase-audit-2026-01-17.md` | RLS/trigger reference |
| `knip-report.md` | Dead code inventory |
| `folder-inventory.md` | Directory structure reference |

---

## Files to Delete from /codex

These are superseded by MASTER-PLAN.md:

- `cleanup-audit-plan.md`
- `codebase-audit-2026-01-17.md`
- `codebase-audit-2026-01-17-deep.md`
- `codebase-audit-2026-01-17-full.md`
- `desktop-feed-audit-2026-01-17.md`
- `desktop-header-landing-audit-2026-01-17.md`
- `desktop-ui-ux-audit-2026-01-17.md`
- `execution-plan-2026-01-18.md`
- `final.md`
- `final_audit.md`
- `production-audit-2026-01-17.md`
- `refactor/` (entire folder)

---

## Launch Checklist

- [ ] P0 blockers resolved
- [ ] All validation gates pass
- [ ] Supabase migrations applied to prod
- [ ] Environment variables verified
- [ ] Stripe webhooks configured
- [ ] DNS/SSL configured
- [ ] Error monitoring enabled (Sentry)
- [ ] Analytics enabled
