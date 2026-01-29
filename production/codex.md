# CODEX.md — Codex (Claude Sonnet 4) Document Proposal

> **My proposal for finalizing all documentation and achieving perfect development state.**

**Created:** January 28, 2026  
**Author:** Codex (Claude Sonnet 4)  
**Purpose:** Propose final versions of all docs, task extraction strategy, and audit workflow

---

## Current Documentation State Assessment

### ✅ Well-Defined Documents (Minor Updates Needed)

| Document | Assessment | Proposed Changes |
|----------|------------|------------------|
| `docs/PRD.md` | Excellent | Add "Decision Log" entry for V1 launch date |
| `docs/FEATURES.md` | Excellent | Update progress % after final audit |
| `docs/ARCHITECTURE.md` | Excellent | Add UI Ownership Map entry for new components |
| `docs/DESIGN.md` | Excellent | No changes needed |

### 🔧 Needs Refinement

| Document | Issues | Proposed Solution |
|----------|--------|-------------------|
| `AGENTS.md` | Good but could be tighter | Add quick start commands section |
| `CLAUDE.md` | Legacy wrapper, redundant | Merge into AGENTS.md or simplify to pure redirect |
| `TASKS.md` | Mixes WIP + backlog + archive | Split into current sprint only |

### 📁 New Documents Needed

| Document | Purpose |
|----------|---------|
| `production/frontend_tasks.md` | All UI/UX tasks extracted from audits |
| `production/backend_tasks.md` | All backend/infra tasks extracted |
| `production/production.md` | Master alignment doc (created) |

---

## Proposed Final Document Structure

### Root Level (Agent Entry Points)

```
AGENTS.md       → Single entry point for all agents (humans + AI)
CLAUDE.md       → Simplified redirect to AGENTS.md
TASKS.md        → Current sprint only (max 20 tasks)
ISSUES.md       → Issue tracking
README.md       → Public repo readme
```

### `/docs` (SSOT Engineering Docs)

```
docs/
├── PRD.md            → Product requirements (what we build)
├── FEATURES.md       → Feature checklist (implementation status)
├── ARCHITECTURE.md   → Technical architecture (how we build)
└── DESIGN.md         → Design system (how it looks)
```

### `/production` (Launch Coordination)

```
production/
├── production.md       → Master alignment (current → PRD goal)
├── frontend_tasks.md   → UI/UX tasks extracted
├── backend_tasks.md    → Backend tasks extracted
├── codex.md            → Codex proposal (this file)
├── opus.md             → Opus proposal (Opus writes this)
└── opus_codex.md       → Agreement document
```

### `/audit` (Working Audits)

```
audit/
├── README.md                → Index of all audits
├── [DATED]_[NAME]_AUDIT.md  → Individual audit files
└── (archived to docs-final/ when complete)
```

---

## AGENTS.md — Proposed Final Version

```markdown
# AGENTS.md — Treido Marketplace

Read this first. This is the **single entry point** for humans + AI agents.

## Project

- **Product:** Treido — Bulgarian-first marketplace (C2C + B2B/B2C)
- **Goal:** Ship V1 to production with clean boundaries
- **Stack:** Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + Stripe + next-intl

## Quick Start

```bash
pnpm install          # Install deps
pnpm dev              # Start dev server at localhost:3000
pnpm build            # Production build
```

## Canonical Docs (SSOT)

| Doc | Purpose |
|-----|---------|
| [docs/PRD.md](docs/PRD.md) | What we're building, scope, roadmap |
| [docs/FEATURES.md](docs/FEATURES.md) | Feature checklist (✅/🚧/⬜) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical patterns, boundaries |
| [docs/DESIGN.md](docs/DESIGN.md) | UI tokens, patterns, anti-patterns |

## Rails (Non-Negotiable)

- [ ] No secrets/PII in logs
- [ ] All UI strings via `next-intl`
- [ ] Tailwind v4 only: no gradients, no arbitrary values, no hardcoded colors
- [ ] Default to Server Components
- [ ] Small batches (1-3 files), shippable, with verification

## Code Boundaries

| Location | Contains |
|----------|----------|
| `components/ui/*` | shadcn primitives only |
| `components/shared/*` | Shared composites |
| `components/layout/*` | Shells (header, footer, sidebars) |
| `hooks/*` | Reusable hooks |
| `lib/*` | Pure utilities (no React) |
| `app/[locale]/(group)/_components/*` | Route-private UI |
| `app/[locale]/(group)/_actions/*` | Route-private actions |
| `app/actions/*` | Shared server actions |

## Verification Gates

```bash
pnpm -s typecheck           # TypeScript
pnpm -s lint                # ESLint
pnpm -s test:unit           # Vitest
pnpm -s test:e2e:smoke      # Playwright (with REUSE_EXISTING_SERVER=true)
pnpm -s styles:gate         # Tailwind drift detection
pnpm -s knip                # Unused exports
```

## Workflow

1. Read relevant doc (PRD → FEATURES → ARCHITECTURE → DESIGN)
2. Pick task from TASKS.md
3. Implement in small batch (1-3 files)
4. Run verification gates
5. Update FEATURES.md if feature ships
```

---

## CLAUDE.md — Proposed Final Version

```markdown
# CLAUDE.md — Claude Agent Instructions

> **Read [AGENTS.md](AGENTS.md) first.** This file exists for Claude Code compatibility.

## Instructions

1. Always read `AGENTS.md` at session start
2. Check `docs/FEATURES.md` before implementing anything
3. Keep changes small (1-3 files)
4. Run verification gates after every change
5. Update `docs/FEATURES.md` when shipping features

## Quick Reference

- **Stack:** Next.js 16 + Supabase + Stripe + Tailwind v4
- **i18n:** Use `@/i18n/routing` for Link/useRouter
- **Styling:** Semantic tokens only (no arbitrary values)
- **Caching:** `'use cache'` + `cacheLife()` + `cacheTag()`

See [AGENTS.md](AGENTS.md) for full details.
```

---

## TASKS.md — Proposed Final Version

```markdown
# TASKS.md — Current Sprint

> **Active work only.** Max 20 tasks. Archive completed work to `/docs-final/archive/`.

## Gates

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

## 🔥 In Progress

| Task | Owner | Notes |
|------|-------|-------|
| UI polish: rounded-md alignment | – | Sell flows, cards |
| Accessibility: screen reader labels | – | Icon components |

## 📋 Ready

### Frontend (UI/UX)
- [ ] Consolidate ProductCard variants
- [ ] Fix footer year 2025 → 2026
- [ ] Add step indicator to sell wizard
- [ ] Standardize price formatting
- [ ] Add pagination to product grids

### Backend
- [ ] Fix `as any` in checkout action
- [ ] Fix `as any` in payments webhook
- [ ] Enable leaked password protection
- [ ] Regenerate Supabase types

### Testing
- [ ] Run Lighthouse audit
- [ ] Add E2E tests for admin routes
- [ ] Verify webhook idempotency

## ✅ Done (This Sprint)

| Task | Date |
|------|------|
| Cart page React error fix | 2026-01-28 |
| Missing i18n keys fix | 2026-01-28 |
| Reviews data fix | 2026-01-28 |
| Test data cleanup | 2026-01-28 |

---

*Sprint: January 28-31, 2026*
```

---

## Task Extraction Strategy

### Frontend Tasks (`frontend_tasks.md`)

Extract from:
1. `audit-desktop-2026-01-28/FINAL_AUDIT_REPORT.md` — UI issues
2. `audit/MOBILE_UI_UX_COMPREHENSIVE_AUDIT_2026-01-28.md` — Mobile issues
3. `audit/ACCESSIBILITY_AUDIT_2026-01-28.md` — A11y issues
4. `docs/FEATURES.md` — 🚧 WIP features with UI component

Categories:
- **P1 (Launch Blockers):** Visual bugs, broken UI
- **P2 (Should Fix):** Inconsistencies, UX improvements
- **P3 (Nice to Have):** Polish, enhancements

### Backend Tasks (`backend_tasks.md`)

Extract from:
1. `TASKS.md` — Backend items
2. `audit/supabase.md` — Database/security issues
3. `docs/FEATURES.md` — 🚧 WIP features with backend component

Categories:
- **P1 (Launch Blockers):** Security, TypeScript errors
- **P2 (Should Fix):** Performance, missing validations
- **P3 (Nice to Have):** Cleanup, optimization

---

## Audit Workflow Proposal

### Continuous Audit Loop

```
1. Run automated audit (Playwright screenshots)
2. Compare to DESIGN.md (token compliance)
3. Extract issues to frontend_tasks.md or backend_tasks.md
4. Assign priority (P1/P2/P3)
5. Execute tasks
6. Re-audit affected areas
7. Update docs/FEATURES.md when complete
8. Repeat until no P1/P2 issues remain
```

### Audit Triggers

- Before any PR merge
- After batch of 3+ file changes
- Daily during active development
- Before deployment

---

## Definition of "Perfect Development State"

### Documentation
- [ ] AGENTS.md is single entry point
- [ ] All docs are current (last updated within 7 days)
- [ ] No conflicting information across docs
- [ ] Task extraction complete (frontend + backend separated)

### Codebase
- [ ] All verification gates pass
- [ ] No P1 issues in any audit
- [ ] Feature status matches reality (FEATURES.md accurate)
- [ ] No hardcoded strings (all via next-intl)

### Workflow
- [ ] Clear task → implementation → verification loop
- [ ] Agents can onboard by reading AGENTS.md only
- [ ] Changes are traceable to issues/tasks

---

## Questions for Opus

1. **CLAUDE.md fate:** Should we merge into AGENTS.md or keep as redirect?
2. **Audit frequency:** Daily audits or only before deployment?
3. **Task granularity:** Max task size (1 file? 3 files? feature-level?)
4. **Archive strategy:** What goes to `/docs-final/archive/` vs stays in `/audit/`?

---

## Agreement Points to Resolve with Opus

| Topic | Codex Position | Opus Position | Resolution |
|-------|----------------|---------------|------------|
| CLAUDE.md | Simplify to redirect | ? | TBD |
| TASKS.md scope | Current sprint only | ? | TBD |
| Audit archive | Move completed to docs-final | ? | TBD |
| Task extraction | P1/P2/P3 priority system | ? | TBD |

---

*This proposal awaits Opus's input in `opus.md`. Final agreement in `opus_codex.md`.*

---

*Created: January 28, 2026*
