# Tasks (Last 5%)

This is the single execution checklist for getting to production. Keep tasks small, ship in batches, and always run the gates.

## Required gates (run every non-trivial batch)

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- E2E smoke: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Pre-release gates (before “go live”):

- Full E2E: `REUSE_EXISTING_SERVER=true pnpm test:e2e`
- Build: `pnpm build`

## P0 — Ship blockers (must be done)

- [ ] Stripe products/prices created (Premium/Business)
- [ ] Dashboard step: Stripe Dashboard → Products → create `Premium` and `Business` products, add recurring prices (monthly/yearly as intended), then copy the Stripe Price IDs for the next checklist step.
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
- [ ] Code step: `/api/subscriptions/webhook` accepts Stripe events and uses `metadata.plan_id` to apply the correct plan.
- [ ] Dashboard step: Stripe → Developers → Webhooks → endpoint points to `/api/subscriptions/webhook` and signing secret is set in Vercel as `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`.
- [ ] Vercel env vars set + verified at runtime:
  - [ ] `NEXT_PUBLIC_APP_URL=https://treido.eu`
  - [ ] `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET`
  - [ ] Runtime check: GET `/api/health/env` on `https://treido.eu` returns `{ ok: true }` (no missing vars).
- [ ] Supabase Security Advisors: 0 warnings (or explicitly accepted + documented)
  - [ ] Enable Supabase Auth “Leaked Password Protection”

## P0 — Manual acceptance (15–30 minutes, do once per release)

- [ ] `/en` and `/bg` home load
- [ ] Search query + filters work (`/en/search?q=...`)
- [ ] Product page loads and add-to-cart works
- [ ] Auth: sign up → verification link → sign in works (or confirm the intended provider flow)
- [ ] Checkout creates a Stripe session and returns to `/account/plans` success/cancel URLs

## P1 — Cost/perf stability (high ROI, do in small batches)

- [ ] Middleware matcher excludes static assets (`_next/static`, `_next/image`, file assets)
- [ ] Add missing `generateStaticParams()` for locale + key dynamic segments (avoid ISR write spikes)
- [ ] Reduce over-fetching in hot paths (no `select('*')`; project list-view fields)
- [ ] Cache Components usage sanity:
  - [ ] `'use cache'` paired with `cacheLife('<profile>')`
  - [ ] Correct invalidation: `revalidateTag(tag, profile)`

## P1 — UI drift (no redesign, high-traffic first)

Use scan reports as the source of truth:

- `cleanup/palette-scan-report.txt`
- `cleanup/arbitrary-scan-report.txt`

- [ ] A1: Replace hardcoded palette in high-traffic surfaces with tokens
- [ ] A3: Product surfaces polish (spacing/typography consistency without layout changes)

## P2 — Post-launch cleanup (defer unless it blocks shipping)

- [ ] Remove dead code/files and stray console logs
- [ ] Reduce tech debt surfaced by audits (move only what’s actionable into P1/P0)

## References (kept small on purpose)

- `docs/PRODUCTION.md`
- `docs/ENGINEERING.md`
- `docs/DESIGN.md`
- `docs/TESTING.md`

## Batch Log

- 2026-01-06 — Added explicit dashboard steps + recorded Stripe `prod_...` IDs so they don’t get lost.
  - Files: `tasks.md`
  - Commands: (not run — docs-only change)
  - Follow-up: still need Stripe Price IDs (`price_...`) to complete the `subscription_plans` Stripe ID update.

- 2026-01-06 — Set Stripe `price_...` IDs on active `subscription_plans` rows via migration.
  - Files: `supabase/migrations/20260106120000_set_subscription_plan_stripe_price_ids.sql`, `tasks.md`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: These Price IDs were described as legacy/old; verify they match the current plan pricing and replace if needed.

- 2026-01-06 — Fixed subscription webhook to apply plans by `plan_id` (supports current tiers; avoids duplicate subscription inserts).
  - Files: `app/api/subscriptions/webhook/route.ts`, `tasks.md`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: Rotate any webhook secrets that were pasted into chat; keep only the intended Stripe endpoint(s) enabled.

- 2026-01-06 — Added a safe runtime env presence check endpoint (no secret values returned).
  - Files: `app/api/health/env/route.ts`, `tasks.md`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: Use this endpoint to verify Vercel Production env without exposing secrets.
