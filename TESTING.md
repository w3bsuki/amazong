# Testing

Launch-night guide (parallel desktop/mobile/a11y + critical flows):
- `testing/README.md`

This repo uses a simple test pyramid:

- Unit/Integration (fast, deterministic): Vitest
- E2E (full-stack behavior): Playwright
- A11y (smoke): Playwright + axe
- Perf (smoke): Lighthouse CI

## Unit / Integration (Vitest)

- Run: `pnpm test:unit`
- Watch: `pnpm test:unit:watch`

Conventions:
- Put pure logic tests under `__tests__/`.
- Prefer testing `lib/` utilities and small UI units.
- For async Server Components, prefer E2E tests (unit tests are a bad fit).

## E2E / A11y / Perf

- E2E (Chromium): `pnpm test:e2e`
- E2E (all configured projects): `pnpm test:e2e:all`
- A11y: `pnpm test:a11y`
- Perf: `pnpm test:lighthouse`

See `e2e/README.md` for Playwright-specific conventions and env vars.
