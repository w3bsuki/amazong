# [6] Marketplace / Browsing

> Homepage · Search · Categories · Filters · Deals · Sellers · Legal · Support

## What Must Work

- Homepage with product feeds (newest, deals, by category)
- Full-text search with filters (price, category, condition, rating, color, size)
- Category browsing with subcategories
- Filter system — desktop sidebar + mobile drawer
- Sort options (price, newest, relevance, rating)
- Product grid — responsive, adapts to viewport
- Today's deals page
- Sellers directory
- Members page
- About page
- Legal pages (privacy, terms, cookies, returns)
- Support pages (FAQ, contact, feedback, customer-service, security)

**Key principle:** Desktop/mobile should be handled by responsive CSS, not separate component trees.

## Files to Audit

```
app/[locale]/(main)/                    → All pages + _components/ + _lib/ + _providers/

components/shared/filters/
components/shared/search/
components/shared/product/card/
components/shared/product/quick-view/
components/shared/product/
components/grid/
components/desktop/

hooks/use-product-search.ts
hooks/use-home-discovery-feed.ts
hooks/use-instant-category-browse.ts
hooks/use-filter-count.ts
hooks/use-category-attributes.ts
hooks/use-category-counts.ts
hooks/use-view-mode.ts

lib/data/products.ts
lib/data/categories.ts
lib/data/category-attributes.ts
lib/filters/
lib/category-tree.ts
lib/category-display.ts
lib/home-pools.ts
lib/home-browse-href.ts

app/api/products/
app/api/categories/
```

## Instructions

1. Read every file listed above
2. Audit for: desktop/mobile duplication, over-componentization, scattered filter logic, unused hooks, dead code
3. Refactor — same features, less code, responsive instead of separate trees
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, Supabase full-text search config, API response shapes used by external consumers.
