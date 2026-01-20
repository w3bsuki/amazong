# Root Misc Audit — January 19, 2026

Scope: root-level misc files not covered elsewhere. No code changes. This report identifies stale/overlapping items and suggests cleanup actions.

## Inventory (observed)

- proxy.ts
  - Next.js 16 proxy middleware replacement. No action items present; referenced in deployment checklist.
- tasks.md
  - Minimal production execution checklist referenced by docs/PRODUCTION.md.
- TODO.md
  - Primary task tracker; contains launch status and long historical changelog.
- temp_search_overlay.txt
  - Full React component source pasted into a temp file.
- temp_log_entry.md
  - A one-off task log (arbitrary value cleanup).
- duplicate-hashes.txt
  - Duplicate asset hash report for five category images.
- supabase_audit.md
  - January 10 audit with findings and proposed migrations.
- supabase_tasks.md
  - January 15 production status showing migrations applied and advisors resolved.
- AGENT-ORCHESTRATION.md
  - “Execution Guide” with launch phases marked complete.
- agents.md
  - Agent workflow + rails (duplicated in repository root and attachment).

## Overlaps & Obsolete/Resolved Items

### Supabase docs overlap
- supabase_audit.md vs supabase_tasks.md
  - supabase_audit.md captures issues and proposed fixes.
  - supabase_tasks.md reports those fixes as applied and advisors clean (2026-01-15).
  - Status: the audit’s critical fixes appear resolved; the audit doc now functions as historical evidence.
  - Action: move supabase_audit.md to an archive section or add a “Resolved / historical” banner at top.

### Launch status overlap
- AGENT-ORCHESTRATION.md states “ALL LAUNCH PHASES COMPLETE.”
- TODO.md still lists multiple “Open (Other)” tasks.
  - Some are true post-launch items (e.g., “auto-pick free port,” palette scan false positives).
  - Some are already resolved or tracked elsewhere (Supabase leaked password protection is a dashboard toggle noted in TASK-enable-leaked-password-protection.md).
  - Action: split TODO.md into “Post-launch backlog” vs “Launch complete” and remove already-resolved items.

### Agent guidance duplication
- agents.md repeats stack, commands, rails found in other docs.
  - AGENT-ORCHESTRATION.md and TODO.md already reference launch plan docs.
  - Action: keep agents.md as canonical quick-start; reduce other root docs to references to avoid drift.

### temp_* files are orphaned
- temp_search_overlay.txt is a full component (likely a scratch draft).
- temp_log_entry.md is a one-off log for a completed task.
  - Action: either delete or move into codex/ or docs/notes/ with a timestamped name if you want to preserve context.

### duplicate-hashes.txt is stale unless acted on
- Report lists five category images sharing a hash.
  - Action: if duplicates were consolidated already, archive/delete. If not, create a cleanup task and link it from TODO.md.

## Specific obsolete or redundant tasks

- TODO.md “Supabase: resolve Security advisor warning (leaked password protection)”
  - supabase_tasks.md says security warnings are zero and leaked password protection is explicitly accepted as dashboard-only toggle.
  - Status: not a code task; keep only as a deployment checklist item.
  - Action: remove from TODO “Open (Other)” or move to deployment checklist.

- TODO.md “Supabase: review Performance advisors (unused indexes)”
  - supabase_tasks.md already notes INFO-level unused indexes and recommends keep.
  - Action: mark as “defer/post-launch review” or remove if not planning action.

- TODO.md “Tooling: reduce Tailwind palette/gradient scan false positives”
  - TODO.md indicates gradients = 0 and palette violations are intentional. This task can be moved to a tooling backlog.

## Recommendations (no code changes)

1) Create a short “Root Docs Index” in codex/ that declares canonical sources:
   - Agents guide → agents.md
   - Execution plan → docs/launch/PLAN.md
   - Production checklist → docs/PRODUCTION.md
   - Supabase status → supabase_tasks.md

2) Archive historical state documents:
   - Move supabase_audit.md to codex/audits/ with a “Resolved” banner.
   - Move temp_* files to codex/notes/ or delete.

3) Trim TODO.md:
   - Remove launch-complete sections or move them to codex/history/.
   - Keep a short “Active backlog” at top to prevent conflicts with AGENT-ORCHESTRATION.md.

## Suggested cleanup checklist (manual)

- [ ] Add “Resolved/historical” banner to supabase_audit.md or move to codex/audits/.
- [ ] Move temp_search_overlay.txt + temp_log_entry.md to codex/notes/ or delete.
- [ ] Decide whether duplicate-hashes.txt is actionable; create a cleanup task or archive it.
- [ ] Collapse TODO.md into “Active Backlog” + “Completed History (archive).”
- [ ] Ensure AGENT-ORCHESTRATION.md only links to canonical docs, not tasks list.
