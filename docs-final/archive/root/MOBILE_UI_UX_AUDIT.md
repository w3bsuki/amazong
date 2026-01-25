# Mobile UI/UX & Supabase Audit — January 2026

## Executive Summary

This audit identifies key friction points in Treido's mobile experience, badge/listing data flow, filter UX, and Supabase backend efficiency. The codebase has solid foundations but accumulated drift: inconsistent badge display, over-engineered data flows, and styling gaps compared to Temu/Vinted polish.

---

## 🔴 Critical Issues (Blocks Polish)

### 1. **Badge Data Flow Disconnected from Supabase**

**Problem**: Product cards show badges (free shipping, boosted, etc.) but the data isn't properly wired from Supabase → UI.

| Badge | Supabase Column | ProductCard Prop | Status |
|-------|-----------------|------------------|--------|
| Free Shipping | `products.free_shipping` | `freeShipping` | ❌ Not passed from queries |
| Sale/Discount | `products.is_on_sale`, `sale_percent` | `isOnSale`, `salePercent` | ⚠️ Partially used |
| Boosted | `products.is_boosted`, `boost_expires_at` | Not exposed | ❌ Missing UI badge |
| Condition | `products.condition` | `condition` | ⚠️ Inconsistent |
| Limited Stock | `products.is_limited_stock` | Not exposed | ❌ Missing |

**Evidence**: 

1. [product-card.tsx](components/shared/product/product-card.tsx#L196): `freeShipping = false` is the default
2. [search-products.ts](app/[locale]/(main)/categories/[slug]/_lib/search-products.ts#L22-L24) query SELECT only includes:
   ```ts
   "id,title,price,list_price,images,rating,review_count,category_id,slug,tags,attributes,created_at,profiles:..."
   ```
   **Missing**: `free_shipping`, `is_on_sale`, `sale_percent`, `is_boosted`, `boost_expires_at`, `is_limited_stock`, `condition`

**Fix**: Update search queries to include and pass all badge-relevant fields.

---

### 2. **Mobile Filter/Sort UX vs Temu**

**Problem**: Our mobile filter experience lacks the polished dropdown system Temu uses.

**Current State**:
- [InlineFilterBar](components/mobile/category-nav/inline-filter-bar.tsx): 50/50 split buttons (Filters | Sort) — functional but basic
- [QuickFilterRow](components/mobile/category-nav/quick-filter-row.tsx): Horizontal pills — good but underutilized
- [FilterModal](components/shared/filters/filter-modal.tsx): Bottom sheet — works but single-section only

**Temu Reference**:
- Top sticky bar with dropdown triggers
- Each filter is a dropdown (not full-page drawer)
- Multi-select with immediate visual feedback
- Count badges on active filters

**Recommended Pattern**:
```
┌─────────────────────────────────────────┐
│ [Category ▼] [Price ▼] [Sort ▼] [More]  │  ← Dropdown triggers
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ ☐ €0 - €25                              │
│ ☐ €25 - €50                             │  ← Dropdown panel
│ ☐ €50 - €100                            │
│ ☐ €100+                                 │
│ [Clear] [Apply]                         │
└─────────────────────────────────────────┘
```

**Action Items**:
- [ ] Create `DropdownFilter` component (headless dropdown, not drawer)
- [ ] Refactor `InlineFilterBar` to use dropdown triggers
- [ ] Add immediate count feedback on filters

---

### 3. **Category Icon Inconsistency**

**Problem**: Homepage uses category images, /categories page uses Phosphor icons mixed with icon field.

**Evidence**:
- [CategoryCircleVisual](components/shared/category/category-circle-visual.tsx#L58-L73): Falls back to: `image_url` → `icon` string → `getCategoryIcon()` Phosphor mapping
- Categories table has `icon` column (stores emoji/text) and `image_url` column
- Homepage circles show images when available; /categories shows icons/fallbacks

**Fix**:
- Decide on canonical approach: **images OR icons** (not both)
- Recommendation: Use **images** for L0/L1 (visually rich), icons only as fallback
- Update categories in Supabase: ensure all L0/L1 have `image_url` populated

---

### 4. **Segmented Control (ExploreBanner) Styling**

**Current State**: [ExploreBanner](components/mobile/explore-banner.tsx#L51-L70) uses:
- `bg-muted/30` container
- `bg-background text-foreground shadow-sm` for active tab
- Rounded corners, decent spacing

**Issues**:
- Height feels cramped (`h-touch-xs` = 32px)
- Border/shadow treatment inconsistent with rest of app
- Settings button feels disconnected

**Recommended Fix**:
```tsx
// Increase touch target
"h-touch-sm" // 36px instead of 32px

// More defined active state
isActive
  ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
  : "text-muted-foreground"
```

---

## 🟠 High Priority Issues

### 5. **Product Page Mobile (Needs Polish)**

**Current**: [MobileProductPage](components/mobile/product/mobile-product-page.tsx) exists and is functional but:
- Gallery transition feels basic compared to Vinted/StockX
- Price display could be more prominent
- Buy box feels cluttered

**Key Areas**:
- [ ] Increase price prominence (text-2xl → text-3xl, add bold weight)
- [ ] Clean up meta row (location/time/views) — too much info density
- [ ] Add clear "Add to Cart" primary CTA styling

### 6. **Supabase Schema Observations**

**Is it over-engineered?** The schema is actually **well-designed** for a marketplace:

| Table | Rows | Purpose | Assessment |
|-------|------|---------|------------|
| `products` | 247 | Core listings | ✅ Good — has all badge fields |
| `categories` | 13,139 | Category tree | ✅ Good — proper hierarchy |
| `category_attributes` | 7,116 | Dynamic filters | ✅ Good — enables category-specific filters |
| `badge_definitions` | 59 | Badge system | ⚠️ Complex but valid for gamification |
| `listing_boosts` | 11 | Promoted listings | ✅ Good — Stripe-integrated |
| `seller_stats` | 12 | Cached seller metrics | ✅ Good — denormalized for perf |
| `subscription_plans` | 6 | Seller tiers | ✅ Good |

**Not over-engineered** — it's appropriately complex for a C2C/B2C marketplace. The issue is **data isn't flowing to UI**, not schema bloat.

### 7. **/sell Form Missing Badge Controls**

The sell form at [sell/page.tsx](app/[locale]/(sell)/sell/page.tsx) needs to expose:
- [ ] `free_shipping` toggle
- [ ] `is_on_sale` + `sale_percent` controls
- [ ] Stock urgency (`is_limited_stock`)

Currently these columns exist in Supabase but aren't in the sell form UI.

---

## 🟡 Deferred / Polish Items

### 8. **Mobile Home Feed Improvements**

- [MobileHome](components/mobile/mobile-home.tsx) layout is functional
- PromotedListingsStrip uses horizontal cards — could be more impactful
- "For You" section needs personalization backend

### 9. **Subcategory Pills vs Circles**

Current mix:
- Homepage: L0 pills in header, L1 circles below
- /categories: L0 links, L1 circles with icons

**Recommendation**: Standardize on circles for L1+ (visual browse), pills for L0 (quick switch).

### 10. **Color Token Usage**

Audit found proper semantic token usage. No gradients detected. Minor arbitrary values exist but are acceptable per DESIGN.md exceptions.

---

## Action Plan

### Phase 1: Data Flow (Week 1)
1. Update product queries to include all badge-relevant fields
2. Pass badge data through to ProductCard
3. Wire up /sell form badge controls

### Phase 2: Mobile Filter Polish (Week 2)
1. Create dropdown-style filter triggers (Temu pattern)
2. Add filter count badges
3. Improve sticky filter bar UX

### Phase 3: Visual Polish (Week 3)
1. Fix segmented control styling (ExploreBanner)
2. Improve product page mobile layout
3. Standardize category icon/image approach

---

## Appendix: Specific Code Locations

### Badge Flow Fix

**Query location**: `app/[locale]/(main)/categories/[slug]/_lib/search-products.ts`

Add to select:
```ts
.select(`
  ...,
  free_shipping,
  is_on_sale,
  sale_percent,
  is_boosted,
  boost_expires_at,
  is_limited_stock
`)
```

**ProductCard consumption**: Already has props, just not passed.

### Filter Dropdown Component

Create: `components/shared/filters/filter-dropdown.tsx`

Pattern:
```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export function FilterDropdown({ label, children, activeCount }) {
  return (
    <Popover>
      <PopoverTrigger className="...">
        {label}
        {activeCount > 0 && <Badge>{activeCount}</Badge>}
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        {children}
      </PopoverContent>
    </Popover>
  )
}
```

### Sell Form Badge Controls

Location: `app/[locale]/(sell)/sell/client.tsx`

Add form fields for:
- Free Shipping toggle (Switch)
- On Sale toggle + percent input
- Limited Stock toggle

---

## Summary

| Area | Current State | Target State | Effort |
|------|---------------|--------------|--------|
| Badge Data Flow | ❌ Disconnected | ✅ Full flow | Medium |
| Mobile Filters | ⚠️ Basic | ✅ Temu-style | High |
| Category Icons | ⚠️ Inconsistent | ✅ Images primary | Low |
| Segmented Control | ⚠️ Cramped | ✅ Polished | Low |
| Product Page Mobile | ⚠️ Functional | ✅ Premium | Medium |
| Supabase Schema | ✅ Well-designed | ✅ Keep | None |
| Sell Form | ⚠️ Missing badges | ✅ Full controls | Medium |

**Bottom line**: The backend is solid. The issue is UI polish and data flow, not architecture.
