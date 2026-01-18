# Refactor Audit — Track B (Backend/Data) — 2026-01-18

## Scope
- app/actions, app/api, lib (server utilities), supabase/

## Findings

1) [Medium] Duplicate subscription checkout logic (action vs API route)
- Evidence:
  - [app/actions/subscriptions.ts](app/actions/subscriptions.ts#L196)
  - [app/api/subscriptions/checkout/route.ts](app/api/subscriptions/checkout/route.ts#L133-L135)
- Fix direction: extract a shared checkout builder (e.g., `lib/stripe/subscriptions`) and reuse from both action and route to reduce drift.

2) [Low] Admin Supabase client instantiated at module scope in webhook route
- Evidence: [app/api/checkout/webhook/route.ts](app/api/checkout/webhook/route.ts#L8)
- Fix direction: instantiate inside `POST` after signature verification to avoid accidental early use and keep per-request context.

3) [Medium] Public badge endpoint uses static client + public caching
- Evidence:
  - [app/api/badges/[userId]/route.ts](app/api/badges/%5BuserId%5D/route.ts#L2)
  - [app/api/badges/[userId]/route.ts](app/api/badges/%5BuserId%5D/route.ts#L33-L37)
  - [app/api/badges/[userId]/route.ts](app/api/badges/%5BuserId%5D/route.ts#L48)
  - [app/api/badges/[userId]/route.ts](app/api/badges/%5BuserId%5D/route.ts#L56)
- Fix direction: confirm strict RLS on `user_badges` and consider narrowing fields or requiring auth for non-public data.

4) [Medium] SECURITY DEFINER functions in migrations (RLS bypass surface)
- Evidence: [supabase/migrations/20260103000000_fix_handle_new_user_account_type.sql](supabase/migrations/20260103000000_fix_handle_new_user_account_type.sql#L6)
- Fix direction: verify ownership, `search_path`, and GRANT scope for each SECURITY DEFINER function; document which roles can execute.

5) [Low] Hardcoded localhost fallback in subscription action
- Evidence: [app/actions/subscriptions.ts](app/actions/subscriptions.ts#L62)
- Fix direction: require `NEXT_PUBLIC_APP_URL` in production and fail fast if missing to avoid incorrect redirect URLs.
