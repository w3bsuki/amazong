# Testing Guide (Canonical)

This is the canonical reference for verification gates, unit tests, and Playwright E2E.

---

## Required gates

Every non-trivial change MUST pass:

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

Notes:
- With `REUSE_EXISTING_SERVER=true`, run `pnpm dev` first (the Playwright runner will auto-detect the port).
- Without it, Playwright starts its own web server (slower, but self-contained).

---

## Unit tests (Vitest)

```bash
pnpm test:unit
```

---

## E2E tests (Playwright)

```bash
# Smoke only (critical path)
pnpm test:e2e:smoke

# Full E2E suite
pnpm test:e2e

# Specific spec
pnpm -s exec playwright test e2e/auth.spec.ts --project=chromium
```

---

## Common debugging

```bash
# Headed (visual)
pnpm -s exec playwright test e2e/smoke.spec.ts --headed

# UI mode (debugger)
pnpm -s exec playwright test e2e/smoke.spec.ts --ui

# Show HTML report
pnpm exec playwright show-report playwright-report
```

