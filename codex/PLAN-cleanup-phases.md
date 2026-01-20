# Production Cleanup Plan (Phased)

Date: 2026-01-19
Owner: Audit lead

## Goal
Reduce bloat and duplication, align with production needs, and prepare for safe refactor. **No code changes yet**.

## Phase 0 — Safety & Baseline (1–2 days)
**Objective:** Protect current state and ensure clear ownership.

- Create a single canonical docs index and archive rules (see [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md)).
- Confirm which task trackers are canonical (TODO.md vs tasks.md vs AGENT-ORCHESTRATION.md).
- Establish a cleanup branch or tag before deletions.

**Exit criteria:**
- Canonical docs list finalized.
- Archive location agreed (docs/archive or docs/audit).

## Phase 1 — Low-Risk Deletions (1–2 days)
**Objective:** Remove obvious, safe-to-delete artifacts.

- Delete generated artifacts in repo:
  - playwright-report*, test-results, .next, .playwright-mcp (see [codex/AUDIT-build-artifacts.md](codex/AUDIT-build-artifacts.md)).
- Remove temp scratch files:
  - temp_log_entry.md, temp_search_overlay.txt (see [codex/AUDIT-root-misc.md](codex/AUDIT-root-misc.md)).
- Remove obsolete CSS backups in app/:
  - globals.css.old, globals.css.backup (see [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md)).

**Exit criteria:**
- Repo contains no generated artifacts.
- Temp scratch files removed or archived.

## Phase 2 — Documentation Consolidation (2–3 days)
**Objective:** Collapse duplicated plans/audits and reduce root clutter.

- Move root audit/plan docs into docs/audit or docs/archive:
  - AUDIT-desktop-touch-targets.md, DESKTOP-UX-AUDIT-2026-01-15.md, LAYOUT-ARCHITECTURE-AUDIT.md, REFACTOR-LAYOUT-ARCHITECTURE.md
- Consolidate touch-target tasks into a single canonical doc.
- Archive superseded supabase_audit.md (keep codex/supabase-audit-2026-01-17.md as canonical).
- Migrate GPT+OPUS decisions/specs into docs-site content as per docs-site consolidation plan.

**Exit criteria:**
- Root folder is mostly config + a small canonical set of docs.
- Documentation index updated.

## Phase 3 — Config Hygiene (1–2 days)
**Objective:** Align tooling, remove unused scripts, and fix config drift.

- Prune unused scripts (audit-treido*, create-e2e-user, probe-runtime, test-supabase-join, verify-e2e-login).
- Remove duplicate VS Code tasks.
- Normalize MCP config ownership (document the single source of truth).
- Fix Supabase migration naming inconsistencies and add config.toml if CLI is used.
- Align Capacitor output with Next.js build strategy.

**Exit criteria:**
- Tooling scripts map cleanly to package.json.
- Supabase migrations are consistent and reproducible.

## Phase 4 — Core App Cleanup (3–5 days)
**Objective:** Reduce duplication and enforce boundaries without functional change.

- Remove demo routes if not required for production.
- Fix boundary violations (components importing app-level actions).
- Consolidate duplicated mobile/desktop components into shared base layers.
- Modularize large config objects (mega-menu, subcategory images).
- Clean public assets (remove unused jpg/png duplicates).

**Exit criteria:**
- Shared component boundaries enforced.
- Data/config is modular and deduplicated.

## Phase 5 — Test Suite Rationalization (2–3 days)
**Objective:** Reduce flakiness and redundant suites.

- De-duplicate mobile audit suites and trim smoke to minimal health checks.
- Stabilize flaky seller routes and checkout tests.
- Remove obsolete tests or restructure into tags (@smoke, @audit, @slow).

**Exit criteria:**
- Smoke tests run fast and reliably.
- Audit suites are clearly segmented.

## Phase 6 — Final Verification (1–2 days)
**Objective:** Ensure cleanup doesn’t regress functionality.

- Typecheck and unit tests.
- E2E smoke with existing server.
- Validate docs index and archival paths.

**Exit criteria:**
- All gates green.
- Cleanup complete and ready for refactor.

## Dependencies & Owners
- Docs consolidation owner: Documentation lead
- Infra/config owner: Tooling lead
- App cleanup owner: Frontend lead
- Tests rationalization owner: QA lead

## References
- Core app audit: [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md)
- Tests/E2E audit: [codex/AUDIT-tests-e2e.md](codex/AUDIT-tests-e2e.md)
- Docs/plans audit: [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md)
- Infra/config audit: [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md)
- Build artifacts audit: [codex/AUDIT-build-artifacts.md](codex/AUDIT-build-artifacts.md)
- Root misc audit: [codex/AUDIT-root-misc.md](codex/AUDIT-root-misc.md)
