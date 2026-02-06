# Desktop Account — 2026-02-05 (1440×900)

## Account root — `/bg/account` (guest)

Artifacts:
- Screenshot: `screenshots/16-account-redirect-to-login.png`
- Console: `console-account-redirect-login.txt`

Observed:
- Redirects to `/bg/auth/login?next=%2Fbg%2Faccount` (locale preserved).

## Chat — `/bg/chat` (guest)

Artifacts:
- Screenshot: `screenshots/15-chat-bg-gated.png`
- Console: `console-chat-bg.txt`

Observed:
- Gating UI shows login/signup with `next=%2Fchat` (locale-agnostic).

Tracked:
- **FE-002** — unify locale-preserving `next` behavior across account-adjacent gated routes.
