# Tasks — Current Sprint (Working Log — not SSOT)

> **Active work only.** Max **20 total** tasks listed below, keep **≤15 “Ready”** at any time.
>
> Release-wide backlogs live in:
> - `production/backend_tasks.md`
> - `production/frontend_tasks.md`

## Gates (Run After Every Batch)

Always:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Conditional:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

Weekly + before deploy + cleanup batches:

```bash
pnpm -s knip
pnpm -s dupes
```

## 🔥 In Progress

| Task | Issue | Owner | Notes |
|------|-------|-------|-------|
| Seller flows UI consistency | ISSUE-0004 | – | Align rounding, i18n strings |

## 📋 Ready (≤15)

### Production Hardening (ISSUE-0002)

- [ ] Enable leaked password protection in Supabase dashboard (ISSUE-0002)

### UI Cleanup (ISSUE-0004 / ISSUE-0003)

- [ ] Align sell-related rounding to `rounded-md` (ISSUE-0004)
- [ ] Move remaining hardcoded strings in seller flows to `next-intl` (ISSUE-0004)
- [ ] Consolidate ProductCard variants (ISSUE-0003)

### Feature Completion (ISSUE-0002)

- [ ] Complete cancel order flow (buyer side) (ISSUE-0002)
- [ ] Complete refund flow (seller side, admin-assisted) (ISSUE-0002)
- [ ] Add screen reader labels to remaining UI components (ISSUE-0002)

## ✅ Recently Completed

| Task | Date | Notes |
|------|------|-------|
| Verify checkout session action typing (no unsafe casts) | 2026-01-29 | `app/[locale]/(checkout)/_actions/checkout.ts` |
| Remove `as any` from payments webhook route | 2026-01-29 | `app/api/payments/webhook/route.ts` |
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

## Task Writing Rules

1. Each task references an issue: `(ISSUE-####)` when applicable
2. Keep tasks small (≤ 1 day)
3. If a task changes product scope, update `docs/PRD.md` + `docs/FEATURES.md`

*Last updated: 2026-01-29*
