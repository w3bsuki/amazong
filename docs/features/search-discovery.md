# Search & Discovery

## Goal

Help buyers find products through a home feed, hierarchical category browsing (L0→L3), full-text search with filters and sorting, daily deals, and saved searches. Discovery is the primary buyer acquisition and engagement surface — it must be fast, relevant, and mobile-friendly.

## Current Status

- Requirements: 6/7 complete (R7) — see REQUIREMENTS.md §R7
- Production: 🟡 Partial — saved searches client-only (localStorage)

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| R7.1 | Home feed | ✅ |
| R7.2 | Category pages | ✅ |
| R7.3 | Subcategory navigation | ✅ |
| R7.4 | Search page | ✅ |
| R7.5 | Search filters (price, condition, location) | ✅ |
| R7.6 | Search sorting (relevance, price, date) | ✅ |
| R7.7 | Saved searches | 🟡 In progress (client-only, localStorage) |

## Implementation Notes

### Routes

| Path | Group | Auth | Purpose |
|------|-------|------|---------|
| `/` | (main) | public | Homepage with feed |
| `/search` | (main) | public | Search results with filters |
| `/categories` | (main) | public | Category listing |
| `/categories/:slug` | (main) | public | Category page |
| `/categories/:slug/:sub` | (main) | public | Subcategory page |
| `/todays-deals` | (main) | public | Daily deals |
| `/sellers` | (main) | public | Sellers directory |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products/search` | GET | Full-text product search |
| `/api/products/feed` | GET | Homepage product feed |
| `/api/products/newest` | GET | Newest products |
| `/api/products/count` | GET | Total product count |
| `/api/products/category/:slug` | GET | Products by category |
| `/api/categories` | GET | All categories |
| `/api/categories/attributes` | GET | Category attributes for filters |
| `/api/categories/counts` | GET | Product counts per category |
| `/api/categories/products` | GET | Category products |
| `/api/categories/sell-tree` | GET | Category tree for listing creation |
| `/api/categories/:slug/attributes` | GET | Specific category attributes |
| `/api/categories/:slug/children` | GET | Child categories |
| `/api/categories/:slug/context` | GET | Breadcrumbs / category path |

### DB Tables

| Table | Purpose |
|-------|---------|
| `products` | Listings with `search_vector` (tsvector) for full-text search, JSONB attributes |
| `categories` | Hierarchical L0→L3 categories with parent_id, slug, metadata |

### Key DB Functions

| Function | Purpose |
|----------|---------|
| `handle_new_product_search()` | Updates full-text search vector on product insert/update |
| `get_category_path()` | Returns breadcrumb path for a category |
| `get_category_descendants()` | Returns all descendant categories (for inclusive filtering) |
| `get_hero_specs()` | Returns hero specifications for category pages |
| `get_badge_specs()` | Returns badge specifications for search result display |

### Search Architecture

- **Full-text search**: PostgreSQL `tsvector` / `tsquery` with `search_vector` column on `products`
- **Filters**: price range, condition, location, category attributes (dynamic per category)
- **Sorting**: relevance (ts_rank), price (asc/desc), date (newest), boost priority
- **Boosted listings**: promoted products receive higher visibility in search results (see [monetization.md](./monetization.md))

### Category Hierarchy

```
L0: Electronics, Fashion, Home & Garden, Sports, ...
  └─ L1: Phones, Computers, Cameras, ...
       └─ L2: iPhone, Samsung, Pixel, ...
            └─ L3: iPhone 15, iPhone 14, ... (optional)
```

- Categories stored in `categories` table with self-referential `parent_id`
- Each category can define dynamic attributes via `category_attributes` (e.g., "Screen Size" for phones)
- Category pages show: subcategory chips, filter bar, product grid

### Special Patterns

- **Product quick-view modal**: search results use `@modal` parallel route for in-place PDP preview
- **Intercepting route**: `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx`
- **Infinite scroll / pagination**: feed and search results use cursor-based pagination
- **URL-as-state**: search filters, sort, and page are encoded in URL query params for shareability and back-button support
- **Unified Home feed controls (mobile)**: home uses a compact discovery deck (`Промотирани/Всички`) with a horizontal quick-chip rail (`sort` + `nearby`) and an inline discovery `see all` action; location/category deep filtering stays on Search/Categories
  - Source: `app/[locale]/(main)/_components/mobile-home.tsx`
  - Data source: `/api/products/newest` (`type`, `sort`, optional `nearby/city`)

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| R7.7: Saved searches | 🟡 Client-only | localStorage implementation; server-backed saved searches with email alerts deferred to V1.1 |
| Category → PDP modal | ⬜ Missing | `@modal` slot exists for search but not category pages |
| AI search | ⬜ Deferred | V2 — AI-powered semantic search (`/api/assistant/chat` endpoint exists) |
| Recommendations | ⬜ Deferred | V2 — personalized product recommendations |
| Seller preview modal | ⬜ Missing | No intercepting route for seller quick-view from search/category |

## Cross-References

- [DATABASE.md](../DATABASE.md) — Products search_vector, categories hierarchy, category_attributes
- [ROUTES.md](../ROUTES.md) — (main) route group, search and category routes
- [API.md](../API.md) — Product search and category endpoints
- [app-feel.md](./app-feel.md) — Product card patterns, filter UX, modal routing
- [monetization.md](./monetization.md) — Boost visibility in search results

---

*Last updated: 2026-02-08*
