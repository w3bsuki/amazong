# UI/UX Master Plan (Mobile-first browsing)

Status
- Single source of truth. Run this plan only.
- Historical v1 notes: `important/TODO-ARCHIVE.md`.

Scope
- Mobile browsing UX for `/` (homepage), `/categories` (index + slug), and `/search`.
- No filter UI on PDP.
- Desktop parity only where it reuses the same filter model (pending vs applied).

North-star UX (customer-first)
- One sticky “browse header” region: search → (homepage tabs OR breadcrumb) → circles → one quick filter row.
- No more than 2 stacked navigation/filter rows below the search bar.
- eBay-style: quick pills open single-filter modals; “All filters” opens the full hub.
- Never reload the product grid until Apply.

Rules (non-negotiable)
- No redesigns and no new architecture layers.
- No gradients. Cards are flat with subtle borders only.
- Tailwind v4 + shadcn theming: use tokens from `app/globals.css`.
- Avoid arbitrary values unless absolutely required.
- 1-3 files per change (max 5 only if one behavior).
- All UI strings via next-intl.

References
- `important/UI_UX_CODEX.MD`
- `important/PHASE0-FILTER-DOCUMENTATION.md`

Final decisions (lock these)
- “All filters / Всички филтри” is the first pill in the quick filter row.
- Quick filter row is not duplicated with legacy toolbars (no `MobileFilters` + `SortSelect` alongside it).
- On category slug pages, L3 pills are removed from the main surface; L2+/L3+ live inside the Category modal.
- `/categories/[slug]` browsing is client-fast (no route navigation on every category tap).

## Phase 1 - Make current UI coherent (stop duplication)
- [x] Remove legacy mobile filter/sort toolbar where `QuickFilterRow` exists.
  Files: `components/mobile/mobile-home-tabs.tsx`
- [x] Reorder `QuickFilterRow`: “All filters” first, then Sort, then top 3 pills.
  Files: `components/mobile/category-nav/quick-filter-row.tsx`
- [x] Replace any remaining mobile `SortSelect` usage in browsing surfaces with `SortModal`.
  Files: `components/mobile/mobile-home-tabs.tsx`
- [x] Replace `/search` mobile `ControlBar` with `QuickFilterRow` (same pattern as categories).
  Files: `app/[locale]/(main)/search/page.tsx`, `components/mobile/category-nav/quick-filter-row.tsx`

## Phase 2 - Modal polish to eBay-grade
- [x] Filter drawers (hub + sort): `rounded-t-3xl`, visible handle, consistent header spacing, safe-area padding.
  Files: `components/shared/filters/filter-hub.tsx`, `components/shared/filters/sort-modal.tsx`
- [x] Single-section modals: better inset, max height, row spacing, sticky CTA, clean close.
  Files: `components/shared/filters/filter-modal.tsx`, `components/shared/filters/filter-list.tsx`
- [x] List rows: `h-14`, `text-base` label, clear separators, consistent selected state.
  Files: `components/shared/filters/filter-modal.tsx`, `components/shared/filters/filter-hub.tsx`

## Phase 3 - Category browsing performance (stop the waiting)
- [x] Stop category route navigation on every tap; keep drill-down client-side and only navigate on explicit “View all” / Apply.
  Files: `app/[locale]/(main)/categories/[slug]/page.tsx`
- [x] Reduce stacked controls on category slug pages: breadcrumb/back + circles + quick filter row only.
  Files: `components/mobile/mobile-home-tabs.tsx`, `app/[locale]/(main)/categories/[slug]/page.tsx`

## Phase 4 - Price UX (must be good)
- [ ] Use the dual-range `PriceSlider` (min/max) in hub + single-section modals.
  Files: `components/shared/filters/price-slider.tsx`, `components/shared/filters/filter-hub.tsx`, `components/shared/filters/filter-modal.tsx`

## Phase 5 - Cleanup and consistency
- [ ] Remove or deprecate `components/shared/filters/mobile-filters.tsx` if unused.
- [ ] Standardize touch targets to `min-h-touch` / `min-w-touch`.
- [ ] Verify semantic tokens across category/search browsing components.

QA gates (every non-trivial change)
- [ ] Visual QA at 375px and 414px; verify no reloads until Apply.
- [ ] Run: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] Run: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Definition of done
- Browsing feels instant like homepage (no route-wait on taps).
- Only one quick filter row exists; “All filters” is first.
- Modals feel clean (eBay-like): readable, not cramped, consistent.
- `/categories` and `/search` share the same mobile UX patterns.
