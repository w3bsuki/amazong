# Testing Guide

The goal is to keep a small set of reliable “gates” that catch regressions early.

## Commands (canonical)

- Dev server: `pnpm dev`
- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- Unit tests: `pnpm test:unit`
- E2E smoke: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- Full E2E: `REUSE_EXISTING_SERVER=true pnpm test:e2e`
- Build: `pnpm build`
 - Show Playwright report: `pnpm exec playwright show-report playwright-report`

## When to run what

- Any non-trivial change: typecheck + E2E smoke.
- Touching data fetching / caching / middleware: add unit tests (if applicable) + verify key routes manually.
- Touching auth/checkout/seller flows: run the relevant Playwright spec(s) (not just smoke).

## Playwright workflow

- If `REUSE_EXISTING_SERVER=true`, start `pnpm dev` first (or reuse an already-running server).
- Smoke suite is the default “is the app alive?” gate.

Debug tips:

- Re-run a single test: `pnpm exec playwright test e2e/smoke.spec.ts -g \"homepage loads\" --project=chromium`
- Use traces/screenshots from `test-results/` and `playwright-report/` when something flakes.

## E2E-only UI behavior

Some UI is intentionally disabled in E2E to avoid blocking tests (example: cookie consent).
Search for `NEXT_PUBLIC_E2E` usage if a UI element seems “missing” during E2E.
