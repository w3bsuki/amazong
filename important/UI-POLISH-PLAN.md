# UI Polish Plan: Image 1 Patterns → 10/10 Production

**Date:** 2026-01-08  
**Status:** ✅ PHASE 2 + PHASE 3 + PHASE 4 COMPLETE  
**Goal:** Achieve "Clean European" marketplace density (Vinted/Treido style)  
**Constraint:** 1-3 files per change, no redesigns, preserve behavior

---

## ✅ Completed Changes (Phase 2)

### 4. Category Labels Shortened for Mobile Tabs
- **Before:** Long labels like "Електроника" (11 chars) getting truncated
- **After:** Short labels via `getCategoryShortName()`: "Техника", "Дом", "Авто" (4-7 chars)
- **Files:**
  - `components/mobile/category-nav/category-tabs.tsx`
  - `components/mobile/category-nav/category-quick-pills.tsx`
- **Implementation:** Used existing `getCategoryShortName()` from `lib/category-display.ts`

### Verification
- ✅ Typecheck passed

---

## ✅ Completed Changes (Phase 1)

### 1. Product Cards — Category Badge Removed
- **Before:** Category badge ("Мъже", "Панталони") on every card = visual clutter
- **After:** Clean hierarchy: Image → Price → Title → Meta
- **File:** `components/shared/product/product-card.tsx`

### 2. Logo — Lowercase with Period
- **Before:** `Treido` (title case, bold)
- **After:** `treido.` (lowercase, period, semibold, text-xl)
- **Files:** 
  - `components/layout/header/site-header.tsx` (mobile + desktop)
  - `components/layout/header/minimal-header.tsx`

### 3. Cart Badge — Capped at 9 (No Plus Sign)
- **Before:** Shows full count ("64") — too wide, draws attention
- **After:** Caps silently at 9 (shows "9" not "9+") — single character, compact
- **Files:**
  - `components/shared/count-badge.tsx` (logic: no "+" suffix)
  - `components/layout/header/cart/mobile-cart-dropdown.tsx` (max={9})
  - `components/layout/header/cart/cart-dropdown.tsx` (max={9})

### Verification
- ✅ Typecheck passed
- ⏳ E2E smoke (run before next phase)

---

## 🔜 Remaining Work (Phase 3+)

### ✅ P3: Filter Pills Consistency (COMPLETE)
- **Issue:** Some active pills not using inverted style
- **Target:** Active = `bg-foreground text-background border-foreground`
- **Files Changed:**
  - `components/mobile/category-nav/category-l3-pills.tsx` — Fixed "All" pill + L3 category pills
  - `components/mobile/category-nav/quick-filter-row.tsx` — Fixed quick filter pills
- **Status:** ✅ Complete

### ✅ P4: Design System Documentation (COMPLETE)
- **Issue:** `important/DESIGN.md` needed finalized token guidance
- **Target:** Document "what to use when" for radii, spacing, typography
- **Added:**
  - Token Usage Quick Reference section with tables for:
    - Border Radius (when to use `rounded-md` vs `rounded-full`)
    - Spacing (mobile vs desktop gaps, padding)
    - Typography (sizes, weights, use cases)
    - Touch Targets (minimum sizes for tappable elements)
    - Semantic Colors (token classes + rules)
    - Common Patterns (active/inactive pills, glass surfaces, cards)
- **Status:** ✅ Complete

---

## Files Changed (Phase 1 + 2 + 3 + 4)

| File | Change |
|------|--------|
| `components/shared/product/product-card.tsx` | Removed category badge |
| `components/shared/count-badge.tsx` | Cap at max without "+" suffix |
| `components/layout/header/site-header.tsx` | Logo: `treido.` (text-xl semibold) x2 |
| `components/layout/header/minimal-header.tsx` | Logo: `treido.` (text-xl semibold) |
| `components/layout/header/cart/mobile-cart-dropdown.tsx` | Badge max={9} |
| `components/layout/header/cart/cart-dropdown.tsx` | Badge max={9} |
| `components/mobile/category-nav/category-tabs.tsx` | Use `getCategoryShortName` for shorter labels |
| `components/mobile/category-nav/category-quick-pills.tsx` | Use `getCategoryShortName` for shorter labels |
| `components/mobile/category-nav/category-l3-pills.tsx` | Inverted active pill style |
| `components/mobile/category-nav/quick-filter-row.tsx` | Inverted active pill style |
| `important/DESIGN.md` | Added Token Usage Quick Reference section |

---

## Design Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Category badge | Removed entirely | Matches Vinted/Treido; user already knows context |
| Logo style | Lowercase `treido.` with period | Modern, tech feel (like Image 1) |
| Logo size | `text-xl` (20px) | Match hamburger button height |
| Badge overflow | Shows "9" for 10+ items | Single char = compact (no "+" sign) |
| Category labels | Short variants | "Техника" not "Електроника" = fits mobile tabs |
| Active pill style | `bg-foreground text-background` | Inverted = instant clarity, per DESIGN.md |

---

## Next Session: Pick Up Here

```bash
# 1. Run typecheck + E2E smoke to verify Phase 3
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# 2. Then tackle Phase 2 (category labels) or Phase 4 (design docs)
```

---

## Reference: Original Audit

### Image 1 (Inspiration) — 8.5/10
- Clean cards: Image → Price → Title → Meta
- Logo: lowercase with period
- Compact cart badge
- Short category labels

### Image 2 (Before Changes) — 6/10
- Category badge on every card ❌
- Logo: title case ❌
- Oversized cart badge ("64") ❌
- Long category labels ❌

### After Phase 4 — ~8.5/10
- Category badge removed ✅
- Logo: lowercase ✅
- Cart badge capped ✅
- Category labels shortened ✅ (Phase 2)
- Filter pills inverted style ✅ (Phase 3)
- Design system token documentation ✅ (Phase 4)
