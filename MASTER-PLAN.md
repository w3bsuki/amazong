# MASTER PLAN — Treido

> Codex reads this. Picks the next unchecked domain. Reads its doc. Audits. Refactors. Checks it off.

---

## How This Works

```
1. Read PRD.md — understand what Treido is and what it does
2. Read this file — find the first unchecked domain
3. Read the linked doc (codex/NN-domain.md)
4. The doc tells you: what must work, which files to audit
5. You audit those files — find dead code, duplication, bloat, over-engineering
6. You refactor — same features, less code
7. Verify: pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
8. Update the progress table below — check off the domain, fill in metrics
```

**Rules:**
- Every file must serve a domain. Orphans get deleted.
- Never touch DB schema, RLS, auth/session logic, or webhook signatures without human approval.
- `getUser()` only — never `getSession()`.
- Read `AGENTS.md` for project conventions.

---

## Baseline (2026-02-18)

| Metric | Current | Target |
|--------|---------|--------|
| Source files | 810 | <400 |
| Total LOC | ~112K | <45K |
| `"use client"` directives | 215 | <100 |

---

## Domains

| # | Domain | Doc | One-liner |
|---|--------|-----|-----------|
| 1 | Auth | `codex/01-auth.md` | Sign up, sign in, forgot/reset password, OAuth, session, sign out |
| 2 | Onboarding | `codex/02-onboarding.md` | Post-signup wizard: account type → profile → interests → complete |
| 3 | Profiles & Account | `codex/03-profiles-account.md` | Public profile, account settings, addresses, security, billing |
| 4 | Business Dashboard | `codex/04-business-dashboard.md` | Seller dashboard: products, orders, inventory, analytics, settings |
| 5 | Selling | `codex/05-selling.md` | Sell form: category → details → images → pricing → submit |
| 6 | Marketplace | `codex/06-marketplace.md` | Homepage, search, categories, filters, deals, sellers, legal, support |
| 7 | Cart & Wishlist | `codex/07-cart-wishlist.md` | Add to cart, cart page, wishlist, shared wishlist, persistence |
| 8 | Checkout | `codex/08-checkout.md` | Checkout flow, Stripe payment, webhooks, success page |
| 9 | Orders & Sales | `codex/09-orders-sales.md` | Buyer orders, seller sales, shipping, tracking, status, export |
| 10 | Chat | `codex/10-chat.md` | Conversations, realtime messaging, order-linked chats, notifications |
| 11 | Plans & Subscriptions | `codex/11-plans.md` | Pricing page, Stripe subscriptions, portal, limits, webhooks |
| 12 | Boosts | `codex/12-boosts.md` | Listing boost purchase, activation, display, plan limits |
| 13 | PDP | `codex/13-pdp.md` | Product detail page: gallery, info, seller, reviews, actions |
| 14 | Reviews & Feedback | `codex/14-reviews.md` | Product reviews, buyer/seller feedback, ratings |
| 15 | Admin | `codex/15-admin.md` | Admin panel: users, orders, products, sellers |
| 16 | Shared Infrastructure | `codex/16-shared-infra.md` | Providers, hooks, lib, header, nav, footer, i18n, middleware |

---

## Progress

| # | Domain | Status | Files before | Files after | LOC before | LOC after |
|---|--------|--------|-------------|-------------|-----------|----------|
| 1 | Auth | ⬜ | | | | |
| 2 | Onboarding | ⬜ | | | | |
| 3 | Profiles & Account | ⬜ | | | | |
| 4 | Business Dashboard | ⬜ | | | | |
| 5 | Selling | ⬜ | | | | |
| 6 | Marketplace | ⬜ | | | | |
| 7 | Cart & Wishlist | ⬜ | | | | |
| 8 | Checkout | ⬜ | | | | |
| 9 | Orders & Sales | ⬜ | | | | |
| 10 | Chat | ⬜ | | | | |
| 11 | Plans & Subscriptions | ⬜ | | | | |
| 12 | Boosts | ⬜ | | | | |
| 13 | PDP | ⬜ | | | | |
| 14 | Reviews & Feedback | ⬜ | | | | |
| 15 | Admin | ⬜ | | | | |
| 16 | Shared Infra | ⬜ | | | | |

---

*Created: 2026-02-18 — 810 files, ~112K LOC*
