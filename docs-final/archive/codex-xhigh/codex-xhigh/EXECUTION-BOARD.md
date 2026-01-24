# Execution Board (Checklist)

This is the detailed, cross-session checklist. The coordinator mirrors “current” items into `TODO.md`.

## Phase 0 — Decide scope (must be explicit)
- [x] `P0-00` (Owner: COORD) Write launch scope decision (V1 vs V2) in `codex-xhigh/STATUS.md` — **Decision: V2 checkout/orders**

## Phase 0b — Security / dependency gates (pre-ship)
Reference: `codex-xhigh/DEPENDENCIES-AUDIT.md`.
- [ ] `P0-DEP-01` (Owner: FE/NEXT) Patch high advisories (upgrade `next` to >=16.0.9) — see `codex-xhigh/DEPENDENCIES-AUDIT.md`

## Phase 1 — Supabase hard gates (production correctness)
Reference: `docs/BACKEND.md`, `docs/PRODUCTION.md`, `supabase/migrations/*`.
- [x] `P1-SUPA-01` (Owner: BE/SUPABASE) Verify critical migrations applied to prod (avatars + stock + order status) — see `codex-xhigh/logs/2026-01-20-supabase.md`
- [x] `P1-SUPA-02` (Owner: BE/SUPABASE) Resolve/accept Security Advisor warnings (record decisions in `codex-xhigh/logs/`) — see `codex-xhigh/logs/2026-01-20-supabase.md`
- [x] `P1-SUPA-03` (Owner: BE/SUPABASE) Confirm buckets/policies: `avatars`, `product-images` — see `codex-xhigh/logs/2026-01-20-supabase.md`
- [x] `P1-SUPA-04` (Owner: BE/SUPABASE) Remove function drift risk (`validate_username` single definition) — see `codex-xhigh/logs/2026-01-20-supabase.md`
- [ ] `P1-SUPA-05` (Owner: HUMAN) Enable leaked password protection (Supabase Dashboard) — see `docs/PRODUCTION.md`

## Phase 2 — Stripe + plans (payments are deterministic)
Reference: `docs/BACKEND.md`, `docs/PRODUCTION.md`.
- [x] `P2-STRIPE-01` (Owner: PAY/STRIPE) Decide canonical webhook ownership (orders/subscriptions/payments/boosts)
- [x] `P2-STRIPE-02` (Owner: PAY/STRIPE) Connect onboarding supports individual + business flows (Express)
- [x] `P2-STRIPE-03` (Owner: FE/NEXT + PAY/STRIPE) Gate `/sell` on payout readiness if scope requires it

## Phase 3 — Monetization model (buyer protection hybrid)
Reference: `docs/PRODUCT.md`.
- [x] `P3-MON-01` (Owner: BE/SUPABASE) DB: add buyer-protection columns to `subscription_plans` — verified in `codex-xhigh/logs/2026-01-20-supabase.md`
- [x] `P3-MON-02` (Owner: PAY/STRIPE) Code: fee calculation reads plan config (no hardcoded %)
- [x] `P3-MON-03` (Owner: FE/NEXT + FE/UI) UI: show buyer protection fee transparently in checkout (if V2)
- [x] `P3-MON-04` (Owner: FE/NEXT + FE/UI) Plans page matches DB (personal/business tiers)

## Phase 4 — Onboarding + badges (truth lives in DB)
- [x] `P4-ONB-01` (Owner: FE/NEXT) Ensure account type selection is consistent (signup vs onboarding) — verified: accountType set at signup, passed through onboarding flows
- [x] `P4-ONB-02` (Owner: FE/NEXT + FE/UI) Define badge derivation rules (new seller vs business/verified) — added `lib/badges/derive-seller-badge.ts`
- [x] `P4-ONB-03` (Owner: FE/UI) Render badges consistently across seller card + profile + listings — added `components/shared/seller-badge.tsx`, updated quick-view to use `SellerVerificationBadge`

## Phase 5 — Frontend/backend alignment (reduce drift)
Reference: `codex-xhigh/nextjs/FULL-AUDIT.md`, `codex-xhigh/typescript/FULL-AUDIT.md`.
- [x] `P5-FE-04` (Owner: FE/NEXT) Triage remaining app-action imports (20) — triaged: all 20 are app-layer code importing from app/actions (acceptable), no boundary violations
- [x] `P5-FE-01` (Owner: FE/NEXT) Fix boundary violations (components importing app actions)
- [x] `P5-FE-02` (Owner: FE/NEXT) Consolidate duplicated plan selects + projections — added `lib/data/plans.ts` with canonical queries
- [x] `P5-FE-03` (Owner: BE/SUPABASE + FE/NEXT) Remove per-page DB write "cleanup RPC" patterns where possible — removed client-side duplicate call, kept server-side only

## Phase 6 — UI/i18n rails (no regressions)
Reference: `docs/FRONTEND.md`, `docs/DESIGN.md`.
- [x] `P6-I18N-00` (Owner: I18N) Fix `messages/en.json` parity (7 missing keys) — added ProductForm.condition.* and ProductForm.b2b.* keys
- [~] `P6-I18N-01` (Owner: I18N) Remove inline translation dictionaries — documented 1300+ occurrences, deferred to follow-up sprint (scope too large for single phase)
- [x] `P6-UI-01` (Owner: FE/UI) Kill remaining gradients + arbitrary values — replaced green-500 with success tokens in seller-payout-setup.tsx, scan now clean
- [x] `P6-UI-02` (Owner: FE/UI) Audit hardcoded colors/sizes — remaining arbitrary values are acceptable (container queries, specific sizing needs)

## Phase 7 — QA gates + manual verification
- [ ] `P7-QA-00` (Owner: FE/NEXT) `pnpm -s lint` has 0 errors (warnings deferred) — see `codex-xhigh/nextjs/lint-2026-01-20.log`
- [ ] `P7-QA-04` (Owner: FE/TS) Resolve or baseline `pnpm -s ts:gate` drift (0 new findings) — see `codex-xhigh/typescript/FULL-AUDIT.md`
- [x] `P7-QA-01` (Owner: QA) `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [x] `P7-QA-02` (Owner: QA) `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] `P7-QA-03` (Owner: QA) Run the manual QA checklist in `docs/PRODUCTION.md` on staging
