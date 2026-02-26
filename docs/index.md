# Docs Index — AI Load Router

This is the canonical map for docs loading order and scope. Use it to keep context small and useful.

## 60-Second Boot Order

1. `AGENTS.md` (execution contract)
2. `docs/state/NOW.md` (current truth)
3. `TASKS.md` (active queue only)
4. Load only task-relevant docs from the table below

## Read By Task

| If you are working on | Read |
|---|---|
| Current focus, blockers, active constraints | `docs/state/NOW.md` |
| What to execute now | `TASKS.md` |
| Recent outcomes and evidence | `docs/state/CHANGELOG.md` |
| Product direction and priorities | `docs/strategy/NORTH-STAR.md`, `docs/strategy/CAPABILITY-MAP.md` |
| Architecture decisions and contracts | `docs/architecture/TARGET-PLATFORM.md`, `docs/architecture/AI-PLATFORM.md` |
| Runtime/framework patterns | `docs/STACK.md` |
| UI contracts and styling guardrails | `designs/ui-ux-dream-weaver/UI_UX_GUIDE.md`, `docs/DESIGN.md` |
| Database patterns and Supabase usage | `docs/database.md` |
| Test strategy and conventions | `docs/testing.md` |
| Launch checklist/tracker work | `docs/launch/CHECKLIST.md`, `docs/launch/TRACKER.md`, `docs/launch/CODEX.md` |
| Feature-level implementation | `docs/features/*.md` |
| Durable rationale ("why") | `docs/DECISIONS.md` |

## Keep Context Small

- Default to the boot docs + one or two domain docs.
- Do not load launch audits, business docs, or large generated references unless task-relevant.
- Use `TASKS.archive.md` only for historical context.

## Source-of-Truth Rules

- Active execution queue: `TASKS.md`
- Historical queue/log dump: `TASKS.archive.md`
- Current operational truth: `docs/state/NOW.md`
- Durable outcomes: `docs/state/CHANGELOG.md`
- Durable decisions: `docs/DECISIONS.md`

## Docs Quality Contract

Docs should optimize execution, not ceremony:

- Minimize duplicated status across files.
- Prefer short, checkable statements over narrative.
- Encode critical invariants as gates/tests where possible.

*Last updated: 2026-02-26*
