
-- =====================================================
-- COINS & CURRENCY L2 Categories
-- =====================================================
DO $$ 
DECLARE
  coins_id UUID;
  stamps_id UUID;
BEGIN
  SELECT id INTO coins_id FROM categories WHERE slug = 'coins-currency';
  SELECT id INTO stamps_id FROM categories WHERE slug = 'stamps';
  
  -- Coins & Currency L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Gold Coins', 'Златни монети', 'coins-gold', coins_id, '🪙', 1),
    ('Silver Coins', 'Сребърни монети', 'coins-silver', coins_id, '🥈', 2),
    ('Ancient Coins', 'Антични монети', 'coins-ancient', coins_id, '🏛️', 3),
    ('World Coins', 'Световни монети', 'coins-world', coins_id, '🌍', 4),
    ('US Coins', 'Американски монети', 'coins-us', coins_id, '🇺🇸', 5),
    ('European Coins', 'Европейски монети', 'coins-european', coins_id, '🇪🇺', 6),
    ('Bulgarian Coins', 'Български монети', 'coins-bulgarian', coins_id, '🇧🇬', 7),
    ('Paper Money', 'Хартиени пари', 'coins-paper-money', coins_id, '💵', 8),
    ('Bullion', 'Кюлчета', 'coins-bullion', coins_id, '🏆', 9),
    ('Coin Sets', 'Комплекти монети', 'coins-sets', coins_id, '📦', 10),
    ('Coin Supplies', 'Консумативи за монети', 'coins-supplies', coins_id, '🛠️', 11)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
    
  -- Stamps L2 expansion (some exist)
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('US Stamps', 'Американски марки', 'stamps-us', stamps_id, '🇺🇸', 4),
    ('Worldwide Stamps', 'Световни марки', 'stamps-worldwide', stamps_id, '🌍', 5),
    ('First Day Covers', 'Първодневни пликове', 'stamps-fdc', stamps_id, '✉️', 6),
    ('Stamp Collections', 'Колекции марки', 'stamps-collections', stamps_id, '📁', 7),
    ('Stamp Supplies', 'Консумативи за марки', 'stamps-supplies', stamps_id, '🛠️', 8),
    ('Postal History', 'Пощенска история', 'stamps-postal-history', stamps_id, '📬', 9)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
END $$;
;
