# Temu UI/UX Audit - Mobile & Desktop Patterns

> **Goal**: Capture Temu's UI/UX patterns and use them to build BETTER, not just copy.

## Overview

Temu uses a **dense, information-rich marketplace layout** with tight padding, strong visual hierarchy, and instant-feedback interactions. Their design prioritizes **trust signals**, **social proof**, and **urgency cues**.

---

## 1. Trust Bar (Top of Page)

Located immediately below the header, this is a horizontal strip of trust signals:

### Pattern:
```
[Free shipping] | [Delivery guarantee] | [Free returns] | [Price adjustment] | [Min Order Value]
     ✓ icon          Refund for issues      Up to 90 days*     Within 30 days          ✓
```

### Key Observations:
- **Icon + Short Text** format (very scannable)
- Neutral background (subtle gray/white)
- Uses **checkmarks** and **shield icons** for trust
- Each benefit is **concise**: 3-5 words max
- Horizontal scroll on mobile

### How to Improve:
- Add **clickable tooltips** explaining each guarantee
- Use **subtle animation on hover** to draw attention
- Consider **sticky behavior** on scroll for key messages

---

## 2. Navigation Header

### Structure:
```
[Logo] [Best-Selling Items] [5-Star Rated] [Categories ▼] [Search Box] [Orders & Account] [Support] [Language] [Cart]
```

### Key Observations:
- **Prominent search bar** (takes ~40-50% of header width)
- **Categories button** is highly visible with dropdown icon
- Quick links to **Best-Selling** and **5-Star Rated** (curated entry points)
- Cart shows **item count badge**
- Language/locale selector is accessible

### Categories Behavior (Key UX Pattern):
When clicking on Categories:
1. **No page reload** - instant JS-driven panel
2. Selected category **moves to first position** in the tab row
3. **Subcategories appear as circles** with icons below
4. Back button returns to previous state seamlessly

### How to Improve:
- Add **search suggestions/autocomplete** as user types
- Include **recent searches** in dropdown
- Use **mega menu** for categories with images
- Add **keyboard navigation** for accessibility

---

## 3. Product Card Layout

### Desktop Card Structure:
```
┌─────────────────────────┐
│                         │
│      [Product Image]    │
│         with hover      │
│         zoom/swap       │
│                         │
├─────────────────────────┤
│ €50.78                  │  ← Bold price, large font
│ 3.1K+ sold              │  ← Social proof (gray, smaller)
│ RRP €XX.XX Details ⓘ    │  ← Strikethrough + discount indicator
│ ★★★★★ 4.7 (1.2K)        │  ← Star rating + count
└─────────────────────────┘
```

### Key Metrics Displayed:
1. **Price** - Largest, bold, brand color (often orange/red)
2. **Sold count** - "3.1K+ sold" (social proof)
3. **Original price (RRP)** - Strikethrough, shows discount
4. **Star rating** - Visual stars + number
5. **Review count** - In parentheses

### Spacing & Sizing:
- **Tight padding**: ~8-12px internal padding
- **Image aspect ratio**: Square or slightly taller (1:1 to 3:4)
- **Font sizes**:
  - Price: ~16-18px, bold/semibold
  - Title: ~13-14px, regular, 2-line clamp
  - Metadata: ~11-12px, gray

### How to Improve:
- Add **"Add to Cart" button on hover**
- Include **wishlist heart icon** in corner
- Show **shipping estimate** on card
- Add **"New" or "Sale" badges** more prominently

---

## 4. Product Grid

### Layout:
- **Desktop**: 4-5 cards per row
- **Tablet**: 3 cards per row
- **Mobile**: 2 cards per row
- **Gap**: ~12-16px between cards

### Section Headers:
```
"Top picks" [See all →]
─────────────────────────
```

- Section title: Large, bold
- "See all" link: Right-aligned, smaller
- Optional: Filter chips below header

### How to Improve:
- Add **infinite scroll** with skeleton loading
- Include **"Load more" button** as fallback
- Show **category breadcrumb trail**
- Add **quick filters** (price range, rating, shipping)

---

## 5. Category Tabs (Key UX Pattern)

### Desktop Behavior:
```
[Electronics] [Home] [Fashion] [Beauty] [Sports] [More ▼]
     ↓ selected
─────────────────────────────────────────────────────────
[📱 Phones] [💻 Laptops] [🎧 Audio] [⌚ Wearables] [🎮 Gaming]
   subcategory circles with icons
```

### Mobile Behavior:
- Horizontal scrollable tabs
- Selected tab **moves to first position**
- Subcategories appear as **horizontal scrollable circles**
- Each circle has: Icon + Short label (2 words max)

### Interaction Pattern:
1. **Click category** → No reload, instant update
2. **Category animates** to first position
3. **Subcategory circles appear** with fade-in
4. **Products filter** without page navigation

### How to Improve:
- Add **smooth scroll animation** when tab moves
- Include **recently viewed** as a "category"
- Show **category-specific promotions** in banner
- Add **"Back to all"** clear button

---

## 6. Promotional Sections

### "Why choose Temu?" Section:
```
┌────────────┐ ┌────────────┐ ┌────────────┐
│ 🔒         │ │ 💳         │ │ 🚚         │
│ Secure     │ │ Safe       │ │ Delivery   │
│ Privacy    │ │ Payments   │ │ Guarantee  │
└────────────┘ └────────────┘ └────────────┘
```

### Key Elements:
- **Icon-driven** (immediately recognizable)
- **2-word labels** (Secure Privacy, Safe Payments, etc.)
- **Card-like containers** with subtle borders
- **Consistent sizing** across items

### Promo Banner:
```
┌─────────────────────────────────────────────────────────┐
│  🎉 New Year, New You - Up to 90% OFF + Free Shipping   │
│                    [Shop Now]                            │
└─────────────────────────────────────────────────────────┘
```

- **Time-sensitive messaging**
- **Strong CTA button**
- **Bold colors** (contrasting with page)

---

## 7. Mobile-Specific Patterns

### Header (Condensed):
```
[☰ Menu] [Logo] [🔍] [🛒 (3)]
```

- Hamburger menu for navigation
- Centered logo
- Search icon (expands on tap)
- Cart with badge

### Bottom Navigation (If Used):
```
[🏠 Home] [📂 Categories] [🔍 Search] [👤 Account] [🛒 Cart]
```

- **5 icons max**
- Active state with label
- Badge on cart

### Touch Targets:
- **Minimum 44px** tap targets
- **Generous spacing** between interactive elements
- **Swipe gestures** for carousels

---

## 8. Color Palette

| Purpose | Color | Usage |
|---------|-------|-------|
| Primary/CTA | Orange (#FF5722 or similar) | Buttons, prices, badges |
| Secondary | Teal/Green | Trust signals, success |
| Text Primary | Dark Gray (#333) | Headings, prices |
| Text Secondary | Medium Gray (#666) | Descriptions, metadata |
| Background | White/Light Gray (#F5F5F5) | Page bg, cards |
| Border | Light Gray (#E0E0E0) | Card borders, dividers |
| Sale/Discount | Red (#E53935) | Strikethrough, urgency |

---

## 9. Typography Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | 24-28px | Bold | Dark |
| Section Header | 18-20px | Semibold | Dark |
| Product Title | 13-14px | Regular | Dark |
| Price | 16-18px | Bold | Primary/Dark |
| Original Price | 12-13px | Regular + Strikethrough | Gray |
| Metadata | 11-12px | Regular | Gray |
| Button Text | 14-16px | Semibold | White/Dark |

---

## 10. Key Takeaways for Our Implementation

### Must-Have:
1. **Trust bar** at top of page
2. **Social proof** on product cards (sold count, ratings)
3. **Instant category switching** (no page reload)
4. **Dense but scannable** card layout
5. **Clear price hierarchy** (current vs original)

### Nice-to-Have:
1. **Subcategory circles** with icons
2. **Animated tab repositioning**
3. **Promotional banners** with urgency
4. **"Why choose us"** section

### Avoid:
- Cluttered mobile layouts
- Too many competing CTAs
- Slow page transitions
- Hidden trust signals

---

## Implementation Priority

1. **Phase 1**: Trust bar + Product card redesign
2. **Phase 2**: Category tabs with instant switching
3. **Phase 3**: Promotional sections + social proof
4. **Phase 4**: Mobile optimization + animations

---

## References

- Screenshots captured: 2024-12-30
- Source: www.temu.com (Bulgaria locale)
- Viewport tested: Desktop (1280px width)

---

*Note: This audit focuses on visible UI patterns. For deeper interaction patterns (category tab animation, subcategory behavior), further investigation with working browser automation would be needed.*
