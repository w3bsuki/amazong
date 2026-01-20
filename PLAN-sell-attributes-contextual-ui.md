# Plan — Contextual Sell → Product Cards → Product Page (Supabase)

## Goal
Ensure category-specific attributes collected in /sell are validated, persisted correctly in Supabase, and displayed contextually on product cards and product pages.

## Scope
- Sell form attributes (dynamic category fields)
- Supabase persistence (products.attributes + product_attributes)
- Product cards contextual badge
- Product page item specifics + hero specs

## Current Gaps (Observed)
1. Server-side validation does not enforce category-required attributes.
2. Attribute key normalization can produce wrong keys (e.g., fuel_type → fueltype).
3. Make/brand mapping isn’t persisted into attributes JSONB.
4. Product cards compute smart badge but do not render it.
5. Attributes are written to two sources but only one is read.

## Plan (Small, Verifiable Steps)
1. **Fix attribute key normalization + persistence**
   - Ensure keys remain stable (snake_case) when saving to `products.attributes`.
   - Persist `make`/`brand` consistently so hero specs and badges resolve.
   - Verify attribute keys match search filters and hero spec config.

2. **Add server-side required attribute validation**
   - Validate required attributes based on category before insert.
   - Reject incomplete listings with clear errors.
   - Keep `sellFormSchemaV4` and DB attributes in sync.

3. **Render the smart badge in product cards**
   - Add single, compact badge in product card meta.
   - Use existing `buildHeroBadgeText()` output.
   - Ensure no visual noise on mobile (one badge only).

4. **Unify attribute source of truth**
   - Decide: `products.attributes` vs `product_attributes` for reads.
   - Align product cards + product pages to the chosen source.
   - Keep both in sync or remove duplication when safe.

## Success Criteria
- Required attributes are enforced server-side.
- Attributes saved with correct keys and values (e.g., vehicles: make, model, year, fuel_type).
- Product cards show contextual smart badge consistently.
- Product pages show item specifics based on stored attributes.
- No regressions in listing creation or search filtering.
