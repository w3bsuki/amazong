# Mobile UI/UX Comprehensive Audit Plan

> **Audit Date:** November 30, 2025  
> **Target Devices:** iPhone 14 Pro (390×844), Samsung Galaxy S23 (360×780), iPad Mini (744×1133)  
> **Stack:** Next.js 15 + shadcn/ui + Tailwind CSS v4  
> **Philosophy:** Stop over-engineering. Follow best practices. Mobile-first.

---

## Table of Contents

1. [Audit Overview](#audit-overview)
2. [Phase 1: Discovery & Documentation](#phase-1-discovery--documentation)
3. [Phase 2: Core Navigation & Header](#phase-2-core-navigation--header)
4. [Phase 3: Search Experience](#phase-3-search-experience)
5. [Phase 4: Product Pages & Cards](#phase-4-product-pages--cards)
6. [Phase 5: Cart & Checkout Flow](#phase-5-cart--checkout-flow)
7. [Phase 6: Category & Listing Pages](#phase-6-category--listing-pages)
8. [Phase 7: Forms & User Input](#phase-7-forms--user-input)
9. [Phase 8: Performance & Loading States](#phase-8-performance--loading-states)
10. [Phase 9: Accessibility (a11y)](#phase-9-accessibility-a11y)
11. [Phase 10: Production Deployment Testing](#phase-10-production-deployment-testing)
12. [Completed Fixes Log](#completed-fixes-log)

---

## Audit Overview

### Priority Legend
| Icon | Priority | Description |
|------|----------|-------------|
| 🔴 | Critical | Blocking issues, errors, broken functionality |
| 🟠 | High | Major UX problems affecting usability |
| 🟡 | Medium | Noticeable issues, polish needed |
| 🟢 | Low | Minor improvements, nice-to-have |

### Progress Summary
| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Discovery | ✅ Completed | 8/8 |
| Phase 2: Navigation | 🔄 In Progress | 3/10 |
| Phase 3: Search | ⬜ Not Started | 0/8 |
| Phase 4: Product Pages | ⬜ Not Started | 0/12 |
| Phase 5: Cart & Checkout | ⬜ Not Started | 0/10 |
| Phase 6: Category Pages | ⬜ Not Started | 0/8 |
| Phase 7: Forms | ⬜ Not Started | 0/6 |
| Phase 8: Performance | ⬜ Not Started | 0/8 |
| Phase 9: Accessibility | 🔄 In Progress | 1/10 |
| Phase 10: Production | ⬜ Not Started | 0/6 |

---

## Phase 1: Discovery & Documentation

### Objective
Establish baseline understanding of current mobile implementation and document all components.

### Checklist

- [x] 🔴 Set up Playwright testing environment with mobile viewport
- [x] 🟠 Capture initial page snapshots (homepage, categories, product, cart)
- [x] 🟠 Document all mobile-specific components in codebase
- [x] 🟠 Map component dependencies and shared state
- [x] 🟡 Review existing mobile CSS in `globals.css`
- [x] 🟡 Audit Tailwind breakpoint usage across components
- [x] 🟡 Document shadcn/ui components used (Sheet, Drawer, Dialog, Command)
- [x] 🟢 Create component hierarchy diagram

### Complete Mobile Component Inventory

| Component | Type | Location | Dependencies | Status |
|-----------|------|----------|--------------|--------|
| `SidebarMenu` | Sheet (left) | `components/sidebar-menu.tsx` | Sheet, ScrollArea, useLocale, useRouter | ✅ Good - Has SheetDescription |
| `MobileSearchV2` | CommandDialog | `components/mobile-search-v2.tsx` | CommandDialog, Command, useRouter | ⚠️ Needs mobile optimization |
| `MobileCartDropdown` | Drawer (bottom) | `components/mobile-cart-dropdown.tsx` | Drawer, useCart, Image | ✅ Good - Has mounted state |
| `MobileMenuSheet` | Drawer (bottom) | `components/mobile-menu-sheet.tsx` | Drawer, useLocale, forwardRef | ✅ Good - Has DrawerDescription |
| `MobileNavigation` | Wrapper | `components/mobile-navigation.tsx` | MobileTabBar, MobileMenuSheet | ✅ Good |
| `MobileTabBar` | Fixed bottom nav | `components/mobile-tab-bar.tsx` | useCart, Link, usePathname | ✅ Good - 44px targets |
| `MobileFilters` | Custom bottom sheet | `components/mobile-filters.tsx` | useRouter, Checkbox, useSearchParams | ✅ Good |
| `SiteHeader` | Header container | `components/site-header.tsx` | All mobile components | ✅ Good |

### Shared State & Context
| Context/Hook | Location | Used By |
|--------------|----------|---------|
| `CartContext` | `lib/cart-context.tsx` | `MobileCartDropdown`, `MobileTabBar`, `CartDropdown` |
| `useIsMobile` | `hooks/use-mobile.ts` | `Sonner`, `Sidebar` (not used in mobile components) |
| `useLocale` | `next-intl` | All mobile components |
| `useRouter` | `i18n/routing` | `SidebarMenu`, `MobileSearchV2`, `MobileFilters` |
| `useTranslations` | `next-intl` | `SidebarMenu`, `MobileCartDropdown`, `MobileFilters` |

### Mobile CSS in globals.css - COMPLETE AUDIT

#### ✅ Safe Area Insets (iOS notch support)
```css
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.pt-safe { padding-top: env(safe-area-inset-top); }
.pl-safe { padding-left: env(safe-area-inset-left); }
.pr-safe { padding-right: env(safe-area-inset-right); }
```

#### ✅ Touch Target Utilities (WCAG 2.1 AA)
```css
.touch-target { min-width: 44px; min-height: 44px; }
.touch-target-sm { min-width: 40px; min-height: 40px; }
.touch-target-lg { min-width: 48px; min-height: 48px; }
.touch-action-manipulation { touch-action: manipulation; }
.tap-transparent { -webkit-tap-highlight-color: transparent; }
```

#### ✅ Sheet/Modal Animations
```css
@keyframes slideInFromLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes slideOutToLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }

.sheet-content[data-side="left"][data-state="open"] {
  animation: slideInFromLeft 150ms ease-out both;
}
.sheet-content[data-side="left"][data-state="closed"] {
  animation: slideOutToLeft 100ms ease-in both;
}
```

#### ✅ Mobile Navigation
```css
.mobile-tab-bar {
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 50;
}
.has-mobile-tab-bar {
  padding-bottom: calc(64px + env(safe-area-inset-bottom));
}
```

#### ✅ Scroll Utilities
```css
.snap-x-mandatory { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.hero-carousel { touch-action: pan-x pinch-zoom; overscroll-behavior: contain; }
```

### Tailwind Breakpoint Usage Analysis

| Component | Breakpoints Used | Notes |
|-----------|------------------|-------|
| `SiteHeader` | `md:hidden`, `hidden md:block` | Mobile: hamburger+search+cart; Desktop: full nav |
| `SidebarMenu` | `sm:max-w-[380px]` | Full width on mobile, capped on tablet |
| `MobileSearchV2` | `md:hidden` on trigger | Only shows on mobile |
| `MobileCartDropdown` | None (mobile-only) | Used exclusively in mobile header |
| `MobileTabBar` | `md:hidden` | Hidden on desktop |
| `MobileFilters` | `lg:hidden` | Mobile/tablet only |

### shadcn/ui Component Configuration

#### Sheet (Radix Dialog-based)
- **File:** `components/ui/sheet.tsx`
- **Animations:** CSS class-based via `globals.css`
- **Props:** `side` (left|right|top|bottom), uses `data-side` attribute
- **a11y:** Requires `SheetTitle` + `SheetDescription` ✅

#### Drawer (Vaul-based)
- **File:** `components/ui/drawer.tsx`
- **Direction:** Via `data-vaul-drawer-direction` attribute
- **Features:** Built-in handle, max-height 80vh
- **a11y:** Requires `DrawerTitle` + `DrawerDescription` ✅

#### Dialog (Radix Dialog)
- **File:** `components/ui/dialog.tsx`
- **Position:** Centered modal with backdrop
- **Features:** `showCloseButton` prop, zoom animations
- **a11y:** Requires `DialogTitle` + `DialogDescription` ✅

#### Command (cmdk-based)
- **File:** `components/ui/command.tsx`
- **Used in:** `MobileSearchV2` via `CommandDialog`
- **Issue:** ⚠️ CommandDialog uses centered Dialog - not mobile-optimized
- **Recommendation:** Consider using Drawer for mobile search

### Component Hierarchy Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SiteHeader                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Mobile Header (md:hidden)                        │  │
│  │  ┌──────────┬────────────┬────────────┬───────────────────┐  │  │
│  │  │Sidebar   │ Logo/AMZN  │   Flex-1   │ Search+Sell+Cart  │  │  │
│  │  │Menu ☰    │            │   (gap)    │                   │  │  │
│  │  └────┬─────┴────────────┴────────────┴─────┬───────┬─────┘  │  │
│  │       │                                      │       │        │  │
│  │       ▼                                      ▼       ▼        │  │
│  │  ┌─────────────────┐  ┌────────────────┐  ┌──────────────┐   │  │
│  │  │  SidebarMenu    │  │ MobileSearchV2 │  │MobileCart    │   │  │
│  │  │  (Sheet/Left)   │  │ (CommandDialog)│  │Dropdown      │   │  │
│  │  │                 │  │                │  │(Drawer/Btm)  │   │  │
│  │  │ Uses:           │  │ Uses:          │  │              │   │  │
│  │  │ - SheetContent  │  │ - CommandInput │  │ Uses:        │   │  │
│  │  │ - ScrollArea    │  │ - CommandList  │  │ - DrawerCont │   │  │
│  │  │ - Categories API│  │ - Products API │  │ - CartContext│   │  │
│  │  └─────────────────┘  └────────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│            MobileNavigation (Fixed Bottom - md:hidden)              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      MobileTabBar                               │ │
│  │  ┌──────────┬──────────┬──────────┬──────────┐                 │ │
│  │  │  Home 🏠  │  Menu 📋  │  Cart 🛒 │ Account 👤│                 │ │
│  │  │  (Link)  │ (action) │  (Link)  │  (Link)  │                 │ │
│  │  └──────────┴────┬─────┴──────────┴──────────┘                 │ │
│  │                  │                                              │ │
│  │                  ▼                                              │ │
│  │           ┌──────────────────┐                                  │ │
│  │           │ MobileMenuSheet  │                                  │ │
│  │           │ (Drawer/Bottom)  │                                  │ │
│  │           │                  │                                  │ │
│  │           │ Uses:            │                                  │ │
│  │           │ - forwardRef     │                                  │ │
│  │           │ - Categories API │                                  │ │
│  │           │ - Language Switch│                                  │ │
│  │           └──────────────────┘                                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│            MobileFilters (Category/Search Pages)                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Filter Button → Opens Custom Bottom Sheet                     │ │
│  │                                                                │ │
│  │  Sheet Contains:                                               │ │
│  │  - Category filter (accordion)                                 │ │
│  │  - Price ranges (accordion)                                    │ │
│  │  - Rating filter (accordion)                                   │ │
│  │  - Stock availability (accordion)                              │ │
│  │                                                                │ │
│  │  Uses:                                                         │ │
│  │  - useSearchParams                                             │ │
│  │  - Custom CSS animations (not shadcn Drawer)                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 1 Findings Summary

#### ✅ What's Working Well
1. **Hydration handling** - `MobileCartDropdown` and `CartDropdown` use `mounted` state pattern
2. **a11y compliance** - All Sheet/Drawer components have proper Title and Description
3. **Touch targets** - Most components use `min-h-11` (44px) for touch areas
4. **Safe area insets** - Bottom bar uses `pb-safe` for notched phones
5. **CSS animations** - Sheet animations defined in globals.css with proper easing

#### ⚠️ Issues Identified
1. **Search modal** - Uses CommandDialog (centered) instead of Drawer (bottom)
2. **Sheet animation timing** - 150ms might be too fast, user reports "laggy"
3. **Missing `will-change`** - Sheet animations don't use GPU acceleration hints
4. **MobileFilters** - Uses custom CSS sheet, not shadcn Drawer (inconsistent)

#### 🎯 Priority Actions for Phase 2
1. Optimize sheet animation (add `will-change`, adjust timing to 250ms)
2. Refactor `MobileSearchV2` to use Drawer instead of CommandDialog
3. Consider unifying `MobileFilters` to use shadcn Drawer

---

## Phase 2: Core Navigation & Header

### Objective
Ensure hamburger menu, header actions, and navigation work flawlessly on mobile.

### Checklist

- [x] 🔴 **Hamburger menu opens/closes without errors**
  - Status: ✅ Fixed - Added SheetDescription for a11y
- [x] 🔴 **No hydration errors on cart badge**
  - Status: ✅ Fixed - Added mounted state pattern
- [x] 🟠 Hamburger menu slide animation is smooth (not laggy)
  - Status: ✅ Fixed - Using Tailwind v4 animate-in/out utilities (300ms open, 200ms close)
  - See Fix #3 in Completed Fixes Log
- [x] 🟠 Menu backdrop closes menu on tap
  - Status: ✅ Built-in Radix Dialog behavior - clicking overlay closes sheet
- [x] 🟠 Menu items have proper touch targets (min 44×44px)
  - Status: ✅ All items use `min-h-11` (44px), with `touch-action-manipulation` and `tap-transparent`
- [x] 🟡 Language switcher accessible in mobile menu
  - Status: ✅ Flag dropdown in header next to profile
- [x] 🟡 User account section prominent and accessible
  - Status: ✅ Profile area at top with login/account link
- [x] 🟡 Category list scrollable without body scroll lock issues
  - Status: ✅ Using shadcn ScrollArea component
- [x] 🟡 Subcategory expansion works correctly (accordion behavior)
  - Status: ✅ Using expandedCategories state with CaretDown rotation
- [ ] 🟢 Add haptic feedback on menu interactions (if supported)
  - Note: Nice-to-have, requires Navigator.vibrate() API

### Files to Audit
```
components/sidebar-menu.tsx
components/site-header.tsx
components/mobile-menu-sheet.tsx
components/ui/sheet.tsx
app/globals.css (sheet animations)
```

---

## Phase 3: Search Experience

### Objective
Mobile search should be fast, intuitive, and optimized for thumb navigation.

### Checklist

- [x] 🔴 Search modal opens without console errors
  - Status: ✅ Fixed - Drawer has proper DrawerTitle/DrawerDescription for a11y
- [x] 🔴 Search input receives focus immediately on open
  - Status: ✅ Command component auto-focuses input
- [x] 🟠 **Search modal mobile optimization**
  - Status: ✅ FIXED - Refactored from CommandDialog (centered modal) to Drawer (bottom sheet)
  - Now uses Vaul Drawer with 85dvh max-height
  - See Fix #4 in Completed Fixes Log
- [x] 🟠 Keyboard doesn't overlap search results
  - Status: ✅ Drawer naturally pushes content up on iOS, 85dvh prevents overlap
- [x] 🟠 Recent searches accessible and clearable  
  - Status: ✅ Clear button has 44px min touch target
- [x] 🟡 Live search results update smoothly
  - Status: ✅ 300ms debounce on search, products load with proper loading state
- [x] 🟡 Category filter pills scrollable horizontally
  - Status: ✅ Categories in scrollable list (6 shown)
- [ ] 🟢 Voice search button (future enhancement)
  - Note: Nice-to-have, requires SpeechRecognition API

### Files Modified
```
components/mobile-search-v2.tsx - Refactored to use Drawer instead of CommandDialog
```

---

## Phase 4: Product Pages & Cards

### Objective
Product display should be optimized for mobile viewing and purchasing.

### Checklist

- [ ] 🔴 Product images load correctly (no 404s)
- [ ] 🔴 Add to cart button always visible/sticky
- [ ] 🟠 Image gallery swipeable on mobile
- [ ] 🟠 Zoom functionality works on touch
- [ ] 🟠 Price and discount prominently displayed
- [ ] 🟠 Variant selector (size, color) touch-friendly
- [ ] 🟡 Product description collapsible for long content
- [ ] 🟡 Reviews section lazy loaded
- [ ] 🟡 Related products horizontally scrollable
- [ ] 🟡 Share button functional
- [ ] 🟢 Save for later / wishlist accessible
- [ ] 🟢 Recently viewed products carousel

### Files to Audit
```
components/product-card.tsx
components/product-actions.tsx
components/product-form.tsx
components/product-variant-selector.tsx
components/sticky-add-to-cart.tsx
components/add-to-cart.tsx
```

---

## Phase 5: Cart & Checkout Flow

### Objective
Seamless cart management and checkout experience on mobile.

### Checklist

- [ ] 🔴 Cart drawer opens/closes smoothly
- [ ] 🔴 Cart items editable (quantity +/-)
- [ ] 🔴 Remove item works correctly
- [ ] 🟠 Cart total updates in real-time
- [ ] 🟠 Checkout button sticky at bottom
- [ ] 🟠 Empty cart state has clear CTA
- [ ] 🟡 Promo code input accessible
- [ ] 🟡 Shipping estimate visible
- [ ] 🟢 Save cart for later
- [ ] 🟢 Guest checkout option prominent

### Files to Audit
```
components/mobile-cart-dropdown.tsx
components/add-to-cart.tsx
lib/cart-context.tsx
app/[locale]/cart/page.tsx
app/[locale]/checkout/page.tsx
```

---

## Phase 6: Category & Listing Pages

### Objective
Category browsing should be efficient with proper filtering and sorting.

### Checklist

- [ ] 🔴 **Category pages load without 500 errors**
  - User reported: `/categories/baby-kids` 500 error on Vercel
  - Works locally - Vercel environment issue
- [ ] 🔴 Product grid responsive (2 cols mobile, 3 cols tablet)
- [ ] 🟠 Filter drawer works on mobile
- [ ] 🟠 Sort dropdown accessible
- [ ] 🟡 Infinite scroll or pagination working
- [ ] 🟡 Category header/banner mobile optimized
- [ ] 🟡 Subcategory tabs scrollable
- [ ] 🟢 Quick filters (chips) at top

### Files to Audit
```
components/mobile-filters.tsx
components/desktop-filters.tsx
components/filter-chips.tsx
components/filter-sort-bar.tsx
components/subcategory-tabs.tsx
app/[locale]/categories/[slug]/page.tsx
```

---

## Phase 7: Forms & User Input

### Objective
All forms should be mobile-friendly with proper input types and validation.

### Checklist

- [ ] 🔴 Form inputs have correct `type` attributes (email, tel, etc.)
- [ ] 🟠 Error messages visible without scrolling
- [ ] 🟠 Labels always visible (not placeholder-only)
- [ ] 🟡 Input focus states clear and visible
- [ ] 🟡 Autocomplete attributes set correctly
- [ ] 🟢 Progressive form validation

### Files to Audit
```
components/product-form.tsx
components/review-form.tsx
components/image-upload.tsx
app/[locale]/auth/*/page.tsx
```

---

## Phase 8: Performance & Loading States

### Objective
Fast loading, smooth transitions, no jank.

### Checklist

- [ ] 🔴 No layout shifts (CLS) on mobile
- [ ] 🔴 Images optimized with Next.js Image component
- [ ] 🟠 Skeleton loaders for async content
- [ ] 🟠 Lazy loading for below-fold content
- [ ] 🟡 Touch response < 100ms
- [ ] 🟡 Animations run at 60fps
- [ ] 🟡 Bundle size optimized for mobile
- [ ] 🟢 Service worker for offline support

### Metrics to Measure
- First Contentful Paint (FCP): Target < 1.8s
- Largest Contentful Paint (LCP): Target < 2.5s
- Cumulative Layout Shift (CLS): Target < 0.1
- Time to Interactive (TTI): Target < 3.8s

---

## Phase 9: Accessibility (a11y)

### Objective
WCAG 2.1 AA compliance for mobile users.

### Checklist

- [x] 🔴 **All dialogs/modals have proper aria-describedby**
  - Status: ✅ Fixed in sidebar-menu.tsx
- [ ] 🔴 Focus trap working in modals
- [ ] 🔴 Screen reader announces dynamic content
- [ ] 🟠 Touch targets minimum 44×44px
- [ ] 🟠 Color contrast meets AA standards
- [ ] 🟠 Focus visible on all interactive elements
- [ ] 🟡 Skip links functional
- [ ] 🟡 Headings in proper hierarchy
- [ ] 🟢 Reduced motion preferences respected
- [ ] 🟢 High contrast mode support

### Files to Audit
```
components/ui/sheet.tsx
components/ui/drawer.tsx
components/ui/dialog.tsx
components/ui/button.tsx
app/globals.css
```

---

## Phase 10: Production Deployment Testing

### Objective
Verify all fixes work in Vercel production environment.

### Checklist

- [ ] 🔴 **Investigate `/categories/baby-kids` 500 error on Vercel**
  - Check Vercel function logs
  - Compare environment variables (local vs production)
  - Test database connectivity
- [ ] 🔴 All pages load without errors on production
- [ ] 🟠 Test on real devices (iOS Safari, Chrome Android)
- [ ] 🟠 Verify SSL and HTTPS redirect
- [ ] 🟡 Check CDN caching for static assets
- [ ] 🟢 Monitor Core Web Vitals in production

---

## Completed Fixes Log

### Fix #1: Cart Hydration Mismatch ✅
**Date:** November 30, 2025  
**Priority:** 🔴 Critical  
**Files Modified:**
- `components/header-dropdowns.tsx`
- `components/mobile-cart-dropdown.tsx`

**Problem:** Cart badge count differed between server (0) and client (localStorage value), causing React hydration errors.

**Solution:**
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
const displayItems = mounted ? totalItems : 0;

{mounted && displayItems > 0 && <span>{displayItems}</span>}
```

---

### Fix #2: Missing SheetDescription (a11y) ✅
**Date:** November 30, 2025  
**Priority:** 🔴 Critical  
**Files Modified:**
- `components/sidebar-menu.tsx`

**Problem:** Radix UI Sheet missing required Description component, causing console warnings.

**Solution:**
```tsx
<SheetDescription className="sr-only">
  Navigation menu with categories and account settings
</SheetDescription>
```

---

### Fix #3: Sheet Animation - Align with shadcn/ui Best Practices ✅
**Date:** November 30, 2025  
**Priority:** 🟠 High  
**Files Modified:**
- `components/ui/sheet.tsx`
- `app/globals.css` (removed custom CSS)

**Problem:** User reported hamburger menu animation was laggy. Initial fix added GPU acceleration hints which was over-engineering.

**Final Solution:** Aligned Sheet component with shadcn/ui Drawer pattern using Tailwind v4's built-in animation utilities:

```tsx
// components/ui/sheet.tsx - Now uses Tailwind animate-in/out like Drawer
<SheetPrimitive.Content
  className={cn(
    'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:duration-200 data-[state=open]:duration-300',
    side === 'left' && 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
    // ... other sides
  )}
/>
```

**Why This Is Better:**
1. ✅ Uses same pattern as other shadcn/ui components (Drawer, Dialog, DropdownMenu)
2. ✅ No custom CSS needed - Tailwind handles everything
3. ✅ No over-engineered GPU hints - browsers optimize `transform` automatically
4. ✅ Consistent with shadcn/ui maintainability
5. ✅ 300ms open / 200ms close timing feels natural

---

### Fix #4: Mobile Search - Drawer Instead of Dialog ✅
**Date:** November 30, 2025  
**Priority:** 🟠 High  
**Files Modified:**
- `components/mobile-search-v2.tsx`

**Problem:** User reported "Search modal from the header was not mobile optimized". CommandDialog rendered as a centered modal which doesn't feel native on mobile.

**Solution:** Refactored to use Vaul Drawer (bottom sheet) with mobile-optimized touch targets:

```tsx
// mobile-search-v2.tsx - Now uses Drawer (bottom sheet)
<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent className="max-h-[85dvh] flex flex-col">
    <DrawerTitle className="sr-only">Search</DrawerTitle>
    <DrawerDescription className="sr-only">Search products...</DrawerDescription>
    
    <Command shouldFilter={false} className="flex flex-col h-full">
      <CommandInput className="h-12 text-base" /> {/* Larger touch target */}
      <CommandList className="flex-1 overflow-y-auto pb-safe">
        <CommandItem className="min-h-[48px] py-3 touch-action-manipulation">
          {/* Items with proper touch targets */}
        </CommandItem>
      </CommandList>
    </Command>
  </DrawerContent>
</Drawer>
```

**Key Improvements:**
1. ✅ Bottom sheet pattern feels native on mobile (swipe down to close)
2. ✅ 85dvh max-height prevents keyboard overlap
3. ✅ All items have 48px min-height (> 44px WCAG requirement)
4. ✅ Larger search input (h-12) for easier typing
5. ✅ pb-safe ensures content doesn't hide behind notch
6. ✅ touch-action-manipulation on all interactive items
7. ✅ Proper a11y with sr-only DrawerTitle/DrawerDescription

---

## Next Actions

1. **Immediate (Today):**
   - [x] ~~Test hamburger menu animation speed~~ ✅ Fixed
   - [x] ~~Refactor search modal for mobile~~ ✅ Fixed
   - [ ] Investigate Vercel 500 error on `/categories/baby-kids`
   - [ ] Audit search modal mobile optimization

2. **This Week:**
   - [ ] Complete Phase 3 (Search Experience)
   - [ ] Complete Phase 4 (Product Pages)
   - [ ] Run Lighthouse mobile audit

3. **Before Launch:**
   - [ ] Complete all phases
   - [ ] Test on 5+ real mobile devices
   - [ ] Performance budget established and met

---

*Last Updated: November 30, 2025*

## 🟠 HIGH PRIORITY ISSUES

### 3. Sheet Animation Performance (Hamburger Menu "Laggy") ✅ FIXED

**User Report:** "Hamburger menu didn't slide out, it just appeared with laggy animation"

**Location:** `components/ui/sheet.tsx`

**Status:** ✅ FIXED on November 30, 2025

**Solution Applied:** Aligned with shadcn/ui best practices using Tailwind v4's built-in animation utilities:

```tsx
// components/ui/sheet.tsx - Uses Tailwind animate-in/out like Drawer
<SheetPrimitive.Content
  className={cn(
    'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:duration-200 data-[state=open]:duration-300',
    side === 'left' && 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
    // ... other sides
  )}
/>
```

**Why This Is Better Than Custom CSS:**
- ✅ Same pattern as other shadcn/ui components (Drawer, Dialog, DropdownMenu)
- ✅ No custom CSS animations needed
- ✅ No over-engineered GPU hints - browsers optimize `transform` automatically
- ✅ Maintainable and consistent with library patterns

---

### 4. Search Modal Not Mobile-Optimized

**User Report:** "Search modal from the header was also not mobile optimized"

**Location:** `components/mobile-search-v2.tsx`

**Current State:**  
Uses `CommandDialog` which renders as a centered modal. On mobile, this should be:
- Full-screen or near-full-screen sheet from top
- Larger touch targets for search results
- Better keyboard handling (auto-focus, dismiss on search)

**Solution:**

```tsx
// mobile-search-v2.tsx - Use Drawer instead of Dialog on mobile
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";

export function MobileSearchV2() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search">
          <MagnifyingGlass className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90dvh]">
        <Command className="h-full">
          <CommandInput 
            placeholder="Search products..."
            className="h-14 text-base" // Larger touch target
            autoFocus
          />
          <CommandList className="max-h-[calc(90dvh-4rem)]">
            {/* Search results with larger touch targets */}
            <CommandItem className="min-h-[56px] py-3">
              {/* ... */}
            </CommandItem>
          </CommandList>
        </Command>
      </DrawerContent>
    </Drawer>
  );
}
```

**Alternative Quick Fix:**
Keep CommandDialog but optimize styling:
```tsx
// Make dialog taller on mobile
<CommandDialog>
  <div className="h-[80dvh] flex flex-col">
    <CommandInput className="h-14" />
    <CommandList className="flex-1 overflow-auto">
      {/* ... */}
    </CommandList>
  </div>
</CommandDialog>
```

**Priority:** 🟠 High  
**Effort:** 2-3 hours  
**Files:** `components/mobile-search-v2.tsx`

---

### 5. Vercel Production 500 Error on /categories/baby-kids

**User Report:** "/categories/baby-kids works [locally], but on Vercel version on my phone it gave me internal error"

**Location:** Server-side / API routes

**Investigation Needed:**
1. Check Vercel deployment logs for the specific error
2. Possible causes:
   - Database connection timeout in production
   - Missing environment variables
   - Edge function cold start issues
   - Category API returning error

**Diagnostic Steps:**
```bash
# Check Vercel logs
vercel logs --prod

# Or in Vercel dashboard:
# Deployments → Latest → Function Logs
```

**Solution Checklist:**
- [ ] Verify all environment variables are set in Vercel
- [ ] Check Supabase connection pool settings
- [ ] Add error boundaries to category pages
- [ ] Implement retry logic for database calls
- [ ] Consider ISR/SSG for category pages

```tsx
// app/[locale]/categories/[slug]/page.tsx
export const dynamic = 'force-static'; // or
export const revalidate = 3600; // 1 hour cache

export async function generateStaticParams() {
  // Pre-render main category pages
  return [
    { slug: 'baby-kids' },
    { slug: 'electronics' },
    // ...
  ];
}
```

**Priority:** 🟠 High  
**Effort:** 2-4 hours (investigation + fix)  
**Files:** API routes, category page components

---

## 🟡 MEDIUM PRIORITY ISSUES

### 6. Touch Target Sizes

**Issue:** Some interactive elements may be smaller than WCAG 2.1 AA minimum (44×44px)

**Affected Components:**
- Related products "Add to Cart" buttons
- Wishlist heart icons on product cards
- Rating stars in reviews section

**Solution:**
```tsx
// Ensure minimum touch targets
<Button 
  className="min-h-[44px] min-w-[44px]"
  // or use utility class
  className="touch-target"
>
  Add to Cart
</Button>
```

Already defined in globals.css:
```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

**Priority:** 🟡 Medium  
**Effort:** 2 hours  
**Files:** `components/product-card.tsx`, `components/wishlist-button.tsx`

---

### 7. Sticky Add-to-Cart Bar Overlaps Content

**Issue:** On product pages, the sticky bottom bar may overlap footer content on scroll

**Location:** `components/sticky-add-to-cart.tsx`

**Solution:**
```tsx
// Ensure main content has bottom padding
<main className="pb-[80px]"> {/* Height of sticky bar + safe area */}
  {/* Content */}
</main>

// Or use CSS utility
<main className="has-sticky-bottom">
```

```css
.has-sticky-bottom {
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}
```

**Priority:** 🟡 Medium  
**Effort:** 30 minutes  
**Files:** Product page layout, `globals.css`

---

### 8. Footer Accordion Expansion on Mobile

**Issue:** Footer sections use accordions on mobile but may have unclear expand/collapse states

**Location:** `components/site-footer.tsx`

**Solution:**
- Add visual indicator for expanded state
- Use rotate animation on chevron icons
- Add aria-expanded attributes

**Priority:** 🟡 Medium  
**Effort:** 1 hour  
**Files:** `components/site-footer.tsx`

---

### 9. Image Loading Performance

**Issue:** Product images may cause layout shift during load

**Solution:**
```tsx
// Ensure all images have explicit dimensions and placeholder
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Low-quality placeholder
  className="object-contain"
/>
```

**Priority:** 🟡 Medium  
**Effort:** 2 hours  
**Files:** `components/product-card.tsx`, product pages

---

## 🟢 LOW PRIORITY ISSUES

### 10. 404 Errors for SimpleIcons

**Console Warning:**
```
GET https://simpleicons.org/icons/canon.svg 404
GET https://simpleicons.org/icons/xbox.svg 404
```

**Issue:** Some brand icons aren't found in SimpleIcons library

**Solution:** Use Phosphor icons or local SVGs as fallback

**Priority:** 🟢 Low  
**Effort:** 30 minutes  
**Files:** Components using brand icons

---

### 11. Language Switcher Mobile UX

**Issue:** Language switcher in sidebar could have larger touch targets

**Solution:** Make language options full-width buttons

**Priority:** 🟢 Low  
**Effort:** 30 minutes  
**Files:** `components/sidebar-menu.tsx`

---

## Best Practices Checklist

### ✅ Already Implemented
- [x] Mobile viewport meta tag
- [x] Safe area inset utilities (pb-safe, etc.)
- [x] Touch-action manipulation on interactive elements
- [x] Responsive grid layouts
- [x] Mobile-first Tailwind classes
- [x] Sheet animations in CSS

### ❌ Needs Implementation
- [ ] Fix hydration errors (Critical)
- [ ] Add aria-describedby to dialogs (Critical)
- [ ] Optimize sheet animation timing (High)
- [ ] Mobile-optimized search experience (High)
- [ ] Investigate Vercel 500 error (High)
- [ ] Audit touch target sizes (Medium)

---

## Implementation Priority Order

1. **Day 1:** Fix hydration errors + aria-describedby warnings
2. **Day 2:** Optimize sheet animations + investigate Vercel error
3. **Day 3:** Refactor search modal for mobile
4. **Day 4:** Touch target audit + layout refinements
5. **Day 5:** Testing + polish

---

## Testing Verification

After implementing fixes, re-test with:
```bash
# Local testing
npm run dev
# Open Chrome DevTools → Device Mode → iPhone 14 Pro

# Or use Playwright
npx playwright test --project=mobile-chrome
```

### Test Cases
1. [ ] Hamburger menu slides smoothly from left
2. [ ] No console warnings about aria-describedby
3. [ ] No hydration errors in console
4. [ ] Search opens as full-screen sheet
5. [ ] /categories/baby-kids loads on Vercel production
6. [ ] All buttons have 44px minimum touch targets
7. [ ] Cart dropdown shows correct count immediately

---

## Appendix: Component Architecture

```
Mobile Navigation Flow:
┌─────────────────────────────────────────────────┐
│ Site Header (Mobile)                            │
│ ┌──────┬──────┬───────────────┬─────┬─────────┐│
│ │ ☰    │ AMZN │               │  🔍  │   🛒   ││
│ │Menu  │ Logo │               │Search│  Cart  ││
│ └──────┴──────┴───────────────┴─────┴─────────┘│
└─────────────────────────────────────────────────┘
         │                          │        │
         ▼                          ▼        ▼
┌─────────────────┐    ┌───────────────┐   ┌─────────────────┐
│ SidebarMenu     │    │ MobileSearchV2│   │MobileCartDropdown│
│ (Sheet/Left)    │    │ (CommandDialog)│   │ (Drawer/Bottom) │
│                 │    │               │   │                 │
│ Uses: Radix     │    │ Uses: cmdk +  │   │ Uses: Vaul     │
│       Sheet     │    │       Dialog  │   │       Drawer    │
└─────────────────┘    └───────────────┘   └─────────────────┘
```

---

**Report Generated:** Mobile UX Audit via Playwright Automation  
**Next Steps:** Create GitHub issues for each critical/high priority item
