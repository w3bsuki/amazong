# Baseline Metrics

Date captured: 2026-02-17

## Snapshot

- Source files (`app`, `components`, `lib`, `hooks`): `808`
- `"use client"` files (`app`, `components`, `hooks`): `194`
- Architecture scan client-boundary: `215/803 (26.77%)`
- Architecture scan oversized files: `>300 lines: 120`, `>500 lines: 43`
- Architecture scan duplicate clusters: `249`
- Architecture scan duplicated lines: `4,793` (`3.07%`)
- Routes/pages: `86`
- Routes missing `loading.tsx`: `0`
- Routes missing metadata: `0`
- `select('*')` matches in `app` + `lib`: `0`

## Route Group Volume

| Route Group | Files | `"use client"` |
| --- | ---: | ---: |
| `(main)` | 136 | 29 |
| `(sell)` | 54 | 28 |
| `(auth)` | 24 | 4 |
| `(account)` | 90 | 34 |
| `(checkout)` | 15 | 5 |
| `(business)` | 49 | 11 |
| `(chat)` | 11 | 4 |
| `(admin)` | 25 | 5 |
| `(plans)` | 5 | 1 |
| `(onboarding)` | 21 | 5 |
| `[username]` | 43 | 15 |

## High-Weight Files (Top Samples)

- `lib/supabase/database.types.ts` (`~98 KB`)
- `app/api/admin/docs/seed/templates.ts` (`~70 KB`)
- `app/actions/orders.ts` (`947 lines`)
- `app/actions/products.ts` (`828 lines`)
- `app/[locale]/(chat)/_components/chat-interface.tsx` (`760 lines`)
- `app/[locale]/(account)/account/billing/billing-content.tsx` (`729 lines`)
- `app/[locale]/(main)/_components/mobile-home.tsx` (`679 lines`)
- `app/[locale]/(main)/_components/desktop-home.tsx` (`553 lines`)

## Large Action Files

| File | Lines |
| --- | ---: |
| `app/actions/orders.ts` | 947 |
| `app/actions/products.ts` | 828 |
| `app/actions/username.ts` | 665 |
| `app/actions/buyer-feedback.ts` | 482 |
| `app/actions/subscriptions.ts` | 474 |
| `app/actions/profile.ts` | 467 |

## Interpretation

- Complexity is concentrated in route-heavy client files and monolithic action files.
- Duplication is meaningful (`4,793` duplicated lines) and aligned with subagent findings (parallel implementations for the same flows).
- Simplification target should prioritize high-weight route groups: `(main)`, `(account)`, `(sell)`, `(chat)`, plus shared action/data layers.
