# Playwright Guide (This Repo)

## Key behavior in this repo

- Tests live under `e2e/`.
- Playwright projects are defined in [../playwright.config.ts](../playwright.config.ts).
- By default, Playwright will start a Next.js server via `webServer`.
- **If you want multiple terminals running tests in parallel, reuse one server**:
  - Start the server once.
  - Then run all Playwright commands with `REUSE_EXISTING_SERVER=true`.

## Projects you can target

From `playwright.config.ts`:

- Desktop: `chromium`, `firefox`, `webkit`
- Mobile: `mobile-chrome`, `mobile-safari`
- A11y: `accessibility` (only runs `e2e/accessibility.spec.ts`)

Run one project:

- `pnpm -s exec playwright test --project=chromium`

## Reusing a single dev server (recommended for 3–5 terminals)

PowerShell (recommended):

- Start server (Terminal 1):
  - `$env:NEXT_PUBLIC_E2E='true'; $env:PORT='3000'; pnpm dev`
- Run tests (other terminals):
  - `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm -s exec playwright test --project=chromium`

Notes:

- The Playwright config warns reuse can be flaky *if* the existing server wasn’t started with `NEXT_PUBLIC_E2E=true`. That’s why Terminal 1 sets it.

## Sharding (split one large run into N terminals)

If you want “one full run split into 5 pieces”, use sharding:

- Terminal 2: `pnpm -s exec playwright test --project=chromium --shard=1/5`
- Terminal 3: `pnpm -s exec playwright test --project=chromium --shard=2/5`
- Terminal 4: `pnpm -s exec playwright test --project=chromium --shard=3/5`
- Terminal 5: `pnpm -s exec playwright test --project=chromium --shard=4/5`
- (run `--shard=5/5` after one finishes)

Always combine sharding with `REUSE_EXISTING_SERVER=true` locally.

## File-level splitting (simple + reliable)

This repo already has spec files you can run independently:

- `e2e/auth.spec.ts`
- `e2e/full-flow.spec.ts`
- `e2e/orders.spec.ts`
- `e2e/profile.spec.ts`
- `e2e/smoke.spec.ts`
- `e2e/accessibility.spec.ts` (a11y)

Example:

- `pnpm -s exec playwright test e2e/auth.spec.ts e2e/profile.spec.ts --project=chromium`

## Production-mode testing

Run against a production build:

- `TEST_PROD=true pnpm test:e2e`

This uses `pnpm build && pnpm start` under the hood (see `webServer.command`).

Launch-eve recommendation:

- Run fast iteration checks against dev (split across terminals).
- Then run **one** production-mode pass (not sharded) for final confidence.
