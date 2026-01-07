# Docs (Start Here)

This repo keeps documentation surface area intentionally small.

## Canonical docs (maintained)

### Rules & Architecture
- `docs/ENGINEERING.md` - Architecture rules, boundaries, caching + Supabase patterns
- `docs/DESIGN.md` - UI system rules (Tailwind v4 + shadcn), tokens, motion policy
- `docs/PRODUCTION.md` - "Last 5%" plan: blockers, go-live gates, ops checklist
- `docs/README.md` - This index

### Implementation Guides
- `docs/guides/frontend.md` - Frontend development guide (components, i18n, responsive)
- `docs/guides/backend.md` - Backend development guide (Supabase, caching, actions)
- `docs/guides/styling.md` - Styling guide (Tailwind v4, tokens, patterns)
- `docs/guides/testing.md` - Testing guide (gates, unit tests, E2E)

### Task Queues
- `tasks.md` (repo root) - Canonical execution checklist
- `docs/frontend_tasks.md` - Frontend execution queue
- `docs/backend_tasks.md` - Backend execution queue

## Multi-Agent Workflow (Codex + Opus)

- `docs/GPTVSOPUSFINAL.md` - **START HERE** — Canonical progressive workflow (replaces OPUSvsGPT.md)
- `docs/OPUSvsGPT.md` - _(deprecated)_ — Original v3 workflow, see GPTVSOPUSFINAL.md instead
- `agents.md` (repo root) - Non-negotiable rails for all agents
- `TODO.md` (repo root) - Active tasks + done log

## Working rules (so we actually ship)

- No rewrites / no redesigns. Work in small batches (1-3 files/features).
- Don't touch secrets. Don't log keys/JWTs/full request bodies.
- Every non-trivial batch must pass:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Archive

Older planning/audit markdown is in `docs/archive/`. Use Git history if needed.
