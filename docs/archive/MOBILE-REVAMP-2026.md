# Mobile UX Revamp — 2026 Patterns

> Full plan for a mobile-first UI/UX overhaul across all Treido routes.
> **Plans only — no execution yet.** Each phase has explicit done criteria for coding agents.

---

## Vision

Treido mobile should feel like YouTube / OLX / Vinted / eBay in 2026: **content dominates the viewport, ONE slim rail handles page-level navigation, sheets are for complex actions only, and the bottom nav bar handles app-level movement.**

**Core principle:** The viewport belongs to products. Navigation chrome gets ONE row. Everything else is on-demand via temporary sheets.

### 2026 Quality Bar (must hit)

This revamp is only justified if it **measurably** improves:

- **Above-the-fold content:** homepage first product starts ~84px from the top (header + rail only)
- **One-hand navigation:** primary movement stays in the bottom tab bar; refinement stays in temporary sheets
- **Touch confidence:** tap targets ≥ 44px; no cramped controls at 360px width
- **Perceived speed:** skeletons match final layout; no spinners; drawers open/close without jank
- **A11y baseline:** keyboard + screen reader usable; `focus-visible` rings; `prefers-reduced-motion` honored
- **Consistency:** one rail pattern, one drawer header pattern (`DrawerShell`), one CTA pattern per surface

### Guardrails (avoid over-engineering)

- **SmartRail stays dumb.** It renders pills + optional back/clear + optional trailing action; it does not own routing, fetching, or category taxonomy.
- **Cap rail depth at 2.** Anything deeper (brand/model/etc.) goes into the Filter sheet instead of infinite nested rails.
- **Ship MVP rails first.** Don’t block Phase 1 on “perfect” morph logic; start with homepage scopes + category subcategories.
- **Emoji in diagrams are illustrative only.** UI uses text + optional Lucide icons (consistent across locales) for a premium feel.
- **i18n everywhere.** All pill labels, headings, empty states use `next-intl` message keys (en/bg).
- **Tokens only.** All styling uses semantic tokens (`bg-background`, `text-foreground`, etc.) to satisfy `styles:gate`.

### Reference Apps (2026 patterns)

Every successful mobile marketplace follows the same structure:

| App | Top area | Content area | Bottom | Sheets used for |
|---|---|---|---|---|
| **YouTube** | Header + 1 tab rail | Video feed | 5-tab nav | Comments, description |
| **OLX** | Search + 1 pill rail | Product grid | 5-tab nav | Filters only |
| **Vinted** | Search + 1 filter rail | Product grid | 5-tab nav | Filters, sort |
| **Amazon** | Search + 1 scope rail | Product feed | 4-tab nav | Filters |
| **eBay** | Search + 1 category rail | Product grid | 5-tab nav | Filters, sort |
| **Reddit** | Sub name + 1 sort rail | Post feed | 5-tab nav | Sort options |

**Pattern is universal:** 1 rail at top. Products fill viewport. Bottom nav. Sheets for actions.

### What Changes (current → new)

| Current (broken) | New (2026) |
|---|---|
| 2 stacked rails + context banner = **~164px** above the fold | 1 smart contextual rail = **~84px** above the fold |
| Primary rail (category tabs) + secondary rail (scope pills) | Single rail that morphs based on navigation depth |
| Context banner ("For You (24) · See all") | Removed — context shown as chip inside search bar |
| 5 mobile header variants | 3 header variants (homepage, contextual, product) |
| Full-screen custom div for search | Vaul drawer for search |
| 15 drawers with custom headers | All drawers standardized to DrawerShell |
| PDP: padded card layout | PDP: OLX-style visual drawer (gallery bleed + rounded content) |

---

## Current State Audit

### What Works (Keep)

- **Bottom tab bar** — 5-tab layout (Home, Categories, Sell, Chat, Profile). Modern styling: `rounded-t-2xl`, `shadow-nav`, pill active indicator, filled icons. **2026-standard. Don't touch.**
- **Header (homepage)** — hamburger + "treido." logo + search pill + wishlist + cart. Clean, minimal. **Keep.**
- **Product cards** — `MobileProductCard` with great density. 2-col grid, seller row, price, freshness. **Keep.**
- **Drawer primitives** — Vaul + `DrawerShell` is solid. 10 drawers already standardized. **Extend to the remaining 15.**
- **Category browse drawer** — Gold standard for full-screen category navigation. **Keep.**
- **Product quick view drawer** — Smooth slide-up preview from feed. **Keep.**
- **Mobile bottom bar (PDP)** — Category-adaptive CTAs (chat + cart / call + contact). **Keep.**

### What's Broken

| Surface | Problem | Impact |
|---|---|---|
| **Homepage rails** | 2 stacked rails + banner = 164px eaten before first product (25% of viewport) | **Critical** — first impression |
| **Search** | Full-screen custom `div` overlay. No Vaul, fragile body-scroll-lock, no a11y | **Critical** — core flow |
| **Account pages** | Broken on mobile. Desktop components rendered at mobile widths | **Critical** — user trust |
| **Sell flow** | Desktop form on mobile. No step progress, terrible field layout | **Critical** — seller conversion |
| **Categories [slug]** | Drilldown rail + filter chips stack up. Content starts too low | **High** |
| **PDP** | Functional but padded/boxy. No visual hierarchy between gallery and content | **High** |
| **Chat** | Semi-decent but conversation list and bubbles need polish | **Medium** |
| **Checkout** | Functional but basic. No step visualization, desktop form feel | **Medium** |

### Component Inventory

| Category | Count | Status |
|---|---|---|
| Vaul drawers (bottom) | 24 | Functional, 0 use multi-snap points |
| DrawerShell-based drawers | 10 | Consistent, good |
| Custom header drawers | 15 | Need migration to DrawerShell |
| Header variants (mobile) | 5 | 2 can be merged away |
| Pages with mobile/desktop split | 7 routes | Others fall back to responsive |

---

## Architecture: The Three-Layer Mobile Stack

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  LAYER 1 — FIXED CHROME (always visible)                       │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Header (44px)         app identity + search + actions    │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Smart Rail (40px)     page-level nav (categories/scopes) │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  LAYER 2 — SCROLLABLE CONTENT (full viewport)                  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Product grid / page content / forms                      │  │
│  │  (infinite scroll, edge-to-edge)                          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Bottom Tab Bar (52px + safe)   app-level navigation      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  LAYER 3 — TEMPORARY SHEETS (on demand, covers layers below)   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Filter sheet / Sort sheet / City picker / Category grid  │  │
│  │  (Vaul drawer, slides up, covers navbar while open)       │  │
│  │  (user picks → sheet closes → back to normal)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Purpose | Visibility | Z-index |
|---|---|---|---|
| **Header + Smart Rail** | "What am I looking at?" + "Let me search" | Always visible, sticky top | z-50 |
| **Content** | Products, forms, page body | Scrollable, full viewport | z-0 |
| **Bottom Tab Bar** | "Where am I in the app?" (Home/Categories/Sell/Chat/Profile) | Always visible, fixed bottom | z-50 |
| **Temporary Sheets** | "Let me refine" (filters, sort, deep browse, complex actions) | On-demand only. Slides up, covers navbar while open | z-60 |

### The Smart Contextual Rail

The key innovation. **ONE rail** that adapts its content based on navigation depth:

```
DEPTH 0 — No category selected (default homepage):
┌──────────────────────────────────────────────────────────────────┐
│  [For You ✓] [Newest] [Promoted] [Deals] [Nearby]  [⚙ Filter]  │
└──────────────────────────────────────────────────────────────────┘
  → Scope pills. Tap to switch feed. Filter trigger at end.

DEPTH 1 — Category selected (e.g., "Electronics"):
┌──────────────────────────────────────────────────────────────────┐
│  [✕ All]  [📱 Phones ✓] [💻 Laptops] [🖥 Monitors] [⚙ Filter]  │
└──────────────────────────────────────────────────────────────────┘
  → "✕ All" resets to depth 0. Subcategory pills replace scopes.

DEPTH 2 — Subcategory selected (e.g., "Phones"):
┌──────────────────────────────────────────────────────────────────┐
│  [← Elec.] [iPhone ✓] [Samsung] [Pixel] [Xiaomi]   [⚙ Filter]  │
└──────────────────────────────────────────────────────────────────┘
  → "← Elec." goes back to depth 1. L2 pills replace subcategories.

FILTERS ACTIVE — Same depth, badge on trigger:
┌──────────────────────────────────────────────────────────────────┐
│  [← Elec.] [iPhone ✓] [Samsung] [Pixel] [Xiaomi]  [⚙ Filter •2]│
└──────────────────────────────────────────────────────────────────┘
  → Filters don't create a new rail level; they live in the Filter sheet.
```

**Rules:**
- Always exactly 1 row, ~40px height
- Always ends with `⚙ Filter` trigger (opens temporary filter sheet)
- Tapping a pill = switch content, rail stays visible, no overlay
- Back arrow/X = go up one navigation level
- Horizontal scroll for overflow
- Active pill uses `bg-foreground text-background` filled style
- Inactive pills use `bg-surface-subtle text-muted-foreground`

### How Category Selection Works (user flow)

```
1. User is on homepage, sees "For You" feed
   Rail: [For You✓] [Newest] [Deals] [⚙ Filter]

2. User taps ⊞ Categories in bottom tab bar
   → Category browse sheet slides up (temporary, covers navbar)
   → Shows category icon grid (Electronics, Fashion, Home, Sports...)

3. User taps "Electronics"
   → Sheet closes automatically
   → Rail morphs: [✕ All] [📱 Phones] [💻 Laptops] [⚙ Filter]
   → Feed shows Electronics products
   → Header search bar shows context: [🔍 Electronics ▾]

4. User taps "Phones"
   → Rail morphs: [← Elec.] [iPhone] [Samsung] [Pixel] [⚙ Filter]
   → Feed shows Phones products

5. User taps [⚙ Filter]
   → Filter sheet slides up (temporary, covers navbar)
   → Shows: Sort, Price range, Condition, Location
   → User picks "Like New" + "< €500"
   → Taps "Show 18 results"
   → Sheet closes, feed updates, rail shows filter badge: [⚙ Filter •2]

6. User taps [← Elec.] in rail
   → Back to subcategories: [✕ All] [📱 Phones] [💻 Laptops] [⚙ Filter]
   → Filters preserved within this category
```

### Temporary Filter Sheet (detailed)

Opens from the `⚙ Filter` trigger. Covers content + navbar. Closes on "apply" or swipe-down.

```
Normal state:
┌──────────────────────────────────────┐
│  ≡  treido.  [🔍 Phones ▾]     🛒  │  header
├──────────────────────────────────────┤
│  [← Elec.] [iPhone✓] [Sam] [⚙ Flt] │  smart rail
├──────────────────────────────────────┤
│                                      │
│  Product grid...                     │  content
│                                      │
├──────────────────────────────────────┤
│  🏠  ⊞  ⊕  💬  👤                  │  tab bar
└──────────────────────────────────────┘

After tapping ⚙ Filter:
┌──────────────────────────────────────┐
│  ≡  treido.  [🔍 Phones ▾]     🛒  │  header (still visible)
├──────────────────────────────────────┤
│  [← Elec.] [iPhone✓] [Sam] [⚙ Flt] │  rail (still visible)
├──────────────────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  backdrop dim
│  ┌──────────────────────────────────┐│
│  │ ═══ drag handle ═══             ││
│  │                                  ││
│  │  Filters                   [✕]  ││◄── TEMPORARY sheet
│  │  ───────────────────────────    ││    (Vaul drawer, slides up)
│  │                                  ││
│  │  Sort by                         ││
│  │  [Newest✓] [Price ↑] [Price ↓]  ││
│  │                                  ││
│  │  Price range                     ││
│  │  €0 ────────●──── €500          ││
│  │                                  ││
│  │  Condition                       ││
│  │  [New] [Like New✓] [Good] [Fair]││
│  │                                  ││
│  │  Location                        ││
│  │  [📍 Sofia ▾]                    ││
│  │                                  ││
│  │  ┌──────────────────────────┐   ││
│  │  │   Show 18 results         │   ││  apply CTA
│  │  └──────────────────────────┘   ││
│  └──────────────────────────────────┘│
│▓▓▓▓▓▓(navbar hidden behind sheet)▓▓▓│
└──────────────────────────────────────┘

After "Show 18 results":
  → Sheet closes (slides down)
  → Navbar reappears
  → Feed updates with filtered results
  → Rail pill shows badge: [⚙ Filter •2]
```

---

## Route-by-Route Layouts (ASCII)

### Homepage `/`

```
┌──────────────────────────────────────┐
│  ≡  treido.  [🔍 Search...]    ♡ 🛒│  header (44px)
├──────────────────────────────────────┤
│  [For You✓] [Newest] [Deals] [⚙Flt]│  smart rail (40px)
├──────────────────────────────────────┤
│  ┌────────┐ ┌────────┐              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │  84px from top = first product
│  │ ░image░ │ │ ░image░ │              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │  2-col grid, 10px gap
│  ├────────┤ ├────────┤              │
│  │ 👤 Joe │ │ 👤 Ana │              │  seller row
│  │ iPhone  │ │ Dress  │              │  title (1 line)
│  │ €450 2h │ │ €32 1d │              │  price + freshness
│  └────────┘ └────────┘              │
│  ┌────────┐ ┌────────┐              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │
│  ├────────┤ ├────────┤              │
│  │ ...    │ │ ...    │              │  infinite scroll
│  └────────┘ └────────┘              │
│                                      │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │  tab bar (52px + safe)
└──────────────────────────────────────┘

Total chrome: 44 + 40 + 52 = 136px (vs current 164+52 = 216px)
Content visible: 667 - 136 = 531px (vs current 667 - 216 = 451px)
Gained: +80px of product visibility
```

### Homepage with Category Selected

```
┌──────────────────────────────────────┐
│  ≡  treido.  [🔍 Electronics▾] ♡ 🛒│  search shows context
├──────────────────────────────────────┤
│  [✕All] [📱Phones✓] [💻Lap] [⚙Flt] │  rail morphed to subcategories
├──────────────────────────────────────┤
│  ┌────────┐ ┌────────┐              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │  filtered: Phones only
│  │ ░phone░ │ │ ░phone░ │              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │
│  ├────────┤ ├────────┤              │
│  │ iPhone │ │ Galaxy │              │
│  │ €450   │ │ €380   │              │
│  └────────┘ └────────┘              │
│  ...                                 │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

### Category Page `/categories/electronics`

```
┌──────────────────────────────────────┐
│  ←  Electronics             🔍  ⋮   │  contextual header
├──────────────────────────────────────┤
│  [All✓] [Phones] [Laptops] [⚙ Flt] │  smart rail (subcategories)
├──────────────────────────────────────┤
│  ┌────────┐ ┌────────┐              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │  product grid
│  │ ░image░ │ │ ░image░ │              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │
│  ├────────┤ ├────────┤              │
│  │ title  │ │ title  │              │
│  │ €price │ │ €price │              │
│  └────────┘ └────────┘              │
│  ...infinite scroll...               │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

### Categories Index `/categories`

```
┌──────────────────────────────────────┐
│  ←  Categories                       │  contextual header
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐    │
│  │  🔍 Search categories...     │    │  search input
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────┐ ┌──────────┐          │
│  │  📱      │ │  👗      │          │  icon grid (2-3 cols)
│  │ Electro. │ │ Fashion  │          │  tappable cards
│  └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐          │
│  │  🏠      │ │  ⚽      │          │
│  │ Home     │ │ Sports   │          │
│  └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐          │
│  │  🚗      │ │  📚      │          │
│  │ Auto     │ │ Books    │          │
│  └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐          │
│  │  🎮      │ │  💄      │          │
│  │ Gaming   │ │ Beauty   │          │
│  └──────────┘ └──────────┘          │
│  ...                                 │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

### Product Detail Page (PDP) — OLX Visual Drawer Pattern

**This is CSS-only. NOT a real Vaul drawer. Normal page scroll.**

```
┌──────────────────────────────────────┐
│  ←  Seller Name          ♡  ⤴  ⋮   │  product header (transparent over image)
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────────┐│
│  │                                  ││
│  │        FULL-WIDTH IMAGE          ││  swipeable gallery
│  │        (edge to edge)            ││  no page padding
│  │        (4:3 ratio)               ││  dot indicators at bottom
│  │                                  ││
│  │              ● ○ ○ ○             ││  dot indicators
│  └──────────────────────────────────┘│
│  ╭──────────────────────────────────╮│◄── rounded-t-2xl
│  │         ▬▬▬▬▬▬▬ (handle)        ││    -mt-4 (overlaps image)
│  │                                  ││    shadow upward
│  │  €450.00 · Like New              ││    = OLX visual drawer trick
│  │  iPhone 14 Pro Max 256GB         ││
│  │  📍 Sofia · 🕐 2 hours ago      ││  location + freshness
│  │                                  ││
│  │  ─── Key Specs ─────────── ▾    ││  expandable accordion
│  │  Storage: 256GB                  ││  (top 4 always visible)
│  │  Color: Space Black              ││
│  │  Battery: 94%                    ││
│  │  Screen: 6.1" OLED              ││
│  │                                  ││
│  │  ─── Description ──────── ▾     ││  truncated, tap to expand
│  │  Great condition, always used    ││
│  │  with case and screen protec...  ││
│  │  [Read more]                     ││
│  │                                  ││
│  │  ─── Delivery ─────────────     ││
│  │  🚚 Shipping: €4.99 (2-3 days) ││
│  │  📍 Pickup: Sofia, Center       ││
│  │                                  ││
│  │  ─── Seller ───────────────     ││
│  │  ┌────────────────────────┐     ││
│  │  │ 👤 TechStore · ⭐ 4.8  │     ││  compact inline card
│  │  │ 52 sales · Joined 2024│     ││  tap → seller drawer
│  │  │            View Profile ▸│     ││
│  │  └────────────────────────┘     ││
│  │                                  ││
│  │  ─── Reviews (4.8 ⭐ · 23) ──  ││
│  │  ⭐⭐⭐⭐⭐ "Excellent seller"   ││  top 2 reviews
│  │  ⭐⭐⭐⭐☆ "Fast shipping"     ││  tap → all reviews
│  │  [See all 23 reviews →]         ││
│  │                                  ││
│  │  ─── Similar Items ────────     ││
│  │  ┌─────┐┌─────┐┌─────┐┌────    ││  horizontal scroll rail
│  │  │img  ││img  ││img  ││img     ││
│  │  │€430 ││€399 ││€475 ││€41     ││
│  │  └─────┘└─────┘└─────┘└────    ││
│  │                                  ││
│  ╰──────────────────────────────────╯│
├──────────────────────────────────────┤
│  [💬 Chat]     [🛒 Add to Cart €450]│  sticky CTA bar (existing)
└──────────────────────────────────────┘

NO BOTTOM TAB BAR — product page hides it (existing behavior).
Sticky CTA bar takes its place.
```

**CSS implementation (not a real drawer):**
```css
.pdp-gallery { width: 100%; padding: 0; /* full bleed */ }
.pdp-content {
  position: relative;
  margin-top: -16px;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  background: var(--color-background);
  box-shadow: var(--shadow-visual-drawer-up);
}
.pdp-handle {
  /* visual only, not interactive */
  width: 36px; height: 4px; margin: 8px auto;
  border-radius: 2px; background: var(--color-border);
}
```

### Search Overlay (Vaul drawer)

```
┌──────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  backdrop dim
│  ┌──────────────────────────────────┐│
│  │ ═══ handle ═══                   ││
│  │                                  ││
│  │  ┌────────────────────────┐ [✕] ││  auto-focus input
│  │  │ 🔍 Search products...  │      ││
│  │  └────────────────────────┘      ││
│  │                                  ││
│  │  Recent                          ││
│  │  [iphone 14] [nike shoes] [ps5]  ││  recent search chips
│  │                                  ││
│  │  Trending                        ││
│  │  ─────────────────────────       ││
│  │  1. iPhone 14 Pro           →    ││  tap → search results
│  │  2. Nike Air Max            →    ││
│  │  3. PlayStation 5           →    ││
│  │  4. Samsung Galaxy          →    ││
│  │                                  ││
│  │  ─── (typing: "iphone") ───     ││
│  │                                  ││
│  │  ┌─────┐ iPhone 14 Pro Max      ││  live results
│  │  │░img░│ €450 · Like New         ││  image + title + price
│  │  └─────┘                         ││
│  │  ┌─────┐ iPhone 14 128GB        ││
│  │  │░img░│ €380 · Good             ││
│  │  └─────┘                         ││
│  │  ┌─────┐ iPhone 13 Mini         ││
│  │  │░img░│ €290 · Like New         ││
│  │  └─────┘                         ││
│  │                                  ││
│  │  [View all results for "iphone"→]││
│  └──────────────────────────────────┘│
└──────────────────────────────────────┘
```

### Search Results Page `/search?q=iphone`

```
┌──────────────────────────────────────┐
│  ←  "iphone"  (42 results)    🔍    │  contextual header
├──────────────────────────────────────┤
│  [Relevance✓] [Price↑] [New] [⚙Flt]│  smart rail (sort + filter)
├──────────────────────────────────────┤
│  ┌────────┐ ┌────────┐              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │  results grid
│  │ ░image░ │ │ ░image░ │              │
│  │ ░░░░░░ │ │ ░░░░░░ │              │
│  ├────────┤ ├────────┤              │
│  │ iPhone │ │ iPhone │              │
│  │ €450   │ │ €380   │              │
│  └────────┘ └────────┘              │
│  ...                                 │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

### Sell Flow `/sell`

```
┌──────────────────────────────────────┐
│  ✕  Create Listing          2 of 5  │  close + step count
├──────────────────────────────────────┤
│  ●━━━●━━━○━━━○━━━○                  │  step progress bar
├──────────────────────────────────────┤
│                                      │
│  Title                               │
│  ┌──────────────────────────────┐    │
│  │ iPhone 14 Pro Max 256GB      │    │  text input
│  └──────────────────────────────┘    │
│                                      │
│  Description                         │
│  ┌──────────────────────────────┐    │
│  │ Excellent condition, always  │    │  textarea
│  │ used with case. Includes     │    │
│  │ original charger and box.    │    │
│  └──────────────────────────────┘    │
│                                      │
│  Condition                           │
│  ┌──────────────────────────────┐    │
│  │ Like New                  ▸  │    │  tap → condition picker
│  └──────────────────────────────┘    │
│                                      │
│                                      │
│                                      │
├──────────────────────────────────────┤
│  [← Back]              [Next →]     │  sticky footer
└──────────────────────────────────────┘

Step 1: Photos (upload + reorder)
Step 2: Details (title + description + condition)
Step 3: Category (hierarchical picker)
Step 4: Pricing (price + shipping + location)
Step 5: Review (summary card + publish)
```

### Account Hub `/account`

```
┌──────────────────────────────────────┐
│  ←  My Account                       │  contextual header
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │  👤  Radev                    │    │  profile hero card
│  │      @radev · ⭐ Pro plan     │    │  avatar + name + badge
│  │      ┌───────────────────┐    │    │
│  │      │  Edit Profile  →  │    │    │  CTA
│  │      └───────────────────┘    │    │
│  └──────────────────────────────┘    │
│                                      │
│  Shopping                            │  section label
│  ╭──────────────────────────────╮    │
│  │  📦  Orders              3  ▸│    │  grouped card
│  │  ─────────────────────────── │    │  (iOS Settings pattern)
│  │  ❤️  Wishlist            12  ▸│    │  inset dividers
│  │  ─────────────────────────── │    │
│  │  💳  Payments                ▸│    │
│  ╰──────────────────────────────╯    │
│                                      │
│  Selling                             │
│  ╭──────────────────────────────╮    │
│  │  🏪  My Listings          8  ▸│    │
│  │  ─────────────────────────── │    │
│  │  📊  Sales                   ▸│    │
│  │  ─────────────────────────── │    │
│  │  💰  Payouts                 ▸│    │
│  ╰──────────────────────────────╯    │
│                                      │
│  Settings                            │
│  ╭──────────────────────────────╮    │
│  │  📍  Addresses               ▸│    │
│  │  ─────────────────────────── │    │
│  │  🔔  Notifications           ▸│    │
│  │  ─────────────────────────── │    │
│  │  🔒  Security                ▸│    │
│  ╰──────────────────────────────╯    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │        Sign Out               │    │  destructive, bottom
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

### Account Sub-Page (e.g., Orders)

```
┌──────────────────────────────────────┐
│  ←  Orders                           │  contextual header
├──────────────────────────────────────┤
│  [All✓] [Pending 2] [Shipped] [Done]│  status filter rail
├──────────────────────────────────────┤
│                                      │
│  ╭──────────────────────────────╮    │
│  │  ┌─────┐  Order #1234        │    │  order card
│  │  │░img░│  iPhone 14 Pro      │    │  image + title + price
│  │  │░░░░░│  €450               │    │
│  │  └─────┘  🟡 Pending    2h  ▸│    │  status badge + time
│  ╰──────────────────────────────╯    │
│                                      │
│  ╭──────────────────────────────╮    │
│  │  ┌─────┐  Order #1233        │    │
│  │  │░img░│  Nike Air Max       │    │  tap → order detail drawer
│  │  │░░░░░│  €129               │    │
│  │  └─────┘  🟢 Delivered  1d  ▸│    │
│  ╰──────────────────────────────╯    │
│                                      │
│  ╭──────────────────────────────╮    │
│  │  ┌─────┐  Order #1230        │    │
│  │  │░img░│  LEGO Star Wars     │    │
│  │  │░░░░░│  €89                │    │
│  │  └─────┘  ✅ Completed  3d  ▸│    │
│  ╰──────────────────────────────╯    │
│                                      │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

### Chat `/chat`

```
┌──────────────────────────────────────┐
│  ←  Messages                         │  contextual header
├──────────────────────────────────────┤
│                                      │
│  ╭──────────────────────────────╮    │
│  │  👤 TechStore            2m  │    │  conversation list
│  │  Thanks, I'll ship it to... │    │  avatar + name + preview
│  │  🔵                          │    │  unread indicator
│  ╰──────────────────────────────╯    │
│  ╭──────────────────────────────╮    │
│  │  👤 Maria              1h    │    │
│  │  Is the dress still availab. │    │
│  ╰──────────────────────────────╯    │
│  ╭──────────────────────────────╮    │
│  │  👤 SportShop           3d   │    │
│  │  Your order has been ship... │    │
│  ╰──────────────────────────────╯    │
│                                      │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘

Conversation view:
┌──────────────────────────────────────┐
│  ←  TechStore             📱  ⋮     │  back + seller info
├──────────────────────────────────────┤
│              ┌────────────────┐      │
│              │ Hi! Is the     │      │  received (left, surface bg)
│              │ iPhone still   │      │
│              │ available?     │      │
│              └────────────────┘ 2:30 │
│                                      │
│  ┌────────────────────┐              │
│  │ Yes! It's in great │              │  sent (right, primary bg)
│  │ condition. Want to  │              │
│  │ see more photos?   │              │
│  └────────────────────┘ 2:31        │
│                                      │
│              ┌────────────────┐      │
│              │ Yes please!    │      │
│              └────────────────┘ 2:32 │
│                                      │
│  ┌───────────┐                       │
│  │ ░░░░░░░░░ │                       │  image attachment (inline)
│  │ ░░photo░░ │                       │
│  │ ░░░░░░░░░ │                       │
│  └───────────┘ 2:33                  │
│                                      │
├──────────────────────────────────────┤
│  📎  [Type a message...     ]  ➤    │  input bar (sticky, pb-safe)
└──────────────────────────────────────┘
```

### Checkout `/checkout`

```
┌──────────────────────────────────────┐
│  ←  Checkout                         │  minimal header
├──────────────────────────────────────┤
│   ① Address ─── ② Ship ─── ③ Pay    │  step indicator
│   ●━━━━━━━━━━━○━━━━━━━━━━━○         │  progress bar
├──────────────────────────────────────┤
│                                      │
│  Shipping Address                    │
│                                      │
│  ╭──────────────────────────────╮    │
│  │  Ivan Petrov             ✓   │    │  selected address
│  │  ul. Vitosha 15              │    │
│  │  Sofia, 1000, Bulgaria       │    │
│  ╰──────────────────────────────╯    │
│                                      │
│  ╭──────────────────────────────╮    │
│  │  Maria Petrova               │    │  other saved address
│  │  bul. Tsarigradsko 42        │    │
│  │  Plovdiv, 4000               │    │
│  ╰──────────────────────────────╯    │
│                                      │
│  [+ Add new address]                 │
│                                      │
│  ╭──────────────────────────────╮    │
│  │  Order summary          ▾   │    │  collapsible
│  │  iPhone 14 Pro      €450.00 │    │
│  │  Shipping            €4.99  │    │
│  │  ─────────────────────────  │    │
│  │  Total              €454.99 │    │
│  ╰──────────────────────────────╯    │
│                                      │
├──────────────────────────────────────┤
│  [Continue to Shipping  →  €454.99] │  sticky CTA + price
└──────────────────────────────────────┘
```

### Public Profile `/[username]` — Visual Drawer Pattern

```
┌──────────────────────────────────────┐
│  ←  @techstore             ⋮        │  contextual header
├──────────────────────────────────────┤
│                                      │
│            ┌──────┐                  │
│            │  👤  │                  │  large avatar
│            │ 64px │                  │
│            └──────┘                  │
│          TechStore                   │  display name
│          @techstore                  │  username
│     ⭐ 4.8 · 52 sales · Since 2024  │  stats row
│                                      │
│     ┌──────────┐ ┌──────────┐       │
│     │  Follow  │ │  Message │       │  action buttons
│     └──────────┘ └──────────┘       │
│                                      │
│  ╭──────────────────────────────────╮│◄── visual drawer treatment
│  │          ▬▬▬▬▬▬▬ (handle)        ││    rounded-t-2xl, -mt-0
│  │                                  ││    shadow upward
│  │  [Listings (24)]  [Reviews (23)] ││  tab toggle
│  │  ─────────────────────────────── ││
│  │                                  ││
│  │  ┌────────┐ ┌────────┐          ││  product grid
│  │  │ ░░░░░░ │ │ ░░░░░░ │          ││  reuses MobileProductCard
│  │  │ ░image░ │ │ ░image░ │          ││
│  │  ├────────┤ ├────────┤          ││
│  │  │ iPhone │ │ Galaxy │          ││
│  │  │ €450   │ │ €380   │          ││
│  │  └────────┘ └────────┘          ││
│  │  ...                             ││
│  ╰──────────────────────────────────╯│
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

### Auth Pages `/auth/login`

```
┌──────────────────────────────────────┐
│  ←  treido.                          │  minimal contextual header
├──────────────────────────────────────┤
│                                      │
│                                      │
│       ┌──────────────────┐           │
│       │  treido.          │           │  logo
│       │                    │           │
│       │  Welcome back     │           │  heading
│       │                    │           │
│       │  ┌──────────────┐ │           │
│       │  │ 🔵 Continue  │ │           │  Google OAuth (prominent)
│       │  │ with Google   │ │           │
│       │  └──────────────┘ │           │
│       │                    │           │
│       │  ── or ──         │           │  divider
│       │                    │           │
│       │  Email             │           │
│       │  ┌──────────────┐ │           │
│       │  │              │ │           │  input (16px font)
│       │  └──────────────┘ │           │
│       │                    │           │
│       │  Password          │           │
│       │  ┌──────────────┐ │           │
│       │  │         👁   │ │           │  input + visibility toggle
│       │  └──────────────┘ │           │
│       │  Forgot password? │           │  link
│       │                    │           │
│       │  ┌──────────────┐ │           │
│       │  │   Sign In     │ │           │  primary CTA
│       │  └──────────────┘ │           │
│       │                    │           │
│       │  Don't have an    │           │
│       │  account? Sign up │           │  link
│       └──────────────────┘           │
│                                      │
└──────────────────────────────────────┘

NO BOTTOM TAB BAR on auth pages.
```

### Onboarding `/onboarding`

```
┌──────────────────────────────────────┐
│  Skip              Step 3 of 5       │  skip + step count
├──────────────────────────────────────┤
│  ●━━━●━━━●━━━○━━━○                  │  progress dots
├──────────────────────────────────────┤
│                                      │
│      What are you interested in?     │  heading
│      Pick categories you like        │  subheading
│                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  📱  │ │  👗  │ │  🏠  │        │  interest chips (grid)
│  │ Tech✓│ │ Fash │ │ Home │        │  tappable, multi-select
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  ⚽  │ │  🚗  │ │  📚  │        │
│  │Sport │ │ Auto✓│ │ Book │        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  🎮  │ │  💄  │ │  🎵  │        │
│  │ Game │ │Beaut │ │Music │        │
│  └──────┘ └──────┘ └──────┘        │
│                                      │
├──────────────────────────────────────┤
│  [← Back]              [Next →]     │  sticky footer
└──────────────────────────────────────┘

NO BOTTOM TAB BAR during onboarding.
```

### Plans/Pricing `/plans`

```
┌──────────────────────────────────────┐
│  ←  Plans & Pricing                  │
├──────────────────────────────────────┤
│                                      │
│  ← ┌──────────────┐ →               │  horizontal scroll
│     │  ⭐ Pro       │                │  snap-to-card
│     │              │                │
│     │  €9.99/mo    │                │  active plan highlighted
│     │              │                │
│     │  ✓ 50 listings│                │
│     │  ✓ Boosts ×5  │                │
│     │  ✓ Lower fees │                │
│     │  ✓ Analytics  │                │
│     │              │                │
│     │ [Current Plan]│                │
│     └──────────────┘                │
│                                      │
│  ── Compare Features ──  ▾          │  collapsible comparison
│  ╭──────────────────────────────╮    │
│  │              Free  Pro  Biz   │    │
│  │  Listings    5    50    ∞     │    │
│  │  Boosts      0     5    20    │    │
│  │  Fee %      10%    5%    3%   │    │
│  │  Analytics   ✗     ✓     ✓    │    │
│  ╰──────────────────────────────╯    │
│                                      │
├──────────────────────────────────────┤
│  🏠   ⊞   ⊕   💬   👤             │
└──────────────────────────────────────┘
```

---

## Phase Plan (Execution Order)

### Phase 0 — Foundation (build once, use everywhere)

#### 0A. Smart Contextual Rail Component

**What:** Create `SmartRail` — a single-row horizontal pill strip that replaces the current 2-rail system. **`SmartRail` is a pure renderer**: each route supplies the pill config (scopes, subcategories, sort/status), plus optional back/clear and filter actions.

**Files to create:**
- `components/mobile/chrome/smart-rail.tsx` — the rail component
- `components/mobile/chrome/use-smart-rail.ts` — *optional* small adapter helpers (no global state machine)

**Behavior:**
- Depth 0: scope pills (For You, Newest, Deals, Nearby) + filter trigger
- Depth 1+: back/clear + subcategory pills + filter trigger
- Horizontal scroll, no-scrollbar
- Active pill = `bg-foreground text-background`, inactive = `bg-surface-subtle`
- Filter trigger always at end, shows badge count when filters active
- ~40px height, sticky below header

**Done criteria:**
- Renders 1 row at each depth level
- Back arrow navigates up one level
- Filter trigger fires callback (for opening filter sheet)
- Active/inactive pill styling matches `getMobileQuickPillClass`
- Touch targets ≥ 44px
- No horizontal overflow at 360px viewport
- Passes typecheck + lint + styles:gate

#### 0B. Standardize Headers to 3 Variants

| Current (5) | New (3) | Notes |
|---|---|---|
| `homepage` | `homepage` | Hamburger + logo + search pill (with optional context chip) + icons |
| `contextual` | `contextual` | Back + title + optional trailing actions. Absorbs old profile + minimal. |
| `product` | `product` | Back + seller info + share/wishlist. Unchanged. |
| `profile` | → merged into `contextual` | Back + username + follow action as trailing slot. |
| `minimal` | → merged into `contextual` | Back + "treido." as title + no actions. |

**Files to modify:** `header/types.ts`, delete `profile-header.tsx` + `minimal-header.tsx`, migrate callers.

**Done criteria:** 3 header files remain. All routes compile. Profile shows follow. Auth shows logo. Update `docs/context/design-system.md` header-variants list to match.

#### 0C. Migrate Custom Drawer Headers to DrawerShell

**What:** 15 drawers with bespoke headers → all use `DrawerShell`.

**Files:** See full list in audit section above.

**Done criteria:** Consistent close/title/description across all drawers. No bespoke implementations.

#### 0D. VisualDrawerSurface Primitive

**What:** CSS-only component for the OLX "content overlapping image" pattern. Used on PDP + public profile.

```tsx
<VisualDrawerSurface>
  {/* content that looks like a drawer but scrolls normally */}
</VisualDrawerSurface>
```

Implementation: `rounded-t-2xl`, negative top margin to overlap, upward shadow, visual handle bar.

**Files to create:** `components/shared/visual-drawer-surface.tsx`

**Done criteria:** Pure CSS component, no Vaul dependency, renders visual drawer look, scrolls normally.

#### 0E. MobileStepProgress Component

**What:** Step dots / progress bar for multi-step flows (sell, checkout, onboarding).

```tsx
<MobileStepProgress current={2} total={5} />
```

Renders: `●━━━●━━━○━━━○━━━○`

**Files to create:** `components/mobile/chrome/mobile-step-progress.tsx`

**Done criteria:** Shows dots for each step. Active filled, completed filled, future outlined. Accessible.

---

### Phase 1 — Homepage

#### 1A. Replace Two Rails with Smart Rail

**What:** Remove `MobileHomeRails` (primary + secondary + banner = 164px). Mount `SmartRail` (40px).

**Files to modify:**
- `mobile-home.tsx` — remove `MobileHomeRails`, add `SmartRail`
- `mobile-home-feed.tsx` — adjust top padding
- Delete: `mobile-home-rails.tsx`

**State mapping:**
- Depth 0: rail shows scope pills (reuse `DISCOVERY_SCOPES`)
- Depth 1: rail shows subcategory pills (reuse `activeSubcategories`)
- Depth 2: rail shows L2 category pills
- Filter trigger → opens existing `FilterHub` as temporary Vaul sheet

**Done criteria:**
- First product visible at ~84px from top (vs current ~164px)
- All 5 scopes accessible
- Category drill-down works via bottom-tab Categories → sheet → pick → rail morphs
- Filters work via `⚙ Filter` → temporary sheet → apply → close
- Same data (useHomeDiscoveryFeed) unchanged
- Infinite scroll works

#### 1B. Header Context Chip

**What:** When scope ≠ "forYou" or category selected, show chip in search bar: `[🔍 Electronics ▾]`

**Done criteria:** Chip visible when filtered. Tap chip → expand category browse sheet. Hidden on default "For You".

#### 1C. Category Browse Sheet (from ⊞ tab)

**What:** When user taps ⊞ Categories in bottom tab bar while on homepage, open a temporary Vaul sheet with category icon grid.

**Done criteria:** Sheet shows icon grid → tap category → sheet closes → rail morphs → feed updates.

---

### Phase 2 — Category Pages

#### 2A. Category [slug] — Smart Rail

**What:** Replace drilldown rail + filter chips with `SmartRail` (subcategories + filter trigger).

**Done criteria:** Products start immediately below contextual header + rail. Subcategory switching via pills. Filter via temporary sheet.

#### 2B. Categories Index — Icon Grid Browse

**What:** `/categories` as full-screen icon grid (search + category cards). See ASCII above.

**Done criteria:** 2-3 col grid, search filter, tap → navigate to `/categories/[slug]`.

---

### Phase 3 — PDP

#### 3A. OLX Visual Drawer Treatment

**What:** Gallery full-bleed + content in `VisualDrawerSurface`. Sections become expandable accordions. See PDP ASCII above.

**Files to modify:** `mobile-product-single-scroll.tsx`, `mobile-gallery.tsx`

**Done criteria:**
- Gallery full-width, no padding
- Content area has `rounded-t-2xl`, `-mt-4`, upward shadow
- Visual handle bar at top of content
- Price + title + location always visible (never collapsed)
- Specs, description, delivery, seller, reviews = expandable sections
- Similar items = horizontal scroll rail
- Sticky CTA bar unchanged

#### 3B. Gallery Polish

**What:** Dot indicators, smooth swipe, tap-to-fullscreen.

**Done criteria:** Dots, smooth swipe, lazy-load. Optional polish (Phase 9): tap-to-fullscreen overlay.

---

### Phase 4 — Search

#### 4A. Search → Vaul Drawer

**What:** Replace custom `div` overlay with Vaul drawer (full-height snap).

**Done criteria (MVP):** Auto-focus, recent searches, submit → `/search`, "View all" link, swipe-down closes.
**Optional polish (Phase 9):** Trending + debounced live results inside the drawer.

#### 4B. Search Results — Smart Rail

**What:** `/search` results page uses Smart Rail (sort pills + filter trigger).

**Done criteria:** Rail with [Relevance] [Price↑] [Price↓] [New] [⚙ Filter]. Filter sheet temporary.

---

### Phase 5 — Sell Flow

#### 5A. Mobile Step-by-Step Form

**What:** Replace current form with 5-step linear flow using `MobileStepProgress`. See ASCII above.

**Steps:** Photos → Details → Category → Pricing → Review

**Done criteria:** Progress indicator, step validation, Back/Next footer, < 2 min for basic listing.

---

### Phase 6 — Account Pages

#### 6A. Account Hub — iOS Settings Layout

**What:** Profile card + grouped-card sections. See ASCII above.

**Done criteria:** Grouped cards at 375px, badge counts, contextual sub-page headers, sign out at bottom.

#### 6B. Orders — List + Drawer Detail

**Done criteria:** Status filter rail, order cards, tap → detail drawer.

#### 6C. Selling — Listing Management

**Done criteria:** Listing cards with status, quick actions, edit/boost/delete.

---

### Phase 7 — Chat

#### 7A. Conversation List + Message Bubbles

**What:** Polish conversation list and message view. See ASCII above.

**Done criteria:** Avatar + preview + unread dot in list. Sent/received bubble alignment. Inline images. Sticky input.

---

### Phase 8 — Checkout

> Guardrail: UI-only. Stop for approval before touching Stripe/payment logic, webhooks, DB schema, or RLS.

#### 8A. Step Visualization

**What:** 3-step checkout with `MobileStepProgress`. See ASCII above.

**Done criteria:** Address → Shipping → Payment steps. Visual progress bar. Sticky CTA footer with price.

---

### Phase 9 — Polish & Secondary

| Sub-phase | Route | What | Priority |
|---|---|---|---|
| 9A | Onboarding | Step dots, chip grid, polish | Medium |
| 9B | Plans | Horizontal scroll cards, comparison table | Medium |
| 9C | Auth | Centered card, Google OAuth prominent, polish | Medium |
| 9D | Profile | Visual drawer surface for listings/reviews | Medium |
| 9E | Legal/Support | Contextual header + readable content + no overflow | Low |

---

## Component Changes Summary

### New Components

| Component | Location | Purpose |
|---|---|---|
| `SmartRail` | `components/mobile/chrome/smart-rail.tsx` | Single adaptive pill rail |
| `use-smart-rail.ts` | `components/mobile/chrome/` | Optional route adapter helpers (no global state machine) |
| `VisualDrawerSurface` | `components/shared/visual-drawer-surface.tsx` | CSS drawer look (PDP, profile) |
| `MobileStepProgress` | `components/mobile/chrome/mobile-step-progress.tsx` | Step dots for multi-step flows |
| `CategoryIconGrid` | `components/mobile/category-nav/category-icon-grid.tsx` | Category browse grid |

### Components to Delete

| Component | Reason |
|---|---|
| `mobile-home-rails.tsx` | Replaced by SmartRail |
| `profile-header.tsx` (mobile) | Merged into contextual |
| `minimal-header.tsx` (mobile) | Merged into contextual |

### Components to Modify

| Component | Change |
|---|---|
| `mobile-home.tsx` | Mount SmartRail, wire to useHomeDiscoveryFeed |
| `mobile-home-feed.tsx` | Adjust top padding (less chrome) |
| `homepage-header.tsx` | Add context chip inside search bar |
| `mobile-product-single-scroll.tsx` | VisualDrawerSurface, accordion sections |
| `mobile-gallery.tsx` | Full-bleed, dot indicators |
| `mobile-search-overlay.tsx` | Convert to Vaul drawer |
| `sell mobile-layout.tsx` | MobileStepProgress, Back/Next footer |
| `account-layout-content.tsx` | Grouped-card mobile hub |
| 15 custom-header drawers | Migrate to DrawerShell |

---

## Design Tokens (New)

Add to `app/globals.css`:

| Token | Value | Usage |
|---|---|---|
| `--smart-rail-height` | 40px | Smart rail height |
| `--step-dot-size` | 8px | Step progress dots |
| `--shadow-visual-drawer-up` | `0 -4px 16px oklch(0 0 0 / 0.06)` | Upward shadow for VisualDrawerSurface |

**Keep it lean:** Prefer existing tokens (`--radius-2xl`) and standard spacing (`-mt-4`) before adding new ones. Add tokens only when multiple surfaces need the exact same value.

---

## Anti-Patterns to Avoid

| Anti-pattern | Why bad | Do instead |
|---|---|---|
| Multiple stacked rails | Eats 25% of viewport | ONE SmartRail, 40px |
| Persistent bottom sheet for nav | Marketplace ≠ map app. Extra friction. | Temporary sheets for actions only |
| Full-screen div overlay for search | No Vaul, no a11y, fragile scroll lock | Vaul drawer (full-height snap) |
| Desktop forms on mobile | Cramped, can't tap | Step-by-step + sticky CTA |
| All PDP sections expanded | Scroll fatigue, info overload | Expandable accordions |
| Real Vaul drawer for PDP content | Unnecessary complexity | CSS-only VisualDrawerSurface |
| Inconsistent drawer headers | Every drawer feels different | DrawerShell for ALL drawers |
| Removing bottom nav bar | Users expect it, every competitor has it | KEEP. Standard 5-tab layout. |

---

## Phasing & Priority

| Phase | Impact | Complexity | Priority |
|---|---|---|---|
| **0** Foundation | Enables everything | Medium | **Must do first** |
| **1** Homepage | Highest-traffic page, biggest visual win | High | **Critical** |
| **2** Categories | Second-highest traffic | Medium | **High** |
| **3** PDP | Conversion-critical, high wow factor | Medium | **High** |
| **4** Search | Currently broken | Medium | **Critical** |
| **5** Sell Flow | Currently terrible | High | **Critical** |
| **6** Account | Broken on mobile | High | **Critical** |
| **7** Chat | Semi-decent | Medium | **Medium** |
| **8** Checkout | Functional but basic | Medium | **Medium** |
| **9** Polish | Nice-to-have | Low-Medium | **Low** |

### Execution Dependency Graph

```
Phase 0A (SmartRail) + 0D (VisualDrawerSurface) + 0E (StepProgress)
  ↓                                                [parallel builds]
Phase 0B (header merge) + 0C (drawer standardization)
  ↓                                                [parallel]
Phase 1 (homepage — uses SmartRail)
  ↓
Phase 2 (categories) + Phase 4 (search)            [parallel]
  ↓
Phase 3 (PDP — uses VisualDrawerSurface)
  ↓
Phase 5 (sell — uses StepProgress) + Phase 6 (account)  [parallel]
  ↓
Phase 7 (chat) + Phase 8 (checkout — uses StepProgress) [parallel]
  ↓
Phase 9 (polish — all remaining)
```

---

## Verification Checklist (per phase)

```bash
# Code quality (mandatory)
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit

# Performance (per phase)
- [ ] Lighthouse Mobile on key pages (Home, PDP, Search): LCP < 2.5s, CLS < 0.1
- [ ] Images have stable sizes (no layout shift in grids)
- [ ] Drawer open/close feels 60fps (no scroll-lock jank)

# Accessibility (per phase)
- [ ] All icon buttons have `aria-label`
- [ ] Drawers/sheets have a title, trap focus, and return focus on close
- [ ] `prefers-reduced-motion` does not break navigation

# Visual check (manual, per phase)
- [ ] iPhone SE (375px) — no horizontal overflow
- [ ] iPhone 14 (390px) — proper spacing, no cramping
- [ ] Android (360px) — touch targets ≥ 44px
- [ ] iPad mini (768px) — md breakpoint: desktop takes over

# UX check (manual, per phase)
- [ ] First product visible within ~84px of viewport top (homepage)
- [ ] Navigation accessible within 1 tap (rail) or 2 taps (sheet)
- [ ] Every interactive element has hover + active + focus-visible states
- [ ] Temporary sheets close properly (swipe down, tap X, or apply)
- [ ] Tab bar visible on all non-PDP, non-auth, non-sell, non-checkout routes
- [ ] No drawer/sheet overlaps with tab bar when both visible
```

---

*Created: 2026-02-21*
*Status: Planning — not yet executed*
*Owner: Human + Claude (doc master)*
