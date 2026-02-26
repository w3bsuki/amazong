# Docs Index

Central map for humans and agents. Use this file to quickly decide what to load, and in what order.

## Session Boot

1. `docs/state/NOW.md`
2. `TASKS.md`
3. `AGENTS.md`
4. Domain-specific docs only (from table below)

## Read By Goal

| Goal | Read |
|---|---|
| Current status and blockers | `docs/state/NOW.md` |
| Execution queue | `TASKS.md` |
| Launch readiness | `docs/launch/CHECKLIST.md`, `docs/launch/TRACKER.md`, `docs/launch/CODEX.md` |
| Strategy direction | `docs/strategy/NORTH-STAR.md`, `docs/strategy/CAPABILITY-MAP.md` |
| Platform architecture | `docs/architecture/TARGET-PLATFORM.md`, `docs/architecture/AI-PLATFORM.md` |
| Stack/runtime patterns | `docs/STACK.md` |
| Testing and verification | `docs/testing.md` |
| Durable technical decisions | `docs/DECISIONS.md` |
| Feature implementation details | `docs/features/*.md` |
| Docs references and mappings | `docs/_meta/doc-owners.json`, `docs/_meta/capability-task-map.json` |
| Docs templates | `docs/templates/*.md` |

## Docs Guidance

- Keep docs concise and operational.
- Update `NOW`, `TASKS`, and `TRACKER/CHECKLIST` together when status changes.
- Prefer explicit evidence links over long narrative.

## Change Rules

1. If task/capability status changes, update `TASKS.md`, `docs/strategy/CAPABILITY-MAP.md`, and `docs/state/NOW.md` in the same session.
2. Log meaningful outcomes in `docs/state/CHANGELOG.md`.
3. For durable directional decisions, append to `docs/DECISIONS.md`.

*Last updated: 2026-02-26*
