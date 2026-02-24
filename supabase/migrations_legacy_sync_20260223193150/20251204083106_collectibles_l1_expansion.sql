
-- =====================================================
-- COLLECTIBLES EXPANSION - L1 Categories
-- =====================================================
-- This migration adds new L1 categories under Collectibles
-- to capture the full spectrum of collectible items

-- Get collectibles parent ID
DO $$ 
DECLARE
  collectibles_id UUID;
BEGIN
  SELECT id INTO collectibles_id FROM categories WHERE slug = 'collectibles';
  
  -- Add new L1 categories (keeping existing ones)
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg) VALUES
    -- Trading Cards (separate from hobby TCG - focus on HIGH VALUE collectible cards)
    ('Trading Cards', 'Колекционерски карти', 'coll-trading-cards', collectibles_id, '🃏', 8, 'Valuable trading cards and graded cards', 'Ценни колекционерски карти и оценени карти'),
    -- Autographs & Signed Items  
    ('Autographs & Signed Items', 'Автографи и подписани вещи', 'coll-autographs', collectibles_id, '✍️', 9, 'Authenticated autographs and signed memorabilia', 'Автентични автографи и подписани сувенири'),
    -- Comics & Graphic Novels
    ('Comics & Graphic Novels', 'Комикси и графични романи', 'coll-comics', collectibles_id, '📚', 10, 'Collectible comics, manga, and graphic novels', 'Колекционерски комикси, манга и графични романи'),
    -- Collectible Toys & Figures
    ('Collectible Toys & Figures', 'Колекционерски играчки и фигурки', 'coll-toys', collectibles_id, '🤖', 11, 'Vintage toys, action figures, Funko Pops, and collectible figurines', 'Винтидж играчки, екшън фигурки, Funko Pop и колекционерски фигурки'),
    -- Rare & Limited Items
    ('Rare & Limited Items', 'Редки и лимитирани вещи', 'coll-rare', collectibles_id, '💎', 12, 'Rare finds, limited editions, and one-of-a-kind collectibles', 'Редки находки, лимитирани издания и уникални колекционерски вещи'),
    -- Vintage Electronics
    ('Vintage Electronics', 'Винтидж електроника', 'coll-vintage-electronics', collectibles_id, '📻', 13, 'Retro tech, vintage audio, classic cameras and gaming', 'Ретро техника, винтидж аудио, класически фотоапарати и игри'),
    -- Militaria
    ('Militaria', 'Милитария', 'coll-militaria', collectibles_id, '🎖️', 14, 'Military collectibles, medals, uniforms, and historical items', 'Военни колекционерски предмети, медали, униформи и исторически вещи')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order,
    description = EXCLUDED.description,
    description_bg = EXCLUDED.description_bg;
END $$;
;
