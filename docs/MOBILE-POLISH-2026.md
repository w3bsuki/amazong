# Mobile Styling Polish — Full Audit & Fixes

> Codex: Read `AGENTS.md` first, then `docs/DESIGN.md`. Execute sections top-to-bottom.
> After each section, run `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate`.
> Only use semantic tokens. No hex, no palette classes, no arbitrary values, no gradients.

---

## Standards Reference (don't change these — this is what "correct" looks like)

| Standard | Token/Value | Used by |
|----------|-------------|---------|
| Page edge inset (mobile) | `px-inset` = 8px | Feeds, grids, SmartRail, drawers |
| Content inset (reading surfaces) | `px-4` = 16px | PDP content, auth forms, sell success — intentionally wider |
| Product grid gap | `gap-(--product-grid-gap)` = 10px | ProductGrid, home feed |
| Section gap (between sections) | `gap-3` or `space-y-3` = 12px | Default rhythm between cards/sections |
| Header height (all mobile headers) | `h-(--control-primary)` = 48px | All 3 header variants |
| Header horizontal padding | `px-2` = 8px | All 3 header variants |
| SmartRail → content gap | `pt-2` = 8px | Space below sticky SmartRail |
| Card border radius | `rounded-xl` = 12px | Product cards, info cards, list cards |
| Sheet/drawer top radius | `rounded-t-2xl` = 16px | Bottom sheets, tab bar |
| Pill/chip shape | `rounded-full` | Pills, chips, search bars |
| CTA button height | `h-(--control-primary)` (use token) | Primary action buttons |
| Tap target minimum | `min-h-(--control-default)` = 44px | All tappable elements |
| Dense controls | `min-h-(--control-compact)` = 36px | Pills inside rails only |
| Drawer option gap | `space-y-1.5` = 6px | List-style options in drawers |
| Drawer header padding | `px-inset pt-4 pb-3` | All drawer headers (via DrawerShell) |

---

## Section 1 — Headers (consistency pass)

**Goal:** All 3 mobile headers should have the same height, same horizontal padding, and consistent bottom border behavior.

### 1a. Homepage header
**File:** `components/layout/header/mobile/homepage-header.tsx`

- The bar element currently uses `h-(--control-default)` (44px) and `px-0` (0px).
- Change the bar height to `h-(--control-primary)` (48px).
- Change the bar padding to `px-2` (8px) to match contextual + product headers.
- The search pill and context chip are `min-h-(--control-compact)` (36px) — this is OK for embedded controls within the 48px header bar. Don't change these.
- Add `border-b border-border-subtle` to the header root (or its inner bar) so it matches contextual/product headers. Skip if there's already a border.

### 1b. Product header
**File:** `components/layout/header/mobile/product-header.tsx`

- The bar currently uses `px-1` (4px). Change to `px-2` (8px) to match contextual header.
- Height is already `h-(--control-primary)` — no change needed.
- Already has `border-b` — no change needed.

### 1c. Contextual header
**File:** `components/layout/header/mobile/contextual-header.tsx`

- Already correct: `h-(--control-primary)`, `px-2`, `border-b`. No changes needed.

---

## Section 2 — SmartRail → Content Gap

**Goal:** Add 8px breathing room between the sticky SmartRail bottom border and the first content below it.

### 2a. Homepage feed
**File:** `app/[locale]/(main)/_components/mobile-home/mobile-home-feed.tsx`

- The feed section currently has `pt-1` (4px). Change to `pt-2` (8px).

### 2b. Category feed
**File:** `app/[locale]/(main)/categories/[slug]/_components/mobile/product-feed.tsx`

- Same pattern — find the `pt-1` and change to `pt-2`.

---

## Section 3 — Loading/Error/Empty State Alignment

**Goal:** All inline states (loading banners, error banners, empty states) within feeds should use `px-inset` for edge padding, not `px-3` or `px-6`.

### 3a. Home feed inline states
**File:** `app/[locale]/(main)/_components/mobile-home/mobile-home-feed.tsx`

- Loading indicator wrapper: change `px-3` to `px-inset`.
- Error state wrapper: change `px-3` to `px-inset`.
- Empty state container: change `px-6` to `px-inset`. The `py-14` is fine for vertical centering.

### 3b. Checkout empty cart
**File:** `app/[locale]/(checkout)/_components/checkout-page-layout.tsx` (or wherever the empty cart state lives)

- If it uses `px-3`, change to `px-inset`.

---

## Section 4 — Product Card Spacing Tightening

**Goal:** Product card content (below the image) should have consistent, breathing spacing.

### 4a. Mobile product card
**File:** `components/shared/product/card/mobile.tsx`

- CardContent currently has `gap-1 p-2 pt-2`. The `pt-2` is redundant since `p-2` already sets it.
  - Change to `gap-1.5 p-2` — slightly more breathing room (6px) between content rows.
- Seller row: the seller name uses `text-xs` while surrounding context uses `text-2xs`. Change seller name to `text-2xs` for consistency within the card meta.

### 4b. Category icon grid radius
**File:** `components/mobile/category-nav/category-icon-grid.tsx`

- Category cards use `rounded-2xl` (16px). Change to `rounded-xl` (12px) to match product card radius.
- Category icon tile uses `rounded-2xl` for the icon container — change to `rounded-xl`.

---

## Section 5 — Drawer Consistency

**Goal:** All drawers using DrawerShell should have consistent option list spacing.

### 5a. Home browse options sheet
**Status:** Removed (unused component)

### 5b. Home city picker sheet
**File:** `app/[locale]/(main)/_components/mobile/home-city-picker-sheet.tsx`

- Options list uses `space-y-1` (4px). Change to `space-y-1.5` (6px) to match browse options.

### 5c. Search overlay
**File:** `app/[locale]/_components/search/mobile-search-overlay.tsx`

- Clear button uses `size-touch-xs` (32px). This is below the 44px minimum. Change to `size-(--control-compact)` (36px) — acceptable for a secondary inline action within a 44px input row.
- Chip groups use `gap-2` (8px). This is fine for wrapped chip layout — no change.

---

## Section 6 — PDP Bottom Bar Alignment

**Goal:** PDP bottom bar should use `px-inset` like checkout footer.

### 6a. Product bottom bar
**File:** `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-bottom-bar.tsx`

- Inner container currently uses `px-3` (12px). Change to `px-inset` (8px) to match the feed/checkout pattern.
- The `py-2.5` (10px) is fine — the vertical breathing room looks good for a CTA bar.

---

## Section 7 — Sell Flow Token Usage

**Goal:** Replace hardcoded values with design tokens.

### 7a. Sell success screen
**File:** Locate the sell success/processing screen component (inside `app/[locale]/(sell)/_components/`).

- Buttons using `h-12` → change to `h-(--control-primary)`.
- Product preview card using `rounded-md` (6px) → change to `rounded-xl` (12px) to match card system.
- Grid buttons using `gap-4` → keep (success screen has more breathing room, intentional).

---

## Section 8 — Chat Tab Bar Height Fix

**Goal:** Chat mobile tab bar should match `--spacing-bottom-nav` (64px).

### 8a. Chat bottom tabs
**File:** `app/[locale]/(chat)/_components/messages-page-client.tsx` (the bottom tab row)

- Tab row currently uses `h-14` (56px). Change to `h-(--spacing-bottom-nav)` (64px) so it matches the main tab bar token.

### 8b. Chat safe area consistency
**File:** `app/[locale]/(chat)/_components/messages-page-client.tsx` (the conversation list header)

- Header uses `pt-safe-max-sm` (12px min). The chat conversation header uses `pt-safe-max-xs` (8px min). These should match — change the conversation list header to also use `pt-safe-max-xs` for consistency within the chat flow. OR change both to `pt-safe-max-sm`. Pick one and apply to both headers in the chat flow.

---

## Section 9 — Account Layout Token Cleanup

**Goal:** Account pages shouldn't use home-specific tokens.

### 9a. Account layout
**File:** `app/[locale]/(account)/_components/account-layout-content.tsx`

- Currently uses `px-(--spacing-home-inset)` (12px) and `gap-(--spacing-home-section-gap)` (16px).
- Change `px-(--spacing-home-inset)` to `px-3` (12px) — same visual result but doesn't reference home tokens.
- Change `gap-(--spacing-home-section-gap)` to `gap-4` (16px) — same visual result, generic token.
- These are cosmetic renames, not visual changes. The actual pixel values stay the same.

---

## Section 10 — Drilldown Rail Typography

**Goal:** Minor typography consistency between rails.

### 10a. Category drilldown rail
**File:** `components/mobile/category-nav/category-drilldown-rail.tsx`

- Tab text uses `text-sm` (14px) while SmartRail pills use `text-compact` (13px). Change to `text-compact` for consistency.

---

## Section 11 — Dead Code Cleanup

### 11a. CategoryOptionRail component
**File:** `components/mobile/category-nav/category-drilldown-rail.tsx`

- The `CategoryOptionRail` component is dead code — 0 render usages anywhere in the codebase.
- Only the `SectionPathSegment` type is still imported (by `mobile-category-browser-contextual.tsx` or similar).
- Extract the `SectionPathSegment` type into the file that imports it (or into a shared types file in the same directory).
- Then delete the `CategoryOptionRail` component export from this file.
- If the file becomes empty/trivial after deletion, delete the entire file.

---

## Verification (run after ALL sections)

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

All must pass. Zero regressions.

---

*Created: 2026-02-21*
