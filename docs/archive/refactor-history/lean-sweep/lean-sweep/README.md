# Lean Sweep — De-Engineering the Treido Codebase

> **Goal:** Same product, same UX — dramatically less code.
> **Replaces:** Old Phase 3 + Phase 4 (generic checklists → targeted surgery).
> **Entry point for Codex:** `refactor/CURRENT.md` → points here.

---

## Why This Exists

Phases 1-2 cleaned the architecture and reduced `"use client"` from 357→215.
That was structural hygiene. This phase is **substantive**.

The codebase has ~43K lines of source across 809 files. Audit findings:

| Problem | Where | Waste |
|---------|-------|-------|
| Cross-route duplication | (account) ↔ (business) ↔ (admin) sidebars, orders, stats, activity | ~2,500 lines |
| Auth boilerplate in actions | 64 manual `getUser()` calls instead of `requireAuth()` | ~450 lines |
| Over-engineered providers | drawer-context (358L), header-context, currency-context | ~200 lines |
| Drawer ↔ dropdown duplication | Mobile drawers + desktop dropdowns with identical menus | ~200 lines |
| Scattered utilities | 3 price files, 2 logger files, 2 search-products files | ~150 lines |
| Dead code + unused deps | knip findings, dead CSS vars, commented blocks | TBD |
| Oversized files (31 >300L) | Action files 500-950L, components 400-750L | split targets |
| Missing caching | Read-heavy fetchers re-fetch every request | perf only |

**Conservative target:** Remove ~4,000-6,000 lines (10-15%). Make the rest cleaner.
**Aggressive target:** ~8,000-10,000 lines (20-25%) with deeper consolidation.

---

## Phases

Execute in order. Each phase is one Codex task (1-2 sessions).

| # | Phase | Agent File | Sessions | Impact |
|---|-------|-----------|----------|--------|
| A | Dead Code Purge | `agent-a-dead-code.md` | 1 | Remove dead weight — safest work |
| B | Action Consolidation | `agent-b-actions.md` | 1-2 | De-bloat server actions |
| C | Shared Primitives | `agent-c-shared-primitives.md` | 2-3 | Extract from cross-route duplication |
| D | Provider & Context Simplification | `agent-d-providers.md` | 1 | Slim over-engineered contexts |
| E | Utility Consolidation | `agent-e-utilities.md` | 1 | Merge scattered lib/ modules |
| F | Data Layer & Caching | `agent-f-data-layer.md` | 1-2 | Cache + server-side data |
| G | Final Polish | `agent-g-polish.md` | 1-2 | CSS, metadata, oversized splits |

**Total: 8-13 Codex sessions.**

---

## Working Rules

1. **Shared rules still apply** → read `refactor/shared-rules.md` before every task.
2. **Log every extraction** in `refactor/lean-sweep/extractions.md` — what was shared, from where, to where.
3. **Measure after each phase** — update metrics in `refactor/tasks.md`.
4. **Don't touch protected areas** — auth, payments, webhooks, DB schema.
5. **Think in batches** — verify after a logical unit, not per file.

---

*Created: 2026-02-18*
