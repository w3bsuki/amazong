-- Restore more L3 categories for Sports, Collectibles, Services

-- Sports & Outdoors L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Exercise & Fitness subcategories
  ('Cardio Equipment', 'cardio-equipment', 'Кардио оборудване', 'fitness-equipment', 1),
  ('Strength Training', 'strength-training', 'Силови тренировки', 'fitness-equipment', 2),
  ('Yoga & Pilates', 'yoga-pilates', 'Йога и пилатес', 'fitness-equipment', 3),
  ('Exercise Bikes', 'exercise-bikes', 'Фитнес велосипеди', 'fitness-equipment', 4),
  ('Treadmills', 'treadmills', 'Бягащи пътеки', 'fitness-equipment', 5),
  ('Ellipticals', 'ellipticals', 'Елиптични тренажори', 'fitness-equipment', 6),
  ('Resistance Bands', 'resistance-bands', 'Ластици за съпротивление', 'fitness-equipment', 7),
  
  -- Team Sports subcategories
  ('Football/Soccer', 'football-soccer', 'Футбол', 'team-sports', 1),
  ('Basketball', 'basketball-equip', 'Баскетбол', 'team-sports', 2),
  ('Volleyball', 'volleyball-equip', 'Волейбол', 'team-sports', 3),
  ('Baseball & Softball', 'baseball-softball', 'Бейзбол и софтбол', 'team-sports', 4),
  ('Hockey', 'hockey-equip', 'Хокей', 'team-sports', 5),
  ('Rugby', 'rugby-equip', 'Ръгби', 'team-sports', 6),
  
  -- Water Sports subcategories
  ('Swimming', 'swimming-equip', 'Плуване', 'water-sports', 1),
  ('Surfing', 'surfing-equip', 'Сърфиране', 'water-sports', 2),
  ('Kayaking & Canoeing', 'kayaking-canoeing', 'Каякинг и кану', 'water-sports', 3),
  ('Fishing', 'fishing-equip', 'Риболов', 'water-sports', 4),
  ('Diving & Snorkeling', 'diving-snorkeling', 'Гмуркане', 'water-sports', 5),
  ('Wakeboarding', 'wakeboarding', 'Уейкборд', 'water-sports', 6),
  
  -- Winter Sports subcategories
  ('Skiing Equipment', 'skiing-equipment', 'Ски оборудване', 'winter-sports', 1),
  ('Snowboarding Equipment', 'snowboarding-equipment', 'Сноуборд оборудване', 'winter-sports', 2),
  ('Ice Skating', 'ice-skating', 'Кънки на лед', 'winter-sports', 3),
  ('Cross-Country Skiing', 'cross-country-skiing', 'Ски бягане', 'winter-sports', 4),
  ('Winter Clothing', 'winter-sports-clothing', 'Облекло за зимни спортове', 'winter-sports', 5),
  
  -- Outdoor Recreation subcategories
  ('Hiking Gear', 'hiking-gear', 'Екипировка за туризъм', 'camping-outdoors', 1),
  ('Camping Gear', 'camping-gear-cat', 'Екипировка за къмпинг', 'camping-outdoors', 2),
  ('Climbing Gear', 'climbing-gear', 'Екипировка за катерене', 'camping-outdoors', 3),
  ('Hunting Gear', 'hunting-gear', 'Екипировка за лов', 'camping-outdoors', 4),
  ('Backpacks Outdoor', 'backpacks-outdoor', 'Раници за планина', 'camping-outdoors', 5)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- Collectibles L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Trading Cards subcategories
  ('Pokemon Cards', 'pokemon-cards', 'Pokemon карти', 'trading-cards', 1),
  ('Yu-Gi-Oh Cards', 'yugioh-cards', 'Yu-Gi-Oh карти', 'trading-cards', 2),
  ('Magic The Gathering', 'mtg-cards', 'Magic: The Gathering', 'trading-cards', 3),
  ('Sports Trading Cards', 'sports-trading-cards', 'Спортни карти', 'trading-cards', 4),
  ('One Piece Cards', 'one-piece-cards', 'One Piece карти', 'trading-cards', 5),
  ('Dragon Ball Cards', 'dragonball-cards', 'Dragon Ball карти', 'trading-cards', 6),
  
  -- Coins subcategories
  ('Bulgarian Coins', 'bulgarian-coins', 'Български монети', 'coins', 1),
  ('World Coins', 'world-coins', 'Световни монети', 'coins', 2),
  ('Ancient Coins', 'ancient-coins', 'Антични монети', 'coins', 3),
  ('Gold Coins', 'gold-coins', 'Златни монети', 'coins', 4),
  ('Silver Coins', 'silver-coins', 'Сребърни монети', 'coins', 5),
  ('Banknotes', 'banknotes', 'Банкноти', 'coins', 6),
  
  -- Comics subcategories
  ('Marvel Comics', 'marvel-comics', 'Marvel комикси', 'comics', 1),
  ('DC Comics', 'dc-comics', 'DC комикси', 'comics', 2),
  ('Manga', 'manga-comics', 'Манга', 'comics', 3),
  ('Indie Comics', 'indie-comics', 'Независими комикси', 'comics', 4),
  ('Vintage Comics', 'vintage-comics', 'Винтидж комикси', 'comics', 5),
  
  -- Antiques subcategories
  ('Vintage Furniture', 'vintage-furniture', 'Винтидж мебели', 'antiques', 1),
  ('Vintage Art', 'vintage-art', 'Винтидж изкуство', 'antiques', 2),
  ('Vintage Jewelry', 'vintage-jewelry', 'Винтидж бижута', 'antiques', 3),
  ('Vintage Pottery', 'vintage-pottery', 'Винтидж керамика', 'antiques', 4),
  ('Vintage Clocks', 'vintage-clocks', 'Винтидж часовници', 'antiques', 5),
  ('Vintage Books', 'vintage-books', 'Винтидж книги', 'antiques', 6)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- Services L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Home Services subcategories
  ('Plumbing Services', 'plumbing-services', 'ВиК услуги', 'home-services', 1),
  ('Electrical Services', 'electrical-services', 'Ел. услуги', 'home-services', 2),
  ('Cleaning Services', 'cleaning-services', 'Услуги почистване', 'home-services', 3),
  ('Painting Services', 'painting-services', 'Боядисване', 'home-services', 4),
  ('Moving Services', 'moving-services', 'Преместване', 'home-services', 5),
  ('Landscaping Services', 'landscaping-services', 'Озеленяване', 'home-services', 6),
  ('HVAC Services', 'hvac-services', 'Климатизация', 'home-services', 7),
  ('Handyman Services', 'handyman-services', 'Майстор', 'home-services', 8),
  
  -- Professional Services subcategories
  ('Legal Services', 'legal-services', 'Правни услуги', 'professional-services', 1),
  ('Accounting Services', 'accounting-services', 'Счетоводни услуги', 'professional-services', 2),
  ('Translation Services', 'translation-services', 'Преводи', 'professional-services', 3),
  ('Marketing Services', 'marketing-services', 'Маркетинг услуги', 'professional-services', 4),
  ('IT Services', 'it-services', 'IT услуги', 'professional-services', 5),
  ('Design Services', 'design-services', 'Дизайн услуги', 'professional-services', 6),
  ('Photography Services', 'photography-services', 'Фото услуги', 'professional-services', 7),
  ('Tutoring Services', 'tutoring-services', 'Уроци', 'professional-services', 8),
  
  -- Events Services subcategories
  ('DJ Services', 'dj-services', 'DJ услуги', 'events-services', 1),
  ('Catering Services', 'catering-services', 'Кетъринг', 'events-services', 2),
  ('Event Photography', 'event-photography', 'Фото за събития', 'events-services', 3),
  ('Event Planning', 'event-planning', 'Организация събития', 'events-services', 4),
  ('Decoration Services', 'decoration-services', 'Декорация', 'events-services', 5),
  ('Live Music', 'live-music-services', 'Жива музика', 'events-services', 6),
  ('MC & Host', 'mc-host-services', 'Водещ', 'events-services', 7)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;;
