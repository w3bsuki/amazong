
-- =====================================================
-- RARE ITEMS, VINTAGE ELECTRONICS, MILITARIA L2
-- =====================================================
DO $$ 
DECLARE
  rare_id UUID;
  vintage_elec_id UUID;
  militaria_id UUID;
  vintage_clothing_id UUID;
BEGIN
  SELECT id INTO rare_id FROM categories WHERE slug = 'coll-rare';
  SELECT id INTO vintage_elec_id FROM categories WHERE slug = 'coll-vintage-electronics';
  SELECT id INTO militaria_id FROM categories WHERE slug = 'coll-militaria';
  SELECT id INTO vintage_clothing_id FROM categories WHERE slug = 'vintage-clothing';
  
  -- Rare & Limited Items L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Limited Editions', 'Лимитирани издания', 'rare-limited', rare_id, '🏷️', 1),
    ('One-of-a-Kind Items', 'Уникални предмети', 'rare-unique', rare_id, '⭐', 2),
    ('Prototype Items', 'Прототипи', 'rare-prototypes', rare_id, '🔧', 3),
    ('Error Items', 'Грешки в производството', 'rare-errors', rare_id, '❌', 4),
    ('Convention Exclusives', 'Конвенционни ексклузиви', 'rare-convention', rare_id, '🎪', 5),
    ('First Editions', 'Първи издания', 'rare-first-editions', rare_id, '1️⃣', 6),
    ('Promotional Items', 'Промоционални предмети', 'rare-promo', rare_id, '🎁', 7),
    ('Lost & Found Treasures', 'Изгубени и намерени съкровища', 'rare-treasures', rare_id, '💰', 8)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
    
  -- Vintage Electronics L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Vintage Audio', 'Винтидж аудио', 'vintage-audio', vintage_elec_id, '🎵', 1),
    ('Vintage Cameras', 'Винтидж фотоапарати', 'vintage-cameras', vintage_elec_id, '📷', 2),
    ('Vintage Computers', 'Винтидж компютри', 'vintage-computers', vintage_elec_id, '💾', 3),
    ('Vintage Gaming', 'Винтидж гейминг', 'vintage-gaming', vintage_elec_id, '🕹️', 4),
    ('Vintage Radios', 'Винтидж радиа', 'vintage-radios', vintage_elec_id, '📻', 5),
    ('Vintage Telephones', 'Винтидж телефони', 'vintage-phones', vintage_elec_id, '📞', 6),
    ('Vintage TVs', 'Винтидж телевизори', 'vintage-tvs', vintage_elec_id, '📺', 7),
    ('Vintage Watches & Clocks', 'Винтидж часовници', 'vintage-watches', vintage_elec_id, '⏰', 8)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
    
  -- Militaria L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Military Medals & Badges', 'Военни медали и значки', 'militaria-medals', militaria_id, '🎖️', 1),
    ('Military Uniforms', 'Военни униформи', 'militaria-uniforms', militaria_id, '👔', 2),
    ('Military Helmets & Headgear', 'Военни каски', 'militaria-helmets', militaria_id, '🪖', 3),
    ('Military Weapons (Deactivated)', 'Военно оръжие (деактивирано)', 'militaria-weapons', militaria_id, '⚔️', 4),
    ('Military Documents', 'Военни документи', 'militaria-documents', militaria_id, '📄', 5),
    ('Military Flags & Patches', 'Военни знамена и нашивки', 'militaria-flags', militaria_id, '🚩', 6),
    ('WWI Items', 'Предмети от ПСВ', 'militaria-ww1', militaria_id, '🌍', 7),
    ('WWII Items', 'Предмети от ВСВ', 'militaria-ww2', militaria_id, '✈️', 8),
    ('Civil War Items', 'Предмети от Гражданска война', 'militaria-civilwar', militaria_id, '🇺🇸', 9),
    ('Bulgarian Military', 'Българска военна история', 'militaria-bulgarian', militaria_id, '🇧🇬', 10)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
    
  -- Vintage Clothing L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Vintage Dresses', 'Винтидж рокли', 'vintage-dresses', vintage_clothing_id, '👗', 1),
    ('Vintage Jackets & Coats', 'Винтидж якета и палта', 'vintage-jackets', vintage_clothing_id, '🧥', 2),
    ('Vintage Denim', 'Винтидж деним', 'vintage-denim', vintage_clothing_id, '👖', 3),
    ('Vintage T-Shirts', 'Винтидж тениски', 'vintage-tshirts', vintage_clothing_id, '👕', 4),
    ('Vintage Accessories', 'Винтидж аксесоари', 'vintage-accessories', vintage_clothing_id, '👜', 5),
    ('Vintage Shoes', 'Винтидж обувки', 'vintage-shoes', vintage_clothing_id, '👠', 6),
    ('Designer Vintage', 'Дизайнерски винтидж', 'vintage-designer', vintage_clothing_id, '✨', 7),
    ('Band & Tour Merchandise', 'Групов и турне мърч', 'vintage-band-merch', vintage_clothing_id, '🎸', 8)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
END $$;
;
