
-- ==============================================
-- JEWELRY & WATCHES - EARRING & VINTAGE/ESTATE ATTRIBUTES
-- Date: December 4, 2025
-- ==============================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
    -- Earring Style
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Earring Style', 'Стил на обеците', 'select', false, true,
     '["Stud", "Hoop", "Drop/Dangle", "Chandelier", "Huggie", "Climber/Crawler", "Threader", "Halo", "Cluster", "Jacket", "Cuff", "Cartilage/Helix", "Tragus", "Industrial Bar", "Clip-On", "Screw Back", "Other"]'::jsonb,
     '["Кабошон", "Халки", "Висящи", "Полилей", "Хъги", "Катерачки", "Конец", "Хало", "Клъстер", "Жакет", "Маншет", "Хрущял/Хеликс", "Трагус", "Индустриална щанга", "Клипс", "С винт", "Друг"]'::jsonb, 46),
     
    -- Earring Back Type
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Earring Back Type', 'Тип закопчалка на обеците', 'select', false, true,
     '["Push Back/Butterfly", "Screw Back", "Lever Back", "Latch Back", "French Wire/Hook", "Hinged", "Clip-On", "Omega Back", "La Pousette", "Other"]'::jsonb,
     '["Пеперуда", "Винтов", "Лост", "Панта", "Френска кука", "С панта", "Клипс", "Омега", "Ла Пусет", "Друга"]'::jsonb, 47),
     
    -- Hoop Diameter
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Hoop Diameter', 'Диаметър на халката', 'select', false, true,
     '["Under 10mm Mini", "10-15mm Small", "15-20mm Medium", "20-30mm Large", "30-50mm X-Large", "50mm+ Statement"]'::jsonb,
     '["Под 10мм Мини", "10-15мм Малки", "15-20мм Средни", "20-30мм Големи", "30-50мм Много големи", "50мм+ Изявени"]'::jsonb, 48),
     
    -- Era/Period (Vintage)
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Era/Period', 'Ера/Период', 'select', false, true,
     '["Georgian (Pre-1837)", "Victorian (1837-1901)", "Edwardian (1901-1915)", "Art Nouveau (1890-1910)", "Art Deco (1920-1935)", "Retro/Mid-Century (1935-1950)", "Post-War (1950-1970)", "Vintage (1970-2000)", "Modern/Contemporary", "Unknown/Undated"]'::jsonb,
     '["Георгианска (преди 1837)", "Викторианска (1837-1901)", "Едуардианска (1901-1915)", "Арт нуво (1890-1910)", "Арт деко (1920-1935)", "Ретро/Средата на века (1935-1950)", "Следвоенна (1950-1970)", "Винтидж (1970-2000)", "Модерна/Съвременна", "Неизвестна/Без дата"]'::jsonb, 50),
     
    -- Signed/Maker
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Signed/Maker', 'Подписано/Производител', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 51),
     
    -- Provenance Documentation
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Provenance Documentation', 'Документация за произход', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 52),
     
    -- Pearl Type
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Pearl Type', 'Тип перла', 'select', false, true,
     '["Akoya", "South Sea White", "South Sea Golden", "Tahitian", "Freshwater", "Keshi", "Baroque", "Mabe", "Seed Pearl", "Cultured", "Natural", "Simulated/Faux", "Other"]'::jsonb,
     '["Акоя", "Южноморска бяла", "Южноморска златиста", "Таитянска", "Сладководна", "Кеши", "Барок", "Мабе", "Семенна", "Култивирана", "Естествена", "Имитация", "Друга"]'::jsonb, 53),
     
    -- Pearl Size (mm)
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Pearl Size (mm)', 'Размер на перлата (мм)', 'select', false, true,
     '["Under 5mm", "5-6mm", "6-7mm", "7-8mm", "8-9mm", "9-10mm", "10-11mm", "11-12mm", "12-13mm", "13mm+"]'::jsonb,
     '["Под 5мм", "5-6мм", "6-7мм", "7-8мм", "8-9мм", "9-10мм", "10-11мм", "11-12мм", "12-13мм", "13мм+"]'::jsonb, 54),
     
    -- Pearl Quality
    (gen_random_uuid(), 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf', 'Pearl Quality', 'Качество на перлата', 'select', false, true,
     '["AAA", "AA+", "AA", "A+", "A", "Commercial Grade"]'::jsonb,
     '["AAA", "AA+", "AA", "A+", "A", "Търговско качество"]'::jsonb, 55);
;
