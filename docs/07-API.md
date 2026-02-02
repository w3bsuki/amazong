# 07-API.md — Server Actions & API Endpoints

> **Purpose:** Complete reference for all server actions and REST API endpoints in the Treido marketplace.

| Scope | Server actions + API routes |
|-------|----------------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Quick Reference

- **Server Actions:** 13 files in `app/actions/`
- **API Routes:** 40+ endpoints in `app/api/`
- **Pattern:** Server Actions for mutations, API Routes for reads & webhooks
- **Auth:** Supabase Auth + RLS
- **Payments:** Stripe (Checkout, Connect, Subscriptions)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TREIDO API LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│  SERVER ACTIONS (app/actions/)                                      │
│  "use server" functions for mutations                               │
│  ├─ products.ts    → CRUD products, discounts                       │
│  ├─ orders.ts      → Order management, shipping                     │
│  ├─ profile.ts     → User profile, avatar                           │
│  ├─ reviews.ts     → Product reviews                                │
│  └─ ...13 files                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  API ROUTES (app/api/)                                              │
│  REST endpoints for reads, webhooks, integrations                   │
│  ├─ /api/products/* → Product feeds, search, categories             │
│  ├─ /api/checkout/* → Stripe checkout webhook                       │
│  ├─ /api/connect/*  → Stripe Connect onboarding                     │
│  └─ ...40+ endpoints                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Server Actions

### products.ts — Product Management

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `createProduct(input)` | Create new listing | Seller | `{ id: string }` |
| `updateProduct(id, input)` | Update product fields | Owner | `{ success }` |
| `deleteProduct(id)` | Delete listing | Owner | `{ success }` |
| `duplicateProduct(id)` | Clone product as draft | Owner | `{ id: string }` |
| `bulkUpdateProductStatus(ids, status)` | Batch status change | Seller | `{ updated: number }` |
| `bulkDeleteProducts(ids)` | Batch delete | Seller | `{ deleted: number }` |
| `setProductDiscountPrice(id, price)` | Apply discount | Owner | `{ success }` |
| `clearProductDiscount(id)` | Remove discount | Owner | `{ success }` |

**ProductInput Schema:**
```typescript
{
  title: string           // required, max 255
  description?: string
  price: number           // must be > 0
  compareAtPrice?: number // original/strike-through
  costPrice?: number      // seller-only
  sku?: string            // seller-only
  stock: number           // >= 0
  categoryId?: string     // must be leaf category
  status: "active" | "draft" | "archived" | "out_of_stock"
  condition: "new" | "used" | "refurbished" | "like_new" | "good" | "fair"
  images: string[]
}
```

---

### orders.ts — Order Management

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `getSellerOrders(status?)` | List seller's incoming orders | Seller | `OrderItem[]` |
| `getBuyerOrders()` | List buyer's purchases | Buyer | `OrderItem[]` |
| `getBuyerOrderDetails(orderId)` | Full order with items | Buyer | `Order` |
| `getSellerOrderStats()` | Dashboard counts by status | Seller | Stats object |
| `updateOrderItemStatus(id, status, tracking?, carrier?)` | Update fulfillment | Seller | `{ success }` |
| `buyerConfirmDelivery(orderItemId)` | Mark as delivered | Buyer | `{ success }` |
| `requestOrderCancellation(id, reason?)` | Cancel before shipped | Buyer | `{ success }` |
| `requestReturn(id, reason)` | Request return after delivery | Buyer | `{ success }` |
| `reportOrderIssue(id, type, description)` | Report problem | Buyer | `{ conversationId }` |

**Order Statuses:** `pending` → `received` → `processing` → `shipped` → `delivered`

---

### payments.ts — Payment Methods

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `createPaymentMethodSetupSession(locale?)` | Add new card | User | `{ url }` |
| `deletePaymentMethod(input)` | Remove saved card | User | `{ success }` |
| `setDefaultPaymentMethod(input)` | Set default | User | `{ success }` |

---

### profile.ts — Profile Management

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `updateProfile(formData)` | Update name, phone, region | User | `{ success }` |
| `uploadAvatar(formData)` | Upload custom avatar | User | `{ avatarUrl }` |
| `setAvatarUrl(formData)` | Set preset avatar | User | `{ avatarUrl }` |
| `deleteAvatar()` | Remove avatar | User | `{ success }` |
| `updateEmail(formData)` | Change email (sends confirmation) | User | `{ success }` |
| `updatePassword(formData)` | Change password | User | `{ success }` |

---

### username.ts — Username & Public Profile

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `checkUsernameAvailability(username)` | Validate availability | None | `{ available, error? }` |
| `setUsername(username)` | Set/change username | User | `{ success }` |
| `updatePublicProfile(data)` | Update bio, location, links | User | `{ success }` |
| `uploadBanner(formData)` | Upload store banner | User | `{ bannerUrl }` |
| `upgradeToBusinessAccount(data)` | Convert to business | User | `{ success }` |
| `downgradeToPersonalAccount()` | Revert to personal | User | `{ success }` |
| `getPublicProfile(username)` | Get public profile | None | Profile data |
| `getCurrentUserProfile()` | Get own full profile | User | Profile + private |
| `getUsernameChangeCooldown()` | Check 14-day cooldown | User | `{ canChange, daysRemaining? }` |

**Username Rules:** 3-30 chars, lowercase alphanumeric + underscore, 14-day change cooldown

---

### reviews.ts — Product Reviews

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `submitReview(input)` | Create product review | User | `{ review }` |
| `getProductReviews(productId)` | List reviews | None | `Review[]` |
| `canUserReview(productId)` | Check if can review | User | `{ canReview, reason? }` |
| `markReviewHelpful(reviewId)` | Increment helpful count | None | `{ newCount }` |
| `deleteReview(reviewId)` | Delete own review | Author | `{ success }` |

---

### subscriptions.ts — Seller Subscriptions

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `createSubscriptionCheckoutSession(args)` | Start subscription checkout | User | `{ url }` |
| `createBillingPortalSession(args?)` | Stripe billing portal | Subscriber | `{ url }` |
| `cancelSubscription()` | Cancel at period end | Subscriber | `{ success }` |
| `reactivateSubscription()` | Undo cancellation | Subscriber | `{ success }` |
| `downgradeToFreeTier()` | Immediate downgrade | User | `{ tier: "free" }` |

**Tiers:** free → starter → basic → premium → professional → business → enterprise

---

### boosts.ts — Listing Promotion

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `useSubscriptionBoost(productId)` | Use included boost | Seller | `{ boostsRemaining }` |
| `createBoostCheckoutSession(args)` | Purchase boost | Seller | `{ url }` |
| `getBoostStatus(productId)` | Check boost state | Owner | Status object |

---

### onboarding.ts — Post-Signup Flow

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `completePostSignupOnboarding(data, avatar?, cover?)` | Complete onboarding | User | `{ success }` |
| `checkOnboardingStatus(userId)` | Check if completed | None | `{ needsOnboarding }` |

---

### seller-follows.ts — Store Following

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `isFollowingSeller(sellerId)` | Check follow status | User | `boolean` |
| `followSeller(sellerId)` | Follow store | User | `{ success }` |
| `unfollowSeller(sellerId)` | Unfollow store | User | `{ success }` |

---

### buyer-feedback.ts — Seller→Buyer Ratings

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `submitBuyerFeedback(input)` | Rate buyer after delivery | Seller | `{ data }` |
| `canSellerRateBuyer(orderId)` | Check if can rate | Seller | `{ canRate }` |
| `getBuyerReceivedRatings(options?)` | Buyer's received ratings | Buyer | Ratings list |
| `getPublicBuyerFeedback(buyerId, options?)` | Public buyer ratings | None | Ratings + stats |

---

### seller-feedback.ts — Buyer→Seller Ratings

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `submitSellerFeedback(input)` | Rate seller after delivery | Buyer | `{ id }` |

---

### blocked-users.ts — User Blocking

| Action | Purpose | Auth | Returns |
|--------|---------|------|---------|
| `blockUser(userId, reason?)` | Block user | User | `{ success }` |
| `unblockUser(userId)` | Unblock user | User | `{ success }` |
| `getBlockedUsers()` | List blocked | User | `BlockedUser[]` |
| `isUserBlocked(userId)` | Check bidirectional | User | `boolean` |

---

## API Routes

### Product Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/products/feed` | GET | Paginated feed by type | None |
| `/api/products/newest` | GET | Newest with filters | None |
| `/api/products/search` | GET | Text search | None |
| `/api/products/count` | POST | Count with filters | None |
| `/api/products/quick-view` | GET | Modal preview data | None |
| `/api/products/category/[slug]` | GET | Category products | None |
| `/api/products/[id]/view` | POST | Increment views | None |

**Feed Types:** `all`, `newest`, `promoted`, `deals`, `top_rated`, `promo`

**Query Params:** `type`, `category`, `city`, `page`, `limit`, `sort`, `attr_*`

---

### Category Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/categories` | GET | Category tree | None |
| `/api/categories/attributes` | GET | Dynamic form fields | None |
| `/api/categories/counts` | GET | Product counts | None |
| `/api/categories/products` | GET | Mega-menu products | None |
| `/api/categories/sell-tree` | GET | Seller form tree | None |
| `/api/categories/[slug]/attributes` | GET | Inherited attributes | None |
| `/api/categories/[slug]/children` | GET | Direct children | None |
| `/api/categories/[slug]/context` | GET | Breadcrumbs, meta | None |

---

### Checkout & Payments

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/checkout/webhook` | POST | Stripe checkout events | Stripe |
| `/api/payments/setup` | POST | Add card session | User |
| `/api/payments/delete` | POST | Remove card | User |
| `/api/payments/set-default` | POST | Set default card | User |
| `/api/payments/webhook` | POST | Card/boost events | Stripe |

---

### Stripe Connect (Seller Payouts)

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/connect/onboarding` | POST | Start Connect onboarding | Seller |
| `/api/connect/dashboard` | POST | Express dashboard link | Seller |
| `/api/connect/webhook` | POST | Account update events | Stripe |

---

### Subscriptions

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/subscriptions/checkout` | POST | Create sub checkout | User |
| `/api/subscriptions/portal` | POST | Billing portal | Subscriber |
| `/api/subscriptions/webhook` | POST | Sub lifecycle events | Stripe |
| `/api/plans` | GET | Active plans list | None |

---

### Boosts

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/boost/checkout` | GET | Get pricing | None |
| `/api/boost/checkout` | POST | Create boost checkout | Seller |

---

### Orders & Sales

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/orders/[id]/ship` | POST | Mark shipped | Seller |
| `/api/orders/[id]/track` | POST | Update tracking | Seller |
| `/api/sales/export` | GET | CSV export | Seller |

---

### User & Badges

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/badges` | GET | Current user badges | User |
| `/api/badges/evaluate` | POST | Award badges | User |
| `/api/badges/[userId]` | GET | Public badges | None |
| `/api/billing/invoices` | GET | Stripe invoices | User |

---

### AI Assistant

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/assistant/chat` | POST | Shopping assistant | Flag |
| `/api/assistant/find-similar` | POST | Visual search | Flag |
| `/api/assistant/sell-autofill` | POST | Listing from image | Flag |

Requires `AI_ASSISTANT_ENABLED=true` environment variable.

---

### Upload & Media

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/upload-image` | POST | Product image (1920px) | User |
| `/api/upload-chat-image` | POST | Chat image (1200px) | User |

---

### Utility

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/sign-out` | POST/GET | Logout | None |
| `/api/health/env` | GET | Env check (dev) | None |
| `/api/revalidate` | POST | Cache invalidation | Secret |
| `/api/seller/limits` | GET | Listing limits | Seller |
| `/api/wishlist/[token]` | GET | Shared wishlist | None |

---

## Webhook Events

### Checkout Webhook `/api/checkout/webhook`

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create order from cart |
| `payment_intent.succeeded` | Confirm payment |
| `payment_intent.payment_failed` | Mark failed |

### Subscription Webhook `/api/subscriptions/webhook`

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create subscription |
| `customer.subscription.updated` | Sync status |
| `customer.subscription.deleted` | Expire subscription |
| `invoice.payment_succeeded` | Extend period |
| `invoice.payment_failed` | Notify user |

### Connect Webhook `/api/connect/webhook`

| Event | Action |
|-------|--------|
| `account.updated` | Sync payout status |
| `account.application.deauthorized` | Mark disconnected |

### Payments Webhook `/api/payments/webhook`

| Event | Action |
|-------|--------|
| `checkout.session.completed` (boost) | Apply boost to product |
| `checkout.session.completed` (setup) | Save payment method |
| `payment_method.detached` | Remove from DB |

---

## Error Handling

All actions return standardized results:

```typescript
interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}
```

Common errors:
- `"Not authenticated"` — requires login
- `"Product not found"` — invalid ID or no access
- `"You don't have permission"` — RLS blocked
- `"Invalid input"` — Zod validation failed

---

## Cache Tags

Server actions invalidate these tags via `revalidateTag()`:

| Tag Pattern | Scope |
|-------------|-------|
| `product:{id}` | Single product |
| `seller-products-{id}` | Seller's listings |
| `products:category:{slug}` | Category feed |
| `products:type:{type}` | Feed type (deals, newest) |
| `profiles` | User profiles |
| `orders` | Order data |
| `follows` | Follower counts |

---

## See Also

- [06-DATABASE.md](./06-DATABASE.md) — Schema these actions use
- [08-PAYMENTS.md](./08-PAYMENTS.md) — Stripe integration details
- [09-AUTH.md](./09-AUTH.md) — Authentication flows

---

*Last updated: 2026-02-01*
