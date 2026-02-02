# WORKFLOW.md — Agent Fleet Operations

> How agents coordinate work in this repo.

| Scope | Agent workflow, phases, contracts |
|-------|----------------------------------|
| Audience | AI agents |
| Type | Reference |

---

## Quick Reference

| Phase | Owner | Writes |
|-------|-------|--------|
| 0. Frame | Orchestrator | Scope definition |
| 1. Audit | Specialists | Nothing (read-only) |
| 1.5. Merge | Orchestrator | `.codex/audit/*` |
| 2. Plan | Orchestrator | `.codex/TASKS.md` |
| 3. Execute | Lanes | Code (1–3 files) |
| 4. Verify | Verify | Nothing (read-only) |

---

## Goals

- Parallelize **read-only** audits with mergeable outputs
- Centralize planning in **single task queue** (`.codex/TASKS.md`)
- Execute in **small, shippable batches** (1–3 files) with verification
- Prevent context bloat via **structured summaries** and **hard limits**

---

## Roles

### Orchestrator (`ORCH:`)

- Default: full loop (AUDIT → MERGE → PLAN → EXECUTE → VERIFY)
- Writes: `.codex/audit/*`, `.codex/TASKS.md`
- Spawns lane audits and implementation

### Lanes (`FRONTEND:` / `BACKEND:`)

Modes: `AUDIT:` and `IMPL:`

| Mode | Writes |
|------|--------|
| AUDIT | Nothing — returns payload to orchestrator |
| IMPL | Code changes (1–3 files per batch) |

### Verify (`VERIFY:`)

- Writes: **Nothing** — returns report to orchestrator
- Runs gates/tests, reports pass/fail

---

## Auto-Execute Policy

**Pause conditions** (human approval required):

| Change Type | Why |
|-------------|-----|
| DB migrations/schema | Data integrity |
| Auth/access control | Security |
| Payments/Stripe | Financial risk |
| Destructive operations | Data loss |
| External integrations | Third-party risk |
| Production config | Deploy safety |
| Privacy/security | Compliance |

**Auto-execute** (no pause):

- UI/styling fixes
- TypeScript improvements
- Validation additions
- Refactoring (no behavior change)
- Test additions
- Documentation updates
- Pure logic bugfixes

---

## Bundles

| User Intent | Bundle | Audit Lanes |
|-------------|--------|-------------|
| "fix styling" | UI | `spec-tailwind` + `spec-shadcn` |
| "routing", "RSC" | Next.js | `spec-nextjs` |
| "backend", "webhook" | Backend | `spec-nextjs` + `spec-supabase` |
| "RLS", "schema" | Supabase | `spec-supabase` |
| "full audit" | Full | ALL specialists |

---

## Phase Lifecycle

### Phase 0 — Frame (Orchestrator)

- Capture: goal, scope, non-goals, risk level
- Decide: bundle + lanes to spawn

### Phase 1 — AUDIT (Parallel, read-only)

- Lanes return structured payload only
- Contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`
- Max 10 findings, 10 acceptance checks, 5 risks

### Phase 1.5 — MERGE (Orchestrator)

- Create merged artifact: `.codex/audit/YYYY-MM-DD_<context>.md`
- Copy lane payloads verbatim

### Phase 2 — PLAN (Orchestrator)

- Convert findings to `.codex/TASKS.md` tasks
- Dedupe cross-lane duplicates
- Max 20 total tasks, ≤15 Ready

### Phase 3 — EXECUTE (Lanes)

- 1–3 file batches
- Request verify after each batch

### Phase 4 — VERIFY

- Run gates + risk-based tests
- Return structured report
- Orchestrator updates task statuses

---

## Output Contracts

### Audit Payload (Required)

```md
## <AUDITOR_NAME>

### Scope
- Files: <paths>

### Findings
1. **<ID>** (<severity>) `file:line` — <issue>
   - Fix: <solution>

### Acceptance Checks
- [ ] <check>

### Risks
- <risk>
```

### Merged Audit Artifact

```md
# Audit — YYYY-MM-DD — <context>

## Scope
- Goal: <1–2 lines>
- Bundle: <UI | Backend | Supabase | Full>

## <AUDITOR_1>
... (payload verbatim)

## <AUDITOR_2>
... (payload verbatim)
```

### Verify Report

```md
## VERIFY

### Scope
- Batch: <description>
- Files: <paths>

### Commands
- [x] `pnpm -s typecheck`
- [x] `pnpm -s lint`
- [x] `pnpm -s styles:gate`

### Result
- Status: <PASS | FAIL>
- Notes: <short>

### Next
- <action>
```

---

## Task Promotion Rules

`.codex/TASKS.md` is the **only** persistent queue.

Promote tasks that are:
- Actionable in ≤1 day
- Executable in 1–3 file batches
- Verifiable (explicit commands)

ID format: `<LANE>-<AUDIT_ID>` (e.g., `FE-UI-006`)

---

## Verification Policy

Always after each batch:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Conditional:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Context Limits

| Scope | Limit |
|-------|-------|
| Findings per audit | Max 10 |
| Acceptance checks | Max 10 |
| Risks | Max 5 |
| Tasks in `.codex/TASKS.md` | Max 20 |
| Ready tasks | Max 15 |

---

## Single-Writer Defaults

| Role | Writes |
|------|--------|
| Auditors | Nothing (read-only) |
| Verify | Nothing (read-only) |
| Orchestrator | `.codex/audit/*`, `.codex/TASKS.md` |
| Implementer | Code for assigned batch |

---

## Prompt Templates

### Orchestrator → Auditor

```md
You are an audit-only specialist. Read-only: no patches, no TASKS.md edits.

SPEC-<DOMAIN>:AUDIT

Goal/context: <1–2 sentences>
Scope hints: <routes/files>

Return ONLY Markdown following audit-payload.md contract.
Start with `## <AUDITOR_NAME>`.
```

### Orchestrator → Implementer

```md
You are an implementer. Execute assigned TASKS.md items in 1–3 file batch.

Tasks: <paste exact task blocks>
Constraints: follow AGENTS.md rails.

After batch: request VERIFY with commands to run.
```

---

## See Also

- [AGENTS.md](./AGENTS.md) — Entry point, rails
- [11-SKILLS.md](./11-SKILLS.md) — Skill reference
- `.codex/TASKS.md` — Active task queue
- `.codex/skills/` — Full skill definitions

---

*Last updated: 2026-02-01*
