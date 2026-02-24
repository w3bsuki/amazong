
-- =====================================================
-- ART & ANTIQUES L3 Categories
-- =====================================================
DO $$ 
DECLARE
  paintings_id UUID;
  sculptures_id UUID;
  coins_gold_id UUID;
  coins_ancient_id UUID;
BEGIN
  SELECT id INTO paintings_id FROM categories WHERE slug = 'art-paintings';
  SELECT id INTO sculptures_id FROM categories WHERE slug = 'art-sculptures';
  SELECT id INTO coins_gold_id FROM categories WHERE slug = 'coins-gold';
  SELECT id INTO coins_ancient_id FROM categories WHERE slug = 'coins-ancient';
  
  -- Paintings L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Oil Paintings', 'Маслени картини', 'paintings-oil', paintings_id, 1),
    ('Acrylic Paintings', 'Акрилни картини', 'paintings-acrylic', paintings_id, 2),
    ('Watercolor Paintings', 'Акварелни картини', 'paintings-watercolor', paintings_id, 3),
    ('Abstract Paintings', 'Абстрактни картини', 'paintings-abstract', paintings_id, 4),
    ('Portrait Paintings', 'Портрети', 'paintings-portrait', paintings_id, 5),
    ('Landscape Paintings', 'Пейзажи', 'paintings-landscape', paintings_id, 6),
    ('Modern Art Paintings', 'Модерни картини', 'paintings-modern', paintings_id, 7),
    ('Bulgarian Art', 'Българско изкуство', 'paintings-bulgarian', paintings_id, 8)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
    
  -- Sculptures L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bronze Sculptures', 'Бронзови скулптури', 'sculptures-bronze', sculptures_id, 1),
    ('Stone Sculptures', 'Каменни скулптури', 'sculptures-stone', sculptures_id, 2),
    ('Wood Sculptures', 'Дървени скулптури', 'sculptures-wood', sculptures_id, 3),
    ('Modern Sculptures', 'Модерни скулптури', 'sculptures-modern', sculptures_id, 4),
    ('Figurines', 'Фигурки', 'sculptures-figurines', sculptures_id, 5)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
    
  -- Gold Coins L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('American Gold Eagles', 'Американски златни орли', 'gold-eagles', coins_gold_id, 1),
    ('Canadian Gold Maple Leaf', 'Канадски златен кленов лист', 'gold-maple', coins_gold_id, 2),
    ('South African Krugerrand', 'Южноафрикански крюгеранд', 'gold-krugerrand', coins_gold_id, 3),
    ('Austrian Philharmonic', 'Австрийска филхармония', 'gold-philharmonic', coins_gold_id, 4),
    ('Chinese Gold Panda', 'Китайска златна панда', 'gold-panda', coins_gold_id, 5),
    ('British Sovereign', 'Британски соверин', 'gold-sovereign', coins_gold_id, 6),
    ('Rare Gold Coins', 'Редки златни монети', 'gold-rare', coins_gold_id, 7)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
    
  -- Ancient Coins L3
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Roman Coins', 'Римски монети', 'ancient-roman', coins_ancient_id, 1),
    ('Greek Coins', 'Гръцки монети', 'ancient-greek', coins_ancient_id, 2),
    ('Byzantine Coins', 'Византийски монети', 'ancient-byzantine', coins_ancient_id, 3),
    ('Thracian Coins', 'Тракийски монети', 'ancient-thracian', coins_ancient_id, 4),
    ('Medieval Coins', 'Средновековни монети', 'ancient-medieval', coins_ancient_id, 5),
    ('Celtic Coins', 'Келтски монети', 'ancient-celtic', coins_ancient_id, 6)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order;
END $$;
;
