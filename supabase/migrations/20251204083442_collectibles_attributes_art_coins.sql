
-- =====================================================
-- ART & COINS Attributes
-- =====================================================
DO $$ 
DECLARE
  art_id UUID;
  coins_id UUID;
BEGIN
  SELECT id INTO art_id FROM categories WHERE slug = 'art';
  SELECT id INTO coins_id FROM categories WHERE slug = 'coins-currency';
  
  -- Art specific attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (art_id, 'Art Medium', 'Техника', 'select', false, true,
     '["Oil on Canvas", "Acrylic", "Watercolor", "Pastel", "Ink", "Charcoal", "Pencil", "Digital", "Mixed Media", "Gouache", "Tempera", "Fresco", "Encaustic", "Other"]'::jsonb,
     '["Маслени бои върху платно", "Акрил", "Акварел", "Пастел", "Туш", "Въглен", "Молив", "Дигитална", "Смесена техника", "Гваш", "Темпера", "Фреска", "Енкаустика", "Друга"]'::jsonb, 1),
    (art_id, 'Art Style', 'Стил', 'select', false, true,
     '["Abstract", "Contemporary", "Modern", "Impressionist", "Expressionist", "Realist", "Surrealist", "Pop Art", "Minimalist", "Folk Art", "Naive", "Photorealist", "Street Art", "Traditional", "Other"]'::jsonb,
     '["Абстрактен", "Съвременен", "Модерен", "Импресионизъм", "Експресионизъм", "Реализъм", "Сюрреализъм", "Поп арт", "Минимализъм", "Народно изкуство", "Наивен", "Фотореализъм", "Улично изкуство", "Традиционен", "Друг"]'::jsonb, 2),
    (art_id, 'Art Subject', 'Тема', 'multiselect', false, true,
     '["Portrait", "Landscape", "Still Life", "Abstract", "Figurative", "Animals", "Nature", "Architecture", "Religious", "Historical", "Fantasy", "Nude", "Marine", "Cityscape", "Other"]'::jsonb,
     '["Портрет", "Пейзаж", "Натюрморт", "Абстракция", "Фигуративно", "Животни", "Природа", "Архитектура", "Религиозно", "Историческо", "Фентъзи", "Голо тяло", "Морско", "Градски пейзаж", "Друго"]'::jsonb, 3),
    (art_id, 'Surface', 'Повърхност', 'select', false, true,
     '["Canvas", "Paper", "Board", "Panel", "Glass", "Metal", "Wood", "Fabric", "Digital", "Other"]'::jsonb,
     '["Платно", "Хартия", "Картон", "Панел", "Стъкло", "Метал", "Дърво", "Текстил", "Дигитална", "Друга"]'::jsonb, 4),
    (art_id, 'Framed', 'Рамкирано', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (art_id, 'Frame Included', 'Рамка включена', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6),
    (art_id, 'Artist', 'Художник', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 7),
    (art_id, 'Art Dimensions', 'Размери', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 8),
    (art_id, 'Edition Size', 'Тираж', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 9),
    (art_id, 'Edition Number', 'Номер от тиража', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 10),
    (art_id, 'Certificate of Authenticity', 'Сертификат за автентичност', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 11)
  ON CONFLICT DO NOTHING;
  
  -- Coins & Currency specific attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (coins_id, 'Coin Type', 'Тип монета', 'select', false, true,
     '["Bullion", "Numismatic", "Commemorative", "Circulation", "Proof", "Ancient", "Medieval", "Modern", "Error Coin", "Pattern"]'::jsonb,
     '["Кюлче", "Нумизматична", "Възпоменателна", "Циркулационна", "Proof", "Антична", "Средновековна", "Модерна", "Грешка", "Образец"]'::jsonb, 1),
    (coins_id, 'Coin Metal', 'Метал', 'select', false, true,
     '["Gold", "Silver", "Platinum", "Palladium", "Copper", "Bronze", "Nickel", "Zinc", "Aluminum", "Bimetallic", "Other"]'::jsonb,
     '["Злато", "Сребро", "Платина", "Паладий", "Мед", "Бронз", "Никел", "Цинк", "Алуминий", "Биметална", "Друг"]'::jsonb, 2),
    (coins_id, 'Coin Grade', 'Състояние/Оценка', 'select', false, true,
     '["MS/PR 70", "MS/PR 69", "MS/PR 68", "MS/PR 67", "MS/PR 65", "MS/PR 63", "MS/PR 60", "AU 58", "AU 55", "AU 50", "XF/EF 45", "XF/EF 40", "VF 35", "VF 30", "VF 25", "VF 20", "F 15", "F 12", "VG 10", "VG 8", "G 6", "G 4", "AG 3", "FR 2", "PO 1", "Ungraded"]'::jsonb,
     '["MS/PR 70", "MS/PR 69", "MS/PR 68", "MS/PR 67", "MS/PR 65", "MS/PR 63", "MS/PR 60", "AU 58", "AU 55", "AU 50", "XF/EF 45", "XF/EF 40", "VF 35", "VF 30", "VF 25", "VF 20", "F 15", "F 12", "VG 10", "VG 8", "G 6", "G 4", "AG 3", "FR 2", "PO 1", "Неоценена"]'::jsonb, 3),
    (coins_id, 'Grading Service', 'Служба за оценка', 'select', false, true,
     '["PCGS", "NGC", "ANACS", "ICG", "CACG", "Other", "None"]'::jsonb,
     '["PCGS", "NGC", "ANACS", "ICG", "CACG", "Друга", "Няма"]'::jsonb, 4),
    (coins_id, 'Coin Year', 'Година', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (coins_id, 'Coin Country', 'Държава', 'select', false, true,
     '["USA", "Canada", "UK", "Germany", "France", "Australia", "China", "South Africa", "Austria", "Mexico", "Bulgaria", "Ancient Roman", "Ancient Greek", "Byzantine", "Other"]'::jsonb,
     '["САЩ", "Канада", "Великобритания", "Германия", "Франция", "Австралия", "Китай", "Южна Африка", "Австрия", "Мексико", "България", "Римска", "Гръцка", "Византийска", "Друга"]'::jsonb, 6),
    (coins_id, 'Denomination', 'Номинал', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 7),
    (coins_id, 'Coin Weight', 'Тегло', 'select', false, true,
     '["1/10 oz", "1/4 oz", "1/2 oz", "1 oz", "2 oz", "5 oz", "10 oz", "1 kg", "Other"]'::jsonb,
     '["1/10 унция", "1/4 унция", "1/2 унция", "1 унция", "2 унции", "5 унции", "10 унции", "1 кг", "Друго"]'::jsonb, 8),
    (coins_id, 'Coin Fineness', 'Проба', 'select', false, true,
     '[".999", ".9999", ".925 (Sterling)", ".900", ".835", ".800", ".750", ".585", ".500", "Other"]'::jsonb,
     '[".999", ".9999", ".925 (Стерлингово)", ".900", ".835", ".800", ".750", ".585", ".500", "Друга"]'::jsonb, 9),
    (coins_id, 'Mintage', 'Тираж', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 10),
    (coins_id, 'Mint Mark', 'Мент марка', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 11)
  ON CONFLICT DO NOTHING;
END $$;
;
