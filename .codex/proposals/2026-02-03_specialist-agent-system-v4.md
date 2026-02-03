# Specialist Agent System V4 — Production Dev Team

**Date**: 2026-02-03  
**Status**: PROPOSAL  
**Authors**: Opus 4.5 + Research from Anthropic/OpenAI/skills.sh

---

## Executive Summary

Transform Treido's agent system from **process-following automatons** into **knowledgeable domain specialists**. The key insight: agents fail not because they lack checklists, but because they lack **domain expertise**.

**Current State**: 3 monolithic skills (~150 lines each) that are "process-heavy, knowledge-light"  
**Target State**: 8-10 focused specialist skills (~80-100 lines) + subagent architecture for true domain expertise

---

## Research Findings (Feb 2026)

### Industry Standards Converging

All major platforms now support the **AgentSkills standard** (agentskills.io):
- **Project skills**: `.codex/skills/` (Treido-maintained `treido-*`)
- **OpenAI Codex**: `.codex/skills/`, `AGENTS.md` hierarchy
- **GitHub Copilot**: `AGENTS.md` + skill collections
- **skills.sh**: Community skill library with 87K+ installs on top skills

### Key Patterns from Top Skills

| Pattern | Source | Impact |
|---------|--------|--------|
| **Domain expertise over process** | Lovable/Vercel | Agents that *understand* vs agents that *follow* |
| **Progressive disclosure** | Anthropic/OpenAI | ~100 token metadata → <500 line instructions → on-demand refs |
| **Subagent specialists** | Claude Code | Isolated context, focused execution |
| **Evidence-first findings** | Codex internal | No claims without proof |
| **Do/Don't examples** | skills.sh top skills | Clear guardrails, not vague principles |

---

## Gap Analysis: Current vs Target

### Current Problems

1. **Generic, not specialized**: Skills read like documentation summaries, not expert knowledge
2. **Process over expertise**: "Here's how to audit" instead of "Here's what I know about Next.js 16"
3. **No designer specialist**: UI/UX work lacks dedicated domain expert
4. **Monolithic skills**: 150+ lines = context dilution
5. **No subagent architecture**: Everything runs in main context
6. **Evidence-free claims**: Agents flag issues without proof

### Target Architecture

```
.codex/
├── stack.yml                     # Stack SSOT (already exists ✓)
├── skills/                       # ALL specialists are SKILLS
│   ├── designer/SKILL.md        # NEW: UI/UX domain expert
│   ├── structure/SKILL.md       # NEW: Project organization expert
│   ├── treido-frontend/SKILL.md # REFACTOR: Implementation specialist
│   ├── treido-backend/SKILL.md  # REFACTOR: Server-side specialist
│   ├── treido-rails/SKILL.md    # KEEP: Project conventions
│   ├── tailwind-v4/SKILL.md     # NEW: Deep Tailwind v4 expertise
│   ├── nextjs-16/SKILL.md       # NEW: Deep Next.js 16 expertise
│   └── ...more focused skills
└── rules/                        # Path-specific auto-load rules
    ├── components.md            
    ├── actions.md               
    └── api.md                   
```

---

## The Specialist Agent Team

### 1. Designer Agent (NEW — CRITICAL)

**Purpose**: UI/UX domain expert. Not just "apply Tailwind" — understands visual hierarchy, spacing rhythm, accessibility, and anti-slop aesthetics.

**What makes it different**:
- Knows **why** certain spacing works
- Understands **visual hierarchy** principles
- Has **anti-slop** guardrails (no gradients, no generic AI aesthetics)
- Uses **verification loop**: implement → screenshot → compare → fix

```markdown
## Designer Agent — Domain Expertise

### Visual Hierarchy (Not Process, KNOWLEDGE)
- Primary action = most visual weight (size, contrast, position)
- Secondary actions = clearly subordinate
- Maximum 1-2 emphasis levers per screen

### Spacing Rhythm (DEEP KNOWLEDGE)
- 4px base rhythm: 4, 8, 12, 16, 24, 32, 48, 64
- Related elements: tighter (4-8px gap)
- Unrelated elements: looser (16-24px gap)
- Section breaks: generous (32-64px)

### Anti-Slop Checklist
❌ Purple gradients on white
❌ Neon glows and shadows
❌ Generic Inter/Roboto typography
❌ "AI demo" aesthetic
✅ Deliberate typography choices
✅ Consistent token usage
✅ Restraint in decoration
✅ Clear information hierarchy
```

### 2. Frontend Agent (REFACTOR)

**Purpose**: React/Next.js/Tailwind domain expert. Knows the **patterns**, not just the **process**.

**Domain Knowledge**:
- Next.js 16 App Router patterns (proxy.ts, not middleware.ts)
- React 19 Server Components (RSC by default, client islands)
- Tailwind v4 CSS-first (tokens in globals.css, no config file)
- shadcn/ui boundaries (primitives vs composites)

```markdown
## Frontend Agent — Domain Expertise

### Next.js 16 (DEEP KNOWLEDGE)
- Request hook is `proxy.ts`, NOT `middleware.ts`
- Caching: `'use cache'` + `cacheLife()` + `cacheTag()`
- Cached functions CANNOT touch cookies()/headers()
- Pages are RSC by default, add 'use client' only when needed

### React 19 Patterns (EXPERTISE)
- Server Components: fetch data, access DB, use secrets
- Client Components: interactivity, hooks, browser APIs
- Pattern: Server page → Client island children
- Anti-pattern: 'use client' on entire page

### Tailwind v4 Tokens (AUTHORITATIVE)
| Token | Purpose | Example |
|-------|---------|---------|
| background | Page/card backgrounds | bg-background |
| foreground | Primary text | text-foreground |
| muted-foreground | Secondary text | text-muted-foreground |
| primary | Brand action | bg-primary |
| destructive | Danger state | bg-destructive |
| border | Borders | border-border |
```

### 3. Backend Agent (REFACTOR)

**Purpose**: Supabase/Stripe/server-side domain expert.

**Domain Knowledge**:
- Supabase client selection (when to use which client)
- RLS patterns (row-level security expertise)
- Stripe webhook idempotency patterns
- Server action security patterns

```markdown
## Backend Agent — Domain Expertise

### Supabase Client Selection (AUTHORITATIVE)
| Situation | Client | Why |
|-----------|--------|-----|
| User mutation | createClient() | Uses cookies, respects RLS |
| Public cached read | createStaticClient() | Pure, cacheable |
| Webhook/admin | createAdminClient() + GUARD | Bypasses RLS |

### RLS Patterns (DEEP KNOWLEDGE)
- NEVER trust client-side user.id
- Always: supabase.auth.getUser() server-side
- Pattern: Filter by user.id in WHERE clause
- Anti-pattern: Trust incoming userId parameter

### Webhook Expertise
1. ALWAYS verify signature: constructEvent(body, sig, secret)
2. ALWAYS check idempotency: store processed event IDs
3. NEVER log raw payload (PII risk)
4. Return 200 quickly, process async if heavy
```

### 4. Structure Agent (NEW)

**Purpose**: Project organization and file conventions expert. Knows where things go.

```markdown
## Structure Agent — Domain Expertise

### File Placement (AUTHORITATIVE)
| Type | Location | Rule |
|------|----------|------|
| shadcn primitives | components/ui/ | No app logic |
| Reusable composites | components/shared/ | Can use lib/ |
| Route-private UI | app/[locale]/(group)/**/_components/ | Not exported |
| Server actions | app/actions/ | Named by verb |
| Route handlers | app/api/**/route.ts | REST conventions |

### Import Rules
- Absolute imports: @/ alias
- No barrel imports
- Layer boundaries: ui/ never imports app/ or lib/

### Naming (AUTHORITATIVE)
- Components: PascalCase.tsx
- Hooks: use*.ts
- Server actions: verbNoun.ts
- Route handlers: route.ts
```

### 5. Verify Agent (EXISTS — ENHANCE)

**Purpose**: Quality gates and evidence-based verification.

```markdown
## Verify Agent — Evidence Contract

### Evidence Types
- F### = file-backed fact (must cite path:line)
- S### = search-backed fact (must show command + result)

### Severity Rules
- Critical: ONLY if breakage is guaranteed given facts + rules
- High: Real risk, not guaranteed break
- Medium/Low: Conventions, readability

### Gate Commands
| When | Commands |
|------|----------|
| Always | pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate |
| UI changes | pnpm -s test:unit |
| Auth/checkout | REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke |
```

---

## Skill Structure (V4 Format)

Each skill: **~80-100 lines of expertise**, not process.

```markdown
---
name: skill-name
description: When to use this skill. Be specific about triggers.
---

# skill-name

One sentence: what this skill provides.

## Domain Expertise

### Topic 1 (AUTHORITATIVE)
| Pattern | What | Why |
|---------|------|-----|
| ... | ... | ... |

### Topic 2 (DEEP KNOWLEDGE)
Key insight or principle.

## ✅ Do

```tsx
// Good pattern with brief explanation
```

## ❌ Don't

```tsx
// Bad pattern with brief explanation
```

## Verification

```powershell
command-to-verify
```
```

---

## Skill Delegation Pattern

### When to Use Each Skill

| Task | Skill | Example |
|------|-------|---------|
| UI/UX design | designer | "Design the product card layout" |
| Component implementation | treido-frontend | "Build the filter sidebar" |
| Server action/DB | treido-backend | "Create checkout flow action" |
| File creation | structure | "Where should this component go?" |
| Styling questions | tailwind-v4 | "What token for secondary text?" |
| Routing/caching | nextjs-16 | "How to cache this page?" |
| Conventions | treido-rails | "What gates to run?" |

### Skill File Format (Standard)

`.codex/skills/<name>/SKILL.md`:
```markdown
---
name: skill-name
description: When to trigger. Be specific. Include DO NOT trigger conditions.
---

# skill-name

One sentence: what this skill provides.

## When to Apply

- Context 1
- Context 2

## Domain Expertise

### Topic 1 (AUTHORITATIVE)
| Pattern | What | Why |
|---------|------|-----|
| ... | ... | ... |

## ✅ Do

```tsx
// Good pattern
```

## ❌ Don't

```tsx
// Bad pattern
```

## Verification

```powershell
command-to-verify
```
```

---

## Path-Specific Rules

`.codex/rules/components.md`:
```markdown
---
paths:
  - "components/**/*.tsx"
---

# Component Rules (Auto-Applied)

- components/ui/* = shadcn primitives ONLY
- components/shared/* = reusable composites
- No data fetching inside components
- No Supabase/Stripe calls in components
- Tailwind tokens only (no arbitrary, no palette)
```

`.codex/rules/actions.md`:
```markdown
---
paths:
  - "app/actions/**/*.ts"
---

# Server Action Rules (Auto-Applied)

- ALWAYS verify user: supabase.auth.getUser()
- ALWAYS validate input: Zod schema
- NEVER trust incoming userId
- NEVER log PII
- Return structured errors: { error: string } | { data: T }
```

---

## Implementation Plan

### Phase 1: Core Skills (Week 1)
- [x] Create `.codex/skills/designer/SKILL.md` — UI/UX specialist
- [x] Create `.codex/skills/structure/SKILL.md` — Project organization
- [x] Create `.codex/skills/tailwind-v4/SKILL.md` — Tailwind expertise
- [x] Create `.codex/skills/nextjs-16/SKILL.md` — Next.js expertise
- [x] Create `.codex/rules/` directory with path-specific rules

### Phase 2: Skill Refactor (Week 1-2)
- [ ] Slim `treido-frontend` to ~80 lines (remove duplicated Tailwind content)
- [ ] Slim `treido-backend` to ~80 lines (focus on patterns)
- [ ] Slim `treido-rails` to ~60 lines (conventions only)
- [ ] Archive V2 skills

### Phase 3: Additional Skills (Week 2)
- [ ] Create `supabase-patterns/SKILL.md`
- [ ] Create `stripe-webhooks/SKILL.md`
- [ ] Create `i18n-nextintl/SKILL.md`

### Phase 4: Verification & Testing (Week 2-3)
- [ ] Update `.github/copilot-instructions.md`
- [ ] Test skill triggering
- [ ] Document in `docs/11-SKILLS.md`

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Skills count | 3 monolithic | 8-10 focused |
| Lines per skill | ~150 | ~80-100 |
| Specialist skills | 0 (generic) | 4+ (designer, structure, etc.) |
| Path rules | 0 | 3-5 |
| Designer expertise | None | Full skill |

---

## Key Insight

**The fundamental shift**: From "agents that follow processes" to "agents that have expertise".

Current: "Here's how to check Tailwind usage..."
Target: "I KNOW Tailwind v4 uses CSS-first tokens. The allowed tokens are..."

Current: "Here's the process for server actions..."
Target: "I KNOW createClient() uses cookies, createStaticClient() is pure, createAdminClient() bypasses RLS..."

**Domain expertise > Process checklists**

---

## References

- Anthropic Claude Code Skills: https://code.claude.com/docs/en/skills
- Anthropic Sub-agents: https://code.claude.com/docs/en/sub-agents
- OpenAI Codex Skills: https://developers.openai.com/codex/skills/
- AgentSkills Specification: https://agentskills.io/specification
- skills.sh Examples: https://skills.sh/
- Lovable Design Patterns: https://docs.lovable.dev/
