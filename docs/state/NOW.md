---
schema_version: 1
updated_at: "2026-02-26"
project: "Treido"
stage: "V1 pre-launch (Bulgaria)"
phase: "Phase 0 - Production Push"
north_star_doc: "docs/strategy/NORTH-STAR.md"
capability_map_doc: "docs/strategy/CAPABILITY-MAP.md"
launch_status: "11/15 checklist sections audited and pass"
p0_p1_status: "11/11 sections audited and pass after iteration"
p2_status: "Not started (Sections 12-15)"
gates_status: "Green (typecheck, lint, styles:gate, test:unit, architecture:gate, test:e2e:smoke, test:a11y); architecture metrics: client=269/1195, over300=66, over500=3, missingLoading=0, missingMetadata=0, duplicates=646 (clones=52)"
top_blockers:
  - "MIG-001: Finalize v2 migration Step 5 (`deal_products` view/`is_prime` drop sequencing)"
  - "LAUNCH-001: Verify Stripe webhook idempotency (replay no-op guarantee)"
  - "LAUNCH-002: Test refund/dispute flow end-to-end"
  - "LAUNCH-003: Verify Stripe prod/dev environment separation (keys + webhook secrets)"
  - "LAUNCH-004: Enable leaked password protection + rerun advisor (currently blocked by Supabase plan requirement)"
current_focus: "REF-POLISH complete; resume MIG-001 Step 5 safely while closing the four launch blockers; schedule PH0-FIX-002 sell flow redesign next"
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

- 2026-02-26: Completed REF-POLISH Phase 3 tasks 001–010: removed global MotionProvider, shipped sitemap caching + metadata hardening, closed route loading/error gaps, completed image audit (no raw `<img>`), swept mobile UX (375px), enforced bundle budget (<150KB first-load JS), and verified E2E smoke + a11y green (tuned `--destructive` for discount badge contrast); all gates remain green.
- 2026-02-25: Completed REF-ALIGNMENT Phase 2 tasks 001–013: modular CSS split, action boundary standardization (Envelope + Zod→auth→domain), Supabase select/filter helpers, layout chrome move to `components/layout`, API param normalization, and removal of all `pb-20` hacks; full gates remain green (including architecture:gate).
- 2026-02-25: Refreshed mobile Home landing to match the Dream Weaver browse pattern: 2-row header (icons + search bar), categories icon strip, stronger filled discovery chips, portrait feed cards with discount badges; gates remain green.

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
