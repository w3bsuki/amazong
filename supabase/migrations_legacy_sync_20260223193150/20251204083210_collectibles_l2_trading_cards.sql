
-- =====================================================
-- TRADING CARDS (Collectibles) L2 Categories
-- Focus on HIGH VALUE collectible/graded cards
-- =====================================================
DO $$ 
DECLARE
  trading_cards_id UUID;
BEGIN
  SELECT id INTO trading_cards_id FROM categories WHERE slug = 'coll-trading-cards';
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Pokémon Cards', 'Pokémon карти', 'coll-pokemon', trading_cards_id, '⚡', 1),
    ('Magic: The Gathering', 'Magic: The Gathering', 'coll-mtg', trading_cards_id, '🧙', 2),
    ('Yu-Gi-Oh!', 'Yu-Gi-Oh!', 'coll-yugioh', trading_cards_id, '🔮', 3),
    ('Sports Trading Cards', 'Спортни карти', 'coll-sports-cards', trading_cards_id, '🏆', 4),
    ('One Piece TCG', 'One Piece карти', 'coll-onepiece', trading_cards_id, '🏴‍☠️', 5),
    ('Dragon Ball Cards', 'Dragon Ball карти', 'coll-dragonball', trading_cards_id, '🐉', 6),
    ('Lorcana', 'Lorcana', 'coll-lorcana', trading_cards_id, '✨', 7),
    ('Flesh and Blood', 'Flesh and Blood', 'coll-fab', trading_cards_id, '⚔️', 8),
    ('Vintage Cards', 'Винтидж карти', 'coll-vintage-cards', trading_cards_id, '📜', 9),
    ('Graded Cards', 'Оценени карти', 'coll-graded-cards', trading_cards_id, '🏅', 10),
    ('Sealed Products', 'Запечатани продукти', 'coll-sealed-products', trading_cards_id, '📦', 11),
    ('Non-Sport Cards', 'Некласически карти', 'coll-non-sport-cards', trading_cards_id, '🎴', 12)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
END $$;
;
