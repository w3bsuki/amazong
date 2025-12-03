# [EMOJI] [Category Name] | [Bulgarian Name]

**Category Slug:** `[slug]`  
**Icon:** [EMOJI]  
**Status:** 📝 Draft  
**Last Updated:** [Date]  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | [L0] → [L1] → [L2] |
| **Attributes** | Filtering, Search, Campaigns | [Key attributes for this category] |
| **Tags** | Dynamic Collections & SEO | [Example tags] |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
[EMOJI] [Category Name] (L0)
│
├── [EMOJI] [Section 1] (L1)
│   ├── [Subcategory 1] (L2)
│   ├── [Subcategory 2] (L2)
│   └── [Subcategory 3] (L2)
│
├── [EMOJI] [Section 2] (L1)
│   ├── [Subcategory 1] (L2)
│   └── [Subcategory 2] (L2)
│
└── [EMOJI] [Section 3] (L1)
    ├── [Subcategory 1] (L2)
    └── [Subcategory 2] (L2)
```

**Total Categories: [X] (L0) + [X] (L1) + [X] (L2) = [TOTAL] categories**

---

## 📊 Complete Category Reference

### L1: [EMOJI] [SECTION NAME]

#### L2: [Subcategory Name] | [Bulgarian Name]
**Slug:** `[section]/[subcategory]`  
**Description:** [What products belong here]

**Types (Attribute, not subcategory):**

| EN | BG | Description |
|----|----|----|
| [Type 1] | [БГ] | [Description] |
| [Type 2] | [БГ] | [Description] |
| [Type 3] | [БГ] | [Description] |

---

<!-- Repeat for each L2 category -->

---

## 🏷️ Attribute System (The Power Layer)

### Main Product Attributes Schema

```typescript
interface [Category]Product {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "[slug]/[subcategory]"
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === CATEGORY-SPECIFIC FIELDS ===
  // TODO: Add fields specific to this category
  brand: string;
  // [field]: [type];
  
  // === CONDITION ===
  condition: ProductCondition;
  
  // === FEATURES (Arrays) ===
  features: string[];
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  // === LISTING META ===
  images: string[];
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];
}

// === ENUMS ===
type ProductCondition = 'new' | 'like_new' | 'used' | 'for_parts';

// TODO: Add category-specific enums
// type [EnumName] = '[value1]' | '[value2]' | '[value3]';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "[Campaign Name]" Campaign
SELECT * FROM products 
WHERE category LIKE '[slug]/%'
AND attributes->>'[field]' IN ('[value1]', '[value2]');

-- 🏷️ "[Another Campaign]" Campaign  
SELECT * FROM products 
WHERE category = '[slug]/[subcategory]'
AND (attributes->>'[field]')::numeric <= [value]
AND attributes->>'[field2]' = '[value]';
```

### Search Filter Configuration

```typescript
const [category]Filters = {
  // Price & Location (Always visible)
  price: { type: 'range', min: 0, max: [MAX], step: [STEP] },
  location: { type: 'location', regions: bulgarianRegions },
  
  // Main Filters
  brand: { type: 'searchable-select', options: [brands] },
  // TODO: Add category-specific filters
  
  // Condition
  condition: { type: 'multi-select' },
  
  // Other
  seller_type: { type: 'radio', options: ['all', 'private', 'dealer'] },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('[slug]', '[Category Name]', '[БГ Име]', '[slug]', '[slug]', NULL, 0, '[EMOJI]', [ORDER], true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('[section1-id]', '[Section 1]', '[БГ]', '[section1]', '[slug]/[section1]', '[slug]', 1, '[EMOJI]', 1, true),
('[section2-id]', '[Section 2]', '[БГ]', '[section2]', '[slug]/[section2]', '[slug]', 1, '[EMOJI]', 2, true);

-- L2: Subcategories
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('[subcat1-id]', '[Subcategory 1]', '[БГ]', '[subcat1]', '[section1]/[subcat1]', '[section1-id]', 2, '[EMOJI]', 1, true),
('[subcat2-id]', '[Subcategory 2]', '[БГ]', '[subcat2]', '[section1]/[subcat2]', '[section1-id]', 2, '[EMOJI]', 2, true);
```

### Brand/Make Reference Data (If Applicable)

```sql
-- Popular brands for this category
INSERT INTO public.[category]_brands (id, name, logo_url, is_popular, display_order) VALUES
('[brand1]', '[Brand 1]', NULL, true, 1),
('[brand2]', '[Brand 2]', NULL, true, 2),
('[brand3]', '[Brand 3]', NULL, false, 3);
```

---

## 🔍 Example JSONB Queries

```sql
-- Find [specific product type]
SELECT * FROM products 
WHERE category_id = '[slug]-[subcategory]'
AND attributes->>'brand' = '[Brand]';

-- Find [filtered products]
SELECT * FROM products 
WHERE category_id LIKE '[slug]-%'
AND (attributes->>'[field]')::numeric BETWEEN [min] AND [max];

-- Find [products with feature]
SELECT * FROM products 
WHERE category_id = '[slug]-[subcategory]'
AND attributes->'features' ? '[feature]';
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| [Category Name] | [БГ Име] |
| [Section 1] | [БГ] |
| [Subcategory 1] | [БГ] |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Condition | Състояние |
| Price | Цена |
| [Attribute] | [БГ] |

### Attribute Values

| EN | BG |
|----|----|
| New | Ново |
| Used | Употребявано |
| [Value] | [БГ] |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add brand/reference data (if applicable)
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/[slug] (tree structure)
- [ ] GET /categories/[slug]/[section]/[subcategory]/products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Listing form (multi-step)
- [ ] Search filters component
- [ ] Results grid/list view
- [ ] Product detail page

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** [X]  
**Created:** [Date]
