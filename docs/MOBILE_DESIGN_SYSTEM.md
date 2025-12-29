# Mobile Design System — WCAG 2.2 Compliant

> **Last Updated:** 2025-12-29  
> **Tech Stack:** shadcn/ui + Tailwind CSS v4 + OKLCH  
> **Target:** C2C/B2B Marketplace Mobile Experience  
> **WCAG Level:** AA (with AAA enhancements)

---

## Table of Contents

1. [Philosophy & Vision](#1-philosophy--vision)
2. [WCAG 2.2 Compliance](#2-wcag-22-compliance)
3. [Touch Target System](#3-touch-target-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Color System (OKLCH)](#6-color-system-oklch)
7. [Component Patterns](#7-component-patterns)
8. [Navigation Patterns](#8-navigation-patterns)
9. [Gestures & Interactions](#9-gestures--interactions)
10. [Performance](#10-performance)
11. [Accessibility Checklist](#11-accessibility-checklist)

---

## 1. Philosophy & Vision

### Core Principles

```
┌──────────────────────────────────────────────────────────────────┐
│  MOBILE-FIRST DENSE COMMERCE                                     │
│                                                                  │
│  • Information Density over White Space (Temu/Shein-inspired)   │
│  • Thumb-Zone Optimized Navigation                               │
│  • WCAG 2.2 AA Compliant Touch Targets (24px minimum)           │
│  • Sub-100ms Interaction Response                                │
│  • Native-Feel Gestures (no browser zoom/delays)                 │
│  • Trust-First Visual Hierarchy                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Design DNA

| Aspect | Our Approach | Reference |
|--------|-------------|-----------|
| **Density** | Dense, information-rich | Temu, Shein, Wish |
| **Navigation** | Bottom tab + gesture-based | Native iOS/Android |
| **Cards** | Compact, image-forward | Pinterest, Instagram Shop |
| **Pricing** | Bold, high-contrast | Amazon Mobile |
| **CTAs** | Full-width, prominent | Shopify Mobile |

---

## 2. WCAG 2.2 Compliance

### NEW in WCAG 2.2 (December 2024)

WCAG 2.2 introduces **9 new success criteria**. Here's what matters for mobile:

#### 2.5.8 Target Size (Minimum) — Level AA ⭐ CRITICAL

```
┌─────────────────────────────────────────────────────────────┐
│  WCAG 2.2 TARGET SIZE REQUIREMENTS                          │
│                                                             │
│  MINIMUM: 24×24 CSS pixels (not 44×44!)                     │
│                                                             │
│  The old 44×44 was WCAG 2.1 AAA (Target Size Enhanced).     │
│  WCAG 2.2 AA requires only 24×24 OR sufficient spacing.     │
│                                                             │
│  This enables DENSE UIs while remaining accessible!         │
└─────────────────────────────────────────────────────────────┘
```

**Our Strategy:** Use 36-40px for primary targets, 28-32px for secondary, with proper spacing.

#### 2.5.7 Dragging Movements — Level AA

All drag operations MUST have a single-pointer alternative:
- Sliders → tap to set value OR +/- buttons
- Reorderable lists → up/down buttons alongside drag handles
- Swipe-to-delete → visible delete button

```tsx
// ✅ CORRECT: Slider with alternative
<Slider value={value} onChange={setValue} />
<div className="flex gap-2">
  <Button size="icon" onClick={() => setValue(v => v - 1)}>−</Button>
  <Button size="icon" onClick={() => setValue(v => v + 1)}>+</Button>
</div>

// ❌ WRONG: Drag-only interaction
<DraggableList onReorder={reorder} /> // No alternative!
```

#### 2.4.11 Focus Not Obscured (Minimum) — Level AA

Focused elements MUST NOT be entirely hidden by:
- Sticky headers
- Cookie banners
- Bottom sheets
- Floating CTAs

```css
/* Ensure focused elements scroll into view with padding */
:focus-visible {
  scroll-margin-top: 80px;  /* Account for sticky header */
  scroll-margin-bottom: 120px; /* Account for bottom nav */
}
```

#### 3.2.6 Consistent Help — Level A

Help mechanisms (chat, FAQ, contact) must appear in **same relative location** across pages.

```tsx
// ✅ CORRECT: Help always in bottom-right of bottom sheet header
<Sheet>
  <SheetHeader>
    <SheetTitle>Checkout</SheetTitle>
    <HelpButton className="absolute right-4" /> {/* Consistent position */}
  </SheetHeader>
</Sheet>
```

#### 3.3.7 Redundant Entry — Level A

Never ask for the same info twice in a flow:
- Auto-fill shipping from billing (checkbox)
- Remember previous search terms
- Pre-populate forms from profile data

#### 3.3.8 Accessible Authentication — Level AA

Passwords MUST support:
- Copy/paste (never disable!)
- Password managers (proper autocomplete attributes)
- No cognitive tests (CAPTCHA must have alternatives)

```tsx
// ✅ CORRECT: Accessible password input
<Input
  type="password"
  autoComplete="current-password"
  // Never: onPaste={(e) => e.preventDefault()}
/>
```

---

## 3. Touch Target System

### Size Scale (WCAG 2.2 Compliant)

```
┌─────────────────────────────────────────────────────────────────┐
│  TOUCH TARGET HIERARCHY                                         │
│                                                                 │
│  ███████████████████████████████████████  48px  Hero CTA only   │
│  ██████████████████████████████████████   44px  Primary Actions │
│  █████████████████████████████████        40px  Inputs, Nav     │
│  ████████████████████████████             36px  Standard Btns   │
│  ██████████████████████                   32px  Dense Actions   │
│  ████████████████                         28px  Min w/ spacing  │
│  ██████████████                           24px  WCAG 2.2 floor  │
│                                                                 │
│  Below 24px = FAIL (unless spacing exception applies)           │
└─────────────────────────────────────────────────────────────────┘
```

### Token Mapping

```css
/* In globals.css @theme */
--spacing-touch-xs: 1.75rem;   /* 28px - Minimum with spacing */
--spacing-touch-sm: 2rem;      /* 32px - Dense buttons */
--spacing-touch: 2.25rem;      /* 36px - Standard buttons */
--spacing-touch-md: 2.5rem;    /* 40px - Inputs, main nav */
--spacing-touch-lg: 2.75rem;   /* 44px - Primary CTAs */
--spacing-touch-xl: 3rem;      /* 48px - Hero CTAs (rare) */
```

### Implementation

```tsx
// Button sizes mapped to touch targets
const buttonSizes = {
  xs: "h-7 min-w-[28px] px-2 text-xs",     // 28px - icon buttons w/ spacing
  sm: "h-8 min-w-[32px] px-3 text-xs",     // 32px - dense secondary
  default: "h-9 min-w-[36px] px-4 text-sm", // 36px - standard
  lg: "h-10 min-w-[40px] px-5 text-sm",    // 40px - prominent
  xl: "h-11 min-w-[44px] px-6 text-base",  // 44px - primary CTA
};

// Icon button (always ensure 24px min, prefer 32-36px)
<Button size="icon" className="size-9">  {/* 36px */}
  <Heart className="size-5" />
</Button>
```

### Spacing Exception Rule

Per WCAG 2.2, undersized targets (< 24px) pass IF:
- A 24px diameter circle centered on target doesn't overlap adjacent targets

```tsx
// ✅ CORRECT: 20px icons with 8px gap = 28px center-to-center (passes)
<div className="flex gap-2">
  <Button size="icon" className="size-5" />  {/* 20px */}
  <Button size="icon" className="size-5" />  {/* 20px */}
</div>

// ❌ WRONG: 20px icons with 2px gap = 22px center-to-center (fails)
<div className="flex gap-0.5">
  <Button size="icon" className="size-5" />
  <Button size="icon" className="size-5" />
</div>
```

---

## 4. Typography

### Type Scale

```css
/* Mobile-optimized type scale in globals.css */
--text-2xs: 0.625rem;      /* 10px - Badges ONLY */
--text-xs: 0.75rem;        /* 12px - Captions, timestamps */
--text-sm: 0.875rem;       /* 14px - Body text (PRIMARY) */
--text-base: 1rem;         /* 16px - Prices, emphasis */
--text-lg: 1.125rem;       /* 18px - Card titles */
--text-xl: 1.25rem;        /* 20px - Section headers */
--text-2xl: 1.5rem;        /* 24px - Page titles */
```

### Line Heights for Readability

| Size | Line Height | Ratio | Usage |
|------|-------------|-------|-------|
| text-2xs (10px) | 14px | 1.4 | Badges |
| text-xs (12px) | 16px | 1.33 | Meta, captions |
| text-sm (14px) | 20px | 1.43 | Body text |
| text-base (16px) | 24px | 1.5 | Prices |
| text-lg+ | 1.3-1.4 | - | Headings |

### Font Weights

```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Interactive labels, tabs */
--font-semibold: 600;  /* Prices, CTAs, headings */
--font-bold: 700;      /* Hero text only */
```

### Mobile Typography Rules

```tsx
// ✅ Product card price
<span className="text-base font-semibold text-price-sale">
  $29.99
</span>
<span className="text-xs text-price-original line-through">
  $49.99
</span>

// ✅ Body text
<p className="text-sm leading-relaxed text-foreground">
  Product description goes here...
</p>

// ❌ WRONG: Too small for body
<p className="text-xs">Long body text...</p>
```

---

## 5. Spacing & Layout

### The 4px Grid System

All spacing derives from 4px base:

```css
/* Spacing tokens */
--spacing-0.5: 2px;   /* Micro adjustments */
--spacing-1: 4px;     /* Minimum gap */
--spacing-1.5: 6px;   /* Tight gap */
--spacing-2: 8px;     /* Standard gap */
--spacing-3: 12px;    /* Section gap */
--spacing-4: 16px;    /* Container padding */
--spacing-5: 20px;    /* Large gap */
--spacing-6: 24px;    /* Section spacing */
```

### Container Rules

```tsx
// Page container - always px-4 for alignment
<main className="px-4">
  <section className="space-y-3">
    {/* Content */}
  </section>
</main>

// Full-bleed sections (carousels, banners)
<section className="-mx-4 px-4">
  <ScrollArea className="scroll-pl-4">
    {/* Horizontal scroll content */}
  </ScrollArea>
</section>
```

### Safe Areas

```css
/* Handle notches, home indicators */
.mobile-safe {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Bottom navigation padding */
.pb-nav {
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}
```

### Scroll Snap for Rails

```tsx
// Horizontal product rail
<div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 no-scrollbar">
  {products.map(product => (
    <ProductCard 
      key={product.id} 
      className="snap-start shrink-0 w-36" 
    />
  ))}
</div>
```

---

## 6. Color System (OKLCH)

### Why OKLCH?

```
┌─────────────────────────────────────────────────────────────┐
│  OKLCH vs HSL                                               │
│                                                             │
│  • Perceptually uniform (50% L looks 50% bright)            │
│  • Better for accessibility contrast calculations           │
│  • Smooth gradients without muddy midpoints                 │
│  • P3 wide gamut support                                    │
└─────────────────────────────────────────────────────────────┘
```

### Contrast Requirements (WCAG 2.2)

| Element | Minimum Ratio | Our Target |
|---------|---------------|------------|
| Body text | 4.5:1 | 5:1+ |
| Large text (18px+) | 3:1 | 4:1+ |
| UI components | 3:1 | 3.5:1+ |
| Focus indicators | 3:1 | 4:1+ |

### Semantic Color Tokens

```css
/* Primary palette */
--color-brand: oklch(0.48 0.22 260);           /* Primary blue */
--color-brand-dark: oklch(0.40 0.24 260);      /* Hover state */

/* Text hierarchy */
--color-foreground: oklch(0.12 0 0);           /* Primary text */
--color-muted-foreground: oklch(0.45 0 0);     /* Secondary text */

/* Prices (high contrast for scanning) */
--color-price-sale: oklch(0.50 0.22 27);       /* Sale price - warm red */
--color-price-original: oklch(0.55 0.01 250);  /* Strikethrough */
--color-price-savings: oklch(0.50 0.18 145);   /* Green savings */

/* Status colors */
--color-success: oklch(0.60 0.18 145);
--color-warning: oklch(0.75 0.16 85);
--color-error: oklch(0.55 0.25 27);
--color-info: oklch(0.55 0.18 250);

/* Stock status */
--color-stock-available: oklch(0.60 0.18 145);
--color-stock-low: oklch(0.70 0.18 65);
--color-stock-out: oklch(0.50 0.20 27);
```

### Dark Mode

```css
.dark {
  --color-background: oklch(0.18 0.02 250);
  --color-foreground: oklch(0.95 0 0);
  --color-card: oklch(0.22 0.02 250);
  
  /* Prices need adjustment for dark */
  --color-price-sale: oklch(0.65 0.22 27);
  --color-price-original: oklch(0.55 0.01 0);
}
```

---

## 7. Component Patterns

### Product Card (Mobile)

```tsx
// Compact product card for grids (2-column)
<article className="relative rounded-lg border border-border bg-card p-2">
  {/* Image */}
  <div className="relative aspect-square overflow-hidden rounded-md">
    <Image src={product.image} alt={product.name} fill />
    {/* Wishlist - touch target 36px */}
    <Button 
      size="icon" 
      variant="ghost"
      className="absolute right-1 top-1 size-9 bg-white/80 backdrop-blur"
    >
      <Heart className="size-4" />
    </Button>
    {/* Discount badge */}
    {product.discount && (
      <Badge className="absolute left-1 top-1 bg-deal text-white">
        -{product.discount}%
      </Badge>
    )}
  </div>
  
  {/* Content */}
  <div className="mt-2 space-y-1">
    <h3 className="text-sm font-medium line-clamp-2">
      {product.name}
    </h3>
    <div className="flex items-baseline gap-1.5">
      <span className="text-base font-semibold text-price-sale">
        ${product.salePrice}
      </span>
      <span className="text-xs text-price-original line-through">
        ${product.originalPrice}
      </span>
    </div>
    {/* Rating */}
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="size-3 fill-rating text-rating" />
      <span>{product.rating}</span>
      <span>({product.reviews})</span>
    </div>
  </div>
</article>
```

### Bottom Sheet

```tsx
// WCAG 2.2 compliant bottom sheet
<Sheet>
  <SheetContent side="bottom" className="rounded-t-xl">
    {/* Drag handle - provides alternative to swipe */}
    <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
    
    <SheetHeader>
      <SheetTitle>Filter Products</SheetTitle>
      <SheetDescription>
        Refine your search results
      </SheetDescription>
    </SheetHeader>
    
    {/* Content with proper scroll margin */}
    <div className="max-h-[60vh] overflow-y-auto [&_:focus-visible]:scroll-mt-4">
      {/* Filter options */}
    </div>
    
    {/* Sticky CTA */}
    <SheetFooter className="sticky bottom-0 border-t bg-background pt-4">
      <Button className="w-full h-11">Apply Filters</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Category Pills (Horizontal Scroll)

```tsx
// Filter pills with proper touch targets
<ScrollArea className="w-full whitespace-nowrap">
  <div className="flex gap-2 pb-2">
    {categories.map(cat => (
      <Button
        key={cat.id}
        variant={active === cat.id ? "default" : "secondary"}
        size="sm"
        className="h-8 shrink-0 rounded-full px-4" // 32px height
      >
        {cat.name}
      </Button>
    ))}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

### Input Fields

```tsx
// Search input with 40px height (WCAG compliant)
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
  <Input
    type="search"
    placeholder="Search products..."
    className="h-10 pl-10 pr-4 text-base" // 16px text prevents iOS zoom
    autoComplete="off"
  />
</div>

// Form input
<Input
  type="email"
  autoComplete="email"
  className="h-10 text-base" // Always 40px, 16px text
/>
```

---

## 8. Navigation Patterns

### Bottom Navigation Bar

```tsx
// Fixed bottom nav with safe area
<nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)]">
  <div className="flex h-14 items-center justify-around">
    {navItems.map(item => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex h-full min-w-[64px] flex-col items-center justify-center gap-0.5",
          "touch-manipulation", // Remove 300ms delay
          active === item.href && "text-primary"
        )}
      >
        <item.icon className="size-5" />
        <span className="text-[10px] font-medium">{item.label}</span>
      </Link>
    ))}
  </div>
</nav>
```

### Pull-to-Refresh Pattern

```tsx
// Wrap scrollable content
<PullToRefresh onRefresh={handleRefresh}>
  <div className="min-h-screen">
    {/* Content */}
  </div>
</PullToRefresh>
```

### Swipe Actions (with non-drag alternative)

```tsx
// Swipeable list item with visible alternative
<SwipeableItem
  leftAction={<Button variant="ghost">Archive</Button>}
  rightAction={<Button variant="destructive">Delete</Button>}
>
  <div className="flex items-center justify-between p-4">
    <span>{item.name}</span>
    {/* Non-drag alternative (WCAG 2.5.7) */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="size-8">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</SwipeableItem>
```

---

## 9. Gestures & Interactions

### Touch Optimization

```css
/* Global touch optimization */
.touch-manipulation {
  touch-action: manipulation; /* Removes 300ms tap delay */
}

/* Prevent accidental zoom on double-tap */
* {
  touch-action: pan-x pan-y;
}

/* Allow pinch-zoom on images only */
.pinch-zoom {
  touch-action: pinch-zoom;
}
```

### Active States

```css
/* Clear active feedback */
.interactive {
  @apply transition-colors duration-100;
}

.interactive:active {
  @apply bg-accent;
}

/* Scale feedback for buttons */
.press-scale:active {
  transform: scale(0.97);
}
```

### Focus States

```css
/* High-contrast focus ring */
:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: var(--color-ring);
  ring-offset: 2px;
  ring-offset-color: var(--color-background);
}

/* Focus scroll margin (WCAG 2.4.11) */
:focus-visible {
  scroll-margin-top: 80px;
  scroll-margin-bottom: 100px;
}
```

---

## 10. Performance

### Loading Patterns

```tsx
// Skeleton loading
<div className="space-y-3">
  <Skeleton className="h-48 w-full rounded-lg" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>

// Progressive image loading
<Image
  src={src}
  alt={alt}
  placeholder="blur"
  blurDataURL={blurHash}
  loading="lazy"
/>
```

### Animation Performance

```css
/* GPU-accelerated animations only */
.animate-slide-up {
  animation: slideUp 200ms ease-out;
  will-change: transform, opacity;
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Accessibility Checklist

### Per-Page Checklist

- [ ] All touch targets ≥ 24px (or proper spacing)
- [ ] Text contrast ≥ 4.5:1 (body), ≥ 3:1 (large text)
- [ ] Focus indicators visible with 3:1+ contrast
- [ ] Focused elements not obscured by sticky elements
- [ ] All drag actions have single-pointer alternatives
- [ ] Form fields have proper labels and autocomplete
- [ ] Error messages identify the field and describe the error
- [ ] Status messages use proper ARIA roles
- [ ] Help is in consistent location

### Testing Tools

```bash
# Automated testing
npx @axe-core/cli http://localhost:3000

# Lighthouse accessibility audit
npx lighthouse http://localhost:3000 --only-categories=accessibility
```

### Manual Testing

1. **Zoom test:** Page usable at 200% zoom
2. **Keyboard test:** All interactive elements reachable with Tab
3. **Screen reader test:** VoiceOver/TalkBack can navigate and announce content
4. **Motion test:** `prefers-reduced-motion` disables animations
5. **Touch test:** All targets easily tappable with thumb

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│  MOBILE DESIGN SYSTEM — QUICK REFERENCE                         │
├─────────────────────────────────────────────────────────────────┤
│  TOUCH TARGETS                                                  │
│  • Primary CTA: 44px (h-11)                                     │
│  • Standard button: 36px (h-9)                                  │
│  • Dense button: 32px (h-8)                                     │
│  • Minimum: 24px (with spacing)                                 │
├─────────────────────────────────────────────────────────────────┤
│  TYPOGRAPHY                                                     │
│  • Body: 14px/20px (text-sm leading-5)                          │
│  • Price: 16px/24px semibold (text-base font-semibold)          │
│  • Caption: 12px/16px (text-xs)                                 │
│  • Input: 16px (prevents iOS zoom)                              │
├─────────────────────────────────────────────────────────────────┤
│  SPACING                                                        │
│  • Container: px-4 (16px sides)                                 │
│  • Card gap: gap-3 (12px)                                       │
│  • Tight gap: gap-2 (8px)                                       │
│  • Section: space-y-6 (24px)                                    │
├─────────────────────────────────────────────────────────────────┤
│  COLORS (oklch)                                                 │
│  • Brand: oklch(0.48 0.22 260)                                  │
│  • Sale price: oklch(0.50 0.22 27)                              │
│  • Success: oklch(0.60 0.18 145)                                │
│  • Error: oklch(0.55 0.25 27)                                   │
├─────────────────────────────────────────────────────────────────┤
│  WCAG 2.2 MUSTS                                                 │
│  • Target ≥ 24px OR proper spacing                              │
│  • Drag alternatives for all swipe actions                      │
│  • Focus not obscured by sticky elements                        │
│  • Consistent help location                                     │
│  • No redundant data entry                                      │
│  • Password copy/paste allowed                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

*This document is the single source of truth for mobile UI/UX decisions. When in doubt, refer here first.*
