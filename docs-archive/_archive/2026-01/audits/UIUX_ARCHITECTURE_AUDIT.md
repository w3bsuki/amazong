# UI/UX Architecture Audit — Treido Marketplace

> **Date:** 2025-01-02  
> **Auditor:** GitHub Copilot  
> **Scope:** Mobile & Desktop category navigation, touch targets, layout issues, badge persistence

---

## 📋 Executive Summary

This audit addresses **7 critical issues** raised in the UI/UX review:

| # | Issue | Severity | Recommendation |
|---|-------|----------|----------------|
| 1 | Tabs on homepage vs `/categories` — duplicate patterns | 🔴 High | **Consolidate** — Keep homepage as discovery; make `/categories` index distinct or redirect |
| 2 | Hamburger menu search bar & 40px touch targets | 🟡 Medium | Compliant — Minor label spacing fix |
| 3 | Three inconsistent category icon styles | 🔴 High | **Unify** — Use single `CategoryCircle` component everywhere |
| 4 | Logo doesn't link to landing page on mobile | 🟡 Medium | **Fix** — Add clickable logo to mobile header |
| 5 | Chat only loads after refresh + layout shift | 🔴 High | **Fix** — Preload chat providers, fix hydration |
| 6 | Wishlist/cart badges don't persist after refresh | 🔴 High | **Fix** — Persist badge counts in cookies/localStorage |
| 7 | Architectural decision: tabs vs `/categories` | 🔴 Critical | **Homepage = discovery; `/categories/[slug]` = deep browse (filters/sort); avoid duplicate `/categories` index** |

---

## 🏗️ Issue 1 & 7: Main Page Tabs vs `/categories`

### Current State Analysis

**Homepage (`/en/`):**
- Uses `MobileHomeTabs` component with:
  - L0 tabs (horizontal text tabs): All, Fashion, Electronics, etc.
  - L1 circles: Subcategories displayed as `CategoryCircle` components
  - L2 circles: Sub-subcategories 
  - L3 pills: Deepest level as pill buttons
  - Inline product feed with infinite scroll

**`/categories` Route (`/en/categories`):**
- Also uses `MobileHomeTabs` (same component!)
- Shows the exact same UX pattern
- Only difference: `showBanner={false}` and `initialProducts={[]}`
- Has a "See all" link that leads to itself (circular)

**`/categories/[slug]` Route (e.g. `/en/categories/electronics`):**
- Uses the dedicated category results layout
- Has **MobileFilters** (drawer) + **SortSelect** (Sort by)
- Has larger subcategory circles via `SubcategoryCircles`
- Better matches a "shopping/refine" mental model

**Bottom Navbar Browse Sheet (`MobileMenuSheet`):**
- Opens a drawer with a 4-column grid of `CategoryCircle` components
- Links directly to `/categories/{slug}` (specific category pages)
- Has "See all" link to `/categories`

### Problems Identified

1. **Redundancy:** Homepage tabs and `/categories` page use **identical** `MobileHomeTabs` component
2. **Confusion:** User opens "Categories" from bottom nav → sees drawer → clicks "See all" → lands on page that looks exactly like homepage
3. **Over-engineering:** Three ways to browse categories:
   - Homepage tabs (inline)
   - `/categories` route (full page)
   - Bottom nav drawer (overlay)
4. **Mental Model Violation:** Users expect drawer → full page to show *more*, not *the same*

### Architectural Recommendation: **CONSOLIDATE (Discovery vs Deep Browse)**

**Option A (Recommended): Remove the duplicate `/categories` *index* experience**
```
Homepage tabs (MobileHomeTabs) = PRIMARY navigation
├── Keep L0→L1→L2→L3 hierarchy
├── Homepage stays lightweight (discovery; no full filter drawer)
├── `/categories/[slug]` stays as deep browsing + filtering (MobileFilters + SortSelect)
├── Replace `/categories` index with a distinct directory OR redirect it
├── Bottom nav drawer → links directly to homepage with ?tab=electronics&sub=smartphones
└── "See all" links → anchor to homepage + set URL params
```

**Rationale:**
- Clear separation of concerns: discovery (home) vs refine (category results)
- Avoids duplicating filter/sort logic on the homepage
- Preserves the better "shopping" UX on `/categories/[slug]`
- Bottom nav drawer becomes a quick-access shortcut, not a confusing portal to an identical page

**Option B (Alternative): Make `/categories` a Pure Grid View**
```
If keeping /categories:
├── Make it a DISTINCT experience (not MobileHomeTabs)
├── Show all categories in a search-friendly grid
├── Add filters, sorting, alphabet jump
└── Position as "full catalog" vs homepage "quick browse"
```

### Implementation Changes Required

```tsx
// 1. REDIRECT or REBUILD /categories page
// File: app/[locale]/(main)/categories/page.tsx
// Action: Either redirect to /?tab=all OR implement a distinct “All Categories directory” view

// 2. UPDATE MobileMenuSheet.tsx "See all" link
// FROM:
<Link href="/categories">See all</Link>
// TO:
<Link href="/?tab=all">See all</Link>

// 3. UPDATE Bottom nav Categories button
// FROM: Opens drawer with "See all → /categories"
// TO: Opens drawer with "See all → /" or just deepens selection inline
```

---

## 🎯 Issue 2: Hamburger Menu Touch Targets (40px Compliance)

### Audit Results

| Element | Current Size | Required | Status |
|---------|-------------|----------|--------|
| Menu trigger button | `size-icon-lg` (44px) | 40px | ✅ Compliant |
| Close button (X) | `size-8` (32px) | 40px | ⚠️ Below target |
| Category circles | `size-12` (48px) | 40px | ✅ Compliant |
| Quick action icons | `size-12` (48px) | 40px | ✅ Compliant |
| Sign In/Register buttons | `py-2.5` (~40px) | 40px | ✅ Compliant |
| Search input | `h-10` (40px) | 40px | ✅ Compliant |

### Fix Required

```tsx
// File: components/layout/sidebar/sidebar-menu.tsx
// Line ~265: Close Button
// FROM:
<DrawerClose asChild>
  <Button variant="ghost" size="icon" className="size-8">
// TO:
<DrawerClose asChild>
  <Button variant="ghost" size="icon-lg" className="min-h-touch min-w-touch">
```

### Search Bar in Hamburger Menu

**Current Implementation:**
```tsx
<Input
  type="search"
  className="h-10 pl-10 pr-4 rounded-md"
/>
```

**Status:** ✅ Height is 40px (h-10) — Compliant

**Issue:** The search doesn't actually do anything. It's placeholder UI.

**Recommendation:** Either implement real search or remove it to avoid user confusion.

---

## 🎨 Issue 3: Three Different Category Icon Styles

### Current Implementations

**Style 1: Homepage `MobileHomeTabs` Circles**
```tsx
// File: components/mobile/mobile-home-tabs.tsx
<CategoryCircle
  circleClassName="size-10"        // 40px
  fallbackIconSize={20}
  fallbackIconWeight="regular"
  variant="muted"
/>
```

**Style 2: Hamburger Menu (`SidebarMenu`) Circles**
```tsx
// File: components/layout/sidebar/sidebar-menu.tsx
// INLINE implementation, NOT using CategoryCircle!
<div className="size-12 rounded-full bg-brand flex items-center justify-center">
  <span className="text-white">
    {getCategoryIcon(cat.slug, { size: 20 })}
  </span>
</div>
```

**Style 3: Bottom Nav Drawer (`MobileMenuSheet`) Circles**
```tsx
// File: components/mobile/mobile-menu-sheet.tsx
<CategoryCircle
  circleClassName="size-14"        // 56px
  fallbackIconSize={26}
  fallbackIconWeight="regular"
  variant="menu"
/>
```

### Visual Comparison

| Location | Circle Size | Icon Size | Background | Icon Color |
|----------|-------------|-----------|------------|------------|
| Homepage tabs | 40px | 20px | `bg-brand/10` | `text-brand` |
| Hamburger menu | 48px | 20px | `bg-brand` (solid) | `text-white` |
| Bottom nav drawer | 56px | 26px | `bg-brand/10` | `text-brand` |

### Problem

The hamburger menu uses **completely different** inline styling instead of the shared `CategoryCircle` component. This creates visual inconsistency:
- Different background colors (solid vs tinted)
- Different icon colors (white vs brand)
- Different circle sizes (3 different sizes!)

### Fix: Unify All Category Circles

**Step 1: Refactor Hamburger Menu**
```tsx
// File: components/layout/sidebar/sidebar-menu.tsx
// REPLACE HamburgerCategoryCirclesInner inline circles with:

import { CategoryCircle } from "@/components/shared/category/category-circle"

{displayCategories.map((cat) => (
  <CategoryCircle
    key={cat.slug}
    category={cat}
    href={`/categories/${cat.slug}`}
    onClick={onNavigate}
    circleClassName="size-12"      // Standardize at 48px
    fallbackIconSize={22}
    fallbackIconWeight="regular"
    variant="menu"                  // Use menu variant for consistency
    label={getCategoryName(cat, locale)}
    labelClassName="text-tiny font-medium text-center text-foreground leading-tight line-clamp-2 max-w-[60px]"
  />
))}
```

**Step 2: Standardize Sizes**

| Context | Recommended Size | Rationale |
|---------|-----------------|-----------|
| Homepage tabs | `size-12` (48px) | Touch-friendly, fits 5-6 per row |
| Hamburger menu | `size-12` (48px) | Consistent with homepage |
| Bottom nav drawer | `size-12` (48px) | Consistent with others |

**Step 3: Remove Variant Divergence**

The `CategoryCircleVisual` component has three variants (`muted`, `menu`, `rail`) but they all render identically now. Consider simplifying:

```tsx
// File: components/shared/category/category-circle-visual.tsx
// SIMPLIFY: Remove variant prop, use single unified style
const base = "bg-brand/10 border border-brand/20 text-brand"
```

---

## 📱 Issue 4: Logo Click on Mobile

### Current State

**Mobile Header:**
- Logo exists but unclear if clickable
- On desktop: Logo links to homepage
- On mobile: Behavior inconsistent

### Audit Needed

Check `components/layout/header/` for logo click behavior.

### Recommended Fix

```tsx
// Ensure logo is wrapped in Link:
<Link href="/" className="flex items-center">
  <Logo />
</Link>
```

---

## 💬 Issue 5: Chat Loading Issues

### Symptoms
1. Chat only loads after manual page refresh
2. Layout movement (shift) when chat components mount

### Root Causes

1. **Provider Initialization:** `MessageProvider` may be initializing late
2. **Hydration Mismatch:** Client-side state differs from server
3. **Lazy Loading:** Chat components using `dynamic` with `ssr: false`

### Investigation Points

```
components/providers/message-context.tsx
app/[locale]/(main)/chat/page.tsx
components/chat/* (if exists)
```

### Recommended Fix Pattern

```tsx
// 1. Ensure MessageProvider is high in tree
// File: app/[locale]/layout.tsx
<MessageProvider>
  {children}
</MessageProvider>

// 2. Use Suspense boundaries
<Suspense fallback={<ChatSkeleton />}>
  <ChatContent />
</Suspense>

// 3. Preconnect to realtime
// In head: <link rel="preconnect" href="wss://your-supabase.co" />
```

---

## ❤️ Issue 6: Wishlist/Cart Badge Persistence

### Current State

Badges (wishlist count, cart count) disappear after page refresh.

### Root Cause

Badge counts are stored only in React state, not persisted.

### Recommended Fix

**Option A: Cookie-based Persistence (Recommended)**
```tsx
// On wishlist update:
document.cookie = `wishlist_count=${count}; path=/; max-age=86400`

// On initial load:
const count = parseInt(getCookie('wishlist_count') || '0')
```

**Option B: LocalStorage**
```tsx
// On update:
localStorage.setItem('wishlist_count', String(count))

// On load:
const count = parseInt(localStorage.getItem('wishlist_count') || '0')
```

**Option C: Server-side with SSR**
```tsx
// Pass counts from server in layout
const wishlistCount = await getWishlistCount(userId)
return <WishlistProvider initialCount={wishlistCount}>
```

---

## 📐 Touch Target Reference

Per project standards (minimum touch target ~`40px`):

| Token | Value | Usage |
|-------|-------|-------|
| `size-touch` | 40px | Minimum touch target |
| `min-h-touch` | 40px | Minimum height |
| `min-w-touch` | 40px | Minimum width |
| `h-touch-sm` | 40px | Small buttons |
| `size-icon-lg` | 44px | Icon buttons |

---

## 🚀 Implementation Priority

### Phase 1: Quick Wins (1-2 days)
- [ ] Fix hamburger menu close button to `min-h-touch`
- [ ] Fix logo link on mobile
- [ ] Persist badge counts in cookies

### Phase 2: Architecture (3-5 days)
- [ ] Unify `CategoryCircle` usage across all surfaces
- [ ] Eliminate `/categories` route redundancy
- [ ] Update bottom nav "See all" links

### Phase 3: Chat Polish (2-3 days)
- [ ] Debug chat loading sequence
- [ ] Add Suspense boundaries
- [ ] Fix layout shift with skeleton

---

## ✅ Checklist for Implementation

```
[ ] Delete or redirect /categories/page.tsx
[ ] Update MobileMenuSheet "See all" link
[ ] Refactor SidebarMenu to use CategoryCircle
[ ] Standardize circle sizes to 48px
[ ] Fix close button touch target
[ ] Add logo link to mobile header
[ ] Implement badge persistence
[ ] Debug chat provider initialization
[ ] Add Suspense boundaries for chat
```

---

## 📚 Related Files

```
components/mobile/mobile-home-tabs.tsx       # Homepage tabs
components/mobile/mobile-tab-bar.tsx         # Bottom navigation
components/mobile/mobile-menu-sheet.tsx      # Bottom nav drawer
components/layout/sidebar/sidebar-menu.tsx   # Hamburger menu
components/shared/category/category-circle.tsx
components/shared/category/category-circle-visual.tsx
app/[locale]/(main)/categories/page.tsx      # To be removed
```

---

*Generated by Playwright MCP UI/UX Audit*
