# Treido Orchestrator Playbook (Auto Loop)

This is the “do the work” guide for `ORCH:`. If you follow it, you get:

- parallel read-only audits you can safely merge
- a single authoritative plan (`.codex/TASKS.md`)
- small shippable implementation batches (1–3 files)
- verification gates after every batch

## Default behavior (no extra prompting)

When the user says something like:

- `ORCH: audit checkout`
- `ORCH: fix mobile styling`
- `ORCH: full audit`

…treat it as **permission to run the full loop**:

1. AUDIT (parallel)
2. MERGE (single writer)
3. PLAN (`.codex/TASKS.md`)
4. EXECUTE (1–3 file batch)
5. VERIFY (gates + minimal tests)
6. Repeat until “Ready” is empty or blocked

## Phase overrides (explicit only)

Only skip phases if the user explicitly requests it:

- `ORCH:AUDIT …` → run audits + merge only
- `ORCH:PLAN …` → produce/refresh `.codex/TASKS.md` only (no code changes)
- `ORCH:EXEC …` → execute the next batch only (assumes tasks already exist)
- `ORCH:VERIFY …` → verification only

## Phase 0 — Frame (single-writer)

Write down (in your own working memory; don’t create new docs):

- Goal: 1–2 sentences
- Scope: what routes/components/services are in play
- Non-goals: what you will not touch
- Risk level: UI-only vs auth/payments/checkout vs RLS/migrations
- Bundle: UI | Backend | Supabase | Full

## Phase 1 — AUDIT (parallel, read-only)

Spawn the needed lane audits (bundle-driven):

- UI → `treido-frontend` in AUDIT mode
- Backend → `treido-backend` in AUDIT mode
- Supabase → `treido-backend` in AUDIT mode (Supabase focus)
- Full → both lanes in AUDIT mode

Hard requirements for every auditor response:

- must follow `.codex/skills/treido-orchestrator/references/audit-payload.md`
- must start with `## <AUDITOR_NAME>`
- must include real `file:line` evidence
- no patches, no `.codex/TASKS.md` edits

## Phase 1.5 — MERGE (single-writer)

Create a merged artifact in `.codex/audit/`:

- `.codex/audit/YYYY-MM-DD_<context>.md`

Copy lane payloads **verbatim** under their `##` headers.

Automation helpers:

- Create a new template: `node .codex/skills/treido-orchestrator/scripts/new-audit.mjs --context "<context>"`
- Lint merged output: `node .codex/skills/treido-orchestrator/scripts/lint-audit.mjs .codex/audit/YYYY-MM-DD_<context>.md`

## Phase 2 — PLAN (single-writer)

Translate findings into tasks in `.codex/TASKS.md`.

Hard rules:

- `.codex/TASKS.md` is the only queue (no per-skill task files)
- max 20 total tasks; ≤15 Ready at once
- each task is executable in 1–3 files
- each task has explicit verification commands and file list

See: `task-writing.md`.

Lint helper:

- `node .codex/skills/treido-orchestrator/scripts/lint-tasks.mjs`

## Phase 3 — EXECUTE (1–3 file batch)

Pick the smallest set of “Ready” tasks that fits in 1–3 files.

Then run the correct lane (frontend/backend) in **IMPL mode** using the exact task blocks.

Rules:

- do not mix lanes in one batch
- run verify automatically after each batch; continue unless a pause condition is hit
- defer anything extra back into `.codex/TASKS.md` (single-writer)
- **Do NOT ask for confirmation** — only pause for: DB schema, auth/access, payments

## Phase 4 — VERIFY (gates)

Always after each batch:

- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`

See: `verification-policy.md`.
