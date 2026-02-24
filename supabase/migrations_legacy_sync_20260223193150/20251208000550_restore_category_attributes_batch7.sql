-- Batch 7: Collectibles, Wholesale, Grocery Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Trading Cards
  SELECT id INTO cat_id FROM categories WHERE slug = 'trading-cards';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Card Game', 'Карта игра', 'select', true, true, '["Pokemon","Magic: The Gathering","Yu-Gi-Oh!","Sports Cards","Other TCG"]', '["Pokemon","Magic: The Gathering","Yu-Gi-Oh!","Спортни карти","Друга TCG"]', 1),
      (cat_id, 'Card Condition', 'Състояние на картата', 'select', true, true, '["Gem Mint (10)","Mint (9)","Near Mint (8)","Excellent (7)","Good (6)","Fair (5)","Poor (1-4)"]', '["Перфектна (10)","Мента (9)","Почти мента (8)","Отлична (7)","Добра (6)","Средна (5)","Лоша (1-4)"]', 2),
      (cat_id, 'Graded', 'Оценена', 'select', false, true, '["Ungraded","PSA","BGS (Beckett)","CGC","SGC"]', '["Без оценка","PSA","BGS (Beckett)","CGC","SGC"]', 3),
      (cat_id, 'Rarity', 'Рядкост', 'select', false, true, '["Common","Uncommon","Rare","Holo Rare","Ultra Rare","Secret Rare","Special Art"]', '["Обикновена","Необикновена","Рядка","Холо рядка","Ултра рядка","Секретна рядка","Специална арт"]', 4),
      (cat_id, 'First Edition', 'Първо издание', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Language', 'Език', 'select', false, true, '["English","Japanese","Korean","Chinese","German","French","Other"]', '["Английски","Японски","Корейски","Китайски","Немски","Френски","Друг"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Coins & Currency
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'coins-currency';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Coin Type', 'Тип монета', 'select', true, true, '["Bullion","Commemorative","Circulated","Proof","Ancient","Medieval","Modern"]', '["Кюлче","Възпоменателна","Циркулирала","Пруф","Антична","Средновековна","Модерна"]', 1),
      (cat_id, 'Metal', 'Метал', 'select', false, true, '["Gold","Silver","Platinum","Copper","Bronze","Nickel","Other"]', '["Злато","Сребро","Платина","Мед","Бронз","Никел","Друго"]', 2),
      (cat_id, 'Country', 'Държава', 'select', false, true, '["Bulgaria","USA","UK","Germany","France","Russia","China","Ancient Rome","Ancient Greece","Other"]', '["България","САЩ","Великобритания","Германия","Франция","Русия","Китай","Древен Рим","Древна Гърция","Друга"]', 3),
      (cat_id, 'Grade', 'Оценка', 'select', false, true, '["MS70","MS69","MS65-68","MS60-64","AU50-58","XF40-45","VF20-35","F12-15","VG8-10","Good","Poor"]', '["MS70","MS69","MS65-68","MS60-64","AU50-58","XF40-45","VF20-35","F12-15","VG8-10","Добра","Лоша"]', 4),
      (cat_id, 'Certified', 'Сертифицирана', 'select', false, true, '["Uncertified","PCGS","NGC","ANACS","ICG"]', '["Без сертификат","PCGS","NGC","ANACS","ICG"]', 5),
      (cat_id, 'Year', 'Година', 'text', false, true, null, null, 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Art
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'art';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Art Medium', 'Техника', 'select', true, true, '["Oil Painting","Acrylic","Watercolor","Pastel","Pencil/Charcoal","Digital Art","Mixed Media","Sculpture","Photography","Print"]', '["Маслена живопис","Акрил","Акварел","Пастел","Молив/Въглен","Дигитално изкуство","Смесена техника","Скулптура","Фотография","Щампа"]', 1),
      (cat_id, 'Art Style', 'Стил', 'select', false, true, '["Abstract","Realism","Impressionism","Modern","Contemporary","Pop Art","Street Art","Classical","Surrealism","Minimalist"]', '["Абстрактен","Реализъм","Импресионизъм","Модерен","Съвременен","Поп арт","Улично изкуство","Класически","Сюрреализъм","Минималистичен"]', 2),
      (cat_id, 'Subject', 'Сюжет', 'select', false, true, '["Portrait","Landscape","Still Life","Abstract","Nature","Urban","Figure","Animal","Floral","Other"]', '["Портрет","Пейзаж","Натюрморт","Абстракт","Природа","Градски","Фигура","Животно","Цветя","Друго"]', 3),
      (cat_id, 'Framed', 'С рамка', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4),
      (cat_id, 'Original/Print', 'Оригинал/Копие', 'select', true, true, '["Original","Limited Edition Print","Open Edition Print","Reproduction"]', '["Оригинал","Лимитиран принт","Отворен принт","Репродукция"]', 5),
      (cat_id, 'Size Category', 'Размерна категория', 'select', false, true, '["Small (Under 30cm)","Medium (30-60cm)","Large (60-100cm)","Extra Large (100cm+)"]', '["Малък (под 30см)","Среден (30-60см)","Голям (60-100см)","Много голям (100см+)"]', 6),
      (cat_id, 'Artist', 'Художник', 'text', false, false, null, null, 7),
      (cat_id, 'COA Included', 'Сертификат', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 8)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Wholesale General
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'wholesale';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Minimum Order', 'Минимална поръчка', 'select', true, true, '["1-10 units","11-50 units","51-100 units","100-500 units","500+ units","Pallet","Container"]', '["1-10 бр.","11-50 бр.","51-100 бр.","100-500 бр.","500+ бр.","Палет","Контейнер"]', 1),
      (cat_id, 'Lead Time', 'Срок на доставка', 'select', false, true, '["In Stock","1-3 Days","1 Week","2 Weeks","1 Month","Custom Order"]', '["На склад","1-3 дни","1 седмица","2 седмици","1 месец","По поръчка"]', 2),
      (cat_id, 'Sample Available', 'Мостра', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 3),
      (cat_id, 'Private Label', 'Частна марка', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4),
      (cat_id, 'Country of Origin', 'Страна на произход', 'select', false, true, '["Bulgaria","EU","China","Turkey","USA","India","Other"]', '["България","ЕС","Китай","Турция","САЩ","Индия","Друга"]', 5),
      (cat_id, 'Certification', 'Сертификация', 'multiselect', false, true, '["CE","ISO","FDA","GOTS","OEKO-TEX","None"]', '["CE","ISO","FDA","GOTS","OEKO-TEX","Без"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
