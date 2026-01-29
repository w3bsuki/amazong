# Codex — Production Docs + Workflow Proposal (2026-01-28)

> This is a **planner doc** written by Codex. It does **not** override SSOT (`AGENTS.md` + `docs/*`).

## Goal

Get Treido to a clean, production-ready state by:

1. Locking SSOT docs (PRD/FEATURES/ARCHITECTURE/DESIGN) so “what we build” is unambiguous.
2. Converging on a single execution workflow (Issues → Tasks → Verify → Ship).
3. Running audits continuously until all remaining work is extracted into small, verifiable tasks.

## Constraints (non-negotiables)

From `AGENTS.md`:

- No secrets/PII in logs (server or client)
- All user-facing strings via `next-intl`
- Tailwind v4 only: no gradients/arbitrary/hardcoded colors (`pnpm -s styles:gate`)
- Default to Server Components; `"use client"` only when required
- Cached server code: always `cacheLife()` + `cacheTag()`; never `cookies()`/`headers()` in cached functions
- Stripe webhooks signature-verified + idempotent
- **Small batches** (1–3 files), always verifiable

## Proposed “Final Docs” Set

### SSOT (already correct)

- `AGENTS.md` — repo entry point + rails + boundaries + verification
- `docs/PRD.md` — product scope + launch gates
- `docs/FEATURES.md` — shipped status + route map
- `docs/ARCHITECTURE.md` — boundaries + caching + Supabase + Stripe + i18n
- `docs/DESIGN.md` — Tailwind v4 + shadcn tokens + UI rules

### Production readiness (new, non-SSOT)

- `production/production.md` — shared V1 launch alignment (neutral working version)
- `production/codex_production.md` — Codex variant of the alignment doc

### Working logs (non-SSOT)

- `ISSUES.md` — problem registry + acceptance
- `TASKS.md` — current sprint checklist (keep ≤ ~20 active tasks)
- `audit/**` — dated audits (lane format), no architectural rules here
- `refactor/**` — refactor plans + file maps

## What I’d Change (doc deltas to converge)

These are **recommended edits** (do in small batches):

### `TASKS.md`

- Keep it “today’s work” only; move release-level checklists into `production/`.
- Every task should map to one of:
  - Product scope (PRD/FEATURES)
  - Release blocker (production)
  - Quality gate (styles/knip/dupes/tests)

### `CLAUDE.md`

- Keep as a thin wrapper that just points to `AGENTS.md` and the 4 SSOT docs.
- Remove duplicated lines (e.g. “Keep scope small” appears twice).
- Align the “Gates” section to match `AGENTS.md` (typecheck/lint/styles/knip/dupes + smoke where relevant).

### `docs/FEATURES.md`

- Add an explicit **Target** column (`V1`, `V1.1`, `V2`) to avoid “nice-to-have” drifting into “must ship”.
- Add a short “Launch Gates Coverage” section referencing PRD hard gates:
  - Webhook idempotency verified
  - Refund/dispute flow end-to-end verified
  - RLS verified
  - No secrets in logs

### `docs/DESIGN.md`

- Clarify **opacity exceptions** (it currently forbids many opacity patterns, but uses some in examples).
- Add a “UI consistency checklist” for the main surfaces:
  - Header variants
  - PageShell usage (avoid nesting)
  - Rounding (`rounded-md` default)
  - Touch targets (`h-touch-*`)

## Task Extraction Workflow (how we go from “audit” to “done”)

1. Run gates: `typecheck`, `lint`, `styles:gate`, `knip`, `dupes`, plus `test:*` based on touched area.
2. Write findings into the relevant lane:
   - Backend/security: `ISSUES.md` + `TASKS.md`
   - UI drift: `TASKS.md` + `audit/`
   - Production readiness: `production/production.md`
3. Convert findings into **1–3 file tasks** with verification notes.
4. Execute tasks in priority order (release blockers first).
5. When a task ships a feature, update `docs/FEATURES.md` (SSOT).

## Proposed Next Files (after Opus + Codex converge)

Already present:

- `production/backend_tasks.md`
- `production/frontend_tasks.md`

Natural next step:

- `production/tasks.md` — release task SSOT (source of truth for “what’s left”)
- Keep `production/backend_tasks.md` and `production/frontend_tasks.md` derived from `production/tasks.md`

## Opus Collaboration

- Opus writes their version as `production/opus.md` (planner doc).
- Codex writes versions with a `codex_` prefix under `production/`.
- We merge agreed decisions into `production/opus_codex.md` (agreement doc; edit only after both sides converge).

## Open Questions (need a decision)

- What is the **minimum** admin surface required for V1 (reports + refunds + notes + user blocks)?
- Do we treat buyer cancel-order as a **V1 must** or a **post-launch** improvement?
- Do we ship V1 without email notifications (Stripe receipts only), or do we add minimal transactional emails?
