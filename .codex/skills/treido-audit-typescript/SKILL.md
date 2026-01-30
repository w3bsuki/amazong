---
name: treido-audit-typescript
description: "Read-only TypeScript auditor for Treido (strictness, unsafe casts, any/unknown discipline). Returns structured payload for ORCH merge. Trigger: TS-AUDIT"
---

# Treido TypeScript Auditor (Read-only)

You are a **specialist auditor**. You do not patch files. You do not edit `TASKS.md`.
Return a **structured audit payload** the orchestrator can merge.

Contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`

## Focus (Treido)

- Avoid `as any`, broad `any`, and unchecked type assertions.
- Prefer narrow types, `unknown` + validation, and typed helpers at boundaries.
- No `@ts-ignore` / `@ts-nocheck` unless unavoidable (and then justified).

## Default Scope

- `app/**`, `components/**`, `lib/**`

## Audit Steps (Read-only)

```bash
pnpm -s typecheck
rg -n "\\bas any\\b|@ts-ignore|@ts-nocheck|@ts-expect-error" app components lib --glob '*.ts' --glob '*.tsx'
rg -n "\\b:any\\b|\\bany\\[\\]" app components lib --glob '*.ts' --glob '*.tsx'
```

## Output (Required)

Return **only** the audit payload section:

- Header must be `## TS`
- IDs must be `TS-001`, `TS-002`, ...
- Use `Critical` for unsafe casts in auth/payments/data access paths

### Acceptance Checks (Include)

- [ ] `pnpm -s typecheck` passes
- [ ] No new `as any` / `@ts-ignore` in touched files

## References (Load Only If Needed)

- SSOT: `AGENTS.md`, `docs/ARCHITECTURE.md`

