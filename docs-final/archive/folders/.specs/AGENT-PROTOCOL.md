# Agent Collaboration Protocol

> **Claude (Opus)** = Implementer | **Codex** = Verifier + Orchestrator

## Core Principles

1. **One source of truth**: The spec folder is the SSOT for a task
2. **Explicit handoffs**: Use `context.md` to communicate state between agents
3. **Gates before completion**: No spec moves to `completed/` without passing gates
4. **Small batches**: Max 1-3 active specs at a time

---

## Agent Responsibilities

### Claude (Implementation Agent)

**Triggers:**
- `FRONTEND:` — UI/styling/components
- `BACKEND:` — Server actions, route handlers, webhooks
- `SUPABASE:` — RLS policies, migrations
- `TREIDO:` — General development tasks
- `SPEC:` — Create new spec from requirements

**Workflow:**
1. Read the spec's `requirements.md` + `tasks.md`
2. Implement one task at a time
3. Update `tasks.md` (check completed items)
4. Update `context.md` with:
   - What was done
   - Any blockers found
   - Files changed
5. Run local verification: `tsc --noEmit`

**Output format (in context.md):**
```markdown
## Session: 2026-01-23 Claude

### Completed
- [x] Task 1: <what was done>
- [x] Task 2: <what was done>

### Files Changed
- `path/to/file.tsx` — <brief description>

### Blockers
- None | <description of blocker>

### Next for Codex
- [ ] Run gates
- [ ] Review <specific concern>
```

---

### Codex (Verification Agent)

**Triggers:**
- `/verify <spec-path>` — Verify a specific spec
- `/gates` — Run all verification gates
- `/review <files>` — Code review specific changes
- `/orchestrate` — Pick next work from queue

**Workflow:**
1. Read the spec's `context.md` for Claude's handoff
2. Run verification gates:
   ```bash
   pnpm -s exec tsc -p tsconfig.json --noEmit
   REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
   ```
3. Review changed files (if specified)
4. Update `context.md` with:
   - Gate results
   - Review feedback
   - Approval or rejection

**Output format (in context.md):**
```markdown
## Session: 2026-01-23 Codex

### Gates
- [x] tsc --noEmit: PASS
- [x] e2e:smoke: PASS (16 tests)
- [x] lint: PASS (0 errors)

### Review
- `path/to/file.tsx`: ✅ LGTM | ⚠️ <concern>

### Decision
- [x] APPROVED — move to completed
- [ ] REJECTED — <reason>, needs fixes

### Next for Claude
- <specific fix instructions if rejected>
```

---

## Handoff Protocol

### Claude → Codex (Implementation Done)

1. Claude completes all tasks in spec
2. Claude updates `context.md` with session summary
3. Claude writes: `Ready for Codex verification`
4. Codex picks up, runs gates, reviews

### Codex → Claude (Needs Fixes)

1. Codex finds issues during verification
2. Codex updates `context.md` with specific feedback
3. Codex writes: `Needs fixes: <list>`
4. Claude picks up, addresses issues

### Codex → Completion (Approved)

1. Codex approves all changes
2. Codex moves spec from `active/` → `completed/`
3. Codex creates `summary.md` with compressed context
4. Codex updates `ROADMAP.md` (check off spec)

---

## Context Window Management

### Problem
Large specs accumulate context. Agents lose track.

### Solution: Compressed Context

**In active specs:**
- `context.md` — Live state, last 3 sessions only
- Older sessions archived to `context-archive.md`

**In completed specs:**
- `summary.md` — 20-line max summary of what was done
- Full spec preserved but rarely read

**Format for summary.md:**
```markdown
# Spec: <name> — COMPLETED

## What
<1-2 sentences>

## Key Changes
- <file>: <what changed>
- <file>: <what changed>

## Decisions Made
- <decision and why>

## Gotchas for Future
- <anything someone should know if touching this area>

## Verification
- Gates: PASS
- Date: 2026-01-23
```

---

## Spec States

| State | Folder | Meaning |
|-------|--------|---------|
| **Queue** | `queue/` | Ready to start, prioritized |
| **Active** | `active/` | Currently being worked (1-3 max) |
| **Completed** | `completed/` | Done and verified |
| **Blocked** | `blocked/` | Waiting on external (human/API/decision) |

---

## Example Full Cycle

### 1. Spec Created
```
Claude: SPEC: Audit signup flow end-to-end
```
Creates `queue/audit-signup/requirements.md` + `tasks.md`

### 2. Spec Started
Move to `active/audit-signup/`

### 3. Claude Implements
```
Claude: FRONTEND: Fix signup form accessibility
```
Updates tasks.md, context.md

### 4. Codex Verifies
```
Codex: /verify active/audit-signup
```
Runs gates, reviews, updates context.md

### 5. Spec Completed
Codex moves to `completed/audit-signup/`
Creates `summary.md`

---

## Quick Reference

### For Claude
```markdown
When starting work:
1. Read `requirements.md` + `tasks.md`
2. Check `context.md` for Codex feedback

When finishing:
1. Update `tasks.md` (check completed)
2. Update `context.md` (session summary)
3. Signal: "Ready for Codex verification"
```

### For Codex
```markdown
When verifying:
1. Read `context.md` for Claude's handoff
2. Run gates: tsc, e2e:smoke, lint
3. Review changed files

When completing:
1. Move spec to `completed/`
2. Create `summary.md`
3. Update `ROADMAP.md`
```
