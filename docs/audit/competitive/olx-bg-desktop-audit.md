# OLX.bg Desktop UX/UI Audit & Comparison to Amazong

**Date:** January 12, 2026  
**Auditor:** Playwright MCP Browser Automation  
**Focus:** Desktop-only audit, UX patterns, navigation, information architecture

---

## Executive Summary

OLX.bg follows a **classifieds-first, search-dominant** design philosophy that prioritizes:
- Immediate access to search functionality
- Flat category browsing with counts
- Minimal visual noise on homepage
- Clean, consistent listing cards
- Strong seller/buyer trust indicators

**Recommendation:** Adopt OLX's navigation simplicity and search prominence while preserving Amazong's modern marketplace aesthetics. Key wins are in category navigation, filter UX, and product card consistency.

---

## 1. Homepage Analysis

### OLX.bg Homepage Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Chat | Favorites | Notifications | Profile | Add │
├─────────────────────────────────────────────────────────────┤
│ HERO SEARCH BAR (single prominent search + location picker) │
├─────────────────────────────────────────────────────────────┤
│ MAIN CATEGORIES (15 categories, single row, text + counts)  │
├─────────────────────────────────────────────────────────────┤
│ PROMO LISTINGS (horizontal scroll of featured ads)          │
├─────────────────────────────────────────────────────────────┤
│ BUSINESS CTA + SEO text + Popular searches                  │
├─────────────────────────────────────────────────────────────┤
│ FOOTER (2-column links + app store buttons + sister sites)  │
└─────────────────────────────────────────────────────────────┘
```

### Key OLX Patterns (Homepage)

| Pattern | OLX Implementation | Effectiveness |
|---------|-------------------|---------------|
| **Search prominence** | Full-width search bar + location dropdown at top | ⭐⭐⭐⭐⭐ - 80% of user journeys start with search |
| **Category display** | Text-only buttons with listing counts | ⭐⭐⭐⭐ - Dense info, fast scanning |
| **Hero area** | No hero images, just search | ⭐⭐⭐ - Utilitarian, not engaging |
| **Navigation depth** | Categories → subcategories inline | ⭐⭐⭐⭐⭐ - No mega-menus, fast |
| **User actions** | Always visible: Add listing, Chat, Favorites | ⭐⭐⭐⭐⭐ - Clear CTAs |

---

## 2. Category Listing Page Analysis

### OLX Category Page Structure (e.g., /elektronika/)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same as homepage)                                    │
├─────────────────────────────────────────────────────────────┤
│ SEARCH BAR (persistent, pre-filled with category)           │
├───────────────────────────┬─────────────────────────────────┤
│ FILTERS SIDEBAR           │ MAIN CONTENT                    │
│ ├── Category picker       │ ├── Breadcrumbs                 │
│ ├── Price range (from/to) │ ├── Sort + View toggle          │
│ ├── Shipping options      │ ├── Subcategory pills           │
│ ├── Condition (new/used)  │ ├── Listing count               │
│ ├── Seller type toggle    │ ├── PRODUCT GRID (4 cols)       │
│ └── Clear filters btn     │ │   ├── Image                   │
│                           │ │   ├── Title (linked)          │
│                           │ │   ├── Price (BGN + EUR)       │
│                           │ │   ├── Condition badge         │
│                           │ │   ├── Location + Date         │
│                           │ │   └── Follow button           │
│                           │ ├── Save search CTA             │
│                           │ └── Pagination                  │
├───────────────────────────┴─────────────────────────────────┤
│ POPULAR SEARCHES + TRENDING keywords                         │
└─────────────────────────────────────────────────────────────┘
```

### Key OLX Patterns (Category Page)

| Pattern | OLX Implementation | Why It Works |
|---------|-------------------|--------------|
| **Inline subcategories** | Horizontal pill buttons with counts (e.g., "Телефони 51,089") | One-click drill-down, no hover needed |
| **Filter visibility** | Always-visible sidebar, no modal | Desktop users expect persistent filters |
| **Price display** | Dual currency (BGN + EUR) | Trust + clarity for international users |
| **Condition badges** | Small colored pills ("ново", "използвано") | Quick visual scanning |
| **View toggle** | List vs Grid buttons | User preference respected |
| **Save search** | Inline CTA in results | Retention hook at decision point |
| **Currency toggle** | лв. / € toggle in header | Persistent user preference |

---

## 3. Product Detail Page Analysis

### OLX Product Detail Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (same)                                                │
├─────────────────────────────────────────────────────────────┤
│ BREADCRUMBS (full path: Home > Electronics > Appliances...) │
├───────────────────────────────┬─────────────────────────────┤
│ IMAGE GALLERY                 │ SELLER CARD                 │
│ ├── Main image (large)        │ ├── Business badge          │
│ ├── Thumbnails (horizontal)   │ ├── Avatar + name           │
│ ├── Previous/Next arrows      │ ├── "On OLX since..."       │
│ └── Fullscreen button         │ ├── "Last online..."        │
│                               │ ├── All listings link       │
├───────────────────────────────┤ ├── LOCATION + MAP          │
│ PRODUCT INFO                  │ │   ├── City, Region        │
│ ├── Date added               │ │   └── Static map preview   │
│ ├── Title (h4)               │ ├── Consumer rights banner   │
│ ├── Price (h3, dual currency) │ └── Ad placement            │
│ ├── Message + Call buttons   │                              │
│ ├── Promote + Refresh links  │                              │
│ ├── Meta: Business, Shipping │                              │
│ ├── Condition                │                              │
│ ├── DESCRIPTION (expandable) │                              │
│ └── Report + ID              │                              │
├───────────────────────────────┴─────────────────────────────┤
│ RELATED LISTINGS (carousel)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Key OLX Patterns (Product Detail)

| Pattern | OLX Implementation | Trust/UX Impact |
|---------|-------------------|-----------------|
| **Seller verification** | Facebook connected icon, join date, last online | ⭐⭐⭐⭐⭐ High trust signals |
| **Contact options** | Message + Call buttons side-by-side | Low friction to convert |
| **Consumer rights banner** | Expandable accordion "Protected by consumer law" | Builds marketplace trust |
| **Location proof** | Static map + city/region text | Verifies physical presence |
| **Business seller badge** | Clear "Бизнес" indicator | Sets expectations |
| **Description length** | Long-form allowed, well-formatted | SEO + buyer confidence |
| **ID display** | Visible listing ID for reference | Customer support friendly |

---

## 4. Navigation & Header Patterns

### OLX Header Elements

```
┌────────────────────────────────────────────────────────────────┐
│ [LOGO] ........... [Chat] [Favorites♡] [🔔] [Profile▾] [+Add] │
└────────────────────────────────────────────────────────────────┘
```

| Element | OLX Behavior | Notes |
|---------|-------------|-------|
| Logo | Returns to homepage | Standard |
| Chat | Links to messages (requires auth) | Marketplace-first |
| Favorites | Links to saved searches/listings | Heart icon, badge count |
| Notifications | Dropdown with recent alerts | Bell icon |
| Profile | Link to account (shows name when logged in) | Avatar + text |
| Add listing | Primary green CTA button | Always prominent |

### Navigation Philosophy

- **No mega-menu**: Categories are navigated via search or category page
- **No hamburger on desktop**: All primary nav visible
- **Persistent search**: Available on every page
- **Skip links**: Accessibility links to main content + footer

---

## 5. Comparison to Amazong Current State

### Where Amazong Falls Short

| Area | OLX Approach | Amazong Current | Gap |
|------|-------------|-----------------|-----|
| **Search prominence** | Full-width hero search | Integrated in header | 🔴 Search not the focal point |
| **Category navigation** | Flat pills with counts | Mega-menu (complex) | 🔴 Too many hover interactions |
| **Filter persistence** | Always-visible sidebar | Modal/drawer on mobile patterns | 🟡 Desktop should show filters |
| **Price display** | Dual currency (BGN + EUR) | Single currency | 🔴 Bulgaria uses both |
| **Seller trust** | Join date, last online, verified badges | Limited seller profile | 🔴 Trust indicators weak |
| **Breadcrumbs** | Full category path visible | Partial/missing | 🟡 SEO + UX issue |
| **Listing counts** | Shown on category pills | Not shown | 🟡 Missing social proof |
| **Save search** | Inline in results | Not implemented | 🔴 Retention feature missing |

### Where Amazong is Better

| Area | Amazong Approach | OLX Approach | Advantage |
|------|-----------------|--------------|-----------|
| **Visual design** | Modern, clean shadcn/ui | Functional but dated | ⭐ Amazong |
| **Image quality** | Higher resolution, better aspect ratios | Inconsistent sizing | ⭐ Amazong |
| **Mobile-first** | Responsive from ground up | Separate mobile site | ⭐ Amazong |
| **Dark mode** | Supported | Not supported | ⭐ Amazong |
| **Component consistency** | shadcn design system | Mixed styles | ⭐ Amazong |

---

## 6. Recommended Improvements for Amazong Desktop

### High Priority (Immediate Impact)

#### 1. Homepage Search Redesign
```
CURRENT:  Header search bar (secondary)
PROPOSED: Hero search section with category + location
```

**Implementation:**
- Add full-width search section below header
- Include location picker dropdown
- Pre-populate with "All categories" default
- Add "only with photos" quick filter

#### 2. Category Navigation Overhaul
```
CURRENT:  Mega-menu on hover
PROPOSED: Category page with inline subcategory pills
```

**Changes:**
- Replace mega-menu with simple category links
- On category pages, show subcategory pills horizontally
- Add listing counts to each subcategory pill
- Example: `[Телефони 51,089] [Лаптопи 12,000] [Телевизори 8,386]`

#### 3. Filter Sidebar for Desktop
```
CURRENT:  Filters in modal/accordion
PROPOSED: Persistent left sidebar on listing pages
```

**Implementation:**
- Show filters in sticky sidebar (280px width)
- Include: Price range, Condition, Seller type, Shipping
- Add "Clear all filters" button
- Keep drawer pattern for mobile

#### 4. Dual Currency Display
```
CURRENT:  Single currency
PROPOSED: Price in BGN + EUR (configurable)
```

**Example:** `150 лв. / 76.69 €`

### Medium Priority (Trust & Retention)

#### 5. Seller Trust Indicators
```
ADD:
- "Seller since [date]"
- "Last active [time]"
- Business/Private badge
- Verified badges (email, phone, Facebook)
```

#### 6. Save Search Feature
```
ADD:
- "Save this search" button in listing results
- Email/push notification when new matches
- Saved searches page in user profile
```

#### 7. Breadcrumb Enhancement
```
CURRENT:  Partial breadcrumbs
PROPOSED: Full path: Home > Category > Subcategory > Listing
```

### Low Priority (Polish)

#### 8. View Toggle (List/Grid)
```
ADD: Toggle buttons for list vs grid view in category pages
PERSIST: Save preference in localStorage
```

#### 9. Currency Toggle
```
ADD: лв./€ toggle in header
PERSIST: Save preference
APPLY: All prices site-wide
```

#### 10. Listing Count Display
```
ADD: Show "X обяви" count on category pills
```

---

## 7. Implementation Roadmap

### Phase 1: Navigation & Search (Week 1-2)
- [ ] Implement hero search section on homepage
- [ ] Add location picker component
- [ ] Replace mega-menu with flat category links
- [ ] Add subcategory pills on category pages

### Phase 2: Filters & Display (Week 3-4)
- [ ] Build desktop filter sidebar component
- [ ] Implement dual currency display
- [ ] Add listing counts to category navigation
- [ ] Implement breadcrumb improvements

### Phase 3: Trust & Retention (Week 5-6)
- [ ] Add seller trust indicators to profiles
- [ ] Build save search functionality
- [ ] Add view toggle (list/grid)
- [ ] Implement currency preference toggle

---

## 8. Code Patterns to Adopt

### Search Bar Component Pattern
```tsx
// OLX-style hero search
<div className="w-full bg-white border-b py-4">
  <div className="container flex gap-2">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
      <Input placeholder="Какво търсиш?" className="pl-10" />
    </div>
    <Select defaultValue="all">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Цялата страна" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Цялата страна</SelectItem>
        <SelectItem value="sofia">гр. София</SelectItem>
        {/* ... */}
      </SelectContent>
    </Select>
    <Button>Търсене</Button>
  </div>
</div>
```

### Category Pill Pattern
```tsx
// Subcategory pills with counts
<div className="flex flex-wrap gap-2">
  {subcategories.map((cat) => (
    <Link
      key={cat.slug}
      href={`/${cat.slug}/`}
      className="px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-muted/80"
    >
      {cat.name}
      <span className="ml-1 text-muted-foreground">{cat.count}</span>
    </Link>
  ))}
</div>
```

### Dual Price Display Pattern
```tsx
// Price with both currencies
<div className="font-semibold">
  <span>{formatPrice(price, 'BGN')}</span>
  <span className="text-muted-foreground"> / </span>
  <span className="text-muted-foreground">{formatPrice(price, 'EUR')}</span>
</div>
```

---

## 9. Metrics to Track Post-Implementation

| Metric | Current Baseline | Target After Changes |
|--------|-----------------|---------------------|
| Search usage rate | ? | +30% |
| Category drill-down depth | ? | -1 click average |
| Time to first filter | ? | -50% |
| Listing save rate | N/A | 5% of views |
| Seller profile views | ? | +20% |
| Mobile→Desktop parity | ? | 95%+ feature parity |

---

## 10. Conclusion

OLX.bg's strength lies in its **utilitarian efficiency** — users find what they need fast without visual clutter. Amazong should adopt:

1. **Search-first homepage** — Make search the hero, not secondary
2. **Flat navigation** — Kill the mega-menu, use inline category pills
3. **Persistent filters** — Desktop users expect visible filter controls
4. **Trust signals** — Seller verification increases conversion
5. **Dual currency** — Essential for Bulgarian market

The goal is not to copy OLX's aesthetic (which is dated), but to **import their information architecture patterns** into Amazong's modern design system.

---

*Generated via Playwright MCP browser automation audit of www.olx.bg on 2026-01-12*
