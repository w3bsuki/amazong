# Feature: Mobile UI Standardization

## What it does
Defines the standard patterns for mobile overlays, navigation rails, page chrome, and touch targets across all routes. Ensures every mobile surface in Treido feels like the same app.

## Problem Statement

The mobile UI has grown organically and now has visible inconsistencies:

1. **Two overlay technologies** used interchangeably for bottom overlays
2. **Different navigation patterns** (underline tabs vs filled pills) for the same concept
3. **Varying page chrome density** (1-4 sticky layers before content)
4. **No standard "page announcement"** pattern (breadcrumb vs sr-only heading vs full heading)
5. **DrawerShell adoption is partial** — some drawers use it, others build custom headers

These inconsistencies make pages feel like separate apps stitched together.

---

## Current State — Overlay Technology

Two completely different overlay systems are used for mobile bottom overlays:

| Technology | Primitive | Library | Behavior |
|---|---|---|---|
| **Drawer** | `components/ui/drawer.tsx` | Vaul 1.1.2 | Drag-to-dismiss, spring physics, drag handle, `z-60` |
| **Sheet** | `components/ui/sheet.tsx` | Radix Dialog | CSS slide animation, X close button, no drag, no handle, `z-50` |

### What uses what

**Vaul Drawer** (~20 instances):
- `components/shared/drawer-shell.tsx` — standard wrapper (used by Cart, Wishlist, Messages, Account, Auth drawers)
- `components/shared/filters/filter-hub.tsx` — filter drawer
- `components/shared/filters/sort-modal.tsx` — sort picker
- `app/[locale]/(main)/_components/mobile/home-city-picker-sheet.tsx` — city picker (confusingly named "sheet")
- `app/[locale]/(main)/_components/mobile/home-browse-options-sheet.tsx` — browse options (also confusingly named)
- `app/[locale]/_components/category-browse-drawer.tsx` — full-screen category browser
- `app/[locale]/(sell)/_components/ui/select-drawer.tsx` — sell-flow select
- `app/[locale]/(sell)/_components/ui/category-selector.tsx` — sell-flow category picker
- `app/[locale]/(sell)/_components/ui/brand-combobox.tsx` — sell-flow brand
- `app/[locale]/(sell)/_components/fields/condition-field.tsx` — sell-flow condition
- `app/[locale]/(checkout)/_components/address-section.tsx` — checkout address
- `app/[locale]/(account)/account/_components/account-addresses-grid.tsx` — account addresses
- `app/[locale]/(account)/account/wishlist/_components/account-wishlist-grid.tsx` — wishlist management
- `app/[locale]/(account)/account/orders/_components/account-orders-grid-mobile.tsx` — order details
- `app/[locale]/[username]/[productSlug]/_components/mobile/seller-profile-drawer.tsx` — seller profile
- `app/[locale]/(main)/search/_components/mobile-seller-filter-drawers.tsx` — seller filter/sort
- `components/layout/sidebar/sidebar-menu.tsx` — hamburger sidebar menu
- `components/mobile/drawers/product-quick-view-drawer.tsx` — product quick view

**Radix Sheet** (~5 instances of bottom overlay on mobile):
- `app/[locale]/(main)/_components/mobile-home/mobile-home-category-picker.tsx` — **"Още" category picker** ← the outlier
- `app/[locale]/(account)/account/_components/account-tab-bar.tsx` — account tab overlay
- `components/layout/sidebar/sidebar.tsx` — desktop sidebar (legitimate Sheet use for side panel)
- `app/[locale]/(account)/account/orders/_components/account-orders-grid-desktop.tsx` — desktop order detail (legitimate)
- `app/[locale]/(main)/(support)/customer-service/_components/support-chat-widget-view.tsx` — support chat

### Observable differences

| Aspect | Vaul Drawer | Radix Sheet |
|---|---|---|
| Drag handle | Yes (shown by default for bottom) | No |
| Dismiss gesture | Drag down | Tap overlay or X button |
| Animation | Spring physics (native feel) | CSS `slide-in-from-bottom` (faster, snappier) |
| z-index | 60 | 50 |
| Background | `bg-surface-elevated` | `bg-background` |
| Close button | Per-implementation (DrawerShell has X in header) | Built-in X button (top-right, absolute positioned) |

---

## Current State — Navigation Patterns

### Home page
- **Primary rail**: Full-width tab buttons with underline active indicator (`getMobilePrimaryTabClass`)
- **Secondary rail**: Rounded pills with filled active state (`getMobileQuickPillClass`)
- Touch targets: Primary 44px, Secondary 36px

### Search page
- **Mode switch**: Segmented control — 2-col grid rounded container (`getMobileSegmentedTriggerClass`)
- **Category rail**: Rounded pill links (`getMobileQuickPillClass` via `CategoryPillRail`)
- **Filter/sort bar**: Action chips with 50/50 split (`MOBILE_ACTION_CHIP_CLASS`)
- Touch targets: Mode switch 44px, Category pills 36px, Filter/sort 44px

### Key issue
Home uses **underline tabs** for categories. Search uses **filled pills** for the same concept. Both are correct patterns individually, but the inconsistency makes them feel disconnected.

---

## Current State — Page Chrome Stack

| Page | Layers before content | Total vertical overhead |
|---|---|---|
| Home | Header → Primary rail → Secondary rail | ~136px |
| Search | Header → Breadcrumb+H1 → Mode switch → Category rail → Filter/sort bar → Results count | ~340px+ |
| Categories | Header → Page content | ~56px |
| Account | Header → Tab bar | ~100px |

Search has **6 vertical layers** before the first product appears. On a 375px iPhone SE viewport (812px tall minus 52px tab bar = 760px usable), ~340px of chrome means products get less than half the viewport.

---

## Current State — DrawerShell Adoption

`DrawerShell` is a standardized wrapper (`components/shared/drawer-shell.tsx`) that provides consistent:
- Drag handle (from Drawer)
- Header with icon + title + suffix + close button
- Description (sr-only by default)
- Customizable via props

**Using DrawerShell** (consistent): Cart, Wishlist, Messages, Account, Auth  
**NOT using DrawerShell** (custom headers): FilterHub, SortModal, all sell-flow drawers, city picker, browse options, checkout address, category browse, seller profile, account addresses/orders/wishlist grid drawers, seller filter drawers, product quick view

---

## Control Recipes (Shared Tokens)

`components/mobile/chrome/mobile-control-recipes.ts` defines 5 reusable patterns:

| Recipe | Touch Target | Visual | Used by |
|---|---|---|---|
| `getMobilePrimaryTabClass` | 44px (`--control-default`) | Underline active indicator | Home primary rail only |
| `getMobileQuickPillClass` | 36px (`--control-compact`) | Rounded-full, filled active | Home secondary rail, search category rail, filter bar location chip |
| `getMobileSegmentedTriggerClass` | 44px (`--control-default`) | Rounded-full inside container | Search mode switch, auth drawer tabs |
| `MOBILE_ACTION_CHIP_CLASS` | 36px (`--control-compact`) | Rounded-full, border, outlined | Filter/sort buttons, category picker actions |
| `MOBILE_SEGMENTED_CONTAINER_CLASS` | — | 2-col grid rounded container | Search mode switch, auth drawer |

---

## Target State

### Overlays: One technology for bottom overlays
- **All mobile bottom overlays → Vaul Drawer** (drag-to-dismiss, handle, spring physics)
- **Radix Sheet → side panels only** (desktop sidebar, desktop right panels)
- Every bottom drawer uses `DrawerShell` or follows its pattern (handle + header + close)
- Consistent `z-60`, `bg-surface-elevated`, `rounded-t-2xl`

### Navigation: Unified category pattern
- **One pattern for "pick a category"**: filled pills (`getMobileQuickPillClass`) everywhere
- Primary tabs with underline reserved for **top-level page sections** (not categories)
- `CategoryPillRail` becomes the single category navigation component

### Page chrome: Maximum 2 sticky layers
- After header, maximum **2 sticky navigation layers** before scrollable content
- Search page: merge mode switch + category rail into one combined rail
- Results count becomes inline (not a separate sticky layer)

### DrawerShell: Universal adoption
- Every bottom drawer uses `DrawerShell` or a DrawerShell-derived pattern
- Sell-flow, filters, sort — all migrate to DrawerShell

---

## Key files

### Overlay primitives
- `components/ui/drawer.tsx` — Vaul-based drawer (keep for bottom overlays)
- `components/ui/sheet.tsx` — Radix-based sheet (keep for side panels only)
- `components/shared/drawer-shell.tsx` — Standard drawer wrapper

### Control recipes
- `components/mobile/chrome/mobile-control-recipes.ts` — Shared touch target patterns

### Navigation components
- `components/mobile/category-nav/category-pill-rail.tsx` — Reusable category pill rail
- `components/mobile/category-nav/filter-sort-bar.tsx` — Filter/sort action bar

### Home page
- `app/[locale]/(main)/_components/mobile-home.tsx` — Home orchestrator
- `app/[locale]/(main)/_components/mobile-home/mobile-home-rails.tsx` — Home navigation rails
- `app/[locale]/(main)/_components/mobile-home/mobile-home-category-picker.tsx` — **Uses Sheet (migrate to Drawer)**

### Search page
- `app/[locale]/(main)/search/_components/search-page-layout.tsx` — Search layout
- `app/[locale]/(main)/search/_components/mobile-browse-mode-switch.tsx` — Mode segmented switch
- `app/[locale]/(main)/search/_components/search-header.tsx` — Breadcrumb + H1

### Drawers (to standardize)
- `components/mobile/drawers/cart-drawer.tsx` — ✅ Uses DrawerShell
- `components/mobile/drawers/messages-drawer.tsx` — ✅ Uses DrawerShell
- `components/mobile/drawers/account-drawer.tsx` — ✅ Uses DrawerShell
- `components/mobile/drawers/auth-drawer.tsx` — ✅ Uses DrawerShell
- `components/shared/wishlist/wishlist-drawer.tsx` — ✅ Uses DrawerShell
- `components/shared/filters/filter-hub.tsx` — ❌ Custom header
- `components/shared/filters/sort-modal.tsx` — ❌ Custom header
- `components/mobile/drawers/product-quick-view-drawer.tsx` — ❌ Custom header

## Dependencies
- Vaul 1.1.2 (`components/ui/drawer.tsx`)
- Radix Dialog (`components/ui/sheet.tsx`)
- `mobile-control-recipes.ts` — shared touch target class generators
- `CategoryPillRail` — shared navigation component
- `DrawerShell` — shared drawer wrapper

## Last modified
- 2026-02-18: Initial audit and documentation
