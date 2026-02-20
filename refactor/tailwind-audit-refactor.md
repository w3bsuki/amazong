# Tailwind CSS v4 Audit + Refactor

> **For Codex CLI.** Tailwind v4 + token-contract alignment pass.
> Focus: CSS-first configuration, semantic token enforcement, arbitrary/palette elimination, and consistency checks.
> **Does NOT touch:** product UI/UX styling unless required to satisfy gates, DB/migrations/RLS, auth/session logic, payments/webhooks.

---

## Prerequisites

1. Read `AGENTS.md` — semantic tokens + route privacy rules.
2. Read `docs/STACK.md` — Tailwind v4 CSS-first setup + gates.
3. Read `docs/DESIGN.md` — token contract and allowed patterns.
4. Read `docs/DECISIONS.md` — why scanners enforce rules.
5. Read `refactor/shared-rules.md` — mandatory refactor rules.

Optional (if available): fetch Tailwind v4 guidance via Context7 (config, v4 CSS-first patterns, migration notes).

---

## Phase 1: AUDIT (read-only — use subagents for bulk discovery)

Catalog:
- Token violations beyond what `pnpm -s styles:gate` catches (if any)
- Stray palette classes, gradients, raw hex/oklch, arbitrary values
- Token-alpha usage (`bg-primary/90`, etc.)
- Non-deterministic/duplicated utility patterns (class order, mixed spacing scales)
- Unused or duplicated CSS custom properties in `app/globals.css`, `app/shadcn-components.css`, `app/utilities.css`
- Any Tailwind config drift (ensure no `tailwind.config.*` exists and no JS config assumptions)

Output: grouped findings (`app/`, `components/`, `lib/`, `hooks/`, `app/*.css`).

---

## Phase 2: PLAN

Propose safe batches with file counts:
- **Batch A:** delete dead CSS vars/utilities (no UI change) — only if provably unused
- **Batch B:** mechanical class fixes required for `styles:gate` (token-alpha/arbitrary/palette)
- **Batch C:** consistency refactors (class ordering, duplicated utilities) — only where behavior is identical

---

## Phase 3: EXECUTE

After each batch:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Rules:
- Pixel + behavior parity (no UX changes unless gate-forced).
- Prefer the smallest fix that passes scanners.
- Never introduce palette classes or arbitrary values.

---

## Phase 4: REPORT

After execution, generate `refactor/tailwind-audit-report.md`:

```markdown
# Tailwind CSS v4 Audit + Refactor — Report

Completed: YYYY-MM-DD

## Findings
[Grouped list]

## Changes Made
[Categorized list]

## What Was NOT Changed (and why)
[Risky items, UX parity reasons]

## Recommendations
[Follow-ups]
```

