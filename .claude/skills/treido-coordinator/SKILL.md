---
name: treido-coordinator
description: Project coordinator skill (triage TODO/board, choose next task, generate subagent prompts). Triggers on "COORD:" prefix and prioritization/orchestration requests.
version: 1.0.0
---

# Treido Coordinator (Orchestration)

Use this skill when you feel stuck, overwhelmed, or context keeps getting lost. It produces a single best next task plus a pack of prompts for the right specialist roles.

## Entry Criteria (ask if missing)

- Time budget (15m / 45m / 2h / “today”)
- Focus lane (UI, backend, infra, tests) or “whatever unblocks shipping”
- Hard constraints (no refactors, no schema changes, etc.)

## On Any "COORD:" Prompt

1. Read current reality:
   - `codex-xhigh/STATUS.md`
   - `TODO.md`
   - `codex-xhigh/EXECUTION-BOARD.md` (if task id mapping matters)
2. Choose the single best next task using this rubric:
   - Unblocks others (dependency-first)
   - High impact / low risk
   - Verifiable with existing gates
   - Fits the time budget
3. Produce an “Execution Card”:
   - Goal, scope, constraints
   - Likely files touched (or discovery steps)
   - Verification plan (commands + manual checks)
   - Risks + rollback hint
4. Produce copy/paste prompts for the right roles:
   - Use repo prefixes so the right skill loads: `FRONTEND:`, `BACKEND:`, `NEXTJS:`, `TAILWIND:`, `SUPABASE:`, `I18N:`, `TS:`, `TEST:`, `PERF:`, `A11Y:`, `STRIPE:`.
5. If the task is large/ambiguous:
   - Recommend `SPEC:` and output a spec skeleton.

## Output Template

```markdown
## Next Task (why this one)
- …

## Execution Card
- Goal:
- Scope:
- Non-goals:
- Likely files:
- Verification:
- Rollback:

## Prompts (copy/paste)
FRONTEND: …
BACKEND: …
```

## Examples

### Example prompt
`COORD: pick the best 45-minute task to unblock shipping`

### Expected behavior
- Choose the single best next task and provide an execution card.
- Output copy/paste prompts for the right roles.
