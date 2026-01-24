# Audit Task List (Derived) — 2026-01-20

This is a **derived** list from the lane full audits. Single source of truth remains:
- Tasks/gates: `TODO.md`
- Board/owners: `codex-xhigh/EXECUTION-BOARD.md`

## Critical (ship blockers / security)

- [ ] Supabase: enable leaked password protection (Dashboard) → `codex-xhigh/supabase/FULL-AUDIT.md`
- [ ] Dependencies: upgrade `next` to patched version (>=16.0.9) → `codex-xhigh/DEPENDENCIES-AUDIT.md`
- [ ] Next.js: fix 2 lint errors (React Compiler memoization) → `codex-xhigh/nextjs/FULL-AUDIT.md`
- [ ] i18n: fix `messages/en.json` parity (7 missing keys) → `codex-xhigh/i18n/FULL-AUDIT.md`

## High (parallel lanes, minimal overlap)

- [ ] Next.js: triage server actions imported by UI (20 imports) → `codex-xhigh/nextjs/FULL-AUDIT.md`
- [ ] TypeScript: decide `ts:gate` policy (fix vs baseline) and reduce drift → `codex-xhigh/typescript/FULL-AUDIT.md`
- [ ] UI: reduce arbitrary values + hardcoded colors (start with top offenders / demo) → `codex-xhigh/ui/TAILWIND-V4-AUDIT.md`

## Medium (time-boxed cleanup)

- [ ] Knip: delete unused files (49) after verifying route usage → `codex-xhigh/typescript/FULL-AUDIT.md`
- [ ] Dependencies: refresh transitive advisories (`qs`, `tar`, `esbuild`, `tmp`) → `codex-xhigh/DEPENDENCIES-AUDIT.md`
- [ ] Testing: reduce stderr noise in unit logs (optional) → `codex-xhigh/testing/FULL-AUDIT.md`

## Suggested parallelization (terminals / agents)

- **Lane: `agent/i18n`** — `messages/*.json` parity + eliminate inline locale branching.
- **Lane: `agent/fe`** — Next lint errors + action-boundary triage.
- **Lane: `agent/ui`** — Tailwind tokenization + deletion of demo offenders (if approved).
- **Lane: `agent/supabase`** — dashboard-only item + any deferred advisor work.
- **Lane: `agent/ts`** — `ts:gate` drift + Knip cleanup after merges settle.
