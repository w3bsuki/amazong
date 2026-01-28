# Features — Implementation Status (SSOT)

> **Quick reference for what's built vs what's pending.** Update this when features ship.

## Legend

- ✅ Implemented & tested
- 🚧 In progress
- ⬜ Not started
- 🔜 Planned (post-V1)

---

## Authentication & Accounts

| Feature | Status | Notes |
|---------|--------|-------|
| Email/password signup | ✅ | `app/[locale]/(auth)/auth/signup` |
| Email/password login | ✅ | `app/[locale]/(auth)/auth/login` |
| Email confirmation flow | ✅ | `app/auth/confirm/route.ts` |
| OAuth callback | ✅ | `app/auth/callback/route.ts` |
| Password reset | ✅ | `app/[locale]/(auth)/auth/forgot-password` |
| Session persistence | ✅ | Supabase SSR + cookies |
| Post-signup onboarding | ✅ | Personal vs business intent |
| Protected route gating | ✅ | Sell/Chat/Wishlist require auth |

**E2E Coverage:** `e2e/auth.spec.ts`

---

## Profiles & Account

| Feature | Status | Notes |
|---------|--------|-------|
| Public profile page | ✅ | `app/[locale]/[username]/page.tsx` |
| Profile editing | ✅ | Avatar, username, bio |
| Account settings | ✅ | `app/[locale]/(account)/account/*` |
| Address book | ✅ | `user_addresses` table |
| Notifications (in-app) | 🚧 | DB exists, UI partial |
| Email notifications | ⬜ | Backend only |

**E2E Coverage:** `e2e/profile.spec.ts`

---

## Marketplace Discovery

| Feature | Status | Notes |
|---------|--------|-------|
| Home feed | ✅ | `app/[locale]/(main)/page.tsx` |
| Category pages | ✅ | `app/[locale]/(main)/categories/*` |
| Subcategory navigation | ✅ | Breadcrumbs + filters |
| Search page | ✅ | `app/[locale]/(main)/search` |
| Search filters | ✅ | Price, condition, location, etc. |
| Search sorting | ✅ | Relevance, price, date |
| Saved searches | ⬜ | Not implemented |

**E2E Coverage:** `e2e/smoke.spec.ts`

---

## Product Pages (PDP)

| Feature | Status | Notes |
|---------|--------|-------|
| Product detail page | ✅ | `app/[locale]/[username]/[productSlug]` |
| Image gallery | ✅ | Swiper + thumbnails |
| Price display | ✅ | With currency conversion |
| Seller info card | ✅ | Avatar, rating, stats |
| Product attributes | ✅ | Condition, size, color, etc. |
| Share/copy link | ✅ | Native share API |
| Related items | ⬜ | Not implemented |
| Recently viewed | ⬜ | Not implemented |

**E2E Coverage:** `e2e/smoke.spec.ts`, `e2e/reviews.spec.ts`

---

## Wishlist

| Feature | Status | Notes |
|---------|--------|-------|
| Add to wishlist | ✅ | Heart button on cards/PDP |
| Remove from wishlist | ✅ | |
| Wishlist page | ✅ | `app/[locale]/(account)/account/wishlist` |
| Wishlist count indicator | ✅ | Header badge |
| Wishlist sharing | ⬜ | DB exists, UI not exposed |

---

## Cart & Checkout

| Feature | Status | Notes |
|---------|--------|-------|
| Add to cart | ✅ | |
| Update quantities | ✅ | |
| Remove from cart | ✅ | |
| Cart persistence | ✅ | Server-side |
| Cart page | ✅ | `app/[locale]/(main)/cart` |
| Checkout page | ✅ | `app/[locale]/(checkout)/checkout` |
| Stripe payment intent | ✅ | |
| Buyer Protection fee | ✅ | Calculated at checkout |
| Success/cancel handling | ✅ | |
| Webhook processing | ✅ | `app/api/checkout/webhook` |
| Order creation | ✅ | Idempotent |

**E2E Coverage:** `e2e/orders.spec.ts`

---

## Orders (Buyer)

| Feature | Status | Notes |
|---------|--------|-------|
| Orders list | ✅ | `app/[locale]/(account)/account/orders` |
| Order detail | ✅ | Status, items, seller info |
| Order status tracking | ✅ | `lib/order-status.ts` |
| Report issue (buyer protection) | ✅ | `app/actions/orders.ts` |
| Cancel order | 🚧 | Partial |
| Confirm received | ✅ | Triggers payout release |

**E2E Coverage:** `e2e/orders.spec.ts`

---

## Orders (Seller)

| Feature | Status | Notes |
|---------|--------|-------|
| Seller orders list | ✅ | `app/[locale]/(sell)/sell/orders` |
| Seller order detail | ✅ | |
| Mark as shipped | ✅ | |
| Mark as delivered | ✅ | |
| Process refund | 🚧 | Admin-assisted |
| Inventory/stock updates | ✅ | DB triggers |

**E2E Coverage:** `e2e/seller-routes.spec.ts`

---

## Selling / Listings

| Feature | Status | Notes |
|---------|--------|-------|
| Sell entry (gated) | ✅ | Requires auth |
| Create listing form | ✅ | Multi-step wizard |
| Image upload | ✅ | `app/api/upload-image` |
| Category selection | ✅ | With attributes |
| Draft → publish flow | ✅ | |
| Edit listing | ✅ | |
| Delete/unpublish listing | ✅ | |
| Listing analytics | ⬜ | Business tier only |

**E2E Coverage:** `e2e/seller-create-listing.spec.ts`, `e2e/seller-routes.spec.ts`

---

## Stripe Connect (Payouts)

| Feature | Status | Notes |
|---------|--------|-------|
| Connect onboarding link | ✅ | `app/api/connect/onboarding` |
| Individual accounts | ✅ | |
| Business accounts | ✅ | |
| Payout eligibility gating | ✅ | `lib/auth/business.ts` |
| Payout status display | ✅ | Account settings |
| Delayed payout release | ✅ | Escrow-style |

---

## Messaging

| Feature | Status | Notes |
|---------|--------|-------|
| Start conversation | ✅ | From listing/order |
| Chat list | ✅ | `app/[locale]/(chat)/chat` |
| Chat thread | ✅ | Real-time messages |
| Unread indicators | ✅ | Badge + visual |
| Image attachments | ✅ | `app/api/upload-chat-image` |
| Report conversation | ✅ | |
| Block user | ✅ | `app/actions/blocked-users.ts` |

**E2E Coverage:** `e2e/smoke.spec.ts` (auth redirect check)

---

## Reviews & Ratings

| Feature | Status | Notes |
|---------|--------|-------|
| Leave product review | ✅ | `app/actions/reviews.ts` |
| Seller feedback | ✅ | `app/actions/seller-feedback.ts` |
| Buyer feedback | ✅ | `app/actions/buyer-feedback.ts` |
| Display reviews on PDP | ✅ | |
| Display ratings on profile | ✅ | |
| Helpful vote | ✅ | |
| Delete own review | ✅ | |
| Review validation rules | ✅ | No duplicates, must be buyer |

**E2E Coverage:** `e2e/reviews.spec.ts`

---

## Trust & Safety

| Feature | Status | Notes |
|---------|--------|-------|
| Report product | ✅ | |
| Report user | ✅ | |
| Report conversation | ✅ | |
| Block user | ✅ | |
| Admin moderation surfaces | 🚧 | Basic |
| Prohibited items enforcement | 🚧 | Manual |

---

## Business Dashboard

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard access gating | ✅ | `lib/auth/business.ts` |
| Business profile setup | ✅ | |
| Business listings view | ✅ | |
| Business orders view | ✅ | |
| Analytics dashboard | 🚧 | Basic |
| Subscription management | ✅ | `app/api/subscriptions` |

**E2E Coverage:** `e2e/seller-routes.spec.ts`

---

## Admin

| Feature | Status | Notes |
|---------|--------|-------|
| Admin route gating | ✅ | `lib/auth/admin.ts` |
| Admin metrics | 🚧 | |
| User management | 🚧 | |
| Content moderation | 🚧 | |
| System health | ✅ | `app/api/health` |

---

## Internationalization (i18n)

| Feature | Status | Notes |
|---------|--------|-------|
| English locale | ✅ | `messages/en.json` |
| Bulgarian locale | ✅ | `messages/bg.json` |
| Locale routing | ✅ | `@/i18n/routing` |
| Dynamic locale switching | ✅ | |
| Currency display (BGN/EUR) | ✅ | |

---

## Accessibility

| Feature | Status | Notes |
|---------|--------|-------|
| Keyboard navigation | ✅ | All core flows |
| Focus management | ✅ | Dialogs/drawers |
| Touch targets ≥32px | ✅ | `h-touch-*` utilities |
| Screen reader labels | 🚧 | Partial |
| WCAG 2.1 AA | 🚧 | In progress |

**E2E Coverage:** `e2e/accessibility.spec.ts`

---

## Infrastructure

| Feature | Status | Notes |
|---------|--------|-------|
| Vercel deployment | ✅ | |
| Supabase production | ✅ | |
| Stripe integration | ✅ | |
| Error boundaries | ✅ | `global-error.tsx` |
| Health endpoint | ✅ | `app/api/health` |
| Revalidation endpoint | ✅ | `app/api/revalidate` |

---

## 🔜 Post-V1 Features

| Feature | Target | Notes |
|---------|--------|-------|
| AI Listing Assistant | V2 | Title/description suggestions |
| AI Search Assistant | V2 | Natural language search |
| Mobile apps | V3 | Capacitor |
| Shipping tracking | V1.1 | Carrier integrations |
| Advanced analytics | V2 | Business tier |
| B2B networking | V3 | Verified businesses |
| Saved searches | V1.1 | |
| Related items | V1.1 | Recommendations |

---

## Summary

| Category | Total | ✅ Done | 🚧 WIP | ⬜ Not Started |
|----------|-------|---------|--------|---------------|
| Auth & Accounts | 8 | 8 | 0 | 0 |
| Profiles | 6 | 4 | 1 | 1 |
| Discovery | 7 | 6 | 0 | 1 |
| Product Pages | 8 | 6 | 0 | 2 |
| Wishlist | 5 | 4 | 0 | 1 |
| Cart & Checkout | 11 | 11 | 0 | 0 |
| Orders (Buyer) | 6 | 5 | 1 | 0 |
| Orders (Seller) | 6 | 5 | 1 | 0 |
| Selling | 8 | 7 | 0 | 1 |
| Payouts | 6 | 6 | 0 | 0 |
| Messaging | 7 | 7 | 0 | 0 |
| Reviews | 8 | 8 | 0 | 0 |
| Trust & Safety | 6 | 4 | 2 | 0 |
| Business Dashboard | 6 | 5 | 1 | 0 |
| Admin | 5 | 2 | 3 | 0 |
| i18n | 5 | 5 | 0 | 0 |
| Accessibility | 5 | 3 | 2 | 0 |
| Infrastructure | 6 | 6 | 0 | 0 |
| **Total** | **119** | **102** | **11** | **6** |

**Progress: ~86% Complete for V1** 🎉

---

## Route Map (Quick Reference)

| Route | Purpose | Group |
|-------|---------|-------|
| `/` | Home | (main) |
| `/categories/*` | Browse | (main) |
| `/search` | Search | (main) |
| `/cart` | Cart | (main) |
| `/auth/*` | Auth flows | (auth) |
| `/checkout` | Checkout | (checkout) |
| `/account/*` | Buyer account | (account) |
| `/sell/*` | Seller flows | (sell) |
| `/chat` | Messaging | (chat) |
| `/dashboard/*` | Business dash | (business) |
| `/admin/*` | Admin | (admin) |
| `/plans` | Subscription plans | (plans) |
| `/[username]` | Public profile | [username] |
| `/[username]/[slug]` | Product page | [username] |

---

*Last updated: 2026-01-25*
