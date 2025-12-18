# 🚀 PRODUCTION PUSH PLAN - COMPREHENSIVE AUDIT

> **Created:** December 2024  
> **Goal:** Full production readiness audit covering backend/frontend alignment, all features, and complete cleanup  
> **Status:** 🔴 PENDING

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Backend + Frontend Alignment](#backend--frontend-alignment)
3. [Auth, Logins & Signups](#auth-logins--signups)
4. [Onboarding & Profiles](#onboarding--profiles)
5. [UI/UX Audit](#uiux-audit)
6. [Wishlists](#wishlists)
7. [Messages/Chat](#messageschat)
8. [Ratings & Reviews](#ratings--reviews)
9. [Order Management](#order-management)
10. [Account Management](#account-management)
11. [Plans & Subscriptions](#plans--subscriptions)
12. [Payments](#payments)
13. [Cleanup: Dead Code & Files](#cleanup-dead-code--files)
14. [Cleanup: TODOs & Comments](#cleanup-todos--comments)
15. [Cleanup: Demo & Mock Data](#cleanup-demo--mock-data)
16. [Cleanup: Scripts](#cleanup-scripts)
17. [Cleanup: Markdown Files](#cleanup-markdown-files)
18. [Tech Debt](#tech-debt)
19. [Pre-Launch Checklist](#pre-launch-checklist)

---

## Executive Summary

### Project Stats
| Metric | Count | Status |
|--------|-------|--------|
| Unused Files | 92 | 🔴 REMOVE |
| Unused Dependencies | 21 | 🔴 REMOVE |
| Unused Exports | 206 | 🟡 REVIEW |
| TODO/FIXME Comments | 15+ | 🔴 RESOLVE |
| Console.log Statements | 50+ | 🔴 REMOVE |
| Demo/Mock Routes | 3 | 🔴 REMOVE |
| Markdown Docs | 34 | 🟡 CONSOLIDATE |
| Scripts | 9 | 🟡 REVIEW |

### Critical Priority Items
1. **Remove mock data** from product pages (fake seller stats, reviews)
2. **Remove demo routes** (`/demo`, `/demo1`, `/component-audit`)
3. **Clean unused dependencies** (21 packages)
4. **Clean unused files** (92 files)
5. **Remove console.log statements** (50+ instances)

---

## Backend + Frontend Alignment

### Supabase Client Architecture
| Client | Purpose | Cacheable |
|--------|---------|-----------|
| `createClient()` | Auth operations (cart, wishlist, orders) | ❌ NO |
| `createStaticClient()` | Public data (products, categories) | ✅ YES |
| `createAdminClient()` | Admin bypass RLS | ❌ NO |

### Server Actions (`app/actions/`)
| File | Purpose | Status |
|------|---------|--------|
| `blocked-users.ts` | Block/unblock users | 🟡 VERIFY |
| `buyer-feedback.ts` | Buyer ratings | 🟡 VERIFY |
| `checkout.ts` | Checkout process | 🟡 VERIFY |
| `notifications.ts` | User notifications | 🔴 UNUSED |
| `orders.ts` | Order management | 🟡 VERIFY |
| `products.ts` | Product CRUD | 🟡 VERIFY |
| `profile.ts` | Profile management | 🟡 VERIFY |
| `revalidate.ts` | Cache revalidation | 🔴 UNUSED |
| `reviews.ts` | Product reviews | 🟡 VERIFY |
| `seller-feedback.ts` | Seller ratings | 🟡 VERIFY |
| `seller-follows.ts` | Follow sellers | 🟡 VERIFY |
| `subscriptions.ts` | Plan subscriptions | 🟡 VERIFY |
| `username.ts` | Username management | 🟡 VERIFY |

### API Routes (`app/api/`)
| Route | Purpose | Status |
|-------|---------|--------|
| `auth/` | Auth callbacks | 🟡 VERIFY |
| `badges/` | Badge system | 🟡 VERIFY |
| `billing/` | Stripe billing | 🟡 VERIFY |
| `boost/` | Product boosting | 🟡 VERIFY |
| `categories/` | Category data | 🟡 VERIFY |
| `checkout/` | Checkout webhooks | 🟡 VERIFY |
| `debug-auth/` | Auth debugging | 🔴 REMOVE (dev only) |
| `geo/` | Geolocation | 🟡 VERIFY |
| `payments/` | Payment processing | 🟡 VERIFY |
| `plans/` | Subscription plans | 🟡 VERIFY |
| `products/` | Product operations | 🟡 VERIFY |
| `revalidate/` | ISR revalidation | 🟡 VERIFY |
| `seller/` | Seller operations | 🟡 VERIFY |
| `stores/` | Store management | 🟡 VERIFY |
| `subscriptions/` | Stripe subscriptions | 🟡 VERIFY |
| `upload-chat-image/` | Chat image upload | 🟡 VERIFY |
| `upload-image/` | General image upload | 🟡 VERIFY |

### ⚠️ Action Items
- [ ] Verify all server actions connect to real Supabase data
- [ ] Remove `/api/debug-auth/` before production
- [ ] Ensure all API routes have proper error handling
- [ ] Verify RLS policies are correctly enforced
- [ ] Test cache invalidation on mutations

---

## Auth, Logins & Signups

### Auth Routes (`app/[locale]/(auth)/auth/`)
| Route | Purpose | Status |
|-------|---------|--------|
| `login/` | User login | 🟡 VERIFY |
| `sign-up/` | User registration | 🟡 VERIFY |
| `sign-up-success/` | Registration success | 🟡 VERIFY |
| `forgot-password/` | Password reset request | 🟡 VERIFY |
| `reset-password/` | Password reset form | 🟡 VERIFY |
| `welcome/` | Onboarding welcome | 🟡 VERIFY |
| `error/` | Auth error handling | 🟡 VERIFY |

### Auth Components
| Component | Location | Status |
|-----------|----------|--------|
| `AuthStateListener` | `components/auth-state-listener.tsx` | 🟡 VERIFY |
| `SignOutButton` | `components/sign-out-button.tsx` | 🔴 UNUSED |

### Validation Schemas (`lib/validations/auth.ts`)
| Schema | Purpose | Status |
|--------|---------|--------|
| `passwordSchema` | Password validation | 🔴 UNUSED EXPORT |
| `emailSchema` | Email validation | 🔴 UNUSED EXPORT |
| `usernameSchema` | Username validation | 🔴 UNUSED EXPORT |
| `RESERVED_USERNAMES` | Reserved names list | 🔴 UNUSED EXPORT |
| `changePasswordSchema` | Password change | 🔴 UNUSED EXPORT |
| `changeEmailSchema` | Email change | 🔴 UNUSED EXPORT |

### ⚠️ Action Items
- [ ] Test complete login flow (email/password)
- [ ] Test complete signup flow
- [ ] Test password reset flow
- [ ] Verify email verification works
- [ ] Test OAuth providers (if enabled)
- [ ] Review and clean up unused validation exports
- [ ] Remove console.log from `auth-state-listener.tsx`

---

## Onboarding & Profiles

### Profile Routes (`app/[locale]/(account)/account/profile/`)
| Feature | Status |
|---------|--------|
| View profile | 🟡 VERIFY |
| Edit profile | 🟡 VERIFY |
| Avatar upload | 🟡 VERIFY |
| Username change | 🟡 VERIFY |

### Profile Actions (`app/actions/profile.ts`)
| Function | Purpose | Status |
|----------|---------|--------|
| `getProfile` | Get user profile | 🔴 UNUSED EXPORT |
| `deleteAccount` | Delete account | 🔴 UNUSED EXPORT |

### Username Actions (`app/actions/username.ts`)
| Function | Purpose | Status |
|----------|---------|--------|
| `getPublicProfile` | Public profile view | 🔴 UNUSED EXPORT |
| `getCurrentUserProfile` | Current user profile | 🔴 UNUSED EXPORT |
| `hasUsername` | Check username exists | 🔴 UNUSED EXPORT |

### ⚠️ Action Items
- [ ] Verify profile creation on signup
- [ ] Test profile editing
- [ ] Test avatar upload to Supabase storage
- [ ] Verify username uniqueness
- [ ] Review unused export functions

---

## UI/UX Audit

### Mobile Responsiveness
| Page | Status | Notes |
|------|--------|-------|
| Home | 🟡 VERIFY | Check carousel on mobile |
| Product | 🟡 VERIFY | Touch targets, image zoom |
| Cart | 🟡 VERIFY | Checkout button placement |
| Account | 🟡 VERIFY | Tab navigation |
| Search | 🟡 VERIFY | Filter modal |

### Key UI Components
| Component | Location | Status |
|-----------|----------|--------|
| Header | `components/header/` | 🟡 VERIFY |
| Footer | `components/footer/` | 🟡 VERIFY |
| Product Card | `components/product-card.tsx` | 🟡 VERIFY |
| Product Gallery | `components/product-gallery.tsx` | 🟡 VERIFY |
| Cart Drawer | `components/cart-drawer.tsx` | 🟡 VERIFY |

### Unused UI Components (92 total - partial list)
```
components/analytics.tsx
components/app-sidebar.tsx
components/attribute-filters.tsx
components/breadcrumb.tsx
components/category-sidebar.tsx
components/category-subheader.tsx
components/data-table.tsx
components/error-boundary.tsx
components/header-dropdowns.tsx
components/image-upload.tsx
components/language-switcher.tsx
components/main-nav.tsx
components/mega-menu.tsx
components/mobile-search-bar.tsx
components/product-form-enhanced.tsx
components/product-form.tsx
components/product-price.tsx
components/product-row.tsx
components/product-variant-selector.tsx
components/promo-banner-strip.tsx
components/section-cards.tsx
components/seller-card.tsx
components/sign-out-button.tsx
components/sticky-add-to-cart.tsx
components/sticky-checkout-button.tsx
components/tabbed-product-section.tsx
components/theme-provider.tsx
components/upgrade-banner.tsx
```

### ⚠️ Action Items
- [ ] Audit all pages on mobile (375px, 390px)
- [ ] Verify touch targets are 44px minimum
- [ ] Test dark mode (if enabled)
- [ ] Remove all 92 unused component files
- [ ] Ensure loading states on all async operations

---

## Wishlists

### Wishlist Routes
| Route | Purpose | Status |
|-------|---------|--------|
| `(account)/account/wishlist/` | Authenticated wishlist | 🟡 VERIFY |
| `(main)/wishlist/` | Public wishlist view | 🟡 VERIFY |

### Wishlist Components
| Component | Location | Status |
|-----------|----------|--------|
| `WishlistGrid` | `components/account-wishlist-grid.tsx` | 🟡 VERIFY |
| `WishlistStats` | `components/account-wishlist-stats.tsx` | 🟡 VERIFY |
| `WishlistToolbar` | `components/account-wishlist-toolbar.tsx` | 🟡 VERIFY |

### Wishlist Context
| File | Location | Status |
|------|----------|--------|
| `WishlistContext` | `lib/contexts/wishlist-context.tsx` | 🟡 VERIFY |

### ⚠️ Action Items
- [ ] Test add to wishlist
- [ ] Test remove from wishlist
- [ ] Verify wishlist persistence (Supabase)
- [ ] Test wishlist sharing (if feature exists)
- [ ] Verify empty state display

---

## Messages/Chat

### Chat Routes
| Route | Purpose | Status |
|-------|---------|--------|
| `(chat)/` | Chat interface | 🟡 VERIFY |

### Chat Components
| Component | Location | Status |
|-----------|----------|--------|
| `ChatInterface` | `components/chat-interface.tsx` | 🟡 VERIFY |
| `ConversationList` | `components/conversation-list.tsx` | 🔴 HAS TODO |
| `ContactSellerButton` | `components/contact-seller-button.tsx` | 🟡 VERIFY |

### Chat Context
| File | Location | Status |
|------|----------|--------|
| `MessageContext` | `lib/contexts/message-context.tsx` | 🟡 VERIFY |

### ⚠️ TODOs in Chat
```typescript
// components/conversation-list.tsx:160
const isOwnMessage = false // TODO: Check if last message was sent by current user
```

### ⚠️ Action Items
- [ ] Fix TODO in `conversation-list.tsx`
- [ ] Test message sending
- [ ] Test message receiving (real-time)
- [ ] Test image upload in chat
- [ ] Verify unread message counts
- [ ] Test conversation list sorting

---

## Ratings & Reviews

### Reviews Actions (`app/actions/reviews.ts`)
| Function | Purpose | Status |
|----------|---------|--------|
| `submitReview` | Submit product review | 🔴 UNUSED EXPORT |
| `updateReview` | Edit review | 🔴 UNUSED EXPORT |
| `deleteReview` | Delete review | 🔴 UNUSED EXPORT |
| `getProductReviews` | Get reviews for product | 🔴 UNUSED EXPORT |
| `getUserReviews` | Get user's reviews | 🔴 UNUSED EXPORT |
| `respondToReview` | Seller response | 🔴 UNUSED EXPORT |
| `canUserReviewProduct` | Check eligibility | 🔴 UNUSED EXPORT |

### Seller Feedback Actions (`app/actions/seller-feedback.ts`)
| Function | Purpose | Status |
|----------|---------|--------|
| `updateSellerFeedback` | Update feedback | 🔴 UNUSED EXPORT |
| `deleteSellerFeedback` | Delete feedback | 🔴 UNUSED EXPORT |
| `getSellerFeedback` | Get feedback | 🔴 UNUSED EXPORT |
| `canUserLeaveFeedback` | Check eligibility | 🔴 UNUSED EXPORT |
| `respondToFeedback` | Seller response | 🔴 UNUSED EXPORT |

### Buyer Feedback Actions (`app/actions/buyer-feedback.ts`)
| Function | Purpose | Status |
|----------|---------|--------|
| `canSellerRateBuyer` | Check eligibility | 🔴 UNUSED EXPORT |
| `getBuyerReceivedRatings` | Get buyer ratings | 🔴 UNUSED EXPORT |
| `getPublicBuyerFeedback` | Public buyer feedback | 🔴 UNUSED EXPORT |
| `getSellerGivenFeedback` | Seller's given feedback | 🔴 UNUSED EXPORT |
| `updateBuyerFeedback` | Update feedback | 🔴 UNUSED EXPORT |
| `deleteBuyerFeedback` | Delete feedback | 🔴 UNUSED EXPORT |

### Review Components
| Component | Location | Status |
|-----------|----------|--------|
| `ReviewsSectionServer` | `components/reviews-section-server.tsx` | 🔴 UNUSED |
| `ReviewsSectionClient` | `components/reviews-section-client.tsx` | 🔴 UNUSED |

### 🔴 CRITICAL: Mock Reviews
**Problem:** Reviews section falls back to hardcoded mock data when no real reviews exist.

**Files with Mock Data:**
- `components/product-page-content-new.tsx` (lines ~147-193)
- `components/reviews-section.tsx` (lines ~36-82)

### ⚠️ Action Items
- [ ] **CRITICAL: Remove mock review data**
- [ ] Implement "No reviews yet" empty state
- [ ] Test review submission flow
- [ ] Test seller response to reviews
- [ ] Verify review eligibility (purchased products only)
- [ ] Test rating calculations

---

## Order Management

### Order Routes (`app/[locale]/(account)/account/orders/`)
| Route | Purpose | Status |
|-------|---------|--------|
| `page.tsx` | Order list | 🟡 VERIFY |
| `[id]/` | Order detail | 🔴 HAS TODO |

### Order Actions (`app/actions/orders.ts`)
| Function | Purpose | Status |
|----------|---------|--------|
| `getBuyerOrders` | Get buyer's orders | 🔴 UNUSED EXPORT |

### Order Components
| Component | Location | Status |
|-----------|----------|--------|
| `OrdersGrid` | `components/account-orders-grid.tsx` | 🟡 VERIFY |
| `OrdersStats` | `components/account-orders-stats.tsx` | 🟡 VERIFY |
| `OrdersToolbar` | `components/account-orders-toolbar.tsx` | 🟡 VERIFY |
| `BuyerOrderActions` | `components/buyer-order-actions.tsx` | 🟡 VERIFY |
| `OrderStatusBadge` | `components/order-status-badge.tsx` | 🟡 VERIFY |

### Business Order Components
| Component | Location | Status |
|-----------|----------|--------|
| `OrderDetailView` | `components/business/order-detail-view.tsx` | 🔴 HAS TODO |
| `OrdersTable` | `components/business/orders-table.tsx` | 🔴 HAS TODO |

### ⚠️ TODOs in Order Management
```typescript
// components/business/order-detail-view.tsx:155
// TODO: Implement status update action

// components/business/orders-table.tsx:272
// TODO: Implement bulk status update action

// app/[locale]/(account)/account/orders/[id]/order-detail-content.tsx
// TODO: (verify if exists)
```

### ⚠️ Action Items
- [ ] Fix TODO: implement status update action
- [ ] Fix TODO: implement bulk status update action
- [ ] Test order creation flow
- [ ] Test order status updates
- [ ] Test order cancellation
- [ ] Verify order history persistence
- [ ] Test order detail view

---

## Account Management

### Account Routes (`app/[locale]/(account)/account/`)
| Route | Purpose | Status |
|-------|---------|--------|
| `page.tsx` | Account dashboard | 🟡 VERIFY |
| `profile/` | Profile settings | 🟡 VERIFY |
| `addresses/` | Address management | 🟡 VERIFY |
| `billing/` | Billing info | 🟡 VERIFY |
| `payments/` | Payment methods | 🟡 VERIFY |
| `security/` | Security settings | 🟡 VERIFY |
| `orders/` | Order history | 🟡 VERIFY |
| `wishlist/` | Saved items | 🟡 VERIFY |
| `following/` | Followed sellers | 🟡 VERIFY |
| `selling/` | Seller dashboard | 🟡 VERIFY |
| `sales/` | Sales history | 🟡 VERIFY |
| `plans/` | Subscription plans | 🟡 VERIFY |

### Account Components
| Component | Location | Status |
|-----------|----------|--------|
| `AccountHeader` | `components/account-header.tsx` | 🟡 VERIFY |
| `AccountSidebar` | `components/account-sidebar.tsx` | 🟡 VERIFY |
| `AccountStatsCards` | `components/account-stats-cards.tsx` | 🟡 VERIFY |
| `AccountTabBar` | `components/account-tab-bar.tsx` | 🟡 VERIFY |
| `AccountHeroCard` | `components/account-hero-card.tsx` | 🟡 VERIFY |
| `AccountBadges` | `components/account-badges.tsx` | 🟡 VERIFY |
| `AccountChart` | `components/account-chart.tsx` | 🟡 VERIFY |
| `AccountRecentActivity` | `components/account-recent-activity.tsx` | 🟡 VERIFY |
| `AddressesGrid` | `components/account-addresses-grid.tsx` | 🟡 VERIFY |
| `AddressesStats` | `components/account-addresses-stats.tsx` | 🟡 VERIFY |

### ⚠️ Action Items
- [ ] Test all account sections load correctly
- [ ] Verify address CRUD operations
- [ ] Test payment method management
- [ ] Test security settings (password change, 2FA if enabled)
- [ ] Verify seller dashboard stats are real data

---

## Plans & Subscriptions

### Plans Routes
| Route | Purpose | Status |
|-------|---------|--------|
| `(plans)/` | Plans listing | 🟡 VERIFY |
| `(account)/account/plans/` | User's plan | 🟡 VERIFY |

### Plans API (`app/api/plans/`)
| Endpoint | Purpose | Status |
|----------|---------|--------|
| `route.ts` | Plan operations | 🟡 VERIFY |

### Subscription Actions (`app/actions/subscriptions.ts`)
| Function | Purpose | Status |
|----------|---------|--------|
| `getSubscriptionDetails` | Get current subscription | 🔴 UNUSED EXPORT |
| `getAvailableUpgrades` | Get upgrade options | 🔴 UNUSED EXPORT |

### Plans Components
| Component | Location | Status |
|-----------|----------|--------|
| `PlanCard` | `components/plan-card.tsx` | 🔴 UNUSED EXPORT |
| `PlansModalTrigger` | `components/plans-modal.tsx` | 🔴 UNUSED EXPORT |
| `usePlansModal` | `components/plans-modal.tsx` | 🔴 UNUSED EXPORT |

### ⚠️ TODOs in Plans
```typescript
// lib/auth/business.ts:746
pendingReviews: 0, // TODO: Add when reviews table is set up
```

### ⚠️ Action Items
- [ ] Test plan selection flow
- [ ] Test upgrade flow
- [ ] Test downgrade flow
- [ ] Verify Stripe integration
- [ ] Test plan limit enforcement
- [ ] Verify upgrade prompts appear when limits reached

---

## Payments

### Payments API (`app/api/`)
| Endpoint | Purpose | Status |
|----------|---------|--------|
| `payments/` | Payment processing | 🟡 VERIFY |
| `billing/` | Billing management | 🟡 VERIFY |
| `checkout/` | Checkout webhooks | 🟡 VERIFY |

### Checkout Routes
| Route | Purpose | Status |
|-------|---------|--------|
| `(checkout)/checkout/` | Checkout flow | 🟡 VERIFY |

### Checkout Components
| Component | Location | Status |
|-----------|----------|--------|
| `CheckoutHeader` | `components/checkout-header.tsx` | 🟡 VERIFY |
| `CheckoutFooter` | `components/checkout-footer.tsx` | 🟡 VERIFY |

### Checkout Actions (`app/actions/checkout.ts`)
| Status | Notes |
|--------|-------|
| 🟡 VERIFY | Review for mock shipping data |

### 🔴 CRITICAL: Mock Shipping Data
**Problem:** Checkout uses hardcoded shipping methods instead of real seller/product data.

### ⚠️ TODOs in Payments
```typescript
// lib/auth/business.ts:782-783
hasShippingSetup: true, // TODO: Add shipping settings
hasPaymentSetup: true, // TODO: Add payout settings
```

### ⚠️ Action Items
- [ ] **CRITICAL: Remove mock shipping methods**
- [ ] Test complete checkout flow
- [ ] Test Stripe payment processing
- [ ] Test webhook handling
- [ ] Verify order creation after payment
- [ ] Test failed payment handling
- [ ] Fix TODOs for shipping/payment setup

---

## Cleanup: Dead Code & Files

### Unused Files (92 total)

#### Components to Remove
```
components/analytics.tsx
components/app-sidebar.tsx
components/attribute-filters.tsx
components/breadcrumb.tsx
components/category-sidebar.tsx
components/category-subheader.tsx
components/data-table.tsx
components/error-boundary.tsx
components/header-dropdowns.tsx
components/image-upload.tsx
components/language-switcher.tsx
components/main-nav.tsx
components/mega-menu.tsx
components/mobile-search-bar.tsx
components/nav-documents.tsx
components/product-actions.tsx
components/product-form-enhanced.tsx
components/product-form.tsx
components/product-price.tsx
components/product-row.tsx
components/product-variant-selector.tsx
components/promo-banner-strip.tsx
components/rating-scroll-link.tsx
components/section-cards.tsx
components/seller-card.tsx
components/sign-out-button.tsx
components/sticky-add-to-cart.tsx
components/sticky-checkout-button.tsx
components/tabbed-product-section.tsx
components/theme-provider.tsx
components/upgrade-banner.tsx
```

#### Hooks to Remove
```
hooks/use-business-account.ts
hooks/use-header-height.ts
```

#### Lib Files to Remove
```
lib/category-icons.tsx
lib/currency.ts
lib/sell-form-schema-v3.ts
lib/toast-utils.ts
lib/data/badges.ts
lib/data/profile-data.ts
```

#### Actions to Remove
```
app/actions/notifications.ts
app/actions/revalidate.ts
```

#### Badge Components to Remove
```
components/badges/badge-progress.tsx
components/badges/index.ts
components/badges/seller-badge.tsx
components/badges/trust-score.tsx
```

#### Business Components to Remove
```
components/business/business-date-range-picker.tsx
components/business/business-page-header.tsx
```

#### Category Subheader Components to Remove
```
components/category-subheader/category-subheader.tsx
components/category-subheader/index.ts
components/category-subheader/mega-menu-banner.tsx
components/category-subheader/mega-menu-panel.tsx
components/category-subheader/more-categories-grid.tsx
```

#### Navigation Components to Remove
```
components/icons/index.ts
components/navigation/index.ts
components/navigation/mega-menu.tsx
```

#### Unused UI Components
```
components/ui/button-group.tsx
components/ui/calendar.tsx
components/ui/carousel.tsx
components/ui/chat-container.tsx
components/ui/code-block.tsx
components/ui/collapsible.tsx
components/ui/context-menu.tsx
components/ui/empty.tsx
components/ui/field.tsx
components/ui/input-group.tsx
components/ui/input-otp.tsx
components/ui/item.tsx
components/ui/kbd.tsx
components/ui/markdown.tsx
components/ui/menubar.tsx
components/ui/message.tsx
components/ui/prompt-input.tsx
components/ui/resizable.tsx
components/ui/scroll-button.tsx
components/ui/searchable-filter-list.tsx
components/ui/spinner.tsx
components/ui/toaster.tsx
components/ui/use-mobile.tsx
```

#### Sell Components to Remove
```
components/sell/schemas/index.ts
components/sell/schemas/listing.schema.ts
components/sell/schemas/store.schema.ts
```

#### Demo Components to Remove
```
app/[locale]/(main)/sell/demo1/_components/steps/details-step.tsx
app/[locale]/(main)/sell/demo1/_components/steps/photos-step.tsx
app/[locale]/(main)/sell/demo1/_components/steps/title-step.tsx
```

### Unused Dependencies (21)

#### Dependencies to Remove from `package.json`
```json
{
  "@dnd-kit/core": "^6.3.1",           // REMOVE
  "@dnd-kit/modifiers": "^9.0.0",      // REMOVE
  "@dnd-kit/sortable": "^10.0.0",      // REMOVE
  "@dnd-kit/utilities": "^3.2.2",      // REMOVE
  "@radix-ui/react-collapsible": "^1.1.2",   // REMOVE
  "@radix-ui/react-context-menu": "^2.2.4",  // REMOVE
  "@radix-ui/react-menubar": "^1.1.4",       // REMOVE (verify)
  "embla-carousel": "8.6.0",           // REMOVE
  "embla-carousel-autoplay": "^8.6.0", // REMOVE
  "tailwindcss-animate": "^1.0.7"      // REMOVE
}
```

#### DevDependencies to Remove
```json
{
  "cross-env": "^10.1.0",    // REMOVE
  "shadcn": "^3.5.0",        // REMOVE (CLI tool, not runtime)
  "supabase": "^2.58.5"      // REMOVE (CLI tool, not runtime)
}
```

### Unused Exports (206 total - key ones)

See full list in `audit-results/knip-report.txt` lines 119-405

Key categories:
- Sidebar components (30+ exports)
- Category functions (4+ exports)
- Badge functions (10+ exports)
- Order status functions (4+ exports)
- Geolocation functions (6+ exports)
- Auth validation schemas (6+ exports)
- Reviews actions (7+ exports)
- Feedback actions (12+ exports)

### ⚠️ Action Items
- [ ] Remove all 92 unused files
- [ ] Remove 10+ unused dependencies
- [ ] Clean up 206 unused exports (or document intentional)
- [ ] Run `pnpm install` after package.json changes
- [ ] Verify build succeeds after cleanup

---

## Cleanup: TODOs & Comments

### TODOs Found in Code

| File | Line | TODO |
|------|------|------|
| `lib/auth/business.ts` | 746 | `pendingReviews: 0, // TODO: Add when reviews table is set up` |
| `lib/auth/business.ts` | 782 | `hasShippingSetup: true, // TODO: Add shipping settings` |
| `lib/auth/business.ts` | 783 | `hasPaymentSetup: true, // TODO: Add payout settings` |
| `components/conversation-list.tsx` | 160 | `const isOwnMessage = false // TODO: Check if last message was sent by current user` |
| `components/sell/sections/pricing-section.tsx` | 233 | `const isBg = false; // TODO: Add locale prop` |
| `components/business/order-detail-view.tsx` | 155 | `// TODO: Implement status update action` |
| `components/business/orders-table.tsx` | 272 | `// TODO: Implement bulk status update action` |

### ⚠️ Action Items
- [ ] Fix or remove each TODO
- [ ] Document any intentionally deferred TODOs

---

## Cleanup: Demo & Mock Data

### Demo Routes to Remove
| Route | Path | Action |
|-------|------|--------|
| Demo Page | `app/[locale]/(main)/demo/page.tsx` | 🔴 DELETE |
| Component Audit | `app/[locale]/(main)/component-audit/page.tsx` | 🔴 DELETE |
| Sell Demo | `app/[locale]/(main)/sell/demo1/` | 🔴 DELETE FOLDER |

### Mock Data to Remove

#### Product Page Mock Data
**File:** `components/product-page-content-new.tsx`
**Lines:** ~147-193 (approximate)
```typescript
// REMOVE: Fake seller stats
positive_feedback_percentage: 100,
total_items_sold: 505000,
response_time_hours: 24,
feedback_score: 798,
feedback_count: 746,
```

#### Mock Reviews
**File:** `components/reviews-section.tsx`
**Lines:** ~36-82
- Remove hardcoded Bulgarian reviews
- Implement proper empty state

#### Mock Shipping
**File:** `app/actions/checkout.ts` (verify)
- Remove hardcoded shipping methods
- Fetch from seller/product data

### ⚠️ Action Items
- [ ] Delete `app/[locale]/(main)/demo/`
- [ ] Delete `app/[locale]/(main)/component-audit/`
- [ ] Delete `app/[locale]/(main)/sell/demo1/`
- [ ] Remove mock seller stats from product page
- [ ] Remove mock reviews
- [ ] Remove mock shipping methods
- [ ] Implement proper empty states for all sections

---

## Cleanup: Scripts

### Scripts Directory (`scripts/`)
| File | Purpose | Keep? |
|------|---------|-------|
| `apply-migration.js` | Apply DB migrations | 🟡 REVIEW |
| `create-user.js` | Create test user | 🔴 REMOVE |
| `migrations.sql` | SQL migrations | 🟡 MOVE to supabase/ |
| `seed-data.ts` | Seed database | 🔴 REMOVE |
| `seed.js` | Seed database (JS) | 🔴 REMOVE |
| `seed.ts` | Seed database (TS) | 🔴 REMOVE |
| `setup-db.ts` | Setup database | 🔴 REMOVE |
| `test-supabase-connection.ts` | Test connection | 🔴 REMOVE |
| `verify-product.js` | Verify products | 🔴 REMOVE |

### Console.log Cleanup (Scripts)
All scripts contain extensive console.log statements - entire files should be removed or moved to a dev-tools folder.

### ⚠️ Action Items
- [ ] Remove all seed scripts (use Supabase migrations instead)
- [ ] Remove test/verify scripts
- [ ] Move `migrations.sql` to `supabase/migrations/` if needed
- [ ] Remove or document `apply-migration.js`

---

## Cleanup: Markdown Files

### Markdown Files (34 total)
| File | Purpose | Action |
|------|---------|--------|
| `ACCOUNT.md` | Account docs | 🟡 CONSOLIDATE |
| `ACCOUNT_PAGE_AUDIT.md` | Audit notes | 🔴 ARCHIVE/REMOVE |
| `ACCOUNT_UX_UI_IMPROVEMENT_PLAN.md` | UX plan | 🔴 ARCHIVE/REMOVE |
| `APP.md` | App docs | 🟡 CONSOLIDATE |
| `BUSINESS_DASHBOARD_PRD.md` | PRD | 🔴 ARCHIVE |
| `BUSINESS_MODEL.md` | Business model | 🟡 KEEP (docs/) |
| `CACHING.md` | Caching docs | 🔴 OUTDATED - REMOVE |
| `CATEGORIES.md` | Category docs | 🟡 CONSOLIDATE |
| `CODEBASE_AUDIT_PLAN.md` | Audit plan | 🔴 ARCHIVE/REMOVE |
| `COMPONENTS.md` | Component docs | 🟡 CONSOLIDATE |
| `FRONTEND.md` | Frontend docs | 🟡 CONSOLIDATE |
| `fullaudit.md` | Full audit | 🔴 ARCHIVE/REMOVE |
| `GEO_WELCOME_MODAL_PLAN.md` | Feature plan | 🔴 ARCHIVE/REMOVE |
| `guide1.md` | Guide | 🔴 REVIEW |
| `MASTER_REFACTOR.md` | Refactor plan | 🔴 ARCHIVE/REMOVE |
| `MOBILE_PRODUCT_PAGE_FIXES.md` | Mobile fixes | 🔴 ARCHIVE/REMOVE |
| `MOBILE_UI_UX_AUDIT.md` | Mobile audit | 🔴 ARCHIVE/REMOVE |
| `PRODUCTION_AUDIT_FINAL.md` | Audit | 🔴 ARCHIVE/REMOVE |
| `PRODUCTION_CLEANUP.md` | Cleanup plan | 🔴 ARCHIVE/REMOVE |
| `PRODUCTION_FIX_SUMMARY.md` | Fix summary | 🔴 ARCHIVE/REMOVE |
| `PRODUCTION_PUSH.md` | Push plan | 🔴 SUPERSEDED |
| `PRODUCTION_PUSH_PLAN_DEC16.md` | Push plan | 🔴 SUPERSEDED |
| `PRODUCT_PAGE_REFACTOR.md` | Refactor plan | 🔴 ARCHIVE/REMOVE |
| `PURCHASE_NOTIFICATION_SYSTEM.md` | Feature plan | 🔴 ARCHIVE/REMOVE |
| `SERVER_CLIENT_CACHING_AUDIT.md` | Caching audit | 🟡 KEEP |
| `STYLING.md` | Style guide | 🟡 CONSOLIDATE |
| `supabase1.md` | Supabase notes | 🔴 ARCHIVE/REMOVE |
| `VERIFICATION_BADGE_SYSTEM.md` | Feature plan | 🔴 ARCHIVE/REMOVE |

### Recommended Final Structure
```
/docs
├── README.md          # Main documentation index
├── ARCHITECTURE.md    # Combined app/frontend/caching docs
├── COMPONENTS.md      # Component library docs
├── BUSINESS_MODEL.md  # Business documentation
├── API.md             # API documentation
└── /archive           # Historical audit documents
```

### ⚠️ Action Items
- [ ] Create `/docs/archive/` folder
- [ ] Move audit/plan files to archive
- [ ] Consolidate active docs
- [ ] Remove superseded production push files
- [ ] Create single source of truth README

---

## Tech Debt

### Code Quality Issues

#### Console.log Statements (50+)
**Primary locations:**
- `scripts/*` - All files (to be removed)
- `components/auth-state-listener.tsx`
- `components/category-subheader.tsx`
- `app/api/*/route.ts` - Various API routes
- `components/sell/*` - Sell form components

#### Missing Type Safety
- Review any `any` types
- Ensure strict TypeScript compliance

#### Error Handling
- Verify all API routes have try/catch
- Ensure user-friendly error messages
- Check loading states

### ⚠️ Action Items
- [ ] Remove all console.log from production code
- [ ] Replace console.error with proper error tracking
- [ ] Add Sentry or similar for production errors
- [ ] Review and fix any `any` types
- [ ] Ensure proper error boundaries

---

## Pre-Launch Checklist

### 🔴 Critical (Must Do)
- [ ] Remove ALL mock data (seller stats, reviews, shipping)
- [ ] Remove demo routes (/demo, /demo1, /component-audit)
- [ ] Remove 92 unused files
- [ ] Remove console.log statements
- [ ] Remove `/api/debug-auth/` endpoint
- [ ] Test complete auth flow
- [ ] Test complete checkout flow
- [ ] Test payment processing

### 🟠 High Priority
- [ ] Remove 21 unused dependencies
- [ ] Fix all TODOs or document deferral
- [ ] Clean up unused exports
- [ ] Remove/archive 20+ markdown files
- [ ] Remove all scripts/ (or move to dev-tools)
- [ ] Verify all features work with real data
- [ ] Mobile responsiveness audit

### 🟡 Medium Priority
- [ ] Consolidate documentation
- [ ] Add proper error tracking
- [ ] Performance audit
- [ ] SEO verification
- [ ] Accessibility audit

### 🟢 Post-Launch
- [ ] Monitor error rates
- [ ] Set up analytics
- [ ] User feedback collection
- [ ] Performance monitoring

---

## Execution Commands

### Remove Unused Dependencies
```bash
pnpm remove @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities @radix-ui/react-collapsible @radix-ui/react-context-menu embla-carousel embla-carousel-autoplay tailwindcss-animate cross-env
```

### Find Console.logs
```bash
grep -r "console\." --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".next"
```

### Find TODOs
```bash
grep -r "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" | grep -v node_modules
```

### Verify Build
```bash
pnpm build
```

### Type Check
```bash
pnpm exec tsc --noEmit
```

---

## Summary

**Total Estimated Cleanup Time:** 8-12 hours

| Category | Items | Est. Time |
|----------|-------|-----------|
| Remove unused files | 92 | 1 hour |
| Remove unused deps | 21 | 30 min |
| Remove mock data | 3 areas | 2 hours |
| Remove demo routes | 3 | 30 min |
| Fix TODOs | 7 | 2 hours |
| Remove console.logs | 50+ | 1 hour |
| Clean scripts | 9 | 30 min |
| Consolidate docs | 34 | 1 hour |
| Testing | All features | 3 hours |

**Priority Order:**
1. Mock data removal (user-facing, deceptive)
2. Demo route removal (unprofessional)
3. Debug endpoint removal (security)
4. Unused files/deps (bloat)
5. TODOs and console.logs (code quality)
6. Documentation cleanup (maintenance)
