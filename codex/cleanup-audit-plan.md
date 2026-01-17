# Codebase Cleanup Audit Plan (100% Inventory)

Goal: enumerate every folder in the repo, classify every file as **Keep / Delete / Archive / Unknown**, and produce per-folder audit reports in /codex. This plan prioritizes production readiness and a safe deletion path.

## Phase 0 — Inventory (done)
- Inventory file: codex/folder-inventory.md (source of truth for every folder)

## Phase 1 — Automated Signals (baseline)
Run and capture tool output for audit evidence:
- `pnpm -s exec knip --reporter markdown` → codex/knip-report.md (already generated)
- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `pnpm -s lint`
- `pnpm test:unit`
- `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (or run smoke once after deletions)

### Planned/Keep Exceptions
Do not delete planned dependencies even if marked unused:
- @capacitor/android
- @capacitor/core

## Phase 2 — Subagent Folder Audits (must cover every folder)
Use folder-inventory to guarantee coverage. Each report must:
- list folders/files reviewed
- list **suspected unused** items with evidence (no references, generated artifacts, build outputs)
- list **risky deletions** (migrations, production docs, live routes)
- list **quick wins** (generated artifacts, duplicates)
- include a **delete checklist** ordered for safe removal

Reports are stored in /codex as:
- codex/audit-app-components.md
- codex/audit-tests-supabase-scripts.md
- codex/audit-docs-and-misc.md
- codex/audit-infra-and-root.md

## Phase 3 — Evidence-Backed Deletion
For each candidate:
1) Confirm no runtime references (rg/grep + build logs)
2) Confirm not required by tests or docs generation
3) Remove files
4) Re-run typecheck + smoke
5) Re-run knip and compare

## Phase 4 — Production Readiness Gate
All gates must pass:
- Typecheck
- Lint
- Unit tests
- E2E smoke
- Build (pnpm -s build)

## Phase 5 — Final Report
Summarize deletions, remaining unknowns, and new baseline metrics in codex/final_audit.md.
