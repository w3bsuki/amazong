# API.md — API Domain Contract

> How Treido exposes behavior: Server Actions (internal) and Route Handlers (integrations/webhooks/public endpoints).

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever API surface changes |

## Scope

Server actions and route handlers exposed to UI clients or external integrations, plus the validation/response conventions that keep them safe.

## Runtime Truth Paths

- `app/actions/**` (server actions; primary internal mutation surface)
- `app/api/**` (route handlers; webhooks + public endpoints)
- `lib/api/envelope.ts` (server action result envelopes)
- `lib/api/response-helpers.ts` (API response caching helpers)
- `lib/validation/**` (Zod schemas used at boundaries)

## Quick Reference

| Problem | Prefer | Why |
|--------|--------|-----|
| UI mutation (same-origin) | Server action (`app/actions/**`) + `Envelope` | Typed, auth-friendly, simpler UI wiring |
| Integration callback | Route handler (`app/api/**`) | Stable URL surface; explicit request verification |
| Cacheable GET | `cachedJsonResponse(...)` | CDN headers aligned to cache profiles |
| Private/user GET | `noStoreJson(...)` | Prevents accidental caching of user data |

## Server Actions vs Route Handlers

### Use Server Actions When

- UI calls are same-origin and you want typed, prop-driven mutations.
- You need access to user cookies via `createClient()` (`lib/supabase/server.ts`).
- You want a consistent return shape (`Envelope`) for UI handling.

### Use Route Handlers When

- You need an integration endpoint (Stripe webhooks, upload endpoints).
- You need custom cache headers for GET endpoints.
- You need a stable URL surface for clients/tools (not bound to RSC).

## Response Conventions

- Server actions should return `Envelope` from `lib/api/envelope.ts` (`success: true|false`).
- Route handlers should prefer:
  - `cachedJsonResponse(...)` for cacheable GET endpoints (CDN-friendly)
  - `noStoreJson(...)` for user-specific data (never cache)

## Validation Rules

- Validate at the boundary using Zod (inputs to actions, webhook metadata, query params).
- Prefer `safeParse()` and return user-safe errors; don’t leak raw error objects to UI.

## Auth Rules (API Surfaces)

- Route handlers should use `createRouteHandlerClient(request)` to read cookies.
- Server actions should use `requireAuth()` / `requireAuthOrFail()` from `lib/auth/require-auth.ts`.
- For security checks, use `supabase.auth.getUser()` (not `getSession()`).

## Common Gotchas

- Don’t return raw `Error` objects (or full caught values) to the client; return a user-safe string envelope.
- Don’t cache user-specific data. If an endpoint depends on cookies/auth, it must be no-store.
- Webhooks must verify signatures before DB writes; use `createAdminClient()` only after verification.

## Verification

- Baseline: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate`
- When changing actions/routes: `pnpm -s test:unit` (and E2E if user flows change)

## Deep Dive

- Pre-cutover full reference: [`docs/archive/2026-02-doc-reset/pre-cutover-docs/API.md`](../archive/2026-02-doc-reset/pre-cutover-docs/API.md)

## See Also

- [`ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`docs/QA.md`](../QA.md)
- [`REQUIREMENTS.md`](../../REQUIREMENTS.md)

*Last updated: 2026-02-13*

