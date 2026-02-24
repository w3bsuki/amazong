-- Restore category_attributes for Real Estate & Sports

-- Real Estate Sale attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('real-estate-sale', 'Property Type', 'Тип имот', 'select', true, true, '["Apartment", "House", "Villa", "Studio", "Penthouse", "Duplex", "Maisonette"]', '["Апартамент", "Къща", "Вила", "Студио", "Пентхаус", "Дуплекс", "Мезонет"]', 1),
  ('real-estate-sale', 'Rooms', 'Стаи', 'select', true, true, '["1", "2", "3", "4", "5+"]', '["1", "2", "3", "4", "5+"]', 2),
  ('real-estate-sale', 'Area', 'Площ (кв.м)', 'number', true, true, '[]', '[]', 3),
  ('real-estate-sale', 'Floor', 'Етаж', 'select', false, true, '["Ground", "1", "2", "3", "4", "5", "6+", "Last", "Penthouse"]', '["Партер", "1", "2", "3", "4", "5", "6+", "Последен", "Пентхаус"]', 4),
  ('real-estate-sale', 'Construction', 'Строителство', 'select', false, true, '["Brick", "Panel", "EPK", "Concrete", "Wood"]', '["Тухла", "Панел", "ЕПК", "Бетон", "Дърво"]', 5),
  ('real-estate-sale', 'Heating', 'Отопление', 'select', false, true, '["Central", "Electric", "Gas", "Air Conditioning", "None"]', '["Централно", "Ел. ток", "Газ", "Климатик", "Без"]', 6),
  ('real-estate-sale', 'Furnished', 'Обзавеждане', 'select', false, true, '["Unfurnished", "Partially Furnished", "Fully Furnished"]', '["Необзаведен", "Частично обзаведен", "Напълно обзаведен"]', 7),
  ('real-estate-sale', 'Year Built', 'Година на строеж', 'number', false, true, '[]', '[]', 8),
  ('real-estate-sale', 'Parking', 'Паркинг', 'boolean', false, true, '[]', '[]', 9),
  ('real-estate-sale', 'Elevator', 'Асансьор', 'boolean', false, true, '[]', '[]', 10)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Real Estate Rent attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('real-estate-rent', 'Property Type', 'Тип имот', 'select', true, true, '["Apartment", "House", "Room", "Studio", "Office"]', '["Апартамент", "Къща", "Стая", "Студио", "Офис"]', 1),
  ('real-estate-rent', 'Rooms', 'Стаи', 'select', true, true, '["1", "2", "3", "4", "5+"]', '["1", "2", "3", "4", "5+"]', 2),
  ('real-estate-rent', 'Area', 'Площ (кв.м)', 'number', true, true, '[]', '[]', 3),
  ('real-estate-rent', 'Furnished', 'Обзавеждане', 'select', true, true, '["Unfurnished", "Partially Furnished", "Fully Furnished"]', '["Необзаведен", "Частично обзаведен", "Напълно обзаведен"]', 4),
  ('real-estate-rent', 'Deposit', 'Депозит', 'text', false, false, '[]', '[]', 5),
  ('real-estate-rent', 'Pets Allowed', 'Домашни любимци', 'boolean', false, true, '[]', '[]', 6),
  ('real-estate-rent', 'Utilities Included', 'Включени сметки', 'boolean', false, true, '[]', '[]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Fitness Equipment attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('fitness-weights', 'Type', 'Тип', 'select', true, true, '["Dumbbells", "Barbells", "Kettlebells", "Weight Plates", "Weight Bench"]', '["Дъмбели", "Щанги", "Гири", "Дискове", "Лежанка"]', 1),
  ('fitness-weights', 'Weight', 'Тегло', 'text', false, true, '[]', '[]', 2),
  ('fitness-weights', 'Material', 'Материал', 'select', false, true, '["Iron", "Rubber-Coated", "Neoprene", "Chrome"]', '["Желязо", "Гумирано", "Неопрен", "Хром"]', 3),
  ('fitness-weights', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Cycling attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('cycling-bikes', 'Type', 'Тип', 'select', true, true, '["Road", "Mountain", "Hybrid", "BMX", "Electric", "Folding", "Kids"]', '["Шосейни", "Планински", "Хибридни", "BMX", "Електрически", "Сгъваеми", "Детски"]', 1),
  ('cycling-bikes', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('cycling-bikes', 'Frame Size', 'Размер рамка', 'select', true, true, '["XS", "S", "M", "L", "XL"]', '["XS", "S", "M", "L", "XL"]', 3),
  ('cycling-bikes', 'Wheel Size', 'Размер колела', 'select', false, true, '["20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]', '["20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]', 4),
  ('cycling-bikes', 'Gears', 'Скорости', 'select', false, true, '["Single Speed", "7-Speed", "18-Speed", "21-Speed", "24-Speed", "27-Speed", "30-Speed"]', '["Единична", "7 скорости", "18 скорости", "21 скорости", "24 скорости", "27 скорости", "30 скорости"]', 5),
  ('cycling-bikes', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Camping equipment attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('camping-tents', 'Capacity', 'Капацитет', 'select', true, true, '["1 Person", "2 Person", "3 Person", "4 Person", "5+ Person", "Family"]', '["1 човек", "2 човека", "3 човека", "4 човека", "5+ човека", "Семейна"]', 1),
  ('camping-tents', 'Type', 'Тип', 'select', true, true, '["Dome", "Cabin", "Pop-Up", "Backpacking", "Canopy"]', '["Куполна", "Кабинна", "Сгъваема", "Туристическа", "Шатра"]', 2),
  ('camping-tents', 'Season', 'Сезон', 'select', false, true, '["3 Season", "4 Season", "Summer"]', '["3 сезона", "4 сезона", "Лято"]', 3),
  ('camping-tents', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
