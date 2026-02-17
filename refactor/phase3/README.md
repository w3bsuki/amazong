# Phase 3 — Data & Performance

> **Goal:** Optimize data fetching, add caching, eliminate unused dependencies. Server-side data by default. No over-fetching.

---

## Agents

| Agent | Scope | File |
|-------|-------|------|
| Agent 1 | Caching — `"use cache"`, `cacheLife`, `cacheTag` | `agent1.md` |
| Agent 2 | Data layer — queries, client-side fetches, Supabase clients | `agent2.md` |
| Agent 3 | Dependency diet — unused deps, heavy deps, duplicates | `agent3.md` |

## Dispatch

Spawn **3 subagents**. Each subagent:
1. Reads `refactor/shared-rules.md` first.
2. Reads their `refactor/phase3/agentN.md`.
3. Executes autonomously.

## Scope Boundaries

- Agent 1 owns caching directives (`"use cache"`, `cacheLife`, `cacheTag`) in data-fetching functions.
- Agent 2 owns query optimization (`select('*')`, N+1, client→server migration, Supabase client correctness).
- Agent 3 owns `package.json` dependency changes, unused file/export removal via knip, and duplicate code consolidation.

No overlapping scope. Agents work independently.

## Success Criteria

1. All 3 agents report complete.
2. `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` passes.
3. Zero remaining `select('*')` in hot paths.
4. `pnpm build` succeeds — bundle sizes stable or reduced.
5. `pnpm -s knip` reports fewer issues than before.
