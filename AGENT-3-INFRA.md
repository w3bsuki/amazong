# AGENT 3: Infrastructure/DevOps (Opus 4.5)

> Terminal 3 — Testing, Config, Production Readiness

## Quick Start Prompt
```
Read these files in order, then execute the tasks:
1. agents.md (repo rules)
2. docs/GPTVSOPUSFINAL.md (workflow)
3. docs/PRODUCTION.md (launch checklist)
4. TASK-e2e-auto-pick-free-port.md (active task)
5. TODO.md (open items)

Execute infrastructure tasks. Ensure CI/gates are green. No new dependencies.
```

---

## Mission
Ship infrastructure/tooling fixes that unblock production launch. Focus on:
1. E2E test reliability (auto-pick free port)
2. Build/deploy configuration
3. Middleware optimization
4. CI gates green

## Context Files to Read
- `agents.md` — non-negotiable rails
- `docs/ENGINEERING.md` — stack rules
- `docs/GPTVSOPUSFINAL.md` — workflow
- `docs/PRODUCTION.md` — launch checklist
- `TASK-e2e-auto-pick-free-port.md` — active work
- `TODO.md` — open items

## P0 Execution Queue

### Task 1: E2E Auto-Pick Free Port
**Files:** `playwright.config.ts`, optionally `scripts/run-playwright.mjs`

**Problem:** E2E fails when port 3000 is busy and `REUSE_EXISTING_SERVER=false`.

**Done when:**
- Playwright auto-picks free port when 3000 is occupied
- `BASE_URL` explicit override still works
- `REUSE_EXISTING_SERVER=true` behavior unchanged
- Gates pass

### Task 2: Middleware Optimization
**Files:** `middleware.entry.ts`

**Problem:** Middleware runs on every request including static assets (Vercel cost).

**Done when:**
- Matchers skip `_next/static`, `_next/image`, file assets
- Auth checks run only for protected routes
- No behavior change for actual page requests

### Task 3: Tailwind Scan False Positives
**Files:** `scripts/scan-tailwind-palette.mjs`

**Problem:** Palette/gradient scanner has false positives.

**Done when:**
- Scanner correctly ignores allowed patterns
- `cleanup/palette-scan-report.txt` has fewer noise entries
- No actual violations missed

### Task 4: Build Verification
**Command:** `pnpm build`

**Done when:**
- Production build completes without errors
- No new warnings in build output
- ISR/SSG pages generated correctly

### Task 5: Production Checklist Audit
**File:** `docs/PRODUCTION.md`

**Done when:**
- All "Green gates" items verified
- Environment variable checklist documented
- DNS/TLS requirements noted

## Gates (run after EVERY change)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Full Verification (before declaring done)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
pnpm build
```

## Rules (from agents.md)
- No new dependencies unless clearly justified
- Prefer Node built-ins (e.g., `net` module for port finding)
- Keep config changes minimal and backward-compatible
- Document any new behavior

## Key Files Reference
- `playwright.config.ts` — E2E configuration
- `next.config.ts` — Next.js config (cacheComponents, cacheLife profiles)
- `middleware.entry.ts` — request middleware
- `scripts/` — tooling scripts
- `e2e/` — Playwright tests

## Handoff Format
After each task, update the TASK file with:
```markdown
## Handoff (Opus)
Files changed:
- `playwright.config.ts` — added port auto-detection logic

How to verify:
- Kill any process on 3000
- Run `pnpm test:e2e:smoke` with `REUSE_EXISTING_SERVER=false`
- Verify test passes on different port

Gates output:
✓ tsc: 0 errors
✓ e2e:smoke: 15/15 passed

Questions:
- Should we add port info to test output?
```

## Production Readiness Checklist
From `docs/PRODUCTION.md`:
- [ ] Stripe products/prices created
- [ ] Webhook endpoint configured
- [ ] Environment variables set in Vercel
- [ ] DNS + TLS verified
- [ ] Auth redirect URLs correct
- [ ] `pnpm build` passes
- [ ] E2E smoke green
- [ ] Manual acceptance (home, search, product, signup, checkout)

---

## Copy-Paste Start Command
```
I'm the Infrastructure agent. Reading:
- agents.md
- docs/GPTVSOPUSFINAL.md
- docs/PRODUCTION.md
- TASK-e2e-auto-pick-free-port.md
- TODO.md

Starting with Task 1: E2E auto-pick free port implementation.
```
