# Agent Skills Redesign Proposal (Combined: Opus + Codex)

**Date**: 2026-01-31  
**Authors**: Opus 4.5 (Orchestrator) + Codex CLI (Reviewer)  
**Status**: Reviewed — Ready for Discussion

---

## Executive Summary

Our agent skills are currently failing critical tasks. The `spec-nextjs` agent incorrectly flagged `proxy.ts` as broken and recommended creating `middleware.ts` — **but Next.js 16 uses proxy.ts as the request hook**. 

**Codex's insight:** The failure isn't "not Next.js 16-aware" — it's "made a Critical claim with zero proof." Even if `middleware.ts` is the Next.js default, a skill must not say "won't run" unless it verified wiring in *this repo*.

This proposal combines:
- **Opus**: Research on Claude Code patterns and Lovable.dev design approach
- **Codex**: Evidence-first architecture, `stack.yml` manifest, and Evidence Contract

Root causes identified:
1. **No evidence requirement** — Skills can emit Critical findings without proof
2. **Process-heavy, knowledge-light** — Lots of "how to audit", not enough "what's true in this repo"
3. **Hedging language** — "middleware.ts (if present)" instead of definitive checks
4. **No centralized stack manifest** — Each skill guesses the tech versions

---

## Problem Analysis

### Critical Failure: middleware.ts vs proxy.ts

**What happened:**
```
| NEXTJS-001 | Critical | proxy.ts:11 | Middleware logic in proxy.ts won't run. 
| Next.js only executes from middleware.ts | Add middleware.ts re-export |
```

**Reality:** Next.js 16 allows `proxy.ts` as the request hook. Our project intentionally uses this pattern. The spec-nextjs skill:
- Lists `middleware.ts (if present)` in scope — hedging language
- Has no explicit section on "Next.js 16 Breaking Changes"
- Doesn't define our project's actual request hook pattern

### Root Causes

| Issue | Current State | Impact |
|-------|--------------|--------|
| Version-agnostic skills | Skills mention "Next.js" generically | Agents apply Next.js 14/15 patterns to Next.js 16 |
| Missing anti-patterns | No explicit "DON'T" for v3→v4 Tailwind | Wrong patterns slip through |
| AGENTS.md monolith | Single 200+ line file | Context dilution |
| No path-specific rules | Same rules for all files | Irrelevant rules clutter context |
| Design agent too generic | Lists visual principles | Doesn't encode Lovable-tier prompting |

---

## Research Findings

### 1. Claude Code (Anthropic) Memory Architecture

Anthropic's recommended structure:
```
project/
├── CLAUDE.md              # Root project memory (shared with team)
├── .claude/
│   ├── CLAUDE.md          # Alternative location
│   ├── rules/             # Modular path-specific rules
│   │   ├── code-style.md
│   │   ├── testing.md
│   │   └── api.md
│   ├── skills/            # On-demand loaded skills
│   │   └── fix-issue/SKILL.md
│   └── agents/            # Custom subagents
│       └── security-reviewer.md
```

Key principles:
- **Hierarchical loading**: Parent dirs → current dir → subdirs
- **Path-specific rules**: YAML frontmatter with `paths` field
- **Import syntax**: `@path/to/file` for composable rules
- **Skills vs Rules**: Skills load on-demand; rules always load for matching paths
- **Concise over comprehensive**: "If Claude does it right without the rule, delete it"

### 2. Lovable.dev Design Agent Patterns

From their documentation:
- **Knowledge file**: Sent with every prompt (like AGENTS.md)
- **Plan mode before execution**: Research → Plan → Implement → Verify
- **Atomic vocabulary**: Buttons, cards, modals — not "sections"
- **Design buzzwords**: "premium", "cinematic", "minimal" are promptable parameters
- **Component-first prompting**: Build one component, verify, then next

**What Lovable does differently:**
```
❌ "make the dashboard look better"
✅ "implement this design [screenshot]. take a screenshot of result. list differences and fix them"
```

### 3. OpenAI Best Practices

- **Developer vs User messages**: System rules (developer) vs user input
- **Few-shot examples**: Show input/output pairs for consistent behavior
- **Context window management**: Put stable content first for caching

---

## Proposed Architecture

### Structure Overview

```
project/
├── AGENTS.md                      # Slim entry point (< 100 lines)
├── .codex/
│   ├── AGENTS.md                  # Full project context (moved from root)
│   ├── rules/                     # Path-specific auto-loaded rules
│   │   ├── nextjs16.md            # Next.js 16 specifics
│   │   ├── tailwindv4.md          # Tailwind v4 tokens + anti-patterns
│   │   ├── supabase.md            # RLS, queries, auth patterns
│   │   └── frontend/
│   │       └── components.md      # Component boundaries (paths: components/**)
│   ├── skills/                    # On-demand skills (current structure, refined)
│   │   ├── spec-nextjs/
│   │   │   ├── SKILL.md           # Audit-only skill
│   │   │   └── nextjs16.md        # Version-specific reference (imported)
│   │   ├── spec-tailwind/
│   │   │   ├── SKILL.md
│   │   │   └── v4-antipatterns.md # v3→v4 migration traps
│   │   ├── treido-ui/
│   │   │   ├── SKILL.md           # Lovable-quality design executor
│   │   │   └── design-patterns.md # Atomic vocabulary + buzzwords
│   │   └── ...
│   └── project/
│       └── ... (existing SSOT docs)
├── app/
│   └── AGENTS.md                  # Optional: App-specific context
└── components/
    └── AGENTS.md                  # Optional: Component-specific context
```

### New Root AGENTS.md (Slim Entry Point)

```markdown
# AGENTS.md — Treido Marketplace

**Full context lives in `.codex/AGENTS.md`**

## Quick Reference
- Stack: Next.js 16 + React 19 + Tailwind v4 + shadcn/ui + Supabase + Stripe
- Gates: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate`

## Critical Rules (Non-Negotiable)
- **proxy.ts is the request hook** (NOT middleware.ts)
- **Tailwind v4 CSS-first** (no tailwind.config.js)
- All strings via `next-intl`

@.codex/AGENTS.md
```

### New .codex/rules/ (Path-Specific Auto-Load)

**Example: `.codex/rules/nextjs16.md`**
```markdown
---
paths:
  - "app/**"
  - "proxy.ts"
  - "next.config.ts"
---

# Next.js 16 Rules (Treido)

## Request Hook Pattern
- **proxy.ts is the middleware** — exports default handler + config.matcher
- Next.js 16 supports `proxy.ts` as the request entrypoint
- DO NOT create middleware.ts — it would duplicate/conflict with proxy.ts

## Caching (New in v16)
- `cacheComponents: true` enabled in next.config.ts
- Custom profiles: categories (1hr), products (5min), deals (2min), user (1hr)
- Always: `'use cache'` + `cacheLife('profile')` + `cacheTag('tag')`
- NEVER: call `cookies()`/`headers()` inside cached functions

## Breaking Changes from v15
- `proxy.ts` replaces `middleware.ts` for request hooks
- `cacheLife` profiles defined in next.config.ts, not inline
- No `revalidate` export — use `cacheLife` instead
```

**Example: `.codex/rules/tailwindv4.md`**
```markdown
---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
  - "app/globals.css"
---

# Tailwind v4 Rules (CSS-First)

## Configuration
- NO `tailwind.config.js` or `tailwind.config.ts` — we use CSS-first
- Tokens defined in `app/globals.css` via `@theme` and CSS variables
- Dark mode via `.dark` class on `:root`

## Anti-Patterns (v3 → v4 Migration)

### Forbidden (Will Fail styles:gate)
| Pattern | Why Forbidden | Fix |
|---------|--------------|-----|
| `bg-gradient-to-*` | Gradients banned | Use solid semantic token |
| `text-blue-500` | Palette colors | Use `text-foreground` etc |
| `bg-white` / `text-black` | Breaks dark mode | Use `bg-background` / `text-foreground` |
| `w-[560px]` | Arbitrary values | Use spacing scale |
| `bg-primary/50` | Opacity on tokens | Use explicit `bg-*-subtle` token |

### v3 Pattern → v4 Pattern
| v3 (Wrong) | v4 (Correct) |
|------------|--------------|
| `tailwind.config.js` theme.extend | `@theme` in globals.css |
| `colors: { primary: {...} }` | `--color-primary: oklch(...)` |
| `hover:bg-gray-100` | `hover:bg-hover` (semantic) |
```

### Enhanced spec-nextjs SKILL.md

Key changes:
1. Add explicit "Next.js 16 Breaking Changes" section
2. Import version-specific reference
3. Remove hedging language ("if present")

```markdown
## Next.js 16 Critical Knowledge

**OUR REQUEST HOOK IS `proxy.ts`** — NOT middleware.ts

Next.js 16 supports proxy.ts as the middleware entrypoint. This is intentional.

DO NOT:
- Flag proxy.ts as misconfigured
- Recommend creating middleware.ts
- Suggest renaming proxy.ts → middleware.ts

DO:
- Audit proxy.ts for matcher scope, cookie mutations, performance
- Verify i18n + auth + geo logic works correctly
- Check for rewrite loops or caching conflicts

@.codex/skills/spec-nextjs/references/nextjs16.md
```

### Enhanced treido-ui SKILL.md (Lovable-Quality)

Add Lovable's prompting patterns:

```markdown
## Design Prompting (Lovable-Quality)

### Verification Loop
Every UI change should be verifiable:
1. Implement the design
2. Take a screenshot (or confirm visually in browser)
3. Compare to reference
4. List differences
5. Fix until matches

### Atomic Vocabulary (Use These Terms)
| Instead of | Say |
|------------|-----|
| "section" | "card", "panel", "hero block" |
| "form area" | "form with input fields + submit button" |
| "navigation" | "floating menu bar with icons" |
| "make it look good" | "[specific]: rounded-lg, shadow-sm, subtle border" |

### Design Buzzwords (Promptable Parameters)
These words influence spacing, typography, shadows, and color:
- **minimal**: More whitespace, less decoration, subtle borders
- **premium**: Higher contrast, refined shadows, deliberate spacing
- **cinematic**: Dramatic contrast, layered depth
- **playful**: Rounded corners, lighter weights, brighter accents

### Component-First Workflow
1. Build ONE component fully
2. Verify all states (default, loading, empty, error)
3. Check responsive (375px, 768px, 1280px)
4. Check dark mode
5. Then move to next component

DON'T build entire pages at once — build component by component.
```

---

## Implementation Plan

### Phase 1: Critical Fixes (Immediate)
1. Add explicit Next.js 16 proxy.ts documentation to spec-nextjs
2. Add Tailwind v4 anti-patterns list
3. Create `.codex/rules/` directory with path-specific rules

### Phase 2: AGENTS.md Refactor
1. Slim down root AGENTS.md to entry point
2. Move full context to .codex/AGENTS.md
3. Implement `@import` syntax for composability

### Phase 3: Skill Enhancements
1. Enhance treido-ui with Lovable patterns
2. Add version-specific references to all spec-* skills
3. Create subagent definitions in `.codex/agents/`

### Phase 4: Folder-Level AGENTS.md (Evaluate)
- Add `app/AGENTS.md` if app-specific knowledge needed
- Add `components/AGENTS.md` for component patterns
- Keep optional — only add if proven valuable

---

## Questions for Codex

1. **Path-specific rules**: Should we implement `.codex/rules/*.md` with YAML frontmatter paths?
2. **Skill size**: What's the ideal line count for comprehensive yet concise skills?
3. **Hierarchical AGENTS.md**: Should `app/` and `components/` have their own AGENTS.md?
4. **Design agent**: What Lovable patterns are most impactful for Treido?
5. **Subagents**: Do we need separate subagent definitions (`.codex/agents/`)?
6. **Version references**: Best way to encode techstack version specifics?

---

## Codex's Alternative Plan (Evidence-First Architecture)

### Core Critique of Opus Plan

> "The failure isn't 'not Next.js 16-aware' as much as 'made a Critical claim with zero proof.' Your path-scoped YAML rules idea will rot unless you also build tooling that (a) selects the right rules deterministically and (b) shows the agent exactly what got loaded. 250–500 line monolithic skills are usually worse: they push agents into 'skim mode.' 'Lovable buzzwords' are mostly noise unless you convert them into a repeatable checklist."

### Codex's Architecture (Different from Opus)

#### 1. Central `stack.yml` Manifest

```yaml
# .codex/stack.yml
version: 1

project:
  name: amazong
  product: treido
  repo_root: .
  tech:
    framework: nextjs_app_router
    language: typescript
    styling: tailwind_v4
    ui: shadcn_ui
    backend: supabase
    payments: stripe

rails:
  default_mode: audit_only
  evidence:
    require_verified_facts: true
    allow_negative_evidence: true  # required for "missing file" claims
    max_code_quote_lines: 2
    forbid_hedge_words_in_findings: ["appears", "seems", "likely"]
  output:
    required_sections: ["Verified Facts", "Findings"]
    finding_template: evidence_contract_v1
```

#### 2. Evidence Contract v1 (Per Finding)

```markdown
## Evidence Contract v1 (Finding)

- ID: NEXTJS-###
- Severity: Critical | High | Medium | Low | Info
- Confidence: High | Medium | Low  (Critical requires High)
- Summary: (1 sentence, no hedge words)

- Facts Referenced: [F###, S###, ...]  (must exist in Verified Facts)

- Repo Evidence:
  - F###: path:line  (required)
  - (optional) F###: path:line
  - (if absence is required) S###: <command + scope + result>

- Next.js Rule:
  - (short invariant, stated as a rule, not a repo fact)

- Reasoning:
  - (1–3 sentences linking Repo Evidence + Rule → conclusion)

- Impact:
  - (who/what breaks; observable symptom)

- Recommendation:
  - (minimal safe change; "Do X because Y")

- Verification:
  - (how to prove it's fixed; exact file/behavior to check)

- Counter-checks performed (optional):
  - (what you checked to avoid false positives)
```

#### 3. Verified Facts Ledger

Every audit starts by building a `Verified Facts` ledger with:
- `F###` = code-backed fact (has `path:line`)
- `S###` = search-backed fact (command + scope + result) — required for absence claims

Example:
```
- F001 — proxy.ts exports default handler (`proxy.ts:11`)
- F002 — proxy.ts exports config.matcher (`proxy.ts:77`)
- S001 — No middleware.ts exists (`rg --files -g"middleware.*" .` → 0 hits)
```

**Severity Rule:** Critical findings require *all* referenced facts to be present, including negative evidence for absence claims.

#### 4. Evidence-First spec-nextjs SKILL.md

```markdown
# spec-nextjs (AUDIT-ONLY, Evidence-First)

## Evidence Model

### Evidence Types
1) **Code evidence (positive claims)**: Must cite `path:line` into an existing file
2) **Negative/Search evidence (absence claims)**: Must include exact command + scope + result

### Fact IDs (mandatory)
- `F###` = code-backed fact
- `S###` = search-backed fact

## Severity Rules (Hard)
- **Critical**: only if breakage is guaranteed given repo facts + Next.js rule, and all prerequisites (including negative evidence) are present
- **High/Medium/Low**: real risk, but not guaranteed runtime break
- **Info**: conventions/readability

## Guardrail Example: proxy.ts ≠ middleware by default

Seeing a `proxy.ts` exporting `config.matcher` is NOT enough to say it "won't run".
You may only claim "won't run" if:
- `S###` proves no `middleware.*` / `src/middleware.*` exists, AND
- `F###` shows the middleware-like handler lives only in `proxy.ts`, AND
- `S###` shows `proxy.ts` is not imported by any actual middleware entrypoint

Otherwise: Put it under "Needs Verification" not as a Critical finding.
```

#### 5. Skill Size Guidance

- **~100–150 lines** for the runnable checklist (SKILL.md)
- **Unlimited** in `references/` (but organized)
- Move depth into references; keep execution path short

#### 6. Folder-Level AGENTS.md Example

**`components/AGENTS.md`** (invariants only, keep short):
```markdown
# components/ invariants

- `components/` is reusable UI only: no data fetching, no server actions, no Supabase/Stripe calls
- `components/ui/` stays shadcn-style primitives: app-agnostic, composable, must not import from `app/`
- Tailwind v4 rail: tokens/semantic utilities only (no gradients, no palette classes, no arbitrary values)
- Client boundary: add `"use client"` only when strictly required; keep most server-compatible
```

#### 7. Agent Roles Assessment

Current roles are sufficient:
- **Executors**: `treido-orchestrator`, `treido-frontend`, `treido-backend`, `treido-ui`, `treido-verify`
- **Spec agents**: `spec-nextjs`, `spec-tailwind`, `spec-shadcn`, `spec-supabase`

**Recommended addition**: `treido-testing` — separate from `treido-verify` (verify is fast/deterministic gates; testing handles what to run, flakes, and fixes)

**Not needed yet**: Dedicated i18n/perf agents — make them checklists inside frontend/backend first

---

## Combined Plan Comparison

| Aspect | Opus Plan | Codex Plan | Combined |
|--------|-----------|------------|----------|
| **Root cause** | Techstack version ignorance | Evidence requirement missing | Both true; fix evidence first |
| **Path-specific rules** | `.codex/rules/*.md` with YAML | Only with tooling + visibility | Start with `stack.yml`, add rules later |
| **Skill size** | 250-500 lines | ~100-150 lines + unlimited refs | **~100-150 lines** skill, depth in refs |
| **Config** | Per-skill version awareness | Central `stack.yml` manifest | **`stack.yml`** as single source of truth |
| **Findings format** | Standard audit payload | Evidence Contract with Verified Facts | **Evidence Contract** for all findings |
| **Folder AGENTS.md** | Optional, evaluate | Yes, but only for invariants | Yes, **invariants only** |
| **Design patterns** | Lovable buzzwords | Repeatable checklist (states, a11y, rhythm) | **Checklist** not buzzwords |
| **Verify agent** | Runs gates only | Also enforce Evidence Contract | **Yes**, reject findings without facts |

---

## Final Combined TL;DR

### Opus Plan Summary
1. Fix proxy.ts issue with explicit Next.js 16 docs
2. Add Tailwind v4 anti-patterns list
3. Path-specific rules in `.codex/rules/`
4. Slim entry point AGENTS.md
5. Lovable patterns for design agent

### Codex Plan Summary
1. Create central `stack.yml` manifest
2. Implement Evidence Contract (Verified Facts required)
3. Make `treido-verify` reject findings without evidence
4. Shorter skills (~100 lines) with depth in references
5. Folder AGENTS.md for invariants only

### Combined Recommendations

**Phase 1: Evidence Infrastructure (Immediate)**
1. Create `.codex/stack.yml` with project tech versions
2. Add Evidence Contract template to `treido-orchestrator` references
3. Update `treido-verify` to validate findings have evidence

**Phase 2: Skill Fixes (This Week)**
1. Rewrite `spec-nextjs` with evidence-first approach + proxy.ts guardrail
2. Add Tailwind v4 anti-patterns to `spec-tailwind`
3. Slim all skills to ~100-150 lines, move depth to references

**Phase 3: Structure (Next Week)**
1. Slim root AGENTS.md to entry point
2. Add `components/AGENTS.md` with invariants only
3. Evaluate `.codex/rules/` with path-specific loading

**Phase 4: Design Quality (Ongoing)**
1. Convert Lovable patterns to actionable checklist
2. Add states matrix, a11y, spacing rhythm checks to `treido-ui`
3. Add `treido-testing` agent when testing becomes a bottleneck

---

**Key Agreement**: Our skills have process (how to audit) but lack evidence discipline (prove before claiming). Fix evidence, then knowledge, then structure.

