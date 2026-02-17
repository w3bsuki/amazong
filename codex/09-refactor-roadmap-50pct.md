# Refactor Roadmap: 50% Complexity Reduction

Goal: reduce implementation complexity by roughly half while preserving production behavior and UX parity.

## Baseline Targets

| Metric | Baseline | Target |
| --- | ---: | ---: |
| Client-boundary files | 215/803 (26.77%) | `<= 15%` |
| Oversized files (`>300`) | 120 | `<= 60` |
| Very large files (`>500`) | 43 | `<= 20` |
| Duplicate clone groups | 249 | `<= 125` |
| Duplicated lines | 4,793 | `<= 2,400` |
| `"use client"` files | 194 | `<= 120` |

## Execution Principles

1. Keep behavior stable; refactor structure first, behavior second.
2. Consolidate duplicate logic before micro-optimizing.
3. Preserve server-first architecture and semantic token rules.
4. Pause for approval on high-risk domains (auth, payments/webhooks, DB/RLS).

## Phase Plan

## Phase 0: Baseline Lock

- Capture current metrics in `00-baseline-metrics.md`.
- Tag top complexity hotspots by domain in `TODO.md`.
- Add refactor branches by domain to reduce merge risk.

## Phase 1: Quick Structural Wins (Low Risk)

- Remove dead/stale paths with verified zero usage.
- Consolidate duplicated helper utilities (auth guards, scanners, shared test fixtures).
- Unify account navigation config.

Expected gain: `10-15%` complexity reduction.

## Phase 2: Main + Profile Consolidation

- Unify discovery feed state for mobile/desktop.
- Unify filter state engine with presentational modes.
- Reduce product-card variant count.

Expected gain: `8-12%`.

## Phase 3: Sell Flow Consolidation

- Split route gating from form rendering.
- Route listing creation through one canonical path.
- Reduce repeated validation checks and quick-view data-path duplication.

Expected gain: `6-10%`.

## Phase 4: Account + Chat Decomposition

- Break oversized account/chat components into focused modules.
- Move data/orchestration to server or shared hooks where appropriate.
- Consolidate repeated user-fetch and mutation scaffolding.

Expected gain: `8-12%`.

## Phase 5: Data/API/Actions Rationalization

- Canonicalize data transforms in `lib/data`.
- Keep API routes as thin adapters.
- Split monolithic action files by concern.

Expected gain: `8-12%`.

## Phase 6: Styling/Gates/i18n Quality Simplification

- Consolidate style scanner internals.
- Modularize token files without semantic drift.
- Improve i18n key hygiene tooling and test fixture reuse.

Expected gain: `4-8%`.

## Phase 7: Hardening Pass

- Run full verification suite.
- Execute smoke E2E and targeted regression checks by domain.
- Compare final metrics against baseline targets.

## Risk Controls

- Mandatory approval before auth/payment/webhook/data-policy-sensitive merges.
- Domain-specific QA checklist for each phase.
- Keep each phase releasable and rollback-safe.

## Definition Of Done

- Baseline metrics improved to target band (or justified exceptions logged).
- No launch-critical regression.
- Domain docs updated with actual changes and follow-up tasks.
