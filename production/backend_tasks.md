# Backend Tasks — Production Launch Checklist

> **Comprehensive backend task list audited for V1 launch.**

**Created:** January 28, 2026  
**Audited:** January 29, 2026 (Opus)  
**Source:** production/production.md, audit/, TASKS.md, docs/PRD.md, docs/FEATURES.md

---

## Audit Summary

### Current State Assessment

| Metric | Before Audit | After Audit | Change |
|--------|--------------|-------------|--------|
| P1 Tasks | 6 | 6 | — |
| P2 Tasks | 8 | 10 | +2 (promoted from P3) |
| P3 Tasks | 5 | 3 | -2 (promoted to P2) |
| **Total Active** | 19 | 19 | — |
| Completed | 5 | 8 | +3 (verified) |

### PRD Hard Gates Status

| Gate | Status | Notes |
|------|--------|-------|
| Webhook idempotency | 🔄 In verification | B-P1-04 |
| Refund/dispute flow | 🔄 Needs testing | B-P1-05 |
| Support playbooks | ❌ Not started | OPS-P1-01 |
| Stripe env separation | 🔄 In verification | B-P1-06 |
| Leaked password protection | ⬜ Manual (dashboard) | B-P1-07 |
| Supabase Security Advisor | ❌ Not started | B-P1-08 |
| RLS on all tables | ✅ Done | Verified Jan 24 |
| No secrets in logs | ✅ Done | B-P1-03 complete |

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| **P1 (Blocker)** | 6 | Must fix before launch |
| **P2 (Should Fix)** | 10 | Important for quality/security |
| **P3 (Nice to Have)** | 3 | Optimization items |
| **Total** | 19 | |

---

## P1 — Launch Blockers

These **must** be fixed before production deployment.

| ID | Task | Source | Files/Location | Owner | Status |
|----|------|--------|----------------|-------|--------|
| B-P1-04 | Verify webhook idempotency (no duplicate orders) | PRD.md | Manual test: replay webhook | Codex | 🔄 In Progress |
| B-P1-05 | Test refund/dispute flow end-to-end | PRD.md | Manual test: full flow | — | ⬜ Unclaimed |
| B-P1-06 | Verify Stripe environment separation (test vs live) | PRD.md | Check env vars | Codex | 🔄 In Progress |
| B-P1-07 | Enable leaked password protection in Supabase | TASKS.md | Supabase Dashboard > Auth > Security | — | ⬜ Manual (dashboard) |
| B-P1-08 | Run Supabase Security Advisor + record findings/exceptions | PRD.md | Supabase Dashboard > Security Advisor | — | ⬜ Manual (dashboard) |
| OPS-P1-01 | Write support playbooks (refund/dispute, SLAs, escalation, prohibited items) | production.md | `docs-site/support/*`, `docs-site/legal/*` | — | ⬜ Unclaimed |

---

## P2 — Should Fix (Security/Quality)

Important for production quality and security.

| ID | Task | Source | Files/Location |
|----|------|--------|----------------|
| B-P2-01 | Regenerate Supabase types (`supabase gen types`) | TASKS.md | `lib/supabase/database.types.ts` |
| B-P2-02 | Audit all `'use cache'` calls have `cacheLife()` pairing | TASKS.md | All server functions with cache |
| B-P2-03 | Remove unused exports per `pnpm -s knip` | TASKS.md | Various files |
| B-P2-04 | Fix Supabase connection errors on /chat and /sell | MOBILE_AUDIT | `lib/supabase/*`, API routes |
| B-P2-05 | Fix category tree query error on sell page | MOBILE_AUDIT | `app/[locale]/(sell)/sell/*` |
| B-P2-06 | Fix cart sync RPC unavailable errors | MOBILE_AUDIT | `lib/cart/*`, RPC functions |
| B-P2-07 | Add E2E tests for admin routes | TASKS.md | `e2e/admin.spec.ts` (new) |
| B-P2-08 | Run Lighthouse on key pages (Home, PDP, Search) | TASKS.md | Performance audit |
| B-P2-09 | Complete cancel order flow (buyer side) | FEATURES.md | `app/actions/orders.ts` |
| B-P2-10 | Complete refund flow (seller side, admin-assisted) | FEATURES.md | `app/actions/orders.ts` |

---

## P3 — Nice to Have (Optimization)

Low priority, can be addressed post-launch.

| ID | Task | Source | Files/Location |
|----|------|--------|----------------|
| B-P3-01 | Remove Capacitor deps (if mobile out of scope) | TASKS.md | `package.json`, `capacitor.config.ts` |
| B-P3-04 | Add email notifications backend | FEATURES.md | New: `lib/email/*` |
| B-P3-05 | Add saved searches feature | FEATURES.md | DB exists, API needed |

---

## Completed (Verified)

| ID | Task | Completed | Notes |
|----|------|-----------|-------|
| ~~B-P1-01~~ | Verify checkout session action typing (no unsafe casts) | 2026-01-29 | `app/[locale]/(checkout)/_actions/checkout.ts` |
| ~~B-P1-02~~ | Fix TypeScript `as any` cast in payments webhook | 2026-01-29 | `app/api/payments/webhook/route.ts` |
| ~~B-P1-03~~ | Remove/guard server console.log (no secrets in logs) | 2026-01-29 | Connect webhook, category search |
| ~~B-01~~ | Clean test/dummy products from DB | 2026-01-28 | 17 products deleted |
| ~~B-02~~ | Delete orphan orders with 0 items | 2026-01-28 | 4 orders deleted |
| ~~B-03~~ | Fix orders stuck in pending status | 2026-01-28 | Updated to delivered |
| ~~B-04~~ | Fix badge evaluation trigger | 2026-01-28 | Trigger fixed |
| ~~B-05~~ | Fix reviews display logic | 2026-01-28 | Uses reviews array |

---

## Task Details

### B-P1-01 (Done): Verify Checkout Session Action Typing (No Unsafe Casts)

**Status:** ✅ Completed (2026-01-29)

**Problem:** Previously tracked as an unsafe cast; verify current checkout session server action is type-safe.

**Location:** `app/[locale]/(checkout)/_actions/checkout.ts`

**Solution:**
1. Search for `as any`/unsafe casts in checkout session action
2. If found, replace with proper parsing/validation types
3. Run typecheck to verify

---

### B-P1-07: Enable Leaked Password Protection

**Problem:** Users may use compromised passwords

**Solution:**
1. Go to Supabase Dashboard
2. Navigate to: Authentication > Settings > Security
3. Enable "Leaked Password Protection"
4. This checks against HaveIBeenPwned database

**Verification:** Try to sign up with known compromised password

---

### B-P1-08: Run Supabase Security Advisor

**Goal:** Re-verify Supabase security posture before launch and document results.

**Steps:**
1. Supabase Dashboard → Security Advisor → run all checks
2. Fix findings (or document exceptions + follow-up tasks)
3. Record results in a dated audit note (e.g. `audit/2026-01-29_supabase-security-advisor.md`)

**Exit:** Security Advisor is clean, or exceptions are documented with rationale + owner.

---

### OPS-P1-01: Support Playbooks (Refunds/Disputes + SLAs + Prohibited Items)

**Goal:** Support can handle refunds/disputes without engineering escalation for routine cases.

**Primary docs-site targets (expand/verify):**
- `docs-site/content/payments/refunds-disputes.mdx`
- `docs-site/content/payments/ops-runbook.mdx`
- `docs-site/content/policies/prohibited-items.mdx`

**Add if missing:** a dedicated SLA/escalation doc under `docs-site/content/policies/*` or `docs-site/content/guides/*`.

**Exit:** Decision tree + SLAs + escalation paths are written, linked, and internally shared.

---

### B-P1-04: Verify Webhook Idempotency

**Problem:** Webhook events can be delivered multiple times by Stripe

**Test procedure:**
1. Create test order in Stripe test mode
2. Trigger `checkout.session.completed` webhook
3. Note order ID created
4. Replay same webhook event
5. Verify: No duplicate order created

**Expected:** Second webhook call is no-op

**Files:** `app/api/checkout/webhook/route.ts`

---

### B-P2-01: Regenerate Supabase Types

**Problem:** TypeScript types may be out of sync with database schema

**Command:**
```bash
pnpm supabase gen types typescript --project-id <project-id> > lib/supabase/database.types.ts
```

**Alternative (if using linked project):**
```bash
pnpm supabase gen types typescript --linked > lib/supabase/database.types.ts
```

---

### B-P2-04: Fix Supabase Connection Errors

**Problem:** 503 errors and connection timeouts on /chat and /sell

**Errors found:**
- "upstream connect error or disconnect/reset before headers"
- "Error loading conversations"
- "[getCategoryTreeDepth3] Root query error"

**Possible causes:**
1. Connection pool exhaustion
2. Query timeout
3. RLS policy complexity
4. Network issues

**Investigation steps:**
1. Check Supabase dashboard for connection metrics
2. Review RLS policies on affected tables
3. Add connection pooling configuration
4. Add retry logic with exponential backoff

---

### B-P2-06: Fix Cart Sync RPC Errors

**Problem:** "Cart sync skipped (RPC unavailable)" errors

**Error pattern:**
- Appears on multiple pages
- "Error fetching server cart"
- RPC function may not exist or have wrong permissions

**Investigation:**
1. Check if RPC function exists in Supabase
2. Verify function permissions (which roles can call)
3. Check if function signature matches client call
4. Add better error handling/fallback

---

## Security Checklist

Before launching, verify all items:

### Authentication
- [ ] Email confirmation required
- [ ] Password strength requirements met
- [ ] Leaked password protection enabled (B-P1-07)
- [ ] Session expiry configured appropriately
- [ ] OAuth providers configured correctly

### Authorization (RLS)
- [ ] RLS enabled on all user data tables
- [ ] Policies tested with different user roles
- [ ] No `select('*')` in hot paths
- [ ] Service role key not exposed to client

### Payments (Stripe)
- [ ] Webhook signatures verified
- [ ] Webhook handlers idempotent (B-P1-04)
- [ ] Test vs live environment separated (B-P1-06)
- [ ] No secrets in logs
- [ ] Customer PII protected

### Data Protection
- [ ] No PII in server logs
- [ ] No PII in client console
- [ ] Sensitive data encrypted at rest
- [ ] GDPR compliance (data export/deletion)

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Lighthouse |
| FCP | < 1.8s | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| TTFB | < 600ms | WebPageTest |
| Lighthouse Performance | > 80 | Desktop + Mobile |

### Pages to Measure
1. Homepage (`/en`)
2. Search results (`/en/search`)
3. Product detail (`/en/[store]/[product]`)
4. Category page (`/en/categories/fashion`)
5. Cart (`/en/cart`)

---

## Database Health

### Tables to Audit

| Table | RLS | Indexes | Hot Path |
|-------|-----|---------|----------|
| `products` | ✅ | Review | Yes |
| `orders` | ✅ | Review | Yes |
| `order_items` | ✅ | Review | Yes |
| `carts` | ✅ | Review | Yes |
| `cart_items` | ✅ | Review | Yes |
| `messages` | ✅ | Review | Yes |
| `conversations` | ✅ | Review | Yes |
| `reviews` | ✅ | Review | Yes |
| `profiles` | ✅ | Review | Yes |

### Query Optimization
- [ ] Review slow query logs
- [ ] Add missing indexes
- [ ] Optimize N+1 queries
- [ ] Use projections (no `select('*')`)

---

## Verification Commands

```bash
# TypeScript
pnpm -s typecheck

# Lint
pnpm -s lint

# Unit tests
pnpm -s test:unit

# E2E smoke
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

# Unused exports
pnpm -s knip

# Duplicate code
pnpm -s dupes
```

---

## Completed Tasks

| ID | Task | Completed | Verified By |
|----|------|-----------|-------------|
| ~~B-01~~ | Clean test/dummy products from DB | 2026-01-28 | DB audit |
| ~~B-02~~ | Delete orphan orders with 0 items | 2026-01-28 | DB audit |
| ~~B-03~~ | Fix orders stuck in pending status | 2026-01-28 | DB audit |
| ~~B-04~~ | Fix badge evaluation trigger | 2026-01-28 | DB audit |
| ~~B-05~~ | Fix reviews display logic | 2026-01-28 | Code review |
| ~~B-P1-01~~ | Verify checkout action typing | 2026-01-29 | Codex |
| ~~B-P1-02~~ | Fix `as any` in payments webhook | 2026-01-29 | Codex |
| ~~B-P1-03~~ | Remove server console.log calls | 2026-01-29 | Codex |

---

## Task Ownership Tracker

| Task | Owner | Status | Started | Completed |
|------|-------|--------|---------|-----------|
| B-P1-01 | Codex | ✅ Done | 2026-01-29 | 2026-01-29 |
| B-P1-02 | Codex | ✅ Done | 2026-01-29 | 2026-01-29 |
| B-P1-03 | Codex | ✅ Done | 2026-01-29 | 2026-01-29 |
| B-P1-04 | Codex | 🔄 In Progress | 2026-01-29 | — |
| B-P1-05 | — | ⬜ Unclaimed | — | — |
| B-P1-06 | Codex | 🔄 In Progress | 2026-01-29 | — |
| B-P1-07 | — | ⬜ Manual (dashboard) | — | — |
| B-P1-08 | — | ⬜ Manual (dashboard) | — | — |
| OPS-P1-01 | — | ⬜ Unclaimed | — | — |

---

## Dependencies

### External Dependencies

| Backend Task | External Dependency |
|--------------|---------------------|
| B-P1-07 (Leaked password) | Supabase dashboard access |
| B-P1-08 (Security Advisor) | Supabase dashboard access |
| B-P1-06 (Stripe env) | Vercel env vars access |
| B-P1-05 (Refund flow) | Stripe test mode account |
| OPS-P1-01 (Playbooks) | docs-site edit/publish access |

### Blocks Frontend

| Backend Task | Blocks Frontend Task |
|--------------|---------------------|
| B-P2-04 (Supabase errors) | F-P1-06 (Cart badge) |
| B-P2-06 (Cart sync RPC) | F-P1-06 (Cart badge) |
| Test data cleanup | F-P1-07 (Test products) |

---

---

## Deployment Checklist

### Pre-Deploy
- [ ] All P1 tasks completed
- [ ] All verification gates pass
- [ ] Manual testing complete
- [ ] Staging environment tested

### Deploy
- [ ] Production build succeeds (`pnpm build`)
- [ ] Vercel deployment completes
- [ ] Smoke tests pass on production URL

### Post-Deploy (24h)
- [ ] Monitor error tracking
- [ ] Check Stripe webhook health
- [ ] Review Supabase dashboard
- [ ] Check performance metrics

---

*Last updated: January 29, 2026*
