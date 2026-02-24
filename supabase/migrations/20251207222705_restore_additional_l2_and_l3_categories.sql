
-- Restore additional L2 and L3 categories that might be missing
DO $$
DECLARE
  -- Parent category IDs
  v_electronics_id UUID;
  v_fashion_id UUID;
  v_home_garden_id UUID;
  v_pets_id UUID;
  v_sports_id UUID;
  v_toys_id UUID;
  v_health_id UUID;
  v_beauty_id UUID;
  v_office_id UUID;
  v_baby_id UUID;
  -- L2 category IDs for more L3s
  v_wearables_id UUID;
  v_tablets_id UUID;
  v_computers_id UUID;
  v_networking_id UUID;
  v_storage_id UUID;
  v_watches_id UUID;
  v_jewelry_fine_id UUID;
  v_kitchen_id UUID;
  v_bedding_id UUID;
  v_bathroom_id UUID;
  v_lighting_id UUID;
  v_decor_id UUID;
BEGIN
  -- Get main L0 category IDs
  SELECT id INTO v_electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO v_fashion_id FROM categories WHERE slug = 'fashion';
  SELECT id INTO v_home_garden_id FROM categories WHERE slug = 'home-garden';
  SELECT id INTO v_pets_id FROM categories WHERE slug = 'pets';
  SELECT id INTO v_sports_id FROM categories WHERE slug = 'sports-outdoors';
  SELECT id INTO v_toys_id FROM categories WHERE slug = 'toys-games';
  SELECT id INTO v_health_id FROM categories WHERE slug = 'health-wellness';
  SELECT id INTO v_beauty_id FROM categories WHERE slug = 'beauty';
  SELECT id INTO v_office_id FROM categories WHERE slug = 'office-supplies';
  SELECT id INTO v_baby_id FROM categories WHERE slug = 'baby-kids';

  -- Get Electronics L2s
  SELECT id INTO v_wearables_id FROM categories WHERE slug = 'wearables';
  SELECT id INTO v_tablets_id FROM categories WHERE slug = 'tablets';
  SELECT id INTO v_computers_id FROM categories WHERE slug = 'computers';
  SELECT id INTO v_networking_id FROM categories WHERE slug = 'networking';
  SELECT id INTO v_storage_id FROM categories WHERE slug = 'storage-drives';

  -- Get Fashion/Jewelry L2s
  SELECT id INTO v_watches_id FROM categories WHERE slug = 'watches';
  SELECT id INTO v_jewelry_fine_id FROM categories WHERE slug = 'fine-jewelry';

  -- Get Home L2s
  SELECT id INTO v_kitchen_id FROM categories WHERE slug = 'kitchen';
  SELECT id INTO v_bedding_id FROM categories WHERE slug = 'bedding';
  SELECT id INTO v_bathroom_id FROM categories WHERE slug = 'bathroom';
  SELECT id INTO v_lighting_id FROM categories WHERE slug = 'lighting';
  SELECT id INTO v_decor_id FROM categories WHERE slug = 'home-decor';

  -- ELECTRONICS L3 --
  -- Wearables L3
  IF v_wearables_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Smartwatches', 'Смарт часовници', 'smartwatches', v_wearables_id, 1),
    ('Fitness Trackers', 'Фитнес гривни', 'fitness-trackers', v_wearables_id, 2),
    ('Smart Rings', 'Смарт пръстени', 'smart-rings', v_wearables_id, 3),
    ('Smart Glasses', 'Смарт очила', 'smart-glasses', v_wearables_id, 4),
    ('Health Monitors', 'Здравни монитори', 'health-monitors', v_wearables_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tablets L3
  IF v_tablets_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Apple iPad', 'Apple iPad', 'apple-ipad', v_tablets_id, 1),
    ('Android Tablets', 'Android таблети', 'android-tablets', v_tablets_id, 2),
    ('Windows Tablets', 'Windows таблети', 'windows-tablets', v_tablets_id, 3),
    ('E-Readers', 'Четци за книги', 'e-readers', v_tablets_id, 4),
    ('Kids Tablets', 'Детски таблети', 'kids-tablets', v_tablets_id, 5),
    ('Tablet Accessories', 'Аксесоари за таблети', 'tablet-accessories', v_tablets_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Computers L3
  IF v_computers_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Desktop Computers', 'Настолни компютри', 'desktop-computers', v_computers_id, 1),
    ('All-in-One PCs', 'All-in-One компютри', 'all-in-one-pcs', v_computers_id, 2),
    ('Mini PCs', 'Мини компютри', 'mini-pcs', v_computers_id, 3),
    ('Gaming PCs', 'Геймърски компютри', 'gaming-pcs', v_computers_id, 4),
    ('Computer Components', 'Компоненти', 'computer-components', v_computers_id, 5),
    ('Monitors', 'Монитори', 'monitors', v_computers_id, 6),
    ('Keyboards & Mice', 'Клавиатури и мишки', 'keyboards-mice', v_computers_id, 7),
    ('Printers', 'Принтери', 'printers', v_computers_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Networking L3
  IF v_networking_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Routers', 'Рутери', 'routers', v_networking_id, 1),
    ('Modems', 'Модеми', 'modems', v_networking_id, 2),
    ('Network Switches', 'Суичове', 'network-switches', v_networking_id, 3),
    ('WiFi Extenders', 'WiFi удължители', 'wifi-extenders', v_networking_id, 4),
    ('Network Cables', 'Мрежови кабели', 'network-cables', v_networking_id, 5),
    ('Network Adapters', 'Мрежови адаптери', 'network-adapters', v_networking_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Storage L3
  IF v_storage_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('External Hard Drives', 'Външни хард дискове', 'external-hard-drives', v_storage_id, 1),
    ('Internal Hard Drives', 'Вътрешни хард дискове', 'internal-hard-drives', v_storage_id, 2),
    ('SSDs', 'SSD дискове', 'ssds', v_storage_id, 3),
    ('USB Flash Drives', 'USB флашки', 'usb-flash-drives', v_storage_id, 4),
    ('Memory Cards', 'Карти памет', 'memory-cards', v_storage_id, 5),
    ('NAS Devices', 'NAS устройства', 'nas-devices', v_storage_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- FASHION L3 --
  -- Watches L3
  IF v_watches_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Luxury Watches', 'Луксозни часовници', 'luxury-watches', v_watches_id, 1),
    ('Sports Watches', 'Спортни часовници', 'sports-watches', v_watches_id, 2),
    ('Dress Watches', 'Елегантни часовници', 'dress-watches', v_watches_id, 3),
    ('Casual Watches', 'Ежедневни часовници', 'casual-watches', v_watches_id, 4),
    ('Dive Watches', 'Водолазни часовници', 'dive-watches', v_watches_id, 5),
    ('Vintage Watches', 'Ретро часовници', 'vintage-watches', v_watches_id, 6),
    ('Watch Accessories', 'Аксесоари за часовници', 'watch-accessories', v_watches_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fine Jewelry L3
  IF v_jewelry_fine_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Diamond Jewelry', 'Диамантени бижута', 'diamond-jewelry', v_jewelry_fine_id, 1),
    ('Gold Jewelry', 'Златни бижута', 'gold-jewelry', v_jewelry_fine_id, 2),
    ('Silver Jewelry', 'Сребърни бижута', 'silver-jewelry', v_jewelry_fine_id, 3),
    ('Platinum Jewelry', 'Платинени бижута', 'platinum-jewelry', v_jewelry_fine_id, 4),
    ('Gemstone Jewelry', 'Бижута със скъпоценни камъни', 'gemstone-jewelry', v_jewelry_fine_id, 5),
    ('Pearl Jewelry', 'Перлени бижута', 'pearl-jewelry', v_jewelry_fine_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- HOME & GARDEN L3 --
  -- Kitchen L3
  IF v_kitchen_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Cookware', 'Съдове за готвене', 'cookware', v_kitchen_id, 1),
    ('Bakeware', 'Форми за печене', 'bakeware', v_kitchen_id, 2),
    ('Kitchen Utensils', 'Кухненски прибори', 'kitchen-utensils', v_kitchen_id, 3),
    ('Cutlery', 'Ножове', 'cutlery', v_kitchen_id, 4),
    ('Dinnerware', 'Сервизи', 'dinnerware', v_kitchen_id, 5),
    ('Glassware', 'Стъклария', 'glassware', v_kitchen_id, 6),
    ('Small Appliances', 'Малки уреди', 'small-kitchen-appliances', v_kitchen_id, 7),
    ('Food Storage', 'Съхранение на храна', 'food-storage', v_kitchen_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bedding L3
  IF v_bedding_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sheets', 'Чаршафи', 'sheets', v_bedding_id, 1),
    ('Comforters', 'Завивки', 'comforters', v_bedding_id, 2),
    ('Pillows', 'Възглавници', 'pillows', v_bedding_id, 3),
    ('Blankets', 'Одеяла', 'blankets', v_bedding_id, 4),
    ('Duvets', 'Юргани', 'duvets', v_bedding_id, 5),
    ('Mattress Toppers', 'Топери', 'mattress-toppers', v_bedding_id, 6),
    ('Bed Frames', 'Рамки за легла', 'bed-frames', v_bedding_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bathroom L3
  IF v_bathroom_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Towels', 'Кърпи', 'towels', v_bathroom_id, 1),
    ('Bath Mats', 'Постелки за баня', 'bath-mats', v_bathroom_id, 2),
    ('Shower Curtains', 'Завеси за баня', 'shower-curtains', v_bathroom_id, 3),
    ('Bathroom Storage', 'Съхранение за баня', 'bathroom-storage', v_bathroom_id, 4),
    ('Bathroom Accessories', 'Аксесоари за баня', 'bathroom-accessories', v_bathroom_id, 5),
    ('Toilets & Bidets', 'Тоалетни и биде', 'toilets-bidets', v_bathroom_id, 6),
    ('Sinks & Faucets', 'Мивки и батерии', 'sinks-faucets', v_bathroom_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Lighting L3
  IF v_lighting_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Ceiling Lights', 'Плафони', 'ceiling-lights', v_lighting_id, 1),
    ('Table Lamps', 'Настолни лампи', 'table-lamps', v_lighting_id, 2),
    ('Floor Lamps', 'Стоящи лампи', 'floor-lamps', v_lighting_id, 3),
    ('Wall Lights', 'Аплици', 'wall-lights', v_lighting_id, 4),
    ('Outdoor Lighting', 'Градинско осветление', 'outdoor-lighting', v_lighting_id, 5),
    ('LED Bulbs', 'LED крушки', 'led-bulbs', v_lighting_id, 6),
    ('Chandeliers', 'Полилеи', 'chandeliers', v_lighting_id, 7),
    ('String Lights', 'Гирлянди', 'string-lights', v_lighting_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Home Decor L3
  IF v_decor_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wall Art', 'Стенно изкуство', 'wall-art', v_decor_id, 1),
    ('Mirrors', 'Огледала', 'mirrors', v_decor_id, 2),
    ('Clocks', 'Часовници', 'home-clocks', v_decor_id, 3),
    ('Vases', 'Вази', 'vases', v_decor_id, 4),
    ('Candles', 'Свещи', 'candles', v_decor_id, 5),
    ('Picture Frames', 'Рамки за снимки', 'picture-frames', v_decor_id, 6),
    ('Rugs', 'Килими', 'rugs', v_decor_id, 7),
    ('Curtains', 'Завеси', 'curtains', v_decor_id, 8),
    ('Throw Pillows', 'Декоративни възглавници', 'throw-pillows', v_decor_id, 9),
    ('Artificial Plants', 'Изкуствени растения', 'artificial-plants', v_decor_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Additional L2 and L3 categories restored';
END $$;
;
