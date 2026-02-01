# Full Project Refactor Prompt (Codex CLI)

Comprehensive refactor workflow with subagent parallelization and gate checkpoints.

## Usage

```bash
codex --model claude-sonnet-4-20250514 --approval auto-edit "$(cat .codex/prompts/full-project-refactor.md)"
```

Or run with opus for complex reasoning:
```bash
codex --model o3 --approval auto-edit "$(cat .codex/prompts/full-project-refactor.md)"
```

---

## Prompt

```
ORCH: Full project refactor + improvement (Next.js 16 + React 19 + Supabase + Stripe)

You are Codex CLI operating in repo root. Goal: clean up codebase, fix priority audit findings, and leave all gates green:
- pnpm -s typecheck
- pnpm -s lint
- pnpm -s styles:gate
- pnpm -s knip

Hard constraints
- Follow local workflow/docs in `.codex/` (read them first): `.codex/AGENTS.md`, `.codex/WORKFLOW.md`, `.codex/TASKS.md`, `.codex/ISSUES.md`, and `.codex/audit/`.
- Single-writer rule: only the main agent edits files. Subagents are read-only analyzers that produce explicit change proposals (file paths + rationale + risks).
- No drive-by refactors. Keep batches small, cohesive, and reversible.
- Don't run destructive git commands (e.g., reset/clean) without explicit confirmation.

Progress tracking (output + repo artifacts)
1) Use the plan tool: maintain a phase-based plan with exactly one step in_progress.
2) Keep `.codex/TASKS.md` up to date:
   - Add a "Refactor Run Log" section with:
     - Phase checklist with dates
     - Gate results table per checkpoint (pass/fail + command + timestamp)
     - "Deferred" list with links into `.codex/ISSUES.md`
3) Update `.codex/ISSUES.md` for any newly discovered issues or deferrals:
   - Include: impact, evidence (file paths), recommended fix, and whether it blocks gates.

Baseline snapshot (must do before edits)
- Record `git status --porcelain` and `git rev-parse --short HEAD` in the Refactor Run Log.
- Run all four gates once and record results.
- If baseline gates are already failing, first isolate whether failures are expected/known in `.codex/ISSUES.md`; then fix only what's necessary to get back to green before starting refactor phases.

Subagent breakdown (parallel → then sequential integration)
Spawn these as read-only "explorer" subagents in parallel. They must only scan and propose, not patch.
- Agent A (STRUCTURE/KNIP): produce deletion plan for ORCH-CLN-010 (knip-confirmed unused files) + any import graph gotchas.
- Agent B (TS/EXPORTS): propose changes for ORCH-CLN-011 (unused exports) with minimal public API risk.
- Agent C (DEPS): propose ORCH-CLN-012 (unused devDependencies) including lockfile + scripts implications.
- Agent D (NEXTJS): audit ORCH-AUD-013 Next.js App Router issues (RSC vs client boundaries, caching rules, route group/layout correctness).
- Agent E (TW4): audit ORCH-AUD-013 Tailwind v4 rails (tokens only, no gradients/palette/arbitrary values, @theme alignment).
- Agent F (SHADCN): audit ORCH-AUD-013 shadcn/ui boundary issues (components/ui primitives purity, Radix composition drift).
Optional (spawn only if audits indicate need):
- Agent G (SUPABASE): hot-path query + RLS/policy + auth integration checks.
- Agent H (STRIPE/BACKEND): webhook/idempotency and server action/route handler correctness.

Each subagent report format (required)
- Summary (1–3 bullets)
- Findings (bulleted, each with filepath)
- Proposed edits (exact file list, what to change, why)
- Risk assessment (what could break)
- Validation suggestions (which gate(s) most relevant)

Phased execution (integrate sequentially; run gates between phases)

PHASE 0 — Set up checkpoints
- Decide checkpoint method:
  - Preferred: create small, logical git commits per phase (ask before committing if unsure).
  - Alternative: keep a "checkpoint diff" by saving `git diff` output to the Refactor Run Log notes.
- Confirm baseline gates and status are recorded.

PHASE 1 — Cleanup (ORCH-CLN-010/011/012)
1. ORCH-CLN-010: Delete knip-confirmed unused files
   - Delete only files that knip confirms unused and that have no runtime side effects.
   - Remove/adjust any references (imports, barrel exports, tests, stories).
   - Gate checkpoint: run all four gates; if any fail, fix within this phase or revert this phase cleanly.

2. ORCH-CLN-011: Remove unused exports
   - Prefer removing from barrels first; avoid breaking external/public APIs unless confirmed internal-only.
   - Update imports to avoid re-export reliance if needed.
   - Gate checkpoint: run all four gates; fix or revert this phase.

3. ORCH-CLN-012: Remove unused devDependencies
   - Remove from package.json; ensure scripts still work; update lockfile.
   - Be cautious with tooling deps used indirectly (lint, typecheck, postcss/tailwind, knip config).
   - Gate checkpoint: run all four gates; fix or revert this phase.

PHASE 2 — Fix priority audit findings (ORCH-AUD-013)
- Integrate audit fixes in small slices (one domain at a time):
  A) NEXTJS slice (App Router/RSC/caching/routing)
  B) TW4 slice (token rails + forbidden patterns)
  C) SHADCN slice (components/ui purity + composition)
- After each slice: run all four gates and record results.
- If a slice requires broader refactors, stop and write an Issue in `.codex/ISSUES.md` with a minimal safe plan; do not widen scope without confirmation.

PHASE 3 — LAUNCH manual verification (LAUNCH-001..LAUNCH-007)
- Read exact LAUNCH-001..007 definitions from `.codex/TASKS.md`.
- Produce a human checklist in `.codex/TASKS.md` including:
  - Preconditions (env vars, Stripe/Supabase setup)
  - Exact steps + expected result
  - Where to look for logs
- Mark these as "Manual — Pending human" and ensure nothing in code blocks gates.

Failure handling / rollback policy
- If a gate fails:
  1) Identify whether the failure is introduced by the current phase (use git diff + error output).
  2) Attempt minimal fix within the same phase.
  3) If not resolvable quickly, revert only the current phase (do not revert earlier green phases).
  4) If revert is non-trivial, ask for confirmation before any destructive git operations; otherwise revert via targeted file undo.
  5) Record the failure and resolution (or deferral) in `.codex/ISSUES.md` and the Refactor Run Log.

Definition of Done
- ORCH-CLN-010, ORCH-CLN-011, ORCH-CLN-012 completed (or explicitly deferred with justification in `.codex/ISSUES.md`).
- ORCH-AUD-013 priority findings addressed with evidence (filepaths) or deferred with a safe plan.
- LAUNCH-001..007 checklist produced and tracked.
- All gates green at final checkpoint and logged in `.codex/TASKS.md`.

Start now:
- Create the plan, run baseline snapshot, spawn subagents in parallel, wait for reports, then proceed Phase 1 → Phase 3 with checkpoints and gate logs.
```

---

## Quick Run (skip subagents)

For faster runs without parallel subagents:

```bash
codex "Run gates (typecheck, lint, styles:gate, knip), fix failures iteratively, commit when green"
```

---

## Subagent Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (main)                      │
│  - Owns file writes                                         │
│  - Runs gates                                               │
│  - Manages checkpoints                                      │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  Agent A    │    │  Agent B    │    │  Agent C    │
   │  STRUCTURE  │    │  TS/EXPORTS │    │    DEPS     │
   │  (parallel) │    │  (parallel) │    │  (parallel) │
   └─────────────┘    └─────────────┘    └─────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  Merge reports  │
                    │  (sequential)   │
                    └─────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  Agent D    │    │  Agent E    │    │  Agent F    │
   │   NEXTJS    │    │    TW4      │    │   SHADCN    │
   │  (parallel) │    │  (parallel) │    │  (parallel) │
   └─────────────┘    └─────────────┘    └─────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Integration    │
                    │  (phase by      │
                    │   phase)        │
                    └─────────────────┘
```

---

## Gate Commands Reference

```bash
# Core gates (run between phases)
pnpm -s typecheck          # TypeScript strict mode
pnpm -s lint               # ESLint + Prettier
pnpm -s styles:gate        # TW4 token rails
pnpm -s knip               # Unused code detection

# Extended checks (weekly/pre-deploy)
pnpm -s test:unit          # Vitest unit tests
pnpm -s test:e2e:smoke     # Playwright smoke (needs server)
pnpm -s dupes              # jscpd duplicate detection
```
