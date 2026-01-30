---
name: treido-shadcn
description: shadcn/ui specialist for Treido. Use when editing components/ui primitives or composition drifts (enforce primitives boundary); triggers on "SHADCN:" prefix.
deprecated: true
---

# Treido shadcn/ui (Specialist)

> Deprecated (2026-01-29). Use `treido-audit-shadcn` (audit) + `treido-impl-frontend` (fixes), coordinated by `treido-orchestrator`.

This is a **specialist lane**: it audits shadcn/ui usage and enforces clean boundaries.
Default mode is **audit + plan**; implementation is owned by `FRONTEND:` unless explicitly assigned.

## When To Use

- Any request prefixed with `SHADCN:`.
- UI drift involving shadcn primitives/components.
- Any changes under `components/ui/**`.

## Default Scope (Phase 1 Audit)

- `components/ui/**`
- `components/shared/**`
- Route-private UI: `app/[locale]/**/_components/**`
- Exclude: `node_modules/**`, `.next/**`

## Non-Negotiables (Treido)

- `components/ui/*` are **primitives only**:
  - no app-specific logic
  - no data fetching (Supabase/Stripe)
  - no imports from `app/**` route code
- Tailwind rails still apply (no gradients/arbitrary/palette colors).

## Phase 1 (AUDIT — console only)

1. Boundary scan (fast heuristics):

```bash
rg -n "from ['\"]@/app/|from ['\"]\\.{1,2}/.*app/" components/ui
rg -n "use client" components/ui
```

2. Identify “primitive got fat” smells:
   - feature branching
   - domain types leaking into `components/ui/*`
   - hooks that depend on app state

3. Output task proposals (SC-###), one block per item:

- SC-001 (High) <scope> — <problem -> suggested fix>
  owner: treido-frontend
  deps: <optional FE-... | BE-... | SB-... | AU-...>

Keep it one line unless deps are needed.
Do not edit code. Do not edit `TASKS.md`.

## Fix Heuristics

- If a `components/ui/*` file needs feature logic, move it into:
  - `components/shared/*` (reusable) or
  - `app/[locale]/(group)/**/_components/*` (route-private)
  and keep the primitive minimal.
- Prefer composition over new primitives; don’t create “mega components”.

## Verification (After Any Fix)

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

## References (Load Only If Needed)

- SSOT: `AGENTS.md`, `docs/DESIGN.md`
- Project shadcn patterns: `.codex/skills/treido-frontend/references/shadcn.md`
- Tailwind rails: `.codex/skills/treido-frontend/references/tailwind.md`
- Official docs: shadcn composition + Tailwind v4 guidance
