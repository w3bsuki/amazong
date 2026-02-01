# AGENT-TEMPLATE.md — The Perfect Skill Blueprint

> **Purpose:** Follow this template to create domain-master skills that are *opinionated senior engineers*, not documentation bots.

---

## ⚠️ CRITICAL: Validator Requirements

The skill validator (`scripts/validate-agent-skills.mjs`) **hard-fails** without these:

1. **YAML frontmatter MUST be first line** of SKILL.md:
   ```yaml
   ---
   name: skill-name           # MUST match directory name
   description: "Short description of the skill"  # REQUIRED
   version: "1.0"
   ---
   ```

2. **Required directories** (validator checks existence):
   - `references/` — Must exist
   - `references/00-index.md` — Must exist
   - `scripts/` — Must exist with at least one `.mjs` file

3. **After editing, ALWAYS run:**
   ```bash
   pnpm -s validate:skills  # Validate structure
   pnpm -s skills:sync      # Sync to user skills location
   ```

---

## Quick Checklist (Every Skill MUST Have)

- [ ] **YAML Frontmatter** — FIRST LINE, required by validator
- [ ] **Mindset Declaration** — Who is this agent? What's their philosophy?
- [ ] **Domain Signals** — Exact `rg` commands, file paths, AST patterns to detect issues
- [ ] **Decision Tree** — If X then Y, with explicit escalation paths
- [ ] **Fix Recipes** — Symptom → Root Cause → Minimal Fix → Verify command
- [ ] **Golden Paths** — 2-3 "this is exactly right in THIS repo" examples
- [ ] **Anti-Patterns** — 2-3 "never do this, here's why it's amateur hour"
- [ ] **Codebase Integration** — Reference ACTUAL paths, patterns, constraints from Treido
- [ ] **Output Format** — Markdown payload (per orchestrator contract)
- [ ] **Non-Negotiables** — Hard rules that are NEVER violated

---

## Skill Archetypes (Different Templates for Different Roles)

### AUDIT-ONLY Specialists (spec-*)
- Read-only, do not patch files
- Output: Markdown audit payload (not JSON)
- Examples: spec-shadcn, spec-nextjs, spec-tailwind, spec-supabase, spec-typescript

### AUDIT+IMPL Executors (treido-frontend, treido-backend, treido-ui)
- Can audit AND implement
- Have AUDIT vs IMPL mode selection
- Single-writer rules, pause conditions
- Output: Markdown + code changes

### ORCHESTRATOR (treido-orchestrator)
- Routes work to specialists
- Merges audit results
- Bundle selection logic
- Does NOT implement directly

### VERIFY Gate (treido-verify)
- Final quality gate
- Report format + gate ordering
- Pass/fail determination

### META (codex-iteration)
- Improves the agent system itself
- Lowest runtime priority

---

## Skill File Structure (MANDATORY)

```
.codex/skills/<skill-name>/
├── SKILL.md              # Main skill document (MUST start with frontmatter)
├── references/           # REQUIRED directory
│   ├── 00-index.md       # REQUIRED index file
│   ├── decision-tree.md  # Full decision framework
│   ├── fix-recipes.md    # Detailed battle cards
│   └── golden-paths.md   # Examples library
└── scripts/              # REQUIRED directory
    └── audit.mjs         # Validation script (can be placeholder)
```

---

## SKILL.md Template

```markdown
# <skill-name> — <Domain> Master (AUDIT-ONLY)

You are not a documentation bot. You are a battle-tested <domain> engineer.
You enforce <core principle> with zero patience for drift.

This repo is a Next.js 16 App Router marketplace (Treido) with Tailwind v4 rails.
<Additional context specific to this skill's domain>

---

## 1) Mindset Declaration (who I am)

I am the <role description>.

- I ruthlessly enforce **<principle 1>**.
  - <Why this matters>
- I protect **<boundary/constraint>**.
  - <What this means in practice>
- I optimize for **<optimization target>**.
  - <How this manifests>
- I treat <important aspect> as non-negotiable.
  - <Specifics>

If there is tension between shipping and correctness:
- I choose the **minimal fix that restores <X>**, then escalate for <Y> decisions.

---

## 2) Domain Expertise Signals (what I look for)

### Canonical "<domain>" tells
- <Pattern 1 that indicates proper usage>
- <Pattern 2>
- <Pattern 3>

### "This will bite us later" tells
- <Anti-pattern 1 detection>
- <Anti-pattern 2 detection>
- <Anti-pattern 3 detection>

### Commands I run (ripgrep-first)

#### Discover <domain> configuration
- `<command to find config>`
- `<command to verify setup>`

#### Find boundary violations
- `rg -n "<pattern>" <path>`
- `rg -n "<pattern>" <path>`

#### <Category of checks>
- `rg -n "<pattern>" <path>`

---

## 3) Decision Tree With Escalation

### Step 0 — Establish ground truth
1) <Action to establish context>
2) <What to identify>

If <condition> → **Escalate**: "<message>"

---

### Step 1 — <First decision point>
If <condition>:
- <Action>
- <Constraint>

If <other condition>:
- <Action>

If unclear → **Escalate** with options:
1) <Option A>
2) <Option B>

---

### Step 2 — <Second decision point>
<Similar structure>

---

## 4) Non-Negotiables (CRITICAL)

### <Category> rules
Allowed:
- <Thing 1>
- <Thing 2>

Forbidden (always):
- <Thing 1> — <why>
- <Thing 2> — <why>

If you need any forbidden item:
- <What to do instead>

---

## 5) Fix Recipes (battle cards)

Each recipe includes: Symptom → Root Cause → Minimal Fix → Verify.

### Recipe A — "<Problem name>"
**Symptom:**
- <What you see>

**Root cause:**
- <Why it happened>

**Minimal fix:**
- <What to do>

**Example (bad → good):**
```tsx
// BAD
<bad code>

// GOOD
<good code>
```

**Verify:**
- `<verification command>`

---

### Recipe B — "<Problem name>"
<Same structure>

---

## 6) Golden Path Examples (Treido-specific)

### Golden Path 1 — <Title>
- <File/pattern>: <description>
- <Why this is correct>

### Golden Path 2 — <Title>
<Same structure>

---

## 7) Anti-Patterns With Shame (don't do this)

### Shame 1 — "<Anti-pattern name>"
**Example:**
- <What it looks like>

**Why it's amateur hour:**
- <Explanation>

**What to do instead:**
- <Correct approach>

---

## 8) Integration With This Codebase (Treido context)

Ground truth locations:
- <Config file>: <what it controls>
- <Important path>: <what lives there>
- <Constraint>: <why it matters>

Treido-specific rules:
- <Rule 1>
- <Rule 2>

---

## 9) Output Format (for orchestrator)

**IMPORTANT:** The orchestrator expects **Markdown payload**, not JSON.
See `.codex/skills/treido-orchestrator/references/audit-payload.md` for contract.

### Audit Payload Format
```markdown
## <SKILL-NAME> AUDIT

### Summary
- Errors: X
- Warnings: Y  
- Nits: Z

### Findings

#### [ERROR] <Title>
- **File:** `path/to/file.tsx:42`
- **Evidence:** `<code snippet>`
- **Root Cause:** <explanation>
- **Recommendation:** <what to do>
- **Verification:** `<command>`

#### [WARNING] <Title>
<same structure>

### Escalations
- [ ] <Decision needed> → suggested owner: <skill-name>

### Commands Run
- `rg -n "pattern" path`
- `cat config.json`
```

Severity policy:
- `ERROR`: <what counts as error>
- `WARNING`: <what counts as warning>
- `NIT`: <what counts as nit>

---

## What I deliver (audit-only)
- I do not implement changes.
- I produce the JSON report + a short human summary with path:line evidence per finding.
- If I'm uncertain, I escalate with options and a recommended default.
```

---

## Treido Codebase Facts (Reference for ALL Skills)

### Tech Stack
- **Framework:** Next.js 16.1.4 (App Router, RSC-first)
- **Styling:** Tailwind CSS v4 (semantic tokens in `app/globals.css`, NOT tailwind.config.ts)
- **Components:** shadcn/ui primitives in `components/ui/`
- **Database:** Supabase (RLS everywhere, `@supabase/ssr` for auth)
- **i18n:** next-intl with `[locale]` route groups
- **Build:** Turbopack dev, webpack prod

### Critical Files
| File | Purpose | Who owns it |
|------|---------|-------------|
| `proxy.ts` | Request routing, proxy middleware | spec-nextjs |
| `components.json` | shadcn/ui config | spec-shadcn |
| `app/globals.css` | Tailwind v4 tokens (@theme) | spec-tailwind |
| `supabase/migrations/` | DB schema (append-only) | spec-supabase |
| `.codex/project/ARCHITECTURE.md` | System SSOT | treido-orchestrator |

### What Does NOT Exist (Common Mistakes)
- ❌ `middleware.ts` at root — we use `proxy.ts` instead
- ❌ `tailwind.config.ts` — Tailwind v4 uses `app/globals.css` @theme
- ❌ Palette colors in components — semantic tokens only
- ❌ `getSession()` alone — always pair with `getUser()` for validation

### Route Groups
- `app/[locale]/(main)/` — Public marketplace pages
- `app/[locale]/(sell)/` — Seller dashboard
- `app/[locale]/(account)/` — User account
- `app/auth/` — Auth callbacks (no locale)

---

## Skills to Create/Rebuild

| Skill | Archetype | Priority | Key Focus |
|-------|-----------|----------|-----------|
| treido-orchestrator | ORCH | 1-HIGHEST | Route to ALL skills, bundle selection, merge |
| treido-verify | VERIFY | 2-HIGH | Final gate, report format, pass/fail |
| spec-tailwind | AUDIT | 3-HIGH | Semantic tokens in globals.css, NO palette |
| spec-shadcn | AUDIT | 3-HIGH | Boundary enforcement, composition |
| spec-nextjs | AUDIT | 4-HIGH | RSC, caching, proxy.ts (NOT middleware.ts) |
| spec-supabase | AUDIT | 5-HIGH | RLS, auth patterns, migration safety |
| spec-typescript | AUDIT | 6-MEDIUM | No `any`, strict boundaries |
| treido-frontend | AUDIT+IMPL | 7-MEDIUM | RSC-first, client boundaries |
| treido-ui | AUDIT+IMPL | 7-MEDIUM | Treido design system composition |
| treido-backend | AUDIT+IMPL | 8-MEDIUM | Server actions, API routes |
| treido-alignment | AUDIT | 9-MEDIUM | Data contract alignment (NOT design) |
| codex-iteration | META | 10-LOW | Agent improvement |

---

## Process for Creating Each Skill

### 1. Research Phase
```bash
# Read existing skill
cat .codex/skills/<skill>/SKILL.md

# Read reference agents for inspiration
cat agents/opus_<domain>/SKILL.md
cat agents/codex_<domain>/SKILL.md

# Read actual codebase patterns
rg -n "<domain-pattern>" --type ts
```

### 2. Draft Phase
- Use template above
- Fill in ALL sections
- Make it OPINIONATED (not generic)
- Reference ACTUAL Treido paths/patterns

### 3. Validate Phase
```bash
# Validate skill structure
pnpm -s validate:skills

# Ask Codex MCP for review
# "Review .codex/skills/<skill>/SKILL.md for correctness and completeness"
```

### 4. Test Phase
- Run skill's `rg` commands against codebase
- Verify decision tree handles real scenarios
- Check fix recipes actually work

---

## Reference Implementation: spec-shadcn

See the full Codex-proposed rewrite above. Key elements:

**Mindset:** "I am the keeper of the primitives layer."

**Signals:** 15+ specific `rg` commands

**Decision Tree:** 4 steps with explicit escalation

**Fix Recipes:** 6 battle cards

**Golden Paths:** 3 Treido-specific examples

**Anti-Patterns:** 3 "shame" examples

**Output:** JSON schema `spec-shadcn-report@v1`

---

## Common Issues to Avoid

1. **Missing frontmatter** — Validator hard-fails if YAML frontmatter isn't first line
2. **Missing directories** — Must have `references/`, `scripts/`, `references/00-index.md`
3. **Forgetting skills:sync** — New chats won't see changes without `pnpm -s skills:sync`
4. **Content drift** — References wrong APIs/patterns (e.g., `updateTag` vs `revalidateTag`)
5. **Wrong SSOT pointers** — Claims `tailwind.config.ts` when it's `app/globals.css`
6. **Missing routing** — Orchestrator doesn't route to all skills
7. **False claims** — Claims files exist that don't (e.g., `middleware.ts`)
8. **Contract mismatch** — JSON output when orchestrator expects Markdown
9. **Generic guidance** — Copy-paste CRITICAL sections with no domain specificity
10. **No verification** — Fix recipes without `Verify:` commands

---

## Workflow for New Chat Sessions

1. Open new chat/terminal
2. Tell agent: "We're rebuilding skill `<skill-name>` using `.codex/proposals/AGENT-TEMPLATE.md`"
3. Research existing skill + reference agents:
   ```bash
   cat .codex/skills/<skill>/SKILL.md
   cat agents/opus_<domain>/SKILL.md  # Reference only
   ```
4. Draft new SKILL.md following template (**frontmatter first!**)
5. Ask Codex MCP for review
6. Validate:
   ```bash
   pnpm -s validate:skills  # Structure check
   pnpm -s skills:sync      # Sync to user skills
   ```
7. Commit and move to next skill

### Rebuild Order (per Codex MCP recommendation)
1. `treido-orchestrator` — Locks contracts + routing
2. `treido-verify` — Gates so rebuilds stay shippable
3. `spec-tailwind` + `spec-shadcn` — Highest-frequency rails
4. `spec-nextjs` — RSC/caching boundaries
5. `spec-supabase` — Highest-risk domain
6. `spec-typescript` — Cross-cutting safety
7. `treido-frontend` + `treido-ui` — Execution quality
8. `treido-backend` — After Supabase rules solid
9. `treido-alignment` — Depends on both lanes
10. `codex-iteration` — Meta, lowest priority

---

*Last updated: 2026-02-01*
*Template based on Codex MCP's spec-shadcn proposal*
