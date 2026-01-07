# Opus × Codex: Multi-Agent Workflow (v3)

> **Purpose**: Define how YOU (human), OPUS (executor with MCPs), and CODEX (architect/reviewer) work together in 2-3 terminals to ship production code.

---

## TL;DR — The Loop

```
┌─────────────────────────────────────────────────────────────────────┐
│  CODEX CLI (Terminal 1)         OPUS VS Code (Terminal 2)          │
│  ─────────────────────────      ─────────────────────────          │
│  • Audit project                • Execute tasks                     │
│  • Create TASK-{name}.md        • Use Playwright/Supabase MCPs      │
│  • Review Opus's work           • Run gates (tsc + e2e:smoke)       │
│  • Approve or request changes   • Post handoff for review           │
│  • Delete .md when done         • Wait for approval                 │
└─────────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴─────────┐
                    │   YOU (Human)     │
                    │   • Set priority  │
                    │   • Dashboard ops │
                    │   • Final deploy  │
                    └───────────────────┘
```

---

## The Workflow (Step by Step)

### Phase 1: Codex Audits & Plans (Terminal 1)

**You say to Codex:**
```
Audit the project. Read agents.md, TODO.md, and docs/. 
Find what needs doing. Create a TASK-{name}.md with checkboxes for Opus.
```

**Codex will:**
1. Read `agents.md` (rails), `TODO.md` (priorities), `docs/PRODUCTION.md` (blockers)
2. Run audits (if Codex has access) or request you run them:
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
3. Create `TASK-{name}.md` in repo root with:

```markdown
# TASK: {Name}

Created: {date}
Status: PENDING → IN_PROGRESS → IN_REVIEW → DONE

## Objective
{One sentence: what problem we're solving}

## Tasks for Opus
- [ ] Task 1 — Done when: {observable behavior}
- [ ] Task 2 — Done when: {observable behavior}
- [ ] Task 3 — Done when: {observable behavior}

## Files to touch (max 5)
- `path/to/file1.ts`
- `path/to/file2.tsx`

## Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Review checklist (Codex fills after Opus submits)
- [ ] Boundaries: no cross-route imports
- [ ] Caching: `'use cache'` + `cacheLife()` paired
- [ ] i18n: no hardcoded strings, /en + /bg parity
- [ ] Security: no secrets logged, RLS intact
- [ ] UI: no redesign, tokens only, no gradients

## Handoff (Opus fills)
**Files changed:**
**How to verify:**
**Gates output:**
**Questions:**
```

---

### Phase 2: Opus Executes (Terminal 2 — VS Code Copilot)

**You say to Opus:**
```
Read TASK-{name}.md. Execute the tasks. Use your MCPs as needed:
- Playwright MCP for UI/E2E testing
- Supabase MCP for DB queries/migrations
Post handoff in the file when done.
```

**Opus will:**
1. Read the task file
2. Execute each checkbox (max 5 files per task batch)
3. Use MCPs:
   - `mcp_supabase_get_advisors({ type: "security" })`
   - `mcp_supabase_execute_sql({ query: "..." })`
   - `mcp_playwright_*` for browser automation
4. Run gates
5. Fill the Handoff section in the TASK file
6. Mark status as `IN_REVIEW`

---

### Phase 3: Codex Reviews (Terminal 1)

**You say to Codex:**
```
Review TASK-{name}.md. Check Opus's handoff against the review checklist.
Approve or request changes.
```

**Codex will:**
1. Read the TASK file
2. Verify each review checklist item
3. Respond with one of:
   - `✅ APPROVED` — Task is complete
   - `⚠️ CHANGES_REQUESTED` — List specific fixes needed
   - `❌ REJECTED` — Explain why (rare)

---

### Phase 4: Cleanup (You + Codex)

When Codex approves:
1. **You** commit the changes (or ask Opus to commit)
2. **You** delete `TASK-{name}.md` (no bloat)
3. **Codex** logs the batch in `TODO.md` Done section

---

## File Structure (Keep It Minimal)

```
amazong/
├── agents.md           # Non-negotiable rails for ALL agents
├── TODO.md             # Open tasks + Done log (daily driver)
├── WORKFLOW.md         # Quick reference (optional, delete if redundant)
├── TASK-*.md           # Active task files (TEMP - delete when done)
└── docs/
    ├── README.md       # Index to docs (where to look)
    ├── ENGINEERING.md  # Architecture rules
    ├── DESIGN.md       # UI tokens/styling
    ├── PRODUCTION.md   # Go-live checklist
    ├── OPUSvsGPT.md    # This file (workflow)
    ├── guides/
    │   ├── backend.md
    │   ├── frontend.md
    │   ├── styling.md
    │   └── testing.md
    └── archive/        # Old stuff (read-only)
```

**Rules:**
- No new docs without explicit purpose
- TASK files are temporary (delete when done)
- `TODO.md` is the memory (batch log lives there)

---

## MCPs: Who Has What

| Agent | Environment | MCPs Available |
|-------|-------------|----------------|
| **Codex** | Terminal/CLI | File read/write, grep, shell |
| **Opus** | VS Code Copilot | Playwright MCP, Supabase MCP, Context7, File tools |
| **You** | Both + Dashboards | Stripe Dashboard, Supabase Dashboard, Vercel |

**The key insight:** Opus has the powerful MCPs (browser automation, DB access). Codex is the architect/reviewer without those tools. This naturally enforces the separation.

---

## Quick Prompts (Copy-Paste)

### For Codex (Terminal 1)

**Start of day audit:**
```
Read agents.md and TODO.md. What's the status? 
Run tsc and e2e:smoke to check health.
What should we focus on today?
```

**Create task for Opus:**
```
Create TASK-{feature}.md for Opus to execute.
Include: objective, tasks with done-when, files to touch (max 5), gates.
```

**Review Opus's work:**
```
Read TASK-{name}.md. Opus marked it IN_REVIEW.
Check the handoff against the review checklist.
Approve or request changes.
```

**Close task:**
```
TASK-{name}.md is approved. Delete it and log the batch in TODO.md.
```

### For Opus (Terminal 2 — VS Code)

**Execute task:**
```
Read TASK-{name}.md and execute. Use Playwright MCP for UI testing,
Supabase MCP for DB work. Run gates when done. Fill handoff section.
```

**Use specific MCP:**
```
Use Supabase MCP to run security advisors:
mcp_supabase_get_advisors({ type: "security" })
```

```
Use Playwright MCP to test checkout flow:
Navigate to /en/plans, click upgrade, verify Stripe redirect.
```

---

## Escalation Rules

### Opus → Codex
- When task touches >5 files
- When unsure about architecture
- Before introducing new patterns
- After gates fail (share error output)

### Codex → You (Human)
- Dashboard tasks: Stripe prices, Supabase settings, Vercel env vars
- Security-sensitive changes (auth, RLS, secrets)
- When Opus and Codex disagree
- Deploy decisions

### You → Both
- Set priorities: "Focus on {X} today"
- Unblock: "I created the Stripe prices, here are the IDs: ..."
- Override: "Skip {Y}, do {Z} instead"

---

## Blocked Protocol

**If Opus is blocked on [HUMAN]:**
1. Mark task as BLOCKED in TASK file
2. Add blocker note: "Waiting for: {human action}"
3. Ask Codex for next unblocked task
4. **Don't audit to fill time** — switch to real work

**If blocked >2 sessions:**
Escalate to Human with specific ask.

---

## Anti-Patterns (What NOT to Do)

| ❌ Anti-Pattern | Why It Fails | ✅ Fix |
|----------------|--------------|--------|
| Audit loops | Audit → log → audit again | Every finding = task OR explicit defer |
| Fuzzy tasks | "Fix i18n issues" sprawls | Scope to specific file + done-when |
| Doc theater | Logging for logging's sake | Only log outcomes, not activities |
| TASK file bloat | 10 active TASK files | Max 3 active; delete when done |
| Role confusion | Codex tries to execute code | Codex reviews, Opus executes |
| While-I-Was-There | Scope creep during task | New issue = new TASK file |

---

## Done Criteria (Per Task)

A task is DONE when:
1. ✅ All checkboxes complete
2. ✅ Gates pass (tsc + e2e:smoke)
3. ✅ Codex approved handoff
4. ✅ TASK file deleted
5. ✅ Batch logged in TODO.md

---

## Example Session

**You (to Codex):**
> Audit project. What's broken? Create a task for the highest priority issue.

**Codex:**
> Read agents.md, TODO.md. Ran tsc: PASS. Ran e2e:smoke: 14/15 (search filter flake).
> 
> Priority: E2E flake needs fixing. Created `TASK-fix-search-e2e.md`.

**You (to Opus):**
> Execute TASK-fix-search-e2e.md.

**Opus:**
> Read task. The flake is in `e2e/smoke.spec.ts` line 45.
> Used Playwright MCP to debug: race condition on filter dropdown.
> Fixed with `waitForSelector`. Gates pass. Filled handoff section.

**You (to Codex):**
> Review TASK-fix-search-e2e.md.

**Codex:**
> ✅ APPROVED. Change is minimal, gates green, no boundary violations.
> Deleting task file. Logging batch in TODO.md.

**Done.** One task shipped. Repeat.

---

## Summary

| Role | Does | Doesn't |
|------|------|---------|
| **You** | Prioritize, dashboard ops, deploy | Write code |
| **Codex** | Audit, plan, review, approve | Execute code, use MCPs |
| **Opus** | Execute tasks, use MCPs, run gates | Approve own work, deploy |

**The loop:**
1. Codex audits → creates TASK file
2. Opus executes → fills handoff
3. Codex reviews → approves/rejects
4. You commit → delete TASK file

**Keep it simple. Ship small. Delete task files.**

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-07 | v3: Simplified workflow with Codex as architect/reviewer, Opus as executor. TASK files are temporary. |

