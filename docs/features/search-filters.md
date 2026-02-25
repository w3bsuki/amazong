# Feature: Search & Filters

## What it does
Product search with text query, category filters, price range, condition, location, sorting.
Desktop has a sidebar filter panel; mobile uses a bottom sheet drawer for filters.

## Key files
- `app/[locale]/(main)/search/` — Search page route
- `components/shared/search/` — Search input, suggestions, results
- `components/shared/filters/` — Filter components (checkboxes, ranges, rating, etc.)
- `hooks/use-product-search.ts` — Client hook for search state and URL sync
- `app/[locale]/(main)/_components/filters/use-filter-count.ts` — Active filter count for badge display (UI-local)
- `lib/filters/active-filter-count.ts` — Pure helper for active filter counting
- `lib/filters/` — Filter utility functions

## How it works
- Search page is a Server Component that reads URL search params
- Filters sync to URL query parameters (bookmarkable, shareable)
- `use-product-search` hook manages client-side filter state and URL updates
- Product data fetched server-side from Supabase with projected columns
- Results rendered as product card grid (mobile 2-col, desktop 4-5 col)

## Conventions
- Filters always reflect URL state (single source of truth)
- No client-side data fetching for initial results (server-rendered)
- Price range uses `lib/price.ts` for display
- Category tree from `lib/data/categories/` cached fetchers

## Dependencies
- Product card components (`components/shared/product/card/`)
- Category tree data (`lib/data/categories/`)
- URL utilities (`lib/url-utils.ts`)

## Last modified
- 2026-02-16: Documented during docs system creation
