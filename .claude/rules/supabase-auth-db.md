---
paths: lib/supabase*.ts, app/**/auth/**/*.{ts,tsx}, supabase/**/*
---

# Supabase (Auth + DB)

## Non-negotiables

- Keep privileged operations on the server
- Assume RLS is enabled; design reads/writes accordingly
- Use SSR-friendly patterns (`@supabase/ssr`)
- Don't commit secrets; env vars at runtime only

## Where to Look

- Auth/callbacks: `app/**/auth/` or `app/**/route.ts`
- Server actions: `app/[locale]/actions/` and route-local `_actions/`
- Shared clients/utilities: `lib/`
- Supabase config/SQL: `supabase/`

## Workflow

1. **Identify context**:
   - Browser/client → client-safe Supabase client
   - Server component/route handler/action → SSR/server-side patterns

2. **Verify env vars** referenced correctly (never commit secrets)

3. **Debugging auth**:
   - Trace redirect/callback route
   - Confirm cookies/session handling is server-compatible

4. **Debugging data access**:
   - Check query shape
   - Empty results? Suspect RLS, missing session, wrong user/role
   - Use RPC (Postgres functions) for complex joins to avoid N+1

## Verification

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- E2E (if auth flow changed): `pnpm test:e2e`

## Trigger Prompts

- "Fix Supabase auth callback handling"
- "Add a server action that reads/writes Supabase tables"
- "Debug why a query returns empty for logged-in users"
