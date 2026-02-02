# Production Push Masterplan

> **Goal:** Ship Treido V1 to production with zero critical issues.  
> **Started:** 2026-02-02  
> **Target:** Production-ready in ~25-30 working hours

---

## Current State Assessment

| Metric | Value |
|--------|-------|
| **Feature Completion** | 92% actual (87% documented) |
| **Backend Readiness** | ✅ Production ready |
| **Frontend Issues** | 12 high, 7 medium, 1 low |
| **UI/UX Issues** | 0 critical, 5 medium/low |
| **Security Issues** | 0 critical, 0 high |

---

## Phase Overview

| Phase | Name | Status | Hours | Description |
|-------|------|--------|-------|-------------|
| 0 | Audits | ✅ Complete | — | Parallel subagent audits (done) |
| 1 | Critical Path | ⬜ Not Started | 6-8h | i18n, navigation, error boundaries |
| 2 | Alignment | ⬜ Not Started | 4-6h | Fix caching, optimize routes |
| 3 | UI Polish | ⬜ Not Started | 3h | Opacity hacks, shadcn boundaries |
| 4 | Documentation | ⬜ Not Started | 2h | Update feature status, routes |
| 5 | Final Gates | ⬜ Not Started | 4h | Full test suite, performance |
| 6 | Launch Prep | ⬜ Not Started | 4h | Env check, monitoring, runbook |

---

## Phase 1: Critical Path (6-8h)

**Owner:** treido-frontend  
**Exit Criteria:** All high-priority frontend issues resolved

### 1.1 i18n Completeness (~4h)

Move inline translations to message files:

| Task | Files | Est. |
|------|-------|------|
| Onboarding pages | 5 files | 1.5h |
| Business upgrade | 1 file | 30m |
| Plans modal | 1 file | 30m |
| Post-signup modal | 1 file | 30m |
| Sell orders page | 2 files | 30m |

**Verification:**
```bash
pnpm -s typecheck && pnpm -s lint
```

### 1.2 Navigation Links (~1h)

Fix wrong Link imports:

| Task | Files |
|------|-------|
| similar-items-grid.tsx | Change to `@/i18n/routing` Link |
| design-system-client.tsx | Change to `@/i18n/routing` Link |
| promoted-section.tsx | Change to `@/i18n/routing` Link |

### 1.3 Error Boundaries (~2h)

Add error.tsx to:
- [ ] `(business)/dashboard/products/`
- [ ] `(business)/dashboard/orders/`
- [ ] `(business)/dashboard/analytics/`
- [ ] `(business)/dashboard/settings/`
- [ ] `(business)/dashboard/customers/`

---

## Phase 2: Alignment (4-6h)

**Owner:** treido-frontend + treido-backend  
**Exit Criteria:** Caching patterns fixed, optimizations applied

### 2.1 Caching Fixes (~2h)

| Task | File | Fix |
|------|------|-----|
| Remove `cookies()` in todays-deals | `todays-deals/page.tsx` | Move to client or middleware |
| Remove `cookies()` in search | `search/page.tsx` | Move to client |
| Remove `connection()` | `upgrade/page.tsx` | Delete call |

### 2.2 Image Optimization (~2h)

Replace `<img>` with `next/image`:
- [ ] `similar-items-grid.tsx`
- [ ] `seller-profile-drawer.tsx`
- [ ] `step-details.tsx`

### 2.3 Backend Minor Fixes (~1h)

| Task | File | Fix |
|------|------|-----|
| Add Zod validation | `seller-follows.ts` | `z.string().uuid()` |
| Sanitize error messages | `subscriptions.ts` | Mask internal details |

---

## Phase 3: UI Polish (3h)

**Owner:** treido-ui  
**Exit Criteria:** All opacity hacks replaced, shadcn clean

### 3.1 Tailwind v4 Violations (~2h)

Replace opacity hacks with semantic tokens:

| File | Pattern | Fix |
|------|---------|-----|
| `products-table.tsx` | `bg-success/10` | `bg-success-subtle` |
| `profile-client.tsx` | `bg-background/40` | Create overlay token |
| `admin-recent-activity.tsx` | Badge opacity | Semantic badge variants |
| Sell form components | `destructive/5` | Form validation tokens |

### 3.2 shadcn Boundaries (~1h)

- [ ] Move 35 `.stories.tsx` files out of `components/ui/`
- [ ] Update Storybook config to look in new location

---

## Phase 4: Documentation (2h)

**Owner:** treido-orchestrator  
**Exit Criteria:** Docs match reality

### 4.1 Update Feature Status

Update `docs/02-FEATURES.md`:

```diff
- Cancel Order (Buyer): 🚧 → ✅
- Saved Searches: 🚧 → ✅
- Related Items: ⬜ → ✅
- In-app Notifications: 🚧 → ✅
- Business Analytics: 🚧 → ✅
- Admin Metrics: 🚧 → ✅
```

**New Total:** ~110/119 (92%)

### 4.2 Archive Production Folder

After launch, move `/production/` to `/production/archive/v1/`

---

## Phase 5: Final Gates (4h)

**Owner:** treido-verify  
**Exit Criteria:** All tests passing, performance acceptable

### 5.1 Gate Commands

```bash
# Quality gates
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate

# Tests
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

# Build
pnpm build
```

### 5.2 Performance Check

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.0s | Lighthouse |
| TTI | < 3.0s | Lighthouse |
| Lighthouse | > 90 | Chrome DevTools |

### 5.3 Accessibility Spot Check

```bash
# Run axe-core on key pages
# - Homepage
# - Product detail
# - Checkout
# - Account
```

---

## Phase 6: Launch Prep (4h)

**Owner:** HUMAN + treido-orchestrator  
**Exit Criteria:** Ready to deploy

### 6.1 Environment Verification

- [ ] Production Supabase configured
- [ ] Stripe live mode keys set
- [ ] All 4 webhook endpoints registered
- [ ] Domain/SSL configured
- [ ] Sentry/monitoring configured

### 6.2 Final Checklist (from docs/12-LAUNCH.md)

**T-24 Hours:**
- [ ] Final E2E on production URL
- [ ] Verify Stripe live mode
- [ ] Check all webhooks active
- [ ] Confirm monitoring alerts
- [ ] Team on standby

**T-0:**
- [ ] Enable production traffic
- [ ] Monitor error rates (15 min)
- [ ] Test checkout end-to-end
- [ ] Test Connect payout flow

---

## Workstream Assignments

### Lane A: Frontend (treido-frontend)
Phases 1, 2 — i18n, navigation, caching, images

### Lane B: UI (treido-ui)
Phase 3 — Tailwind fixes, shadcn boundaries

### Lane C: Backend (treido-backend)
Phase 2 (partial) — Minor validation fixes

### Lane D: Verification (treido-verify)
Phase 5 — All gates, testing

### Lane E: Orchestration (treido-orchestrator)
Phases 4, 6 — Documentation, launch coordination

---

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| i18n migration breaks forms | Medium | High | Test each file after migration |
| Caching changes cause issues | Low | Medium | Compare before/after performance |
| Image optimization breaks layout | Low | Medium | Check responsive breakpoints |
| Webhook config incorrect | Low | High | Test with Stripe CLI before launch |

---

## Timeline Estimate

| Day | Phase | Hours | Cumulative |
|-----|-------|-------|------------|
| Day 1 | Phase 1 (Critical Path) | 6-8h | 6-8h |
| Day 2 | Phase 2 (Alignment) | 4-6h | 10-14h |
| Day 3 | Phase 3 (UI Polish) | 3h | 13-17h |
| Day 3 | Phase 4 (Documentation) | 2h | 15-19h |
| Day 4 | Phase 5 (Final Gates) | 4h | 19-23h |
| Day 5 | Phase 6 (Launch Prep) | 4h | 23-27h |

**Total Estimate:** 23-27 hours over 5 working days

---

## Success Criteria

### Must Have (Launch Blockers)
- [ ] All gates green (`typecheck`, `lint`, `styles:gate`)
- [ ] E2E smoke tests passing
- [ ] Production build succeeds
- [ ] No critical/high security issues

### Should Have (Day 1 Post-Launch)
- [ ] All i18n strings externalized
- [ ] Error boundaries on all dashboard routes
- [ ] Images optimized

### Nice to Have (Week 1 Post-Launch)
- [ ] Opacity hacks fully eliminated
- [ ] Storybook reorganized
- [ ] Performance optimizations

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [feature-alignment.md](./audits/feature-alignment.md) | Feature gap analysis |
| [frontend.md](./audits/frontend.md) | Frontend issues |
| [backend.md](./audits/backend.md) | Backend issues |
| [ui-ux.md](./audits/ui-ux.md) | UI/UX issues |
| [blockers.md](./blockers.md) | Launch blockers |
| [checklist.md](./checklist.md) | Final checklist |
| [/docs/12-LAUNCH.md](/docs/12-LAUNCH.md) | Launch runbook |
| [/refactor/MASTERPLAN.md](/refactor/MASTERPLAN.md) | Refactor context |

---

*Last updated: 2026-02-02*
