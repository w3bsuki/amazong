# UI/UX Audit Plan

> Generated: 2026-01-05 | Status: ✅ Completed

## Overview

This plan addresses hardcoded values and design system drift found during the UI audit.

---

## Phase 1: Add Missing Design Tokens

**Status:** ✅ Complete

Added semantic tokens to `app/globals.css`:

```css
/* Dropdown/popover widths */
--container-dropdown-sm: 22rem;   /* 352px */
--container-dropdown: 24rem;      /* 384px */
--container-dropdown-lg: 35rem;   /* 560px */

/* Modal widths */
--container-modal-sm: 25rem;      /* 400px */
--container-modal: 35rem;         /* 560px */
--container-modal-lg: 56.25rem;   /* 900px */

/* Scrollable area heights */
--spacing-scroll-sm: 11.25rem;    /* 180px */
--spacing-scroll-md: 18.75rem;    /* 300px */
--spacing-scroll-lg: 25rem;       /* 400px */
--spacing-scroll-xl: 31.25rem;    /* 500px */
```

---

## Phase 2: Fix Hardcoded Dropdown Widths

**Status:** ✅ Complete

| File | Before | After |
|------|--------|-------|
| `components/dropdowns/wishlist-dropdown.tsx` | `w-[380px]` | `w-(--container-dropdown)` |
| `components/dropdowns/account-dropdown.tsx` | `w-[560px]` | `w-(--container-dropdown-lg)` |
| `components/dropdowns/locale-delivery-dropdown.tsx` | `w-[360px]` | `w-(--container-dropdown-sm)` |
| `components/layout/header/cart/cart-dropdown.tsx` | `w-[380px]` | `w-(--container-dropdown)` |

---

## Phase 3: Fix Hardcoded Modal/Dialog Sizes

**Status:** ✅ Complete

| File | Before | After |
|------|--------|-------|
| `components/support/support-chat-widget.tsx` | `w-[400px]` | `w-(--container-modal-sm)` |
| `components/desktop/desktop-filter-modal.tsx` | `max-w-[900px]` | `max-w-(--container-modal-lg)` |
| `app/[locale]/(sell)/_components/ui/category-modal/index.tsx` | `h-[400px]` | `h-(--spacing-scroll-lg)` |

---

## Phase 4: Fix Hardcoded Scroll Heights

**Status:** ✅ Complete

| File | Before | After |
|------|--------|-------|
| `components/dropdowns/wishlist-dropdown.tsx` | `max-h-[300px]` | `max-h-(--spacing-scroll-md)` |
| `components/layout/header/cart/cart-dropdown.tsx` | `max-h-[300px]` | `max-h-(--spacing-scroll-md)` |
| `components/ui/command.tsx` | `max-h-[300px]` | `max-h-(--spacing-scroll-md)` |
| `components/desktop/desktop-search.tsx` | `max-h-[500px]` | `max-h-(--spacing-scroll-xl)` |
| `app/[locale]/(admin)/_components/admin-recent-activity.tsx` | `h-[300px]` (3x) | `h-(--spacing-scroll-md)` |
| `app/[locale]/(business)/_components/business-recent-activity.tsx` | `h-[300px]` (2x) | `h-(--spacing-scroll-md)` |
| `app/[locale]/(sell)/_components/ui/brand-combobox.tsx` | `max-h-[300px]` | `max-h-(--spacing-scroll-md)` |

---

## Phase 5: Replace text-[10px] with text-2xs

**Status:** ✅ Complete

| File | Before | After |
|------|--------|-------|
| `components/shared/filters/mobile-filters.tsx` | `text-[10px]` | `text-2xs` |

---

## Phase 6: Audit rounded-lg+ Usage (Low Priority)

**Status:** ⏸️ Deferred

Many `rounded-lg` usages are in shadcn primitives where they're appropriate. No action needed.

---

## Verification

- ✅ TypeScript compilation passes
- ✅ No runtime errors introduced

---

## Summary

**Files Modified:** 13
**Hardcoded Values Fixed:** 18
**New Design Tokens Added:** 10

All changes use CSS custom property references with Tailwind v4 syntax: `w-(--token-name)`
