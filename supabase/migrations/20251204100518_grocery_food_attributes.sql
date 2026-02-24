-- ================================================================
-- GROCERY & FOOD CATEGORY ATTRIBUTES
-- Applied to main Grocery L0 (inherited by all subcategories)
-- ================================================================

-- Attribute: Organic/Bio
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Organic Certified', 'Органичен сертификат', 'boolean', false, true, NULL, NULL
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Local/Homegrown
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Local/Homegrown', 'Местно/Домашно', 'boolean', false, true, NULL, NULL
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Freshness
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Freshness', 'Свежест', 'select', false, true,
'["Fresh", "Frozen", "Dried", "Preserved", "Canned"]'::jsonb,
'["Прясно", "Замразено", "Сушено", "Консервирано", "В консерва"]'::jsonb
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Storage
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Storage Type', 'Тип съхранение', 'select', false, true,
'["Room Temperature", "Refrigerated", "Frozen", "Cool & Dry"]'::jsonb,
'["Стайна температура", "Хладилник", "Фризер", "Хладно и сухо"]'::jsonb
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Dietary
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Dietary', 'Диетично', 'multiselect', false, true,
'["Vegan", "Vegetarian", "Gluten-Free", "Lactose-Free", "Sugar-Free", "Keto", "Low-Sodium"]'::jsonb,
'["Веган", "Вегетарианско", "Без глутен", "Без лактоза", "Без захар", "Кето", "С ниско съдържание на натрий"]'::jsonb
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Allergens
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Allergens', 'Алергени', 'multiselect', false, true,
'["Contains Gluten", "Contains Dairy", "Contains Eggs", "Contains Nuts", "Contains Soy", "Contains Fish", "Contains Shellfish", "Contains Sesame"]'::jsonb,
'["Съдържа глутен", "Съдържа млечни продукти", "Съдържа яйца", "Съдържа ядки", "Съдържа соя", "Съдържа риба", "Съдържа черупчести", "Съдържа сусам"]'::jsonb
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Brand
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Brand', 'Марка', 'text', false, true, NULL, NULL
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Weight/Volume
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Weight/Volume', 'Тегло/Обем', 'text', false, false, NULL, NULL
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Country of Origin
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Country of Origin', 'Страна на произход', 'select', false, true,
'["Bulgaria", "European Union", "Turkey", "Greece", "Serbia", "Romania", "Other"]'::jsonb,
'["България", "Европейски съюз", "Турция", "Гърция", "Сърбия", "Румъния", "Друга"]'::jsonb
FROM categories WHERE slug = 'grocery-food';

-- Attribute: Bulgarian Region
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Bulgarian Region', 'Български регион', 'select', false, true,
'["Thracian Valley", "Rhodope Mountains", "Rose Valley", "Danube Plain", "Black Sea Coast", "Pirin", "Rila", "Stara Planina", "Sofia Region"]'::jsonb,
'["Тракийска низина", "Родопи", "Розова долина", "Дунавска равнина", "Черноморие", "Пирин", "Рила", "Стара планина", "Софийски регион"]'::jsonb
FROM categories WHERE slug = 'grocery-food';

-- ================================================================
-- DAIRY-SPECIFIC ATTRIBUTES
-- ================================================================

-- Fat Content for Dairy
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Fat Content', 'Съдържание на мазнини', 'select', false, true,
'["Full Fat", "Low Fat", "Fat Free", "2%", "Whole"]'::jsonb,
'["Пълномаслено", "Нискомаслено", "Обезмаслено", "2%", "Пълно"]'::jsonb
FROM categories WHERE slug = 'grocery-dairy';

-- Milk Type for Dairy
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Milk Type', 'Тип мляко', 'select', false, true,
'["Cow", "Goat", "Sheep", "Buffalo", "Plant-Based"]'::jsonb,
'["Краве", "Козе", "Овче", "Биволско", "Растително"]'::jsonb
FROM categories WHERE slug = 'grocery-dairy';

-- ================================================================
-- MEAT-SPECIFIC ATTRIBUTES
-- ================================================================

-- Cut Type for Meat
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Cut Type', 'Тип разфасовка', 'select', false, true,
'["Whole", "Sliced", "Ground", "Cubed", "Fillet", "Bone-In", "Boneless"]'::jsonb,
'["Цяло", "Нарязано", "Мляно", "На кубчета", "Филе", "С кост", "Без кост"]'::jsonb
FROM categories WHERE slug = 'grocery-meat';

-- Farming Method for Meat
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Farming Method', 'Метод на отглеждане', 'select', false, true,
'["Free Range", "Organic", "Grass Fed", "Farm Raised", "Wild Caught"]'::jsonb,
'["Свободно отглеждане", "Органично", "Тревопасно", "Ферма", "Дива улов"]'::jsonb
FROM categories WHERE slug = 'grocery-meat';

-- ================================================================
-- DRINKS-SPECIFIC ATTRIBUTES
-- ================================================================

-- Alcohol Content for Drinks
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Alcohol Content', 'Съдържание на алкохол', 'select', false, true,
'["Non-Alcoholic", "Low (1-5%)", "Medium (5-15%)", "High (15-25%)", "Strong (25%+)"]'::jsonb,
'["Безалкохолно", "Ниско (1-5%)", "Средно (5-15%)", "Високо (15-25%)", "Силно (25%+)"]'::jsonb
FROM categories WHERE slug = 'grocery-drinks';

-- Wine Type
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Wine Type', 'Тип вино', 'select', false, true,
'["Red", "White", "Rosé", "Sparkling", "Dessert", "Fortified"]'::jsonb,
'["Червено", "Бяло", "Розе", "Пенливо", "Десертно", "Крепено"]'::jsonb
FROM categories WHERE slug = 'drinks-wine';

-- Grape Variety
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Grape Variety', 'Сорт грозде', 'select', false, true,
'["Mavrud", "Melnik", "Gamza", "Dimyat", "Muscat", "Cabernet Sauvignon", "Merlot", "Chardonnay", "Traminer", "Blend"]'::jsonb,
'["Мавруд", "Мелник", "Гъмза", "Димят", "Мускат", "Каберне Совиньон", "Мерло", "Шардоне", "Траминер", "Купаж"]'::jsonb
FROM categories WHERE slug = 'drinks-wine';

-- Rakia Base
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Rakia Base', 'База на ракията', 'select', false, true,
'["Grape", "Plum", "Apricot", "Quince", "Apple", "Pear", "Cherry", "Muscat", "Mixed"]'::jsonb,
'["Гроздова", "Сливова", "Кайсиева", "Дюлева", "Ябълкова", "Крушова", "Черешова", "Мускатова", "Смесена"]'::jsonb
FROM categories WHERE slug = 'drinks-rakia';

-- ================================================================
-- PRODUCE-SPECIFIC ATTRIBUTES
-- ================================================================

-- Produce Type for Fruits/Vegetables
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Produce Quality', 'Качество на продукта', 'select', false, true,
'["Premium", "Standard", "Economy", "Seconds"]'::jsonb,
'["Премиум", "Стандарт", "Икономичен", "Втори клас"]'::jsonb
FROM categories WHERE slug = 'grocery-fruits';

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Produce Quality', 'Качество на продукта', 'select', false, true,
'["Premium", "Standard", "Economy", "Seconds"]'::jsonb,
'["Премиум", "Стандарт", "Икономичен", "Втори клас"]'::jsonb
FROM categories WHERE slug = 'grocery-vegetables';

-- ================================================================
-- BAKERY-SPECIFIC ATTRIBUTES
-- ================================================================

-- Freshness for Bakery
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Baked Fresh', 'Пресно изпечено', 'select', false, true,
'["Same Day", "Pre-Order", "Frozen Dough", "Ready to Bake"]'::jsonb,
'["Същия ден", "Предварителна поръчка", "Замразено тесто", "Готово за печене"]'::jsonb
FROM categories WHERE slug = 'grocery-bakery';

-- ================================================================
-- ORGANIC-SPECIFIC ATTRIBUTES
-- ================================================================

-- Certification for Organic
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Certification', 'Сертификация', 'select', false, true,
'["EU Organic", "Bulgarian Bio", "Demeter", "Non-GMO", "Fair Trade", "None"]'::jsonb,
'["ЕС органично", "Български Био", "Деметер", "Без ГМО", "Честна търговия", "Без"]'::jsonb
FROM categories WHERE slug = 'grocery-organic';;
