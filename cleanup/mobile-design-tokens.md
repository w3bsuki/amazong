# Mobile Design Tokens & UI Audit

> Audit Date: December 26, 2025  
> Viewport Tested: 375×812 (iPhone X/12/13/14 standard)

## Executive Summary

This document captures the mobile UI/UX audit findings and establishes design tokens for consistent, accessible mobile interfaces following WCAG 2.1 AA guidelines and modern marketplace app patterns (Amazon, eBay, Target, Vinted).

## ✅ Implemented Changes

### 1. Category Pill Short Names
**Problem:** Long category names like "Електроника", "Автомобили", "Дом и кухня" overflowed in compact mobile category rails.

**Solution:** Added `getCategoryShortName()` function in `hooks/use-categories-cache.ts` that maps full names to abbreviated versions:

| Full Name (BG) | Short Name | Full Name (EN) | Short Name |
|---------------|------------|----------------|------------|
| Електроника | Техника | Electronics | Tech |
| Автомобили | Авто | Automotive | Auto |
| Дом и кухня | Дом | Home & Kitchen | Home |
| Бижута и часовници | Бижута | Jewelry & Watches | Jewelry |
| Филми и музика | Медия | Movies & Music | Media |
| Услуги и събития | Услуги | Services & Events | Services |
| Колекционерски | Колекции | Collectibles | Collect |

**Files Changed:**
- `hooks/use-categories-cache.ts` - Added SHORT_NAMES_BG/EN maps and getCategoryShortName()
- `components/shared/category-rail.tsx` - Uses short names for display, full names for aria-label

### 2. Search Overlay Hides Bottom Navbar
**Problem:** Bottom navbar remained visible when search overlay opened, creating visual clutter and poor UX.

**Solution:** CSS rule in `globals.css` that hides the tab bar when body scroll is locked:

```css
body[style*="position: fixed"] [data-testid="mobile-tab-bar"] {
  display: none !important;
}
```

### 3. Compact Search Bar
**Problem:** Search bar was 44px (h-touch), making header feel heavy at 102px total.

**Solution:** Changed search bar height to 40px (h-10) in `site-header.tsx`:
- Before: Header 102px, Search bar 44px
- After: Header 98px, Search bar 40px

### 4. Reduced Vertical Spacing Throughout
**Problem:** Excessive gaps between sections consumed too much vertical real estate.

**Changes Made:**
- Page layout: `space-y-1` → `space-y-0.5`
- Category rail: `py-0.5` → `py-0`, `px-3` → `px-2.5`, `gap-2` → `gap-1`
- Category label: `mt-1.5` → `mt-1`, `min-h-[22px]` → `min-h-[18px]`
- Sell banner: `px-3 py-0.5` → `px-2.5`
- Tabs bar: `px-3 py-2` → `px-2.5 py-1.5`
- Tab pills: `h-touch (44px)` → `h-8 (32px)`
- Product grid: `px-3 py-1.5` → `px-2.5 py-1`

**Result:**
| Metric | Before | After |
|--------|--------|-------|
| Header | 102px | 98px |
| Category Rail | 84px | 78px |
| Tab Pills | 44px | 32px |
| Tabs Bar Total | 49px | 45px |
| **Total Until Products** | ~340px | ~281px |

---

## Mobile Design Token Reference

### Touch Targets (WCAG 2.1 AA Compliant)

| Token | Size | Usage |
|-------|------|-------|
| `h-8` | 32px | Tab pills (full-width, touch compensated) |
| `h-touch-xs` | 36px | Compact buttons, badges |
| `h-10` | 40px | Search bars, compact inputs |
| `h-touch` | 44px | Standard buttons, links, icons |
| `h-touch-lg` | 48px | Primary CTAs |
| `h-touch-xl` | 56px | Large buttons, bottom sheets |

**Note:** 32px tab pills are acceptable because they are full-width with adequate horizontal padding (12px), providing sufficient touch area.

### Typography Scale (Mobile)

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-[10px]` | 10px | 11px | Category labels |
| `text-xs` | 12px | 16px | Captions, meta, badges, tab pills |
| `text-sm` | 14px | 20px | Body text (default) |
| `text-base` | 16px | 24px | Important text, prices |
| `text-lg` | 18px | 28px | Subheadings |
| `text-xl` | 20px | 28px | Section titles |

### Category Rail Styling

```css
/* Circle size */
.category-circle { @apply size-14; } /* 56px */

/* Label styling */
.category-label {
  @apply text-[10px] font-medium text-center;
  @apply w-14 leading-[1.1] line-clamp-2;
  @apply mt-1 min-h-[18px];
}

/* Gap between items */
.category-rail { @apply gap-1; } /* 4px */

/* Horizontal padding */
.category-rail { @apply px-2.5; } /* 10px */
```

### Header Layout (Mobile)

| Component | Height | Notes |
|-----------|--------|-------|
| Top bar (logo + actions) | ~46px | Contains hamburger, logo, icons |
| Search bar | 40px | h-10, full width |
| Category rail | ~85px | 56px circles + 22px labels + padding |
| **Total header area** | ~98px | Excluding category rail |

### Bottom Tab Bar

| Property | Value | Notes |
|----------|-------|-------|
| Height | 52px | h-[52px] + safe area |
| Icon size | 20px | Phosphor icons |
| Label size | 12px | text-xs |
| Items | 5 | Home, Categories, Sell, Chat, Profile |
| Safe area | pb-safe | iOS bottom safe area inset |

### Z-Index Layers

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base content | 0 | Page content |
| Sticky header | 50 | Site header |
| Bottom tab bar | 50 | Mobile navigation |
| Dropdowns | 50 | Popovers, menus |
| Modal overlays | 100 | Search overlay, dialogs |
| Toasts/Alerts | 100+ | Notifications |

---

## Best Practices Applied

### 1. Touch Target Sizing
- All interactive elements meet 44×44px minimum (via width OR height + padding)
- Full-width buttons (like search) can be shorter since width provides adequate target
- Icons inside buttons have sufficient padding

### 2. Font Sizing for iOS Zoom Prevention
```css
/* Prevents iOS zoom on focus */
input[type="text"], input[type="search"], textarea, select {
  font-size: 16px !important;
}
```

### 3. Scroll Locking
- Search overlay locks body scroll with `position: fixed`
- Preserves scroll position on close
- CSS targets this state to hide conflicting UI elements

### 4. Abbreviated Labels
- Use short labels in space-constrained contexts
- Preserve full labels for:
  - `aria-label` (accessibility)
  - Desktop/expanded views
  - Search/filter interfaces

### 5. Dense Spacing Tokens
```css
--spacing-d1: 2px;
--spacing-d2: 4px;
--spacing-d3: 6px;
--spacing-d4: 8px;
--spacing-d5: 10px;
--spacing-d6: 12px;
--spacing-d8: 16px;
```

---

## Measurements (Post-Audit)

| Element | Before | After | Change |
|---------|--------|-------|--------|
| Search bar height | 44px | 40px | -4px |
| Header total | 102px | 98px | -4px |
| Tab bar height | 53px | 53px | unchanged |
| Category circle | 56px | 56px | unchanged |
| Category label | 10px | 10px | unchanged |

---

## Future Considerations

1. **Category Rail Scroll Indicators** - Add fade gradients or peek indicators
2. **Haptic Feedback** - Add vibration on button press (navigator.vibrate)
3. **Pull-to-Refresh** - Native-feeling refresh gesture
4. **Gesture Navigation** - Swipe to go back on product pages
5. **Bottom Sheet Patterns** - For filters, category selection

---

*This document serves as the source of truth for mobile design decisions. Update when making significant mobile UI changes.*
