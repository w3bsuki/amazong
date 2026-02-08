# Treido Production Refactor Master Plan

Last updated: 2026-02-07
Owner: single-agent execution (no subagents)

## Objective

Behavior-safe, production-first refactor to reduce complexity and bloat while preserving launch-critical behavior.

## Guardrails

- No feature additions during refactor phases.
- No uncontrolled route removals; keep compatibility redirects when needed.
- No DB schema, RLS, auth, or payment behavior changes without explicit human alignment.
- Every phase closes with full gates:
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
  - `pnpm -s test:unit`
  - `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

## Context7 Sources (Pinned)

- Next.js 16 caching/revalidation:
  - https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/01-getting-started/09-caching-and-revalidating.mdx
  - https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/03-api-reference/04-functions/revalidateTag.mdx
  - https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/03-api-reference/04-functions/revalidatePath.mdx
- Next.js ISR:
  - https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/02-guides/incremental-static-regeneration.mdx
- Tailwind v4:
  - https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/functions-and-directives.mdx
  - https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/theme.mdx
- Supabase SSR:
  - https://github.com/supabase/ssr/blob/main/docs/design.md

## Phase Status

- [x] Phase 00: Baseline and control plane (`codex/phases/phase-00-baseline.md`)
- [x] Phase 01: Next.js runtime and cache simplification (`codex/phases/phase-01-nextjs-runtime.md`)
- [x] Phase 02: Data layer and API consolidation (`codex/phases/phase-02-data-api.md`)
- [x] Phase 03: Components and styling cleanup (`codex/phases/phase-03-components-styling.md`)
- [x] Phase 04: i18n and TypeScript hardening (`codex/phases/phase-04-i18n-typescript.md`)
- [x] Phase 05: Tooling/docs/dependency prune (`codex/phases/phase-05-tooling-docs-deps.md`)
- [x] Phase 06: Release hardening (`codex/phases/phase-06-release-hardening.md`)

Phase 02 note: complete (batch 1 + batch 2 route-usage compatibility audit + additive response-envelope normalization), logged in `codex/phases/phase-02-data-api.md`.

## Final Verification Snapshot

- `pnpm -s typecheck` -> pass
- `pnpm -s lint` -> pass (0 errors, 343 warnings)
- `pnpm -s styles:gate` -> pass
- `pnpm -s test:unit` -> pass (29 files, 405 tests)
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` -> pass (22 passed, 2 skipped)
- `pnpm -s knip` -> pass (0 unused files, 0 unused exports)
- `pnpm -s dupes` -> pass (265 clone groups, 2.99% duplicated lines)
- `node scripts/ts-safety-gate.mjs` -> pass (0 findings)
- `pnpm -s docs:check` -> pass

## Final Delta Metrics

- Story files: `52 -> 0`
- Current knip findings: `0` unused files, `0` unused exports
- Current clone groups (`dupes`): `265`
- TS safety findings: `0`
- Working tree delta (this execution baseline): `96 files changed, +355 / -6185`

## Legacy Playbook Notice

Existing `codex/*.md` task playbooks are now **input references only**.
Execution and completion status are tracked only in this file and `codex/phases/*.md`.
