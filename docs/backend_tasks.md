# Backend Tasks (Execution Queue)

Owner: Backend agent(s)

This is the day-to-day queue for backend work (**queue only**). The overall go-live checklist + batch log remains `tasks.md`.

Rules:
- Don’t treat this file as canonical; don’t duplicate/replace `tasks.md`.
- Prefer “one behavior” tasks with a 1-sentence **Done when** and 2–4 verification steps.
- When a batch ships, record it in `tasks.md` using the agreed medium format (`docs/gpt+opus.md`).

Read first: `docs/workflow.md`, `docs/backend.md`, `docs/ENGINEERING.md`, `docs/PRODUCTION.md`, `supabase_tasks.md`.

## P0: Start here (today)

- [x] Run Supabase MCP security advisors; eliminate warnings (or explicitly accept + document)
- [x] Run Supabase MCP performance advisors; record findings + decide what is safe to defer
- [x] Reproduce `/plans` failure (Stripe return URLs missing locale) and fix as a small batch
- [x] Stripe sanity: webhook applies plans by `metadata.plan_id` and signature verification is in place
- [x] **Stripe locale return URLs sweep**: all Stripe `success_url`, `cancel_url`, `return_url` use locale-prefixed paths via shared `lib/stripe-locale.ts` helper
- [x] **Stripe locale unit tests**: `lib/stripe-locale.ts` behavior locked in with comprehensive Vitest coverage (37 tests: `normalizeLocale`, `buildLocaleUrl`, `inferLocaleFromRequest`, `inferLocaleFromHeaders`)
- [x] **Subscription checkout hardening**: clean 4xx for bad input, clear 5xx for Stripe failures (no secrets logged), stripe_price_*_id guardrail (explicit config error for malformed IDs)
- [x] **Stripe subscription webhook robustness**: malformed/partial payloads result in safe no-op + `{ received: true }`; sanitized error logging (type + message only); Stripe API failures return 200 to prevent retry storms

## P0 audit notes (fill this in)

For each issue:
- Area (RLS / advisors / caching / stripe / middleware)
- Evidence (advisor output, SQL, failing route)
- Minimal fix (migration name + summary)
- “Done when” acceptance criteria

### Supabase advisors (latest evidence)

- **Area:** advisors (security)
- **Evidence (2026-01-06):** `mcp_supabase_get_advisors({ type: "security" })`
- **Minimal fix:** None (dashboard-only items handled separately)
- **Done when:** No actionable security advisor warnings requiring code/migration changes

- **Area:** advisors (performance)
- **Evidence (2026-01-06):** `mcp_supabase_get_advisors({ type: "performance" })`
	- INFO-only: unused index lints (no action pre-launch)
- **Minimal fix:** None (defer index removals until post-launch verification)
- **Done when:** No P0/P1 performance warnings requiring action; unused indexes are captured for later cleanup with idx_scan evidence

## P1: Cost + correctness sanity (this session)

- [x] Data/cost sanity: audit hot-path queries for over-fetching (no `select('*')` in list views), deep joins, and missing indexes only when justified by advisors/EXPLAIN
- [x] Next.js caching sanity: ensure cached reads use `createStaticClient()` + `'use cache'` + `cacheLife` + granular `cacheTag`, and `revalidateTag(tag, profile)` uses the required profile arg (PASS - 2026-01-06)
  - [x] All `'use cache'` blocks in `lib/data/**` have `cacheLife('<profile>')` (categories, products, user)
  - [x] All `'use cache'` blocks in `app/api/categories/**` have `cacheLife('categories')`
  - [x] All `'use cache'` blocks in `app/[locale]/(sell)/sell/_lib/categories.ts` have `cacheLife('categories')`
  - [x] All `revalidateTag()` calls use 2-arg form with `"max"` profile (verified: ~50 calls in actions files)
  - [x] All cached reads use `createStaticClient()` (no cookie-aware clients in cached modules)
- [x] Cache audit (per-user leakage): ensure no cached module reads `cookies()`/`headers()` (PASS)
  - [x] `app/**` cached files: `app/api/categories/route.ts`, `app/api/categories/[slug]/children/route.ts`, `app/[locale]/(sell)/sell/_lib/categories.ts` (no `next/headers` usage)
  - [x] `lib/data/**` cached files: `lib/data/categories.ts`, `lib/data/product-page.ts`, `lib/data/product-reviews.ts`, `lib/data/products.ts`, `lib/data/profile-page.ts` (no `next/headers` usage)
- [ ] Payments sanity: verify `/en/plans` checkout and return URLs behave correctly with locale, and webhook plan mapping via `metadata.plan_id` is correct + idempotent

### Stripe locale return URLs sweep (2026-01-06)

- **Area:** Stripe / locale return URLs
- **Problem:** Several Stripe checkout/portal endpoints were generating non-localized return URLs (e.g. `/account/payments`, `/account/selling`, `/sell`, `/cart`, `/checkout/success`) which would cause 404s or unpredictable locale behavior on redirect.
- **Evidence (grep):**
  ```
  success_url|cancel_url|return_url hits:
    app/actions/payments.ts             /account/payments?setup=...
    app/actions/boost.ts                /account/selling?..., /sell?...
    app/api/payments/setup/route.ts     /account/payments?setup=...
    app/api/boost/checkout/route.ts     /account/selling?..., /sell?...
    app/[locale]/(checkout)/_actions/checkout.ts   /checkout/success?..., /cart
  ```
- **Fix:** Created `lib/stripe-locale.ts` with reusable helpers (`buildLocaleUrl`, `inferLocaleFromRequest`, `inferLocaleFromHeaders`). Updated all Stripe URL generation sites to use these helpers. Also refactored existing subscription routes/actions to use the shared module (removed ~60 lines of duplicated local helpers).
- **Files changed:** 
  - `lib/stripe-locale.ts` (new)
  - `app/actions/payments.ts`
  - `app/actions/boost.ts`
  - `app/api/payments/setup/route.ts`
  - `app/api/boost/checkout/route.ts`
  - `app/[locale]/(checkout)/_actions/checkout.ts`
  - `app/api/subscriptions/checkout/route.ts` (refactor to use shared helper)
  - `app/api/subscriptions/portal/route.ts` (refactor to use shared helper)
  - `app/actions/subscriptions.ts` (refactor to use shared helper)
- **Done when:** All Stripe redirect URLs return to `/{locale}/...` paths; typecheck + E2E smoke pass; `pnpm build` succeeds.

### Batch notes (2026-01-06)

- **Area:** stripe / locale return URLs
- **Problem:** API routes used for subscription checkout/portal could return users to `/account/plans` without locale.
- **Fix:** Infer locale from request (body/header/referer) and build return URLs as `/{locale}/account/plans`.
- **Done when:** Stripe success/cancel/portal return URLs always include locale; E2E smoke stays green.

- **Area:** business dashboard / orders list payload
- **Problem:** Business orders list fetched `orders.shipping_address` (large JSON) even though the list UI doesn’t read it.
- **Fix:** Stop selecting `shipping_address` in `getBusinessOrders()` and preserve `shipping_address: null` in the mapped object; dedupe `IN (...)` ids to reduce query args.
- **Done when:** Orders list renders unchanged; payload is smaller; typecheck + E2E smoke pass.

#### Phase 2 evidence (data/cost sanity)

- **List endpoints audited (field projection):**
	- `GET /api/products/search` uses explicit select and only joins `profiles(username)`
	- `GET /api/products/feed`, `/api/products/newest`, `/api/products/nearby`, `/api/products/deals` use explicit select strings (no `select('*')`)
- **Business dashboard:** `getBusinessOrders()` no longer fetches `orders.shipping_address` (large JSON) for the list view.
- **No action taken on indexes:** Supabase performance advisors reported INFO-only unused indexes; index changes deferred until post-launch `idx_scan`/EXPLAIN evidence.

## Batch Log entry to copy into tasks.md

Batch name: BE - Supabase advisor snapshot (2026-01-06)
Owner: BE
Scope (1-3 files/features): docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Supabase advisor evidence recorded; dashboard-only warning explicitly deferred
- Next batch can focus on hot-path query + caching audits

Batch name: BE - Fix Stripe API return URLs include locale (2026-01-06)
Owner: BE
Scope (1-3 files/features): app/api/subscriptions/checkout/route.ts, app/api/subscriptions/portal/route.ts, docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Checkout `success_url`/`cancel_url` and billing portal `return_url` include `/{locale}/account/plans`
- Webhook mapping continues to rely on `metadata.plan_id`

Batch name: BE - Slim business orders list payload (2026-01-06)
Owner: BE
Scope (1-3 files/features): lib/auth/business.ts, docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Business orders list no longer fetches `orders.shipping_address`
- Orders list UI behavior unchanged (still receives `shipping_address: null`)

Batch name: BE - Phase 2 complete: data/cost sanity audit (2026-01-06)
Owner: BE
Scope (1-3 files/features): docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Hot-path list views confirmed to use field projection (no `select('*')`)
- At least one concrete payload reduction shipped (business orders list)

Batch name: BE - Next.js caching sanity audit PASS (2026-01-06)
Owner: BE (OPUS)
Scope (1-3 files/features): docs/backend_tasks.md (audit only - no code changes needed)
Risk: none
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` (PASS), `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (15/15 PASS)

Evidence:
- Grep for `'use cache'`: 17 blocks in `lib/data/**`, 4 in `app/api/categories/**`, 1 in `app/[locale]/(sell)/sell/_lib/categories.ts`
- All have `cacheLife('<profile>')` paired with `'use cache'`
- Grep for `revalidateTag(`: ~50 calls in action files, all use 2-arg form with `"max"` profile
- Grep for `createStaticClient`: all cached read modules use `createStaticClient()` (no `createClient()`/`createRouteHandlerClient()` in cached paths)
- Cache profiles defined in `next.config.ts`: categories, products, deals, user

Done when:
- P1 caching sanity task marked complete
- Evidence documented for future reference

## Guardrails (backend)

- Use existing Supabase clients in `lib/supabase/server.ts`; no new client layers.
- RLS policies must rely on `auth.uid()` (not client-provided IDs).
- For cached reads: `createStaticClient()` + `'use cache'` + `cacheLife(...)` + granular `cacheTag()`.
- Keep batches small and always record a Batch Log entry in `tasks.md`.

## P2: Over-engineering cleanup (only after P0/P1 is stable)

- [ ] Refactor `lib/auth/business.ts` into smaller, testable helpers (no behavior changes; keep selects slim)
- [ ] Audit large server action modules for duplication and over-fetching (delete dead paths; no new layers)
