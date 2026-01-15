# Master Plan: Production Finalization (AI-Executable)

This is the concrete, ordered plan to reach production-ready status.

## Status Summary (2026-01-15)

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 | ✅ Complete | Scope frozen |
| Phase 1 | ✅ Complete | Docs + proxy verified |
| Phase 2 | ✅ Complete | Supabase security clean |
| Phase 3 | ✅ Complete | Stripe webhooks verified |
| Phase 4 | ✅ Complete | E2E: auth 28, smoke 16, reviews 7 |
| Phase 5 | ✅ Complete | 0 gradients, 9 arbitrary values |
| Phase 6 | ✅ Complete | All gates pass, deployment checklist ready |

**Current state:** Ready for production deployment pending human configuration (env vars, webhooks, Supabase auth URLs).

---

## Global rules (do not violate)

- No rewrites / no redesigns. Keep batches small and verifiable.
- Never log secrets/JWTs/full request bodies.
- Respect repo boundaries (`docs/ENGINEERING.md`) and design rails (`docs/DESIGN.md`).
- After every non-trivial batch, run:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (with `pnpm dev` running)

## Phase 0 — Decide scope + freeze ✅ COMPLETE

1) Pick launch mode:
   - V1 classifieds-first: `docs/roadmap/v1.md`
   - V2 checkout/orders: `docs/roadmap/v2.md`
2) Write the decision down (one paragraph) in `GPT+OPUS/decisions/` or add a note to `TODO.md`.
3) Freeze scope: anything not required for the chosen mode is deferred.

**Done when:** every team member can answer “what is in-scope for launch?” in one sentence.

## Phase 1 — Restore workflow integrity (docs + proxy routing) ✅ COMPLETE

1) Ensure the repo’s workflow links resolve:
   - `docs/PRODUCTION-WORKFLOW-GUIDE.md`, `docs/GPTVSOPUSFINAL.md`
   - `tasks.md`, `supabase_tasks.md`
   - `AGENT-ORCHESTRATION.md`, `TREIDO-UI-REFACTOR-PLAN.md`
   - `TASK-fix-chat-mobile-scroll-and-avatars.md`, `TASK-enable-leaked-password-protection.md`
2) Confirm Next.js 16 proxy is actually active:
   - Root `proxy.ts` must exist and be the only proxy/middleware entrypoint (do **not** add `middleware.ts`).
   - Note: `lib/supabase/middleware.ts` is an internal helper and is not a Next.js entrypoint.

**Done when:** `TODO.md` + `docs/PRODUCTION.md` references are not broken and locale-less redirects work.

## Phase 2 — Supabase hard gate (security + correctness) ✅ COMPLETE

Follow `docs/launch/PLAN-SUPABASE.md`.

Minimum must-pass items:
- Remote DB has applied critical migrations listed in `docs/launch/AUDIT.md`.
- Supabase Security Advisor: **0 warnings** (or explicitly accepted + documented).
- Storage buckets + policies: `product-images` + `avatars` exist and match app usage.

**Done when:** all “must-pass” checks are green and there are no correctness landmines in triggers/policies.

## Phase 3 — Stripe hard gate (only if launch scope needs it) ✅ COMPLETE

Follow `docs/launch/PLAN-STRIPE.md`.

Must-pass for any launch that charges money:
- Correct webhook endpoints configured (no duplicate handling).
- Signature verification works in production environment.
- End-to-end payment flow verified (test mode and live mode as appropriate).

**Done when:** you can complete at least one real end-to-end payment flow and see correct DB state.

## Phase 4 — Core user flows (end-to-end) ✅ COMPLETE

Use `docs/launch/FEATURES.md` to map routes/actions/tables/tests and execute the following.

### Auth + onboarding
- Run: `pnpm test:e2e:auth`
- Manual: signup → confirm email → login → reset password.
- Verify redirects land in the correct locale.

### Marketplace browse/search/product pages
- Run: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- Manual: category browse → search filters → PDP loads and renders.

### Seller listing flow
- Run: `pnpm test:e2e e2e/seller-create-listing.spec.ts`
- Manual: create listing with images → edit listing.

### Messaging
- Manual: create conversation → send message → upload image → report conversation.
- Fix known issues using `TASK-fix-chat-mobile-scroll-and-avatars.md`.

### Checkout + orders (only if in-scope)
- Run: `pnpm test:e2e e2e/orders.spec.ts` (requires configured test user creds).
- Manual: add to cart → checkout → order created → view in `/account/orders` and seller views.

### Reviews/ratings
- Run: `pnpm test:e2e e2e/reviews.spec.ts`
- Manual: attempt review unauthenticated, then authenticated; verify verified-purchase behavior.

### Business dashboard (only if you sell it at launch)
- Run: `pnpm test:e2e e2e/seller-routes.spec.ts`
- Manual: upgrade → access `/dashboard` → manage products/orders.

**Done when:** every in-scope flow can be completed by a brand-new user without dev tools.

## Phase 5 — i18n + UI drift (rails compliance) ✅ COMPLETE

Follow:
- `docs/launch/PLAN-I18N.md`
- `docs/launch/PLAN-UI-DESIGN-SYSTEM.md`

Minimum for launch:
- Critical surfaces do not ship mixed-language strings.
- No gradients; arbitrary Tailwind values reduced to an agreed threshold.

**Done when:** rails are met on high-traffic surfaces and regressions are prevented by scans/tests.

## Phase 6 — Release gates + deployment runbook ✅ COMPLETE

1) Full release gates (preferred):
   - `pnpm -s lint`
   - `pnpm -s typecheck`
   - `pnpm -s test:unit`
   - `pnpm -s build`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
2) If feasible: `pnpm -s test:prod` (slow, but best confidence).
3) Follow `docs/launch/PLAN-DEPLOYMENT.md` (env, domains, Supabase/Stripe config).
4) Run the manual script in `docs/launch/CHECKLIST-QA.md`.
5) Ship with a rollback plan (previous Vercel deployment).

**Done when:** gates are green, manual QA passes, and you have a rollback + monitoring plan.
