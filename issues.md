# Issues (Prioritized)

## P0 - Release blockers / security
- Locale-safe payment URLs are not unified; several endpoints build unlocalized return URLs. Files: app/api/boost/checkout/route.ts, app/api/payments/setup/route.ts, app/api/payments/delete/route.ts, app/api/payments/set-default/route.ts, app/api/subscriptions/portal/route.ts.
- Route handlers use createClient instead of createRouteHandlerClient or createStaticClient; cookies may not be applied and public endpoints become dynamic. Files: app/api/subscriptions/checkout/route.ts, app/api/subscriptions/portal/route.ts, app/api/payments/setup/route.ts, app/api/payments/delete/route.ts, app/api/payments/set-default/route.ts, app/api/boost/checkout/route.ts, app/api/wishlist/[token]/route.ts, app/api/categories/attributes/route.ts, app/api/categories/products/route.ts, app/api/badges/feature/[badgeId]/route.ts, app/api/badges/evaluate/route.ts, app/api/sales/export/route.ts.
- Public env health endpoint exposes missing env keys; restrict or remove before launch. File: app/api/health/env/route.ts.
- Hardcoded strings bypass next-intl and locale routing on global pages and shared CTAs. Files: app/global-error.tsx, app/global-not-found.tsx, components/shared/empty-state-cta.tsx.

## P1 - High priority
- Design drift: gradients and arbitrary values remain (13 gradients, 189 arbitrary values). Top offenders: components/ui/toast.tsx, components/layout/sidebar/sidebar.tsx, components/pricing/plan-card.tsx.
- Locale routing inconsistencies: next/link and next/navigation used on localized routes, can generate non-prefixed URLs. Examples: components/shared/*, app/[locale]/(account)/*, components/shared/search/*.
- Client overuse: 199 "use client" files; high-traffic components are client-only. Files: components/layout/header/site-header.tsx, components/shared/product/product-card.tsx, components/sections/tabbed-product-feed.tsx.
- Provider overfetch and heavy client logic: message-context uses select("*") and multiple follow-up queries; cart-context mixes IO and state. Files: components/providers/message-context.tsx, components/providers/cart-context.tsx.
- Cache tag breadth and TTL mismatch: broad tags in lib/data and different TTLs between next.config.ts and lib/api/response-helpers. Files: lib/data/*, lib/api/response-helpers.ts, app/api/categories/route.ts.

## P2 - Medium priority
- Boundary mismatch: components/common is referenced in rules but shared composites are in components/shared; align docs/eslint or folder structure.
- Error/logging standardization: use logger consistently and sanitize logs across API routes.
- API validation gaps: manual JSON parsing in payments/categories/badges endpoints; add zod schemas and consistent error shapes.
- Duplicate auth signout endpoints: app/api/auth/signout/route.ts and app/api/auth/sign-out/route.ts.

## P3 - Nice to have
- Move global error/not-found into localized routing flow or provide locale-aware links.
- Additional tests for middleware/proxy behavior and Stripe edge cases.
