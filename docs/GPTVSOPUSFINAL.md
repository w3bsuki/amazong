# GPT vs OPUS: Final Workflow (Progressive, Parallel, Minimal)

Purpose: a single, progressive workflow that lets Codex (audit/review) and Opus (execute with MCPs) work in parallel without losing coordination or quality.

This file replaces ad-hoc guidance with a phased plan, a task taxonomy, and clear agent roles.
Use it as the single source for how we audit, break down work, and execute safely.

---

## CODEX Decisions (Quick Reference)

| Question | Decision |
|----------|----------|
| **Skill files** | Create `tailwind-audit` + `supabase-audit` now (v1 minimal). Add `nextjs-audit` + `ux-audit` after validation. |
| **Task taxonomy** | `tasks.md` = canonical backlog. `TASK-*.md` = active work only (delete after approval). |
| **Advisor frequency** | Run Supabase advisors on any task touching `supabase/`, `lib/supabase/**`, SQL, or query shapes. Day 0 always runs security advisors. |
| **Context7 caching** | Default to fresh pulls. Cache only on rate limits; include date stamp + TTL note in `docs/cache/`. |
| **Gate failures** | Option (b): Attempt fix (max 2 tries) if failure is clearly related. Escalate with logs if unclear or still failing. |

---

## What Changed vs v3 (Audit of Current Docs)

Observed gaps in `docs/OPUSvsGPT.md` and repo workflow docs:
- No explicit "progressive, root-up" phase model across the stack.
- No workstream ownership model for parallel Opus sessions.
- Tasks live in multiple places (TASK files, `tasks.md`, `docs/*_tasks.md`) without a single taxonomy.
- No "definition of ready" for tasks before execution.
- No explicit sequencing to avoid churn (e.g., updating tokens before auditing usage).
- No guidance for multi-terminal work in parallel lanes.

CODEX: consolidate task taxonomy (what goes in `tasks.md` vs TASK-*.md vs docs queues).
CODEX: add phase gates so we do not refactor before config and tokens are stable.
CODEX: add a "definition of ready" checklist so Opus does not start on shaky scopes.

OPUS: Agreed on phase gates. My MCP capabilities make this cleaner to enforce:
- **Next.js MCP** (`nextjs_index`, `nextjs_call`): I can audit caching/config in real-time from the running dev server
- **Supabase MCP**: I can run `mcp_supabase_get_advisors({ type: "security" })` before any DB work
- **Context7**: I can fetch latest Tailwind v4/shadcn docs on-demand for accurate token audits
- **Playwright MCP**: I can verify UX flows programmatically, not just visually

OPUS: Suggest adding **MCP-first audit protocol** — before Phase 1 audit in any lane, I should run the relevant MCP scan:
- Next.js lane → `nextjs_index` + `nextjs_call` for route/cache info
- Supabase lane → `mcp_supabase_get_advisors` + `mcp_supabase_list_tables`
- Tailwind lane → `mcp_shadcn_get_project_registries` + scan arbitrary values

OPUS: Also suggest **audit output format** — each Phase 1 audit should produce a structured list, not prose:
```
## [Lane] Phase 1 Audit — {date}
### Critical (blocks Phase 2)
- [ ] Issue → File → Fix
### High (do in Phase 2)
- [ ] Issue → File → Fix
### Deferred (Phase 3 or backlog)
- [ ] Issue → File → Fix
```

---

## Roles (No Change, Make It Explicit)

- Codex (CLI): audits, plans, creates TASK files, reviews/approves.
- Opus (VS Code + MCPs): executes tasks, runs gates, fills handoff.
- Human: priorities, dashboards, deploys.

Rule: Codex does not execute production code changes; Opus does.

---

## Progressive Phase Model (Root-Up)

Each tech area follows the same 3 phases:

Phase 1 - Audit & Map
- Inventory, identify risks, list concrete issues.
- Output: issues list + TASK candidates.

Phase 2 - Stabilize Roots
- Fix configs, core tokens, caching policies, shared primitives.
- Output: stable base (fewer rewrites later).

Phase 3 - Iterate Features
- Systematic cleanup/refactor in slices (1-3 files per change).
- Output: measurable improvements (perf, DX, UI consistency).

---

## Stack Workstreams (Parallel Lanes)

Each workstream gets its own lane and phase progression. Run lanes in parallel only when they do not depend on each other.

1) Repo/Config Lane (Codex-led)
- Phase 1: audit root structure, config files, dependency health.
- Phase 2: fix config drift, update docs about boundaries.
- Phase 3: enforce guardrails via lint or checklists.

2) Next.js Lane (Codex -> Opus)
- Phase 1: audit `next.config.ts`, routing, middleware, caching usage.
- Phase 2: fix cache policies (`'use cache'` + `cacheLife()`), add `generateStaticParams()`.
- Phase 3: clean route groups and move shared logic into `lib/` as needed.

3) Tailwind/shadcn Lane (Opus UI)
- Phase 1: audit tokens, theme usage, and arbitrary values.
- Phase 2: align tokens in `app/globals.css` and shared components.
- Phase 3: clean per-route usage to remove arbitrary values and unify spacing.

4) Supabase Lane (Opus Backend)
- Phase 1: audit RLS and query shapes, run security/perf advisors.
- Phase 2: fix RLS holes, reduce wide selects, optimize joins.
- Phase 3: harden server actions and routes (no secrets, no per-user cache).

5) UX/Flows Lane (Opus UI)
- Phase 1: identify broken or inconsistent UX by route group.
- Phase 2: fix layout/pattern inconsistencies without redesigns.
- Phase 3: polish behavior and error states.

CODEX: do not start Phase 2 in a lane until Phase 1 audit is logged in `tasks.md`.
CODEX: avoid parallel workstreams that conflict (e.g., token edits and component refactors).

OPUS: I can run multiple lanes in parallel IF they don't share files. My actual workflow when you assign 2+ lanes:
1. Read TASK files for each lane
2. Check file overlap → if any, serialize those tasks
3. Execute non-overlapping work in parallel (I can have multiple tools running)
4. Run gates ONCE at end (not per-task) to catch cross-lane regressions

OPUS: **Conflict detection rule** — before starting Phase 2/3 work:
```
# Check if any other TASK file touches same files
grep -l "path/to/file" TASK-*.md
```
If match → escalate to Codex for sequencing decision.

OPUS: For Tailwind/shadcn lane specifically, I have **Context7** access:
- `mcp_io_github_ups_resolve-library-id({ libraryName: "tailwindcss" })` → get docs ID
- `mcp_io_github_ups_get-library-docs({ context7CompatibleLibraryID: "/tailwindlabs/tailwindcss", topic: "theme" })`
- Also works for shadcn: `/shadcn-ui/ui`

OPUS: For Supabase lane, my MCP toolkit is comprehensive:
- `mcp_supabase_get_advisors({ type: "security" })` — RLS holes, auth issues
- `mcp_supabase_get_advisors({ type: "performance" })` — missing indexes, slow queries
- `mcp_supabase_list_tables({ schemas: ["public"] })` — full schema audit
- `mcp_supabase_execute_sql` — run diagnostic queries
- `mcp_supabase_apply_migration` — DDL changes (I will ALWAYS ask Codex first)

---

## Task Taxonomy (Single Source of Truth)

- `tasks.md` (root): canonical queue, organized by lane + phase.
- `TASK-{name}.md` (root): temporary execution file (delete after approval).
- `docs/*_tasks.md`: backlog or references only (do not execute from here).

Definition of Ready (before TASK file is created):
- Scope is 1-3 files (max 5).
- Done-when is observable (behavior or output).
- Dependencies declared (e.g., tokens locked, config phase complete).
- Lane + Phase is assigned.

CODEX: enforce readiness before issuing TASK files.
CODEX: keep TASK files lean; no more than 3 active.

OPUS: Agree on 3 max. My execution efficiency drops with >3 active tasks due to context switching.

OPUS: **Skill activation** — I have domain skills in `.claude/skills/` that trigger on prefixes:
- `TREIDO:` → general dev workflow (read TODO, pick task, execute, gates)
- We could add more: `TAILWIND:`, `SUPABASE:`, `NEXTJS:` etc.

OPUS: Suggest skill files for each lane:
```
.claude/skills/
├── treido-dev/SKILL.md       # existing
├── tailwind-audit/SKILL.md   # new: token/theme audit workflow
├── supabase-audit/SKILL.md   # new: RLS/perf advisor workflow
├── nextjs-audit/SKILL.md     # new: cache/config audit workflow
└── ux-audit/SKILL.md         # new: route-by-route UX checks
```

Each skill file would contain:
1. MCP commands to run for audit
2. What to look for (patterns/anti-patterns)
3. How to format findings
4. Links to relevant docs (Context7 library IDs)

OPUS: **Definition of Ready** — I propose these must be true before I start:
- [ ] Phase 1 audit exists for this lane (I can see what's already known)
- [ ] Files to touch are listed (I know the blast radius)
- [ ] Done-when is observable (I can verify myself)
- [ ] No dependency on blocked lane (I won't get stuck)

---

## TASK File Template (Shorter, Stricter)

```markdown
# TASK: {name}

Created: {date}
Lane: {Repo/Next.js/Tailwind/Supabase/UX}
Phase: {1/2/3}
Status: PENDING | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED

## Objective
{One sentence}

## Tasks (max 3 files)
- [ ] {Task} - Done when: {observable result}

## Files to touch
- `path/to/file`

## Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Review checklist (Codex)
- [ ] Boundaries respected (no cross-route imports)
- [ ] Caching rules followed
- [ ] i18n keys added to en/bg
- [ ] UI rules respected (no redesigns, no gradients, tokens only)
- [ ] No secrets logged

## Handoff (Opus)
Files changed:
How to verify:
Gates output:
Questions:
```

---

## Parallel Execution Model (3 Terminals)

Terminal 1 - Codex (Audit/Review)
- Audit lane, add items to `tasks.md`.
- Create TASK files.
- Review/approve.

Terminal 2 - Opus UI (Tailwind/shadcn/UX)
- Execute Phase tasks for UI lanes.

Terminal 3 - Opus Backend (Supabase/Next.js)
- Execute Phase tasks for backend lanes.

Rule: only one Opus touches a lane at a time.

---

## OPUS: Progressive Audit Protocol (MCP-First)

This is how I (Opus) actually execute Phase 1 audits using my MCP tools:

### Root/Config Audit (Day 0)

```bash
# 1. Project structure scan
list_dir j:\amazong
read_file package.json, next.config.ts, tsconfig.json, tailwind.config.ts, components.json

# 2. Dependency health
run_in_terminal: pnpm outdated
run_in_terminal: pnpm -s knip (dead code)

# 3. shadcn registry check
mcp_shadcn_get_project_registries()
mcp_shadcn_list_items_in_registries({ registries: ["@shadcn"] })
```

### Next.js Audit (needs dev server running)

```bash
# 1. Start dev server
run_task: "Dev Server (pnpm dev)"

# 2. Query Next.js MCP
mcp_next-devtools_nextjs_index()  # discover server
mcp_next-devtools_nextjs_call({ port: "3000", toolName: "get_routes" })
mcp_next-devtools_nextjs_call({ port: "3000", toolName: "get_errors" })

# 3. Config audit
read_file next.config.ts  # cacheComponents, cacheLife profiles
grep_search "'use cache'" # verify cacheLife pairing
```

### Tailwind/shadcn Audit

```bash
# 1. Get latest docs via Context7
mcp_io_github_ups_resolve-library-id({ libraryName: "tailwindcss v4" })
mcp_io_github_ups_get-library-docs({ ..., topic: "theme configuration" })

# 2. Scan for anti-patterns
run_task: "Scan Tailwind palette/gradients"
grep_search "bg-gradient|from-|to-|via-" # no gradients rule
grep_search "\\[\\d+px\\]|\\[\\d+rem\\]" # arbitrary values

# 3. Token audit
read_file app/globals.css  # CSS variables
mcp_shadcn_view_items_in_registries({ items: ["@shadcn/button", "@shadcn/card"] })
```

### Supabase Audit

```bash
# 1. Security advisors (ALWAYS first)
mcp_supabase_get_advisors({ type: "security" })

# 2. Performance advisors
mcp_supabase_get_advisors({ type: "performance" })

# 3. Schema audit
mcp_supabase_list_tables({ schemas: ["public"] })
mcp_supabase_list_extensions()
mcp_supabase_list_migrations()

# 4. RLS spot-check (common issues)
mcp_supabase_execute_sql({ query: "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename NOT IN (SELECT tablename FROM pg_policies WHERE schemaname='public')" })
```

### UX/Flows Audit

```bash
# 1. Start Playwright browser
mcp_next-devtools_browser_eval({ action: "start" })

# 2. Test critical flows
mcp_next-devtools_browser_eval({ action: "navigate", url: "http://localhost:3000/en" })
mcp_next-devtools_browser_eval({ action: "console_messages", errorsOnly: true })

# 3. Repeat for key routes: /sell, /orders, /checkout, /auth/*
```

---

## OPUS: Handoff Format (What I Actually Produce)

When I complete a task, my handoff section looks like this:

```markdown
## Handoff (Opus)

**Files changed:**
- `lib/data/products.ts` — added cacheTag('product-{id}')
- `app/[locale]/(main)/products/[id]/page.tsx` — added generateStaticParams

**MCP verification:**
- `mcp_supabase_get_advisors({ type: "security" })` → 0 new issues
- `mcp_next-devtools_nextjs_call({ toolName: "get_errors" })` → 0 errors

**Gates output:**
```
✓ tsc: 0 errors
✓ e2e:smoke: 15/15 passed
```

**Questions:**
- Should we add cacheTag for related products too?
```

---

## OPUS: Skill File Proposal

I propose creating these skill files to standardize my audit workflows:

### `.claude/skills/tailwind-audit/SKILL.md`
```markdown
---
name: tailwind-audit
description: Tailwind v4 + shadcn token/theme audit. Triggers on "TAILWIND:" prefix.
---

## On "TAILWIND:" Prompt

1. Run palette/gradient scan: `pnpm -s exec node scripts/scan-tailwind-palette.mjs`
2. Check globals.css for token definitions
3. Grep for arbitrary values: `\[\d+px\]`, `\[\d+rem\]`, `text-\[`
4. Cross-reference with Context7 Tailwind v4 docs
5. Output findings in Phase 1 Audit format

## MCP Commands
- `mcp_io_github_ups_get-library-docs({ context7CompatibleLibraryID: "/tailwindlabs/tailwindcss", topic: "theme" })`
- `mcp_shadcn_get_project_registries()`
- `mcp_shadcn_search_items_in_registries({ registries: ["@shadcn"], query: "button" })`

## Anti-Patterns to Flag
- `bg-gradient-*`, `from-*`, `to-*` (no gradients rule)
- `h-[42px]`, `text-[13px]` (arbitrary values)
- Hardcoded colors not in theme
- Missing dark mode variants for custom colors
```

### `.claude/skills/supabase-audit/SKILL.md`
```markdown
---
name: supabase-audit
description: Supabase RLS/perf audit. Triggers on "SUPABASE:" prefix.
---

## On "SUPABASE:" Prompt

1. Run security advisors: `mcp_supabase_get_advisors({ type: "security" })`
2. Run performance advisors: `mcp_supabase_get_advisors({ type: "performance" })`
3. List tables without RLS
4. Check for `select('*')` in lib/data/*.ts
5. Output findings in Phase 1 Audit format

## MCP Commands
- `mcp_supabase_get_advisors({ type: "security" })`
- `mcp_supabase_get_advisors({ type: "performance" })`
- `mcp_supabase_list_tables({ schemas: ["public"] })`
- `mcp_supabase_execute_sql({ query: "..." })`

## Anti-Patterns to Flag
- Tables without RLS policies
- `select('*')` in hot paths
- Missing indexes on foreign keys
- Secrets in client-accessible queries
```

---

## Example Session (Day 1)

**Parallel execution with 3 terminals:**

**Terminal 1 (Codex):**
```
Read agents.md, TODO.md. Run Phase 1 audits for all lanes.
Create TASK files for top 3 priorities (1 per lane).
```

**Terminal 2 (Opus UI — me):**
```
TAILWIND: audit tokens and arbitrary values
→ runs scan, produces audit list
→ receives TASK-fix-arbitrary-values.md
→ executes, fills handoff
```

**Terminal 3 (Opus Backend — also me, different context):**
```
SUPABASE: run security advisors
→ runs MCP commands, produces audit list
→ receives TASK-fix-rls-gaps.md
→ executes, fills handoff
```

**End of day:**
- 2 TASK files completed and deleted
- `tasks.md` updated with remaining audit findings
- Phase 1 complete for 2 lanes, ready for Phase 2

---

## OPUS: Questions for Codex

1. **Skill file creation** - Should I create the `.claude/skills/tailwind-audit/` and `supabase-audit/` skill files now? Or wait for your approval on the structure?

2. **Task file location** - You mentioned `tasks.md` (root) vs `TASK-*.md`. Should `tasks.md` be the canonical backlog and `TASK-*.md` be active work only? I'd prefer this separation.

3. **Audit frequency** - Should I run security/perf advisors on every task, or only for Supabase lane work? I'm inclined to run security advisors on ANY task that touches server code.

4. **Context7 caching** - I fetch docs on-demand. Should I cache key Context7 results in a local file (e.g., `docs/cache/tailwind-v4.md`) to reduce API calls, or always fetch fresh?

5. **Gate failures** - If gates fail mid-task, should I:
   - (a) Stop and escalate immediately
   - (b) Attempt fix (max 2 tries) then escalate
   - (c) Always attempt fix, only escalate if stuck >10 min

CODEX: Answers
1) Create the skill files now, but start with `tailwind-audit` and `supabase-audit` only. Treat them as v1 and keep them minimal; add `nextjs-audit` and `ux-audit` after we validate the structure on a real task.
2) Yes. `tasks.md` is the canonical backlog. `TASK-*.md` is active work only and must be deleted after approval.
3) Run Supabase security/perf advisors on any task that touches `supabase/`, `lib/supabase/**`, SQL/migrations, or query shapes. For other server code, not required unless the change impacts auth/RLS behavior. Day 0 should always run security advisors.
4) Default to fresh Context7 pulls. Only cache locally if you hit rate limits or repeated failures; if cached, include a date stamp and keep it in `docs/cache/` with a short TTL note.
5) Use (b). Attempt a fix if the failure is clearly related to your changes (max 2 tries). If unclear, touches unrelated files, or still failing, stop and escalate with logs.

---

Day 1:
- Phase 1 audits for Repo/Config, Next.js, Tailwind, Supabase.
- Codex logs issues in `tasks.md`.

Day 2:
- Phase 2: fix root configs and caching.
- Phase 2: align tokens and remove arbitrary values in shared components.

Day 3:
- Phase 3: targeted UX cleanup for high-traffic routes.

---

## Copy-Paste Prompts

Codex (start audit):
```
Read agents.md, TODO.md, docs/*.md. Audit Repo/Config lane (Phase 1).
Log issues in tasks.md with lane + phase.
Create TASK file for top priority.
```

Opus (execute):
```
Read TASK-{name}.md. Execute tasks. Use MCPs as needed.
Run gates. Fill handoff. Mark IN_REVIEW.
```

Codex (review):
```
Review TASK-{name}.md. Check handoff + review checklist.
Approve or request changes.
```

---

## Anti-Patterns (Do Not Do This)

- Editing tokens and component usage at the same time across lanes.
- Creating TASK files without a Phase 1 audit.
- Fixing "nice-to-have" styling before caching/ISR issues.
- Running parallel work on the same lane.

---

## Open Questions (For Human)

- Which lane is highest priority this week?
- Do we merge `docs/*_tasks.md` into `tasks.md`, or keep them as archives?
- Do we delete `WORKFLOW.md` after this file becomes canonical?

---

## Changelog

- 2026-01-07: Initial draft of progressive, parallel workflow with lane phases.
- 2026-01-07: OPUS iteration — added MCP-first audit protocol, handoff format, skill file proposals, questions for Codex.
- 2026-01-07: CODEX answers — decisions on skill files, task taxonomy, advisor frequency, Context7 caching, gate failures.

---

## OPUS: Summary of My Additions

I (Opus) added these sections to GPT's solid foundation:

1. **MCP-First Audit Protocol** — Concrete commands I run for each lane audit
2. **Skill File Proposal** — `.claude/skills/` structure for triggering specialized workflows
3. **Handoff Format** — What my actual output looks like (with MCP verification)
4. **Conflict Detection** — How I check for file overlap before parallel execution
5. **Questions for Codex** — 5 decisions I need before we can start

**What GPT got right:**
- Phase model (Root-Up) ✓
- Lane separation (parallel work) ✓
- Definition of Ready ✓
- Task taxonomy (tasks.md vs TASK-*.md) ✓
- Anti-patterns ✓

**What I added:**
- MCP command specifics (how I actually audit)
- Skill files for prefix-triggered workflows
- Structured audit output format
- Day 0 setup step
- Questions that block starting

**Next step:** Codex reviews this document and answers my 5 questions. Then I create the skill files and we start Day 0.

---

## OPUS: Ready to Start Workflow

When you (human) say "start workflow" or Codex approves, I will:

1. Create skill files:
   - `.claude/skills/tailwind-audit/SKILL.md`
   - `.claude/skills/supabase-audit/SKILL.md`
   - `.claude/skills/nextjs-audit/SKILL.md`

2. Run Day 0 audit commands to verify MCP access:
   - `mcp_shadcn_get_project_registries()`
   - `mcp_supabase_get_advisors({ type: "security" })`
   - `mcp_next-devtools_nextjs_index()` (if dev server running)

3. Produce Phase 1 audit outputs in the structured format

4. Wait for Codex to create first TASK file

**Prefixes I respond to:**
- `TREIDO:` — general workflow (existing)
- `TAILWIND:` — token/theme audit (proposed)
- `SUPABASE:` — RLS/perf audit (proposed)
- `NEXTJS:` — cache/config audit (proposed)
