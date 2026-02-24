
-- Phase 5: Collectibles - Comprehensive Attributes (correct schema)

-- Get Collectibles L0 ID
DO $$
DECLARE
  collectibles_id UUID;
BEGIN
  SELECT id INTO collectibles_id FROM categories WHERE slug = 'collectibles';
  
  -- Core Collectibles Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (collectibles_id, 'Condition', 'Състояние', 'select', '["Mint", "Near Mint", "Excellent", "Very Good", "Good", "Fair", "Poor", "For Parts"]', '["Мента", "Почти мента", "Отлично", "Много добро", "Добро", "Задоволително", "Лошо", "За части"]', true, true, 1),
    (collectibles_id, 'Authenticity', 'Автентичност', 'select', '["Authenticated", "Certificate Included", "Not Authenticated", "Unknown"]', '["Автентифицирано", "С сертификат", "Не е автентифицирано", "Неизвестно"]', false, true, 2),
    (collectibles_id, 'Provenance', 'Произход', 'select', '["Documented", "Partial Documentation", "Unknown"]', '["Документиран", "Частична документация", "Неизвестен"]', false, true, 3),
    (collectibles_id, 'Year/Era', 'Година/Ера', 'text', NULL, NULL, false, true, 4),
    (collectibles_id, 'Rarity', 'Рядкост', 'select', '["Common", "Uncommon", "Rare", "Very Rare", "Extremely Rare", "Unique"]', '["Обичайна", "Необичайна", "Рядка", "Много рядка", "Изключително рядка", "Уникална"]', false, true, 5),
    (collectibles_id, 'Country of Origin', 'Държава на произход', 'text', NULL, NULL, false, true, 6),
    (collectibles_id, 'Original Packaging', 'Оригинална опаковка', 'boolean', NULL, NULL, false, true, 7),
    (collectibles_id, 'Has Certificate', 'С сертификат', 'boolean', NULL, NULL, false, true, 8)
  ON CONFLICT DO NOTHING;
END $$;

-- Coins specific attributes
DO $$
DECLARE
  coins_id UUID;
BEGIN
  SELECT id INTO coins_id FROM categories WHERE slug = 'coins-currency';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (coins_id, 'Grade', 'Оценка', 'select', '["PR70", "PR69", "MS70", "MS69", "MS68", "MS67", "MS66", "MS65", "MS64", "MS63", "AU", "XF", "VF", "F", "VG", "G", "AG", "P"]', '["PR70", "PR69", "MS70", "MS69", "MS68", "MS67", "MS66", "MS65", "MS64", "MS63", "AU", "XF", "VF", "F", "VG", "G", "AG", "P"]', false, true, 1),
    (coins_id, 'Grading Service', 'Служба за оценка', 'select', '["NGC", "PCGS", "ICG", "ANACS", "Ungraded"]', '["NGC", "PCGS", "ICG", "ANACS", "Без оценка"]', false, true, 2),
    (coins_id, 'Metal Content', 'Метално съдържание', 'select', '["Gold", "Silver", "Platinum", "Palladium", "Copper", "Bronze", "Nickel", "Clad", "Other"]', '["Злато", "Сребро", "Платина", "Паладий", "Мед", "Бронз", "Никел", "Смесен", "Друг"]', false, true, 3),
    (coins_id, 'Denomination', 'Номинал', 'text', NULL, NULL, false, true, 4),
    (coins_id, 'Mint Mark', 'Монетен знак', 'text', NULL, NULL, false, true, 5),
    (coins_id, 'Weight (grams)', 'Тегло (грамове)', 'number', NULL, NULL, false, true, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- Stamps specific attributes
DO $$
DECLARE
  stamps_id UUID;
BEGIN
  SELECT id INTO stamps_id FROM categories WHERE slug = 'coll-stamps';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (stamps_id, 'Stamp Condition', 'Състояние на марката', 'select', '["Superb", "Extremely Fine", "Very Fine", "Fine-Very Fine", "Fine", "Very Good", "Good", "Fair"]', '["Превъзходно", "Изключително добро", "Много добро", "Добро-много добро", "Добро", "Задоволително", "Удовлетворително", "Прилично"]', false, true, 1),
    (stamps_id, 'Gum Condition', 'Състояние на лепилото', 'select', '["Original Gum NH", "Original Gum LH", "Original Gum", "Regummed", "No Gum", "Used"]', '["Оригинално NH", "Оригинално LH", "Оригинално", "Прелепено", "Без лепило", "Използвана"]', false, true, 2),
    (stamps_id, 'Centering', 'Центриране', 'select', '["Perfect", "Near Perfect", "Well Centered", "Slightly Off-Center", "Off-Center", "Very Off-Center"]', '["Перфектно", "Почти перфектно", "Добре центрирана", "Леко изместена", "Изместена", "Силно изместена"]', false, true, 3),
    (stamps_id, 'Perforations', 'Перфорация', 'select', '["Perfect", "Sound", "Short Perfs", "Pulled Perfs", "Imperforate"]', '["Перфектна", "Добра", "Къси зъби", "Издърпани зъби", "Без перфорация"]', false, true, 4),
    (stamps_id, 'Catalog Number', 'Каталожен номер', 'text', NULL, NULL, false, true, 5),
    (stamps_id, 'Cancellation', 'Вид печат', 'select', '["Mint", "Light Cancel", "Heavy Cancel", "CDS", "Manuscript", "Pen Cancel"]', '["Мента", "Лек печат", "Тежък печат", "CDS", "Ръкописен", "С химикал"]', false, true, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- Trading Cards specific attributes
DO $$
DECLARE
  cards_id UUID;
BEGIN
  SELECT id INTO cards_id FROM categories WHERE slug = 'coll-trading-cards';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (cards_id, 'PSA/BGS Grade', 'Оценка PSA/BGS', 'select', '["PSA 10", "PSA 9", "PSA 8", "PSA 7", "PSA 6", "PSA 5", "BGS 10", "BGS 9.5", "BGS 9", "CGC 10", "CGC 9.5", "Raw/Ungraded"]', '["PSA 10", "PSA 9", "PSA 8", "PSA 7", "PSA 6", "PSA 5", "BGS 10", "BGS 9.5", "BGS 9", "CGC 10", "CGC 9.5", "Без оценка"]', false, true, 1),
    (cards_id, 'Set/Series', 'Серия', 'text', NULL, NULL, false, true, 2),
    (cards_id, 'Card Number', 'Номер на карта', 'text', NULL, NULL, false, true, 3),
    (cards_id, 'Card Type', 'Тип карта', 'select', '["Base", "Parallel", "Insert", "Autograph", "Relic/Patch", "Rookie", "Serial Numbered", "1/1"]', '["Базова", "Паралелна", "Вмъкната", "Автограф", "Реликва/Патч", "Дебютна", "Сериен номер", "1/1"]', false, true, 4),
    (cards_id, 'Language', 'Език', 'select', '["English", "Japanese", "Korean", "Chinese", "German", "French", "Italian", "Spanish", "Portuguese"]', '["Английски", "Японски", "Корейски", "Китайски", "Немски", "Френски", "Италиански", "Испански", "Португалски"]', false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;

-- Militaria specific attributes
DO $$
DECLARE
  militaria_id UUID;
BEGIN
  SELECT id INTO militaria_id FROM categories WHERE slug = 'coll-militaria';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (militaria_id, 'Era', 'Ера', 'select', '["Pre-WWI", "WWI", "Interwar", "WWII", "Korean War", "Vietnam War", "Cold War", "Modern", "Other"]', '["Преди ПСВ", "ПСВ", "Междувоенна", "ВСВ", "Корейска война", "Виетнамска война", "Студена война", "Съвременна", "Друга"]', false, true, 1),
    (militaria_id, 'Branch', 'Род войска', 'select', '["Army", "Navy", "Air Force", "Marines", "Special Forces", "Police", "Civilian Defense"]', '["Армия", "ВМС", "ВВС", "Морски пехотинци", "Специални части", "Полиция", "Гражданска отбрана"]', false, true, 2),
    (militaria_id, 'Country of Origin', 'Държава', 'select', '["Bulgaria", "USA", "Germany", "USSR/Russia", "UK", "France", "Japan", "Italy", "Other"]', '["България", "САЩ", "Германия", "СССР/Русия", "Великобритания", "Франция", "Япония", "Италия", "Друга"]', false, true, 3),
    (militaria_id, 'Type', 'Тип', 'select', '["Original/Authentic", "Reproduction", "Unknown"]', '["Оригинал/Автентичен", "Репродукция", "Неизвестно"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Art & Antiques specific attributes
DO $$
DECLARE
  art_id UUID;
BEGIN
  SELECT id INTO art_id FROM categories WHERE slug = 'art-antiques';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (art_id, 'Medium', 'Техника', 'select', '["Oil", "Acrylic", "Watercolor", "Pastel", "Pencil", "Ink", "Mixed Media", "Bronze", "Marble", "Wood", "Ceramic", "Glass", "Other"]', '["Масло", "Акрил", "Акварел", "Пастел", "Молив", "Туш", "Смесена техника", "Бронз", "Мрамор", "Дърво", "Керамика", "Стъкло", "Друго"]', false, true, 1),
    (art_id, 'Style', 'Стил', 'select', '["Impressionist", "Modern", "Contemporary", "Abstract", "Realism", "Surrealism", "Folk Art", "Classical", "Other"]', '["Импресионизъм", "Модерен", "Съвременен", "Абстрактен", "Реализъм", "Сюрреализъм", "Народно изкуство", "Класически", "Друго"]', false, true, 2),
    (art_id, 'Artist Name', 'Име на художник', 'text', NULL, NULL, false, true, 3),
    (art_id, 'Dimensions', 'Размери', 'text', NULL, NULL, false, true, 4),
    (art_id, 'Framed', 'С рамка', 'boolean', NULL, NULL, false, true, 5),
    (art_id, 'Signed', 'Подписано', 'boolean', NULL, NULL, false, true, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- Vintage Electronics specific attributes
DO $$
DECLARE
  vint_elec_id UUID;
BEGIN
  SELECT id INTO vint_elec_id FROM categories WHERE slug = 'coll-vintage-electronics';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (vint_elec_id, 'Working Condition', 'Работно състояние', 'select', '["Fully Working", "Partially Working", "Not Working", "For Parts", "Untested"]', '["Напълно работещ", "Частично работещ", "Не работи", "За части", "Нетестван"]', true, true, 1),
    (vint_elec_id, 'Included Items', 'Включени елементи', 'select', '["Unit Only", "With Cables", "With Manual", "Complete in Box", "All Original Accessories"]', '["Само устройство", "С кабели", "С инструкция", "Пълен комплект в кутия", "Всички оригинални аксесоари"]', false, true, 2),
    (vint_elec_id, 'Modifications', 'Модификации', 'select', '["Original/Unmodified", "Region Free", "RGB Modified", "Capacitor Replaced", "Other Modifications"]', '["Оригинален/Немодифициран", "Без регион", "RGB модифициран", "Сменени кондензатори", "Други модификации"]', false, true, 3),
    (vint_elec_id, 'Region', 'Регион', 'select', '["NTSC-U", "NTSC-J", "PAL", "Region Free", "Multi-Region", "N/A"]', '["NTSC-U", "NTSC-J", "PAL", "Без регион", "Мулти-регион", "Неприложимо"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Comics specific attributes
DO $$
DECLARE
  comics_id UUID;
BEGIN
  SELECT id INTO comics_id FROM categories WHERE slug = 'coll-comics';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (comics_id, 'CGC/CBCS Grade', 'Оценка CGC/CBCS', 'select', '["CGC 10", "CGC 9.8", "CGC 9.6", "CGC 9.4", "CGC 9.2", "CGC 9.0", "CBCS 9.8", "CBCS 9.6", "Raw NM", "Raw VF", "Raw F", "Raw G"]', '["CGC 10", "CGC 9.8", "CGC 9.6", "CGC 9.4", "CGC 9.2", "CGC 9.0", "CBCS 9.8", "CBCS 9.6", "NM (без оценка)", "VF (без оценка)", "F (без оценка)", "G (без оценка)"]', false, true, 1),
    (comics_id, 'Issue Number', 'Номер на брой', 'text', NULL, NULL, false, true, 2),
    (comics_id, 'Variant', 'Вариант', 'select', '["Standard", "Variant Cover", "Newsstand", "Direct Edition", "1st Print", "2nd Print", "Signed", "Sketch"]', '["Стандартен", "Вариантна корица", "Вестникарски", "Директно издание", "1-ви тираж", "2-ри тираж", "Подписан", "Скица"]', false, true, 3),
    (comics_id, 'Key Issue', 'Ключов брой', 'select', '["1st Appearance", "Origin Story", "Death Issue", "Wedding/Major Event", "Classic Cover", "Not Key"]', '["Първа поява", "История за произход", "Смърт", "Сватба/Голямо събитие", "Класическа корица", "Не е ключов"]', false, true, 4),
    (comics_id, 'Publisher', 'Издател', 'text', NULL, NULL, false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;

-- Sports Memorabilia specific attributes
DO $$
DECLARE
  sports_mem_id UUID;
BEGIN
  SELECT id INTO sports_mem_id FROM categories WHERE slug = 'sports-memorabilia';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (sports_mem_id, 'Sport', 'Спорт', 'select', '["Football", "Basketball", "Baseball", "Soccer", "Hockey", "Tennis", "Golf", "Boxing", "MMA", "Racing", "Olympics", "Other"]', '["Американски футбол", "Баскетбол", "Бейзбол", "Футбол", "Хокей", "Тенис", "Голф", "Бокс", "ММА", "Състезания", "Олимпийски", "Друг"]', false, true, 1),
    (sports_mem_id, 'Team/Player', 'Отбор/Играч', 'text', NULL, NULL, false, true, 2),
    (sports_mem_id, 'Authentication', 'Автентификация', 'select', '["PSA/DNA", "JSA", "Beckett", "Fanatics", "Steiner", "Team/League COA", "Seller COA", "None"]', '["PSA/DNA", "JSA", "Beckett", "Fanatics", "Steiner", "COA от отбор/лига", "COA от продавач", "Без"]', false, true, 3),
    (sports_mem_id, 'Item Type', 'Тип артикул', 'select', '["Autograph", "Game-Used", "Game-Worn", "Replica", "Display Item", "Program/Ticket", "Card", "Photo"]', '["Автограф", "Използван в игра", "Носен в игра", "Реплика", "За витрина", "Програма/Билет", "Карта", "Снимка"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Toys & Figures specific attributes
DO $$
DECLARE
  toys_id UUID;
BEGIN
  SELECT id INTO toys_id FROM categories WHERE slug = 'coll-toys-figures';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (toys_id, 'Brand', 'Марка', 'select', '["Hasbro", "Mattel", "Bandai", "Good Smile", "NECA", "McFarlane", "Hot Toys", "Funko", "LEGO", "Other"]', '["Hasbro", "Mattel", "Bandai", "Good Smile", "NECA", "McFarlane", "Hot Toys", "Funko", "LEGO", "Друга"]', false, true, 1),
    (toys_id, 'Package Condition', 'Състояние на опаковка', 'select', '["MISB", "MOC", "MIB", "Open Box", "Loose Complete", "Loose Incomplete"]', '["MISB", "MOC", "MIB", "Отворена кутия", "Без кутия пълен", "Без кутия непълен"]', false, true, 2),
    (toys_id, 'Scale/Size', 'Мащаб/Размер', 'select', '["1:6", "1:12", "1:18", "3.75 inch", "6 inch", "12 inch", "Deluxe", "Statue", "Other"]', '["1:6", "1:12", "1:18", "3.75 инча", "6 инча", "12 инча", "Делукс", "Статуя", "Друг"]', false, true, 3),
    (toys_id, 'Era', 'Ера', 'select', '["Vintage (Pre-1980)", "1980s", "1990s", "2000s", "2010s", "Current"]', '["Винтидж (преди 1980)", "1980-те", "1990-те", "2000-те", "2010-те", "Настояща"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;
;
