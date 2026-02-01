# spec-supabase references (AUDIT-ONLY)

This folder is a deep Supabase (Postgres + RLS + Auth) audit playbook aligned to Treido rails.

## Read Order (Recommended)

1. `decision-tree.md` - quick decision framework for auditing (start here)
2. `rls-patterns.md` - RLS enablement, policy shapes, common bypasses
3. `auth-patterns.md` - Next.js 16 + `@supabase/ssr` client selection, cookie/session hazards (cache components)
4. `query-optimization.md` - projection discipline, joins vs RPC, indexes, avoiding N+1

## Treido SSOT Links

- `.codex/project/ARCHITECTURE.md` - Supabase client selection matrix + performance rules
- `lib/supabase/server.ts` - server/route handler/static/admin clients
- `lib/supabase/client.ts` - browser client singleton

## MCP Inspection (when available)

Recommended read-only MCP checks:
- list tables and confirm RLS is enabled where expected
- list policies and verify predicates (`USING` / `WITH CHECK`)
- security/performance advisors

## Audit Output Contract

Return only:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Use auditor name `SUPABASE` and IDs `SUPABASE-001`, `SUPABASE-002`, ...

