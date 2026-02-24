
-- Phase 5: Collectibles - Art & Antiques L3 Categories

-- Art > Paintings L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Oil Paintings', 'Acrylic Paintings', 'Watercolor Paintings', 'Abstract Art', 'Portrait Art', 'Landscape Art', 'Still Life', 'Modern Art']),
  unnest(ARRAY['art-paint-oil', 'art-paint-acrylic', 'art-paint-watercolor', 'art-paint-abstract', 'art-paint-portrait', 'art-paint-landscape', 'art-paint-stilllife', 'art-paint-modern']),
  (SELECT id FROM categories WHERE slug = 'art-paintings'),
  unnest(ARRAY['Маслени картини', 'Акрилни картини', 'Акварелни картини', 'Абстрактно изкуство', 'Портретно изкуство', 'Пейзажи', 'Натюрморт', 'Модерно изкуство']),
  '🎨',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Art > Sculptures L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Bronze Sculptures', 'Stone Sculptures', 'Wood Sculptures', 'Metal Sculptures', 'Glass Sculptures', 'Contemporary Sculptures', 'Miniature Sculptures']),
  unnest(ARRAY['art-sculpt-bronze', 'art-sculpt-stone', 'art-sculpt-wood', 'art-sculpt-metal', 'art-sculpt-glass', 'art-sculpt-contemporary', 'art-sculpt-miniature']),
  (SELECT id FROM categories WHERE slug = 'art-sculptures'),
  unnest(ARRAY['Бронзови скулптури', 'Каменни скулптури', 'Дървени скулптури', 'Метални скулптури', 'Стъклени скулптури', 'Съвременни скулптури', 'Миниатюрни скулптури']),
  '🗿',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Art > Photography L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Fine Art Photography', 'Documentary Photography', 'Portrait Photography', 'Landscape Photography', 'Vintage Photography', 'Black & White Photography', 'Limited Edition Prints']),
  unnest(ARRAY['art-photo-fineart', 'art-photo-documentary', 'art-photo-portrait', 'art-photo-landscape', 'art-photo-vintage', 'art-photo-bw', 'art-photo-limited']),
  (SELECT id FROM categories WHERE slug = 'art-photography'),
  unnest(ARRAY['Художествена фотография', 'Документална фотография', 'Портретна фотография', 'Пейзажна фотография', 'Винтидж фотография', 'Черно-бяла фотография', 'Лимитирани принтове']),
  '📷',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Art > Prints & Posters L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Lithographs', 'Screen Prints', 'Etchings', 'Woodcuts', 'Giclée Prints', 'Vintage Posters', 'Movie Posters', 'Concert Posters']),
  unnest(ARRAY['art-prints-litho', 'art-prints-screen', 'art-prints-etching', 'art-prints-woodcut', 'art-prints-giclee', 'art-prints-vintage', 'art-prints-movie', 'art-prints-concert']),
  (SELECT id FROM categories WHERE slug = 'art-prints'),
  unnest(ARRAY['Литографии', 'Ситопечат', 'Офорти', 'Дърворезби', 'Жикле принтове', 'Винтидж постери', 'Филмови постери', 'Концертни постери']),
  '🖼️',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Antiques > Antique Furniture L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Victorian Furniture', 'Art Deco Furniture', 'Georgian Furniture', 'French Antiques', 'Colonial Furniture', 'Rustic Antiques', 'Industrial Antiques']),
  unnest(ARRAY['antiques-furn-victorian', 'antiques-furn-artdeco', 'antiques-furn-georgian', 'antiques-furn-french', 'antiques-furn-colonial', 'antiques-furn-rustic', 'antiques-furn-industrial']),
  (SELECT id FROM categories WHERE slug = 'antiques-furniture'),
  unnest(ARRAY['Викторианска мебел', 'Арт деко мебел', 'Георгианска мебел', 'Френски антики', 'Колониална мебел', 'Рустик антики', 'Индустриални антики']),
  '🪑',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Antiques > Antique Jewelry L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Victorian Jewelry', 'Art Nouveau Jewelry', 'Art Deco Jewelry', 'Edwardian Jewelry', 'Estate Jewelry', 'Mourning Jewelry', 'Cameo Jewelry']),
  unnest(ARRAY['antiques-jew-victorian', 'antiques-jew-nouveau', 'antiques-jew-artdeco', 'antiques-jew-edwardian', 'antiques-jew-estate', 'antiques-jew-mourning', 'antiques-jew-cameo']),
  (SELECT id FROM categories WHERE slug = 'antiques-jewelry'),
  unnest(ARRAY['Викторианско бижу', 'Арт ново бижу', 'Арт деко бижу', 'Едуардианско бижу', 'Имотно бижу', 'Траурно бижу', 'Камея бижу']),
  '💎',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Antiques > Antique Clocks L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Grandfather Clocks', 'Mantel Clocks', 'Wall Clocks', 'Pocket Watches', 'Carriage Clocks', 'Cuckoo Clocks', 'Ship Clocks']),
  unnest(ARRAY['antiques-clock-grandfather', 'antiques-clock-mantel', 'antiques-clock-wall', 'antiques-clock-pocket', 'antiques-clock-carriage', 'antiques-clock-cuckoo', 'antiques-clock-ship']),
  (SELECT id FROM categories WHERE slug = 'antiques-clocks'),
  unnest(ARRAY['Дядови часовници', 'Каминни часовници', 'Стенни часовници', 'Джобни часовници', 'Пътни часовници', 'Часовници кукувица', 'Корабни часовници']),
  '🕰️',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Antiques > Vintage Porcelain L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Meissen Porcelain', 'Limoges Porcelain', 'Royal Copenhagen', 'Wedgwood', 'Chinese Porcelain', 'Japanese Porcelain', 'Delft Pottery']),
  unnest(ARRAY['antiques-porc-meissen', 'antiques-porc-limoges', 'antiques-porc-copenhagen', 'antiques-porc-wedgwood', 'antiques-porc-chinese', 'antiques-porc-japanese', 'antiques-porc-delft']),
  (SELECT id FROM categories WHERE slug = 'antiques-porcelain'),
  unnest(ARRAY['Мейсенски порцелан', 'Лимож порцелан', 'Роял Копенхаген', 'Уеджууд', 'Китайски порцелан', 'Японски порцелан', 'Делфтска керамика']),
  '🏺',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;
;
