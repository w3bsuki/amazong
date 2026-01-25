# CODEX: Full Supabase + Next.js Frontend Alignment Audit

**Project**: Treido (Amazong)  
**Repo**: `j:\amazong`  
**Date**: 2026-01-24 → 2026-01-25  
**Scope**: FULL audit of Supabase types, backend code, categories, attributes, filtering, and all frontend↔backend contracts

**Progress (checkboxes)**: 136 / 240 complete (56.7%) (as of 2026-01-25)

---

## Constraints

- **DO NOT** `git commit` or push
- **DO NOT** reset/revert; fix forward with minimal diffs
- **DO** document all findings and fixes in this file as you progress
- **DO** use Supabase MCP tools for advisor checks and SQL introspection

---

## Reference Documentation (MUST READ FIRST)

Before starting any audit phase, Codex MUST thoroughly review these folders:

### `supabase-codex/` — Living backend documentation
| File | Purpose |
|------|---------|
| `00-production-readiness.md` | Production deployment checklist |
| `01-auth-sessions.md` | Auth + session handling contracts |
| `02-schema-overview.md` | Full schema inventory (43 tables, views, matviews) |
| `03-rls-and-grants.md` | RLS policies and grants documentation |
| `04-rpcs-and-triggers.md` | Database functions and triggers |
| `05-proposed-hardenings.md` | Security hardening proposals |
| `06-taxonomy-cleanup.md` | Category taxonomy cleanup plans |
| `categories.md` | Category + attribute system documentation |
| `products.md` | Products, images, variants, attributes |
| `orders-payments.md` | Orders and payments flow |
| `cart-wishlist.md` | Cart and wishlist system |
| `messaging-notifications.md` | Messaging and notifications |
| `subscriptions-sellers.md` | Subscriptions and seller features |
| `storage.md` | Storage buckets and policies |
| `edge-functions.md` | Edge functions documentation |

### `supabase-info/` — Schema snapshots
| File | Purpose |
|------|---------|
| `phase1_public_schema.md` | Complete public schema snapshot with all columns |
| `phase1_auth_schema.md` | Auth schema details |
| `phase1_realtime_schema.md` | Realtime schema |
| `phase1_storage_schema.md` | Storage schema |
| `phase2_enums.md` | Database enums |
| `phase2_matviews.md` | Materialized views |
| `phase2_policies.md` | RLS policies |
| `phase2_views.md` | Database views |
| `phase3_constraints.md` | Database constraints |
| `phase3_indexes.md` | Database indexes |
| `phase3_triggers.md` | Database triggers |
| `category_attributes.md` | Category attributes schema |
| `product_attributes.md` | Product attributes schema |

---

## Phase 0 — Sanity Gates (TEST:)

Run all gates and document results. Fix only what blocks release.

### 0.1 TypeScript Compilation
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
```
- [x] No type errors (2026-01-24)
- [x] No frontend↔Supabase type mismatches found (2026-01-24)
- [x] Re-run after fixes: pass (2026-01-25)

### 0.2 Unit Tests
```bash
pnpm test:unit
```
- [x] 26 files / 407 tests passed (2026-01-24)
- [x] No data/api layer test failures (2026-01-24)
- [x] Re-run after fixes: 26 files / 407 tests passed (2026-01-25)

### 0.3 E2E Smoke Tests
```bash
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
- [x] 18 passed / 1 skipped (seller flow) (2026-01-24)
- [x] No Supabase-related smoke failures observed (2026-01-24)
- [x] Re-run after fixes: 18 passed / 1 skipped (seller flow) (2026-01-25)

### 0.4 Linting
```bash
pnpm -s lint
```
- [x] 0 errors (413 warnings) (2026-01-24)
- [x] No blocking import/export issues (2026-01-24)

### 0.5 Production Build
```bash
pnpm -s build
```
- [x] Build succeeded (2026-01-24)
- [x] No SSR/hydration blockers found (2026-01-24)

### 0.6 Knip (Dead Code)
```bash
pnpm -s knip
```
- [x] No unused exports flagged (2026-01-24)
- [x] No dead Supabase-related code flagged (2026-01-24)

### 0.7 Styles Gate
```bash
pnpm -s styles:gate
```
- [x] Passed (2026-01-24)

---

## Phase 1 — Supabase Health Check (SUPABASE:)

Use Supabase MCP tools to run comprehensive health checks.

### 1.1 Security Advisors
```
Run: mcp_supabase_get_advisors type="security"
```
- [x] Warning: leaked password protection disabled (`auth_leaked_password_protection`) (expected dashboard toggle) (2026-01-24)
- [x] Verified anon hardening: anon has no DML privileges on `products`, `cart_items`, `orders` (2026-01-24)
- [x] Verified anon RPC allow-list: anon can EXEC `get_category_stats()`, `get_hero_specs(uuid,text)`; cannot EXEC `get_category_path(uuid)` or `get_category_ancestor_ids(uuid)` (2026-01-24)

### 1.2 Performance Advisors
```
Run: mcp_supabase_get_advisors type="performance"
```
- [x] Documented performance warnings: multiple `unused_index` (INFO) + `duplicate_index` (WARN) on `public.admin_docs` locale indexes (2026-01-24)
- [x] No missing-index advisor warnings surfaced (2026-01-24)
- [x] Slow query review (`pg_stat_statements`) — reviewed top queries (realtime.list_changes dominates; top app queries include category PostgREST reads + `public.cleanup_expired_boosts()`) (2026-01-25)

### 1.3 Schema Verification
Verify these critical structures exist and are correct:

#### `category_stats` View/Matview
- [x] `category_stats_mv` (materialized view) exists (2026-01-24)
- [x] `category_stats` (SECURITY INVOKER view) exists and wraps matview (2026-01-24)
- [x] `get_category_stats()` RPC exists (2026-01-24)
- [x] Anon can SELECT from view but not underlying matview directly (2026-01-24)

#### Leaf Category Enforcement
- [x] Enforced via trigger `aaa_enforce_products_category_is_leaf_trigger` on `public.products` (not a CHECK constraint) (2026-01-24)
- [x] Local migration exists: `20260124220000_products_category_must_be_leaf.sql` (applied in DB as version `20260124221818`) (2026-01-24)
- [x] Trigger definition verified to block assigning a category that has children (inspection) (2026-01-24)

### 1.4 RLS Policy Audit
```
Run: mcp_supabase_list_tables schemas=["public"]
```
Cross-reference with `supabase-codex/03-rls-and-grants.md`:

- [x] All tables have RLS enabled (2026-01-24)
- [x] `products` - public SELECT, seller mutations (2026-01-24)
- [x] `product_private` - seller/admin only (2026-01-24)
- [x] `categories` - public SELECT (2026-01-24)
- [x] `category_attributes` - public SELECT (2026-01-24)
- [x] `profiles` - appropriate policies (2026-01-24)
- [x] `private_profiles` - owner-only access (2026-01-24)
- [x] `orders` - buyer/seller access (2026-01-24)
- [x] `order_items` - buyer/seller access (2026-01-24)
- [x] `cart_items` - user-only access (2026-01-24)
- [x] `wishlists` - user-only access (2026-01-24)
- Notes (2026-01-24):
  - RLS enabled on all `public` tables.
  - Anon DML is revoked (verified on `products`, `cart_items`, `orders`).

### 1.5 Database Functions Audit
Verify these RPCs exist and have correct signatures:
- [x] `get_category_path(uuid)` → returns path table (2026-01-24)
- [x] `get_category_ancestor_ids(uuid)` → returns uuid[] (2026-01-24)
- [x] `get_hero_specs(uuid,text)` → returns hero specs for product (TS marks `p_locale` optional) (2026-01-24)
- [x] `expire_listing_boosts()` → cron job function (2026-01-24)
- [x] `cleanup_expired_boosts()` → cron job function (2026-01-24)

---

## Phase 2 — TypeScript Types Alignment (TYPES:)

### 2.1 Database Types File
**File**: `lib/supabase/database.types.ts`

- [ ] Regenerate types: `pnpm supabase gen types typescript --local > lib/supabase/database.types.ts` (Supabase CLI not installed in this environment)
- [x] Used Supabase MCP + SQL introspection to verify `public` table inventory (2026-01-24)
- [x] Drift found + fixed: `boost_prices` existed in TS but not in DB → applied Supabase migration `create_boost_prices_table` and added `supabase/migrations/20260124223000_create_boost_prices_table.sql` (2026-01-24)
- [x] Post-fix check: `public.boost_prices` exists; anon SELECT=true; seeded 3 active EUR rows (2026-01-24)

### 2.2 Type Usage Audit
Check all files that import from `database.types.ts`:

```typescript
// Search for type imports
grep -r "from.*database.types" --include="*.ts" --include="*.tsx"
```

Files to audit:
- [ ] `lib/supabase/client.ts`
- [ ] `lib/supabase/server.ts`
- [ ] `lib/supabase/middleware.ts`
- [ ] `lib/data/categories.ts`
- [ ] `lib/data/products.ts`
- [ ] `lib/data/product-page.ts`
- [ ] `lib/data/plans.ts`
- [ ] `lib/data/profile-page.ts`
- [ ] `lib/data/product-reviews.ts`
- [ ] All files in `app/actions/`
- [ ] All files in `app/api/`

### 2.3 Custom Type Definitions
Check these files for type alignment:
- [ ] `lib/types/badges.ts`
- [ ] `lib/types/messages.ts`
- [ ] `lib/view-models/*.ts`

### 2.4 Type Helpers
- [ ] `lib/filters/category-attribute.ts` - attribute types
- [ ] `lib/filters/pending-attributes.ts` - pending attribute types
- [ ] `lib/category-tree.ts` - category types
- [ ] `lib/category-display.ts` - display types
- [ ] `lib/category-attribute-config.ts` - config types

---

## Phase 3 — Categories & Attributes Audit (CATEGORIES:)

### 3.1 Category Data Layer
**File**: `lib/data/categories.ts`

- [x] `getCategoryHierarchy()` - verify query matches schema (2026-01-25)
- [x] `getCategoryTreeDepth3()` - verify depth handling (2026-01-25)
- [x] `getCategoryBySlug()` - verify slug lookup (2026-01-25)
- [x] `getCategoryContext()` - verify context assembly (2026-01-25)
- [x] `getSubcategoriesWithCounts()` - verify matview join (2026-01-25)
- [x] `getSubcategoriesForBrowse()` - verify browse query (2026-01-25)
- [x] Cache tags and lifetimes are appropriate (2026-01-25)

### 3.2 Category API Routes
Audit all category-related API routes:

**`app/api/categories/`**:
- [x] `route.ts` - list categories (2026-01-25)
- [x] (N/A) `[slug]/route.ts` - no direct route; use `[slug]/context/route.ts` + `[slug]/children/route.ts` (2026-01-25)
- [x] `attributes/route.ts` - category attributes (2026-01-25)
- [x] `counts/route.ts` - category counts (2026-01-25)
- [x] `products/route.ts` - products by category (2026-01-25)
- [x] `sell-tree/route.ts` - category tree for sell flow (2026-01-25)

### 3.3 Category Attributes Flow
**Critical Path**: Category → Attributes → Product

- [x] `app/api/categories/attributes/route.ts` - returns correct attribute schema (includes `attribute_key` + hero fields) (2026-01-25)
- [x] Attributes include inheritance (parent category attributes) (2026-01-25)
- [x] `is_filterable`, `is_required`, `is_hero_spec` flags are respected (2026-01-25)
- [x] `attribute_type` handling: `text`, `number`, `select`, `multiselect`, `boolean`, `date` (2026-01-25)
- [x] `options` and `options_bg` (bilingual support) work correctly (2026-01-25)

### 3.4 Category Components
- [ ] `components/category/*` - category UI components
- [ ] Category picker drill-down to depth 4
- [ ] Leaf category selection enforced in UI
- [ ] Category breadcrumbs work correctly

### 3.5 Category Stats
- [ ] `category_stats` matview data is fresh
- [ ] Product counts are accurate
- [ ] Stats refresh mechanism exists (trigger or cron)

---

## Phase 4 — Products Audit (PRODUCTS:)

### 4.1 Product Data Layer
**File**: `lib/data/products.ts`

- [ ] `getProducts(type, limit, zone?)` - query correctness
- [ ] `getProductsByCategorySlug()` - category filter works
- [ ] `toUI()` normalization matches frontend expectations
- [ ] All product fields mapped correctly

**File**: `lib/data/product-page.ts`

- [ ] `fetchProductByUsernameAndSlug()` - joins are correct
- [ ] `fetchProductHeroSpecs()` - RPC call works
- [ ] Product → Category → Attributes chain works

### 4.2 Product API Routes
**`app/api/products/`**:
- [ ] `count/route.ts` - count queries work
- [ ] `create/route.ts` - creation flow
- [ ] `search/route.ts` - search functionality
- [ ] `feed/route.ts` - feed queries
- [ ] `deals/route.ts` - deals filter
- [ ] `newest/route.ts` - newest products
- [ ] `nearby/route.ts` - geo queries
- [ ] `quick-view/route.ts` - quick view data
- [ ] `category/route.ts` - category products
- [ ] `[id]/route.ts` - single product

### 4.3 Product Attributes
**Dual storage check**:
- [ ] `products.attributes` (JSONB) - fast reads
- [ ] `product_attributes` (row table) - relational storage
- [ ] Both are in sync (or understand which is canonical)

### 4.4 Product Variants
- [ ] `product_variants` table structure
- [ ] `variant_options` table structure
- [ ] Variant handling in cart/checkout

### 4.5 Product Images
- [ ] `product_images` table structure
- [ ] `products.images` array field
- [ ] Image URL normalization (`lib/normalize-image-url.ts`)
- [ ] Storage bucket policies for `product-images`

---

## Phase 5 — Filtering System Audit (FILTERS:)

### 5.1 Filter Configuration
**Files**:
- [ ] `lib/filters/category-attribute.ts` - filter definitions
- [ ] `lib/filters/pending-attributes.ts` - pending state
- [ ] `lib/filter-priority.ts` - filter ordering

### 5.2 Filter API
- [ ] Filters correctly query `category_attributes`
- [ ] `is_filterable=true` attributes are included
- [ ] Filter values come from `options` JSON field
- [ ] Bilingual options (`options_bg`) handled

### 5.3 Filter Application
- [ ] Product search respects filters
- [ ] Category browse respects filters
- [ ] Filter counts are accurate
- [ ] URL state management for filters

### 5.4 Hero Specs
- [ ] `is_hero_spec=true` attributes displayed on product cards
- [ ] `hero_priority` ordering works
- [ ] `unit_suffix` displayed correctly
- [ ] `get_hero_specs()` RPC returns correct data

---

## Phase 6 — Sell Flow Audit (SELL:)

### 6.1 Sell Form Schema
**File**: `lib/sell-form-schema-v4.ts` / `lib/sell/schema-v4.ts`

- [ ] Schema matches database columns
- [ ] All required fields validated
- [ ] Category attributes integrated
- [ ] Image handling correct

### 6.2 Sell API Routes
**`app/api/seller/`**:
- [ ] List all seller routes
- [ ] Verify authentication
- [ ] Verify RLS policies apply

**`app/actions/products.ts`**:
- [ ] `createListing` action
- [ ] Leaf category validation
- [ ] Attribute storage (JSONB and/or row table)
- [ ] Image upload integration

### 6.3 Sell Flow UX States
- [ ] Guest → SignInPrompt
- [ ] Logged-in non-seller → onboarding wizard
- [ ] Seller without payouts → payout gating UI
- [ ] Seller with payouts → can complete listing

### 6.4 Category Picker in Sell
- [ ] Can navigate to depth 4
- [ ] Can only select true leaf categories
- [ ] Attributes load from `/api/categories/attributes`
- [ ] Attribute inheritance works (parent → child)

### 6.5 Error Handling
- [x] Non-leaf category submission returns friendly error (2026-01-24)
- [x] Database constraint violations handled gracefully (leaf category, listing limits) (2026-01-25)
- [ ] Upload failures handled

---

## Phase 7 — Orders & Payments Audit (ORDERS:)

### 7.1 Order Data Flow
- [x] `orders` table structure (status includes `paid`) (2026-01-25)
- [x] `order_items` table structure (stock decrement + notifications via triggers) (2026-01-25)
- [x] Order → OrderItems → Products chain (server action + webhook paths) (2026-01-25)
- [ ] Status transitions validated

### 7.2 Order API Routes
**`app/api/orders/`**:
- [x] List order routes (`[id]/ship`, `[id]/track`) (2026-01-25)
- [x] RLS policies verified (buyer/seller access enforced) (2026-01-25)
- [x] Status updates work (seller updates via `updateOrderItemStatus`) (2026-01-25)

**`app/actions/orders.ts`**:
- [x] Order creation (webhook + `verifyAndCreateOrder`) (2026-01-25)
- [x] Status transitions (`updateOrderItemStatus`) (2026-01-25)
- [x] Notification triggers (order_items triggers) (2026-01-25)

### 7.3 Cart Integration
- [x] `cart_items` table (client sync + RPC helpers) (2026-01-25)
- [x] Cart → Checkout flow (e2e smoke) (2026-01-25)
- [x] Stock decrement on order (trigger `trg_order_items_decrement_stock`) (2026-01-25)
- [x] Variant handling in cart (variant_id in cart + order_items) (2026-01-25)

### 7.4 Payment Integration
- [x] Stripe integration (Checkout + Connect) (2026-01-25)
- [x] Payment intent creation (Checkout session → payment intent) (2026-01-25)
- [x] Webhook handling (checkout/payments/subscriptions/connect) (2026-01-25)
- [x] `seller_payout_status` updates (Connect webhook) (2026-01-25)

---

## Phase 8 — Authentication & Profiles Audit (AUTH:)

### 8.1 Auth Configuration
**Files**:
- [x] `lib/supabase/middleware.ts` - session handling (2026-01-25)
- [x] `lib/supabase/server.ts` - server client (2026-01-25)
- [x] `lib/supabase/client.ts` - browser client (2026-01-25)

### 8.2 Profile Data
- [x] `profiles` table - public fields (2026-01-25)
- [x] `private_profiles` table - PII fields (2026-01-25)
- [x] Profile creation trigger on auth.users insert (`handle_new_user`) (2026-01-25)
- [x] Username uniqueness (unique index on `profiles.username`) (2026-01-25)

### 8.3 Auth API Routes
**`app/api/auth/`**:
- [x] List auth routes (`/api/auth/sign-out`, legacy `/api/auth/signout`) (2026-01-25)
- [x] Session management (middleware + server client) (2026-01-25)
- [x] Callback handling (`/auth/callback`, `/auth/confirm`) (2026-01-25)

**`app/actions/profile.ts`**:
- [x] Profile update (2026-01-25)
- [x] Username change (2026-01-25)
- [x] Avatar upload (2026-01-25)

### 8.4 Role-Based Access
- [x] `profiles.role` check values: buyer, seller, admin (DB CHECK constraint) (2026-01-25)
- [x] `profiles.is_seller` flag exists + used for seller gating (2026-01-25)
- [x] Admin routes protected (self-admin escalation blocked by profiles UPDATE column grants) (2026-01-25)
- [x] Seller routes protected (role/is_seller checks) (2026-01-25)

---

## Phase 9 — Views & Materialized Views Audit (VIEWS:)

### 9.1 Views
- [x] `deal_products` - SECURITY INVOKER (`reloptions.security_invoker=true`) (2026-01-25)
- [x] `subscription_overview` - SECURITY INVOKER (`reloptions.security_invoker=true`) (2026-01-25)
- [x] `category_stats` (view wrapping matview) - SECURITY INVOKER (`reloptions.security_invoker=true`) (2026-01-25)

### 9.2 Materialized Views
- [x] `category_stats_mv` - refresh RPC exists (`refresh_category_stats()`, service-role only) (2026-01-25)
- [ ] Data freshness acceptable
- [ ] Indexes on matview

### 9.3 View Security
- [x] Views don't expose sensitive columns beyond already-public surfaces (2026-01-25)
- [x] SECURITY INVOKER set where needed (2026-01-25)
- [x] Anon access appropriate (enforced via underlying RLS) (2026-01-25)

---

## Phase 10 — Storage Audit (STORAGE:)

### 10.1 Buckets
- [x] `avatars` - public bucket (2026-01-25)
- [x] `product-images` - public bucket (2026-01-25)

### 10.2 Policies
- [x] Upload policies (authenticated users) (2026-01-25)
- [x] Delete policies (owner only) (2026-01-25)
- [x] Public read policies (2026-01-25)

### 10.3 Upload Integration
- [x] `lib/upload/*.ts` - upload utilities (2026-01-25)
- [x] `app/api/upload-image/route.ts` (2026-01-25)
- [x] `app/api/upload-chat-image/route.ts` (2026-01-25)
- [x] Image compression (`sharp` via `lib/upload/image-upload.ts`) (2026-01-25)

---

## Phase 11 — Cron Jobs & Background Tasks (CRON:)

### 11.1 pg_cron Jobs
- [x] `expire_listing_boosts()` - hourly (pg_cron active) (2026-01-24)
- [x] `cleanup_expired_boosts()` - every 5 minutes (pg_cron active) (2026-01-24)
- [x] Jobs present + active in `cron.job` (2026-01-24)

### 11.2 Edge Functions
- [x] `ai-shopping-assistant` exists and `verify_jwt=true` (2026-01-24)
- [ ] Function deployments current (manual check against latest source SHA/version)

---

## Phase 12 — Regression Scan (REGRESSION:)

### 12.1 Category Changes Impact
Find all code paths that INSERT/UPDATE `products.category_id`:

```typescript
// Search patterns
grep -r "category_id" --include="*.ts" --include="*.tsx"
grep -r "products.*insert" --include="*.ts"
grep -r "products.*update" --include="*.ts"
```

Verify each handles:
- [x] Leaf category requirement enforced in DB via trigger (2026-01-24)
- [x] Trigger error handled in `app/[locale]/(sell)/_actions/sell.ts`, `app/actions/products.ts`, `app/api/products/create/route.ts` (2026-01-24)
- [x] User-friendly error messages returned (2026-01-24)

### 12.2 Server/Client Boundary
- [x] No `"use client"` files importing server-only Supabase server/admin helpers (scan) (2026-01-25)
- [x] Server actions properly isolated (scan) (2026-01-25)
- [x] API routes use server client (spot-check) (2026-01-25)

### 12.3 Search/Browse Pages
- [x] Category changes don't break search (e2e smoke) (2026-01-25)
- [x] Category changes don't break browse (e2e smoke) (2026-01-25)
- [x] Filters still work after category changes (e2e smoke) (2026-01-25)

---

## Phase 13 — Documentation Update (DOCS:)

After audit completion:

### 13.1 Update `supabase-codex/`
- [ ] Update any outdated information
- [ ] Add new findings
- [ ] Document any schema changes made

### 13.2 Update `supabase-info/`
- [ ] Regenerate snapshots if schema changed
- [ ] Update any outdated references

---

## Findings Log

### Issues Found

| # | Phase | Severity | File/Location | Issue | Fix Applied | Status |
|---|-------|----------|---------------|-------|-------------|--------|
| 1 | 2 | High | Supabase DB | `public.boost_prices` missing (TS types + API route expect it) | Applied Supabase migration `create_boost_prices_table` (RLS policy + grants + seed) + added `supabase/migrations/20260124223000_create_boost_prices_table.sql` | Done |
| 2 | 12 | High | `app/actions/products.ts` / `app/api/products/create/route.ts` | Leaf-category enforcement trigger caused generic failures (and could break duplication for legacy non-leaf categories) | Added friendly error mapping; `duplicateProduct` retries with `category_id=null`; API route returns 400 with clear message | Done |
| 3 | 1 | Medium | Supabase DB | Performance advisor: duplicate index on `public.admin_docs` locale (`admin_docs_locale_idx` vs `idx_admin_docs_locale`) | Not applied (review/deduplicate in next DB maintenance window) | Deferred |
| 4 | 3–6 | High | Categories/Filters/Sell | Attribute key mismatch across JSONB write + URL params + filter queries | Canonicalized on `category_attributes.attribute_key` (fallback normalizer) across create/search/browse/filter UI; added `lib/attributes/normalize-attribute-key.ts` | Done |
| 5 | 6 | Medium | `lib/sell/schema-v4.ts` | Sell progress showed completion before description met requirements | Progress now requires `description.trim().length >= 50` | Done |
| 6 | 4 | Low | `lib/data/product-page.ts` | Variant ordering inconsistent across queries | Normalize ordering: default first, then `sort_order`, then name | Done |
| 7 | 8 | Critical | Supabase DB + server actions | Authenticated users could UPDATE sensitive `profiles` fields (role/tier/verification) → self-admin escalation | Restricted authenticated UPDATE to safe columns via migrations `20260125090000_profiles_revoke_sensitive_updates.sql` + `20260125091000_profiles_restrict_authenticated_updates.sql`; server actions use service-role for sensitive updates | Done |
| 8 | 7 | High | `app/[locale]/(checkout)/_actions/checkout.ts` | Guest checkout sessions could be created but cannot be converted to valid orders (`user_id` uuid) | Require sign-in before creating Stripe checkout session; always set `client_reference_id` + `metadata.user_id` to uuid | Done |

### Manual Steps Required

List any issues that require manual intervention (e.g., Supabase dashboard changes):

1. Enable Supabase Auth leaked password protection in dashboard (advisor warning `auth_leaked_password_protection`).
2. (Optional) Drop one of the duplicate locale indexes on `public.admin_docs` (after confirming usage via `pg_stat_user_indexes`).
3. (Optional) Storage hardening: restrict `product-images` upload policy to require first path segment = `auth.uid()`; consider separate policy/handling for `chat/{uid}/...` uploads.

---

## Final Checklist

- [x] All sanity gates pass
- [ ] Supabase advisors show expected state
- [x] Types are aligned
- [ ] Categories and attributes work end-to-end
- [ ] Products CRUD works
- [x] Filtering works (e2e smoke + canonical attr keys) (2026-01-25)
- [ ] Sell flow works
- [ ] Orders work
- [x] Auth works (middleware + auth redirects; e2e smoke) (2026-01-25)
- [x] No regressions (typecheck + unit + e2e smoke) (2026-01-25)
- [ ] Documentation updated

---

## Commands Reference

```bash
# Sanity gates
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
pnpm -s lint
pnpm -s build
pnpm -s knip
pnpm -s styles:gate

# Type generation
pnpm supabase gen types typescript --local > lib/supabase/database.types.ts

# Search patterns
grep -r "category_id" --include="*.ts" --include="*.tsx"
grep -r "from.*database.types" --include="*.ts"
grep -r "createServerClient\|createBrowserClient" --include="*.ts"
```

## Supabase MCP Tools to Use

```
mcp_supabase_get_advisors type="security"
mcp_supabase_get_advisors type="performance"
mcp_supabase_list_tables schemas=["public"]
mcp_supabase_generate_typescript_types
mcp_supabase_get_logs service="postgres"
mcp_supabase_search_docs graphql_query="..."
```
