# Selling — Mobile Playwright Audit (Blocked)

## Scope (docs/02-FEATURES.md mapping)
- Selling flow entry and first steps
- Listing creation/edit (as available)
- Accessibility + i18n of selling surfaces

## Test Matrix

| Check | Status | Notes | Issue IDs |
|---|---|---|---|
| Sell entry `/bg/sell` gates cleanly when logged out | Blocked | Server unreachable | — |
| Sell entry `/bg/sell` first step loads when logged in | Blocked | No creds + server unreachable | — |
| Error states are localized; no raw i18n keys | Blocked | Server unreachable | — |

