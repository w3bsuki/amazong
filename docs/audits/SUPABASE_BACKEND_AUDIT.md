# Supabase Backend Full Audit

**Generated**: January 2, 2026  
**Project**: Amazong Marketplace  
**Auditor**: AI-Assisted Analysis

---

## Executive Summary

### 🚨 Critical Findings

| Issue | Severity | Impact |
|-------|----------|--------|
| **13,139 categories** (L0-L4 depth) | 🔴 CRITICAL | Massive over-engineering, maintenance nightmare |
| **8,762 category_attributes** | 🔴 CRITICAL | Bloated attribute system, complex queries |
| **723 migrations** | 🔴 CRITICAL | Schema churn indicates poor planning |
| **81 database functions** | 🟡 HIGH | Excessive business logic in DB |
| **71 triggers** | 🟡 HIGH | Complex cascading effects, debugging difficulty |
| **15 unused indexes** | 🟠 MEDIUM | Performance overhead |

### Database Statistics

| Metric | Value | Assessment |
|--------|-------|------------|
| Total Tables | 38 | Reasonable |
| Total Categories | 13,139 | 🔴 **EXTREME** (typical marketplaces: 500-2000) |
| Category Attributes | 8,762 | 🔴 **EXTREME** |
| Products | 247 | Normal for development |
| RLS Policies | ~100 | Healthy |
| Functions | 81 | Excessive |
| Triggers | 71 | Excessive |
| Migrations | 723 | 🔴 **EXTREME** - indicates constant schema changes |

---

## Table of Contents

1. [Core Tables](#core-tables)
2. [Category System Deep Dive](#category-system-deep-dive)
3. [Attributes System](#attributes-system)
4. [User & Auth System](#user--auth-system)
5. [Commerce System](#commerce-system)
6. [Messaging & Notifications](#messaging--notifications)
7. [Seller/Subscription System](#sellersubscription-system)
8. [Functions & Triggers Analysis](#functions--triggers-analysis)
9. [Performance Issues](#performance-issues)
10. [Security Advisors](#security-advisors)
11. [Recommendations](#recommendations)

---

## Core Tables

### 1. profiles (24 rows)
**Purpose**: User identity - buyers AND sellers combined

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, FK to auth.users |
| email | text | |
| full_name | text | |
| avatar_url | text | |
| role | text | CHECK: buyer/seller/admin |
| username | text | UNIQUE |
| display_name | text | |
| bio | text | |
| banner_url | text | |
| location | text | |
| website_url | text | |
| social_links | jsonb | |
| account_type | text | personal/business |
| is_seller | boolean | Auto-set on first listing |
| verified | boolean | |
| tier | text | free/starter/basic/premium/professional/business/enterprise |
| business_name | text | |
| vat_number | text | |
| is_verified_business | boolean | |
| commission_rate | numeric | Default 12.00 |
| final_value_fee | numeric | Default 12.00 |
| insertion_fee | numeric | Default 0 |
| per_order_fee | numeric | Default 0 |
| shipping_region | text | BG/UK/EU/US/WW |
| country_code | text | |
| region_auto_detected | boolean | |
| default_city | text | |
| onboarding_completed | boolean | |

**🟡 Issues**:
- Too many seller-specific columns in unified profiles table
- Consider: Split seller_profiles as a separate extension table

---

### 2. products (247 rows)
**Purpose**: Product catalog

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| seller_id | uuid | FK to profiles |
| category_id | uuid | FK to categories |
| title | text | |
| description | text | |
| price | numeric | CHECK > 0 |
| list_price | numeric | Original price |
| stock | integer | |
| images | text[] | Array of URLs |
| rating | numeric | 0-5 |
| review_count | integer | |
| is_prime | boolean | |
| search_vector | tsvector | Full-text search |
| tags | text[] | |
| slug | varchar | |
| brand_id | uuid | FK to brands |
| is_boosted | boolean | |
| boost_expires_at | timestamp | |
| is_featured | boolean | |
| listing_type | text | normal/boosted |
| ships_to_bulgaria | boolean | |
| ships_to_europe | boolean | |
| ships_to_usa | boolean | |
| ships_to_uk | boolean | |
| ships_to_worldwide | boolean | |
| pickup_only | boolean | |
| attributes | jsonb | Dynamic attributes |
| sku | varchar | |
| barcode | varchar | |
| status | text | active/draft/archived/out_of_stock |
| cost_price | numeric | For profit calc |
| weight | numeric | |
| weight_unit | varchar | kg/g/lb/oz |
| condition | text | new/used/refurbished/like_new/good/fair |
| track_inventory | boolean | |
| is_on_sale | boolean | |
| sale_percent | integer | 0-99 |
| sale_end_date | timestamp | |
| free_shipping | boolean | |
| is_limited_stock | boolean | |
| stock_quantity | integer | |
| featured_until | timestamp | |
| shipping_days | integer | |
| seller_city | text | |
| category_ancestors | uuid[] | GIN indexed for hierarchy |

**✅ Good**: 
- JSONB attributes for dynamic filtering
- category_ancestors for efficient hierarchy queries
- Full-text search vector

**🟡 Issues**:
- 5 separate shipping boolean columns → Should be a single jsonb or shipping_zones array
- Duplicate stock columns (stock vs stock_quantity)
- is_limited_stock seems redundant with stock tracking

---

### 3. categories (13,139 rows) 🔴 CRITICAL OVER-ENGINEERING
**Purpose**: Hierarchical category structure

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| slug | text | UNIQUE |
| parent_id | uuid | Self-reference FK |
| image_url | text | |
| name_bg | text | Bulgarian translation |
| description | text | |
| description_bg | text | |
| icon | text | |
| display_order | integer | |

**Category Hierarchy Depth**:
```
Level 0 (L0): 24 categories     (Root categories)
Level 1 (L1): 291 categories    (Main subcategories)  
Level 2 (L2): 3,073 categories  (Sub-subcategories)
Level 3 (L3): 9,104 categories  (Leaf categories)
Level 4 (L4): 647 categories    (Deep leaf categories)
───────────────────────────────────
TOTAL:        13,139 categories
```

---

## Category System Deep Dive

### L0 Categories (24 Root Categories)

| Category | Slug | L1 Children |
|----------|------|-------------|
| Fashion | fashion | 10 |
| Electronics | electronics | 11 |
| Home & Kitchen | home | 11 |
| Beauty | beauty | 8 |
| Health | health-wellness | 5 |
| Sports | sports | 15 |
| Kids | baby-kids | 7 |
| Gaming | gaming | 10 |
| Automotive | automotive | 9 |
| Pets | pets | 12 |
| Real Estate | real-estate | 11 |
| Software | software | 17 |
| Grocery & Food | grocery | 13 |
| Wholesale | wholesale | 20 |
| Hobbies | hobbies | 8 |
| Jewelry & Watches | jewelry-watches | 10 |
| Bulgarian Traditional | bulgarian-traditional | 13 |
| E-Mobility | e-mobility | 9 |
| Services & Events | services | 23 |
| Books | books | 12 |
| Movies & Music | movies-music | 15 |
| Jobs | jobs | 3 |
| Collectibles | collectibles | 14 |
| Tools & Industrial | tools-home | 25 |

### 🔴 PROBLEM: Electronics Category Explosion

Example breakdown of Electronics (1 L0 → 1,505 total categories):
```
L0: Electronics (1)
└─ L1: 11 categories
   └─ L2: 147 categories
      └─ L3: 1,233 categories
         └─ L4: 113 categories
```

### 🔴 PROBLEM: Fashion Category Example

```
Fashion (L0)
├── [HIDDEN] Accessories (L1)
│   ├── Belts (L2)
│   │   ├── Braided Belts (L3)
│   │   ├── Canvas Belts (L3)
│   │   ├── Casual Belts (L3)
│   │   ├── Dress Belts (L3)
│   │   ├── Elastic Belts (L3)
│   │   ├── Leather Belts (L3)
│   │   ├── Reversible Belts (L3)
│   │   └── Western Belts (L3)
│   ├── Gloves (L2)
│   │   ├── Driving Gloves (L3)
│   │   ├── Fashion Gloves (L3)
│   │   ├── Fingerless Gloves (L3)
│   │   └── ... 5 more types
│   └── ... 10+ more L2 categories
└── ... 9 more L1 categories
```

**This is eBay/Amazon level complexity for a marketplace with 247 products!**

---

## Attributes System

### category_attributes (8,762 rows) 🔴 OVER-ENGINEERED

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| category_id | uuid | FK to categories |
| name | text | Attribute name |
| name_bg | text | Bulgarian translation |
| attribute_type | text | text/number/select/multiselect/boolean/date |
| is_required | boolean | |
| is_filterable | boolean | |
| options | jsonb | For select/multiselect types |
| options_bg | jsonb | Bulgarian options |
| placeholder | text | |
| placeholder_bg | text | |
| validation_rules | jsonb | |
| sort_order | integer | |

**Distribution by Category Level**:
```
L0 categories: 505 attributes   (21 attrs/category average)
L1 categories: 1,773 attributes (6 attrs/category average)
L2 categories: 1,006 attributes (0.3 attrs/category average)
L3 categories: 5,420 attributes (0.6 attrs/category average)
L4 categories: 31 attributes    (0.05 attrs/category average)
───────────────────────────────────────────────────────────
TOTAL:         8,762 attributes
```

### product_attributes (72 rows)
Stores actual product attribute values.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK |
| attribute_id | uuid | FK to category_attributes |
| name | text | |
| value | text | |
| is_custom | boolean | Seller-defined custom attribute |

**🟡 Issue**: Duplicating `products.attributes` (JSONB) functionality

---

## User & Auth System

### user_verification (24 rows)
| Column | Type |
|--------|------|
| user_id | uuid |
| email_verified | boolean |
| phone_verified | boolean |
| phone_number | text |
| id_verified | boolean |
| id_document_type | text |
| address_verified | boolean |
| trust_score | integer (0-100) |

### business_verification (2 rows)
| Column | Type |
|--------|------|
| seller_id | uuid |
| legal_name | text |
| vat_number | text |
| eik_number | text (Bulgarian company ID) |
| vat_verified | boolean |
| registration_doc_url | text |
| registration_verified | boolean |
| bank_verified | boolean |
| verification_level | integer (0-5) |

### user_addresses (1 row)
Standard address storage with is_default flag.

### user_payment_methods (0 rows)
Stripe payment method storage.

---

## Commerce System

### orders (7 rows)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to profiles |
| total_amount | numeric | |
| status | text | pending/paid/processing/shipped/delivered/cancelled |
| shipping_address | jsonb | |
| stripe_payment_intent_id | text | |

### order_items (4 rows)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| order_id | uuid | FK |
| product_id | uuid | FK |
| seller_id | uuid | FK |
| quantity | integer | |
| price_at_purchase | numeric | |
| status | text | Per-item status |
| tracking_number | text | |
| shipping_carrier | text | |
| variant_id | uuid | FK to product_variants |

### cart_items (1 row)
Server-side cart storage.

### wishlists (28 rows)
With sharing functionality (share_token, is_public).

---

## Messaging & Notifications

### conversations (3 rows)
Buyer-seller messaging threads.

### messages (18 rows)
Individual messages with read tracking.

### notifications (1 row)
| Column | Type |
|--------|------|
| type | text | purchase/order_status/message/review/system/promotion |
| title | text |
| body | text |
| data | jsonb |
| is_read | boolean |

### notification_preferences (0 rows)
Per-notification-type preferences for in-app, email, push.

### blocked_users (0 rows)
Messaging block list.

---

## Seller/Subscription System

### subscription_plans (9 rows)
| Column | Type | Notes |
|--------|------|-------|
| tier | text | free/starter/basic/premium/professional/business/enterprise |
| price_monthly | numeric | |
| price_yearly | numeric | |
| max_listings | integer | |
| commission_rate | numeric | |
| features | jsonb | |
| stripe_price_monthly_id | text | |
| stripe_price_yearly_id | text | |
| boosts_included | integer | |
| priority_support | boolean | |
| analytics_access | text | none/basic/full/export |

### subscriptions (1 row)
Active seller subscriptions.

### listing_boosts (1 row)
Product boost/promotion tracking.

### seller_stats (11 rows)
Cached seller statistics:
- total_listings, active_listings
- total_sales, total_revenue
- average_rating, total_reviews, five_star_reviews
- positive_feedback_pct
- item_described_pct, shipping_speed_pct, communication_pct
- follower_count, response_time_hours, response_rate_pct
- shipped_on_time_pct, repeat_customer_pct

### buyer_stats (24 rows)
Cached buyer statistics.

### seller_feedback (0 rows)
Buyer feedback on sellers.

### buyer_feedback (0 rows)
Seller feedback on buyers.

### store_followers (1 row)
Store follow relationships.

---

## Badge System

### badge_definitions (59 rows)
| Column | Type | Notes |
|--------|------|-------|
| code | text | Unique badge code |
| name | text | |
| category | text | seller_milestone/seller_rating/seller_special/buyer_milestone/buyer_rating/buyer_special/verification/subscription |
| account_type | text | personal/business/buyer/all |
| criteria | jsonb | Auto-award criteria |
| is_automatic | boolean | |

### user_badges (0 rows)
Awarded badges tracking.

---

## Functions & Triggers Analysis

### Functions (81 total)

#### Core Business Logic
- `cart_add_item`, `cart_clear`, `cart_set_quantity`
- `check_listing_limit`, `check_not_own_product`
- `generate_product_slug`, `generate_store_slug`
- `transliterate_bulgarian`

#### Stats/Analytics
- `update_product_rating`, `update_seller_rating`
- `update_seller_listing_counts`, `update_seller_sales_stats`
- `update_buyer_stats_from_feedback`, `update_seller_stats_from_feedback`

#### Notifications
- `notify_on_new_message`, `notify_on_order_status_change`
- `notify_on_wishlist_price_drop`, `notify_seller_on_new_follower`
- `notify_seller_on_new_purchase`

#### Security/Validation
- `is_admin`, `is_blocked_bidirectional`, `is_user_blocked`
- `check_message_allowed`, `protect_sensitive_columns`

#### Messaging
- `get_or_create_conversation`, `get_conversation_messages`
- `get_user_conversations`, `block_user`, `unblock_user`

### Triggers (71 total)

**Products table** (13 triggers!) 🔴
- `auto_set_fashion_gender_trigger` (INSERT, UPDATE)
- `check_listing_limit_trigger` (INSERT)
- `handle_products_updated_at` (UPDATE)
- `on_price_drop_notify_wishlist` (UPDATE)
- `on_product_change` (INSERT, UPDATE, DELETE)
- `on_product_created` (INSERT, UPDATE)
- `product_slug_trigger` (INSERT, UPDATE)
- `set_seller_flag_on_product` (INSERT)
- `trg_update_product_category_ancestors` (INSERT, UPDATE)
- `update_seller_listing_counts_delete` (DELETE)
- `update_seller_listing_counts_insert` (INSERT)
- `update_seller_listing_counts_update` (UPDATE)

**order_items table** (7 triggers) 🟡
- `on_new_purchase_notify_seller`
- `on_order_item_created`
- `on_order_item_status_change`
- `on_order_item_status_change_notify`
- `prevent_self_purchase_trigger`
- `trg_order_items_decrement_stock`
- `update_product_stock_on_order`

**reviews table** (4 triggers)
**seller_feedback table** (6 triggers)
**profiles table** (3 triggers)

---

## Performance Issues

### Unused Indexes (15 found) 🟠

| Table | Index |
|-------|-------|
| buyer_feedback | idx_buyer_feedback_order_id |
| conversations | idx_conversations_order_id |
| listing_boosts | idx_listing_boosts_product_id |
| notifications | idx_notifications_user_id |
| notifications | idx_notifications_order_id |
| notifications | idx_notifications_product_id |
| notifications | idx_notifications_conversation_id |
| seller_feedback | idx_seller_feedback_order_id |
| cart_items | idx_cart_items_product_id |
| cart_items | idx_cart_items_variant_id |
| order_items | idx_order_items_product_id |
| order_items | idx_order_items_variant_id |
| user_badges | idx_user_badges_badge_id |
| business_verification | idx_business_verification_verified_by |
| wishlists | idx_wishlists_product_id |

---

## Security Advisors

### Current Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| Leaked Password Protection | ⚠️ WARN | HaveIBeenPwned check disabled |

**Recommendation**: Enable leaked password protection in Auth settings.

---

## Migration History Analysis

### 723 Migrations! 🔴 EXTREME

**Pattern Analysis**:
- Multiple "restore_massive_l3_categories_batch" migrations (90+ batches)
- Repeated "phase" migrations indicating iterative design
- Many "fix_" prefixed migrations indicating bugs in previous migrations
- "cleanup_duplicate_" migrations suggesting data quality issues

**Sample of problematic patterns**:
```
restore_massive_l3_categories_batch1 through batch89
restore_category_attributes_batch1 through batch30
fix_orphaned_categories_reparenting
fix_duplicate_gpu_categories
cleanup_duplicate_categories
cleanup_all_duplicate_levels
```

**This indicates**:
1. Poor upfront schema design
2. No migration testing environment
3. "Ship and fix" development culture
4. Categories were manually expanded without strategy

---

## Recommendations

### 🔴 CRITICAL: Category System Overhaul

**Current**: 13,139 categories across 5 levels  
**Recommended**: 500-2000 categories across 3 levels max

**Action Plan**:
1. **Flatten to L0 → L1 → L2 (max 3 levels)**
2. **Use attributes for specificity** instead of deep categories
3. **Example transformation**:
   ```
   CURRENT (4 levels):
   Fashion > Accessories > Belts > Leather Belts
   
   PROPOSED (2 levels + attribute):
   Fashion > Belts [attribute: material=leather]
   ```

4. **Target structure**:
   ```
   L0: 15-20 categories (reduce from 24)
   L1: 100-150 categories (reduce from 291)
   L2: 300-500 categories (reduce from 3,073)
   L3: REMOVE (merge into attributes)
   L4: REMOVE (merge into attributes)
   ```

### 🔴 CRITICAL: Attributes Simplification

**Current**: 8,762 category_attributes + products.attributes JSONB  
**Issue**: Dual system is confusing and redundant

**Recommended approach**:
1. **Keep ONLY products.attributes (JSONB)** for product-level attributes
2. **Replace category_attributes with a simple config file** (TypeScript/JSON)
3. **Use attribute inheritance** - don't duplicate at every level

```typescript
// Example: category-attributes.ts
export const categoryAttributes = {
  'fashion': {
    base: ['brand', 'condition', 'size', 'color', 'material'],
    subcategories: {
      'clothing': ['fit', 'style', 'season'],
      'shoes': ['shoe_size', 'heel_height', 'closure_type'],
    }
  }
}
```

### 🟡 HIGH: Reduce Triggers

**Current**: 71 triggers (13 on products alone!)  
**Recommended**: Max 2-3 triggers per table

**Actions**:
1. Consolidate multiple triggers into single multi-purpose triggers
2. Move complex business logic to application layer
3. Use database functions only for data integrity

### 🟡 HIGH: Function Cleanup

**Current**: 81 functions  
**Recommended**: 30-40 essential functions

**Keep**:
- RLS helper functions (`is_admin`, etc.)
- Data integrity functions
- Search functions

**Remove/Move to App Layer**:
- Notification logic
- Complex stats calculations
- Badge evaluation

### 🟠 MEDIUM: Clean Up Unused Indexes

Drop these 15 indexes to reduce write overhead:
```sql
DROP INDEX idx_buyer_feedback_order_id;
DROP INDEX idx_conversations_order_id;
DROP INDEX idx_listing_boosts_product_id;
-- ... (see Performance Issues section)
```

### 🟠 MEDIUM: Products Table Cleanup

1. **Consolidate shipping columns**:
   ```sql
   -- Replace 5 boolean columns:
   ships_to_bulgaria, ships_to_europe, ships_to_usa, ships_to_uk, ships_to_worldwide
   
   -- With single array:
   ships_to text[] -- ['BG', 'EU', 'UK', 'US', 'WW']
   ```

2. **Remove duplicate stock tracking**:
   - Keep `stock` column
   - Remove `stock_quantity` (redundant)
   - Remove `is_limited_stock` (calculate from stock value)

### 🟢 LOW: Enable Security Features

1. Enable leaked password protection
2. Add MFA requirement for sellers

---

## Appendix A: Installed Extensions

| Extension | Version | Purpose |
|-----------|---------|---------|
| pg_cron | 1.6.4 | Job scheduling |
| uuid-ossp | 1.1 | UUID generation |
| pgcrypto | 1.3 | Cryptographic functions |
| pg_stat_statements | 1.11 | Query statistics |
| pg_trgm | 1.6 | Trigram similarity |
| pg_graphql | 1.5.11 | GraphQL support |
| supabase_vault | 0.3.1 | Secrets management |
| plpgsql | 1.0 | PL/pgSQL |

---

## Appendix B: Database Size Estimates

| Table | Rows | Est. Size |
|-------|------|-----------|
| categories | 13,139 | ~5 MB |
| category_attributes | 8,762 | ~10 MB |
| products | 247 | ~1 MB |
| profiles | 24 | <1 MB |
| orders | 7 | <1 MB |
| All other tables | ~200 | <1 MB |

**Total estimated**: ~20 MB active data

**Issue**: For 247 products, you have 13,000+ categories and 8,700+ attributes. This is **wildly disproportionate**.

---

## Appendix C: RLS Policy Count

| Table | Policies |
|-------|----------|
| user_payment_methods | 4 |
| user_addresses | 4 |
| notifications | 4 |
| reviews | 4 |
| cart_items | 4 |
| product_variants | 4 |
| product_images | 4 |
| categories | 4 |
| profiles | 4 |
| products | 4 |
| wishlists | 3 |
| conversations | 3 |
| messages | 3 |
| orders | 3 |
| subscriptions | 3 |

---

## Summary: Priority Action Items

### Immediate (This Week)
- [ ] Drop 15 unused indexes
- [ ] Enable leaked password protection
- [ ] Audit and document current category usage

### Short-term (This Month)
- [ ] Design simplified 3-level category structure
- [ ] Create migration plan for category flattening
- [ ] Consolidate shipping columns in products
- [ ] Remove duplicate product_attributes system

### Long-term (This Quarter)
- [ ] Execute category simplification (13k → 2k)
- [ ] Reduce triggers from 71 to ~25
- [ ] Move notification logic to application layer
- [ ] Reduce functions from 81 to ~40

---

**Document Status**: DRAFT - For Review  
**Next Steps**: Review with team, prioritize recommendations
