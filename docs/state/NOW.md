---
schema_version: 1
updated_at: "2026-02-26"
project: "Treido"
stage: "V1 pre-launch (Bulgaria)"
phase: "Phase 2 - AI Listings MVP"
north_star_doc: "docs/strategy/NORTH-STAR.md"
capability_map_doc: "docs/strategy/CAPABILITY-MAP.md"
launch_status: "11/15 checklist sections audited and pass"
p0_p1_status: "11/11 sections audited and pass after iteration"
p2_status: "AI foundations complete (PH2-AI-001..005)"
gates_status: "Green (typecheck, lint, styles:gate, test:unit re-verified 2026-02-26 after PH2-AI-001..005; architecture:gate, test:e2e:smoke, test:a11y last verified 2026-02-26); architecture metrics: client=269/1195, over300=66, over500=3, missingLoading=0, missingMetadata=0, duplicates=646 (clones=52)"
top_blockers:
  - "MIG-001: Finalize v2 migration Step 5 (`deal_products` view/`is_prime` drop sequencing)"
  - "LAUNCH-001: Verify Stripe webhook idempotency (replay no-op guarantee)"
  - "LAUNCH-002: Test refund/dispute flow end-to-end"
  - "LAUNCH-003: Verify Stripe prod/dev environment separation (keys + webhook secrets)"
  - "LAUNCH-004: Enable leaked password protection + rerun advisor (currently blocked by Supabase plan requirement)"
current_focus: "Phase 2 AI Listings MVP foundations are complete (prompt registry, telemetry, guardrails, listing-text generation, eval harness). Next focus: AI quality iteration and launch blocker closure (MIG-001 + LAUNCH-001..004)."
active_workstreams:
  - "Launch blocker closure with human approval for sensitive ops"
  - "Resume MIG-001 Step 5 safely (schema/migration sequencing)"
  - "Optional: continue duplicate reduction without raising client-boundary"
next_session_boot:
  - "Read AGENTS.md"
  - "Read docs/state/NOW.md"
  - "Read TASKS.md and execute top unchecked Phase 1 item"
source_refs:
  tasks: "TASKS.md"
  checklist: "docs/launch/CHECKLIST.md"
  tracker: "docs/launch/TRACKER.md"
  decisions: "docs/DECISIONS.md"
---

# NOW

## Snapshot

Phase 2 AI Listings MVP foundations shipped across backend and sell-flow UX.
Launch readiness risk remains concentrated in a small set of sensitive blockers (payments/compliance/env + migration sequencing).

## Recent Changes (Last 3)

- 2026-02-26: Completed Phase 2 AI Listings MVP foundations (PH2-AI-001..005): prompt registry/version pinning, telemetry envelope, guardrail policy layer, new listing text generation endpoint + sell-form "Generate with AI" button (feature-gated), and eval harness scaffold with golden set; gates re-verified green (`typecheck`, `lint`, `styles:gate`, `test:unit`).
- 2026-02-26: Completed Phase 1 buyer conversion batch: PH1-BUYER-001 order confirmation email template + webhook trigger (send stubbed via logger until provider), and PH1-BUYER-002 mobile PDP seller bio surface (tap-to-profile, rating + joined year + verified); gates re-verified green (`typecheck`, `lint`, `styles:gate`, `test:unit`).
- 2026-02-26: Completed REF-POLISH Phase 3 tasks 001–010: removed global MotionProvider, shipped sitemap caching + metadata hardening, closed route loading/error gaps, completed image audit (no raw `<img>`), swept mobile UX (375px), enforced bundle budget (<150KB first-load JS), and verified E2E smoke + a11y green (tuned `--destructive` for discount badge contrast); all gates remain green.

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
