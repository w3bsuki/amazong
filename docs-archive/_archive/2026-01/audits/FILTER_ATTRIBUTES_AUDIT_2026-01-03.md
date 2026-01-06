# 🚨 FILTER ATTRIBUTES SYSTEM AUDIT
## Date: January 3, 2026

---

## 🔴 CRITICAL FINDINGS

### The Problem You Saw
When navigating to **Fashion → Women's → Clothing**, users see filters like:
- `Кройка` (Fit)
- `Дължина` (Length)  
- `Деколте` (Neckline)
- `Дължина на ръкав` (Sleeve Length)
- `Шарка` (Pattern)
- `Повод` (Occasion)

**But NOT the essential filters:**
- ❌ **Condition** (New/Used)
- ❌ **Brand**
- ❌ **Size**
- ❌ **Color**
- ❌ **Material**

The same broken filters show for **Automotive → Vehicles → Cars** which should have Make/Model/Year!

---

## 📊 ROOT CAUSE ANALYSIS

### How the Filter System Works (The Bug)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ USER NAVIGATES TO: /categories/women-clothing (L2 Category)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Code Path: app/[locale]/(main)/categories/[slug]/page.tsx                  │
│  ↓                                                                          │
│  getCategoryContext(slug) → lib/data/categories.ts                          │
│  ↓                                                                          │
│  Fetches attributes WHERE category_id = <current_category>                  │
│  ↓                                                                          │
│  IF current category has 0 attributes → Falls back to PARENT attributes    │
│  ↓                                                                          │
│  PROBLEM: Women's Clothing (L2) HAS 6 attributes defined!                   │
│  So it shows ONLY those 6, NOT the parent Fashion (L0) attributes           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Structure Reality

#### Fashion Category Hierarchy

| Level | Category | Slug | Filterable Attributes |
|-------|----------|------|----------------------|
| L0 | Fashion | `fashion` | 8 attrs: Gender, **Condition**, **Size**, **Color**, **Material**, **Brand**, Style, Season |
| L1 | Women's | `fashion-womens` | 0 attrs (inherits L0) ✅ |
| L2 | Clothing | `women-clothing` | 6 attrs: Fit, Length, Neckline, **Sleeve Length**, Pattern, Occasion |
| L2 | Shoes | `women-shoes` | 0 attrs (should inherit L0) |
| L2 | Accessories | `women-accessories` | 0 attrs |

**THE BUG:** `women-clothing` has its own attributes, so `getCategoryContext()` uses ONLY those 6, completely IGNORING the 8 essential L0 attributes (Condition, Size, Color, Material, Brand).

#### Automotive Category Hierarchy

| Level | Category | Slug | Filterable Attributes |
|-------|----------|------|----------------------|
| L0 | Automotive | `automotive` | 10 attrs: Vehicle Make, **Condition**, Part Type, Fuel Type, Year Range, Part Origin, Warranty, Vehicle Type, Parts Brand, Position |
| L1 | Vehicles | `vehicles` | 7 attrs: **Make**, **Model**, **Year**, Transmission, Mileage, Engine Size, Color |
| L2 | Cars | `cars` | 6 attrs: Body Type, Mileage (km), Engine Size (cc), Engine Size (L), Power (HP), Drive Type |

**THE BUG:** `cars` (L2) has its own 6 attributes, so it ignores the parent `vehicles` (L1) attributes like **Make/Model/Year**!

---

## 🔬 Technical Deep Dive

### Current Code Logic (lib/data/categories.ts lines 620-650)

```typescript
// Default behavior: show ONLY the current category's filterable attributes.
// If the category has none, inherit parent's (legacy behavior).
let attributes = currentAttributes

if (attributes.length === 0 && parentAttributes.length > 0) {
  attributes = parentAttributes  // ← Only triggers when current has ZERO
} else if (attributes.length > 0 && parentAttributes.length > 0) {
  // Targeted fallback: if a current-category attribute is missing options,
  // borrow options/type from the parent attribute with the same name.
  // ← This only helps if attribute NAMES match, doesn't merge lists!
}
```

**Problem:** The code was designed to either use current OR parent, not MERGE them intelligently.

### Database Stats

| Metric | Value |
|--------|-------|
| Total `category_attributes` rows | 7,113 |
| L0 categories with attrs | 24 |
| L1 categories with attrs | varies |
| L2+ categories with attrs | 2,000+ |

---

## 🎯 SOLUTION: ATTRIBUTE INHERITANCE REFACTOR

### Option A: Smart Merge (Recommended) ⭐

**Strategy:** Always show BOTH parent + current attributes, with current taking precedence for duplicates.

```typescript
// NEW LOGIC for getCategoryContext():
let mergedAttributes: CategoryAttribute[] = []

// Start with L0 (root) attributes - these are the "universal" filters
// (Condition, Brand, Price Rating always relevant)
const l0Attributes = await getCategoryAttributes(rootCategoryId)

// Add L1 parent attributes (if exists)
// Add current category attributes

// Dedupe by normalized name, current category wins
const attrMap = new Map<string, CategoryAttribute>()

for (const attr of [...l0Attributes, ...parentAttributes, ...currentAttributes]) {
  attrMap.set(normalizeAttributeName(attr.name), attr)
}

// Sort by: L0 universal first (Condition, Brand, Size, Color), then specific
```

### Option B: Explicit Inheritance Flag

Add `inherit_parent_attributes: boolean` column to `category_attributes` table:
- When `true`, automatically include parent's attributes
- When `false`, only show current category's attributes

### Option C: Category-Specific Filter Presets (Config-Based)

Replace database attributes with a TypeScript config file:

```typescript
// lib/config/category-filters.ts
export const CATEGORY_FILTERS = {
  'fashion': {
    universal: ['condition', 'brand', 'size', 'color', 'material', 'price'],
    children: {
      'women-clothing': ['fit', 'length', 'neckline', 'sleeve_length', 'pattern'],
      'women-shoes': ['shoe_size', 'heel_height', 'shoe_type'],
      // ...
    }
  },
  'automotive': {
    universal: ['condition', 'year_range', 'price'],
    children: {
      'vehicles': ['make', 'model', 'year', 'mileage', 'fuel_type', 'transmission'],
      'auto-parts': ['part_type', 'oem_aftermarket', 'vehicle_compatibility'],
      // ...
    }
  }
}
```

---

## 📋 RECOMMENDED FIX PLAN

### Phase 1: Quick Fix (Database)

Update `women-clothing` and similar L2 categories to include essential parent attributes:

```sql
-- Add missing essential attributes to Women's Clothing
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, is_required, sort_order, options, options_bg)
SELECT 
  'b1000000-0000-0000-0002-000000000001' as category_id,  -- Women's Clothing
  name, name_bg, attribute_type, is_filterable, is_required, 
  sort_order - 10,  -- Put before existing attrs
  options, options_bg
FROM category_attributes
WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0'  -- Fashion L0
  AND name IN ('Condition', 'Size', 'Color', 'Material', 'Brand')
  AND NOT EXISTS (
    SELECT 1 FROM category_attributes ca2 
    WHERE ca2.category_id = 'b1000000-0000-0000-0002-000000000001'
      AND ca2.name = category_attributes.name
  );
```

### Phase 2: Code Refactor

Modify `getCategoryContext()` to always merge L0 + parent + current:

```typescript
export async function getCategoryContext(slug: string): Promise<CategoryContext | null> {
  // ... existing code ...

  // NEW: Get ancestry to find L0
  const ancestry = await getCategoryAncestry(slug)
  const rootSlug = ancestry?.[0]
  
  let l0Attributes: CategoryAttribute[] = []
  if (rootSlug && rootSlug !== slug) {
    const rootCat = await getCategoryBySlug(rootSlug)
    if (rootCat) {
      l0Attributes = await getCategoryAttributes(rootCat.id)
    }
  }

  // Merge: L0 (universal) → Parent → Current (wins on duplicates)
  const attrMap = new Map<string, CategoryAttribute>()
  
  for (const attr of l0Attributes) {
    attrMap.set(normalizeAttributeName(attr.name), attr)
  }
  for (const attr of parentAttributes) {
    attrMap.set(normalizeAttributeName(attr.name), attr)
  }
  for (const attr of currentAttributes) {
    attrMap.set(normalizeAttributeName(attr.name), attr)
  }

  // Define "universal" attributes that should always be first
  const UNIVERSAL_ORDER = ['condition', 'brand', 'size', 'color', 'price']
  
  attributes = Array.from(attrMap.values()).sort((a, b) => {
    const aUniversal = UNIVERSAL_ORDER.indexOf(normalizeAttributeName(a.name))
    const bUniversal = UNIVERSAL_ORDER.indexOf(normalizeAttributeName(b.name))
    
    if (aUniversal !== -1 && bUniversal === -1) return -1
    if (bUniversal !== -1 && aUniversal === -1) return 1
    if (aUniversal !== -1 && bUniversal !== -1) return aUniversal - bUniversal
    
    return (a.sort_order ?? 999) - (b.sort_order ?? 999)
  })
}
```

### Phase 3: Per-Category Attribute Cleanup

#### Fashion Categories - Ideal Attributes

| Category | Required Attributes |
|----------|-------------------|
| Fashion (L0) | Condition, Brand, Size, Color, Material, Style, Season |
| Women's Clothing | + Fit, Length, Neckline, Sleeve Length, Pattern, Occasion |
| Women's Shoes | + Shoe Size, Heel Height, Shoe Type, Width |
| Men's Clothing | + Fit, Rise (pants), Inseam |
| Kids' Clothing | + Age Range, Fit |

#### Automotive Categories - Ideal Attributes

| Category | Required Attributes |
|----------|-------------------|
| Automotive (L0) | Condition, Year Range, Vehicle Compatibility |
| Vehicles (L1) | + Make, Model, Year, Fuel Type, Transmission, Mileage |
| Cars (L2) | + Body Type, Drive Type, Engine Size, Power, Color |
| Auto Parts (L1) | + Part Type, OEM/Aftermarket, Part Brand, Position, Warranty |

---

## 🛑 CRITICAL: What NOT to Do

1. ❌ Don't delete all 7,113 category_attributes and start over
2. ❌ Don't add Condition/Brand/Size to EVERY single L3/L4 category manually
3. ❌ Don't make the filter drawer show 50+ attributes

---

## ✅ IMMEDIATE ACTION ITEMS

1. **Fix the inheritance logic** in `lib/data/categories.ts` (~20 lines of code)
2. **Add missing L0 attributes** to the most-visited L2 categories:
   - `women-clothing`
   - `men-clothing`
   - `cars`
   - `auto-parts`
3. **Test thoroughly** on mobile filter drawer
4. **Consider capping** visible filters to 8-10 most relevant

---

## 🔗 Related Files

- [lib/data/categories.ts](../lib/data/categories.ts) - `getCategoryContext()` function
- [components/shared/filters/mobile-filters.tsx](../components/shared/filters/mobile-filters.tsx) - Filter drawer UI
- [components/shared/filters/desktop-filters.tsx](../components/shared/filters/desktop-filters.tsx) - Desktop filters
- [app/\[locale\]/(main)/categories/\[slug\]/page.tsx](../app/[locale]/(main)/categories/[slug]/page.tsx) - Category page

---

## 📈 Success Metrics

After fix:
- [ ] Fashion → Women's → Clothing shows: Condition, Brand, Size, Color, Material + Fit, Length, etc.
- [ ] Automotive → Vehicles → Cars shows: Make, Model, Year, Condition + Body Type, Engine, etc.
- [ ] No duplicate attributes in filter list
- [ ] Universal attributes (Condition, Brand) appear first

---

*Audit performed by analyzing Supabase `category_attributes` table and `getCategoryContext()` logic*
