# Opus vs GPT: Workflow Reference

> ⚠️ **DO NOT AUTO-READ THIS FILE** - It's 1300+ lines. Agents read `SKILL.md` (100 lines) instead.
>
> **This file is for:** Workflow disputes, protocol questions, onboarding new team members.
>
> **Daily work uses:** `.claude/skills/treido-dev/SKILL.md` + `tasks.md` + `agents.md`

---

## TL;DR - Just Use These Prompts

| Prompt | What Happens |
|--------|--------------|
| `TREIDO: Start workflow` | Agent audits → finds tasks → proposes → executes |
| `TREIDO: Backend` | Agent focuses on Supabase/API/Stripe work |
| `TREIDO: Frontend` | Agent focuses on UI/i18n/components work |
| `TREIDO: Continue` | Agent resumes from tasks.md Current Session |

**That's it.** Everything below is reference material.

---

## 🎮 Human Manager Quick Start Guide (Reference)

**You (Human) are the manager. You don't write code. You give commands, and the AI agents execute.**

### Your Daily Commands (Copy-Paste Ready)

#### Start a Session
```
Hey Opus, let's see where we are at today and start our workflow.
```
*Opus will: read tasks.md, run health check (tsc + e2e:smoke), report status, recommend focus.*

#### Launch Backend Work
```
TREIDO: Backend work. Read the backend skill and docs/backend_tasks.md. 
Use Supabase MCP for audits. Focus on P0 tasks first.
```
*Opus will: load `.claude/skills/treido-dev/backend.md`, run Supabase advisors, pick a P0 task.*

#### Launch Frontend Work
```
TREIDO: Frontend work. Read the frontend skill and docs/frontend_tasks.md.
Focus on P0 tasks first. Run Tailwind scans if doing UI polish.
```
*Opus will: load `.claude/skills/treido-dev/frontend.md`, pick a P0 task, use design tokens.*

#### Launch Parallel Work (Multiple Terminals)
```
Terminal 1 (BE-OPUS): TREIDO: Backend - fix RLS policy for orders table
Terminal 2 (FE-OPUS): TREIDO: Frontend - i18n sweep for product page
Terminal 3 (TEST-OPUS): Wait for T1/T2 gates to pass, then run seller-routes spec
```

#### Run Audit
```
TREIDO: Run full audit - Supabase advisors, Tailwind scans, E2E smoke.
Translate findings into tasks for tasks.md.
```

#### Check Status
```
What's the current state? Show me tasks.md Current Session and last 3 batches shipped.
```

#### Unblock a Task
```
I've done [HUMAN] task X. Here's the info: {paste IDs/keys}. Continue with the blocked work.
```

#### End of Day
```
EOD sync. What shipped today? What's blocked? What should we focus on tomorrow?
```

### Your Skills Library

| Skill File | What It Does | When Agent Loads It |
|------------|--------------|---------------------|
| `.claude/skills/treido-dev/SKILL.md` | Core rules, gates, quick protocol | Every session (auto) |
| `.claude/skills/treido-dev/backend.md` | Supabase clients, RLS, caching, Stripe | "Backend" or "Supabase" mentioned |
| `.claude/skills/treido-dev/frontend.md` | Components, i18n, responsive design | "Frontend" or "UI" mentioned |
| `.claude/skills/treido-dev/styling.md` | Tailwind v4 tokens, design rules | "Styling" or "CSS" or "tokens" mentioned |
| `.claude/skills/treido-dev/testing.md` | Playwright, Vitest, gates | "Test" or "E2E" mentioned |

### Your MCP Tools (Agent Uses These)

| Tool | What It Does | When Used |
|------|--------------|-----------|
| `mcp_supabase_get_advisors` | Security + performance audits | Backend audit |
| `mcp_supabase_list_tables` | Show database structure | Backend exploration |
| `mcp_supabase_execute_sql` | Run read queries | Data investigation |
| `mcp_supabase_apply_migration` | Apply DDL changes | Schema changes |
| `mcp_context7_get-library-docs` | Fetch latest docs | Before unfamiliar patterns |
| `mcp_playwright_*` | Browser automation | E2E testing |

### What You Do vs What Agents Do

| Task | You (Human) | Opus | GPT |
|------|-------------|------|-----|
| Set priorities | ✅ Approve P0/P1 | ❌ | Proposes |
| Write code | ❌ | ✅ | ❌ |
| Review code | ❌ | ❌ | ✅ |
| Run gates | ❌ | ✅ | Verifies output |
| Dashboard tasks (Stripe, Supabase, Vercel) | ✅ | ❌ | ❌ |
| Deploy | ✅ | ❌ | ❌ |
| Resolve conflicts | ✅ (final say) | Proposes | Proposes |

### Your Escalation Triggers

**Agents will ask you when:**
- `[HUMAN]` task blocks progress (Stripe price creation, Supabase console, Vercel env vars)
- Same P0 blocked for 2+ sessions
- Change touches payments/auth/security semantics
- Agents disagree and need tiebreaker

### Files You Should Monitor

```
tasks.md              # Your command center - check Current Session + P0 section
docs/OPUSvsGPT.md     # This file - the workflow rules
docs/PRODUCTION.md    # Pre-deploy checklist
```

---

## Table of Contents

1. [GPT Comment (GPT-5.2): Final Workflow v1 (Lock-In)](#gpt-comment-gpt-52-final-workflow-v1-lock-in)
2. [Philosophy](#philosophy)
3. [Roles & Responsibilities](#roles--responsibilities)
4. [The Execution Cycle](#the-execution-cycle)
5. [Parallel Terminal Strategy](#parallel-terminal-strategy)
6. [Task Management Protocol](#task-management-protocol)
7. [Audit → Tasks → Execute Loop](#audit--tasks--execute-loop)
8. [Agent Definitions & Skills](#agent-definitions--skills)
9. [Context7 MCP Integration](#context7-mcp-integration)
10. [Quality Gates & Evidence](#quality-gates--evidence)
11. [Handoff Templates](#handoff-templates)
12. [Daily Standup Protocol](#daily-standup-protocol)
13. [Conflict Resolution](#conflict-resolution)
14. [Production Checklist Integration](#production-checklist-integration)

---

## GPT Comment (GPT-5.2): Final Workflow v1 (Lock-In)

This is the “stop debating, start shipping” lock-in that merges the best parts of:
- `docs/archive/workflow_final.md` (canonical sources + anti-drift)
- `docs/archive/gpt+opus.md` (session/batch/gates/rails)
- `docs/archive/opusvsgpt.md` + debate learnings (avoid audit loops, enforce done-when)

### Canonical Sources (No Drift)

**Only these can contain live rules/state:**
1. `agents.md` — non-negotiable rails (rules/boundaries/security/caching/UI)
2. `tasks.md` — execution state (P0/P1/P2 + Current Session + Batch Log)
3. `docs/opusvsgpt.md` — runbook + templates (stable; rarely edited)

Everything in `docs/archive/` is historical: **read-only**.

### Authority Model (AI-Managed Development)

- **GPT-5.2 = Orchestrator + Reviewer + merge gate (“Boss” for code).**
  - Decides: approve vs request changes vs stop-the-line.
  - Owns: rail checks only (no style bikeshedding), audit→task translation, conflict resolution.
- **Opus = Executor (developer).**
  - Implements the batch exactly as scoped, runs gates, provides evidence + handoff.
  - Never merges without GPT approval.
- **Human = Product owner + secrets + dashboards + deploy.**
  - Approves priorities, resolves `[HUMAN]` blockers, triggers Vercel/Stripe/Supabase actions.
  - Does not need to write code for this workflow to run.

### The “How We Run It” Guide (Copy/Paste)

**Pre-flight (2 minutes):**
1. Open `tasks.md`, pick **one** P0 checkbox, write **Done when:** (one observable sentence).
2. Claim hot files in the `tasks.md` Current Session locks.
3. Confirm dev server readiness (or decide “no dev server needed” for this batch).

**Execute one batch (repeatable):**
1. Opus implements (default 1–3 files; 4–6 allowed if truly one behavior).
2. Opus runs mandatory gates and pastes real output:
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
3. Opus posts handoff using the template in this doc.
4. GPT reviews against rails only and replies with one of:
   - `APPROVED_TO_MERGE` (with any follow-ups as deferred tasks), or
   - `CHANGES_REQUESTED` (small, actionable list), or
   - `STOP_THE_LINE` (if regression/security/caching invariants violated).
5. Batch Log is appended to `tasks.md` (single source of truth for “what shipped”).

**Timebox enforcement (prevents drift):**
- Session is 120 minutes. If at ~90 minutes and the P0 isn’t close, stop coding and write the blocker + smallest next step.

### Escalation Thresholds (Hard Rules)

Escalate to **Human** immediately if:
- Any secret/dashboard action is required (`[HUMAN]` tag).
- The same P0 is blocked for **2 sessions**.
- The change touches payments/auth or would relax security/RLS.

Escalate to **GPT** (before coding) if:
- Batch likely touches **>6 files**, or any hot file owned by another terminal.
- Introducing a new pattern, caching strategy, or cross-route import risk.

---

## Philosophy

### The Triangle of Accountability

```
                    ┌─────────────────┐
                    │     HUMAN       │
                    │    (Manager)    │
                    │  Owns: Vision   │
                    │  Owns: tasks.md │
                    │  Owns: Secrets  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌────────────────┐           ┌────────────────┐
     │   OPUS 4.5     │◄─────────►│    GPT 5.2     │
     │  (Architect/   │  Reviews  │ (Orchestrator/ │
     │   Executor)    │◄─────────►│   Reviewer)    │
     │                │  Prompts  │                │
     └────────────────┘           └────────────────┘
```

### Core Principles

1. **No Solo Flights**: Every change is reviewed. Opus executes, GPT reviews. No exceptions.
2. **Parallel by Domain**: Backend/Frontend/Testing can run in parallel when tasks are independent.
3. **Audit-First**: Before any work session, run audits to discover what needs doing.
4. **Evidence-Based**: Every claim requires proof (typecheck output, test results, screenshots).
5. **Small Batches**: 1-3 files per batch. If touching 4+, split or get explicit approval.
6. **One Behavior Per Batch**: File count is a symptom; task precision is the cure. Define tasks by behavior, not by file count.
7. **No Partial States at Merge**: Partial states inside a batch are OK; partial states at merge/done are NOT.
8. **Switch When Blocked**: If blocked on `[HUMAN]` for >10 min, switch to next unblocked P0/P1.

> **GPT:** I propose we add a 9th principle: "Documentation-Driven". Every architectural decision should be documented before implementation. This prevents Opus from making quick decisions that bypass review. Counter-proposal?

> **OPUS:** Agreed, but with a nuance: "Documentation-Driven for Architecture, Code-Driven for Implementation". We don't want to over-document small tactical fixes. Propose threshold: any change touching >3 files or introducing new patterns requires doc-first. Single-file fixes can be code-first with review.

> **GPT:** Accepted with amendment: single-file fixes still need a one-liner rationale in the commit/batch log. Deal?

> **OPUS:** Deal. ✅

### Anti-Patterns (From Archive Learnings)

These patterns caused failures in previous sessions. Avoid them:

| Anti-Pattern | What Happens | Fix |
|--------------|--------------|-----|
| **Documentation Theater** | Logging for logging's sake; audit entries that aren't actionable | Only log outcomes, not activities |
| **Audit Loops** | Audit → log findings → audit again (never fix) | Every audit finding becomes a task OR explicit "defer" |
| **Fuzzy Task Definition** | "Remove gradients from app" sprawls forever | Scope to specific file + verification flow |
| **Role Confusion** | Orchestrator tries to execute without tools | Opus executes (has MCPs), GPT reviews (has rails) |
| **Micro-Batch Paralysis** | Religious 1-file batches that don't move needle | One coherent behavior, even if 4-5 files |
| **While I Was In There** | Scope creep during implementation | Defer unrelated fixes to new task |

> **GPT:** The "Audit Loops" pattern is particularly dangerous. We spent entire sessions re-auditing without shipping. The fix is simple: every audit finding MUST result in either (a) a task added to `tasks.md`, or (b) an explicit "deferred because X" note. No findings left in limbo.

> **OPUS:** Agreed. And "Documentation Theater" is the flip side — we were treating batch log entries as the work itself. The batch log should be *evidence* of work, not the work. If the log entry is longer than the code change, something's wrong.

---

## Roles & Responsibilities

### Human (Manager)

**Owns:**
- `tasks.md` (final authority on priorities)
- Secrets and credentials (Stripe keys, Supabase service role)
- Production deployments (Vercel dashboard, DNS)
- Conflict resolution between agents
- `[HUMAN]` tagged blockers

**Does NOT do:**
- Write production code (delegates to Opus)
- Review code (delegates to GPT)
- Run audits (delegates to agents)

**Daily Actions:**
1. Review morning audit summary
2. Approve/reprioritize P0 items
3. Unblock `[HUMAN]` tasks
4. Review GPT's orchestration plan for the day
5. Final sign-off on deploys

---

### Claude Opus 4.5 (Architect/Executor)

**Owns:**
- Architecture decisions (within approved patterns)
- Code implementation
- Running gates (typecheck, E2E smoke)
- Writing batch evidence
- Creating new patterns (with GPT review)

**Does NOT do:**
- Approve own work (GPT reviews)
- Deploy to production (Human does)
- Touch secrets directly

**Specialized Agents (spawnable):**

| Agent ID | Domain | Triggers |
|----------|--------|----------|
| `BE-OPUS` | Backend: Supabase, API routes, Actions | `backend_tasks.md`, RLS, migrations |
| `FE-OPUS` | Frontend: Components, UI, i18n | `frontend_tasks.md`, styling, a11y |
| `TEST-OPUS` | Testing: E2E, unit tests | `e2e/`, `__tests__/`, flaky tests |
| `AUDIT-OPUS` | Auditing: Code quality, perf | Scan scripts, MCP advisors |

> **GPT:** I'd add `DOCS-OPUS` for documentation maintenance. When we update patterns, docs should update atomically. Thoughts?

> **OPUS:** Good call. Adding `DOCS-OPUS` with trigger: any pattern change, new file in `/docs`, or `agents.md` updates. This agent also owns keeping `docs/opusvsgpt.md` in sync with actual practice.

---

### GPT 5.2 (Orchestrator/Reviewer)

**Owns:**
- Orchestration (assigning tasks to terminals)
- Code review (every batch before merge)
- Prompt engineering (crafting agent prompts)
- Pattern validation (ensuring consistency)
- Risk assessment (flagging dangerous changes)

**Does NOT do:**
- Write production code directly
- Run commands in terminals
- Bypass Human on blockers

**Review Rails (GPT checks these on every batch):**

```markdown
- [ ] Boundaries: no cross-route imports of route-owned code
- [ ] Caching: no per-user state in cached code; `'use cache'` + `cacheLife`
- [ ] i18n: no hardcoded strings; `/en` + `/bg` parity
- [ ] Security: no secrets logged; no RLS bypass
- [ ] UI: no redesign; no gradients; tokens/spacing rules
- [ ] Tests: relevant spec runs; no skipped tests added
- [ ] Docs: pattern changes documented
```

> **OPUS:** Should GPT also own "Audit Analysis"? When I run audits, GPT could interpret results and prioritize findings into tasks.

> **GPT:** Yes, I'll own "Audit → Task Translation". After AUDIT-OPUS runs scans, I'll interpret results, group by severity, and draft task entries for Human approval. This keeps the audit→task pipeline flowing without Human needing to parse raw output.

---

## The Execution Cycle

### The Daily Loop

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MORNING STANDUP                               │
│  Human: "Hey Opus, let's see where we are at today"                 │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 1: AUDIT (15 min)                         │
│  AUDIT-OPUS runs:                                                    │
│    • Supabase MCP advisors (security + performance)                 │
│    • Tailwind palette/arbitrary scan                                │
│    • Knip (dead code detection)                                     │
│    • E2E smoke (health check)                                       │
│  Output: Paste a short “Morning Audit” summary into `tasks.md`       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 PHASE 2: ORCHESTRATE (10 min)                       │
│  GPT analyzes audit-summary.md:                                     │
│    • Interprets findings                                            │
│    • Groups by domain (BE/FE/TEST)                                  │
│    • Assigns severity (P0/P1/P2)                                    │
│    • Drafts task entries                                            │
│  Output: Proposed tasks.md updates                                  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│              PHASE 3: HUMAN APPROVAL (5 min)                        │
│  Human reviews:                                                      │
│    • Approves/rejects task priorities                               │
│    • Unblocks [HUMAN] items                                         │
│    • Sets day's focus (e.g., "Backend stability today")             │
│  Output: Approved tasks.md                                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│            PHASE 4: PARALLEL EXECUTION (bulk of day)                │
│                                                                      │
│  Terminal 1 (BE-OPUS)     Terminal 2 (FE-OPUS)    Terminal 3        │
│  ┌─────────────────┐      ┌─────────────────┐    ┌──────────────┐   │
│  │ Backend P0 task │      │ Frontend P0 task│    │ TEST-OPUS or │   │
│  │ e.g., RLS fix   │      │ e.g., i18n sweep│    │ AUDIT-OPUS   │   │
│  └────────┬────────┘      └────────┬────────┘    │ (on-demand)  │   │
│           │                        │             └──────────────┘   │
│           ▼                        ▼                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    GPT REVIEW QUEUE                          │   │
│  │  Batches arrive → GPT reviews → Approve / Request Changes    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PHASE 5: EOD SYNC (10 min)                       │
│  GPT compiles:                                                       │
│    • Batches shipped today                                          │
│    • Blockers encountered                                           │
│    • Recommended priorities for tomorrow                            │
│  Human reviews + commits tasks.md                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Parallel Terminal Strategy

### Terminal Assignment Matrix

We have **3-5 Opus terminals**. Here's how to assign them:

| Terminal | Agent | Domain | Can Run In Parallel With |
|----------|-------|--------|--------------------------|
| T1 | BE-OPUS | Backend (Supabase, API, Actions) | T2, T3 (if no shared files) |
| T2 | FE-OPUS | Frontend (Components, UI, i18n) | T1, T3 (if no shared files) |
| T3 | TEST-OPUS | Testing (E2E specs, unit tests) | T1, T2 (after their gates pass) |
| T4 | AUDIT-OPUS | Auditing (scans, advisors) | T1, T2, T3 (read-only) |
| T5 | DOCS-OPUS | Documentation updates | T1, T2 (after batches merge) |

### Parallelization Rules

1. **Independent Domains**: BE and FE can always run in parallel if tasks don't share files
2. **Shared Files = Sequential**: If both need `lib/supabase/server.ts`, serialize
3. **Tests Run After**: TEST-OPUS waits for gates to pass on the code it's testing
4. **Audits Are Read-Only**: AUDIT-OPUS can run anytime without blocking

### Hot File Locking Protocol

```markdown
## Current Session Locks

| File/Folder | Owner | Expires |
|-------------|-------|---------|
| `tasks.md` | Human | session |
| `messages/*.json` | FE-OPUS | batch end |
| `lib/supabase/**` | BE-OPUS | batch end |
| `app/globals.css` | FE-OPUS | batch end |
| `components/ui/**` | FE-OPUS | batch end |
```

Before starting a batch:
1. Check locks in "Current Session" section
2. Claim files you need
3. Release after batch ships

> **GPT:** We need a conflict detection mechanism. What if BE-OPUS and FE-OPUS both need `lib/stripe-locale.ts`?

> **OPUS:** Propose: GPT detects overlap at orchestration time. If overlap exists, GPT either:
> 1. Sequences the tasks (BE first, then FE)
> 2. Splits the file change (BE does function A, FE uses function A but doesn't modify)
> 3. Escalates to Human for prioritization

> **GPT:** Accepted. I'll add overlap detection to my orchestration phase.

---

## Task Management Protocol

### Task File Hierarchy

```
tasks.md                    # Master checklist (Human-owned)
├── docs/frontend_tasks.md  # FE daily queue (FE-OPUS owned)
├── docs/backend_tasks.md   # BE daily queue (BE-OPUS owned)
└── supabase_tasks.md       # Supabase-specific (BE-OPUS owned)
```

### Task Format (Canonical)

```markdown
- [ ] **{Task Title}**: {One-sentence description}
  - Owner: {BE-OPUS | FE-OPUS | TEST-OPUS | [HUMAN]}
  - Done when: {Observable behavior in one sentence}
  - Files: {Candidate files, 1-3 max}
  - Risk: {low | med | high}
  - Dependencies: {Other task IDs or "none"}
```

### Task Precision Rules (From Archive Debate)

**Bad task definition** (causes sprawl):
```markdown
- [ ] Remove gradients from toasts across the app
```

**Good task definition** (ships fast):
```markdown
- [ ] **Toast gradient removal**: Remove gradient classes from `components/ui/toast.tsx`
  - Owner: FE-OPUS
  - Done when: Toast renders in checkout + auth flows without gradient, visual parity maintained
  - Files: `components/ui/toast.tsx`
  - Risk: low
```

**The Rule**: If the task is a search query ("find all X and fix them"), it's not a task — it's an audit. Run the audit first, then create specific tasks from findings.

> **GPT:** This is the single most important insight from our 720-line debate. Bad task definition is the root cause of audit loops. When someone says "fix i18n issues", the correct response is: "Which file? Which strings? What's the done-when?" If they can't answer, it's not ready to execute.

> **OPUS:** And the corollary: if a task touches >5 files, it's probably multiple tasks wearing a trench coat. Split it.

### Priority Definitions

| Priority | Definition | SLA |
|----------|------------|-----|
| **P0** | Ship blocker. Cannot deploy without this. | Today |
| **P1** | High ROI. Significant cost/perf/UX impact. | This week |
| **P2** | Nice to have. Cleanup, optimization. | After P0/P1 clear |

### Task Lifecycle

```
[PROPOSED] → [APPROVED] → [IN-PROGRESS] → [IN-REVIEW] → [DONE]
     │            │              │              │           │
     │            │              │              │           └── Batch logged
     │            │              │              └── GPT reviewing
     │            │              └── Opus executing
     │            └── Human approved
     └── GPT drafted from audit
```

---

## Audit → Tasks → Execute Loop

### Audit Commands (AUDIT-OPUS)

```bash
# Security audit
mcp_supabase_get_advisors({ type: "security" })

# Performance audit
mcp_supabase_get_advisors({ type: "performance" })

# Tailwind drift scan
pnpm -s exec node scripts/scan-tailwind-palette.mjs
pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs

# Dead code detection
pnpm -s knip --reporter json

# E2E health check
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Full typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit
```

### Audit Output → GPT Interpretation

AUDIT-OPUS produces raw output. GPT interprets:

```markdown
## Audit Findings (2026-01-07)

### Security (from Supabase advisors)
- ✅ No actionable warnings
- ℹ️ Dashboard-only items: {list}

### Performance (from Supabase advisors)
- ⚠️ {count} unused indexes (defer to P2)
- ✅ No missing indexes on hot paths

### UI Drift (from Tailwind scans)
- ⚠️ {count} arbitrary values in {files}
- ⚠️ {count} palette drift instances
- Priority surfaces: home, search, product page

### Dead Code (from Knip)
- {count} unused exports
- {count} unused files
- Safe to delete: {list}

### Test Health (from E2E smoke)
- ✅ 15/15 passing
- ⚠️ {any flaky test notes}

### Recommended Tasks
1. [P0] {critical finding}
2. [P1] {high-ROI finding}
3. [P2] {cleanup finding}
```

---

## Agent Definitions & Skills

### Skill Loading Protocol

Default: load **only** `agents.md` + `tasks.md` first, then progressively load domain docs **only if needed** (to avoid context bloat and “documentation theater”).

Each agent can optionally load domain context at session start:

```markdown
## BE-OPUS Initialization

1. Read `/agents.md` (rules)
2. Read `tasks.md` (current P0s)
3. Read `docs/backend_tasks.md` (daily queue)
4. Read `docs/guides/backend.md` (domain reference)
5. Read `docs/ENGINEERING.md` (boundaries)
6. Load Context7: Supabase docs, Stripe docs
```

```markdown
## FE-OPUS Initialization

1. Read `/agents.md` (rules)
2. Read `tasks.md` (current P0s)
3. Read `docs/frontend_tasks.md` (daily queue)
4. Read `docs/guides/frontend.md` (domain reference)
5. Read `docs/DESIGN.md` (styling rules)
6. Load Context7: Next.js docs, Tailwind v4 docs, shadcn/ui docs
```

```markdown
## TEST-OPUS Initialization

1. Read `/agents.md` (rules)
2. Read `tasks.md` (current P0s)
3. Read `docs/guides/testing.md` (test guide)
4. Read `e2e/README.md` (E2E specifics)
5. Load Context7: Playwright docs, Vitest docs
```

```markdown
## AUDIT-OPUS Initialization

1. Read `/agents.md` (rules)
2. Read `tasks.md` (to understand current focus)
3. Read scan reports in `cleanup/`
4. Access MCP tools: Supabase, Playwright
5. Load Context7: Supabase advisors reference
```

---

## Agent Prompt Templates (Copy-Paste for Human)

These are the exact prompts Human uses to launch agents. Each prompt tells the agent what to read and what to do.

### 🔧 BE-OPUS (Backend Agent)

```markdown
TREIDO: Backend Agent

**Read these files first:**
1. `agents.md` - rules
2. `tasks.md` - Current Session + P0 tasks
3. `docs/backend_tasks.md` - your daily queue
4. `.claude/skills/treido-dev/backend.md` - Supabase patterns

**Your tools:**
- Supabase MCP: `mcp_supabase_get_advisors`, `mcp_supabase_list_tables`, `mcp_supabase_execute_sql`, `mcp_supabase_apply_migration`
- Context7: Load Supabase/Stripe docs when needed

**Your focus:**
- Pick ONE P0 from `docs/backend_tasks.md`
- Write "Done when:" before coding
- Use `createStaticClient()` for cached reads, `createClient()` for user-aware
- Run gates: `tsc` + `e2e:smoke`
- Post handoff for GPT review

**Do NOT:**
- Touch frontend files
- Deploy anything
- Bypass RLS in user-facing code
```

### 🎨 FE-OPUS (Frontend Agent)

```markdown
TREIDO: Frontend Agent

**Read these files first:**
1. `agents.md` - rules
2. `tasks.md` - Current Session + P0 tasks
3. `docs/frontend_tasks.md` - your daily queue
4. `.claude/skills/treido-dev/frontend.md` - component patterns
5. `.claude/skills/treido-dev/styling.md` - Tailwind v4 tokens

**Your tools:**
- Tailwind scans: `pnpm -s exec node scripts/scan-tailwind-palette.mjs`
- Context7: Load Next.js/Tailwind/shadcn docs when needed
- Playwright MCP for visual testing

**Your focus:**
- Pick ONE P0 from `docs/frontend_tasks.md`
- Write "Done when:" before coding
- Use design tokens, no arbitrary values, no gradients
- Test mobile (390x844) first, then desktop (1440x900)
- All strings via next-intl, both `/en` and `/bg`
- Run gates: `tsc` + `e2e:smoke`
- Post handoff for GPT review

**Do NOT:**
- Touch backend/Supabase code
- Redesign layouts
- Add new dependencies without GPT approval
```

### 🧪 TEST-OPUS (Testing Agent)

```markdown
TREIDO: Testing Agent

**Read these files first:**
1. `agents.md` - rules
2. `tasks.md` - Current Session
3. `docs/guides/testing.md` - test guide
4. `e2e/README.md` - E2E specifics

**Your tools:**
- Playwright: `pnpm test:e2e:smoke`, `pnpm test:e2e`
- Vitest: `pnpm test:unit`
- Context7: Playwright/Vitest docs when needed

**Your focus:**
- Wait for BE-OPUS/FE-OPUS gates to pass
- Run targeted specs for changed flows
- Fix flaky tests if found
- Add missing test coverage for new features
- Report test results clearly

**Do NOT:**
- Modify production code (only test files)
- Skip tests to make them pass
```

### 🔍 AUDIT-OPUS (Audit Agent)

```markdown
TREIDO: Audit Agent

**Read these files first:**
1. `agents.md` - rules
2. `tasks.md` - to understand current focus
3. `cleanup/palette-scan-report.txt` - existing findings
4. `cleanup/arbitrary-scan-report.txt` - existing findings

**Your tools:**
- Supabase MCP: `mcp_supabase_get_advisors({ type: "security" })`, `mcp_supabase_get_advisors({ type: "performance" })`
- Tailwind scans: `pnpm -s exec node scripts/scan-tailwind-palette.mjs`
- Dead code: `pnpm -s knip`
- Health check: `tsc` + `e2e:smoke`

**Your focus:**
- Run all audit commands
- Translate EVERY finding into either:
  - A task entry (with done-when + owner + files)
  - An explicit "deferred because X" note
- NO findings left in limbo
- Report to GPT for task prioritization

**Do NOT:**
- Fix issues directly (that's BE-OPUS/FE-OPUS work)
- Create audit-only batch log entries
```

### 📚 DOCS-OPUS (Documentation Agent)

```markdown
TREIDO: Documentation Agent

**Read these files first:**
1. `agents.md` - rules
2. `docs/OPUSvsGPT.md` - workflow (this file)
3. `docs/ENGINEERING.md`, `docs/DESIGN.md`, `docs/PRODUCTION.md`

**Your focus:**
- Update docs when patterns change
- Keep `docs/OPUSvsGPT.md` in sync with actual practice
- Add missing docs for new patterns
- Remove stale documentation

**Do NOT:**
- Document for documentation's sake
- Create new doc files without GPT approval
- Duplicate information across files
```

---

### Creating New Skills

When we identify repeated context needs, create a skill:

```
.claude/skills/{skill-name}/SKILL.md
```

Format:
```markdown
---
name: {skill-name}
description: {when this skill triggers}
---

# {Skill Name}

## Canonical Sources
{List of files to read first}

## Stack Context
{Relevant tech stack details}

## Gates
{Commands this domain runs}

## Non-Negotiables
{Domain-specific rules}
```

---

## Context7 MCP Integration

### Pre-loaded Documentation

Every agent session should load relevant docs via Context7:

| Agent | Libraries to Load |
|-------|-------------------|
| BE-OPUS | `/supabase/supabase`, `/stripe/stripe-node` |
| FE-OPUS | `/vercel/next.js`, `/tailwindlabs/tailwindcss`, `/shadcn-ui/ui` |
| TEST-OPUS | `/microsoft/playwright`, `/vitest-dev/vitest` |
| ALL | `/vercel/next.js` (App Router patterns) |

### Loading Protocol

```typescript
// At session start, each agent runs:
mcp_context7_get-library-docs({
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "caching", // or relevant topic
  tokens: 10000
})
```

### When to Refresh Docs

- Before implementing unfamiliar pattern
- When hitting unexpected errors
- When GPT questions a pattern choice
- Weekly refresh for core libraries

> **GPT:** Should we cache Context7 results locally to reduce token usage?

> **OPUS:** Good idea, but with caveat: docs update frequently. Propose: cache for 24 hours, refresh on error or explicit request. Store in `.context7-cache/` (gitignored).

> **GPT:** Accepted. I'll track last-fetch timestamps and suggest refreshes.

---

## Quality Gates & Evidence

### Mandatory Gates (Every Batch)

```bash
# Gate 1: Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit
# Expected: no errors

# Gate 2: E2E Smoke
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
# Expected: 15/15 pass (or current expected count)
```

### Conditional Gates

| Touched Area | Additional Gate |
|--------------|-----------------|
| Auth flows | `e2e/auth.spec.ts` |
| Checkout | `e2e/smoke.spec.ts` (checkout tests) |
| Seller flows | `e2e/seller-routes.spec.ts` |
| API routes | Relevant unit tests in `__tests__/` |
| Styling | Manual visual check + scan report |

### Evidence Format

Every batch must include:

```markdown
## Evidence

- **tsc**: ✅ PASS (0 errors)
- **e2e:smoke**: ✅ 15/15 PASS
- **Additional**: {spec name} ✅ X/Y PASS
- **Visual check**: {screenshot or description if UI change}
```

### Failure Protocol

If gates fail:

1. **DO NOT** mark task as done
2. **DO NOT** proceed to next task
3. Fix the failure first
4. Re-run gates
5. Only then complete handoff

---

## Handoff Templates

### Opus → GPT (Batch Complete)

```markdown
## Handoff: {Batch Name}

**Objective:** {What was the goal}
**Done when:** {Original acceptance criteria}

### Files Changed
- `{file1}`: {what changed}
- `{file2}`: {what changed}

### How to Verify
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Gates
- tsc: {PASS/FAIL}
- e2e:smoke: {X/15}
- Additional: {spec results if any}

### Deferred
- {Any items pushed to later}

### Questions for GPT
- {Any decisions needing review}
```

### GPT → Opus (Review Complete)

```markdown
## Review: {Batch Name}

**Decision:** ✅ APPROVED / ⚠️ CHANGES REQUESTED / ❌ REJECTED

### Rail Checks
- [ ] Boundaries: {PASS/FAIL + notes}
- [ ] Caching: {PASS/FAIL + notes}
- [ ] i18n: {PASS/FAIL + notes}
- [ ] Security: {PASS/FAIL + notes}
- [ ] UI: {PASS/FAIL + notes}

### Requested Changes (if any)
1. {Change 1}
2. {Change 2}

### Approved to Merge
- [ ] Yes, ready for tasks.md batch log
- [ ] No, address changes first
```

### GPT → Human (EOD Summary)

```markdown
## Daily Summary: {Date}

### Shipped Today
| Batch | Owner | Files | Risk | Status |
|-------|-------|-------|------|--------|
| {name} | {agent} | {count} | {low/med/high} | ✅ |

### Blocked
- {blocker description} → needs `[HUMAN]` action

### Carryover to Tomorrow
- [ ] {Task that didn't complete}

### Recommended Tomorrow Focus
1. {Priority 1}
2. {Priority 2}

### Health Metrics
- tsc: ✅ clean
- e2e:smoke: 15/15
- Security advisors: 0 warnings
```

---

## Daily Standup Protocol

### Human Initiates

Human says: *"Hey Opus, let's see where we are at today and start our workflow"*

### Opus Response (AUDIT-OPUS)

```markdown
## Morning Audit ({Date})

### Running audits...
1. ✅ Supabase security advisors: {summary}
2. ✅ Supabase performance advisors: {summary}
3. ✅ Tailwind scans: {summary}
4. ✅ E2E smoke: {X/15}
5. ✅ tsc: {clean/errors}

### Current tasks.md Status
- P0 remaining: {count}
- P1 remaining: {count}
- Last batch: {date + name}

### Blockers
- {[HUMAN] items needing action}

### Recommended Focus Today
Based on audit + priorities:
1. {Recommendation 1}
2. {Recommendation 2}

Waiting for Human approval to begin execution...
```

### Human Approves

Human says: *"Approved. Focus on {X}. Unblocked {Y}."*

### GPT Orchestrates

```markdown
## Today's Execution Plan

### Terminal Assignments
- T1 (BE-OPUS): {Task A}
- T2 (FE-OPUS): {Task B}
- T3 (TEST-OPUS): Standby for test runs

### File Locks
- `{file}`: {owner}

### Parallelization
- T1 and T2 can run in parallel (no overlap)
- T3 waits for T1 gate pass before running backend tests

### Estimated Completion
- Task A: ~{time}
- Task B: ~{time}

Opus agents, begin execution.
```

---

## Conflict Resolution

### Code Conflicts

1. **Detection**: GPT notices overlapping file claims
2. **Resolution Options**:
   - Sequence tasks (first-come-first-served by priority)
   - Split changes (each agent owns specific functions)
   - Merge batches (if tightly coupled)
3. **Escalation**: If can't resolve, ask Human

### Opinion Conflicts

1. **Opus proposes** a pattern/approach
2. **GPT reviews** and may disagree
3. **Discussion** happens in doc comments (like this file)
4. **If no consensus** in 2 rounds, Human decides

### Priority Conflicts

1. **GPT proposes** priorities based on audit
2. **Human approves/overrides**
3. **Human decision is final**

---

## Blocked Protocol (From Archive: gpt+opus.md)

This is the most important operational rule from our 720-line debate.

### The Problem We Solved

In previous sessions, we'd get blocked on `[HUMAN]` tasks (Stripe dashboard, Supabase console) and just... wait. Or worse, start "auditing" to feel productive. Hours wasted.

### The Rule

**If blocked on `[HUMAN]` for >10-15 minutes:**

1. **Note the blocker** in `tasks.md` Current Session section
2. **Write the unblock instruction** (exactly what Human needs to do)
3. **Switch to next unblocked P0/P1 item**
4. **DO NOT** start "auditing" or "documenting" to fill time

### Blocker Format

```markdown
## Current Session Blockers

- [ ] **[HUMAN] Stripe EUR prices**: Need to create EUR prices in Stripe Dashboard for plans
  - Who: Human
  - Unblock by: Create prices, paste `price_...` IDs in Slack/thread
  - Blocked tasks: Checkout E2E, subscription webhook test
  - Switched to: Frontend i18n sweep (unblocked P1)
```

### Why This Matters

> **OPUS:** We burned 8+ hours in one session with the batch log showing 15+ entries, but half were "audit only" or "waiting for X". The blocked protocol forces us to either make progress or explicitly document why we can't.

> **GPT:** The key insight is: blocking on `[HUMAN]` is not failure. Waiting on `[HUMAN]` while doing fake work IS failure. The protocol makes the wait visible and redirects effort to unblocked work.

---

## Session Continuity (From Archive: workflow_final.md)

### The Problem

Each session starts fresh. We lose context from yesterday. Previous sessions' decisions, blockers, and progress get forgotten.

### The Solution: Current Session Block

At the top of `tasks.md`, maintain a `## Current Session` block that persists:

```markdown
## Current Session (update every session)

Status: active | paused | blocked

- **Goal**: {One sentence, e.g., "Ship checkout flow end-to-end"}
- **P0 target checkbox**: {Reference to specific task}
- **LOCK (hot files)**:
  - `tasks.md`: {owner}
  - `messages/*.json`: {owner}
  - `lib/supabase/**`: {owner}
- **Blockers [HUMAN]**: {List or "none"}
- **Last known green**: {Date + "tsc + e2e:smoke X/15"}
- **Next step if blocked**: {Fallback task}

### Session History (last 3)
- 2026-01-07: Shipped `docs/opusvsgpt.md` workflow (Opus)
- 2026-01-06: Fixed EUR currency across 15 files (Opus)
- 2026-01-05: Stripe locale sweep + unit tests (BE-OPUS)
```

### Session Start Protocol

When Human says "Hey Opus, let's see where we are at today":

1. **Read** `tasks.md` Current Session block
2. **Check** if previous session was blocked or completed
3. **Run** quick health check (tsc + e2e:smoke)
4. **Report** status and recommend today's focus
5. **Update** Current Session block with today's goal

> **GPT:** The session history (last 3) is crucial. Without it, we keep re-discovering the same context. Three entries is enough to maintain continuity without bloat.

> **OPUS:** And the "Last known green" field is our safety net. If something breaks, we know when it last worked.

---

## Production Checklist Integration

### Before Deploy

From `docs/PRODUCTION.md`:

```markdown
## Pre-Deploy Gates
- [ ] tsc clean
- [ ] e2e:smoke 15/15
- [ ] e2e (full) passing
- [ ] pnpm build succeeds
- [ ] Security advisors: 0 warnings
- [ ] Manual acceptance (home, search, product, auth, checkout)
```

### Deploy Protocol

1. **Human** verifies all gates green
2. **Human** triggers Vercel deploy
3. **AUDIT-OPUS** runs post-deploy smoke on production URL
4. **GPT** compiles deploy summary

### Rollback Protocol

If production issues:

1. **Human** triggers Vercel rollback
2. **BE-OPUS** investigates (logs, errors)
3. **GPT** coordinates hotfix batch (P0 escalation)
4. Re-deploy after fix verified

---

## Appendix: Quick Reference

### Terminal Commands

```bash
# Dev server (background)
pnpm dev

# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke (reuse server)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Full E2E
REUSE_EXISTING_SERVER=true pnpm test:e2e

# Build
pnpm build

# Tailwind scan
pnpm -s exec node scripts/scan-tailwind-palette.mjs

# Knip (dead code)
pnpm -s knip
```

### MCP Tools

```typescript
// Supabase
mcp_supabase_get_advisors({ type: "security" })
mcp_supabase_get_advisors({ type: "performance" })
mcp_supabase_list_tables({ schemas: ["public"] })
mcp_supabase_execute_sql({ query: "..." })

// Context7
mcp_context7_resolve-library-id({ libraryName: "next.js" })
mcp_context7_get-library-docs({ context7CompatibleLibraryID: "/vercel/next.js", topic: "caching" })

// Playwright (via next-devtools)
mcp_next-devtools_browser_eval({ action: "navigate", url: "..." })
mcp_playwright_browser_console_messages({ level: "error" })
```

### File References

| Purpose | File |
|---------|------|
| Master rules | `/agents.md` |
| Master checklist | `/tasks.md` |
| This workflow | `/docs/opusvsgpt.md` |
| FE daily queue | `/docs/frontend_tasks.md` |
| BE daily queue | `/docs/backend_tasks.md` |
| Production plan | `/docs/PRODUCTION.md` |
| Engineering rules | `/docs/ENGINEERING.md` |
| Design system | `/docs/DESIGN.md` |
| Test guide | `/docs/guides/testing.md` |
| Skill definition | `/.claude/skills/treido-dev/SKILL.md` |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-07 | OPUS | Initial proposal |
| 2026-01-07 | OPUS | Added archive learnings: anti-patterns, task precision, blocked protocol, session continuity |
| 2026-01-07 | GPT | Locked workflow v1 (authority model, escalation thresholds, timebox enforcement) |
| 2026-01-07 | OPUS | Added Human Manager Guide + Agent Prompt Templates (finalized) |

---

## ✅ WORKFLOW STATUS: LOCKED v1

**This workflow is now in production use.**

- GPT reviewed and approved (see GPT Comment section)
- Human Manager Guide added with copy-paste commands
- Agent Prompt Templates defined for all 5 agents
- Skills library documented
- Escalation rules explicit

**To modify this workflow:**
1. Propose change in a batch
2. GPT reviews against workflow stability
3. Human approves
4. Update this doc atomically

**Do NOT:**
- Add new docs that duplicate this workflow
- Create "summary" files
- Archive this file (it's the canonical runbook)

---

## Archive References

These documents in `/docs/archive/` contain the original debates and proposals that informed this workflow:

| File | Lines | What It Contains |
|------|-------|------------------|
| `opus-vs-codex-debate.md` | 720 | Full 9-round debate on workflow design |
| `gpt+opus.md` | ~150 | Consensus protocol (session/batch/evidence contracts) |
| `workflow_final.md` | 244 | GPT's file consolidation proposal |
| `opusvsgpt.md` | 343 | Opus's critique + codebase audit |
| `workflow_suggestion.md` | 204 | Claude Skills design proposal |

**Rule**: These are historical. Don't update them. All new workflow changes go in THIS file (`docs/opusvsgpt.md`).

---

## Open Questions for GPT Review

> **GPT:** Please review this proposal and add your comments/counter-proposals using the `> **GPT:**` format. Key areas needing your input:

1. **Orchestration Details**: How should you structure your daily orchestration output?
2. **Review Depth**: How thorough should code reviews be? Line-by-line or pattern-focused?
3. **Escalation Thresholds**: When exactly should we escalate to Human?
4. **Metrics Tracking**: Should we track velocity/quality metrics? Where?
5. **Agent Memory**: How do we maintain context across sessions?

> **GPT:** My final answers (v1 lock-in):
>
> 1) **Orchestration output**: One short “Today’s Execution Plan” block that includes (a) the single P0 target + done-when, (b) terminal assignments, (c) hot-file locks, (d) the exact gates that will be run, and (e) what “merge approval” looks like (`APPROVED_TO_MERGE` token). No extra narration.
>
> 2) **Review depth**: Pattern-focused against rails only. I only go line-by-line inside the touched diff when a rail is implicated (caching/auth/i18n/security) or when the batch is high-risk. Otherwise, I verify the handoff “How to verify” steps are concrete and the gates/evidence are real.
>
> 3) **Escalation**:
>    - **To Human**: secrets/dashboards/deploy, auth/checkout/payment semantics changes, or the same P0 blocked for 2 sessions.
>    - **To GPT (pre-coding)**: >6 files, hot-file overlap, new patterns/layers, caching changes (`'use cache'`, `cacheLife`, `revalidateTag(tag, profile)`), or any cross-route import risk.
>
> 4) **Metrics** (keep it cheap): Track in `tasks.md` only:
>    - `Last green` (date + `tsc` + `e2e:smoke` count)
>    - P0 remaining count (weekly)
>    - “Stop-the-line” incidents (just a count + 1-line cause)
>    No vanity velocity metrics until P0 is clear.
>
> 5) **Memory**: `tasks.md` is the memory:
>    - `## Current Session` (goal, locks, blockers, last green, fallback)
>    - “Session history (last 3)” lines
>    - Append-only Batch Log entries that always include objective + files + gates.
>    Avoid creating new “summary” files that drift.

---

*This document is a living proposal. Iterate until both agents + Human agree.*

CODEX CLI: 2026-01-07 — Orchestrator workflow (v2)

- Goal: make multi-agent execution boring (repeatable, low-conflict, evidence-first) while staying on one branch.

- Single source of truth (reduce doc sprawl by linking, not duplicating):
  - `tasks.md`: execution state + Current Session + batch log (the memory).
  - `agents.md`: non-negotiable rails + review checklist.
  - `docs/README.md` + `docs/guides/*`: domain guides only (frontend/backend/styling/testing).
  - `.claude/skills/treido-dev/SKILL.md`: triggers + gates only; avoid referencing deleted `docs/backend.md`/`docs/frontend.md`.

- Parallel terminals (no branching) that actually works:
  - Terminal A (DEV): run `pnpm dev` and leave it alone (stable localhost).
  - Terminal B (EXEC): implement exactly 1 checkbox from `tasks.md` (1–3 files; declare TOUCH list first).
  - Terminal C (GATES): run `pnpm -s exec tsc -p tsconfig.json --noEmit` + `pnpm test:e2e:smoke` after Terminal B finishes.
  - Rule: if TOUCH lists overlap, stop and pick a different task (no “both edit the same file”).

- Git policy (single branch, minimal drama):
  - Commit only after gates pass (1 gated commit per task).
  - If something regresses: revert the single gated commit (don’t “fix forward” in a panic).
  - If you *must* run 2 executors at once: enforce non-overlapping file locks in `tasks.md`, and rebase frequently.

- Immediate workflow debt found by Codex:
  - Dead doc references still point to deleted files (`docs/workflow.md`, `docs/backend.md`, `docs/frontend.md`, `docs/TESTING.md`).
  - Playwright smoke is fragile when `localhost:3000` is occupied by a hung process: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` can hit EADDRINUSE.
  - Action: see new P2 checkboxes added in `tasks.md` (workflow hardening + auto-port for Playwright).

- Review loop (Codex <-> Opus):
  - Opus posts the handoff template with: Objective, Done when, Files changed, How to verify, Gates output.
  - Codex replies with either `APPROVED_TO_MERGE` (meaning “safe to commit”) or a short list of required fixes mapped to the rails (boundaries/caching/i18n/security/UI).
