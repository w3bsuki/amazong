# Phase 1 — Discovery Audit

> **Goal:** Full folder-tree audit. Each agent owns a directory tree. Find waste, fix safe issues, flag risky ones.

---

## Agents

| Agent | Scope | File |
|-------|-------|------|
| Agent 1 | `components/` (all subdirs) | `agent1.md` |
| Agent 2 | `lib/` + `hooks/` | `agent2.md` |
| Agent 3 | `app/` (routes, actions, api, locale components) | `agent3.md` |

## Dispatch

Spawn **3 subagents**. Each subagent:
1. Reads `refactor/shared-rules.md` first (mandatory — contains verification commands and rules).
2. Reads their `refactor/phase1/agentN.md` (their specific scope and objectives).
3. Executes autonomously. Fixes safe issues. Flags risky ones.
4. Runs verification after each folder: `pnpm -s typecheck && pnpm -s lint`

Agents work **independently**. If an agent discovers something in another agent's scope, they note it in their report — they don't fix it.

## Scope Boundaries

- Agent 1 owns `components/**` — nobody else touches components.
- Agent 2 owns `lib/**` and `hooks/**` — nobody else touches lib or hooks.
- Agent 3 owns `app/**` — nobody else touches app routes, actions, or api.

If Agent 3 finds a component in `app/` that should move to `components/`, they flag it — Agent 1 doesn't move it (it's in Agent 3's scope). Cross-scope moves happen in a cleanup pass after all agents finish.

## Success Criteria

1. All 3 agents report complete.
2. Full verification passes:
   ```bash
   pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
   ```
3. `pnpm -s architecture:scan` shows improvement over baseline:
   - Baseline: 762 files, 357 `"use client"`, 125 >300-line files, 247 clones (3.06%)
4. `refactor/tasks.md` updated with agent statuses + post-phase metrics.

## After Phase 1

- Human + Copilot review results and flagged items.
- Phase 2 agent files designed based on Phase 1 findings.
- Cross-scope issues (flagged by agents) resolved in Phase 2 or a dedicated cleanup pass.
