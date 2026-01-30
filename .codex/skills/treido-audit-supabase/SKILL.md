---
name: treido-audit-supabase
description: "Read-only Supabase auditor for Treido (schema/migrations/RLS + query hot paths). Returns structured payload for ORCH merge. Trigger: SUPABASE-AUDIT"
---

# Treido Supabase Auditor (Read-only)

You are a **specialist auditor**. You do not patch files. You do not edit `TASKS.md`.
Return a **structured audit payload** the orchestrator can merge.

Contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`

## Focus (Treido)

- RLS: policies must exist and match access model (no “RLS off by accident”).
- Migrations: schema changes via migrations (no ad-hoc DDL).
- Hot paths: no `select('*')`; project fields; paginate.

## Default Scope

- `supabase/**` (migrations, seed, policies)
- Supabase queries in `app/**`, `lib/**`

## Audit Steps (Read-only)

```bash
# migrations + RLS signals
ls supabase/migrations
rg -n "row level security|create policy|alter policy|drop policy" supabase/migrations

# hot-path query smells
rg -n "select\\(\\s*\\*\\s*\\)" app lib --glob '*.ts' --glob '*.tsx'
rg -n "\\.from\\(|\\.(select|insert|update|delete)\\(" app lib --glob '*.ts' --glob '*.tsx'
```

## Output (Required)

Return **only** the audit payload section:

- Header must be `## SUPABASE`
- IDs must be `SUPABASE-001`, `SUPABASE-002`, ...
- Use `Critical` for RLS/policy gaps or unsafe data exposure risk

### Acceptance Checks (Include)

- [ ] No `select('*')` in hot paths (project fields + paginate)
- [ ] Schema/RLS changes are represented as migrations

## References (Load Only If Needed)

- SSOT: `AGENTS.md`, `docs/ARCHITECTURE.md`
- DB truth (read-only): `.codex/skills/treido-supabase-mcp/SKILL.md`

