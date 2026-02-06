# Auth & Accounts — Mobile Playwright Audit (Blocked)

## Scope (docs/02-FEATURES.md mapping)
- Auth & Accounts
- Profiles (as it relates to account views)
- Accessibility + i18n on auth surfaces

## Test Matrix

| Check | Status | Notes | Issue IDs |
|---|---|---|---|
| `/bg/auth/login` loads; validation UX localized | Blocked | Server unreachable | — |
| `/bg/auth/sign-up` loads; validation UX localized | Blocked | Server unreachable | — |
| `/bg/auth/forgot-password` loads; localized + safe errors | Blocked | Server unreachable | — |
| Logged-in session persists; logout works | Blocked | No creds + server unreachable | — |
| Keyboard focus + skip link basics on auth pages | Blocked | Server unreachable | — |

## Notes

- Creds check: `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` were **missing/empty** in this run.

