# Desktop Orders — 2026-02-05 (1440×900)

## Orders — `/bg/account/orders` (guest)

Artifacts:
- Screenshot: `screenshots/17-orders-redirect-to-login.png`
- Console: `console-orders-redirect-login.txt`

Observed:
- Redirects to `/bg/auth/login?next=%2Fbg%2Faccount%2Forders` (locale preserved).

Notes:
- This behavior is consistent with `/bg/account` redirect, but inconsistent with `/bg/sell` and `/bg/chat` gating links (see **FE-002**).
