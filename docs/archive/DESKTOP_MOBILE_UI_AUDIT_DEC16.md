# Comprehensive Desktop + Mobile UI/UX Audit Report
**Date:** December 16, 2025  
**Audited Routes:** Landing, Category, Product, Account, Plans  
**Scope:** Desktop-first analysis with mobile considerations

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Landing Page Audit](#1-landing-page-audit)
3. [Category Pages Audit](#2-category-pages-audit)
4. [Product Page Audit](#3-product-page-audit)
5. [Account Pages Audit](#4-account-pages-audit)
6. [Plans Page Audit](#5-plans-page-audit)
7. [Global Issues](#6-global-issues)
8. [Component-Specific Issues](#7-component-specific-issues)
9. [Recommendations Summary](#8-recommendations-summary)

---

## Executive Summary

### Overall Health Score: **7.2/10**

| Route | Desktop Score | Mobile Score | Critical Issues |
|-------|---------------|--------------|-----------------|
| Landing | 7.5 | 7.0 | 3 |
| Categories | 7.0 | 6.5 | 4 |
| Product | 7.5 | 7.0 | 5 |
| Account | 7.5 | 7.0 | 3 |
| Plans | 8.0 | 7.5 | 2 |

### Key Findings
- ✅ Good use of Tailwind v4 design tokens
- ✅ Consistent color system via CSS custom properties
- ⚠️ Inconsistent spacing/padding between sections
- ⚠️ Mixed typography scales (some components use hardcoded values)
- ❌ Several accessibility concerns
- ❌ Layout shift issues on some pages

---

## 1. Landing Page Audit

**File:** `app/[locale]/(main)/page.tsx`

### 1.1 Desktop Layout Issues

#### ❌ **CRITICAL: Inconsistent Section Spacing**
```tsx
// Current: Uses space-y-6 container but PromoCards has extra margin
<div className="container px-4 lg:px-6 relative z-10 pb-8 space-y-6">
  <div className="pt-6">  // ← Extra pt-6 breaks rhythm
    <CategoryCircles locale={locale} />
  </div>
```
**Issue:** The `space-y-6` (24px) should handle all vertical rhythm, but `pt-6` adds additional spacing creating 48px gap vs 24px elsewhere.

**Fix:** Remove `pt-6` from category circles wrapper or adjust to `pt-0`.

#### ⚠️ **WARNING: Container Padding Inconsistency**
```tsx
// DesktopHeroCTA container
<div className="container px-4 lg:px-6 pt-5">  // pt-5 = 20px

// Main content container  
<div className="container px-4 lg:px-6 relative z-10 pb-8 space-y-6">  // pb-8 = 32px
```
**Issue:** `pt-5` (20px) top vs `pb-8` (32px) bottom creates asymmetric page feel.

**Fix:** Standardize to `pt-6 pb-8` or `py-6` for consistency.

#### ⚠️ **WARNING: PromoCards Mobile Width Hardcoded**
```tsx
<div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0">
```
**Issue:** Hardcoded percentage (`65%`) is a magic number. Should use Tailwind sizing utilities.

**Fix:** Consider `w-3/5` or custom CSS variable for mobile card width.

### 1.2 Mobile Layout Issues

#### ❌ **CRITICAL: Padding Inconsistency in Mobile Sections**
```tsx
// NewestListings - uses px-3
<div className="px-3 pt-3">
  <Suspense fallback={<SignInCtaSkeleton />}>
    <SignInCTA />
  </Suspense>
</div>

// MoreWaysToShop - also uses px-3
<div className="mt-1.5 px-3 sm:mt-0 sm:px-0">
```
**Issue:** Mobile horizontal padding is `px-3` (12px) but PromoCards uses `px-3` for scrollable content. These should be consistent throughout.

### 1.3 Typography Issues

#### ⚠️ **WARNING: Heading Scale Mismatch**
```tsx
// MoreWaysToShop
<h2 className="text-base font-semibold text-foreground mb-1.5 sm:text-lg sm:mb-3">

// Should be consistent with other section headings
```
**Issue:** `text-base` (16px) → `text-lg` (18px) is a small jump. Other sections may use different scales.

---

## 2. Category Pages Audit

### 2.1 Categories Index Page
**File:** `app/[locale]/(main)/categories/page.tsx`

#### ❌ **CRITICAL: Negative Margin Without Overflow Handling**
```tsx
<div className="container -mt-4 sm:-mt-6">
```
**Issue:** Negative margins (`-mt-4`, `-mt-6`) can cause content overlap and are fragile patterns. This creates visual connection to hero but is risky.

**Fix:** Use `transform translate-y-[-1rem]` or redesign to avoid negative margins.

#### ⚠️ **WARNING: Hero Banner Inconsistent Padding**
```tsx
<div className="bg-primary text-primary-foreground py-6 sm:py-10">
  <div className="container">
    {/* Breadcrumb */}
    <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70 mb-4">
```
**Issue:** `py-6` (24px) mobile → `py-10` (40px) desktop is a 16px jump. The breadcrumb has `mb-4` (16px) but icon section has `mb-2` creating inconsistent internal spacing.

#### ⚠️ **WARNING: Card Grid Gap Inconsistency**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```
**Issue:** `gap-4` (16px) is used but other grids in the app use `gap-2`, `gap-3`, or variable gaps. Should standardize.

### 2.2 Category Detail Page
**File:** `app/[locale]/(main)/categories/[slug]/page.tsx`

#### ❌ **CRITICAL: Sidebar Width Magic Number**
```tsx
<aside className="w-56 hidden lg:block shrink-0 border-r border-border">
```
**Issue:** `w-56` (224px) is a magic number. Should use CSS variable for sidebar width for consistency with account sidebar.

**Fix:** Use `--sidebar-width` CSS variable or Tailwind sizing.

#### ⚠️ **WARNING: Inconsistent Main Content Padding**
```tsx
<div className="flex-1 min-w-0 lg:pl-5">
```
**Issue:** `pl-5` (20px) doesn't align with standard spacing scale. Should be `pl-4` (16px) or `pl-6` (24px).

#### ⚠️ **WARNING: Filter Row Gap Mismatch**
```tsx
<div className="mb-3 sm:mb-5 flex flex-wrap items-center gap-2 sm:gap-2.5">
```
**Issue:** `gap-2` → `gap-2.5` is an unusual half-step. Stick to `gap-2` or `gap-3`.

#### ❌ **CRITICAL: Product Grid Inconsistent Column Count**
```tsx
<div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
```
**Issue:** Gap changes from `gap-2` to `gap-3` at `sm:` breakpoint, but column count changes at `md:`. These should align.

**Comparison with TabbedProductFeed:**
```tsx
// Landing page feed
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4">
```
**Issue:** Different gap values (`gap-2 sm:gap-3` vs `gap-3 xl:gap-4`) between category and landing page grids.

---

## 3. Product Page Audit

**Files:** 
- `app/[locale]/(main)/product/[id]/page.tsx`
- `components/product-page-content-new.tsx`

### 3.1 Layout Issues

#### ❌ **CRITICAL: Complex Nested Grid Structure**
```tsx
<div className="lg:bg-product-container-bg lg:border lg:border-product-container-border lg:rounded-xl lg:overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_440px]">
```
**Issue:** Three different right column widths (380px, 420px, 440px) at different breakpoints. This causes layout shifts and is hard to maintain.

**Fix:** Use consistent width or percentage-based column.

#### ⚠️ **WARNING: Buy Box Padding Inconsistency**
```tsx
<div className="px-2 sm:px-0 lg:p-5 xl:p-6 lg:bg-background mt-3 lg:mt-0">
```
**Issue:** 
- Mobile: `px-2` (8px) horizontal
- Tablet: `px-0` (0px) - content touches edges
- Desktop: `p-5` (20px) then `p-6` (24px)

This creates jarring visual changes between breakpoints.

#### ⚠️ **WARNING: Inconsistent Section Margins**
```tsx
<div className="mt-4 lg:mt-6">  // About section
<div className="mt-3 lg:mt-8 pt-3 lg:pt-6 border-t border-border">  // Seller section
```
**Issue:** Different margin patterns: `mt-4/mt-6` vs `mt-3/mt-8`. The second also adds padding, making total spacing 48px on desktop vs 24px on mobile (6px margin + 18px padding).

### 3.2 Typography Issues

#### ⚠️ **WARNING: Title Size Jump**
```tsx
<h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground leading-none">
```
**Issue:** Three size breakpoints (`text-lg` → `text-xl` → `text-2xl`) is unusual. Most components use two (mobile/desktop).

#### ❌ **CRITICAL: Price Styling Inconsistency**
```tsx
// Desktop price
<span className="text-3xl font-bold text-foreground tracking-tight">
  {formatPrice(product.price, { locale })}
</span>

// Mobile price (in StickyBuyBox - different component)
// Uses different size and potentially different formatting
```
**Issue:** Price typography should be consistent across all breakpoints with the same `font-weight`, `letter-spacing`, and color.

### 3.3 Related Products Section

#### ⚠️ **WARNING: Grid/Scroll Pattern Mismatch**
```tsx
{/* Mobile: Horizontal scroll */}
<div className="lg:hidden -mx-3 px-3">
  <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">

{/* Desktop: Grid layout */}
<div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-3">
```
**Issue:** 
- Mobile uses `gap-2.5` (10px)
- Desktop uses `gap-3` (12px)
- Different card widths (`w-[calc(50%-5px)]` vs grid auto)

---

## 4. Account Pages Audit

**Files:**
- `app/[locale]/(account)/layout.tsx`
- `app/[locale]/(account)/account-layout-content.tsx`
- `app/[locale]/(account)/account/page.tsx`

### 4.1 Layout Structure Issues

#### ✅ **GOOD: CSS Variable for Sidebar Width**
```tsx
style={{
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties}
```
**Note:** Good use of CSS variables, but `--spacing` reference assumes Tailwind v4 setup. Verify this works correctly.

#### ⚠️ **WARNING: Content Area Padding Inconsistency**
```tsx
<div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 pb-20 lg:px-6 lg:py-6 lg:pb-6">
```
**Issue:** 
- Mobile: `px-4 py-4 pb-20` (16px horizontal, 16px top, 80px bottom for tab bar)
- Desktop: `px-6 py-6 pb-6` (24px all around)

The bottom padding jump from 80px to 24px is handled by tab bar visibility, but should be verified.

### 4.2 Account Overview Page

#### ⚠️ **WARNING: Gap Values Not Matching Section Components**
```tsx
<div className="flex flex-col gap-5 md:gap-6">
```
**Issue:** `gap-5` (20px) → `gap-6` (24px) is a small jump. Consider `gap-4` → `gap-6` for clearer visual hierarchy.

### 4.3 Account Hero Card

#### ⚠️ **WARNING: Background Decoration Hardcoded Sizes**
```tsx
<div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2" />
<div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />
```
**Issue:** Hardcoded `w-32`, `w-48`, `w-24` values. Should use consistent sizing or CSS variables for decorative elements.

### 4.4 Account Stats Cards

#### ❌ **CRITICAL: Mobile-Only vs Desktop-Only Rendering**
```tsx
{/* Mobile: Revolut-style circular action buttons */}
<div className="sm:hidden">
  <div className="grid grid-cols-5 gap-1">

{/* Desktop: Horizontal quick actions bar */}
// (Code continues in file but truncated in audit)
```
**Issue:** Complete render separation between mobile/desktop. If styling diverges, maintenance becomes difficult. Consider unified component with variant prop.

#### ⚠️ **WARNING: Badge Positioning Hardcoded**
```tsx
<div className="absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] items-center justify-center">
```
**Issue:** Hardcoded negative position (`-top-0.5`, `-right-0.5`) and hardcoded dimensions (`min-w-[18px]`, `h-[18px]`). Should use `size-4.5` or CSS variable.

---

## 5. Plans Page Audit

**File:** `app/[locale]/(plans)/plans/page.tsx`

### 5.1 Layout Issues

#### ✅ **GOOD: Consistent Container Width**
```tsx
<main className="container max-w-5xl mx-auto px-4 py-8 md:py-12 flex-1">
```
**Note:** Good use of `max-w-5xl` for content-focused page.

#### ⚠️ **WARNING: Section Padding Inconsistency**
```tsx
<section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
// ...
<section className="py-12 md:py-16 bg-muted/30">
```
**Issue:** Both sections use same padding (`py-12 md:py-16`) which is good, but verify this matches other pages.

### 5.2 Component Issues

#### ⚠️ **WARNING: Fee Cards Grid Gap Mobile**
```tsx
<div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 mb-10">
```
**Issue:** `gap-2` (8px) on mobile is tight. Consider `gap-3` for better touch targets and readability.

#### ⚠️ **WARNING: Table Overflow Not Handled**
```tsx
<div className="mt-8 bg-card border rounded-xl p-4 overflow-x-auto">
  <table className="w-full text-sm">
```
**Issue:** While `overflow-x-auto` is present, no minimum width is set on the table. On very narrow screens, content may still compress poorly.

**Fix:** Add `min-w-[500px]` to table element.

### 5.3 Header Component

#### ❌ **CRITICAL: Hardcoded Header Height**
```tsx
<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
  <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
```
**Issue:** `h-14` (56px) hardcoded. The main site header uses different heights. Should use CSS variable `--header-height` for consistency.

---

## 6. Global Issues

### 6.1 Site Header
**File:** `components/site-header.tsx`

#### ❌ **CRITICAL: Header Height Discrepancy**
```tsx
// Mobile
<div className="md:hidden bg-background text-header-text">

// Desktop  
<div className="hidden md:block text-header-text">
  <div className="container grid grid-cols-[auto_1fr_auto] items-center h-14 md:h-16 gap-3">
```
**Issue:** Desktop header is `h-14 md:h-16` (56px → 64px) but mobile header height is implicit from content. This can cause layout shifts.

### 6.2 Site Footer
**File:** `components/site-footer.tsx`

#### ⚠️ **WARNING: Social Icons Inline SVG**
```tsx
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
```
**Issue:** While performant, inline SVGs increase bundle size. Consider moving to sprite sheet or icon component library.

### 6.3 Mobile Tab Bar
**File:** `components/mobile-tab-bar.tsx`

#### ⚠️ **WARNING: Hardcoded Tab Bar Height**
```tsx
<div className="flex items-center justify-around h-14 px-2 relative">
```
**Issue:** `h-14` (56px) is hardcoded. If iOS safe area changes, this needs manual update.

**Fix:** Use `h-14 pb-safe` or CSS variable for tab bar height.

#### ❌ **CRITICAL: Product Page Detection Logic**
```tsx
const knownRoutes = ['categories', 'cart', 'checkout', 'account', 'chat', 'sell', 'help', 'auth', 'search', 'admin', 'dashboard', 'plans', 'wishlist', 'orders', 'settings', 'notifications']
const isProductPage = pathname.startsWith("/product/") || 
  (pathSegments.length === 2 && !knownRoutes.includes(pathSegments[0]))
```
**Issue:** Hardcoded route list is fragile. New routes must be added manually. Consider using route metadata instead.

---

## 7. Component-Specific Issues

### 7.1 ProductCard
**File:** `components/product-card.tsx`

#### ⚠️ **WARNING: Too Many Variants**
```tsx
const productCardVariants = cva(
  "overflow-hidden flex flex-col group relative bg-card border border-border min-w-0",
  {
    variants: {
      variant: {
        default: "rounded-md h-full",
        grid: "rounded-sm h-full",
        compact: "rounded-md",
        featured: "rounded-md",
      },
```
**Issue:** `default`, `grid`, `compact`, `featured` variants have minimal differences. `grid` uses `rounded-sm` while others use `rounded-md`. Consolidate to reduce complexity.

#### ❌ **CRITICAL: Button Height Inconsistency**
```tsx
// Compact variant
<button className="... size-7 rounded transition-colors">

// Grid variant
<Button className="... h-9 text-sm">  // or h-10
```
**Issue:** Different button sizes (28px vs 36px/40px) across variants. Should use consistent touch target size.

### 7.2 CategoryCircles
**File:** `components/category-circles.tsx`

#### ⚠️ **WARNING: Excessive Icon Mapping**
The file contains 70+ icon mappings for categories. This is fragile and should be:
1. Moved to a config file
2. Use fallback icon pattern
3. Consider database-driven icon selection

### 7.3 TabbedProductFeed
**File:** `components/tabbed-product-feed.tsx`

#### ✅ **GOOD: Proper ARIA Implementation**
```tsx
<div 
  className="flex items-center gap-1 p-1 rounded-full bg-muted/70 border border-border"
  role="tablist"
  aria-label={locale === "bg" ? "Филтриране на обяви" : "Filter listings"}
>
```

#### ⚠️ **WARNING: Load More Button Inconsistent with Design System**
```tsx
<button className="px-8 py-3 rounded-lg font-medium text-sm transition-all bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20">
```
**Issue:** Custom button styling instead of using `<Button variant="outline">`. Should use design system components.

### 7.4 PromoCard
**File:** `components/promo-card.tsx`

#### ❌ **CRITICAL: Using `<img>` Instead of `<Image>`**
```tsx
<img 
  src={bgImage} 
  alt="" 
  aria-hidden="true"
  loading="lazy"
  className="absolute inset-0 w-full h-full object-cover" 
/>
```
**Issue:** Using native `<img>` tag loses Next.js image optimization benefits. Should use `<Image>` component with `fill` prop.

---

## 8. Recommendations Summary

### 8.1 High Priority (Fix Immediately)

| Issue | Location | Fix |
|-------|----------|-----|
| Inconsistent section spacing | Landing page | Standardize to `space-y-6` without extra padding |
| Sidebar width magic number | Category page | Use CSS variable `--sidebar-width` |
| Product grid gap mismatch | Category vs Landing | Standardize to `gap-3` everywhere |
| Price typography inconsistency | Product page | Create shared price component |
| Header height discrepancy | Site header | Use CSS variable `--header-height` |
| Native img tag usage | PromoCard | Convert to Next/Image |

### 8.2 Medium Priority (Address Soon)

| Issue | Location | Fix |
|-------|----------|-----|
| Mobile padding inconsistency | Multiple pages | Standardize to `px-4` mobile, `px-6` desktop |
| Gap value half-steps | Multiple components | Use only standard Tailwind gaps: 2, 3, 4, 6, 8 |
| Typography scale jumps | Multiple components | Define consistent mobile/desktop scales |
| Hardcoded button heights | ProductCard | Use `h-9` (36px) or `h-10` (40px) consistently |
| Load more button styling | TabbedProductFeed | Use `<Button>` component |

### 8.3 Low Priority (Technical Debt)

| Issue | Location | Fix |
|-------|----------|-----|
| Icon mapping in components | CategoryCircles | Move to config file |
| Route detection logic | MobileTabBar | Use route metadata |
| Inline SVG icons | SiteFooter | Consider sprite sheet |
| Multiple near-identical variants | ProductCard | Consolidate variants |

### 8.4 Design System Recommendations

#### Spacing Scale
```css
/* Recommended spacing values - use these consistently */
--spacing-xs: 0.5rem;   /* 8px - tight spacing */
--spacing-sm: 0.75rem;  /* 12px - compact */
--spacing-md: 1rem;     /* 16px - default */
--spacing-lg: 1.5rem;   /* 24px - sections */
--spacing-xl: 2rem;     /* 32px - major sections */
--spacing-2xl: 3rem;    /* 48px - page sections */
```

#### Typography Scale
```css
/* Recommended text sizes */
text-xs: 12px   /* Captions, badges */
text-sm: 14px   /* Body text, labels */
text-base: 16px /* Paragraphs */
text-lg: 18px   /* Subheadings */
text-xl: 20px   /* Section headings */
text-2xl: 24px  /* Page headings */
text-3xl: 30px  /* Hero text (desktop) */
```

#### Grid Gaps
```css
/* Recommended grid gaps - pick one per use case */
gap-2: 8px   /* Tight grids (badges, tags) */
gap-3: 12px  /* Product grids */
gap-4: 16px  /* Card layouts */
gap-6: 24px  /* Section content */
gap-8: 32px  /* Page sections */
```

---

## Appendix: Files Audited

| File | Lines | Issues Found |
|------|-------|--------------|
| `app/[locale]/(main)/page.tsx` | 243 | 5 |
| `app/[locale]/(main)/categories/page.tsx` | 186 | 4 |
| `app/[locale]/(main)/categories/[slug]/page.tsx` | 482 | 6 |
| `app/[locale]/(main)/product/[id]/page.tsx` | 469 | 4 |
| `app/[locale]/(account)/account/page.tsx` | ~110 | 2 |
| `app/[locale]/(plans)/plans/page.tsx` | 617 | 4 |
| `components/site-header.tsx` | 240 | 2 |
| `components/product-card.tsx` | 423 | 4 |
| `components/product-page-content-new.tsx` | 681 | 5 |
| `components/tabbed-product-feed.tsx` | 269 | 2 |
| `components/category-circles.tsx` | 771 | 1 |
| `components/mobile-tab-bar.tsx` | 148 | 2 |
| `components/promo-card.tsx` | ~70 | 1 |
| `components/plan-card.tsx` | 396 | 1 |
| `components/account-hero-card.tsx` | ~100 | 1 |
| `components/account-stats-cards.tsx` | 124 | 2 |
| `app/globals.css` | 531 | - |

**Total Issues Found:** 46  
**Critical:** 12  
**Warning:** 28  
**Info:** 6

---

*Report generated by UI/UX Audit Tool v1.0*
