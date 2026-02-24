
-- Add attributes for Cameras parent category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Camera Type', 'Тип камера', 'select', true, true,
   '["DSLR", "Mirrorless", "Compact/Point & Shoot", "Action Camera", "Instant Camera", "Film Camera", "Video Camera", "360° Camera"]',
   '["DSLR", "Безогледална", "Компактна", "Екшън камера", "Инстант камера", "Филмова камера", "Видеокамера", "360° камера"]',
   1),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Sensor Size', 'Размер на сензора', 'select', false, true,
   '["Full Frame (35mm)", "APS-C", "Micro Four Thirds", "1-inch", "1/2.3-inch", "Medium Format"]',
   '["Пълен кадър (35мм)", "APS-C", "Micro Four Thirds", "1 инч", "1/2.3 инч", "Среден формат"]',
   2),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Megapixels', 'Мегапиксели', 'select', false, true,
   '["Under 12MP", "12-20MP", "20-30MP", "30-45MP", "45-60MP", "60MP+"]',
   '["Под 12MP", "12-20MP", "20-30MP", "30-45MP", "45-60MP", "Над 60MP"]',
   3),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Video Resolution', 'Видео резолюция', 'select', false, true,
   '["1080p FHD", "4K UHD", "4K 60fps", "6K", "8K", "No Video"]',
   '["1080p FHD", "4K UHD", "4K 60fps", "6K", "8K", "Без видео"]',
   4),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Lens Mount', 'Байонет', 'select', false, true,
   '["Canon EF/EF-S", "Canon RF", "Nikon F", "Nikon Z", "Sony E/FE", "Fujifilm X", "Micro Four Thirds", "Leica L/M", "Fixed Lens", "Other"]',
   '["Canon EF/EF-S", "Canon RF", "Nikon F", "Nikon Z", "Sony E/FE", "Fujifilm X", "Micro Four Thirds", "Leica L/M", "Вграден обектив", "Друг"]',
   5),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Brand', 'Марка', 'select', true, true,
   '["Canon", "Sony", "Nikon", "Fujifilm", "Panasonic", "Olympus", "Leica", "GoPro", "DJI", "Insta360", "Other"]',
   '["Canon", "Sony", "Nikon", "Fujifilm", "Panasonic", "Olympus", "Leica", "GoPro", "DJI", "Insta360", "Друга"]',
   6),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Kit Contents', 'Комплект включва', 'multiselect', false, false,
   '["Body Only", "Kit Lens", "Extra Lens", "Battery", "Memory Card", "Bag/Case", "Tripod", "Original Box"]',
   '["Само тяло", "Кит обектив", "Допълнителен обектив", "Батерия", "Карта памет", "Чанта/Калъф", "Статив", "Оригинална кутия"]',
   7),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]',
   8),
  
  ('a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 'Shutter Count', 'Брой кадри', 'select', false, true,
   '["Under 5,000", "5,000-15,000", "15,000-50,000", "50,000-100,000", "100,000+", "Unknown"]',
   '["Под 5 000", "5 000-15 000", "15 000-50 000", "50 000-100 000", "Над 100 000", "Неизвестен"]',
   9);

-- Add attributes for Camera Lenses
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Lens Type', 'Тип обектив', 'select', true, true,
   '["Wide Angle", "Standard/Kit", "Portrait/Prime", "Telephoto", "Zoom", "Macro", "Fisheye", "Specialty"]',
   '["Широкоъгълен", "Стандартен/Кит", "Портретен/Прайм", "Телеобектив", "Зуум", "Макро", "Фишай", "Специализиран"]',
   1),
  
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Focal Length', 'Фокусно разстояние', 'select', false, true,
   '["Under 24mm", "24-35mm", "35-50mm", "50-85mm", "85-135mm", "135-200mm", "200mm+", "Variable Zoom"]',
   '["Под 24мм", "24-35мм", "35-50мм", "50-85мм", "85-135мм", "135-200мм", "Над 200мм", "Променлив зуум"]',
   2),
  
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Max Aperture', 'Максимална бленда', 'select', false, true,
   '["f/1.2", "f/1.4", "f/1.8", "f/2.0", "f/2.8", "f/3.5-5.6", "f/4.0", "f/4.5-6.3"]',
   '["f/1.2", "f/1.4", "f/1.8", "f/2.0", "f/2.8", "f/3.5-5.6", "f/4.0", "f/4.5-6.3"]',
   3),
  
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Lens Mount', 'Байонет', 'select', true, true,
   '["Canon EF/EF-S", "Canon RF", "Nikon F", "Nikon Z", "Sony A/E/FE", "Fujifilm X", "Micro Four Thirds", "Leica L/M", "Sigma", "Tamron", "Other"]',
   '["Canon EF/EF-S", "Canon RF", "Nikon F", "Nikon Z", "Sony A/E/FE", "Fujifilm X", "Micro Four Thirds", "Leica L/M", "Sigma", "Tamron", "Друг"]',
   4),
  
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Image Stabilization', 'Стабилизация', 'boolean', false, true, '[]', '[]', 5),
  
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Autofocus', 'Автофокус', 'boolean', false, true, '[]', '[]', 6),
  
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Brand', 'Марка', 'select', true, true,
   '["Canon", "Sony", "Nikon", "Fujifilm", "Sigma", "Tamron", "Samyang/Rokinon", "Tokina", "Zeiss", "Other"]',
   '["Canon", "Sony", "Nikon", "Fujifilm", "Sigma", "Tamron", "Samyang/Rokinon", "Tokina", "Zeiss", "Друга"]',
   7),
  
  ('d3bcc3ee-551e-4128-b686-443b314c5a25', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]',
   8);

-- Add attributes for Action Cameras
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('4ba5efda-df06-4892-953a-7674224d4323', 'Max Video Resolution', 'Макс. видео резолюция', 'select', true, true,
   '["1080p 60fps", "2.7K", "4K 30fps", "4K 60fps", "4K 120fps", "5.3K", "8K"]',
   '["1080p 60fps", "2.7K", "4K 30fps", "4K 60fps", "4K 120fps", "5.3K", "8K"]',
   1),
  
  ('4ba5efda-df06-4892-953a-7674224d4323', 'Stabilization', 'Стабилизация', 'select', false, true,
   '["None", "Electronic", "HyperSmooth/RockSteady", "360° Stabilization"]',
   '["Без", "Електронна", "HyperSmooth/RockSteady", "360° стабилизация"]',
   2),
  
  ('4ba5efda-df06-4892-953a-7674224d4323', 'Waterproof', 'Водоустойчивост', 'select', false, true,
   '["Not Waterproof", "With Housing Only", "5m (16ft)", "10m (33ft)", "33m (100ft)+"]',
   '["Не е водоустойчива", "Само с кутия", "5м (16ft)", "10м (33ft)", "33м+ (100ft+)"]',
   3),
  
  ('4ba5efda-df06-4892-953a-7674224d4323', 'Screen', 'Екран', 'select', false, true,
   '["Front + Rear", "Rear Only", "No Screen", "Touch Screen"]',
   '["Преден + заден", "Само заден", "Без екран", "Тъч екран"]',
   4),
  
  ('4ba5efda-df06-4892-953a-7674224d4323', 'Brand', 'Марка', 'select', true, true,
   '["GoPro", "DJI", "Insta360", "Sony", "Akaso", "Other"]',
   '["GoPro", "DJI", "Insta360", "Sony", "Akaso", "Друга"]',
   5);
;
