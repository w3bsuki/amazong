---
name: supabase-audit
description: Supabase RLS/perf audit. Triggers on "SUPABASE:" prefix.
---

# Supabase Audit Skill

## On "SUPABASE:" Prompt

1. Run security advisors: `mcp_supabase_get_advisors({ type: "security" })`
2. Run performance advisors: `mcp_supabase_get_advisors({ type: "performance" })`
3. List tables and check for missing RLS
4. Check for `select('*')` in `lib/data/*.ts`
5. Output findings in Phase 1 Audit format

## MCP Commands

```
mcp_supabase_get_advisors({ type: "security" })
mcp_supabase_get_advisors({ type: "performance" })
mcp_supabase_list_tables({ schemas: ["public"] })
mcp_supabase_list_extensions()
mcp_supabase_list_migrations()
mcp_supabase_execute_sql({ query: "SELECT tablename FROM pg_tables WHERE schemaname='public'" })
```

## Anti-Patterns to Flag

- Tables without RLS policies
- `select('*')` in hot paths
- Missing indexes on foreign keys
- Secrets in client-accessible queries
- Wide joins without field projection

## Output Format

```markdown
## Supabase Lane Phase 1 Audit — {date}

### Critical (blocks Phase 2)
- [ ] Issue → Table/File → Fix

### High (do in Phase 2)
- [ ] Issue → Table/File → Fix

### Deferred (Phase 3 or backlog)
- [ ] Issue → Table/File → Fix
```

## When to Run Advisors

Per CODEX decision: Run on any task touching:
- `supabase/` directory
- `lib/supabase/**` files
- SQL/migrations
- Query shapes in `lib/data/`

Day 0 always runs security advisors.

## Gates

After any fix:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Docs

| Topic | File |
|-------|------|
| Backend guide | `docs/BACKEND.md` |
| Engineering | `docs/ENGINEERING.md` |
| Supabase patterns | `lib/supabase/` |

## Examples

### Example prompt
`SUPABASE: audit RLS coverage for orders`

### Expected behavior
- Run advisors, check tables for RLS, and scan for `select('*')`.
- Report findings using the Phase 1 audit format.
