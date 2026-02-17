# /refactor/ — Codex CLI Orchestration Hub

> **Purpose:** Phased refactoring orchestration for the Treido codebase.
> **Executor:** Codex CLI (autonomous, spawns subagents per phase).
> **Planner:** Copilot (Opus) + Human — designs phases, reviews results.

---

## How This Folder Works

```
refactor/
  AGENTS.md          ← You are here. Read this first.
  shared-rules.md    ← Common rules ALL agents must follow. Read before any phase.
  tasks.md           ← Cross-phase progress tracker. Update after each phase.
  phase1/
    README.md        ← Phase overview: goal, agents, dispatch, success criteria.
    agent1.md        ← Self-contained task for subagent 1.
    agent2.md        ← Self-contained task for subagent 2.
    agent3.md        ← Self-contained task for subagent 3.
  phase2/            ← Created after Phase 1 completes.
  phase3/            ← Created after Phase 2 completes.
  phase4/            ← Created after Phase 3 completes.
```

**Phases run sequentially.** Never start Phase N+1 until Phase N is verified and `tasks.md` updated.

**Agents within a phase run in parallel.** Each agent gets its own subagent with fresh context.

---

## Execution Protocol

### Starting a Phase

1. Read this file (`refactor/AGENTS.md`).
2. Read `refactor/shared-rules.md` — internalize the rules.
3. Read `refactor/tasks.md` — find the current phase (first unchecked).
4. Read `refactor/phaseN/README.md` — understand goal, agents, success criteria.
5. Spawn N subagents. Each subagent receives:
   - `refactor/shared-rules.md` (read first)
   - `refactor/phaseN/agentX.md` (their specific task)
   - Instruction: "Read shared-rules.md first, then execute your agent task."

### During Execution

- Each subagent works independently on its scoped folder tree.
- Subagents verify after every change: `pnpm -s typecheck`
- Subagents verify after each folder: `pnpm -s typecheck && pnpm -s lint`
- If a subagent hits a conflict with another agent's scope — flag it, don't fix it.

### Completing a Phase

1. All subagents report done.
2. Run full verification:
   ```bash
   pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
   ```
3. Run metrics: `pnpm -s architecture:scan`
4. Update `refactor/tasks.md` — check off agents + record metrics.
5. Stop. Human + Copilot review results before Phase N+1 is created.

---

## Project Context

For full project identity, conventions, stack info, component map:
→ Read the root `AGENTS.md` (project root, not this file).

For existing refactor history, known bloat signals, session logs:
→ Read `REFACTOR.md` (project root). This is read-only reference — don't update its progress tracker.

---

## Phase Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **Phase 1** | Discovery Audit — folder-tree ownership, find waste | Ready |
| **Phase 2** | Client Boundary & Bundle — "use client" reduction, dynamic imports | Ready |
| **Phase 3** | Data & Performance — caching, server-side data, dep diet | Ready |
| **Phase 4** | Polish — route completeness, CSS, code quality, final metrics | Ready |

All phases have detailed agent files ready. Execute sequentially — verify each phase before starting the next.
