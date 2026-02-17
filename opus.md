# opus.md — Copilot (Opus) Working Memory

> This file is the persistent context between me (GitHub Copilot / Claude Opus) and the human developer.
> Load this file at the start of every new chat to resume where we left off.
> It tracks: what we've discussed, what we've built, what's in progress, and what's next.

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

---

## Current State of Documentation

| File | Purpose | Status |
|------|---------|--------|
| `AGENTS.md` | Project identity for all AI agents | ✅ Rewritten (Session 3) |
| `ARCHITECTURE.md` | Deep technical reference | ✅ Trimmed (Session 1) |
| `docs/DESIGN.md` | UI/frontend contract | ✅ Current |
| `docs/DOMAINS.md` | Domain contracts (auth/DB/payments) | ✅ Current |
| `docs/DECISIONS.md` | Append-only decision log | ✅ 12 decisions |
| `docs/features/*.md` | Per-feature session memory | ✅ 7 docs + template |
| `REFACTOR.md` | Codex CLI refactor orchestration | ✅ Fresh (Session 2) |
| `TASKS.md` | Active task queue | ✅ Trimmed to active-only (Session 3) |
| `.codex/CLEANUP-DECISIONS.md` | Cleanup decision log | ✅ Active |
| `REQUIREMENTS.md` | Feature list (119 features) | ✅ Reference-only |
| `opus.md` | This file — our working memory | ✅ Active |

---

## Known Issues / Backlog

### Docs
- [ ] More `docs/features/` docs needed: messaging, reviews, wishlist, orders, profiles, admin, onboarding, categories, cart, boost system

### Codebase (for Codex to fix via REFACTOR.md)
- [ ] 200+ "use client" files — many unnecessary
- [ ] Two icon libraries (`@phosphor-icons/react` + `lucide-react`)
- [ ] Heavy deps not in `optimizePackageImports`
- [ ] Missing `loading.tsx` on some routes
- [ ] Caching underutilized (`"use cache"` barely used)
- [ ] `demo/` routes still in production build
- [ ] Some files 400+ lines, need splitting

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
# Tell Codex: "Read REFACTOR.md completely. Read AGENTS.md. Execute Phase 0, then Phase 1."
```

---

*Last updated: 2026-02-17*
