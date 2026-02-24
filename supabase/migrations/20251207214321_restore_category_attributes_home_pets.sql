-- Restore category_attributes for Home & Kitchen, Pets

-- Furniture attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('furniture', 'Type', 'Тип', 'select', true, true, '["Sofa", "Bed", "Table", "Chair", "Cabinet", "Desk", "Shelf", "Wardrobe", "Dresser", "TV Stand"]', '["Диван", "Легло", "Маса", "Стол", "Шкаф", "Бюро", "Рафт", "Гардероб", "Скрин", "ТВ шкаф"]', 1),
  ('furniture', 'Material', 'Материал', 'select', false, true, '["Wood", "Metal", "Fabric", "Leather", "Glass", "Plastic", "Rattan", "Composite"]', '["Дърво", "Метал", "Плат", "Кожа", "Стъкло", "Пластмаса", "Ратан", "Композит"]', 2),
  ('furniture', 'Color', 'Цвят', 'select', false, true, '["White", "Black", "Brown", "Gray", "Beige", "Natural Wood", "Blue", "Green", "Red"]', '["Бял", "Черен", "Кафяв", "Сив", "Бежов", "Натурално дърво", "Син", "Зелен", "Червен"]', 3),
  ('furniture', 'Room', 'Стая', 'select', false, true, '["Living Room", "Bedroom", "Dining Room", "Office", "Kitchen", "Bathroom", "Outdoor"]', '["Хол", "Спалня", "Трапезария", "Офис", "Кухня", "Баня", "Външни"]', 4),
  ('furniture', 'Dimensions', 'Размери', 'text', false, false, '[]', '[]', 5),
  ('furniture', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Restoration"]', '["Ново", "Като ново", "Добро", "Задоволително", "За реставрация"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Kitchen Appliances attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('kitchen-appliances', 'Type', 'Тип', 'select', true, true, '["Refrigerator", "Oven", "Microwave", "Dishwasher", "Blender", "Mixer", "Coffee Machine", "Toaster", "Air Fryer", "Food Processor"]', '["Хладилник", "Фурна", "Микровълнова", "Съдомиялна", "Блендер", "Миксер", "Кафе машина", "Тостер", "Еър фраер", "Кухненски робот"]', 1),
  ('kitchen-appliances', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('kitchen-appliances', 'Power', 'Мощност', 'text', false, false, '[]', '[]', 3),
  ('kitchen-appliances', 'Color', 'Цвят', 'select', false, true, '["White", "Black", "Silver", "Stainless Steel", "Red"]', '["Бял", "Черен", "Сребърен", "Инокс", "Червен"]', 4),
  ('kitchen-appliances', 'Energy Class', 'Енергиен клас', 'select', false, true, '["A+++", "A++", "A+", "A", "B", "C"]', '["A+++", "A++", "A+", "A", "B", "C"]', 5),
  ('kitchen-appliances', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Home Decor attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('home-decor', 'Type', 'Тип', 'select', true, true, '["Wall Art", "Vase", "Candle", "Mirror", "Clock", "Cushion", "Rug", "Curtains", "Lamp", "Photo Frame"]', '["Картина", "Ваза", "Свещ", "Огледало", "Часовник", "Възглавница", "Килим", "Завеси", "Лампа", "Рамка за снимки"]', 1),
  ('home-decor', 'Style', 'Стил', 'select', false, true, '["Modern", "Classic", "Bohemian", "Minimalist", "Industrial", "Rustic", "Scandinavian"]', '["Модерен", "Класически", "Бохемски", "Минималистичен", "Индустриален", "Рустик", "Скандинавски"]', 2),
  ('home-decor', 'Material', 'Материал', 'select', false, true, '["Ceramic", "Glass", "Wood", "Metal", "Fabric", "Plastic"]', '["Керамика", "Стъкло", "Дърво", "Метал", "Плат", "Пластмаса"]', 3),
  ('home-decor', 'Color', 'Цвят', 'text', false, true, '[]', '[]', 4),
  ('home-decor', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Vintage"]', '["Ново", "Като ново", "Добро", "Винтидж"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Bedding attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('bedding', 'Type', 'Тип', 'select', true, true, '["Bed Sheets", "Duvet Cover", "Pillowcase", "Comforter", "Blanket", "Mattress Pad", "Bed Set"]', '["Чаршафи", "Пликове", "Калъфки", "Юрган", "Одеяло", "Протектор матрак", "Спален комплект"]', 1),
  ('bedding', 'Size', 'Размер', 'select', true, true, '["Single", "Double", "Queen", "King", "Super King"]', '["Единичен", "Двоен", "Queen", "King", "Super King"]', 2),
  ('bedding', 'Material', 'Материал', 'select', false, true, '["Cotton", "Linen", "Silk", "Polyester", "Microfiber", "Bamboo", "Satin"]', '["Памук", "Лен", "Коприна", "Полиестер", "Микрофибър", "Бамбук", "Сатен"]', 3),
  ('bedding', 'Color', 'Цвят', 'text', false, true, '[]', '[]', 4),
  ('bedding', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good"]', '["Ново", "Като ново", "Добро"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Dog Supplies attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('dogs', 'Product Type', 'Тип продукт', 'select', true, true, '["Food", "Treats", "Toys", "Bed", "Collar", "Leash", "Harness", "Crate", "Bowl", "Grooming", "Clothing"]', '["Храна", "Лакомства", "Играчки", "Легло", "Нашийник", "Повод", "Нагръдник", "Клетка", "Купа", "Грижа", "Облекло"]', 1),
  ('dogs', 'Dog Size', 'Размер куче', 'select', false, true, '["Small (0-10kg)", "Medium (10-25kg)", "Large (25-45kg)", "Extra Large (45kg+)", "All Sizes"]', '["Малко (0-10кг)", "Средно (10-25кг)", "Голямо (25-45кг)", "Много голямо (45кг+)", "Всички размери"]', 2),
  ('dogs', 'Age Group', 'Възрастова група', 'select', false, true, '["Puppy", "Adult", "Senior", "All Ages"]', '["Кученце", "Възрастен", "Възрастен (7+)", "Всички възрасти"]', 3),
  ('dogs', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 4),
  ('dogs', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good"]', '["Ново", "Като ново", "Добро"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Cat Supplies attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('cats', 'Product Type', 'Тип продукт', 'select', true, true, '["Food", "Treats", "Toys", "Bed", "Litter", "Litter Box", "Scratcher", "Cat Tree", "Bowl", "Carrier", "Grooming"]', '["Храна", "Лакомства", "Играчки", "Легло", "Постелка", "Тоалетна", "Драскалка", "Катерушка", "Купа", "Транспортна чанта", "Грижа"]', 1),
  ('cats', 'Age Group', 'Възрастова група', 'select', false, true, '["Kitten", "Adult", "Senior", "All Ages"]', '["Коте", "Възрастен", "Възрастен (7+)", "Всички възрасти"]', 2),
  ('cats', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('cats', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good"]', '["Ново", "Като ново", "Добро"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Fish & Aquarium attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('fish-aquarium', 'Product Type', 'Тип продукт', 'select', true, true, '["Aquarium", "Filter", "Heater", "Light", "Decoration", "Food", "Water Treatment", "Air Pump", "Gravel", "Plants"]', '["Аквариум", "Филтър", "Нагревател", "Осветление", "Декорация", "Храна", "Препарати", "Помпа", "Чакъл", "Растения"]', 1),
  ('fish-aquarium', 'Tank Size', 'Размер аквариум', 'select', false, true, '["Up to 20L", "20-50L", "50-100L", "100-200L", "200L+"]', '["До 20л", "20-50л", "50-100л", "100-200л", "200л+"]', 2),
  ('fish-aquarium', 'Water Type', 'Тип вода', 'select', false, true, '["Freshwater", "Saltwater", "Both"]', '["Сладководен", "Соленоводен", "И двата"]', 3),
  ('fish-aquarium', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
