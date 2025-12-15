# Mobile Product Page Audit & Fix Plan

**Page**: `/[username]/[product-slug]`  
**Component**: `components/product-page-content-new.tsx`  
**Date**: December 15, 2025  
**Tested URL**: `http://localhost:3000/indecisive_wear/kotka-f5775a26`  
**Viewport**: 390×844px (iPhone 14 Pro)

---

## Audit Results Summary

### Browser Automation Findings:
- ✅ No horizontal overflow detected
- ✅ Page loads correctly, title renders
- ⚠️ 18 elements with font-size < 12px
- ⚠️ Mixed currencies (USD + EUR) on same page
- ⚠️ 7 icon buttons missing `aria-label`
- 🔴 Hardcoded mock data detected (j\*\*\*n, m\*\*\*a, s\*\*\*k users)
- 🔴 Hardcoded stats (505K sold, 798 feedback score, 746 count)

### Console Warnings:
```
Image with src "unsplash..." was detected as LCP. 
Add loading="eager" property if above the fold.
```

---

## Touch Target Guidelines (Modern Reality Check)

### The 44px Myth vs Reality

The "44px minimum" comes from Apple's 2010 HIG. **Modern mobile UI has evolved:**

| Platform | Primary Actions | Secondary Actions | Icon Buttons |
|----------|----------------|-------------------|--------------|
| iOS (2024) | 44pt recommended | 34-40pt acceptable | 34pt min |
| Material Design 3 | 48dp for FABs | 40dp standard | 24dp icon + padding |
| eBay Mobile | 40-44px CTAs | 32-36px secondary | 32px icons |
| Amazon Mobile | 44px Buy buttons | 36px secondary | 28-32px icons |
| Our Target | **44px primary CTAs** | **36-40px secondary** | **32-40px icons** |

### Our Rules:
1. **Primary actions** (Buy Now, Add to Cart): 44px height minimum ✅
2. **Secondary actions** (Watch, Contact): 36-40px acceptable ✅  
3. **Icon buttons** (heart, zoom, arrows): 40px ideal, 36px acceptable ✅
4. **Inline text links** (See details, Learn more): Adequate padding, not 44px height
5. **Filter chips/pills**: 32-36px is fine (industry standard)

---

## 🔴 CRITICAL FIXES (P0)

### 1. Remove Hardcoded Mock Data
**Priority**: CRITICAL - Legal/Trust Issue  
**Effort**: Medium

**Files to modify**:
- `components/product-page-content-new.tsx`

**Current Issues**:
```tsx
// Lines 131-143 - FAKE seller stats
positive_feedback_percentage: 100,  // Always 100%?!
total_items_sold: 505000,           // Hardcoded 505K
feedback_score: 798,                // Hardcoded
feedback_count: 746,                // Hardcoded
ratings: { accuracy: 5.0, ... }     // All perfect 5s

// Lines 169-189 - FAKE feedback
const sampleFeedback = [
  { user: "j***n", score: 156, ... },
  { user: "m***a", score: 89, ... },
  { user: "s***k", score: 234, ... },
]
```

**Fix**:
- [ ] Fetch real seller stats from `sellers` table
- [ ] Fetch real feedback from `seller_reviews` table  
- [ ] Show empty state if no feedback exists
- [ ] Remove `sampleFeedback` array entirely

---

### 2. Fix Currency Inconsistency
**Priority**: CRITICAL - User Confusion  
**Effort**: Low

**Issue**: Main product shows `US $20.00`, related products show `€59.99`

**Root Cause**: Related products use different price formatting

**Fix**:
- [ ] Ensure consistent currency symbol throughout page
- [ ] Use user's locale/preferences for currency display
- [ ] Apply same `formatPrice()` utility everywhere

---

### 3. Remove Placeholder Product Specs
**Priority**: HIGH  
**Effort**: Low

**Current**:
```tsx
{ label: 'Brand', value: 'Generic' },
{ label: 'Model', value: 'N/A' },
```

**Fix**:
- [ ] Pull from actual product metadata
- [ ] Hide fields that have no data (don't show "N/A")
- [ ] Or remove entire "Technical Specifications" if product has no specs

---

## 🟡 IMPORTANT FIXES (P1)

### 4. Bottom Navigation Label Size
**Priority**: HIGH - Readability  
**Effort**: Low

**File**: `components/mobile-tab-bar.tsx`

**Current**: `text-2xs` (10px) - too small for older users

**Fix**: 
```tsx
// Change from:
<span className="text-2xs font-medium">

// To:
<span className="text-xs font-medium">  // 12px
```

**Note**: This is a legitimate readability issue, not about touch targets. The tap area is already 44px, but the label text is too small.

---

### 5. Review Filters Empty State
**Priority**: MEDIUM  
**Effort**: Low

**Issue**: Shows `5(0) 4(0) 3(0) 2(0) 1(0)` when there are no reviews

**Fix**:
- [ ] If `reviewCount === 0`, show simplified empty state
- [ ] Hide filter buttons entirely OR
- [ ] Show "Be the first to review" CTA only

---

### 6. Use i18n System (Remove Inline Locale Checks)
**Priority**: MEDIUM - Code Quality  
**Effort**: Medium

**Current** (throughout file):
```tsx
locale === 'bg' ? 'Магазин' : 'View Store'
locale === 'bg' ? 'Популярно.' : 'People are checking this out.'
```

**Fix**:
- [ ] Use the `t` prop that's already passed but unused (`t: _t`)
- [ ] Move all strings to `messages/en.json` and `messages/bg.json`
- [ ] Replace inline ternaries with `t('keyName')`

---

### 7. LCP Image Optimization
**Priority**: MEDIUM - Performance  
**Effort**: Low

**Console Warning**:
```
Image was detected as LCP. Add loading="eager" property.
```

**Fix**: The main product image already has `priority` prop, but verify it's working. Check if `priority` is conditionally rendered.

---

## 🟢 MINOR FIXES (P2)

### 8. Touch Target Improvements (Reasonable)

**Measured via Playwright automation:**

| Element | Measured Size | Target | Action |
|---------|---------------|--------|--------|
| Zoom button | 40×40px | 40px | ✅ OK |
| Watchlist heart (in image) | 28×28px | 36px | ⚠️ Increase |
| Nav arrows | 44×44px | 44px | ✅ OK |
| "View Store" button | 104×36px | 40px height | ⚠️ Slight increase |
| "Contact Seller" | 306×32px | 36-40px height | ⚠️ Increase |
| "See details" links | 73×20px | Touch padding | Inline link, add `py-2` |
| "Learn more" link | 76×17px | Touch padding | Inline link, add `py-2` |
| Review filter "All" | 42×34px | 36px | ✅ Acceptable |
| Review filter "5(0)" etc | 77×34px | 36px | ✅ Acceptable |
| Buy Now (sticky) | 246×40px | 44px | ⚠️ Increase to h-11 |
| Watch button (sticky) | 44×44px | 44px | ✅ OK |

**Fixes needed**:
```tsx
// Watchlist heart - change from:
className="w-7 h-7 flex items-center..."
// To:
className="w-9 h-9 flex items-center..."  // 36px

// Contact Seller - change from:
className="... h-8 ..."  // 32px
// To:
className="... h-9 ..."  // 36px

// Buy Now sticky - change from:
className="... h-10 ..."  // 40px
// To:
className="... h-11 ..."  // 44px (primary CTA)
```

---

### 9. Remove TODO Comments
**Priority**: LOW  
**Effort**: Trivial

```tsx
// Line 98 - Remove this:
t: _t, // TODO: Replace inline locale checks with t.* translations
```

---

### 10. Clean Up Unused Props Pattern
**Priority**: LOW - Code Smell  
**Effort**: Low

```tsx
// Current (ugly):
void _rating; void _reviews; void _tags;

// Better: Either use them or remove from interface
```

---

## 📋 Implementation Order

### Phase 1: Critical Data Issues (Do First)
1. Remove `sampleFeedback` mock data
2. Remove hardcoded seller stats (use real data or empty state)
3. Fix currency consistency
4. Remove placeholder specs

### Phase 2: UX Improvements
5. Bottom nav label size → `text-xs`
6. Empty reviews state
7. Implement i18n properly

### Phase 3: Polish
8. Touch target tweaks (watchlist heart, contact seller)
9. Code cleanup (TODOs, void patterns)
10. Image optimization verification

---

## Files to Modify

| File | Changes |
|------|---------|
| `components/product-page-content-new.tsx` | Mock data removal, i18n, touch targets |
| `components/mobile-tab-bar.tsx` | Label size `text-2xs` → `text-xs` |
| `components/reviews-section.tsx` | Empty state handling |
| `components/product-card.tsx` | Currency formatting consistency |
| `messages/en.json` | Add product page strings |
| `messages/bg.json` | Add product page strings |

---

## Specific Code Locations

### Mock Data to Remove (product-page-content-new.tsx)

**Lines 131-143** - Hardcoded seller stats:
```tsx
positive_feedback_percentage: 100,
total_items_sold: 505000,
feedback_score: 798,
feedback_count: 746,
ratings: { accuracy: 5.0, shipping_cost: 5.0, shipping_speed: 5.0, communication: 5.0 }
```

**Lines 169-189** - Fake feedback array:
```tsx
const sampleFeedback = [
  { user: "j***n", score: 156, text: '...' },
  { user: "m***a", score: 89, text: '...' },
  { user: "s***k", score: 234, text: '...' },
]
```

**Lines 678-684** - Placeholder specs:
```tsx
{ label: 'Brand', value: 'Generic' },
{ label: 'Model', value: 'N/A' },
```

### i18n to Fix (product-page-content-new.tsx)

**Line 98** - Unused t prop:
```tsx
t: _t, // TODO: Replace inline locale checks with t.* translations
```

Inline locale checks found at lines: 170, 173, 176, 179, 182, 240, 289, 295, 357, 487, 612, 622, 627, 631, 647, 662, 667, 696-701, and many more.

---

## What's Working Well ✅

1. **Image gallery** - Swipe, thumbnails, zoom all functional
2. **Seller banner** - Good visual hierarchy, trust signals
3. **Shipping info section** - Clear, structured layout
4. **Mobile sticky bar** - Proper height (except Buy button)
5. **`pb-safe`** - iPhone notch handling
6. **`touch-manipulation`** - Correct CSS for tap responsiveness
7. **`snap-x snap-mandatory`** - Smooth horizontal scrolling
8. **Dark mode** - Appears supported
9. **No horizontal overflow** - Layout is contained properly

---

## Notes

- The page is **structurally good** - layout, sections, and flow are solid
- Main issues are **fake data** and **minor polish**
- Touch targets are mostly fine - don't over-engineer this
- Focus on removing deceptive mock content first
- Currency mismatch between main product (USD) and related products (EUR) is jarring
