# Bazar.bg Desktop UX/UI Audit

**Date**: January 12, 2026  
**Scope**: Desktop-only analysis  
**Purpose**: Learn from Bazar.bg's C2C/B2B marketplace patterns to improve Amazong's product discovery, ease of use, and conversion flows

---

## Executive Summary

Bazar.bg is a Bulgarian classifieds marketplace with 2.7M+ listings. Despite its **dated visual aesthetic** (early 2010s design), it excels at:

1. **Ruthless simplicity** — zero cognitive overhead for core tasks
2. **Information density** — maximum listings visible per viewport  
3. **Frictionless navigation** — single-click access to any category
4. **Trust signals** — clear seller info, view counts, timestamps

The site proves that **ugly but usable beats pretty but confusing** for C2C marketplaces where the primary goal is product discovery and quick conversions.

---

## 1. Homepage Analysis

### Structure
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo | "Любими" | "Моят профил" | "+ Добави обява" │
├─────────────────────────────────────────────────────────────┤
│ SEARCH: [Category dropdown] [Search box] [Location] [Търси]│
├─────────────────────────────────────────────────────────────┤
│                    CATEGORY GRID (4x4)                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               │
│  │ Авто   │ │ Имоти  │ │ Мода   │ │Електро │               │
│  │795,639 │ │205,620 │ │415,807 │ │318,374 │               │
│  └────────┘ └────────┘ └────────┘ └────────┘               │
│  [... 12 main categories with live counts ...]              │
├─────────────────────────────────────────────────────────────┤
│ SHIPPING PROMO BANNER (Econt integration)                   │
├─────────────────────────────────────────────────────────────┤
│ "ТОП 100 магазина" - Top sellers section                    │
├─────────────────────────────────────────────────────────────┤
│ LATEST LISTINGS GRID (horizontal scroll with cards)         │
├─────────────────────────────────────────────────────────────┤
│ FULL CATEGORY TREE (4-column subcategory links)             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

### What Works

| Pattern | Implementation | Why It Works |
|---------|---------------|--------------|
| **Live listing counts** | "Авто 795,639 обяви" | Creates FOMO/abundance psychology |
| **Category icons** | Simple 2-color icons | Instantly scannable, no cognitive load |
| **Location dropdown** | 60+ cities, prominent position | Bulgarian market is very location-sensitive |
| **Single CTA per category** | Click = go to listing page | No intermediate screens |
| **Flat hierarchy** | All 12 categories visible | No hamburger menus or hidden nav |

### What's Ugly But Effective
- Table-based layout (yes, actual `<table>` for categories)
- Zero animations or transitions
- Basic blue links for text
- No hero images or marketing fluff
- Plain white background throughout

---

## 2. Category/Listing Page Analysis

### Structure
```
┌─────────────────────────────────────────────────────────────┐
│ SEARCH BAR (with category context "Електроника")           │
│ [Category pill] [Search box] [Location] [Търси]            │
├─────────────────────────────────────────────────────────────┤
│ QUICK FILTERS BAR                                           │
│ ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐   │
│ │ Price range │ │ Condition   │ │ Спешно|Подарявам|...│   │
│ └─────────────┘ └─────────────┘ └──────────────────────┘   │
│                    [Всички] [Частни]                        │
├─────────────────────────────────────────────────────────────┤
│ BREADCRUMB: Начало > Всички обяви > Електроника            │
├─────────────────────────────────────────────────────────────┤
│ SUBCATEGORY CHIPS (inline, with counts)                     │
│ Аудио техника 62,787 | Битова техника 45,770 | TV 49,400..│
├─────────────────────────────────────────────────────────────┤
│ RESULTS HEADER: "324,289 обяви" [Sort ▼] [Gallery|List]    │
├─────────────────────────────────────────────────────────────┤
│                   PRODUCT GRID                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  [img]   │ │  [img]   │ │  [img]   │ │  [img]   │      │
│  │  Title   │ │  Title   │ │  Title   │ │  Title   │      │
│  │ Location │ │ Location │ │ Location │ │ Location │      │
│  │  Date    │ │  Date    │ │  Date    │ │  Date    │      │
│  │70€ 136лв│ │149€ 291лв│ │ ... etc  │ │ ... etc  │      │
│  │   [♡]   │ │   [♡]   │ │   [♡]   │ │   [♡]   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  [... many more rows ...]                                   │
├─────────────────────────────────────────────────────────────┤
│ PAGINATION: [1] [2] [3] ... [10] [Следваща »]              │
├─────────────────────────────────────────────────────────────┤
│ RELATED SEARCHES: радио | продавам всичко | усилвател ...  │
├─────────────────────────────────────────────────────────────┤
│ LOCATION LINKS: София | Пловдив | Варна | Бургас ...       │
└─────────────────────────────────────────────────────────────┘
```

### Key UX Patterns

#### 2.1 Subcategory Navigation
- **Inline chips** with exact listing counts
- Single click = filter to subcategory
- No modal/drawer intermediary
- ~20 subcategories visible at once

**Amazong opportunity**: Our mega-menu approach is slower. Consider inline chips on category pages.

#### 2.2 Product Card Information Hierarchy
```
1. IMAGE (square, decent size ~150px)
2. TITLE (2 lines max, truncated)
3. LOCATION (city + neighborhood)
4. DATE (relative: "днес", "вчера", exact date)
5. PRICE (dual currency: EUR + BGN)
6. FAVORITE ICON (small heart)
7. "TOP" badge for promoted listings
```

**Key insight**: Location + Date are MORE prominent than in most modern marketplaces. For C2C, freshness and proximity matter.

#### 2.3 Filtering Philosophy
- **Minimal filters visible** by default (price range, condition)
- **Toggle chips** for quick filters: "Спешно" (urgent), "Подарявам" (free), "Доставя с отстъпка" (discount shipping)
- **Seller type toggle**: "Всички" | "Частни" (private sellers only)
- **No complex filter drawer** — just inline controls

---

## 3. Product Detail Page Analysis

### Structure
```
┌─────────────────────────────────────────────────────────────┐
│ BREADCRUMB: Начало > Електроника > Телефони > Xiaomi       │
├─────────────────────────────────────────────────────────────┤
│ TITLE: "Xiomi POCO F 3 256 GB → Обява 52968355"            │
├─────────────────────────────────────────────┬───────────────┤
│                                             │               │
│  ┌───────────────────────────────────┐     │ PRICE BOX    │
│  │                                   │     │ ┌───────────┐│
│  │         MAIN IMAGE               │     │ │ 70 €      ││
│  │         (with gallery)           │     │ │ 136,91 лв ││
│  │                                   │     │ └───────────┘│
│  └───────────────────────────────────┘     │              │
│  [thumbnail] [thumb] [thumb] [thumb]...    │ [Message]    │
│                                             │ [Phone]      │
│  Location: гр. Стара Загора, Била          │              │
│  Posted: вчера в 19:24 ч.                  │ SELLER BOX   │
│                                             │ ┌───────────┐│
│  ┌─────────────────────────────────────┐   │ │Avatar     ││
│  │ Състояние: Използвано               │   │ │"За всеки  ││
│  │ Доставка: Купувача                  │   │ │ по нещо"  ││
│  └─────────────────────────────────────┘   │ │Premium ✓  ││
│                                             │ │Since 2021 ││
│  DESCRIPTION                               │ │275 обяви  ││
│  "Продавам POCO F3 256 GB, телефона има   │ │Last: днес ││
│  следи от употреба..."                     │ └───────────┘│
│                                             │              │
│  Преглеждания: 105 | [★ rating]            │ [Report]     │
├─────────────────────────────────────────────┴───────────────┤
│ "Другите търсят също" - RELATED LISTINGS (4 cards)         │
├─────────────────────────────────────────────────────────────┤
│ "Обяви на потребителя" - SELLER'S OTHER LISTINGS (2 cards) │
├─────────────────────────────────────────────────────────────┤
│ "Препоръчани за теб" - RECOMMENDATIONS (12 cards, scroll)  │
├─────────────────────────────────────────────────────────────┤
│ CATEGORY LINKS (brand filters: Alcatel, Apple, Samsung...) │
└─────────────────────────────────────────────────────────────┘
```

### Trust & Conversion Elements

| Element | Purpose | Placement |
|---------|---------|-----------|
| **View count** ("105 преглеждания") | Social proof, demand signal | Under description |
| **Last active** ("Last active today 04:11") | Response likelihood | Seller box |
| **Total listings** ("275 обяви") | Seller credibility | Seller box |
| **Member since** ("Since 2021") | Trust signal | Seller box |
| **Premium badge** | Paid seller tier | Seller box |
| **Dual-currency price** | Removes mental conversion | Primary position |
| **Report button** | Safety/moderation | Bottom of sidebar |

### Contact Methods
1. **Send message** (primary CTA, with icon)
2. **Show phone** (masked until clicked: `08XX XXX XXX`)

---

## 4. Icons & Visual Language

### Icon Style
- **Simple 2-color** (fill + outline or single color)
- **Category icons**: Silhouette style, ~32x32px, high contrast
- **Action icons**: Minimal, recognizable (heart for favorite, envelope for message)
- **No gradients, no complex illustrations**

### Why This Works
- Loads instantly (small file sizes)
- Clear at any size
- Works in any color context
- Universally understood

**Amazong comparison**: Our Lucide icons are good but we sometimes over-style. Bazar.bg proves simpler is better.

---

## 5. What Bazar.bg Gets Right (Steal These)

### 5.1 Information Architecture
- ✅ **Flat category structure** — all 12 top-level visible
- ✅ **Live counts everywhere** — creates abundance psychology
- ✅ **Location-first filtering** — critical for C2C
- ✅ **Inline subcategories** — no modal interruption
- ✅ **Breadcrumbs everywhere** — always know where you are

### 5.2 Product Discovery
- ✅ **Dense grid** — shows 50+ items per page
- ✅ **Date/freshness prominent** — recent = relevant
- ✅ **Dual currency** — no mental math for Bulgarians
- ✅ **"TOP" promoted listings** — clear premium placement
- ✅ **Related searches** — SEO + discovery aid

### 5.3 Seller Trust
- ✅ **Last active timestamp** — know if seller is responsive
- ✅ **Total listings count** — serious seller indicator
- ✅ **Member tenure** — longevity = trustworthiness
- ✅ **View count** — demand signal

### 5.4 Conversion
- ✅ **Masked phone reveal** — filters out window shoppers
- ✅ **Message CTA prominent** — low friction contact
- ✅ **Price always visible** — no "contact for price" games
- ✅ **Condition clearly stated** — manages expectations

---

## 6. What Bazar.bg Gets Wrong (Avoid These)

### 6.1 Visual Design
- ❌ **Table-based layout** — not responsive, dated
- ❌ **No design system** — inconsistent spacing/type
- ❌ **Blue link syndrome** — everything looks like 2005
- ❌ **No visual hierarchy** — all text same weight
- ❌ **Banner ad pollution** — distracting

### 6.2 Technical
- ❌ **No infinite scroll** — pagination only
- ❌ **Slow image loading** — no lazy load optimization
- ❌ **No skeleton states** — blank while loading
- ❌ **Heavy page weight** — lots of inline scripts
- ❌ **No PWA features** — purely server-rendered

### 6.3 UX Gaps
- ❌ **No quick view** — must open full page for every item
- ❌ **No saved searches** — manual re-entry
- ❌ **Limited seller profiles** — basic info only
- ❌ **No purchase protection** — pure classifieds
- ❌ **Cookie popup blocks content** — poor GDPR implementation

---

## 7. Amazong Improvement Proposals

Based on Bazar.bg's strengths and our existing design system, here are actionable improvements:

### 7.1 Homepage — Add Live Category Counts

**Current**: Static category navigation  
**Proposed**: Show real listing counts per category

```tsx
// Before
<CategoryCard name="Electronics" icon={<Laptop />} />

// After  
<CategoryCard 
  name="Electronics" 
  icon={<Laptop />} 
  count={format(324289)} // "324K"
  trend="+5.2%" // optional
/>
```

**Why**: Creates abundance psychology, drives exploration.

---

### 7.2 Category Pages — Inline Subcategory Chips

**Current**: Subcategories in sidebar or mega-menu  
**Proposed**: Inline chip strip below filters

```
┌─────────────────────────────────────────────────────────────┐
│ FILTER BAR: [Price ▼] [Condition ▼] [Location ▼] [Clear]   │
├─────────────────────────────────────────────────────────────┤
│ SUBCATEGORY CHIPS (horizontal scroll)                       │
│ [Phones 17K] [Laptops 13K] [TVs 49K] [Audio 62K] [Gaming...│
├─────────────────────────────────────────────────────────────┤
│ GRID...                                                     │
```

**Implementation**:
```tsx
<div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2">
  {subcategories.map(sub => (
    <Chip 
      key={sub.slug}
      active={currentSub === sub.slug}
      count={sub.count}
    >
      {sub.name}
    </Chip>
  ))}
</div>
```

---

### 7.3 Product Cards — Add Freshness Indicator

**Current**: No timestamp visible  
**Proposed**: Relative date badge

```
┌────────────────┐
│    [Image]     │
│    [♡]         │
├────────────────┤
│ Title here...  │
│ Sofia • Today  │  ← Add this
│ €70.00         │
└────────────────┘
```

**Classes** (using existing tokens):
```tsx
<span className="text-2xs text-muted-foreground">
  {location} • {formatRelativeDate(createdAt)}
</span>
```

---

### 7.4 Product Detail — Enhanced Seller Trust Box

**Current**: Basic seller info  
**Proposed**: Full trust panel like Bazar.bg

```tsx
<Card className="rounded-md border border-border p-3 space-y-2">
  <div className="flex items-center gap-2">
    <Avatar className="size-10" />
    <div>
      <p className="text-sm font-medium">{seller.name}</p>
      {seller.isPremium && <Badge variant="premium">Premium</Badge>}
    </div>
  </div>
  
  <dl className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
    <dt>Member since</dt>
    <dd>{formatDate(seller.createdAt)}</dd>
    
    <dt>Total listings</dt>
    <dd>{seller.listingCount}</dd>
    
    <dt>Last active</dt>
    <dd>{formatRelative(seller.lastActiveAt)}</dd>
    
    <dt>Response rate</dt>
    <dd>{seller.responseRate}%</dd>
  </dl>
  
  <Button variant="outline" className="w-full">
    View all {seller.listingCount} listings
  </Button>
</Card>
```

---

### 7.5 Search — Location-Aware by Default

**Current**: Global search  
**Proposed**: Location context in search

```tsx
<SearchBar>
  <CategorySelector current="all" />
  <Input placeholder="Search 324K listings..." />
  <LocationSelector 
    current={userLocation || "All Bulgaria"} 
    options={[
      "Nearby (10km)",
      "Sofia",
      "Plovdiv",
      // ... etc
    ]}
  />
  <Button>Search</Button>
</SearchBar>
```

---

### 7.6 Quick Filters — Toggle Chips

**Current**: Full filter drawer  
**Proposed**: Add quick-toggle chips for common filters

```
[🔥 Urgent] [🎁 Free] [📦 Free Shipping] [✅ New Only]
```

**Implementation**:
```tsx
const quickFilters = [
  { id: 'urgent', icon: Flame, label: t('filter.urgent') },
  { id: 'free', icon: Gift, label: t('filter.free') },
  { id: 'freeShipping', icon: Package, label: t('filter.freeShipping') },
  { id: 'newOnly', icon: Sparkles, label: t('filter.newOnly') },
];

<div className="flex gap-1.5 flex-wrap">
  {quickFilters.map(filter => (
    <ToggleChip
      key={filter.id}
      active={activeFilters.includes(filter.id)}
      onClick={() => toggleFilter(filter.id)}
    >
      <filter.icon className="size-3.5" />
      {filter.label}
    </ToggleChip>
  ))}
</div>
```

---

### 7.7 View Count & Social Proof

**Current**: No view metrics shown  
**Proposed**: Add view count to product detail

```tsx
<div className="flex items-center gap-4 text-xs text-muted-foreground">
  <span className="flex items-center gap-1">
    <Eye className="size-3.5" />
    {viewCount} views
  </span>
  <span className="flex items-center gap-1">
    <Heart className="size-3.5" />
    {favoriteCount} saved
  </span>
  <span className="flex items-center gap-1">
    <Clock className="size-3.5" />
    Listed {formatRelative(createdAt)}
  </span>
</div>
```

---

## 8. Implementation Priority Matrix

| Improvement | Impact | Effort | Priority |
|-------------|--------|--------|----------|
| **Live category counts** | High | Medium | P1 |
| **Freshness on cards** | High | Low | P1 |
| **Seller trust panel** | High | Medium | P1 |
| **Inline subcategory chips** | Medium | Medium | P2 |
| **Quick filter toggles** | Medium | Low | P2 |
| **Location in search** | Medium | Medium | P2 |
| **View count display** | Low | Low | P3 |

---

## 9. Files to Modify

For implementing P1 improvements:

| File | Change |
|------|--------|
| `components/category/CategoryCard.tsx` | Add count prop and display |
| `components/shared/ProductCard.tsx` | Add relative date display |
| `app/[locale]/(shop)/product/[slug]/_components/SellerInfo.tsx` | Enhanced trust panel |
| `lib/format-date.ts` | Add `formatRelativeDate()` util |
| `messages/en.json` + `messages/bg.json` | Add relative date strings |

---

## 10. Conclusion

Bazar.bg proves that **function over form** wins for classifieds marketplaces. Their key insight:

> **Every pixel should serve product discovery or conversion. Nothing else.**

Our design system is already cleaner and more modern. By adopting their **information density**, **trust signals**, and **frictionless navigation** patterns while keeping our visual polish, we can achieve the best of both worlds.

### Key Takeaways
1. **Show counts everywhere** — abundance creates confidence
2. **Date matters in C2C** — fresh listings get attention
3. **Seller trust is conversion** — invest in trust UI
4. **Flat beats deep** — fewer clicks to discovery
5. **Inline beats modal** — keep users in flow

---

*Next step: Pick P1 items from section 8 and create implementation tasks in TODO.md*
