-- Restore category_attributes for Fashion & Vehicles

-- Men's Clothing attributes (applied to multiple categories)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('mens-tops', 'Size', 'Размер', 'select', true, true, '["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]', '["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]', 1),
  ('mens-tops', 'Color', 'Цвят', 'select', true, true, '["Black", "White", "Gray", "Navy", "Blue", "Red", "Green", "Brown", "Beige", "Multi"]', '["Черен", "Бял", "Сив", "Тъмносин", "Син", "Червен", "Зелен", "Кафяв", "Бежов", "Многоцветен"]', 2),
  ('mens-tops', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('mens-tops', 'Condition', 'Състояние', 'select', true, true, '["New with Tags", "New without Tags", "Like New", "Good", "Fair"]', '["Ново с етикет", "Ново без етикет", "Като ново", "Добро", "Задоволително"]', 4),
  ('mens-tops', 'Material', 'Материал', 'select', false, true, '["Cotton", "Polyester", "Wool", "Linen", "Silk", "Blend"]', '["Памук", "Полиестер", "Вълна", "Лен", "Коприна", "Смесен"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Women's Dresses attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('womens-dresses', 'Size', 'Размер', 'select', true, true, '["XXS", "XS", "S", "M", "L", "XL", "XXL", "Plus Size"]', '["XXS", "XS", "S", "M", "L", "XL", "XXL", "Голям размер"]', 1),
  ('womens-dresses', 'Color', 'Цвят', 'select', true, true, '["Black", "White", "Red", "Blue", "Green", "Pink", "Purple", "Yellow", "Floral", "Multi"]', '["Черен", "Бял", "Червен", "Син", "Зелен", "Розов", "Лилав", "Жълт", "Флорален", "Многоцветен"]', 2),
  ('womens-dresses', 'Length', 'Дължина', 'select', true, true, '["Mini", "Midi", "Maxi", "Knee Length"]', '["Мини", "Миди", "Макси", "До коляното"]', 3),
  ('womens-dresses', 'Condition', 'Състояние', 'select', true, true, '["New with Tags", "New without Tags", "Like New", "Good", "Fair"]', '["Ново с етикет", "Ново без етикет", "Като ново", "Добро", "Задоволително"]', 4),
  ('womens-dresses', 'Occasion', 'Повод', 'select', false, true, '["Casual", "Cocktail", "Formal", "Wedding", "Work", "Beach"]', '["Ежедневна", "Коктейлна", "Официална", "Сватбена", "Работна", "Плажна"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Shoes attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('shoes-men', 'Size', 'Размер', 'select', true, true, '["39", "40", "41", "42", "43", "44", "45", "46", "47"]', '["39", "40", "41", "42", "43", "44", "45", "46", "47"]', 1),
  ('shoes-men', 'Color', 'Цвят', 'select', true, true, '["Black", "Brown", "White", "Gray", "Navy", "Tan", "Multi"]', '["Черен", "Кафяв", "Бял", "Сив", "Тъмносин", "Бежов", "Многоцветен"]', 2),
  ('shoes-men', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('shoes-men', 'Condition', 'Състояние', 'select', true, true, '["New with Box", "New without Box", "Like New", "Good", "Fair"]', '["Ново с кутия", "Ново без кутия", "Като ново", "Добро", "Задоволително"]', 4),
  ('shoes-women', 'Size', 'Размер', 'select', true, true, '["35", "36", "37", "38", "39", "40", "41", "42"]', '["35", "36", "37", "38", "39", "40", "41", "42"]', 1),
  ('shoes-women', 'Color', 'Цвят', 'select', true, true, '["Black", "Brown", "White", "Nude", "Red", "Pink", "Gold", "Silver", "Multi"]', '["Черен", "Кафяв", "Бял", "Телесен", "Червен", "Розов", "Златен", "Сребрист", "Многоцветен"]', 2),
  ('shoes-women', 'Heel Height', 'Височина на тока', 'select', false, true, '["Flat", "Low", "Mid", "High", "Stiletto"]', '["Равно", "Нисък", "Среден", "Висок", "Стилето"]', 3),
  ('shoes-women', 'Condition', 'Състояние', 'select', true, true, '["New with Box", "New without Box", "Like New", "Good", "Fair"]', '["Ново с кутия", "Ново без кутия", "Като ново", "Добро", "Задоволително"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Cars attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('vehicles-cars', 'Make', 'Марка', 'select', true, true, '["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota", "Honda", "Ford", "Opel", "Peugeot", "Renault", "Skoda", "Hyundai", "Kia", "Mazda", "Nissan"]', '["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota", "Honda", "Ford", "Opel", "Peugeot", "Renault", "Skoda", "Hyundai", "Kia", "Mazda", "Nissan"]', 1),
  ('vehicles-cars', 'Model', 'Модел', 'text', true, false, '[]', '[]', 2),
  ('vehicles-cars', 'Year', 'Година', 'number', true, true, '[]', '[]', 3),
  ('vehicles-cars', 'Mileage', 'Километраж', 'number', true, true, '[]', '[]', 4),
  ('vehicles-cars', 'Fuel Type', 'Гориво', 'select', true, true, '["Petrol", "Diesel", "Electric", "Hybrid", "LPG"]', '["Бензин", "Дизел", "Електрически", "Хибрид", "Газ"]', 5),
  ('vehicles-cars', 'Transmission', 'Скоростна кутия', 'select', true, true, '["Manual", "Automatic", "Semi-Automatic"]', '["Ръчна", "Автоматична", "Полу-автоматична"]', 6),
  ('vehicles-cars', 'Body Type', 'Тип каросерия', 'select', false, true, '["Sedan", "SUV", "Hatchback", "Coupe", "Wagon", "Convertible", "Van"]', '["Седан", "Джип", "Хечбек", "Купе", "Комби", "Кабрио", "Ван"]', 7),
  ('vehicles-cars', 'Color', 'Цвят', 'select', false, true, '["Black", "White", "Silver", "Gray", "Blue", "Red", "Green", "Brown", "Beige"]', '["Черен", "Бял", "Сребрист", "Сив", "Син", "Червен", "Зелен", "Кафяв", "Бежов"]', 8),
  ('vehicles-cars', 'Engine Size', 'Обем на двигателя', 'text', false, true, '[]', '[]', 9)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Motorcycles attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('vehicles-motorcycles', 'Make', 'Марка', 'select', true, true, '["Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Ducati", "Harley-Davidson", "KTM", "Triumph", "Aprilia"]', '["Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Ducati", "Harley-Davidson", "KTM", "Triumph", "Aprilia"]', 1),
  ('vehicles-motorcycles', 'Model', 'Модел', 'text', true, false, '[]', '[]', 2),
  ('vehicles-motorcycles', 'Year', 'Година', 'number', true, true, '[]', '[]', 3),
  ('vehicles-motorcycles', 'Mileage', 'Километраж', 'number', true, true, '[]', '[]', 4),
  ('vehicles-motorcycles', 'Engine Size', 'Обем на двигателя', 'select', true, true, '["Under 250cc", "250-500cc", "500-750cc", "750-1000cc", "Over 1000cc"]', '["Под 250cc", "250-500cc", "500-750cc", "750-1000cc", "Над 1000cc"]', 5),
  ('vehicles-motorcycles', 'Type', 'Тип', 'select', false, true, '["Sport", "Cruiser", "Touring", "Adventure", "Naked", "Scooter"]', '["Спорт", "Круизър", "Туринг", "Приключенски", "Голи", "Скутер"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
