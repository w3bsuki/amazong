-- ================================================================
-- GROCERY L0 ATTRIBUTES (Applied to main Grocery category)
-- ================================================================

-- Attribute: Organic/Bio
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Organic Certified', 'Органичен сертификат', 'boolean', false, true, NULL, NULL
FROM categories WHERE slug = 'grocery';

-- Attribute: Local/Homegrown
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Local/Homegrown', 'Местно/Домашно', 'boolean', false, true, NULL, NULL
FROM categories WHERE slug = 'grocery';

-- Attribute: Freshness
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Freshness', 'Свежест', 'select', false, true,
'["Fresh", "Frozen", "Dried", "Preserved", "Canned"]'::jsonb,
'["Прясно", "Замразено", "Сушено", "Консервирано", "В консерва"]'::jsonb
FROM categories WHERE slug = 'grocery';

-- Attribute: Storage
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Storage Type', 'Тип съхранение', 'select', false, true,
'["Room Temperature", "Refrigerated", "Frozen", "Cool & Dry"]'::jsonb,
'["Стайна температура", "Хладилник", "Фризер", "Хладно и сухо"]'::jsonb
FROM categories WHERE slug = 'grocery';

-- Attribute: Dietary
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Dietary', 'Диетично', 'multiselect', false, true,
'["Vegan", "Vegetarian", "Gluten-Free", "Lactose-Free", "Sugar-Free", "Keto", "Low-Sodium"]'::jsonb,
'["Веган", "Вегетарианско", "Без глутен", "Без лактоза", "Без захар", "Кето", "С ниско съдържание на натрий"]'::jsonb
FROM categories WHERE slug = 'grocery';

-- Attribute: Allergens
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Allergens', 'Алергени', 'multiselect', false, true,
'["Contains Gluten", "Contains Dairy", "Contains Eggs", "Contains Nuts", "Contains Soy", "Contains Fish", "Contains Shellfish", "Contains Sesame"]'::jsonb,
'["Съдържа глутен", "Съдържа млечни продукти", "Съдържа яйца", "Съдържа ядки", "Съдържа соя", "Съдържа риба", "Съдържа черупчести", "Съдържа сусам"]'::jsonb
FROM categories WHERE slug = 'grocery';

-- Attribute: Brand
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Brand', 'Марка', 'text', false, true, NULL, NULL
FROM categories WHERE slug = 'grocery';

-- Attribute: Weight/Volume
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Weight/Volume', 'Тегло/Обем', 'text', false, false, NULL, NULL
FROM categories WHERE slug = 'grocery';

-- Attribute: Country of Origin
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Country of Origin', 'Страна на произход', 'select', false, true,
'["Bulgaria", "European Union", "Turkey", "Greece", "Serbia", "Romania", "Other"]'::jsonb,
'["България", "Европейски съюз", "Турция", "Гърция", "Сърбия", "Румъния", "Друга"]'::jsonb
FROM categories WHERE slug = 'grocery';

-- Attribute: Bulgarian Region
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg)
SELECT id, 'Bulgarian Region', 'Български регион', 'select', false, true,
'["Thracian Valley", "Rhodope Mountains", "Rose Valley", "Danube Plain", "Black Sea Coast", "Pirin", "Rila", "Stara Planina", "Sofia Region"]'::jsonb,
'["Тракийска низина", "Родопи", "Розова долина", "Дунавска равнина", "Черноморие", "Пирин", "Рила", "Стара планина", "Софийски регион"]'::jsonb
FROM categories WHERE slug = 'grocery';;
