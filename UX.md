# 🎯 UX Audit & Improvement Plan

## Executive Summary

This document provides a comprehensive audit of the AMZN marketplace frontend/backend alignment, identifying UX gaps and proposing solutions to create a seamless buyer-seller experience.

### Execution Order (Recommended)

This repo already has a strong separation between:
- **Structural refactor/cleanup** (see `STRUCTURE.md` + `FULL_REFACTOR_PLAN.md`) and
- **Product/UI improvements** (see `PRODUCT_IMPROVEMENTS_PLAN.md`).

This UX plan focuses on **UX correctness + backend alignment** (i.e., UI that currently misleads users or does not do what it says).

**Recommended sequencing for production readiness:**
1. **Baseline gates**: typecheck + targeted E2E baseline.
2. **UX alignment “truth fixes”** (small, contained batches):
  - Deals/Offers semantics and seller sale UX
  - Near Me actually filters by city
  - Promoted/Boosted items are clearly labeled
3. **Cleanup after** the above is stable (deletions/dependency pruning): follow `production/02-CLEANUP.md`.

**Priority Legend:**
- 🔴 **Critical** - Blocking user flows, must fix immediately
- 🟡 **High** - Major UX gaps, important for user retention
- 🟢 **Medium** - Nice-to-have improvements
- 🔵 **Low** - Polish items for later

---

## 1. 🔴 CRITICAL: "Оферти" (Offers/Deals) Tab - Broken UX Flow

### Current State
- **Frontend**: Landing page has "Оферти" (Offers) tab in `TabbedProductFeed` and `NewestListingsSection`
- **Backend**: `is_on_sale`, `sale_percent`, `sale_end_date` fields exist in `products` table
- **API**: `/api/products/deals` queries `list_price IS NOT NULL` but does NOT check `is_on_sale`

### Problems Identified
1. **No seller UX to create "Оферти"** - Sellers can only set discounts via `selling-products-list.tsx` discount dialog, but this only sets `price`/`list_price`, NOT `is_on_sale`
2. **API mismatch** - Deals API shows products with `list_price` set, but that's ANY product with original price, not specifically "on sale"
3. **Missing sale badges** - Products don't show sale end dates or % off consistently

### Solution

#### 1.1 Add "Create Offer/Sale" to Seller Dashboard
**Files to modify:**
- `app/[locale]/(account)/account/selling/selling-products-list.tsx`
- `app/[locale]/(account)/account/selling/_components/sale-dialog.tsx` (NEW)

```typescript
// New Sale Dialog Component
interface SaleDialogProps {
  product: Product
  locale: string
  trigger: React.ReactNode
}

// Features:
// - Toggle "is_on_sale" on/off
// - Set sale_percent (5%, 10%, 15%, 20%, 25%, 30%, 40%, 50%, 60%, 70%)
// - Auto-calculate discounted price
// - Optional: Set sale_end_date (countdown timer UX)
// - Preview how it will look
```

#### 1.2 Update Deals API
**File:** `app/api/products/deals/route.ts`

```typescript
// Change query from:
.not("list_price", "is", null)

// To:
.eq("is_on_sale", true)
.gt("sale_percent", 0)
```

#### 1.3 Add "Sale" Badge to Product Cards
**File:** `components/shared/product/product-card.tsx`

Add props:
```typescript
isOnSale?: boolean
salePercent?: number
saleEndDate?: string | null
```

#### 1.4 Database Migration (if needed)
```sql
-- Update existing discounted products to be marked as on sale
UPDATE products 
SET is_on_sale = true, 
    sale_percent = ROUND(((list_price - price) / list_price) * 100)
WHERE list_price IS NOT NULL 
  AND list_price > price;
```

---

## 2. 🔴 CRITICAL: "Промотирани" (Promoted/Boosted) Tab - Incomplete UX

### Current State
- **Backend**: `is_boosted`, `boost_expires_at`, `listing_type`, `listing_boosts` table all exist
- **Frontend**: `BoostDialog` exists in selling page with Stripe payment flow
- **API**: `/api/products/promoted` correctly queries `is_boosted = true AND boost_expires_at > NOW()`

### Problems Identified
1. **No visual indicator** - Boosted products don't show "Sponsored" or "Promoted" badge prominently
2. **Boost expiry not visible** to buyers
3. **Sellers can't see boost analytics** - How many views did the boost generate?
4. **No bulk boost option** for sellers with many products

### Solution

#### 2.1 Add "Promoted" Badge to Product Cards
**File:** `components/shared/product/product-card.tsx`

```tsx
{isBoosted && (
  <Badge className="absolute top-2 left-2">
    <Lightning weight="fill" className="size-3 mr-1" />
    {locale === 'bg' ? 'Промотирано' : 'Promoted'}
  </Badge>
)}
```

#### 2.2 Add Boost Analytics to Seller Dashboard
**File:** `app/[locale]/(account)/account/selling/_components/boost-analytics.tsx` (NEW)

- Show boost status (active/expired/none)
- Days remaining
- Views during boost period (requires new `product_views` table)
- Click-through rate
- Option to renew boost before expiry

#### 2.3 Update Product Card Component
Add `isBoosted`, `boostExpiresAt` to product card props and display badge

---

## 3. 🔴 CRITICAL: "Наблизо" (Near Me) Tab - Not Implemented

### Current State
- **Frontend**: Tab exists in `NewestListingsSection` but calls `/api/products/newest`
- **Backend**: `seller_city` field exists on `products` table
- **Profile**: `default_city` field exists on `profiles` table

### Problems Identified
1. **Tab does nothing different** - Just shows newest products
2. **No location detection** for buyers
3. **No UX for sellers to set city** in sell form

### Solution

#### 3.1 Add City Field to Sell Form
**File:** `app/[locale]/(sell)/_components/fields/location-field.tsx` (NEW)

```tsx
// Bulgarian cities dropdown with autocomplete
// "София", "Пловдив", "Варна", "Бургас", etc.
// Should auto-fill from profile.default_city
```

#### 3.2 Create "Near Me" API Endpoint
**File:** `app/api/products/nearby/route.ts` (NEW)

```typescript
// Query params: city, radius (optional for future)
// Returns products where seller_city matches or is nearby
```

#### 3.3 Add Buyer Location Detection/Selection
**Files:**
- `components/layout/header.tsx` - Add location selector dropdown
- `lib/geolocation.ts` - Already exists, use for auto-detection
- Store in localStorage + profile.default_city for logged-in users

#### 3.4 Update Frontend Tab
```typescript
// In NewestListingsSection
if (tab === "near_me") {
  const city = getUserCity() // From localStorage or profile
  url = `/api/products/nearby?city=${city}`
}
```

---

## 4. 🟡 HIGH: Notifications System - UI Incomplete

### Current State
- **Backend**: Full `notifications` table with types: `purchase`, `order_status`, `message`, `review`, `system`, `promotion`
- **Triggers**: Exist for new orders, new followers, new messages
- **Frontend**: `NotificationsDropdown` component exists

### Problems Identified
1. **No real-time updates** - Notifications don't push to UI in real-time
2. **Bell icon missing** from main header on some views
3. **No notification settings page** - Users can't choose what notifications to receive
4. **Email notifications not implemented** - Only in-app
5. **No "new sale" notification prominently shown** to sellers

### Solution

#### 4.1 Add Realtime Subscription
**File:** `components/dropdowns/notifications-dropdown.tsx`

```typescript
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      // Add to notifications list
      // Show toast for important ones
    })
    .subscribe()
    
  return () => { supabase.removeChannel(channel) }
}, [userId])
```

#### 4.2 Create Notification Preferences Page
**File:** `app/[locale]/(account)/account/(settings)/notifications/page.tsx` (NEW)

- Toggle notifications by type
- Email notification preferences
- Push notification preferences (future)

#### 4.3 Add "New Sale" Toast Alert
When seller receives order, show prominent toast with:
- Product image
- Buyer name
- Amount
- "View Sale" button

---

## 5. 🟡 HIGH: Wishlist UX - Missing Features

### Current State
- **Backend**: `wishlists` table with `share_token`, `is_public`, `name`, `description` fields
- **Frontend**: Basic wishlist page exists at `/account/wishlist`

### Problems Identified
1. **Can't create multiple wishlists** - Only one default list
2. **Share functionality not implemented** - `share_token` exists but no UI
3. **No "notify on price drop"** feature
4. **Can't add notes** to wishlist items
5. **Public wishlist URL not working** - `/wishlist/{share_token}` doesn't exist

### Solution

#### 5.1 Multiple Wishlists Support
**File:** `app/[locale]/(account)/account/wishlist/page.tsx`

- Add "Create New Wishlist" button
- Wishlist selector dropdown
- Rename/delete wishlist options

#### 5.2 Implement Share Functionality
**File:** `app/[locale]/(main)/wishlist/[token]/page.tsx` (NEW)

- Public wishlist view
- "Add All to Cart" button for gift buyers
- Copy share link button in private view

#### 5.3 Price Drop Notifications
**Table change:** Add `notify_price_drop` boolean to wishlists
**Trigger:** Check price changes and create notification

---

## 6. 🟡 HIGH: Order Management UX Gaps

### Current State
- **Buyer side**: Order list and detail pages exist
- **Seller side**: Sales page exists with table view
- **Backend**: `orders`, `order_items` tables with status tracking

### Problems Identified
1. **No order status timeline** - Just shows current status, not history
2. **No seller actions** - Mark as shipped, add tracking directly
3. **No buyer actions** - Request cancellation, report issue
4. **No order communication** - Can't message about specific order easily
5. **Missing "Rate Seller" prompt** after delivery

### Solution

#### 6.1 Add Order Status Timeline
**File:** `app/[locale]/(account)/account/orders/[id]/_components/order-timeline.tsx` (NEW)

Visual timeline showing:
- Order placed
- Payment confirmed
- Seller received
- Shipped (with tracking)
- Delivered
- Completed

#### 6.2 Add Seller Quick Actions
**File:** `app/[locale]/(account)/account/sales/_components/sale-actions.tsx` (NEW)

- "Mark as Shipped" button with tracking number input
- "Contact Buyer" button
- "Cancel & Refund" button

#### 6.3 Add Buyer Actions
**File:** `app/[locale]/(account)/account/orders/[id]/_components/buyer-actions.tsx` (NEW)

- "Report Issue" button
- "Leave Review" button (appears after delivery)
- "Message Seller" button
- "Request Return" button

#### 6.4 Add Order-Specific Messaging
Link from order detail to conversations with `order_id` pre-filled

---

## 7. 🟡 HIGH: Sales Management - Seller Dashboard Improvements

### Current State
- Sales dashboard exists with chart and table
- Basic stats shown

### Problems Identified
1. **No pending actions indicator** - Seller doesn't see "5 orders need shipping"
2. **No inventory alerts** - Low stock warnings not prominent
3. **No revenue forecast** - Basic analytics only
4. **Can't export data** - No CSV export for accounting

### Solution

#### 7.1 Add Pending Actions Widget
**File:** `app/[locale]/(account)/account/sales/_components/pending-actions.tsx` (NEW)

```tsx
// Show urgent items:
// - "3 orders waiting to ship"
// - "2 messages need reply"
// - "5 products low stock"
```

#### 7.2 Add Export Functionality
**File:** `app/[locale]/(account)/account/sales/_components/export-sales.tsx` (NEW)

- Export to CSV
- Date range picker
- Include/exclude fields

#### 7.3 Add Revenue Analytics
- Daily/weekly/monthly views
- Best-selling products
- Revenue by category

---

## 8. 🟢 MEDIUM: Store Followers UX

### Current State
- **Backend**: `store_followers` table exists
- **Triggers**: Notification on new follower exists
- **Stats**: `follower_count` in `seller_stats` updated

### Problems Identified
1. **No "Follow" button on product pages** - Only on seller profile?
2. **Followers page** exists but lacks engagement features
3. **No "New listing from followed store" notification**

### Solution

#### 8.1 Add Follow Button to Product Card
When hovering seller info, show follow button

#### 8.2 Create "Following Feed" Tab
New tab showing products from followed sellers

#### 8.3 Add "New Product" Notification Trigger
```sql
CREATE OR REPLACE FUNCTION notify_followers_on_new_product()
-- Creates notification for all followers when seller adds new product
```

---

## 9. 🟢 MEDIUM: Seller Feedback System

### Current State
- **Backend**: `seller_feedback` and `buyer_feedback` tables exist
- **Stats**: `seller_stats` has rating fields
- **Frontend**: Reviews on product page exist

### Problems Identified
1. **No prompt to leave feedback** after order delivered
2. **Seller feedback not visible** on seller profile prominently
3. **No response mechanism** - Sellers can't respond to feedback
4. **Rating breakdown** not shown (item described %, shipping speed %, communication %)

### Solution

#### 9.1 Auto-Prompt for Feedback
After `delivered_at` + 3 days, show notification:
"How was your experience with {seller}?"

#### 9.2 Add Feedback Response
Sellers can respond to feedback (field exists: `buyer_response`)

#### 9.3 Show Rating Breakdown
On seller profile, show:
- Item as Described: 98%
- Shipping Speed: 95%
- Communication: 99%

---

## 10. 🟢 MEDIUM: Featured Products UX

### Current State
- **Backend**: `is_featured`, `featured_until` fields exist
- **No frontend implementation** for featuring

### Problems Identified
1. **No way for sellers to feature products** - Admin only?
2. **No featured section on homepage**
3. **No "Feature" pricing/option** for sellers

### Solution

#### 10.1 Add Featured Products Section to Homepage
Premium placement for featured products

#### 10.2 Allow Sellers to Feature Products
Similar to boost but for category-level featuring

---

## 11. 🔵 LOW: Additional Improvements

### 11.1 Recently Viewed
- Hook exists (`use-recently-viewed.ts`)
- Add section to homepage/search

### 11.2 Compare Products
- Add compare functionality for similar items

### 11.3 Product Questions & Answers
- Q&A section on product page

### 11.4 Seller Verification Badges
- Display verification level prominently

### 11.5 Price History Chart
- Show price history on product page

---

## Implementation Roadmap

### Phase 1: UX Alignment “Truth Fixes” (First)
1. ⬜ Fix "Оферти" (Offers) tab - Add sale UX to seller dashboard + align deals filtering
2. ⬜ Fix "Наблизо" (Near Me) tab - Implement actual city-based filtering
3. ⬜ Add Promoted badges to product cards (boosted visibility)
4. ⬜ Add sale badges with % off + consistent pricing semantics

### Phase 2: High Priority (After Phase 1 is stable)
5. ⬜ Implement real-time notifications
6. ⬜ Add order status timeline
7. ⬜ Add seller quick actions (ship, track)
8. ⬜ Improve wishlist with sharing

### Phase 3: Medium Priority
9. ⬜ Follow button on products
10. ⬜ Feedback prompts
11. ⬜ Sales export
12. ⬜ Pending actions widget

### Phase 4: Polish
13. ⬜ Featured products
14. ⬜ Recently viewed section
15. ⬜ Price history
16. ⬜ Compare products

---

## Database Changes Required

### New Tables
Optional / depends on scope:
- `product_views` (or similar) **only if** you implement Boost analytics (views/CTR during boost).

### Column Additions
Required if implementing the features as written:
- `wishlists.notify_price_drop` (boolean) for wishlist price-drop notifications.

### New Triggers/Functions
```sql
-- 1. Notify followers on new product
CREATE OR REPLACE FUNCTION notify_followers_on_new_product()

-- 2. Price drop notification for wishlist
CREATE OR REPLACE FUNCTION notify_wishlist_price_drop()

-- 3. Auto-prompt feedback after delivery
CREATE OR REPLACE FUNCTION schedule_feedback_prompt()
```

### RPC Functions Needed
```sql
-- 1. Get nearby products
CREATE FUNCTION get_nearby_products(city TEXT, limit_count INT)

-- 2. Get deal products (proper filter)
CREATE FUNCTION get_deal_products(limit_count INT, offset_count INT)
```

---

## API Endpoints to Create/Modify

### New Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products/nearby` | Products by city |
| POST | `/api/products/[id]/sale` | Create/update sale |
| DELETE | `/api/products/[id]/sale` | Remove sale |
| GET | `/api/wishlist/[token]` | Public wishlist |
| POST | `/api/orders/[id]/ship` | Mark as shipped |
| POST | `/api/orders/[id]/track` | Add tracking |

### Modified Endpoints
| Method | Path | Change |
|--------|------|--------|
| GET | `/api/products/deals` | Filter by `is_on_sale = true` |
| GET | `/api/products/newest` | Add `seller_city` to response |

---

## Component Changes Summary

### New Components
1. `SaleDialog` - Create/edit product sale
2. `LocationSelector` - City picker for buyers
3. `LocationField` - City input for sellers
4. `OrderTimeline` - Visual order status
5. `SaleActions` - Seller order actions
6. `BuyerActions` - Buyer order actions
7. `PendingActionsWidget` - Seller dashboard alerts
8. `ExportSalesButton` - CSV export
9. `BoostAnalytics` - Boost performance stats
10. `ShareWishlistButton` - Share link generator

### Modified Components
1. `ProductCard` - Add sale/promoted badges
2. `NotificationsDropdown` - Add realtime subscription
3. `SellingProductsList` - Add sale button
4. `NewestListingsSection` - Fix "near me" tab
5. `TabbedProductFeed` - Fix deals filter

---

## Success Metrics

### User Engagement
- ↑ Time on site
- ↑ Products wishlisted
- ↑ Sellers followed

### Conversion
- ↑ "Оферти" tab clicks → purchases
- ↑ Boost purchases by sellers
- ↑ Repeat buyers

### Seller Satisfaction
- ↓ Time to ship orders
- ↑ Feedback response rate
- ↑ Active listings

---

## Next Steps

1. Lock Phase 1 scope (Deals/Offers, Near Me, Promoted labeling)
2. Implement Phase 1 in small batches with gates after each batch
3. Only after Phase 1 is stable: execute cleanup via `production/02-CLEANUP.md`
4. Then proceed to Phase 2+ improvements

---

*Document created: December 24, 2025*
*Last updated: December 24, 2025*
