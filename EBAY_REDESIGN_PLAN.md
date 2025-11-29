# eBay-Inspired Redesign Plan

## Executive Summary

Transform the current "Trust Blue" Amazon-style theme into a clean, neutral eBay-inspired design. The goal is to achieve a professional, minimalist aesthetic with grey/white/black as primary colors, reserving blue exclusively for interactive elements (buttons, links, CTAs).

---

## 🎨 eBay Design Audit Findings

### Color Palette Observed
| Element | eBay Color | Current (Trust Blue) |
|---------|-----------|---------------------|
| Header Background | White (`#FFFFFF`) | Dark Blue-Gray (`oklch(0.22 0.015 250)`) |
| Header Text | Dark Gray/Black (`#191919`) | White |
| Body Background | Light Gray (`#F7F7F7`) | White |
| Primary CTA | Blue (`#3665F3`) | Blue (similar) ✓ |
| Secondary Text | Gray (`#707070`) | Gray (similar) ✓ |
| Borders | Light Gray (`#E5E5E5`) | Blue-tinted |
| Deals/Sale | Red (`#E0103A`) | Red (similar) ✓ |

### Layout Patterns
- **Max-width container**: ~1200-1400px (not full-width)
- **Header**: Compact, white background, minimal design
- **Subheader**: Visible category links with dropdown mega menus for ALL categories
- **Content areas**: Cards with subtle shadows, generous whitespace
- **Deals section**: Horizontal scrolling with tabs

### Typography
- Clean sans-serif fonts (Market Sans / similar to Inter)
- Clear hierarchy with consistent sizing
- Dark text on light backgrounds

---

## 📋 Implementation Checklist

### Phase 1: Color System Overhaul
- [ ] Convert dark header to light/white
- [ ] Update CSS custom properties to neutral palette
- [ ] Remove blue tint from borders and backgrounds
- [ ] Keep blue ONLY for buttons, links, and interactive states
- [ ] Update focus states to use blue ring

### Phase 2: Header Redesign
- [ ] Light header background (`bg-white`)
- [ ] Dark text for header links
- [ ] Simplified logo area
- [ ] Category subheader with hover mega menus for ALL categories
- [ ] Contained max-width layout

### Phase 3: Layout Updates
- [ ] Add max-width container (1280px) for main content
- [ ] Increase category circles on desktop (from 80px to 120px+)
- [ ] Add more whitespace/padding throughout
- [ ] Update card shadows to be subtler

### Phase 4: Component Updates
- [ ] Update DealsSection for eBay-style horizontal scrolling
- [ ] Extend MegaMenu to ALL category links in subheader
- [ ] Update product cards to match neutral styling

---

## 🔧 Detailed Technical Changes

### 1. globals.css - Color System

**BEFORE (Trust Blue):**
```css
@theme inline {
  --brand: oklch(0.50 0.18 250);
  --brand-light: oklch(0.95 0.03 250);
  --header-bg: oklch(0.22 0.015 250);
  --header-text: oklch(1 0 0);
  --border: oklch(0.85 0.01 250);
}
```

**AFTER (eBay Neutral):**
```css
@theme inline {
  /* Primary blue - ONLY for CTAs and interactive elements */
  --brand: oklch(0.50 0.20 260);
  --brand-light: oklch(0.97 0.01 260);
  
  /* Header - Light/White */
  --header-bg: oklch(1 0 0);
  --header-text: oklch(0.15 0 0);
  --header-hover: oklch(0.96 0 0);
  
  /* Borders - Neutral gray (no blue tint) */
  --border: oklch(0.90 0 0);
  --border-hover: oklch(0.80 0 0);
  
  /* Background - Subtle gray */
  --background: oklch(0.98 0 0);
  --card: oklch(1 0 0);
  
  /* Text - Dark for readability */
  --foreground: oklch(0.15 0 0);
  --muted-foreground: oklch(0.45 0 0);
}
```

### 2. site-header.tsx - Light Header with Category Subheader

**Key Changes:**
- White header background
- Dark text color
- Add category subheader with individual mega menus
- Contained width layout

**NEW Structure:**
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]  [Search Bar (with category dropdown)]  [Account/Cart]│  ← Main Header (white)
├──────────────────────────────────────────────────────────────┤
│ Electronics ▼ | Fashion ▼ | Home ▼ | Deals | More ▼         │  ← Category Subheader (light gray)
└──────────────────────────────────────────────────────────────┘
```

### 3. Category Subheader Component (NEW)

Create `components/category-subheader.tsx`:

```tsx
// Each category link triggers its own MegaMenu on hover
// Similar to eBay's "Shop by category" dropdown behavior
// Shows max 6-8 categories + "More" dropdown

const visibleCategories = [
  "Electronics",
  "Fashion", 
  "Home & Garden",
  "Sports",
  "Toys",
  "Motors"
];

// "More" contains remaining categories
```

### 4. Container Layout Updates

**Add contained max-width:**
```css
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 1536px) {
  .main-container {
    max-width: 1400px;
  }
}
```

### 5. Category Circles - Desktop Size Increase

**Current:**
```tsx
<div className="w-20 h-20 rounded-full" /> /* 80px */
```

**Target:**
```tsx
<div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full" /> /* 96-128px */
```

### 6. Deals Section - Horizontal Scroll Enhancement

The current `DealsSection` already has horizontal scrolling but needs:
- More visible scroll indicators
- Larger "Shop all" link
- Tab styling to match eBay's cleaner look
- Snap scrolling on mobile

---

## 📁 Files to Modify

| File | Changes |
|------|---------|
| `app/globals.css` | Complete color system overhaul |
| `components/site-header.tsx` | Light header, add subheader |
| `components/category-subheader.tsx` | NEW - Category nav with mega menus |
| `components/mega-menu.tsx` | Refactor to work with subheader |
| `components/category-circles.tsx` | Increase desktop sizes |
| `components/deals-section.tsx` | Enhance horizontal scroll UX |
| `components/product-card.tsx` | Update to neutral styling |
| `app/[locale]/page.tsx` | Add container wrapper |
| `app/[locale]/layout.tsx` | Update background color |

---

## 🎯 Priority Order

### Must Have (P0)
1. ✅ Header color change (white background, dark text)
2. ✅ CSS custom properties update (neutral palette)
3. ✅ Category subheader with mega menus

### Should Have (P1)
4. Container max-width for content
5. Larger category circles on desktop
6. Enhanced deals horizontal scrolling

### Nice to Have (P2)
7. Subtle hover animations like eBay
8. Updated card shadow styles
9. Footer redesign to match

---

## 🖼️ Visual Comparison

### Header Before (Trust Blue)
```
┌──────────────────────────────────────────────────────────────┐
│ 🔵🔵🔵🔵🔵🔵🔵🔵🔵  DARK BLUE HEADER  🔵🔵🔵🔵🔵🔵🔵🔵🔵│
│ [Logo] [Location] [Search............] [Account][Cart]      │
│ [All Categories ▼] [Deals] [Sell] [Help]                    │
└──────────────────────────────────────────────────────────────┘
```

### Header After (eBay Style)
```
┌──────────────────────────────────────────────────────────────┐
│ ⬜⬜⬜⬜⬜⬜⬜⬜⬜  WHITE HEADER  ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜│
│ [Logo]        [🔍 Search...  |Category▼|]    [Account][Cart]│
├──────────────────────────────────────────────────────────────┤
│ Electronics▼ | Fashion▼ | Home▼ | Sports | Deals | More▼    │  ← NEW Subheader
└──────────────────────────────────────────────────────────────┘
```

---

## 📝 CSS Variables Complete Reference

```css
/* ═══════════════════════════════════════════════════════════
   EBAY-INSPIRED NEUTRAL THEME
   ═══════════════════════════════════════════════════════════ */

:root {
  /* ─────────────────────────────────────────────────────────
     BRAND (Blue - Interactive Elements ONLY)
     ───────────────────────────────────────────────────────── */
  --brand: oklch(0.48 0.22 260);           /* #3665F3 - eBay Blue */
  --brand-hover: oklch(0.42 0.24 260);     /* Darker on hover */
  --brand-light: oklch(0.97 0.02 260);     /* Very light blue bg */

  /* ─────────────────────────────────────────────────────────
     HEADER (Light/White)
     ───────────────────────────────────────────────────────── */
  --header-bg: oklch(1 0 0);               /* Pure white */
  --header-text: oklch(0.12 0 0);          /* Near black */
  --header-text-muted: oklch(0.45 0 0);    /* Gray for secondary */
  --header-border: oklch(0.88 0 0);        /* Subtle divider */

  /* ─────────────────────────────────────────────────────────
     SUBHEADER (Slight gray)
     ───────────────────────────────────────────────────────── */
  --subheader-bg: oklch(0.98 0 0);         /* Very light gray */
  --subheader-hover: oklch(0.94 0 0);      /* Hover state */

  /* ─────────────────────────────────────────────────────────
     BACKGROUNDS
     ───────────────────────────────────────────────────────── */
  --background: oklch(0.97 0 0);           /* Page bg - light gray */
  --card: oklch(1 0 0);                    /* Card bg - white */
  --muted: oklch(0.94 0 0);                /* Muted areas */

  /* ─────────────────────────────────────────────────────────
     TEXT
     ───────────────────────────────────────────────────────── */
  --foreground: oklch(0.12 0 0);           /* Primary text - near black */
  --muted-foreground: oklch(0.45 0 0);     /* Secondary text - gray */

  /* ─────────────────────────────────────────────────────────
     BORDERS (Neutral - no blue tint)
     ───────────────────────────────────────────────────────── */
  --border: oklch(0.88 0 0);               /* Default border */
  --border-hover: oklch(0.75 0 0);         /* Border on hover */
  --ring: oklch(0.48 0.22 260);            /* Focus ring - brand blue */

  /* ─────────────────────────────────────────────────────────
     E-COMMERCE (Keep existing deal/price colors)
     ───────────────────────────────────────────────────────── */
  --deal: oklch(0.55 0.22 25);             /* Red deals */
  --price-sale: oklch(0.50 0.20 25);       /* Sale price red */
  --stock-available: oklch(0.50 0.16 145); /* Green in-stock */
}
```

---

## 🚀 Implementation Steps

### Step 1: Update globals.css (30 min)
Replace the color system with neutral values while keeping e-commerce tokens.

### Step 2: Update site-header.tsx (45 min)
- Change background to white
- Update text colors to dark
- Restructure for subheader integration

### Step 3: Create category-subheader.tsx (60 min)
- New component with category links
- Each link has hover mega menu
- "More" dropdown for additional categories

### Step 4: Refactor mega-menu.tsx (45 min)
- Make it reusable for any category
- Update styling for light theme
- Accept category prop

### Step 5: Update layout containers (30 min)
- Add max-width wrapper
- Update padding/margins

### Step 6: Update category circles (20 min)
- Increase sizes on desktop
- Test responsive behavior

### Step 7: Testing & Polish (60 min)
- Cross-browser testing
- Mobile responsiveness
- Dark mode compatibility (if applicable)

---

## ⚠️ Breaking Changes to Watch

1. **Header contrast**: Dark text on white - ensure sufficient contrast
2. **Mega menu positioning**: May need adjustment for light header
3. **Active states**: Need to be visible against white background
4. **Border visibility**: Neutral borders may need slightly darker values

---

## 📱 Mobile Considerations

- Keep mobile header compact
- Hamburger menu should use consistent neutral colors
- Touch targets remain large (min 44px)
- Horizontal scroll for deals works well on touch

---

## ✅ Success Criteria

- [ ] Header is white/light with dark text
- [ ] Blue appears ONLY on buttons, links, and interactive elements
- [ ] Category subheader shows all main categories with mega menus
- [ ] Content has max-width container (not full-width)
- [ ] Category circles are 120px+ on desktop
- [ ] Deals section scrolls horizontally smoothly
- [ ] Overall feel is clean, neutral, professional (like eBay)

---

## 📅 Estimated Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Color System | 1 hour | P0 |
| Header Redesign | 2 hours | P0 |
| Category Subheader | 2 hours | P0 |
| Layout Updates | 1 hour | P1 |
| Component Polish | 2 hours | P1 |
| Testing | 1 hour | P0 |
| **Total** | **~9 hours** | |

---

*Generated based on eBay.com audit conducted via Playwright browser automation.*
*Last updated: Current session*
