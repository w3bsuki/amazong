# Buying (Discovery → PDP → Cart → Checkout) — Mobile Playwright Audit (Blocked)

## Scope (docs/02-FEATURES.md mapping)
- Discovery (Home, Search, Categories)
- PDP
- Wishlist
- Cart/Checkout
- Accessibility + i18n across buying funnel

## Test Matrix

| Check | Status | Notes | Issue IDs |
|---|---|---|---|
| Home `/bg`: header/menu/search entry works | Blocked | Server unreachable | — |
| Home `/bg`: category nav + first product opens | Blocked | Server unreachable | — |
| Search `/bg/search?q=iphone`: locale stays `/bg` | Blocked | Server unreachable | — |
| Search: filters/sort/pagination; back preserves context | Blocked | Server unreachable | — |
| Categories `/bg/categories`: drill-down + product grid | Blocked | Server unreachable | — |
| PDP: gallery works; CTA hierarchy; similar items keep locale | Blocked | Server unreachable | — |
| Wishlist: guest UX is clear + localized | Blocked | Server unreachable | — |
| Cart `/bg/cart`: qty change + remove + empty state | Blocked | Server unreachable | — |
| Checkout `/bg/checkout`: graceful gating + localized | Blocked | Server unreachable | — |

