# Phase Plan (Dependency Ordered)

## Phase 1 - Shell & Navigation Baseline

- Scope: mobile tab bar, global drawers, shell safe-area consistency
- Feature refs: R1.8, R7.1
- Risk: low
- Verify: `pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate`, `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
- Done means: navigation surfaces stable and no hydration flash/desync on core routes

## Phase 2 - Landing + Discovery Consistency

- Scope: homepage/category/search card/category visuals + taxonomy labels
- Feature refs: R7.1-R7.6
- Risk: low/medium
- Verify: baseline + smoke e2e
- Done means: route-consistent styling and corrected category mapping issues

## Phase 3 - Auth + Onboarding Hardening

- Scope: session state propagation, auth UI correctness, onboarding gating
- Feature refs: R1.*, R2.1
- Risk: high
- Verify: baseline + `pnpm -s test:unit` + smoke e2e
- Done means: signed-in state reflects immediately and onboarding transitions are correct

## Phase 4 - Search + Quick View Stability

- Scope: search filters, quick-view drawer/touch/scroll behavior
- Feature refs: R7.4-R7.6, R8.2
- Risk: medium
- Verify: baseline + unit + smoke e2e
- Done means: no touch/scroll regressions or style-gate violations

## Phase 5 - PDP + Wishlist Polish

- Scope: PDP cohesion, price display consistency, wishlist truth
- Feature refs: R8.*, R9.*
- Risk: medium
- Verify: baseline + smoke e2e
- Done means: PDP and wishlist behave consistently on mobile/desktop

## Phase 6 - Cart + Checkout Hardening

- Scope: checkout flow + webhook validation + launch payment checks
- Feature refs: R3.*
- Risk: high
- Verify: baseline + unit + smoke e2e + manual LAUNCH-001/002/003 evidence
- Done means: replay-safe, refund/dispute-tested, environment-safe checkout

## Phase 7 - Sell + Seller Management

- Scope: sell wizard and seller order operations consistency
- Feature refs: R2.*, R5.*
- Risk: high
- Verify: baseline + unit + smoke e2e
- Done means: no blocking sell-form regressions and seller order actions stable

## Phase 8 - Account + Chat + Reviews

- Scope: account route mobile accessibility + chat/review trust surfaces
- Feature refs: R10.*, R11.*, R12.*
- Risk: medium
- Verify: baseline + smoke e2e
- Done means: account/chat/review route behavior stable and consistent

## Phase 9 - Business + Admin Operability

- Scope: dashboard/admin mobile operability and moderation workflows
- Feature refs: R14.*, R15.*
- Risk: high
- Verify: baseline + unit
- Done means: business/admin usable on target devices and key ops workflows complete

## Phase 10 - Cross-Cutting Launch Sweep

- Scope: i18n/a11y/perf/docs final pass
- Feature refs: R16.*, R17.*, R18.*
- Risk: medium/high
- Verify: baseline + smoke e2e + `pnpm -s docs:check` + `pnpm -s docs:advisory`
- Done means: launch-ready scorecard complete with evidence and residual risk log

## Parallelization Rules

- Sequential critical path: Phase 1 -> 2 -> 3 -> 4 -> 5 -> 6
- Parallel block A (after Phase 6): Phase 7 and Phase 8
- Parallel block B (after Phase 7/8): Phase 9 and Phase 10
