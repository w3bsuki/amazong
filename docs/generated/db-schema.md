# Generated Database Schema

> Auto-generated from 85 migration files in `supabase/migrations/`.
> Generated: 2026-02-13

⚠️ **This file is auto-generated.** Do not edit manually. Run `node scripts/generate-db-schema.mjs` to regenerate.

---

## Summary

- **Tables:** 47
- **Tables with RLS:** 46
- **Total indexes:** 135
- **Total policies:** 152
- **Migrations:** 85

---

## Tables

| Table | RLS | Indexes | Policies | First Migration |
|-------|-----|---------|----------|-----------------|
| `admin_docs` | ✅ | 6 | 5 | 20260120100000... |
| `admin_notes` | ✅ | 3 | 5 | 20260120100000... |
| `admin_tasks` | ✅ | 6 | 5 | 20260120100000... |
| `badge_definitions` | ✅ | 0 | 0 | 20251215100000... |
| `blocked_users` | ✅ | 4 | 3 | 20251214000001... |
| `boost_prices` | ✅ | 1 | 1 | 20251201000000... |
| `brands` | ✅ | 0 | 0 | 20251215100000... |
| `business_verification` | ✅ | 1 | 2 | 20251215100000... |
| `buyer_feedback` | ✅ | 3 | 2 | 20251215100000... |
| `buyer_stats` | ✅ | 0 | 1 | 20251215100000... |
| `cart_items` | ✅ | 5 | 4 | 20251226000000... |
| `categories` | ✅ | 3 | 8 | 20240101000000... |
| `category_attributes` | ✅ | 0 | 0 | 20251215100000... |
| `category_stats` | — | 3 | 0 | 20260112000000... |
| `conversations` | ✅ | 6 | 4 | 20251127000001... |
| `listing_boosts` | ✅ | 2 | 1 | 20251201000000... |
| `messages` | ✅ | 4 | 4 | 20251127000001... |
| `notification_preferences` | ✅ | 0 | 3 | 20251224000000... |
| `notifications` | ✅ | 7 | 4 | 20251214000000... |
| `order_items` | ✅ | 5 | 4 | 20240101000000... |
| `orders` | ✅ | 4 | 6 | 20240101000000... |
| `private_profiles` | ✅ | 0 | 3 | 20260124120000... |
| `product_attributes` | ✅ | 0 | 0 | 20251215100000... |
| `product_images` | ✅ | 0 | 0 | 20251215100000... |
| `product_private` | ✅ | 1 | 4 | 20260124120000... |
| `product_variants` | ✅ | 4 | 4 | 20251127000000... |
| `products` | ✅ | 18 | 8 | 20240101000000... |
| `profiles` | ✅ | 6 | 7 | 20240101000000... |
| `return_requests` | ✅ | 5 | 3 | 20260110120000... |
| `reviews` | ✅ | 7 | 9 | 20240101000000... |
| `search_history` | ✅ | 3 | 3 | 20251127_add_s... |
| `seller_feedback` | ✅ | 7 | 5 | 20251211000000... |
| `seller_payout_status` | ✅ | 0 | 1 | 20260110000000... |
| `seller_shipping_settings` | ✅ | 0 | 3 | 20260110000000... |
| `seller_stats` | ✅ | 0 | 1 | 20251215100000... |
| `sellers` | ✅ | 2 | 7 | 20240101000000... |
| `shipping_zones` | ✅ | 0 | 0 | 20251215100000... |
| `store_followers` | ✅ | 3 | 7 | 20251211000001... |
| `subscription_plans` | ✅ | 0 | 2 | 20251201000000... |
| `subscriptions` | ✅ | 4 | 1 | 20251201000000... |
| `user_addresses` | ✅ | 2 | 4 | 20251201100000... |
| `user_badges` | ✅ | 1 | 0 | 20251215100000... |
| `user_payment_methods` | ✅ | 2 | 4 | 20251201100000... |
| `user_verification` | ✅ | 1 | 2 | 20251215100000... |
| `username_history` | ✅ | 2 | 4 | 20251215200000... |
| `variant_options` | ✅ | 0 | 4 | 20251127000000... |
| `wishlists` | ✅ | 4 | 4 | 20251127000002... |

---

## RLS-Enabled Tables

### admin_docs
Policies: `Admins can delete admin docs`, `Admins can insert admin docs`, `Admins can read admin docs`, `Admins can update admin docs`, `admin_docs_admin_only`

### admin_notes
Policies: `Admins can delete admin notes`, `Admins can insert admin notes`, `Admins can read admin notes`, `Admins can update admin notes`, `admin_notes_admin_only`

### admin_tasks
Policies: `Admins can delete admin tasks`, `Admins can insert admin tasks`, `Admins can read admin tasks`, `Admins can update admin tasks`, `admin_tasks_admin_only`

### badge_definitions
Policies: (none found in migrations)

### blocked_users
Policies: `Users can create blocks`, `Users can delete their own blocks`, `Users can view their own blocks`

### boost_prices
Policies: `Anyone can view boost prices`

### brands
Policies: (none found in migrations)

### business_verification
Policies: `business_verification_select`, `business_verification_select_unified`

### buyer_feedback
Policies: `buyer_feedback_insert_seller`, `buyer_feedback_select_all`

### buyer_stats
Policies: `buyer_stats_select_unified`

### cart_items
Policies: `cart_items_delete_own`, `cart_items_insert_own`, `cart_items_select_own`, `cart_items_update_own`

### categories
Policies: `Admins can delete categories.`, `Admins can insert categories.`, `Admins can update categories.`, `Categories are viewable by everyone.`, `categories_delete_admin_only`, `categories_insert_admin_only`, `categories_select_all`, `categories_update_admin_only`

### category_attributes
Policies: (none found in migrations)

### conversations
Policies: `conversations_insert_buyer`, `conversations_insert_for_orders`, `conversations_select_participant`, `conversations_update_participant`

### listing_boosts
Policies: `Sellers can view own boosts`

### messages
Policies: `messages_insert_participant`, `messages_insert_system`, `messages_select_participant`, `messages_update_own`

### notification_preferences
Policies: `Users can insert own notification preferences`, `Users can update own notification preferences`, `Users can view own notification preferences`

### notifications
Policies: `Service role can insert notifications`, `Users can delete own notifications`, `Users can update own notifications`, `Users can view own notifications`

### order_items
Policies: `Sellers can view order items for their products.`, `Users can view own order items.`, `order_items_insert_with_order`, `order_items_select_buyer_or_seller`

### orders
Policies: `Users can insert own orders.`, `Users can update own orders.`, `Users can view own orders.`, `orders_insert_own`, `orders_select_own_or_seller`, `orders_update_own`

### private_profiles
Policies: `private_profiles_insert_own`, `private_profiles_select_own`, `private_profiles_update_own`

### product_attributes
Policies: (none found in migrations)

### product_images
Policies: (none found in migrations)

### product_private
Policies: `product_private_delete_own`, `product_private_insert_own`, `product_private_select_own`, `product_private_update_own`

### product_variants
Policies: `product_variants_delete_seller`, `product_variants_insert_seller`, `product_variants_select_all`, `product_variants_update_seller`

### products
Policies: `Products are viewable by everyone.`, `Sellers can delete own products.`, `Sellers can insert products.`, `Sellers can update own products.`, `products_delete_own_or_admin`, `products_insert_seller`, `products_select_all`, `products_update_own`

### profiles
Policies: `Public profiles are viewable by everyone.`, `Users can insert their own profile.`, `Users can update own profile.`, `profiles_delete_admin_only`, `profiles_insert_own`, `profiles_select_all`, `profiles_update_own`

### return_requests
Policies: `return_requests_insert_own`, `return_requests_select_buyer`, `return_requests_select_seller`

### reviews
Policies: `Reviews are viewable by everyone.`, `Users can delete own reviews.`, `Users can insert reviews.`, `Users can update own reviews.`, `reviews_delete_own_or_admin`, `reviews_insert_authenticated`, `reviews_select_all`, `reviews_seller_response`, `reviews_update_own`

### search_history
Policies: `Users can delete own search history`, `Users can insert own search history`, `Users can view own search history`

### seller_feedback
Policies: `seller_feedback_delete_own_or_admin`, `seller_feedback_insert_buyer`, `seller_feedback_select_all`, `seller_feedback_update_buyer`, `seller_feedback_update_own`

### seller_payout_status
Policies: `seller_payout_status_select_own`

### seller_shipping_settings
Policies: `seller_shipping_settings_insert_own`, `seller_shipping_settings_select_own`, `seller_shipping_settings_update_own`

### seller_stats
Policies: `seller_stats_select_unified`

### sellers
Policies: `Sellers are viewable by everyone.`, `Sellers can update their own profile.`, `Users can create their own seller profile.`, `sellers_delete_own_or_admin`, `sellers_insert_own`, `sellers_select_all`, `sellers_update_own`

### shipping_zones
Policies: (none found in migrations)

### store_followers
Policies: `Anyone can view followers`, `Users can follow sellers`, `Users can follow stores`, `Users can unfollow`, `Users can unfollow stores`, `Users can view their own follows`, `store_followers_select_unified`

### subscription_plans
Policies: `Anyone can view subscription plans`, `subscription_plans_select`

### subscriptions
Policies: `Sellers can view own subscriptions`

### user_addresses
Policies: `Users can create own addresses`, `Users can delete own addresses`, `Users can update own addresses`, `Users can view own addresses`

### user_badges
Policies: (none found in migrations)

### user_payment_methods
Policies: `Users can create own payment methods`, `Users can delete own payment methods`, `Users can update own payment methods`, `Users can view own payment methods`

### user_verification
Policies: `user_verification_select_own`, `user_verification_select_unified`

### username_history
Policies: `System can insert username history`, `Users can view own username history`, `username_history_insert_system`, `username_history_select_own`

### variant_options
Policies: `variant_options_delete_admin`, `variant_options_insert_admin`, `variant_options_select_all`, `variant_options_update_admin`

### wishlists
Policies: `Users can add to their own wishlist`, `Users can remove from their own wishlist`, `Users can view their own wishlist`, `wishlists_select_own_or_public`

---

*Generated: 2026-02-13*

*Last updated: 2026-02-13*
