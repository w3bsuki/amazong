# CLI-AGENT-REBUILD-TASK.md

> **For:** Codex CLI  
> **Task:** Rebuild all 12 skills as domain masters  
> **Template:** `.codex/proposals/AGENT-TEMPLATE.md`  
> **Audit after:** Opus + Codex MCP will review

---

## Mission

Transform all `.codex/skills/*` from generic documentation into **opinionated senior engineer** skills following the AGENT-TEMPLATE.md pattern.

Each skill must have:
- Mindset declaration (who is this agent?)
- Domain signals (`rg` commands, file patterns)
- Decision tree with escalation
- Fix recipes (symptom → cause → fix → verify)
- Golden paths (Treido-specific examples)
- Anti-patterns with shame
- Codebase integration (ACTUAL paths)
- Markdown output format (per orchestrator contract)

---

## Execution Order

Follow this EXACT order (dependencies matter):

### Phase 1: Infrastructure (do first)
1. **treido-orchestrator** — Routes to all skills, bundle selection
2. **treido-verify** — Final quality gate, report format

### Phase 2: Spec Agents (audit-only)
3. **spec-tailwind** — Semantic tokens in `app/globals.css`
4. **spec-shadcn** — Primitive boundaries, composition
5. **spec-nextjs** — RSC, caching, `proxy.ts` (NOT middleware.ts!)
6. **spec-supabase** — RLS, auth patterns, migrations
7. **spec-typescript** — No `any`, strict boundaries

### Phase 3: Executor Agents
8. **treido-frontend** — RSC-first, client boundaries
9. **treido-ui** — Treido design system composition
10. **treido-backend** — Server actions, API routes

### Phase 4: Support Agents
11. **treido-alignment** — Data contract alignment
12. **codex-iteration** — Meta (agent improvement)

---

## For EACH Skill

### Step 1: Read current state
```bash
cat .codex/skills/<skill>/SKILL.md
cat .codex/skills/<skill>/references/00-index.md
```

### Step 2: Read reference agents (for inspiration)
```bash
# If exists
cat agents/opus_<domain>/SKILL.md
cat agents/codex_<domain>/SKILL.md
```

### Step 3: Read actual codebase patterns
```bash
# Examples for spec-shadcn:
cat components.json
ls components/ui/
rg -n "use client" components/ui/ --stats

# Examples for spec-nextjs:
cat proxy.ts
rg -n "revalidateTag|revalidatePath" app/
```

### Step 4: Rewrite SKILL.md

**CRITICAL:** Frontmatter MUST be first line with ALL required fields:
```yaml
---
name: <skill-name>           # MUST match directory name
description: "<description>"  # REQUIRED by validator
version: "1.0"
---
```

**OUTPUT CONTRACT:** Read and conform to:
`.codex/skills/treido-orchestrator/references/audit-payload.md`

Follow AGENT-TEMPLATE.md sections:
1. Mindset Declaration
2. Domain Expertise Signals
3. Decision Tree With Escalation
4. Non-Negotiables (CRITICAL)
5. Fix Recipes
6. Golden Path Examples  
7. Anti-Patterns With Shame
8. Integration With This Codebase
9. Output Format

### Step 5: Update references/decision-tree.md
Full decision framework with all branches

### Step 6: Ensure scripts/ has runnable file
```bash
# scripts/ MUST contain at least one .mjs file
# If none exists, create placeholder:
echo '// Placeholder audit script' > .codex/skills/<skill>/scripts/audit.mjs
```

### Step 7: Validate
```bash
pnpm -s validate:skills
```

---

## Treido Codebase Facts (USE THESE)

### Critical Files
| What | Where | NOT |
|------|-------|-----|
| Tailwind tokens | `app/globals.css` @theme | ~~tailwind.config.ts~~ |
| Request routing | `proxy.ts` | ~~middleware.ts~~ |
| shadcn config | `components.json` | - |
| Auth | `@supabase/ssr` + `getUser()` | ~~getSession() alone~~ |
| Migrations | `supabase/migrations/` (append-only) | - |
| Architecture | `.codex/project/ARCHITECTURE.md` | - |
| Cache invalidation | `revalidateTag(tag, profile)` | ~~updateTag()~~ |

### Route Groups
- `app/[locale]/(main)/` — Public marketplace
- `app/[locale]/(sell)/` — Seller dashboard
- `app/[locale]/(account)/` — User account
- `app/auth/` — Auth callbacks (no locale)

### Tech Stack
- Next.js 16.1.4 (App Router, RSC-first)
- Tailwind CSS v4 (semantic tokens only)
- shadcn/ui in `components/ui/`
- Supabase (RLS everywhere)
- next-intl (i18n)

---

## Quality Gates (What Opus + Codex MCP Will Check)

### Structure
- [ ] YAML frontmatter is FIRST LINE
- [ ] Frontmatter has `name` (matches dir), `description`, `version`
- [ ] `references/` directory exists
- [ ] `references/00-index.md` exists
- [ ] `scripts/` directory exists with at least one `.mjs` file
- [ ] `pnpm -s validate:skills` passes

### Content
- [ ] Has Mindset Declaration (not generic)
- [ ] Has specific `rg` commands (not placeholder)
- [ ] Decision tree has escalation paths
- [ ] Fix recipes have Verify commands
- [ ] Golden paths reference ACTUAL Treido files
- [ ] Anti-patterns explain WHY it's wrong
- [ ] No false claims (middleware.ts, tailwind.config.ts)
- [ ] Uses correct APIs (revalidateTag not updateTag)

### Integration
- [ ] References `.codex/project/ARCHITECTURE.md` where relevant
- [ ] Routing matches orchestrator bundle matrix
- [ ] Output format matches orchestrator contract (Markdown payload ONLY)
- [ ] Conforms to `.codex/skills/treido-orchestrator/references/audit-payload.md`

### No Residue
- [ ] No template placeholders left: `rg -n "<[^>]+>" .codex/skills/<skill>/`
- [ ] No false claims: `rg -n "tailwind\\.config|middleware\\.ts|updateTag\\(" .codex/skills/<skill>/`
- [ ] Every cited path actually exists (verify before mentioning)

---

## Definition of Done

All 12 skills:
1. Pass `pnpm -s validate:skills`
2. Have all 9 template sections filled
3. Reference actual Treido paths/patterns
4. No generic copy-paste content
5. Ready for Opus + Codex MCP audit

---

## After Completion

Run:
```bash
pnpm -s validate:skills
pnpm -s skills:sync
```

Then notify: "Agent rebuild complete. Ready for Opus + Codex MCP audit."

---

*Task created: 2026-02-01*
*Template: .codex/proposals/AGENT-TEMPLATE.md*
