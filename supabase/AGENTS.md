# supabase/ — Schema, Migrations, RLS

These rules apply to everything under `supabase/`.

## Non‑negotiables

- Migrations are **append-only** (don’t edit old migrations; add a new one).
- Every table must have RLS enabled with explicit policies.
- Treat schema/auth/payments changes as **pause conditions** (human approval required).

## Tooling

- For schema/RLS work, prefer Supabase MCP tools (ground truth beats guessing).

## See SSOT

- `docs/06-DATABASE.md`
- `docs/13-PRODUCTION-PUSH.md`

