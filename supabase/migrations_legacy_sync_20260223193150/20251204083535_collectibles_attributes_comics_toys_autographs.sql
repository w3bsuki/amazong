
-- =====================================================
-- COMICS, TOYS, AUTOGRAPHS Attributes
-- =====================================================
DO $$ 
DECLARE
  comics_id UUID;
  toys_id UUID;
  autographs_id UUID;
  militaria_id UUID;
BEGIN
  SELECT id INTO comics_id FROM categories WHERE slug = 'coll-comics';
  SELECT id INTO toys_id FROM categories WHERE slug = 'coll-toys';
  SELECT id INTO autographs_id FROM categories WHERE slug = 'coll-autographs';
  SELECT id INTO militaria_id FROM categories WHERE slug = 'coll-militaria';
  
  -- Comics attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (comics_id, 'Publisher', 'Издателство', 'select', false, true,
     '["Marvel", "DC Comics", "Image Comics", "Dark Horse", "IDW", "Boom! Studios", "Valiant", "Dynamite", "Viz Media", "Kodansha", "Shueisha", "Other"]'::jsonb,
     '["Marvel", "DC Comics", "Image Comics", "Dark Horse", "IDW", "Boom! Studios", "Valiant", "Dynamite", "Viz Media", "Kodansha", "Shueisha", "Друго"]'::jsonb, 1),
    (comics_id, 'Comic Era', 'Ера', 'select', false, true,
     '["Golden Age (1938-1956)", "Silver Age (1956-1970)", "Bronze Age (1970-1985)", "Copper Age (1985-1991)", "Modern Age (1991-Present)", "Platinum Age (Pre-1938)"]'::jsonb,
     '["Златна ера (1938-1956)", "Сребърна ера (1956-1970)", "Бронзова ера (1970-1985)", "Медна ера (1985-1991)", "Модерна ера (1991-Сега)", "Платинена ера (Преди 1938)"]'::jsonb, 2),
    (comics_id, 'Comic Grade', 'Оценка', 'select', false, true,
     '["CGC 10.0 (Gem Mint)", "CGC 9.8 (Near Mint/Mint)", "CGC 9.6 (Near Mint+)", "CGC 9.4 (Near Mint)", "CGC 9.2 (Near Mint-)", "CGC 9.0 (Very Fine/Near Mint)", "CGC 8.5 (Very Fine+)", "CGC 8.0 (Very Fine)", "CGC 7.5-7.0 (Fine/Very Fine)", "CGC 6.5-6.0 (Fine+/Fine)", "CGC 5.5-5.0 (Fine-)", "CGC 4.0 or lower", "CBCS Graded", "Not Graded"]'::jsonb,
     '["CGC 10.0 (Безупречна)", "CGC 9.8 (Почти перфектна)", "CGC 9.6 (Много добра+)", "CGC 9.4 (Много добра)", "CGC 9.2 (Много добра-)", "CGC 9.0 (Добра/Много добра)", "CGC 8.5 (Добра+)", "CGC 8.0 (Добра)", "CGC 7.5-7.0 (Средна/Добра)", "CGC 6.5-6.0 (Средна+/Средна)", "CGC 5.5-5.0 (Средна-)", "CGC 4.0 или по-ниско", "CBCS оценена", "Неоценена"]'::jsonb, 3),
    (comics_id, 'Key Issue', 'Ключово издание', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
    (comics_id, 'First Appearance', 'Първа поява', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (comics_id, 'Variant Cover', 'Вариантна корица', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6),
    (comics_id, 'Signed', 'Подписано', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 7),
    (comics_id, 'Issue Number', 'Брой номер', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 8)
  ON CONFLICT DO NOTHING;
  
  -- Collectible Toys attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (toys_id, 'Toy Brand', 'Марка', 'select', false, true,
     '["Hasbro", "Mattel", "LEGO", "Funko", "Hot Wheels", "NECA", "McFarlane", "Bandai", "Good Smile", "Kotobukiya", "Sideshow", "Hot Toys", "Mezco", "Super7", "Other"]'::jsonb,
     '["Hasbro", "Mattel", "LEGO", "Funko", "Hot Wheels", "NECA", "McFarlane", "Bandai", "Good Smile", "Kotobukiya", "Sideshow", "Hot Toys", "Mezco", "Super7", "Друга"]'::jsonb, 1),
    (toys_id, 'Toy Line/Franchise', 'Серия/Франчайз', 'select', false, true,
     '["Star Wars", "Marvel", "DC", "Transformers", "G.I. Joe", "Masters of the Universe", "Teenage Mutant Ninja Turtles", "Power Rangers", "Pokémon", "Dragon Ball", "One Piece", "Naruto", "Gundam", "Disney", "WWE", "Other"]'::jsonb,
     '["Star Wars", "Marvel", "DC", "Transformers", "G.I. Joe", "Masters of the Universe", "Костенурките Нинджа", "Power Rangers", "Pokémon", "Dragon Ball", "One Piece", "Naruto", "Gundam", "Disney", "WWE", "Друга"]'::jsonb, 2),
    (toys_id, 'Toy Type', 'Тип', 'select', false, true,
     '["Action Figure", "Statue", "Bust", "Funko Pop", "Model Kit", "Diecast", "Plush", "Doll", "Vehicle", "Playset", "Accessory"]'::jsonb,
     '["Екшън фигурка", "Статуя", "Бюст", "Funko Pop", "Модел за сглобяване", "Метален", "Плюшен", "Кукла", "Превозно средство", "Плейсет", "Аксесоар"]'::jsonb, 3),
    (toys_id, 'Toy Scale', 'Мащаб', 'select', false, true,
     '["1:6 (12 inch)", "1:10", "1:12 (6 inch)", "1:18 (3.75 inch)", "1:24", "1:32", "1:43", "1:64", "Other"]'::jsonb,
     '["1:6 (12 инча)", "1:10", "1:12 (6 инча)", "1:18 (3.75 инча)", "1:24", "1:32", "1:43", "1:64", "Друг"]'::jsonb, 4),
    (toys_id, 'Toy Condition', 'Състояние', 'select', false, true,
     '["Mint in Sealed Box (MISB)", "Mint in Box (MIB)", "Mint on Card (MOC)", "Near Mint", "Complete Loose", "Incomplete Loose", "For Parts/Display"]'::jsonb,
     '["Запечатана кутия (MISB)", "В кутия (MIB)", "На картон (MOC)", "Почти нова", "Пълна без кутия", "Непълна без кутия", "За части/Дисплей"]'::jsonb, 5),
    (toys_id, 'Original Packaging', 'Оригинална опаковка', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6),
    (toys_id, 'Limited Edition', 'Лимитирано издание', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 7),
    (toys_id, 'Exclusive', 'Ексклузивен', 'select', false, true,
     '["Not Exclusive", "Convention Exclusive", "Store Exclusive", "Chase/Variant", "Online Exclusive", "Regional Exclusive"]'::jsonb,
     '["Не е ексклузивен", "Конвенционен ексклузив", "Магазинен ексклузив", "Chase/Вариант", "Онлайн ексклузив", "Регионален ексклузив"]'::jsonb, 8),
    (toys_id, 'Year Released', 'Година на издаване', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 9)
  ON CONFLICT DO NOTHING;
  
  -- Autographs attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (autographs_id, 'Autograph Category', 'Категория', 'select', false, true,
     '["Sports", "Music", "Movies/TV", "Historical", "Political", "Literary", "Science", "Art", "Other"]'::jsonb,
     '["Спорт", "Музика", "Филми/ТВ", "Исторически", "Политика", "Литература", "Наука", "Изкуство", "Друго"]'::jsonb, 1),
    (autographs_id, 'Item Type', 'Тип предмет', 'select', false, true,
     '["Photo", "Card", "Ball", "Jersey/Shirt", "Bat/Stick", "Helmet", "Poster", "Book", "Album/CD", "Script", "Document", "Artwork", "Equipment", "Other"]'::jsonb,
     '["Снимка", "Карта", "Топка", "Фланелка", "Бухалка/Стик", "Каска", "Постер", "Книга", "Албум/CD", "Сценарий", "Документ", "Произведение", "Оборудване", "Друго"]'::jsonb, 2),
    (autographs_id, 'Authentication', 'Автентикация', 'select', false, true,
     '["PSA/DNA", "JSA", "Beckett", "SGC", "ACOA", "Fanatics", "Upper Deck", "MLB Hologram", "NBA Hologram", "In-Person Witnessed", "Private COA", "None"]'::jsonb,
     '["PSA/DNA", "JSA", "Beckett", "SGC", "ACOA", "Fanatics", "Upper Deck", "MLB Hologram", "NBA Hologram", "Лично свидетелство", "Частен сертификат", "Няма"]'::jsonb, 3),
    (autographs_id, 'Inscription', 'Надпис', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
    (autographs_id, 'Personalized', 'Персонализирано', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (autographs_id, 'Photo Size', 'Размер на снимката', 'select', false, true,
     '["8x10", "11x14", "16x20", "4x6", "5x7", "Other"]'::jsonb,
     '["8x10", "11x14", "16x20", "4x6", "5x7", "Друг"]'::jsonb, 6)
  ON CONFLICT DO NOTHING;
  
  -- Militaria attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (militaria_id, 'Military Era', 'Военна ера', 'select', false, true,
     '["Pre-WWI", "WWI (1914-1918)", "Interwar (1918-1939)", "WWII (1939-1945)", "Korean War", "Vietnam War", "Cold War", "Modern (Post-1991)", "Other"]'::jsonb,
     '["Преди ПСВ", "ПСВ (1914-1918)", "Междувоенен период (1918-1939)", "ВСВ (1939-1945)", "Корейска война", "Виетнамска война", "Студена война", "Модерна (След 1991)", "Друга"]'::jsonb, 1),
    (militaria_id, 'Military Country', 'Държава', 'select', false, true,
     '["USA", "UK", "Germany", "France", "Russia/USSR", "Japan", "Italy", "Bulgaria", "Ottoman Empire", "Austria-Hungary", "Other Allied", "Other Axis", "Other"]'::jsonb,
     '["САЩ", "Великобритания", "Германия", "Франция", "Русия/СССР", "Япония", "Италия", "България", "Османска империя", "Австро-Унгария", "Друга съюзническа", "Друга от Оста", "Друга"]'::jsonb, 2),
    (militaria_id, 'Military Branch', 'Военен клон', 'select', false, true,
     '["Army", "Navy", "Air Force", "Marines", "Special Forces", "Cavalry", "Artillery", "Infantry", "Other"]'::jsonb,
     '["Армия", "Флот", "ВВС", "Морска пехота", "Специални сили", "Кавалерия", "Артилерия", "Пехота", "Друг"]'::jsonb, 3),
    (militaria_id, 'Item Category', 'Категория', 'select', false, true,
     '["Medal/Badge", "Uniform", "Helmet", "Weapon (Deactivated)", "Document", "Photo", "Equipment", "Flag/Patch", "Map", "Other"]'::jsonb,
     '["Медал/Значка", "Униформа", "Каска", "Оръжие (Деактивирано)", "Документ", "Снимка", "Оборудване", "Знаме/Нашивка", "Карта", "Друго"]'::jsonb, 4),
    (militaria_id, 'Deactivated', 'Деактивирано', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5)
  ON CONFLICT DO NOTHING;
END $$;
;
