# Phase 0 — Filter Documentation (UI/UX Refactor)

## 1) Current Filter Parameters

### `/categories/[slug]` Route

**URL Parameters** (searchParams):

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `minPrice` | string | - | Minimum price filter |
| `maxPrice` | string | - | Maximum price filter |
| `minRating` | string | - | Minimum rating (0-5) |
| `subcategory` | string | - | Legacy param (unused) |
| `tag` | string | - | Filter by product tag |
| `deals` | string | - | Not used on categories (search only) |
| `brand` | string | - | Legacy param (use attr_brand) |
| `availability` | string | `"instock"` | Stock filter |
| `sort` | string | `"rating"` | Sort order |
| `page` | string | `"1"` | Pagination |
| `attr_*` | string/string[] | - | Dynamic attribute filters |

**Sort Options**:
- `newest` — Created date descending
- `price-asc` — Price ascending
- `price-desc` — Price descending
- `rating` — Rating descending (default)

**Category Filter via `category_ancestors`**:
- Uses `filter("category_ancestors", "cs", "{uuid}")` (GIN index)
- Filters products in category AND all descendants

---

### `/search` Route

**URL Parameters** (searchParams):

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `q` | string | `""` | Search query (title/description ilike) |
| `category` | string | - | Category slug filter |
| `minPrice` | string | - | Minimum price |
| `maxPrice` | string | - | Maximum price |
| `minRating` | string | - | Minimum rating |
| `subcategory` | string | - | Legacy param |
| `tag` | string | - | Product tag filter |
| `deals` | string | `"true"` | Show only discounted (list_price != null) |
| `verified` | string | `"true"` | Verified business sellers only |
| `brand` | string | - | Legacy param (use attr_brand) |
| `availability` | string | `"instock"` | Stock filter |
| `sort` | string | `"rating"` | Sort order |
| `page` | string | `"1"` | Pagination |
| `attr_*` | string/string[] | - | Dynamic attribute filters |

**Shipping Zone Filter** (cookie-based):
- Cookie: `user-zone` → `BG`, `UK`, `EU`, `US`, `WW`
- `WW` = worldwide = no filter applied
- Applied as OR filter on `ships_to_*` columns

---

### Dynamic Attribute Filters (`attr_*`)

Pattern: `attr_{attributeName}={value}` or `attr_{attributeName}={value1}&attr_{attributeName}={value2}`

**Query translation**:
- Single value: `.contains("attributes", { [attrName]: value })`
- Multiple values: `.in('attributes->>attrName', values)`

---

## 2) Category Root → Priority Filters Mapping

Based on `category_attributes` table (L0 filterable attributes):

| Category Root | Priority Filters (ordered) |
|---------------|---------------------------|
| **Fashion** | Size, Gender, Color, Brand, Material, Condition, Style, Season |
| **Electronics** | Condition, Brand, Storage Capacity, Screen Size, Color, Warranty |
| **Automotive** | Vehicle Make, Condition, Part Type, Parts Brand, Year Range, Fuel Type |
| **Home & Kitchen** | Material, Room, Style, Color, Condition, Brand |
| **Gaming** | Platform, Condition, Brand, Genre, Storage, Console Edition |
| **Beauty** | Gender, Skin Type, Product Form, Brand Tier, Cruelty-Free |
| **Sports** | Sport Type, Gender, Skill Level, Brand, Material |
| **Jewelry & Watches** | Metal Type, Main Stone, Watch Brand, Gender, Style, Condition |
| **Real Estate** | Property Type, Bedrooms, Bathrooms, Condition, Furnished, Listing Type |
| **Books** | Book Condition, Format, Genre, Language, Author |
| **Kids** | Age Range, Gender, Brand, Safety Certified |
| **Pets** | Pet Type, Pet Size, Brand, Life Stage, Food Type |
| **Collectibles** | Condition, Era/Period, Rarity, Authenticity, Has Certificate |
| **Movies & Music** | Format, Genre, Condition, Decade |
| **Services & Events** | Service Type, Service Location, Experience, Rating, Availability |
| **Software** | Platform, License Type, Condition, Subscription Period |
| **Tools & Industrial** | Power Type, Condition, Brand, Warranty |
| **Wholesale** | Minimum Order, Lead Time, Country of Origin, Sample Available |
| **Jobs** | Employment Type, Experience Level, Remote, Location |
| **E-Mobility** | Condition, Brand, Max Speed, Range, Motor Power |
| **Grocery & Food** | Dietary, Organic Certified, Country of Origin, Storage Type |
| **Health & Wellness** | Category, Target Audience, Product Form, Certifications |
| **Hobbies** | Condition, Age Group, Skill Level, Material |
| **Bulgarian Traditional** | Region, Age/Era, Authenticity, Handmade |

### Quick Pills Strategy (per Codex)

**Universal Quick Filters** (attribute openers, not direct filters):
- Size — for fashion, kids, pets
- Color — for fashion, home, electronics
- Brand — for most categories
- Condition — for electronics, automotive, books, collectibles

**Note**: Quick pills open the Filter Hub at the relevant section; they don't apply filters directly.

---

## 3) Count Endpoint Constraints

### Current State

**No dedicated count endpoint exists**. Both `/categories/[slug]` and `/search` do inline counting.

### Categories Page Count Implementation

```typescript
// From: app/[locale]/(main)/categories/[slug]/_lib/search-products.ts

let countQuery = supabase
  .from("products")
  .select("id", { count: "planned", head: true })  // ✅ Uses "planned" (faster estimate)
```

**Key characteristics**:
- Uses `count: "planned"` (approximate but fast)
- Only selects `id` column (minimal overhead)
- `head: true` — no row data returned
- Runs in parallel with main query via `Promise.all`

### Search Page Count Implementation

```typescript
// From: app/[locale]/(main)/search/_lib/search-products.ts

let countQuery = supabase
  .from("products")
  .select("id, profiles!...(is_verified_business,account_type)", { count: "exact", head: true })
```

**Key characteristics**:
- Uses `count: "exact"` (accurate but slower)
- Includes profile join for `verified` filter
- Sequential execution (count awaited before main query)

### Proposed Live Count Endpoint Spec

**Endpoint**: `POST /api/products/count`

**Request Body**:
```json
{
  "categoryId": "uuid" | null,
  "filters": {
    "minPrice": number | null,
    "maxPrice": number | null,
    "minRating": number | null,
    "availability": "instock" | null,
    "attributes": { [key: string]: string | string[] }
  }
}
```

**Response**:
```json
{
  "count": number,
  "cached": boolean,
  "timestamp": string
}
```

**Performance Requirements**:
| Requirement | Target |
|-------------|--------|
| Response time | < 300ms (p95) |
| Debounce (client) | 250-300ms |
| Cache TTL | 30-60s for popular combinations |
| Fallback | Show last known count if > 2s |

**Count Strategy**:
- Use `count: "planned"` for speed
- Select single column only (`id`)
- Apply same filters as main query
- No row data returned
- Consider caching popular filter combinations

### Database Considerations

**Existing indexes on `products` table**:
- `category_ancestors` — GIN index for hierarchical filtering
- `attributes` — JSONB (should have GIN index for contains queries)
- `price`, `rating` — B-tree for range queries

**Recommended for live count**:
- Add covering index for common filter patterns
- Consider materialized view for category counts
- Use connection pooling for burst traffic

---

## 4) Implementation Notes

### Filter Hub State Model (from Codex)

```
pending → [user changes] → pending
pending → [Apply CTA] → applied (URL updated, grid reloads)
pending → [Close/Cancel] → reverted to applied
```

### UI Flow

1. User opens Filter Hub
2. User changes filters → `pending` state updates
3. Live count fetches with debounce (250ms)
4. CTA shows "Show {count} Results"
5. User taps Apply → `applied` state = `pending`, URL updates, grid reloads
6. Filter Hub closes

### No-Reload Principle

- Category circle taps: Update `pending.category`, not URL
- Attribute changes: Update `pending.attributes`, not URL
- Only Apply button triggers URL change and grid refresh

---

## 5) Files to Create/Modify for Count Endpoint

| File | Action |
|------|--------|
| `app/api/products/count/route.ts` | CREATE — Live count endpoint |
| `hooks/use-filter-count.ts` | CREATE — Client hook with debounce |
| `components/shared/filters/filter-hub.tsx` | CREATE — Modal with pending state + count |
| `lib/filters/count-query.ts` | CREATE — Shared count query builder |

---

## Summary

**Phase 0 Complete** ✅

- ✅ Documented current filter params for `/categories` and `/search`
- ✅ Mapped category roots to priority filters
- ✅ Confirmed count endpoint constraints (none exists yet; spec provided)

**Next**: Phase 1 — Add sticky control bar and sort modal
