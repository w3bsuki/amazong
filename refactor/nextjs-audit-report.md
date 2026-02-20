# Next.js Audit + Refactor — Report

Completed: 2026-02-19

## Metrics: Before → After

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Source files | 937 | 937 | 0 |
| LOC (source) | ~131K | 128,869 | -~2K |
| `"use client"` directives | 216 | 214 | -2 |
| `"use cache"` (files) | 11 | 12 | +1 |
| >300L files | 93 | 88 | -5 |
| <50L files | 248 | 252 | +4 |
| Route handlers | 47 | 47 | 0 |
| Loading files | 88 | 88 | 0 |
| Pages missing metadata | 0 | 0 | 0 |
| Pages missing loading.tsx | 0 | 0 | 0 |
| Wrong import (`next/link`) | 0 | 0 | 0 |
| Barrel `index.ts(x)` (re-export) | 6 | 6 | 0 |

Notes:
- **After numbers** gathered on 2026-02-19 via `pnpm -s architecture:scan` plus local scans over `app/`, `components/`, `lib/`, `hooks/`.
- `"use cache"` is counted as **files containing a standalone** `("use cache" | 'use cache')` directive line (function directive prologue).
- Barrel `index.ts(x)` is counted as `index.ts` / `index.tsx` files that contain re-export statements like `export … from "…"`.

## Changes Made

### Import & routing alignment
- Replaced several barrel imports with direct file imports (tree-shaking friendly) in header, drawers, dropdowns, and category navigation.
- Updated onboarding flow navigation to use `@/i18n/routing` where applicable and normalized client pushes/replaces to avoid double locale prefixing.

### Loading boundary deduplication
- Added `components/shared/loading/simple-page-loading.tsx` and refactored many identical `loading.tsx` files to render the shared skeleton component (keeps route-level loading boundaries intact).

### Client boundary reductions (safe removals)
- Reduced `"use client"` directives where safe, keeping components client-only when required for prerender correctness (e.g. current time usage).

## What Was NOT Changed (and why)

- **Auth/session logic, DB/RLS/migrations, payments/webhooks:** explicitly out of scope for this task and requires human approval per `AGENTS.md`.
- **`components/providers/auth-state-manager.tsx`:** explicitly excluded by `refactor/shared-rules.md`.
- **Barrel file deletions:** usage was reduced, but files were not deleted (destructive) without a dedicated grep-verified cleanup pass.
- **Route handlers → server actions:** not attempted; requires validating external callers and behavior guarantees.

## Recommendations for Future Work

- Delete now-unused barrel `index.ts(x)` files after `rg` confirms zero imports (safe tree-shaking improvement).
- Continue `"use client"` reduction with split-island refactors where only a small part needs interactivity.
- Audit `<img>` usage and convert key LCP images to `next/image` where appropriate (performance).

## Verification

- `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit` (PASS)
- `pnpm -s architecture:scan` (PASS)
