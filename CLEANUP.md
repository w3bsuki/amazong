# 🧹 Cleanup Plan (Launch-Safe + 30% Codebase Reduction)

**Date:** December 24, 2025

This repo already has multiple cleanup/refactor documents. This file is the *single* “quick entry” cleanup plan that:

1) stays aligned with our canonical structure rules,
2) focuses on production safety (tomorrow launch), and
3) targets **~30% reduction in maintained code** (LOC + file count) *without changing behavior*.

## Sources of truth (don’t duplicate context)

- **Canonical structure plan:** `STRUCTURE.md`
- **Production cleanup runbook:** `production/02-CLEANUP.md`
- **Audit inputs (treat as leads, not truth):**
  - `cleanup/FULL_CODEBASE_AUDIT.md`
  - `cleanup/FILE_INVENTORY.md`

If something conflicts, `STRUCTURE.md` wins.

---

## What “30% reduction” means here

We aim for **~30% less code to understand/maintain**, by combining:

- **Delete truly unused files** (fast, low-risk)
- **Collapse duplicate implementations** (medium-risk but high payoff)
- **Enforce boundaries** so duplication doesn’t come back

This is not a “rewrite”; it’s controlled deletion + consolidation with gates.

---

## Immediate bloat fix (0-risk, do before anything else)

**Goal:** remove “context bloat” (generated artifacts) so the repo stays clean during launch.

- Ignore and purge generated artifacts:
  - timestamped Playwright reports (`playwright-report-*`)
  - Playwright/LHCI outputs (`playwright-report/`, `test-results/`, `.lighthouseci/`)
  - task outputs (`tsc.task.out`, `tsc.err`)

Optional if disk is tight (safe to regenerate): delete `.playwright-mcp/`.

---

## Execution gates (required after every batch)

Minimum:

- `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`

When touching routing/components/providers (recommended):

- `pnpm -s build`
- `pnpm -s lint`
- `pnpm test:e2e` (time-box; do at least on “final batch”)

---

## The plan (time-boxed for launch)

### Batch A — Launch-safe deletions (target: 10–15%)

**Goal:** delete files that are provably unused, and remove obvious dead routes.

Use the deletion lists from:

- `cleanup/FULL_CODEBASE_AUDIT.md` (unused files)
- `production/02-CLEANUP.md` (runbook + verified exceptions)

Rules:

- Delete in small chunks.
- After each chunk: run typecheck; if it passes, keep going.

### Batch B — Dependency prune (target: 3–6%)

**Goal:** remove packages that are only supporting deleted code.

Process:

1) Delete code first.
2) Run `pnpm -s exec depcheck` (or compare against the audit list).
3) Remove dependencies in small groups.
4) Run build.

Notes:

- Treat audit reports as leads; verify by search.
- Keep packages that are used indirectly by Next.js tooling or runtime.

### Batch C — Duplicate consolidation (target: 10–15%)

**Goal:** reduce multiple “almost the same” implementations to one canonical module.

High-yield consolidation targets (from existing audits + structure rules):

- Product card/page variants → **one canonical path** under `components/shared/product/` (or a domain folder if shared)
- Review form and review sections
- Subscription actions (`app/actions` vs route-local `_actions`)
- Search-products logic duplication across categories/search
- Duplicate address UI
- “route error” UIs (standardize small wrappers around a shared component)

Guardrail:

- Do not introduce compatibility shims unless absolutely necessary; update imports and delete old paths in the same batch.

### Batch D — Structure enforcement (target: prevents regression)

**Goal:** stop the repo from drifting back.

- Enforce `components/ui` = primitives only.
- Keep route-owned UI in `app/**/_components`.
- Ensure providers live under `components/providers`.
- Add/strengthen ESLint `no-restricted-imports` boundaries (per `STRUCTURE.md`).

This batch can be split: minimal guardrails pre-launch; deeper restructuring post-launch.

---

## “Done” definition

- All batches merged with gates passing.
- No generated report folders in git status.
- Audit reports still exist in `cleanup/` (as evidence), but we don’t duplicate giant lists across multiple docs.

---

## If we only have 2–3 hours tonight

1) Batch A (small, proven deletions only)
2) Batch B (remove dependencies tied to deleted code)
3) Final gates: typecheck + build + one E2E run
