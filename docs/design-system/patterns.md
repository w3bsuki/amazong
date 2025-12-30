# Patterns

Reusable UI patterns for the marketplace. Keep mobile-first; scale up density for desktop.

## Page Shell
- Sticky top search + category chips (`h-7` pills) on mobile; add tabs for sections.
- Side padding 12–16px on mobile, 16–24px on desktop.
- Optional bottom action bar on mobile for primary CTA.

## Navigation & Filters
- Mobile: filters/sort in `Sheet` bottom drawer; quick pills above results; one primary confirm button.
- Desktop: left rail filters (checkboxes, ranges), top horizontal quick filters, persistent sort dropdown.

## Product Grid
- Mobile (default): 2-up `gap-1.5 px-2`; image full width, text stack with title (2 lines), price, shipping badge, rating count.
- Mobile (balanced): 2-up `gap-2 px-3` for premium/featured sections.
- Tablet: 3–4 cols `gap-3`; desktop: 4–6 cols `gap-3` plus left rail.
- Card: `border`, `rounded` (4px), no shadow; avoid outer `p-2` on dense cards (use a small content pad under image instead).

## List Row (mobile speed)
- Layout: image 96–112px left, text stack (title, price, meta) right, optional pill/action on far right.
- Row height target: 112–128px; use `gap-2`, `p-3` max.

## Detail Page
- Gallery: swipeable; keep images edge-to-edge on mobile.
- Info blocks: border-separated sections with `p-3` mobile / `p-4` desktop, `gap-2` inner spacing.
- Sticky add-to-cart bar: `h-9` primary CTA + secondary ghost.

## Forms
- Stack labels over inputs on mobile; inline labels allowed on desktop settings.
- Inputs `h-8` with **16px font on mobile** (prevents iOS zoom); helper text `text-xs text-muted-foreground` with 4px top margin.
- Validation inline; avoid blocking modals. Errors `text-error text-xs`.

## Action Bars
- One primary CTA; one secondary ghost/outline. Collapse tertiary actions into `DropdownMenu`/`Sheet`.
- Keep heights 32–40px (dense marketplace scale); avoid oversized 44px-by-default buttons.

## States
- Loading: static gray blocks or bordered placeholders (no shimmer).
- Empty: icon + concise copy + primary CTA; keep padding `p-6` mobile / `p-8` desktop.
- Error: inline banner with `text-error` and retry button; avoid modal for recoverable issues.

## Tables/Dashboards
- Body `text-base` allowed on desktop; row heights 48–56px for data tables only.
- Use `border-b border-border` rows; hover `bg-accent/30` optional.

## Ads/Promos
- Use bordered slots, `p-3` mobile / `p-4` desktop, `rounded-md`, no shadow; limit to 1 per view on mobile.
