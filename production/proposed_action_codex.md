# Proposed Action Plan — Codex

> Planner doc for production readiness. **SSOT remains** `AGENTS.md` + `docs/*`.

**Created:** 2026-01-29  
**Goal:** Ship Treido V1 to production with PRD hard gates closed and a verifiable deploy checklist.

## 0) Guardrails (non‑negotiable)

- **No scope creep:** only PRD/production blockers + V1-critical polish.
- **No secrets/PII in logs** (server or client).
- **All user-facing strings via `next-intl`** (`messages/en.json`, `messages/bg.json`).
- **Tailwind v4 rules:** no gradients/arbitrary values/hardcoded colors (`pnpm -s styles:gate`).
- **Stripe webhooks:** signature verified + idempotent.
- **Small batches:** default 1–3 files, exceptions only for tightly-coupled changes with upfront file list.

## 1) Current snapshot (from `production/production.md`)

**Local gates:**
- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (0 errors, warnings remain)
- `pnpm -s styles:gate` ✅
- `pnpm -s knip` ⚠️ (triage before deploy / cleanup batch)
- `pnpm -s dupes` ⚠️ (reduce highest-impact clusters only)

**PRD hard gates still requiring explicit verification/docs:**
- Refund/dispute flow verified end-to-end.
- Webhook idempotency verified (replay test, no duplicate orders).
- Stripe environment separation verified (test vs live; Vercel + Stripe secrets aligned).
- Support playbooks written (refund/dispute SLAs + escalation + prohibited items policy).
- Supabase security posture re-verified (Security Advisor) and documented.

## 2) Definition of “Ready to Deploy”

Deployment is allowed when all are true:

- [ ] **0 P1 items** left in `production/backend_tasks.md` and `production/frontend_tasks.md`.
- [ ] PRD hard gates above have explicit check-offs + evidence notes (links/screenshots/steps).
- [ ] `pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate` pass on the deployment commit.
- [ ] `pnpm build` succeeds.
- [ ] `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` passes for critical flows on the deployment commit.
- [ ] Staging smoke (or preview) passes for: auth, search, PDP, cart→checkout, sell, chat, orders.
- [ ] Lighthouse Performance **≥75** gate on key pages (Home, Search, PDP, Checkout); **≥85** target over time.

## 3) Proposed execution order (phased)

Timeline note: aggressive but achievable if dashboard tasks (Supabase) are completed today and support playbooks are drafted in parallel.

### Phase 1 — Backend hard gates (P1) (same day)

1. **Stripe checkout/orders webhook idempotency** replay test; confirm no duplicate orders.
2. **Refund/dispute E2E**: seller refund path + buyer protection reporting + webhook coverage.
3. **Environment separation**: Vercel prod uses live keys; preview/staging uses test keys; webhook secrets correct.
4. **Supabase security**: enable leaked password protection + run Security Advisor; record findings/exceptions.

**Exit:** All PRD hard gates in backend are ✅ with evidence.

### Phase 2 — Frontend P1 (1–2 days)

1. **Mixed locale content**: remove hardcoded BG strings on EN pages; ensure correct translations.
2. **A11y P1**: icon-only buttons have labels; touch targets meet minimums; critical page titles set.
3. **Cart header/nav parity**: cart page shows full header/navigation where expected.
4. **Test/demo data exposure**: confirm test products/users aren’t visible in production surfaces.

**Exit:** 0 frontend P1 items, and critical flows are clean in EN+BG.

### Phase 3 — Ops readiness (P1/P2) (0.5–1 day)

- Write + publish support playbooks (refund/dispute decision tree, SLAs, escalation, prohibited items).
- Confirm “minimum admin ops” scope for V1 (reports, refunds, user blocks, notes, audit trail).

**Exit:** Support can operate V1 without ad-hoc engineering intervention.

### Phase 4 — Pre-deploy verification (same day)

Run:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
pnpm -s knip
pnpm -s dupes
pnpm build
```

Then do manual checks (Stripe/Supabase/Vercel) as listed in `production/production.md`.

### Phase 5 — Deploy + 24h monitoring

- Deploy to staging/preview → smoke test → deploy to production.
- Monitor:
  - Stripe webhooks health + error rates
  - Supabase DB/connection metrics
  - Vercel errors/logs (ensure no PII)
  - Checkout→order completion conversion sanity

## 4) P1 backlog snapshot (must hit zero)

**Backend P1 (from `production/backend_tasks.md`):**
- B-P1-04: Webhook idempotency verified (replay test)
- B-P1-05: Refund/dispute flow E2E verified
- B-P1-06: Stripe env separation verified (test vs live)
- B-P1-07: Supabase leaked password protection enabled
- B-P1-08: Supabase Security Advisor run + documented
- OPS-P1-01: Support playbooks written (refunds/disputes + SLAs + prohibited items)

**Frontend P1 (from `production/frontend_tasks.md`):**
- F-P1-01: Mixed locale content fixed (no BG on EN pages)
- F-P1-03: Page titles fixed (Checkout/Account/etc)
- F-P1-04: Icon-only buttons have screen reader labels
- F-P1-05: Touch targets ≥44px on key controls
- F-P1-06: Cart badge count matches actual cart
- F-P1-07: Test/dummy products not visible (and caches invalidated)
- F-P1-08: Product categorization issues resolved (data)
- F-P1-09: Cart page has full header navigation

## 5) Task separation (what to do next)

This plan is executed via the two task lists (audited and kept current):

- Backend: `production/backend_tasks.md`
- Frontend: `production/frontend_tasks.md`

Rule of thumb:
- **If it changes Supabase/Stripe/webhooks/data/security/docs ops → backend lane.**
- **If it changes UI/i18n/a11y/layout/UX → frontend lane.**

## 6) Open decisions (need explicit call)

- Is **buyer cancel order** a V1 hard requirement or “launch then ship”?
- What is the **minimum admin surface** for V1 ops (reports/refunds/blocks/notes)?
- Do we ship V1 with **Stripe receipts only**, or add minimal transactional emails?
