# AGENTS.md — Business Context Contract

> Archive-only strategy context. Not part of default implementation SSOT.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Monthly + whenever business strategy shifts |

## Purpose

`context/business/**` stores roadmap, monetization, investor, and operational strategy documents.
This tree is being prepared for migration to Google Drive.

## Usage Rules

- Load this tree only when the task explicitly requires business-planning context.
- Do not treat this tree as authoritative for runtime behavior, schema, or API implementation.
- No new long-form docs should be added here during migration prep.
- Core implementation SSOT remains: `AGENTS.md`, `ARCHITECTURE.md`, and `docs/**`.

## Drive Handoff

- Migration checklist and ownership are tracked in `context/business/DRIVE-HANDOFF.md`.
- When moved to Drive, keep only a short pointer here.

## Preferred Entry Points

- `context/business/index.mdx`
- `context/business/roadmap.mdx`
- `context/business/monetization.mdx`
- `context/business/specs/index.mdx`
- `context/business/ops/index.mdx`
- `context/business/investors/index.mdx`

*Last updated: 2026-02-13*
