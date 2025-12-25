# Phase 0 → Phase 10 Cleanup Playbook (Production-Ready)

This playbook is designed to be **safe**, **repeatable**, and **audit-driven**. It does not assume the audit is perfect; it assumes the audit is a *candidate generator*.

Primary rule: **Verify → Change → Gate → Commit**.

Reference protocol: [cleanup/CLEANUP_EXECUTION_PLAN.md](cleanup/CLEANUP_EXECUTION_PLAN.md)

---

## Global guardrails (apply to every phase)

### Branch + scope control
- Work on a dedicated branch.
- Keep each phase as a separate PR or a series of small commits you can revert.

### Gates (minimum)
Run after every meaningful batch:
- `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- `pnpm -s build`

Run after any phase that touches routing, auth, checkout, payments, or data fetching:
- `pnpm -s lint`
- `pnpm test:e2e` (or at least the smoke spec if the dev server is stable)

### “Never break production” rules
- Never delete anything based only on Knip/Jscpd labels.
- Never remove dependencies before confirming they’re unused in:
  - runtime (`app/`, `components/`, `lib/`)
  - scripts (`scripts/`)
  - tests (`e2e/`, `__tests__/`, `test/`)
  - package scripts ([package.json](package.json))
- Prefer convergence over deletion when duplicates exist.

### Definition of “100% perfect” (what we can actually guarantee)
Perfection is not a real finish line, so this plan uses measurable outcomes:
- `pnpm build` succeeds.
- `pnpm -s exec tsc ...` succeeds.
- E2E smoke passes on CI.
- No circular dependencies reported by `madge` (or equivalent).
- No unused files/deps in Knip **after** allowlists are applied.
- No repo bloat committed (reports/artifacts are ignored or archived).

---

## Phase 0 — Baseline & inventory (no behavior changes)

**Goal:** establish a clean, reproducible baseline so future diffs are trustworthy.

**Inputs:**
- [cleanup/phase0/route-map.md](cleanup/phase0/route-map.md)
- [cleanup/phase0/components-ownership.md](cleanup/phase0/components-ownership.md)
- [cleanup/FOLDER_INVENTORY.md](cleanup/FOLDER_INVENTORY.md)

**Actions:**
1) Ensure the working tree is clean (commit or stash).
2) Confirm ignore rules cover artifacts (Playwright reports, `.next`, etc.).
3) Record baseline results:
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `pnpm -s build`

**Exit criteria:** baseline gates pass on a clean tree.

---

## Phase 1 — Artifact purge (safe deletes only)

**Goal:** remove local/generated bloat and keep it out of git.

**Targets (typical):**
- `.next/`, `playwright-report-*/`, `test-results/`, `.playwright-mcp/`

**Actions:**
1) Confirm these are not tracked by git (if tracked: `git rm -r`).
2) Delete locally if needed (optional, local hygiene).

**Exit criteria:** repo contains no committed bulky artifacts; ignore rules are correct.

---

## Phase 2 — Tooling correctness (fix audit false-positives)

**Goal:** make audits actionable by fixing “unlisted/missing” deps and obvious tooling drift.

**Inputs:**
- [cleanup/knip-report.json](cleanup/knip-report.json)
- [cleanup/audit-data.json](cleanup/audit-data.json)

**Actions:**
1) Fix “unlisted dependency” findings (example: `postcss-load-config` used by [postcss.config.mjs](postcss.config.mjs)).
2) Re-run gates.

**Exit criteria:** build/typecheck pass; tooling warnings reduced.

---

## Phase 3 — Structural correctness (routes, boundaries, cycles)

**Goal:** remove structural hazards before deletions.

**Targets:**
- Break circular dependency identified in [cleanup/FULL_CODEBASE_AUDIT.md](cleanup/FULL_CODEBASE_AUDIT.md).
- Ensure error boundaries / `global-error.tsx` behavior is intact.

**Actions:**
1) Fix the known circular dependency.
2) Run gates + E2E smoke.

**Exit criteria:** no circular deps; smoke passes.

---

## Phase 4 — Delete demo/dev-only routes and pages

**Goal:** remove development-only surfaces that risk shipping.

**Inputs:**
- [production/02-CLEANUP.md](production/02-CLEANUP.md)

**Actions:**
1) Identify demo-only routes (sell demos, component audit, etc.).
2) For each route: `git grep` for links/imports + check route map, then delete.
3) Gates + E2E smoke.

**Exit criteria:** demo routes removed; no broken navigation.

---

## Phase 5 — “Unused files” deletions (small, verified batches)

**Goal:** safely delete truly unused files.

**Inputs:**
- [cleanup/audit-data.json](cleanup/audit-data.json) unusedFiles list
- [cleanup/FILE_INVENTORY.md](cleanup/FILE_INVENTORY.md)

**Actions (repeatable batch loop):**
1) Take 5–10 candidates.
2) Prove no usage with:
   - `git grep -n "<import path or filename>" -- app components lib hooks e2e __tests__ test scripts`
3) Delete (prefer `git rm`).
4) Run gates.

**Exit criteria:** unused file count materially reduced with zero regressions.

---

## Phase 6 — Duplicate exports & unused exports (API hygiene)

**Goal:** reduce confusion and tighten public surface area.

**Rule:** only remove exports that are **definitely** unused; otherwise, mark as internal.

**Actions:**
1) Fix “duplicate export” cases (keep one canonical export form).
2) Remove clearly unused exports where search proves no use.
3) Gates.

**Exit criteria:** exports are coherent; no consumer breaks.

---

## Phase 7 — Duplicates → convergence refactors (best-practice extraction)

**Goal:** reduce clones by creating canonical shared modules.

**Inputs:**
- Duplicates section in [cleanup/FULL_CODEBASE_AUDIT.md](cleanup/FULL_CODEBASE_AUDIT.md)
- Clone evidence in [cleanup/jscpd-report.json](cleanup/jscpd-report.json)

**Actions:**
1) For each duplication cluster:
   - pick canonical implementation
   - extract shared helper/module
   - create re-export shims if needed
   - update imports until converged
   - then delete duplicate code
2) Gates + E2E smoke.

**Exit criteria:** clone count drops; code is simpler, not just “moved around”.

---

## Phase 8 — Dependency pruning (only after convergence)

**Goal:** remove unused packages without breaking scripts/tests.

**Important reality check:**
- `dotenv` is used by test setup ([test/setup.ts](test/setup.ts)).
- `cross-env` is used by npm scripts ([package.json](package.json)).
So these are **not** safe to remove right now.

**Actions:**
1) For each candidate package:
   - `git grep -n "<package>" -- app components lib hooks e2e __tests__ test scripts`
2) Remove in small groups: `pnpm remove ...`
3) Run gates + E2E smoke.

**Exit criteria:** dependency set is minimal and verified.

---

## Phase 9 — Production hardening sweep

**Goal:** align codebase with production best practices.

**Checklist themes:**
- Remove accidental `console.log` in client/UI (keep server logging where intentional).
- Confirm env var usage is safe (no secrets shipped to client).
- Confirm API routes return correct status codes and handle errors.
- Confirm auth/checkout redirects are correct.

**Actions:**
1) Run lint + build.
2) Run key E2E flows (auth, checkout, orders).

**Exit criteria:** no obvious production foot-guns; flows validated.

---

## Phase 10 — Lock it in: CI gates + docs

**Goal:** prevent regressions; make “clean” the default.

**Actions:**
1) Ensure CI runs at least:
   - typecheck
   - build
   - lint
   - E2E smoke
2) Add optional CI checks (if desired): knip, madge/circular, bundle size/lighthouse budget.
3) Update docs so future work follows the protocol.

**Exit criteria:** CI enforces the standards; cleanup doesn’t regress.

---

## Suggested “Phase-by-phase PR” strategy

- PR A: Phase 0–2 (baseline + artifacts + tooling correctness)
- PR B: Phase 3 (circular dependency fix)
- PR C: Phase 4–5 (demo route deletion + unused file batches)
- PR D: Phase 6–7 (exports cleanup + duplicate convergence)
- PR E: Phase 8–10 (deps + production hardening + CI)
