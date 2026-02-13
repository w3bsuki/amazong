# Execution Plans

> First-class planning artifacts versioned alongside code.
> Modeled after OpenAI's Harness Engineering exec-plan pattern.

## Purpose

Complex work that spans multiple sessions, involves cross-cutting concerns, or
requires tracked decision logs lives here as execution plans — not in TASKS.md.

TASKS.md tracks the current sprint queue (≤20 items).
Exec plans track multi-step initiatives with progress, decisions, and outcomes.

## Directory Layout

| Directory | Contents |
|-----------|----------|
| `active/` | Plans currently being executed |
| `completed/` | Finished plans (kept for context and post-mortems) |
| `tech-debt-tracker.md` | Rolling inventory of known tech debt |

## Plan Template

Use this structure for new plans:

```markdown
# EP-{NNN}: {Title}

| Field | Value |
|-------|-------|
| Status | Active / Completed / Paused |
| Owner | {who} |
| Created | {date} |
| Target | {date or milestone} |
| Risk | Low / Medium / High |

## Goal
{1-2 sentences}

## Scope
- Paths / routes / modules affected

## Non-Goals
- What is explicitly excluded

## Decision Log
| Date | Decision | Rationale |
|------|----------|-----------|
| | | |

## Progress
- [ ] Step 1
- [ ] Step 2

## Outcome
{Filled on completion}
```

## Rules

1. One plan per file, named `EP-{NNN}-{slug}.md`.
2. Move to `completed/` when done — do not delete.
3. Update `tech-debt-tracker.md` whenever debt is discovered or resolved.
4. Agents should check `active/` before starting complex work to avoid conflicts.

---

*Last updated: 2026-02-12*
