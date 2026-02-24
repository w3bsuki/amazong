
-- Add comprehensive TV attributes for televisions-category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  -- Screen Size (INCHES)
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Screen Size', 'Размер на екрана', 'select', true, true, 
   '["32\"", "40\"", "43\"", "50\"", "55\"", "65\"", "75\"", "85\"", "85\"+"]',
   '["32 инча", "40 инча", "43 инча", "50 инча", "55 инча", "65 инча", "75 инча", "85 инча", "Над 85 инча"]',
   1),
  
  -- Display Technology
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Display Technology', 'Технология на дисплея', 'select', true, true,
   '["LED/LCD", "OLED", "QLED", "Mini-LED", "Neo QLED", "MicroLED"]',
   '["LED/LCD", "OLED", "QLED", "Mini-LED", "Neo QLED", "MicroLED"]',
   2),
  
  -- Resolution
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Resolution', 'Резолюция', 'select', true, true,
   '["HD (720p)", "Full HD (1080p)", "4K UHD", "8K UHD"]',
   '["HD (720p)", "Full HD (1080p)", "4K UHD", "8K UHD"]',
   3),
  
  -- Smart TV
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Smart TV', 'Смарт телевизор', 'boolean', false, true, '[]', '[]', 4),
  
  -- Refresh Rate
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Refresh Rate', 'Честота на опресняване', 'select', false, true,
   '["60Hz", "100Hz", "120Hz", "144Hz"]',
   '["60Hz", "100Hz", "120Hz", "144Hz"]',
   5),
  
  -- HDR Support
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'HDR Support', 'HDR поддръжка', 'multiselect', false, true,
   '["None", "HDR10", "HDR10+", "Dolby Vision", "HLG"]',
   '["Без", "HDR10", "HDR10+", "Dolby Vision", "HLG"]',
   6),
  
  -- Brand
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Brand', 'Марка', 'select', true, true,
   '["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Sharp", "Toshiba", "Other"]',
   '["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Sharp", "Toshiba", "Друга"]',
   7),
  
  -- Smart Platform
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Smart Platform', 'Смарт платформа', 'select', false, true,
   '["Tizen (Samsung)", "webOS (LG)", "Google TV", "Android TV", "Roku TV", "Fire TV", "Vidaa", "Other", "None"]',
   '["Tizen (Samsung)", "webOS (LG)", "Google TV", "Android TV", "Roku TV", "Fire TV", "Vidaa", "Друга", "Без"]',
   8),
  
  -- Ports
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Ports', 'Портове', 'multiselect', false, true,
   '["HDMI 2.0", "HDMI 2.1", "USB", "Ethernet", "Optical Audio", "Component", "Composite", "Antenna"]',
   '["HDMI 2.0", "HDMI 2.1", "USB", "Ethernet", "Оптичен аудио", "Компонентен", "Композитен", "Антена"]',
   9),
  
  -- Wall Mountable
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Wall Mountable', 'Подходящ за стена', 'boolean', false, true, '[]', '[]', 10),
  
  -- VESA Mount
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'VESA Mount', 'VESA стойка', 'select', false, true,
   '["100x100", "200x200", "300x300", "400x400", "600x400", "Other"]',
   '["100x100", "200x200", "300x300", "400x400", "600x400", "Друга"]',
   11),
  
  -- Condition
  ('ea62ae60-2f54-47b8-b370-bda69173783f', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]',
   12);
;
