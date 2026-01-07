# Backend Audit

## Scope
- app/api route handlers
- app/actions server actions
- lib/supabase, lib/data, lib/api, lib/env, middleware/proxy
- Stripe webhooks and payments
- Supabase migrations and RPC usage

## Architecture snapshot
- Next.js 16 with Cache Components enabled (cacheLife profiles in next.config.ts)
- Supabase via @supabase/ssr; client factories in lib/supabase/server.ts
- Stripe integration in lib/stripe.ts and app/api/*/webhook routes
- Middleware: proxy.ts (i18n + geo cookies + session refresh) and lib/supabase/middleware.ts

## Supabase client usage patterns
- createClient(): cookie-aware server usage (actions and some route handlers)
- createStaticClient(): cached/public reads in lib/data and public API routes
- createRouteHandlerClient(): used in a few handlers (auth signout, products/create)
- createAdminClient(): admin pages and webhooks

## Client usage gaps (route handlers)
- These handlers use createClient but should use createRouteHandlerClient (auth) or createStaticClient (public):
  - app/api/subscriptions/checkout/route.ts
  - app/api/subscriptions/portal/route.ts
  - app/api/payments/setup/route.ts
  - app/api/payments/set-default/route.ts
  - app/api/payments/delete/route.ts
  - app/api/boost/checkout/route.ts
  - app/api/wishlist/[token]/route.ts
  - app/api/categories/attributes/route.ts
  - app/api/categories/products/route.ts
  - app/api/badges/feature/[badgeId]/route.ts
  - app/api/badges/evaluate/route.ts
  - app/api/sales/export/route.ts
- Impact: cookie refreshes may not be applied to responses; public routes may become unnecessarily dynamic

## Caching and ISR
- Cache Components enabled; lib/data uses "use cache" with cacheLife + cacheTag
- revalidateTag uses 2-arg form in server actions (verified by grep)
- generateStaticParams exists for many locale pages; review dynamic user-only pages to avoid accidental static rendering
- cache tags in lib/data include broad tags like "products" and "products:list"; consider narrowing to reduce invalidation fanout
- API cache headers are inconsistent: app/api/categories/route.ts sets 1h TTL while lib/api/response-helpers uses 10m for categories; align cache profiles to reduce surprises

## API routes and validation
- Zod validation exists in key routes (app/api/products/create/route.ts), but many payment/category routes parse JSON manually
- lib/api/response-helpers provides cachedJsonResponse and errorResponse but is not used consistently
- Standardize request validation and response shapes for payments, categories, badges, and seller tools

## Stripe and payments
- Stripe client is server-only and uses validated env helpers
- Subscriptions webhook is robust with sanitized logging and idempotency
- Payments and boost checkout routes still build unlocalized URLs with NEXT_PUBLIC_APP_URL or Origin; migrate to lib/stripe-locale helpers to keep locale prefixes
- Currency usage is mixed (EUR for subscriptions, BGN for boosts); confirm product pricing and display consistency

## Security and data access
- Admin pages use createAdminClient and are guarded by requireAdmin in app/[locale]/(admin)/admin/layout.tsx
- Webhooks use admin client; checkout/payments webhooks create admin client at module scope (consider moving inside handlers for consistency)
- app/api/health/env/route.ts exposes missing env keys; should be restricted or removed in production
- RLS should be verified for all tables and RPCs (cart_add_item, cart_set_quantity, get_or_create_conversation, get_total_unread_messages)

## Performance and data shapes
- Most product endpoints use explicit field projection and pagination helpers (good)
- Some flows still use broad selects (products/create uses select("*", { count: 'exact', head: true }); message-context uses select("*") on conversations)
- Prefer slimmer selects and shared view models to reduce payloads and Vercel transfer

## Observability and error handling
- Console logging is used widely; logger helper exists but is not consistently used
- Stripe webhooks sanitize logs; other routes log full error objects (no secrets, but noisy)
- Consider centralizing error logging and response helpers for consistency

## Backend improvement targets
- Align route handlers with correct Supabase client and caching strategy
- Unify cache TTL profiles between next.config.ts and lib/api/response-helpers
- Standardize request validation (zod) for payment and category endpoints
- Harden env exposure and protect health checks
- Reduce overfetch and broad selects in API routes and client providers
