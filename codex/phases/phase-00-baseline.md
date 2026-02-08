# Phase 00 - Baseline and Control Plane

## Objective

Establish execution SSOT files and capture a verified starting baseline before refactor mutations.

## Context7 docs used (date + links)

- Date: 2026-02-07
- Next.js 16 cache/revalidation:  
  https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/01-getting-started/09-caching-and-revalidating.mdx
- Supabase SSR design:  
  https://github.com/supabase/ssr/blob/main/docs/design.md

## Checklist

- [x] Create master plan and phase tracking files in `codex/`.
- [x] Capture baseline repo metrics (files/routes/client markers).
- [x] Run baseline verification gates.
- [x] Mark legacy `codex/*.md` task playbooks as input references only.

## Files touched

- `codex/master-refactor-plan.md`
- `codex/phases/phase-00-baseline.md`
- `codex/phases/phase-01-nextjs-runtime.md`
- `codex/phases/phase-02-data-api.md`
- `codex/phases/phase-03-components-styling.md`
- `codex/phases/phase-04-i18n-typescript.md`
- `codex/phases/phase-05-tooling-docs-deps.md`
- `codex/phases/phase-06-release-hardening.md`

## Verification output

- `pnpm -s typecheck`: pass
- `pnpm -s lint`: pass (warnings only)
- `pnpm -s styles:gate`: pass
- `pnpm -s test:unit`: pass
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`: pass (22 passed, 1 skipped)
- `pnpm -s knip`: fail (2 unused files, 1 unused dependency)
- `pnpm -s dupes`: pass with clone findings (279 clone groups)

## Baseline snapshot

- Runtime file surface:
  - `app`: 438 files
  - `components`: 302 files
  - `lib`: 74 files
  - `hooks`: 16 files
- Routes:
  - `page.tsx` under `app/[locale]`: 92
  - `layout.tsx` under `app/[locale]`: 17
  - `app/api/**/route.ts`: 47
- Complexity signals:
  - `"use client"` markers: 357
  - `generateStaticParams` occurrences under `app/[locale]`: 37
  - repeated locale static params pattern: 29
  - direct locale literal checks (`locale === "bg"/"en"`): 973

## Decision log

- Behavior-safe mode enforced.
- One phase per run/chat enforced.
- No delegated workers.
- Full verification gates required per phase.

## Done

- [x] Phase 00 complete
