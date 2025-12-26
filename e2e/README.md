# E2E Test Suite (Playwright)

This project uses Playwright for end-to-end testing against **both**:
- **Dev server** (`pnpm dev`) for fast iteration
- **Production build** (`pnpm build` + `pnpm start`) for release confidence

## Key conventions

- Prefer stable selectors via `data-testid` + `page.getByTestId()`.
  - Playwright is configured with `testIdAttribute: 'data-testid'` in `playwright.config.ts`.
- Keep unauthenticated tests deterministic (no DB writes).
- Authenticated tests are **opt-in** and must use explicit credentials via env vars.

## Environment variables

- `BASE_URL` (default: `http://localhost:3000`)
- `TEST_PROD=true` runs against a production build (`pnpm build && pnpm start`)
- `REUSE_EXISTING_SERVER=true` (local only) reuses an already running server
 - `PW_OUTPUT_DIR` overrides Playwright `outputDir` (useful to avoid clobbering artifacts when running multiple suites at once)
 - `PW_HTML_REPORT_DIR` overrides the Playwright HTML report folder

Authenticated suites (opt-in):
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

Authenticated suite implementation:
- Worker-scoped auth uses Playwright `storageState` in [e2e/fixtures/authenticated.ts](e2e/fixtures/authenticated.ts).
- This logs in once per worker, stores state under `<outputDir>/.auth/`, and reuses it for the worker.

## What runs where

- `pnpm test:e2e` runs Chromium E2E tests (excludes `@accessibility`-tagged tests)
- `pnpm test:e2e:all` runs all browsers (excludes `@accessibility`)
- `pnpm test:a11y` runs the dedicated `accessibility` project

## CI / production notes

- In CI, Playwright should install its OS deps (see Next.js guide `/docs/app/guides/testing/playwright`).
- Don’t enable build-time stripping of `data-testid` attributes unless you intentionally scope it.
- If you add DB-seeding later, do it in a worker-scoped fixture so parallel runs don’t collide.
