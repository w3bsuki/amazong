-- Phase 4: Hobbies - L3 Categories Batch 1 (Trading Card Games, Board Games)

DO $$
DECLARE
  -- Trading Card Games L2 IDs
  card_acc_id UUID := 'f68eb27c-584c-4090-9f15-6e3f3a609893';
  dragonball_id UUID := '4802c53e-6b57-4a8c-9f0d-bd14eb3bc0f7';
  mtg_id UUID := '7ea0efa6-ea5c-47b6-8f78-bbe246af0ba2';
  onepiece_id UUID := 'baf91715-3b2c-41fe-90e0-0695e4a76fa3';
  pokemon_id UUID := '7a37017b-3a77-4c6b-a734-69a736fa79ca';
  sports_cards_id UUID := '1b537a84-ab22-47c7-90b4-c39404a8b19a';
  yugioh_id UUID := '2144d2f9-8a73-416c-8ac1-d910d885adc9';
  -- Board Games L2 IDs
  card_games_id UUID := '7d78fadd-561c-4789-8e22-b85baafffdab';
  classic_id UUID := '494a0010-417b-415d-bcc9-d66b002a6a63';
  family_id UUID := 'a195c636-30f5-49bd-9cb2-414437e38c88';
  puzzles_id UUID := '6126adb7-712f-4d3a-9a7b-c51ac68c3372';
  party_id UUID := '9de8ad5f-1d33-4c8a-8c2a-9aa1f8474ac8';
  strategy_id UUID := 'c667fc0c-4a94-40b8-b2b8-d440afaf8c4a';
  rpg_id UUID := 'efb8f04d-d8b2-4cfa-a2bc-008421210fe1';
  warhammer_id UUID := '666bcea4-fb83-4e5f-ac6b-434eb6900fc0';
BEGIN
  -- Pokemon TCG L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Pokemon Singles', 'pokemon-singles', pokemon_id, 'Единични карти Pokemon', '🎴', 1),
    ('Pokemon Booster Boxes', 'pokemon-booster-boxes', pokemon_id, 'Pokemon бустер кутии', '🎴', 2),
    ('Pokemon Elite Trainer Boxes', 'pokemon-etb', pokemon_id, 'Pokemon ETB', '🎴', 3),
    ('Pokemon Sealed Products', 'pokemon-sealed', pokemon_id, 'Pokemon запечатани продукти', '🎴', 4),
    ('Pokemon Japanese Cards', 'pokemon-japanese', pokemon_id, 'Pokemon японски карти', '🎴', 5),
    ('Pokemon Graded Cards', 'pokemon-graded', pokemon_id, 'Pokemon градирани карти', '🎴', 6),
    ('Pokemon Bundles & Lots', 'pokemon-bundles', pokemon_id, 'Pokemon пакети', '🎴', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Magic: The Gathering L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('MTG Singles', 'mtg-singles', mtg_id, 'MTG единични карти', '🎴', 1),
    ('MTG Booster Boxes', 'mtg-booster-boxes', mtg_id, 'MTG бустер кутии', '🎴', 2),
    ('MTG Commander Decks', 'mtg-commander', mtg_id, 'MTG Commander тестета', '🎴', 3),
    ('MTG Sealed Products', 'mtg-sealed', mtg_id, 'MTG запечатани продукти', '🎴', 4),
    ('MTG Bundles', 'mtg-bundles', mtg_id, 'MTG пакети', '🎴', 5),
    ('MTG Secret Lair', 'mtg-secret-lair', mtg_id, 'MTG Secret Lair', '🎴', 6),
    ('MTG Collector Boxes', 'mtg-collector', mtg_id, 'MTG колекционерски кутии', '🎴', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Yu-Gi-Oh! L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Yu-Gi-Oh Singles', 'yugioh-singles', yugioh_id, 'Yu-Gi-Oh единични карти', '🎴', 1),
    ('Yu-Gi-Oh Booster Boxes', 'yugioh-booster-boxes', yugioh_id, 'Yu-Gi-Oh бустер кутии', '🎴', 2),
    ('Yu-Gi-Oh Structure Decks', 'yugioh-structure', yugioh_id, 'Yu-Gi-Oh структурни тестета', '🎴', 3),
    ('Yu-Gi-Oh Sealed Products', 'yugioh-sealed', yugioh_id, 'Yu-Gi-Oh запечатани продукти', '🎴', 4),
    ('Yu-Gi-Oh Tin Boxes', 'yugioh-tins', yugioh_id, 'Yu-Gi-Oh тин кутии', '🎴', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Sports Cards L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Basketball Cards', 'sports-basketball', sports_cards_id, 'Баскетболни карти', '🏀', 1),
    ('Football Cards', 'sports-football', sports_cards_id, 'Футболни карти', '⚽', 2),
    ('Baseball Cards', 'sports-baseball', sports_cards_id, 'Бейзболни карти', '⚾', 3),
    ('Soccer Cards', 'sports-soccer', sports_cards_id, 'Футболни карти (Европа)', '⚽', 4),
    ('Hockey Cards', 'sports-hockey', sports_cards_id, 'Хокейни карти', '🏒', 5),
    ('Graded Sports Cards', 'sports-graded', sports_cards_id, 'Градирани спортни карти', '🏆', 6),
    ('Sports Card Boxes', 'sports-card-boxes', sports_cards_id, 'Кутии спортни карти', '📦', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Card Accessories L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Card Sleeves', 'card-sleeves', card_acc_id, 'Протектори за карти', '🛡️', 1),
    ('Card Binders', 'card-binders', card_acc_id, 'Албуми за карти', '📒', 2),
    ('Deck Boxes', 'deck-boxes', card_acc_id, 'Кутии за тестета', '📦', 3),
    ('Playmats', 'card-playmats', card_acc_id, 'Подложки за игра', '🎮', 4),
    ('Card Toploaders', 'card-toploaders', card_acc_id, 'Твърди протектори', '🛡️', 5),
    ('Card Display Cases', 'card-display', card_acc_id, 'Витрини за карти', '🖼️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- One Piece TCG L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('One Piece Singles', 'onepiece-singles', onepiece_id, 'One Piece единични карти', '🎴', 1),
    ('One Piece Booster Boxes', 'onepiece-boosters', onepiece_id, 'One Piece бустер кутии', '🎴', 2),
    ('One Piece Starter Decks', 'onepiece-starters', onepiece_id, 'One Piece стартови тестета', '🎴', 3),
    ('One Piece Sealed', 'onepiece-sealed', onepiece_id, 'One Piece запечатани', '🎴', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Dragon Ball TCG L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Dragon Ball Singles', 'dragonball-singles', dragonball_id, 'Dragon Ball единични карти', '🎴', 1),
    ('Dragon Ball Booster Boxes', 'dragonball-boosters', dragonball_id, 'Dragon Ball бустер кутии', '🎴', 2),
    ('Dragon Ball Starter Decks', 'dragonball-starters', dragonball_id, 'Dragon Ball стартови тестета', '🎴', 3),
    ('Dragon Ball Sealed', 'dragonball-sealed', dragonball_id, 'Dragon Ball запечатани', '🎴', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Board Games - Card Games L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Poker Sets', 'cards-poker', card_games_id, 'Покер комплекти', '🃏', 1),
    ('Playing Card Decks', 'cards-playing', card_games_id, 'Тестета игрални карти', '🃏', 2),
    ('UNO & Similar', 'cards-uno', card_games_id, 'UNO и подобни', '🃏', 3),
    ('Collectible Card Games', 'cards-collectible', card_games_id, 'Колекционерски картови игри', '🃏', 4),
    ('Trick-Taking Games', 'cards-trick-taking', card_games_id, 'Игри с вземане на ръце', '🃏', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Classic Games L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Chess Sets', 'classic-chess', classic_id, 'Шахматни комплекти', '♟️', 1),
    ('Backgammon Sets', 'classic-backgammon', classic_id, 'Табла комплекти', '🎲', 2),
    ('Dominoes', 'classic-dominoes', classic_id, 'Домино', '🀱', 3),
    ('Checkers', 'classic-checkers', classic_id, 'Дама', '⚫', 4),
    ('Mahjong Sets', 'classic-mahjong', classic_id, 'Маджонг комплекти', '🀄', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Family Games L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Monopoly & Editions', 'family-monopoly', family_id, 'Монополи и издания', '🎩', 1),
    ('Scrabble & Word Games', 'family-scrabble', family_id, 'Scrabble и словесни игри', '📝', 2),
    ('Trivia Games', 'family-trivia', family_id, 'Тривия игри', '❓', 3),
    ('Kids Board Games', 'family-kids', family_id, 'Детски настолни игри', '👶', 4),
    ('Cooperative Family Games', 'family-coop', family_id, 'Кооперативни семейни игри', '🤝', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Jigsaw Puzzles L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('500 Piece Puzzles', 'puzzles-500', puzzles_id, 'Пъзели 500 части', '🧩', 1),
    ('1000 Piece Puzzles', 'puzzles-1000', puzzles_id, 'Пъзели 1000 части', '🧩', 2),
    ('2000+ Piece Puzzles', 'puzzles-2000plus', puzzles_id, 'Пъзели 2000+ части', '🧩', 3),
    ('3D Puzzles', 'puzzles-3d', puzzles_id, '3D пъзели', '🧩', 4),
    ('Kids Puzzles', 'puzzles-kids', puzzles_id, 'Детски пъзели', '🧩', 5),
    ('Wooden Puzzles', 'puzzles-wooden', puzzles_id, 'Дървени пъзели', '🧩', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Party Games L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Drinking Games', 'party-drinking', party_id, 'Пиянски игри', '🍺', 1),
    ('Adult Party Games', 'party-adult', party_id, 'Парти игри за възрастни', '🎉', 2),
    ('Team Games', 'party-team', party_id, 'Отборни игри', '👥', 3),
    ('Quick Party Games', 'party-quick', party_id, 'Бързи парти игри', '⚡', 4),
    ('Icebreaker Games', 'party-icebreaker', party_id, 'Игри за разчупване на леда', '🧊', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Strategy Games L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Euro Games', 'strategy-euro', strategy_id, 'Евро игри', '🎯', 1),
    ('War Games', 'strategy-war', strategy_id, 'Военни игри', '⚔️', 2),
    ('Worker Placement', 'strategy-worker', strategy_id, 'Worker Placement', '👷', 3),
    ('Deck Building', 'strategy-deckbuilding', strategy_id, 'Deck Building', '🃏', 4),
    ('Area Control', 'strategy-area-control', strategy_id, 'Area Control', '🗺️', 5),
    ('Engine Building', 'strategy-engine', strategy_id, 'Engine Building', '⚙️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Tabletop RPG L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('D&D 5th Edition', 'rpg-dnd5e', rpg_id, 'D&D 5-то издание', '🐉', 1),
    ('Pathfinder', 'rpg-pathfinder', rpg_id, 'Pathfinder', '⚔️', 2),
    ('Call of Cthulhu', 'rpg-cthulhu', rpg_id, 'Call of Cthulhu', '🐙', 3),
    ('Dice Sets', 'rpg-dice', rpg_id, 'Комплекти зарове', '🎲', 4),
    ('RPG Accessories', 'rpg-accessories', rpg_id, 'RPG аксесоари', '📜', 5),
    ('RPG Miniatures', 'rpg-miniatures', rpg_id, 'RPG миниатюри', '🎭', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Warhammer & Miniatures L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Warhammer 40,000', 'warhammer-40k', warhammer_id, 'Warhammer 40,000', '⚔️', 1),
    ('Age of Sigmar', 'warhammer-aos', warhammer_id, 'Age of Sigmar', '⚔️', 2),
    ('Warhammer Paints', 'warhammer-paints', warhammer_id, 'Warhammer бои', '🎨', 3),
    ('Warhammer Terrain', 'warhammer-terrain', warhammer_id, 'Warhammer терени', '🏰', 4),
    ('Warhammer Books', 'warhammer-books', warhammer_id, 'Warhammer книги', '📚', 5),
    ('Other Miniature Games', 'warhammer-other', warhammer_id, 'Други миниатюрни игри', '🎭', 6)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
