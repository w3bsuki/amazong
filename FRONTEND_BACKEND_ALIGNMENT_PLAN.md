# 🎯 Frontend-Backend Alignment Plan: UX/UI Implementation

> **Created:** December 5, 2025  
> **Status:** Planning Phase  
> **Backend Reference:** `SUPABASE_CATEGORIES_FULL.md` (7,100+ categories, 1,220+ attributes)

---

## 📋 Executive Summary

This document outlines a phased approach to align the frontend UX/UI with our comprehensive Supabase backend, focusing on:
1. **Mega Menu Cleanup & Refactor** - Align with new L0-L3 hierarchy
2. **Category Sidebar UX** - Context-aware filtering by category depth
3. **Attribute-Based Filtering** - Enable users to browse/filter by category attributes
4. **Homepage Section Standardization** - Consistent styling across all product sections
5. **Image & Visual Updates** - Better category cards and images

---

## 🏗️ Current State Analysis

### Backend Structure (Supabase)
- **21 Active L0 Categories** (Electronics, Beauty, Fashion, Gaming, etc.)
- **7,100+ Total Categories** (L0 → L1 → L2 → L3 → L4)
- **1,220+ Filterable Attributes** with `is_filterable: true`
- **Attribute Types:** `select`, `multiselect`, `boolean`, `number`, `text`, `date`

### Frontend Issues Identified

| Component | Issue | Priority |
|-----------|-------|----------|
| `mega-menu.tsx` | Shows only L0 → L1, not L2 children | 🔴 High |
| `category-subheader.tsx` | Kids showing 2 cols not 3, Books/Hobbies same | 🔴 High |
| Homepage 4-Card Grid | Outdated images, needs better subcategory alignment | 🟡 Medium |
| `FeaturedProductsSection` | No tabs (unlike TrendingProducts & Deals) | 🟡 Medium |
| `search-filters.tsx` | Only shows L0 → L1, no attribute filters | 🔴 High |
| Category page sidebar | Shows ALL categories, not context-aware | 🟡 Medium |

---

## 📐 UX Architecture Decisions

### Decision 1: Category Sidebar Behavior

**Question:** When viewing `/categories/skincare`, should sidebar show:
- A) All L0 categories with expandable L1s (current behavior)
- B) Only `/skincare` children (L2: Cleansers, Moisturizers, Serums, etc.)
- C) Parent category (Beauty) with siblings + current category children

**✅ Decision: Option C - Contextual Hybrid Approach**

```
/categories/skincare shows:
┌─────────────────────────────────┐
│ ← Beauty (parent link)           │
├─────────────────────────────────┤
│ ▸ Makeup                        │  ← Siblings
│ ▸ Skincare ✓ (current)          │
│   ├─ Cleansers                  │  ← L2 children
│   ├─ Moisturizers               │
│   ├─ Serums                     │
│   ├─ Face Masks                 │
│   ├─ Sunscreen                  │
│   └─ Eye Cream                  │
│ ▸ Haircare                      │
│ ▸ Fragrance                     │
│ ▸ Bath & Body                   │
│ ▸ Oral Care                     │
│ ▸ Men's Grooming                │
│ ▸ Beauty Tools                  │
├─────────────────────────────────┤
│ 🔍 Filters (Attributes)         │
│ ├─ Skin Type: □ Oily □ Dry      │
│ ├─ Skin Concern: □ Acne □ Aging │
│ ├─ Key Ingredients              │
│ └─ SPF Level                    │
└─────────────────────────────────┘
```

**Logic:**
1. If viewing L0 (e.g., `/categories/beauty`) → Show L1 children
2. If viewing L1+ (e.g., `/categories/skincare`) → Show:
   - Breadcrumb to parent
   - Siblings at same level
   - Children (if any)
   - Filterable attributes for that category

---

### Decision 2: Attribute Filters Location

**✅ Decision: Sidebar Filters (Desktop) + Bottom Sheet (Mobile)**

- **Desktop:** Sidebar below category navigation
- **Mobile:** Filter bottom sheet with attribute sections

**Why Sidebar:**
- Amazon/eBay pattern users expect
- Attributes are category-specific, belong with category nav
- Main content area stays clean for products

---

### Decision 3: Attribute Filter Types

| Attribute Type | UI Component | Example |
|----------------|--------------|---------|
| `select` | Radio buttons or dropdown | Skin Type: Oily/Dry/Combo |
| `multiselect` | Checkboxes | Features: Vegan ☑️, Cruelty-Free ☑️ |
| `boolean` | Toggle/Checkbox | Organic: Yes/No |
| `number` | Range slider | SPF: 15-50+ |

---

## 📦 Phase 1: Mega Menu & Subheader Cleanup (Priority: 🔴 Critical)

### Task 1.1: Fix Mega Menu Column Count

**File:** `components/mega-menu.tsx`  
**Issue:** Categories like Kids, Books/Hobbies showing 2 columns instead of 3

**Current Config Issue:**
```typescript
// category-subheader.tsx MEGA_MENU_CONFIG
"baby-kids": {
  featured: ["baby-gear", "toys-games-sub", "kids-toys"],
  columns: 3, // ✅ Set to 3, but not rendering correctly
```

**Root Cause:** The `toys-games-sub` slug doesn't exist in DB - should be `toys-games`

**Fix Tasks:**
- [ ] **1.1.1** Audit all `MEGA_MENU_CONFIG` featured slugs against actual DB slugs
- [ ] **1.1.2** Update slug references:
  ```
  "baby-kids": ["baby-gear", "toys-games", "kids-clothing"]
  "hobbies": ["handmade", "hobby-tcg", "hobby-tabletop"]
  ```
- [ ] **1.1.3** Ensure `depth=3` API call returns full L0→L1→L2 hierarchy

### Task 1.2: Sync Mega Menu with Supabase L0s

**Current L0s in DB (21 active):**
```
electronics, home, beauty, fashion, sports, baby-kids, gaming, 
automotive, pets, real-estate, software, collectibles, wholesale, 
hobbies, jewelry-watches, grocery, tools-home, e-mobility, 
services, bulgarian-traditional
```

**Action Items:**
- [ ] **1.2.1** Remove deprecated categories from mega menu (computers, office-school, smart-home, toys)
- [ ] **1.2.2** Add missing L0s to `categoryIconMap` in mega-menu.tsx
- [ ] **1.2.3** Add missing L0s to `MEGA_MENU_CONFIG` in category-subheader.tsx

### Task 1.3: Update Subcategory Image Mapping

**File:** `components/mega-menu.tsx` → `subcategoryImages`

- [ ] **1.3.1** Add image URLs for new L1 categories
- [ ] **1.3.2** Update existing images with higher quality versions
- [ ] **1.3.3** Add fallback for categories without images

---

## 📦 Phase 2: Category Page Sidebar Refactor (Priority: 🔴 Critical)

### Task 2.1: Create Context-Aware Category Navigation

**New Component:** `components/category-sidebar.tsx`

**Features:**
1. Detect current category level (L0, L1, L2, L3)
2. Show parent breadcrumb
3. Show siblings at same level
4. Show children (expandable)
5. Highlight current category

**API Changes Needed:**
- [ ] **2.1.1** Update `/api/categories` to support:
  ```
  GET /api/categories?slug=skincare&context=true
  Response: { 
    current, 
    parent, 
    siblings, 
    children,
    ancestors: [L0, L1, ...] // breadcrumb
  }
  ```

### Task 2.2: Implement Attribute-Based Filtering

**New Component:** `components/attribute-filters.tsx`

**Implementation:**
```typescript
interface AttributeFilter {
  id: string
  name: string
  name_bg: string
  attribute_type: 'select' | 'multiselect' | 'boolean' | 'number'
  options: string[]
  options_bg: string[]
  is_filterable: boolean
}

// Fetch attributes for category
GET /api/categories/:slug/attributes?filterable=true
```

**Tasks:**
- [ ] **2.2.1** Create API endpoint `/api/categories/[slug]/attributes`
- [ ] **2.2.2** Create `<AttributeFilters>` component with:
  - Select → RadioGroup
  - Multiselect → CheckboxGroup
  - Boolean → Switch/Checkbox
  - Number → RangeSlider
- [ ] **2.2.3** Integrate into `search-filters.tsx`
- [ ] **2.2.4** Update URL params: `?attr_skinType=oily&attr_spf=30`

### Task 2.3: Mobile Attribute Filters

**File:** `components/mobile-filters.tsx`

- [ ] **2.3.1** Add attribute section to bottom sheet
- [ ] **2.3.2** Collapsible sections per attribute group
- [ ] **2.3.3** "Apply Filters" sticky button

---

## 📦 Phase 3: Homepage Section Standardization (Priority: 🟡 Medium)

### Task 3.1: Standardize Section Container Styling

**Current Inconsistency:**
- `TrendingProductsSection` → Has tabs ✅
- `DealsSection` → Has tabs ✅
- `FeaturedProductsSection` → NO tabs ❌

**Solution:** Add optional tabs to `FeaturedProductsSection`

**Proposed Tabs for Featured:**
1. **За теб** (For You) - Personalized based on browsing
2. **Топ продавачи** (Top Sellers) - Premium/Business tier sellers
3. **Нови обяви** (New Listings) - Recently boosted products

- [ ] **3.1.1** Add tabs prop to `FeaturedProductsSection`
- [ ] **3.1.2** Create tab content variants:
  - `forYou` - Based on user preferences (or random if not logged in)
  - `topSellers` - Filter by `sellerTier: premium | business`
  - `newListings` - Sort by `boosted_at DESC`

### Task 3.2: Update Homepage Category Cards (4-Card Grid)

**Current Cards:** Компютри, Дом и кухня, Мода, Красота

**Issues:**
1. "Компютри" is DEPRECATED in DB (should be "Електроника" or specific L1s)
2. Images need refresh
3. Subcategory links hardcoded, should pull from DB

**Tasks:**
- [ ] **3.2.1** Replace "Компютри" with relevant active category
- [ ] **3.2.2** Make subcategories dynamic from API:
  ```typescript
  // Fetch 4 featured L0s with their top 4 L1 children
  GET /api/categories/homepage-grid
  ```
- [ ] **3.2.3** Update images to match attached screenshot quality
- [ ] **3.2.4** Ensure "Виж повече" links to correct category slug

### Task 3.3: Update Hero Carousel

- [ ] **3.3.1** Audit carousel slides for relevance
- [ ] **3.3.2** Add category-specific CTA buttons
- [ ] **3.3.3** Link to appropriate category pages

---

## 📦 Phase 4: Enhanced Category Images (Priority: 🟡 Medium)

### Task 4.1: Update Category Image Library

Based on the 4-card screenshot provided:

| Category | Current Quality | Needed |
|----------|-----------------|--------|
| Computers/Electronics | Good | Update to match new hierarchy |
| Home & Kitchen | Good | Keep, maybe higher res |
| Fashion (Women/Men/Shoes/Bags) | Good | Keep |
| Beauty (Skincare/Makeup/Hair/Fragrance) | Inconsistent | Standardize style |

**Tasks:**
- [ ] **4.1.1** Create image style guide (aspect ratio, lighting, bg color)
- [ ] **4.1.2** Source/generate consistent images for all L1 categories
- [ ] **4.1.3** Add images to `categories` table `image_url` column
- [ ] **4.1.4** Update `subcategoryImages` mapping in mega-menu.tsx

### Task 4.2: Implement Category Image Fallbacks

```typescript
// Fallback chain
1. category.image_url (from DB)
2. subcategoryImages[slug] (hardcoded mapping)
3. parent category image
4. placeholder with category icon
```

---

## 📦 Phase 5: Product Search Integration with Attributes (Priority: 🟢 Lower)

### Task 5.1: Update Search API for Attribute Filtering

**File:** `app/api/products/search/route.ts` (or equivalent)

**Current:** Filters by price, rating, category, prime  
**Needed:** Add attribute-based filtering

```sql
-- Example query with attributes
SELECT p.* FROM products p
JOIN product_attributes pa ON p.id = pa.product_id
WHERE p.category_id = $categoryId
  AND pa.attribute_name = 'skin_type' AND pa.value = 'oily'
  AND pa.attribute_name = 'spf_level' AND pa.value >= 30
```

**Tasks:**
- [ ] **5.1.1** Create `product_attributes` join table (if not exists)
- [ ] **5.1.2** Update search API to accept `attr_*` params
- [ ] **5.1.3** Build dynamic WHERE clause from attribute filters

### Task 5.2: Faceted Search Counts

Show count of products matching each attribute value:

```
Skin Type:
☑️ Oily (234)
☐ Dry (189)
☐ Combination (156)
```

- [ ] **5.2.1** Add facet counts to search response
- [ ] **5.2.2** Update UI to show counts in filter options

---

## 📦 Phase 6: Testing & QA (Priority: 🟢 Ongoing)

### Task 6.1: Category Navigation Testing

- [ ] **6.1.1** Test all 21 L0 categories in mega menu
- [ ] **6.1.2** Test category page for each level (L0, L1, L2, L3)
- [ ] **6.1.3** Test sidebar context switching
- [ ] **6.1.4** Test attribute filters on sample categories (Beauty, Electronics, Gaming)

### Task 6.2: Mobile Testing

- [ ] **6.2.1** Mega menu touch interactions
- [ ] **6.2.2** Filter bottom sheet UX
- [ ] **6.2.3** Category card carousel on mobile
- [ ] **6.2.4** Attribute filter scrolling/selection

### Task 6.3: Performance Testing

- [ ] **6.3.1** Category API response times with depth=3
- [ ] **6.3.2** Attribute filter API response times
- [ ] **6.3.3** Image loading optimization (lazy load, blur placeholders)

---

## 📊 Implementation Timeline

| Phase | Tasks | Estimated Duration | Dependencies |
|-------|-------|-------------------|--------------|
| **Phase 1** | Mega Menu & Subheader | 2-3 days | None |
| **Phase 2** | Category Sidebar | 3-4 days | Phase 1 |
| **Phase 3** | Homepage Standardization | 2-3 days | Phase 1 |
| **Phase 4** | Category Images | 2 days | Phase 1 |
| **Phase 5** | Attribute Filtering | 4-5 days | Phase 2 |
| **Phase 6** | Testing & QA | Ongoing | All |

**Total Estimated: 2-3 weeks**

---

## 🔧 Technical Implementation Notes

### API Endpoints Needed

```typescript
// 1. Category with context
GET /api/categories/:slug/context
→ { current, parent, siblings, children, ancestors }

// 2. Category attributes (filterable)
GET /api/categories/:slug/attributes?filterable=true
→ { attributes: AttributeFilter[] }

// 3. Homepage category grid
GET /api/categories/homepage-grid
→ { featured: { category: Category, children: Category[] }[] }

// 4. Search with attributes
GET /api/products/search?category=skincare&attr_skinType=oily&attr_spf=30
→ { products, total, facets }
```

### Database Queries

```sql
-- Get category with full hierarchy context
WITH RECURSIVE category_tree AS (
  SELECT id, name, name_bg, slug, parent_id, 0 as depth
  FROM categories WHERE slug = $slug
  UNION ALL
  SELECT c.id, c.name, c.name_bg, c.slug, c.parent_id, ct.depth + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
  WHERE ct.depth < 3
)
SELECT * FROM category_tree;

-- Get filterable attributes for category
SELECT * FROM category_attributes
WHERE (category_id = $categoryId OR category_id IS NULL)
  AND is_filterable = true
ORDER BY sort_order;
```

### Component Architecture

```
components/
├── category-sidebar/
│   ├── index.tsx           # Main sidebar component
│   ├── category-nav.tsx    # Category tree navigation
│   └── attribute-filters.tsx # Attribute filter UI
├── mega-menu/
│   ├── index.tsx           # Mega menu trigger + panel
│   └── mega-menu-config.ts # Category configuration
└── homepage/
    ├── category-grid.tsx   # 4-card grid
    ├── trending-section.tsx
    ├── featured-section.tsx
    └── deals-section.tsx
```

---

## ✅ Definition of Done

### Phase 1 Complete When:
- [ ] All 21 L0 categories visible in mega menu
- [ ] All MEGA_MENU_CONFIG slugs match DB
- [ ] Kids, Books/Hobbies show 3 columns

### Phase 2 Complete When:
- [ ] Sidebar shows context-aware categories
- [ ] Attribute filters visible for categories with `is_filterable` attributes
- [ ] URL params update correctly

### Phase 3 Complete When:
- [ ] FeaturedProductsSection has tabs
- [ ] All homepage sections have consistent styling
- [ ] 4-card grid uses live DB data

### Phase 4 Complete When:
- [ ] All L1 categories have quality images
- [ ] Image fallback chain working

### Phase 5 Complete When:
- [ ] Products filterable by attributes
- [ ] Facet counts showing
- [ ] Search results update on attribute change

---

## 📝 Notes & Considerations

### Performance
- Cache category hierarchy (5-minute TTL)
- Use React Query / SWR for client-side caching
- Lazy load attribute options

### i18n
- All category names have `name_bg` translations ✅
- All attributes have `options_bg` translations ✅
- Ensure UI uses locale-aware naming

### SEO
- Category pages need proper meta tags
- Attribute filters should update URL for shareability
- Breadcrumbs for structured data

---

## 🚀 Next Steps

1. **Review this plan** with team
2. **Prioritize Phase 1** (Mega Menu fixes - blocking issue)
3. **Create tickets** for each task
4. **Begin implementation** in feature branch
5. **Test on staging** before merge

---

*Document maintained by: Development Team*  
*Last updated: December 5, 2025*
