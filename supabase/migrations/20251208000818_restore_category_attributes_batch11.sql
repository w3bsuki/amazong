-- Batch 11: Pet, Books, Movies, Music Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Dog Supplies
  SELECT id INTO cat_id FROM categories WHERE slug = 'dog-supplies';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Dog Size', 'Размер куче', 'select', false, true, '["Extra Small (Up to 5kg)","Small (5-10kg)","Medium (10-25kg)","Large (25-40kg)","Giant (40kg+)"]', '["Миниатюрно (до 5кг)","Малко (5-10кг)","Средно (10-25кг)","Голямо (25-40кг)","Гигантско (40кг+)"]', 1),
      (cat_id, 'Life Stage', 'Етап от живота', 'select', false, true, '["Puppy","Adult","Senior","All Life Stages"]', '["Кученце","Възрастен","Възрастен/Сениор","Всички етапи"]', 2),
      (cat_id, 'Product Type', 'Тип продукт', 'select', false, true, '["Food","Treats","Toys","Beds","Collars/Leashes","Grooming","Health","Training","Travel"]', '["Храна","Лакомства","Играчки","Легла","Нашийници/Каишки","Грижа","Здраве","Обучение","Пътуване"]', 3)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Cat Supplies
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'cat-supplies';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Life Stage', 'Етап от живота', 'select', false, true, '["Kitten","Adult","Senior","All Life Stages"]', '["Коте","Възрастна","Възрастна/Сениор","Всички етапи"]', 1),
      (cat_id, 'Product Type', 'Тип продукт', 'select', false, true, '["Food","Treats","Litter","Litter Boxes","Toys","Scratchers","Beds","Grooming","Health"]', '["Храна","Лакомства","Тоалетна","Кутии за тоалетна","Играчки","Драскалки","Легла","Грижа","Здраве"]', 2),
      (cat_id, 'Food Type', 'Тип храна', 'select', false, true, '["Dry","Wet","Raw","Treats"]', '["Суха","Мокра","Сурова","Лакомства"]', 3),
      (cat_id, 'Special Diet', 'Специална диета', 'multiselect', false, true, '["Indoor","Weight Control","Hairball","Sensitive Stomach","Urinary Health","Grain-Free"]', '["За домашни","Контрол на теглото","Космени топки","Чувствителен стомах","Уринарно здраве","Без зърнени"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Books
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'books';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Format', 'Формат', 'select', true, true, '["Hardcover","Paperback","E-book","Audiobook"]', '["Твърди корици","Меки корици","Е-книга","Аудиокнига"]', 1),
      (cat_id, 'Genre', 'Жанр', 'select', false, true, '["Fiction","Non-Fiction","Biography","Self-Help","Business","Science","History","Children","Romance","Thriller","Sci-Fi/Fantasy","Comics/Manga"]', '["Белетристика","Нехудожествена","Биография","Самопомощ","Бизнес","Наука","История","Детски","Романтика","Трилър","Научна фантастика","Комикси/Манга"]', 2),
      (cat_id, 'Language', 'Език', 'select', true, true, '["Bulgarian","English","German","French","Russian","Other"]', '["Български","Английски","Немски","Френски","Руски","Друг"]', 3),
      (cat_id, 'Age Group', 'Възрастова група', 'select', false, true, '["Adults","Young Adult","Children 7-12","Children 3-6","Baby/Toddler"]', '["Възрастни","Тийнейджъри","Деца 7-12","Деца 3-6","Бебета"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Vinyl Records
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'vinyl-records';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Genre', 'Жанр', 'select', false, true, '["Rock","Pop","Jazz","Classical","Electronic","Hip-Hop","Soul/R&B","Country","Metal","Punk","Folk","World","Soundtrack"]', '["Рок","Поп","Джаз","Класическа","Електронна","Хип-хоп","Soul/R&B","Кънтри","Метъл","Пънк","Фолк","Световна","Саундтрак"]', 1),
      (cat_id, 'Format', 'Формат', 'select', true, true, '["LP (12\")","Single (7\")","EP (10\")","Box Set"]', '["LP (12\")","Сингъл (7\")","EP (10\")","Бокс сет"]', 2),
      (cat_id, 'Speed', 'Скорост', 'select', false, true, '["33 RPM","45 RPM","78 RPM"]', '["33 RPM","45 RPM","78 RPM"]', 3),
      (cat_id, 'Pressing', 'Пресоване', 'select', false, true, '["Original","Reissue","Limited Edition","Picture Disc","Colored Vinyl"]', '["Оригинално","Преиздание","Лимитирано","Picture Disc","Цветен винил"]', 4),
      (cat_id, 'Condition', 'Състояние', 'select', true, true, '["Mint (M)","Near Mint (NM)","Very Good Plus (VG+)","Very Good (VG)","Good Plus (G+)","Good (G)","Fair (F)","Poor (P)"]', '["Мента (M)","Почти мента (NM)","Много добро+ (VG+)","Много добро (VG)","Добро+ (G+)","Добро (G)","Средно (F)","Лошо (P)"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- DVD/Blu-ray
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'dvd-bluray';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Format', 'Формат', 'select', true, true, '["DVD","Blu-ray","4K UHD Blu-ray","3D Blu-ray"]', '["DVD","Blu-ray","4K UHD Blu-ray","3D Blu-ray"]', 1),
      (cat_id, 'Genre', 'Жанр', 'select', false, true, '["Action","Comedy","Drama","Horror","Sci-Fi","Animation","Documentary","Family","Romance","Thriller"]', '["Екшън","Комедия","Драма","Хорър","Научна фантастика","Анимация","Документален","Семеен","Романтичен","Трилър"]', 2),
      (cat_id, 'Region', 'Регион', 'select', false, true, '["Region Free","Region 1 (US)","Region 2 (Europe)","Region A","Region B"]', '["Без регион","Регион 1 (САЩ)","Регион 2 (Европа)","Регион A","Регион B"]', 3),
      (cat_id, 'Edition', 'Издание', 'select', false, true, '["Standard","Special Edition","Steelbook","Collector''s Edition","Box Set"]', '["Стандартно","Специално издание","Steelbook","Колекционерско","Бокс сет"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
