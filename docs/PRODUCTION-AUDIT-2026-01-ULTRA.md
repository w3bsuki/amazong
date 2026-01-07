# Production Readiness Audit (Top 10)

Generated: 2026-01-07
Scope: Infra/caching/Supabase/tooling gaps not covered in PRODUCTION-AUDIT-2026-01.

## Top Issues

1) Middleware writes geo cookies on every page view
- Evidence: [proxy.ts](proxy.ts) sets `user-country`/`user-zone` for all routed requests and always mutates the response, even for public cached pages.
- Risk: Forces all HTML responses through middleware (no static CDN caching), adds cookie bytes to every request, and cookies are set without `secure`/`httpOnly` flags.
- Action: Only set geo cookies on pages that need them (e.g., when user opts into shipping filter), gate behind `request.geo`/header presence, add `secure: true` and consider `httpOnly`, or move detection to a client action/route handler.

2) Stripe checkout webhook instantiates service-role client at module scope
- Evidence: [app/api/checkout/webhook/route.ts](app/api/checkout/webhook/route.ts) creates `createAdminClient()` once at import time.
- Risk: Build/dev crashes when `SUPABASE_SERVICE_ROLE_KEY` is absent; reuses a long-lived service-role client across requests, increasing blast radius if leaked.
- Action: Construct the admin client inside `POST` after signature verification, guard when key is missing (return 500 + alert), and keep runtime on Node.

3) Checkout webhook swallows database failures
- Evidence: [app/api/checkout/webhook/route.ts](app/api/checkout/webhook/route.ts) returns 200 even when Supabase inserts fail, intentionally suppressing Stripe retries.
- Risk: Orders/line items silently drop with no retry/backfill; revenue/accounting drift with no alerting.
- Action: After signature verification, return 5xx on write failures or enqueue to a DLQ/queue; add structured logging and alerting for failed writes.

4) Category listing path is fully dynamic and bypasses cache
- Evidence: [app/[locale]/(main)/categories/[slug]/page.tsx](app/%5Blocale%5D/(main)/categories/%5Bslug%5D/page.tsx) calls `cookies()` for shipping zone and runs Supabase queries per request.
- Risk: No ISR/caching for public category pages; every visit hits Supabase with two queries (count + rows) and translations, driving DB and edge costs.
- Action: Move shipping zone to an explicit query param + route handler with `cacheTag/cacheLife`, cache per (slug, zone, filters) payload, and let the page consume cached data.

5) Category search doubles Supabase load per request
- Evidence: [app/[locale]/(main)/categories/[slug]/_lib/search-products.ts](app/%5Blocale%5D/(main)/categories/%5Bslug%5D/_lib/search-products.ts) always runs both `count` (planned) and `rows` queries with no caching layer.
- Risk: Each page view issues two queries; under traffic this multiplies Supabase reads even when filters repeat.
- Action: Wrap search in a cached server function keyed by (slug, filters, page, zone) with `cacheTag('products:list', ...)` + `cacheLife('products')`; fall back to uncached only when auth-specific filters are present.

6) Cache invalidation is overly broad
- Evidence: Multiple actions call `revalidateTag("profiles", "max")` (e.g., [app/actions/profile.ts](app/actions/profile.ts), [app/actions/subscriptions.ts](app/actions/subscriptions.ts)) and `revalidateTag('orders', 'max')` ([app/actions/orders.ts](app/actions/orders.ts)).
- Risk: Single profile/order changes flush all cached profile/order data, causing revalidation storms and ISR writes far beyond the touched entity.
- Action: Revalidate per-entity tags (`profile-${id}`, `profile-${username}`, `orders-${userId}`) and keep the broad tag only for rare schema-wide changes.

7) .refactor-workspace is typechecked and bundled
- Evidence: [tsconfig.json](tsconfig.json) includes `**/*.ts`/`**/*.tsx` without excluding `.refactor-workspace/`.
- Risk: Duplicate code is typechecked/bundled, slowing CI and risking stale copies leaking into builds via path aliases.
- Action: Exclude `.refactor-workspace/**` (and any scratch dirs) in tsconfig/eslint/knip to shrink the surface area.

8) CI scripts skip typecheck/lint gates
- Evidence: [package.json](package.json) `test` runs unit+smoke only; `test:ci` runs unit+build+playwright but not `pnpm typecheck` or `pnpm lint`.
- Risk: Typed regressions or lint violations can ship if only test pipelines run; build does not run full TS typecheck.
- Action: Add `pnpm -s exec tsc --noEmit` and `pnpm lint` to CI (or a gating task) and fail fast before e2e.

9) Admin/service-role usage has no environment fallback
- Evidence: [lib/auth/admin.ts](lib/auth/admin.ts) and [app/[locale]/(admin)/admin/page.tsx](app/%5Blocale%5D/(admin)/admin/page.tsx) rely on `createAdminClient()` without guarding missing service keys.
- Risk: Local/E2E runs without service key crash; prod rollout depends on a single env var with no soft fallback or telemetry.
- Action: Add a defensive check that surfaces a clear error page for admins when the service key is missing, and keep non-admin surfaces functional.

10) Geo cookies lack security flags
- Evidence: [proxy.ts](proxy.ts) sets `user-country`/`user-zone` cookies with only `path`/`sameSite`.
- Risk: Cookies are exposed to client JS and sent over HTTP in dev/prod without `secure`; potential tracking surface and weaker transport security.
- Action: Add `secure: process.env.NODE_ENV === 'production'` and `httpOnly` where possible; consider short-lived cookies or moving to header-based detection.

## Verification Gates (post-fix)
- pnpm -s exec tsc -p tsconfig.json --noEmit
- REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
- For webhook changes: replay Stripe test events and verify Supabase writes + cache revalidation
