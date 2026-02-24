
-- =====================================================
-- HOME & KITCHEN PART 7: Comprehensive Attributes
-- =====================================================

-- ========== FURNITURE ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Furniture Material', 'Материал', 'select',
  '["Solid Wood", "Engineered Wood", "MDF", "Particle Board", "Metal", "Glass", "Leather", "Fabric", "Rattan", "Plastic", "Bamboo", "Marble"]',
  '["Масивно дърво", "Инженерно дърво", "MDF", "ПДЧ", "Метал", "Стъкло", "Кожа", "Текстил", "Ратан", "Пластмаса", "Бамбук", "Мрамор"]',
  true, false
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Style', 'Стил', 'select',
  '["Modern", "Contemporary", "Traditional", "Scandinavian", "Industrial", "Mid-Century", "Rustic", "Minimalist", "Bohemian", "Art Deco", "Farmhouse", "Coastal"]',
  '["Модерен", "Съвременен", "Традиционен", "Скандинавски", "Индустриален", "Средата на века", "Рустик", "Минималистичен", "Бохемски", "Арт деко", "Фермерски", "Крайбрежен"]',
  true, false
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Color', 'Цвят', 'select',
  '["White", "Black", "Gray", "Brown", "Beige", "Oak", "Walnut", "Cherry", "Espresso", "Natural Wood", "Blue", "Green", "Yellow", "Red", "Pink", "Multi-color"]',
  '["Бял", "Черен", "Сив", "Кафяв", "Бежов", "Дъб", "Орех", "Череша", "Еспресо", "Натурално дърво", "Син", "Зелен", "Жълт", "Червен", "Розов", "Многоцветен"]',
  true, false
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Assembly Required', 'Изисква сглобяване', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Room', 'Стая', 'multiselect',
  '["Living Room", "Bedroom", "Dining Room", "Kitchen", "Office", "Bathroom", "Kids Room", "Outdoor", "Entryway", "Garage"]',
  '["Хол", "Спалня", "Трапезария", "Кухня", "Офис", "Баня", "Детска стая", "Външно", "Антре", "Гараж"]',
  true, false
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT DO NOTHING;

-- ========== KITCHEN & DINING ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Brand', 'Марка', 'select',
  '["Bosch", "Siemens", "Samsung", "LG", "Whirlpool", "Electrolux", "Miele", "AEG", "Gorenje", "Beko", "Candy", "Indesit", "Hotpoint", "Philips", "KitchenAid", "Tefal", "De''Longhi", "Nespresso", "Other"]',
  '["Bosch", "Siemens", "Samsung", "LG", "Whirlpool", "Electrolux", "Miele", "AEG", "Gorenje", "Beko", "Candy", "Indesit", "Hotpoint", "Philips", "KitchenAid", "Tefal", "De''Longhi", "Nespresso", "Друга"]',
  true, false
FROM categories c WHERE c.slug = 'kitchen-dining'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Energy Rating', 'Енергиен клас', 'select',
  '["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"]',
  '["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"]',
  true, false
FROM categories c WHERE c.slug = 'kitchen-dining'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Capacity', 'Капацитет', 'select',
  '["Under 100L", "100-200L", "200-300L", "300-400L", "400-500L", "Over 500L", "1-2 Servings", "3-4 Servings", "5-6 Servings", "7+ Servings"]',
  '["Под 100L", "100-200L", "200-300L", "300-400L", "400-500L", "Над 500L", "1-2 порции", "3-4 порции", "5-6 порции", "7+ порции"]',
  true, false
FROM categories c WHERE c.slug = 'kitchen-dining'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Finish', 'Покритие', 'select',
  '["Stainless Steel", "Black Stainless", "White", "Black", "Silver", "Copper", "Matte", "Glossy"]',
  '["Неръждаема стомана", "Черна стомана", "Бяло", "Черно", "Сребристо", "Медно", "Матово", "Гланцово"]',
  true, false
FROM categories c WHERE c.slug = 'kitchen-dining'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Material', 'Материал', 'select',
  '["Stainless Steel", "Aluminum", "Cast Iron", "Non-Stick", "Ceramic", "Glass", "Silicone", "Porcelain", "Bone China", "Melamine", "Wood", "Bamboo"]',
  '["Неръждаема стомана", "Алуминий", "Чугун", "Незалепващо", "Керамика", "Стъкло", "Силикон", "Порцелан", "Костен порцелан", "Меламин", "Дърво", "Бамбук"]',
  true, false
FROM categories c WHERE c.slug = 'kitchen-dining'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Dishwasher Safe', 'Подходящо за съдомиялна', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'kitchen-dining'
ON CONFLICT DO NOTHING;

-- ========== BEDDING & BATH ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Bed Size', 'Размер на легло', 'select',
  '["Single (90x200)", "Double (140x200)", "Queen (160x200)", "King (180x200)", "Super King (200x200)", "Kids (70x140)", "Cot (60x120)"]',
  '["Единично (90x200)", "Двойно (140x200)", "Queen (160x200)", "King (180x200)", "Super King (200x200)", "Детско (70x140)", "Бебешко (60x120)"]',
  true, false
FROM categories c WHERE c.slug = 'bedding-bath'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Thread Count', 'Брой нишки', 'select',
  '["Under 200", "200-300", "300-400", "400-600", "600-800", "800+"]',
  '["Под 200", "200-300", "300-400", "400-600", "600-800", "800+"]',
  true, false
FROM categories c WHERE c.slug = 'bedding-bath'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Material', 'Материал', 'select',
  '["Cotton", "Egyptian Cotton", "Linen", "Silk", "Microfiber", "Bamboo", "Polyester", "Cotton Blend", "Satin", "Flannel", "Jersey"]',
  '["Памук", "Египетски памук", "Лен", "Коприна", "Микрофибър", "Бамбук", "Полиестер", "Памучна смес", "Сатен", "Фланел", "Трико"]',
  true, false
FROM categories c WHERE c.slug = 'bedding-bath'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'GSM (Towels)', 'GSM (Кърпи)', 'select',
  '["300-400 (Light)", "400-500 (Medium)", "500-600 (Plush)", "600-700 (Luxury)", "700+ (Ultra Plush)"]',
  '["300-400 (Леки)", "400-500 (Средни)", "500-600 (Плюшени)", "600-700 (Луксозни)", "700+ (Ултра плюшени)"]',
  true, false
FROM categories c WHERE c.slug = 'bedding-bath'
ON CONFLICT DO NOTHING;

-- ========== LIGHTING ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Light Type', 'Тип светлина', 'select',
  '["LED", "Incandescent", "CFL", "Halogen", "Smart/WiFi", "Solar"]',
  '["LED", "Волфрамова", "Енергоспестяваща", "Халогенна", "Смарт/WiFi", "Соларна"]',
  true, false
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Color Temperature', 'Цветна температура', 'select',
  '["Warm White (2700K)", "Soft White (3000K)", "Neutral White (4000K)", "Cool White (5000K)", "Daylight (6500K)", "RGB/Color Changing"]',
  '["Топло бяла (2700K)", "Мека бяла (3000K)", "Неутрална (4000K)", "Студено бяла (5000K)", "Дневна (6500K)", "RGB/Смяна на цветове"]',
  true, false
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Dimmable', 'Димируема', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Bulb Base', 'Цокъл', 'select',
  '["E27", "E14", "GU10", "GU5.3", "G9", "G4", "B22", "Integrated"]',
  '["E27", "E14", "GU10", "GU5.3", "G9", "G4", "B22", "Вграден"]',
  true, false
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Lumens', 'Лумени', 'select',
  '["Under 400 (Accent)", "400-800 (Table Lamp)", "800-1100 (Room)", "1100-1600 (Bright)", "1600+ (Very Bright)"]',
  '["Под 400 (Акцент)", "400-800 (Настолна)", "800-1100 (Стая)", "1100-1600 (Ярка)", "1600+ (Много ярка)"]',
  true, false
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT DO NOTHING;

-- ========== HOME DÉCOR ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Style', 'Стил', 'select',
  '["Modern", "Contemporary", "Traditional", "Bohemian", "Scandinavian", "Industrial", "Farmhouse", "Coastal", "Minimalist", "Vintage", "Art Deco", "Eclectic"]',
  '["Модерен", "Съвременен", "Традиционен", "Бохемски", "Скандинавски", "Индустриален", "Фермерски", "Крайбрежен", "Минималистичен", "Винтидж", "Арт Деко", "Еклектичен"]',
  true, false
FROM categories c WHERE c.slug = 'home-decor'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Color Family', 'Цветова гама', 'select',
  '["Neutral", "Earth Tones", "Pastels", "Bold/Vibrant", "Metallics", "Monochrome", "Multi-Color"]',
  '["Неутрални", "Земни тонове", "Пастелни", "Ярки", "Металици", "Монохромни", "Многоцветни"]',
  true, false
FROM categories c WHERE c.slug = 'home-decor'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Room', 'Стая', 'multiselect',
  '["Living Room", "Bedroom", "Dining Room", "Kitchen", "Bathroom", "Office", "Entryway", "Kids Room", "Outdoor"]',
  '["Хол", "Спалня", "Трапезария", "Кухня", "Баня", "Офис", "Антре", "Детска", "Външно"]',
  true, false
FROM categories c WHERE c.slug = 'home-decor'
ON CONFLICT DO NOTHING;

-- ========== HOUSEHOLD ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Scent', 'Аромат', 'select',
  '["Unscented", "Fresh", "Lavender", "Lemon", "Pine", "Ocean", "Floral", "Citrus"]',
  '["Без аромат", "Свежест", "Лавандула", "Лимон", "Бор", "Океан", "Цветен", "Цитрус"]',
  true, false
FROM categories c WHERE c.slug = 'household'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Eco-Friendly', 'Екологичен', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'household'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Size/Quantity', 'Размер/Количество', 'select',
  '["Single", "Pack of 2", "Pack of 3", "Pack of 5", "Pack of 10", "Bulk Pack", "Refill"]',
  '["Единично", "2 броя", "3 броя", "5 броя", "10 броя", "Голяма опаковка", "Пълнител"]',
  true, false
FROM categories c WHERE c.slug = 'household'
ON CONFLICT DO NOTHING;

-- ========== CLIMATE CONTROL ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'BTU/Power', 'BTU/Мощност', 'select',
  '["Under 5000 BTU", "5000-8000 BTU", "8000-12000 BTU", "12000-18000 BTU", "18000-24000 BTU", "24000+ BTU"]',
  '["Под 5000 BTU", "5000-8000 BTU", "8000-12000 BTU", "12000-18000 BTU", "18000-24000 BTU", "24000+ BTU"]',
  true, false
FROM categories c WHERE c.slug = 'home-climate'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Room Size', 'Размер на стая', 'select',
  '["Small (up to 15m²)", "Medium (15-25m²)", "Large (25-40m²)", "Extra Large (40m²+)", "Whole House"]',
  '["Малка (до 15m²)", "Средна (15-25m²)", "Голяма (25-40m²)", "Много голяма (40m²+)", "Цялата къща"]',
  true, false
FROM categories c WHERE c.slug = 'home-climate'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Energy Class', 'Енергиен клас', 'select',
  '["A+++", "A++", "A+", "A", "B", "C", "D"]',
  '["A+++", "A++", "A+", "A", "B", "C", "D"]',
  true, false
FROM categories c WHERE c.slug = 'home-climate'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'WiFi/Smart', 'WiFi/Смарт', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'home-climate'
ON CONFLICT DO NOTHING;

-- ========== HOME IMPROVEMENT ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Finish Type', 'Вид покритие', 'select',
  '["Matte", "Satin", "Semi-Gloss", "Gloss", "Eggshell", "Flat"]',
  '["Матово", "Сатен", "Полугланц", "Гланц", "Яйцевидно", "Плоско"]',
  true, false
FROM categories c WHERE c.slug = 'home-improvement'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Indoor/Outdoor', 'Вътрешно/Външно', 'select',
  '["Indoor Only", "Outdoor Only", "Indoor/Outdoor"]',
  '["Само вътрешно", "Само външно", "Вътрешно/Външно"]',
  true, false
FROM categories c WHERE c.slug = 'home-improvement'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'DIY Difficulty', 'Трудност за направи си сам', 'select',
  '["Easy (Beginner)", "Medium (Intermediate)", "Hard (Professional)"]',
  '["Лесно (Начинаещ)", "Средно (Среден)", "Трудно (Професионалист)"]',
  true, false
FROM categories c WHERE c.slug = 'home-improvement'
ON CONFLICT DO NOTHING;
;
