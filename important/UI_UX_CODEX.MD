# UI/UX Codex (Mobile-first) — Treido

Purpose
- Define production UI/UX patterns for mobile browsing, filtering, and search.
- Evolve the current UI without redesigning it. Preserve speed, density, and the existing visual language.

Non-negotiable rails
- No redesigns, no new architecture layers, no gradients.
- Cards remain flat: border + `rounded-md` max, no heavy shadows.
- Avoid arbitrary Tailwind values unless absolutely required.
- Use tokens from `app/globals.css`.
- All user-facing strings go through next-intl.

Core philosophy
“Refinement must be a focused, interrupt-free task. Never reload the product grid until the user confirms their selection.”

## 1) Global visual rules (apply everywhere)

Spacing and layout
- Mobile page inset: 16px. Desktop page inset: 20–24px.
- Use dense spacing: mobile `gap-2`, desktop `gap-3`.
- Touch targets use the compact scale: 24px min (`--spacing-touch-xs`), 28px compact (`--spacing-touch-sm`), 32px standard (`--spacing-touch`), 36px CTA (`--spacing-touch-lg`).

Typography
- Price and section headers: `font-semibold` or `font-bold`.
- Buttons: `font-medium`.
- Body and secondary text: `font-normal`.
- Avoid pure black. Use `foreground` and `muted-foreground` tokens.

Radii
- Cards: `rounded-md`.
- Pills and CTAs: `rounded-full`.
- Sheets: `rounded-t-3xl` (no arbitrary radius).

Color
- Use semantic tokens. Do not hardcode new colors.
- Primary only for primary actions and selected states.

## 2) Mobile browsing structure (final)

Page chrome
- Header stays light and functional (products lead).
- Search remains prominent and always reachable.
- Bottom navbar stays; modals overlay it.

Sticky browse header (PLP and search results)
- Keep browsing chrome to at most 2 stacked rows below the search bar.
- Row 1: category navigation (homepage tabs OR breadcrumb) + circles (L1/L2 drill-down).
- Row 2: quick filter row (eBay-style) with “All filters” first, then Sort, then up to 3 filter pills.
- Avoid multiple divider lines between each sub-row; use one border under the whole sticky region.

“View all” usage
- Homepage: “View all” is navigation (go to category page) and must be instant (prefetch + client transitions).
- Category/search pages: “View all” is not filtering; filtering is always via quick pills/modals.

## 3) Filters (final)

Two-tier filter UX (best-of-both-worlds)
1) Single-section modals (default)
- Triggered by quick filter pills.
- Each modal is one task: Price OR Brand OR Condition OR Category OR Size/Color.
- Centered `Dialog` style (clean, eBay-like), with sticky CTA.

2) All filters hub (escape hatch)
- Triggered by “All filters / Всички филтри” (first pill).
- Full `Drawer` bottom sheet with drill-down list of all sections.

State model (required)
- `pending` selections change inside modals.
- `applied` selections are what the grid uses.
- Only Apply updates the grid and URL.

Live result count (required)
- Sticky CTA at the bottom.
- Label format: “Show 1,024 Results”.
- Updates on every pending change (debounced 250–300ms).
- If count is 0: disable CTA and show “No items found”.

Selector types
- Price: dual-range slider + min/max inputs.
- Color: swatches (circles), not text-only.
- Size: tile grid (4 columns on mobile).
- Brand/Condition: list with search input if options > 8.

Accessibility
- Modals use `role="dialog"` and `aria-modal="true"`.
- Focus trap, Escape closes.
- Live count updates use `aria-live="polite"`.

## 4) Category navigation (final)

Keep circles for L0/L1 identity
- Circles are a visual identity element. Keep them.
- Do not reload the grid on tap.

Depth handling
- L0: homepage tabs (fast).
- L1/L2: circles (fast, client-state drill-down).
- L3+: stays out of the main browsing surface; put inside the Category modal (single-section) and/or All filters hub.

Quick pills
- Never use category pills that cause reloads.
- Quick pills are refinement openers (modals), not navigation.
- “All filters / Всички филтри” is always first.

## 5) Product cards (polish, not redesign)

Image
- Enforce consistent aspect ratio (prefer `aspect-square`).
- Use `object-cover`.

Typography
- Price is primary (`text-base`, `font-bold`).
- Title is secondary (`text-sm`, `line-clamp-2`).
- Secondary info uses `text-xs` and `muted-foreground`.

Badges and actions
- Badges top-left, smaller, subtle background.
- Wishlist icon top-right, no heavy circle background.
- Subtle border to define card boundary.

## 6) Header and brand treatment

Goal
- Keep layout/flow; reduce weight so products lead.

Guidance
- Prefer light background with `text-foreground` icons/text.
- Search input uses `bg-muted` to stand out.
- Brand color is accents, not large blocks.

## 7) Performance rule (this is UX)

Browsing must feel instant
- Do not route-navigate on every category tap.
- Prefer client-state drill-down + lightweight API fetches for product grids.
- Only navigate on explicit actions: “View all” (homepage) and Apply (filters).

## 8) Release discipline

- 1–3 files per change (max 5 for one behavior).
- Typecheck + E2E smoke for every non-trivial change.
- No secrets in logs.
