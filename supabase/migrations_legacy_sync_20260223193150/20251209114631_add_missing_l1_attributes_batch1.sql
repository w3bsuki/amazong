-- Add attributes to L1 categories missing them (Beauty, Books)

-- Bath & Body (L1 under Beauty)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'bath-body'),
  unnest(ARRAY['Product Type', 'Skin Type', 'Scent', 'Size', 'Condition']),
  unnest(ARRAY['Тип продукт', 'Тип кожа', 'Аромат', 'Размер', 'Състояние']),
  unnest(ARRAY['select', 'select', 'select', 'select', 'select']),
  unnest(ARRAY[false, false, false, false, true]),
  true,
  unnest(ARRAY[
    '["Body Wash","Body Lotion","Body Scrub","Bath Bombs","Shower Gel","Hand Cream","Body Oil","Soap"]',
    '["Normal","Dry","Oily","Sensitive","All Skin Types"]',
    '["Floral","Fruity","Fresh","Woody","Unscented","Lavender","Vanilla","Citrus"]',
    '["Travel Size","100ml","200ml","300ml","500ml","1L"]',
    '["New","Open Box"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Душ гел","Лосион за тяло","Скраб за тяло","Бомби за вана","Сапун за душ","Крем за ръце","Масло за тяло","Сапун"]',
    '["Нормална","Суха","Мазна","Чувствителна","Всички типове"]',
    '["Цветен","Плодов","Свеж","Дървесен","Без аромат","Лавандула","Ванилия","Цитрус"]',
    '["Пътнически размер","100мл","200мл","300мл","500мл","1л"]',
    '["Ново","Отворена кутия"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
ON CONFLICT DO NOTHING;

-- Beauty Tools (L1 under Beauty)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'beauty-tools'),
  unnest(ARRAY['Tool Type', 'Power Source', 'Material', 'Brand', 'Condition']),
  unnest(ARRAY['Тип инструмент', 'Захранване', 'Материал', 'Марка', 'Състояние']),
  unnest(ARRAY['select', 'select', 'select', 'select', 'select']),
  unnest(ARRAY[false, false, false, false, true]),
  true,
  unnest(ARRAY[
    '["Hair Dryer","Flat Iron","Curling Iron","Face Roller","Makeup Brush","Eyelash Curler","Nail Tool","LED Device"]',
    '["Corded","Cordless","Battery","USB","Manual"]',
    '["Ceramic","Titanium","Stainless Steel","Plastic","Jade","Rose Quartz","Silicone"]',
    '["Dyson","GHD","Philips","Braun","Remington","T3","BaByliss","Other"]',
    '["New","Like New","Good","For Parts"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Сешоар","Преса","Маша","Ролер за лице","Четка за грим","Мигловъртец","Инструмент за нокти","LED устройство"]',
    '["С кабел","Безжичен","Батерии","USB","Ръчен"]',
    '["Керамика","Титан","Неръждаема стомана","Пластмаса","Жад","Розов кварц","Силикон"]',
    '["Dyson","GHD","Philips","Braun","Remington","T3","BaByliss","Друга"]',
    '["Ново","Като ново","Добро","За части"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
ON CONFLICT DO NOTHING;

-- Men's Grooming (L1 under Beauty)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'mens-grooming'),
  unnest(ARRAY['Product Type', 'Skin Type', 'Scent', 'Hold Strength', 'Condition']),
  unnest(ARRAY['Тип продукт', 'Тип кожа', 'Аромат', 'Сила на задържане', 'Състояние']),
  unnest(ARRAY['select', 'select', 'select', 'select', 'select']),
  unnest(ARRAY[false, false, false, false, true]),
  true,
  unnest(ARRAY[
    '["Beard Oil","Beard Balm","Shaving Cream","Aftershave","Hair Wax","Pomade","Face Wash","Deodorant"]',
    '["Normal","Sensitive","Oily","Dry","All Types"]',
    '["Woody","Fresh","Citrus","Unscented","Sandalwood","Cedar","Musk"]',
    '["Light","Medium","Strong","Extra Strong"]',
    '["New","Open Box"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Масло за брада","Балсам за брада","Крем за бръснене","Афтършейв","Восък за коса","Помада","Почистване за лице","Дезодорант"]',
    '["Нормална","Чувствителна","Мазна","Суха","Всички типове"]',
    '["Дървесен","Свеж","Цитрус","Без аромат","Сандалово дърво","Кедър","Мускус"]',
    '["Лека","Средна","Силна","Много силна"]',
    '["Ново","Отворена кутия"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4, 5])
ON CONFLICT DO NOTHING;

-- Oral Care (L1 under Beauty)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'oral-care'),
  unnest(ARRAY['Product Type', 'Concern', 'Age Group', 'Condition']),
  unnest(ARRAY['Тип продукт', 'Проблем', 'Възрастова група', 'Състояние']),
  unnest(ARRAY['select', 'select', 'select', 'select']),
  unnest(ARRAY[false, false, false, true]),
  true,
  unnest(ARRAY[
    '["Toothpaste","Electric Toothbrush","Manual Toothbrush","Mouthwash","Floss","Whitening Kit","Water Flosser"]',
    '["Whitening","Sensitivity","Cavity Protection","Fresh Breath","Gum Health","All-in-One"]',
    '["Kids","Teens","Adults","Seniors"]',
    '["New","Open Box"]'
  ])::jsonb,
  unnest(ARRAY[
    '["Паста за зъби","Електрическа четка","Ръчна четка","Вода за уста","Конец за зъби","Комплект за избелване","Иригатор"]',
    '["Избелване","Чувствителност","Защита от кариес","Свеж дъх","Здраве на венците","Комплексна грижа"]',
    '["Деца","Тийнейджъри","Възрастни","Възрастни хора"]',
    '["Ново","Отворена кутия"]'
  ])::jsonb,
  unnest(ARRAY[1, 2, 3, 4])
ON CONFLICT DO NOTHING;;
