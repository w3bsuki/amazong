# Docs (Start Here)

This repo previously accumulated a lot of planning/audit markdown. For execution, we keep the documentation surface area intentionally small.

## Canonical docs (maintained)

- `docs/PRODUCTION.md` - "last 5%" plan: blockers, go-live gates, ops checklist.
- `docs/ENGINEERING.md` - architecture rules, boundaries, caching + Supabase patterns.
- `docs/DESIGN.md` - UI system rules (Tailwind v4 + shadcn), tokens, motion policy.
- `docs/TESTING.md` - how to run/debug unit + E2E; what counts as "green".
- `docs/README.md` - this index.

Execution checklist: `tasks.md` (repo root).

## Execution workflows (current)

- `docs/workflow.md` - how we run audits, triage, and ship in small verified batches.
- `docs/frontend.md` - frontend audit/refactor reference (best practices + commands).
- `docs/backend.md` - backend audit/refactor reference (best practices + commands).
- `docs/tasks.md` - pointer to the canonical `tasks.md` checklist (prevents drift).
- `docs/frontend_tasks.md` - canonical FE execution queue (what to do next).
- `docs/backend_tasks.md` - canonical BE execution queue (what to do next).

## Working rules (so we actually ship)

- No rewrites / no redesigns. Work in small batches (1-3 files/features).
- Don't touch secrets. Don't log keys/JWTs/full request bodies.
- Every non-trivial batch must pass:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Archive

Older planning/audit markdown is intentionally not kept in this repo to reduce noise. Use Git history if you need to recover something.
