# Supabase Refactor — Complete Audit Data

> Raw audit findings from live Supabase inspection + codebase analysis.
> Source of truth for all refactor decisions.
> Queried: 2026-02-24 via Supabase MCP against project `dhtzybnkvpimmomzwrce`

---

## 1. Tables (44)

| Domain | Tables |
|--------|--------|
| **Admin** | `admin_docs`, `admin_notes`, `admin_tasks` |
| **Auth/Users** | `profiles`, `private_profiles`, `user_addresses`, `user_payment_methods`, `user_verification`, `user_badges`, `badge_definitions`, `username_history`, `blocked_users`, `business_verification` |
| **Products/Catalog** | `products`, `product_images`, `product_variants`, `variant_options`, `product_attributes`, `product_private`, `categories`, `category_attributes`, `brands` |
| **Commerce** | `orders`, `order_items`, `cart_items`, `wishlists`, `listing_boosts`, `boost_prices`, `return_requests` |
| **Payments/Subs** | `subscription_plans`, `subscriptions`, `seller_payout_status`, `seller_shipping_settings`, `shipping_zones` |
| **Social** | `reviews`, `seller_feedback`, `buyer_feedback`, `seller_stats`, `buyer_stats`, `store_followers`, `conversations`, `messages`, `notifications`, `notification_preferences` |

### Views
- `category_stats` — product counts per category subtree
- `category_stats_mv` — materialized version with indexes
- `deal_products` — products with computed `effective_discount`
- `subscription_overview` — joined subscription + plan data

### Potentially Unused Tables
| Table | Evidence | Recommendation |
|-------|----------|----------------|
| `variant_options` | Zero `.from('variant_options')` in app code, no FK dependents | Strong deprecation candidate |
| `shipping_zones` | Zero `.from('shipping_zones')` in app code | Strong deprecation candidate |
| `brands` | Zero direct `.from('brands')` queries found | Audit for indirect usage before deprecating |
| `blocked_users` | No `.from()` but active RPC surface (block/unblock/get/is_blocked) | Keep — RPC-backed |

### Stale Doc References
- `sellers` table listed in `docs/database.md` but does NOT exist in live schema or generated types

---

## 2. Functions (92 in public schema)

### Trigger Functions (73)
```
auto_generate_product_slug          handle_order_item_status_change
auto_set_fashion_gender             handle_product_attributes_sync
auto_set_seller_flag                handle_updated_at
auto_verify_business_on_subscription init_business_verification
check_listing_limit                 init_seller_stats
check_message_allowed               init_subscription_boosts
check_not_own_product               init_user_verification
create_buyer_stats                  notify_on_new_message
create_seller_stats                 notify_on_order_status_change
create_subscription_expiry_notifications  notify_on_wishlist_price_drop
create_user_verification            notify_seller_on_new_follower
enforce_product_private_owner_match notify_seller_on_new_purchase
enforce_products_category_is_leaf   on_listing_boost_created
ensure_single_primary_image         on_review_notify
handle_category_attribute_key_norm  on_seller_feedback_notify
handle_default_address              order_items_decrement_stock
handle_default_payment_method       queue_badge_evaluation
handle_new_order_item               recompute_order_fulfillment_status
handle_new_product_search           refresh_browseable_categories
handle_new_user                     sync_product_attributes_jsonb
trg_recompute_order_fulfillment_status
update_buyer_stats_from_feedback    update_product_rating
update_buyer_stats_on_feedback_update  update_product_stock
update_buyer_stats_on_purchase      update_seller_five_star_count
update_conversation_on_message      update_seller_listing_counts
update_follower_count               update_seller_rating
update_product_category_ancestors   update_seller_stats_on_feedback
                                    update_seller_stats_on_listing
                                    update_seller_stats_on_order
```

### Callable RPCs (19)
```
block_user                  get_or_create_conversation
cart_add_item               get_shared_wishlist
cart_clear                  get_total_unread_messages
cart_set_quantity            get_user_conversation_ids
cleanup_sold_wishlist_items  get_user_conversations
disable_wishlist_sharing    increment_helpful_count
enable_wishlist_sharing     increment_view_count
get_badge_specs             mark_all_notifications_read
get_blocked_users           mark_messages_read
get_category_path           mark_notification_read
get_category_stats          reset_monthly_boosts
get_conversation_messages   sync_product_attributes_jsonb
get_hero_specs              transliterate_bulgarian
get_category_ancestor_ids   unblock_user
                            validate_username
```

### App-Called RPCs (23 unique calls in codebase)
```
block_user                  get_total_unread_messages
cart_add_item               get_user_conversations
cart_clear                  increment_view_count
cart_set_quantity            is_blocked_bidirectional
cleanup_sold_wishlist_items  mark_all_notifications_read
disable_wishlist_sharing    mark_messages_read
enable_wishlist_sharing     mark_notification_read
get_badge_specs             unblock_user
get_blocked_users           get_or_create_conversation
get_category_path
get_hero_specs
get_shared_wishlist
admin_paid_revenue_total (MISSING FROM DB)
```

### Missing RPC
- `admin_paid_revenue_total` — Called at `lib/auth/admin.ts` line ~161 with `as never` typecast. Falls back to `$0` silently on every admin page load.

### Helper Functions
```
expire_subscriptions        is_admin
generate_product_slug       is_blocked_bidirectional
generate_share_token        is_user_blocked
normalize_attribute_key     sync_seller_from_subscription
```

---

## 3. RLS Policies (109 on public schema)

### Policy Distribution
| Table | SELECT | INSERT | UPDATE | DELETE | ALL |
|-------|--------|--------|--------|--------|-----|
| admin_docs | - | - | - | - | 1 |
| admin_notes | - | - | - | - | 1 |
| admin_tasks | - | - | - | - | 1 |
| badge_definitions | 1 | - | - | - | - |
| blocked_users | 1 | 1 | - | 1 | - |
| boost_prices | 1 | - | - | - | - |
| brands | 1 | - | - | - | - |
| business_verification | 1 | - | - | - | - |
| buyer_feedback | 1 | - | - | - | - |
| buyer_stats | 1 | - | - | - | - |
| cart_items | 1 | 1 | 1 | 1 | - |
| categories | 1 | 1 | 1 | 1 | - |
| category_attributes | 1 | - | - | - | - |
| conversations | 1 | 1 | 1 | - | - |
| listing_boosts | 1 | 1 | 1 | - | - |
| messages | 1 | 1 | 1 | - | - |
| notification_preferences | 1 | 1 | 1 | - | - |
| notifications | 1 | 1 | 1 | 1 | - |
| order_items | 1 | 1 | 1 | - | - |
| orders | 1 | 1 | 1 | - | - |
| private_profiles | 1 | 1 | 1 | - | - |
| product_attributes | 1 | - | - | - | - |
| product_images | 1 | 1 | 1 | 1 | - |
| product_private | 1 | 1 | 1 | 1 | - |
| product_variants | 1 | 1 | 1 | 1 | - |
| products | 1 | 1 | 1 | 1 | - |
| profiles | 1 | 1 | 1 | 1 | - |
| return_requests | 1 | 1 | - | - | - |
| reviews | 1 | 1 | 1 | 1 | - |
| seller_feedback | 1 | 1 | 1 | - | - |
| seller_payout_status | 1 | - | - | - | - |
| seller_shipping_settings | 1 | 1 | 1 | - | - |
| seller_stats | 1 | - | - | - | - |
| shipping_zones | 1 | - | - | - | - |
| store_followers | 1 | 1 | - | 1 | - |
| subscription_plans | 1 | - | - | - | - |
| subscriptions | 1 | 1 | 1 | - | - |
| user_addresses | 1 | 1 | 1 | 1 | - |
| user_badges | 1 | 1 | - | - | - |
| user_payment_methods | 1 | 1 | 1 | 1 | - |
| user_verification | 1 | - | - | - | - |
| username_history | 1 | 1 | - | - | - |
| variant_options | 1 | 1 | 1 | 1 | - |
| wishlists | 1 | 1 | - | 1 | - |

### Policies Using `{public}` Role for WRITES (Should Be `{authenticated}`)
| Table | Policy | Cmd |
|-------|--------|-----|
| blocked_users | "Users can create blocks" | INSERT |
| conversations | conversations_insert_for_orders | INSERT |
| messages | messages_insert_system | INSERT |
| messages | messages_update_sender | UPDATE |
| notification_preferences | INSERT/UPDATE/SELECT | INSERT/UPDATE/SELECT |
| store_followers | "Users can follow sellers" | INSERT |
| seller_feedback | seller_feedback_insert_buyer | INSERT |
| product_images | INSERT/UPDATE/DELETE | INSERT/UPDATE/DELETE |
| product_variants | INSERT/UPDATE/DELETE | INSERT/UPDATE/DELETE |
| variant_options | INSERT/UPDATE/DELETE | INSERT/UPDATE/DELETE |
| username_history | INSERT | INSERT |
| wishlists | INSERT | INSERT |

### Admin Policies Using Inline Check (Should Use `is_admin()`)
1. `admin_docs.admin_docs_admin_only` — `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')`
2. `admin_notes.admin_notes_admin_only` — same
3. `admin_tasks.admin_tasks_admin_only` — same
4. `business_verification.business_verification_select` — mixed owner-or-admin with inline

### UPDATE Policies Missing `WITH CHECK` (13)
1. `categories` — "Admins can update categories"
2. `conversations` — "conversations_update_participant"
3. `messages` — "messages_update_sender"
4. `notifications` — "Users can update own notifications"
5. `product_images` — "Sellers can update their product images"
6. `products` — "Sellers can update own products"
7. `profiles` — "Users can update own profile"
8. `reviews` — "Users can update own reviews"
9. `seller_feedback` — "seller_feedback_update_buyer"
10. `subscriptions` — "Sellers can update own subscriptions"
11. `user_addresses` — "Users can update own addresses"
12. `user_payment_methods` — "Users can update own payment methods"
13. `variant_options` — "variant_options_update_admin"

---

## 4. Indexes (149)

### Unindexed Foreign Keys (15 — from Supabase Performance Advisor)
| Table | FK | Priority |
|-------|-----|----------|
| admin_notes | author_id | Low (admin table) |
| admin_tasks | assigned_to | Low (admin table) |
| admin_tasks | created_by | Low (admin table) |
| business_verification | verified_by | Low |
| cart_items | product_id | **High** (hot path) |
| cart_items | variant_id | Medium |
| conversations | order_id | Medium |
| listing_boosts | product_id | Medium |
| notifications | conversation_id | Medium |
| notifications | order_id | Medium |
| notifications | product_id | Medium |
| notifications | user_id | **High** (hot path) |
| order_items | variant_id | Medium |
| return_requests | order_item_id | Medium |
| user_badges | badge_id | Low |

### Well-Indexed Tables (for reference)
- `products` — 14 indexes (search_vector, category, seller, status, rating, created_at, etc.)
- `order_items` — 5 indexes (order_id, product_id, seller_id, seller_status)
- `categories` — 5 indexes (slug, parent_id, display_order, browseable)
- `profiles` — 3 indexes (pkey, username, username_key)

---

## 5. Trigger Chains

### Products INSERT Chain (11 steps)
```
BEFORE:
1. enforce_products_category_is_leaf → validates leaf category
2. auto_set_fashion_gender → mutates attributes.gender
3. check_listing_limit → validates seller max listings
4. handle_new_product_search → sets search_vector
5. auto_generate_product_slug → sets slug
6. update_product_category_ancestors → sets category_ancestors

--- ROW INSERT ---

AFTER:
7. update_seller_stats_on_listing → upserts seller stats (stock-based active logic)
8. auto_set_seller_flag → updates profiles.is_seller = true
9. update_seller_listing_counts → updates seller stats AGAIN (status-based logic)

CASCADES:
10. profiles.handle_updated_at (from step 8)
11. seller_stats.set_updated_at (from steps 7+9)
```

**Problem:** Steps 7 and 9 are REDUNDANT with CONFLICTING active criteria:
- Step 7: `stock > 0` = active
- Step 9: `status = 'active'` = active

### Order Items INSERT Chain (7+ steps)
```
BEFORE:
1. check_not_own_product → blocks self-purchase
2. order_items_decrement_stock → decrements inventory, raises on insufficient

--- ROW INSERT ---

AFTER:
3. notify_seller_on_new_purchase → inserts notification
4. handle_new_order_item → creates/finds conversation, inserts system message
   CASCADE: messages check_message_allowed → notify_on_new_message (skips system) 
            → update_conversation_on_message → conversations.set_updated_at
5. trg_recompute_order_fulfillment_status → updates orders.fulfillment_status
```

**Note:** `handle_new_order_item` runs `SECURITY DEFINER` with `row_security = off`

### Order Items UPDATE (status → 'delivered') Chain
```
BEFORE:
1. handle_order_item_status_change → sets delivered_at, inserts system message
   CASCADE: full message chain (same as step 4 above)

--- ROW UPDATE ---

AFTER:
2. notify_on_order_status_change → inserts buyer notification
3. trg_recompute_order_fulfillment_status → recomputes fulfillment
```

---

## 6. Security Advisor Results

| Level | Finding | Status |
|-------|---------|--------|
| WARN | `auth_leaked_password_protection` disabled | Tracked as LAUNCH-004 (requires Pro plan) |

---

## 7. Client Architecture (HEALTHY — Don't Touch)

| Factory | File | Cookies | RLS | Use Case |
|---------|------|---------|-----|----------|
| `createClient()` | lib/supabase/server.ts | Yes (next/headers) | Respects | Server Components/Actions |
| `createRouteHandlerClient(req)` | lib/supabase/server.ts | Yes (request) | Respects | Route handlers |
| `createStaticClient()` | lib/supabase/server.ts | None | Anon-only | Cached reads (`"use cache"`) |
| `createAdminClient()` | lib/supabase/server.ts | None | Bypasses | Service role ops |
| `createClient()` (browser) | lib/supabase/client.ts | Auto | Respects | Client Components |
| `createFreshClient()` | lib/supabase/client.ts | Auto (no singleton) | Respects | Post-action cookie refresh |

---

## 8. Storage Buckets

| Bucket | Public | RLS | Used In |
|--------|--------|-----|---------|
| `avatars` | Yes | Owner CRUD | profile-avatar-mutations, onboarding, welcome |
| `product-images` | Yes | Seller CRUD | lib/upload/image-upload.ts |

---

## 9. Realtime Subscriptions

| Component | Tables | Events |
|-----------|--------|--------|
| use-notification-count | notifications | INSERT/UPDATE |
| message-context | messages, conversations | INSERT/UPDATE |
| messages-dropdown | messages | INSERT |
| support-chat-widget | messages, conversations | INSERT/UPDATE |

Publication: `order_items` added to `supabase_realtime` (migration 20251213113940)

---

## 10. Edge Functions

| Function | Status | Lines | SDK Version |
|----------|--------|------:|-------------|
| ai-shopping-assistant | ACTIVE (v8) | 724 | @supabase/supabase-js@2.39.3 (pinned via esm.sh) |

---

*Queried: 2026-02-24*
