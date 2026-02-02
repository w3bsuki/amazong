# 06-DATABASE.md — Supabase Schema Reference

> **Purpose:** Complete database schema documentation for the Treido marketplace. Single Source of Truth for all tables, RLS policies, and key queries.

| Scope | Supabase PostgreSQL database |
|-------|------------------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Quick Reference

- **Database:** Supabase (PostgreSQL 15+)
- **Tables:** 60+ in public schema
- **RLS:** Enabled on all user-facing tables
- **Extensions:** pg_trgm, pg_cron, uuid-ossp, pgcrypto, pg_graphql, supabase_vault
- **Migrations:** 870+ versioned migrations in `supabase/migrations/`

---

## Schema Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TREIDO DATABASE                              │
├─────────────────────────────────────────────────────────────────────┤
│  CORE ENTITIES                                                      │
│  profiles ─── products ─── orders ─── order_items                   │
├─────────────────────────────────────────────────────────────────────┤
│  CATALOG                                                            │
│  categories ─── category_attributes ─── brands ─── product_variants │
├─────────────────────────────────────────────────────────────────────┤
│  SOCIAL                                                             │
│  reviews ─── conversations ─── messages ─── store_followers         │
├─────────────────────────────────────────────────────────────────────┤
│  MONETIZATION                                                       │
│  subscriptions ─── subscription_plans ─── listing_boosts            │
├─────────────────────────────────────────────────────────────────────┤
│  USER DATA                                                          │
│  wishlists ─── cart_items ─── user_addresses ─── notifications      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Tables

### profiles

User profiles extending auth.users. Single identity for buyers and sellers.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, FK → auth.users |
| username | text | Unique, for /u/[username] URLs |
| display_name | text | Public display name |
| avatar_url | text | Profile picture |
| role | text | buyer, seller, admin |
| account_type | text | personal, business |
| is_seller | boolean | Auto-set on first listing |
| tier | text | free, starter, premium, etc. |
| onboarding_completed | boolean | Welcome flow status |
| boosts_remaining | integer | Free boosts from subscription |
| last_active | timestamptz | Activity tracking |
| created_at | timestamptz | |

**RLS:** Public read, owner update only. Role changes blocked by trigger.

---

### products

Product listings with full-text search and JSONB attributes.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| seller_id | uuid | FK → profiles |
| category_id | uuid | FK → categories (leaf only) |
| title | text | Product title |
| description | text | Full description |
| price | numeric | Current price (must be > 0) |
| list_price | numeric | Original/strike-through price |
| stock | integer | Inventory count (≥ 0) |
| images | text[] | Array of image URLs |
| attributes | jsonb | Dynamic attributes for filtering |
| condition | text | new, like_new, used, etc. |
| status | text | active, draft, archived, out_of_stock |
| is_boosted | boolean | Currently promoted |
| boost_expires_at | timestamptz | Boost end time |
| search_vector | tsvector | Full-text search index |
| category_ancestors | uuid[] | Hierarchical category path |
| seller_city | text | Item location |
| view_count | integer | Page view counter |
| created_at | timestamptz | |

**RLS:** Public read, seller CRUD on own products.

**Indexes:** seller_id, category_id, search_vector (GIN), category_ancestors (GIN)

---

### categories

Hierarchical product categories (L0 → L1 → L2 → L3).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | English name |
| name_bg | text | Bulgarian name |
| slug | text | Unique URL slug |
| parent_id | uuid | FK → categories (self-ref) |
| image_url | text | Category image |
| icon | text | Icon identifier |
| display_order | integer | Sort order |

**Hierarchy Levels:**
- L0: Root (Electronics, Fashion, etc.)
- L1: Main subcategories
- L2: Detailed subcategories
- L3: Specific types

**RLS:** Public read, admin-only write.

---

### orders

Customer orders with Stripe payment tracking.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| total_amount | numeric | Order total |
| status | text | pending, paid, processing, shipped, delivered, cancelled |
| fulfillment_status | text | Overall fulfillment state |
| shipping_address | jsonb | Delivery address |
| stripe_payment_intent_id | text | Unique, idempotency |
| created_at | timestamptz | |

**RLS:** Owner read/insert only.

---

### order_items

Line items linking orders to products and sellers.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| order_id | uuid | FK → orders |
| product_id | uuid | FK → products |
| seller_id | uuid | FK → profiles |
| variant_id | uuid | FK → product_variants (optional) |
| quantity | integer | Must be > 0 |
| price_at_purchase | numeric | Snapshot price |
| status | text | pending, received, processing, shipped, delivered, cancelled |
| tracking_number | text | Carrier tracking |
| shipping_carrier | text | Speedy, Econt, DHL, etc. |

**RLS:** Buyer sees own orders, seller sees their items.

---

## Catalog Tables

### category_attributes

Dynamic form fields per category (like eBay Item Specifics).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| category_id | uuid | FK → categories |
| name | text | English attribute name |
| name_bg | text | Bulgarian name |
| attribute_key | text | Normalized snake_case key |
| attribute_type | text | text, number, select, multiselect, boolean, date |
| options | jsonb | Select options array |
| is_required | boolean | Mandatory field |
| is_filterable | boolean | Show in filters |
| is_hero_spec | boolean | Show in product highlights |
| is_badge_spec | boolean | Show as badge on cards |
| unit_suffix | text | km, m², HP, L, etc. |

**RLS:** Public read.

---

### brands

Brand information with logo support.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | Unique brand name |
| slug | text | Unique URL slug |
| logo_url | text | SVG logo (from SVGL) |
| logo_dark_url | text | Dark mode variant |
| is_verified | boolean | Verified brand |

**RLS:** Public read.

---

### product_variants

Size/color variants for products.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK → products |
| sku | text | Unique SKU |
| name | text | Variant display name |
| size | text | Size value |
| color | text | Color name |
| color_hex | text | Hex color code |
| price_adjustment | numeric | +/- from base price |
| stock | integer | Variant stock |

**RLS:** Public read, seller CRUD.

---

## Social Tables

### reviews

Product reviews with seller response support.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK → products |
| user_id | uuid | FK → profiles |
| rating | integer | 1-5 stars |
| title | text | Review title |
| comment | text | Review body |
| images | text[] | Review photos |
| verified_purchase | boolean | From actual order |
| seller_response | text | Seller reply |
| helpful_count | integer | Upvotes |

**RLS:** Public read, user CRUD on own.

---

### conversations / messages

Buyer-seller messaging system.

**conversations:**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| buyer_id | uuid | FK → auth.users |
| seller_id | uuid | FK → auth.users |
| product_id | uuid | FK → products (optional) |
| order_id | uuid | FK → orders (optional) |
| status | text | open, closed, archived |
| buyer_unread_count | integer | Unread for buyer |
| seller_unread_count | integer | Unread for seller |

**messages:**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| conversation_id | uuid | FK → conversations |
| sender_id | uuid | FK → auth.users |
| content | text | Message body (non-empty) |
| message_type | text | text, image, system |
| is_read | boolean | Read status |

**RLS:** Participants only.

---

## Monetization Tables

### subscription_plans

Available seller subscription tiers.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | Plan name |
| tier | text | free, starter, basic, premium, professional, business, enterprise |
| price_monthly | numeric | EUR/month |
| price_yearly | numeric | EUR/year |
| currency | text | Default: EUR |
| max_listings | integer | Listing limit (NULL = unlimited) |
| commission_rate | numeric | Transaction fee % |
| boosts_included | integer | Free monthly boosts |
| stripe_price_monthly_id | text | Stripe Price ID |
| stripe_price_yearly_id | text | Stripe Price ID |

---

### subscriptions

Active seller subscriptions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| seller_id | uuid | FK → profiles |
| plan_type | text | Tier value |
| status | text | active, cancelled, expired, pending |
| billing_period | text | monthly, yearly |
| expires_at | timestamptz | Expiration date |
| stripe_subscription_id | text | Stripe Sub ID |

**RLS:** Seller sees own only.

---

### listing_boosts

Paid product promotions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK → products |
| seller_id | uuid | FK → profiles |
| price_paid | numeric | Amount paid |
| duration_days | integer | Default: 7 |
| expires_at | timestamptz | Boost end |
| stripe_checkout_session_id | text | Unique, idempotent |

**RLS:** Seller sees own only.

---

## User Data Tables

### cart_items

Server-backed shopping cart.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| product_id | uuid | FK → products |
| variant_id | uuid | FK → product_variants (optional) |
| quantity | integer | Must be > 0 |

**RLS:** Owner CRUD only.

---

### wishlists

Saved/favorite products.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| product_id | uuid | FK → products |
| is_public | boolean | Shareable |
| share_token | text | Share URL token |

**RLS:** Owner CRUD, public read if is_public.

---

### notifications

In-app notification system.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| type | text | purchase, order_status, message, review, system, promotion |
| title | text | Notification title |
| body | text | Message body |
| is_read | boolean | Read status |
| order_id | uuid | Related order |
| product_id | uuid | Related product |

**RLS:** Owner read/update/delete.

---

## Private Tables

### private_profiles

Sensitive user data (payment info, VAT).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, FK → profiles |
| email | text | Contact email |
| phone | text | Contact phone |
| stripe_customer_id | text | Stripe Customer |
| vat_number | text | VAT ID |
| commission_rate | numeric | Custom rate |

**RLS:** Owner + admin only.

---

### product_private

Seller-only product data.

| Column | Type | Notes |
|--------|------|-------|
| product_id | uuid | PK, FK → products |
| seller_id | uuid | FK → profiles |
| cost_price | numeric | Cost basis |
| sku | text | Internal SKU |
| barcode | text | Barcode |

**RLS:** Seller + admin only.

---

## RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Public | Owner | Owner | Admin |
| products | Public | Seller | Seller | Seller |
| categories | Public | Admin | Admin | Admin |
| orders | Owner | Owner | Owner | — |
| order_items | Owner/Seller | Owner | Seller | — |
| reviews | Public | User | User | User |
| conversations | Participant | Participant | Participant | — |
| messages | Participant | Participant | Sender | — |
| cart_items | Owner | Owner | Owner | Owner |
| wishlists | Owner/Public | Owner | Owner | Owner |
| notifications | Owner | Service | Owner | Owner |
| subscriptions | Seller | Seller | Seller | — |
| private_profiles | Owner/Admin | Owner/Admin | Owner/Admin | — |

---

## Key Functions & Triggers

### Authentication

```sql
-- Check if current user is admin
CREATE FUNCTION is_admin() RETURNS boolean
-- Returns true if auth.uid() has role='admin'
```

### Profile Management

```sql
-- Auto-create profile on user signup
CREATE FUNCTION handle_new_user() RETURNS trigger
-- Triggered after INSERT on auth.users
-- Creates profiles + private_profiles + buyer_stats + user_verification
```

### Product Search

```sql
-- Full-text search vector update
CREATE FUNCTION handle_new_product_search() RETURNS trigger
-- Updates search_vector on INSERT/UPDATE
-- Weights: title='A', description='B'
```

### Category Helpers

```sql
-- Get category hierarchy path
CREATE FUNCTION get_category_path(category_id uuid) RETURNS TABLE
-- Returns full ancestor chain for breadcrumbs

-- Get all descendant categories
CREATE FUNCTION get_category_descendants(parent_id uuid) RETURNS TABLE
-- Returns all children recursively

-- Get hero/badge specs for category
CREATE FUNCTION get_hero_specs(category_id uuid) RETURNS TABLE
CREATE FUNCTION get_badge_specs(category_id uuid) RETURNS TABLE
```

### Stock Management

```sql
-- Decrement stock on order
CREATE FUNCTION decrement_stock_on_order() RETURNS trigger
-- Triggered on order_items INSERT
-- Decrements products.stock
```

### Notifications

```sql
-- Create notification helper
CREATE FUNCTION create_notification(...) RETURNS uuid
-- Creates notification entries

-- Order status change notification
CREATE FUNCTION notify_order_status_change() RETURNS trigger
-- Notifies buyer on order_items status change
```

---

## Cron Jobs

```sql
-- Expire boosts daily (pg_cron)
SELECT cron.schedule('expire-boosts', '0 0 * * *', $$
  UPDATE products SET is_boosted = false, boost_expires_at = NULL
  WHERE is_boosted = true AND boost_expires_at < NOW()
$$);
```

---

## Key Queries

### Search Products
```sql
SELECT * FROM products
WHERE search_vector @@ plainto_tsquery('english', $query)
  AND status = 'active'
ORDER BY ts_rank(search_vector, plainto_tsquery('english', $query)) DESC;
```

### Filter by Category Hierarchy
```sql
SELECT * FROM products
WHERE category_ancestors @> ARRAY[$category_id]::uuid[]
  AND status = 'active';
```

### Get Seller Stats
```sql
SELECT * FROM seller_stats WHERE seller_id = $id;
-- Pre-computed: total_sales, average_rating, follower_count, etc.
```

---

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Table names | snake_case plural: `order_items` |
| Column names | snake_case: `created_at` |
| Foreign keys | `{table}_id`: `seller_id`, `product_id` |
| Indexes | `idx_{table}_{column}` |
| Functions | `handle_*`, `create_*`, `get_*` |
| Triggers | `on_{event}` or descriptive |

---

## See Also

- [07-API.md](./07-API.md) — Server actions using this schema
- [08-PAYMENTS.md](./08-PAYMENTS.md) — Stripe integration
- [09-AUTH.md](./09-AUTH.md) — Authentication flows

---

*Last updated: 2026-02-01*
