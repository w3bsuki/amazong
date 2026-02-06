# Gates (Desktop localhost) — 2026-02-05

Base URL: `http://127.0.0.1:3000`  
Locale focus: `/bg` (spot-check `/en`)

## Preflight

- `curl http://127.0.0.1:3000/bg` → **200**
- `curl http://127.0.0.1:3000/api/health/env` (safe fields only) → `ok=true`, `missing=[]`, `appUrl=https://treido.eu`

Notes:
- Port `3000` was initially held by an unresponsive `node` process; restarted `pnpm -s dev` to proceed.

## Standard gates (2-strikes rule)

| Gate | Command | Result | Notes |
|---|---|---:|---|
| Typecheck | `pnpm -s typecheck` | ✅ Pass | No output (clean). |
| Lint | `pnpm -s lint` | ✅ Pass | **539 warnings** (0 errors). Notable: restricted import from `/app` in `.storybook/preview.tsx`; restricted imports in `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx`; multiple `@typescript-eslint/no-unsafe-argument` warnings in account pages. |
| Styles gate | `pnpm -s styles:gate` | ✅ Pass | 0 palette/arbitrary/semantic-token/token-alpha findings. |
| E2E smoke | `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` | ✅ Pass | `20 passed`, `1 skipped` (seller flow smoke case). |

Retries: **0** (no gate required a second run).
