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
- [ ] Phase 03: Components and styling cleanup (`codex/phases/phase-03-components-styling.md`)
- [ ] Phase 04: i18n and TypeScript hardening (`codex/phases/phase-04-i18n-typescript.md`)
- [ ] Phase 05: Tooling/docs/dependency prune (`codex/phases/phase-05-tooling-docs-deps.md`)
- [ ] Phase 06: Release hardening (`codex/phases/phase-06-release-hardening.md`)

Phase 02 note: complete (batch 1 + batch 2 route-usage compatibility audit + additive response-envelope normalization), logged in `codex/phases/phase-02-data-api.md`.

## Legacy Playbook Notice

Existing `codex/*.md` task playbooks are now **input references only**.
Execution and completion status are tracked only in this file and `codex/phases/*.md`.
