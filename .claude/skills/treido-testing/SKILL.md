---
name: treido-testing
description: Testing skill for Treido (typecheck, Vitest unit tests, Playwright e2e smoke). Triggers on "TEST:" prefix, failing tests, adding tests, or e2e stabilization work.
---

# Treido Testing

## On Any "TEST:" Prompt

1. Identify the fastest failing signal (typecheck → unit → e2e).
2. Prefer minimal tests that lock the behavior you're changing:
   - Unit tests: `__tests__/` (Vitest)
   - E2E tests: `e2e/` (Playwright)
3. Don't add tests for unrelated areas; fix the root cause in the touched code.
4. Run gates; when fixing flakes, make the wait conditions deterministic (role/locator/expect), not arbitrary timeouts.

## Gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
