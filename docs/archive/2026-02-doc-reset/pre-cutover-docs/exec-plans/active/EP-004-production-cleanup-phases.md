# EP-004: Production Cleanup — Phased Tech-Stack Audit

| Field | Value |
|-------|-------|
| Status | Active |
| Owner | treido-orchestrator |
| Created | 2026-02-13 |
| Depends on | EP-003 (completed — 12-zone UI/UX polish) |
| Target | Launch-ready codebase |
| Risk | Medium (all phases obey high-risk pause domains) |

---

## Context

EP-003 completed a 12-zone UI/UX polish of 208 files (tokens, a11y, motion, dead-code).
EP-004 is the **deeper tech-stack audit** — each phase focuses on one technology stack,
runs as a **standalone Codex CLI session**, and records results in the tracker below.

Phases are designed to be run in separate chats because:
- Each phase fits in a single Codex context window
- Results from earlier phases don't block later ones (mostly independent)
- The tracker file provides cross-session continuity

---

## Phase Overview

| Phase | Focus | Scope | Est. Files | Depends On |
|-------|-------|-------|-----------|------------|
| P0 | Physical cleanup | Stale folders, artifacts, dead files | ~30 | None |
| P1 | Next.js 16 + React 19 | App Router patterns, server/client, caching | ~120 | P0 |
| P2 | TypeScript strictness | `any`, `as any`, `!`, unused, strict patterns | ~200 | P0 |
| P3 | Tailwind CSS v4 | Palette scan, TW4 syntax, token compliance | ~150 | P0 |
| P4 | shadcn/ui integrity | Primitive purity, variants, a11y, Radix | ~36 | P3 |
| P5 | Supabase integration | Client selection, error handling, types | ~40 | P2 |
| P6 | Component architecture | Duplicates, consolidation, boundaries, knip | ~80 | P1, P2 |
| P7 | ESLint + code quality | Rule compliance, console.log, patterns | All | P2 |
| P8 | Test coverage + quality | Missing tests, flaky tests, coverage gaps | ~50 | P1-P7 |
| P9 | Final verification | Full gate suite, build, bundle analysis | All | P0-P8 |

---

## Tracking

Status values: `⬜ not-started` | `🔄 in-progress` | `✅ completed` | `⏭️ skipped`

| Phase | Status | Date Started | Date Completed | Notes |
|-------|--------|--------------|----------------|-------|
| P0 — Physical cleanup | ⬜ not-started | | | |
| P1 — Next.js 16 | ⬜ not-started | | | |
| P2 — TypeScript | ⬜ not-started | | | |
| P3 — Tailwind v4 | ⬜ not-started | | | |
| P4 — shadcn/ui | ⬜ not-started | | | |
| P5 — Supabase | ⬜ not-started | | | |
| P6 — Architecture | ⬜ not-started | | | |
| P7 — ESLint | ⬜ not-started | | | |
| P8 — Tests | ⬜ not-started | | | |
| P9 — Final verify | ⬜ not-started | | | |

---

## Cross-Phase Findings

> When a phase discovers issues belonging to another phase's domain,
> log them here instead of fixing them out-of-scope.

| Found In | Belongs To | File | Issue | Severity |
|----------|-----------|------|-------|----------|
| | | | | |

---

## Per-Phase Completion Criteria

Every phase must:
1. Run `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate` (pass)
2. Not increase error/warning counts from baseline
3. Update this tracker with status, dates, and notes
4. Log any cross-phase findings in the table above
5. Record key stats: files changed, issues found/fixed, deferred items

---

## How To Run Each Phase

```bash
# 1. Check which phase is next
cat docs/exec-plans/active/EP-004-production-cleanup-phases.md | grep "not-started" | head -1

# 2. Copy the corresponding prompt from .codex/prompts/phase-PN.md

# 3. Run Codex
codex --approval-mode full-auto --prompt .codex/prompts/phase-P0-cleanup.md

# 4. After completion, update this tracker
```

---

## See Also

- `.codex/prompts/phase-P*.md` — Individual phase prompts
- `.codex/REFACTOR-TRACKER.md` — EP-003 zone tracker (completed)
- `docs/exec-plans/tech-debt-tracker.md` — Known debt inventory
- `TASKS.md` — Active task queue

---

*Last updated: 2026-02-13*
