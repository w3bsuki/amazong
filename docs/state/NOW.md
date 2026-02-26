---
schema_version: 1
updated_at: "2026-02-26"
project: "Treido"
stage: "V1 pre-launch (Bulgaria)"
phase: "Phase 0 launch blockers + Phase 2 AI completion"
north_star_doc: "docs/strategy/NORTH-STAR.md"
capability_map_doc: "docs/strategy/CAPABILITY-MAP.md"
launch_status: "Core route harness is green on M375 and desktop; remaining launch risk is concentrated in PH0-LAUNCH-001..004 and PH0-REFACTOR-001."
p0_p1_status: "P0 route bucket pass achieved on M375 + desktop; P1 harness scope pass remains unchanged."
p2_status: "AI foundations shipped; open completion items: PH2-AI-007..010."
gates_status: "Core gates last verified green 2026-02-26 (`typecheck`, `lint`, `styles:gate`, `test:unit`); docs contract now has enforceable `docs:gate`."
top_blockers:
  - "PH0-LAUNCH-001: Verify Stripe webhook idempotency in production (replay no-op proof)."
  - "PH0-LAUNCH-002: Execute refund/dispute flow end-to-end with evidence."
  - "PH0-LAUNCH-003: Audit Stripe prod/dev key and webhook-secret separation."
  - "PH0-LAUNCH-004: Enable leaked password protection or record accepted risk posture."
  - "PH0-REFACTOR-001: Complete sensitive Domain 6 refactor with expanded verification."
current_focus: "Docs control-plane v2 is now execution-first; next work is closing open Phase 0 launch blockers and Phase 2 AI listing tasks from TASKS.md."
active_workstreams:
  - "Launch blocker closure with human-verified evidence for payments/auth operations"
  - "Phase 2 AI listings completion (confidence + pricing suggestion + docs closeout)"
  - "Documentation control-plane maintenance (lean AGENTS/index/TASKS/NOW contract)"
next_session_boot:
  - "Read docs/index.md"
  - "Read docs/state/NOW.md"
  - "Read TASKS.md and execute the top unchecked item"
source_refs:
  tasks: "TASKS.md"
  docs_router: "docs/index.md"
  checklist: "docs/launch/CHECKLIST.md"
  tracker: "docs/launch/TRACKER.md"
  decisions: "docs/DECISIONS.md"
---

# NOW

## Snapshot

Treido is in a blocker-closure phase: route quality is stable, but launch-critical sensitive checks are still pending.
The docs system was refactored to reduce noise and speed up AI execution.

## Recent Changes (Last 3)

- 2026-02-26: Refactored docs control plane for AI execution (lean `AGENTS.md`, canonical `docs/index.md`, active-only `TASKS.md`, archived historical queue in `TASKS.archive.md`).
- 2026-02-26: Rewrote `docs/DESIGN.md` to reflect actual repository behavior and style-gate coverage; removed stale UI guidance.
- 2026-02-26: Added enforceable docs governance (`docs:gate`) and wired it into CI.

## Open Decisions (Max 3)

- Supabase plan decision for leaked-password protection capability (`PH0-LAUNCH-004`).
- Launch sequencing decision: finish all Phase 0 blockers before starting PH2-AI-008/009 implementation.
- Scope decision for PH0-REFACTOR-001 (full domain pass now vs staged by risk area).

## Known Constraints

- Auth/session, payments/webhooks, DB schema/migrations/RLS, and destructive operations require explicit evidence and rollback-safe execution.
- External/manual verification is still required for PH0-LAUNCH-001..004.

## Update Rules

1. Always update `updated_at`, `launch_status`, `top_blockers`, and `current_focus` after material status change.
2. Keep `Recent Changes` to max 3 bullets.
3. Keep `Open Decisions` to max 3 bullets.
4. Keep this file as current state only; log detailed outcomes in `docs/state/CHANGELOG.md`.
