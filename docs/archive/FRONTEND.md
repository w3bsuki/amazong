# Frontend Audit & Production Readiness Plan

> **Project:** AMZN E-commerce Platform  
> **Audit Date:** December 2024  
> **Status:** Pre-Production  
> **Priority:** LAUNCH READY

---

## Executive Summary

This document outlines the frontend audit findings and provides a phased approach to production readiness. The audit was conducted using Playwright MCP for automated accessibility snapshots across all major routes and viewports.

### Tech Stack
- **Framework:** Next.js 16.0.3 (Turbopack)
- **Internationalization:** next-intl (Bulgarian/English)
- **Styling:** TailwindCSS 4.1.17 + CSS Variables Design System
- **Components:** shadcn/ui + Radix UI primitives
- **Icons:** Phosphor Icons
- **State:** React Context (Cart, Wishlist, Messages)
- **Auth/DB:** Supabase
- **Payments:** Stripe

---

## 🔴 PHASE 1: CRITICAL FIXES (Launch Blockers)

### 1.1 Missing Page Titles
**Priority:** P0 | **Effort:** Low | **Impact:** High (SEO/Accessibility)

**Issue:** All pages are missing `<title>` tags. Playwright snapshots show "Page Title: (empty)" across all routes.

**Files to Update:**
```
app/[locale]/layout.tsx
app/[locale]/page.tsx
app/[locale]/search/page.tsx
app/[locale]/product/[id]/page.tsx
app/[locale]/cart/page.tsx
app/[locale]/auth/login/page.tsx
app/[locale]/checkout/page.tsx
... (all page.tsx files)
```

**Solution:**
```tsx
// Each page.tsx should export metadata
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations('Page');
  return {
    title: t('title'),
    description: t('description'),
  };
}
```

**Acceptance Criteria:**
- [ ] Every route has a unique, descriptive title
- [ ] Titles include brand name (e.g., "Search Results | AMZN")
- [ ] Titles are translated for each locale

---

### 1.2 External CDN 404 Errors
**Priority:** P0 | **Effort:** Low | **Impact:** Medium (Console Errors)

**Issue:** SimpleIcons CDN returning 404 errors in browser console.

**Console Errors:**
```
GET https://cdn.simpleicons.org/... 404 (Not Found)
```

**Solution Options:**
1. **Remove SimpleIcons CDN calls** - Replace with local SVGs or Phosphor Icons
2. **Fallback handling** - Add error boundary with fallback icons
3. **Bundle icons locally** - Import only needed icons

**Files to Check:**
- `components/site-footer.tsx` (social icons)
- `components/brand-circles.tsx` (brand logos)

---

### 1.3 Password Field Autocomplete
**Priority:** P0 | **Effort:** Low | **Impact:** High (Accessibility/Security)

**Issue:** Password input missing `autocomplete` attribute.

**Current:**
```tsx
<input type="password" />
```

**Fix:**
```tsx
<input type="password" autocomplete="current-password" /> // Login
<input type="password" autocomplete="new-password" />     // Registration
```

**Files:**
- `app/[locale]/auth/login/page.tsx`
- `app/[locale]/auth/register/page.tsx`
- `components/auth-form.tsx` (if exists)

---

### 1.4 LCP (Largest Contentful Paint) Issues
**Priority:** P0 | **Effort:** Medium | **Impact:** High (Core Web Vitals)

**Issue:** Hero carousel using placeholder.svg causing LCP warnings.

**Current Warning:**
```
LCP element uses placeholder.svg - consider using actual product images
```

**Solution:**
1. Use Next.js `priority` prop on hero images
2. Add `fetchPriority="high"` to LCP images
3. Use optimized WebP/AVIF formats
4. Implement proper image loading with blur placeholders

**Files:**
- `components/hero-carousel.tsx`
- Ensure hero images are in `public/` with proper optimization

---

## 🟠 PHASE 2: UX IMPROVEMENTS (Launch Week)

### 2.1 Loading States
**Priority:** P1 | **Effort:** Medium | **Impact:** High

**Issue:** Pages lack consistent loading indicators during data fetching.

**Required Implementations:**
| Component | Loading State Needed |
|-----------|---------------------|
| Product Grid | Skeleton cards |
| Search Results | Skeleton + "Searching..." |
| Cart Page | Skeleton items |
| Checkout | Full-page loader |
| Add to Cart | Button loading state |
| Wishlist | Heart icon animation |

**Pattern to Implement:**
```tsx
// components/ui/skeleton.tsx - already exists
// Create page-level loading.tsx files:
app/[locale]/search/loading.tsx
app/[locale]/product/[id]/loading.tsx
app/[locale]/cart/loading.tsx
```

---

### 2.2 Empty States
**Priority:** P1 | **Effort:** Medium | **Impact:** Medium

**Current Status:** Cart empty state exists but needs improvement.

**Required Empty States:**
| Page | Empty State Message | CTA |
|------|---------------------|-----|
| Cart | "Your cart is empty" | "Continue Shopping" |
| Wishlist | "No saved items" | "Discover Deals" |
| Search (0 results) | "No products found" | "Try different keywords" |
| Orders History | "No orders yet" | "Start Shopping" |
| Messages | "No messages" | "Contact Support" |

---

### 2.3 Error Boundaries
**Priority:** P1 | **Effort:** Medium | **Impact:** High

**Files to Create:**
```
app/[locale]/error.tsx        // Catch-all error page
app/[locale]/not-found.tsx    // 404 page (may exist)
components/error-boundary.tsx // Reusable component
```

**Error Page Requirements:**
- Clear error message
- "Go Home" CTA
- "Try Again" option where applicable
- Error reporting (optional: Sentry integration)

---

### 2.4 Form Validation UX
**Priority:** P1 | **Effort:** Medium | **Impact:** High

**Current:** Using Zod + React Hook Form (good foundation)

**Improvements Needed:**
- [ ] Inline error messages (not just on submit)
- [ ] Real-time validation for email format
- [ ] Password strength indicator
- [ ] Success toast after form submission
- [ ] Disabled submit button during processing

---

### 2.5 Toast Notification Improvements
**Priority:** P2 | **Effort:** Low | **Impact:** Medium

**Current:** Using Sonner (good choice)

**Enhancements:**
- [ ] Consistent duration (3s default, 5s for errors)
- [ ] Action buttons in toasts (e.g., "Undo" for remove from cart)
- [ ] Position: bottom-center on mobile, bottom-right on desktop
- [ ] Stack limit (max 3 visible)

---

## 🟡 PHASE 3: PERFORMANCE OPTIMIZATION (Week 2) ✅ COMPLETED

### 3.1 Image Optimization ✅
**Priority:** P2 | **Effort:** High | **Impact:** High | **Status:** ✅ DONE

**Implementations Completed:**
- ✅ Created `lib/image-utils.ts` with blur placeholder generators
- ✅ Added `productBlurDataURL()` for product cards  
- ✅ Added `heroBlurDataURL()` for hero carousel
- ✅ Added `categoryBlurDataURL()` for mega menu subcategories
- ✅ Implemented `getImageLoadingStrategy()` for priority-based loading
- ✅ Added `imageSizes` configuration object for consistent sizing
- ✅ Updated `ProductCard` with index-based priority loading
- ✅ Updated `HeroCarousel` with blur placeholders
- ✅ Updated `MegaMenu` subcategory images with blur placeholders

**Updated Code Pattern:**
```tsx
// components/product-card.tsx - NOW
<Image
  src={image || "/placeholder.svg"}
  alt={title}
  fill
  className="object-contain mix-blend-multiply"
  sizes={sizes}
  placeholder="blur"
  blurDataURL={productBlurDataURL()}
  loading={loadingStrategy.loading}
  priority={loadingStrategy.priority}
/>
```

**Checklist:**
- [x] Generate blur hashes for product images
- [x] Ensure all images use WebP/AVIF (via next.config.mjs)
- [x] Add loading="eager" to above-fold images
- [x] Audit `sizes` prop accuracy

---

### 3.2 Bundle Size Optimization ✅
**Priority:** P2 | **Effort:** High | **Impact:** Medium | **Status:** ✅ DONE

**Implementations Completed:**
1. **Dynamic Imports** implemented:
   - ✅ `ReviewForm` - lazy loaded in `reviews-section.tsx`
   - ✅ `ChatInterface` - lazy loaded in `messages-client.tsx`
   
2. **Loading Skeletons** added:
   - ✅ `ReviewFormSkeleton` - shows while form loads
   - ✅ `ChatInterfaceSkeleton` - shows while chat loads

3. **Next.js Config** optimized:
   - ✅ Removed `images.unoptimized: true`
   - ✅ Added AVIF/WebP formats
   - ✅ Configured remote image patterns
   - ✅ Enabled compression

---

### 3.3 Font Loading ✅
**Priority:** P2 | **Effort:** Low | **Impact:** Medium | **Status:** ✅ DONE

**Implementations Completed:**
- [x] Using `next/font` for automatic optimization
- [x] Added `display: "swap"` for better LCP
- [x] Added `preload: true` for priority loading
- [x] Added CSS variable `--font-inter`
- [x] Subset limited to Latin characters

**Updated Config:**
```tsx
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true
});
```

---

### 3.4 Prefetching Strategy ✅
**Priority:** P2 | **Effort:** Medium | **Impact:** Medium | **Status:** ✅ DONE

**Implementations Completed:**
- ✅ Logo link prefetches homepage
- ✅ "Today's Deals" nav link prefetches
- ✅ Mobile tab bar prefetches Home and Cart
- ✅ First 4 product cards prefetch their detail pages

**Updated Code:**
```tsx
// site-header.tsx
<Link href="/" prefetch={true}>AMZN</Link>
<Link href="/todays-deals" prefetch={true}>Today's Deals</Link>

// product-card.tsx  
<Link href={`/product/${id}`} prefetch={index < 4} />

// mobile-tab-bar.tsx
<Link href={tab.href} prefetch={tab.id === "home" || tab.id === "cart"} />
```

---

## 🟢 PHASE 4: POLISH & MICRO-INTERACTIONS (Week 3) ✅ COMPLETED

### 4.1 Animation Consistency ✅
**Priority:** P3 | **Effort:** Medium | **Impact:** Medium | **Status:** ✅ DONE

**Current:** tailwindcss-animate installed

**Implementations Completed:**
- ✅ Added keyframes for pageFadeIn, dropdownEnter, modalEnter/Exit, cartBounce, toastEnter, heartPulse
- ✅ Page transitions with fade-in animation (200ms)
- ✅ Dropdown animations with slide + fade (150ms)  
- ✅ Modal scale + fade animations (200ms)
- ✅ Cart add bounce effect (300ms)
- ✅ Toast enter animation (200ms)
- ✅ Heart/wishlist pulse animation

**Recommended Animations:**
| Element | Animation | Duration |
|---------|-----------|----------|
| Page transitions | Fade in | 200ms ✅ |
| Dropdown open | Slide down + fade | 150ms ✅ |
| Modal open | Scale + fade | 200ms ✅ |
| Cart add | Bounce effect | 300ms ✅ |
| Skeleton pulse | Pulse | Infinite |
| Toast enter | Slide up | 200ms ✅ |

---

### 4.2 Hover State Improvements ✅
**Priority:** P3 | **Effort:** Low | **Impact:** Medium | **Status:** ✅ DONE

**Current (ProductCard):** ✅ Good - has hover shadow

**Implementations Completed:**
- [x] Navigation links (underline animation with nav-link-underline class)
- [x] Category circles (scale + shadow with circle-hover class)
- [x] Brand circles (opacity change with brand-circle-hover class)
- [x] Footer links (color transition with footer-link-animated class)
- [x] Subcategory circles enhanced hover

---

### 4.3 Focus State Accessibility ✅
**Priority:** P3 | **Effort:** Low | **Impact:** High (Accessibility) | **Status:** ✅ DONE

**Current:** `outline-ring/50` applied globally (good)

**Implementations Completed:**
- [x] All interactive elements have visible focus ring (via button base class)
- [x] Focus ring uses design system ring color with consistent 3px width
- [x] Skip links enhanced with ring-2 focus states and translations
- [x] Skip links translated for Bulgarian locale
- [x] Main content landmark changed from div to main with role="main"

---

### 4.4 Mobile Touch Feedback ✅
**Priority:** P3 | **Effort:** Low | **Impact:** Medium | **Status:** ✅ DONE

**Current Utilities (globals.css):** ✅ Enhanced
- `.touch-action-manipulation`
- `.active-scale:active`
- `.tap-transparent`
- `.circle-hover` (new)
- `.brand-circle-hover` (new)
- `.btn-hover-scale` (new)

**Applied To:**
- [x] All buttons (via button.tsx base class with active:scale-[0.98])
- [x] All links in navigation
- [x] Tab bar items (enhanced with scale-90 and opacity feedback)
- [x] Product cards (touch-action-manipulation and tap-transparent)
- [x] Filter chips (active:scale-95 with transition)
- [x] Category circles
- [x] Brand circles
- [x] Subcategory circles
- [x] Wishlist button (scale on hover/active)

---

## 📱 PHASE 5: MOBILE-SPECIFIC FIXES (Week 3-4) ✅ COMPLETED

### 5.1 Mobile Navigation ✅
**Priority:** P2 | **Effort:** Medium | **Impact:** High | **Status:** ✅ DONE

**Approach:** Clean, fast, Amazon/Target-style tab bar

**Implemented:**
- [x] Simple 4-tab navigation (Home, Menu, Cart, Account)
- [x] Compact 56px height (h-14)
- [x] Cart badge count (simple, no animations)
- [x] Safe area padding for notched devices
- [x] Touch-optimized with `touch-action-manipulation`
- [x] Prefetch on Home and Cart links for instant navigation

---

### 5.2 Mobile Header ✅
**Priority:** P2 | **Effort:** Medium | **Impact:** High | **Status:** ✅ DONE

**Implemented:**
- [x] Fixed header with z-60 (stays above content)
- [x] Compact mobile header with logo, search, cart
- [x] 56px minimum height

---

### 5.3 Mobile Search ✅
**Priority:** P2 | **Effort:** Medium | **Impact:** High | **Status:** ✅ DONE

**Approach:** Fast command dialog like Amazon app

**Implemented:**
- [x] Command dialog with instant search
- [x] Debounced product search (300ms)
- [x] Recent searches with localStorage
- [x] Trending searches
- [x] Category quick links
- [x] Keyboard shortcut (Cmd/Ctrl + K)

---

### 5.4 Mobile Filters ✅
**Priority:** P2 | **Effort:** Medium | **Impact:** Medium | **Status:** ✅ DONE

**Approach:** Simple bottom sheet, no gimmicks

**Implemented:**
- [x] Bottom sheet with 200ms transition
- [x] Accordion sections for filter groups
- [x] Clear all filters button
- [x] Show results button with count
- [x] Safe area bottom padding

---

### 5.5 Pull-to-Refresh
**Priority:** P4 | **Effort:** High | **Impact:** Low | **Status:** SKIPPED

Not needed - Next.js handles data freshness.

---

## 🌍 PHASE 6: INTERNATIONALIZATION (Week 4)

### 6.1 Translation Completeness
**Priority:** P1 | **Effort:** High | **Impact:** High

**Files:**
- `messages/en.json`
- `messages/bg.json`

**Checklist:**
- [ ] All UI strings are in translation files
- [ ] No hardcoded text in components
- [ ] Date/time formatting uses locale
- [ ] Currency formatting uses locale (already implemented ✅)
- [ ] Number formatting (e.g., reviews count)

---

### 6.2 RTL Support (Future)
**Priority:** P4 | **Effort:** High | **Impact:** Medium

If expanding to Arabic/Hebrew markets:
- [ ] Add `dir="rtl"` support
- [ ] Mirror layouts
- [ ] Flip icons

---

### 6.3 Locale-Specific Content
**Priority:** P2 | **Effort:** Medium | **Impact:** Medium

**Current:** Bulgarian (bg) and English (en)

**Considerations:**
- [ ] Bulgarian-specific payment methods
- [ ] Local shipping options
- [ ] Currency: BGN for BG, EUR for others
- [ ] Legal pages per locale

---

## 🔒 PHASE 7: ACCESSIBILITY AUDIT (Week 4)

### 7.1 WCAG 2.1 AA Compliance

**Current Good Practices:**
- ✅ Skip links implemented
- ✅ Touch targets 44px minimum
- ✅ Focus states visible
- ✅ Semantic HTML structure

**Audit Items:**
- [ ] Run axe-core automated tests
- [ ] Screen reader testing (NVDA/VoiceOver)
- [ ] Keyboard navigation testing
- [ ] Color contrast verification (especially on deals/badges)
- [ ] Alt text for all images
- [ ] ARIA labels for icon-only buttons

---

### 7.2 Screen Reader Optimization
**Priority:** P2 | **Effort:** Medium | **Impact:** High

**Add ARIA labels:**
```tsx
// Wishlist button
<button aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>

// Cart count
<span aria-label={`${count} items in cart`}>

// Star rating
<div role="img" aria-label={`${rating} out of 5 stars`}>
```

---

## 🎨 PHASE 8: DESIGN SYSTEM CLEANUP (Week 4-5)

### 8.1 Color Token Usage Audit
**Priority:** P3 | **Effort:** Medium | **Impact:** Medium

**Current:** Excellent design token system in globals.css

**Verify Consistent Usage:**
- [ ] All components use CSS variables
- [ ] No hardcoded colors
- [ ] Dark mode works correctly
- [ ] Semantic tokens used appropriately

---

### 8.2 Component Variant Cleanup
**Priority:** P3 | **Effort:** Medium | **Impact:** Low

**ProductCard Variants:**
- `default`
- `grid`
- `compact`
- `carousel`

**Audit:**
- [ ] Remove unused variants
- [ ] Document variant usage
- [ ] Ensure consistency across app

---

### 8.3 Typography Scale
**Priority:** P3 | **Effort:** Low | **Impact:** Medium

**Verify:**
- [ ] Consistent heading hierarchy (h1-h6)
- [ ] Body text sizes match design
- [ ] Line heights optimized for readability
- [ ] Font weights used consistently

---

## 📊 PHASE 9: ANALYTICS & MONITORING (Week 5)

### 9.1 Vercel Analytics (Already Installed)
**Priority:** P2 | **Effort:** Low | **Impact:** High

**Verify:**
- [ ] Page views tracking
- [ ] Web Vitals monitoring
- [ ] Custom events configured

---

### 9.2 E-commerce Event Tracking
**Priority:** P1 | **Effort:** Medium | **Impact:** High

**Events to Track:**
| Event | Parameters |
|-------|------------|
| `view_item` | product_id, category, price |
| `add_to_cart` | product_id, quantity, value |
| `remove_from_cart` | product_id, quantity |
| `begin_checkout` | value, item_count |
| `purchase` | transaction_id, value, items |
| `search` | search_term, results_count |
| `select_content` | content_type, item_id |

---

### 9.3 Error Monitoring
**Priority:** P2 | **Effort:** Medium | **Impact:** High

**Options:**
- Sentry (recommended)
- Vercel Error Tracking
- Custom error logging

---

## 📋 PRODUCTION CHECKLIST

### Pre-Launch
- [ ] All Phase 1 items complete
- [ ] All Phase 2 items complete
- [ ] Core Phase 3 items complete
- [ ] Accessibility audit passed
- [ ] Performance audit (Lighthouse 90+)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Load testing completed
- [ ] SSL certificate configured
- [ ] CDN configured
- [ ] Error monitoring active
- [ ] Analytics active

### Launch Day
- [ ] DNS configured
- [ ] Monitoring dashboards ready
- [ ] Rollback plan documented
- [ ] Support team briefed
- [ ] Social media announcements ready

### Post-Launch (Week 1)
- [ ] Monitor error rates
- [ ] Monitor Core Web Vitals
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Phase 4-5 implementation begins

---

## 📈 METRICS & SUCCESS CRITERIA

### Core Web Vitals Targets
| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | TBD |
| FID | < 100ms | TBD |
| CLS | < 0.1 | TBD |
| TTFB | < 600ms | TBD |

### Lighthouse Scores
| Category | Target |
|----------|--------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 95+ |

### Business Metrics
- Cart abandonment rate
- Conversion rate
- Average session duration
- Pages per session
- Mobile vs Desktop ratio

---

## 🗓️ TIMELINE SUMMARY

| Phase | Description | Duration | Priority |
|-------|-------------|----------|----------|
| 1 | Critical Fixes | 2-3 days | P0 |
| 2 | UX Improvements | 3-4 days | P1 |
| 3 | Performance | 3-4 days | P2 |
| 4 | Polish | 2-3 days | P3 |
| 5 | Mobile | 2-3 days | P2 |
| 6 | i18n | 1-2 days | P2 |
| 7 | Accessibility | 2 days | P2 |
| 8 | Design System | 1-2 days | P3 |
| 9 | Analytics | 1 day | P2 |

**Total Estimated Time:** 3-4 weeks for full production readiness

---

## 📝 NOTES

### Strengths Identified
1. **Excellent Design Token System** - Comprehensive CSS variables for theming
2. **Good Component Architecture** - shadcn/ui + Radix provides solid foundation
3. **Mobile-First Utilities** - Touch targets, safe areas, scroll behaviors implemented
4. **Internationalization Ready** - next-intl with locale routing
5. **Accessibility Foundation** - Skip links, focus states, semantic HTML

### Areas Needing Most Attention
1. **SEO/Meta Tags** - Missing across all pages
2. **Loading/Error States** - Need consistent implementation
3. **External Resources** - CDN 404 errors need fixing
4. **Performance** - LCP optimization needed
5. **Form Accessibility** - Autocomplete attributes missing

---

*Document maintained by: Frontend Team*  
*Last Updated: December 2024*
