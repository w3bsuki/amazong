# Roadmap (Ship Without Getting Stuck)

## Phase 0 — Truth + gates (same day)
- Use `TODO.md` + `codex-xhigh/EXECUTION-BOARD.md` as the single execution order.
- Confirm gates run locally:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Phase 1 — Production hard gates (1–3 days)
Do these before any “big cleanup”:
- Supabase production hardening: `docs/BACKEND.md` + `docs/PRODUCTION.md`
- Stripe production correctness: `docs/BACKEND.md` + `docs/PRODUCTION.md`
- Manual QA pass: `docs/PRODUCTION.md`

Exit criteria:
- P0 blockers resolved
- All gates green

## Phase 2 — Frontend/backend alignment (3–7 days)
Goal: make data access predictable and reduce drift.
- Consolidate duplicated queries/selects into `lib/*` or `lib/supabase/queries/*`
- Fix boundary violations (pass actions as props from Server Components)
- Normalize onboarding + badges + plan state into a single “account status” model

Exit criteria:
- One canonical way to compute: `accountType`, `badge`, `plan`, `fees`, `isBusinessAllowed`
- No shared component imports app-layer actions directly

## Phase 3 — Cleanup (time-boxed, after shipping)
Goal: delete bloat without breaking flows.
- Delete demo routes if not required
- Remove dead files from knip report
- Split remaining “god components” only when needed for correctness/testability

Exit criteria:
- Reduced surface area + fewer duplicates
- Same gates still green
