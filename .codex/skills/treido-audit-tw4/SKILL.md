---
name: treido-audit-tw4
description: "Read-only Tailwind v4 auditor for Treido (tokens + forbidden patterns). Returns structured payload for ORCH merge. Trigger: TW4-AUDIT"
---

# Treido TW4 Auditor (Read-only)

You are a **specialist auditor**. You do not patch files. You do not edit `TASKS.md`.
You return a **structured audit payload** that the orchestrator can merge.

Contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`

## When To Use

- Requests about styling drift, mobile styling, inconsistent spacing/type.
- `pnpm -s styles:gate` fails.
- Orchestrator spawns the UI bundle.

## Rails (Treido Tailwind v4)

- Tailwind **v4 only**.
- **No gradients**.
- **No arbitrary values** (`[...]`).
- **No hardcoded colors / palette utilities** (no `bg-slate-900`, no `text-blue-500`, no hex).
- Use **semantic tokens** as defined by the project (`docs/DESIGN.md`).

## Default Scope

- `app/**` (especially `app/[locale]/**`)
- `components/**`
- `app/globals.css`
- Exclude: `node_modules/**`, `.next/**`

## Audit Steps (Read-only)

1. Run the style gate (fast signal):

```bash
pnpm -s styles:gate
```

2. If the repo has scanners, use them:

```bash
pnpm -s styles:scan:palette
pnpm -s styles:scan:arbitrary
pnpm -s styles:scan:tokens
```

3. Quick heuristics (optional):

```bash
rg -n "\\b(bg-gradient-to-|from-|via-|to-)\\b" app components
rg -n "\\[[^\\]]+\\]" app components
rg -n "\\b(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b" app components
```

## Output (Required)

Return **only** the audit payload section:

- Header must be `## TW4`
- IDs must be `TW4-001`, `TW4-002`, ...
- Use `Critical` if `styles:gate` fails or if violations are widespread; otherwise `High/Medium/Low`
- Keep fixes minimal and token-compliant (do not invent new tokens)

### Acceptance Checks (Include)

- [ ] `pnpm -s styles:gate` passes
- [ ] No gradients/arbitrary values/palette colors in touched files

## References (Load Only If Needed)

- SSOT: `AGENTS.md`, `docs/DESIGN.md`
- Project Tailwind guidance: `.codex/skills/treido-frontend/references/tailwind.md`

