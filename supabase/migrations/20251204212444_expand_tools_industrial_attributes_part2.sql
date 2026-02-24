-- =====================================================
-- TOOLS & INDUSTRIAL ATTRIBUTES - PART 2
-- Brand, Quality & Certification
-- Category ID: e6f6ece0-ec00-4c0f-8b57-c52ae40a7399
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
VALUES
  -- BRAND & QUALITY (21-35)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Brand', 'Марка', 'select',
   '["Bosch", "Makita", "DeWalt", "Milwaukee", "Hilti", "Metabo", "Festool", "Stanley", "Black+Decker", "Einhell", "Ryobi", "Hitachi/HiKOKI", "Flex", "Fein", "Dremel", "Stihl", "Husqvarna", "Karcher", "Würth", "Snap-on", "Knipex", "Wera", "Wiha", "Gedore", "Bahco", "Irwin", "Klein Tools", "Other"]'::jsonb,
   '["Bosch", "Makita", "DeWalt", "Milwaukee", "Hilti", "Metabo", "Festool", "Stanley", "Black+Decker", "Einhell", "Ryobi", "Hitachi/HiKOKI", "Flex", "Fein", "Dremel", "Stihl", "Husqvarna", "Karcher", "Würth", "Snap-on", "Knipex", "Wera", "Wiha", "Gedore", "Bahco", "Irwin", "Klein Tools", "Друга"]'::jsonb,
   false, true, 21),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Product Line', 'Продуктова линия', 'select',
   '["Professional/Pro", "Industrial", "Heavy Duty", "DIY/Home", "Compact", "XR/Xtreme", "One+", "M12/M18", "LXT", "CXT", "FlexVolt", "Power X-Change"]'::jsonb,
   '["Професионална/Pro", "Индустриална", "Тежкотоварна", "DIY/За дома", "Компактна", "XR/Xtreme", "One+", "M12/M18", "LXT", "CXT", "FlexVolt", "Power X-Change"]'::jsonb,
   false, true, 22),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Condition', 'Състояние', 'select',
   '["New", "Refurbished/Reconditioned", "Used - Like New", "Used - Good", "Used - Fair", "For Parts/Not Working"]'::jsonb,
   '["Нов", "Рециклиран/Реновиран", "Използван - Като нов", "Използван - Добър", "Използван - Приемлив", "За части/Не работи"]'::jsonb,
   true, true, 23),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Warranty Period', 'Гаранционен срок', 'select',
   '["No Warranty", "3 Months", "6 Months", "1 Year", "2 Years", "3 Years", "5 Years", "Lifetime Warranty"]'::jsonb,
   '["Без гаранция", "3 месеца", "6 месеца", "1 година", "2 години", "3 години", "5 години", "Доживотна гаранция"]'::jsonb,
   false, true, 24),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Country of Origin', 'Страна на произход', 'select',
   '["Germany", "Japan", "USA", "Switzerland", "Sweden", "China", "Taiwan", "Czech Republic", "Hungary", "Poland", "Other EU", "Other"]'::jsonb,
   '["Германия", "Япония", "САЩ", "Швейцария", "Швеция", "Китай", "Тайван", "Чехия", "Унгария", "Полша", "Друга ЕС", "Друга"]'::jsonb,
   false, true, 25),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Certification', 'Сертификация', 'multiselect',
   '["CE", "GS (German Safety)", "VDE", "UL Listed", "CSA", "TÜV", "ISO 9001", "RoHS Compliant", "OSHA Compliant", "EN Standards"]'::jsonb,
   '["CE", "GS (Германска безопасност)", "VDE", "UL Listed", "CSA", "TÜV", "ISO 9001", "RoHS съвместим", "OSHA съвместим", "EN стандарти"]'::jsonb,
   false, true, 26),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Tool Weight (kg)', 'Тегло на инструмента (кг)', 'select',
   '["Under 1 kg", "1-2 kg", "2-3 kg", "3-5 kg", "5-10 kg", "10-20 kg", "20-50 kg", "50+ kg"]'::jsonb,
   '["Под 1 кг", "1-2 кг", "2-3 кг", "3-5 кг", "5-10 кг", "10-20 кг", "20-50 кг", "50+ кг"]'::jsonb,
   false, true, 27),

  -- MATERIAL & CONSTRUCTION (28-35)
  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Body Material', 'Материал на корпуса', 'select',
   '["Die-Cast Aluminum", "Magnesium Alloy", "Glass-Filled Nylon", "ABS Plastic", "Steel", "Fiberglass Composite", "Rubber Over-Mold"]'::jsonb,
   '["Алуминиев сплав", "Магнезиева сплав", "Найлон със стъклени влакна", "ABS пластмаса", "Стомана", "Фибростъкло композит", "Гумена обвивка"]'::jsonb,
   false, true, 28),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Handle Material', 'Материал на дръжката', 'select',
   '["Rubber Grip", "Bi-Material", "Soft Grip", "Hard Plastic", "Wood", "Fiberglass", "Steel", "Ergonomic Composite"]'::jsonb,
   '["Гумен грип", "Двуматериална", "Мек грип", "Твърда пластмаса", "Дърво", "Фибростъкло", "Стомана", "Ергономичен композит"]'::jsonb,
   false, true, 29),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Blade/Bit Material', 'Материал на ножа/върха', 'select',
   '["HSS (High Speed Steel)", "Carbide/TCT", "Bi-Metal", "Diamond", "Cobalt", "Titanium Coated", "Black Oxide", "Chrome Vanadium", "S2 Steel"]'::jsonb,
   '["HSS (Бързорежеща стомана)", "Карбид/TCT", "Биметал", "Диамант", "Кобалт", "Титаниево покритие", "Черен оксид", "Хром-ванадий", "S2 стомана"]'::jsonb,
   false, true, 30),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Tool Material', 'Материал на инструмента', 'select',
   '["Chrome Vanadium Steel", "Chrome Molybdenum Steel", "S2 Tool Steel", "Carbon Steel", "Stainless Steel", "Hardened Steel", "Titanium", "Aluminum"]'::jsonb,
   '["Хром-ванадиева стомана", "Хром-молибденова стомана", "S2 инструментална стомана", "Въглеродна стомана", "Неръждаема стомана", "Закалена стомана", "Титан", "Алуминий"]'::jsonb,
   false, true, 31),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Finish/Coating', 'Покритие', 'select',
   '["Chrome Plated", "Black Oxide", "Zinc Plated", "Nickel Plated", "Powder Coated", "Phosphate", "Polished", "Matte", "Anodized"]'::jsonb,
   '["Хромирано", "Черен оксид", "Поцинковано", "Никелирано", "Прахово покритие", "Фосфатирано", "Полирано", "Матово", "Анодизирано"]'::jsonb,
   false, true, 32),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Corrosion Resistance', 'Устойчивост на корозия', 'boolean',
   '[]'::jsonb, '[]'::jsonb,
   false, true, 33),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'Hardness Rating (HRC)', 'Твърдост (HRC)', 'select',
   '["Under 40 HRC", "40-50 HRC", "50-55 HRC", "55-60 HRC", "60-65 HRC", "65+ HRC", "N/A"]'::jsonb,
   '["Под 40 HRC", "40-50 HRC", "50-55 HRC", "55-60 HRC", "60-65 HRC", "65+ HRC", "Не е приложимо"]'::jsonb,
   false, false, 34),

  (gen_random_uuid(), 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399', 
   'IP Rating', 'IP рейтинг', 'select',
   '["None", "IP20", "IP44", "IP54", "IP55", "IP65", "IP67", "IP68"]'::jsonb,
   '["Няма", "IP20", "IP44", "IP54", "IP55", "IP65", "IP67", "IP68"]'::jsonb,
   false, true, 35)
ON CONFLICT DO NOTHING;;
