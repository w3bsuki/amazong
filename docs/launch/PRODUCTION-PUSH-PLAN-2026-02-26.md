# Production Push Plan (Plan Mode)

Owner: Head Developer (Codex) + Orchestrator + Human approver

## Objective

Ship Treido to production with a mobile-first quality bar, reduced technical debt, synced documentation, and explicit go/no-go gates.

## Ground Truth

- Launch status claims `11/15` sections audited/pass, but checklist still has many unchecked items across P0/P1.
- Route inventory is large: ~85 user-facing page route patterns + 49 API handlers.
- Launch blockers still open and human-gated:
  - Stripe idempotency replay guarantee
  - Refund/dispute E2E flow
  - Stripe prod/dev environment separation
  - Supabase leaked-password protection plan constraint
- Architecture quality has regressed above baseline (client-boundary/over300/duplicate clusters).
- Playwright CLI mobile artifacts were generated in `output/playwright/` for core flows (`/en`, search, categories, sell, checkout).

## Non-Negotiables

1. Docs-first execution: update source-of-truth docs before and during code refactors.
2. Mobile-first QA: M375 pass before desktop parity.
3. Sensitive domains require explicit verification evidence and rollback-safe sequencing (auth/payment/webhook/DB/RLS/migrations/destructive ops).
4. No merge without gates: `typecheck`, `lint`, `styles:gate`, `test:unit`, plus route-appropriate E2E/a11y.
5. Checklist/tracker/state docs must not drift.

## Phase 0 - Docs Operating System (First)

Goal: make the repo AI-agent-friendly and eliminate state drift.

Deliverables:

1. Add docs index and metadata conventions.
  - `docs/index.md`
  - `docs/templates/{doc-header,capability-card,decision}.md`
  - `docs/_meta/{doc-owners.json,capability-task-map.json}`
2. Introduce docs quality gates:
  - Keep docs concise, linked, and updated with execution truth.
3. Split/normalize docs structure without breaking entry points:
  - Keep `AGENTS.md` and `TASKS.md` paths stable.
  - Add `docs/execution/` for archived/completed task history.
4. Resolve immediate drift:
  - Sync `CAPABILITY-MAP.md` with completed Phase 2 AI items.
  - Refresh `DECISIONS.md` or split into per-decision files.

Exit criteria:

- Docs gate passes locally and in CI.
- `NOW.md`, `TASKS.md`, `CAPABILITY-MAP.md`, `CHANGELOG.md` aligned.

## Phase 1 - Audit Harness Normalization

Goal: make route auditing deterministic and reproducible.

Deliverables:

1. Route manifest:
  - `docs/launch/route-manifest.json` (bucketed P0/P1/P2/Admin).
2. Playwright projects:
  - Add strict `m375` project (`375x812`) and `desktop1280`.
  - Tag suites: `@launch-p0`, `@launch-p1`, `@launch-p2`.
3. Artifact policy:
  - Screenshot + console logs per route in `output/playwright/`.
4. Auth strategy for E2E:
  - standard test credentials flow; remove launch-critical `test.skip(!creds)` paths.

Exit criteria:

- One command can run all launch-critical route audits on M375.
- Every P0 route has deterministic assertions and artifacts.

## Phase 2 - Mobile-First P0 Closure

Goal: hard-close all launch-critical mobile UX and flow behavior.

Scope (P0 routes): home, search/categories, PDP, auth, sell, cart, checkout, orders, seller payouts.

Execution order:

1. Guest/public flows at M375.
2. Authenticated P0 flows at M375.
3. EN/BG parity checks for all P0.
4. A11y and no-overflow checks.

Exit criteria:

- 100% P0 checklist items checked and verified at M375.
- No uncategorized console errors on P0.
- No horizontal overflow/regression on P0 at 375px.

## Phase 3 - Desktop Parity + P1 Stabilization

Goal: ensure no desktop regressions and close should-launch surfaces.

Scope: account/profile/settings/wishlist/onboarding and related desktop layouts.

Exit criteria:

- P0 remains green on desktop.
- P1 routes are either pass or explicitly deferred with owner/risk note.

## Phase 4 - High-Risk Launch Blockers (Human-Approved Track)

Goal: close all blockers requiring explicit evidence.

Tasks:

1. Webhook idempotency replay validation in Stripe flows.
2. Refund/dispute E2E operational test.
3. Stripe environment separation audit (keys/secrets/accounts).
4. Supabase leaked-password protection decision (upgrade vs accepted risk).
5. MIG-001 sequencing completion for migration dependencies.

Exit criteria:

- `LAUNCH-001..004` resolved or explicitly approved risk exceptions.

## Phase 5 - Refactor Debt Waves (Production Maintainability)

Wave 1: Security surface isolation
- Consolidate webhook flow into `verify -> map -> persist`.
- Reduce and centralize `createAdminClient()` usage.

Wave 2: Oversized funnel decomposition
- Target `(main)`, `(account)`, `(sell)` large files first.

Wave 3: Duplicate burn-down
- Remove top clone clusters (orders/product-cards/assistant boilerplate).

Wave 4: Route-group hardening
- Move cross-route logic to shared layers; thin route-private adapters.

Wave 5: Data-layer closeout
- Remove temporary migration fallbacks post MIG-001.

Exit criteria:

- Architecture metrics return to baseline or better.
- No regression in route coverage/gates.

## Phase 6 - AI Listings Phase 2 Closeout

Scope: `PH2-AI-007..010`.

Deliverables:

1. Autofill confidence scores + seller-visible confidence UI.
2. Price suggestion endpoint + schema + guardrails + telemetry.
3. Sell-form price suggestion UX and accept/dismiss telemetry.
4. Docs/status closeout across strategy/state/task files.

Exit criteria:

- AI eval thresholds pass.
- Canary metrics stable (quality, cost, latency, safety).
- Capability/status docs synchronized.

## Phase 7 - Release Readiness Gate

Final go/no-go requires:

1. Core gates green:
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
  - `pnpm -s test:unit`
2. Architecture + route checks green:
  - `pnpm -s architecture:gate`
  - launch route suites (M375 + desktop parity)
3. Sensitive blockers closed/approved.
4. Source-of-truth docs fully aligned.

## Immediate Next Actions (first batch)

1. Create docs gate scripts and metadata files.
2. Generate route manifest and map it to launch checklist items.
3. Add `m375` Playwright project and launch tags.
4. Run P0 M375 guest sweep and record failures.
5. Open blocker verification checklist for `LAUNCH-001..004` + MIG-001.
