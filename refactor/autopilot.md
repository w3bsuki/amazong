# Autopilot — Full Codebase Audit + Refactor

> **For Codex CLI.** This protocol runs a domain-by-domain audit and refactor to completion.
> Prerequisites: read `AGENTS.md` (auto-loaded) + `refactor/shared-rules.md`.

---

## Current State

| Metric | Now | Target |
|--------|-----|--------|
| Files | 878 | <650 |
| LOC (source) | ~118K | <85K |
| `"use client"` | 218 | <120 |
| >300L files | 112 | <20 |
| Tiny <50L files | 292 | <100 |
| Clone % | 2.82% | <1.5% |

**Key insight:** 292 files (33%) are under 50 lines — over-extracted fragments.
112 files (13%) are over 300 lines — under-split monoliths.
These two extremes account for 46% of all files and remain the biggest reduction opportunity.

---

## Execution Loop

For each domain task in `refactor/CURRENT.md`:

```
1. Read the linked task file completely.
2. AUDIT PHASE: Catalog every file in the domain.
   - List each file with: path, LOC, purpose (1 line), "use client" (y/n)
   - Identify: dead code, over-extracted tiny files, oversized files,
     unnecessary "use client", duplication within or across domains
   - Write audit findings at top of your log entry
3. REFACTOR PHASE: Execute changes based on audit findings.
   - Merge tiny files (<50L) back into their parent/sibling when cohesive
   - Split oversized files (>300L) into focused modules
   - Remove "use client" from files that don't need it
   - Delete dead code (grep for zero usage first!)
   - Consolidate duplicates into shared modules
   - Migrate getUser() → requireAuth() in server actions
4. VERIFY:
   pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
5. If FAIL: fix (up to 3 attempts), revert if stuck, document in log, continue.
6. If PASS:
   a. Check off the task in CURRENT.md
   b. Run: pnpm -s architecture:scan
   c. Update the metrics table in CURRENT.md with new numbers
   d. Append session entry to refactor/log.md (audit findings + changes + metrics)
   e. Continue to next task
7. If task is marked ⚠️ PAUSE → write findings only, then STOP.
```

## Merge vs Split Heuristics

**Merge when:**
- File is <50L and only used by one sibling/parent
- Type file has <5 types used by one module
- Constants file has <10 constants used by one module
- Barrel file just re-exports from one source

**Split when:**
- File is >300L with distinct responsibility sections
- Component file has internal sub-components that could stand alone
- Action file has unrelated operations (reads vs mutations vs helpers)

**Leave alone when:**
- File is 50-300L and cohesive — that's the sweet spot
- It's a Next.js magic file (page/layout/loading/error/route)
- It's auto-generated (database.types.ts, seed templates)

## Subagent Usage

Use subagents for bulk discovery:
- "List all files in [directory] with line counts and first 3 lines"
- "Find all imports of [module] across the codebase"
- "Check which of these 10 exports have zero usage"

Don't use subagents for code edits — you need full context for that.

## Session Continuity

If interrupted: checkmarks in CURRENT.md show progress. Resume with:
`Read refactor/autopilot.md. Continue from where you left off.`

---

## Rules

- **Pixel + behavior parity** — nothing should look or behave differently
- **Route URLs unchanged** — no renaming routes
- **No DB/migration/RLS work**
- **Auth/payment internals are audit-only** unless task explicitly says otherwise
- **Think in batches** — verify after a logical unit, not per file
- **Every deletion must be grep-verified** — zero imports before removing
