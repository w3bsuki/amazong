# Desktop Auth — 2026-02-05 (1440×900)

## Login — `/bg/auth/login`

Artifacts:
- Screenshot: `screenshots/11-auth-login-bg.png`
- Console: `console-auth-login-bg.txt`

Notes:
- Form fields are correctly labeled; “Покажи парола” button present.
- Footer includes legal links and a Help link (`/bg/help`) which redirects to customer service.

## Sign-up — `/bg/auth/sign-up`

Artifacts:
- Screenshot: `screenshots/12-auth-sign-up-bg.png`
- Console: `console-auth-sign-up-bg.txt`

Notes:
- Standard account creation fields present; CTA disabled until valid input.

## Forgot password — `/bg/auth/forgot-password`

Artifacts:
- Screenshot: `screenshots/13-auth-forgot-password-bg.png`
- Console: `console-auth-forgot-password-bg.txt`

Notes:
- Flow loads; no console errors captured.

## Auth gating + locale preservation

Observed:
- `/bg/account` redirects to `/bg/auth/login?next=%2Fbg%2Faccount` (locale preserved).
- `/bg/account/orders` redirects to `/bg/auth/login?next=%2Fbg%2Faccount%2Forders` (locale preserved).
- `/bg/sell` and `/bg/chat` show gating links with `next=%2Fsell` / `next=%2Fchat` (locale-agnostic).

Evidence (screenshots):
- Sell gating: `screenshots/14-sell-bg-gated.png`
- Chat gating: `screenshots/15-chat-bg-gated.png`
- Account redirect: `screenshots/16-account-redirect-to-login.png`
- Orders redirect: `screenshots/17-orders-redirect-to-login.png`

Issue:
- **FE-002** — inconsistent locale handling for `next` across auth surfaces.

Likely code areas (evidence via `rg -n` / inspection):
- `app/[locale]/(sell)/_components/sign-in-prompt.tsx:15` (`nextPath="/sell"`)
- `app/[locale]/(chat)/chat/page.tsx:42` (`nextPath="/chat"`)
- `components/shared/auth/auth-gate-card.tsx:39` (strips locale prefix before building `next`)
- Also found:
  - `app/[locale]/(plans)/_components/plans-page-client.tsx:257` (`/auth/login?next=/plans`)
  - `app/[locale]/(checkout)/_components/checkout-page-client.tsx:157` (`/auth/login?next=/checkout`)
