# Current Refactor Task

> **Read this file first.** It tells you exactly where we are and what to do next.
> **Autopilot protocol:** `refactor/autopilot.md` — the execution loop.
> **Shared rules:** `refactor/shared-rules.md` — read before every task.

---

## Status

| | |
|---|---|
| **Mode** | Autopilot — full domain-by-domain audit + refactor |
| **Current task** | Domain 5 — components/ |
| **Sessions so far** | 24 (phase 0 rebaseline + Domains 1-4 completed) |

## Metrics

| Metric | Baseline (2026-02-18 Rebaseline) | Now | Target |
|--------|----------|-----|--------|
| Files | 852 | 920 | <650 |
| LOC (source) | ~115K | ~118K | <85K |
| `"use client"` | 217 | 219 | <120 |
| >300L files | 114 | 100 | <20 |
| Tiny <50L files | 286 | 280 | <100 |
| Missing metadata | 53 | 53 | 0 |
| Clone % | 2.80% | 2.77% | <1.5% |

## Domain Task Queue

Each domain task is a full audit + refactor of that area. Read `refactor/autopilot.md` for the execution loop.

- [x] Batches 0-2 + Lean Sweep A-E (sessions 1-18)
- [x] **Domain 1: (account)** → `refactor/domains/01-account.md` — 92f/16.8K LOC
- [x] **Domain 2: (main)** → `refactor/domains/02-main.md` — 135f/16K LOC
- [x] **Domain 3: (sell) + (business)** → `refactor/domains/03-sell-business.md` — 106f/16.6K LOC
- [x] **Domain 4: Small routes** → `refactor/domains/04-small-routes.md` — 159f/16.6K LOC
- [ ] **Domain 5: components/** → `refactor/domains/05-components.md` — 142f/14.5K LOC
- [ ] **Domain 6: lib/ + actions/ + api/** → `refactor/domains/06-lib-actions-api.md` — 169f/26.3K LOC
- [ ] **Domain 7: Cross-cutting + final** → `refactor/domains/07-cross-cutting-final.md` — metadata, CSS, dead code, build, report

## How to Run

### Autopilot (full autonomous run)
```
Read refactor/autopilot.md. Execute all remaining tasks following the loop protocol.
```

### Single domain
```
Read refactor/CURRENT.md. Execute the first unchecked domain task.
```

### Resume
```
Read refactor/autopilot.md. Continue from where you left off.
```

---

*Updated: 2026-02-18 — Domain 4 complete; next up is Domain 5 (components/).*
