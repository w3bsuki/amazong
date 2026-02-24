
-- Phase 5: Movies & Music - Comprehensive Attributes

DO $$
DECLARE
  mm_id UUID;
BEGIN
  SELECT id INTO mm_id FROM categories WHERE slug = 'movies-music';
  
  -- Core Movies & Music Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (mm_id, 'Condition', 'Състояние', 'select', '["Mint/Sealed", "Near Mint", "Very Good Plus (VG+)", "Very Good (VG)", "Good Plus (G+)", "Good (G)", "Fair (F)", "Poor (P)"]', '["Мента/Запечатан", "Почти мента", "Много добро плюс (VG+)", "Много добро (VG)", "Добро плюс (G+)", "Добро (G)", "Задоволително (F)", "Лошо (P)"]', true, true, 1),
    (mm_id, 'Format', 'Формат', 'select', '["Vinyl LP", "Vinyl Single", "CD", "DVD", "Blu-ray", "4K UHD", "Cassette", "Digital"]', '["Винил LP", "Винил сингъл", "CD", "DVD", "Blu-ray", "4K UHD", "Касета", "Дигитален"]', false, true, 2),
    (mm_id, 'Region', 'Регион', 'select', '["Region Free", "Region 1 (US/Canada)", "Region 2 (Europe/Japan)", "Region 3 (Asia)", "Region A", "Region B", "Region C"]', '["Без регион", "Регион 1 (САЩ/Канада)", "Регион 2 (Европа/Япония)", "Регион 3 (Азия)", "Регион A", "Регион B", "Регион C"]', false, true, 3),
    (mm_id, 'Year Released', 'Година на издаване', 'text', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Vinyl specific attributes
DO $$
DECLARE
  vinyl_id UUID;
BEGIN
  SELECT id INTO vinyl_id FROM categories WHERE slug = 'vinyl-records';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (vinyl_id, 'Vinyl Size', 'Размер на винила', 'select', '["12\" LP", "10\" LP", "7\" Single", "12\" Single", "Box Set"]', '["12\" LP", "10\" LP", "7\" сингъл", "12\" сингъл", "Бокс сет"]', false, true, 1),
    (vinyl_id, 'Pressing', 'Пресоване', 'select', '["First Pressing", "Reissue", "Remaster", "Audiophile Press", "Colored Vinyl", "Picture Disc"]', '["Първо пресоване", "Преиздание", "Ремастер", "Аудиофилско", "Цветен винил", "Картинен диск"]', false, true, 2),
    (vinyl_id, 'Record Label', 'Звукозаписен лейбъл', 'text', NULL, NULL, false, true, 3),
    (vinyl_id, 'Catalog Number', 'Каталожен номер', 'text', NULL, NULL, false, true, 4),
    (vinyl_id, 'Speed (RPM)', 'Скорост (RPM)', 'select', '["33 1/3 RPM", "45 RPM", "78 RPM"]', '["33 1/3 RPM", "45 RPM", "78 RPM"]', false, true, 5),
    (vinyl_id, 'Sleeve Condition', 'Състояние на плика', 'select', '["Mint", "Near Mint", "Very Good Plus", "Very Good", "Good", "Fair", "Poor", "Generic"]', '["Мента", "Почти мента", "Много добро плюс", "Много добро", "Добро", "Задоволително", "Лошо", "Генеричен"]', false, true, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- Blu-ray/DVD specific attributes
DO $$
DECLARE
  bluray_id UUID;
BEGIN
  SELECT id INTO bluray_id FROM categories WHERE slug = 'movies-bluray';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (bluray_id, 'Edition', 'Издание', 'select', '["Standard", "Steelbook", "Collector''s Edition", "Limited Edition", "Director''s Cut", "Ultimate Edition"]', '["Стандартно", "Стийлбук", "Колекционерско", "Лимитирано", "Режисьорска версия", "Ултимативно"]', false, true, 1),
    (bluray_id, 'Disc Count', 'Брой дискове', 'select', '["1 Disc", "2 Discs", "3 Discs", "4+ Discs", "Box Set"]', '["1 диск", "2 диска", "3 диска", "4+ диска", "Бокс сет"]', false, true, 2),
    (bluray_id, 'Audio Languages', 'Аудио езици', 'text', NULL, NULL, false, true, 3),
    (bluray_id, 'Subtitles', 'Субтитри', 'text', NULL, NULL, false, true, 4),
    (bluray_id, 'Includes Digital Copy', 'С дигитално копие', 'boolean', NULL, NULL, false, true, 5),
    (bluray_id, 'Slipcover Included', 'Със слипкавър', 'boolean', NULL, NULL, false, true, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- CD specific attributes
DO $$
DECLARE
  cd_id UUID;
BEGIN
  SELECT id INTO cd_id FROM categories WHERE slug = 'music-cds';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (cd_id, 'CD Type', 'Тип CD', 'select', '["Standard CD", "SACD", "HDCD", "Gold CD", "SHM-CD", "Blu-spec CD"]', '["Стандартен CD", "SACD", "HDCD", "Златен CD", "SHM-CD", "Blu-spec CD"]', false, true, 1),
    (cd_id, 'Edition', 'Издание', 'select', '["Standard", "Deluxe", "Limited Edition", "Box Set", "Anniversary Edition", "Remaster"]', '["Стандартно", "Делукс", "Лимитирано", "Бокс сет", "Юбилейно", "Ремастър"]', false, true, 2),
    (cd_id, 'Disc Count', 'Брой дискове', 'select', '["Single Disc", "2 Discs", "3 Discs", "Box Set"]', '["Един диск", "2 диска", "3 диска", "Бокс сет"]', false, true, 3),
    (cd_id, 'Includes Booklet', 'С книжка', 'boolean', NULL, NULL, false, true, 4),
    (cd_id, 'Import', 'Внос', 'boolean', NULL, NULL, false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;

-- Audio Equipment specific attributes
DO $$
DECLARE
  audio_eq_id UUID;
BEGIN
  SELECT id INTO audio_eq_id FROM categories WHERE slug = 'mm-audio-equipment';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (audio_eq_id, 'Working Condition', 'Работно състояние', 'select', '["Fully Functional", "Needs Minor Repair", "Needs Major Repair", "For Parts", "Untested"]', '["Напълно работещ", "Нужен малък ремонт", "Нужен голям ремонт", "За части", "Нетестван"]', true, true, 1),
    (audio_eq_id, 'Brand', 'Марка', 'text', NULL, NULL, false, true, 2),
    (audio_eq_id, 'Connectivity', 'Свързаност', 'select', '["Wired Only", "Bluetooth", "WiFi", "USB", "Multiple"]', '["Само с кабел", "Блутут", "WiFi", "USB", "Множество"]', false, true, 3),
    (audio_eq_id, 'Power Output', 'Изходна мощност', 'text', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;
;
