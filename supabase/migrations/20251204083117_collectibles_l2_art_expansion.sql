
-- =====================================================
-- ART L2 Categories
-- =====================================================
DO $$ 
DECLARE
  art_id UUID;
BEGIN
  SELECT id INTO art_id FROM categories WHERE slug = 'art';
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Paintings', 'Картини', 'art-paintings', art_id, '🖼️', 1),
    ('Prints & Posters', 'Принтове и постери', 'art-prints', art_id, '🎨', 2),
    ('Sculptures', 'Скулптури', 'art-sculptures', art_id, '🗿', 3),
    ('Photography', 'Фотография', 'art-photography', art_id, '📷', 4),
    ('Drawings & Illustrations', 'Рисунки и илюстрации', 'art-drawings', art_id, '✏️', 5),
    ('Digital Art & NFTs', 'Дигитално изкуство и NFT', 'art-digital', art_id, '💻', 6),
    ('Mixed Media', 'Смесена техника', 'art-mixed-media', art_id, '🎭', 7),
    ('Folk Art', 'Народно изкуство', 'art-folk', art_id, '🏺', 8),
    ('Art Glass', 'Художествено стъкло', 'art-glass', art_id, '🪞', 9),
    ('Textiles & Fiber Art', 'Текстил и фибро изкуство', 'art-textiles', art_id, '🧵', 10)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
END $$;
;
