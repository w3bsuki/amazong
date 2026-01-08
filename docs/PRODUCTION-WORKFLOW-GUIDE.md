# Production Workflow Guide: Final 5-10% Push + Daily Improvements

> **Purpose**: A research-backed, actionable guide for shipping this project to production and maintaining daily improvement velocity with AI-assisted workflows.
> 
> **Created**: January 8, 2026 | **Status**: Canonical Reference

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Research: The Final 10% Problem](#research-the-final-10-problem)
3. [Research: Claude Skills & Agent Workflows](#research-claude-skills--agent-workflows)
4. [Verdict: Is It Overengineering?](#verdict-is-it-overengineering)
5. [Our Implementation](#our-implementation)
6. [Daily Improvement Workflow](#daily-improvement-workflow)
7. [Active Docs System](#active-docs-system)
8. [Audit & Session Logging](#audit--session-logging)
9. [Quick Reference](#quick-reference)

---

## Executive Summary

### Key Findings

1. **The final 5-10%** is universally painful—it's not about code, it's about polish, edge cases, and integration debt.

2. **Claude Skills are NOT overengineering for us**—we already have 3 skills, a `CLAUDE.md`, and structured rules. The value is:
   - Consistent execution (no forgetting steps)
   - Domain knowledge preserved across sessions
   - Parallel work without conflicts
   - Audit trails for quality

3. **Opus 4.5 works best with**:
   - Clear project memory (`CLAUDE.md`)
   - Small, focused tasks (1-3 files)
   - Verification gates (typecheck + tests)
   - Progressive disclosure (skills load on-demand)

4. **Daily improvement workflow**:
   - Small touches, not huge reworks
   - TODO → Pick → Execute → Gates → Done
   - Session logs for continuity

---

## Research: The Final 10% Problem

### What Makes the Final Push Hard

From industry sources (Anthropic Engineering, Pragmatic Engineer, and shipped projects):

| Problem | Why It Happens | Mitigation |
|---------|----------------|------------|
| **Polish debt** | Core features prioritized over UX refinement | Schedule polish sprints, not "later" |
| **Integration gaps** | Components work in isolation, fail together | E2E tests on critical flows |
| **Config drift** | Local works, production doesn't | Env parity checks, staging deploy |
| **Edge cases** | Happy path tested, error states forgotten | Negative test cases, error boundary audit |
| **Performance cliffs** | Dev data is small, prod data isn't | Load testing, query optimization passes |
| **Security holes** | RLS/auth "works" but has gaps | Security advisors, auth flow audit |

### The 90-90 Rule (Tom Cargill)

> "The first 90% of the code accounts for the first 90% of the development time. The remaining 10% of the code accounts for the other 90% of the development time."

**Implication**: The final push isn't a linear continuation—it requires a different mode of work.

### Why AI Assistants Help Here

The final 10% is:
- **Tedious** (fixing typos, aligning spacing, adding error states)
- **Systematic** (run same checks across all routes)
- **Knowledge-heavy** (remembering all the edge cases)

AI assistants excel at tedious, systematic, knowledge-heavy work—IF properly guided.

---

## Research: Claude Skills & Agent Workflows

### What Are Claude Skills?

From [Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills):

> "Skills are organized folders of instructions, scripts, and resources that agents can discover and load dynamically to perform better at specific tasks."

**Key architecture**:
```
skill-name/
├── SKILL.md          # Required: metadata + instructions
├── reference.md      # Optional: detailed docs (loaded on-demand)
└── scripts/
    └── helper.py     # Optional: executable tools
```

**Progressive disclosure**:
1. **Startup**: Only `name` and `description` loaded (fast, low tokens)
2. **Triggered**: Full `SKILL.md` loaded when task matches
3. **Deep dive**: Reference files loaded only when needed

### Skills vs Other Customization

| Mechanism | When to Use | Trigger |
|-----------|-------------|---------|
| **Skills** | Specialized workflows (audit, review, deploy) | Claude decides based on description |
| **Slash commands** | Reusable prompts (`/deploy staging`) | You type `/command` |
| **CLAUDE.md** | Project-wide context (every conversation) | Always loaded |
| **Rules** | Path-specific instructions (e.g., only for `.ts` files) | Loaded when working on matching files |
| **Subagents** | Isolated tasks with own tool access | Explicit delegation |

### Best Practices from Anthropic

From [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices):

1. **CLAUDE.md tuning**: "Your `CLAUDE.md` files become part of Claude's prompts, so they should be refined like any frequently used prompt."

2. **Workflow patterns**:
   - **Explore → Plan → Code → Commit**: Don't jump to coding
   - **Write tests → Code → Iterate**: TDD works better with agents
   - **Screenshot → Iterate**: Visual feedback loop

3. **Think triggers**: "think" < "think hard" < "think harder" < "ultrathink" allocate progressively more reasoning budget.

4. **Context management**: Use `/clear` between tasks to avoid context pollution.

5. **Multi-Claude workflows**: Anthropic engineers run 3-4 parallel Claude instances in git worktrees.

### Memory Hierarchy

From [Claude Code Memory Docs](https://code.claude.com/docs/en/memory):

```
Enterprise policy  →  Org-wide (IT-managed)
Project memory     →  Team (./CLAUDE.md or ./.claude/CLAUDE.md)
Project rules      →  Topic-specific (./.claude/rules/*.md)
User memory        →  Personal (~/.claude/CLAUDE.md)
Project local      →  Personal per-project (./CLAUDE.local.md)
```

**We use**: Project memory (`CLAUDE.md`) + Project rules (`.claude/rules/`) + Skills (`.claude/skills/`)

---

## Verdict: Is It Overengineering?

### Short Answer: **No, it's right-sized for us.**

### Evidence

| Factor | Our Status | Verdict |
|--------|------------|---------|
| **Project complexity** | Next.js 16 + Supabase + Stripe + i18n | Skills help manage domain complexity |
| **Existing structure** | Already have 3 skills, CLAUDE.md, 7 rules | Just need to use them consistently |
| **Team size** | Small (1-2 devs + AI) | Skills = "team knowledge" that persists |
| **Session continuity** | Multiple sessions per day | Skills ensure consistency across sessions |
| **Audit needs** | Pre-production quality bar | Skills embed verification steps |

### What Would Be Overengineering

- Creating 20+ skills before validating 3
- Building custom skill management tooling
- MCP servers we don't need
- Complex multi-agent orchestration for simple tasks

### Our Approach: Minimal Viable Skills

We have 3 skills that cover our main workflows:
1. `treido-dev` — Daily development workflow
2. `tailwind-audit` — UI/styling consistency
3. `supabase-audit` — Backend security/performance

**Rule**: Add skills only when a pattern repeats 3+ times.

---

## Our Implementation

### Current Setup (Already Done)

```
.claude/
├── CLAUDE.md              # Project memory (stack, conventions, commands)
├── settings.json          # Claude Code settings
├── rules/                 # Topic-specific instructions
│   ├── backend-architect.md
│   ├── frontend-ui.md
│   ├── i18n.md
│   ├── nextjs-app-router.md
│   ├── stripe-payments.md
│   ├── supabase-auth-db.md
│   └── ux-flows.md
└── skills/                # Triggered workflows
    ├── treido-dev/SKILL.md
    ├── tailwind-audit/SKILL.md
    └── supabase-audit/SKILL.md
```

### How Skills Trigger

| Prefix | Skill | What It Does |
|--------|-------|--------------|
| `TREIDO:` | treido-dev | Read TODO → Pick task → Execute → Gates |
| `TAILWIND:` | tailwind-audit | Scan tokens → Check arbitrary values → Report |
| `SUPABASE:` | supabase-audit | Run advisors → Check RLS → Report |

### Skill Design Principles

1. **One file, one purpose**: Each `SKILL.md` fits in ~100 lines
2. **MCP commands documented**: Skills include the exact MCP calls
3. **Gates included**: Every skill ends with verification steps
4. **Docs linked**: Reference external docs, don't duplicate

---

## Daily Improvement Workflow

### The Core Loop

```
┌─────────────────────────────────────────────────────────────┐
│  DAILY IMPROVEMENT WORKFLOW                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. START SESSION                                           │
│     └─ Read TODO.md (or say "TREIDO: what's next?")        │
│                                                             │
│  2. PICK ONE TASK                                           │
│     └─ Max 3 files, clear done-when                        │
│                                                             │
│  3. EXECUTE                                                 │
│     └─ Use relevant skill prefix if applicable             │
│     └─ Small changes, verify as you go                     │
│                                                             │
│  4. RUN GATES                                               │
│     └─ pnpm -s exec tsc -p tsconfig.json --noEmit          │
│     └─ REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke      │
│                                                             │
│  5. LOG & CLOSE                                             │
│     └─ Check off in TODO.md                                │
│     └─ Move to "Done Today"                                │
│     └─ Optional: add session note                          │
│                                                             │
│  REPEAT (2-4 tasks per day is healthy)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Task Size Guidelines

| Size | Files | Time | Example |
|------|-------|------|---------|
| **Tiny** | 1 file | 5-15 min | Fix typo, adjust spacing |
| **Small** | 2-3 files | 15-45 min | Add error state, fix component |
| **Medium** | 3-5 files | 45-90 min | Refactor function, add feature |
| **Too Big** | 5+ files | > 90 min | **Split it** |

### Prompt Templates

**General daily work:**
```
TREIDO: what's next?
```

**Specific audit:**
```
TAILWIND: audit the ProductCard component for arbitrary values
```

**Specific fix:**
```
Fix the spacing in components/shared/ProductCard.tsx — 
use gap-2 instead of gap-1.5, verify dark mode works
```

**Research before doing:**
```
ultrathink: how should we handle error states in the checkout flow?
Plan only, don't code yet.
```

### When to Use Extended Thinking

| Trigger | Budget | Use For |
|---------|--------|---------|
| `think` | Low | Simple planning |
| `think hard` | Medium | Multi-step tasks |
| `think harder` | High | Architecture decisions |
| `ultrathink` | Maximum | Complex problems, audits |

---

## Active Docs System

### Document Hierarchy

```
docs/
├── PRODUCTION.md              # Ship checklist (blockers + gates)
├── ENGINEERING.md             # Stack rules + boundaries
├── DESIGN.md                  # UI/UX tokens + patterns
├── PRODUCTION-WORKFLOW-GUIDE.md  # THIS FILE
└── GPTVSOPUSFINAL.md          # Agent roles + lane model

Root files:
├── TODO.md                    # Active backlog (single source of truth)
├── agents.md                  # Agent instructions (attached to this workspace)
└── CLAUDE.md                  # Project memory (auto-loaded)
```

### TODO.md Structure

```markdown
# TODO

## Gates (run after changes)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Open (Prioritized)
- [ ] Task 1 — brief description
- [ ] Task 2 — brief description

## Blocked on Human
- [ ] Task needing human input — why blocked

## Done Today
- [x] Completed task — what changed
```

### TASK-*.md for Active Work (Optional)

Use only for complex multi-step work:

```markdown
# TASK: fix-checkout-error-states

Created: 2026-01-08
Status: IN_PROGRESS

## Objective
Add proper error handling to checkout flow

## Files
- app/[locale]/(checkout)/checkout/page.tsx
- components/checkout/CheckoutForm.tsx

## Done When
- [ ] Network errors show user-friendly message
- [ ] Validation errors highlight fields
- [ ] Gates pass

## Handoff
Files changed: (fill after done)
How to verify: (fill after done)
```

**Rule**: Delete TASK files after completion. Keep max 3 active.

---

## Audit & Session Logging

### Per-Session Notes (Lightweight)

Add to "Done Today" section in TODO.md:

```markdown
## Done Today

- [x] Fixed ProductCard spacing — `components/shared/ProductCard.tsx`, gap-2 instead of gap-1.5
- [x] Added error boundary to checkout — `app/[locale]/(checkout)/layout.tsx`
```

### Weekly Summary (Optional)

Create `docs/logs/week-YYYY-WW.md` for significant changes:

```markdown
# Week 2026-02

## Summary
- Checkout flow stabilized (3 bugs fixed)
- Tailwind audit: 13 → 8 gradient violations
- Supabase security: 0 new advisors

## Key Changes
- `lib/data/products.ts` — added cacheTag granularity
- `app/[locale]/(checkout)/*` — error states complete

## Blockers Resolved
- Stripe webhook verified in production

## Next Week
- Complete gradient removal
- Performance pass on search
```

### MCP Audit Outputs

When running audits, save structured output:

```markdown
## Supabase Lane Audit — 2026-01-08

### Critical
- [ ] `orders` table missing RLS policy for seller access

### High
- [ ] `products` queries use `select('*')` in 3 places

### Deferred
- [ ] Consider index on `products.category_id`
```

---

## Quick Reference

### Gates (Memorize These)

```bash
# Typecheck (always)
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke (always)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Full E2E (before deploy)
REUSE_EXISTING_SERVER=true pnpm test:e2e

# Build (before deploy)
pnpm build
```

### Skill Prefixes

| Prefix | When to Use |
|--------|-------------|
| `TREIDO:` | General development, pick next task |
| `TAILWIND:` | UI/styling audits and fixes |
| `SUPABASE:` | Database/RLS audits and fixes |

### MCP Quick Commands

```javascript
// Supabase security check
mcp_supabase_get_advisors({ type: "security" })

// Supabase performance check
mcp_supabase_get_advisors({ type: "performance" })

// shadcn components
mcp_shadcn_list_items_in_registries({ registries: ["@shadcn"] })

// Tailwind docs
mcp_io_github_ups_get-library-docs({ 
  context7CompatibleLibraryID: "/tailwindlabs/tailwindcss", 
  topic: "theme" 
})
```

### Rules of the Road

1. **1-3 files per change** (max 5 if truly one behavior)
2. **No gradients** (design rule)
3. **No arbitrary Tailwind values** unless absolutely necessary
4. **No `select('*')`** in hot paths
5. **No secrets in logs**
6. **All strings via next-intl** (en.json + bg.json)
7. **Gates must pass** before marking done

### When to Escalate

- Gate failures after 2 fix attempts
- Changes requiring human judgment (design, business logic)
- Security-sensitive changes (auth, payments, RLS)
- Changes touching 5+ files

---

## Appendix: Research Sources

### Anthropic Official

1. [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Comprehensive workflow guide
2. [Equipping Agents with Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Skills architecture deep dive
3. [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) — Implementation guide
4. [Claude Code Memory](https://code.claude.com/docs/en/memory) — Memory hierarchy
5. [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows) — Pattern library

### GitHub Resources

- [anthropics/claude-code](https://github.com/anthropics/claude-code) — Official repo with plugins
- [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks) — Skills examples

### Key Insights Applied

| Source | Insight | Our Application |
|--------|---------|-----------------|
| Anthropic Best Practices | "Explore → Plan → Code → Commit" | ultrathink before complex work |
| Anthropic Best Practices | "Course correct early and often" | Small tasks, frequent gates |
| Anthropic Skills | "Progressive disclosure" | Skills load only when triggered |
| Anthropic Skills | "Start with evaluation" | Audit phases before fixes |
| General | "90-90 rule" | Different mode for final push |

---

## Conclusion

**Skills are not overengineering for this project.** They're a structured way to:
1. Preserve domain knowledge across sessions
2. Ensure consistent execution of repetitive workflows
3. Enable parallel work without conflicts
4. Build audit trails for quality

**The daily workflow is simple:**
```
TODO.md → Pick one → Execute (1-3 files) → Gates → Done
```

**The key to the final 10%:**
- Small, verifiable changes
- Consistent gates
- Session continuity through active docs
- No huge reworks, just steady polish

---

*This document consolidates research from Anthropic's official documentation, Claude Code best practices, and practical experience with this codebase. Update as workflows evolve.*
