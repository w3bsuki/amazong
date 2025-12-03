# 📚 Category Documentation Guide

**Purpose:** This guide explains how to create category documentation files for our eBay/Amazon-style marketplace.  
**Architecture:** Attribute-First Hybrid Model  
**Backend:** Supabase (PostgreSQL + JSONB)  
**Last Updated:** December 3, 2025

---

## 🏗️ Architecture Philosophy

### The Golden Rule
```
Categories = NAVIGATION (what users click to browse)
Attributes = FILTERING (what users refine results with)
```

### Why This Approach?

| Deep Categories (❌ Wrong) | Flat + Attributes (✅ Correct) |
|---------------------------|-------------------------------|
| `/electronics/phones/apple/iphone/15-pro` | `/electronics/phones?brand=Apple&model=iPhone-15-Pro` |
| Creates 100,000+ categories | ~50 categories + attribute values |
| Empty category shame | No visible empty categories |
| Can't filter across (Apple OR Samsung) | Any combination possible |
| Recursive SQL queries (slow) | JSONB + GIN index (fast) |
| Hard to maintain | Attributes are just data |

### How Major Platforms Do It

| Platform | Category Depth | Filtering Method |
|----------|---------------|------------------|
| eBay | 3 levels max | Attributes (Item Specifics) |
| Amazon | 3-4 levels max | Attributes (Product Details) |
| AutoScout24 | 2 levels | Make/Model as URL params |
| Mobile.de | 2 levels | Extensive attribute filters |

---

## 📁 File Structure

```
/docs
├── guide.md                    ← THIS FILE (read first!)
├── automotive.md               ← ✅ Complete example
├── electronics.md              ← To create
├── fashion.md                  ← To create
├── home-garden.md              ← To create
├── ...                         ← 38 total category files
└── _templates/
    └── category-template.md    ← Copy this for new categories
```

---

## 📝 Document Structure Template

Every category .md file should follow this structure:

```markdown
# [Emoji] Category Name | Bulgarian Name

**Category Slug:** `category-slug`  
**Icon:** [Emoji]  
**Status:** ✅ Production Ready | 🚧 In Progress | 📝 Draft  
**Last Updated:** [Date]  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy
[Brief explanation of category + attribute split]

---

## 🗂️ Category Structure (3 Levels Max)
[ASCII tree showing L0 → L1 → L2 hierarchy]

---

## 📊 Complete Category Reference
[Detailed breakdown of each L2 category with:
  - Slug
  - Description (EN/BG)
  - What's an ATTRIBUTE vs what's a category]

---

## 🏷️ Attribute System
[TypeScript interfaces for products in this category]

---

## 🎯 Campaign & Filter Examples
[SQL queries showing how attributes enable dynamic campaigns]

---

## 🗃️ Database Schema
[Supabase table definitions and indexes]

---

## 📥 Seed Data
[SQL INSERT statements for categories]

---

## ✅ Implementation Checklist
[Tasks to complete]
```

---

## 🎯 The 3-Level Maximum Rule

### Level 0 (L0): Root Category
The main category that appears on the homepage.
```
🚗 Automotive
📱 Electronics  
👕 Fashion
🏠 Home & Garden
```

### Level 1 (L1): Main Sections
Broad groupings within the root. Usually 3-6 sections.
```
Automotive (L0)
├── Vehicles (L1)
├── Parts & Components (L1)
├── Accessories (L1)
└── Services (L1)
```

### Level 2 (L2): Browsable Categories
The actual categories users browse and list in. **This is where you STOP.**
```
Vehicles (L1)
├── Cars (L2)           ← Users list "Cars" here
├── SUVs & Crossovers (L2)
├── Motorcycles (L2)
└── Trucks & Pickups (L2)
```

### Level 3+ (L3+): NEVER CREATE THESE - Use Attributes Instead

❌ **WRONG:**
```
Cars (L2)
├── BMW (L3)           ← NO! This is an attribute
│   ├── 3 Series (L4)  ← NO! This is an attribute
│   │   └── 320d (L5)  ← NO! This is an attribute
```

✅ **CORRECT:**
```
Cars (L2)
  └── attributes: { make: "BMW", model: "3 Series", variant: "320d" }
```

---

## 🔑 Deciding: Category vs Attribute?

Use this decision tree:

```
Is this a THING TYPE that users browse?
├── YES → Make it a CATEGORY (L2)
│         Examples: "Cars", "Phones", "Dresses", "Sofas"
│
└── NO → Make it an ATTRIBUTE
         Examples: "Brand", "Color", "Size", "Year", "Condition"
```

### Quick Test Questions:

| Question | If YES → Category | If YES → Attribute |
|----------|-------------------|-------------------|
| Would users click this in navigation? | ✅ | |
| Does this describe a type of product? | ✅ | |
| Is this a property OF the product? | | ✅ |
| Could you filter BY this? | | ✅ |
| Would combining this + another narrow results? | | ✅ |
| Is this a brand/make/manufacturer? | | ✅ |
| Is this a size/color/material? | | ✅ |

### Examples by Category:

| Category | L2 Categories | Attributes |
|----------|--------------|------------|
| **Automotive** | Cars, SUVs, Motorcycles | Make, Model, Year, Fuel Type, Mileage |
| **Electronics** | Phones, Laptops, TVs | Brand, Screen Size, Storage, RAM |
| **Fashion** | Dresses, Jeans, Shoes | Size, Color, Material, Brand |
| **Real Estate** | Apartments, Houses, Land | Rooms, Area, Floor, Furnished |

---

## 📊 Attribute Types Reference

### Standard Attribute Types:

```typescript
// 1. SELECT (Single choice)
brand: string;           // "Apple", "Samsung", "Sony"
condition: string;       // "new", "used", "refurbished"
fuel_type: string;       // "diesel", "petrol", "electric"

// 2. MULTI-SELECT (Multiple choices)
features: string[];      // ["WiFi", "Bluetooth", "GPS"]
colors: string[];        // ["Black", "White", "Silver"]

// 3. RANGE (Numeric with min/max)
price: number;           // 0 - 1,000,000
year: number;            // 1990 - 2025
mileage: number;         // 0 - 500,000
screen_size: number;     // 4.0 - 85.0

// 4. BOOLEAN (Yes/No)
negotiable: boolean;
delivery_available: boolean;
warranty_included: boolean;

// 5. TEXT (Free input, searchable)
title: string;
description: string;
part_number: string;

// 6. DEPENDENT SELECT (Choice depends on another)
model: string;           // Depends on 'brand' selection
district: string;        // Depends on 'city' selection
```

### Filter UI Mapping:

| Attribute Type | Filter Component |
|---------------|------------------|
| SELECT | Dropdown / Radio buttons |
| MULTI-SELECT | Checkboxes |
| RANGE | Dual slider / Min-Max inputs |
| BOOLEAN | Toggle / Checkbox |
| TEXT | Search input |
| DEPENDENT | Cascading dropdowns |

---

## 🗃️ Database Patterns

### Categories Table (Same for All)

```sql
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,           -- 'electronics-phones'
  name TEXT NOT NULL,            -- 'Phones & Smartphones'
  name_bg TEXT NOT NULL,         -- 'Телефони и смартфони'
  slug TEXT NOT NULL UNIQUE,     -- 'phones'
  full_slug TEXT NOT NULL,       -- 'electronics/phones'
  parent_id TEXT REFERENCES categories(id),
  level INTEGER NOT NULL,        -- 0, 1, or 2
  icon TEXT,                     -- '📱'
  description TEXT,
  description_bg TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_title_bg TEXT,
  seo_description TEXT,
  seo_description_bg TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Products Table with JSONB Attributes

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'BGN',
  
  -- Category reference (L2 level)
  category_id TEXT REFERENCES categories(id),
  
  -- ALL other fields go in JSONB!
  attributes JSONB DEFAULT '{}',
  
  -- Common fields
  seller_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active',
  images TEXT[],
  location_city TEXT,
  location_region TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical: GIN index for fast JSONB queries
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);
CREATE INDEX idx_products_category ON products(category_id);
```

### Querying Pattern

```sql
-- Find all iPhones under 2000 лв
SELECT * FROM products 
WHERE category_id = 'electronics-phones'
  AND attributes->>'brand' = 'Apple'
  AND attributes->>'model' LIKE 'iPhone%'
  AND price <= 2000;

-- Find all 4K TVs 55" or larger
SELECT * FROM products 
WHERE category_id = 'electronics-tvs'
  AND attributes->>'resolution' = '4K'
  AND (attributes->>'screen_size')::numeric >= 55;
```

---

## 🌍 Bulgarian Translation Requirements

Every category document must include Bulgarian (BG) translations for:

1. **Category names** - `name_bg` field
2. **Descriptions** - `description_bg` field
3. **SEO titles** - `seo_title_bg` field
4. **Attribute labels** - For filter UI
5. **Attribute values** - For dropdown options

### Translation Table Format:

```markdown
| EN | BG | Notes |
|----|----|----|
| Cars | Коли | |
| SUVs & Crossovers | Джипове и кросоувъри | |
| New | Ново | Condition |
| Used | Употребявано | Condition |
```

---

## 🎨 Frontend URL Pattern

All categories follow this URL structure:

```
/{L0-slug}                              → Root category page
/{L0-slug}/{L1-slug}                    → Section page  
/{L0-slug}/{L1-slug}/{L2-slug}          → Listing page with filters
/{L0-slug}/{L1-slug}/{L2-slug}/{product-slug}  → Product detail page
```

### Filter URL Parameters:

```
?brand=Apple                    → Single select
?brand=Apple,Samsung            → Multi-select (comma separated)
?price_min=100&price_max=500    → Range
?warranty=true                  → Boolean
?q=iphone+15                    → Text search
?sort=price_asc                 → Sorting
?page=2                         → Pagination
```

---

## ✅ Checklist for Each Category Document

Before marking a category document as "Production Ready", ensure:

### Structure
- [ ] L0, L1, L2 hierarchy defined (no L3+)
- [ ] All L2 categories have slugs
- [ ] Category count is reasonable (usually 20-50 per L0)

### Attributes
- [ ] TypeScript interface defined
- [ ] All attribute types specified
- [ ] Popular values listed for SELECTs
- [ ] Ranges defined for numeric attributes

### Bulgarian
- [ ] All category names translated
- [ ] All attribute labels translated
- [ ] All common attribute values translated

### Database
- [ ] Category INSERT statements written
- [ ] Sample JSONB queries documented
- [ ] Indexes identified

### SEO
- [ ] SEO titles for each L2
- [ ] Meta descriptions
- [ ] Canonical URL patterns

---

## 📋 Master Category List

Reference from `CATEGORIES.md`:

| # | Category | Slug | Status |
|---|----------|------|--------|
| 1 | 🚗 Automotive | `automotive` | ✅ Complete |
| 2 | 📱 Electronics | `electronics` | 📝 To Do |
| 3 | 👕 Fashion | `fashion` | 📝 To Do |
| 4 | 🏠 Home & Garden | `home-garden` | 📝 To Do |
| 5 | 🏢 Real Estate | `real-estate` | 📝 To Do |
| 6 | 💼 Jobs | `jobs` | 📝 To Do |
| 7 | 🛠️ Services | `services` | 📝 To Do |
| 8 | 👶 Baby & Kids | `baby-kids` | 📝 To Do |
| 9 | 💄 Beauty & Health | `beauty-health` | 📝 To Do |
| 10 | 🎮 Gaming & Hobbies | `gaming-hobbies` | 📝 To Do |
| ... | ... | ... | ... |

---

## 🚀 Quick Start: Creating a New Category Doc

1. **Copy the template:**
   ```bash
   cp docs/_templates/category-template.md docs/new-category.md
   ```

2. **Fill in the L0/L1/L2 structure**

3. **Identify what's a category vs attribute:**
   - Thing types users browse → Category
   - Properties to filter by → Attribute

4. **Define TypeScript interfaces**

5. **Add Bulgarian translations**

6. **Write SQL seed data**

7. **Document example queries**

8. **Update status to ✅ Production Ready**

---

## 📖 Reference: Complete Example

See `automotive.md` for a fully documented category with:
- 37 categories (1 L0 + 4 L1 + 32 L2)
- Vehicle and Parts attribute schemas
- Campaign query examples
- Complete SQL seed data
- Bulgarian translations

---

**Next Step:** Use this guide to create documentation for the remaining 37 categories, starting with high-traffic ones like Electronics and Fashion.
