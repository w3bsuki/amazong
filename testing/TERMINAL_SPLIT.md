# Terminal Split (Desktop + Mobile + A11y + Critical Flows)

Goal: run **everything important** in parallel without starting 5 competing Next servers.

---

## Copy/paste “Agent prompts” (recommended)

If you’re running multiple Copilot/AI agents in parallel, copy/paste one prompt per terminal/session.

Important rules:

- **Only Agent 1 starts the Next server.**
- All other agents must set `REUSE_EXISTING_SERVER=true`.
- All agents must report:
  - pass/fail
  - first failing test name
  - where the HTML report was written (`playwright-report-*`)
  - any obvious console errors / UX blockers they noticed

### You (human) start the server (recommended)

If you’re already running the server on your PC, agents can just reuse it.

PowerShell (Terminal you control):

- `cd J:\amazong`
- `$env:NEXT_PUBLIC_E2E='true'; $env:PORT='3000'; pnpm dev`

Verify:

- Open `http://localhost:3000/robots.txt` and confirm 2xx.

If you use a different port, tell agents the correct `BASE_URL`.

### Agent 1 — UI/UX audit via browser automation (Playwright MCP)

COPY/PASTE THIS PROMPT:

---
You are Agent 1 (UI/UX Auditor). The server is already running on my machine.

Goal:
- Do a fast but deep UI/UX + styling + contrast + interaction audit on Desktop + Mobile.
- Use **browser automation (Playwright MCP)** to actually render pages and catch runtime/hydration/console errors.
- Produce a short report with screenshots and actionable issues.

Constraints:
- Do NOT start/stop the server.
- Do NOT refactor code; only report issues and suggest file locations when obvious.
- Prefer highest-risk pages and flows first (auth, product, cart/checkout, sell, account/profile).

Target base URL:
- Use BASE_URL = http://localhost:3000 (if I tell you a different port, use that).

Audit actions (required):
1) Visit these pages and wait for them to settle:
   - / (homepage)
   - /en (or default locale root)
   - /en/search (search results page)
   - a representative category page (pick one reachable from homepage)
   - a representative product page (pick one reachable from homepage)
   - /en/auth/sign-up (or the actual sign-up route)
   - /en/auth/sign-in (or the actual sign-in route)
   - /en/sell
   - /en/account (if auth required, note it and stop)
2) For each page:
   - capture **console errors/warnings**
   - take **full-page screenshots** at:
     - Desktop 1280x720
     - Mobile 390x844
   - note layout issues: overflow, clipped CTAs, modals, sticky bars, broken spacing, unreadable text
3) A11y quick checks (manual-style but automated where possible):
   - keyboard tab order in header + primary CTA
   - focus ring visible
   - modal focus trap + Esc close (if modal exists)
   - obvious contrast failures (flag with screenshot)

Deliverable:
- Create a markdown report at `testing/reports/ui-ux-audit.md` with:
  - Summary (P0 blockers / P1 serious / P2 polish)
  - Per-page findings
  - Screenshot filenames and what they show
  - Any console errors (copy text)

If Playwright MCP tools are available in your environment, use them.
If MCP is NOT available, fallback:
- Run headed Playwright for visual confirmation:
  - REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 pnpm -s exec playwright test e2e/smoke.spec.ts --project=chromium --headed
  - and still produce the report (screenshots from the Playwright report).
---

### Optional Agent 0 — Server coordinator (only if you want an agent to do it)

COPY/PASTE THIS PROMPT:

---
You are Agent 0 (Server Coordinator). If the server is already running, do nothing.

Goals:
1) Ensure a Next.js dev server is running in E2E mode.
2) Confirm it is reachable.
3) Communicate the BASE_URL to all other agents.

Commands (PowerShell):
1) cd J:\amazong
2) If the server is NOT running: $env:NEXT_PUBLIC_E2E='true'; $env:PORT='3000'; pnpm dev

Verify:
- Open http://localhost:3000/robots.txt and confirm it returns 2xx.

If port 3000 is busy, choose a new port and tell ALL agents the BASE_URL.
---

### Agent 2 — Desktop E2E (Chromium) (Terminal 2)

COPY/PASTE THIS PROMPT:

---
You are Agent 2 (Desktop E2E). Reuse the existing dev server started by Agent 1.

Goal:
- Validate critical flows on desktop: auth + profile + core navigation.

Commands (PowerShell):
1) cd J:\amazong
2) $env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'
3) pnpm -s exec playwright test --project=chromium

If time-boxed and we need fastest signal first, run:
- pnpm -s exec playwright test e2e/smoke.spec.ts e2e/auth.spec.ts e2e/profile.spec.ts --project=chromium

Report back:
- PASS/FAIL
- First failing test name and error summary
- Report folder name (playwright-report-*)
---

### Agent 3 — Mobile E2E (Android-ish) (Terminal 3)

COPY/PASTE THIS PROMPT:

---
You are Agent 3 (Mobile Chrome E2E). Reuse the existing dev server started by Agent 1.

Goal:
- Validate critical flows on mobile: browse/search/product/cart/checkout/sell as covered by tests.

Commands (PowerShell):
1) cd J:\amazong
2) $env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'
3) pnpm -s exec playwright test --project=mobile-chrome

If we need to prioritize, run:
- pnpm -s exec playwright test e2e/full-flow.spec.ts e2e/orders.spec.ts --project=mobile-chrome

Report back:
- PASS/FAIL
- First failing test name and error summary
- Report folder name (playwright-report-*)
---

### Agent 4 — Mobile E2E (iOS-ish) (Terminal 4)

COPY/PASTE THIS PROMPT:

---
You are Agent 4 (Mobile Safari E2E). Reuse the existing dev server started by Agent 1.

Goal:
- Catch Safari/mobile-specific layout and interaction issues.

Commands (PowerShell):
1) cd J:\amazong
2) $env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'
3) pnpm -s exec playwright test --project=mobile-safari

Report back:
- PASS/FAIL
- First failing test name and error summary
- Report folder name (playwright-report-*)
---

### Agent 5 — Accessibility (axe) (Terminal 5)

COPY/PASTE THIS PROMPT:

---
You are Agent 5 (Accessibility/A11y). Reuse the existing dev server started by Agent 1.

Goal:
- Run the dedicated a11y suite and report any violations as launch blockers.

Commands (PowerShell):
1) cd J:\amazong
2) $env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'
3) pnpm test:a11y

Report back:
- PASS/FAIL
- First failing test + top a11y violations
- Report folder name (playwright-report-*)
---

## Terminal 1 — Start one server (shared)

PowerShell:

- `$env:NEXT_PUBLIC_E2E='true'; $env:PORT='3000'; pnpm dev`

Keep this running.

## Terminal 2 — Desktop E2E (Chromium)

PowerShell:

- `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm -s exec playwright test --project=chromium`

If you only want the fastest signal:

- `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm -s exec playwright test e2e/smoke.spec.ts --project=chromium`

## Terminal 3 — Mobile E2E (Android-ish)

- `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm -s exec playwright test --project=mobile-chrome`

## Terminal 4 — Mobile E2E (iOS-ish)

- `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm -s exec playwright test --project=mobile-safari`

## Terminal 5 — Accessibility (axe)

- `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm test:a11y`

## Optional Terminal 6 — Cross-browser desktop

(Do this after the critical terminals are green.)

- `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm -s exec playwright test --project=firefox`
- `$env:REUSE_EXISTING_SERVER='true'; $env:BASE_URL='http://localhost:3000'; pnpm -s exec playwright test --project=webkit`

---

## Critical flows focus (file split)

If you want each terminal to map to your “top 5 flows” more explicitly:

- Desktop terminal:
  - `pnpm -s exec playwright test e2e/auth.spec.ts e2e/profile.spec.ts e2e/smoke.spec.ts --project=chromium`
- Mobile terminal:
  - `pnpm -s exec playwright test e2e/full-flow.spec.ts e2e/orders.spec.ts --project=mobile-chrome`
- A11y terminal:
  - `pnpm test:a11y`

(Keep `REUSE_EXISTING_SERVER=true` + `BASE_URL=...` set in each terminal.)

---

## After all terminals are green

Final “release confidence” run (single command, no split):

- `pnpm -s lint`
- `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- `TEST_PROD=true pnpm test:e2e`
