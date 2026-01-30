# Supabase Backend Comprehensive Audit - 2026-01-30

> SSOT document for Opus + Codex collaboration on Supabase backend alignment

## Executive Summary

**Purpose**: Audit entire Supabase backend for alignment with frontend, identify issues, ensure production-readiness.
**Methodology**: Opus (VSCode + Supabase MCP) + Codex (terminal) collaborative iteration.

---

## 1. Schema Overview

### Public Schema Tables (Core)

| Table | Rows | RLS | Primary Purpose |
|-------|------|-----|-----------------|
| profiles | 31 | ✅ | User identity (buyers + sellers unified) |
| products | 233 | ✅ | Product catalog |
| categories | 13,139 | ✅ | Hierarchical category tree (L0-L4) |
| category_attributes | 7,116 | ✅ | Dynamic form fields per category |
| orders | 3 | ✅ | Order header |
| order_items | 4 | ✅ | Line items with seller tracking |
| reviews | 4 | ✅ | Product reviews |
| wishlists | 2 | ✅ | Saved items |
| cart_items | 13 | ✅ | Server-backed cart |
| conversations | 3 | ✅ | Buyer-seller messaging |
| messages | 19 | ✅ | Chat messages |
| subscriptions | 1 | ✅ | Seller subscription plans |
| subscription_plans | 6 | ✅ | Plan definitions |
| listing_boosts | 9 | ✅ | Product promotion |
| notifications | 11 | ✅ | User notifications |
| brands | 24 | ✅ | Brand registry |
| seller_stats | 12 | ✅ | Cached seller metrics |
| buyer_stats | 31 | ✅ | Cached buyer metrics |
| user_verification | 31 | ✅ | Trust/verification status |
| business_verification | 2 | ✅ | B2B verification |
| badge_definitions | 59 | ✅ | Badge system |
| user_badges | 0 | ✅ | Awarded badges |
| store_followers | 3 | ✅ | Follow system |
| shipping_zones | 5 | ✅ | Shipping region definitions |
| boost_prices | 3 | ✅ | Boost pricing tiers |

### Private/Sensitive Tables

| Table | Purpose |
|-------|---------|
| private_profiles | Email, phone, Stripe customer ID, commission rates |
| product_private | Cost price, SKU, barcode (seller-only) |
| seller_payout_status | Stripe Connect account status |
| seller_shipping_settings | Seller shipping config |

---

## 2. RLS Policy Audit

### Summary: 100 policies across public tables

**Policy Patterns Used:**
- Owner-based: `auth.uid() = user_id` (most common)
- Admin check: `is_admin()` function
- Public read: `true` for SELECT
- Participant check: buyer_id OR seller_id = auth.uid()

### Critical Findings

#### ✅ Good Patterns
1. Products: Public read, owner-only write
2. Orders: Owner-only CRUD
3. Private tables: Strict owner OR admin access
4. Admin tables: Admin-only via is_admin() check

#### ⚠️ Potential Issues
1. **Some policies use `{public}` role** instead of `authenticated` - may allow anon access
2. **cart_items policies on {public}** - should be authenticated only?
3. **store_followers insert on {public}** - allows follow without auth?

### RLS Coverage Check
All public tables have RLS enabled: ✅

---

## 3. Security Advisors

### WARN: Leaked Password Protection Disabled
- **Impact**: Compromised passwords from HaveIBeenPwned not blocked
- **Action**: Enable in Supabase Auth settings
- **Priority**: High

---

## 4. Performance Advisors

### Unused Indexes (23 total)

**Admin Tables (low traffic, OK to keep):**
- idx_admin_docs_status
- idx_admin_tasks_status
- idx_admin_tasks_priority
- idx_admin_notes_pinned
- idx_admin_notes_author_id
- idx_admin_tasks_assigned_to
- idx_admin_tasks_created_by

**Order/Cart Tables (may need once production traffic):**
- idx_cart_items_product_id
- idx_cart_items_variant_id
- idx_order_items_variant_id
- orders_fulfillment_status_idx
- return_requests_order_item_id_idx
- return_requests_buyer_id_idx

**Notification Tables:**
- idx_notifications_user_id
- idx_notifications_order_id
- idx_notifications_product_id
- idx_notifications_conversation_id

**Other:**
- idx_listing_boosts_stripe_session
- idx_listing_boosts_product_id
- idx_conversations_order_id
- idx_user_badges_badge_id
- idx_business_verification_verified_by
- idx_profiles_last_active

**Recommendation**: Keep indexes - they'll be useful at scale. Cost of unused index is minimal.

---

## 5. Category System Analysis

### Hierarchy Structure
```
L0 (Root)     → 30+ main categories
  L1          → ~200 subcategories
    L2        → ~2000 sub-subcategories
      L3      → ~10,000+ leaf categories
        L4    → Some deep categories (e.g., iPhone models)
```

### Key Tables
1. **categories**: Hierarchical tree with parent_id FK
2. **category_attributes**: Dynamic attributes per category
3. **products.attributes**: JSONB for fast filtering
4. **products.category_ancestors**: UUID[] for hierarchical queries

### Category Attributes System
- 7,116 attributes across categories
- Types: text, number, select, multiselect, boolean, date
- Filterable flag for search UI
- Hero spec flag for product page display
- Badge spec flag for card display
- i18n support: name/name_bg, options/options_bg

### Frontend Integration Points
- Mega-menu: categories.display_order
- Sell form: category_attributes fetched by category_id
- Product JSONB: attributes stored in products.attributes
- Filtering: GIN index on products.attributes

---

## 6. Auth/Profiles System

### Unified Profile Model
The `profiles` table is the SSOT for user identity:
- **id**: FK to auth.users
- **role**: buyer/seller/admin
- **is_seller**: Auto-set when first listing created
- **account_type**: personal/business
- **tier**: free/starter/basic/premium/professional/business/enterprise
- **onboarding_completed**: Welcome flow flag
- **username**: Unique for /u/[username] URLs
- **last_active**: Activity tracking

### Profile Creation Flow
1. User signs up via Supabase Auth
2. `handle_new_user` trigger creates profile row
3. `user_verification` row created
4. `buyer_stats` row created

### Seller Upgrade Flow
1. User creates first listing
2. `is_seller` flag set to true on profiles
3. `seller_stats` row created
4. Can purchase subscription for premium features

### Private Data Separation
- `private_profiles`: PII (email, phone, Stripe ID)
- `product_private`: Seller cost data

---

## 7. Subscription/Monetization System

### Plans Structure (subscription_plans)
| tier | monthly | yearly | max_listings | commission |
|------|---------|--------|--------------|------------|
| free | 0 | 0 | 5 | 12% |
| starter | €4.99 | €49.90 | 50 | 10% |
| basic | €9.99 | €99.90 | 200 | 8% |
| premium | €19.99 | €199.90 | 500 | 6% |
| professional | €49.99 | €499.90 | 2000 | 4% |
| business | €99.99 | €999.90 | 10000 | 3% |

### Stripe Integration
- stripe_price_monthly_id / stripe_price_yearly_id on plans
- stripe_subscription_id on subscriptions
- stripe_connect_account_id on seller_payout_status

### Boost System
- boost_prices: 3/7/30 day options
- listing_boosts: Active boosts with expiry
- pg_cron job: Auto-expire boosts

---

## 8. Issues Identified for Codex Review

### Critical
1. [ ] **Leaked password protection disabled** - Enable in Auth settings
2. [ ] **RLS {public} vs authenticated** - Audit cart/store_followers policies

### High Priority
3. [ ] **Category leaf validation** - Products must be in leaf categories
4. [ ] **Attribute key normalization** - Ensure attribute_key matches JSONB keys
5. [ ] **Subscription expiry handling** - Cron job verification

### Medium Priority
6. [ ] **Unused indexes** - Keep or remove based on projected traffic
7. [ ] **Function search_path security** - All functions should have explicit search_path
8. [ ] **Badge evaluation triggers** - Verify automatic badge awarding

### Low Priority (Tech Debt)
9. [ ] **Migration count** - 700+ migrations, consider squashing for new deploys
10. [ ] **Category hierarchy depth** - Some L4/L5 categories may be excessive

---

## 9. Frontend-Backend Alignment Checklist

### Products
- [x] JSONB attributes match category_attributes keys
- [x] category_ancestors populated for hierarchical filtering
- [x] search_vector populated for full-text search
- [ ] Verify hero_spec attributes display correctly
- [ ] Verify badge_spec attributes on cards

### Categories
- [x] display_order for mega-menu sorting
- [x] i18n: name/name_bg populated
- [ ] Verify category images (image_url) render

### Orders
- [x] Order flow: cart → checkout → order + order_items
- [x] seller_id tracked on order_items
- [x] Status progression: pending → paid → processing → shipped → delivered
- [ ] Verify notification triggers fire

### Auth
- [x] Profile auto-creation on signup
- [x] is_seller auto-set on first listing
- [ ] Verify onboarding_completed flow

---

## 10. Shared Context for Codex

### Key RPC Functions
```sql
-- Get category path (breadcrumb)
get_category_path(category_id uuid)

-- Get hero specs for product
get_hero_specs(product_id uuid)

-- Get badge specs for category
get_badge_specs(category_id uuid)

-- Get category descendants (for filtering)
get_category_descendants(root_id uuid)
```

### Key Triggers
- `handle_new_user`: Creates profile on signup
- `handle_order_item_status_change`: Updates order status
- `sync_seller_verification_on_subscription`: Business verification
- `update_follower_count`: Maintains seller follower count

### Storage Buckets
- `avatars`: User profile images (public)
- `product-images`: Product photos (public)

---

## 11. Next Steps

**For Codex (Backend Structure):**
1. Review app/actions/* for Supabase query patterns
2. Check lib/supabase/* for client/server setup
3. Verify RPC function usage matches schema
4. Audit server actions for proper error handling

**For Opus (Frontend-Backend Alignment):**
1. Check component data requirements vs available fields
2. Verify category picker uses correct hierarchy
3. Audit sell form attribute handling
4. Check product card renders badge specs

---

## 12. Codex Frontend Review - Backend Query Patterns

### Scope
- Reviewed `app/actions/*` and `lib/supabase/*` (server actions + Supabase client setup).
- Also traced category/sell flows in `app/[locale]/(sell)/**`, `app/api/categories/**`, and `lib/data/categories.ts`.

### 12.1 Schema Alignment (Tables/Columns)
- ✅ No schema drift: all tables referenced in code exist in `lib/supabase/database.types.ts`.
- Core tables touched by server actions / sell flow:
  - Identity: `profiles`, `private_profiles`, `username_history`, `business_verification`
  - Products: `products`, `product_private`, `product_images`, `product_attributes`, `categories`, `category_attributes`, `brands`
  - Orders: `orders`, `order_items`, `return_requests`
  - Social/messaging: `store_followers`, `conversations`, `messages`, `blocked_users`, `notifications`
  - Reviews/feedback: `reviews`, `seller_feedback`, `buyer_feedback`, `seller_stats`, `buyer_stats`
  - Billing: `subscriptions`, `subscription_plans`, `user_payment_methods`, `listing_boosts`, `boost_prices`
- PostgREST relationship joins appear valid.

### 12.2 Field Projection / `select('*')`
- ✅ No `.select('*')` found in `app/actions/*` or `lib/supabase/*`.
- Most reads are already projected to minimal columns.

### 12.3 RPC Usage (DB-side Verification)
RPCs called from frontend/server code:
- Chat: `get_user_conversations`, `mark_messages_read`, `get_or_create_conversation`, `get_total_unread_messages`
- Blocking: `block_user`, `unblock_user`, `get_blocked_users`, `is_blocked_bidirectional`
- Reviews: `increment_helpful_count`
- Wishlist: `enable_wishlist_sharing`, `disable_wishlist_sharing`, `get_shared_wishlist`, `cleanup_sold_wishlist_items`
- Notifications: `mark_notification_read`, `mark_all_notifications_read`
- Product: `increment_view_count`
- Category display: `get_hero_specs`, `get_badge_specs`

**Verification Results:**
1. ✅ `get_user_conversations`: Has `SECURITY DEFINER` but ignores caller-supplied `p_user_id` unless `service_role` or `is_admin()`.
2. ⚠️ `mark_messages_read`: 
   - Function verified - uses `auth.uid()` to get current user
   - Only updates messages where `sender_id != v_user_id` (cannot mark own messages)
   - **BUT** no explicit check that user is buyer OR seller in conversation
   - Risk: Could potentially mark messages read in any conversation if conversation_id guessed
   - **RECOMMENDATION**: Add participant check before updates
3. Confirm EXECUTE grants post-hardening for all RPCs.

### 12.4 Index / Perf Notes From Query Patterns
High-traffic filters in current frontend actions:
- `order_items`: frequent `.eq('seller_id', ...)` + `.eq('status', ...)` 
  - **RECOMMENDATION**: Add composite index `(seller_id, status)` or `(seller_id, status, created_at)`
- `products`: listing-limit checks count active listings
  - Index on `(seller_id, status)` would help; or rely on `seller_stats.active_listings`
- `category_attributes`: sell form queries by `category_id` + `sort_order`
  - Confirm index on `category_attributes(category_id, sort_order)` exists

### 12.5 Category Picker / Sell Form Hierarchy
**What's working:**
- Category picker stores `categoryId` + `categoryPath[]` breadcrumb
- Deep navigation via lazy-loading `/api/categories/[parentId]/children`
- Attributes fetched with inheritance (child wins over parent)
- DB enforces leaf-category selection via constraint

**⚠️ ISSUE: Mobile Category Depth Cap**
- Mobile selector has `MAX_DEPTH = 3`
- **LIVE DB HAS 647 L4 CATEGORIES**
- Examples: iPhone 16 Pro Max, NVIDIA RTX 4090, AMD Ryzen 9 7000, etc.
- Mobile users cannot reach these leaf categories
- **ACTION REQUIRED**: Remove/increase MAX_DEPTH cap in mobile UI

### 12.6 Category Depth Analysis (From SQL)
| Depth | Count | Notes |
|-------|-------|-------|
| L0 | 24 | Root categories |
| L1 | 291 | Main subcategories |
| L2 | 3,073 | Sub-subcategories |
| L3 | 9,104 | Most leaf categories |
| L4 | 647 | Deep leaves (specific models/variants) |

---

## 13. Opus Supabase MCP Verification

### Security Functions Audited

**mark_messages_read** - Verified via `pg_get_functiondef()`:
```sql
CREATE OR REPLACE FUNCTION public.mark_messages_read(p_conversation_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_is_buyer BOOLEAN;
BEGIN
  SELECT buyer_id = v_user_id INTO v_is_buyer
  FROM public.conversations
  WHERE id = p_conversation_id;
  
  UPDATE public.messages
  SET is_read = true, read_at = now()
  WHERE conversation_id = p_conversation_id
  AND sender_id != v_user_id
  AND is_read = false;
  -- ... (rest of function)
END;
$function$
```

**Analysis:**
- ✅ Uses `auth.uid()` - cannot impersonate
- ✅ Only marks messages where `sender_id != v_user_id`
- ⚠️ No check that user is participant (buyer_id OR seller_id = auth.uid())
- Could mark messages in conversations user isn't part of

**Recommended Fix:**
```sql
-- Add at start of function:
IF NOT EXISTS (
  SELECT 1 FROM public.conversations 
  WHERE id = p_conversation_id 
  AND (buyer_id = v_user_id OR seller_id = v_user_id)
) THEN
  RAISE EXCEPTION 'Not a participant';
END IF;
```

---

## 14. Auth System Deep Dive

### handle_new_user Trigger - ✅ SOLID
```sql
-- Creates these rows atomically on signup:
1. profiles (public identity, role='buyer', account_type from metadata)
2. private_profiles (email storage, PII)
3. buyer_stats (zeroed counters)
4. user_verification (email_verified from email_confirmed_at)
```

**Security Features:**
- Uses ON CONFLICT DO UPDATE for idempotency
- Validates account_type is 'personal' or 'business'
- Extracts username from metadata (lowercased)
- SECURITY DEFINER with explicit search_path

### Seller Upgrade Functions - ✅ SOLID
| Function | Trigger | Purpose |
|----------|---------|---------|
| `auto_set_seller_flag()` | On product insert | Sets profiles.is_seller = true |
| `init_seller_stats()` | On profile create | Creates seller_stats row |
| `sync_seller_from_subscription()` | On subscription change | Updates tier + commission |
| `update_seller_stats_on_order()` | On order complete | Increments total_sales |
| `notify_seller_on_new_follower()` | On store follow | Creates notification |

### RLS on Stats Tables
- `seller_stats`: Only SELECT policy (`true`) - writes via SECURITY DEFINER functions
- `buyer_stats`: Only SELECT policy (`true`) - writes via SECURITY DEFINER functions

---

## 15. Data Quality Issues

### ⚠️ Products on Non-Leaf Categories (20 found)
Products should be placed in leaf categories for proper filtering:
```
| Product | Category | Has Children |
|---------|----------|--------------|
| GOLF 4 TDI | Cars | true |
| 55" OLED Smart TV | Electronics | true |
| Kids Winter Jacket | Fashion | true |
| (17 more...) | | |
```
**Impact:** Filter UX may be inconsistent
**Fix:** Migrate existing products to appropriate leaf categories OR allow non-leaf if intentional

### ✅ Attribute Key Normalization - Intentional
50 attributes have keys that differ from name:
- `Mileage (km)` → `mileage_km` (parentheses stripped)
- `Eco-Friendly` → `ecofriendly` (hyphens stripped)
- `Box & Papers` → `box__papers` (ampersand → underscore)

This is **correct behavior** - keys are machine-safe, names are human-readable.
Frontend must use `attribute_key` for JSONB storage/filtering.

---

## 16. Final Recommendations

### 🔴 Critical (Do Now)
1. **mark_messages_read participant check** - Add validation
2. **Enable leaked password protection** - Supabase Auth dashboard
3. **Mobile MAX_DEPTH=3 → 4** - Blocking 647 L4 categories

### 🟡 High Priority
4. **Composite index** `order_items(seller_id, status)` for dashboard queries
5. **Migrate 20 non-leaf products** to appropriate leaf categories

### 🟢 Nice to Have
6. **Squash migrations** - 700+ migrations for fresh deploys
7. **Remove unused indexes** - Wait for production traffic patterns first

---

## Appendix: Quick Reference

### Common Queries Patterns

**Get products with category hierarchy:**
```ts
supabase
  .from('products')
  .select('id, title, price, images, category:categories(id, name, slug)')
  .filter('category_ancestors', 'cs', `{${categoryId}}`)
```

**Get category attributes for sell form:**
```ts
supabase
  .from('category_attributes')
  .select('*')
  .eq('category_id', categoryId)
  .order('sort_order')
```

**Check user subscription:**
```ts
supabase
  .from('subscriptions')
  .select('plan_type, status, expires_at')
  .eq('seller_id', userId)
  .eq('status', 'active')
  .single()
```
