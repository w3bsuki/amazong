# Backend Audit

## Current State
- Next.js 16 with Cache Components enabled; cache profiles defined for categories, products, deals, user data in `next.config.ts`.
- Middleware entry delegates to `proxy.ts` (i18n routing + geo cookies + Supabase session sync). Matcher excludes API, Next internals, and static assets.
- Supabase used via `@supabase/ssr`; helper clients in `lib/supabase/*` (server, static, route handler, admin). Stripe integration configured but production checklist pending.
- Image optimization: remotePatterns for Unsplash, Supabase, icons, flags, placeholders; `unoptimized` toggled for E2E.
- Bundle analyzer available via `ANALYZE=true`.

## Risks and Drift
- **Cache Components correctness**: potential misuse of `"use cache"` without `cacheLife()`/`cacheTag()`; risk of per-user data in cached functions; missing `generateStaticParams()` on locale/key segments could cause ISR churn.
- **Invalidation**: `revalidateTag()` requires `(tag, profile)`; any single-arg calls will be broken.
- **Middleware side effects**: country defaults to BG; ensure this is acceptable; cookies set for 1 year; need to confirm no leakage of PII and that matchers stay scoped to avoid perf hits.
- **Supabase security**: need confirmation that all writes are RLS-covered; advisor warning about leaked password protection still open; service role never shipped to client.
- **Data fetching**: possible `select('*')` or wide joins; list views may over-fetch; missing projections can inflate payloads and Vercel bandwidth.
- **API/Route handlers**: ensure using `createRouteHandlerClient()` and enforcing auth per route; check that schema validation exists for mutations.
- **Logging/observability**: production compiler removes console except warn/error; need structured logging for critical paths and error boundaries.

## Backend Audit Plan
- **Caching and routing**
  - Audit all cached server functions/components: ensure `'use cache'` + `cacheLife(<profile>)` and `cacheTag()` applied; remove cookies/headers usage inside cached functions.
  - Verify `generateStaticParams()` for `[locale]` and other static segments to reduce ISR writes.
  - Check `revalidateTag()` invocations for two-arg signature.

- **Middleware**
  - Review geo cookie defaults; ensure BG default is intentional and documented.
  - Confirm matchers continue to exclude `_next/static`, `_next/image`, asset paths; add tests for proxy behavior (i18n + geo + session update).
  - Ensure `updateSession` uses `getUser()` for auth checks where needed.

- **Supabase + data layer**
  - Inventory Supabase usage: server components/actions use `createClient`, cached reads use `createStaticClient`, route handlers use `createRouteHandlerClient`, admin limited to internal ops.
  - Confirm RLS coverage for all tables touched; avoid `select('*')`, prefer field projections tailored to views.
  - Add input validation (zod/yup) for mutations; sanitize and clamp pagination and filter parameters.
  - Review stored procedures/RPCs (if any) for security and performance; ensure indexes exist for hot queries.

- **API correctness**
  - Check product/category/search endpoints for pagination, sorting, and cache tags; ensure deal timers respect cache lifetimes.
  - Ensure Stripe webhook handler is idempotent and secured with secrets; verify subscription plan IDs match Supabase `subscription_plans`.

- **Performance and cost**
  - Run bundle analyzer on large pages; lazy-load non-critical charts/visualizations.
  - Avoid deep nested joins; prefer flatter selects and dedicated RPCs for breadcrumbs.
  - Confirm image `deviceSizes` usage is appropriate for responsive breakpoints.

- **Observability and errors**
  - Add server-side error logging around API routes and server actions (structured, no secrets).
  - Surface user-friendly errors on fetch failures; ensure global error/not-found components cover edge cases.

## Acceptance for Backend Cleanup
- All cached functions/components have explicit `cacheLife` + `cacheTag` and no per-user data.
- `generateStaticParams()` present where feasible for locale/key routes.
- Supabase advisors show 0 unresolved security issues; leaked-password protection addressed.
- Mutations validated and RLS-enforced; no `select('*')` in hot paths.
- Middleware behavior covered by tests; matcher continues to skip static assets.
- Stripe/webhook configuration validated end-to-end in the target environment.
