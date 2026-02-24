# Category & Catalog Architecture Redesign

> From 13,139 deep-tree categories to a modern 2-level taxonomy + aspects engine.
> Created: 2026-02-24 | Status: **Draft — needs Codex review**

---

## Problem Statement

Treido has **13,139 categories** for **233 products** (56:1 ratio). The category tree is 5 levels deep with 11,260 leaf nodes, most of which will never contain a single listing. This architecture:

- Makes browsing feel dead (empty categories everywhere)
- Makes the sell flow overwhelming (navigate 4+ levels to list an item)
- Makes search results sparse (products scattered across 11K leaves)
- Creates massive maintenance burden (7,116 category attributes, 86% inactive)
- Prevents faceted filtering (specifics are encoded as tree nodes, not filterable attributes)
- Doesn't match how any major marketplace operates in 2025-2026

### Current State (Live DB)

| Metric | Value |
|--------|-------|
| Total categories | 13,139 |
| Depth 0 (top-level) | 24 |
| Depth 1 | 291 |
| Depth 2 | 3,073 |
| Depth 3 | 9,104 |
| Depth 4 | 647 |
| Leaf categories | 11,260 |
| Category attributes (total) | 7,116 |
| Category attributes (active) | 999 (14%) |
| Products | 233 |
| Products with attributes | 233 (100%) |
| Product variants | 0 |
| `products` table columns | 47 |

### How eBay Does It (2025-2026)

eBay US: ~20,000 categories / ~1.9B listings = 95,000 listings per category.

Their model (confirmed from Taxonomy API docs + Inventory Mapping API):

1. **Category tree** — navigational only. ~20K leaf nodes for the world's largest marketplace.
2. **Aspects** (item specifics) — the real metadata layer. Each leaf category defines `Brand`, `Color`, `Model`, `Size`, etc. as structured aspects, NOT deeper categories.
3. **`getCategorySuggestions`** — seller types a title, AI suggests the best leaf category.
4. **Inventory Mapping API (2025, GraphQL)** — seller provides raw product data, AI generates the full listing with correct category + aspects.
5. **Category expiration/remapping** — they actively prune and consolidate.

Key insight: eBay has 20K categories for billions of items. We have 13K categories for 233 items. We're carrying enterprise-scale taxonomy costs with zero-scale benefits.

---

## Target Architecture

### Principle: **2-Level Tree + Aspects**

Categories handle **navigation** (what shelf is this on?).
Aspects handle **specifics** (what exactly is it?).

Instead of: `Electronics > Smartphones > Samsung > Galaxy > S24 Ultra`
Target:      `Electronics > Phones` + aspects: `Brand=Samsung`, `Model=Galaxy S24 Ultra`, `Storage=256GB`

### Decision: Verticals to Include at Launch

**Include (product marketplace):**
- Electronics, Fashion, Home & Kitchen, Beauty & Health, Kids & Baby
- Sports & Outdoors, Collectibles & Art, Books & Media, Pets
- Gaming, Hobbies & Crafts, Jewelry & Watches
- Automotive, Tools & Industrial, Grocery & Food

**Defer post-launch (different listing paradigms):**
- ~~Jobs~~ — classified, no cart/checkout, needs different UX
- ~~Real Estate~~ — classified, no shipping, needs location/map integration
- ~~Services & Events~~ — no physical item, needs scheduling/booking
- ~~Wholesale~~ — B2B, needs minimum order quantities, different pricing
- ~~E-Mobility~~ — fold into Automotive (it's a subcategory, not a vertical)
- ~~Software~~ — digital goods, needs delivery mechanism
- ~~Bulgarian Traditional~~ — fold into relevant categories (Food, Crafts, Fashion) with a `Bulgarian Traditional` tag/aspect

**Rationale:** Each deferred vertical needs fundamentally different sell flows (no shipping, no cart, location-based, digital delivery, MOQs). Trying to shoe-horn them into the same product schema is what caused the 47-column products table. Ship a great product marketplace first.

### Target Category Tree (~200 nodes)

**12 verticals, ~15-20 subcategories each = ~200 total categories (2 levels only)**

```
Electronics (11 subcategories)
├── Phones & Tablets
├── Laptops & Computers
├── Cameras & Photography
├── Audio & Headphones
├── TVs & Monitors
├── Gaming Consoles
├── Smart Home & IoT
├── Networking & Accessories
├── Wearable Tech
├── Components & Parts
└── Other Electronics

Fashion (10 subcategories)
├── Women's Clothing
├── Men's Clothing
├── Kids' Clothing
├── Shoes
├── Bags & Luggage
├── Jewelry & Accessories
├── Watches
├── Sportswear
├── Vintage & Secondhand
└── Other Fashion

Home & Kitchen (10 subcategories)
├── Furniture
├── Kitchen & Dining
├── Bedding & Bath
├── Home Décor
├── Lighting
├── Garden & Outdoor
├── Storage & Organization
├── Appliances
├── Cleaning & Household
└── Other Home

Beauty & Health (8 subcategories)
├── Skincare
├── Makeup
├── Hair Care
├── Fragrance
├── Health & Supplements
├── Personal Care
├── Medical Supplies
└── Other Beauty & Health

Kids & Baby (8 subcategories)
├── Baby Gear & Strollers
├── Nursing & Feeding
├── Diapers & Potty
├── Kids' Toys & Games
├── Nursery & Furniture
├── Kids' Safety & Health
├── Kids' Books & Learning
└── Other Kids & Baby

Sports & Outdoors (10 subcategories)
├── Exercise & Fitness
├── Cycling
├── Hiking & Camping
├── Water Sports
├── Winter Sports
├── Team Sports
├── Running
├── Combat & Martial Arts
├── Fishing & Hunting
└── Other Sports

Collectibles & Art (8 subcategories)
├── Coins & Currency
├── Stamps
├── Trading Cards
├── Art & Prints
├── Antiques
├── Memorabilia
├── Vintage Items
└── Other Collectibles

Books & Media (8 subcategories)
├── Books
├── Comics & Manga
├── Vinyl Records
├── CDs & DVDs
├── Musical Instruments
├── Sheet Music & Scores
├── Magazines
└── Other Media

Pets (6 subcategories)
├── Dogs
├── Cats
├── Fish & Aquatic
├── Birds
├── Small Animals & Reptiles
└── Other Pets

Gaming (6 subcategories)
├── Console Games & Hardware
├── PC Gaming
├── Board Games & Puzzles
├── VR & AR
├── Gaming Accessories
└── Other Gaming

Hobbies & Crafts (6 subcategories)
├── Art Supplies & Crafts
├── Model Building & RC
├── Handmade & DIY
├── Musical Instruments
├── Scale Models
└── Other Hobbies

Automotive & Tools (8 subcategories)
├── Car Parts & Accessories
├── Tires & Wheels
├── Vehicle Electronics
├── E-Bikes & Scooters
├── Power Tools
├── Hand Tools
├── Safety & Workwear
└── Other Auto & Tools

Grocery & Food (6 subcategories)
├── Pantry & Dry Goods
├── Snacks & Sweets
├── Drinks & Beverages
├── Fresh & Frozen
├── Organic & Specialty
└── Other Food

Jewelry & Watches (6 subcategories)
├── Fine Jewelry
├── Fashion Jewelry
├── Watches
├── Engagement & Wedding
├── Jewelry Supplies & Care
└── Other Jewelry
```

**Total: 14 verticals × ~8 subcategories = ~121 leaf nodes** (+ 14 top-level = ~135 total)

This is 100x smaller than the current tree. Every category will have products in it.

---

## Aspects Engine

### What Aspects Replace

| Currently In | Becomes |
|-------------|---------|
| Depth 2+ categories | Aspect values |
| `products.condition` column | Universal aspect: `Condition` |
| `products.ships_to_*` (6 booleans) | Shipping config (separate concern) |
| `products.is_on_sale` + `sale_percent` + `sale_end_date` | Sale JSONB or separate table |
| `products.weight` + `weight_unit` | Aspect or shipping metadata |
| `products.is_prime` | Delete (Amazon artifact) |
| `products.is_boosted` + `boost_expires_at` | Delete (duplicates `listing_boosts`) |
| `products.is_featured` + `featured_until` | Delete (duplicates boost logic) |
| `products.is_limited_stock` | Delete (just check `stock`) |
| `products.stock_quantity` | Delete (duplicate of `stock`) |
| `category_attributes` (7,116 rows) | `category_aspects` (~500-800 rows, all active) |
| `product_attributes` (73 rows) | `product_aspects` |

### Schema: `category_aspects`

```sql
CREATE TABLE category_aspects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  aspect_key text NOT NULL,           -- machine key: 'brand', 'color', 'storage_gb'
  aspect_name text NOT NULL,          -- display: 'Brand'
  aspect_name_bg text,                -- Bulgarian: 'Марка'
  aspect_type text NOT NULL DEFAULT 'text',  -- text | select | multiselect | number | boolean
  is_required boolean NOT NULL DEFAULT false,
  is_filterable boolean NOT NULL DEFAULT false,
  is_variation boolean NOT NULL DEFAULT false, -- can vary within a listing (size, color)
  is_hero_spec boolean NOT NULL DEFAULT false, -- show on product cards
  allowed_values jsonb,               -- ["Samsung","Apple","Xiaomi",...] for select/multiselect
  allowed_values_bg jsonb,            -- Bulgarian translations
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(category_id, aspect_key)
);
```

### Universal Aspects (apply to ALL categories)

These aspects exist on every leaf category, defined once and inherited:

| Aspect Key | Name | Type | Required | Filterable |
|-----------|------|------|----------|------------|
| `condition` | Condition | select | Yes | Yes |
| `brand` | Brand | text (free + suggestions) | No | Yes |

`condition` values: `New`, `New (Open Box)`, `Used - Like New`, `Used - Good`, `Used - Fair`, `For Parts`

### Per-Category Aspects (examples)

**Electronics > Phones & Tablets:**
| Aspect | Type | Required | Filterable | Values |
|--------|------|----------|------------|--------|
| `brand` | select | Yes | Yes | Samsung, Apple, Xiaomi, Huawei, Google, OnePlus, ... |
| `model` | text | No | No | (free text) |
| `storage` | select | No | Yes | 32GB, 64GB, 128GB, 256GB, 512GB, 1TB |
| `ram` | select | No | Yes | 4GB, 6GB, 8GB, 12GB, 16GB |
| `color` | select | No | Yes | Black, White, Blue, Green, Red, Gold, ... |
| `screen_size` | number | No | Yes | (inches) |
| `network` | select | No | Yes | Unlocked, 5G, 4G LTE |

**Fashion > Women's Clothing:**
| Aspect | Type | Required | Filterable | Values |
|--------|------|----------|------------|--------|
| `brand` | text | No | Yes | (free text) |
| `size` | select | Yes | Yes | XS, S, M, L, XL, XXL, or numeric |
| `color` | select | No | Yes | (standard palette) |
| `material` | multiselect | No | Yes | Cotton, Polyester, Silk, Linen, Wool, ... |
| `style` | select | No | Yes | Casual, Formal, Sporty, Boho, ... |

**Automotive & Tools > Car Parts:**
| Aspect | Type | Required | Filterable | Values |
|--------|------|----------|------------|--------|
| `make` | select | Yes | Yes | BMW, Mercedes, VW, Audi, ... |
| `model` | text | No | Yes | (free text) |
| `year_range` | text | No | Yes | (e.g., "2018-2024") |
| `part_type` | select | Yes | Yes | Engine, Brakes, Suspension, Electrical, ... |
| `oem_number` | text | No | No | (free text) |

---

## Products Table Slim-Down

### Current: 47 columns → Target: ~25 columns

**Keep as-is:**
`id`, `seller_id`, `category_id`, `title`, `description`, `price`, `list_price`, `stock`, `slug`, `search_vector`, `created_at`, `updated_at`, `status`, `condition`, `tags`, `meta_title`, `meta_description`, `brand_id`, `listing_type`, `seller_city`, `category_ancestors`, `view_count`, `rating`, `review_count`

**Consolidate into `shipping` JSONB:**
```jsonb
{
  "zones": ["BG", "EU", "UK", "US", "worldwide"],
  "pickup_only": false,
  "free_shipping": true,
  "shipping_days": 3,
  "weight_kg": 0.5
}
```
Replaces: `ships_to_bulgaria`, `ships_to_europe`, `ships_to_usa`, `ships_to_uk`, `ships_to_worldwide`, `pickup_only`, `free_shipping`, `shipping_days`, `weight`, `weight_unit`

**Consolidate into `sale` JSONB (or drop):**
```jsonb
{
  "active": true,
  "percent": 20,
  "end_date": "2026-03-01T00:00:00Z"
}
```
Replaces: `is_on_sale`, `sale_percent`, `sale_end_date`

**Delete entirely:**
| Column | Reason |
|--------|--------|
| `is_prime` | Amazon artifact, not a Treido concept |
| `is_boosted` | Redundant — check `listing_boosts` table |
| `boost_expires_at` | Redundant — in `listing_boosts` table |
| `is_featured` | Redundant — duplicates boost logic |
| `featured_until` | Redundant — duplicates boost logic |
| `is_limited_stock` | Meaningless — just check `stock < threshold` |
| `stock_quantity` | Duplicate of `stock` column |
| `images` | Redundant — `product_images` table exists |

**Result: ~25 columns** (from 47) + `shipping` JSONB + optional `sale` JSONB

---

## Migration Strategy

### Phase 0: Prerequisite Decisions (Human)

- [ ] **Confirm vertical scope** — which of the 14 categories make the cut for launch?
- [ ] **Confirm deferred verticals** — Jobs, Real Estate, Services, Wholesale, Software, E-Mobility, Bulgarian Traditional → post-launch?
- [ ] **Confirm products table slim-down** — are any "delete" columns actually used in ways not captured here?

### Phase 1: Build New Structure (Code-only, no DB changes)

1. **Create target category seed** — `supabase/seed/categories-v2.sql`
   - 14 verticals + ~121 subcategories
   - All with `name`, `name_bg`, `slug`, `icon`, `is_browseable`
2. **Create target aspect seed** — `supabase/seed/aspects-v2.sql`
   - Universal aspects (condition, brand)
   - Per-leaf-category aspects (~500-800 rows total)
3. **Create category mapping** — `scripts/db/category-mapping.json`
   - Maps every current leaf category → new leaf category
   - Maps depth-2+ names → aspect values
4. **Products table migration SQL** — draft only, don't apply
   - Add `shipping` JSONB column
   - Populate from existing boolean columns
   - Drop redundant columns

### Phase 2: Data Migration (Requires human approval — DB migration)

1. **Apply new `category_aspects` table** migration
2. **Apply new category tree** — insert new categories, keep old ones temporarily
3. **Remap 233 products** to new leaf categories using mapping
4. **Migrate product attributes** to new `category_aspects` schema
5. **Apply products table column changes** (add JSONB, drop old columns)
6. **Regenerate TypeScript types**

### Phase 3: Frontend Updates

1. **Sell flow** — update category picker (now 2 levels, much simpler)
2. **Sell flow** — add aspect form (dynamic, based on selected category)
3. **Browse/search** — update category navigation
4. **Browse/search** — add faceted filtering from aspects
5. **PDP** — display aspects in "Specs" section (already partially exists)

### Phase 4: Cleanup

1. **Delete old categories** (all 13K)
2. **Delete old `category_attributes`** table (replace with `category_aspects`)
3. **Delete unused tables** (`variant_options`, `shipping_zones`, `brands` if aspects replace it)
4. **Run full gates** — typecheck, lint, styles:gate, test:unit

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Product remap loses data | Medium | Mapping is 1:1 and reversible. Only 233 products. |
| Frontend breaks on new categories | High | Phase 3 must be coordinated. Can't half-do it. |
| Aspect definitions wrong | Low | Only affects listing quality, easy to iterate. |
| Old URLs break | Medium | Set up redirects from old slugs → new. |
| Search quality drops | Low | Fewer, better-populated categories = better search. |
| Existing users confused | Low | 233 products, pre-launch. No established habits. |

**Key advantage: This is pre-launch with 233 seed products.** This is the cheapest time to do this. After launch with real seller data, this becomes 100x harder.

---

## What This Enables

1. **Faceted filtering** — browse Electronics > Phones, filter by Brand=Samsung, Storage=256GB, Price $200-400
2. **AI-powered listing** — seller uploads photo, AI suggests category + fills aspects (like eBay's Inventory Mapping API)
3. **Healthy browse UX** — every category has products, no ghost towns
4. **Simpler sell flow** — 2 clicks to category + fill relevant aspects vs. 4-level tree navigation
5. **Future vertical expansion** — add Jobs/Real Estate/Services as separate listing types later, with proper schemas
6. **Manageable admin** — 135 categories to curate, not 13,139
7. **Bulgarian localization** — translate 135 category names, not 13,139

---

## Open Questions for Human

1. Should `Grocery & Food` stay? It implies fresh/perishable logistics that Treido may not support at launch.
2. Should `Automotive & Tools` be one vertical or two? They're quite different.
3. The `Bulgarian Traditional` brand is unique to Treido's identity — should it survive as an aspect/tag on relevant products, or as a curated collection page?
4. Are product variants (size/color) still planned? Current DB has 0 variant records. The aspects engine naturally supports variations (`is_variation: true`).
5. Timeline: Is this blocking launch, or can the current 13K tree ship and be migrated post-launch?

---

*Last updated: 2026-02-24*
