# WORKFLOW.md — Treido SSOT and Execution Flow

This file defines which document is authoritative for each kind of work.

## SSOT Matrix

| Need | Canonical file | Notes |
|------|----------------|-------|
| Active refactor queue, progress, current task | `refactor/CURRENT.md` | Authoritative for domain order and checkboxes |
| Refactor loop protocol | `refactor/autopilot.md` | Domain-by-domain execution contract |
| Refactor guardrails | `refactor/shared-rules.md` | Safety rules and boundaries |
| Refactor history | `refactor/log.md` | Append-only execution history |
| Program-level batch framing | `refactor/PROGRAM.md` | Batch state and baseline snapshots |
| Product scope and launch criteria | `docs/PRD.md` | Product SSOT for V1 goals |
| Stack conventions and security constraints | `docs/STACK.md` | Engineering SSOT (clients, auth, webhooks, i18n) |
| UI/UX contract | `docs/DESIGN.md` | Styling/layout behavior contract |
| Architectural decisions (why) | `docs/DECISIONS.md` | Append-only decision log |
| Feature-level implementation map | `docs/features/*.md` + `docs/FEATURE-MAP.md` | Feature behavior and ownership map |
| Launch blockers and readiness | `TASKS.md` | Launch checklist SSOT, not refactor queue |
| Quality gate commands and interpretation | `docs/GATES.md` | Gate runbook and failure policy |

## Conflict Policy

If `TASKS.md` and `refactor/CURRENT.md` differ on refactor status:
- treat `refactor/CURRENT.md` as authoritative for refactor execution
- treat `TASKS.md` as authoritative for launch-readiness tracking

## Session Execution Order

1. Read `AGENTS.md`.
2. Read `refactor/CURRENT.md` + linked domain task.
3. Read `refactor/shared-rules.md`.
4. Execute audit/refactor loop from `refactor/autopilot.md`.
5. Run gates from `docs/GATES.md`.
6. Update `refactor/CURRENT.md` metrics + checkbox.
7. Append `refactor/log.md`.

## Update Cadence

- `refactor/CURRENT.md`: every completed domain or checkpoint.
- `refactor/log.md`: every execution session.
- `refactor/PROGRAM.md`: when baseline/snapshot changes materially.
- `docs/GATES.md`: whenever scripts/commands/gate behavior change.
- `docs/FEATURE-MAP.md`: when routes/components for a documented feature change.

*Last updated: 2026-02-18*
