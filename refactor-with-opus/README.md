# Refactor with Opus — Program Guide

> **Who:** Opus (Copilot) designs the audit+refactor prompts. Human reviews & approves. Codex executes.
> **What:** Full techstack audit+refactor, one technology at a time. Ground-up alignment with latest docs and best practices.
> **Where:** This folder holds all context. Codex updates `tasks.md` after each pass.

---

## How This Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Opus        │────▶│  Human       │────▶│  Codex       │
│  (Copilot)   │     │  (you)       │     │  (executor)  │
│              │     │              │     │              │
│ Designs the  │     │ Reviews plan │     │ Runs audit   │
│ audit prompt │     │ Greenlights  │     │ Executes fix │
│ + task file  │     │ execution    │     │ Updates tasks│
└─────────────┘     └──────────────┘     └──────────────┘
```

### Per-Technology Flow

1. **Opus** creates the audit+refactor task file in `refactor/` (e.g., `nextjs-audit-refactor.md`)
2. **Human** reviews, adjusts scope if needed
3. **Codex** runs audit-only first → produces findings
4. **Human** reviews audit findings, greenlights execution
5. **Codex** runs full execution → updates `tasks.md` with ✅
6. **Repeat** for next technology in the stack

### Codex Instructions

Every Codex session for this program starts with:

```
Read refactor-with-opus/tasks.md for overall program status.
Read the linked task file for your specific assignment.
After completion, update refactor-with-opus/tasks.md — check off your task and fill in the metrics.
```

---

## File Map

```
refactor-with-opus/
├── README.md          ← You're here. Program guide for Opus + Human.
└── tasks.md           ← Master checklist. Codex updates this after each pass.

refactor/
├── nextjs-audit-refactor.md    ← Next.js task file (created, ready to run)
├── react-audit-refactor.md     ← React 19 task file (Opus creates when ready)
├── typescript-audit-refactor.md
├── tailwind-audit-refactor.md
├── shadcn-audit-refactor.md
├── supabase-audit-refactor.md
├── intl-audit-refactor.md
├── testing-audit-refactor.md
├── dx-audit-refactor.md
└── final-sweep.md              ← Cross-cutting final pass
```

---

## Session Protocol (for Opus in new chats)

Every new chat:
1. Read `claude.md` — restore identity
2. Read `refactor-with-opus/README.md` — this file, restore program context
3. Read `refactor-with-opus/tasks.md` — see what's done, what's next
4. Design the next task file OR review Codex output from the last pass

---

## Scope Rules

### Each audit covers:
- **Alignment** — does our code match latest docs and best practices?
- **Cleanup** — dead code, unused exports, over-extracted files, copy-paste duplicates
- **Performance** — caching, lazy loading, bundle optimization, streaming
- **Conventions** — naming, file organization, import patterns, boundary enforcement
- **Bloat reduction** — merge tiny files, split oversized files, remove indirection layers

### Each audit does NOT touch:
- DB schema / migrations / RLS (needs human + DBA review)
- Auth session logic (high-risk, separate security review)
- Payment / webhook internals (high-risk, separate review)
- Feature behavior (pixel + behavior parity required)
- Route URLs (no path changes)

### When a tech area overlaps:
The FIRST audit that reaches a file owns it. Later audits skip files already cleaned.
Example: Next.js audit fixes `"use client"` on a component → React audit skips that file.

---

## Current Baseline (2026-02-20)

| Metric | Value |
|--------|-------|
| Next.js | 16.1.4 |
| React | 19.2.3 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.1.18 |
| Source files | 937 |
| LOC | ~131K |
| `"use client"` | 216 |
| `"use cache"` | 11 |
| >300L files | 93 |
| <50L files | 248 |
| Pages | 86 |
| Route handlers | 47 |
| Loading boundaries | 88 |

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | One tech at a time, not all at once | Codex works best with bounded scope. Easier to verify. |
| 2 | Audit-only first, then execute | Human reviews findings before code changes. Safety net. |
| 3 | Next.js first | Foundation layer — routing, caching, boundaries affect everything else. |
| 4 | Codex updates tasks.md | Single source of truth for progress. No guessing what's done. |
| 5 | New chat per tech | Context stays fresh. No 200K token monster conversations. |

---

*Created: 2026-02-20*
