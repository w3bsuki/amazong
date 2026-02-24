
-- Phase 5: Bulgarian Traditional - Comprehensive Attributes

DO $$
DECLARE
  bg_trad_id UUID;
BEGIN
  SELECT id INTO bg_trad_id FROM categories WHERE slug = 'bulgarian-traditional';
  
  -- Core Bulgarian Traditional Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (bg_trad_id, 'Region', 'Регион', 'select', '["Thrace", "Rhodope", "Shopluk", "Dobrudzha", "Pirin", "Strandzha", "Black Sea", "Danubian", "Sofia Region", "Other"]', '["Тракия", "Родопи", "Шоплук", "Добруджа", "Пирин", "Странджа", "Черноморие", "Дунавски", "Софийски", "Друг"]', false, true, 1),
    (bg_trad_id, 'Authenticity', 'Автентичност', 'select', '["Authentic/Traditional", "Handmade", "Machine-made", "Replica", "Modern Interpretation"]', '["Автентичен/Традиционен", "Ръчна изработка", "Машинна изработка", "Реплика", "Модерна интерпретация"]', false, true, 2),
    (bg_trad_id, 'Age/Era', 'Възраст/Ера', 'select', '["Antique (100+ years)", "Vintage (50-100 years)", "Mid-century (25-50 years)", "Contemporary", "New"]', '["Антикварен (100+ години)", "Винтидж (50-100 години)", "Средата на века (25-50 години)", "Съвременен", "Нов"]', false, true, 3),
    (bg_trad_id, 'Gift Ready', 'Готов за подарък', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Folk Costumes specific attributes
DO $$
DECLARE
  costumes_id UUID;
BEGIN
  SELECT id INTO costumes_id FROM categories WHERE slug = 'bulgarian-folk-costumes';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (costumes_id, 'Gender', 'Пол', 'select', '["Men", "Women", "Children", "Unisex"]', '["Мъжки", "Дамски", "Детски", "Унисекс"]', true, true, 1),
    (costumes_id, 'Size', 'Размер', 'select', '["XS", "S", "M", "L", "XL", "XXL", "Custom"]', '["XS", "S", "M", "L", "XL", "XXL", "По поръчка"]', true, true, 2),
    (costumes_id, 'Completeness', 'Комплектност', 'select', '["Full Set", "Top Only", "Bottom Only", "Accessories Only", "Custom Set"]', '["Пълен комплект", "Само горна част", "Само долна част", "Само аксесоари", "По избор"]', false, true, 3),
    (costumes_id, 'Material', 'Материал', 'select', '["Wool", "Cotton", "Silk", "Linen", "Mixed", "Synthetic"]', '["Вълна", "Памук", "Коприна", "Лен", "Смесен", "Синтетика"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Bulgarian Instruments specific attributes
DO $$
DECLARE
  instruments_id UUID;
BEGIN
  SELECT id INTO instruments_id FROM categories WHERE slug = 'bulgarian-instruments';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (instruments_id, 'Skill Level', 'Ниво на умение', 'select', '["Beginner", "Intermediate", "Advanced", "Professional", "Concert"]', '["Начинаещ", "Среднонапреднал", "Напреднал", "Професионален", "Концертен"]', false, true, 1),
    (instruments_id, 'Maker', 'Майстор', 'text', NULL, NULL, false, true, 2),
    (instruments_id, 'Wood Type', 'Вид дърво', 'select', '["Walnut", "Cherry", "Pear", "Maple", "Boxwood", "Other"]', '["Орех", "Череша", "Круша", "Явор", "Чемшир", "Друго"]', false, true, 3),
    (instruments_id, 'Includes Case', 'С калъф', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Traditional Foods specific attributes
DO $$
DECLARE
  foods_id UUID;
BEGIN
  SELECT id INTO foods_id FROM categories WHERE slug = 'traditional-foods';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (foods_id, 'Origin', 'Произход', 'text', NULL, NULL, false, true, 1),
    (foods_id, 'Weight/Volume', 'Тегло/Обем', 'text', NULL, NULL, false, true, 2),
    (foods_id, 'Organic', 'Био', 'boolean', NULL, NULL, false, true, 3),
    (foods_id, 'Shelf Life', 'Срок на годност', 'select', '["< 1 month", "1-6 months", "6-12 months", "1-2 years", "> 2 years"]', '["< 1 месец", "1-6 месеца", "6-12 месеца", "1-2 години", "> 2 години"]', false, true, 4),
    (foods_id, 'Storage', 'Съхранение', 'select', '["Room Temperature", "Refrigerated", "Frozen", "Cool & Dry"]', '["Стайна температура", "В хладилник", "Замразено", "Хладно и сухо"]', false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;

-- Rose Products specific attributes
DO $$
DECLARE
  rose_id UUID;
BEGIN
  SELECT id INTO rose_id FROM categories WHERE slug = 'rose-products';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (rose_id, 'Rose Type', 'Вид роза', 'select', '["Rosa Damascena", "Rosa Alba", "Rosa Gallica", "Mixed", "Other"]', '["Роза Дамасцена", "Роза Алба", "Роза Галика", "Смесена", "Друга"]', false, true, 1),
    (rose_id, 'Purity', 'Чистота', 'select', '["100% Pure", "Natural Blend", "With Additives"]', '["100% чист", "Натурална смес", "С добавки"]', false, true, 2),
    (rose_id, 'Valley Origin', 'От Розовата долина', 'boolean', NULL, NULL, false, true, 3),
    (rose_id, 'Organic Certified', 'Сертифициран био', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Traditional Crafts specific attributes
DO $$
DECLARE
  crafts_id UUID;
BEGIN
  SELECT id INTO crafts_id FROM categories WHERE slug = 'traditional-crafts';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (crafts_id, 'Craft Type', 'Вид занаят', 'select', '["Pottery", "Woodwork", "Metalwork", "Textiles", "Embroidery", "Other"]', '["Грънчарство", "Дърворезба", "Металообработка", "Текстил", "Бродерия", "Друго"]', false, true, 1),
    (crafts_id, 'Handmade', 'Ръчна изработка', 'boolean', NULL, NULL, false, true, 2),
    (crafts_id, 'Artisan/Workshop', 'Занаятчия/Ателие', 'text', NULL, NULL, false, true, 3),
    (crafts_id, 'Display/Functional', 'Декоративен/Функционален', 'select', '["Display Only", "Functional", "Both"]', '["Само за украса", "Функционален", "И двете"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Bulgarian Wine specific attributes
DO $$
DECLARE
  wine_id UUID;
BEGIN
  SELECT id INTO wine_id FROM categories WHERE slug = 'bulgarian-wine';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (wine_id, 'Wine Type', 'Вид вино', 'select', '["Red", "White", "Rosé", "Sparkling", "Dessert"]', '["Червено", "Бяло", "Розе", "Пенливо", "Десертно"]', true, true, 1),
    (wine_id, 'Grape Variety', 'Сорт грозде', 'select', '["Mavrud", "Gamza", "Melnik", "Dimiat", "Misket", "Rubin", "International Blend"]', '["Мавруд", "Гъмза", "Мелник", "Димят", "Мискет", "Рубин", "Международна смес"]', false, true, 2),
    (wine_id, 'Wine Region', 'Винарски регион', 'select', '["Thracian Valley", "Danubian Plain", "Rose Valley", "Struma Valley", "Black Sea"]', '["Тракийска низина", "Дунавска равнина", "Розова долина", "Струмска долина", "Черноморие"]', false, true, 3),
    (wine_id, 'Vintage', 'Реколта', 'text', NULL, NULL, false, true, 4),
    (wine_id, 'Alcohol %', 'Алкохол %', 'text', NULL, NULL, false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;
;
