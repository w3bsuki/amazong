-- Add attributes to more L1 categories missing them (Grocery, Jewelry, Tools)

-- Grocery & Food L1s
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  unnest(ARRAY['Dietary', 'Organic', 'Country of Origin', 'Condition']),
  unnest(ARRAY['Диетични', 'Био', 'Страна на произход', 'Състояние']),
  unnest(ARRAY['multiselect', 'boolean', 'select', 'select']),
  unnest(ARRAY[false, false, false, true]),
  true,
  unnest(ARRAY[
    '["Vegan","Vegetarian","Gluten-Free","Lactose-Free","Keto","Low-Sodium","Sugar-Free"]',
    NULL,
    '["Bulgaria","EU","Greece","Turkey","USA","Other"]',
    '["New","Close to Expiry"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Веган","Вегетариански","Без глутен","Без лактоза","Кето","Ниско съдържание на сол","Без захар"]',
    NULL,
    '["България","ЕС","Гърция","Турция","САЩ","Друга"]',
    '["Ново","Близо до изтичане"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4])
FROM categories c
WHERE c.slug IN ('grocery-bakery', 'grocery-bulgarian', 'grocery-drinks', 'grocery-frozen', 'grocery-international', 'grocery-snacks', 'grocery-vegetables')
ON CONFLICT DO NOTHING;

-- Jewelry & Watches L1s
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  unnest(ARRAY['Metal Type', 'Gemstone', 'Style', 'Condition', 'Certification']),
  unnest(ARRAY['Метал', 'Скъпоценен камък', 'Стил', 'Състояние', 'Сертификат']),
  unnest(ARRAY['select', 'select', 'select', 'select', 'boolean']),
  unnest(ARRAY[false, false, false, true, false]),
  true,
  unnest(ARRAY[
    '["Gold","Silver","Platinum","Rose Gold","White Gold","Stainless Steel","Titanium","Mixed"]',
    '["Diamond","Ruby","Sapphire","Emerald","Pearl","Cubic Zirconia","None","Other"]',
    '["Classic","Modern","Vintage","Bohemian","Minimalist","Statement"]',
    '["New","Like New","Vintage","Antique","Pre-owned"]',
    NULL
  ])::jsonb,
  unnest(ARRAY[
    '["Злато","Сребро","Платина","Розово злато","Бяло злато","Неръждаема стомана","Титан","Смесен"]',
    '["Диамант","Рубин","Сапфир","Изумруд","Перла","Циркон","Без","Друг"]',
    '["Класически","Модерен","Винтидж","Бохемски","Минималистичен","Акцентен"]',
    '["Ново","Като ново","Винтидж","Антика","Употребявано"]',
    NULL
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
FROM categories c
WHERE c.slug IN ('jw-earrings', 'costume-jewelry', 'jw-supplies', 'jw-mens', 'jw-vintage-estate')
ON CONFLICT DO NOTHING;

-- Tools & Industrial L1s
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  unnest(ARRAY['Power Source', 'Voltage', 'Brand', 'Condition', 'Use Type']),
  unnest(ARRAY['Захранване', 'Волтаж', 'Марка', 'Състояние', 'Тип употреба']),
  unnest(ARRAY['select', 'select', 'select', 'select', 'select']),
  unnest(ARRAY[false, false, false, true, false]),
  true,
  unnest(ARRAY[
    '["Corded Electric","Cordless","Pneumatic","Manual","Gas"]',
    '["12V","18V","20V","40V","110V","220V","N/A"]',
    '["DeWalt","Makita","Milwaukee","Bosch","Ryobi","Festool","Other"]',
    '["New","Refurbished","Used - Good","Used - Fair","For Parts"]',
    '["Professional","DIY","Industrial","Home Use"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Електричен с кабел","Безжичен","Пневматичен","Ръчен","Бензинов"]',
    '["12V","18V","20V","40V","110V","220V","Н/П"]',
    '["DeWalt","Makita","Milwaukee","Bosch","Ryobi","Festool","Друга"]',
    '["Ново","Ремонтирано","Употребявано - добро","Употребявано - задоволително","За части"]',
    '["Професионален","Направи си сам","Индустриален","За домашна употреба"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
FROM categories c
WHERE c.slug IN ('electrical-tools', 'fasteners-hardware', 'generators-power', 'hardware', 'hvac-tools', 'industrial', 'metalworking-tools', 'painting-finishing', 'plumbing-tools', 'pneumatic-air-tools', 'test-measurement-equipment', 'tool-accessories-parts', 'woodworking-tools', 'agriculture')
ON CONFLICT DO NOTHING;;
