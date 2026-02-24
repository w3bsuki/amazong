-- Batch 9: PC Components, Peripherals, Network, Storage Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Graphics Cards
  SELECT id INTO cat_id FROM categories WHERE slug = 'graphics-cards';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Brand', 'Марка', 'select', true, true, '["NVIDIA","AMD","Intel"]', '["NVIDIA","AMD","Intel"]', 1),
      (cat_id, 'Chipset', 'Чипсет', 'select', true, true, '["RTX 4090","RTX 4080","RTX 4070 Ti","RTX 4070","RTX 4060 Ti","RTX 4060","RTX 3090","RTX 3080","RTX 3070","RTX 3060","RX 7900 XTX","RX 7900 XT","RX 7800 XT","RX 7700 XT","RX 7600","Arc A770","Arc A750","Other"]', '["RTX 4090","RTX 4080","RTX 4070 Ti","RTX 4070","RTX 4060 Ti","RTX 4060","RTX 3090","RTX 3080","RTX 3070","RTX 3060","RX 7900 XTX","RX 7900 XT","RX 7800 XT","RX 7700 XT","RX 7600","Arc A770","Arc A750","Друго"]', 2),
      (cat_id, 'VRAM', 'Видео памет', 'select', true, true, '["4GB","6GB","8GB","10GB","12GB","16GB","24GB"]', '["4GB","6GB","8GB","10GB","12GB","16GB","24GB"]', 3),
      (cat_id, 'Memory Type', 'Тип памет', 'select', false, true, '["GDDR6","GDDR6X"]', '["GDDR6","GDDR6X"]', 4),
      (cat_id, 'Card Manufacturer', 'Производител на картата', 'select', false, true, '["ASUS","MSI","Gigabyte","EVGA","Zotac","Sapphire","PowerColor","XFX","Founders Edition","Other"]', '["ASUS","MSI","Gigabyte","EVGA","Zotac","Sapphire","PowerColor","XFX","Founders Edition","Друго"]', 5),
      (cat_id, 'Cooling', 'Охлаждане', 'select', false, true, '["2 Fans","3 Fans","Blower","Liquid Cooled"]', '["2 вентилатора","3 вентилатора","Турбина","Водно охлаждане"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Processors
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'processors';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Brand', 'Марка', 'select', true, true, '["Intel","AMD"]', '["Intel","AMD"]', 1),
      (cat_id, 'Series', 'Серия', 'select', true, true, '["Intel Core i9","Intel Core i7","Intel Core i5","Intel Core i3","Intel Core Ultra 9","Intel Core Ultra 7","Intel Core Ultra 5","AMD Ryzen 9","AMD Ryzen 7","AMD Ryzen 5","AMD Ryzen 3","AMD Threadripper"]', '["Intel Core i9","Intel Core i7","Intel Core i5","Intel Core i3","Intel Core Ultra 9","Intel Core Ultra 7","Intel Core Ultra 5","AMD Ryzen 9","AMD Ryzen 7","AMD Ryzen 5","AMD Ryzen 3","AMD Threadripper"]', 2),
      (cat_id, 'Socket', 'Сокет', 'select', true, true, '["LGA 1700","LGA 1200","AM5","AM4","TR4/TRX40"]', '["LGA 1700","LGA 1200","AM5","AM4","TR4/TRX40"]', 3),
      (cat_id, 'Cores', 'Ядра', 'select', false, true, '["4","6","8","10","12","14","16","24","32+"]', '["4","6","8","10","12","14","16","24","32+"]', 4),
      (cat_id, 'Integrated Graphics', 'Интегрирана графика', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Cooler Included', 'Включен охладител', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- RAM
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'ram';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Type', 'Тип', 'select', true, true, '["DDR5","DDR4","DDR3","SODIMM DDR5","SODIMM DDR4"]', '["DDR5","DDR4","DDR3","SODIMM DDR5","SODIMM DDR4"]', 1),
      (cat_id, 'Capacity', 'Капацитет', 'select', true, true, '["8GB","16GB","32GB","64GB","128GB"]', '["8GB","16GB","32GB","64GB","128GB"]', 2),
      (cat_id, 'Speed (MHz)', 'Скорост (MHz)', 'select', true, true, '["3200","3600","4000","4800","5200","5600","6000","6400","7200+"]', '["3200","3600","4000","4800","5200","5600","6000","6400","7200+"]', 3),
      (cat_id, 'Kit Configuration', 'Конфигурация на комплект', 'select', false, true, '["1x8GB","2x8GB","1x16GB","2x16GB","1x32GB","2x32GB","4x16GB","4x32GB"]', '["1x8GB","2x8GB","1x16GB","2x16GB","1x32GB","2x32GB","4x16GB","4x32GB"]', 4),
      (cat_id, 'RGB', 'RGB', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Heat Spreader', 'Радиатор', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Storage (SSD/HDD)
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'storage';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Drive Type', 'Тип устройство', 'select', true, true, '["NVMe SSD","SATA SSD","HDD","External SSD","External HDD"]', '["NVMe SSD","SATA SSD","HDD","Външен SSD","Външен HDD"]', 1),
      (cat_id, 'Capacity', 'Капацитет', 'select', true, true, '["120GB","240-256GB","480-512GB","1TB","2TB","4TB","8TB+"]', '["120GB","240-256GB","480-512GB","1TB","2TB","4TB","8TB+"]', 2),
      (cat_id, 'Interface', 'Интерфейс', 'select', false, true, '["PCIe 5.0 NVMe","PCIe 4.0 NVMe","PCIe 3.0 NVMe","SATA III","USB 3.2","Thunderbolt"]', '["PCIe 5.0 NVMe","PCIe 4.0 NVMe","PCIe 3.0 NVMe","SATA III","USB 3.2","Thunderbolt"]', 3),
      (cat_id, 'Form Factor', 'Форм фактор', 'select', false, true, '["M.2 2280","2.5\"","3.5\"","Portable"]', '["M.2 2280","2.5\"","3.5\"","Преносим"]', 4),
      (cat_id, 'Read Speed', 'Скорост четене', 'select', false, true, '["Under 500MB/s","500-1000MB/s","1000-3500MB/s","3500-5000MB/s","5000-7500MB/s","7500MB/s+"]', '["Под 500MB/s","500-1000MB/s","1000-3500MB/s","3500-5000MB/s","5000-7500MB/s","7500MB/s+"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Keyboards
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'keyboards';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Keyboard Type', 'Тип клавиатура', 'select', true, true, '["Mechanical","Membrane","Optical","Low Profile"]', '["Механична","Мембранна","Оптична","Нисък профил"]', 1),
      (cat_id, 'Switch Type', 'Тип суичове', 'select', false, true, '["Cherry MX Red","Cherry MX Blue","Cherry MX Brown","Cherry MX Black","Gateron","Kailh","Razer","Other Mechanical","Membrane"]', '["Cherry MX Red","Cherry MX Blue","Cherry MX Brown","Cherry MX Black","Gateron","Kailh","Razer","Друг механичен","Мембранен"]', 2),
      (cat_id, 'Layout', 'Подредба', 'select', false, true, '["Full Size (100%)","TKL (80%)","75%","65%","60%","Numpad Only"]', '["Пълен размер (100%)","TKL (80%)","75%","65%","60%","Само Numpad"]', 3),
      (cat_id, 'Connection', 'Връзка', 'select', true, true, '["Wired USB","Wireless 2.4GHz","Bluetooth","Wired + Wireless"]', '["Кабел USB","Безжична 2.4GHz","Bluetooth","Кабел + Безжична"]', 4),
      (cat_id, 'RGB Lighting', 'RGB осветление', 'select', false, true, '["None","Single Color","RGB","Per-Key RGB"]', '["Без","Един цвят","RGB","RGB за всеки клавиш"]', 5),
      (cat_id, 'Hot-Swappable', 'Hot-Swap', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Mice
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'mice';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Mouse Type', 'Тип мишка', 'select', true, true, '["Gaming","Office/Productivity","Ergonomic","Travel/Portable","Vertical"]', '["Гейминг","Офис","Ергономична","Пътна","Вертикална"]', 1),
      (cat_id, 'Connection', 'Връзка', 'select', true, true, '["Wired","Wireless 2.4GHz","Bluetooth","Wired + Wireless"]', '["Кабелна","Безжична 2.4GHz","Bluetooth","Кабел + Безжична"]', 2),
      (cat_id, 'DPI', 'DPI', 'select', false, true, '["Up to 6400","6400-12000","12000-20000","20000-30000","30000+"]', '["До 6400","6400-12000","12000-20000","20000-30000","30000+"]', 3),
      (cat_id, 'Sensor Type', 'Тип сензор', 'select', false, true, '["Optical","Laser","Hero Sensor","Focus+ Sensor"]', '["Оптичен","Лазерен","Hero сензор","Focus+ сензор"]', 4),
      (cat_id, 'Weight', 'Тегло', 'select', false, true, '["Ultralight (Under 70g)","Light (70-90g)","Standard (90-110g)","Heavy (110g+)"]', '["Ултра леко (под 70г)","Леко (70-90г)","Стандартно (90-110г)","Тежко (110г+)"]', 5),
      (cat_id, 'Buttons', 'Бутони', 'select', false, true, '["3-5 Buttons","6-8 Buttons","8+ Buttons (MMO)"]', '["3-5 бутона","6-8 бутона","8+ бутона (MMO)"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
