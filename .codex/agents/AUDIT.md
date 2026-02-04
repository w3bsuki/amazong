# AUDIT.md — Skills.sh & Anthropic/Vercel Patterns Analysis

> Deep audit of official skill patterns to inform Treido agent architecture.

---

## Skills Audited

| Source | Skill | Purpose |
|--------|-------|---------|
| Anthropic | `skill-creator` | Meta-skill: How to create skills (Anthropic's official guidance) |
| Anthropic | `frontend-design` | Creative frontend UI generation |
| Vercel | `vercel-react-best-practices` | 57 React/Next.js performance rules |
| Vercel | `web-design-guidelines` | 100+ UI compliance rules |
| Vercel | `find-skills` | CLI for discovering skills from skills.sh |

---

## Key Structural Patterns

### 1. Frontmatter is CRITICAL

From Anthropic's skill-creator:
```yaml
---
name: skill-name
description: This is the PRIMARY TRIGGERING MECHANISM. Include both WHAT the skill does AND WHEN to use it. All trigger keywords belong here, not in the body.
---
```

**Why it matters:** The description is the ONLY thing Claude reads to decide whether to load the skill. Rich, keyword-filled descriptions = better triggering.

### 2. Three-Level Progressive Loading

| Level | When Loaded | Token Cost |
|-------|-------------|------------|
| Metadata (name + description) | Always in context | ~100 words |
| SKILL.md body | Only when skill triggers | <5k words |
| Bundled resources (scripts/, references/, assets/) | As needed by Claude | Unlimited |

**Key insight:** Keep SKILL.md under 500 lines. Move detailed content to `references/` folder.

### 3. Freedom Levels

| Freedom | Use When | Format |
|---------|----------|--------|
| High | Multiple approaches valid | Text instructions |
| Medium | Preferred pattern exists | Pseudocode with parameters |
| Low | Operations are fragile | Specific scripts, few parameters |

### 4. Skill Directory Structure

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/       - Executable code (deterministic reliability)
    ├── references/    - Docs loaded as needed into context
    └── assets/        - Files used in output (templates, images)
```

### 5. What NOT to Include

From skill-creator:
- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- Setup/testing procedures
- User-facing documentation

**Rule:** Only include what Claude needs to DO THE JOB.

---

## Pattern Analysis: Vercel react-best-practices

**Best-in-class structure for rule-based skills:**

1. **Clear "When to Apply" section** at top
2. **Priority-categorized rules** (CRITICAL → HIGH → MEDIUM → LOW)
3. **One-line rule descriptions** in quick reference
4. **Detailed rules in `rules/` folder** (progressive disclosure)
5. **Full compiled AGENTS.md** for LLM consumption

**Treido adoption:** Use priority categories for any rule-heavy skill (testing, performance, accessibility).

---

## Pattern Analysis: Anthropic frontend-design

**Best-in-class structure for creative skills:**

1. **Design Thinking section** - Context before code
2. **Bold aesthetic direction** - Commit to an extreme
3. **Guidelines not prescriptive** - High freedom for creative work
4. **Anti-patterns explicitly called out** - "NEVER use generic AI aesthetics"

**Key quote:**
> "Bold maximalism and refined minimalism both work - the key is intentionality, not intensity."

**Treido adoption:** Design agents should guide aesthetic CHOICES, not dictate implementation.

---

## Current Treido Skills Audit

### Inventory (33 Skills Total!)

**.codex/skills/** (18 skills):
```
treido-accessibility/
treido-auth-supabase/
treido-backend/          ← Orchestrator
treido-design/
treido-frontend/         ← Orchestrator
treido-i18n/
treido-mobile-ux/
treido-nextjs-16/
treido-rails/            ← Safety rails
treido-shadcn-ui/
treido-skillsmith/
treido-stripe/
treido-structure/
treido-supabase/
treido-tailwind-v4/
treido-tailwind-v4-shadcn/
treido-testing/
treido-ui-ux-pro-max/
```

**.claude/skills/** (15 skills):
```
accessibility-compliance/
frontend-design/          ← From Anthropic
i18n-localization/
mobile-ux-optimizer/
nextjs-supabase-auth/
playwright/
pwa-expert/
seo-audit/
stripe-best-practices/    ← Generic
supabase-postgres-best-practices/
tailwind-v4-shadcn/
typescript-advanced-types/
ui-ux-pro-max/
vercel-react-best-practices/  ← From Vercel
web-design-guidelines/        ← From Vercel
```

### Problems Identified

1. **Massive fragmentation** - 33 skills is unsustainable
2. **Duplicate coverage** - Multiple skills for same domain (design has 4+, auth has 3+)
3. **Two locations** - `.codex/` and `.claude/` creates confusion
4. **Generic vs Treido-specific** - External skills don't know our conventions
5. **No progressive disclosure** - No scripts/, references/, assets/ structure
6. **Orchestrator pattern** - Adds indirection overhead (2 hops instead of 1)

### What's Good

1. **treido-rails** - Clear pause conditions and non-negotiables
2. **treido-tailwind-v4** - Excellent forbidden patterns table
3. **treido-design** - Good component state coverage
4. **treido-nextjs-16** - Critical knowledge about proxy.ts

---

## Recommendation: Consolidated Expert Agents

### Principle: EXPERT > ORCHESTRATOR

Instead of routing skills that delegate to specialists, create **single expert agents** that contain all domain knowledge. One hop, not two.

### Proposed Roster (7 Agents)

| Agent | Domain | Absorbs These Skills |
|-------|--------|---------------------|
| **treido-design** | UI/UX/Styling | design, ui-ux-pro-max, frontend-design, tailwind-v4, shadcn, mobile-ux, accessibility |
| **treido-frontend** | Next.js/React | nextjs-16, vercel-react-best-practices, web-design-guidelines |
| **treido-backend** | Supabase/Data | supabase, supabase-postgres-best-practices, auth-supabase |
| **treido-payments** | Stripe | stripe, stripe-best-practices |
| **treido-i18n** | Localization | i18n, i18n-localization |
| **treido-testing** | E2E/Unit | testing, playwright |
| **treido-rails** | Safety/Pause | (keeps its own domain - non-negotiables) |

### Directory Structure (Per Anthropic's Guidance)

```
.codex/skills/
├── treido-design/
│   ├── SKILL.md              (< 500 lines, triggers + core knowledge)
│   └── references/
│       ├── tokens.md         (full token mapping)
│       ├── components.md     (shadcn patterns)
│       ├── mobile.md         (touch/responsive)
│       └── accessibility.md  (WCAG rules)
├── treido-frontend/
│   ├── SKILL.md
│   └── references/
│       ├── routing.md
│       ├── caching.md
│       └── performance.md
└── ...
```

### Migration Plan

1. Build new consolidated agents in `.codex/agents/` first
2. Test on real tasks
3. Move to `.codex/skills/` as canonical location
4. Delete deprecated skills from both `.codex/skills/` and `.claude/skills/`
5. Update `.github/copilot-instructions.md` to reference new agents

---

## How find-skills Works

The `npx skills find [query]` command:
1. Searches the skills.sh registry (https://skills.sh)
2. Returns matching skills from the community
3. Can install with `npx skills add <owner/repo>`

**Useful for:** Discovering new skills, staying updated with ecosystem.

**Not needed for:** Treido-specific knowledge. Our agents must be custom-built.

---

## Summary: Structure Patterns to Adopt

### From Anthropic skill-creator:
- [x] Rich descriptions with all trigger keywords
- [x] Progressive disclosure (references/ folder)
- [x] < 500 line SKILL.md bodies
- [x] Don't include meta-documentation
- [x] Freedom levels appropriate to task

### From Vercel react-best-practices:
- [x] Priority categories (CRITICAL → LOW)
- [x] One-line rule quick references
- [x] Detailed rules in separate files
- [x] Clear "When to Apply" section

### From Anthropic frontend-design:
- [x] Design thinking before implementation
- [x] Anti-patterns explicitly called out
- [x] High freedom for creative work
- [x] Intentionality over intensity

### Treido-specific additions:
- [x] Forbidden patterns tables (visual)
- [x] Do/Don't code examples
- [x] Review checklists
- [x] SSOT document references
- [x] Pause conditions (for backend/payments)
