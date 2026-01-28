# Tasks — Current Sprint (Working Log — not SSOT)

> **Execution checklist for current work.** Keep this focused — max ~20 tasks at a time.

---

## Gates (Run After Every Batch)

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit   # Required
pnpm test:unit                                # If tests touched
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke  # If UI/flow touched
```

---

## 🔥 In Progress

| Task | Issue | Owner | Notes |
|------|-------|-------|-------|
| Seller flows UI consistency | ISSUE-0004 | – | Align rounding, i18n strings |

---

## 📋 Ready to Start

### Production Hardening

- [ ] Enable leaked password protection in Supabase dashboard
- [ ] Fix TypeScript `as any` casts in checkout action (line 106)
- [ ] Fix TypeScript `as any` in payments webhook (line 55)
- [ ] Remove unused exports per `pnpm -s knip`

### UI Cleanup

- [ ] Align sell-related rounding to `rounded-md`
- [ ] Move remaining hardcoded strings in seller flows to `next-intl`
- [ ] Consolidate ProductCard variants (remove redundant card files)

### Feature Completion

- [ ] Complete cancel order flow (buyer side)
- [ ] Complete refund flow (seller side, admin-assisted)
- [ ] Add screen reader labels to remaining UI components

---

## ✅ Recently Completed

| Task | Date | Notes |
|------|------|-------|
| Share payout setup UI (`SellerPayoutSetup`) | 2026-01-24 | Reused in /sell payout gating |
| Use `ProgressHeader` for /sell gating states | 2026-01-24 | |
| Remove nested `PageShell` in (sell) routes | 2026-01-24 | Layout owns shell |
| Move seller onboarding copy to next-intl | 2026-01-24 | `Sell.sellerOnboardingWizard.*` |
| Delete demo routes (`app/[locale]/demo/`) | 2026-01-24 | Unblocked styles:gate |
| Set `/assistant` header variant to contextual | 2026-01-24 | |
| Remove unused deps (ai-sdk, radix-toggle) | 2026-01-24 | |
| Delete legacy middleware.ts | 2026-01-24 | proxy.ts is request hook |
| Knip cleanup (all exports) | 2026-01-24 | `pnpm -s knip` clean |
| Supabase Phase 1 security | 2026-01-24 | See audit/supabase.md |

---

## 📁 Backlog (Prioritized)

### P1 — Should Do Soon

- [ ] Regenerate Supabase types (`supabase gen types`)
- [ ] Audit all `'use cache'` calls have `cacheLife()` pairing
- [ ] Run Lighthouse on key pages (Home, PDP, Search)
- [ ] Add E2E tests for admin routes

### P2 — Nice to Have

- [ ] Remove Capacitor deps (if mobile out of scope)
- [ ] Dedupe jscpd clone clusters (product cards, filter components)
- [ ] Add saved searches feature
- [ ] Add related items to PDP

### P3 — Future

- [ ] AI Listing Assistant (V2)
- [ ] AI Search Assistant (V2)
- [ ] Mobile apps (V3)
- [ ] Shipping tracking automation (V1.1)

---

## Task Writing Rules

1. Each task references an issue: `(ISSUE-####)` when applicable
2. Keep tasks small (≤ 1 day)
3. Include verification note when not obvious
4. If task changes product scope, update `docs/PRD.md` + `docs/FEATURES.md`

---

## Issue Links

| Issue | Status | Summary |
|-------|--------|---------|
| [ISSUE-0001](ISSUES.md) | ✅ Done | Consolidate docs + workflow |
| [ISSUE-0002](ISSUES.md) | 🚧 In Progress | Production finalization |
| [ISSUE-0003](ISSUES.md) | ⬜ Open | UI duplication cleanup |
| [ISSUE-0004](ISSUES.md) | 🚧 In Progress | Seller flows UI consistency |

---

## Archived Phases

Previous detailed phases (P0-P10) moved to `docs-final/archive/TASKS_ARCHIVE_2026-01-25.md`.

---

*Last updated: 2026-01-25*
