# Tasks — Active Queue

This file contains only active work. Historical tasks were moved to `TASKS.archive.md`.

## Priority Order

1. Phase 0 launch blockers (manual/human-gated first).
2. Remaining high-risk refactor blocker.
3. Phase 2 AI listing completion items.

## Phase 0 — Launch Hardening (Open)

- [ ] **PH0-LAUNCH-001:** Verify Stripe webhook idempotency (production replay no-op)
  - Context: `docs/features/checkout-payments.md`
  - Done when: replaying the same `checkout.session.completed` event does not create duplicates in production.
  - Evidence needed: Stripe event replay logs + order count proof.

- [ ] **PH0-LAUNCH-002:** Test refund/dispute flow end-to-end
  - Context: `docs/features/checkout-payments.md`
  - Done when: refund/dispute action updates order status and buyer communication as expected.
  - Evidence needed: operator runbook output + status transition proof.

- [ ] **PH0-LAUNCH-003:** Verify Stripe environment separation (prod vs dev)
  - Context: `docs/features/checkout-payments.md`, `docs/STACK.md`
  - Done when: production uses only production Stripe keys/webhook secrets.
  - Evidence needed: env/secrets audit checklist.

- [ ] **PH0-LAUNCH-004:** Enable leaked password protection + rerun Supabase advisor
  - Context: `docs/features/auth.md`
  - Done when: advisor has no critical findings and password-leak protection state is explicitly documented.
  - Note: currently blocked by Supabase plan capability (`402 Payment Required` on enable attempt).

- [ ] **PH0-REFACTOR-001:** Domain 6 (`lib/`, `actions/`, `api/`) sensitive refactor
  - Context: `refactor/domains/06-lib-actions-api.md`
  - Done when: planned refactor is complete with no auth/payment regression and verification evidence is recorded.
  - Risk: high (auth/payment sensitive); requires expanded verification coverage.

## Phase 2 — AI Listings MVP (Open)

- [ ] **PH2-AI-007:** Autofill confidence scores + UI polish
  - Context: `docs/architecture/AI-PLATFORM.md`, `lib/ai/schemas/sell-autofill.ts`
  - Done when: per-field confidence is returned and visible in autofill review UI.

- [ ] **PH2-AI-008:** AI price suggestion endpoint
  - Context: `docs/architecture/AI-PLATFORM.md`, `docs/features/sell-flow.md`
  - Done when: `POST /api/assistant/suggest-price` returns schema-validated suggestions with guardrails and telemetry.

- [ ] **PH2-AI-009:** Sell form pricing suggestion UI
  - Context: `docs/features/sell-flow.md`, `docs/DESIGN.md`
  - Done when: seller can request, inspect, apply, and dismiss suggested price ranges in the price step.

- [ ] **PH2-AI-010:** Capability/docs closeout for Phase 2
  - Context: `docs/strategy/CAPABILITY-MAP.md`, `docs/state/NOW.md`, `docs/state/CHANGELOG.md`
  - Done when: capability map and state docs match shipped AI listing scope.

## Notes

- Keep entries short and execution-focused.
- Move completed entries to `TASKS.archive.md` in batches to keep this file small.

*Last updated: 2026-02-26*
