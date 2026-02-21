# Documentation & Agent Architecture — Master Plan

> **Status:** DRAFT v1 — for review and iteration before any implementation.
> **Goal:** Restructure Treido's documentation and agent system so that every AI session starts fast, stays focused, costs minimal context, and produces consistent quality.

---

## 1. Diagnosis — What's Wrong Today

### What's Working
- **AGENTS.md** is lean (~100 lines) and routes to deeper docs. Good entry point.
- **docs/DECISIONS.md** is append-only with a clean format. Excellent.
- **docs/features/*.md** follow a consistent template. Good pattern.
- **Mechanical gates** (styles:gate, architecture:gate) enforce rules without docs. Best practice.

### What's Broken

| Problem | Why it hurts | Example |
|---------|-------------|---------|
| **Every agent reads everything** | A UI agent loads STACK.md, PRD.md, DECISIONS.md, DESIGN.md — most of it irrelevant to painting a button. Context wasted before work starts. | Copilot system prompt imports AGENTS.md + claude.md on every session |
| **DESIGN.md is 578 lines** | Way beyond what any single session needs. Anthropic recommends CLAUDE.md stays "short and human-readable." 578 lines of design tokens, radius scales, and motion rules is a textbook, not a prompt. | Agent reads 578 lines to change a card border radius |
| **Docs duplicate each other** | TASKS.md, WORKFLOW.md, GATES.md, and refactor/CURRENT.md all talk about gates. PRD.md and DESIGN.md both describe brand personality. | "Premium & Clean" defined in both PRD.md and DESIGN.md |
| **No skill/subagent system** | Every session re-discovers the codebase. No persistent memory, no specialized agents, no context isolation. | Every feature build starts with 20+ file reads to "understand" the project |
| **claude.md is a person, not a system** | It defines "who I am" for one persona. Other agents (Copilot, Codex, subagents) can't use it. It's not a project file — it's a personal identity doc. | Copilot loads claude.md but most of it is irrelevant |
| **Too many routing docs** | WORKFLOW.md, FEATURE-MAP.md, GATES.md — meta-docs about where other docs live. Agents don't need a "map of the map." | 3 separate files explaining "what to read when" |
| **refactor/ is sprawling** | 25+ files in refactor/. It's a historical archive, not active work context. | refactor/log.md, 8 *-audit-report.md files, etc. |
| **No task tracking survives sessions** | TASKS.md is a static snapshot. There's no living checklist that persists across agent sessions. | Start new session → must re-read TASKS.md and figure out where we left off |

### Core Insight

The current system was designed for a single orchestrator (claude.md persona) managing Codex workers. That's a valid model but it doesn't scale to:
- Multiple tools (Copilot, Claude Code, Codex, subagents)
- Context-efficient workflows (skills that load only what's needed)
- Persistent learning (agent memory across sessions)

---

## 2. Principles — What Good Looks Like

Based on Anthropic's official docs (Claude Code best practices, skills, subagents, memory) and OpenAI's agent engineering guidance:

### P1: Lean root, deep on demand
- **CLAUDE.md / AGENTS.md:** < 80 lines. Commands, constraints, pointers. Loaded every session.
- **Skills:** Domain knowledge loaded only when relevant. 200-500 lines each.
- **Subagents:** Isolated context for specialized work. Own system prompt, own tools.

### P2: Context is the scarcest resource
- Never load 578 lines of design tokens into a session that's fixing a Stripe webhook.
- Every document earns its place in context by being needed for the current task.
- If a doc isn't needed right now, it should be a skill that Claude loads on demand.

### P3: Skills replace most docs
- A skill is a doc that Claude can invoke. It's the same content, but context-aware.
- Instead of `docs/DESIGN.md` loaded every session, we have `.claude/skills/design/SKILL.md` loaded when doing UI work.
- Skills can include supporting files (reference.md, examples.md) for progressive depth.

### P4: Subagents replace manual delegation
- Instead of you prompting "read these 5 files then do X," a subagent has those 5 files as preloaded skills.
- Each subagent is specialized: UI agent, backend agent, refactor agent, research agent.
- Subagents preserve your main context by doing heavy work in isolation.

### P5: One source of truth per concept
- **Product:** PRD.md (what we build)
- **Constraints:** AGENTS.md (hard rules only)
- **Tasks:** TASKS.md (what to do)
- **Decisions:** DECISIONS.md (why we did things)
- Everything else becomes a skill or gets deleted.

### P6: Persistent memory over repeated discovery
- Agent memory (`memory: project`) lets agents build up knowledge across sessions.
- Instead of re-discovering "we use OKLCH tokens" every session, the UI agent remembers from last time.

---

## 3. Target Architecture

### Root Files (loaded every session)

```
AGENTS.md          — 60-80 lines. Identity, hard constraints, verify command, pointer table.
TASKS.md           — Active work. Launch blockers + current sprint items.
```

### docs/ (human-readable reference, NOT loaded by default)

```
docs/
  PRD.md           — Product context (keep, trim to ~100 lines)
  DECISIONS.md     — Decision log (keep as-is, append-only)
  STACK.md         — Stack config (trim to ~150 lines, move framework howtos to skills)
```

**Deleted/archived:**
- `docs/DESIGN.md` → becomes `.claude/skills/design/SKILL.md` + supporting files
- `docs/WORKFLOW.md` → content absorbed into AGENTS.md or deleted
- `docs/GATES.md` → content absorbed into AGENTS.md verify section
- `docs/FEATURE-MAP.md` → content absorbed into TASKS.md or deleted
- `docs/features/*.md` → become skills (`.claude/skills/<feature>/SKILL.md`)

### .claude/ Structure (skills + agents + rules)

```
.claude/
  CLAUDE.md            — Project memory. Brief. Links to @AGENTS.md.
  rules/
    constraints.md     — Hard rules (from current AGENTS.md § Constraints)
    conventions.md     — Code conventions (from current AGENTS.md § Conventions)
  skills/
    design/
      SKILL.md         — Design system: tokens, patterns, rules (~200 lines)
      tokens.md        — Full token reference (supporting file)
      components.md    — Component patterns (supporting file)
      responsive.md    — Responsive strategy (supporting file)
    auth/
      SKILL.md         — Auth feature context + implementation guide
    checkout/
      SKILL.md         — Checkout/payments feature context
    search/
      SKILL.md         — Search/filters feature context
    sell-flow/
      SKILL.md         — Sell flow feature context
    product-cards/
      SKILL.md         — Product card variants, patterns
    supabase/
      SKILL.md         — Supabase client selection, RLS, query patterns
    stripe/
      SKILL.md         — Stripe setup, webhooks, Connect, fee model
    i18n/
      SKILL.md         — next-intl patterns, message conventions
    refactor/
      SKILL.md         — Refactoring workflow, shared rules, current batch
    research/
      SKILL.md         — How to research the codebase efficiently
  agents/
    ui-engineer.md     — UI/frontend specialist subagent
    backend-engineer.md — Backend/API/data specialist subagent
    refactorer.md      — Refactoring specialist subagent
    researcher.md      — Read-only research subagent
    reviewer.md        — Code review/quality subagent
```

### Agent Definitions (examples)

**ui-engineer.md:**
```yaml
---
name: ui-engineer
description: UI/UX implementation specialist. Use when building or modifying any visual component, page, layout, or styling. Use proactively for UI work.
tools: Read, Edit, Write, Bash, Grep, Glob
skills:
  - design
  - product-cards
model: inherit
memory: project
---

You are a senior frontend engineer specializing in modern React UI.
You build pixel-perfect, accessible, responsive components for Treido.

Before starting any UI work:
1. Load the design skill for token and pattern reference
2. Check the component exists — read it fully before modifying
3. Use semantic tokens only (never palette classes, hex, or arbitrary values)
4. Test at 375px, 768px, 1280px breakpoints

After completing UI work:
- Run: pnpm -s styles:gate
- Run: pnpm -s typecheck
- Save patterns you discover to your memory
```

**researcher.md:**
```yaml
---
name: researcher
description: Codebase research and exploration agent. Use proactively when needing to understand code, find files, or analyze patterns. Read-only.
tools: Read, Grep, Glob, Bash
model: haiku
memory: project
---

You are a research specialist for the Treido codebase.
Your job is to explore, search, and report findings efficiently.

When researching:
1. Start with Glob to find relevant files
2. Use Grep for specific patterns
3. Read only the sections you need
4. Return concise findings with file paths and line numbers

Save useful discoveries to your memory for future sessions.
```

---

## 4. Migration Phases

### Phase 0: Plan Review (NOW)
- [ ] Review this plan together
- [ ] Decide what to cut, what to adjust
- [ ] Agree on naming and structure conventions
- [ ] Decide: keep docs/ as archive or fully replace with skills?

### Phase 1: Foundation (~1 session)
- [ ] Create `.claude/` directory structure
- [ ] Create `.claude/CLAUDE.md` (brief project memory)
- [ ] Create `.claude/rules/constraints.md` (from AGENTS.md § Constraints)
- [ ] Create `.claude/rules/conventions.md` (from AGENTS.md § Conventions)
- [ ] Slim down AGENTS.md to ~60-80 lines (identity + pointers + verify)

### Phase 2: Skills (~2-3 sessions)
- [ ] Create `design` skill (extract from DESIGN.md, split into SKILL.md + supporting files)
- [ ] Create `supabase` skill (extract from STACK.md)
- [ ] Create `stripe` skill (extract from STACK.md + features/checkout-payments.md)
- [ ] Create `i18n` skill (extract from STACK.md)
- [ ] Create feature skills: auth, search, sell-flow, product-cards, checkout
- [ ] Create `refactor` skill (extract from refactor/shared-rules.md + refactor/CURRENT.md state)
- [ ] Create `research` skill (new — how to explore this codebase)

### Phase 3: Agents (~1 session)
- [ ] Create `ui-engineer` agent
- [ ] Create `backend-engineer` agent
- [ ] Create `researcher` agent
- [ ] Create `reviewer` agent
- [ ] Create `refactorer` agent

### Phase 4: Cleanup (~1 session)
- [ ] Trim STACK.md (remove content now in skills)
- [ ] Trim/archive PRD.md to essentials
- [ ] Delete WORKFLOW.md, GATES.md, FEATURE-MAP.md (absorbed)
- [ ] Archive refactor/ reports (keep CURRENT.md, archive the rest)
- [ ] Update .github/copilot-instructions.md to point at new structure
- [ ] Update claude.md role to match new system

### Phase 5: Validate
- [ ] Test: start fresh session, build a UI component using ui-engineer agent
- [ ] Test: start fresh session, fix a backend bug using backend-engineer agent
- [ ] Test: research a question using researcher agent
- [ ] Measure: context consumption compared to current system
- [ ] Iterate: adjust skill content, agent prompts, memory based on results

---

## 5. Key Design Decisions to Make

| # | Question | My Leaning | Why |
|---|----------|-----------|-----|
| 1 | **Keep docs/ or replace entirely with skills?** | Keep docs/ as slim human-readable reference. Skills contain the same info in agent-optimized format. | Humans may want to read docs too. But we don't duplicate — skills are the SSOT, docs/ links to them. |
| 2 | **One mega design skill or split?** | Split: SKILL.md (~200 lines) + tokens.md, components.md, responsive.md as supporting files | Anthropic recommends SKILL.md under 500 lines. Supporting files load on demand. |
| 3 | **Agent memory scope?** | `project` (not `user`) — checked into .claude/, team-shareable | Our agents learn project-specific patterns, not personal preferences |
| 4 | **How many agents?** | 5 to start (ui, backend, researcher, reviewer, refactorer) | Each agent should "excel at one specific task" per Anthropic's guidance. Can add more later. |
| 5 | **What stays in root AGENTS.md?** | Identity (1 para), hard constraints (~10 lines), conventions (~10 lines), verify command, pointer table | Everything else goes to skills/rules. AGENTS.md is the "map, not the manual." |
| 6 | **What about claude.md?** | Repurpose as personal orchestrator notes. Not loaded by other agents. | claude.md is for the human-AI partner relationship. Agents don't need "who I am" philosophy. |
| 7 | **Copilot instructions?** | `.github/copilot-instructions.md` points to AGENTS.md + says "use skills when available" | Keeps Copilot aligned with the same system without duplicating |

---

## 6. What This Unlocks

| Before | After |
|--------|-------|
| Every session loads ~2000 lines of docs | Every session loads ~80 lines. Skills load on demand (~200-500 lines each). |
| One-size-fits-all context | Specialized agents with preloaded domain knowledge |
| No cross-session learning | Agents build memory: patterns, gotchas, common operations |
| Context exhausted by exploration | Researcher agent explores in isolation, returns summary |
| Manual "read X, Y, Z files" prompts | Agent auto-loads relevant skills based on task description |
| 578-line DESIGN.md loaded for webhook fix | Design skill loaded only when Claude is doing UI work |
| Re-discover codebase every session | Agent memory remembers file locations, patterns, decisions |

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Skills too granular → too many to maintain | Start with ~10 skills. Only split when a skill exceeds 500 lines. |
| Agents don't get enough context | Agent prompts say "load X skill before starting." Skills can reference supporting files. |
| Skills get stale | Skills are the SSOT — when code changes, update the skill. Same discipline as today's docs. |
| Too much upfront work | 4-phase rollout. Each phase is self-contained and adds value. |
| Copilot/VS Code can't use skills | Skills are just .md files — any AI tool can read them. Copilot instructions point to AGENTS.md which points to skills. |
| Agent sprawl (too many agents) | 5 agents max to start. "Will this agent be used weekly?" test before adding. |

---

*This is a plan. We review it, iterate on it, and only then build it in phases.*
*Created: 2026-02-20*
