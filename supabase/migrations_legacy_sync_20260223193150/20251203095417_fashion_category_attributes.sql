
-- Migration: Add category attributes for Fashion
-- These are dynamic form fields (like eBay Item Specifics)

-- ================================================
-- UNIVERSAL FASHION ATTRIBUTES (apply to Fashion root)
-- ================================================

-- SIZE attribute for Women's Fashion
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Size', 'Размер', 'select', true, true,
  '["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "32", "34", "36", "38", "40", "42", "44", "46", "48", "One Size"]'::jsonb,
  '["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "32", "34", "36", "38", "40", "42", "44", "46", "48", "Универсален"]'::jsonb,
  1
FROM categories WHERE slug = 'womens-fashion';

-- SIZE attribute for Men's Fashion
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Size', 'Размер', 'select', true, true,
  '["XS", "S", "M", "L", "XL", "XXL", "XXXL", "44", "46", "48", "50", "52", "54", "56"]'::jsonb,
  '["XS", "S", "M", "L", "XL", "XXL", "XXXL", "44", "46", "48", "50", "52", "54", "56"]'::jsonb,
  1
FROM categories WHERE slug = 'mens-fashion';

-- SIZE attribute for Kids' Fashion
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Size', 'Размер', 'select', true, true,
  '["56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164", "170"]'::jsonb,
  '["56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164", "170"]'::jsonb,
  1
FROM categories WHERE slug = 'kids-fashion';

-- COLOR attribute (for Fashion root - inherits to all)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Color', 'Цвят', 'select', true, true,
  '["Black", "White", "Gray", "Navy", "Blue", "Red", "Pink", "Green", "Yellow", "Orange", "Purple", "Brown", "Beige", "Gold", "Silver", "Multicolor", "Other"]'::jsonb,
  '["Черен", "Бял", "Сив", "Тъмносин", "Син", "Червен", "Розов", "Зелен", "Жълт", "Оранжев", "Лилав", "Кафяв", "Бежов", "Златист", "Сребрист", "Многоцветен", "Друг"]'::jsonb,
  2
FROM categories WHERE slug = 'fashion';

-- CONDITION attribute (for Fashion root)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Condition', 'Състояние', 'select', true, true,
  '["New with tags", "New without tags", "Like new", "Good", "Fair"]'::jsonb,
  '["Ново с етикет", "Ново без етикет", "Като ново", "Добро", "Задоволително"]'::jsonb,
  3
FROM categories WHERE slug = 'fashion';

-- BRAND attribute (for Fashion root)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Brand', 'Марка', 'text', false, true,
  '[]'::jsonb, '[]'::jsonb,
  4
FROM categories WHERE slug = 'fashion';

-- MATERIAL attribute (for Fashion root)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Material', 'Материал', 'select', false, true,
  '["Cotton", "Polyester", "Wool", "Silk", "Linen", "Leather", "Denim", "Cashmere", "Viscose", "Nylon", "Synthetic", "Mixed", "Other"]'::jsonb,
  '["Памук", "Полиестер", "Вълна", "Коприна", "Лен", "Кожа", "Дънков плат", "Кашмир", "Вискоза", "Найлон", "Синтетика", "Смесен", "Друг"]'::jsonb,
  5
FROM categories WHERE slug = 'fashion';

-- STYLE attribute (for Fashion root)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Style', 'Стил', 'select', false, true,
  '["Casual", "Formal", "Business", "Sport", "Bohemian", "Vintage", "Streetwear", "Classic", "Elegant", "Other"]'::jsonb,
  '["Ежедневен", "Официален", "Бизнес", "Спортен", "Бохемски", "Винтидж", "Улична мода", "Класически", "Елегантен", "Друг"]'::jsonb,
  6
FROM categories WHERE slug = 'fashion';

-- SEASON attribute (for Fashion root)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Season', 'Сезон', 'multiselect', false, true,
  '["Spring", "Summer", "Fall", "Winter", "All Season"]'::jsonb,
  '["Пролет", "Лято", "Есен", "Зима", "Всички сезони"]'::jsonb,
  7
FROM categories WHERE slug = 'fashion';

-- ================================================
-- SHOE-SPECIFIC ATTRIBUTES
-- ================================================

-- SHOE SIZE attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Shoe Size (EU)', 'Размер обувки (EU)', 'select', true, true,
  '["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]'::jsonb,
  '["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]'::jsonb,
  1
FROM categories WHERE slug = 'shoes' AND parent_id IS NOT NULL;

-- SHOE WIDTH attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT id, 'Width', 'Ширина', 'select', false, true,
  '["Narrow", "Standard", "Wide", "Extra Wide"]'::jsonb,
  '["Тясна", "Стандартна", "Широка", "Много широка"]'::jsonb,
  2
FROM categories WHERE slug = 'shoes' AND parent_id IS NOT NULL;
;
