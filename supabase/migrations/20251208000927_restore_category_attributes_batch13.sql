-- Batch 13: More Specific Categories - Computers, Networking, Smart Home
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Motherboards
  SELECT id INTO cat_id FROM categories WHERE slug = 'motherboards';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Socket', 'Сокет', 'select', true, true, '["LGA 1700","LGA 1200","AM5","AM4","TRX40"]', '["LGA 1700","LGA 1200","AM5","AM4","TRX40"]', 1),
      (cat_id, 'Chipset', 'Чипсет', 'select', true, true, '["Intel Z790","Intel B760","Intel Z690","AMD X670E","AMD X670","AMD B650E","AMD B650","AMD X570","AMD B550"]', '["Intel Z790","Intel B760","Intel Z690","AMD X670E","AMD X670","AMD B650E","AMD B650","AMD X570","AMD B550"]', 2),
      (cat_id, 'Form Factor', 'Форм фактор', 'select', true, true, '["ATX","Micro-ATX","Mini-ITX","E-ATX"]', '["ATX","Micro-ATX","Mini-ITX","E-ATX"]', 3),
      (cat_id, 'Memory Support', 'Поддръжка памет', 'select', false, true, '["DDR5","DDR4","DDR5 + DDR4"]', '["DDR5","DDR4","DDR5 + DDR4"]', 4),
      (cat_id, 'Max Memory', 'Макс. памет', 'select', false, true, '["64GB","128GB","256GB"]', '["64GB","128GB","256GB"]', 5),
      (cat_id, 'WiFi', 'WiFi', 'select', false, true, '["None","WiFi 6","WiFi 6E","WiFi 7"]', '["Без","WiFi 6","WiFi 6E","WiFi 7"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Power Supplies
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'power-supplies';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Wattage', 'Мощност', 'select', true, true, '["450W","550W","650W","750W","850W","1000W","1200W","1500W+"]', '["450W","550W","650W","750W","850W","1000W","1200W","1500W+"]', 1),
      (cat_id, 'Efficiency Rating', 'Ефективност', 'select', true, true, '["80+ White","80+ Bronze","80+ Silver","80+ Gold","80+ Platinum","80+ Titanium"]', '["80+ Бял","80+ Бронз","80+ Сребро","80+ Злато","80+ Платина","80+ Титан"]', 2),
      (cat_id, 'Modularity', 'Модулност', 'select', true, true, '["Non-Modular","Semi-Modular","Fully Modular"]', '["Немодулно","Полумодулно","Пълно модулно"]', 3),
      (cat_id, 'Form Factor', 'Форм фактор', 'select', false, true, '["ATX","SFX","SFX-L","TFX"]', '["ATX","SFX","SFX-L","TFX"]', 4),
      (cat_id, 'ATX Standard', 'ATX стандарт', 'select', false, true, '["ATX 2.x","ATX 3.0 (PCIe 5.0)"]', '["ATX 2.x","ATX 3.0 (PCIe 5.0)"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- PC Cases
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'pc-cases';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Form Factor Support', 'Поддръжка форм фактор', 'select', true, true, '["Full Tower (E-ATX)","Mid Tower (ATX)","Micro-ATX","Mini-ITX","SFF"]', '["Голям (E-ATX)","Среден (ATX)","Micro-ATX","Mini-ITX","SFF"]', 1),
      (cat_id, 'Side Panel', 'Страничен панел', 'select', false, true, '["Tempered Glass","Acrylic","Solid/Metal","Mesh"]', '["Закалено стъкло","Акрил","Твърд/Метал","Мрежа"]', 2),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["Black","White","Gray","RGB"]', '["Черен","Бял","Сив","RGB"]', 3),
      (cat_id, 'Airflow', 'Въздушен поток', 'select', false, true, '["High Airflow/Mesh","Balanced","Quiet/Silent","Liquid Cooling Focus"]', '["Висок въздушен поток","Балансиран","Тих","За водно охлаждане"]', 4),
      (cat_id, 'Max GPU Length', 'Макс. GPU дължина', 'select', false, true, '["Under 300mm","300-350mm","350-400mm","400mm+"]', '["Под 300мм","300-350мм","350-400мм","400мм+"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Routers
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'routers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'WiFi Standard', 'WiFi стандарт', 'select', true, true, '["WiFi 5 (802.11ac)","WiFi 6 (802.11ax)","WiFi 6E","WiFi 7 (802.11be)"]', '["WiFi 5 (802.11ac)","WiFi 6 (802.11ax)","WiFi 6E","WiFi 7 (802.11be)"]', 1),
      (cat_id, 'Speed Class', 'Клас скорост', 'select', false, true, '["AX1500","AX1800","AX3000","AX5400","AX6000","AX11000","BE9300+"]', '["AX1500","AX1800","AX3000","AX5400","AX6000","AX11000","BE9300+"]', 2),
      (cat_id, 'Coverage', 'Покритие', 'select', false, true, '["Small (Up to 100 sqm)","Medium (100-200 sqm)","Large (200-400 sqm)","Whole Home (400+ sqm)"]', '["Малко (до 100 кв.м)","Средно (100-200 кв.м)","Голямо (200-400 кв.м)","Цял дом (400+ кв.м)"]', 3),
      (cat_id, 'Router Type', 'Тип рутер', 'select', false, true, '["Standard Router","Mesh System","Gaming Router","Travel Router"]', '["Стандартен","Меш система","Гейминг рутер","Пътнически"]', 4),
      (cat_id, 'Ports', 'Портове', 'multiselect', false, true, '["Gigabit LAN","2.5G LAN","10G LAN","USB 3.0","USB-C"]', '["Gigabit LAN","2.5G LAN","10G LAN","USB 3.0","USB-C"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Smart Home - Speakers
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'smart-speakers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Voice Assistant', 'Гласов асистент', 'select', true, true, '["Amazon Alexa","Google Assistant","Apple Siri","Multiple"]', '["Amazon Alexa","Google Assistant","Apple Siri","Множество"]', 1),
      (cat_id, 'Speaker Type', 'Тип колонка', 'select', false, true, '["Mini/Compact","Standard","Premium/High-End","With Display"]', '["Мини/Компактна","Стандартна","Премиум","С дисплей"]', 2),
      (cat_id, 'Audio Quality', 'Качество на звука', 'select', false, true, '["Basic","Good","High-Fidelity","Stereo/Multi-Room"]', '["Базово","Добро","Hi-Fi","Стерео/Много стаи"]', 3),
      (cat_id, 'Smart Home Hub', 'Смарт дом хъб', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
