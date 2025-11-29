# Amazon Mobile Design Audit & Implementation Plan

## 📱 Current Issue Analysis

After analyzing both our mobile homepage and Amazon's mobile UI, here are the key problems:

### ❌ Current Problems on Mobile

1. **Heavy Container Styling** 
   - "Открий популярни продукти" and "Оферти на деня" sections wrapped in `bg-card border border-border` containers
   - Creates visual heaviness and "boxed in" feeling
   - Consumes precious vertical space with padding and borders

2. **Visual Clutter**
   - CategoryCircles + BrandCircles back-to-back is overwhelming
   - DailyDealsBanner adds another red visual element
   - Too many card borders competing for attention

3. **Hero Too Small**
   - Currently `h-[150px]` on mobile
   - Amazon uses much larger hero (nearly full viewport width with generous height)

---

## ✅ Amazon Mobile Design Patterns (What Works)

### Key Observations from Amazon Mobile:

1. **NO Container Backgrounds on Sections**
   - Content sits directly on the page background
   - Sections separated by **subtle separators** not cards
   - Clean whitespace breathes between sections

2. **Simple Section Pattern**
   ```
   [Section Heading] ─────────── [See more →]
   
   [2x2 Grid OR Horizontal Scroll]
   
   ─────── separator ───────
   ```

3. **Large Hero Carousel**
   - Takes significant viewport space
   - Full-width, impactful imagery

4. **Minimal Visual Noise**
   - Product cards are simple: image + text (no heavy borders)
   - Section headings are left-aligned, simple text
   - "See more" links are subtle, right-aligned

---

## 🎯 Implementation Plan

### Phase 1: Remove Container Backgrounds on Mobile

**Files to Modify:**
- `components/tabbed-product-section.tsx`
- `components/deals-section.tsx`
- `app/[locale]/page.tsx` (Featured Categories section)

**Changes:**
```tsx
// OLD (current)
<div className="rounded-md overflow-hidden bg-card border border-border">

// NEW (Amazon-style - conditional mobile styling)
<div className="rounded-md overflow-hidden sm:bg-card sm:border sm:border-border">
// On mobile: no background, no border
// On desktop: keep the card styling
```

### Phase 2: Add shadcn Separator Between Sections

**Import:**
```tsx
import { Separator } from "@/components/ui/separator"
```

**Usage in page.tsx:**
```tsx
{/* Section 1 */}
<TabbedProductSection ... />

<Separator className="my-4 sm:my-6" />

{/* Section 2 */}
<DealsSection ... />

<Separator className="my-4 sm:my-6" />
```

### Phase 3: Increase Hero Height

**File:** `components/hero-carousel.tsx`

```tsx
// OLD
h-[150px] sm:h-[200px] md:h-[300px] lg:h-[380px]

// NEW
h-[180px] sm:h-[200px] md:h-[300px] lg:h-[380px]
```

### Phase 4: Remove DailyDealsBanner

**File:** `app/[locale]/page.tsx`

- Remove `<DailyDealsBanner>` component entirely
- The countdown timer can optionally move to DealsSection header

### Phase 5: Simplify Section Headers

**Current TabbedProductSection header:**
```tsx
<div className="text-center pt-5 sm:pt-6 pb-3 sm:pb-4 px-4">
  <h2>Title</h2>
  <Link>See more</Link>
</div>
```

**Amazon-style header:**
```tsx
<div className="flex items-center justify-between px-4 pt-4 pb-2">
  <h2 className="text-base sm:text-lg font-semibold">Title</h2>
  <Link className="text-sm text-brand-blue">See more →</Link>
</div>
```

---

## 📋 Implementation Checklist

### Priority 1 - Quick Wins
- [ ] Increase hero height: 150px → 180px
- [ ] Remove DailyDealsBanner component
- [ ] Change Sparkle icon in sidebar-menu.tsx

### Priority 2 - Container Removal
- [ ] TabbedProductSection: Remove `bg-card border` on mobile
- [ ] DealsSection: Remove `bg-card border` on mobile  
- [ ] Featured Categories: Remove card wrapper on mobile

### Priority 3 - Separators & Layout
- [ ] Add `<Separator>` between major sections on mobile
- [ ] Simplify section headers to left-aligned with right-side "See more"
- [ ] Reduce vertical padding on mobile sections

### Priority 4 - Polish
- [ ] Consider moving BrandCircles lower (after DealsSection)
- [ ] Review spacing consistency throughout

---

## 📐 Mobile Layout After Changes

```
┌─────────────────────────────┐
│      HERO CAROUSEL          │  ← Taller (180px)
│   (Full width, big impact)  │
└─────────────────────────────┘
     Category Circles (scroll)

─────────────────────────────── ← Separator

Открий популярни продукти  →
[Product] [Product] scroll...

─────────────────────────────── ← Separator

Оферти на деня  →
[Deal] [Deal] scroll...

─────────────────────────────── ← Separator

     Brand Circles (scroll)

─────────────────────────────── ← Separator

[2x2 Category Grid Cards]

─────────────────────────────── ← Separator

Още начини за пазаруване
[Card] [Card] scroll...
```

---

## 🎨 Visual Comparison

| Element | Before | After |
|---------|--------|-------|
| Section containers | Heavy `bg-card border` | Transparent, open |
| Section separation | Card borders | Subtle `<Separator>` |
| Hero height | 150px | 180px |
| DailyDealsBanner | Red banner present | Removed |
| Section headers | Centered | Left-aligned + right CTA |

---

## Files to Modify

1. `components/hero-carousel.tsx` - Height increase
2. `components/tabbed-product-section.tsx` - Remove mobile container
3. `components/deals-section.tsx` - Remove mobile container
4. `components/sidebar-menu.tsx` - Change Sparkle icon
5. `app/[locale]/page.tsx` - Remove DailyDealsBanner, add Separators

Ready to implement? Confirm and I'll start with the changes.
