-- Phase 2.2: Gaming L3 Categories - Batch 4: Board Games, TCG, Racing, Retro, Remaining
-- Target: Complete all remaining Gaming L2 categories

-- =====================================================
-- BOARD GAMES L3 CATEGORIES
-- =====================================================

-- Card Games (board-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Standard Card Games', 'Trick-Taking Games', 'Deck Building Games', 'Hand Management Games', 'Trading Card Games']),
  unnest(ARRAY['cardgame-standard', 'cardgame-tricktaking', 'cardgame-deckbuilding', 'cardgame-handmanagement', 'cardgame-tcg']),
  (SELECT id FROM categories WHERE slug = 'board-cards'),
  unnest(ARRAY['Стандартни карти', 'Игри с взятки', 'Игри с изграждане на тесте', 'Игри с управление на ръка', 'Колекционерски карти']),
  '🃏'
ON CONFLICT (slug) DO NOTHING;

-- Classic Games (board-classic)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Chess', 'Checkers', 'Backgammon', 'Dominoes', 'Mahjong', 'Yahtzee', 'Cribbage', 'Bridge']),
  unnest(ARRAY['classic-chess', 'classic-checkers', 'classic-backgammon', 'classic-dominoes', 'classic-mahjong', 'classic-yahtzee', 'classic-cribbage', 'classic-bridge']),
  (SELECT id FROM categories WHERE slug = 'board-classic'),
  unnest(ARRAY['Шах', 'Дама', 'Табла', 'Домино', 'Маджонг', 'Ямс', 'Крибидж', 'Бридж']),
  '♟️'
ON CONFLICT (slug) DO NOTHING;

-- Family Games (board-family)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Monopoly Editions', 'Scrabble', 'Clue/Cluedo', 'Life', 'Trivial Pursuit', 'Sequence', 'Sorry', 'Uno']),
  unnest(ARRAY['family-monopoly', 'family-scrabble', 'family-clue', 'family-life', 'family-trivial', 'family-sequence', 'family-sorry', 'family-uno']),
  (SELECT id FROM categories WHERE slug = 'board-family'),
  unnest(ARRAY['Монополи издания', 'Scrabble', 'Cluedo', 'Животът', 'Trivial Pursuit', 'Sequence', 'Sorry', 'Уно']),
  '🎲'
ON CONFLICT (slug) DO NOTHING;

-- Party Games (board-party)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Codenames', 'Cards Against Humanity', 'Telestrations', 'Pictionary', 'Charades', 'Werewolf', 'Jackbox Games', 'What Do You Meme']),
  unnest(ARRAY['party-codenames', 'party-cah', 'party-telestrations', 'party-pictionary', 'party-charades', 'party-werewolf', 'party-jackbox', 'party-meme']),
  (SELECT id FROM categories WHERE slug = 'board-party'),
  unnest(ARRAY['Codenames', 'Cards Against Humanity', 'Telestrations', 'Pictionary', 'Charades', 'Werewolf', 'Jackbox Games', 'What Do You Meme']),
  '🎉'
ON CONFLICT (slug) DO NOTHING;

-- Strategy Games (board-strategy)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Catan', 'Ticket to Ride', 'Risk', 'Terraforming Mars', 'Wingspan', 'Scythe', 'Pandemic', 'Azul']),
  unnest(ARRAY['strategy-catan', 'strategy-tickettoride', 'strategy-risk', 'strategy-terraforming', 'strategy-wingspan', 'strategy-scythe', 'strategy-pandemic', 'strategy-azul']),
  (SELECT id FROM categories WHERE slug = 'board-strategy'),
  unnest(ARRAY['Catan', 'Ticket to Ride', 'Risk', 'Terraforming Mars', 'Wingspan', 'Scythe', 'Pandemic', 'Azul']),
  '🏰'
ON CONFLICT (slug) DO NOTHING;

-- Cooperative Games (cooperative-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pandemic Legacy', 'Spirit Island', 'Gloomhaven', 'Arkham Horror', 'Forbidden Island', 'The Crew', 'Robinson Crusoe']),
  unnest(ARRAY['coop-pandemic', 'coop-spiritisland', 'coop-gloomhaven', 'coop-arkham', 'coop-forbidden', 'coop-crew', 'coop-robinson']),
  (SELECT id FROM categories WHERE slug = 'cooperative-games'),
  unnest(ARRAY['Pandemic Legacy', 'Spirit Island', 'Gloomhaven', 'Arkham Horror', 'Forbidden Island', 'The Crew', 'Robinson Crusoe']),
  '🤝'
ON CONFLICT (slug) DO NOTHING;

-- Role Playing Games (rpg-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dungeons & Dragons', 'Pathfinder', 'Call of Cthulhu', 'Warhammer', 'Starfinder', 'RPG Dice Sets', 'RPG Miniatures', 'RPG Accessories']),
  unnest(ARRAY['rpg-dnd', 'rpg-pathfinder', 'rpg-cthulhu', 'rpg-warhammer', 'rpg-starfinder', 'rpg-dice', 'rpg-miniatures', 'rpg-accessories']),
  (SELECT id FROM categories WHERE slug = 'rpg-games'),
  unnest(ARRAY['Dungeons & Dragons', 'Pathfinder', 'Call of Cthulhu', 'Warhammer', 'Starfinder', 'RPG зарове', 'RPG миниатюри', 'RPG аксесоари']),
  '🐉'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- TRADING CARD GAMES L3 CATEGORIES
-- =====================================================

-- Pokémon Cards (pokemon-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Booster Boxes', 'Elite Trainer Boxes', 'Single Cards', 'Booster Packs', 'Theme Decks', 'Collection Boxes', 'Japanese Cards', 'Graded Cards']),
  unnest(ARRAY['pokemon-boosterbox', 'pokemon-etb', 'pokemon-singles', 'pokemon-packs', 'pokemon-decks', 'pokemon-collections', 'pokemon-japanese', 'pokemon-graded']),
  (SELECT id FROM categories WHERE slug = 'pokemon-cards'),
  unnest(ARRAY['Бустер кутии', 'Elite Trainer кутии', 'Единични карти', 'Бустер пакети', 'Тематични тестета', 'Колекционни кутии', 'Японски карти', 'Оценени карти']),
  '⚡'
ON CONFLICT (slug) DO NOTHING;

-- Magic: The Gathering (mtg-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Draft Boosters', 'Set Boosters', 'Collector Boosters', 'Commander Decks', 'Single Cards', 'Bundle Boxes', 'Sealed Products', 'Graded Cards']),
  unnest(ARRAY['mtg-draft', 'mtg-set', 'mtg-collector', 'mtg-commander', 'mtg-singles', 'mtg-bundles', 'mtg-sealed', 'mtg-graded']),
  (SELECT id FROM categories WHERE slug = 'mtg-cards'),
  unnest(ARRAY['Draft бустери', 'Set бустери', 'Collector бустери', 'Commander тестета', 'Единични карти', 'Bundle кутии', 'Запечатани продукти', 'Оценени карти']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Yu-Gi-Oh! Cards (yugioh-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Booster Boxes', 'Booster Packs', 'Structure Decks', 'Single Cards', 'Tin Collections', 'Special Sets', 'Graded Cards']),
  unnest(ARRAY['yugioh-boosterbox', 'yugioh-packs', 'yugioh-structure', 'yugioh-singles', 'yugioh-tins', 'yugioh-special', 'yugioh-graded']),
  (SELECT id FROM categories WHERE slug = 'yugioh-cards'),
  unnest(ARRAY['Бустер кутии', 'Бустер пакети', 'Structure тестета', 'Единични карти', 'Тин колекции', 'Специални сетове', 'Оценени карти']),
  '🃏'
ON CONFLICT (slug) DO NOTHING;

-- Dragon Ball Cards (dragonball-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Booster Boxes', 'Booster Packs', 'Starter Decks', 'Single Cards', 'Premium Sets']),
  unnest(ARRAY['dragonball-boosterbox', 'dragonball-packs', 'dragonball-starter', 'dragonball-singles', 'dragonball-premium']),
  (SELECT id FROM categories WHERE slug = 'dragonball-cards'),
  unnest(ARRAY['Бустер кутии', 'Бустер пакети', 'Начални тестета', 'Единични карти', 'Премиум сетове']),
  '🐉'
ON CONFLICT (slug) DO NOTHING;

-- One Piece Cards (one-piece-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Booster Boxes', 'Booster Packs', 'Starter Decks', 'Single Cards', 'Premium Boxes']),
  unnest(ARRAY['onepiece-boosterbox', 'onepiece-packs', 'onepiece-starter', 'onepiece-singles', 'onepiece-premium']),
  (SELECT id FROM categories WHERE slug = 'one-piece-cards'),
  unnest(ARRAY['Бустер кутии', 'Бустер пакети', 'Начални тестета', 'Единични карти', 'Премиум кутии']),
  '🏴‍☠️'
ON CONFLICT (slug) DO NOTHING;

-- Sports Cards (sports-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Basketball Cards', 'Football Cards', 'Baseball Cards', 'Soccer Cards', 'Hockey Cards', 'Graded Cards', 'Hobby Boxes']),
  unnest(ARRAY['sports-basketball', 'sports-football', 'sports-baseball', 'sports-soccer', 'sports-hockey', 'sports-graded', 'sports-hobby']),
  (SELECT id FROM categories WHERE slug = 'sports-cards'),
  unnest(ARRAY['Баскетболни карти', 'Футболни карти', 'Бейзболни карти', 'Футболни карти', 'Хокейни карти', 'Оценени карти', 'Хоби кутии']),
  '⚽'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- RACING & SIMULATION L3 CATEGORIES
-- =====================================================

-- Racing Wheels (racing-wheels)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Entry-Level Wheels', 'Mid-Range Wheels', 'Direct Drive Wheels', 'Formula Wheels', 'GT Wheels', 'Wheel Bases', 'Wheel Rims']),
  unnest(ARRAY['racingwheel-entry', 'racingwheel-mid', 'racingwheel-directdrive', 'racingwheel-formula', 'racingwheel-gt', 'racingwheel-bases', 'racingwheel-rims']),
  (SELECT id FROM categories WHERE slug = 'racing-wheels'),
  unnest(ARRAY['Начални волани', 'Средни волани', 'Direct Drive волани', 'Formula волани', 'GT волани', 'Бази за волани', 'Рингове за волани']),
  '🏎️'
ON CONFLICT (slug) DO NOTHING;

-- Racing Cockpits (gaming-cockpits)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Full Cockpits', 'Wheel Stands', 'Seat Add-Ons', 'Cockpit Accessories', 'Folding Cockpits', 'Motion Simulators']),
  unnest(ARRAY['cockpit-full', 'cockpit-wheelstand', 'cockpit-seat', 'cockpit-accessories', 'cockpit-folding', 'cockpit-motion']),
  (SELECT id FROM categories WHERE slug = 'gaming-cockpits'),
  unnest(ARRAY['Пълни кокпити', 'Стойки за волан', 'Добавки за седалка', 'Аксесоари за кокпит', 'Сгъваеми кокпити', 'Симулатори с движение']),
  '🏎️'
ON CONFLICT (slug) DO NOTHING;

-- Fight Sticks (fight-sticks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Arcade Sticks', 'Hitbox Controllers', 'Mixbox Controllers', 'Leverless Controllers', 'Budget Fight Sticks', 'Premium Fight Sticks']),
  unnest(ARRAY['fightstick-arcade', 'fightstick-hitbox', 'fightstick-mixbox', 'fightstick-leverless', 'fightstick-budget', 'fightstick-premium']),
  (SELECT id FROM categories WHERE slug = 'fight-sticks'),
  unnest(ARRAY['Аркадни стикове', 'Hitbox контролери', 'Mixbox контролери', 'Без лостове контролери', 'Бюджетни стикове', 'Премиум стикове']),
  '🕹️'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- RETRO GAMING L3 CATEGORIES
-- =====================================================

-- Retro Consoles (retro-consoles)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nintendo NES/SNES', 'Sega Genesis', 'PlayStation 1/2', 'Nintendo 64', 'Game Boy', 'Atari', 'Neo Geo', 'Mini Consoles']),
  unnest(ARRAY['retro-nes-snes', 'retro-genesis', 'retro-ps1-ps2', 'retro-n64', 'retro-gameboy', 'retro-atari', 'retro-neogeo', 'retro-mini']),
  (SELECT id FROM categories WHERE slug = 'retro-consoles'),
  unnest(ARRAY['Nintendo NES/SNES', 'Sega Genesis', 'PlayStation 1/2', 'Nintendo 64', 'Game Boy', 'Atari', 'Neo Geo', 'Мини конзоли']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Retro Games (retro-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['NES Games', 'SNES Games', 'Genesis Games', 'PS1 Games', 'PS2 Games', 'N64 Games', 'Game Boy Games', 'Atari Games']),
  unnest(ARRAY['retrogame-nes', 'retrogame-snes', 'retrogame-genesis', 'retrogame-ps1', 'retrogame-ps2', 'retrogame-n64', 'retrogame-gameboy', 'retrogame-atari']),
  (SELECT id FROM categories WHERE slug = 'retro-games'),
  unnest(ARRAY['NES игри', 'SNES игри', 'Genesis игри', 'PS1 игри', 'PS2 игри', 'N64 игри', 'Game Boy игри', 'Atari игри']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Retro Accessories (retro-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Retro Controllers', 'AV Cables', 'Power Adapters', 'Memory Cards', 'Expansion Paks', 'Console Mods', 'Replacement Parts']),
  unnest(ARRAY['retroacc-controllers', 'retroacc-cables', 'retroacc-power', 'retroacc-memory', 'retroacc-expansion', 'retroacc-mods', 'retroacc-parts']),
  (SELECT id FROM categories WHERE slug = 'retro-accessories'),
  unnest(ARRAY['Ретро контролери', 'AV кабели', 'Захранвания', 'Карти памет', 'Expansion пакети', 'Модификации', 'Резервни части']),
  '🕹️'
ON CONFLICT (slug) DO NOTHING;

-- Retro Gaming (gaming-retro)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Retro Consoles', 'Retro Games', 'Retro Accessories', 'Emulation Hardware', 'Reproduction Carts']),
  unnest(ARRAY['gamingretro-consoles', 'gamingretro-games', 'gamingretro-acc', 'gamingretro-emulation', 'gamingretro-repro']),
  (SELECT id FROM categories WHERE slug = 'gaming-retro'),
  unnest(ARRAY['Ретро конзоли', 'Ретро игри', 'Ретро аксесоари', 'Емулационен хардуер', 'Репродукции']),
  '🕹️'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- REMAINING GAMING L3 CATEGORIES
-- =====================================================

-- Console Accessories (console-accessories-cat)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Controllers', 'Headsets', 'Charging Stations', 'Cases & Covers', 'Storage', 'Cables & Adapters', 'Skins & Decals']),
  unnest(ARRAY['consoleacc-controllers', 'consoleacc-headsets', 'consoleacc-charging', 'consoleacc-cases', 'consoleacc-storage', 'consoleacc-cables', 'consoleacc-skins']),
  (SELECT id FROM categories WHERE slug = 'console-accessories-cat'),
  unnest(ARRAY['Контролери', 'Слушалки', 'Зарядни станции', 'Калъфи', 'Съхранение', 'Кабели и адаптери', 'Скинове и декали']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Controllers (controllers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['PlayStation Controllers', 'Xbox Controllers', 'Nintendo Controllers', 'PC Controllers', 'Third-Party Controllers', 'Custom Controllers']),
  unnest(ARRAY['ctrl-playstation', 'ctrl-xbox', 'ctrl-nintendo', 'ctrl-pc', 'ctrl-thirdparty', 'ctrl-custom']),
  (SELECT id FROM categories WHERE slug = 'controllers'),
  unnest(ARRAY['PlayStation контролери', 'Xbox контролери', 'Nintendo контролери', 'PC контролери', 'Други контролери', 'Персонализирани контролери']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Handheld Gaming (handheld-gaming)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Steam Deck', 'ASUS ROG Ally', 'Nintendo Switch', 'Retro Handhelds', 'PlayStation Portal', 'Handheld Accessories']),
  unnest(ARRAY['handheld-steamdeck', 'handheld-rogally', 'handheld-switch', 'handheld-retro', 'handheld-portal', 'handheld-accessories']),
  (SELECT id FROM categories WHERE slug = 'handheld-gaming'),
  unnest(ARRAY['Steam Deck', 'ASUS ROG Ally', 'Nintendo Switch', 'Ретро преносими', 'PlayStation Portal', 'Аксесоари']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Bags & Cases (gaming-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Console Bags', 'Controller Cases', 'Laptop Gaming Bags', 'Headset Cases', 'VR Carrying Cases', 'Handheld Cases']),
  unnest(ARRAY['gamingbag-console', 'gamingbag-controller', 'gamingbag-laptop', 'gamingbag-headset', 'gamingbag-vr', 'gamingbag-handheld']),
  (SELECT id FROM categories WHERE slug = 'gaming-bags'),
  unnest(ARRAY['Чанти за конзоли', 'Калъфи за контролери', 'Чанти за гейминг лаптоп', 'Калъфи за слушалки', 'Чанти за VR', 'Калъфи за преносими']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Glasses (gaming-glasses)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Blue Light Blocking', 'Gaming Sunglasses', 'Prescription Gaming', 'Clip-On Gaming Lenses', 'Budget Gaming Glasses']),
  unnest(ARRAY['gglasses-bluelight', 'gglasses-sunglasses', 'gglasses-prescription', 'gglasses-clipon', 'gglasses-budget']),
  (SELECT id FROM categories WHERE slug = 'gaming-glasses'),
  unnest(ARRAY['Блокиращи синя светлина', 'Гейминг слънчеви очила', 'Очила с диоптър', 'Гейминг клипове', 'Бюджетни гейминг очила']),
  '👓'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Merchandise (gaming-merchandise)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['T-Shirts', 'Hoodies', 'Figures & Statues', 'Posters', 'Mugs', 'Collectibles', 'Plush Toys', 'Keychains']),
  unnest(ARRAY['gmerch-tshirts', 'gmerch-hoodies', 'gmerch-figures', 'gmerch-posters', 'gmerch-mugs', 'gmerch-collectibles', 'gmerch-plush', 'gmerch-keychains']),
  (SELECT id FROM categories WHERE slug = 'gaming-merchandise'),
  unnest(ARRAY['Тениски', 'Суитшърти', 'Фигури и статуи', 'Постери', 'Чаши', 'Колекционни', 'Плюшени играчки', 'Ключодържатели']),
  '🎁'
ON CONFLICT (slug) DO NOTHING;;
