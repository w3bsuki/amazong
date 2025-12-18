# Phase 4 — Production Release: QA + Playwright Smoke (Routes, Console Errors, Build/Start Gates)

Purpose: push the project to “ship it” confidence by implementing **repeatable** checks:
- production build is green
- production start is healthy
- critical routes load
- no severe console errors
- basic auth-gated pages behave correctly

This phase is intentionally not “deep E2E of every edge case”. It’s a production smoke harness.

---

## Inputs (existing repo evidence)

- `PRODUCTION_PUSH.md` (has suggested Playwright tests and release cleanup notes)
- `production/FINAL-TASKS.md` and `production/05-TESTING.md` (manual QA list)
- Existing audits in `audit-results/` (screenshots/logs)

Repo reality: there is no Playwright config file currently.

---

## Scope

In scope:
- Add Playwright test infrastructure (minimal).
- Create smoke coverage for critical routes and core UI loading.
- Capture and fail on console errors.
- Run smoke against both `pnpm dev` and `pnpm start`.

Out of scope:
- Full checkout purchase automation through Stripe (use stubs where appropriate).
- Full visual regression suite.

---

## Non‑Negotiable Gates (release blockers)

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` is green
- [ ] `pnpm lint` is green (or known warnings are documented)
- [ ] `pnpm build` is green
- [ ] `pnpm start` serves routes successfully
- [ ] Playwright smoke passes for all critical routes
- [ ] No recurring **console errors** on critical routes

---

## AI Execution Protocol (required)

When executing Phase 4, the agent MUST:

- Keep tests deterministic:
  - No dependency on random DB state unless seeded or asserted loosely.
  - Prefer “page loads and key landmarks exist” over brittle exact text.
- Fail hard on real console errors:
  - ignore known noise only if explicitly documented in this file.
- Treat locale as a first-class concern:
  - test at least `en` and `bg` if both are supported.

---

## Critical Route List (define and lock)

You can adjust the list, but keep it small (6–10).

- [ ] `/en` (homepage)
- [ ] `/en/categories`
- [ ] `/en/search?q=phone`
- [ ] `/en/cart`
- [ ] `/en/account` (auth-gated behavior)
- [ ] `/en/sell` (auth-gated behavior)

Also run one “dynamic content” route:
- [ ] A known product route (choose one stable product slug in your DB)

---

## Work Queue (prioritized)

### P0 — Install Playwright + baseline harness

#### 1) Add Playwright dependency
- [ ] Install: `pnpm add -D @playwright/test`
- [ ] Install browsers: `pnpm exec playwright install`
- Acceptance:
  - `pnpm exec playwright --version` works

#### 2) Add `playwright.config.ts`
- [ ] Create config with:
  - testDir `e2e/`
  - baseURL `http://localhost:3000`
  - webServer integration for `pnpm dev` (and optionally `pnpm start` via separate command)
  - retries enabled for CI only
- Acceptance:
  - `pnpm exec playwright test` starts dev server and runs

#### 3) Add `e2e/smoke.spec.ts` with console error capture
- [ ] Implement a helper that:
  - attaches `page.on('console', ...)`
  - fails on `console.error`
  - optionally fails on `pageerror`
- Acceptance:
  - any real runtime error fails the test

---

### P0 — Route smoke tests (dev)

#### 4) Smoke: homepage + categories
- [ ] Assert page loads and key landmarks exist:
  - header present
  - main present
  - footer present
- Acceptance:
  - no console errors

#### 5) Smoke: search never blank
- [ ] Navigate `/en/search?q=phone`
- [ ] Assert main has content (not empty) and no error boundary is visible
- Acceptance:
  - no “blank main” regressions

#### 6) Smoke: cart page
- [ ] Navigate `/en/cart`
- [ ] Assert it renders a stable empty or filled state
- Acceptance:
  - no crash

#### 7) Smoke: auth-gated pages behave correctly
Because we don’t want to hardcode credentials in tests:
- [ ] Navigate `/en/account` logged-out
- [ ] Assert it either:
  - redirects to login, OR
  - shows a login CTA
- [ ] Same for `/en/sell`
- Acceptance:
  - auth gating is consistent and doesn’t crash

#### 8) Smoke: product page sanity
- [ ] Choose a stable, known product route to test (document it here).
- [ ] Assert product page loads and key sections render.
- Acceptance:
  - no mock data leaks (if mock data removal is done already)

---

### P1 — Run smoke against production build (`pnpm start`)

#### 9) Add a “start-mode” smoke run
Options:
- A) Use Playwright config `webServer.command = 'pnpm start'` and run after `pnpm build`
- B) Create a second config `playwright.start.config.ts`

- [ ] Ensure tests run against `pnpm build` + `pnpm start`
- Acceptance:
  - prod build smoke is green

---

### P1 — Add minimal scripts + documentation

#### 10) Add npm scripts
Add to `package.json` (minimal):
- `test:e2e` → `playwright test`
- `test:e2e:ui` → `playwright test --ui` (optional)

Acceptance:
- `pnpm test:e2e` works locally

#### 11) Document how to run QA
- [ ] Add short section to README or a `production/` doc:
  - `pnpm build && pnpm start`
  - `pnpm test:e2e`

---

## Manual QA Checklist (do once before launch)

- [ ] Desktop (1280px): home, categories, search, product, cart, checkout entry
- [ ] Mobile (375px): same routes, verify tab bar and no layout overflow
- [ ] EN + BG: spot check that major strings are localized (no mixed language)
- [ ] Confirm no “Â©” encoding glitch in footer
- [ ] Confirm currency display is consistent

---

## Phase 4 Completion Criteria

✅ Phase 4 Complete When:

1. [ ] `pnpm build` passes
2. [ ] `pnpm start` serves successfully
3. [ ] Playwright smoke passes for critical routes
4. [ ] No severe console errors on critical routes
5. [ ] Manual QA spot check completed (desktop+mobile)

Blocking issues found:
- 

Non-blocking issues found:
- 

---

## Notes: Known sources of brittleness (avoid in tests)

- Don’t assert exact product names unless you seed them.
- Prefer role/landmark assertions (header/main) + “not error boundary”.
- If a route depends on auth, assert redirect/CTA rather than forcing login.
