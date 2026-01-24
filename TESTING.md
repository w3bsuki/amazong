# Testing Guide

This is the canonical reference for verification gates, unit tests, and Playwright E2E.

---

## Required Gates

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

## TypeScript Safety Gate (`ts:gate`)

This repo enforces 0 drift for unsafe TypeScript patterns (new `any`, `as any`, non-null assertions, etc.).

```bash
pnpm -s ts:gate
```

Notes:
- Baseline file: `scripts/ts-safety-gate.baseline.json`
- Update baseline only when intentional: `pnpm -s ts:gate:baseline` (prefer fixing patterns in touched files)

---

## Unit Tests (Vitest)

```bash
pnpm test:unit
```

Test files live in `__tests__/` at the repo root.

---

## E2E Tests (Playwright)

```bash
# Smoke only (critical path)
pnpm test:e2e:smoke

# Full E2E suite
pnpm test:e2e

# Specific spec
pnpm -s exec playwright test e2e/auth.spec.ts --project=chromium
```

Test files live in `e2e/`.

---

## Common Debugging

```bash
# Headed (visual)
pnpm -s exec playwright test e2e/smoke.spec.ts --headed

# UI mode (debugger)
pnpm -s exec playwright test e2e/smoke.spec.ts --ui

# Show HTML report
pnpm exec playwright show-report playwright-report
```

---

## Manual Sanity (Quick)

After any meaningful change:
- `/en` and `/bg` load without hydration warnings.
- Core flows still work: auth → browse → PDP → cart → checkout → orders.
- No new gradients or arbitrary Tailwind values were introduced.
