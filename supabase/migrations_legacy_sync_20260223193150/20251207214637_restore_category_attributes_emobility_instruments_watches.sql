-- Restore category_attributes for E-Mobility, Musical Instruments, Watches

-- Electric Scooters attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('electric-scooters', 'Type', 'Тип', 'select', true, true, '["Kick Scooter", "Seated Scooter", "Off-Road", "Commuter", "Kids"]', '["Кик тротинетка", "Със седалка", "Офроуд", "Градска", "Детска"]', 1),
  ('electric-scooters', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('electric-scooters', 'Max Speed', 'Макс. скорост (км/ч)', 'select', false, true, '["Up to 25 km/h", "25-35 km/h", "35-45 km/h", "45+ km/h"]', '["До 25 км/ч", "25-35 км/ч", "35-45 км/ч", "45+ км/ч"]', 3),
  ('electric-scooters', 'Range', 'Пробег (км)', 'select', false, true, '["Up to 20 km", "20-40 km", "40-60 km", "60+ km"]', '["До 20 км", "20-40 км", "40-60 км", "60+ км"]', 4),
  ('electric-scooters', 'Motor Power', 'Мощност на мотора', 'select', false, true, '["250W", "350W", "500W", "800W", "1000W+", "Dual Motor"]', '["250W", "350W", "500W", "800W", "1000W+", "Двоен мотор"]', 5),
  ('electric-scooters', 'Weight Capacity', 'Макс. тегло (кг)', 'select', false, true, '["Up to 80 kg", "80-100 kg", "100-120 kg", "120+ kg"]', '["До 80 кг", "80-100 кг", "100-120 кг", "120+ кг"]', 6),
  ('electric-scooters', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Electric Bikes attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('electric-bikes', 'Type', 'Тип', 'select', true, true, '["City/Commuter", "Mountain", "Folding", "Road", "Cargo", "Fat Tire"]', '["Градски", "Планински", "Сгъваем", "Шосеен", "Карго", "Дебели гуми"]', 1),
  ('electric-bikes', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('electric-bikes', 'Motor Position', 'Позиция на мотора', 'select', false, true, '["Hub Front", "Hub Rear", "Mid-Drive"]', '["Преден хъб", "Заден хъб", "Среден (кареточен)"]', 3),
  ('electric-bikes', 'Motor Power', 'Мощност', 'select', false, true, '["250W", "350W", "500W", "750W", "1000W+"]', '["250W", "350W", "500W", "750W", "1000W+"]', 4),
  ('electric-bikes', 'Battery Capacity', 'Батерия (Wh)', 'select', false, true, '["Up to 300 Wh", "300-500 Wh", "500-700 Wh", "700+ Wh"]', '["До 300 Wh", "300-500 Wh", "500-700 Wh", "700+ Wh"]', 5),
  ('electric-bikes', 'Frame Size', 'Размер рамка', 'select', true, true, '["XS", "S", "M", "L", "XL"]', '["XS", "S", "M", "L", "XL"]', 6),
  ('electric-bikes', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Guitars attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('guitars', 'Type', 'Тип', 'select', true, true, '["Acoustic", "Electric", "Classical", "Bass", "Semi-Hollow", "12-String"]', '["Акустична", "Електрическа", "Класическа", "Бас", "Полу-куха", "12 струни"]', 1),
  ('guitars', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('guitars', 'Body Style', 'Форма на тялото', 'select', false, true, '["Dreadnought", "Concert", "Jumbo", "Stratocaster", "Les Paul", "SG", "Telecaster", "Jazz Bass", "Precision Bass"]', '["Dreadnought", "Concert", "Jumbo", "Stratocaster", "Les Paul", "SG", "Telecaster", "Jazz Bass", "Precision Bass"]', 3),
  ('guitars', 'Number of Frets', 'Брой праговe', 'select', false, false, '["19", "20", "21", "22", "24"]', '["19", "20", "21", "22", "24"]', 4),
  ('guitars', 'Handedness', 'Ръка', 'select', false, true, '["Right-Handed", "Left-Handed"]', '["За дясна ръка", "За лява ръка"]', 5),
  ('guitars', 'Includes', 'Включва', 'multiselect', false, false, '["Case", "Gig Bag", "Strap", "Picks", "Stand", "Amp"]', '["Кейс", "Калъф", "Каишка", "Перца", "Стойка", "Усилвател"]', 6),
  ('guitars', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Excellent", "Good", "Fair", "For Parts/Repair"]', '["Ново", "Като ново", "Отлично", "Добро", "Задоволително", "За части/ремонт"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Keyboards & Pianos attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('keyboards', 'Type', 'Тип', 'select', true, true, '["Digital Piano", "Synthesizer", "MIDI Controller", "Workstation", "Arranger", "Stage Piano", "Organ"]', '["Дигитално пиано", "Синтезатор", "MIDI контролер", "Работна станция", "Аранжор", "Сценично пиано", "Орган"]', 1),
  ('keyboards', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('keyboards', 'Number of Keys', 'Брой клавиши', 'select', true, true, '["25", "32", "37", "49", "61", "73", "76", "88"]', '["25", "32", "37", "49", "61", "73", "76", "88"]', 3),
  ('keyboards', 'Key Type', 'Тип клавиши', 'select', false, true, '["Synth Action", "Semi-Weighted", "Weighted", "Hammer Action", "Graded Hammer"]', '["Синт действие", "Полу-тежки", "Тежки", "Чукчета", "Градирани чукчета"]', 4),
  ('keyboards', 'Connectivity', 'Свързване', 'multiselect', false, false, '["MIDI", "USB", "Bluetooth", "Audio Out", "Headphone Jack"]', '["MIDI", "USB", "Bluetooth", "Аудио изход", "Жак за слушалки"]', 5),
  ('keyboards', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Excellent", "Good", "Fair"]', '["Ново", "Като ново", "Отлично", "Добро", "Задоволително"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Drums attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('drums', 'Type', 'Тип', 'select', true, true, '["Acoustic Kit", "Electronic Kit", "Snare", "Bass Drum", "Cymbals", "Percussion", "Drum Pad"]', '["Акустичен комплект", "Електронен комплект", "Соло барабан", "Бас барабан", "Чинели", "Перкусии", "Drum пад"]', 1),
  ('drums', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('drums', 'Pieces', 'Части в комплекта', 'select', false, true, '["3-Piece", "4-Piece", "5-Piece", "6-Piece", "7-Piece+", "Single Item"]', '["3 части", "4 части", "5 части", "6 части", "7+ части", "Единичен"]', 3),
  ('drums', 'Shell Material', 'Материал на корпуса', 'select', false, true, '["Maple", "Birch", "Poplar", "Oak", "Acrylic", "Metal"]', '["Клен", "Бреза", "Топола", "Дъб", "Акрил", "Метал"]', 4),
  ('drums', 'Includes', 'Включва', 'multiselect', false, false, '["Hardware", "Cymbals", "Throne", "Sticks", "Cases"]', '["Хардуер", "Чинели", "Столче", "Палки", "Кейсове"]', 5),
  ('drums', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Excellent", "Good", "Fair"]', '["Ново", "Като ново", "Отлично", "Добро", "Задоволително"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Watches attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('watches', 'Type', 'Тип', 'select', true, true, '["Mechanical", "Automatic", "Quartz", "Smart Watch", "Chronograph", "Dress", "Dive", "Sport"]', '["Механичен", "Автоматичен", "Кварцов", "Смарт часовник", "Хронограф", "Елегантен", "Водолазен", "Спортен"]', 1),
  ('watches', 'Brand', 'Марка', 'text', true, true, '[]', '[]', 2),
  ('watches', 'Case Material', 'Материал на корпуса', 'select', false, true, '["Stainless Steel", "Gold", "Titanium", "Ceramic", "Plastic", "Carbon Fiber"]', '["Неръждаема стомана", "Злато", "Титан", "Керамика", "Пластмаса", "Карбон"]', 3),
  ('watches', 'Case Diameter', 'Диаметър на корпуса', 'select', false, true, '["Under 36mm", "36-40mm", "40-44mm", "44-48mm", "Over 48mm"]', '["Под 36мм", "36-40мм", "40-44мм", "44-48мм", "Над 48мм"]', 4),
  ('watches', 'Band Material', 'Материал на каишка', 'select', false, true, '["Leather", "Stainless Steel", "Rubber", "Silicone", "Fabric", "Gold"]', '["Кожа", "Неръждаема стомана", "Гума", "Силикон", "Плат", "Злато"]', 5),
  ('watches', 'Water Resistance', 'Водоустойчивост', 'select', false, true, '["Not Water Resistant", "30m/3ATM", "50m/5ATM", "100m/10ATM", "200m/20ATM", "300m+"]', '["Не е водоустойчив", "30м/3ATM", "50м/5ATM", "100м/10ATM", "200м/20ATM", "300м+"]', 6),
  ('watches', 'Gender', 'За', 'select', false, true, '["Men", "Women", "Unisex"]', '["Мъже", "Жени", "Унисекс"]', 7),
  ('watches', 'Box & Papers', 'Кутия и документи', 'select', false, true, '["Complete Set", "Box Only", "Papers Only", "None"]', '["Пълен комплект", "Само кутия", "Само документи", "Без"]', 8),
  ('watches', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Excellent", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Отлично", "Добро", "Задоволително", "За части"]', 9)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Jewelry attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('jewelry', 'Type', 'Тип', 'select', true, true, '["Ring", "Necklace", "Bracelet", "Earrings", "Pendant", "Watch", "Brooch", "Cufflinks", "Set"]', '["Пръстен", "Колие", "Гривна", "Обеци", "Медальон", "Часовник", "Брошка", "Ръкавели", "Комплект"]', 1),
  ('jewelry', 'Material', 'Материал', 'select', true, true, '["Gold", "White Gold", "Rose Gold", "Silver", "Platinum", "Stainless Steel", "Costume"]', '["Злато", "Бяло злато", "Розово злато", "Сребро", "Платина", "Неръждаема стомана", "Бижутерия"]', 2),
  ('jewelry', 'Gemstone', 'Скъпоценен камък', 'select', false, true, '["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl", "Amethyst", "Topaz", "None", "Other"]', '["Диамант", "Рубин", "Сапфир", "Изумруд", "Перла", "Аметист", "Топаз", "Без", "Друг"]', 3),
  ('jewelry', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 4),
  ('jewelry', 'Certification', 'Сертификат', 'select', false, true, '["GIA", "AGS", "IGI", "EGL", "None", "Other"]', '["GIA", "AGS", "IGI", "EGL", "Без", "Друг"]', 5),
  ('jewelry', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Excellent", "Good", "Vintage", "Antique"]', '["Ново", "Като ново", "Отлично", "Добро", "Винтидж", "Антика"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
