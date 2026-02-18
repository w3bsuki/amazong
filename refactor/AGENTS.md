# /refactor/ — Refactor Orchestration

> **Start here:** Read `CURRENT.md` — it tells you your task and the current state.
> **Rules:** Read `shared-rules.md` before any refactor work.

---

## How This System Works

```
refactor/
  CURRENT.md       ← YOUR STARTING POINT. Active task + metrics + session protocol.
  shared-rules.md  ← Mandatory rules. Read before every task.
  log.md           ← Session history (append-only). Read when resuming.
  tasks.md         ← Progress tracker with metrics over time.
  phase3/          ← Phase 3 tasks (Data & Performance)
    agent1.md      → Caching ("use cache", cacheLife, cacheTag)
    agent2.md      → Data layer (queries, client→server, Supabase clients)
    agent3.md      → Dependency diet (knip, unused deps, heavy deps)
  phase4/          ← Phase 4 tasks (Polish & Completeness)
    agent1.md      → Route completeness (loading, metadata, error)
    agent2.md      → CSS & styling cleanup
    agent3.md      → Code quality (file splitting, dead code, tests, i18n)
  phase1/          ← Phase 1 (completed) — Discovery Audit
  phase2/          ← Phase 2 (completed) — Client Boundary & Bundle
```

**One session = one task.** Pick the first unchecked task in CURRENT.md. Execute it. Update CURRENT.md. Append to log.md.

---

## Roles

| Role | Who | Does |
|------|-----|------|
| **Orchestrator** | Copilot (Opus) + Human | Plans phases, reviews results, updates CURRENT.md between phases |
| **Executor** | Codex CLI | Reads CURRENT.md, executes one task per session, updates progress |

---

## Project Identity

For stack, conventions, rules → Read root `AGENTS.md` (auto-loaded by Codex).
For full refactor knowledge base → Read root `REFACTOR.md` (reference-only, 810 lines).
