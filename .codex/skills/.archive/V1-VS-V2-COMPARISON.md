# V1 vs V2 Comparison

Side-by-side comparison of the old agent skill system vs the proposed simplified version.

---

## Skill Count

| V1 (Current) | V2 (Proposed) |
|--------------|---------------|
| 14 skills | 3 skills |

### V1 Skills (14)
```
treido-orchestrator    # DELETE - chat is orchestration
treido-frontend        # KEEP → consolidated
treido-backend         # KEEP → consolidated
treido-ui              # MERGE into frontend
treido-verify          # DELETE - inline verification
treido-alignment       # SIMPLIFY → section in backend
treido-structure       # DELETE - project guide
treido-docs            # DELETE - docs guide
codex-iteration        # DELETE - iteration guide
spec-tailwind          # MERGE into frontend
spec-shadcn            # MERGE into frontend
spec-nextjs            # MERGE into frontend
spec-supabase          # MERGE into backend
spec-typescript        # DELETE - standard guidance
```

### V2 Skills (3)
```
treido-frontend-v2.md  # All UI/styling/routing/i18n rules
treido-backend-v2.md   # All server/Supabase/Stripe rules
treido-rails-v2.md     # Project conventions & verification
```

---

## Trigger System

### V1: Manual Prefixes

```
User: ORCH: Please audit the product page
User: FRONTEND: Fix the button styling
User: UI: Make this feel premium
User: VERIFY: Check if this is ready
User: SPEC-TAILWIND:AUDIT Check token usage
```

**Problems:**
- Must remember correct prefix
- Multiple prefixes for similar work (`FRONTEND:` vs `UI:` vs `DESIGN:`)
- Adds friction to every request

### V2: No Prefixes

```
User: Audit the product page
User: Fix the button styling
User: Make this feel premium
User: Check if this is ready to ship
User: Are we using the right tokens?
```

**How it works:**
- Context determines knowledge application
- "button styling" → frontend rules
- "server action" → backend rules
- AI applies relevant rules automatically

---

## Orchestration Model

### V1: Explicit Orchestrator Skill

```markdown
# treido-orchestrator (500+ lines)

You coordinate:
1) parallel read-only specialist audits,
2) a single merged audit artifact in `.codex/audit/*`,
3) a single task queue in `.codex/TASKS.md`,
4) delegated execution to one lane at a time,
5) verification gates plus the smallest relevant tests.

## Single-writer rules
- Orchestrator writes `.codex/audit/*` and `.codex/TASKS.md`
- Executors patch application code
- Everyone else is read-only
```

**Problems:**
- Heavy process for single-user chat
- "Lanes" don't exist - it's just you and AI
- Single-writer rules solve a problem you don't have
- Audit artifacts add overhead without value

### V2: Chat IS Orchestration

```
No orchestrator skill needed.

You: "Fix the button spacing"
AI: [applies frontend knowledge, makes fix, runs verification]

You: "Actually, also update the server action"
AI: [applies backend knowledge, makes fix, runs verification]
```

The conversation flow IS the coordination.

---

## Skill Size Comparison

### V1: treido-ui (500+ lines)

```markdown
---
name: treido-ui
description: "Design implementation executor..."
---

# treido-ui - UI design execution (IMPL)

## 1) Mindset Declaration (who I am)
I am a senior UI engineer who ships calm, modern...
[30 lines]

## 2) Domain Expertise Signals (what I look for)
[50 lines]

## 2.5) App-feel defaults (Treido UX)
[80 lines]

## 3) Visual Hierarchy Fundamentals
[150 lines]

## 4) Spacing System Philosophy
[100 lines]

## 5) Premium Design Principles
[100 lines]

## 6) Decision Tree With Escalation
[50 lines]

## 7) Non-Negotiables (CRITICAL)
[20 lines]

## 8) Fix Recipes (battle cards)
[40 lines]

## 9) Golden Path Examples
[20 lines]

## 10) Anti-Patterns With Shame
[30 lines]

## 11) Integration With This Codebase
[20 lines]

## 12) Output Format
[10 lines]
```

### V2: treido-frontend-v2 (~200 lines)

```markdown
# treido-frontend

## When to Apply
[5 lines]

## Rules by Priority

### CRITICAL - Tailwind Token Rails
[table + 2 code examples]

### CRITICAL - i18n Required
[table + 1 code example]

### HIGH - shadcn Boundaries
[table + file tree]

### HIGH - Server/Client Boundaries
[table + 1 code example]

### MEDIUM - Spacing & Hierarchy
[table + 1 code example]

## Common Fixes
[3 quick fix examples]

## Verification
[3 commands]

## Key Files
[table]
```

**V2 is ~60% shorter while keeping all actionable rules.**

---

## Spec Agent Redundancy

### V1: Separate spec-tailwind skill

```markdown
# spec-tailwind (~400 lines)

## 1) Mindset Declaration
## 2) Domain Expertise Signals  
## 3) Token Semantics Philosophy
## 4) Constraint-Based Design Principles
## 5) Decision Tree
## 6) Non-Negotiables
## 7) Fix Recipes
## 8) Golden Path Examples
## 9) Anti-Patterns
## 10) Integration
## 11) Output Format
```

### V2: Inline in treido-frontend-v2

```markdown
### CRITICAL - Tailwind Token Rails

| Rule | Description |
|------|-------------|
| `tw-semantic-only` | Use semantic tokens |
| `tw-no-palette` | Never palette colors |
| `tw-no-gradients` | Never gradients |
| `tw-no-arbitrary` | Never arbitrary values |
| `tw-no-opacity-hacks` | Never opacity on tokens |

[+ examples]
```

**Same rules, 90% less text.**

---

## Verification Approach

### V1: Separate treido-verify skill

```markdown
# treido-verify (~300 lines)

## 1) Mindset Declaration
I am the verifier: fast signals first...

## 2) Domain Expertise Signals
## 3) Coverage Philosophy
## 4) Flakiness Strategy
## 5) Decision Tree
## 6) Non-Negotiables
## 7) Fix Recipes
## 8) Golden Path Examples
## 9) Anti-Patterns
## 10) Integration
## 11) Output Format
```

### V2: Inline verification section in each skill

```markdown
## Verification

After any frontend change:
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate

After UI component changes:
pnpm -s test:unit
```

**5 lines vs 300 lines. Same outcome.**

---

## Summary: What V2 Removes

| Removed | Why |
|---------|-----|
| Orchestrator skill | Chat is orchestration |
| Manual prefixes | Context determines application |
| Audit payloads | No multi-agent handoff needed |
| Single-writer rules | No parallel agents |
| Dated audit artifacts | Unnecessary bureaucracy |
| Separate spec agents | Merged into main skills |
| Separate verify skill | Inline in each skill |
| "Mindset Declaration" sections | Adds words, not value |
| "Output Format" sections | Not needed for skills |
| Extensive philosophy text | Keep rules, trim essays |

## Summary: What V2 Keeps

| Kept | Why |
|------|-----|
| Tailwind token rails | Critical project rule |
| shadcn boundaries | Critical project rule |
| i18n requirements | Critical project rule |
| Auth verification | Critical security rule |
| Webhook idempotency | Critical backend rule |
| Pause conditions | Risk management |
| Verification commands | Quality gates |
| Fix recipes (simplified) | Actionable guidance |
| File organization | Project structure |
