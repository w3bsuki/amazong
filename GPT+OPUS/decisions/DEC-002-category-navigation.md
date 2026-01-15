# DEC-002 — Category Navigation & Category Selection (Launch)

**Date**: 2026-01-13  
**Status**: 🟢 AGREED (Human confirmed)

## Context
We have ~13k categories. Deep levels (L4–L5) are mostly empty in products, but L4 contains the majority of item attributes (~5k). Buyers need a clean navigation experience; sellers need deep categories for correct attributes.

## Decision
We separate buyer browsing from seller category selection:

### A) Buyer browse navigation
- Browse shows **L0 → L3 when populated**, hiding empty branches.
- A category is "populated" if it has products in its subtree (or is explicitly curated via `display_order > 0`).
- Default navigation must not lead users through repeated 0-results pages.

### B) Seller category selection
- Seller flow is **nudge-only**: guide users toward deeper categories, but do not hard-block shallow selections for launch.
- Sellers must be able to select **deep categories (L4/L5)** via **search**, even if browse doesn't show those levels.
- The UI must display the **full category path** on selection for clarity.
- Attributes continue to be derived from the selected category (deep selection preserves attribute richness).

### C) Non-destructive
- No destructive deletion of taxonomy for launch; use derived navigation / visibility rules.

### D) Ordering algorithm (curated-first, counts-second)
For any list of sibling categories:
1. **Curated block first**: `display_order > 0` sorted by `display_order ASC`
2. **Then the rest**: `display_order = 0` sorted by `subtree_product_count DESC`, tie-break `name ASC`

Filtering rule:
- Show category if `subtree_product_count > 0` **OR** `display_order > 0`

Empty inventory state:
- When all children have zero products, curated children (`display_order > 0`) still appear
- Show empty-state CTA: "No listings yet in {category} — be the first!"

### E) Popular/Trending modules (separate from taxonomy)
- Cross-level "Popular Categories" is a separate discovery module, not taxonomy navigation
- Taxonomy navigation maintains stable hierarchy; discovery can be dynamic

## Success Criteria
- Browse navigation hides empty subtrees by default.
- Seller picker supports deep selection via search (beyond depth 3).
- Existing listings remain valid; new listings are nudged (not blocked).
- L0/L1 ordering remains stable (curated-first), not constantly shifting by counts.
