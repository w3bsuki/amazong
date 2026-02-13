# EP-003: Full Codebase Cleanup & Production Polish

| Field | Value |
|-------|-------|
| Status | Active |
| Owner | treido-orchestrator |
| Created | 2026-02-13 |
| Target | Production launch |
| Risk | Medium |

## Goal

Systematic folder-by-folder audit, cleanup, and UI/UX polish of the entire codebase to reach launch-ready quality. Each zone is handled in a single Codex CLI session using subagents.

## Scope

All application code: `components/`, `app/[locale]/`, `hooks/`, `lib/`, global files.

## Non-Goals

- Database schema, migrations, or RLS changes
- Auth/session/access control logic changes
- Payment/webhook/billing logic changes
- API contract or server action signature changes
- Route group restructuring
- i18n message key removal (adding is fine)

## Progress Tracker

See `.codex/REFACTOR-TRACKER.md` for live zone-by-zone status.

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-13 | Split into 12 zones with individual Codex prompts | Each zone fits in a single Codex session; prevents context overflow |
| 2026-02-13 | Use `.codex/prompts/` for per-zone prompts | Codex CLI reads from .codex; keeps prompts versioned |
| 2026-02-13 | Track in `.codex/REFACTOR-TRACKER.md` not TASKS.md | TASKS.md has 20-item cap; refactor needs 12+ zones |

## Outcome

Completed 2026-02-13. All 12 zones swept (208 files changed). All gates pass.
See `.codex/REFACTOR-TRACKER.md` for full zone-by-zone log.
Successor: **EP-004** (tech-stack-level deep audit) in `docs/exec-plans/active/EP-004-production-cleanup-phases.md`.
