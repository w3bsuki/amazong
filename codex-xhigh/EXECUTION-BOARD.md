# Execution Board (Checklist)

This is the detailed, cross-session checklist. The coordinator mirrors “current” items into `TODO.md`.

## Phase 0 — Decide scope (must be explicit)
- [x] `P0-00` (Owner: COORD) Write launch scope decision (V1 vs V2) in `codex-xhigh/STATUS.md` — **Decision: V2 checkout/orders**

## Phase 1 — Supabase hard gates (production correctness)
Reference: `docs/launch/PLAN-SUPABASE.md`, `codex/MASTER-PLAN.md`.
- [x] `P1-SUPA-01` (Owner: BE/SUPABASE) Verify critical migrations applied to prod (avatars + stock + order status) — see `codex-xhigh/logs/2026-01-20-supabase.md`
- [x] `P1-SUPA-02` (Owner: BE/SUPABASE) Resolve/accept Security Advisor warnings (document in `supabase_tasks.md`) — see `supabase_tasks.md`
- [x] `P1-SUPA-03` (Owner: BE/SUPABASE) Confirm buckets/policies: `avatars`, `product-images` — see `codex-xhigh/logs/2026-01-20-supabase.md`
- [x] `P1-SUPA-04` (Owner: BE/SUPABASE) Remove function drift risk (`validate_username` single definition) — see `codex-xhigh/logs/2026-01-20-supabase.md`
- [ ] `P1-SUPA-05` (Owner: HUMAN) Enable leaked password protection (Supabase Dashboard) — see `TASK-enable-leaked-password-protection.md`

## Phase 2 — Stripe + plans (payments are deterministic)
Reference: `docs/launch/PLAN-STRIPE.md`, `PLAN-stripe-connect-wallet.md`.
- [x] `P2-STRIPE-01` (Owner: PAY/STRIPE) Decide canonical webhook ownership (orders/subscriptions/payments/boosts)
- [x] `P2-STRIPE-02` (Owner: PAY/STRIPE) Connect onboarding supports individual + business flows (Express)
- [x] `P2-STRIPE-03` (Owner: FE/NEXT + PAY/STRIPE) Gate `/sell` on payout readiness if scope requires it

## Phase 3 — Monetization model (buyer protection hybrid)
Reference: `PLAN-monetization-strategy.md`.
- [x] `P3-MON-01` (Owner: BE/SUPABASE) DB: add buyer-protection columns to `subscription_plans` — verified in `codex-xhigh/logs/2026-01-20-supabase.md`
- [x] `P3-MON-02` (Owner: PAY/STRIPE) Code: fee calculation reads plan config (no hardcoded %)
- [x] `P3-MON-03` (Owner: FE/NEXT + FE/UI) UI: show buyer protection fee transparently in checkout (if V2)
- [x] `P3-MON-04` (Owner: FE/NEXT + FE/UI) Plans page matches DB (personal/business tiers)

## Phase 4 — Onboarding + badges (truth lives in DB)
- [ ] `P4-ONB-01` (Owner: FE/NEXT) Ensure account type selection is consistent (signup vs onboarding)
- [ ] `P4-ONB-02` (Owner: FE/NEXT + FE/UI) Define badge derivation rules (new seller vs business/verified)
- [ ] `P4-ONB-03` (Owner: FE/UI) Render badges consistently across seller card + profile + listings

## Phase 5 — Frontend/backend alignment (reduce drift)
Reference: `codex/MASTER-PLAN.md`, `codex/AUDIT-core-app.md`.
- [ ] `P5-FE-01` (Owner: FE/NEXT) Fix boundary violations (components importing app actions)
- [ ] `P5-FE-02` (Owner: FE/NEXT) Consolidate duplicated plan selects + projections
- [ ] `P5-FE-03` (Owner: BE/SUPABASE + FE/NEXT) Remove per-page DB write “cleanup RPC” patterns where possible

## Phase 6 — UI/i18n rails (no regressions)
Reference: `docs/launch/PLAN-I18N.md`, `docs/launch/PLAN-UI-DESIGN-SYSTEM.md`.
- [ ] `P6-I18N-01` (Owner: I18N) Remove inline translation dictionaries (use `next-intl`)
- [ ] `P6-UI-01` (Owner: FE/UI) Kill remaining gradients + arbitrary values (track baseline)
- [ ] `P6-UI-02` (Owner: FE/UI) Audit hardcoded colors/sizes (tokens only)

## Phase 7 — QA gates + manual verification
- [x] `P7-QA-01` (Owner: QA) `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [x] `P7-QA-02` (Owner: QA) `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] `P7-QA-03` (Owner: QA) Run `docs/launch/CHECKLIST-QA.md` on staging
