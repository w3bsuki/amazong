# DATABASE.md — Database Domain Contract

> Supabase/Postgres rules of engagement: client selection, RLS expectations, migrations, and schema visibility.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever schema/RLS changes |

## Scope

Schema behavior, migrations, RLS, triggers/functions, and how application code should read/write safely.

## Runtime Truth Paths

- `supabase/migrations/**` (schema + RLS + triggers; runtime truth)
- `supabase/functions/**` (edge/serverless functions if used)
- `lib/supabase/server.ts` (server/static/route-handler/admin clients)
- `lib/supabase/client.ts` (browser clients)
- `lib/supabase/shared.ts` (timeout + cookie domain behavior)
- `lib/supabase/database.types.ts` (typed DB contract used throughout app)
- `app/actions/**` (server actions: most DB writes)
- `app/api/**` (route handlers: webhooks + integration endpoints)

## Supabase Client Selection (Non-Negotiable)

| Context | Use | Why |
|--------|-----|-----|
| Server Components / Server Actions (user-specific) | `createClient()` | Reads/writes auth cookies |
| Cached reads (`"use cache"`) | `createStaticClient()` | No cookies; uses fetch without AbortController timeouts (Next cache compatibility) |
| Route handlers (`app/api/*`) | `createRouteHandlerClient(request)` | Uses request cookies; avoids `next/headers` prerender traps |
| Admin/webhooks | `createAdminClient()` | Service role bypasses RLS; only in trusted, verified handlers |

This contract is implemented in `lib/supabase/server.ts`.

## RLS + Service Role Safety

- RLS should be enabled on all user data tables.
- Never ship `SUPABASE_SERVICE_ROLE_KEY` to the client.
- `createAdminClient()` is allowed for:
  - Stripe webhooks (after signature verification)
  - Admin-only server routes (after admin verification)
- If a workflow requires bypassing RLS, document why and keep the surface area minimal.

## Migrations Are Runtime Truth

- Treat `supabase/migrations/**` as the authoritative history of schema changes.
- For DB behavior disputes: follow migrations and RLS policies over prose docs.

## Schema Visibility (Stop Making Agents Read Migrations)

Generate a searchable schema summary:

```bash
node scripts/generate-db-schema.mjs
```

This creates [`docs/generated/db-schema.md`](../generated/db-schema.md) from `supabase/migrations/**`.

## Operational Knobs

- `SUPABASE_FETCH_TIMEOUT_MS` controls fetch timeouts (default 8000ms) via `lib/supabase/shared.ts`.
- `AUTH_COOKIE_DOMAIN` is applied only in production to support cross-subdomain auth cookies.

## Verification

- Docs contract: `pnpm -s docs:check`
- When migrations/RLS change: align with `docs/RISK.md` high-risk pause policy.

## Deep Dive

- Pre-cutover full reference: [`docs/archive/2026-02-doc-reset/pre-cutover-docs/DATABASE.md`](../archive/2026-02-doc-reset/pre-cutover-docs/DATABASE.md)

## See Also

- [`ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`docs/RISK.md`](../RISK.md)
- [`REQUIREMENTS.md`](../../REQUIREMENTS.md)

*Last updated: 2026-02-13*

