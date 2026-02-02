# Playwright UI/UX Audit — Treido V1

> **Phase 5 of Production Push** — Comprehensive visual + functional testing across desktop and mobile viewports.

| Started | 2026-02-02 |
|---------|------------|
| Status | 🔄 In Progress (mobile deep-dive) |
| Tool | Playwright MCP via next-devtools |

---

## Progress Tracker

| Phase | Desktop | Mobile | Status |
|-------|---------|--------|--------|
| A: Auth Flows | ✅ | ✅ | Complete (see auth redirect issue) |
| B: Buyer Flows | ✅ | ❌ | Blocked (onboarding deadlock blocks cart/checkout) |
| C: Seller Flows | 🔄 | 🔄 | Partial (wizard tested; publish not executed) |
| D: Order Management | ⬜ | 🔄 | Partial (orders list route loads; deeper tests deferred for PII safety) |
| E: Account/Settings | 🔄 | 🔄 | Partial (account + chat tested) |

Legend: ✅ Complete | 🔄 Partial | ⬜ Not Started | ❌ Blocked

---

## Viewports Tested

| Viewport | Resolution | Device | Status |
|----------|------------|--------|--------|
| Desktop Large | 1920x1080 | Standard monitor | ✅ Tested |
| Desktop Medium | 1440x900 | Laptop | ⬜ Not Tested |
| Mobile iOS | 390x844 | iPhone 14 | ✅ Tested |
| Mobile Android | 360x740 | Standard Android | ⬜ Not Tested |

---

## Issues Summary

| Severity | Count | Desktop | Mobile |
|----------|-------|---------|--------|
| Critical | 2 | — | 2 |
| High | 3 | — | 3 |
| Medium | 1 | — | 1 |
| Low | 3 | — | 3 |

**Total Issues Found:** 9

### Critical blockers (ship-stoppers)
- **ISSUE-004**: Post-login redirect duplicates locale (`/<locale>/<locale>/account`) and lands on a 404
- **ISSUE-005**: Onboarding completion fails (`POST /<locale>/api/onboarding/complete` → 500), blocking cart/checkout via onboarding gate

### Next batch (high)
- **ISSUE-006**: Sell category step lacks validation feedback (Continue does nothing)
- **ISSUE-007**: Sell wizard reaches “Publish Listing” too early (incomplete details allowed)
- **ISSUE-002**: Onboarding gate blocks “public” routes for users with incomplete onboarding (cart/checkout deadlock)

---

## What Passed Testing ✅

### Auth (Desktop + Mobile)
- Signup form with all validation, password toggle, terms links
- Login form with remember me, forgot password link (⚠️ see auth redirect issue)
- Password reset request form
- Auth error page with recovery options

### Buyer Flows (Desktop + Mobile)
- Homepage with all sections (Promoted, Today's Offers, Fashion, Electronics, Automotive)
- Category navigation (24+ categories)
- Product cards (images, prices, discounts, ratings, wishlist)
- Today's Deals page (48 products)
- Product detail pages (full listing tested; add-to-cart works in-session)
- Mobile bottom navigation

### Seller Flows (Public)
- Sell page accessible without auth
- Create listing wizard Step 1 (title, photo upload UI)

### Account (Navigation)
- Account overview page
- Navigation links (Orders, Selling, Plans, Store)

---

## What Requires Authentication

The following features require a logged-in user session to fully test:
- Order management (view, track, cancel)
- Profile editing and address book
- Seller dashboard and order fulfillment
- Checkout completion (**currently blocked by onboarding deadlock**)
- Wishlist management

---

## Test Structure

```
playwright-audit/
├── 00-INDEX.md          # This file
├── desktop/
│   ├── auth.md          ✅ Complete
│   ├── buying.md        ✅ Complete
│   ├── selling.md       🔄 Partial
│   ├── orders.md        ⬜ Requires Auth
│   └── account.md       🔄 Partial
├── mobile/
│   ├── auth.md          ✅ Complete
│   ├── buying.md        ❌ Blocked (cart/checkout)
│   ├── selling.md       🔄 Partial
│   ├── orders.md        🔄 Partial
│   └── account.md       🔄 Partial
└── issues/
    ├── frontend.md      ✅ 9 issues logged
    └── backend.md       ✅ 1 issue logged
```

---

## Quick Links

| Audit | Desktop | Mobile |
|-------|---------|--------|
| Auth | [desktop/auth.md](./desktop/auth.md) | [mobile/auth.md](./mobile/auth.md) |
| Buying | [desktop/buying.md](./desktop/buying.md) | [mobile/buying.md](./mobile/buying.md) |
| Selling | [desktop/selling.md](./desktop/selling.md) | [mobile/selling.md](./mobile/selling.md) |
| Orders | [desktop/orders.md](./desktop/orders.md) | [mobile/orders.md](./mobile/orders.md) |
| Account | [desktop/account.md](./desktop/account.md) | [mobile/account.md](./mobile/account.md) |

| Issue Type | File |
|------------|------|
| Frontend Issues | [issues/frontend.md](./issues/frontend.md) |
| Backend Issues | [issues/backend.md](./issues/backend.md) |

---

## Related Documents

- [docs/13-PRODUCTION-PUSH.md](../../../../docs/13-PRODUCTION-PUSH.md)
- [docs/02-FEATURES.md](../../../../docs/02-FEATURES.md)
- [docs/05-ROUTES.md](../../../../docs/05-ROUTES.md)

---

*Last updated: 2026-02-02*
