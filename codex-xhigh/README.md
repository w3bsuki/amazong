# codex-xhigh (Execution Playbook)

This folder exists to stop the “run back and forth” loop by giving us **one methodical place** to:
- audit what exists (without drifting)
- decide what to keep/remove (without rewriting)
- execute small, verifiable refactors toward production

It **does not replace** the existing canonical docs; it **indexes and operationalizes** them.

## Canonical sources (don’t duplicate)
- `TODO.md` — task tracker + gates
- `codex/MASTER-PLAN.md` — production readiness execution order + P0 blockers
- `docs/launch/*` — feature map + hard-gate plans + QA checklist
- `docs/ENGINEERING.md`, `docs/DESIGN.md`, `docs/PRODUCTION.md` — stack rules

## How to use this folder
1) Pick one scope (a user flow or a tech slice).
2) Read the matching `*/audit.md` + `*/structure.md`.
3) Make **one small change** at a time.
4) Run gates after each change:
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
5) Track the work in `TODO.md` (this folder is a playbook, not a task tracker).

## What’s inside
- `DOCS-INDEX.md` — “where is the truth?” map (plans/audits/launch docs)
- `INVENTORY.md` — current hotspots + where they live
- `ROADMAP.md` — phased approach (ship → align → cleanup)
- `nextjs/` — App Router structure + anti-patterns
- `supabase/` — schema/RLS/migrations + advisor gates
- `stripe/` — goods checkout + subscriptions + connect + idempotency
- `frontend/` — frontend/backend alignment rules (data access + boundaries)
- `ui/` — Tailwind v4 + shadcn + token rules
- `i18n/` — next-intl rules + drift prevention
- `testing/` — Vitest/Playwright strategy + reliability gates
- `product/` — onboarding/badges + monetization decisions (business rules)

