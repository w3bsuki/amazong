# Generated Database Schema

> Auto-generated from 84 migration files in `supabase/migrations/`.
> Generated: 2026-02-12

⚠️ **This file is auto-generated.** Do not edit manually. Run `node scripts/generate-db-schema.mjs` to regenerate.

---

## Summary

- **Tables:** 34
- **Tables with RLS:** 46
- **Total indexes:** 156
- **Total policies:** 91
- **Migrations:** 84

---

## Tables

| Table | RLS | Indexes | Policies | First Migration |
|-------|-----|---------|----------|-----------------|
| `admin_docs` | ✅ | 6 | 1 | 20260120100000... |
| `admin_notes` | ✅ | 3 | 1 | 20260120100000... |
| `admin_tasks` | ✅ | 6 | 1 | 20260120100000... |
| `blocked_users` | ✅ | 4 | 0 | 20251214000001... |
| `boost_prices` | ✅ | 2 | 0 | 20251201000000... |
| `buyer_feedback` | ✅ | 6 | 2 | 20251215200000... |
| `cart_items` | ✅ | 6 | 8 | 20251226000000... |
| `categories` | ✅ | 3 | 4 | 20240101000000... |
| `conversations` | ✅ | 9 | 5 | 20251127000001... |
| `listing_boosts` | ✅ | 2 | 0 | 20251201000000... |
| `messages` | ✅ | 4 | 6 | 20251127000001... |
| `notification_preferences` | ✅ | 0 | 0 | 20251224000000... |
| `notifications` | ✅ | 11 | 0 | 20251214000000... |
| `order_items` | ✅ | 6 | 2 | 20240101000000... |
| `orders` | ✅ | 4 | 3 | 20240101000000... |
| `private_profiles` | ✅ | 0 | 3 | 20260124120000... |
| `product_private` | ✅ | 1 | 4 | 20260124120000... |
| `product_variants` | ✅ | 5 | 4 | 20251127000000... |
| `products` | ✅ | 19 | 4 | 20240101000000... |
| `profiles` | ✅ | 6 | 4 | 20240101000000... |
| `return_requests` | ✅ | 5 | 3 | 20260110120000... |
| `reviews` | ✅ | 10 | 5 | 20240101000000... |
| `search_history` | ✅ | 3 | 0 | 20251127_add_s... |
| `seller_feedback` | ✅ | 9 | 7 | 20251211000000... |
| `seller_payout_status` | ✅ | 0 | 1 | 20260110000000... |
| `seller_shipping_settings` | ✅ | 0 | 3 | 20260110000000... |
| `sellers` | ✅ | 2 | 4 | 20240101000000... |
| `store_followers` | ✅ | 3 | 1 | 20251211000001... |
| `subscription_plans` | ✅ | 0 | 1 | 20251201000000... |
| `subscriptions` | ✅ | 4 | 0 | 20251201000000... |
| `user_addresses` | ✅ | 2 | 0 | 20251201100000... |
| `user_payment_methods` | ✅ | 2 | 0 | 20251201100000... |
| `username_history` | ✅ | 2 | 2 | 20251215200000... |
| `variant_options` | ✅ | 0 | 4 | 20251127000000... |

---

## RLS-Enabled Tables

### admin_docs
Policies: `admin_docs_admin_only`

### admin_notes
Policies: `admin_notes_admin_only`

### admin_tasks
Policies: `admin_tasks_admin_only`

### badge_definitions
Policies: (none found in migrations)

### blocked_users
Policies: (none found in migrations)

### boost_prices
Policies: (none found in migrations)

### brands
Policies: (none found in migrations)

### business_verification
Policies: `business_verification_select`, `business_verification_select_unified`

### buyer_feedback
Policies: `buyer_feedback_select_all`, `buyer_feedback_insert_seller`

### buyer_stats
Policies: `buyer_stats_select_unified`

### cart_items
Policies: `cart_items_select_own`, `cart_items_insert_own`, `cart_items_update_own`, `cart_items_delete_own`, `cart_items_select_own`, `cart_items_insert_own`, `cart_items_update_own`, `cart_items_delete_own`

### categories
Policies: `categories_select_all`, `categories_insert_admin_only`, `categories_update_admin_only`, `categories_delete_admin_only`

### category_attributes
Policies: (none found in migrations)

### conversations
Policies: `conversations_select_participant`, `conversations_insert_buyer`, `conversations_update_participant`, `conversations_insert_for_orders`, `conversations_insert_for_orders`

### listing_boosts
Policies: (none found in migrations)

### messages
Policies: `messages_select_participant`, `messages_insert_participant`, `messages_update_own`, `messages_insert_participant`, `messages_insert_system`, `messages_insert_system`

### notification_preferences
Policies: (none found in migrations)

### notifications
Policies: (none found in migrations)

### order_items
Policies: `order_items_select_buyer_or_seller`, `order_items_insert_with_order`

### orders
Policies: `orders_select_own_or_seller`, `orders_insert_own`, `orders_update_own`

### private_profiles
Policies: `private_profiles_select_own`, `private_profiles_insert_own`, `private_profiles_update_own`

### product_attributes
Policies: (none found in migrations)

### product_images
Policies: (none found in migrations)

### product_private
Policies: `product_private_select_own`, `product_private_insert_own`, `product_private_update_own`, `product_private_delete_own`

### product_variants
Policies: `product_variants_select_all`, `product_variants_insert_seller`, `product_variants_update_seller`, `product_variants_delete_seller`

### products
Policies: `products_select_all`, `products_insert_seller`, `products_update_own`, `products_delete_own_or_admin`

### profiles
Policies: `profiles_select_all`, `profiles_insert_own`, `profiles_update_own`, `profiles_delete_admin_only`

### return_requests
Policies: `return_requests_insert_own`, `return_requests_select_buyer`, `return_requests_select_seller`

### reviews
Policies: `reviews_select_all`, `reviews_insert_authenticated`, `reviews_update_own`, `reviews_delete_own_or_admin`, `reviews_seller_response`

### search_history
Policies: (none found in migrations)

### seller_feedback
Policies: `seller_feedback_select_all`, `seller_feedback_insert_buyer`, `seller_feedback_update_own`, `seller_feedback_delete_own_or_admin`, `seller_feedback_update_buyer`, `seller_feedback_insert_buyer`, `seller_feedback_insert_buyer`

### seller_payout_status
Policies: `seller_payout_status_select_own`

### seller_shipping_settings
Policies: `seller_shipping_settings_select_own`, `seller_shipping_settings_insert_own`, `seller_shipping_settings_update_own`

### seller_stats
Policies: `seller_stats_select_unified`

### sellers
Policies: `sellers_select_all`, `sellers_insert_own`, `sellers_update_own`, `sellers_delete_own_or_admin`

### shipping_zones
Policies: (none found in migrations)

### store_followers
Policies: `store_followers_select_unified`

### subscription_plans
Policies: `subscription_plans_select`

### subscriptions
Policies: (none found in migrations)

### user_addresses
Policies: (none found in migrations)

### user_badges
Policies: (none found in migrations)

### user_payment_methods
Policies: (none found in migrations)

### user_verification
Policies: `user_verification_select_own`, `user_verification_select_unified`

### username_history
Policies: `username_history_select_own`, `username_history_insert_system`

### variant_options
Policies: `variant_options_select_all`, `variant_options_insert_admin`, `variant_options_update_admin`, `variant_options_delete_admin`

### wishlists
Policies: `wishlists_select_own_or_public`, `wishlists_select_own_or_public`

---

*Generated: 2026-02-12*
