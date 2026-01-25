# Backend Guide (Canonical)

This is the canonical reference for Supabase, caching, server actions, and Stripe/backend work.

Related:
- Boundaries + caching rules: `ENGINEERING.md`
- Production checklist (env/webhooks/advisors): `PRODUCTION.md`
- Verification gates: `TESTING.md`

---

## Supabase clients (pick the right one)

| Client | File | Use |
|--------|------|-----|
| `createClient()` | `lib/supabase/server.ts` | Server Components + Server Actions (cookie-aware) |
| `createStaticClient()` | `lib/supabase/server.ts` | Cached/public reads (no cookies; safe for `'use cache'`) |
| `createRouteHandlerClient()` | `lib/supabase/server.ts` | Route handlers (`app/api/**`) |
| `createAdminClient()` | `lib/supabase/server.ts` | Bypass RLS (server-internal ops only) |
| `createBrowserClient()` | `lib/supabase/client.ts` | Client Components |

Rules:
- Never ship `SUPABASE_SERVICE_ROLE_KEY` to client bundles.
- Prefer `createStaticClient()` for cached/public data fetchers (`lib/data/**`).

---

## RLS (security)

- RLS must be enabled on any table with user data.
- Validate sessions with `getClaims()` / `getUser()` for security-sensitive checks (avoid `getSession()` as the only check).
- Prefer `(select auth.uid())` in RLS policies (evaluates once per query).
- Don’t rely on RLS alone for performance: still project fields and filter aggressively.

Avoid:
- `select('*')` in hot paths.
- Wide joins in list views; use RPCs for complex server-side aggregation when needed.

---

## Caching (Next.js Cache Components)

Patterns used in this repo:
- `cacheLife('<profile>')` + `cacheTag('<tag>')` in cached server fetchers.
- Targeted invalidation via `revalidateTag(tag, profile)` from mutations.

Rules:
- Don’t cache user-specific reads (cookies/headers make output dynamic and defeat caching).
- Keep cache tags granular; don’t invalidate “everything”.

---

## Server Actions

- Route-private actions: `app/[locale]/(group)/**/_actions/**`
- Shared actions: `app/actions/**`

Rules:
- Validate authorization explicitly in the action.
- Return safe error messages; don’t leak internals.
- Invalidate the correct tags/paths after writes.

---

## Stripe (payments)

Baseline rules:
- Verify webhook signatures.
- Make webhook handlers idempotent (events can retry).
- Avoid duplicate handling of the same Stripe event across multiple endpoints.
- Don’t log secrets, customer PII, or full request bodies.
- Webhook secrets may be provided as a comma/newline list for rotation; handlers should try each secret.
- Keep staging/preview on Stripe test keys and production on live keys (envs must be separated).

Production checklist for Stripe (env vars, endpoints, go-live): see `PRODUCTION.md`.
