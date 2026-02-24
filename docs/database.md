# Database Context

> Schema overview, domain groupings, query patterns, RLS.
> Full auto-generated schema: `docs/generated/db-schema.md`
> Source of truth: `supabase/migrations/**`

---

## Overview

Supabase Postgres with Row-Level Security (RLS). 47 tables, 152 policies, 149 indexes.
Generated types: `lib/supabase/database.types.ts`. Regenerate with `pnpm -s supabase gen types --linked --lang typescript --schema public > lib/supabase/database.types.ts` (or `--local` when running local Supabase).

---

## Domain Groupings

### Auth & Users
| Table | Purpose |
|-------|---------|
| `profiles` | Public user profile (username, display name, avatar, onboarding state) |
| `private_profiles` | Private user data (Stripe customer ID, preferences) |
| `sellers` | Seller profile (business info, Stripe Connect ID, verification status) |
| `user_addresses` | Shipping/billing addresses |
| `user_payment_methods` | Saved payment methods (from Stripe setup flow) |
| `user_verification` | Identity verification state |
| `user_badges` / `badge_definitions` | Achievement/trust badges |
| `username_history` | Username change audit trail |
| `blocked_users` | User blocking |

### Products & Catalog
| Table | Purpose |
|-------|---------|
| `products` | Core product listing (title, description, price, status, seller, category) |
| `product_images` | Product photo references |
| `product_variants` / `variant_options` | Size/color variants |
| `product_attributes` / `category_attributes` | Dynamic attributes per category (`category_attributes.is_active` flags unused definitions) |
| `product_private` | Seller-only product data |
| `categories` | 4-level category tree (24 top-level categories). Browse UI uses `is_browseable` (seed products normalized to leaf categories) |
| `category_stats` | Cached category counts (no RLS — public data) |
| `brands` | Brand registry |

### Commerce
| Table | Purpose |
|-------|---------|
| `orders` | Order header (buyer, status, payment intent, totals) |
| `order_items` | Line items per order |
| `cart_items` | Shopping cart persistence |
| `wishlists` | Saved/favorited products |
| `listing_boosts` / `boost_prices` | Paid visibility upgrades |
| `return_requests` | Buyer return/dispute requests |

### Payments & Subscriptions
| Table | Purpose |
|-------|---------|
| `subscription_plans` | Plan tiers with fee config |
| `subscriptions` | Active seller subscriptions |
| `seller_payout_status` | Stripe Connect payout readiness |
| `seller_shipping_settings` / `shipping_zones` | Shipping configuration |

### Social
| Table | Purpose |
|-------|---------|
| `reviews` | Product reviews (rating + text) |
| `seller_feedback` / `buyer_feedback` | Post-transaction feedback |
| `seller_stats` / `buyer_stats` | Aggregated reputation stats |
| `store_followers` | Follow/unfollow sellers |
| `conversations` / `messages` | Real-time chat |
| `search_history` | Search query history |
| `notifications` / `notification_preferences` | In-app notifications |

### Admin
| Table | Purpose |
|-------|---------|
| `admin_docs` / `admin_notes` / `admin_tasks` | Admin panel management data |
| `business_verification` | Business account verification |

---

## RLS Pattern

All user-facing tables have RLS enabled (46 of 47 — `category_stats` is the exception).

**Common policy patterns:**
- `SELECT` — typically `auth.uid() = user_id` for own data, or public read for products/categories/reviews
- `INSERT` — scoped to `auth.uid() = user_id` with `WITH CHECK`
- `UPDATE` / `DELETE` — owner only (`auth.uid() = user_id`) or admin
- `notifications` INSERT — restricted to `service_role` only (DEC-012)

**Key RLS considerations:**
- Products/categories/reviews/sellers have public `SELECT` policies
- Orders visible to both buyer and seller (two-party access)
- Conversations visible to participants only
- Admin tables restricted to admin role

---

## Query Patterns

**Always project needed columns** — no `select('*')` in hot paths.

```ts
// CORRECT: project specific columns
const { data } = await supabase
  .from('products')
  .select('id, title, price, slug, product_images(url)')
  .eq('status', 'active')
  .limit(20)

// WRONG: select all
const { data } = await supabase.from('products').select('*')
```

**Cached reads** use `createStaticClient()` (no cookies, anon-only).
**User-specific reads** use `createClient()` (cookies, respects RLS).
**Admin operations** use `createAdminClient()` (bypasses RLS — verify trust first).

**Common joins:** `products` → `product_images`, `products` → `categories`, `orders` → `order_items`, `conversations` → `messages`.
Avoid wide joins in list views — fetch details on demand (PDP, order detail page).

---

*Last verified: 2026-02-21*
