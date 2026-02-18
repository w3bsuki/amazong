# Current Refactor Task

> **Read this file first.** It tells you exactly where we are and what to do next.

---

## Status

| | |
|---|---|
| **Phase** | Lean Sweep (replaces old Phase 3+4) |
| **Last completed** | Phase 2 — Client Boundary & Bundle (2026-02-17) |
| **Next action** | Execute Lean Sweep Phase A below |

## Metrics (post-Phase 2)

| Metric | Baseline | Now | Target |
|--------|----------|-----|--------|
| Files | 762 | 809 | <700 |
| Total LOC | ~48K | ~43K | <35K |
| `"use client"` | 357 | 215 | <150 |
| >300-line files | 125 | 31 | <15 |
| Missing metadata | 58 | 53 | 0 |
| Clone % | 3.06% | 3.06% | <2% |

## Task Queue — Lean Sweep

Execute tasks in order. Check off when done. **One task per session.**

> All agent files are in `refactor/lean-sweep/`. Read `lean-sweep/README.md` for context.

- [ ] **A: Dead Code Purge** → Read `lean-sweep/agent-a-dead-code.md` then execute
- [ ] **B: Action Consolidation** → Read `lean-sweep/agent-b-actions.md` then execute
- [ ] **C: Shared Primitives** → Read `lean-sweep/agent-c-shared-primitives.md` then execute
- [ ] **D: Provider Simplification** → Read `lean-sweep/agent-d-providers.md` then execute
- [ ] **E: Utility Consolidation** → Read `lean-sweep/agent-e-utilities.md` then execute
- [ ] **F: Data Layer & Caching** → Read `lean-sweep/agent-f-data-layer.md` then execute
- [ ] **G: Final Polish** → Read `lean-sweep/agent-g-polish.md` then execute

## How to Run a Session

```
1. You already read root AGENTS.md (auto-loaded). Good.
2. You are reading this file (CURRENT.md). Good.
3. Read `refactor/shared-rules.md` — mandatory rules.
4. Pick the first unchecked task above.
5. Read the linked agent file in `refactor/lean-sweep/`.
6. Execute. Work in logical batches. Follow shared-rules.md.
7. When done:
   a. Run verification (see AGENTS.md § Verify).
   b. Check off your task.
   c. Update the metrics table above.
   d. Log changes in `refactor/lean-sweep/extractions.md`.
   e. Append a summary to `refactor/log.md`.
```

---

*Updated: 2026-02-18 — Lean Sweep plan replaces old Phase 3+4*
