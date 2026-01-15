# Production Readiness Audit (Repo + Docs)

**Date:** 2026-01-14  
**Goal:** Identify evidence-backed blockers and produce an execution plan.

## What passed locally (baseline)

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit` ✅
- Unit tests: `pnpm -s test:unit` ✅ (note: Vite prints a CJS deprecation warning)
- E2E smoke was **not** run here (requires `pnpm dev` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`)

## Critical doc gaps (broken references)

These files are referenced as workflow dependencies but were missing:
- `docs/PRODUCTION-WORKFLOW-GUIDE.md` (referenced by `TODO.md`)
- `docs/GPTVSOPUSFINAL.md` (referenced by `TODO.md`)
- `tasks.md` (referenced by `docs/PRODUCTION.md`)
- `supabase_tasks.md` (referenced by `docs/PRODUCTION.md`)
- `AGENT-ORCHESTRATION.md` + `TREIDO-UI-REFACTOR-PLAN.md` (referenced by `TODO.md`)
- `TASK-fix-chat-mobile-scroll-and-avatars.md` + `TASK-enable-leaked-password-protection.md` (referenced by `TODO.md`)

Plan: ship “tombstone”/wrapper docs so existing links stop breaking, and consolidate execution into `docs/launch/*`.

## Critical code/config gaps

### 1) Proxy (Next.js 16) activation risk ✅ RESOLVED

Evidence:
- `proxy.ts` is the Next.js 16 routing proxy (locale routing + geo cookies + Supabase session updates).
- `middleware.ts` was deleted 2026-01-15; only `proxy.ts` exists now.

Status: **Fixed.** Dev server starts cleanly with no proxy/middleware warnings.

### 2) Stripe webhook surface area is large (needs consolidation)

Evidence: multiple webhook endpoints exist:
- `app/api/checkout/webhook/route.ts` (orders from goods checkout)
- `app/api/payments/webhook/route.ts` (setup intents + listing boosts)
- `app/api/subscriptions/webhook/route.ts` (subscriptions + also listing boosts)

Risk:
- Misconfigured Stripe dashboard can send the same event to multiple endpoints.
- Listing boost appears implemented in **two** different webhook handlers → risk of double-processing.

Mitigation:
- Pick one canonical webhook per domain (goods checkout, boosts, subscriptions) and configure Stripe accordingly.
- Ensure idempotency keys are consistent (session id/payment intent/subscription id).

### 3) Supabase “known issues” have migrations but must be applied remotely

Evidence: fixes exist as migrations:
- `supabase/migrations/20260110153000_fix_double_stock_decrement.sql`
- `supabase/migrations/20260110153100_fix_handle_order_item_status_change.sql`
- `supabase/migrations/20260110153300_ensure_avatars_bucket_and_policies.sql`

Risk:
- If these are not applied in production DB, checkout/order status messaging/avatars can break for real users.

Mitigation:
- Treat migrations as a release gate; verify remote `schema_migrations` includes these versions.

## Product/roadmap alignment risk

Evidence:
- Roadmap `docs/roadmap/v1.md` describes classifieds-first (message seller, off-platform payment).
- Codebase includes real cart/checkout/orders/reviews/business dashboards.

Risk:
- Shipping “half V1 / half V2” creates user confusion and compliance/ops exposure.

Mitigation:
- Decide the launch scope explicitly (see `docs/launch/README.md`) and hide/disable out-of-scope surfaces.

## i18n and “user string” consistency risk

Evidence:
- Many user-facing error strings live in server actions (e.g. `app/actions/reviews.ts`, `app/[locale]/(auth)/_actions/auth.ts`).
- Some UI components embed custom translation objects (e.g. `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx`) instead of `next-intl` message files.
- Some DB triggers write English notification text.

Risk:
- Mixed-language UX for Bulgarian users; violates repo rail “All user strings via next-intl”.

Mitigation:
- Run the i18n plan in `docs/launch/PLAN-I18N.md` (start with critical paths only).

## UI drift risk (design rails)

Evidence:
- `TODO.md` tracks remaining design system cleanup (gradients + arbitrary values).
- Baselines exist in `cleanup/palette-scan-report.txt` and `cleanup/arbitrary-scan-report.txt`.

Risk:
- Inconsistent styling + “token drift” grows over time; violates rails.

Mitigation:
- Execute `docs/launch/PLAN-UI-DESIGN-SYSTEM.md` (high-traffic surfaces first).
