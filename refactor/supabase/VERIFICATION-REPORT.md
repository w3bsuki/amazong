# Category Redesign v2 — Full Verification Report

Date: 2026-02-24  
Project: `dhtzybnkvpimmomzwrce` (Supabase via MCP)  
Scope: Full verification requested for `refactor/supabase/CATEGORY-REDESIGN-v2.md`

---

## 0) Inputs Read

- `AGENTS.md`
- `refactor/supabase/CATEGORY-REDESIGN-v2.md`
- `refactor/supabase/AUDIT.md`
- `docs/database.md`
- `docs/PRD.md`
- `docs/business/go-to-market.md`

---

## 1) Schema Verification (Live DB vs v2 Plan)

### 1.1 Tables/Columns Referenced by v2

Verified live columns for:
- `public.products`
- `public.categories`
- `public.category_attributes`
- `public.product_attributes`

Findings:
- `products.listing_kind` / `transaction_mode` / `fulfillment_mode` / `pricing_mode`: **missing** (as expected pre-migration).
- `categories.allowed_listing_kinds` / `allowed_transaction_modes` / `allowed_fulfillment_modes` / `default_fulfillment_mode`: **missing**.
- `category_attributes.is_variation` / `is_searchable` / `aspect_group` / `depends_on_attribute_id` / `depends_on_values`: **missing**.
- Existing `products.listing_type` check is still active: `('normal','boosted')`.
- Existing `categories.slug` has a unique constraint (`categories_slug_key`).

### 1.2 Triggers/Functions Referenced by v2

Present in live DB:
- `handle_new_product_search()` (trigger fn)
- `sync_product_attributes_jsonb(p_product_id uuid)` (fn)
- `handle_product_attributes_sync()` (trigger fn)
- `handle_category_attribute_key_normalization()` (trigger fn)
- `trg_product_attributes_sync_jsonb` (trigger on `product_attributes`)
- `trg_category_attributes_normalize_key` (trigger on `category_attributes`)

Missing (by v2 naming):
- `sync_product_attributes_to_jsonb()` (not present pre-migration)
- `rebuild_product_search_vector(...)` (not present pre-migration)
- `get_category_facets(...)` (not present pre-migration)
- `handle_category_attribute_key_norm()` (name mismatch; live name is `...normalization`)
- `trg_products_search_vector` (not present)
- `trg_product_attributes_search_sync` (not present)

### 1.3 SQL Dry-Run Validation (Transactional)

Pass:
- Step 1 additive schema SQL compiles and runs in transaction (rolled back).
- Corrected search/facet function + trigger bundle compiles (rolled back).

Fail:
- `ALTER TABLE products DROP COLUMN is_prime` fails:
  - `ERROR: cannot drop column is_prime ... view deal_products depends on it`.
- v2 trigger snippet fails as written:
  - `... EXECUTE FUNCTION rebuild_product_search_vector(NEW.id)` is invalid trigger syntax.
- Trigger function return mismatch issue:
  - Trigger target must be `RETURNS trigger` (not `RETURNS void`).

### 1.4 Hard Contradictions vs v2

1. v2 Step 1 says drop `is_prime`; live `deal_products` view still selects `is_prime` and blocks drop.
2. v2 trigger SQL for search rebuild is syntactically invalid.
3. v2 object names partly stale (`handle_category_attribute_key_norm` vs live `handle_category_attribute_key_normalization`).
4. v2 “insert new tree alongside old” can collide if non-prefixed slugs are reused due `categories.slug` unique index.

---

## 2) Codebase Dependency Scan (Categories/Attributes/Listing/Shipping/Images/Search)

### 2.1 Category/Aspect Dependencies (high-impact runtime)

Core files:
- `app/[locale]/(main)/categories/[slug]/page.tsx`
- `app/[locale]/(main)/categories/page.tsx`
- `app/[locale]/(main)/search/page.tsx`
- `app/actions/products-create.ts`
- `app/actions/products-update.ts`
- `app/[locale]/(sell)/_actions/sell.ts`
- `app/api/categories/[slug]/attributes/route.ts`
- `app/api/categories/[slug]/context/route.ts`
- `app/api/categories/counts/route.ts`
- `app/api/products/newest/route.ts`
- `app/api/products/count/route.ts`
- `lib/data/categories/hierarchy.ts`
- `lib/data/categories/context.ts`
- `lib/data/category-attributes.ts`
- `lib/data/products/queries.ts`
- `lib/data/products/normalize.ts`
- `lib/data/product-page.ts`
- `lib/data/search-products.ts`
- `lib/sell/resolve-leaf-category.ts`
- `components/desktop/feed-toolbar.tsx`
- `components/shared/product/card/list.tsx`

Breakage risk if not migrated with code:
- Existing sell/category logic assumes deep traversal and leaf resolution across >2 levels.
- Search/category APIs rely on `products.category_ancestors`.
- Filters rely on `products.attributes` normalized keys + `category_attributes`.

### 2.2 Listing/Shipping/Media/Search Field Dependencies

Core files:
- `app/[locale]/(sell)/_actions/sell.ts`
- `app/actions/boosts.ts`
- `app/api/payments/webhook/route.ts`
- `app/[locale]/(account)/account/selling/edit/edit-product-client.tsx`
- `app/api/products/feed/route.ts`
- `app/api/products/newest/route.ts`
- `app/api/products/count/route.ts`
- `app/[locale]/(main)/search/_lib/search-products.ts`
- `app/[locale]/(main)/search/_lib/search-sellers.ts`
- `lib/shipping.ts`
- `lib/data/products/queries.ts`
- `lib/data/products/types.ts`
- `lib/data/products/normalize.ts`
- `lib/data/product-page.ts`
- `lib/view-models/product-page.ts`

Breakage risk if not migrated with code:
- `products.listing_type` is still operationally required for boost state paths.
- `ships_to_*`, `pickup_only`, `free_shipping`, `shipping_days`, `seller_city` are hardwired in filtering/query logic.
- Dual image model remains in runtime path (`product_images` preferred; fallback to `products.images`).

---

## 3) Category Mapping Dry Run

### 3.1 Live Counts

- Total products: `233`
- Categorized products: `227`
- Uncategorized products: `6`
- Used categories: `87`
- Used non-leaf categories: `0`

Top roots by product count:
- Electronics `44`
- Home & Kitchen `20`
- Fashion `19`
- Automotive `17`
- Kids `15`

### 3.2 Mapping State Summary

- `__MAPPED__`: `209` products
- `__DEFERRED__`: `17` products
- `__MERGED_TAG_DECISION__`: `1` product
- `__UNCATEGORIZED__`: `6` products

### 3.3 Full Old→New Mapping (all 87 used leaves)

`old_leaf_slug | product_count | target_leaf_slug | root`

| old_leaf_slug | product_count | target_leaf_slug | root |
|---|---:|---|---|
| gaming-desktops-asus-rog | 35 | v2-electronics-computers | Electronics |
| dress-shirts | 16 | v2-fashion-men-clothing | Fashion |
| gaming-pc-compact | 10 | v2-electronics-computers | Gaming |
| standard-strollers | 10 | v2-kids-strollers | Kids |
| foundations | 9 | v2-beauty-makeup | Beauty |
| sectional-lshape | 9 | v2-home-furniture | Home & Kitchen |
| ev-tesla-y | 8 | v2-automotive-vehicles | Automotive |
| fiction-mystery-thriller | 8 | v2-books-fiction | Books |
| tread-folding | 8 | v2-sports-fitness-equipment | Sports |
| manufacturing-equipment | 6 | v2-tools-industrial-scientific | Tools & Industrial |
| milk-whole | 6 | __DEFERRED__ | Grocery & Food |
| art-paint-oil | 5 | v2-collectibles-art | Collectibles |
| software-os | 5 | __DEFERRED__ | Software |
| vinyl-indie | 4 | v2-books-media-music | Movies & Music |
| dogs-food | 3 | v2-pets-food-supplies | Pets |
| engagement-solitaire | 3 | v2-jewelry-rings | Jewelry & Watches |
| engine-fuel-filters | 3 | v2-automotive-parts | Automotive |
| knit-yarn | 3 | v2-hobbies-crafts | Hobbies |
| sedans | 3 | v2-automotive-vehicles | Automotive |
| cat-dry-food | 2 | v2-pets-food-supplies | Pets |
| house-cleaning-service | 2 | __DEFERRED__ | Services & Events |
| huawei-p50-series | 2 | v2-electronics-smartphones | Electronics |
| indoor-plants | 2 | v2-home-garden-outdoor | Home & Kitchen |
| womens-prenatal | 2 | v2-beauty-health-supplements | Health |
| 144hz-gaming-monitors | 1 | v2-electronics-monitors | Electronics |
| above-ground-pools | 1 | v2-home-garden-outdoor | Home & Kitchen |
| adobe-creative-suite | 1 | __DEFERRED__ | Software |
| audio-processors | 1 | v2-automotive-electronics | Automotive |
| av-home | 1 | __DEFERRED__ | Software |
| backpacks-school | 1 | v2-home-office-school | Home & Kitchen |
| bandages | 1 | v2-beauty-health-medical | Health |
| baseball-cards | 1 | v2-collectibles-sports-memorabilia | Collectibles |
| bg-misket | 1 | __MERGED_TAG_DECISION__ | Bulgarian Traditional |
| bike-road | 1 | v2-sports-cycling | Sports |
| bird-seed | 1 | v2-pets-food-supplies | Pets |
| bottle-glass | 1 | v2-kids-feeding | Kids |
| calendars-wall | 1 | v2-home-office-school | Home & Kitchen |
| canvas-art | 1 | v2-home-decor | Home & Kitchen |
| car-stereos | 1 | v2-automotive-electronics | Automotive |
| cat-ear | 1 | v2-pets-grooming | Pets |
| cloth-nb-sets | 1 | v2-kids-clothing-shoes | Kids |
| coins-gold-eagles | 1 | v2-collectibles-coins | Collectibles |
| computer-accessories | 1 | v2-electronics-computer-accessories | Electronics |
| crib-std | 1 | v2-kids-nursery-furniture | Kids |
| diamonds-solitaire | 1 | v2-jewelry-rings | Jewelry & Watches |
| digital-pianos | 1 | v2-hobbies-musical-instruments | Hobbies |
| dj-controllers | 1 | v2-hobbies-musical-instruments | Hobbies |
| doctor-jobs | 1 | __DEFERRED__ | Jobs |
| drums-acoustic | 1 | v2-hobbies-musical-instruments | Hobbies |
| fabric-textiles | 1 | v2-hobbies-crafts | Hobbies |
| family-law | 1 | __DEFERRED__ | Services & Events |
| fish-flake-food | 1 | v2-pets-food-supplies | Pets |
| fitness-nutrition | 1 | v2-beauty-health-supplements | Health |
| foot-care-products | 1 | v2-beauty-health-medical | Health |
| fragrance-womens-perfume | 1 | v2-beauty-fragrance | Beauty |
| gaming-laptops-razer | 1 | v2-electronics-laptops | Electronics |
| garden-hand-tools | 1 | v2-home-garden-outdoor | Home & Kitchen |
| garden-statues | 1 | v2-home-garden-outdoor | Home & Kitchen |
| guitars-basses | 1 | v2-hobbies-musical-instruments | Hobbies |
| handmade-jewelry | 1 | v2-hobbies-crafts | Hobbies |
| handtools-hammers | 1 | v2-tools-hand-tools | Tools & Industrial |
| hard-hats | 1 | v2-tools-safety | Tools & Industrial |
| health-monitors | 1 | v2-electronics-wearables | Electronics |
| home-decor-crafts | 1 | v2-hobbies-crafts | Hobbies |
| huawei-phones | 1 | v2-electronics-smartphones | Electronics |
| mens-dress-boots | 1 | v2-fashion-men-shoes | Fashion |
| mens-sneakers-running | 1 | v2-fashion-men-shoes | Fashion |
| microscopes | 1 | v2-tools-industrial-scientific | Tools & Industrial |
| multivitamins | 1 | v2-beauty-health-supplements | Health |
| office-desks | 1 | v2-home-office-school | Home & Kitchen |
| oled-tvs | 1 | v2-electronics-tvs | Electronics |
| pens | 1 | v2-home-office-school | Home & Kitchen |
| pokemon-boosterbox | 1 | v2-gaming-trading-cards | Gaming |
| powertools-drills | 1 | v2-tools-power-tools | Tools & Industrial |
| rabbit-food | 1 | v2-pets-food-supplies | Pets |
| rare-stamps | 1 | v2-collectibles-stamps | Collectibles |
| recording-mics | 1 | v2-hobbies-musical-instruments | Hobbies |
| skincare-cleanser | 1 | v2-beauty-skincare | Beauty |
| small-kitchen-appliances | 1 | v2-home-kitchen-appliances | Home & Kitchen |
| stem-toys | 1 | v2-kids-toys-games | Kids |
| storage | 1 | v2-electronics-computer-components | Electronics |
| strategy-scythe | 1 | v2-gaming-board-games | Gaming |
| test-measurement | 1 | v2-tools-industrial-scientific | Tools & Industrial |
| toys-action | 1 | v2-kids-toys-games | Kids |
| van-sale-cargo | 1 | v2-automotive-vehicles | Automotive |
| wind-saxophones | 1 | v2-hobbies-musical-instruments | Hobbies |
| women-necklaces | 1 | v2-jewelry-necklaces | Fashion |

### 3.4 Products that do not cleanly map yet

- Deferred roots (`__DEFERRED__`): `17` products.
- Bulgarian Traditional merge decision (`__MERGED_TAG_DECISION__`): `1` product.
- Uncategorized (`category_id is null`): `6` products.

Unresolved products are captured in migration logic (`tmp_unresolved_products`) in Step 3 SQL.

---

## 4) Aspect Seed Validation (Top 5 Verticals)

### 4.1 Existing Active Attribute Baseline

Distinct active keys by root:
- Electronics: `81`
- Home & Kitchen: `58`
- Fashion: `19`
- Automotive: `36`
- Kids: `38`

### 4.2 Proposed Seed Coverage (exact leaf-level requirements)

Validation used exact top-5 leaf requirements encoded in Step 4 SQL.

Coverage summary:
- Automotive: required rows `58`, found `39`, missing rows `19`, missing distinct keys `16`
  - Missing: `aspect_ratio, brand, compatible_models, connectivity, electronics_type, fluid_type, load_index, power_source, rim_diameter, season, specification, tire_type, tool_type, viscosity, volume, width`
- Electronics: required rows `92`, found `86`, missing rows `6`, missing distinct keys `6`
  - Missing: `audio_type, camera_type, lens_mount, platform, sensor_type, speed`
- Fashion: required rows `74`, found `55`, missing rows `19`, missing distinct keys `15`
  - Missing: `accessory_type, age_group, authenticity, band_material, case_size, heel_height, jewelry_type, model, movement, shoe_size_eu, sport_type, stone_type, watch_type, water_resistance, year`
- Home & Kitchen: required rows `72`, found `65`, missing rows `7`, missing distinct keys `7`
  - Missing: `decor_type, outdoor_use, pattern, scent, storage_type, surface_type, thread_count`
- Kids: required rows `59`, found `49`, missing rows `10`, missing distinct keys `8`
  - Missing: `format, fragrance_free, language, product_type, quantity, skin_type, subject_focus, weight_range`

Leaf-level exact requirements and upsert logic are in:
- `refactor/supabase/sql/v2-redesign/04-step4-aspect-pruning-activation.sql`

---

## 5) Migration SQL Pack (Draft, Not Applied)

Created:
- `refactor/supabase/sql/v2-redesign/01-step1-additive-schema.sql`
- `refactor/supabase/sql/v2-redesign/02-step2-category-tree.sql`
- `refactor/supabase/sql/v2-redesign/03-step3-product-remap.sql`
- `refactor/supabase/sql/v2-redesign/04-step4-aspect-pruning-activation.sql`

Key corrections included:
- No early `DROP products.is_prime` (blocked by `deal_products` dependency).
- Correct trigger architecture for search rebuild (`RETURNS trigger` wrapper + worker fn).
- Safe v2 slug namespace (`v2-*`) to avoid unique slug collisions.
- Explicit old→new mapping table for all 87 used leaves.

---

## 6) Risk Matrix + Rollback

| Step | Failure Mode | Breakage | Rollback |
|---|---|---|---|
| Step 1 Additive schema | New constraints invalid / app not updated | Sell/create/update writes fail for listing mode columns | Drop new constraints + columns; drop compatibility trigger (`01-step1` rollback block) |
| Step 1 `is_prime` drop (if attempted) | Fails due `deal_products` view dependency | Migration aborts mid-run if not transactional | Do not execute drop until `deal_products` view is migrated |
| Step 2 New tree insert | Slug collisions / partial tree | Remap cannot resolve targets, browse shows mixed state | Delete `slug like 'v2-%'` rows (rollback block in `02-step2`) |
| Step 3 Product remap | Missing target slugs / wrong mapping | Products remapped incorrectly or not remapped; browse mismatch | Restore from pre-step snapshot OR inverse remap via saved old ids; re-enable old browseable flags |
| Step 3 Old-tree hide | Hidden old categories before unresolved decisions | Deferred products become hard to discover | Re-enable browse flags for old mapped leaves |
| Step 4 Aspect pruning | Over-pruning old attrs | Sell/edit/search filters degrade | Restore `category_attributes` from pre-step backup (`is_active`, options, metadata) |
| Step 4 Search rebuild | Trigger/function bug | Search index stale or errors on writes | Drop new triggers/functions and revert to current `handle_new_product_search` path |

---

## 7) Human Decisions Required Before Apply

1. Confirm handling for deferred vertical products (`17` products): keep old categories, move to hold bucket, or soft-disable listings.
2. Decide Bulgarian Traditional treatment (`1` product): tag/collection merge target before remap.
3. Assign `6` uncategorized products to valid v2 leaves before final swap.
4. Approve order of `is_prime` deprecation: update `deal_products` first, then drop.
5. Confirm whether any non-`v2-*` slug strategy is required; current draft assumes side-by-side tree during soak.

---

## 8) Final Verification Verdict

- v2 direction is valid, but **not production-safe as written** without fixes above.
- Draft SQL pack now reflects corrected execution order and syntax.
- Remaining blockers are human policy decisions (deferred roots, Bulgarian Traditional, uncategorized products) and controlled rollout sequencing.
