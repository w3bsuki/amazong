# Phase 2 — Client Boundary & Bundle Optimization

> **Goal:** Reduce client-side JavaScript. Every component is a Server Component unless it genuinely needs interactivity. Heavy components are lazy-loaded.

---

## Agents

| Agent | Scope | File |
|-------|-------|------|
| Agent 1 | `"use client"` audit on `components/` | `agent1.md` |
| Agent 2 | `"use client"` audit on `app/` | `agent2.md` |
| Agent 3 | Dynamic imports + bundle optimization | `agent3.md` |

## Dispatch

Spawn **3 subagents**. Each subagent:
1. Reads `refactor/shared-rules.md` first.
2. Reads their `refactor/phase2/agentN.md`.
3. Executes autonomously.

## Scope Boundaries

- Agent 1 owns `"use client"` changes in `components/**`.
- Agent 2 owns `"use client"` changes in `app/**`.
- Agent 3 owns `next/dynamic` additions, `next.config.ts` optimizations, and bundle-related changes anywhere.

Agent 3 may need to wrap imports in files that Agent 1 or 2 modified. That's fine — Agent 3 runs after Agents 1+2 finish, or coordinates by only adding dynamic wrappers at the import site (pages/layouts), not modifying the component files themselves.

## Success Criteria

1. All 3 agents report complete.
2. `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` passes.
3. `"use client"` count measurably reduced from Phase 1 baseline.
4. `pnpm build` succeeds — no increase in First Load JS per route.
