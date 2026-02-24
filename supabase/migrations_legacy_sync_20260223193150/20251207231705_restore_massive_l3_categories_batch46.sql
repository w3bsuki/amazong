
-- Batch 46: Additional deep categories - Electronics accessories, Phone accessories, etc.
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Phone Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'phone-cases';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('iPhone Cases', 'Калъфи за iPhone', 'iphone-cases', v_parent_id, 1),
      ('Samsung Cases', 'Калъфи за Samsung', 'samsung-cases', v_parent_id, 2),
      ('Pixel Cases', 'Калъфи за Pixel', 'pixel-cases', v_parent_id, 3),
      ('Universal Cases', 'Универсални калъфи', 'universal-phone-cases', v_parent_id, 4),
      ('Wallet Cases', 'Калъфи портфейли', 'wallet-cases', v_parent_id, 5),
      ('Rugged Cases', 'Противоударни калъфи', 'rugged-cases', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'screen-protectors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tempered Glass', 'Закалено стъкло', 'tempered-glass', v_parent_id, 1),
      ('Privacy Screens', 'Защитни фолиа за поверителност', 'privacy-screens', v_parent_id, 2),
      ('Film Protectors', 'Фолиа протектори', 'film-protectors', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'chargers-cables';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('USB-C Cables', 'USB-C кабели', 'usb-c-cables', v_parent_id, 1),
      ('Lightning Cables', 'Lightning кабели', 'lightning-cables', v_parent_id, 2),
      ('Wireless Chargers', 'Безжични зарядни', 'wireless-chargers', v_parent_id, 3),
      ('Wall Chargers', 'Стенни зарядни', 'wall-chargers', v_parent_id, 4),
      ('Car Chargers', 'Зарядни за кола', 'car-chargers', v_parent_id, 5),
      ('Power Banks', 'Външна батерия', 'power-banks', v_parent_id, 6),
      ('Multi-Port Chargers', 'Многопортови зарядни', 'multi-port-chargers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'phone-stands';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Desktop Stands', 'Настолни стойки', 'desktop-phone-stands', v_parent_id, 1),
      ('Car Mounts', 'Стойки за кола', 'car-phone-mounts', v_parent_id, 2),
      ('Tripods', 'Триподи', 'phone-tripods', v_parent_id, 3),
      ('Ring Holders', 'Пръстени държачи', 'ring-holders', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tablet Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tablet-cases';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('iPad Cases', 'Калъфи за iPad', 'ipad-cases', v_parent_id, 1),
      ('Samsung Tablet Cases', 'Калъфи за Samsung таблети', 'samsung-tablet-cases', v_parent_id, 2),
      ('Keyboard Cases', 'Калъфи с клавиатура', 'keyboard-cases', v_parent_id, 3),
      ('Folio Cases', 'Фолио калъфи', 'folio-cases', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'stylus-pens';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Apple Pencil', 'Apple Pencil', 'apple-pencil', v_parent_id, 1),
      ('Samsung S Pen', 'Samsung S Pen', 'samsung-s-pen', v_parent_id, 2),
      ('Universal Stylus', 'Универсални стилуси', 'universal-stylus', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Laptop Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'laptop-bags';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Laptop Backpacks', 'Раници за лаптоп', 'laptop-backpacks', v_parent_id, 1),
      ('Laptop Sleeves', 'Калъфи за лаптоп', 'laptop-sleeves', v_parent_id, 2),
      ('Messenger Bags', 'Чанти през рамо', 'messenger-bags', v_parent_id, 3),
      ('Briefcases', 'Куфарчета', 'briefcases', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'laptop-stands';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Adjustable Stands', 'Регулируеми стойки', 'adjustable-laptop-stands', v_parent_id, 1),
      ('Cooling Pads', 'Охлаждащи поставки', 'cooling-pads', v_parent_id, 2),
      ('Lap Desks', 'Поставки за скут', 'lap-desks', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'docking-stations';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('USB-C Hubs', 'USB-C хъбове', 'usb-c-hubs', v_parent_id, 1),
      ('Thunderbolt Docks', 'Thunderbolt докинг станции', 'thunderbolt-docks', v_parent_id, 2),
      ('USB Hubs', 'USB хъбове', 'usb-hubs', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- External Storage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'external-hard-drives';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Portable HDDs', 'Преносими твърди дискове', 'portable-hdds', v_parent_id, 1),
      ('Desktop HDDs', 'Настолни твърди дискове', 'desktop-hdds', v_parent_id, 2),
      ('Portable SSDs', 'Преносими SSD', 'portable-ssds-external', v_parent_id, 3),
      ('NAS Drives', 'NAS дискове', 'nas-drives', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'usb-flash-drives';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('USB 3.0 Drives', 'USB 3.0 флашки', 'usb-3-drives', v_parent_id, 1),
      ('USB-C Flash Drives', 'USB-C флашки', 'usb-c-flash-drives', v_parent_id, 2),
      ('Encrypted Drives', 'Криптирани флашки', 'encrypted-drives', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'memory-cards';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('SD Cards', 'SD карти', 'sd-cards', v_parent_id, 1),
      ('MicroSD Cards', 'MicroSD карти', 'microsd-cards', v_parent_id, 2),
      ('CFexpress Cards', 'CFexpress карти', 'cfexpress-cards', v_parent_id, 3),
      ('Memory Card Readers', 'Четци за карти памет', 'memory-card-readers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Networking deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'routers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('WiFi 6 Routers', 'WiFi 6 рутери', 'wifi-6-routers', v_parent_id, 1),
      ('Mesh Routers', 'Меш рутери', 'mesh-routers', v_parent_id, 2),
      ('Gaming Routers', 'Гейминг рутери', 'gaming-routers', v_parent_id, 3),
      ('Travel Routers', 'Пътнически рутери', 'travel-routers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'network-switches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Unmanaged Switches', 'Неуправляеми суичове', 'unmanaged-switches', v_parent_id, 1),
      ('Managed Switches', 'Управляеми суичове', 'managed-switches', v_parent_id, 2),
      ('PoE Switches', 'PoE суичове', 'poe-switches', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'network-adapters';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('WiFi Adapters', 'WiFi адаптери', 'wifi-adapters', v_parent_id, 1),
      ('Ethernet Adapters', 'Ethernet адаптери', 'ethernet-adapters', v_parent_id, 2),
      ('Powerline Adapters', 'Powerline адаптери', 'powerline-adapters', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
