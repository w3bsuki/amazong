# TASK: e2e-auto-pick-free-port

Created: 2026-01-07
Lane: Next.js / Testing
Phase: 2
Status: PENDING

## Objective
Make E2E runs resilient when port 3000 is busy by automatically selecting a free local port when Playwright starts its own Next dev server.

## Context
- Current `playwright.config.ts` derives `baseURL` from `BASE_URL || http://localhost:3000` and uses `webServer.command` with `PORT=${basePort}`.
- If `REUSE_EXISTING_SERVER=false` and port 3000 is occupied, Playwright’s webServer start can fail.

## Tasks
- [ ] Implement “pick free port” logic when all are true:
  - `REUSE_EXISTING_SERVER` resolves to `false`
  - `BASE_URL` is not explicitly set
  - host is local (`localhost`/`127.0.0.1`)
  - Done when: `pnpm -s exec cross-env BASE_URL= pnpm -s exec node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium` works even when 3000 is in use (it chooses another port).

- [ ] Keep explicit overrides working:
  - If `BASE_URL` is set, use it (no auto-pick)
  - If `REUSE_EXISTING_SERVER=true`, do not auto-pick or attempt to start a server
  - Done when: existing tasks that set `BASE_URL=http://localhost:3000` keep working.

- [ ] Add a brief note in config log output so it’s obvious which port/baseURL was used.

## Files to touch (max 3)
- `playwright.config.ts`
- (optional) `scripts/run-playwright.mjs` (only if it simplifies env handling)
- (optional) `WORKFLOW.md` or `e2e/README.md` (if we need to document new behavior)

## Gates
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Review checklist
- [ ] No behavior change when `BASE_URL` is explicitly set
- [ ] No behavior change when `REUSE_EXISTING_SERVER=true`
- [ ] No new dependencies unless clearly justified (prefer Node `net` to find a port)

## Handoff (Opus)
Files changed:
How to verify:
Gates output:
Questions:
