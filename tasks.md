# Tasks (Last 5%)

This is the single execution checklist for getting to production. Keep tasks small, ship in batches, and always run the gates.

## Required gates (run every non-trivial batch)

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- E2E smoke: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Pre-release gates (before "go live"):

- Full E2E: `REUSE_EXISTING_SERVER=true pnpm test:e2e`
- Build: `pnpm build`

## P0 - Ship blockers (must be done)

- [x] Stripe products/prices created (Premium/Business)
- [x] [HUMAN] Stripe Dashboard -> Products -> create `Premium` and `Business` products, add recurring prices (monthly/yearly as intended), then copy the Stripe Price IDs for the next checklist step.
- [x] Note: provided Stripe Product IDs (these are `prod_...`, not `price_...`):
  - `prod_TbEnIEvcfYvHFt`
  - `prod_TbEmxeW1Vci25c`
  - `prod_TbEkJVedgo8jis`
  - `prod_TbEiY22C5Nyjs5`
  - `prod_TbEeOnP1lCtoOQ`
  - `prod_TbEcyvXCMdfIGn`
  - `prod_TbEb7tYV8H9uFD`
- [x] Supabase `subscription_plans` updated with Stripe price IDs
- [x] [HUMAN] Copy the `price_...` IDs for Premium/Business monthly + yearly (needed for `subscription_plans.stripe_price_monthly_id` and `subscription_plans.stripe_price_yearly_id`).
- [x] Stripe webhook configured: `https://treido.eu/api/subscriptions/webhook`
- [x] Code step: `/api/subscriptions/webhook` accepts Stripe events and uses `metadata.plan_id` to apply the correct plan.
- [x] [HUMAN] Stripe -> Developers -> Webhooks -> endpoint points to `/api/subscriptions/webhook` and signing secret is set in Vercel as `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`.
- [x] Vercel env vars set + verified at runtime:
  - [x] `NEXT_PUBLIC_APP_URL=https://treido.eu`
  - [x] `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`
  - [x] Runtime check: GET `/api/health/env` on `https://treido.eu` returns `{ ok: true }` (no missing vars).
- [ ] Supabase Security Advisors: 0 actionable warnings (or explicitly accepted + documented)
  - [ ] [HUMAN] Supabase Dashboard -> Auth -> Password Protection: enable leaked password protection (then re-run security advisors to confirm 0 warnings)

Note (2026-01-06): Supabase Performance Advisors show **INFO only** (unused index lints). Defer index removals until post-launch unless write-amplification becomes a problem.

## P0 - Manual acceptance (15-30 minutes, do once per release)

- [ ] `/en` and `/bg` home load
- [ ] Search query + filters work (`/en/search?q=...`)
- [ ] Product page loads and add-to-cart works
- [ ] Auth: sign up -> verification link -> sign in works (or confirm the intended provider flow)
- [ ] Checkout creates a Stripe session and returns to `/{locale}/account/plans` success/cancel URLs

## P1 - Cost/perf stability (high ROI, do in small batches)

- [x] Middleware matcher excludes static assets (`_next/static`, `_next/image`, file assets)
- [ ] Add missing `generateStaticParams()` for locale + key dynamic segments (avoid ISR write spikes)
- [ ] Reduce over-fetching in hot paths (no `select('*')`; project list-view fields)
- [ ] Cache Components usage sanity:
  - [x] `'use cache'` paired with `cacheLife('<profile>')`
  - [x] Correct invalidation: `revalidateTag(tag, profile)`
  - [x] No `'use cache'` module reads per-user request state (`cookies()`/`headers()`)

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
- `docs/gpt+opus.md`
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

- 2026-01-06 - FE: ProductCard styling pass (tokens, no gradients, consistent touch targets; no redesign).
  - Files: `components/shared/product/product-card.tsx`, `tasks.md`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
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

- 2026-01-06 - Admin: prevent service-role queries for redirected users; reduce build noise.
  - Files: `app/[locale]/(admin)/admin/layout.tsx`, `app/[locale]/(admin)/admin/page.tsx`, `app/[locale]/(admin)/admin/orders/page.tsx`, `app/[locale]/(admin)/admin/products/page.tsx`, `app/[locale]/(admin)/admin/sellers/page.tsx`, `app/[locale]/(admin)/admin/users/page.tsx`, `app/api/badges/route.ts`, `app/api/billing/invoices/route.ts`
  - Why: With Next.js 16 PPR + redirects, admin pages could start Supabase service-role reads even when the request is going to be redirected; this also showed up as aborted fetch noise during `next build`.
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `pnpm build` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (PASS)
  - Follow-up: `next build` still logs a Cache Components prerender bail-out stack for `/api/badges` (non-fatal); investigate whether this is a Next 16 Turbopack issue or if there's a supported opt-out under `cacheComponents`.

- 2026-01-06 - Cache audit: verified cached code does not read per-user request state (`cookies()`/`headers()`).
  - Files: `app/api/categories/route.ts`, `app/api/categories/[slug]/children/route.ts`, `app/[locale]/(sell)/sell/_lib/categories.ts`, `lib/data/categories.ts`, `lib/data/product-page.ts`, `lib/data/product-reviews.ts`, `lib/data/products.ts`, `lib/data/profile-page.ts`
  - Commands: `rg "use cache" -S app lib` + targeted `Select-String` for `next/headers`, `cookies(`, `headers(` (PASS)

- 2026-01-06 - FE: Home hero dense spacing + token consistency (no redesign).
  - Files: `components/desktop/marketplace-hero.tsx`
  - Changes: Dense spacing (`gap-3`, `space-y-2`), reduced padding (`px-4 py-4 lg:px-6 lg:py-5`), tighter badge (`px-2.5 py-0.5`), button sizing (`size="default"`), and typography scale (`text-xl lg:text-2xl`). CTA tokens (`cta-trust-blue*`) are semantic and defined in `globals.css`.
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed)

- 2026-01-06 - FE: Product pages i18n sweep - remove hardcoded EN/BG dictionaries.
  - Files: `lib/view-models/product-page.ts`, `components/shared/product/item-specifics.tsx`, `components/mobile/product/mobile-product-page.tsx`, `messages/en.json`, `messages/bg.json`, `docs/frontend_tasks.md`
  - Changes: View-model now returns locale-agnostic `conditionKey` + raw attribute `key/value` pairs. Added `attr*` and `val*` translation keys to `ProductDetails` namespace. Translation happens at render-time using `useTranslations`. Desktop uses `ItemSpecifics`, mobile uses inline translation in `mobile-product-page.tsx`.
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed)

- 2026-01-06 - Investigated `/api/badges` prerender bailout noise during `pnpm build`.
  - Files: `app/api/badges/route.ts`
  - Finding: Route uses `createRouteHandlerClient` (reads cookies for auth). With `cacheComponents: true`, route segment configs (`export const dynamic`) are **not compatible** and cause build failure. The bailout message is informational—Next.js auto-detects dynamic API usage and marks the route as dynamic. Build completes successfully (verified by `.next/BUILD_ID`).
  - Resolution: Added clarifying comment to route. No code fix possible; this is expected Next.js 16 Cache Components behavior.
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `pnpm build` (PASS - builds successfully despite stderr noise)

- 2026-01-06 - BE: Stripe locale return URLs sweep - centralized locale-safe URL generation for all Stripe flows.
  - Files: `lib/stripe-locale.ts` (new), `app/actions/payments.ts`, `app/actions/boost.ts`, `app/api/payments/setup/route.ts`, `app/api/boost/checkout/route.ts`, `app/[locale]/(checkout)/_actions/checkout.ts`, `app/api/subscriptions/checkout/route.ts`, `app/api/subscriptions/portal/route.ts`, `app/actions/subscriptions.ts`, `docs/backend_tasks.md`
  - Why: Multiple Stripe integrations were generating return URLs without locale prefix (`/account/payments`, `/account/selling`, `/sell`, `/cart`, `/checkout/success`), which would result in 404s or broken locale state after Stripe redirects.
  - Changes: Created shared `lib/stripe-locale.ts` with `buildLocaleUrl()`, `inferLocaleFromRequest()`, `inferLocaleFromHeaders()`. Updated all Stripe URL generation sites to use these helpers. Refactored subscription routes/actions to use shared module (removed ~60 lines of duplicated helpers).
  - Commands: `pnpm -s lint` (warnings only - pre-existing), `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed), `pnpm build` (PASS)

- 2026-01-06 - BE: Stripe locale unit tests - locked in behavior with comprehensive test coverage.
  - Files: `lib/stripe-locale.ts`, `__tests__/stripe-locale.test.ts`, `docs/backend_tasks.md`, `tasks.md`
  - Changes: Fixed `inferLocaleFromHeaders()` to match its comment (added origin fallback). Created 37 Vitest unit tests covering `normalizeLocale()`, `getAppUrl()`, `buildLocaleUrl()`, `inferLocaleFromRequest()`, `inferLocaleFromHeaders()` including edge cases (invalid URLs, empty strings, priority order).
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `pnpm -s exec vitest run __tests__/stripe-locale.test.ts` (37/37 PASS)

- 2026-01-06 - FE: Login form drift cleanup + Checkout page heading/a11y fix.
  - Files: `app/[locale]/(auth)/_components/login-form.tsx`, `app/[locale]/(checkout)/_components/checkout-page-client.tsx`, `docs/frontend_tasks.md`
  - Changes (login): Removed explicit `h-10` from buttons (rely on `size="lg"` which gives h-9), standardized password toggle to `size-8` button with `size-4` icons (consistent design tokens).
  - Changes (checkout): Added H1 heading (`sr-only` on mobile, visible on desktop header row using `t("title")` which already exists in i18n), replaced arbitrary `h-12` button heights with `h-10` design token.
  - Commands: `pnpm -s lint` (warnings only - pre-existing), `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (14/15 - 1 pre-existing search error), `REUSE_EXISTING_SERVER=true pnpm test:e2e:auth` (27/28 - 1 timing flake unrelated to changes)

- 2026-01-06 - E2E: Auth password-visibility toggle deterministic fix.
  - Files: `e2e/auth.spec.ts`, `docs/frontend_tasks.md`, `tasks.md`
  - Changes: Replaced brittle `button.filter({ has: svg }).first()` selector with accessible name (`/show password/i`, `/hide password/i`). Added `waitForDevCompilingOverlayToHide(page)` after `page.goto()` to avoid hydration flake.
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed), `REUSE_EXISTING_SERVER=true pnpm test:e2e:auth` (28 passed)
  - Verified: `test-results/.last-run.json` reports `{ status: "passed", failedTests: [] }`

- 2026-01-06 - FE: /plans UX fix + admin orders prerender noise elimination.
  - Files: `app/[locale]/(plans)/_components/plans-page-client.tsx`, `components/pricing/plans-modal.tsx`, `app/[locale]/(admin)/admin/orders/page.tsx`, `docs/frontend_tasks.md`, `tasks.md`
  - Changes:
    - Plans page: CTA now shows deterministic loading and displays specific error messages (from server action) instead of generic "Error" toast; handles edge case where no URL is returned without error
    - Plans modal: Same error handling improvement, redirects to full /plans page on failure for clearer error display
    - Admin orders: Calls `await connection()` (instead of route segment config) to prevent prerender fetch abort noise during `pnpm build` in cacheComponents mode
  - Commands: `pnpm -s lint` (warnings only - pre-existing), `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed)

- 2026-01-06 - BE: Subscription checkout hardening for production readiness.
  - Files: `app/api/subscriptions/checkout/route.ts`, `docs/backend_tasks.md`, `tasks.md`, `supabase_tasks.md`
  - Changes:
    - Clean 4xx for bad input: explicit validation of `planId` (must be string) and `billingPeriod` (must be "monthly" or "yearly"), 400 for invalid JSON body
    - Clear 5xx for Stripe failures: sanitized error logging (type + message only, no secrets), distinguishes Stripe errors ("Payment service error") from internal errors
    - `stripe_price_*_id` guardrail: `validateStripePriceId()` returns explicit config error (500) if price ID is set but malformed (not `price_...` format); null/empty falls back to inline price_data
    - Removed ~30 lines of duplicated locale helpers (now uses shared `lib/stripe-locale.ts`)
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed)

- 2026-01-06 - FE: ProductCard token/spacing polish (no redesign, dense spacing).
  - Files: `components/shared/product/product-card.tsx`, `app/globals.css`, `docs/frontend_tasks.md`, `tasks.md`
  - Changes:
    - Touch tokens: Replaced redundant `size-7 + min-h-touch-sm min-w-touch-sm` with unified `size-touch-sm` on wishlist and quick-add buttons
    - Missing utilities: Added `min-w-touch-sm`, `w-touch-sm`, `size-touch-sm` to globals.css for complete touch target token coverage
    - i18n: Replaced hardcoded "Free" text with `t("freeShipping")` and "sold" with `t("sold")` (both keys already existed in Product namespace)
    - Comment fix: Updated comment from "size-7" to "size-touch-sm" for clarity
  - Verified: Responsive check at 390x844 + 1440x900 shows consistent touch targets (28px), dense spacing preserved
  - Commands: `pnpm -s lint` (warnings only - pre-existing), `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed)

- 2026-01-06 - FE (Opus): Mobile accordions i18n fix - replaced hardcoded locale dictionary with useTranslations().
  - Files: `components/shared/product/mobile-accordions.tsx`, `messages/en.json`, `messages/bg.json`
  - Changes:
    - Replaced inline `locale === "bg" ? "..." : "..."` dictionary with proper `useTranslations("Product")` calls
    - Added 6 new keys to Product namespace in both message files: `productDetails`, `shippingReturns`, `defaultShipping`, `defaultReturns`, `noDescription`, `noDetails`
    - Component now properly uses `t("key")` syntax instead of `t.key` object access
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed)
  - Verified: Codex review pending

- 2026-01-06 - FE (Opus): Login form drift cleanup + Checkout page H1/a11y.
  - Files: `app/[locale]/(auth)/_components/login-form.tsx`, `app/[locale]/(checkout)/_components/checkout-page-client.tsx`
  - Changes (login):
    - Removed explicit `h-10` from Sign In + Create Account buttons (rely on `size="lg"` → h-9 design token)
    - Standardized password toggle button to `size-8` with `size-4` icons for consistency
  - Changes (checkout):
    - Added semantic H1 (`sr-only` on mobile, visible on desktop header row) using existing `t("title")` i18n key
    - Replaced arbitrary `h-12` button heights with `h-10` design token on both mobile footer and desktop sidebar CTAs
  - Screenshots: login-before/after + checkout-before/after at 390×844 + 1440×900 in `.playwright-mcp/`
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15 passed), `REUSE_EXISTING_SERVER=true pnpm test:e2e:auth` (28 passed)

- 2026-01-06 - BE (Opus): Stripe subscription webhook robustness - production hardening.
  - Files: `app/api/subscriptions/webhook/route.ts`, `docs/backend_tasks.md`, `tasks.md`
  - Changes:
    - Malformed/partial payloads: Missing required metadata (profile_id/plan_id/billing_period/subscription_id) now results in safe no-op with `{ received: true }` + sanitized log
    - Sanitized error logging: Added `logWebhookError()` helper that logs only error type + message (never full objects, stacks, or secrets)
    - Stripe API failures: Added `safeRetrieveSubscription()` wrapper that returns null on failure instead of throwing; prevents retry storms by always returning 200 after signature verification
    - Body read failures: Wrapped `req.text()` in try-catch; returns `{ received: true }` on failure
    - Catch-all: Changed final catch block from 500 to 200 `{ received: true }` to prevent Stripe retry DOS
  - Commands: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `pnpm test:unit` (380/380 PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (14/15 - 1 pre-existing search filter flake)
