
-- =====================================================
-- SPORTS MEMORABILIA, ENTERTAINMENT, STAMPS Attributes
-- =====================================================
DO $$ 
DECLARE
  sports_mem_id UUID;
  ent_mem_id UUID;
  stamps_id UUID;
  vintage_elec_id UUID;
  antiques_id UUID;
BEGIN
  SELECT id INTO sports_mem_id FROM categories WHERE slug = 'sports-memorabilia';
  SELECT id INTO ent_mem_id FROM categories WHERE slug = 'entertainment-memorabilia';
  SELECT id INTO stamps_id FROM categories WHERE slug = 'stamps';
  SELECT id INTO vintage_elec_id FROM categories WHERE slug = 'coll-vintage-electronics';
  SELECT id INTO antiques_id FROM categories WHERE slug = 'antiques';
  
  -- Sports Memorabilia attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (sports_mem_id, 'Sport', 'Спорт', 'select', false, true,
     '["Football/Soccer", "Basketball", "Baseball", "American Football", "Hockey", "Tennis", "Golf", "Boxing/MMA", "Racing/F1", "Wrestling/WWE", "Cricket", "Rugby", "Olympics", "Other"]'::jsonb,
     '["Футбол", "Баскетбол", "Бейзбол", "Американски футбол", "Хокей", "Тенис", "Голф", "Бокс/ММА", "Състезания/F1", "Борба/WWE", "Крикет", "Ръгби", "Олимпиада", "Друг"]'::jsonb, 1),
    (sports_mem_id, 'Team', 'Отбор', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 2),
    (sports_mem_id, 'Player', 'Играч', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 3),
    (sports_mem_id, 'Item Type', 'Тип артикул', 'select', false, true,
     '["Jersey/Shirt", "Ball", "Card", "Photo", "Equipment", "Trophy/Medal", "Ticket/Program", "Poster", "Pennant/Flag", "Bobblehead", "Plaque", "Other"]'::jsonb,
     '["Фланелка", "Топка", "Карта", "Снимка", "Оборудване", "Трофей/Медал", "Билет/Програма", "Постер", "Вимпел/Знаме", "Бобълхед", "Плакет", "Друго"]'::jsonb, 4),
    (sports_mem_id, 'Game Used', 'Използвано в мач', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (sports_mem_id, 'Season/Year', 'Сезон/Година', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 6)
  ON CONFLICT DO NOTHING;
  
  -- Entertainment Memorabilia attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (ent_mem_id, 'Entertainment Type', 'Тип развлечение', 'select', false, true,
     '["Movies", "TV Shows", "Music/Concerts", "Theater/Broadway", "Video Games", "Animation/Disney", "Wrestling/WWE", "Other"]'::jsonb,
     '["Филми", "Телевизия", "Музика/Концерти", "Театър/Бродуей", "Видео игри", "Анимация/Дисни", "Кеч/WWE", "Друго"]'::jsonb, 1),
    (ent_mem_id, 'Title/Show/Movie', 'Заглавие/Шоу/Филм', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 2),
    (ent_mem_id, 'Celebrity/Artist', 'Знаменитост/Артист', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 3),
    (ent_mem_id, 'Item Type', 'Тип артикул', 'select', false, true,
     '["Prop", "Costume/Wardrobe", "Poster", "Lobby Card", "Press Kit", "Script", "Photo", "Award/Trophy", "Ticket/Pass", "Tour Merchandise", "Gold/Platinum Record", "Other"]'::jsonb,
     '["Реквизит", "Костюм/Гардероб", "Постер", "Лоби карта", "Пресматериали", "Сценарий", "Снимка", "Награда/Трофей", "Билет/Пропуск", "Турне мърч", "Златен/Платинен запис", "Друго"]'::jsonb, 4),
    (ent_mem_id, 'Screen Used', 'Използвано на екран', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (ent_mem_id, 'Production Year', 'Година на продукция', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 6)
  ON CONFLICT DO NOTHING;
  
  -- Stamps attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (stamps_id, 'Stamp Type', 'Тип марка', 'select', false, true,
     '["Definitive", "Commemorative", "Air Mail", "Postage Due", "Revenue", "Semi-Postal", "Special Delivery", "Official", "Other"]'::jsonb,
     '["Стандартна", "Възпоменателна", "Въздушна поща", "Доплатна", "Фискална", "Благотворителна", "Експресна", "Служебна", "Друга"]'::jsonb, 1),
    (stamps_id, 'Stamp Country', 'Държава', 'select', false, true,
     '["Bulgaria", "USA", "UK", "Germany", "France", "Russia", "Italy", "Austria", "Japan", "China", "Australia", "Canada", "Other European", "Other"]'::jsonb,
     '["България", "САЩ", "Великобритания", "Германия", "Франция", "Русия", "Италия", "Австрия", "Япония", "Китай", "Австралия", "Канада", "Друга европейска", "Друга"]'::jsonb, 2),
    (stamps_id, 'Stamp Condition', 'Състояние', 'select', false, true,
     '["Superb (98-100)", "Extremely Fine (95)", "Very Fine (85)", "Fine-Very Fine (80)", "Fine (70)", "Very Good (60)", "Good (50)", "Average (40)", "Poor", "Space Filler"]'::jsonb,
     '["Превъзходно (98-100)", "Отлично (95)", "Много добро (85)", "Добро-Много добро (80)", "Добро (70)", "Много средно (60)", "Средно (50)", "Задоволително (40)", "Лошо", "За попълване"]'::jsonb, 3),
    (stamps_id, 'Mint/Used', 'Нова/Използвана', 'select', false, true,
     '["Mint Never Hinged (MNH)", "Mint Hinged (MH)", "Mint Original Gum", "Mint No Gum", "Used/Cancelled", "On Cover/Piece"]'::jsonb,
     '["Нова неостъклена (MNH)", "Нова остъклена (MH)", "Нова с оригинално лепило", "Нова без лепило", "Използвана/Печатана", "На плик/Откъс"]'::jsonb, 4),
    (stamps_id, 'Year Issued', 'Година на издаване', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 5),
    (stamps_id, 'Thematic Topic', 'Тематика', 'multiselect', false, true,
     '["Art", "Animals", "Birds", "Butterflies", "Cars/Transport", "Famous People", "Flora/Flowers", "History", "Maps", "Military", "Music", "Olympics/Sports", "Religion", "Royalty", "Ships", "Space", "Trains", "Other"]'::jsonb,
     '["Изкуство", "Животни", "Птици", "Пеперуди", "Коли/Транспорт", "Известни личности", "Флора/Цветя", "История", "Карти", "Военни", "Музика", "Олимпиада/Спорт", "Религия", "Кралски", "Кораби", "Космос", "Влакове", "Друго"]'::jsonb, 6)
  ON CONFLICT DO NOTHING;
  
  -- Vintage Electronics attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (vintage_elec_id, 'Electronics Type', 'Тип електроника', 'select', false, true,
     '["Audio Equipment", "Camera", "Computer", "Gaming Console", "Radio", "Telephone", "TV", "Watch/Clock", "Other"]'::jsonb,
     '["Аудио оборудване", "Фотоапарат", "Компютър", "Игрална конзола", "Радио", "Телефон", "Телевизор", "Часовник", "Друго"]'::jsonb, 1),
    (vintage_elec_id, 'Decade', 'Десетилетие', 'select', false, true,
     '["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "Pre-1950"]'::jsonb,
     '["1950-те", "1960-те", "1970-те", "1980-те", "1990-те", "2000-те", "Преди 1950"]'::jsonb, 2),
    (vintage_elec_id, 'Working Condition', 'Работещо състояние', 'select', false, true,
     '["Fully Functional", "Partially Working", "Not Working/For Parts", "Not Tested", "Restored/Refurbished"]'::jsonb,
     '["Напълно функционално", "Частично работещо", "Неработещо/За части", "Нетествано", "Реставрирано/Обновено"]'::jsonb, 3),
    (vintage_elec_id, 'Original Parts', 'Оригинални части', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4)
  ON CONFLICT DO NOTHING;
  
  -- Antiques attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (antiques_id, 'Antique Period', 'Период', 'select', false, true,
     '["Ancient (Pre-500 AD)", "Medieval (500-1500)", "Renaissance (1400-1600)", "Baroque (1600-1750)", "Rococo (1730-1770)", "Georgian (1714-1830)", "Victorian (1837-1901)", "Edwardian (1901-1910)", "Art Nouveau (1890-1910)", "Art Deco (1920-1940)", "Mid-Century Modern (1940-1970)", "Other"]'::jsonb,
     '["Античен (Преди 500 г.)", "Средновековен (500-1500)", "Ренесанс (1400-1600)", "Барок (1600-1750)", "Рококо (1730-1770)", "Джорджиански (1714-1830)", "Викториански (1837-1901)", "Едуардиански (1901-1910)", "Арт Нуво (1890-1910)", "Арт Деко (1920-1940)", "Модерна среда на века (1940-1970)", "Друг"]'::jsonb, 1),
    (antiques_id, 'Material', 'Материал', 'multiselect', false, true,
     '["Wood", "Metal", "Glass", "Porcelain", "Ceramic", "Silver", "Gold", "Bronze", "Brass", "Copper", "Ivory", "Bone", "Stone", "Marble", "Textile", "Leather", "Paper", "Other"]'::jsonb,
     '["Дърво", "Метал", "Стъкло", "Порцелан", "Керамика", "Сребро", "Злато", "Бронз", "Месинг", "Мед", "Слонова кост", "Кост", "Камък", "Мрамор", "Текстил", "Кожа", "Хартия", "Друго"]'::jsonb, 2),
    (antiques_id, 'Origin', 'Произход', 'select', false, true,
     '["Bulgarian", "European", "American", "British", "French", "German", "Italian", "Russian", "Asian", "Middle Eastern", "African", "Unknown"]'::jsonb,
     '["Българско", "Европейско", "Американско", "Британско", "Френско", "Немско", "Италианско", "Руско", "Азиатско", "Близкоизточно", "Африканско", "Неизвестен"]'::jsonb, 3),
    (antiques_id, 'Restoration', 'Реставрация', 'select', false, true,
     '["Original/Unrestored", "Professionally Restored", "Amateur Restoration", "Partial Restoration", "Needs Restoration"]'::jsonb,
     '["Оригинално/Нереставрирано", "Професионално реставрирано", "Аматьорска реставрация", "Частична реставрация", "Нуждае се от реставрация"]'::jsonb, 4),
    (antiques_id, 'Maker/Manufacturer', 'Майстор/Производител', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 5)
  ON CONFLICT DO NOTHING;
END $$;
;
