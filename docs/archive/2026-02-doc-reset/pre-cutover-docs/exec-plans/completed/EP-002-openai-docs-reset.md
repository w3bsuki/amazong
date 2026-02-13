# EP-002: OpenAI-Style Docs Reset (Hard Cutover + Archive)

| Field | Value |
|-------|-------|
| Status | Completed |
| Owner | treido-orchestrator |
| Created | 2026-02-12 |
| Completed | 2026-02-12 |
| Risk | Low (docs + tooling only) |

## Goal

Reset Treido documentation into a cleaner OpenAI-style harness structure while preserving required product and strategy context.

## Scope

- Root docs contracts: `AGENTS.md`, `ARCHITECTURE.md`, `README.md`
- Canonical docs tree updates in `docs/**`
- Business context move to `context/business/**`
- Docs tooling updates in `scripts/docs-*.mjs`
- Docs site sync behavior (`docs-site/**` generated mirror)

## Outcome

- Moved legacy architecture doc path to root `ARCHITECTURE.md`
- Moved `DESIGN.md` to `docs/DESIGN.md`
- Added canonical hub `docs/INDEX.md`
- Added consolidated `docs/FRONTEND.md`
- Moved business context tree to `context/business/**` and added context-local `AGENTS.md`
- Archived pre-cutover files under `docs/archive/2026-02-12-pre-openai-reset/`
- Updated docs gates/contracts/freshness scripts for new paths and context split
- Updated core cross-links and business references
- Marked docs IA debt resolved in tracker

## Follow-ups

- Continue date metadata backfill across remaining undated docs.
- Keep `AGENTS.md` short; move detailed policy text into focused docs pages.

*Last updated: 2026-02-12*
