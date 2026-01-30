# Agent Skills Audit & Proposal for Codex

> **Comprehensive audit of Treido's agent skills strategy with recommendations based on latest OpenAI Codex, Anthropic Claude Code, and Agent Skills open standard best practices.**

**Created:** January 29, 2026  
**Author:** Claude Opus 4.5 (ultrathink deep analysis)  
**Purpose:** Audit current agent skills implementation, identify gaps, propose improvements for Codex review

---

## Executive Summary

### Current State
Treido has a **conceptual framework** for agent skills documented in `production/agent_skills.md`, but **no actual `.claude/skills/` or `.codex/skills/` directories exist**. The project relies primarily on:
- `AGENTS.md` — Root-level instructions (well-structured)
- `CLAUDE.md` — Minimal redirect (appropriate)
- Ad-hoc agent coordination via `production/opus_codex.md`

### Gap Analysis Summary

| Aspect | Current State | Industry Standard | Gap Severity |
|--------|---------------|-------------------|--------------|
| Skill directories | ❌ None exist | `.claude/skills/`, `.codex/skills/` | 🔴 **Critical** |
| Skill format | ❌ Not implemented | SKILL.md with YAML frontmatter | 🔴 **Critical** |
| Subagents | ❌ Not configured | Custom subagents in `.claude/agents/` | 🟡 **Medium** |
| MCP integration | ✅ Supabase configured | Per-skill MCP dependencies | 🟢 **Good** |
| Validation scripts | ✅ Exists (`validate-agent-skills.mjs`) | CI/CD integration | 🟡 **Medium** |
| Orchestrator pattern | 📝 Documented only | Actual implementation | 🟡 **Medium** |

### Key Recommendations (TL;DR)
1. **Create actual skill directories** following Agent Skills open standard
2. **Implement 5-7 core skills** for Treido's stack (not 8+ as proposed)
3. **Add 2-3 custom subagents** for specific workflows
4. **Integrate validation into CI/CD**
5. **Keep skills lean** (< 500 lines SKILL.md, progressive disclosure)

---

## Part 1: Audit of Current Implementation

### 1.1 What Exists Today

#### `production/agent_skills.md` (Strategy Document)
**Status:** ✅ Well-researched, comprehensive strategy document  
**Issues:**
- Pure documentation, no implementation
- Proposes 8 agents (too many for a single project)
- Mixes "skills" and "agents" terminology inconsistently
- No actual SKILL.md files exist

#### `AGENTS.md` (Root Instructions)
**Status:** ✅ Excellent structure, follows OpenAI Codex best practices  
**Strengths:**
- Single entry point ✓
- Rails/non-negotiables clearly stated ✓
- Code boundaries defined ✓
- Verification gates documented ✓

**Minor Issues:**
- Missing "Skills" section (should list available skills)
- No skill invocation examples

#### `scripts/validate-agent-skills.mjs`
**Status:** ✅ Good validation script exists  
**Issue:** No skills to validate (script looks for `.claude/skills/` which doesn't exist)

#### `CLAUDE.md`
**Status:** ✅ Correctly minimal redirect

#### `.cursor/mcp.json`
**Status:** ✅ Supabase MCP configured correctly

### 1.2 What's Missing

| Component | Status | Impact |
|-----------|--------|--------|
| `.claude/skills/` directory | ❌ Missing | Skills cannot be discovered |
| Any `SKILL.md` files | ❌ Missing | No skills available |
| `.claude/agents/` directory | ❌ Missing | No custom subagents |
| Skill-specific scripts | ❌ Missing | No automation |
| Skill references | ❌ Missing | No progressive disclosure |

---

## Part 2: Industry Standards Analysis

### 2.1 OpenAI Codex Skills

**Source:** [github.com/openai/codex](https://github.com/openai/codex), [github.com/openai/skills](https://github.com/openai/skills)

**Key Principles:**
1. **Skills are procedural, not encyclopedic** — Checklists + tool recipes
2. **Separate builders from auditors** — Different roles, don't blur
3. **Default to "verify always"** — End with deterministic verification
4. **Tool-first when tools exist** — Use MCP, don't guess
5. **Explicit anti-patterns** — Spell out what NOT to do

**Skill Structure (Codex):**
```
skill-name/
├── SKILL.md           # Required: YAML frontmatter + instructions
├── scripts/           # Optional: Executable code
├── references/        # Optional: Detailed docs (loaded on demand)
└── assets/            # Optional: Templates, images, etc.
```

**Frontmatter (Required):**
```yaml
---
name: skill-name          # lowercase-hyphen-case, 1-64 chars
description: |            # 1-1024 chars, include WHEN to use
  What this skill does and when to invoke it.
---
```

### 2.2 Anthropic Claude Code Skills

**Source:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

**Key Features:**
- **Auto-discovery** — Claude loads skill descriptions at session start
- **Slash commands** — `/skill-name` invokes directly
- **Model invocation control** — `disable-model-invocation: true` for manual-only
- **Allowed tools** — Pre-approve specific tools per skill
- **Context forking** — `context: fork` runs in isolated subagent

**Additional Frontmatter (Claude Code Extensions):**
```yaml
---
name: my-skill
description: What it does and when to use it
argument-hint: [issue-number]                    # Autocomplete hint
disable-model-invocation: true                   # Manual invocation only
user-invocable: false                            # Hide from / menu
allowed-tools: Read, Grep, Glob                  # Pre-approved tools
model: sonnet                                    # Override model
context: fork                                    # Run in subagent
agent: Explore                                   # Which subagent type
---
```

### 2.3 Claude Code Subagents

**Source:** [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)

**Built-in Subagents:**
| Name | Model | Tools | Purpose |
|------|-------|-------|---------|
| Explore | Haiku (fast) | Read-only | Codebase search/analysis |
| Plan | Varies | Read-only | Create plans |
| general-purpose | Inherit | All | Default delegation |

**Custom Subagent Structure:**
```
.claude/agents/
└── my-agent.md
```

**Subagent Frontmatter:**
```yaml
---
name: code-reviewer
description: Reviews code for quality. Use proactively after changes.
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
model: sonnet
permissionMode: default
skills:
  - api-conventions
  - error-handling
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
---

You are a code reviewer. Focus on quality, security, and best practices.
```

### 2.4 Agent Skills Open Standard

**Source:** [agentskills.io/specification](https://agentskills.io/specification)

**Adoption:** OpenAI Codex, Claude Code, Cursor, VS Code, Mistral Vibe, Factory, Amp, and more

**Core Requirements:**
1. `name` — 1-64 chars, lowercase + hyphens, matches directory name
2. `description` — 1-1024 chars, include what AND when
3. Body — Markdown instructions (< 500 lines recommended)

**Progressive Disclosure:**
| Level | Tokens | When Loaded |
|-------|--------|-------------|
| Metadata | ~100 | Session start (all skills) |
| Instructions | < 5000 | Skill activated |
| Resources | Variable | On demand |

---

## Part 3: Proposed Skill Architecture for Treido

### 3.1 Directory Structure (Recommended)

```
.claude/
├── skills/
│   ├── treido-frontend/
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── component-patterns.md
│   │       └── i18n-checklist.md
│   ├── treido-backend/
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── supabase-patterns.md
│   │       └── stripe-checklist.md
│   ├── treido-supabase/
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       └── run-advisors.sh
│   ├── tailwind-audit/
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       └── scan-violations.mjs
│   └── treido-designer/
│       ├── SKILL.md
│       └── references/
│           ├── anti-slop-rules.md
│           └── accessibility-checklist.md
└── agents/
    ├── code-reviewer.md
    └── supabase-auditor.md
```

### 3.2 Recommended Skills (5 Core + 2 Optional)

#### Core Skills (Implement First)

| Skill | Purpose | Priority |
|-------|---------|----------|
| `treido-frontend` | Next.js 16 App Router UI + next-intl + Tailwind v4 + shadcn | 🔴 P1 |
| `treido-backend` | Server actions, route handlers, Stripe webhooks | 🔴 P1 |
| `treido-supabase` | Schema/RLS/policies via MCP, type generation | 🔴 P1 |
| `tailwind-audit` | Verify Tailwind v4 compliance, no drift | 🟡 P2 |
| `treido-designer` | UI/UX specs, anti-slop rules, accessibility | 🟡 P2 |

#### Optional Skills (Post-V1)

| Skill | Purpose | Priority |
|-------|---------|----------|
| `treido-testing` | E2E and unit test patterns | 🟢 P3 |
| `treido-refactor` | Safe refactoring workflows | 🟢 P3 |

### 3.3 Why NOT 8 Agents

Your `agent_skills.md` proposes 8 agents including an "orchestrator". This is **overkill** for a single product team:

| Proposed | Recommendation | Rationale |
|----------|----------------|-----------|
| treido-orchestrator | ❌ Remove | Built-in Plan subagent handles this |
| treido-designer | ✅ Keep as skill | Good for UI specs |
| treido-frontend | ✅ Keep as skill | Core workflow |
| treido-backend | ✅ Keep as skill | Core workflow |
| treido-supabase-mcp | ✅ Keep as skill | High value with MCP |
| tailwind-audit | ✅ Keep as skill | Prevents drift |
| supabase-audit | ⚠️ Merge into treido-supabase | Avoid fragmentation |
| treido-testing | 🟡 Optional P3 | Not critical for V1 |
| treido-refactor | 🟡 Optional P3 | Not critical for V1 |

**Total: 5 core skills + 2 custom subagents** (not 8)

---

## Part 4: Detailed Skill Specifications

### 4.1 `treido-frontend` Skill

```yaml
---
name: treido-frontend
description: |
  Implement Next.js 16 App Router UI with React 19, Tailwind v4, and shadcn/ui.
  Use when building UI components, pages, or layouts. Handles next-intl 
  internationalization, server/client component boundaries, and component 
  composition patterns. Invoke for any frontend implementation work.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm *)
---

# Treido Frontend Implementation

## When to Use
- Building new pages or components
- Modifying existing UI
- Adding/updating translations
- Working with shadcn/ui components

## Non-Negotiables
1. **All user-facing strings** → `next-intl` (check `messages/en.json`, `messages/bg.json`)
2. **No arbitrary Tailwind values** → Use semantic tokens only
3. **No gradients/glows** → Keep UX stable
4. **Default Server Components** → Add `"use client"` only when needed

## Component Boundaries
| Location | Contains |
|----------|----------|
| `components/ui/*` | shadcn primitives (no app logic) |
| `components/shared/*` | Shared composites |
| `app/[locale]/(group)/_components/*` | Route-private UI |

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
```

## References
- [Component patterns](references/component-patterns.md)
- [i18n checklist](references/i18n-checklist.md)
```

### 4.2 `treido-backend` Skill

```yaml
---
name: treido-backend
description: |
  Implement server actions, route handlers, Stripe webhooks, and backend logic
  for Treido marketplace. Use when working with database operations, payment
  processing, or API endpoints. Handles Supabase queries, Stripe Connect/Checkout,
  and server-side data flows.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm *)
---

# Treido Backend Implementation

## When to Use
- Creating/modifying server actions
- Implementing API route handlers
- Working with Stripe webhooks
- Writing Supabase queries

## Non-Negotiables
1. **No secrets in logs** → Never log auth keys, tokens, PII
2. **No `select('*')` in hot paths** → Project specific fields
3. **Stripe webhooks** → Must be idempotent + signature-verified
4. **Cached functions** → Pair `'use cache'` with `cacheLife()` + `cacheTag()`

## Code Boundaries
| Location | Contains |
|----------|----------|
| `app/actions/*` | Shared server actions |
| `app/[locale]/(group)/_actions/*` | Route-private actions |
| `app/api/*` | API route handlers |
| `lib/*` | Pure utilities (no React) |

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

## References
- [Supabase patterns](references/supabase-patterns.md)
- [Stripe checklist](references/stripe-checklist.md)
```

### 4.3 `treido-supabase` Skill

```yaml
---
name: treido-supabase
description: |
  Manage Supabase schema, RLS policies, storage, and auth for Treido.
  Use when modifying database structure, debugging queries, or running
  security advisors. Integrates with Supabase MCP for direct introspection
  and DDL operations via migrations.
allowed-tools: Read, Write, Edit, Grep, Bash(pnpm supabase *)
---

# Treido Supabase Management

## When to Use
- Schema changes (tables, columns, indexes)
- RLS policy updates
- Security advisor audits
- Type regeneration

## Workflow
1. **Introspect** → Use `mcp_supabase_list_tables` to understand current state
2. **Plan migration** → Write SQL in `supabase/migrations/`
3. **Apply** → Use `mcp_supabase_apply_migration`
4. **Regenerate types** → `pnpm supabase gen types typescript`
5. **Verify** → Run `mcp_supabase_get_advisors` for security/performance

## Non-Negotiables
- **Never apply ad-hoc SQL** → Always use migrations
- **All tables need RLS** → No public access by default
- **Project fields** → No `select('*')` in application code

## Scripts
- `scripts/run-advisors.sh` — Run security + performance advisors

## MCP Tools Available
- `mcp_supabase_list_tables`
- `mcp_supabase_apply_migration`
- `mcp_supabase_execute_sql`
- `mcp_supabase_get_advisors`
- `mcp_supabase_generate_typescript_types`
```

### 4.4 `tailwind-audit` Skill

```yaml
---
name: tailwind-audit
description: |
  Audit Tailwind CSS v4 compliance for Treido. Use when verifying no
  gradient/glow usage, no arbitrary values, no hardcoded colors. Run
  after UI changes or as part of pre-deploy checks.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash(pnpm -s styles:gate)
---

# Tailwind v4 Compliance Audit

## When to Use
- After any UI/styling changes
- Before deployment
- During PR review

## What We Check
1. **No gradients** → `bg-gradient-*`, `from-*`, `to-*`
2. **No arbitrary values** → `[#hex]`, `[123px]`
3. **No hardcoded colors** → `bg-red-500`, `text-blue-600`
4. **Semantic tokens only** → `bg-background`, `text-foreground`

## Command
```bash
pnpm -s styles:gate
```

## Manual Grep Checks
```bash
# Find gradient usage
grep -r "bg-gradient\|from-\|to-\|via-" --include="*.tsx" app/ components/

# Find arbitrary values
grep -r "\[#\|\[0-9" --include="*.tsx" app/ components/

# Find hardcoded colors (excluding semantic)
grep -rE "bg-(red|blue|green|yellow|orange|purple|pink|gray)-[0-9]" --include="*.tsx" app/ components/
```
```

### 4.5 `treido-designer` Skill

```yaml
---
name: treido-designer
description: |
  Create UI/UX specifications for Treido features. Use before implementing
  complex UI to produce specs with layout, hierarchy, components, and states.
  Enforces anti-slop rules (no gradients, no random colors, consistent tokens)
  and accessibility basics.
context: fork
agent: Plan
---

# Treido UI/UX Designer

## When to Use
- Before implementing new UI features
- When reviewing existing UI for consistency
- Accessibility audits

## Output Format
For each UI spec, provide:
1. **Layout sketch** (ASCII or description)
2. **Component hierarchy** (which shadcn components)
3. **States** (loading, empty, error, success)
4. **Tokens** (which design tokens to use)
5. **Accessibility notes** (focus order, ARIA labels)

## Anti-Slop Rules (Hard Requirements)
- ❌ No gradients/glows/neon aesthetics
- ❌ No random color additions (tokens only)
- ❌ No one-off spacing/type/radius decisions
- ❌ No new animations
- ✅ Clear hierarchy
- ✅ Visible focus states
- ✅ Adequate contrast (4.5:1 text, 3:1 UI)
- ✅ 44x44px minimum touch targets

## References
- [Anti-slop rules detail](references/anti-slop-rules.md)
- [Accessibility checklist](references/accessibility-checklist.md)
```

---

## Part 5: Custom Subagents

### 5.1 `code-reviewer` Subagent

**File:** `.claude/agents/code-reviewer.md`

```yaml
---
name: code-reviewer
description: |
  Expert code reviewer for Treido codebase. Use proactively after code changes
  to check quality, security, and adherence to project conventions. Read-only
  analysis with detailed feedback.
tools: Read, Grep, Glob, Bash(git diff *)
disallowedTools: Write, Edit
model: sonnet
---

You are a senior code reviewer for the Treido marketplace codebase.

## Your Focus Areas
1. **TypeScript** — Proper types, no `as any`, no `@ts-ignore`
2. **Security** — No secrets in logs, no exposed auth keys
3. **Tailwind** — Semantic tokens only, no arbitrary values
4. **i18n** — All user strings via next-intl
5. **Supabase** — No `select('*')`, proper RLS consideration
6. **Performance** — No unnecessary client components, proper caching

## Review Checklist
- [ ] Types are correct and no unsafe casts
- [ ] No hardcoded strings (check i18n)
- [ ] No Tailwind drift (semantic tokens only)
- [ ] Error handling present
- [ ] Logging is safe (no secrets)

## Output Format
Organize feedback by severity:
1. **Critical** — Must fix before merge
2. **Warning** — Should fix
3. **Suggestion** — Consider improving

Include specific file:line references and code examples for fixes.
```

### 5.2 `supabase-auditor` Subagent

**File:** `.claude/agents/supabase-auditor.md`

```yaml
---
name: supabase-auditor
description: |
  Security and performance auditor for Supabase. Use before deployments
  or after schema changes to verify RLS policies, check for missing indexes,
  and identify hot-path query issues.
tools: Read, Grep, Bash(pnpm supabase *)
model: haiku
---

You are a Supabase security and performance auditor for Treido.

## Audit Checklist

### Security
- [ ] All tables have RLS enabled
- [ ] No tables with public read/write
- [ ] Auth functions don't expose sensitive data
- [ ] Storage buckets have proper policies

### Performance
- [ ] Hot-path queries have indexes
- [ ] No `select('*')` in application code
- [ ] Proper pagination on large tables
- [ ] Functions are optimized

## How to Audit
1. Run `mcp_supabase_get_advisors` with type "security"
2. Run `mcp_supabase_get_advisors` with type "performance"
3. List all tables and check RLS status
4. Grep codebase for `select('*')` patterns

## Output Format
Provide:
1. **Summary** — Overall health score (pass/warn/fail)
2. **Findings** — List of issues by severity
3. **Recommendations** — Specific fixes with code examples
```

---

## Part 6: Implementation Plan for Codex

### 6.1 Phase 1: Foundation (Day 1)

| Task | Description | Files |
|------|-------------|-------|
| 1.1 | Create `.claude/skills/` directory structure | Directory creation |
| 1.2 | Implement `treido-frontend` skill | SKILL.md + references |
| 1.3 | Implement `treido-backend` skill | SKILL.md + references |
| 1.4 | Update AGENTS.md with skills section | AGENTS.md |

### 6.2 Phase 2: MCP Integration (Day 2)

| Task | Description | Files |
|------|-------------|-------|
| 2.1 | Implement `treido-supabase` skill | SKILL.md + scripts |
| 2.2 | Implement `tailwind-audit` skill | SKILL.md |
| 2.3 | Add validation to CI | GitHub workflow |

### 6.3 Phase 3: Subagents (Day 3)

| Task | Description | Files |
|------|-------------|-------|
| 3.1 | Create `.claude/agents/` directory | Directory creation |
| 3.2 | Implement `code-reviewer` subagent | code-reviewer.md |
| 3.3 | Implement `supabase-auditor` subagent | supabase-auditor.md |

### 6.4 Phase 4: Designer & Polish (Day 4)

| Task | Description | Files |
|------|-------------|-------|
| 4.1 | Implement `treido-designer` skill | SKILL.md + references |
| 4.2 | Create reference docs | All reference files |
| 4.3 | Test skill discovery | Manual verification |

---

## Part 7: Comparison with Your Current Proposal

### What You Got Right ✅

1. **Ecosystem awareness** — Good research on OpenAI, Anthropic, Cursor, etc.
2. **Design principles** — "Procedural not encyclopedic" is correct
3. **Anti-patterns** — Explicit forbidden patterns (gradients, secrets, etc.)
4. **Tech stack references** — Comprehensive links to official docs
5. **Builder vs Auditor separation** — Sound principle

### What Needs Adjustment ⚠️

| Your Proposal | Recommendation | Reason |
|---------------|----------------|--------|
| 8 agents | 5 skills + 2 subagents | Simpler is better; built-ins handle orchestration |
| `treido-orchestrator` | Remove | Claude's Plan subagent does this |
| Separate `supabase-audit` | Merge into `treido-supabase` | Avoid fragmentation |
| "Proposed Army" | "Recommended Skills" | Military metaphor is confusing |
| No actual implementation | Create `.claude/skills/` | Strategy without execution |

### What's Missing ❌

1. **Actual SKILL.md files** — Only documentation exists
2. **Custom subagent definitions** — No `.claude/agents/` directory
3. **Reference files** — No progressive disclosure content
4. **CI/CD integration** — Validation script exists but not wired
5. **Skills section in AGENTS.md** — Users don't know skills exist

---

## Part 8: Questions for Codex

Please address these when implementing:

### Architecture Questions
1. **Skill scope**: Should skills be project-level (`.claude/skills/`) or user-level (`~/.claude/skills/`)? Recommendation: Project-level for team sharing.

2. **MCP dependencies**: Should `treido-supabase` skill declare Supabase MCP as a dependency? The spec supports this via `compatibility` field.

3. **Validation in CI**: Add to GitHub Actions or keep manual? Recommendation: Add as non-blocking check initially.

### Content Questions
4. **Reference file depth**: How detailed should `references/*.md` files be? Recommendation: 100-300 lines each, practical examples.

5. **Script language**: Python or Node.js for skill scripts? Recommendation: Node.js (already in stack).

6. **Hook integration**: Should skills define PreToolUse/PostToolUse hooks? Recommendation: Start without, add later if needed.

### Workflow Questions
7. **Skill versioning**: Track versions in metadata or rely on git? Recommendation: Git-only initially.

8. **Cross-agent coordination**: How do Opus and Codex share skill updates? Recommendation: Document in opus_codex.md message log.

---

## Part 9: Appendices

### A. Agent Skills Open Standard Quick Reference

```yaml
# Minimum valid SKILL.md
---
name: my-skill         # Required: 1-64 chars, lowercase + hyphens
description: |         # Required: 1-1024 chars
  What the skill does and when to use it.
---

Instructions go here (Markdown).
```

### B. Claude Code Extensions Quick Reference

```yaml
# Extended frontmatter (Claude Code specific)
---
name: my-skill
description: What it does
argument-hint: [file-path]              # Autocomplete hint
disable-model-invocation: true          # Manual only
user-invocable: false                   # Hide from menu
allowed-tools: Read, Write, Grep        # Pre-approved
model: sonnet                           # Override model
context: fork                           # Run in subagent
agent: Explore                          # Subagent type
hooks:                                  # Lifecycle hooks
  PreToolUse: [...]
---
```

### C. Validation Command

```bash
# From skills-ref library
skills-ref validate ./my-skill

# Or use your existing script
node scripts/validate-agent-skills.mjs
```

### D. Directory Structure Template

```
.claude/
├── skills/
│   └── skill-name/
│       ├── SKILL.md           # Required
│       ├── scripts/           # Optional: Executable code
│       ├── references/        # Optional: Docs (loaded on demand)
│       └── assets/            # Optional: Templates, images
└── agents/
    └── agent-name.md          # Custom subagents
```

---

## Conclusion

Treido's agent skills strategy document (`production/agent_skills.md`) shows excellent research and understanding of the ecosystem. However, **no actual implementation exists**. The gap between documentation and reality is significant.

**Immediate priorities:**
1. Create `.claude/skills/` directory
2. Implement 3 core skills: `treido-frontend`, `treido-backend`, `treido-supabase`
3. Add skills section to AGENTS.md
4. Wire validation into CI

**Post-V1 priorities:**
1. Add `tailwind-audit` and `treido-designer` skills
2. Create custom subagents
3. Build out reference documentation

The proposed architecture is solid. Execution is the missing piece.

---

*This audit was prepared by Claude Opus 4.5 with ultrathink deep analysis enabled.*
