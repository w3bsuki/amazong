# Desktop Selling — 2026-02-05 (1440×900)

## Sell entry — `/bg/sell` (guest)

Artifacts:
- Screenshot: `screenshots/14-sell-bg-gated.png`
- Console: `console-sell-bg.txt`

Expected:
- Guest users should see a clear sign-in prompt and return to the same locale after auth.

Actual:
- Sign-in prompt renders correctly.
- Login/signup links include `next=%2Fsell` (locale-agnostic) → potential locale drop after sign-in (especially from `/en/...`).

Tracked:
- **FE-002** — locale preservation for gated selling flow.

## E2E coverage note

- `pnpm -s test:e2e:smoke` passed but includes **1 skipped** seller-flow smoke test (see `gates.md`).
