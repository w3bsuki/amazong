# Refactor Progress Tracker

> Updated by Codex after each phase. Reviewed by Human + Copilot before next phase is created.

---

## Phase 1 — Discovery Audit

**Goal:** Full folder-tree audit. Find waste, fix safe issues, flag risky ones.

| Agent | Scope | Status |
|-------|-------|--------|
| Agent 1 | `components/` tree | ⬜ Not started |
| Agent 2 | `lib/` + `hooks/` | ⬜ Not started |
| Agent 3 | `app/` (routes, actions, api) | ⬜ Not started |

**Verification:** ⬜ `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

**Metrics before:**
| Metric | Value |
|--------|-------|
| Files | 762 |
| `"use client"` | 357 |
| >300-line files | 125 |
| >500-line files | 44 |
| Clones | 247 (3.06%) |

**Metrics after:** _(fill after phase completes)_

---

## Phase 2 — Client Boundary & Bundle

⬜ Not created yet. Planned after Phase 1 review.

## Phase 3 — Data & Performance

⬜ Not created yet. Planned after Phase 2 review.

## Phase 4 — Polish

⬜ Not created yet. Planned after Phase 3 review.
