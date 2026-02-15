# TASKS.md - Launch Hardening (Clean Board)

Owner: treido-orchestrator  
Last updated: 2026-02-15

## Rules

- Keep tasks <= 1 day each.
- Complete by phase order unless marked parallel.
- For every `[EXEC]` task with code changes, run:
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
- Add `pnpm -s test:unit` for logic/integration changes.
- Add `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` for route-flow changes.
- High-risk domains require human pause before finalization (auth, payments, DB/RLS).

## Phase 1 - Shell & Navigation Baseline

- [ ] [EXEC] [frontend] P1-01 Fix mobile tab-bar hydration and auth-state visual sync
- [ ] [EXEC] [frontend] P1-02 Normalize drawer stacking/backdrop behavior
- [ ] [AUDIT] [qa] P1-03 Capture safe-area regressions on iPhone 12 + Pixel 5
- [ ] [VERIFY] [qa] P1-04 Run smoke e2e for nav/drawer flows and log evidence

## Phase 2 - Landing + Discovery Consistency

- [x] [EXEC] [frontend] P2-00 Align `DesktopShell` muted variant with `PageShell` muted canvas semantics (2026-02-15)
- [x] [EXEC] [frontend] P2-01 Fix root category label mapping in product grid (CAT-001) (2026-02-15)
- [ ] [EXEC] [frontend] P2-02 Normalize homepage/search/category canvas consistency
- [ ] [AUDIT] [qa] P2-03 Capture before/after screenshots for CAT-001 paths
- [ ] [VERIFY] [qa] P2-04 Run baseline gates + smoke e2e for discovery routes

## Phase 3 - Auth + Onboarding Hardening (High Risk)

- [ ] [PLAN] [orchestrator] P3-01 Record human approval for auth/session updates
- [ ] [EXEC] [frontend] P3-02 Fix stale signed-in UI state propagation
- [ ] [EXEC] [backend] P3-03 Complete leaked-password protection hardening (LAUNCH-004)
- [ ] [AUDIT] [qa] P3-04 Validate onboarding gate and role transitions
- [ ] [VERIFY] [qa] P3-05 Run unit + smoke e2e for auth/onboarding flows

## Phase 4 - Search + Quick View Stability

- [ ] [EXEC] [frontend] P4-01 Remove invalid touch-action/arbitrary utility drift in quick view
- [ ] [EXEC] [frontend] P4-02 Verify and fix quick-view scroll restoration
- [ ] [AUDIT] [qa] P4-03 Re-run quick-view/search regression scripts
- [ ] [VERIFY] [qa] P4-04 Run styles gate + smoke e2e for `/search`

## Phase 5 - PDP + Wishlist Polish

- [ ] [EXEC] [frontend] P5-01 Align PDP price formatting and CTA visual states
- [ ] [EXEC] [frontend] P5-02 Fix wishlist count truth and optimistic update rollback
- [ ] [AUDIT] [qa] P5-03 Validate wishlist sharing behavior and fallback states
- [ ] [VERIFY] [qa] P5-04 Run smoke e2e for PDP/wishlist routes

## Phase 6 - Cart + Checkout Hardening (High Risk)

- [ ] [PLAN] [orchestrator] P6-01 Record human approval for payments/webhook updates
- [ ] [EXEC] [backend] P6-02 Verify replay-safe webhook behavior (LAUNCH-001)
- [ ] [EXEC] [backend] P6-03 Execute refund/dispute E2E validation (LAUNCH-002)
- [ ] [AUDIT] [qa] P6-04 Validate Stripe environment separation checklist (LAUNCH-003)
- [ ] [VERIFY] [qa] P6-05 Run baseline + unit + smoke e2e for cart/checkout

## Phase 7 - Sell + Seller Management (Parallel A)

- [ ] [EXEC] [frontend] P7-01 Fix sell form review/publish stability gap
- [ ] [EXEC] [frontend] P7-02 Normalize sell route styling/token compliance
- [ ] [EXEC] [backend] P7-03 Verify seller order actions and state transitions
- [ ] [AUDIT] [qa] P7-04 Validate `/sell` and `/account/selling` end-to-end
- [ ] [VERIFY] [qa] P7-05 Run baseline + unit + smoke e2e for seller flows

## Phase 8 - Account + Chat + Reviews (Parallel A)

- [ ] [EXEC] [frontend] P8-01 Fix mobile account entry/exit navigation consistency
- [ ] [EXEC] [frontend] P8-02 Normalize chat drawer states and unread badge truth
- [ ] [EXEC] [frontend] P8-03 Complete review/report UI edge-state handling
- [ ] [AUDIT] [qa] P8-04 Validate account/chat/review core paths
- [ ] [VERIFY] [qa] P8-05 Run baseline + smoke e2e for account/chat

## Phase 9 - Business + Admin Operability (Parallel B)

- [ ] [PLAN] [orchestrator] P9-01 Record human approval if role-gating/auth logic changes
- [ ] [EXEC] [frontend] P9-02 Fix business dashboard mobile layout and table overflow
- [ ] [EXEC] [frontend] P9-03 Fix admin panel mobile layout and interaction affordances
- [ ] [EXEC] [backend] P9-04 Complete admin metrics/user-management moderation gaps
- [ ] [AUDIT] [qa] P9-05 Validate dashboard/admin route operability
- [ ] [VERIFY] [qa] P9-06 Run baseline + unit checks for business/admin

## Phase 10 - Cross-Cutting Launch Sweep (Parallel B)

- [ ] [EXEC] [frontend] P10-01 Bulgarian locale sweep for all P0/P1 routes
- [ ] [EXEC] [frontend] P10-02 Accessibility sweep (labels, touch targets, focus semantics)
- [ ] [EXEC] [frontend] P10-03 Route-level style consistency sweep across shell variants
- [ ] [AUDIT] [qa] P10-04 Run a11y/perf checks and collect evidence
- [ ] [VERIFY] [docs] P10-05 Run docs checks and update launch evidence logs

## Manual Launch Checks (Critical)

- [ ] [AUDIT] [backend] M-01 LAUNCH-001 Stripe webhook idempotency evidence logged
- [ ] [AUDIT] [backend] M-02 LAUNCH-002 Refund/dispute evidence logged
- [ ] [AUDIT] [backend] M-03 LAUNCH-003 Stripe env separation evidence logged
- [ ] [AUDIT] [supabase] M-04 LAUNCH-004 Leaked-password protection enabled and advisor clean
- [ ] [AUDIT] [backend] M-05 LAUNCH-007 Product data sanity audit completed

## Current Iteration

- Active phase: `Phase 2 (early)`
- Active focus: `P2-02`, `P2-03`, `P2-04`
- Verification note (2026-02-15): `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` -> FAIL (1 test): `e2e/smoke.spec.ts` "homepage mobile landing hierarchy and geometry stay consistent", missing `data-testid='home-discovery-header-title'`.
