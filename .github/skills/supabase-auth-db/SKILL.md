---
name: supabase-auth-db
description: Implement or debug Supabase integration in this repo (Auth, SSR, DB access patterns, RLS expectations, env vars). Use when editing auth flows, server actions/route handlers that touch Supabase, or when investigating missing/unauthorized data.
---

# Supabase (Auth + DB) in this repo

## Non-negotiables

- Keep privileged operations on the server.
- Assume RLS is enabled/expected; design reads/writes accordingly.
- Prefer SSR-friendly patterns (this repo depends on `@supabase/ssr`).
- Don’t commit secrets; confirm env vars are read from runtime.

## Where to look

- Auth and callbacks are typically in `app/**/auth/` or `app/**/route.ts`.
- Server actions: `app/[locale]/actions/` and/or route-local `_actions/`.
- Shared clients/utilities: `lib/`.
- Supabase project/config/SQL artifacts: `supabase/`.

## Workflow

1. Identify context:
   - Browser/client component use-case → use a client-safe Supabase client.
   - Server component / route handler / server action → use SSR/server-side patterns.

2. Verify environment variables are referenced correctly (never commit secrets).

3. When debugging auth issues:
   - Trace the redirect/callback route.
   - Confirm cookies/session handling is server-compatible.

4. When debugging data access:
   - Check the query shape.
   - If results are unexpectedly empty, suspect RLS, missing session, or wrong user/role.
   - Prefer RPC (Postgres functions) for complex joins where it prevents N+1 patterns.

## Verification

- Typecheck (when requested or before you call the task done): `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- E2E if auth flow is changed: `pnpm test:e2e`

## Examples

- “Fix Supabase auth callback handling.”
- “Add a server action that reads/writes Supabase tables.”
- “Debug why a query returns empty for logged-in users.”
