# EP-001: Align with OpenAI Harness Engineering Guide

| Field | Value |
|-------|-------|
| Status | Active |
| Owner | treido-orchestrator |
| Created | 2026-02-12 |
| Target | 2026-02-12 |
| Risk | Low (docs + tooling only, no product code changes) |

## Goal

Fully align Treido's repository knowledge structure, mechanical enforcement, and
agent-first workflow with the patterns described in OpenAI's "Harness Engineering"
blog post (Feb 2026).

## Scope

- `docs/` — new files: exec-plans, design-docs, product-specs, references, QUALITY_SCORE, RELIABILITY, SECURITY, PRODUCT_SENSE, PLANS
- `scripts/` — new tooling: doc-freshness checker, DB schema generator
- `__tests__/` — structural architecture boundary tests
- `AGENTS.md` — update context-loading table with new pointers

## Non-Goals

- Changing product code or UI
- Modifying database schema
- Changing CI/CD pipeline (scripts are run manually for now)

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-12 | Model doc structure after OpenAI's `docs/` layout | Direct alignment with harness engineering guide |
| 2026-02-12 | Keep AGENTS.md as map (~170 lines), add pointers only | OpenAI explicitly warns against monolithic AGENTS.md |
| 2026-02-12 | Structural tests over custom ESLint rules for architecture | Vitest tests are simpler to maintain for file-level boundaries |

## Progress

- [x] Create exec-plans directory with template + tech-debt-tracker
- [x] Create design-docs with core-beliefs
- [x] Create product-specs index
- [x] Create references directory
- [x] Create QUALITY_SCORE.md
- [x] Create RELIABILITY.md
- [x] Create SECURITY.md
- [x] Create PRODUCT_SENSE.md
- [x] Create PLANS.md
- [x] Create doc-freshness script
- [x] Create DB schema generation script
- [x] Create architectural boundary tests
- [x] Update AGENTS.md

## Outcome

All gaps identified in the OpenAI Harness Engineering comparison have been addressed:

- 19 new files created across docs/, scripts/, and __tests__/
- AGENTS.md updated with 13 new context-loading pointers
- All verification gates pass (typecheck, lint, architecture tests)
- Doc freshness script verified working (17 fresh, 55 need dates)
- DB schema generator verified working (34 tables, 46 RLS)
- Architecture boundary tests verified (6/6 pass)

Remaining advisories surfaced by structural tests:
- 1 hook file missing `use client` (hooks/use-category-attributes.ts)
- 6 server actions without Zod boundary validation (tracked for follow-up)
