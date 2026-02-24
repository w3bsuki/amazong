
-- =====================================================
-- AUTOMOTIVE: Enhanced subcategories + Attributes
-- =====================================================

-- Get the automotive parent ID
DO $$
DECLARE
  automotive_id UUID;
  cars_trucks_id UUID;
  motorcycles_id UUID;
  parts_id UUID;
BEGIN
  SELECT id INTO automotive_id FROM categories WHERE slug = 'automotive';
  
  -- Add more automotive subcategories
  INSERT INTO categories (id, name, name_bg, slug, parent_id) VALUES
    -- Vehicles
    (gen_random_uuid(), 'Cars & Trucks', 'Коли и камиони', 'cars-trucks', automotive_id),
    (gen_random_uuid(), 'Classic Cars', 'Класически автомобили', 'classic-cars', automotive_id),
    (gen_random_uuid(), 'Commercial Vehicles', 'Търговски превозни средства', 'commercial-vehicles', automotive_id),
    (gen_random_uuid(), 'ATVs & UTVs', 'АТВ-та и UTV-та', 'atvs-utvs', automotive_id),
    (gen_random_uuid(), 'Boats & Watercraft', 'Лодки и водни превозни средства', 'boats', automotive_id),
    (gen_random_uuid(), 'RVs & Campers', 'Каравани и кемпери', 'rvs-campers', automotive_id),
    (gen_random_uuid(), 'Trailers', 'Ремаркета', 'trailers', automotive_id),
    -- Parts & more
    (gen_random_uuid(), 'Engine & Drivetrain', 'Двигател и трансмисия', 'engine-drivetrain', automotive_id),
    (gen_random_uuid(), 'Interior Parts', 'Части за интериор', 'interior-parts', automotive_id),
    (gen_random_uuid(), 'Exterior Parts', 'Части за екстериор', 'exterior-parts', automotive_id),
    (gen_random_uuid(), 'Tools & Equipment', 'Инструменти и оборудване', 'auto-tools', automotive_id),
    (gen_random_uuid(), 'Oils & Fluids', 'Масла и течности', 'oils-fluids', automotive_id),
    (gen_random_uuid(), 'Safety & Security', 'Безопасност и сигурност', 'auto-safety', automotive_id)
  ON CONFLICT (slug) DO NOTHING;
  
  -- Get the cars-trucks subcategory ID for attributes
  SELECT id INTO cars_trucks_id FROM categories WHERE slug = 'cars-trucks';
  
  -- Add attributes for Cars & Trucks
  IF cars_trucks_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      -- Required fields
      (cars_trucks_id, 'Make', 'Марка', 'select', true, true, 
       '["Audi", "BMW", "Chevrolet", "Citroen", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Mazda", "Mercedes-Benz", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda", "Subaru", "Suzuki", "Toyota", "Volkswagen", "Volvo", "Other"]'::jsonb,
       '["Ауди", "БМВ", "Шевролет", "Ситроен", "Дачия", "Фиат", "Форд", "Хонда", "Хюндай", "Киа", "Мазда", "Мерцедес-Бенц", "Мицубиши", "Нисан", "Опел", "Пежо", "Рено", "Сеат", "Шкода", "Субару", "Сузуки", "Тойота", "Фолксваген", "Волво", "Друга"]'::jsonb,
       1),
      (cars_trucks_id, 'Model', 'Модел', 'text', true, true, '[]'::jsonb, '[]'::jsonb, 2),
      (cars_trucks_id, 'Year', 'Година', 'number', true, true, '[]'::jsonb, '[]'::jsonb, 3),
      (cars_trucks_id, 'Mileage', 'Километраж', 'number', true, true, '[]'::jsonb, '[]'::jsonb, 4),
      -- Important optional fields
      (cars_trucks_id, 'Fuel Type', 'Вид гориво', 'select', false, true,
       '["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG", "Other"]'::jsonb,
       '["Бензин", "Дизел", "Електрически", "Хибрид", "LPG", "CNG", "Друго"]'::jsonb,
       5),
      (cars_trucks_id, 'Transmission', 'Скоростна кутия', 'select', false, true,
       '["Manual", "Automatic", "Semi-automatic", "CVT"]'::jsonb,
       '["Ръчна", "Автоматична", "Полуавтоматична", "CVT"]'::jsonb,
       6),
      (cars_trucks_id, 'Engine Size', 'Обем на двигателя', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 7),
      (cars_trucks_id, 'Power (HP)', 'Мощност (к.с.)', 'number', false, true, '[]'::jsonb, '[]'::jsonb, 8),
      (cars_trucks_id, 'Body Type', 'Тип каросерия', 'select', false, true,
       '["Sedan", "Hatchback", "SUV", "Estate/Wagon", "Coupe", "Convertible", "Van", "Pickup", "Other"]'::jsonb,
       '["Седан", "Хечбек", "SUV", "Комби", "Купе", "Кабрио", "Ван", "Пикап", "Друго"]'::jsonb,
       9),
      (cars_trucks_id, 'Color', 'Цвят', 'select', false, true,
       '["Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Brown", "Beige", "Yellow", "Orange", "Other"]'::jsonb,
       '["Черен", "Бял", "Сребрист", "Сив", "Червен", "Син", "Зелен", "Кафяв", "Бежов", "Жълт", "Оранжев", "Друг"]'::jsonb,
       10),
      (cars_trucks_id, 'Doors', 'Брой врати', 'select', false, true,
       '["2", "3", "4", "5"]'::jsonb, '["2", "3", "4", "5"]'::jsonb,
       11),
      (cars_trucks_id, 'Drive Type', 'Задвижване', 'select', false, true,
       '["Front-wheel", "Rear-wheel", "4WD", "AWD"]'::jsonb,
       '["Предно", "Задно", "4x4", "AWD"]'::jsonb,
       12),
      (cars_trucks_id, 'VIN', 'VIN номер', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 13),
      (cars_trucks_id, 'Registration', 'Регистрация', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 14),
      (cars_trucks_id, 'Service History', 'Сервизна история', 'select', false, true,
       '["Full", "Partial", "None", "Unknown"]'::jsonb,
       '["Пълна", "Частична", "Няма", "Неизвестна"]'::jsonb,
       15),
      (cars_trucks_id, 'Number of Owners', 'Брой собственици', 'number', false, true, '[]'::jsonb, '[]'::jsonb, 16)
    ON CONFLICT (category_id, name) DO NOTHING;
  END IF;
  
  -- Get motorcycles ID
  SELECT id INTO motorcycles_id FROM categories WHERE slug = 'motorcycle';
  
  -- Add attributes for Motorcycles
  IF motorcycles_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (motorcycles_id, 'Make', 'Марка', 'select', true, true,
       '["BMW", "Ducati", "Harley-Davidson", "Honda", "Kawasaki", "KTM", "Suzuki", "Triumph", "Yamaha", "Other"]'::jsonb,
       '["БМВ", "Дукати", "Харли-Дейвидсън", "Хонда", "Кавазаки", "КТМ", "Сузуки", "Триумф", "Ямаха", "Друга"]'::jsonb,
       1),
      (motorcycles_id, 'Model', 'Модел', 'text', true, true, '[]'::jsonb, '[]'::jsonb, 2),
      (motorcycles_id, 'Year', 'Година', 'number', true, true, '[]'::jsonb, '[]'::jsonb, 3),
      (motorcycles_id, 'Mileage', 'Километраж', 'number', true, true, '[]'::jsonb, '[]'::jsonb, 4),
      (motorcycles_id, 'Engine Size (cc)', 'Обем (куб.см)', 'number', false, true, '[]'::jsonb, '[]'::jsonb, 5),
      (motorcycles_id, 'Type', 'Тип', 'select', false, true,
       '["Sport", "Cruiser", "Touring", "Naked", "Adventure", "Scooter", "Enduro", "Chopper", "Other"]'::jsonb,
       '["Спорт", "Круизър", "Туринг", "Нейкед", "Приключенски", "Скутер", "Ендуро", "Чопър", "Друг"]'::jsonb,
       6)
    ON CONFLICT (category_id, name) DO NOTHING;
  END IF;
  
END $$;
;
