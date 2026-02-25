---
schema_version: 1
updated_at: "2026-02-25"
project: "Treido"
stage: "V1 pre-launch (Bulgaria)"
phase: "Phase 0 - Production Push"
north_star_doc: "docs/strategy/NORTH-STAR.md"
capability_map_doc: "docs/strategy/CAPABILITY-MAP.md"
launch_status: "11/15 checklist sections audited and pass"
p0_p1_status: "11/11 sections audited and pass after iteration"
p2_status: "Not started (Sections 12-15)"
gates_status: "Green (typecheck, lint, styles:gate, test:unit, architecture:gate); 456/456 unit tests passing; architecture metrics: client=269/1150, over300=66, over500=3, missingLoading=0, missingMetadata=0, duplicates=587 (clones=50)"
top_blockers:
  - "MIG-001: Finalize v2 migration Step 5 (`deal_products` view/`is_prime` drop sequencing)"
  - "LAUNCH-001: Verify Stripe webhook idempotency (replay no-op guarantee)"
  - "LAUNCH-002: Test refund/dispute flow end-to-end"
  - "LAUNCH-003: Verify Stripe prod/dev environment separation (keys + webhook secrets)"
  - "LAUNCH-004: Enable leaked password protection + rerun advisor (currently blocked by Supabase plan requirement)"
current_focus: "Stabilize live v2 category migration (complete Step 5 safely) while closing launch blockers"
active_workstreams:
  - "Launch blocker closure with human approval for sensitive ops"
  - "Production-readiness refactor batches (file splits, route completeness, duplicate reduction)"
  - "Sell flow UX redesign (FIX-002)"
  - "Account settings mobile/desktop hardening (FIX-003)"
next_session_boot:
  - "Read AGENTS.md"
  - "Read docs/state/NOW.md"
  - "Read TASKS.md and execute top unchecked Phase 0 item"
source_refs:
  tasks: "TASKS.md"
  checklist: "docs/launch/CHECKLIST.md"
  tracker: "docs/launch/TRACKER.md"
  decisions: "docs/DECISIONS.md"
---

# NOW

## Snapshot

Treido is in production push mode for V1 Bulgaria launch readiness.
Core P0+P1 launch sections have been audited and iterated to pass.
Remaining launch risk is concentrated in four sensitive blockers (payments/compliance/env).

## Recent Changes (Last 3)

- 2026-02-25: Completed REF-CLEANUP Phase 1 tasks 001–013 (excluding 014): logging standardization, unsafe cast reduction, `generateStaticParams` helpers, script/test hygiene; gates remain green.
- 2026-02-25: Reduced `as unknown as` from 46 → 15 total occurrences (prod 34 → 3) and console statements in production code from 111 → 0.
- 2026-02-25: Duplicate scan improved (`jscpd` clones 53 → 50; duplicated lines 628 → 587) and `pnpm -s knip` is clean.

## Open Decisions (Max 3)

- Sequence decision: finish all four launch blockers first vs start P2 section audits in parallel.
- Supabase plan decision for leaked-password protection capability.
- GTM wedge categories selection for post-launch supply seeding.

## Known Constraints

- Auth/session, payments/webhooks, DB schema/migrations/RLS, and destructive ops require human approval.
- Launch blocker LAUNCH-004 has an external plan dependency (`password_hibp_enabled` unavailable on current Supabase tier).

## Update Rules

1. Always update `updated_at`, `phase`, `launch_status`, `top_blockers`, and `current_focus`.
2. Keep `Recent Changes` to max 3 bullets.
3. Keep `Open Decisions` to max 3 bullets.
4. Do not store full session transcripts here; log outcomes in `docs/state/CHANGELOG.md`.
