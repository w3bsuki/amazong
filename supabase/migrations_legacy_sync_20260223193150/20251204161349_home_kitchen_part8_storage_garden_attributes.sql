
-- ========== STORAGE & ORGANIZATION ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Material', 'Материал', 'select',
  '["Plastic", "Metal", "Wood", "Fabric", "Wicker", "Wire", "Cardboard", "Canvas"]',
  '["Пластмаса", "Метал", "Дърво", "Плат", "Ракита", "Тел", "Картон", "Канава"]',
  true, false
FROM categories c WHERE c.slug = 'home-storage'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Size', 'Размер', 'select',
  '["Small (Under 10L)", "Medium (10-30L)", "Large (30-60L)", "Extra Large (60L+)", "Set/Multiple Sizes"]',
  '["Малък (Под 10L)", "Среден (10-30L)", "Голям (30-60L)", "Много голям (60L+)", "Комплект"]',
  true, false
FROM categories c WHERE c.slug = 'home-storage'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Stackable', 'Може да се подрежда', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'home-storage'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Lid Type', 'Тип капак', 'select',
  '["With Lid", "Without Lid", "Snap-On Lid", "Hinged Lid", "Flip Lid"]',
  '["С капак", "Без капак", "Щракащ капак", "На панта", "Откидващ капак"]',
  true, false
FROM categories c WHERE c.slug = 'home-storage'
ON CONFLICT DO NOTHING;

-- ========== GARDEN & OUTDOOR ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Material', 'Материал', 'select',
  '["Rattan/Wicker", "Aluminum", "Steel", "Wood", "Teak", "Plastic/Resin", "Wrought Iron", "Cast Aluminum"]',
  '["Ратан", "Алуминий", "Стомана", "Дърво", "Тиково дърво", "Пластмаса/Смола", "Ковано желязо", "Лят алуминий"]',
  true, false
FROM categories c WHERE c.slug = 'garden-outdoor'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Weather Resistant', 'Устойчив на атмосферни условия', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'garden-outdoor'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'UV Protected', 'UV защита', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'garden-outdoor'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Style', 'Стил', 'select',
  '["Modern", "Traditional", "Coastal", "Rustic", "Contemporary", "Bohemian", "Industrial"]',
  '["Модерен", "Традиционен", "Крайбрежен", "Рустик", "Съвременен", "Бохемски", "Индустриален"]',
  true, false
FROM categories c WHERE c.slug = 'garden-outdoor'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Set Size', 'Размер на комплекта', 'select',
  '["Single Piece", "2-Piece Set", "3-Piece Set", "4-Piece Set", "5+ Piece Set"]',
  '["Единичен", "2 части", "3 части", "4 части", "5+ части"]',
  true, false
FROM categories c WHERE c.slug = 'garden-outdoor'
ON CONFLICT DO NOTHING;

-- ========== OFFICE & SCHOOL ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Type', 'Тип', 'select',
  '["Desk", "Chair", "Storage", "Accessories", "Writing", "Paper", "Technology"]',
  '["Бюро", "Стол", "Съхранение", "Аксесоари", "Писане", "Хартия", "Технология"]',
  true, false
FROM categories c WHERE c.slug = 'home-office'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Ergonomic', 'Ергономичен', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'home-office'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'For', 'За', 'select',
  '["Adults", "Kids/Students", "Both"]',
  '["Възрастни", "Деца/Ученици", "И двете"]',
  true, false
FROM categories c WHERE c.slug = 'home-office'
ON CONFLICT DO NOTHING;
;
