# Category & Catalog Architecture Redesign v2

> Converged architecture after deep Orchestrator + Codex review.
> Supersedes: `CATEGORY-REDESIGN.md` (draft v1).
> Created: 2026-02-24 | Status: **Awaiting human approval**

---

## Executive Summary

**Verdict: Keep + aggressively evolve. Not rebuild.**

The foundation is sound — categories + attributes already mirrors eBay's taxonomy + aspects model. What's wrong is launch scope (13K categories for 233 products) and model discipline (47-column products table, dual-write patterns, missing listing modes).

### Key Decisions (Orchestrator + Codex Consensus)

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Categories | Compress 13,139 → ~135 (strict 2-level) | 100x smaller, every category has products |
| Depth model | 2-level max + aspect-driven browse chips | Depth-3 recreates the problem; aspects handle specifics |
| Aspects engine | Evolve `category_attributes`, don't replace | Already has 22 columns including inheritance, i18n, validation |
| Listing types | Add `listing_kind` + 3 mode columns | Enables sell-anything without schema hacks |
| Products table | Conservative column drops + deprecation paths | Most columns have runtime dependencies |
| Search | Postgres-native (tsvector + GIN + facets) | Sufficient for 10K-100K products |
| Variants | Defer (0 records, no real UI) | Ship single-SKU; plan proper variant model post-launch |
| Images | Keep `products.images[]` canonical for now | 203 of 232 products are array-only |

---

## 1. Category Tree Design

### Launch Verticals (10 Primary + 4 Secondary)

**Primary (shown prominently in nav/onboarding):**

| # | Vertical | Sub-categories | Products (current) |
|---|----------|---------------|-------------------|
| 1 | Electronics | 11 | 44 |
| 2 | Fashion | 10 | 19 |
| 3 | Home & Kitchen | 10 | 20 |
| 4 | Beauty & Health | 8 | 10 |
| 5 | Kids & Baby | 8 | 15 |
| 6 | Sports & Outdoors | 10 | 8 |
| 7 | Automotive | 8 | 17 |
| 8 | Gaming | 6 | 7 |
| 9 | Hobbies & Crafts | 6 | 5 |
| 10 | Collectibles & Art | 8 | 3 |

**Secondary (available but soft-hidden in initial nav):**

| # | Vertical | Sub-categories | Notes |
|---|----------|---------------|-------|
| 11 | Books & Media | 8 | Low initial demand |
| 12 | Pets | 6 | Niche for BG market |
| 13 | Jewelry & Watches | 6 | Low volume expected |
| 14 | Tools & Industrial | 6 | Split from Automotive (different audience) |

**Deferred (different listing paradigms needed):**

| Vertical | Reason | Future Listing Kind |
|----------|--------|-------------------|
| Jobs | Classified UX, no cart/checkout | `classified` + `contact` |
| Real Estate | Classified, location/map, no shipping | `classified` + `contact` |
| Services & Events | No physical item, needs scheduling | `service` + `contact/checkout` |
| Wholesale | B2B, min order qty, tiered pricing | `item` + `tiered` |
| Software | Digital delivery mechanism needed | `item` + `digital` |
| Grocery & Food | Cold chain, expiry, compliance risk | Defer or restrict to shelf-stable only |

**Merged into existing:**
- E-Mobility → "Automotive > E-Bikes & Scooters" subcategory
- Bulgarian Traditional → Cross-category tag/aspect, NOT a top-level vertical

### Total: 14 verticals × ~8 subcategories = ~121 leaves + 14 parents = ~135 total

### Depth Model: Strict 2-Level + Browse Chips

Instead of depth-3 categories, use **promoted aspect filters as browse chips**:

```
Electronics > Phones
  Browse chips: [Samsung] [Apple] [Xiaomi] [5G] [Used]
  ↑ These are real-time aspect filters from product data, not categories
```

**Why not depth-3?** Adding "Electronics > Phones > Samsung" is just `brand=Samsung` in category clothing. It recreates taxonomy bloat without adding structural value.

**Exception policy:** Depth-3 only if a subcategory needs genuinely different checkout/compliance/ops behavior (not just different attributes). No known exceptions at launch.

---

## 2. Listing Mode Architecture

### New Columns on `products`

```sql
ALTER TABLE products 
  ADD listing_kind TEXT NOT NULL DEFAULT 'item' 
    CHECK (listing_kind IN ('item', 'service', 'classified')),
  ADD transaction_mode TEXT NOT NULL DEFAULT 'checkout' 
    CHECK (transaction_mode IN ('checkout', 'contact')),
  ADD fulfillment_mode TEXT NOT NULL DEFAULT 'shipping' 
    CHECK (fulfillment_mode IN ('shipping', 'pickup', 'digital', 'onsite')),
  ADD pricing_mode TEXT NOT NULL DEFAULT 'fixed' 
    CHECK (pricing_mode IN ('fixed', 'auction', 'tiered'));
```

### Category Policy Mapping

```sql
ALTER TABLE categories
  ADD allowed_listing_kinds TEXT[] NOT NULL DEFAULT ARRAY['item'],
  ADD allowed_transaction_modes TEXT[] NOT NULL DEFAULT ARRAY['checkout'],
  ADD allowed_fulfillment_modes TEXT[] NOT NULL DEFAULT ARRAY['shipping'],
  ADD default_fulfillment_mode TEXT NOT NULL DEFAULT 'shipping';
```

### Mode Mappings

| Vertical | listing_kind | transaction_mode | fulfillment_mode | pricing_mode |
|----------|-------------|-----------------|-----------------|-------------|
| Electronics | item | checkout | shipping, pickup | fixed |
| Fashion | item | checkout | shipping | fixed |
| Automotive | item | checkout, contact | shipping, pickup | fixed |
| All product verticals | item | checkout | shipping | fixed |
| Jobs (future) | classified | contact | onsite | fixed |
| Real Estate (future) | classified | contact | onsite | fixed |
| Services (future) | service | contact, checkout | onsite | fixed |

**Important:** Keep existing `products.listing_type` for boost state (`normal`/`boosted`). It's actively used in boost actions, webhook routes, and seller tier migrations. The new `listing_kind` is semantically different.

---

## 3. Aspects Engine (Evolve, Don't Replace)

### Schema Evolution: `category_attributes` + 5 New Columns

```sql
ALTER TABLE category_attributes
  ADD is_variation BOOLEAN NOT NULL DEFAULT false,
  ADD is_searchable BOOLEAN NOT NULL DEFAULT true,
  ADD aspect_group TEXT,
  ADD depends_on_attribute_id UUID REFERENCES category_attributes(id) ON DELETE SET NULL,
  ADD depends_on_values TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
```

| New Column | Purpose |
|-----------|---------|
| `is_variation` | Marks size/color as variant axes (future) |
| `is_searchable` | Whether values feed into product search_vector |
| `aspect_group` | Groups related aspects in sell form ("Physical Specs", "Connectivity") |
| `depends_on_attribute_id` | Conditional display (show "Model" only after "Brand" is selected) |
| `depends_on_values` | Which parent values trigger this aspect (e.g., show "iOS Version" only when brand="Apple") |

### Data Pruning Strategy

Current: 7,116 rows, only 999 active (14%).
Target: ~500-800 active rows for the ~135 launch categories.

**Execution:**
1. Set `is_active = false` on attributes for deprecated/hidden categories
2. Define new attributes for new leaf categories where missing
3. Keep inactive rows for reference; hard-delete after soak period
4. Universal aspects (Condition, Brand) via `inherit_scope` (already exists)

### Product Attributes: Single Write Path

Current dual-write:
- `products.attributes` JSONB (on the row)
- `product_attributes` table (EAV: product_id, attribute_id, name, value)

**Decision:** `product_attributes` table is canonical source of truth. `products.attributes` JSONB is derived (regenerated by DB trigger on attribute insert/update/delete). No app-level dual-write.

```sql
-- Trigger: sync product_attributes → products.attributes JSONB
CREATE OR REPLACE FUNCTION sync_product_attributes_to_jsonb()
RETURNS trigger AS $$
BEGIN
  UPDATE products SET attributes = (
    SELECT jsonb_object_agg(pa.name, pa.value)
    FROM product_attributes pa
    WHERE pa.product_id = COALESCE(NEW.product_id, OLD.product_id)
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

## 4. Products Table Changes

### Safe to Drop Now (no runtime dependencies)

| Column | Evidence |
|--------|----------|
| `is_prime` | Zero app queries. Amazon artifact. |

### Deprecation Path (remove app reads first, then drop)

| Column | Reason | Runtime Dependency |
|--------|--------|--------------------|
| `is_featured` | Duplicates boost logic | In generated types, no direct app queries |
| `featured_until` | Same | Same |
| `is_limited_stock` | Just check `stock` | In generated types, no direct app queries |
| `stock_quantity` | Duplicate of `stock` | DB trigger coupling |

### Keep (actively used in runtime)

| Column | Why |
|--------|-----|
| `is_boosted` / `boost_expires_at` | Boost actions, webhook routes |
| `images` | Canonical for 203/232 products; list/search/feed all read it |
| `ships_to_*` (6 booleans) | Shipping filter logic in search |
| `is_on_sale` / `sale_percent` / `sale_end_date` | Discount write actions |
| All other core columns | Active in read/write paths |

### Do NOT Move Shipping to JSONB

Codex analysis confirms: shipping booleans are used in indexed filter queries throughout. JSONB would be slower for filtering and harder to index. Keep flat columns.

**Future consideration:** If per-zone pricing/handling times are needed, add a `product_shipping_zones` table alongside (not instead of) the boolean filters.

---

## 5. Search Architecture (Postgres-Native)

### Phase 1: Enhanced tsvector with Aspect Tokens

```sql
-- Rebuild search vector including aspect values
CREATE OR REPLACE FUNCTION rebuild_product_search_vector(p_product_id UUID)
RETURNS void AS $$
UPDATE products p SET search_vector = 
  setweight(to_tsvector('simple', COALESCE(p.title, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(
    (SELECT string_agg(pa.value, ' ') 
     FROM product_attributes pa 
     JOIN category_attributes ca ON ca.id = pa.attribute_id 
     WHERE pa.product_id = p.id AND ca.is_searchable = true), 
    '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(p.description, '')), 'C') ||
  setweight(to_tsvector('simple', COALESCE(array_to_string(p.tags, ' '), '')), 'D')
WHERE p.id = p_product_id;
$$ LANGUAGE sql;
```

### Triggers on Both Tables

```sql
-- On products INSERT/UPDATE
CREATE TRIGGER trg_products_search_vector
  AFTER INSERT OR UPDATE OF title, description, tags ON products
  FOR EACH ROW EXECUTE FUNCTION rebuild_product_search_vector(NEW.id);

-- On product_attributes INSERT/UPDATE/DELETE  
CREATE TRIGGER trg_product_attributes_search_sync
  AFTER INSERT OR UPDATE OR DELETE ON product_attributes
  FOR EACH ROW EXECUTE FUNCTION rebuild_product_search_vector(
    COALESCE(NEW.product_id, OLD.product_id)
  );
```

### Faceted Search (Category-Scoped)

```sql
CREATE OR REPLACE FUNCTION get_category_facets(
  p_category_id UUID,
  p_base_filters JSONB DEFAULT '{}'
) RETURNS TABLE(aspect_key TEXT, aspect_value TEXT, product_count BIGINT) AS $$
  WITH filtered_products AS (
    SELECT p.id FROM products p
    WHERE p.category_id = p_category_id
      AND p.status = 'active'
      -- Additional base filters applied here
  )
  SELECT ca.attribute_key, pa.value, count(DISTINCT pa.product_id)
  FROM product_attributes pa
  JOIN filtered_products fp ON fp.id = pa.product_id
  JOIN category_attributes ca ON ca.id = pa.attribute_id
  WHERE ca.is_filterable = true
  GROUP BY ca.attribute_key, pa.value
  HAVING count(DISTINCT pa.product_id) > 0
  ORDER BY ca.sort_order, count(DISTINCT pa.product_id) DESC;
$$ LANGUAGE sql STABLE;
```

### Phase 2 Trigger: External Search (Only If Needed)

When to add Typesense/Meilisearch:
- P95 search latency > 200ms at sustained load
- Faceted search on 50K+ products with 10+ simultaneous filter dimensions
- Autocomplete/typo-tolerance quality requirements exceed pg_trgm capabilities

Estimated threshold: ~50K-100K active products with heavy concurrent search.

---

## 6. Migration Plan (Definitive Order)

### Prerequisites (Human Decisions Needed)

- [ ] Confirm 14 verticals (10 primary + 4 secondary)
- [ ] Confirm deferred verticals (Jobs, Real Estate, Services, Wholesale, Software, Grocery)
- [ ] Confirm `is_prime` safe to drop
- [ ] Approve additive schema migrations (listing modes, aspect extensions)
- [ ] Approve category tree swap plan

### Step 1: Additive Schema Changes (DB Migration — needs approval)

```
1a. Add listing_kind, transaction_mode, fulfillment_mode, pricing_mode to products
1b. Add category policy columns to categories
1c. Add 5 new columns to category_attributes
1d. Backfill all 233 products to: item/checkout/shipping/fixed
1e. Drop is_prime column
1f. Regenerate TypeScript types
```

### Step 2: Build New Category Tree (DB Migration — needs approval)

```
2a. Create new 135-category tree (INSERT new rows alongside old)
2b. Build old→new category mapping table
2c. Run dry-run: verify all 87 used leaf categories map to new leaves
2d. Handle 6 uncategorized products (manual assignment or "Other" bucket)
2e. Execute product remap transaction (UPDATE 227 products)
2f. Set is_browseable=false on all old categories
2g. Verify: all 233 products now in new tree
```

### Step 3: Aspects Pruning & Setup

```
3a. Set is_active=false on category_attributes for old categories
3b. Define/activate aspects for new 135 categories (~500-800 rows)
3c. Establish canonical write path (product_attributes → products.attributes sync)
3d. Rebuild search vectors with aspect tokens
```

### Step 4: Frontend Updates (Code changes — no approval needed)

```
4a. Update category picker in sell flow (now 2 levels)
4b. Add aspect form in sell flow (dynamic per category)
4c. Update browse/search navigation to new tree
4d. Add browse chips (promoted aspect filters)
4e. Add faceted filtering UI
4f. Update PDP specs section
```

### Step 5: Cleanup (DB Migration — needs approval)

```
5a. Deprecate is_featured, featured_until, is_limited_stock, stock_quantity
    (remove app reads first, then drop columns)
5b. Soft-delete old categories after soak period
5c. Hard-delete old categories + orphaned attributes after 30 days
5d. Run full gates: typecheck + lint + styles:gate + test:unit
```

---

## 7. What This Architecture Enables

| Capability | How |
|-----------|-----|
| **Faceted filtering** | Browse Phones, filter Brand=Samsung + Storage=256GB |
| **AI-powered listing** | Photo → AI suggests category + fills aspects |
| **Browse chips** | Promoted aspect values as sub-navigation |
| **Sell anything** | listing_kind + modes handle products/services/classifieds |
| **Healthy browse** | Every category has products, no ghost towns |
| **Simple sell flow** | 2 clicks to category + fill relevant aspects |
| **i18n manageable** | 135 category names, not 13,139 |
| **Future verticals** | Jobs/Real Estate/Services as new listing_kinds, not schema hacks |
| **Variants (later)** | is_variation aspect flag + proper variant model |
| **External search (later)** | Clean aspect data → trivial Typesense/Meilisearch pipe |

---

## 8. Open Questions for Human

1. **Grocery & Food:** Include with "shelf-stable only" restriction, or defer entirely?
2. **Automotive vs Tools:** Keep merged (simpler) or split into two verticals (cleaner)?
3. **Bulgarian Traditional:** Tag/aspect on relevant products? Or curated collection page?
4. **GTM wedge categories:** Which 3-5 verticals get marketing priority at launch?
5. **Timeline:** Is this blocking launch, or can v1 ship with current tree?
6. **Variants:** Confirm deferral — is any seller asking for size/color variants?

---

## 9. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Product remap breaks | Low | Only 87 used categories, 233 products, reversible |
| Frontend breaks on new tree | High | Full gate verification + smoke tests |
| Search quality regression | Low | Aspect-enriched vectors improve search |
| Old URL 404s | Medium | Redirect map from old slugs |
| Category attributes incomplete | Low | Easy to iterate post-launch |
| listing_kind conflicts with listing_type | Medium | Different semantic domains; clear naming |

**Key advantage:** This is pre-launch with 233 seed products. This is the cheapest possible time to do this. After launch with real seller data, it becomes 100x harder.

---

## Sources

- Live Supabase DB queries (2026-02-24)
- eBay Taxonomy API + Metadata API documentation
- eBay Inventory Mapping API (2025)
- Codex codebase analysis (runtime dependencies, query patterns)
- CATEGORY-REDESIGN.md v1 + Codex critical review
- Treido PRD, GTM docs, database docs

*Last updated: 2026-02-24*
