
-- ============================================================
-- FASHION EXPANSION - PART 3: Watches
-- ============================================================
-- Adding comprehensive Watches L1 category with full L2/L3 hierarchy

DO $$
DECLARE
  fashion_id UUID;
  watches_id UUID;
  luxury_id UUID;
  dress_id UUID;
  sport_id UUID;
  smart_id UUID;
  casual_id UUID;
  vintage_id UUID;
  pocket_id UUID;
  straps_id UUID;
  watch_acc_id UUID;
  brands_id UUID;
BEGIN
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
  
  -- ============================================================
  -- L1: Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
  VALUES ('Watches', 'Часовници', 'fashion-watches-main', fashion_id, '⌚', 7, 'Luxury, sport, smart and vintage watches', 'Луксозни, спортни, смарт и винтидж часовници')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO watches_id;
  
  -- ============================================================
  -- L2: Luxury Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Luxury Watches', 'Луксозни часовници', 'watches-luxury', watches_id, '💎', 1, 'High-end Swiss and designer timepieces')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO luxury_id;
  
  -- L3: Luxury watch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Swiss Watches', 'Швейцарски часовници', 'luxury-swiss', luxury_id, 1),
    ('Rolex', 'Ролекс', 'luxury-rolex', luxury_id, 2),
    ('Omega', 'Омега', 'luxury-omega', luxury_id, 3),
    ('Cartier', 'Картие', 'luxury-cartier', luxury_id, 4),
    ('Tag Heuer', 'Таг Хойер', 'luxury-tag-heuer', luxury_id, 5),
    ('Breitling', 'Брайтлинг', 'luxury-breitling', luxury_id, 6),
    ('Patek Philippe', 'Патек Филип', 'luxury-patek', luxury_id, 7),
    ('Audemars Piguet', 'Одемар Пиге', 'luxury-audemars', luxury_id, 8),
    ('IWC', 'IWC', 'luxury-iwc', luxury_id, 9),
    ('Jaeger-LeCoultre', 'Жегер-ЛеКултр', 'luxury-jaeger', luxury_id, 10),
    ('Tudor', 'Тудор', 'luxury-tudor', luxury_id, 11),
    ('Longines', 'Лонжин', 'luxury-longines', luxury_id, 12),
    ('Tissot', 'Тисо', 'luxury-tissot', luxury_id, 13),
    ('Other Luxury Brands', 'Други луксозни марки', 'luxury-other', luxury_id, 14)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Dress Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Dress Watches', 'Официални часовници', 'watches-dress', watches_id, '👔', 2, 'Elegant watches for formal occasions')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO dress_id;
  
  -- L3: Dress watch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Classic Dress Watches', 'Класически официални', 'dress-classic', dress_id, 1),
    ('Minimalist Watches', 'Минималистични часовници', 'dress-minimalist', dress_id, 2),
    ('Gold Watches', 'Златни часовници', 'dress-gold', dress_id, 3),
    ('Thin Watches', 'Тънки часовници', 'dress-thin', dress_id, 4),
    ('Diamond Watches', 'Часовници с диаманти', 'dress-diamond', dress_id, 5),
    ('Leather Strap Dress', 'С кожена каишка', 'dress-leather', dress_id, 6),
    ('Metal Bracelet Dress', 'С метална гривна', 'dress-metal', dress_id, 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Sport Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Sport Watches', 'Спортни часовници', 'watches-sport', watches_id, '🏃', 3, 'Durable watches for active lifestyles')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO sport_id;
  
  -- L3: Sport watch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dive Watches', 'Водолазни часовници', 'sport-dive', sport_id, 1),
    ('Chronograph Watches', 'Хронографи', 'sport-chronograph', sport_id, 2),
    ('Running Watches', 'Часовници за бягане', 'sport-running', sport_id, 3),
    ('GPS Watches', 'GPS часовници', 'sport-gps', sport_id, 4),
    ('Aviation Watches', 'Авиационни часовници', 'sport-aviation', sport_id, 5),
    ('Military Watches', 'Военни часовници', 'sport-military', sport_id, 6),
    ('Field Watches', 'Полеви часовници', 'sport-field', sport_id, 7),
    ('Racing Watches', 'Състезателни часовници', 'sport-racing', sport_id, 8),
    ('G-Shock', 'G-Shock', 'sport-gshock', sport_id, 9),
    ('Outdoor Watches', 'Аутдор часовници', 'sport-outdoor', sport_id, 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Smart Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Smart Watches', 'Смарт часовници', 'watches-smart', watches_id, '📱', 4, 'Connected watches with smart features')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO smart_id;
  
  -- L3: Smart watch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Apple Watch', 'Apple Watch', 'smart-apple', smart_id, 1),
    ('Samsung Galaxy Watch', 'Samsung Galaxy Watch', 'smart-samsung', smart_id, 2),
    ('Garmin Smartwatches', 'Garmin смарт часовници', 'smart-garmin', smart_id, 3),
    ('Fitbit Watches', 'Fitbit часовници', 'smart-fitbit', smart_id, 4),
    ('Amazfit Watches', 'Amazfit часовници', 'smart-amazfit', smart_id, 5),
    ('Huawei Watches', 'Huawei часовници', 'smart-huawei', smart_id, 6),
    ('Google Pixel Watch', 'Google Pixel Watch', 'smart-pixel', smart_id, 7),
    ('Wear OS Watches', 'Wear OS часовници', 'smart-wearos', smart_id, 8),
    ('Hybrid Smartwatches', 'Хибридни смарт часовници', 'smart-hybrid', smart_id, 9),
    ('Fitness Trackers', 'Фитнес тракери', 'smart-fitness', smart_id, 10),
    ('Kids Smartwatches', 'Детски смарт часовници', 'smart-kids', smart_id, 11)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Casual Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Casual Watches', 'Ежедневни часовници', 'watches-casual', watches_id, '⏰', 5, 'Everyday watches for casual wear')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO casual_id;
  
  -- L3: Casual watch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fashion Watches', 'Модни часовници', 'casual-fashion', casual_id, 1),
    ('Digital Watches', 'Дигитални часовници', 'casual-digital', casual_id, 2),
    ('Analog Watches', 'Аналогови часовници', 'casual-analog', casual_id, 3),
    ('Quartz Watches', 'Кварцови часовници', 'casual-quartz', casual_id, 4),
    ('Automatic Watches', 'Автоматични часовници', 'casual-automatic', casual_id, 5),
    ('Wooden Watches', 'Дървени часовници', 'casual-wooden', casual_id, 6),
    ('Ceramic Watches', 'Керамични часовници', 'casual-ceramic', casual_id, 7),
    ('Colorful Watches', 'Цветни часовници', 'casual-colorful', casual_id, 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Vintage & Antique Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Vintage & Antique Watches', 'Винтидж и антикварни часовници', 'watches-vintage', watches_id, '🕰️', 6, 'Collectible and antique timepieces')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO vintage_id;
  
  -- L3: Vintage watch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Vintage Rolex', 'Винтидж Ролекс', 'vintage-rolex', vintage_id, 1),
    ('Vintage Omega', 'Винтидж Омега', 'vintage-omega', vintage_id, 2),
    ('Vintage Seiko', 'Винтидж Сейко', 'vintage-seiko', vintage_id, 3),
    ('Soviet Watches', 'Съветски часовници', 'vintage-soviet', vintage_id, 4),
    ('Antique Watches', 'Антикварни часовници', 'vintage-antique', vintage_id, 5),
    ('Restored Watches', 'Реставрирани часовници', 'vintage-restored', vintage_id, 6),
    ('Pre-Owned Luxury', 'Употребявани луксозни', 'vintage-preowned', vintage_id, 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Pocket Watches
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Pocket Watches', 'Джобни часовници', 'watches-pocket', watches_id, '🕐', 7, 'Classic pocket timepieces')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO pocket_id;
  
  -- L3: Pocket watch subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Vintage Pocket Watches', 'Винтидж джобни', 'pocket-vintage', pocket_id, 1),
    ('Modern Pocket Watches', 'Модерни джобни', 'pocket-modern', pocket_id, 2),
    ('Hunter Case Pocket', 'Хънтър джобни', 'pocket-hunter', pocket_id, 3),
    ('Open Face Pocket', 'Открит циферблат', 'pocket-open', pocket_id, 4),
    ('Pocket Watch Chains', 'Вериги за джобен часовник', 'pocket-chains', pocket_id, 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Watch Straps & Bands
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Watch Straps & Bands', 'Каишки за часовници', 'watches-straps', watches_id, '⌚', 8, 'Replacement straps and bands')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO straps_id;
  
  -- L3: Watch strap subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Leather Watch Straps', 'Кожени каишки', 'straps-leather', straps_id, 1),
    ('NATO Straps', 'НАТО каишки', 'straps-nato', straps_id, 2),
    ('Silicone/Rubber Straps', 'Силиконови каишки', 'straps-silicone', straps_id, 3),
    ('Metal Watch Bands', 'Метални гривни', 'straps-metal', straps_id, 4),
    ('Mesh Watch Bands', 'Мрежести гривни', 'straps-mesh', straps_id, 5),
    ('Canvas Straps', 'Платнени каишки', 'straps-canvas', straps_id, 6),
    ('Apple Watch Bands', 'Каишки за Apple Watch', 'straps-apple', straps_id, 7),
    ('Samsung Watch Bands', 'Каишки за Samsung Watch', 'straps-samsung', straps_id, 8),
    ('Quick Release Straps', 'Бързосменяеми каишки', 'straps-quick-release', straps_id, 9),
    ('Exotic Leather Straps', 'Екзотични кожени каишки', 'straps-exotic', straps_id, 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Watch Accessories
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Watch Accessories', 'Аксесоари за часовници', 'watches-accessories', watches_id, '🔧', 9, 'Watch boxes, tools and accessories')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO watch_acc_id;
  
  -- L3: Watch accessory subcategories
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Watch Boxes & Cases', 'Кутии за часовници', 'watch-acc-boxes', watch_acc_id, 1),
    ('Watch Winders', 'Навивачки за часовници', 'watch-acc-winders', watch_acc_id, 2),
    ('Watch Tools', 'Инструменти за часовници', 'watch-acc-tools', watch_acc_id, 3),
    ('Watch Travel Cases', 'Пътни калъфи', 'watch-acc-travel', watch_acc_id, 4),
    ('Watch Stands', 'Стойки за часовници', 'watch-acc-stands', watch_acc_id, 5),
    ('Watch Cleaning Kits', 'Комплекти за почистване', 'watch-acc-cleaning', watch_acc_id, 6),
    ('Watch Batteries', 'Батерии за часовници', 'watch-acc-batteries', watch_acc_id, 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
  -- ============================================================
  -- L2: Watch by Brand (for filtering)
  -- ============================================================
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description)
  VALUES ('Watches by Brand', 'Часовници по марка', 'watches-by-brand', watches_id, '🏷️', 10, 'Browse watches by brand')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO brands_id;
  
  -- L3: Major watch brands
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Rolex Watches', 'Rolex часовници', 'brand-rolex', brands_id, 1),
    ('Omega Watches', 'Omega часовници', 'brand-omega', brands_id, 2),
    ('Casio Watches', 'Casio часовници', 'brand-casio', brands_id, 3),
    ('Seiko Watches', 'Seiko часовници', 'brand-seiko', brands_id, 4),
    ('Citizen Watches', 'Citizen часовници', 'brand-citizen', brands_id, 5),
    ('Fossil Watches', 'Fossil часовници', 'brand-fossil', brands_id, 6),
    ('Michael Kors Watches', 'Michael Kors часовници', 'brand-mk', brands_id, 7),
    ('Guess Watches', 'Guess часовници', 'brand-guess', brands_id, 8),
    ('Tissot Watches', 'Tissot часовници', 'brand-tissot', brands_id, 9),
    ('Emporio Armani Watches', 'Emporio Armani часовници', 'brand-armani', brands_id, 10),
    ('Tommy Hilfiger Watches', 'Tommy Hilfiger часовници', 'brand-tommy', brands_id, 11),
    ('Daniel Wellington', 'Daniel Wellington', 'brand-dw', brands_id, 12),
    ('Swatch Watches', 'Swatch часовници', 'brand-swatch', brands_id, 13),
    ('Timex Watches', 'Timex часовници', 'brand-timex', brands_id, 14),
    ('Orient Watches', 'Orient часовници', 'brand-orient', brands_id, 15)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
  
END $$;
;
