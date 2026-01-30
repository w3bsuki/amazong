---
name: treido-tailwind-v4
description: Tailwind v4 specialist for Treido. Use when styles drift or when pnpm -s styles:gate fails (no gradients/arbitrary/palette colors; tokens only); triggers on "TW4:" prefix.
deprecated: true
---

# Treido Tailwind v4 (Specialist)

> Deprecated (2026-01-29). Use `treido-audit-tw4` (audit) + `treido-impl-frontend` (fixes), coordinated by `treido-orchestrator`.

This is a **specialist lane**: it finds and fixes Tailwind v4 drift, especially token violations.
Default mode is **audit + plan**; implementation is owned by `FRONTEND:` unless explicitly assigned.

## When To Use

- Any request prefixed with `TW4:`.
- `pnpm -s styles:gate` fails.
- UI looks “off” due to spacing/type/color drift.

## Default Scope (Phase 1 Audit)

- `app/[locale]/**`
- `components/**`
- `app/globals.css`, `docs/DESIGN.md`
- Exclude: `node_modules/**`, `.next/**`

## Rails (Treido)

- Tailwind v4 only.
- **No gradients.**
- **No arbitrary values** (`[...]`).
- **No hardcoded colors / palette utilities** (no `bg-slate-900`, no `text-blue-500`, no hex).
- Use semantic tokens (see `docs/DESIGN.md`).

## Phase 1 (AUDIT — console only)

1. Run the gate:

```bash
pnpm -s styles:gate
```

2. If it fails, locate offenders quickly:

```bash
pnpm -s styles:scan:palette
pnpm -s styles:scan:arbitrary
pnpm -s styles:scan:tokens
```

3. (Optional) quick grep for obvious smells:

```bash
rg -n "\\b(bg-gradient-to-|from-|via-|to-)\\b" app components
rg -n "\\[[^\\]]+\\]" app components
```

4. Output task proposals (TW-###), one block per item:

- TW-001 (High) <scope> — <problem -> suggested fix>
  owner: treido-frontend
  deps: <optional FE-... | BE-... | SB-... | AU-...>

Keep it one line unless deps are needed.
Do not edit code. Do not edit `TASKS.md`.

## Fix Heuristics (Treido-safe)

- Replace palette utilities with semantic tokens (e.g. `bg-background`, `text-foreground`, `border-border`, `bg-muted`, etc) **as defined by the project**.
- Replace arbitrary sizes with existing spacing/typography choices already used elsewhere (don’t invent new one-offs).
- Delete gradients instead of “tuning” them (Treido rule).

## Verification (After Any Fix)

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

## References (Load Only If Needed)

- SSOT: `AGENTS.md`, `docs/DESIGN.md`
- Project Tailwind rails: `.codex/skills/treido-frontend/references/tailwind.md`
- Official docs: Tailwind theme (`@theme`) + v4 notes; shadcn Tailwind v4 + theming docs
