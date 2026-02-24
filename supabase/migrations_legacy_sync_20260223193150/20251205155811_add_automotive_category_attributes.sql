
-- Add filterable attributes for Automotive category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, is_required, options, options_bg, sort_order)
VALUES
  -- Vehicle Make/Brand
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Vehicle Make', 'Марка', 'select', true, false, 
   '["Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Honda", "Ford", "Opel", "Peugeot", "Renault", "Skoda", "Hyundai", "Kia", "Nissan", "Mazda", "Volvo", "Fiat", "Seat", "Citroen", "Dacia", "Other"]'::jsonb,
   '["Ауди", "БМВ", "Мерцедес-Бенц", "Фолксваген", "Тойота", "Хонда", "Форд", "Опел", "Пежо", "Рено", "Шкода", "Хюндай", "Киа", "Нисан", "Мазда", "Волво", "Фиат", "Сеат", "Ситроен", "Дачия", "Друга"]'::jsonb,
   1),
  
  -- Part Condition
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Condition', 'Състояние', 'select', true, false,
   '["New", "New OEM", "New Aftermarket", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair", "For Parts"]'::jsonb,
   '["Ново", "Ново OEM", "Ново Aftermarket", "Рефърбиширано", "Употребявано - като ново", "Употребявано - добро", "Употребявано - задоволително", "За части"]'::jsonb,
   2),

  -- Part Type
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Part Type', 'Тип част', 'select', true, false,
   '["Engine Parts", "Transmission", "Brakes", "Suspension", "Electrical", "Body Parts", "Interior", "Exhaust", "Cooling", "Fuel System", "Steering", "Wheels & Tires", "Lighting", "Filters", "Belts & Hoses", "Other"]'::jsonb,
   '["Двигателни части", "Трансмисия", "Спирачки", "Окачване", "Електрическа система", "Каросерия", "Интериор", "Ауспух", "Охлаждане", "Горивна система", "Кормилна система", "Джанти и гуми", "Осветление", "Филтри", "Ремъци и маркучи", "Друго"]'::jsonb,
   3),

  -- Fuel Type
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Fuel Type', 'Гориво', 'select', true, false,
   '["Petrol/Gasoline", "Diesel", "Hybrid", "Electric", "LPG", "CNG", "Universal"]'::jsonb,
   '["Бензин", "Дизел", "Хибрид", "Електрически", "LPG/Газ", "Метан", "Универсално"]'::jsonb,
   4),

  -- Year Range
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Year Range', 'Година', 'select', true, false,
   '["2020-2025", "2015-2019", "2010-2014", "2005-2009", "2000-2004", "1995-1999", "1990-1994", "Before 1990", "Universal"]'::jsonb,
   '["2020-2025", "2015-2019", "2010-2014", "2005-2009", "2000-2004", "1995-1999", "1990-1994", "Преди 1990", "Универсално"]'::jsonb,
   5),

  -- OEM vs Aftermarket
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Part Origin', 'Произход', 'select', true, false,
   '["OEM (Original)", "Aftermarket", "Performance/Tuning", "Used/Salvage"]'::jsonb,
   '["OEM (Оригинал)", "Aftermarket", "Тунинг/Performance", "Употребяван/Разбор"]'::jsonb,
   6),

  -- Warranty
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Warranty', 'Гаранция', 'select', true, false,
   '["No Warranty", "30 Days", "90 Days", "6 Months", "1 Year", "2 Years", "Lifetime"]'::jsonb,
   '["Без гаранция", "30 дни", "90 дни", "6 месеца", "1 година", "2 години", "Доживотна"]'::jsonb,
   7),

  -- Fits Vehicle Type
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Vehicle Type', 'Тип превозно средство', 'multiselect', true, false,
   '["Car/Sedan", "SUV/Crossover", "Truck/Pickup", "Van/Minivan", "Motorcycle", "ATV/Quad", "Commercial Vehicle", "Agricultural", "Universal"]'::jsonb,
   '["Лек автомобил", "Джип/Кросоувър", "Пикап", "Ван/Миниван", "Мотоциклет", "ATV/Четириколка", "Товарен автомобил", "Селскостопански", "Универсално"]'::jsonb,
   8),

  -- Brand (Parts Brand)
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Parts Brand', 'Марка на частта', 'select', true, false,
   '["Bosch", "Denso", "Continental", "Valeo", "NGK", "Brembo", "Monroe", "Sachs", "SKF", "Mann Filter", "Mahle", "Febi Bilstein", "TRW", "Delphi", "Gates", "Other"]'::jsonb,
   '["Bosch", "Denso", "Continental", "Valeo", "NGK", "Brembo", "Monroe", "Sachs", "SKF", "Mann Filter", "Mahle", "Febi Bilstein", "TRW", "Delphi", "Gates", "Друга"]'::jsonb,
   9),

  -- Location/Side
  ('ae1c527f-1293-4032-a108-ec2a0252f2e0', 'Position', 'Позиция', 'select', true, false,
   '["Front", "Rear", "Left", "Right", "Front Left", "Front Right", "Rear Left", "Rear Right", "Universal", "N/A"]'::jsonb,
   '["Преден", "Заден", "Ляв", "Десен", "Преден ляв", "Преден десен", "Заден ляв", "Заден десен", "Универсална", "Не е приложимо"]'::jsonb,
   10);
;
