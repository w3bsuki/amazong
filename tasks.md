# Tasks (Last 5%)

This is the single execution checklist for getting to production. Keep tasks small, ship in batches, and always run the gates.

## Required gates (run every non-trivial batch)

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- E2E smoke: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Pre-release gates (before "go live"):

- Full E2E: `REUSE_EXISTING_SERVER=true pnpm test:e2e`
- Build: `pnpm build`

## P0 - Ship blockers (must be done)

- [ ] Stripe products/prices created (Premium/Business)
- [ ] Dashboard step: Stripe Dashboard -> Products -> create `Premium` and `Business` products, add recurring prices (monthly/yearly as intended), then copy the Stripe Price IDs for the next checklist step.
- [ ] Note: provided Stripe Product IDs (these are `prod_...`, not `price_...`):
  - `prod_TbEnIEvcfYvHFt`
  - `prod_TbEmxeW1Vci25c`
  - `prod_TbEkJVedgo8jis`
  - `prod_TbEiY22C5Nyjs5`
  - `prod_TbEeOnP1lCtoOQ`
  - `prod_TbEcyvXCMdfIGn`
  - `prod_TbEb7tYV8H9uFD`
- [x] Supabase `subscription_plans` updated with Stripe price IDs
- [ ] Dashboard step: copy the `price_...` IDs for Premium/Business monthly + yearly (needed for `subscription_plans.stripe_price_monthly_id` and `subscription_plans.stripe_price_yearly_id`).
- [ ] Stripe webhook configured: `https://treido.eu/api/subscriptions/webhook`
- [x] Code step: `/api/subscriptions/webhook` accepts Stripe events and uses `metadata.plan_id` to apply the correct plan.
- [ ] Dashboard step: Stripe -> Developers -> Webhooks -> endpoint points to `/api/subscriptions/webhook` and signing secret is set in Vercel as `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`.
- [x] Vercel env vars set + verified at runtime:
  - [x] `NEXT_PUBLIC_APP_URL=https://treido.eu`
  - [x] `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`
  - [x] Runtime check: GET `/api/health/env` on `https://treido.eu` returns `{ ok: true }` (no missing vars).
- [ ] Supabase Security Advisors: 0 warnings (or explicitly accepted + documented)
  - [ ] 2026-01-06 advisor run: **1 WARN** (dashboard-only) - deferred (tracked in `supabase_tasks.md`).

Note (2026-01-06): Supabase Performance Advisors show **INFO only** (unused index lints). Defer index removals until post-launch unless write-amplification becomes a problem.

## P0 - Manual acceptance (15-30 minutes, do once per release)

- [ ] `/en` and `/bg` home load
- [ ] Search query + filters work (`/en/search?q=...`)
- [ ] Product page loads and add-to-cart works
- [ ] Auth: sign up -> verification link -> sign in works (or confirm the intended provider flow)
- [ ] Checkout creates a Stripe session and returns to `/{locale}/account/plans` success/cancel URLs

## P1 - Cost/perf stability (high ROI, do in small batches)

- [ ] Middleware matcher excludes static assets (`_next/static`, `_next/image`, file assets)
- [ ] Add missing `generateStaticParams()` for locale + key dynamic segments (avoid ISR write spikes)
- [ ] Reduce over-fetching in hot paths (no `select('*')`; project list-view fields)
- [ ] Cache Components usage sanity:
  - [ ] `'use cache'` paired with `cacheLife('<profile>')`
  - [ ] Correct invalidation: `revalidateTag(tag, profile)`

## P1 - UI drift (no redesign, high-traffic first)

Use scan reports as the source of truth:

- `cleanup/palette-scan-report.txt`
- `cleanup/arbitrary-scan-report.txt`

- Regenerate scans: `pnpm -s exec node scripts/scan-tailwind-palette.mjs` and `pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs`

- [ ] A1: Replace hardcoded palette in high-traffic surfaces with tokens
- [ ] A3: Product surfaces polish (spacing/typography consistency without layout changes)

## P2 - Post-launch cleanup (defer unless it blocks shipping)

- [ ] Remove dead code/files and stray console logs
- [ ] Run `pnpm -s knip` and remove safe unused files/exports
- [ ] Reduce tech debt surfaced by audits (move only what's actionable into P1/P0)

## References (kept small on purpose)

- `docs/PRODUCTION.md`
- `docs/ENGINEERING.md`
- `docs/DESIGN.md`
- `docs/TESTING.md`
- `docs/workflow.md`
- `docs/frontend_tasks.md`
- `docs/backend_tasks.md`

## Batch Log

- 2026-01-06 - FE: Home promo cards - eager-load first image to reduce LCP warning noise.
  - Files: `app/[locale]/(main)/_components/promo-cards.tsx`, `components/promo/promo-card.tsx`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: if Playwright screenshots/notes exist, paste key findings into `docs/frontend_tasks.md`.

- 2026-01-06 - Added explicit dashboard steps + recorded Stripe `prod_...` IDs so they don't get lost.
  - Files: `tasks.md`
  - Commands: (not run - docs-only change)
  - Follow-up: still need Stripe Price IDs (`price_...`) to complete the `subscription_plans` Stripe ID update.

- 2026-01-06 - Set Stripe `price_...` IDs on active `subscription_plans` rows via migration.
  - Files: `supabase/migrations/20260106120000_set_subscription_plan_stripe_price_ids.sql`, `tasks.md`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: These Price IDs were described as legacy/old; verify they match the current plan pricing and replace if needed.

- 2026-01-06 - Fixed subscription webhook to apply plans by `plan_id` (supports current tiers; avoids duplicate subscription inserts).
  - Files: `app/api/subscriptions/webhook/route.ts`, `tasks.md`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: Rotate any webhook secrets that were pasted into chat; keep only the intended Stripe endpoint(s) enabled.

- 2026-01-06 - Added a safe runtime env presence check endpoint (no secret values returned).
  - Files: `app/api/health/env/route.ts`, `tasks.md`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: Use this endpoint to verify Vercel Production env without exposing secrets.

- 2026-01-06 - Ran Supabase MCP advisors + verified Stripe/webhook + caching invariants.
  - Files: `tasks.md`
  - Evidence:
    - Supabase Security Advisors: 1 WARN (dashboard-only) - deferred (tracked in `supabase_tasks.md`).
    - Supabase Performance Advisors: INFO only (unused indexes) - no P0 perf action.
    - Stripe webhooks present and verify signatures via `stripe.webhooks.constructEvent(...)` using `stripe-signature` and `req.text()`:
      - `/api/subscriptions/webhook` uses `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`
      - `/api/checkout/webhook` and `/api/payments/webhook` support multiple secrets via `STRIPE_WEBHOOK_SECRET`
    - Cache Components sanity: `revalidateTag(tag, "max")` usage; cached data functions use `createStaticClient()` and do not read `cookies()`/`headers()`.
  - Commands: (not run - docs-only batch)
  - Follow-up: Clear the dashboard-only advisor warning later, then re-run security advisors to confirm 0 warnings.

- 2026-01-06 - Fixed Stripe return URLs to include locale (plans + billing portal).
  - Files: `app/actions/subscriptions.ts`, `app/[locale]/(account)/account/plans/plans-content.tsx`, `app/[locale]/(plans)/_components/plans-page-client.tsx`, `components/pricing/plans-modal.tsx`, `app/[locale]/(account)/account/plans/upgrade/upgrade-content.tsx`, `app/[locale]/(account)/account/billing/billing-content.tsx`, `docs/backend_tasks.md`, `tasks.md`
  - Why: Stripe success/cancel/return URLs were pointing to non-localized `/account/...` paths, which breaks the post-checkout return flow in a locale-prefixed router.
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)

- 2026-01-06 - Repo cleanup: removed obsolete docs + unused code.
  - Files: `docs-archive/**` (deleted), `page.html` (deleted), `components/mobile/product/mobile-badges-row.tsx` (deleted), `lib/data/categories.ts`, `README.md`, `docs/README.md`, `agents.md`, `tasks.md`
  - Commands: `pnpm -s knip` (PASS), `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
