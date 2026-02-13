# Buying & Orders

## Goal

Enable buyers to browse products, add items to a server-backed cart, complete checkout with Stripe payment (including Buyer Protection fee), track orders through their lifecycle, and manage a personal wishlist. The PDP (product detail page) surfaces all product info, seller trust signals, and one-click cart/wishlist actions.

## Current Status

- Requirements: 24/27 complete (R3: 8/8 + R4: 5/6 + R8: 7/8 + R9: 4/5) — see REQUIREMENTS.md §R3, §R4, §R8, §R9
- Production: 🟡 Partial — order cancellation WIP; related items and wishlist sharing deferred

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| **R3: Cart & Checkout** | | |
| R3.1 | Add / update / remove cart items | ✅ |
| R3.2 | Cart page with totals | ✅ |
| R3.3 | Checkout page | ✅ |
| R3.4 | Stripe payment intent creation | ✅ |
| R3.5 | Buyer Protection fee calculation | ✅ |
| R3.6 | Success / cancel handling | ✅ |
| R3.7 | Webhook processing (idempotent) | ✅ |
| R3.8 | Order creation on payment success | ✅ |
| **R4: Orders — Buyer** | | |
| R4.1 | Orders list page | ✅ |
| R4.2 | Order detail view | ✅ |
| R4.3 | Order status tracking | ✅ |
| R4.4 | Report issue (buyer protection) | ✅ |
| R4.5 | Cancel order (pre-shipment only) | 🟡 In progress |
| R4.6 | Confirm received → triggers payout | ✅ |
| **R8: Product Pages / PDP** | | |
| R8.1 | Product detail page | ✅ |
| R8.2 | Image gallery (swiper + thumbnails) | ✅ |
| R8.3 | Price display with currency | ✅ |
| R8.4 | Seller info card | ✅ |
| R8.5 | Product attributes display | ✅ |
| R8.6 | Share / copy link | ✅ |
| R8.7 | Related items | ⬜ Not started (V1.1) |
| R8.8 | Recently viewed products | ✅ |
| **R9: Wishlist** | | |
| R9.1 | Add to wishlist | ✅ |
| R9.2 | Remove from wishlist | ✅ |
| R9.3 | Wishlist page | ✅ |
| R9.4 | Wishlist count indicator | ✅ |
| R9.5 | Wishlist sharing | ⬜ Not started (DB exists, UI not exposed) |

## Implementation Notes

### Routes

| Path | Group | Auth |
|------|-------|------|
| `/cart` | (main) | public |
| `/checkout` | (checkout) | public |
| `/checkout/success` | (checkout) | public |
| `/account/orders` | (account) | auth |
| `/account/orders/:id` | (account) | auth |
| `/wishlist` | (main) | auth |
| `/wishlist/:token` | (main) | public |
| `/wishlist/shared/:token` | (main) | public |
| `/:username/:productSlug` | [username] | public |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/checkout/webhook` | POST | Stripe checkout webhook (idempotent) |
| `/api/payments/setup` | POST | Setup payment intent |
| `/api/payments/set-default` | POST | Set default payment method |
| `/api/payments/delete` | DELETE | Delete payment method |
| `/api/payments/webhook` | POST | Payments webhook |
| `/api/products/quick-view` | GET | Quick-view data for modal |
| `/api/orders/:id/track` | GET | Order tracking info |

### Server Actions

- `orders.ts` — Order management (confirm received, cancel, report issue)
- `payments.ts` — Payment method management

### DB Tables

| Table | Purpose |
|-------|---------|
| `orders` | Orders with Stripe payment intent tracking, status state machine |
| `order_items` | Line items linking orders → products → sellers, with tracking info |
| `cart_items` | Server-backed shopping cart (user_id + product_id + quantity) |
| `wishlists` | Saved products with optional sharing token |
| `notifications` | In-app notifications (purchase, order_status, price_drop, etc.) |

### Special Patterns

- **Product quick-view overlay**: implemented via the global Drawer system (Dialog on desktop, Drawer on mobile) with data fetched from `GET /api/products/quick-view`
- **Guest checkout**: supported (no auth required for `/checkout`)
- **Idempotent webhooks**: Stripe webhook deduplication prevents double order creation

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| R4.5: Cancel order | 🟡 In progress | Pre-shipment cancellation only; post-shipment requires dispute flow |
| R8.7: Related items | ⬜ V1.1 | Algorithm TBD — likely category + attribute similarity |
| R9.5: Wishlist sharing | ⬜ Not started | DB schema exists (`wishlists.share_token`), UI not exposed |
| Category → PDP modal | ⬜ Missing | `@modal` slot exists only for search, not category pages |

## Cross-References

- [PAYMENTS.md](../domain/PAYMENTS.md) — Stripe payment intents, Buyer Protection fee formula, webhook processing
- [DATABASE.md](../domain/DATABASE.md) — Orders schema, cart_items, wishlists
- [ROUTES.md](../domain/ROUTES.md) — (main), (checkout), (account), [username] route groups
- [API.md](../domain/API.md) — Checkout and payment endpoints
- [monetization.md](./monetization.md) — Buyer Protection fee tiers by plan
- [trust-safety.md](./trust-safety.md) — Dispute flow, buyer protection claims

---

*Last updated: 2026-02-13*
