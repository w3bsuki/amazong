# Workflow (Multi-Agent, Multi-Session)

## Single source of truth (SSOT)
- **Tasks + gates:** `TODO.md`
- **Execution order + P0 blockers:** `codex/MASTER-PLAN.md`
- **Launch verification:** `docs/launch/PLAN.md`, `docs/launch/CHECKLIST-QA.md`
- **This folder:** operational scaffolding + checklists + handoffs

## Tracking that survives context limits
Use these three files:
1) `codex-xhigh/STATUS.md` — current phase + what’s in progress (short)
2) `codex-xhigh/EXECUTION-BOARD.md` — the detailed checklist board (long)
3) `codex-xhigh/logs/*` — append-only per-agent logs (evidence + commands)

## Roles (parallelizable lanes)
Use distinct owners to keep work non-overlapping:
- `BE/SUPABASE`: migrations, RLS, triggers, storage buckets, advisors
- `PAY/STRIPE`: webhooks, subscriptions, Connect, idempotency, fee calc
- `FE/NEXT`: App Router layouts, server/client boundaries, data fetch alignment
- `FE/UI`: shadcn/Tailwind v4 cleanup, remove hardcoding, UX polish
- `I18N`: next-intl keys, string audits, parity checks
- `QA`: Playwright/Vitest reliability, smoke scope, manual QA script updates

## Multi-agent rule (avoid merge hell)
- Only **one** “coordinator” updates `TODO.md` + `codex-xhigh/STATUS.md`.
- Each executor agent writes to its own log file under `codex-xhigh/logs/` and links evidence (files changed, commands run, results).
- Coordinator then checks off tasks in `codex-xhigh/EXECUTION-BOARD.md` and mirrors the important ones into `TODO.md`.

## How to run agents in parallel (recommended)
Use **git worktrees** so each agent has its own working directory:

```bash
# from repo root
git worktree add ../amazong-fe -b agent/fe
git worktree add ../amazong-supabase -b agent/supabase
git worktree add ../amazong-ui -b agent/ui
```

Each worktree:
- touches different files
- runs its own gates
- produces a clean diff to merge

## Session handoff template (copy/paste)
When ending a session, write a short entry to your log file:
- Goal
- Task IDs completed / in progress (from `codex-xhigh/EXECUTION-BOARD.md`)
- Files changed (paths)
- Commands run + results (tsc/smoke/etc)
- Blockers / next steps

## How to resume in a fresh chat (2 minutes)
1) Open `codex-xhigh/STATUS.md`
2) Open `codex-xhigh/EXECUTION-BOARD.md` and jump to the first unchecked item
3) Open the newest file in `codex-xhigh/logs/` for context

