
-- =====================================================
-- ANTIQUES L2 Categories (expand existing)
-- =====================================================
DO $$ 
DECLARE
  antiques_id UUID;
BEGIN
  SELECT id INTO antiques_id FROM categories WHERE slug = 'antiques';
  
  -- Add additional L2 under antiques (some already exist)
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Antique Jewelry', 'Антикварни бижута', 'antiques-jewelry', antiques_id, '💍', 5),
    ('Antique Silverware', 'Антикварно сребро', 'antiques-silverware', antiques_id, '🥄', 6),
    ('Antique Books & Maps', 'Антикварни книги и карти', 'antiques-books', antiques_id, '📖', 7),
    ('Antique Textiles', 'Антикварен текстил', 'antiques-textiles', antiques_id, '🧵', 8),
    ('Antique Scientific Instruments', 'Антикварни научни инструменти', 'antiques-scientific', antiques_id, '🔬', 9),
    ('Antique Asian Art', 'Антикварно азиатско изкуство', 'antiques-asian', antiques_id, '🏯', 10),
    ('Antique Rugs & Carpets', 'Антикварни килими', 'antiques-rugs', antiques_id, '🏠', 11),
    ('Antique Lighting', 'Антикварно осветление', 'antiques-lighting', antiques_id, '💡', 12),
    ('Decorative Objects', 'Декоративни предмети', 'antiques-decorative', antiques_id, '🏺', 13)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
END $$;
;
