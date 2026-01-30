---
name: treido-supabase-mcp
description: Treido Supabase work via MCP (schema/migrations, RLS/policies, Storage policies, Auth/session, perf/security advisors, types). Use when you need DB truth or to change SQL/policies; triggers on "SUPABASE:" prefix.
deprecated: true
---

# Treido Supabase (MCP)

> Deprecated (2026-01-29). Use `treido-audit-supabase` (audit) + `treido-impl-backend` (implementation), coordinated by `treido-orchestrator`.

## Workflow (on any `SUPABASE:` request)

1. Identify the change type: schema (DDL), RLS/policies (incl Storage), Auth/session, perf, or debugging.
2. Introspect first (never guess table/column names):
   - `mcp__supabase__list_tables({ schemas: ["public"] })`
   - Use `mcp__supabase__execute_sql({ query })` for diagnostics only (explicit columns + LIMIT; no DDL).
3. If DDL is required:
   - Use `mcp__supabase__apply_migration({ name, query })` (never run DDL via `execute_sql`).
4. If RLS/policies are involved:
   - Ensure RLS is enabled and policies are explicitly scoped (prefer `authenticated` + ownership checks via `auth.uid()`).
   - Storage access control is RLS on `storage.objects`.
5. After changes:
   - `mcp__supabase__get_advisors({ type: "security" })`
   - `mcp__supabase__get_advisors({ type: "performance" })`
   - `mcp__supabase__generate_typescript_types()`
6. Verify (and run any relevant app gates/tests).

## Guardrails

- Never expose service role keys or any private tokens to the client.
- No secrets/PII in logs (redact emails, tokens, headers, cookies, addresses).
- Avoid `select('*')` in hot paths; project fields in application code.
- Prefer migrations for schema changes; keep `execute_sql` diagnostic-only.

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
```

## Handoff signal

End task completion responses with:
- `OPUS: review?` when the change is high-risk (DDL/RLS/auth)
- `DONE (no review needed)` otherwise

## References (load only if needed)

- `supabase/migrations/*` (migrations)
- `supabase/functions/*` (Edge functions)
- `lib/supabase/database.types.ts` (generated types)
- SSOT: `AGENTS.md`, `docs/ARCHITECTURE.md`
