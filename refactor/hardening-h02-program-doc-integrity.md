# Hardening H02 — Program Doc Integrity (Safe-Only)

Date: 2026-02-20

## Goal

Make `refactor-with-opus/` self-consistent by ensuring all referenced task/report files exist (no broken links), without changing runtime code.

## Hard Constraints

- Docs-only changes (no runtime behavior, no UI changes).
- No DB/migrations/RLS changes.
- No auth/session logic changes.
- No payments/webhooks changes.

## Phase 1 — Audit (NO code changes)

1. Identify missing files referenced by:
   - `refactor-with-opus/tasks.md`
   - `refactor-with-opus/README.md`
2. Confirm whether the program has alternative “source of truth” docs already present (e.g. `refactor/*-audit-report.md`, `refactor/FINAL-REPORT.md`).

### Audit Findings (2026-02-20)

Broken references found:

- Missing: `refactor/testing-audit-refactor.md`
- Missing: `refactor/dx-audit-refactor.md`
- Missing: `refactor/final-sweep.md`

Existing sources of truth to reference from stubs:

- `refactor-with-opus/tasks.md` (completion summaries for Tasks #8–#10)
- `refactor/*-audit-report.md` (per-technology reports)
- `refactor/FINAL-REPORT.md` (program-level summary)

## Phase 2 — Plan

- Add minimal stub/pointer markdown files for any missing references (clearly marked as pointers).
- Avoid rewriting history in completed checklists; prefer adding missing link targets.

## Phase 3 — Execute

After the batch, run:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

## Phase 4 — Report

1. Record created/updated docs and what they point to.
2. Run `pnpm -s architecture:scan`.
3. Check off **H02** in `refactor-with-opus/post-refactor-hardening.md` with date + 1-line summary.

---

## Execution (Completed 2026-02-20)

Created missing link targets as minimal pointer stubs:

- `refactor/testing-audit-refactor.md`
- `refactor/dx-audit-refactor.md`
- `refactor/final-sweep.md`

All `refactor/…` paths referenced by `refactor-with-opus/tasks.md` and `refactor-with-opus/README.md` now exist.

## Verification

- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` — PASS
- `pnpm -s architecture:scan` — PASS (metrics unchanged)
