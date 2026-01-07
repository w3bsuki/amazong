# Backend Audit (Next.js 16, Supabase, Stripe)

## Snapshot
- Stack: Next.js 16 App Router with Cache Components enabled; cacheLife profiles defined in next.config.ts.
- Data: Supabase Postgres/Auth/Storage via @supabase/ssr helpers (createClient/createStaticClient/createRouteHandlerClient/createAdminClient).
- Payments: Stripe integration present; webhook + checkout/portal routes in app/api/subscriptions/.
- Middleware: middleware.entry.ts delegates to proxy.ts for i18n routing, geo cookie, Supabase session sync; matcher excludes API/Next internals/static.
- Images: remotePatterns set for Unsplash, Supabase storage, flags/icons; unoptimized toggled for E2E.

## Strengths
- Cache Components baseline exists with tagged profiles; remotePatterns constrain image domains.
- Middleware already scopes away static/Next internals; proxy handles locale + session.
- Typecheck + Playwright smoke tasks wired; bundle analyzer available via ANALYZE=true.

## Risks and Drift (What to Audit Deeply)
- Cache correctness: `'use cache'` without matching cacheLife/cacheTag; risk of per-user data in cached functions; missing generateStaticParams for locale/key segments causing ISR churn; revalidateTag must be (tag, profile).
- Supabase security: leaked password protection advisor open; RLS coverage for all writes needs confirmation; ensure createAdminClient not exposed client-side.
- Data hygiene: select('*') or wide joins in hot paths; unclamped pagination/filter params; inconsistent field projections across list/detail queries.
- Middleware side effects: BG geo default may be unintended; cookie duration (1y) and session update frequency should be validated; ensure matcher keeps static exclusions.
- Payments: Stripe currency/price alignment; webhook idempotency; environment variables validated per environment; plan IDs consistent with Supabase records.
- API robustness: route handlers need schema validation and structured error responses; ensure getUser-based auth where required; avoid leaking secrets in logs.
- Observability: limited structured logging for server actions/API routes; need consistent error boundary coverage.

## Audit Tracks
- Caching & Routing
  - Inventory all `'use cache'` functions/components; enforce cacheLife(<profile>) + cacheTag(); remove cookies()/headers() usage inside cached blocks.
  - Verify revalidateTag(tag, profile) signature everywhere.
  - Add generateStaticParams for [locale] and key dynamic segments to cut ISR writes; ensure metadata uses locale-aware values.
  - Confirm middleware matcher excludes _next/static, _next/image, assets; add tests for proxy behavior (i18n + geo + session update).
- Supabase Security & Data
  - Run Supabase security advisors; enable leaked-password protection; document any dashboard-only steps.
  - Validate RLS for all user-facing writes; ensure admin client only used in server-only contexts.
  - Replace select('*') with field projections; clamp pagination/filter inputs; add zod schema validation for mutations and route handlers.
  - Review RPCs/stored procedures if present; ensure indexes exist for hot filters/sorts before any DDL changes.
- Payments & Commerce
  - Audit Stripe checkout/portal/webhook handlers for currency/price consistency; ensure webhook idempotency and signature verification.
  - Ensure plan metadata (plan_id) flows through checkout to subscription persistence; localize return/cancel URLs.
  - Confirm tax/VAT logic aligns with geo defaults and does not get cached per-user.
- Performance & Cost
  - Avoid deep nested joins; prefer flatter selects and dedicated RPCs for breadcrumbs/search facets.
  - Use createStaticClient for cacheable public reads; avoid dynamic cookies in cached contexts.
  - Bundle analyzer for pages with heavy data viz; lazy-load charts.
- Observability & Resilience
  - Add structured server-side logging (redact secrets) around API routes/actions; centralize error responses.
  - Ensure global error/not-found boundaries cover major routes; add retry/backoff for network-bound operations if needed.

## Success Criteria
- All cached paths paired with cacheLife + cacheTag; no per-user data inside cached functions; revalidateTag calls use two args.
- generateStaticParams in place for locales/key dynamic segments; ISR writes reduced; cache tags granular.
- Supabase security advisors cleared; RLS verified; admin client server-only; no select('*') in hot paths; inputs validated and clamped.
- Stripe checkout/webhook flows idempotent, currency-correct, and environment-variable complete.
- Middleware behavior documented and tested; matcher confirmed to skip static assets; BG geo default intentional or adjusted.
- Typecheck + smoke E2E green after fixes; logging in place for critical paths without leaking secrets.
