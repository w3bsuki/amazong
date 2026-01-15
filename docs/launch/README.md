# Production Launch Playbook (Agent Runbook)

This folder contains **AI-executable plans** to take this repo from “close” to **production-ready** with real users.
## 🚀 Current Status (2026-01-15)

**ALL PHASES COMPLETE** — Ready for production deployment.

| Phase | Status | Result |
|-------|--------|--------|
| Phase 0 (Scope) | ✅ | Scope frozen |
| Phase 1 (Workflow) | ✅ | Docs + proxy verified |
| Phase 2 (Supabase) | ✅ | Security advisor clean |
| Phase 3 (Stripe) | ✅ | Webhooks verified, idempotency confirmed |
| Phase 4 (Core Flows) | ✅ | E2E: auth 28, smoke 16, reviews 7 |
| Phase 5 (i18n/UI) | ✅ | 0 gradients, 9 arbitrary values |
| Phase 6 (Release) | ✅ | All gates pass |

**Next step:** Human configuration required (Vercel env vars, Stripe webhooks, Supabase auth URLs).
See `TODO.md` → "Phase 6" section for full deployment checklist.

---
## How to use (Opus executor)

1) Read `docs/roadmap/v1.md` + `docs/roadmap/v2.md` and **decide what “launch” means** (see “Scope decision” below).
2) Read `docs/launch/AUDIT.md` to understand known gaps and why they matter.
3) Execute `docs/launch/PLAN.md` in order, in **small batches** (1–3 files/features).
4) For each batch, run the **required gates**:
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (with `pnpm dev` running)
5) Track work in `TODO.md` and keep a short “done log” (what changed + how verified).

## Scope decision (must pick one)

This repo currently contains **both**:
- **Classifieds-first patterns** (message seller, boosts, business plans), and
- **E-commerce patterns** (cart, checkout, orders, payments, reviews).

Pick the launch scope explicitly and align UI + docs accordingly:

### Option A — V1 (Classifieds-first + Boosts)
Follow `docs/roadmap/v1.md`.
- Primary CTA: message/contact seller.
- No on-platform checkout for goods (hide/disable cart/checkout/order UIs if they exist).
- Stripe is used for boosts and/or subscriptions only (no seller payouts).

### Option B — V2 (Card Payments + Orders)
Follow `docs/roadmap/v2.md`.
- Cart + checkout are real.
- Order lifecycle is real (paid → shipped → delivered).
- Stripe webhooks and order creation are production-critical.

If you cannot decide: **ship Option A** (lower compliance/ops risk), then enable Option B later.

## Definition of done (production-ready)

Minimum “go-live” definition:
- Auth flows are correct (signup/login/reset + email confirm redirects).
- Core customer flow works end-to-end for the chosen scope (A or B).
- Seller flow works end-to-end (create listing + manage).
- Messaging works end-to-end (start conversation, send message, upload image).
- Reviews/ratings work end-to-end (write review, helpful vote, delete own review).
- Business dashboard access is correctly gated (account type + subscription).
- Supabase security/perf advisors are **0 warnings** (or explicitly accepted + documented).
- Stripe configuration verified in the real deployment environment (test + live as appropriate).
- All required gates pass (tsc + e2e smoke at minimum; full release gates in `docs/launch/PLAN.md`).

## Plans in this folder

- `docs/launch/AUDIT.md` — evidence-based gaps and launch blockers found in repo.
- `docs/launch/PLAN.md` — master execution plan (order + acceptance criteria).
- `docs/launch/FEATURES.md` — feature → routes/actions/tables/tests map.
- `docs/launch/PLAN-SUPABASE.md` — migrations/RLS/storage/security/perf plan.
- `docs/launch/PLAN-STRIPE.md` — Stripe endpoints/webhooks/env/test plan.
- `docs/launch/PLAN-I18N.md` — i18n audit plan (UI + server actions + system content).
- `docs/launch/PLAN-UI-DESIGN-SYSTEM.md` — token/gradient/arbitrary-value cleanup plan.
- `docs/launch/PLAN-DEPLOYMENT.md` — Vercel + Supabase deployment runbook.
- `docs/launch/CHECKLIST-QA.md` — manual QA script (human run) + what to automate.

## Canonical docs to keep obeying

- `docs/PRODUCTION.md` (launch gates)
- `docs/ENGINEERING.md` (boundaries/caching/Supabase rules)
- `docs/DESIGN.md` (tokens + “no gradients / no arbitrary values”)
- `docs/guides/testing.md` (how to run gates)
