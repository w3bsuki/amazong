# Supabase Backend Audit (Amazong)

> **Audit date**: January 10, 2026
>
> **Scope**: Captures the **observed backend state** (RLS policies, triggers, key functions/RPCs, storage buckets, edge functions) and identifies **evidence-backed root causes** for backend misbehavior.
>
> **Safety**:
> - No secrets are printed (keys, JWTs, service-role values).
> - Any SQL below is for review and should be applied via controlled migrations, not ad-hoc edits.
>
> **Supabase role semantics**:
> - Policies applying to role `{public}` effectively apply to both `anon` and `authenticated` (because `public` is granted to all roles).

## 0) How to read this doc

- **CONFIRMED**: Directly observed in the live Supabase instance during this audit.
- **LIKELY**: Strongly suggested by code + DB shape but needs one more confirmation step.
- **HYPOTHESIS**: Plausible, but not yet backed by DB evidence.

## 1) Snapshot (high-level)

- Supabase project URL: `https://dhtzybnkvpimmomzwrce.supabase.co`
- Edge functions: `ai-shopping-assistant` (verify_jwt: true)
- Storage buckets present in DB: **only** `product-images` (public: true)
- RLS enabled on core tables inspected (`orders`, `order_items`, `products`, `return_requests`, `profiles`, etc.)
- RLS forced: **false** on all inspected core tables

Additional live snapshot (from the same audit run; kept in the OPUS appendix too):

- Table counts observed: `profiles` 25, `products` 247, `orders` 7, `order_items` 4, `categories` 13,139, `messages` 18, `conversations` 3, `notifications` 2
- Applied migrations: `migration_count` 977; `max_version` `20260110064546`
- Cron jobs: 1 hourly job → `expire_listing_boosts()`

## 2) TL;DR — What’s wrong (evidence-based)

### 2.1 Double stock decrement on checkout (CONFIRMED, critical correctness)

`public.order_items` has **two separate stock-decrement mechanisms** that both fire on INSERT:

- BEFORE INSERT trigger: `trg_order_items_decrement_stock` → `order_items_decrement_stock()`
- AFTER INSERT trigger: `update_product_stock_on_order` → `update_product_stock()`

This means a typical checkout that inserts into `order_items` will decrement stock **twice** (once in BEFORE trigger and once again AFTER).

Evidence:

- Triggers on `public.order_items` (from `information_schema.triggers`):

```sql
AFTER  INSERT  update_product_stock_on_order  EXECUTE FUNCTION update_product_stock()
BEFORE INSERT  trg_order_items_decrement_stock EXECUTE FUNCTION order_items_decrement_stock()
```

- `order_items_decrement_stock()` updates either `product_variants.stock` (variant case) or `products.stock` (legacy case) with an atomic `stock >= quantity` guard.
- `update_product_stock()` then *again* does `UPDATE products SET stock = stock - NEW.quantity` and checks if stock went negative.

Expected symptom profile:
- Random checkout failures: `Insufficient stock for product` even when stock looks OK.
- Stock going negative or hitting zero too early.
- Variant orders decrement variant stock (BEFORE trigger) but still decrement base product stock again (AFTER trigger), producing nonsense inventory.

### 2.2 Messaging status updates bug: tautological conversation lookup (CONFIRMED, moderate)

`handle_order_item_status_change()` tries to find the conversation for a seller + order + buyer, but contains a tautology:

```sql
WHERE order_id = NEW.order_id
  AND buyer_id = buyer_id
  AND seller_id = NEW.seller_id
```

The `buyer_id = buyer_id` condition does **not** filter to the buyer from the order. It will match any row (except NULL edge cases). That can cause:
- Not finding the correct conversation (or finding the wrong one)
- Missing or misrouted "system" messages for status changes

### 1.3 Avatars bucket mismatch: app uses `avatars`, but bucket does not exist in DB

Repository code uploads to storage bucket `avatars` in multiple places (onboarding/profile/username flows), but the actual database shows only bucket:

- `product-images` (public: true)

No `avatars` bucket exists in `storage.buckets`.

Evidence:
- DB buckets query result includes only `product-images`.
- Repo includes a migration for `avatars` bucket: `supabase/migrations/20251215000000_avatars_storage.sql`.
- That migration is **not present** in the remote applied migrations (`supabase_migrations.schema_migrations` search for `avatars` returned no rows).

Status: **CONFIRMED** (bucket missing in `storage.buckets` during audit)

Expected symptom profile:
- Avatar upload calls failing with `Bucket not found` / storage errors.
- TODO already flags this: "Chat: ... broken avatars".

### 2.4 `return_requests` insert policy contains dead/incorrect conditions (CONFIRMED, integrity risk)

The `return_requests_insert_own` policy `WITH CHECK` contains tautologies:

- `(oi.order_id = oi.order_id)`
- `(oi.seller_id = oi.seller_id)`

Those conditions do not validate that the `return_requests.order_id` / `seller_id` fields correspond to the referenced `order_item_id`. That can allow inconsistent rows (unless a constraint elsewhere prevents it).

Separately: `return_requests` has two permissive SELECT policies for authenticated (buyer + seller), which Supabase Advisor flags as a performance smell.

### 1.5 Security hardening gaps

- Supabase Security Advisor: mutable search_path warnings on:
  - `public.recompute_order_fulfillment_status`
  - `public.trg_recompute_order_fulfillment_status`

- Leaked password protection disabled in Supabase Auth.

## 3) App ↔ Supabase integration map (from repo scan)

### 2.1 Supabase client setup

- Server client helper exists (`lib/supabase/server.ts`) and warns about using `supabase.auth.getUser()`.
- Client client helper exists (`lib/supabase/client.ts`).

### 2.2 Direct table writes (high coupling with DB triggers)

Checkout inserts orders + order items directly:
- `app/[locale]/(checkout)/_actions/checkout.ts`
  - `supabase.from("orders").insert(orderData)`
  - `supabase.from("order_items").insert(validItems)`

Because of this, the checkout path is tightly coupled to trigger correctness. Any exception in triggers will roll back the whole insert.

### 2.3 RPCs used by the app

Observed RPC calls (non-exhaustive; from grep):
- Cart
  - `cart_add_item`
  - `cart_set_quantity`
  - `cart_clear`
- Messaging
  - `get_or_create_conversation`
  - `mark_messages_read`
  - `get_total_unread_messages`
- Notifications
  - `mark_notification_read`
  - `mark_all_notifications_read`
- Wishlist
  - `cleanup_sold_wishlist_items`
  - `enable_wishlist_sharing`
  - `disable_wishlist_sharing`
  - `get_shared_wishlist`

Many of these are `SECURITY DEFINER` and are designed to work even if RLS blocks some underlying table operations.

### 2.4 Storage used by the app

- Product/media uploads: handled via route handlers using `product-images` bucket:
  - `app/api/upload-image/route.ts`
  - `app/api/upload-chat-image/route.ts`
  - `lib/upload/image-upload.ts`

- Avatars/uploads/banners: uses `avatars` bucket in multiple places:
  - `app/actions/profile.ts`
  - `app/actions/onboarding.ts`
  - `app/actions/username.ts`
  - `app/[locale]/(auth)/_components/welcome-client.tsx`

This bucket currently does not exist in the DB.

## 4) Storage configuration (actual)

### 3.1 Buckets present

From `storage.buckets`:

- `product-images` (public: true)

### 3.2 Buckets expected by repo

- `avatars` (public bucket with per-user folder policies) — defined in migration but not applied.

## 5) DB triggers & automation (core)

### 4.1 `order_items` trigger graph

From `information_schema.triggers` for `public.order_items`:

- BEFORE INSERT
  - `prevent_self_purchase_trigger` → `check_not_own_product()`
  - `trg_order_items_decrement_stock` → `order_items_decrement_stock()`
- BEFORE UPDATE
  - `on_order_item_status_change` → `handle_order_item_status_change()`
- AFTER INSERT
  - `on_order_item_created` → `handle_new_order_item()`
  - `on_new_purchase_notify_seller` → `notify_seller_on_new_purchase()`
  - `update_product_stock_on_order` → `update_product_stock()` (**duplicate stock decrement**)
  - `order_items_recompute_order_fulfillment_status` → `trg_recompute_order_fulfillment_status()`
- AFTER UPDATE
  - `on_order_item_status_change_notify` → `notify_on_order_status_change()`
  - `order_items_recompute_order_fulfillment_status` → `trg_recompute_order_fulfillment_status()`
- AFTER DELETE
  - `order_items_recompute_order_fulfillment_status` → `trg_recompute_order_fulfillment_status()`

### 4.2 Trigger functions (excerpts)

#### `order_items_decrement_stock()` (BEFORE INSERT)

- Atomic decrement with `stock >= quantity` guard.
- Variant-aware: decrements `product_variants.stock` when `NEW.variant_id` is present.

#### `update_product_stock()` (AFTER INSERT)

- Decrements `products.stock` again and then checks if negative.
- Not variant-aware.

#### `handle_new_order_item()` (AFTER INSERT)

- `SECURITY DEFINER` and `SET row_security TO 'off'`.
- Creates/uses a conversation row and inserts a system message describing the order.

#### `handle_order_item_status_change()` (BEFORE UPDATE)

- Adds system messages on status transitions.
- Contains buggy conversation lookup clause (`buyer_id = buyer_id`).

## 6) RLS status & policies (selected)

### 5.1 RLS enabled/forced snapshot (core tables)

- Enabled: true on all inspected tables.
- Forced: false on all inspected tables.

Impact:
- Service-role / table owners / SECURITY DEFINER functions can bypass RLS depending on how they’re defined.
- Client behavior may differ drastically from edge-function/service-role behavior.

### 5.2 Selected policy definitions (from `pg_policies`)

#### `orders`
- INSERT (authenticated): `auth.uid() = user_id`
- SELECT (authenticated): `auth.uid() = user_id`
- UPDATE (public): `auth.uid() = user_id`

#### `order_items`
- INSERT (public): order must belong to `auth.uid()`
- SELECT (authenticated): buyer owns order OR seller_id = auth.uid
- UPDATE (public): seller_id = auth.uid

#### `return_requests`
- INSERT (authenticated): buyer_id = auth.uid AND order_items join orders checks, but includes tautologies
- SELECT (authenticated): buyer or seller policies (two permissive policies)

#### `profiles`
- SELECT (public): true (public profiles)
- INSERT/UPDATE (authenticated): auth.uid matches profile id
- DELETE (public): is_admin()

## 7) Supabase Advisors (current)

### 6.1 Security advisors

- Function search_path mutable (WARN)
  - `public.recompute_order_fulfillment_status`
  - `public.trg_recompute_order_fulfillment_status`
- Leaked password protection disabled (WARN)

### 6.2 Performance advisors

- Multiple permissive policies on `public.return_requests` for authenticated SELECT (WARN)
- Unused indexes on multiple tables (INFO). Note: unused index warnings often appear in low-traffic/dev environments.

## 8) Migrations reality check (why repo ≠ DB)

### 7.1 Local repo migrations

Repo folder `supabase/migrations/` contains a curated list of SQL migrations (dozens).

### 7.2 Remote/applied migrations in Supabase

- `supabase_migrations.schema_migrations` has:
  - `migration_count`: 977
  - `max_version`: `20260110064546`

This indicates the remote project contains a much larger applied migration history than the local folder.

### 7.3 Concrete mismatch: avatars bucket

- Local migration exists: `20251215000000_avatars_storage.sql`.
- Remote applied migrations: no migration statements contain `avatars`.
- DB buckets: only `product-images`.

So the feature is implemented in the app, but the backend storage config isn’t deployed.

## 9) Edge Functions

### 9.1 `ai-shopping-assistant`

- Status: ACTIVE
- verify_jwt: true
- **LIKELY** uses service-role privileges inside the function (bypasses RLS). Confirm by inspecting the deployed function source/env usage.

Risk:
- The function can successfully read things the client cannot.
- Bugs can be masked in edge function but explode in client-side queries.

## 10) Refactor / Fix Plan (phased)

### Phase 0 — Reproduce + pin down failures (1–2 hours)

- Confirm what the failing user-facing symptoms are:
  - Checkout errors? Stock errors? Avatar uploads? Missing notifications?
- Add one-time logging around checkout server action to capture Supabase errors returned from `insert(order_items)`.
- For storage: attempt an upload to `avatars` bucket and capture error.

### Phase 1 — Fix the two hard correctness bugs (same day)

1) **Remove duplicate stock decrement**
- Keep only ONE stock decrement path:
  - Preferred: keep `order_items_decrement_stock()` because it is atomic and variant-aware.
  - Remove/disable trigger `update_product_stock_on_order`.
  - Only delete `update_product_stock()` if you confirm nothing else calls it.

2) **Fix conversation lookup in `handle_order_item_status_change()`**
- Replace `buyer_id = buyer_id` with a correct comparison using the buyer id fetched from `orders`.
  - Example: `WHERE order_id = NEW.order_id AND buyer_id = buyer_id_variable AND seller_id = NEW.seller_id`.

### Phase 2 — Fix avatars storage (same day)

- Deploy the avatars bucket + policies:
  - Apply the equivalent of `supabase/migrations/20251215000000_avatars_storage.sql` to the remote project.
  - Verify `storage.buckets` now includes `avatars`.
  - Verify the existing app upload paths use per-user folder naming (they do).

### Phase 3 — Policy correctness & data integrity (1–2 days)

- Repair `return_requests_insert_own` policy:
  - Remove tautologies.
  - Ensure `return_requests.order_id` and `return_requests.seller_id` match the referenced order item (or remove redundant columns and derive via join).
- Consider merging `return_requests_select_buyer` and `return_requests_select_seller` into one policy with OR for performance.

### Phase 4 — Security hardening (1 day)

- Fix advisor warnings by setting explicit `search_path` on the two fulfillment functions.
- Consider `ALTER TABLE ... FORCE ROW LEVEL SECURITY` on tables where you never want bypass (requires careful review because SECURITY DEFINER functions and service-role workloads exist).
- Enable leaked password protection in Supabase Auth settings.

### Phase 5 — Simplify the trigger web (ongoing)

- Move side-effect-heavy behaviors out of triggers where feasible:
  - notifications/messages generation,
  - stats aggregation,
  - search index maintenance.

Prefer:
- Explicit RPCs for multi-step operations (checkout, status transitions)
- Background jobs (pg_cron / queues) for non-critical side effects

## 11) Immediate actions checklist (do these first)

- [ ] Remove `update_product_stock_on_order` trigger (keep the function unless you confirm it’s unused).
- [ ] Fix `handle_order_item_status_change()` conversation lookup bug.
- [ ] Create `avatars` bucket in Supabase + apply correct RLS policies.
- [ ] Fix `recompute_order_fulfillment_status` / trigger function search_path warnings.

Repo-ready migrations implementing the above (apply via your normal Supabase migration workflow):

- `supabase/migrations/20260110153000_fix_double_stock_decrement.sql`
- `supabase/migrations/20260110153100_fix_handle_order_item_status_change.sql`
- `supabase/migrations/20260110153200_set_search_path_fulfillment_functions.sql`
- `supabase/migrations/20260110153300_ensure_avatars_bucket_and_policies.sql`

---

# Appendix A — Raw live-instance audit notes (OPUS)

> Audit Date: January 10, 2026  
> Methodology: Direct MCP queries against live Supabase instance  
> Project URL: `https://dhtzybnkvpimmomzwrce.supabase.co`

---

## OPUS-0) High-Level Snapshot

### Database Statistics
| Table | Row Count |
|-------|-----------|
| profiles | 25 |
| products | 247 |
| orders | 7 |
| order_items | 4 |
| categories | 13,139 |
| messages | 18 |
| conversations | 3 |
| notifications | 2 |
| return_requests | 0 |
| reviews | 2 |
| wishlists | 9 |

### Migration Status
- **Total applied migrations**: 977
- **Latest migration**: `20260110064546_20260110120000_return_requests`
- **Migration health**: ✅ All migrations applied successfully

### Extensions Installed
| Extension | Schema | Purpose |
|-----------|--------|---------|
| pg_cron | pg_catalog | Job scheduler |
| plpgsql | pg_catalog | PL/pgSQL language |
| supabase_vault | vault | Secrets management |
| uuid-ossp | extensions | UUID generation |
| pgcrypto | extensions | Cryptographic functions |
| pg_stat_statements | extensions | Query statistics |
| pg_trgm | extensions | Trigram similarity |
| pg_graphql | graphql | GraphQL API |

### Storage Buckets
| Bucket | Public | Created |
|--------|--------|---------|
| product-images | ✅ Yes | 2025-11-24 |
| ~~avatars~~ | ❌ **MISSING** | Not deployed |

### Edge Functions
| Function | Status | JWT Required |
|----------|--------|--------------|
| ai-shopping-assistant | ACTIVE | ✅ Yes |

### Scheduled Jobs (pg_cron)
| Job | Schedule | Command |
|-----|----------|---------|
| 1 | Hourly (0 * * * *) | `expire_listing_boosts()` |

---

## OPUS-1) Critical Bugs Confirmed

### 1.1 ❌ Double Stock Decrement (CRITICAL)

**Status: CONFIRMED** — Both triggers still active on `order_items`:

```
BEFORE INSERT: trg_order_items_decrement_stock → order_items_decrement_stock()
AFTER INSERT:  update_product_stock_on_order   → update_product_stock()
```

**Function Analysis:**

`order_items_decrement_stock()` (BEFORE trigger):
- ✅ Variant-aware (checks `NEW.variant_id`)
- ✅ Atomic with stock guard (`stock >= quantity`)
- ✅ Respects `track_inventory` flag
- ✅ Has `search_path=public` set

`update_product_stock()` (AFTER trigger):
- ❌ NOT variant-aware (always decrements `products.stock`)
- ❌ Non-atomic check (decrements first, then checks for negative)
- ❌ No `track_inventory` check
- ⚠️ Has `search_path=public` set

**Impact**: Every order item insert decrements stock TWICE. Variant orders are especially broken — variant stock decremented once, then base product stock decremented again.

**Fix**: Drop trigger `update_product_stock_on_order` or function `update_product_stock()`.

---

### 1.2 ⚠️ Conversation Lookup Bug (MODERATE)

**Status: CONFIRMED** — `handle_order_item_status_change()` contains:

```sql
SELECT id INTO conv_id
FROM public.conversations
WHERE order_id = NEW.order_id 
  AND buyer_id = buyer_id  -- ← TAUTOLOGY: compares column to itself
  AND seller_id = NEW.seller_id
```

The variable `buyer_id` shadows the column name. Line `buyer_id = buyer_id` is always true (except NULLs).

**Impact**: May find wrong conversation or miss the correct one for status update messages.

**Fix**: Use explicit table alias or rename variable:
```sql
WHERE c.order_id = NEW.order_id 
  AND c.buyer_id = v_buyer_id 
  AND c.seller_id = NEW.seller_id
```

---

### 1.3 ❌ Avatars Bucket Missing (HIGH)

**Status: CONFIRMED** — Only bucket in `storage.buckets`:
- `product-images` (public: true)

No `avatars` bucket exists. App code references this bucket in:
- `app/actions/profile.ts`
- `app/actions/onboarding.ts`
- `app/actions/username.ts`

**Impact**: All avatar uploads fail with "Bucket not found".

**Fix**: Create bucket and policies:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Add RLS policies for per-user folders
```

---

## OPUS-2) Security Advisors (Current State)

### Active Security Warnings

| Level | Issue | Entity |
|-------|-------|--------|
| WARN | Function search_path mutable | `public.recompute_order_fulfillment_status` |
| WARN | Function search_path mutable | `public.trg_recompute_order_fulfillment_status` |
| WARN | Leaked password protection disabled | Auth |

### SECURITY DEFINER Functions (70 total)

All SECURITY DEFINER functions **have `search_path` properly set** except the two above:
- 68 functions: `search_path=public` ✅
- 1 function (`handle_new_order_item`): `search_path=public, row_security=off` ✅
- 1 function (`cart_add_item`): `search_path=public, pg_temp` ✅
- 2 functions: **MISSING search_path** ❌

---

## OPUS-3) RLS Status

### All Core Tables Have RLS Enabled ✅

| Table | RLS Enabled | RLS Forced |
|-------|-------------|------------|
| cart_items | ✅ | ❌ |
| conversations | ✅ | ❌ |
| messages | ✅ | ❌ |
| notifications | ✅ | ❌ |
| order_items | ✅ | ❌ |
| orders | ✅ | ❌ |
| products | ✅ | ❌ |
| profiles | ✅ | ❌ |
| return_requests | ✅ | ❌ |
| wishlists | ✅ | ❌ |

**Note**: No tables in public schema have RLS disabled (query returned empty).

### RLS Policy Issues

#### `return_requests_insert_own` — Contains Tautologies

```sql
WITH CHECK:
  buyer_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM order_items oi JOIN orders o ON o.id = oi.order_id
    WHERE oi.id = return_requests.order_item_id 
      AND (oi.order_id = oi.order_id)   -- ← TAUTOLOGY
      AND (oi.seller_id = oi.seller_id) -- ← TAUTOLOGY
      AND o.user_id = auth.uid()
  )
```

The conditions `oi.order_id = oi.order_id` and `oi.seller_id = oi.seller_id` are always true.

**Fix**: These should validate that `return_requests` columns match the referenced `order_item`:
```sql
AND return_requests.order_id = oi.order_id
AND return_requests.seller_id = oi.seller_id
```

#### Multiple Permissive Policies (Performance)

**Table**: `return_requests`  
**Action**: SELECT  
**Role**: authenticated  
**Policies**: `return_requests_select_buyer`, `return_requests_select_seller`

**Impact**: Both policies execute for every SELECT query on this table.

**Fix**: Merge into single policy with OR condition.

---

## OPUS-4) Performance Advisors

### Unused Indexes (19 total)

These indexes have never been used and may be candidates for removal:

| Table | Index | Notes |
|-------|-------|-------|
| buyer_feedback | idx_buyer_feedback_order_id | 0 rows in table |
| conversations | idx_conversations_order_id | Low volume |
| listing_boosts | idx_listing_boosts_product_id | 1 row |
| notifications | idx_notifications_user_id | Low volume |
| notifications | idx_notifications_order_id | Low volume |
| notifications | idx_notifications_product_id | Low volume |
| notifications | idx_notifications_conversation_id | Low volume |
| seller_feedback | idx_seller_feedback_order_id | 0 rows |
| cart_items | idx_cart_items_product_id | 7 rows |
| cart_items | idx_cart_items_variant_id | Low volume |
| order_items | idx_order_items_product_id | 4 rows |
| order_items | idx_order_items_variant_id | No variants used |
| user_badges | idx_user_badges_badge_id | 0 rows |
| business_verification | idx_business_verification_verified_by | 2 rows |
| orders | orders_fulfillment_status_idx | 7 rows |
| return_requests | return_requests_order_item_id_idx | 0 rows |
| return_requests | return_requests_order_id_idx | 0 rows |
| return_requests | return_requests_buyer_id_idx | 0 rows |
| return_requests | return_requests_seller_id_idx | 0 rows |

**Recommendation**: Most unused indexes are on low-volume tables in dev environment. Keep for production but monitor after launch.

---

## OPUS-5) Storage Policies

### `product-images` Bucket Policies

| Policy | Action | Condition |
|--------|--------|-----------|
| Authenticated upload | INSERT | `bucket_id = 'product-images' AND auth.role() = 'authenticated'` |
| Public read access | SELECT | `bucket_id = 'product-images'` |
| Users can delete own images | DELETE | `bucket_id = 'product-images' AND auth.uid()::text = storage.foldername(name)[1]` |

**Assessment**: 
- ✅ Upload restricted to authenticated users
- ✅ Public read (correct for product images)
- ✅ Delete restricted to owner via folder convention
- ⚠️ No UPDATE policy (users cannot overwrite)

---

## OPUS-6) Trigger Architecture Analysis

### `order_items` Triggers (10 total)

| Timing | Trigger | Function | Notes |
|--------|---------|----------|-------|
| BEFORE INSERT | prevent_self_purchase_trigger | check_not_own_product() | ✅ Good |
| BEFORE INSERT | trg_order_items_decrement_stock | order_items_decrement_stock() | ✅ Keep this one |
| AFTER INSERT | on_new_purchase_notify_seller | notify_seller_on_new_purchase() | ✅ Good |
| AFTER INSERT | on_order_item_created | handle_new_order_item() | ✅ Good |
| AFTER INSERT | update_product_stock_on_order | update_product_stock() | ❌ **DELETE** |
| AFTER INSERT | order_items_recompute... | trg_recompute... | ✅ Good |
| BEFORE UPDATE | on_order_item_status_change | handle_order_item_status_change() | ⚠️ Has bug |
| AFTER UPDATE | on_order_item_status_change_notify | notify_on_order_status_change() | ✅ Good |
| AFTER UPDATE | order_items_recompute... | trg_recompute... | ✅ Good |
| AFTER DELETE | order_items_recompute... | trg_recompute... | ✅ Good |

---

## OPUS-7) Index Coverage Analysis

### Products Table — Well Indexed ✅

- Primary key, seller_id, category_id, brand_id
- GIN indexes on: attributes, category_ancestors, tags, search_vector
- Partial indexes for boolean filters (is_boosted, is_on_sale, ships_to_*)
- Status and condition indexes

### Orders Table — Adequate ✅

- Primary key, user_id, status, created_at, stripe_payment_intent_id
- fulfillment_status (currently unused but needed for production)

### Order Items Table — Adequate ✅

- Primary key, order_id, seller_id, product_id, variant_id
- Composite index on seller_id + status

### Categories Table — Good ✅

- Primary key, slug (unique), parent_id, display_order

---

## OPUS-8) Recommended Fixes (Priority Order)

### P0 — Critical (Fix Immediately)

1. **Drop duplicate stock trigger**
```sql
DROP TRIGGER IF EXISTS update_product_stock_on_order ON public.order_items;

-- Only drop this if you have verified it's not referenced elsewhere.
-- DROP FUNCTION IF EXISTS update_product_stock();
```

2. **Create avatars bucket**
```sql
-- Keep this compatible with older/newer Storage schemas.
-- If you need extra columns (like avif_webp options), add them after checking the actual schema.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar upload own folder" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Avatar read public" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Avatar delete own" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### P1 — High (Fix This Week)

3. **Fix conversation lookup bug**
```sql
CREATE OR REPLACE FUNCTION public.handle_order_item_status_change()
-- Fix: rename buyer_id variable to v_buyer_id and use in WHERE clause
```

4. **Fix search_path on fulfillment functions**
```sql
ALTER FUNCTION public.recompute_order_fulfillment_status() 
SET search_path = public;

ALTER FUNCTION public.trg_recompute_order_fulfillment_status() 
SET search_path = public;
```

5. **Enable leaked password protection**
- Go to Supabase Dashboard → Auth → Settings
- Enable "Leaked Password Protection"

### P2 — Medium (Fix Before Launch)

6. **Fix return_requests policy tautologies**
7. **Merge duplicate SELECT policies on return_requests**

### P3 — Low (Backlog)

8. **Review unused indexes after traffic increases**
9. **Consider `FORCE ROW LEVEL SECURITY` on sensitive tables**

---

## OPUS-9) Differences from GPT Audit

| Finding | GPT | OPUS | Notes |
|---------|-----|------|-------|
| Double stock decrement | ✅ Identified | ✅ Confirmed | Same finding |
| Conversation lookup bug | ✅ Identified | ✅ Confirmed | Same finding |
| Avatars bucket missing | ✅ Identified | ✅ Confirmed | Same finding |
| return_requests tautologies | ✅ Identified | ✅ Confirmed | Same finding |
| Function search_path | ✅ Identified (2 funcs) | ✅ Confirmed (2 funcs) | Same finding |
| Leaked password protection | ✅ Identified | ✅ Confirmed | Same finding |
| Multiple permissive policies | ✅ Identified | ✅ Confirmed | Same finding |
| RLS forced = false | ✅ Noted | ✅ Confirmed | Not a bug, by design |
| Tables without RLS | Not checked | ✅ **None found** | All public tables have RLS |
| SECURITY DEFINER audit | Partial | ✅ **Full audit (70 funcs)** | All properly configured except 2 |
| Index analysis | Not detailed | ✅ **19 unused indexes** | Expected in low-traffic env |
| Storage policies | Partial | ✅ **Full audit** | Policies well-designed |
| Cron jobs | Not checked | ✅ **1 job running** | expire_listing_boosts hourly |

---

## OPUS-10) Summary

**Critical Issues**: 2 (double stock decrement, missing avatars bucket)  
**High Issues**: 3 (conversation bug, 2 search_path warnings, leaked password)  
**Medium Issues**: 2 (policy tautologies, duplicate policies)  
**Low Issues**: 19 (unused indexes, all in dev-traffic context)

**Overall Assessment**: The database schema is well-designed with comprehensive RLS coverage. The critical bugs are isolated to the trigger layer and can be fixed with targeted migrations. No fundamental architectural issues found.
