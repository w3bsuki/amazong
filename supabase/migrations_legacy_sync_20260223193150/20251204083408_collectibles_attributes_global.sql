
-- =====================================================
-- COLLECTIBLES ATTRIBUTES - Global & Trading Cards
-- =====================================================
DO $$ 
DECLARE
  collectibles_id UUID;
  trading_cards_id UUID;
BEGIN
  SELECT id INTO collectibles_id FROM categories WHERE slug = 'collectibles';
  SELECT id INTO trading_cards_id FROM categories WHERE slug = 'coll-trading-cards';
  
  -- Update existing collectibles attributes with more comprehensive options
  UPDATE category_attributes SET
    options = '["Art", "Antiques", "Coins", "Currency", "Stamps", "Sports Memorabilia", "Entertainment Memorabilia", "Trading Cards", "Comics", "Toys & Figures", "Autographs", "Vintage Clothing", "Militaria", "Vintage Electronics", "Rare Items"]'::jsonb,
    options_bg = '["Изкуство", "Антики", "Монети", "Банкноти", "Марки", "Спортни сувенири", "Развлекателни сувенири", "Колекционерски карти", "Комикси", "Играчки и фигурки", "Автографи", "Винтидж облекло", "Милитария", "Винтидж електроника", "Редки предмети"]'::jsonb
  WHERE category_id = collectibles_id AND name = 'Collectible Type';
  
  -- Add new global collectibles attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (collectibles_id, 'Provenance', 'Произход', 'select', false, true, 
     '["Private Collection", "Estate Sale", "Auction House", "Gallery", "Direct from Artist", "Museum Deaccession", "Family Heirloom", "Unknown"]'::jsonb,
     '["Частна колекция", "Разпродажба на имот", "Аукционна къща", "Галерия", "Директно от художника", "Музейна деакцесия", "Фамилна реликва", "Неизвестен"]'::jsonb, 6),
    (collectibles_id, 'Year/Date', 'Година/Дата', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 7),
    (collectibles_id, 'Country of Origin', 'Страна на произход', 'select', false, true,
     '["USA", "UK", "Germany", "France", "Italy", "Japan", "China", "Bulgaria", "Russia", "Other European", "Other Asian", "Other"]'::jsonb,
     '["САЩ", "Великобритания", "Германия", "Франция", "Италия", "Япония", "Китай", "България", "Русия", "Друга европейска", "Друга азиатска", "Друга"]'::jsonb, 8),
    (collectibles_id, 'Documentation', 'Документация', 'multiselect', false, true,
     '["Original Receipt", "Appraisal", "Authentication Letter", "Provenance Documents", "Insurance Records", "None"]'::jsonb,
     '["Оригинална разписка", "Оценка", "Писмо за автентичност", "Документи за произход", "Застрахователни документи", "Няма"]'::jsonb, 9),
    (collectibles_id, 'Storage Condition', 'Условия на съхранение', 'select', false, true,
     '["Climate Controlled", "Display Case", "Safe/Vault", "Original Packaging", "Standard Storage", "Unknown"]'::jsonb,
     '["Климатизирано", "Витрина", "Сейф/Трезор", "Оригинална опаковка", "Стандартно съхранение", "Неизвестно"]'::jsonb, 10)
  ON CONFLICT DO NOTHING;
  
  -- Trading Cards specific attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
    (trading_cards_id, 'Card Game', 'Игра', 'select', true, true,
     '["Pokémon", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece", "Dragon Ball", "Lorcana", "Flesh and Blood", "Weiss Schwarz", "Digimon", "Sports Cards", "Non-Sport Cards", "Other"]'::jsonb,
     '["Pokémon", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece", "Dragon Ball", "Lorcana", "Flesh and Blood", "Weiss Schwarz", "Digimon", "Спортни карти", "Некласически карти", "Друга"]'::jsonb, 1),
    (trading_cards_id, 'Card Condition', 'Състояние на картата', 'select', true, true,
     '["Gem Mint (10)", "Mint (9)", "Near Mint-Mint (8)", "Near Mint (7)", "Excellent-Mint (6)", "Excellent (5)", "Very Good-Excellent (4)", "Very Good (3)", "Good (2)", "Poor (1)", "Authenticated/Sealed"]'::jsonb,
     '["Безупречна (10)", "Отлична (9)", "Почти перфектна (8)", "Много добра (7)", "Отлична-добра (6)", "Добра (5)", "Много добра-добра (4)", "Много добра (3)", "Добра (2)", "Лоша (1)", "Автентифицирана/Запечатана"]'::jsonb, 2),
    (trading_cards_id, 'Grading Company', 'Компания за оценка', 'select', false, true,
     '["PSA", "BGS (Beckett)", "CGC", "SGC", "BGS Black Label", "Not Graded"]'::jsonb,
     '["PSA", "BGS (Beckett)", "CGC", "SGC", "BGS Black Label", "Неоценена"]'::jsonb, 3),
    (trading_cards_id, 'Grading Score', 'Оценка', 'select', false, true,
     '["10 (Gem Mint/Pristine)", "9.5 (Gem Mint)", "9 (Mint)", "8.5 (NM-MT+)", "8 (NM-MT)", "7.5 (NM+)", "7 (NM)", "6.5 (EX-MT+)", "6 (EX-MT)", "5.5 (EX+)", "5 (EX)", "4 or below", "Authentic Only"]'::jsonb,
     '["10 (Безупречна)", "9.5 (Перфектна)", "9 (Отлична)", "8.5 (Много добра+)", "8 (Много добра)", "7.5 (Добра+)", "7 (Добра)", "6.5 (Средна+)", "6 (Средна)", "5.5 (Задоволителна+)", "5 (Задоволителна)", "4 или по-ниско", "Само автентична"]'::jsonb, 4),
    (trading_cards_id, 'Card Rarity', 'Рядкост', 'select', false, true,
     '["Common", "Uncommon", "Rare", "Holo Rare", "Reverse Holo", "Ultra Rare", "Secret Rare", "Illustration Rare", "Special Art Rare", "Hyper Rare", "Gold Rare", "Promo", "1st Edition"]'::jsonb,
     '["Обикновена", "Необикновена", "Рядка", "Холо рядка", "Обратен холо", "Ултра рядка", "Секретна рядка", "Илюстрационно рядка", "Специална рядка", "Хипер рядка", "Златна рядка", "Промо", "Първо издание"]'::jsonb, 5),
    (trading_cards_id, 'Card Set', 'Сет', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 6),
    (trading_cards_id, 'Card Number', 'Номер на картата', 'text', false, false, '[]'::jsonb, '[]'::jsonb, 7),
    (trading_cards_id, 'Product Type', 'Тип продукт', 'select', false, true,
     '["Single Card", "Booster Pack", "Booster Box", "Elite Trainer Box", "Collection Box", "Starter/Theme Deck", "Bundle/Lot", "Sealed Case", "Display Box"]'::jsonb,
     '["Единична карта", "Бустер пакет", "Бустер кутия", "Elite Trainer кутия", "Колекционерска кутия", "Стартер/Тематична колода", "Комплект/Лот", "Запечатан кашон", "Дисплей кутия"]'::jsonb, 8),
    (trading_cards_id, 'Language', 'Език', 'select', false, true,
     '["English", "Japanese", "Korean", "Chinese", "German", "French", "Spanish", "Italian", "Portuguese"]'::jsonb,
     '["Английски", "Японски", "Корейски", "Китайски", "Немски", "Френски", "Испански", "Италиански", "Португалски"]'::jsonb, 9),
    (trading_cards_id, 'First Edition', 'Първо издание', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 10),
    (trading_cards_id, 'Shadowless', 'Shadowless', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 11),
    (trading_cards_id, 'Holographic', 'Холографска', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 12)
  ON CONFLICT DO NOTHING;
END $$;
;
