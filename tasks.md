# Tasks (Phased Plan)

## Phase 0 - Baseline and audit artifacts
- Record gradient and arbitrary value counts from cleanup scans and link top offenders.
- Inventory "use client" count and identify top 10 candidates for server conversion.
- Verify cache usage patterns: "use cache" + cacheLife + cacheTag, revalidateTag(tag, profile).
- Capture Supabase advisor output (security + performance) and list remaining warnings.

## Phase 1 - Release blockers and security
Frontend
- Localize global error and not-found pages (next-intl keys and locale-aware links).
- Replace embedded dictionaries in shared components with next-intl keys.

Backend
- Unify Stripe return URLs with lib/stripe-locale (payments, boosts, portal).
- Convert route handlers to correct Supabase clients (auth routes -> createRouteHandlerClient, public routes -> createStaticClient).
- Restrict or remove app/api/health/env before production.
- Confirm leaked password protection and any dashboard-only security settings.

## Phase 2 - Caching and data hygiene
- Align lib/api/response-helpers TTLs to next.config.ts cache profiles.
- Narrow cache tags in lib/data to reduce broad invalidation (products, products:list).
- Audit API queries for projection and remove broad selects where possible.
- Review generateStaticParams coverage and keep user-specific pages dynamic.

## Phase 3 - Frontend design system alignment
- Remove gradients (start with components/ui/toast.tsx).
- Replace arbitrary values in top offenders (sidebar, plan cards, auth, checkout).
- Typography and spacing audit on high-traffic pages (home, search, PDP, cart, checkout).

## Phase 4 - Client/server split and provider cleanup
- Split header, product card, filters into server shells with client islands for interactivity.
- Move Supabase IO and data shaping out of providers into lib/* or server actions.
- Reduce total "use client" footprint and document the delta.

## Phase 5 - Test and perf hardening
- Add unit tests for proxy/middleware, stripe-locale, and category attributes.
- Add Playwright coverage for auth, checkout, seller flows.
- Run bundle analyzer on large pages and lazy-load heavy charts where needed.

## Verification defaults
- Minimum: tsc + e2e smoke for non-trivial changes.
- If touching auth/checkout/seller flows: run relevant Playwright specs.
- If touching caching/data: add or update unit tests when practical.
