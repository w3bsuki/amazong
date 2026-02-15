# REQUIREMENTS.md — Feature Requirements Checklist

> Actionable feature requirements checklist.
> Each requirement has an ID: say "execute R2.3" to reference it precisely.
> Status snapshot (last updated: 2026-02-01).

Progress: **103/119 features (~87%)** | **18 categories**

Legend: `[x]` Done | `[ ]` In progress or not started (annotated)

---

## R1: Authentication & Accounts (8/8) ✅

- [x] R1.1: Email/password signup with verification
- [x] R1.2: Email/password login with session management
- [x] R1.3: Email confirmation flow
- [x] R1.4: OAuth (Google) callback
- [x] R1.5: Password reset flow
- [x] R1.6: Session persistence (cookie-based)
- [x] R1.7: Post-signup onboarding wizard
- [x] R1.8: Protected route gating (middleware)

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R2: Selling & Listings (7/8)

- [x] R2.1: Auth-gated sell entry (/sell)
- [x] R2.2: Multi-step listing wizard (title, desc, category, attributes, images, price)
- [x] R2.3: Image upload (multi-image, drag-reorder, compression)
- [x] R2.4: Category + attribute selection
- [x] R2.5: Draft → publish flow
- [x] R2.6: Edit listing
- [x] R2.7: Delete / unpublish listing
- [ ] R2.8: Listing analytics — not started (business tier only)

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

## R3: Cart & Checkout (8/8) ✅

- [x] R3.1: Add / update / remove cart items
- [x] R3.2: Cart page with totals
- [x] R3.3: Checkout page
- [x] R3.4: Stripe payment intent creation
- [x] R3.5: Buyer Protection fee calculation
- [x] R3.6: Success / cancel handling
- [x] R3.7: Webhook processing (idempotent)
- [x] R3.8: Order creation on payment success

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R4: Orders — Buyer (5/6)

- [x] R4.1: Orders list page
- [x] R4.2: Order detail view
- [x] R4.3: Order status tracking
- [x] R4.4: Report issue (buyer protection)
- [ ] R4.5: Cancel order — in progress (pre-shipment only)
- [x] R4.6: Confirm received → triggers payout

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## R5: Orders — Seller (5/6)

- [x] R5.1: Seller orders list
- [x] R5.2: Seller order detail
- [x] R5.3: Mark as shipped
- [x] R5.4: Mark as delivered
- [ ] R5.5: Process refund — in progress (admin-assisted)
- [x] R5.6: Inventory updates (DB triggers)

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## R6: Stripe Connect / Payouts (6/6) ✅

- [x] R6.1: Connect onboarding flow
- [x] R6.2: Individual accounts
- [x] R6.3: Business accounts
- [x] R6.4: Payout eligibility gating
- [x] R6.5: Payout status display
- [x] R6.6: Delayed payout release (escrow)

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R7: Marketplace Discovery (6/7)

- [x] R7.1: Home feed
- [x] R7.2: Category pages
- [x] R7.3: Subcategory navigation
- [x] R7.4: Search page
- [x] R7.5: Search filters (price, condition, location)
- [x] R7.6: Search sorting (relevance, price, date)
- [ ] R7.7: Saved searches — in progress (client-only, localStorage)

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R8: Product Pages / PDP (7/8)

- [x] R8.1: Product detail page
- [x] R8.2: Image gallery (swiper + thumbnails)
- [x] R8.3: Price display with currency
- [x] R8.4: Seller info card
- [x] R8.5: Product attributes display
- [x] R8.6: Share / copy link
- [ ] R8.7: Related items — not started (V1.1)
- [x] R8.8: Recently viewed products

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R9: Wishlist (4/5)

- [x] R9.1: Add to wishlist
- [x] R9.2: Remove from wishlist
- [x] R9.3: Wishlist page
- [x] R9.4: Wishlist count indicator
- [ ] R9.5: Wishlist sharing — not started (DB exists, UI not exposed)

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## R10: Messaging (7/7) ✅

- [x] R10.1: Start conversation
- [x] R10.2: Chat list
- [x] R10.3: Chat thread (real-time)
- [x] R10.4: Unread indicators
- [x] R10.5: Image attachments
- [x] R10.6: Report conversation
- [x] R10.7: Block user

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## R11: Reviews & Ratings (8/8) ✅

- [x] R11.1: Leave product review
- [x] R11.2: Seller feedback
- [x] R11.3: Buyer feedback
- [x] R11.4: Display reviews on PDP
- [x] R11.5: Display reviews on profile
- [x] R11.6: Helpful vote
- [x] R11.7: Delete own review
- [x] R11.8: Validation rules (no duplicate reviews)

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## R12: Profiles & Account (4/6)

- [x] R12.1: Public profile page
- [x] R12.2: Profile editing
- [x] R12.3: Account settings
- [x] R12.4: Address book
- [ ] R12.5: Notifications (in-app) — in progress (DB exists, UI partial)
- [ ] R12.6: Email notifications — not started (backend only)

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R13: Trust & Safety (4/6)

- [x] R13.1: Report product
- [x] R13.2: Report user
- [x] R13.3: Report conversation
- [x] R13.4: Block user
- [ ] R13.5: Admin moderation — in progress (basic)
- [ ] R13.6: Prohibited items enforcement — in progress (manual)

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## R14: Business Dashboard (5/6)

- [x] R14.1: Dashboard access gating
- [x] R14.2: Business profile setup
- [x] R14.3: Business listings view
- [x] R14.4: Business orders view
- [ ] R14.5: Analytics dashboard — in progress (basic)
- [x] R14.6: Subscription management

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R15: Admin (2/5)

- [x] R15.1: Admin route gating
- [ ] R15.2: Admin metrics — in progress
- [ ] R15.3: User management — in progress
- [ ] R15.4: Content moderation — in progress
- [x] R15.5: System health endpoint

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## R16: Internationalization (5/5) ✅

- [x] R16.1: English locale
- [x] R16.2: Bulgarian locale
- [x] R16.3: Locale routing
- [x] R16.4: Dynamic locale switching
- [x] R16.5: Currency display (BGN/EUR)

→ Deep dive: [docs/DOMAINS.md](docs/DOMAINS.md)

---

## R17: Accessibility (3/5)

- [x] R17.1: Keyboard navigation
- [x] R17.2: Focus management
- [x] R17.3: Touch targets ≥ 32px (minimum contract; product UI defaults to 44px for primary actions)
- [ ] R17.4: Screen reader labels — in progress (partial)
- [ ] R17.5: WCAG 2.1 AA compliance — in progress

→ Deep dive: [docs/DESIGN.md](docs/DESIGN.md)

---

## R18: Infrastructure (6/6) ✅

- [x] R18.1: Vercel deployment
- [x] R18.2: Supabase production
- [x] R18.3: Stripe integration
- [x] R18.4: Error boundaries
- [x] R18.5: Health endpoint
- [x] R18.6: Revalidation endpoint

→ Deep dive: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Summary

| # | Category | Done | WIP | Todo | % |
|---|----------|------|-----|------|---|
| R1 | Auth & Accounts | 8 | 0 | 0 | 100% |
| R2 | Selling & Listings | 7 | 0 | 1 | 88% |
| R3 | Cart & Checkout | 8 | 0 | 0 | 100% |
| R4 | Orders (Buyer) | 5 | 1 | 0 | 83% |
| R5 | Orders (Seller) | 5 | 1 | 0 | 83% |
| R6 | Stripe / Payouts | 6 | 0 | 0 | 100% |
| R7 | Discovery | 6 | 1 | 0 | 86% |
| R8 | Product Pages | 7 | 0 | 1 | 88% |
| R9 | Wishlist | 4 | 0 | 1 | 80% |
| R10 | Messaging | 7 | 0 | 0 | 100% |
| R11 | Reviews & Ratings | 8 | 0 | 0 | 100% |
| R12 | Profiles & Account | 4 | 1 | 1 | 67% |
| R13 | Trust & Safety | 4 | 2 | 0 | 67% |
| R14 | Business Dashboard | 5 | 1 | 0 | 83% |
| R15 | Admin | 2 | 3 | 0 | 40% |
| R16 | i18n | 5 | 0 | 0 | 100% |
| R17 | Accessibility | 3 | 2 | 0 | 60% |
| R18 | Infrastructure | 6 | 0 | 0 | 100% |
| | **TOTAL** | **103** | **11** | **5** | **87%** |

---

## Post-V1 Roadmap

- **V1.1:** Saved searches (email alerts), Related items, Shipping tracking, Seller verification badges
- **V2:** Advanced analytics, AI Listing Assistant, AI Search Assistant
- **V3:** Mobile apps (iOS/Android), Auctions/bidding, B2B networking

---

## See Also

- [AGENTS.md](AGENTS.md) — Product snapshot and execution contract
- [docs/DOMAINS.md](docs/DOMAINS.md) — Consolidated domain contracts
- [docs/DESIGN.md](docs/DESIGN.md) — Consolidated design and frontend contract
- [TASKS.md](TASKS.md) — Active work queue

---

*Last updated: 2026-02-08*
