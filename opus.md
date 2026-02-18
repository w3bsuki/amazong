# opus.md — ARCHIVED

> **This file is superseded by `claude.md` + `claude/log.md`.**
> - `claude.md` — current state and role (read this at session start)
> - `claude/log.md` — session history archive
>
> This file is kept for historical reference only. Do not update it.

---

# Original Content (archived 2026-02-17)

---

## Who We Are

- **Human:** Solo developer building Treido (www.treido.eu), a mobile-first marketplace.
- **Opus:** Primary AI pair-programmer. Handles docs architecture, deep audits, strategy, and complex refactors.
- **Codex CLI:** Autonomous agent for bulk execution work. Reads instruction files we create and executes phases.

**Division of labor:**
- Opus + Human → strategy, design, docs, complex decisions, code review, orchestration docs
- Codex CLI → bulk refactoring, file-by-file audits, mechanical cleanup, phase execution

---

## Project Identity

**Treido** — mobile-first marketplace. Next.js 16, React 19, TypeScript, Tailwind CSS v4 (CSS-first), shadcn/ui, Supabase (Postgres + RLS), Stripe Connect, next-intl (en/bg). 87% feature-complete, deployed at treido.eu. In launch-readiness hardening.

For full project identity → read `AGENTS.md`.

---

## What We've Built Together

### Session 1 — 2026-02-16: AI-Optimal Documentation System

**Problem:** Docs were scattered, redundant, and bloated. AI agents wasted context tokens loading irrelevant info. No session-to-session memory for features.

**What we did:**
1. Read every existing doc (~15 files) and the full project structure
2. Designed a 3-tier doc system:
   - **Tier 1 (always loaded):** `AGENTS.md` — project identity, conventions, rules, component map (~195 lines)
   - **Tier 2 (load per task):** `ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/DOMAINS.md`, `docs/DECISIONS.md`
   - **Tier 3 (load per feature):** `docs/features/<feature>.md` — incremental, created as features are built
3. Rewrote `AGENTS.md` from ~50 lines to ~195 lines (comprehensive but tight)
4. Created `docs/features/` system with template + 7 initial feature docs:
   - `bottom-nav.md`, `auth.md`, `product-cards.md`, `header.md`, `checkout-payments.md`, `search-filters.md`, `sell-flow.md`
5. Deleted redundant docs: `docs/PRINCIPLES.md`, `docs/QUALITY.md`
6. Trimmed `ARCHITECTURE.md` from 360→220 lines (removed sections now in AGENTS.md)
7. Trimmed `.github/copilot-instructions.md` to a 4-line pointer to AGENTS.md
8. Investigated style gate scanners (6 scripts) — all pass, confirmed they don't scan .md files

**Files changed:** `AGENTS.md`, `ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/DOMAINS.md`, `.github/copilot-instructions.md`
**Files created:** `docs/features/TEMPLATE.md`, 7 feature docs
**Files deleted:** `docs/PRINCIPLES.md`, `docs/QUALITY.md`

### Session 2 — 2026-02-17: Codex Refactor Orchestration

**Problem:** Codebase is bloated. 200+ "use client" files, two icon libraries, heavy deps not tree-shaken, missing caching, architectural inconsistencies. Need an autonomous agent to systematically clean it up.

**What we did:**
1. Read all existing cleanup guides (`cleanup/AGENTS.md`, `cleanup/README.md`, 10 phase files)
2. Read `TASKS.md` (374 lines) and `.codex/CLEANUP-DECISIONS.md` (203 lines of prior cleanup decisions)
3. Audited current bloat signals: 200+ "use client" files, dual icon libs, 3 AI SDK providers, missing optimizePackageImports
4. Created `REFACTOR.md` (~810 lines) — full autonomous orchestration document for Codex CLI:
   - Section 0: How You Work (mindset, operating rules, session lifecycle)
   - Section 1: Project Context (what's done vs what remains)
   - Section 2: Rules (do/don't/stop-and-flag)
   - Section 3: Latest docs URLs to fetch per phase
   - Section 4: Naming & structure standards (forbidden patterns, architecture boundaries)
   - Section 5: Known bloat signals (12 identified issues)
   - Phases 0-9: Baseline → Architecture → Server/Client → Dynamic Imports → Caching → Deps → Routes → CSS → Code Quality → Final Verification
   - Section 7: Subagent deep audit template (9-point per-file checklist)
   - Section 8: Progress tracker (checkboxes per phase)
   - Section 9: Session log (append-only, session-to-session memory)

**Key design decisions:**
- REFACTOR.md teaches Codex HOW TO THINK, not just what to do
- Island Pattern documented for server/client splitting
- Subagent template with emoji-coded output (CLEAN/FIX/DELETE/MOVE/SPLIT/FLAG)
- Progress tracker + session log = multi-session continuity

**Files created:** `REFACTOR.md`

### Session 3 — 2026-02-17: Agent-Optimal Doc Hardening

**Problem:** Docs had redundancy (4 overlapping orchestration docs), stale files, TASKS.md was 80% completed tasks, and AGENTS.md lacked proper pointers to tier-2/3 docs. Needed research on how OpenAI Codex, Claude Code, and GitHub Copilot actually consume project docs, then optimize accordingly.

**Research done:**
1. Fetched OpenAI Codex introduction docs — key finding: Codex system prompt mandates running ALL programmatic checks found in AGENTS.md
2. Fetched GitHub Copilot custom instructions docs — supports AGENTS.md, .github/copilot-instructions.md, path-specific .instructions.md
3. Fetched Claude Code memory docs — uses CLAUDE.md files, .claude/rules/, auto-memory
4. Fetched agents.md spec repo — sample format: dev environment tips, testing, PR instructions

**What we did:**
1. **Deleted `cleanup/` directory** (12 files) — redundant with REFACTOR.md. Files: AGENTS.md, README.md, root.md, shadcn.md, nextjs.md, tailwind.md, components.md, supabase.md, stripe.md, i18n.md, tests.md, hooks-and-lib.md
2. **Deleted stale `.codex/` files:** CLEANUP-SWEEP.md, PHASE2-FEATURE-ALIGNMENT.md, locks/
3. **Trimmed TASKS.md** from 374→35 lines — active-only (4 launch blockers + 5 backlog + pointer to REFACTOR.md)
4. **Rewrote AGENTS.md** from scratch (~165 lines):
   - Verification commands moved to 2nd section (Codex system prompt looks for these early)
   - Added "Deep Context — Documentation Map" with pointers to ALL tier-2/3 docs
   - Leaner conventions tables
   - Punchier rules section
5. **Updated `.github/copilot-instructions.md`** to match new AGENTS.md structure

**Key insight:** Codex's system prompt says "Find and run any programmatic checks in AGENTS.md." Moving verification near the top ensures every agent hits it immediately.

**Files deleted:** `cleanup/` (12 files), `.codex/CLEANUP-SWEEP.md`, `.codex/PHASE2-FEATURE-ALIGNMENT.md`, `.codex/locks/`
**Files rewritten:** `AGENTS.md`, `TASKS.md`
**Files updated:** `.github/copilot-instructions.md`, `opus.md`

### Session 4 — 2026-02-17: Refactor Orchestration System v2

**Problem:** Codex CLI sessions had no continuity. REFACTOR.md was 810 lines — too long for any agent to consume efficiently. No "where are we now" file. Agents didn't know what was done or what to do next. The refactor/ folder had good content but terrible navigation.

**Research done:**
1. Fetched Codex CLI docs — key finding: reads AGENTS.md from repo root + CWD, merges top-down. System prompt looks for verification commands.
2. Fetched Claude Code memory docs — hierarchical CLAUDE.md system, auto-memory in ~/.claude/projects/, path-specific rules.
3. Fetched GitHub Copilot custom instructions docs — supports AGENTS.md, .github/copilot-instructions.md, path-specific .instructions.md.

**What we built: The 3-file context model**

An AI agent needs exactly 3 things per session:
1. **Identity** (~165 lines) — What is this project? Rules? → Root `AGENTS.md` (auto-loaded)
2. **Task** (~40 lines) — What should I do right now? → `refactor/CURRENT.md` (the session bookmark)
3. **Instructions** (~80 lines) — How exactly? → `refactor/phase3/agent1.md` (task-specific)

Total context: ~285 lines. Previous system: ~810 lines of REFACTOR.md alone.

**Key innovation: CURRENT.md**
A single file that changes after every session. It tells any new agent:
- Current phase and status
- Current metrics (table)
- Task queue with checkboxes (pick first unchecked)
- Session protocol (step by step)
- End-of-session checklist

This is the "bookmark" — the bridge between sessions.

**Files created:**
- `refactor/CURRENT.md` — session continuity hub
- `refactor/log.md` — session history (extracted from REFACTOR.md)

**Files rewritten:**
- `AGENTS.md` — added "Active Work — Refactor" section with clear routing to CURRENT.md, added refactor/ to project map, tightened deep context table
- `refactor/AGENTS.md` — slimmed from verbose protocol to concise pointer doc
- `refactor/tasks.md` — updated to current state, added metrics-over-time table, fixed stale statuses

**Files updated:**
- `TASKS.md` — fixed stale refactor reference ("Phase 2 is next" → "Phase 3 is next")
- `.github/copilot-instructions.md` — point to CURRENT.md instead of REFACTOR.md
- `opus.md` — this entry

### Session 5 — 2026-02-17: AGENTS.md v3 — Kill the Verification Spam

**Problem:** Codex was spamming `pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate` after every single file edit, wasting most of its context window on running commands instead of understanding code. Root cause: verification commands appeared in **9 different places** across the files Codex loads per session, and `# Always — after every file change:` in AGENTS.md literally instructed it to run the full gate on every edit.

**Research done:**
1. Fetched Codex CLI README — confirmed system prompt behavior: "Find and run any programmatic checks in AGENTS.md"
2. Read OpenAI's own Codex repo AGENTS.md — their format prioritizes conventions over verification
3. Audited all 9 places verification commands appeared (AGENTS.md, shared-rules.md, CURRENT.md, 6 task files)

**Root cause analysis:**
- AGENTS.md §2 "Verify (Run After Every Change)" with comment `# Always — after every file change:` → Codex treated this as "run full suite after every file edit"
- shared-rules.md §1 "Verification (After Every Change)" repeated same commands in tiered form
- CURRENT.md "Session End Checklist" repeated same commands again
- Every task file had its own "## Verification" with per-change typecheck commands
- Total duplication: 9 code blocks telling Codex to verify → agent spent more time verifying than coding

**What we did:**
1. **Rewrote AGENTS.md from scratch** (~85 lines, down from ~165):
   - "How to Work" section leads with cognitive instructions (read before writing, grep before deleting, think in batches)
   - Context loading table as first-class navigation
   - Compact codebase map (dual-column layout)
   - Stack table trimmed to essentials
   - Constraints section — only damage-prevention rules
   - Conventions — 6 compact lines
   - Active Work — 1-line pointer to CURRENT.md
   - **Verify section at the END** with exactly ONE code block: "Run once when your task is complete"
2. **Cleaned shared-rules.md**: Removed entire "Verification (After Every Change)" section + redundant "Project Context" footer
3. **Cleaned CURRENT.md**: Removed "Session End Checklist" code block, simplified session protocol to reference AGENTS.md
4. **Updated all 6 task files** (phase3/agent1-3, phase4/agent1-3): Replaced each task's ## Verification section with "See root `AGENTS.md` § Verify"
5. **Updated .github/copilot-instructions.md**: Fixed section reference

**Key design changes:**
- Verification commands now exist in EXACTLY ONE PLACE: AGENTS.md § Verify (last section)
- "After every file change" → "Run once when your task is complete"
- "Think in batches" instruction explicitly tells Codex NOT to verify after every edit
- Cognitive instructions ("read before writing") positioned before mechanical ones
- ~48% reduction in total instruction text loaded per refactor session (405 lines → ~210 lines)

**Files changed:** `AGENTS.md`, `refactor/shared-rules.md`, `refactor/CURRENT.md`, 6 task files, `.github/copilot-instructions.md`

---

## Current State of Documentation

| File | Purpose | Status |
|------|---------|--------|
| `AGENTS.md` | Project identity for all AI agents | ✅ Rewritten (Session 4) |
| `refactor/CURRENT.md` | **Session continuity** — what to do now | ✅ New (Session 4) |
| `refactor/log.md` | Session history (append-only) | ✅ New (Session 4) |
| `refactor/shared-rules.md` | Mandatory refactor rules | ✅ Current |
| `refactor/tasks.md` | Progress tracker with metrics | ✅ Updated (Session 4) |
| `refactor/phase3/*.md` | Phase 3 task files | ✅ Ready |
| `refactor/phase4/*.md` | Phase 4 task files | ✅ Ready |
| `REFACTOR.md` | Full refactor knowledge base (reference) | ✅ Reference-only |
| `ARCHITECTURE.md` | Deep technical reference | ✅ Current |
| `docs/DESIGN.md` | UI/frontend contract | ✅ Current |
| `docs/DOMAINS.md` | Domain contracts (auth/DB/payments) | ✅ Current |
| `docs/DECISIONS.md` | Append-only decision log | ✅ 12 decisions |
| `docs/features/*.md` | Per-feature session memory | ✅ 7 docs + template |
| `TASKS.md` | Active task queue | ✅ Updated (Session 4) |
| `opus.md` | This file — our working memory | ✅ Active |

---

## Known Issues / Backlog

### Docs
- [ ] More `docs/features/` docs needed: messaging, reviews, wishlist, orders, profiles, admin, onboarding, categories, cart, boost system

### Codebase (tracked in refactor/CURRENT.md)
- [x] ~~200+ "use client" files~~ — reduced from 357 → 215 (Phases 1-2)
- [x] ~~Two icon libraries~~ — consolidated to lucide-react only (Session 3)
- [x] ~~Missing `loading.tsx`~~ — all routes now have loading states (Phase 1)
- [x] ~~Demo routes~~ — removed (Session 3)
- [ ] Caching underutilized (`"use cache"` barely used) → Phase 3, Agent 1
- [ ] Some files 400+ lines, need splitting → Phase 4, Agent 3
- [ ] 53 pages missing metadata → Phase 4, Agent 1
- [ ] Unused dependencies → Phase 3, Agent 3

### Product (human decisions needed)
- [ ] LAUNCH-001 through LAUNCH-004 and LAUNCH-007 still open in TASKS.md
- [ ] BACKLOG-005 through BACKLOG-008 (buyer protection, email, PDP improvements)

---

## Conventions Between Us

1. **Load this file first** in any new chat. It's our shared memory.
2. **Update this file** at the end of significant sessions (new section under "What We've Built Together").
3. **For Codex work:** we design orchestration docs here, Codex executes them autonomously.
4. **For codebase questions:** I read `AGENTS.md` first, then the relevant tier 2/3 doc.
5. **For feature work:** check `docs/features/<feature>.md` if it exists, create one after building.
6. **Verification after changes:** `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate`
7. **High-risk pause:** DB schema, auth, payments, destructive ops → always discuss first.

---

## Quick Reference

```bash
# Verify everything
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate

# Unit tests
pnpm -s test:unit

# E2E smoke (with dev server running)
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

# Bundle analysis
ANALYZE=true pnpm build

# Dead code detection
pnpm -s knip

# Duplicate code detection
pnpm -s dupes

# Start Codex refactor session
# Tell Codex: "Read refactor/CURRENT.md. Execute the next unchecked task."
```

---

*Last updated: 2026-02-17*
