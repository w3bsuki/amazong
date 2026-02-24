
-- ==============================================
-- JEWELRY & WATCHES - NEW GLOBAL ATTRIBUTES
-- Date: December 4, 2025
-- ==============================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
    -- Gender
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Gender', 'Пол', 'select', false, true,
     '["Women''s", "Men''s", "Unisex", "Children''s"]'::jsonb,
     '["Дамски", "Мъжки", "Унисекс", "Детски"]'::jsonb, 4),
     
    -- Condition
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Jewelry Condition', 'Състояние на бижуто', 'select', true, true,
     '["New with Tags", "New without Tags", "Like New", "Excellent", "Very Good", "Good", "Fair", "Vintage (Pre-Owned)", "Antique", "For Restoration"]'::jsonb,
     '["Ново с етикет", "Ново без етикет", "Като ново", "Отлично", "Много добро", "Добро", "Задоволително", "Винтидж (употребявано)", "Антично", "За реставрация"]'::jsonb, 5),
     
    -- Brand
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Jewelry Brand', 'Марка бижу', 'select', false, true,
     '["Tiffany & Co.", "Cartier", "Bulgari", "Van Cleef & Arpels", "Harry Winston", "Chopard", "Graff", "Piaget", "David Yurman", "Pandora", "Swarovski", "Alex and Ani", "Kendra Scott", "Thomas Sabo", "Georg Jensen", "Mikimoto", "Tacori", "John Hardy", "Roberto Coin", "Marco Bicego", "Lagos", "Ippolita", "Kate Spade", "Michael Kors", "Fossil", "No Brand/Handmade", "Other"]'::jsonb,
     '["Тифани и Ко", "Картие", "Булгари", "Ван Клиф и Арпелс", "Хари Уинстън", "Шопар", "Граф", "Пиаже", "Дейвид Юрман", "Пандора", "Сваровски", "Алекс и Ани", "Кендра Скот", "Томас Сабо", "Георг Йенсен", "Микимото", "Такори", "Джон Харди", "Роберто Коин", "Марко Бичего", "Лагос", "Иполита", "Кейт Спейд", "Майкъл Корс", "Фосил", "Без марка/Ръчна изработка", "Друго"]'::jsonb, 6),
     
    -- Style
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Style', 'Стил', 'select', false, true,
     '["Classic", "Modern", "Vintage", "Bohemian", "Minimalist", "Statement", "Art Deco", "Victorian", "Edwardian", "Art Nouveau", "Contemporary", "Retro", "Gothic", "Religious", "Ethnic/Cultural", "Romantic", "Industrial", "Nature-Inspired"]'::jsonb,
     '["Класически", "Модерен", "Винтидж", "Бохо", "Минималистичен", "Изявен", "Арт деко", "Викториански", "Едуардиански", "Арт нуво", "Съвременен", "Ретро", "Готически", "Религиозен", "Етнически", "Романтичен", "Индустриален", "Природен"]'::jsonb, 7),
     
    -- Certification
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Certification', 'Сертификация', 'select', false, true,
     '["GIA (Gemological Institute of America)", "AGS (American Gem Society)", "IGI (International Gemological Institute)", "EGL (European Gemological Laboratory)", "HRD Antwerp", "GSI (Gemological Science International)", "GCAL", "No Certification", "Other"]'::jsonb,
     '["GIA", "AGS", "IGI", "EGL", "HRD Антверпен", "GSI", "GCAL", "Без сертификат", "Друго"]'::jsonb, 8),
     
    -- Country of Origin
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Country of Origin', 'Страна на произход', 'select', false, true,
     '["Italy", "USA", "India", "France", "Switzerland", "UK", "Germany", "Turkey", "Thailand", "China", "Japan", "Bulgaria", "Israel", "Belgium", "South Africa", "Brazil", "Colombia", "Myanmar", "Sri Lanka", "Unknown", "Other"]'::jsonb,
     '["Италия", "САЩ", "Индия", "Франция", "Швейцария", "Великобритания", "Германия", "Турция", "Тайланд", "Китай", "Япония", "България", "Израел", "Белгия", "Южна Африка", "Бразилия", "Колумбия", "Мианмар", "Шри Ланка", "Неизвестна", "Друга"]'::jsonb, 9),
     
    -- Handmade
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Handmade', 'Ръчна изработка', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 10),
    
    -- Hallmarked
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Hallmarked', 'С клеймо', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 11),
    
    -- Original Box
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Original Box', 'Оригинална кутия', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 12),
    
    -- Original Papers
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Original Papers', 'Оригинален сертификат', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 13),
    
    -- Metal Weight
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Metal Weight (grams)', 'Тегло на метала (грамове)', 'number', false, false, '[]'::jsonb, '[]'::jsonb, 14);
;
