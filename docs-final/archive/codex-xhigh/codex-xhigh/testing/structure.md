# Testing — Vitest + Playwright

## What exists
- Unit tests: `__tests__/` (Vitest)
- E2E: `e2e/` (Playwright)

## Gates
Run after changes:
- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Target philosophy
- Smoke stays small and reliable.
- Critical business flows get at least one automated E2E path (auth → listing → chat → review).

