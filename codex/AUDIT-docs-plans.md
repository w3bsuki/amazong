# Docs & Plans Audit Report

Date: 2026-01-19

## Scope

Reviewed documentation and planning artifacts in:
- [docs](docs)
- [docs-site](docs-site)
- [cleanup](cleanup)
- [prompts](prompts)
- [GPT+OPUS](GPT+OPUS)
- [styling](styling)
- [codex](codex)
- Root-level plan/audit markdown/txt files

## Canonical Baseline (per docs/README)

Canonical docs are intentionally limited to:
- Root: [README.md](README.md), [TODO.md](TODO.md), [agents.md](agents.md)
- Dev: [docs/ENGINEERING.md](docs/ENGINEERING.md), [docs/DESIGN.md](docs/DESIGN.md), [docs/PRODUCTION.md](docs/PRODUCTION.md)
- Supporting: [docs/guides](docs/guides), [docs/styling/README.md](docs/styling/README.md), [docs/launch](docs/launch), [docs/audit](docs/audit)

Anything dated or labeled audit/plan is non-canonical and should live under [docs/audit](docs/audit) or [docs/archive](docs/archive).

## Findings by Location

### docs/
- Canonical and supporting docs are well-defined. The wrappers [docs/PRODUCTION-WORKFLOW-GUIDE.md](docs/PRODUCTION-WORKFLOW-GUIDE.md) and [docs/GPTVSOPUSFINAL.md](docs/GPTVSOPUSFINAL.md) are tombstones for legacy references. Keep, but avoid adding new references to them.
- [docs/audit](docs/audit) already contains competitive/product audits; root-level audits should be moved here or to archive to stay consistent.

### docs-site/
- docs-site is a separate Next.js site. Only [docs-site/content](docs-site/content) should be considered documentation. Build artifacts and dependencies (docs-site/.next, docs-site/node_modules) are not docs and should be ignored for consolidation decisions.
- [docs-site/DOCS_CONSOLIDATION_PLAN.md](docs-site/DOCS_CONSOLIDATION_PLAN.md) already proposes moving business/product docs to docs-site content. This should remain the consolidation source of truth for docs-site migration.

### cleanup/
- [cleanup/arbitrary-scan-report.txt](cleanup/arbitrary-scan-report.txt) and [cleanup/palette-scan-report.txt](cleanup/palette-scan-report.txt) are referenced by planning docs and should stay in cleanup as scan outputs.

### prompts/
- [prompts/README.md](prompts/README.md) is correct for audit prompts.
- [prompts/PHASE-7-DESKTOP-POLISH.md](prompts/PHASE-7-DESKTOP-POLISH.md) is a task plan rather than a reusable prompt. If Phase 7 is complete, move it to an archive location (e.g., prompts/_archive) or to [docs/archive](docs/archive).

### GPT+OPUS/
- [GPT+OPUS/README.md](GPT+OPUS/README.md) and [GPT+OPUS/PROTOCOL.md](GPT+OPUS/PROTOCOL.md) are meta-docs; keep in place.
- Decisions/specs/audits are better suited for docs-site business content per the consolidation plan. Conversations are historical and should remain in GPT+OPUS as archive.

### styling/
- [styling/README.md](styling/README.md) is an intentional tombstone pointing to [docs/styling/README.md](docs/styling/README.md). Keep as-is.

### codex/
- [codex/MASTER-PLAN.md](codex/MASTER-PLAN.md) already asserts it is the consolidated plan and lists prior artifacts to delete. This is the authoritative plan document for production readiness.
- [codex/knip-report.md](codex/knip-report.md) and [codex/folder-inventory.md](codex/folder-inventory.md) are generated reports. Keep in codex if they are part of the master plan evidence; otherwise move to cleanup or archive for storage hygiene.
- [codex/supabase-audit-2026-01-17.md](codex/supabase-audit-2026-01-17.md) overlaps with root audit files; keep as the latest deep audit and archive older ones.

## Root-Level Plan/Audit Files — Redundant/Obsolete Candidates

| File | Status | Recommendation | Target (if moved) |
|---|---|---|---|
| [AUDIT-desktop-touch-targets.md](AUDIT-desktop-touch-targets.md) | Complete, fixed | Archive | [docs/archive](docs/archive) or [docs/audit](docs/audit) |
| [DESKTOP-UX-AUDIT-2026-01-15.md](DESKTOP-UX-AUDIT-2026-01-15.md) | Dated audit | Move into audits | [docs/audit/product](docs/audit/product) |
| [LAYOUT-ARCHITECTURE-AUDIT.md](LAYOUT-ARCHITECTURE-AUDIT.md) | Dated audit | Archive after refactor completion | [docs/archive](docs/archive) |
| [REFACTOR-LAYOUT-ARCHITECTURE.md](REFACTOR-LAYOUT-ARCHITECTURE.md) | Large refactor plan | Archive if phases are complete; otherwise move under docs/guides or codex | [docs/archive](docs/archive) or [codex](codex) |
| [PLAN-drawer-system.md](PLAN-drawer-system.md) | Large plan, mixed status | If active, move under docs/guides or codex; otherwise archive | [docs/archive](docs/archive) or [codex](codex) |
| [PLAN-replace-main-with-demo.md](PLAN-replace-main-with-demo.md) | Specific plan | If not in TODO, archive; otherwise move under codex | [docs/archive](docs/archive) or [codex](codex) |
| [supabase_audit.md](supabase_audit.md) | Dated audit (2026-01-10) | Archive, superseded by [codex/supabase-audit-2026-01-17.md](codex/supabase-audit-2026-01-17.md) | [docs/archive](docs/archive) |
| [supabase_tasks.md](supabase_tasks.md) | Pointer doc | Keep as pointer; avoid adding new references | — |
| [TASK-enable-leaked-password-protection.md](TASK-enable-leaked-password-protection.md) | Active task | Move under a tasks area to reduce root clutter | docs/launch or docs/archive/tasks |
| [TASK-fix-chat-mobile-scroll-and-avatars.md](TASK-fix-chat-mobile-scroll-and-avatars.md) | Active task | Move under a tasks area to reduce root clutter | docs/launch or docs/archive/tasks |
| [TASK-improve-mobile-touch-targets.md](TASK-improve-mobile-touch-targets.md) | Planning doc | Consolidate with [TASK-mobile-touch-target-refactor.md](TASK-mobile-touch-target-refactor.md) and archive one | docs/archive/tasks |
| [TASK-mobile-touch-target-refactor.md](TASK-mobile-touch-target-refactor.md) | In-progress task | Keep as the active one; archive the other | docs/archive/tasks |
| [TREIDO-UI-REFACTOR-PLAN.md](TREIDO-UI-REFACTOR-PLAN.md) | Pointer doc | Keep as pointer to canonical docs | — |
| [AGENT-ORCHESTRATION.md](AGENT-ORCHESTRATION.md) | Execution plan | Keep if still used; otherwise archive | [docs/archive](docs/archive) |
| [tasks.md](tasks.md) | Pointer doc | Keep as pointer; avoid adding new references | — |
| [temp_log_entry.md](temp_log_entry.md) | Temporary log | Delete or move to cleanup | [cleanup](cleanup) |
| [temp_search_overlay.txt](temp_search_overlay.txt) | Scratch code dump | Delete or move to cleanup | [cleanup](cleanup) |
| [duplicate-hashes.txt](duplicate-hashes.txt) | One-off asset note | Move to cleanup or archive after use | [cleanup](cleanup) |

## GPT+OPUS Consolidation Targets (per docs-site plan)

| Source | Recommendation | Target |
|---|---|---|
| [GPT+OPUS/decisions](GPT+OPUS/decisions) | Migrate finalized DEC docs to docs-site business decisions | docs-site/content/business/decisions |
| [GPT+OPUS/specs](GPT+OPUS/specs) | Migrate PRDs/specs to docs-site business specs | docs-site/content/business/specs |
| [GPT+OPUS/audits](GPT+OPUS/audits) | Move only active ops audits to docs-site ops; archive the rest | docs-site/content/business/ops or [docs/archive](docs/archive) |
| [GPT+OPUS/conversations](GPT+OPUS/conversations) | Keep as internal archive | — |

## Redundancy Highlights

1. Supabase audits overlap:
   - [supabase_audit.md](supabase_audit.md) is older and largely superseded by [codex/supabase-audit-2026-01-17.md](codex/supabase-audit-2026-01-17.md) and [supabase_tasks.md](supabase_tasks.md). Archive the older audit.
2. Touch target plans overlap:
   - [TASK-improve-mobile-touch-targets.md](TASK-improve-mobile-touch-targets.md) and [TASK-mobile-touch-target-refactor.md](TASK-mobile-touch-target-refactor.md) cover the same territory with different status notes. Keep the active one only.
3. Layout refactor duplication:
   - [LAYOUT-ARCHITECTURE-AUDIT.md](LAYOUT-ARCHITECTURE-AUDIT.md) and [REFACTOR-LAYOUT-ARCHITECTURE.md](REFACTOR-LAYOUT-ARCHITECTURE.md) overlap. Keep a single active plan; archive the rest.
4. Production workflow pointers:
   - [tasks.md](tasks.md), [supabase_tasks.md](supabase_tasks.md), and [docs/PRODUCTION-WORKFLOW-GUIDE.md](docs/PRODUCTION-WORKFLOW-GUIDE.md) are pointer docs. Keep but avoid adding new references.

## Consolidation Plan (No Code Changes)

### Phase 0 — Decide Canonical Locations
- Keep [docs](docs) as canonical for engineering/design/production.
- Keep [docs-site](docs-site) as business/product publication target per [docs-site/DOCS_CONSOLIDATION_PLAN.md](docs-site/DOCS_CONSOLIDATION_PLAN.md).

### Phase 1 — Move Root Audits/Plans Out of Root
- Move dated audits to [docs/audit](docs/audit) or [docs/archive](docs/archive).
- Move active task docs into a single tasks area (docs/launch or docs/archive/tasks).
- Delete or archive temp scratch files.

### Phase 2 — GPT+OPUS Content Migration
- Promote decisions/specs into docs-site business sections.
- Keep conversations as archive (internal).

### Phase 3 — Report Hygiene
- Move generated reports (knip, folder inventory) to cleanup or archive unless explicitly referenced by [codex/MASTER-PLAN.md](codex/MASTER-PLAN.md).

## Quick Wins (Lowest Risk)

1. Archive [temp_log_entry.md](temp_log_entry.md) and [temp_search_overlay.txt](temp_search_overlay.txt).
2. Archive [AUDIT-desktop-touch-targets.md](AUDIT-desktop-touch-targets.md) and [DESKTOP-UX-AUDIT-2026-01-15.md](DESKTOP-UX-AUDIT-2026-01-15.md) under [docs/audit](docs/audit).
3. Pick a single canonical touch-target task doc and archive the duplicate.
4. Archive [supabase_audit.md](supabase_audit.md) after confirming [codex/supabase-audit-2026-01-17.md](codex/supabase-audit-2026-01-17.md) is the latest.

## Notes

- No code or content edits are performed here; this report is planning-only as requested.
- If desired, I can apply the moves/deletes in a follow-up batch.