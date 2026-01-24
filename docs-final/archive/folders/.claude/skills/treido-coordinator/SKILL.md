---
name: treido-coordinator
description: Project coordinator skill using .specs system. Triggers on "COORD:" prefix and orchestration requests.
---

# Treido Coordinator (Orchestration)

Use this skill when you feel stuck, overwhelmed, or need to pick the next task. Works with the `.specs/` system for spec-driven development.

## .specs Integration

The coordinator reads from:
- `.specs/ROADMAP.md` — Master production launch plan
- `.specs/queue/INDEX.md` — Prioritized queue of specs
- `.specs/active/` — Currently in-progress specs (max 3)
- `.specs/blocked/` — Specs waiting on external

## Entry Criteria (ask if missing)

- Time budget (15m / 45m / 2h / "today")
- Focus lane (UI, backend, infra, tests) or "whatever unblocks shipping"
- Hard constraints (no refactors, no schema changes, etc.)

## On Any "COORD:" Prompt

1. Read current reality:
   - `.specs/ROADMAP.md` — What phase are we in?
   - `.specs/queue/INDEX.md` — What's next in queue?
   - `.specs/active/` — What's already in progress?
   - `TODO.md` — Any blockers noted?
2. Choose the single best next action:
   - **If active spec has open tasks** → Continue that spec
   - **If no active spec** → Pick from queue, move to active
   - **If blocked** → Address blocker or pick different spec
3. Output decision:
   - Which spec to work on
   - Which task within the spec
   - Copy/paste prompts for execution

## Coordination Rules

### Phase Priority (P0 → P6)
Always complete lower phases before starting higher:
- P0 (Release Blockers) → Must complete before P1
- P1 (Auth/Onboarding) → Must complete before P2+
- etc.

### Active Spec Limit
Max 3 specs in `.specs/active/` at once:
- Prevents context spread
- Forces completion before starting new work

### Agent Assignment
- **Claude (Opus)**: Implementation (`TREIDO:`, `FRONTEND:`, `BACKEND:`)
- **Codex**: Verification (`/verify`, `/gates`, `/review`)

## Output Format

```markdown
## Current State
- Phase: P0 | P1 | ...
- Active specs: <list>
- Blocking: <any blockers>

## Decision
**Spec**: `.specs/active/<name>`
**Task**: <specific task from tasks.md>
**Rationale**: <why this task next>

## Execution Prompt (copy/paste)

<ROLE>: <specific task>
Files: <paths>
Verify: <command>

## After Completion
Update `.specs/active/<name>/context.md` with session notes
```

## Examples

### Example: Pick next task
```
COORD: What should I work on next? I have 2 hours.
```

### Example: Resume work
```
COORD: I'm back. What's the current state and next task?
```

### Example: Spec triage
```
COORD: We have 3 active specs. Which one is closest to completion?
```

## Workflow Commands

### Start spec from queue
```bash
# Move spec to active
mv .specs/queue/<spec-name> .specs/active/

# Then work on it
TREIDO: Work on .specs/active/<spec-name>
```

### Complete spec
```bash
# After Codex verification passes
mv .specs/active/<spec-name> .specs/completed/

# Update roadmap
# Check off in .specs/ROADMAP.md
```

### Block spec
```bash
# If waiting on external
mv .specs/active/<spec-name> .specs/blocked/

# Document blocker in context.md
```
