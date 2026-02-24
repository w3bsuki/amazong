
-- =====================================================
-- TRADING CARDS L3 Categories
-- Pokémon, MTG, Yu-Gi-Oh! breakdown
-- =====================================================
DO $$ 
DECLARE
  pokemon_id UUID;
  mtg_id UUID;
  yugioh_id UUID;
  sports_cards_id UUID;
BEGIN
  SELECT id INTO pokemon_id FROM categories WHERE slug = 'coll-pokemon';
  SELECT id INTO mtg_id FROM categories WHERE slug = 'coll-mtg';
  SELECT id INTO yugioh_id FROM categories WHERE slug = 'coll-yugioh';
  SELECT id INTO sports_cards_id FROM categories WHERE slug = 'coll-sports-cards';
  
  -- Pokémon L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pokémon Singles', 'Единични карти', 'pokemon-singles', pokemon_id, 1),
    ('Pokémon Booster Boxes', 'Бустер кутии', 'pokemon-booster-boxes', pokemon_id, 2),
    ('Pokémon Booster Packs', 'Бустер пакове', 'pokemon-booster-packs', pokemon_id, 3),
    ('Pokémon Elite Trainer Boxes', 'Elite Trainer кутии', 'pokemon-etb', pokemon_id, 4),
    ('Pokémon Graded Cards', 'Оценени карти', 'pokemon-graded', pokemon_id, 5),
    ('Pokémon Japanese', 'Японски карти', 'pokemon-japanese', pokemon_id, 6),
    ('Pokémon Vintage (WOTC)', 'Винтидж (WOTC)', 'pokemon-vintage', pokemon_id, 7),
    ('Pokémon Bundles', 'Комплекти', 'pokemon-bundles', pokemon_id, 8),
    ('Pokémon Promos', 'Промо карти', 'pokemon-promos', pokemon_id, 9)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
    
  -- MTG L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('MTG Singles', 'Единични карти', 'mtg-singles', mtg_id, 1),
    ('MTG Booster Boxes', 'Бустер кутии', 'mtg-booster-boxes', mtg_id, 2),
    ('MTG Booster Packs', 'Бустер пакове', 'mtg-booster-packs', mtg_id, 3),
    ('MTG Commander Decks', 'Commander колоди', 'mtg-commander', mtg_id, 4),
    ('MTG Graded Cards', 'Оценени карти', 'mtg-graded', mtg_id, 5),
    ('MTG Reserved List', 'Reserved List', 'mtg-reserved-list', mtg_id, 6),
    ('MTG Vintage/Old Frame', 'Винтидж/Стара рамка', 'mtg-vintage', mtg_id, 7),
    ('MTG Foils & Special', 'Фойл и специални', 'mtg-foils', mtg_id, 8),
    ('MTG Bundles & Lots', 'Комплекти', 'mtg-bundles', mtg_id, 9)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
    
  -- Yu-Gi-Oh! L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Yu-Gi-Oh! Singles', 'Единични карти', 'yugioh-singles', yugioh_id, 1),
    ('Yu-Gi-Oh! Booster Boxes', 'Бустер кутии', 'yugioh-booster-boxes', yugioh_id, 2),
    ('Yu-Gi-Oh! Structure Decks', 'Структурни колоди', 'yugioh-structure', yugioh_id, 3),
    ('Yu-Gi-Oh! Graded Cards', 'Оценени карти', 'yugioh-graded', yugioh_id, 4),
    ('Yu-Gi-Oh! 1st Edition', 'Първо издание', 'yugioh-1st-edition', yugioh_id, 5),
    ('Yu-Gi-Oh! Ghost/Ultimate Rares', 'Ghost/Ultimate редки', 'yugioh-ultra-rares', yugioh_id, 6),
    ('Yu-Gi-Oh! Bundles & Lots', 'Комплекти', 'yugioh-bundles', yugioh_id, 7)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
    
  -- Sports Cards L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Basketball Cards', 'Баскетболни карти', 'sports-cards-basketball', sports_cards_id, 1),
    ('Football Cards (Soccer)', 'Футболни карти', 'sports-cards-football', sports_cards_id, 2),
    ('Baseball Cards', 'Бейзболни карти', 'sports-cards-baseball', sports_cards_id, 3),
    ('American Football Cards', 'Американски футбол карти', 'sports-cards-nfl', sports_cards_id, 4),
    ('Hockey Cards', 'Хокейни карти', 'sports-cards-hockey', sports_cards_id, 5),
    ('F1 & Racing Cards', 'F1 и състезателни карти', 'sports-cards-racing', sports_cards_id, 6),
    ('UFC/MMA Cards', 'UFC/MMA карти', 'sports-cards-ufc', sports_cards_id, 7),
    ('Vintage Sports Cards', 'Винтидж спортни карти', 'sports-cards-vintage', sports_cards_id, 8),
    ('Graded Sports Cards', 'Оценени спортни карти', 'sports-cards-graded', sports_cards_id, 9)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
END $$;
;
