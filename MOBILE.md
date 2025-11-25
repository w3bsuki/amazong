# Mobile UI/UX Improvement Plan

## 📱 Mobile Audit Summary

**Audit Date:** November 25, 2025  
**Test Device:** iPhone 12 Pro (375x812)  
**Framework:** Next.js 15 + Tailwind CSS v4 + shadcn/ui

---

## 🔴 Critical Issues Identified

### 1. Header Issues (Priority: HIGH)

#### Problem: Search Bar Overflow
- The header search bar doesn't fit properly on mobile
- Category dropdown, search input, and button are cramped
- No mobile-optimized search experience

#### Problem: Header Elements Too Compressed
- Account text "Акаунт и списъци ▼" is too long for mobile
- Language switcher takes up valuable space
- Right side icons are cramped

#### Problem: Bottom Navigation Bar Overflow
- Navigation links overflow horizontally without proper scroll indicators
- "Обслужване на клиенти" (Customer Service) text is truncated
- No visual indication that content is scrollable

### 2. Product Card Issues (Priority: HIGH)

#### Problem: Card Layout
- Product cards take full width on mobile (1 column) but should show 2 per row for better UX
- Add-to-cart button touch targets may be small
- Image aspect ratio could be optimized

### 3. Footer Issues (Priority: MEDIUM)

#### Problem: Footer Grid
- 4-column grid on mobile is too compressed
- Link text is very small (text-xs)
- Not enough breathing room between sections

### 4. Category Section Issues (Priority: MEDIUM)

#### Problem: Category Circles
- No visible scroll indicators
- No snap scrolling for better UX
- Categories may appear cut off

### 5. Touch Targets (Priority: HIGH)

#### Problem: Small Interactive Elements
- Many buttons and links don't meet the 44x44px minimum touch target recommended by Apple
- Filter chips on search page are small
- Pagination buttons could be larger

---

## ✅ Recommended Fixes

### Phase 1: Header Optimization (Critical)

#### 1.1 Mobile Header Restructure
```tsx
// Recommended structure for mobile header
// File: components/site-header.tsx

// Current: Single row header with all elements
// Proposed: Two-row mobile header

// Row 1: Logo + Search Icon + Cart
// Row 2: Expandable search (on tap)

// Implementation:
- Add `useIsMobile()` hook check
- Create separate MobileHeader component
- Use Sheet for expandable search
- Move account/language to hamburger menu
```

#### 1.2 Mobile Search Experience
```tsx
// New component: components/mobile-search.tsx

"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function MobileSearch() {
  const [open, setOpen] = useState(false)
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto">
        {/* Full-width search input */}
        {/* Category filter */}
        {/* Recent searches */}
      </SheetContent>
    </Sheet>
  )
}
```

#### 1.3 Mobile Navigation Improvements
```css
/* Add to globals.css */

/* Snap scroll for mobile navigation */
.mobile-nav-scroll {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.mobile-nav-scroll > * {
  scroll-snap-align: start;
}

/* Gradient fade indicators */
.mobile-nav-container::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to right, transparent, rgb(39 39 42));
  pointer-events: none;
}
```

### Phase 2: Touch Target Optimization

#### 2.1 Minimum Touch Targets
```tsx
// Update all interactive elements to minimum 44x44px

// Button component updates
// File: components/ui/button.tsx

// Add mobile-optimized variant
const buttonVariants = cva(
  "...",
  {
    variants: {
      size: {
        // Add new mobile size
        mobile: "h-11 min-w-11 px-4 py-2.5",
      }
    }
  }
)

// Usage with responsive sizes
<Button size={{ default: "default", sm: "mobile" }}>
```

#### 2.2 Improved Filter Chips
```tsx
// File: components/search-filters.tsx

// Current: Small pills
// Proposed: Larger touch-friendly pills

<div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
  {filters.map(filter => (
    <button
      key={filter.id}
      className="
        snap-start
        flex-shrink-0
        h-10          // Increased height
        px-4          // Increased padding
        text-sm
        font-medium
        rounded-full
        border
        active:scale-95
        transition-transform
      "
    >
      {filter.label}
    </button>
  ))}
</div>
```

### Phase 3: Product Grid Optimization

#### 3.1 Responsive Product Grid
```tsx
// File: components/product-card.tsx

// Update grid in parent components:
<div className="
  grid 
  grid-cols-2        // 2 columns on mobile
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  gap-3              // Smaller gap on mobile
  sm:gap-4 
  md:gap-5
">
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</div>

// Update ProductCard for mobile:
- Reduce padding on mobile: p-2 sm:p-4
- Smaller image aspect ratio: aspect-square on mobile
- Truncate title to 2 lines
- Smaller text sizes
- Full-width add-to-cart button
```

#### 3.2 Mobile Product Card Variant
```tsx
// Create compact mobile variant

export function ProductCardMobile({ ... }) {
  return (
    <Card className="p-2 rounded-lg">
      <div className="aspect-square relative bg-slate-50 rounded-md overflow-hidden">
        <Image ... />
      </div>
      <div className="p-2">
        <h3 className="text-xs font-medium line-clamp-2 h-8">
          {title}
        </h3>
        <div className="flex items-center gap-1 my-1">
          <StarRating size="xs" rating={rating} />
          <span className="text-[10px] text-slate-500">{reviews}</span>
        </div>
        <div className="text-base font-bold">{formatPrice(price)}</div>
        <Button 
          size="sm" 
          className="w-full mt-2 h-9 text-xs"
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  )
}
```

### Phase 4: Footer Optimization

#### 4.1 Mobile Footer Restructure
```tsx
// File: components/site-footer.tsx

// Current: 4-column grid always
// Proposed: Collapsible accordion on mobile

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function SiteFooter() {
  return (
    <footer>
      {/* Back to Top - Keep as is */}
      
      {/* Mobile: Accordion */}
      <div className="md:hidden px-4 py-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="get-to-know">
            <AccordionTrigger className="text-sm font-bold">
              {t('getToKnow')}
            </AccordionTrigger>
            <AccordionContent>
              {/* Links */}
            </AccordionContent>
          </AccordionItem>
          {/* ... more sections */}
        </Accordion>
      </div>
      
      {/* Desktop: Grid - Keep existing */}
      <div className="hidden md:grid ...">
        {/* Existing grid layout */}
      </div>
    </footer>
  )
}
```

### Phase 5: Mobile-First Component Updates

#### 5.1 Hero Carousel
```tsx
// File: components/hero-carousel.tsx

// Improvements:
- Reduce height on mobile: h-[200px] sm:h-[240px] md:h-[360px]
- Larger touch targets for prev/next buttons
- Pagination dots at bottom for mobile
- Swipe gesture support (already via embla)

// Add dot indicators for mobile
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
  {slides.map((_, i) => (
    <button
      key={i}
      className={cn(
        "w-2 h-2 rounded-full transition-colors",
        currentSlide === i ? "bg-white" : "bg-white/50"
      )}
      onClick={() => api?.scrollTo(i)}
    />
  ))}
</div>
```

#### 5.2 Daily Deals Banner
```tsx
// File: components/daily-deals-banner.tsx

// Mobile optimizations:
- Stack elements vertically on mobile
- Larger countdown timer
- Full-width CTA button on mobile
```

#### 5.3 Category Circles
```tsx
// File: components/category-circles.tsx

// Improvements:
- Add scroll snap
- Show scroll progress indicator
- Larger touch targets
- Add "scroll for more" indicator on mobile

<div className="relative">
  <div className="
    flex gap-4 
    overflow-x-auto 
    no-scrollbar 
    snap-x snap-mandatory
    pb-2
  ">
    {categories.map(cat => (
      <Link 
        key={cat.id}
        href={cat.href}
        className="
          snap-start 
          flex-shrink-0 
          w-20     // Fixed width for mobile
          flex flex-col items-center gap-2
          p-2
          active:scale-95 transition-transform
        "
      >
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
          {cat.icon}
        </div>
        <span className="text-xs text-center line-clamp-1">{cat.name}</span>
      </Link>
    ))}
  </div>
  
  {/* Scroll indicator */}
  <div className="
    absolute right-0 top-0 bottom-0 w-8
    bg-gradient-to-l from-slate-100 to-transparent
    pointer-events-none
    md:hidden
  " />
</div>
```

### Phase 6: Sidebar Menu Improvements

#### 6.1 Mobile Sidebar Enhancements
```tsx
// File: components/sidebar-menu.tsx

// Improvements:
- Add user avatar/profile section at top
- Add search within sidebar
- Smooth transitions
- Better section separators
- Recent viewed items section

// Update SheetContent
<SheetContent 
  side="left" 
  className="
    w-[85vw] max-w-[320px]  // Relative width for different devices
    p-0 
    border-r-0 
    bg-white 
    text-black
  "
>
```

### Phase 7: New Mobile-Specific Components

#### 7.1 Mobile Bottom Tab Bar (Optional Enhancement)
```tsx
// New component: components/mobile-tab-bar.tsx

"use client"

import { Home, Search, ShoppingCart, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/routing"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

export function MobileTabBar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  
  const tabs = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: ShoppingCart, label: "Cart", href: "/cart", badge: totalItems },
    { icon: User, label: "Account", href: "/account" },
  ]
  
  return (
    <nav className="
      fixed bottom-0 left-0 right-0 
      bg-white border-t border-slate-200
      px-2 pb-safe       // Safe area for notched phones
      md:hidden
      z-50
    ">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 h-full",
              pathname === tab.href ? "text-blue-600" : "text-slate-500"
            )}
          >
            <div className="relative">
              <tab.icon className="h-6 w-6" />
              {tab.badge > 0 && (
                <span className="
                  absolute -top-1 -right-1 
                  bg-blue-600 text-white text-[10px] 
                  w-4 h-4 rounded-full 
                  flex items-center justify-center
                ">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
```

#### 7.2 Pull-to-Refresh (Optional Enhancement)
```tsx
// Consider adding pull-to-refresh for key pages
// Can be implemented with a library or custom hook
```

---

## 📋 Implementation Checklist

### Priority 1 (Critical - Do First)
- [ ] Restructure mobile header with collapsible search
- [ ] Fix navigation bar horizontal scroll with indicators
- [ ] Increase all touch targets to minimum 44x44px
- [ ] Update product grid to 2 columns on mobile

### Priority 2 (High)
- [ ] Implement mobile-optimized footer with accordion
- [ ] Add scroll snap to category circles
- [ ] Optimize hero carousel for mobile
- [ ] Improve sidebar menu UX

### Priority 3 (Medium)
- [ ] Add mobile bottom tab bar (optional)
- [ ] Implement mobile search sheet
- [ ] Add loading skeletons for mobile
- [ ] Optimize images with proper sizes attribute

### Priority 4 (Nice to Have)
- [ ] Add pull-to-refresh
- [ ] Implement haptic feedback for interactions
- [ ] Add gesture navigation support
- [ ] Optimize animations for 60fps

---

## 🎨 Tailwind CSS v4 Best Practices

### Use Container Queries
```css
/* Modern approach with container queries */
@container (max-width: 400px) {
  .product-card {
    /* Mobile-specific styles */
  }
}
```

### Responsive Design Patterns
```tsx
// Use responsive variants properly
<div className="
  p-3 sm:p-4 md:p-6
  text-sm sm:text-base
  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
">

// Use clamp for fluid typography
<h1 className="text-[clamp(1.25rem,4vw,2rem)]">
```

### Safe Area Insets
```css
/* Add to globals.css for notched phones */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.pt-safe {
  padding-top: env(safe-area-inset-top);
}
```

---

## 🔧 Testing Recommendations

### Device Testing
- iPhone SE (320px width - minimum)
- iPhone 12/13/14 (375px width - standard)
- iPhone 14 Pro Max (428px width - large)
- Samsung Galaxy S21 (360px width)
- iPad Mini (768px width - tablet breakpoint)

### Testing Tools
- Chrome DevTools Device Mode
- Safari Responsive Design Mode
- BrowserStack for real device testing
- Lighthouse for performance audits

### Key Metrics to Track
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Touch target size >= 44x44px
- Scroll performance (consistent 60fps)

---

## 📚 Resources

- [shadcn/ui Mobile Patterns](https://ui.shadcn.com/)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Apple HIG - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/)
- [Google Material Design - Mobile](https://m3.material.io/)
- [Web.dev Mobile Best Practices](https://web.dev/mobile/)

---

## 📝 Notes

### What's Working Well
- Sidebar menu implementation is solid
- Hero carousel has good swipe support
- Color scheme works well on mobile
- Product images are optimized with Next.js Image

### Quick Wins
1. Add `viewport-fit=cover` to head for notched phones
2. Add `touch-action: manipulation` to buttons for instant response
3. Use `will-change: transform` for frequently animated elements
4. Add `-webkit-tap-highlight-color: transparent` for cleaner taps

---

*Last Updated: November 25, 2025*
