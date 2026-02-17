# Phase 4 — Polish & Completeness

> **Goal:** Route completeness, CSS cleanup, code quality, final metrics. Every page loads fast, looks clean, and the codebase is maintainable.

---

## Agents

| Agent | Scope | File |
|-------|-------|------|
| Agent 1 | Route completeness — loading, metadata, error boundaries | `agent1.md` |
| Agent 2 | CSS & styling cleanup | `agent2.md` |
| Agent 3 | Code quality — oversized files, dead code, tests, i18n | `agent3.md` |

## Dispatch

Spawn **3 subagents**. Each subagent:
1. Reads `refactor/shared-rules.md` first.
2. Reads their `refactor/phase4/agentN.md`.
3. Executes autonomously.

## Scope Boundaries

- Agent 1 owns route-level files: `loading.tsx`, `error.tsx`, `generateMetadata`, layout streaming.
- Agent 2 owns CSS files and Tailwind class usage: `globals.css`, `legacy-vars.css`, `utilities.css`, `shadcn-components.css`, inline styles, `!important`.
- Agent 3 owns code quality: file splitting, commented-out code, TODO/FIXME triage, test health, i18n parity.

## Success Criteria

1. All 3 agents report complete.
2. `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` passes.
3. `pnpm build` succeeds.
4. Run `pnpm -s architecture:scan` — final metrics captured. Compare to Phase 1 baseline.
5. No route missing `loading.tsx`. All user-facing pages have metadata.
