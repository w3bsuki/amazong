# Treido Agent Fleet Workflow (Operations SSOT)

This document defines **how agents coordinate work** in this repo.

**Stable docs live in `docs/`; execution state lives in `.codex/`:**
- Project rails + boundaries (SSOT): `docs/AGENTS.md`
- Workflow (SSOT): `docs/WORKFLOW.md`
- Product/system docs (SSOT): `docs/00-INDEX.md` (and linked docs)
- Active task queue: `.codex/TASKS.md`
- Audit outputs: `.codex/audit/*`
- Active debate thread: `CONVERSATION.md`
- Append-only decisions log: `DECISIONS.md`
- Agent skills: `skills/*`

## Goals

- Parallelize **read-only** audits with mergeable outputs.
- Centralize planning in a **single task queue** (`.codex/TASKS.md`) to prevent drift.
- Execute changes in **small, shippable batches** (1–3 files) with verification gates.
- Prevent context bloat by enforcing **structured summaries** and **hard limits**.

## Roles (Separation of Concerns)

### Orchestrator (single-writer coordinator)

- Trigger: `ORCH:`
- Default: run the full loop (AUDIT → MERGE → PLAN → EXECUTE → VERIFY) unless explicitly overridden (`ORCH:AUDIT`, `ORCH:PLAN`, `ORCH:EXEC`, `ORCH:VERIFY`).
- Writes: `.codex/audit/*`, `.codex/TASKS.md` (and optionally `DECISIONS.md` when a workflow decision is made).
- Spawns: lane audits and lane implementation in phases.
- Responsibility: select bundle, define scope, merge audits, dedupe tasks, assign owners, unblock execution.

### Lanes (frontend/backend)

- Triggers: `FRONTEND:` and `BACKEND:` (each supports `AUDIT:` and `IMPL:` modes; the orchestrator should set the mode so humans don’t have to)
- Writes:
  - AUDIT: **nothing** (no patches, no `.codex/TASKS.md` edits). Output is returned to the orchestrator as a payload.
  - IMPL: code changes (1–3 files per batch), plus any required i18n message updates, migrations, etc.
- Responsibility:
  - AUDIT: scan scope, produce **only** the structured payload contract, propose minimal fixes + acceptance checks.
  - IMPL: execute tasks exactly as written, keep batches small, request verify after each batch.

### Verify (read-only verifier)

- Trigger: `VERIFY:`
- Writes: **nothing**. Returns a structured verify report to the orchestrator.
- Responsibility: run gates/tests, report pass/fail + diagnostics; blocks next batch on failures.

### Docs (optional)

- Trigger: `DOCS:` (if/when added as a skill)
- Writes: `docs/*` only when explicitly requested by the orchestrator/human.
- Responsibility: update SSOT docs when shipped work changes architecture/rails/feature scope.

## Auto-Execute Policy

**Default behavior**: Full loop (AUDIT → MERGE → PLAN → EXECUTE → VERIFY) runs automatically unless a pause condition is hit.

**Pause conditions** (human approval required before continuing to EXECUTE):
- DB migrations or schema changes (new tables/columns, alterations, data backfills)
- Auth/access control changes (Auth providers, sessions, roles, RLS policies)
- Payments/Stripe or billing flows (webhooks, checkout, pricing)
- Destructive data operations (DELETE/UPDATE without WHERE, TRUNCATE, DROP, mass edits)
- External service integrations or credentials (new API keys, third-party SDKs/calls, email/SMS)
- Production-impacting config (env vars, secrets, deploy/infra config)
- Privacy/security-sensitive changes (PII logging, data export, audit/reporting changes)

**Auto-execute** (no pause needed):
- UI/styling fixes
- TypeScript type improvements
- Validation additions (non-breaking)
- Refactoring (no behavior change; file moves/renames)
- Test additions
- Documentation updates
- Pure logic bugfixes that don't change data models or access controls

**If unsure**: make a reasonable assumption (the safer option) and note it in the report. Do NOT ask for confirmation.

## Bundles (Intent → Audit Lanes)

The orchestrator selects a bundle (unless explicitly overridden, e.g. `ORCH:UI`).

| User intent (examples) | Bundle | Audit lanes |
|---|---|---|
| “fix styling”, “UI looks off”, “mobile” | UI | `spec-tailwind` + `spec-shadcn` |
| “routing”, “RSC”, “caching”, “layout” | Next.js | `spec-nextjs` |
| “backend issue”, “server action”, “webhook” | Backend | `spec-nextjs` + `spec-supabase` |
| “RLS”, “schema”, “policies” | Supabase | `spec-supabase` |
| “full audit”, “what’s wrong” | Full | ALL specialists |

## Phase Lifecycle (Fresh Context Per Phase)

### Phase 0 — Frame (Orchestrator)

- Capture: goal, scope, non-goals, risk level, and constraints (rails).
- Decide: bundle + which lanes to spawn.
- Hard limits: ensure lane audits won’t generate huge outputs (see “Context Limits”).

### Phase 1 — AUDIT (Parallel, read-only)

- Orchestrator spawns lane audits in parallel.
- Each lane returns **only** the payload contract:
  - `.codex/skills/treido-orchestrator/references/audit-payload.md`
- Orchestrator rejects outputs that aren’t mergeable (missing headings, no file:line evidence, etc.).

### Phase 1.5 — MERGE (Orchestrator, single writer)

- Orchestrator creates one merged artifact under `.codex/audit/` and copies lane payloads verbatim.
- Naming: prefer the repo convention `.codex/audit/YYYY-MM-DD_<short-context>.md` (see `.codex/audit/README.md`).

### Phase 2 — PLAN (Orchestrator, single writer)

- Orchestrator converts findings into tasks in `.codex/TASKS.md`.
- Orchestrator dedupes cross-lane tasks and enforces `.codex/TASKS.md` limits (max 20 total, ≤15 “Ready”).
- Each task must include: priority, owner, verify commands, and file list.

### Phase 3 — EXECUTE (Implementers, one lane at a time)

- Implementer executes the smallest viable set of tasks in a **1–3 file** batch.
- If more files are required, split into another batch and update `.codex/TASKS.md` (via orchestrator).
- Implementer requests verify after each batch.

### Phase 4 — VERIFY (Verify agent)

- Verify runs gates and the smallest relevant tests (risk-based).
- Verify returns a structured report (pass/fail + next steps).
- Orchestrator updates `.codex/TASKS.md` statuses based on the report (single-writer default).

### Phase 5 — DOCS (Optional)

- Only when the shipped work changes SSOT (new routes, behavior changes, launch scope changes).

## Output Contracts

### Audit payload (required)

Audit lanes must follow:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Hard rules:
- Return **only** a single Markdown section starting with `## <AUDITOR_NAME>`.
- Include `Scope`, `Findings`, `Acceptance Checks`, `Risks`.
- Findings must cite real `file:line`.
- No patches. No edits to `.codex/TASKS.md`.

### Merged audit artifact (recommended template)

Create: `.codex/audit/YYYY-MM-DD_<short-context>.md`

```md
# Audit — YYYY-MM-DD — <context>

## Scope
- Goal: <1–2 lines>
- Bundle: <UI | Backend | Supabase | Full>
- Files/routes: <short list>

## <AUDITOR_1>
... (payload copied verbatim)

## <AUDITOR_2>
... (payload copied verbatim)
```

## Task Promotion Rules (Into `.codex/TASKS.md`)

- `.codex/TASKS.md` is the **only** persistent task queue.
- Auditor “task candidates” are suggestions until promoted.
- Promote tasks that are:
  - actionable in ≤1 day
  - executable in 1–3 file batches
  - verifiable (explicit commands or observable acceptance checks)
- Prefer stable IDs derived from lane + audit IDs (example: `FE-UI-006` referencing `TW4-002`).

## Verification Policy (Gates + Risk-Based Tests)

Always after each implementation batch:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Conditional (risk-based):

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

## Context Limits (Anti-Explosion Rules)

Auditor outputs must be short and mergeable:
- Max **10 findings** (prefer highest severity first).
- Max **10 acceptance checks** (keep them concrete).
- Max **5 risks**.

Orchestrator planning must be constrained:
- `.codex/TASKS.md` max **20 total** tasks; max **15 Ready** at once (enforced by `.codex/TASKS.md` header).
- Prefer “defer with rationale” over expanding scope.

## Single-Writer Defaults (Avoid Drift)

Default ownership:
- Auditors: read-only.
- Verify: read-only (never edits `.codex/TASKS.md`).
- Orchestrator: writes `.codex/audit/*` and `.codex/TASKS.md`.
- Implementer: writes code changes for assigned batch.

Exception: the orchestrator may explicitly delegate a one-off edit (e.g. verify marking status) if concurrency risk is zero.

## Prompt Templates (Copy/Paste)

### Orchestrator → Auditor

```md
You are an audit-only specialist. Read-only: do not patch files, do not edit `.codex/TASKS.md`.

SPEC-<DOMAIN>:AUDIT

Goal/context: <1–2 sentences>
Scope hints: <routes/files if known>

Return ONLY a Markdown section that follows:
.codex/skills/treido-orchestrator/references/audit-payload.md

No preamble. Start with `## <AUDITOR_NAME>`.
```

### Orchestrator → Implementer

```md
You are an implementer. Execute the assigned `.codex/TASKS.md` items in a 1–3 file batch.

Tasks: <paste the exact task blocks from `.codex/TASKS.md`>
Constraints: follow AGENTS.md rails (next-intl, TW4 tokens, caching rules, no PII logs).

After the batch: request VERIFY and list the commands to run.
```

### Verify report (returned to orchestrator)

```md
## VERIFY

### Scope
- Batch: <id or description>
- Files touched: <paths>

### Commands
- [x] `pnpm -s typecheck`
- [x] `pnpm -s lint`
- [x] `pnpm -s styles:gate`
- [ ] `pnpm -s test:unit` (optional; if run, mark)

### Result
- Status: <PASS | FAIL>
- Notes: <short; include failing command + error headline>

### Next
- <what to fix or what to proceed with>
```

