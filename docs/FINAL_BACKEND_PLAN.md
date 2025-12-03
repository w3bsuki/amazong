# 🚀 FINAL BACKEND REFACTOR PLAN

**Created:** December 3, 2025  
**Status:** ✅ MIGRATIONS APPLIED - PHASE 1 COMPLETE  
**Time Estimate:** 4-6 hours total

---

## 🟢 CURRENT DATABASE STATE (AFTER MIGRATIONS)

```
┌─────────────────────────────────────────────────────────┐
│ TABLE              │ ROWS │ STATUS                      │
├─────────────────────────────────────────────────────────┤
│ categories         │ 396  │ 31 L1, 343 L2, 22 L3 ✅     │
│ products           │ 214  │ Now has attributes JSONB ✅ │
│ category_attributes│ 39   │ Fashion attributes added ✅ │
│ product_attributes │ 0    │ Empty (EAV values)          │
│ brands             │ 24   │ Working                     │
└─────────────────────────────────────────────────────────┘
```

### ✅ APPLIED MIGRATIONS (December 3, 2025)

1. `fashion_level3_categories_v2` - Added 22 L3 categories for Fashion
2. `fashion_category_attributes` - Added 9 category attribute definitions
3. `products_attributes_jsonb` - Added JSONB column + indexes

### Existing Category Structure

```
Fashion (L1)
├── Men (L2) - NO subcategories
├── Women (L2) - NO subcategories  
├── Kids (L2) - NO subcategories
├── Shoes (L2) - NO subcategories
├── Bags & Luggage (L2)
├── Activewear (L2)
├── Swimwear (L2)
├── Hats & Caps (L2)
├── Belts (L2)
├── Scarves & Wraps (L2)
├── Sunglasses & Eyewear (L2)
├── Watches (L2)
├── Jewelry & Accessories (L2)
├── Wedding & Formal (L2)
├── Vintage & Retro (L2)
├── Plus Size (L2)
├── Maternity (L2)
├── Uniforms & Work Clothing (L2)
├── Costumes & Cosplay (L2)
└── Sleepwear & Loungewear (L2)
```

**Problem:** No Level 3 categories. "Men" doesn't have T-Shirts, Pants, Jackets.

---

## ✅ WHAT TO DO (3 STEPS ONLY)

### STEP 1: Add Level 3 Categories for Fashion (SQL Migration)

This adds proper subcategories under Men/Women/Kids/Shoes:

```sql
-- Migration: 20251203_fashion_level3_categories.sql
-- Adds Level 3 subcategories to Fashion

-- ================================================
-- WOMEN'S CLOTHING (Level 3)
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Dresses', 'Рокли', 'womens-dresses', id, '👗'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Tops & Blouses', 'Топове и блузи', 'womens-tops', id, '👚'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Pants & Jeans', 'Панталони и дънки', 'womens-pants', id, '👖'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Skirts', 'Поли', 'womens-skirts', id, '👗'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Jackets & Coats', 'Якета и палта', 'womens-jackets', id, '🧥'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Sweaters', 'Пуловери', 'womens-sweaters', id, '🧶'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Lingerie & Sleepwear', 'Бельо и пижами', 'womens-lingerie', id, '👙'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- MEN'S CLOTHING (Level 3)
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'T-Shirts & Polos', 'Тениски и полота', 'mens-tshirts', id, '👕'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Shirts', 'Ризи', 'mens-shirts', id, '👔'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Pants & Jeans', 'Панталони и дънки', 'mens-pants', id, '👖'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Shorts', 'Къси панталони', 'mens-shorts', id, '🩳'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Jackets & Coats', 'Якета и палта', 'mens-jackets', id, '🧥'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Sweaters & Hoodies', 'Пуловери и суитшърти', 'mens-sweaters', id, '🧥'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Suits & Blazers', 'Костюми и сака', 'mens-suits', id, '🤵'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Underwear', 'Бельо', 'mens-underwear', id, '🩲'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- KIDS' CLOTHING (Level 3)
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Girls'' Clothing', 'Момичешки дрехи', 'girls-clothing', id, '👧'
FROM categories WHERE slug = 'kids-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Boys'' Clothing', 'Момчешки дрехи', 'boys-clothing', id, '👦'
FROM categories WHERE slug = 'kids-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Baby Clothing', 'Бебешки дрехи', 'baby-clothing', id, '👶'
FROM categories WHERE slug = 'kids-fashion'
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- SHOES (Level 3)
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Shoes', 'Дамски обувки', 'womens-shoes', id, '👠'
FROM categories WHERE slug = 'shoes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Shoes', 'Мъжки обувки', 'mens-shoes', id, '👞'
FROM categories WHERE slug = 'shoes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Kids'' Shoes', 'Детски обувки', 'kids-shoes', id, '👟'
FROM categories WHERE slug = 'shoes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Sports Shoes', 'Спортни обувки', 'sports-shoes', id, '👟'
FROM categories WHERE slug = 'shoes'
ON CONFLICT (slug) DO NOTHING;
```

### STEP 2: Add Category Attributes for Fashion

This creates the dynamic form fields for fashion products (like eBay Item Specifics):

```sql
-- Migration: 20251203_fashion_category_attributes.sql
-- Adds attributes for Fashion categories (like eBay Item Specifics)

-- ================================================
-- CLOTHING ATTRIBUTES (for all clothing categories)
-- ================================================

-- Get parent category IDs
DO $$
DECLARE
  womens_id UUID;
  mens_id UUID;
  kids_id UUID;
BEGIN
  SELECT id INTO womens_id FROM categories WHERE slug = 'womens-fashion';
  SELECT id INTO mens_id FROM categories WHERE slug = 'mens-fashion';
  SELECT id INTO kids_id FROM categories WHERE slug = 'kids-fashion';
  
  -- SIZE attribute (for Women's Fashion)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (womens_id, 'Size', 'Размер', 'select', true, true,
    '["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "32", "34", "36", "38", "40", "42", "44", "46", "48", "One Size"]',
    '["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "32", "34", "36", "38", "40", "42", "44", "46", "48", "Универсален"]',
    1);
  
  -- SIZE attribute (for Men's Fashion)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (mens_id, 'Size', 'Размер', 'select', true, true,
    '["XS", "S", "M", "L", "XL", "XXL", "XXXL", "44", "46", "48", "50", "52", "54", "56"]',
    '["XS", "S", "M", "L", "XL", "XXL", "XXXL", "44", "46", "48", "50", "52", "54", "56"]',
    1);
  
  -- SIZE attribute (for Kids' Fashion)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (kids_id, 'Size', 'Размер', 'select', true, true,
    '["56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164", "170"]',
    '["56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164", "170"]',
    1);
    
END $$;

-- COLOR attribute (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Color', 'Цвят', 'select', true, true,
  '["Black", "White", "Gray", "Navy", "Blue", "Red", "Pink", "Green", "Yellow", "Orange", "Purple", "Brown", "Beige", "Gold", "Silver", "Multicolor", "Other"]',
  '["Черен", "Бял", "Сив", "Тъмносин", "Син", "Червен", "Розов", "Зелен", "Жълт", "Оранжев", "Лилав", "Кафяв", "Бежов", "Златист", "Сребрист", "Многоцветен", "Друг"]',
  2
FROM categories WHERE slug = 'fashion';

-- CONDITION attribute (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Condition', 'Състояние', 'select', true, true,
  '["New with tags", "New without tags", "Like new", "Good", "Fair"]',
  '["Ново с етикет", "Ново без етикет", "Като ново", "Добро", "Задоволително"]',
  3
FROM categories WHERE slug = 'fashion';

-- BRAND attribute (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Brand', 'Марка', 'text', false, true,
  '[]', '[]',
  4
FROM categories WHERE slug = 'fashion';

-- MATERIAL attribute (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Material', 'Материал', 'select', false, true,
  '["Cotton", "Polyester", "Wool", "Silk", "Linen", "Leather", "Denim", "Cashmere", "Viscose", "Nylon", "Synthetic", "Mixed", "Other"]',
  '["Памук", "Полиестер", "Вълна", "Коприна", "Лен", "Кожа", "Дънков плат", "Кашмир", "Вискоза", "Найлон", "Синтетика", "Смесен", "Друг"]',
  5
FROM categories WHERE slug = 'fashion';

-- STYLE attribute (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Style', 'Стил', 'select', false, true,
  '["Casual", "Formal", "Business", "Sport", "Bohemian", "Vintage", "Streetwear", "Classic", "Elegant", "Other"]',
  '["Ежедневен", "Официален", "Бизнес", "Спортен", "Бохемски", "Винтидж", "Улична мода", "Класически", "Елегантен", "Друг"]',
  6
FROM categories WHERE slug = 'fashion';

-- SEASON attribute (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Season', 'Сезон', 'multiselect', false, true,
  '["Spring", "Summer", "Fall", "Winter", "All Season"]',
  '["Пролет", "Лято", "Есен", "Зима", "Всички сезони"]',
  7
FROM categories WHERE slug = 'fashion';
```

### STEP 3: Add JSONB Attributes Column to Products

This enables fast filtering by attributes:

```sql
-- Migration: 20251203_products_attributes_jsonb.sql
-- Adds JSONB attributes column for fast filtering

-- 1. Add the column
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

-- 2. GIN index for containment queries
CREATE INDEX IF NOT EXISTS idx_products_attributes 
  ON public.products USING GIN (attributes);

-- 3. Expression indexes for common filters
CREATE INDEX IF NOT EXISTS idx_products_attr_size 
  ON public.products ((attributes->>'size')) 
  WHERE attributes->>'size' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_color 
  ON public.products ((attributes->>'color')) 
  WHERE attributes->>'color' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_condition 
  ON public.products ((attributes->>'condition')) 
  WHERE attributes->>'condition' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_attr_brand 
  ON public.products ((attributes->>'brand')) 
  WHERE attributes->>'brand' IS NOT NULL;

-- 4. Comment
COMMENT ON COLUMN public.products.attributes IS 
  'JSONB attributes for fast filtering. Example: {"size": "M", "color": "Black", "condition": "New with tags"}';
```

---

## 📁 FINAL CATEGORY STRUCTURE (AFTER MIGRATION)

```
Fashion (L1)
├── Women (L2)
│   ├── Dresses (L3) ← NEW
│   ├── Tops & Blouses (L3) ← NEW
│   ├── Pants & Jeans (L3) ← NEW
│   ├── Skirts (L3) ← NEW
│   ├── Jackets & Coats (L3) ← NEW
│   ├── Sweaters (L3) ← NEW
│   └── Lingerie & Sleepwear (L3) ← NEW
├── Men (L2)
│   ├── T-Shirts & Polos (L3) ← NEW
│   ├── Shirts (L3) ← NEW
│   ├── Pants & Jeans (L3) ← NEW
│   ├── Shorts (L3) ← NEW
│   ├── Jackets & Coats (L3) ← NEW
│   ├── Sweaters & Hoodies (L3) ← NEW
│   ├── Suits & Blazers (L3) ← NEW
│   └── Underwear (L3) ← NEW
├── Kids (L2)
│   ├── Girls' Clothing (L3) ← NEW
│   ├── Boys' Clothing (L3) ← NEW
│   └── Baby Clothing (L3) ← NEW
├── Shoes (L2)
│   ├── Women's Shoes (L3) ← NEW
│   ├── Men's Shoes (L3) ← NEW
│   ├── Kids' Shoes (L3) ← NEW
│   └── Sports Shoes (L3) ← NEW
├── Bags & Luggage (L2) - keep as is
├── Activewear (L2) - keep as is
├── Swimwear (L2) - keep as is
├── Hats & Caps (L2) - keep as is
├── Belts (L2) - keep as is
├── Scarves & Wraps (L2) - keep as is
├── Sunglasses & Eyewear (L2) - keep as is
├── Watches (L2) - keep as is
├── Jewelry & Accessories (L2) - keep as is
├── Wedding & Formal (L2) - keep as is
├── Vintage & Retro (L2) - keep as is
├── Plus Size (L2) - keep as is
├── Maternity (L2) - keep as is
├── Uniforms & Work Clothing (L2) - keep as is
├── Costumes & Cosplay (L2) - keep as is
└── Sleepwear & Loungewear (L2) - keep as is
```

---

## 🔧 HOW TO RUN THE MIGRATIONS

### Option 1: Supabase CLI (Recommended)

```bash
# Create migration files
mkdir -p supabase/migrations

# Create the files with the SQL above, then:
supabase db push
```

### Option 2: Direct SQL in Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Run each migration SQL block one at a time
3. Verify with: `SELECT COUNT(*) FROM categories WHERE parent_id IS NOT NULL;`

### Option 3: Use MCP Tools

I can apply the migrations directly using the Supabase MCP tools if you want.

---

## ❌ IGNORE THESE DOCS (OUTDATED/FANTASY)

- `fashion.md` - SQL uses TEXT IDs, describes non-existent L3 categories
- `IMPLEMENTATION.md` - Over-engineered, but some patterns are good
- `refactor.md` - Planning doc, not actionable
- `DOCS_AUDIT_FINAL.md` - Meta audit, not actionable
- All other category `.md` files - Need same L3 treatment as Fashion

---

## ✅ CHECKLIST

### Database Changes
- [ ] Run migration 1: Fashion L3 categories
- [ ] Run migration 2: Fashion category attributes  
- [ ] Run migration 3: Products JSONB attributes column
- [ ] Verify: `SELECT * FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = 'womens-fashion');`

### Frontend Updates
- [ ] Update mega-menu to show L3 categories
- [ ] Update product form to use category_attributes
- [ ] Update search filters to use JSONB attributes
- [ ] Update category pages to fetch subcategories

### Data Migration (Optional)
- [ ] Re-assign existing Fashion products to correct L3 categories
- [ ] Populate attributes JSONB from existing product data

---

## 💡 KEY DECISIONS SUMMARY

| Question | Answer |
|----------|--------|
| UUID or TEXT for category IDs? | **UUID** (already correct) |
| Add L3 subcategories? | **YES** for Fashion main sections |
| Use JSONB or EAV for attributes? | **BOTH** - EAV for forms, JSONB for filtering |
| Change shipping booleans? | **NO** - keep existing |
| Add new database columns? | **YES** - `products.attributes JSONB` |
| Create new tables? | **NO** - use existing structure |

---

**This is the ONLY document you need to follow. Ignore everything else.**
