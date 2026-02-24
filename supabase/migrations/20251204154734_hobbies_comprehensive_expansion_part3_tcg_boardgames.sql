
-- =====================================================
-- HOBBIES PART 3: TCG & Board Games L2/L3 Expansion
-- Focus: Playing card games, board games, puzzles
-- =====================================================

DO $$
DECLARE
  tcg_id UUID;
  tabletop_id UUID;
  cat_id UUID;
BEGIN
  SELECT id INTO tcg_id FROM categories WHERE slug = 'hobby-tcg';
  SELECT id INTO tabletop_id FROM categories WHERE slug = 'hobby-tabletop';
  
  -- ========== TRADING CARD GAMES ==========
  -- Pokemon TCG L3 (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-pokemon-tcg';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Pokemon Singles', 'Pokemon единични', 'tcg-pokemon-singles', cat_id, '⚡', 1),
    ('Pokemon Booster Packs', 'Pokemon бустери', 'tcg-pokemon-boosters', cat_id, '📦', 2),
    ('Pokemon Booster Boxes', 'Pokemon кутии', 'tcg-pokemon-boxes', cat_id, '📦', 3),
    ('Pokemon ETB', 'Pokemon ETB', 'tcg-pokemon-etb', cat_id, '🎁', 4),
    ('Pokemon Tins & Sets', 'Pokemon комплекти', 'tcg-pokemon-tins', cat_id, '🎁', 5),
    ('Pokemon Japanese', 'Pokemon японски', 'tcg-pokemon-japanese', cat_id, '🇯🇵', 6),
    ('Pokemon Vintage', 'Pokemon винтидж', 'tcg-pokemon-vintage', cat_id, '📜', 7),
    ('Pokemon Bundles', 'Pokemon комплекти', 'tcg-pokemon-bundles', cat_id, '📦', 8)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- Magic: The Gathering L3 (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-mtg';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('MTG Singles', 'MTG единични', 'tcg-mtg-singles', cat_id, '🧙', 1),
    ('MTG Booster Boxes', 'MTG кутии', 'tcg-mtg-boxes', cat_id, '📦', 2),
    ('MTG Commander Decks', 'MTG Commander', 'tcg-mtg-commander', cat_id, '⚔️', 3),
    ('MTG Sealed Product', 'MTG запечатани', 'tcg-mtg-sealed', cat_id, '📦', 4),
    ('MTG Foils', 'MTG фолио', 'tcg-mtg-foils', cat_id, '✨', 5),
    ('MTG Bundles', 'MTG комплекти', 'tcg-mtg-bundles', cat_id, '📦', 6)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- Yu-Gi-Oh! L3 (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-yugioh';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Yu-Gi-Oh! Singles', 'Yu-Gi-Oh! единични', 'tcg-yugioh-singles', cat_id, '🔮', 1),
    ('Yu-Gi-Oh! Booster Boxes', 'Yu-Gi-Oh! кутии', 'tcg-yugioh-boxes', cat_id, '📦', 2),
    ('Yu-Gi-Oh! Structure Decks', 'Yu-Gi-Oh! тестета', 'tcg-yugioh-structure', cat_id, '⚔️', 3),
    ('Yu-Gi-Oh! Sealed', 'Yu-Gi-Oh! запечатани', 'tcg-yugioh-sealed', cat_id, '📦', 4),
    ('Yu-Gi-Oh! 1st Edition', 'Yu-Gi-Oh! 1-во издание', 'tcg-yugioh-1st', cat_id, '1️⃣', 5)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- NEW L2: One Piece TCG
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('One Piece TCG', 'One Piece карти', 'hobby-onepiece-tcg', tcg_id, '🏴‍☠️', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('One Piece Singles', 'One Piece единични', 'tcg-op-singles', cat_id, '🏴‍☠️', 1),
  ('One Piece Booster Boxes', 'One Piece кутии', 'tcg-op-boxes', cat_id, '📦', 2),
  ('One Piece Starter Decks', 'One Piece стартови', 'tcg-op-starters', cat_id, '⚔️', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- NEW L2: Dragon Ball TCG
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Dragon Ball TCG', 'Dragon Ball карти', 'hobby-dragonball-tcg', tcg_id, '🐉', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Card Accessories L3 (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-card-accessories';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Card Sleeves', 'Протектори', 'tcg-sleeves', cat_id, '🃏', 1),
    ('Deck Boxes', 'Кутии за тестета', 'tcg-deck-boxes', cat_id, '📦', 2),
    ('Binders & Albums', 'Класьори и албуми', 'tcg-binders', cat_id, '📒', 3),
    ('Playmats', 'Плейтъци', 'tcg-playmats', cat_id, '🎯', 4),
    ('Toploaders', 'Топлоудъри', 'tcg-toploaders', cat_id, '🔳', 5),
    ('Display Cases', 'Витрини', 'tcg-display-cases', cat_id, '🖼️', 6)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- ========== BOARD GAMES & PUZZLES ==========
  -- L2: Strategy Games
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Strategy Games', 'Стратегически игри', 'tabletop-strategy', tabletop_id, '♟️', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Euro Games', 'Евро игри', 'tabletop-euro', cat_id, '🇪🇺', 1),
  ('War Games', 'Военни игри', 'tabletop-wargames', cat_id, '⚔️', 2),
  ('Worker Placement', 'Worker Placement', 'tabletop-worker', cat_id, '👷', 3),
  ('Deck Building', 'Deck Building', 'tabletop-deckbuilding', cat_id, '🃏', 4),
  ('Area Control', 'Area Control', 'tabletop-area-control', cat_id, '🗺️', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Party Games
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Party Games', 'Парти игри', 'tabletop-party', tabletop_id, '🎉', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Trivia Games', 'Тривия игри', 'tabletop-trivia', cat_id, '❓', 1),
  ('Social Deduction', 'Social Deduction', 'tabletop-social', cat_id, '🕵️', 2),
  ('Word Games', 'Словесни игри', 'tabletop-word', cat_id, '📝', 3),
  ('Drinking Games', 'Игри с пиене', 'tabletop-drinking', cat_id, '🍻', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Family Games
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Family Games', 'Семейни игри', 'tabletop-family', tabletop_id, '👨‍👩‍👧‍👦', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Kids Board Games', 'Детски настолни', 'tabletop-kids', cat_id, '🧒', 1),
  ('Cooperative Games', 'Кооперативни игри', 'tabletop-coop', cat_id, '🤝', 2),
  ('Gateway Games', 'Начални игри', 'tabletop-gateway', cat_id, '🚪', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Classic Games
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Classic Games', 'Класически игри', 'tabletop-classic', tabletop_id, '♟️', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Chess', 'Шах', 'tabletop-chess', cat_id, '♟️', 1),
  ('Checkers & Backgammon', 'Дама и табла', 'tabletop-checkers', cat_id, '⚫', 2),
  ('Monopoly & Classic', 'Монополи и класики', 'tabletop-monopoly', cat_id, '🎩', 3),
  ('Dominos & Mahjong', 'Домино и маджонг', 'tabletop-dominos', cat_id, '🀄', 4),
  ('Playing Cards', 'Карти за игра', 'tabletop-playing-cards', cat_id, '🃏', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Jigsaw Puzzles
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Jigsaw Puzzles', 'Пъзели', 'tabletop-puzzles', tabletop_id, '🧩', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('500 Pieces & Under', 'До 500 части', 'puzzles-500', cat_id, '🧩', 1),
  ('1000 Pieces', '1000 части', 'puzzles-1000', cat_id, '🧩', 2),
  ('2000+ Pieces', '2000+ части', 'puzzles-2000', cat_id, '🧩', 3),
  ('3D Puzzles', '3D пъзели', 'puzzles-3d', cat_id, '🏰', 4),
  ('Custom Photo Puzzles', 'Персонализирани пъзели', 'puzzles-custom', cat_id, '📷', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Tabletop RPG
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Tabletop RPG', 'Настолни RPG', 'tabletop-rpg', tabletop_id, '🐉', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('D&D', 'D&D', 'rpg-dnd', cat_id, '🐉', 1),
  ('Pathfinder', 'Pathfinder', 'rpg-pathfinder', cat_id, '⚔️', 2),
  ('Other RPG Systems', 'Други RPG системи', 'rpg-other', cat_id, '📖', 3),
  ('Dice Sets', 'Зарове', 'rpg-dice', cat_id, '🎲', 4),
  ('Miniatures', 'Миниатюри', 'rpg-miniatures', cat_id, '🧙', 5),
  ('RPG Accessories', 'RPG аксесоари', 'rpg-accessories', cat_id, '🎒', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Warhammer & Miniatures
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Warhammer & Miniatures', 'Warhammer и миниатюри', 'tabletop-warhammer', tabletop_id, '⚔️', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Warhammer 40K', 'Warhammer 40K', 'warhammer-40k', cat_id, '🔫', 1),
  ('Age of Sigmar', 'Age of Sigmar', 'warhammer-aos', cat_id, '⚔️', 2),
  ('Kill Team', 'Kill Team', 'warhammer-killteam', cat_id, '💀', 3),
  ('Paints & Supplies', 'Бои и материали', 'warhammer-paints', cat_id, '🎨', 4),
  ('Terrain', 'Терен', 'warhammer-terrain', cat_id, '🏰', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
