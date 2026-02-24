
-- Add attributes for PC Components parent category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('54b001a0-59ba-46a8-943c-8d4097e31210', 'Component Type', 'Тип компонент', 'select', true, true,
   '["Graphics Card (GPU)", "Processor (CPU)", "Memory (RAM)", "Motherboard", "Storage (SSD/HDD)", "Power Supply (PSU)", "PC Case", "CPU Cooler", "Case Fans", "Thermal Paste"]',
   '["Видеокарта (GPU)", "Процесор (CPU)", "Памет (RAM)", "Дънна платка", "Съхранение (SSD/HDD)", "Захранване (PSU)", "Кутия", "Охлаждане за CPU", "Вентилатори", "Термопаста"]',
   1),
  
  ('54b001a0-59ba-46a8-943c-8d4097e31210', 'Brand', 'Марка', 'select', true, true,
   '["AMD", "Intel", "NVIDIA", "ASUS", "MSI", "Gigabyte", "EVGA", "Corsair", "NZXT", "be quiet!", "Cooler Master", "Seasonic", "Samsung", "Western Digital", "Crucial", "Kingston", "G.Skill", "Other"]',
   '["AMD", "Intel", "NVIDIA", "ASUS", "MSI", "Gigabyte", "EVGA", "Corsair", "NZXT", "be quiet!", "Cooler Master", "Seasonic", "Samsung", "Western Digital", "Crucial", "Kingston", "G.Skill", "Друга"]',
   2),
  
  ('54b001a0-59ba-46a8-943c-8d4097e31210', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]',
   3);

-- Add attributes for Graphics Cards (GPUs)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('f803f3ec-bced-41ee-b8f0-cf8c7c50ae35', 'GPU Series', 'GPU серия', 'select', true, true,
   '["NVIDIA RTX 50 Series", "NVIDIA RTX 40 Series", "NVIDIA RTX 30 Series", "NVIDIA GTX 16 Series", "AMD RX 9000 Series", "AMD RX 7000 Series", "AMD RX 6000 Series", "Intel Arc", "Workstation (Quadro/Pro)"]',
   '["NVIDIA RTX 50 серия", "NVIDIA RTX 40 серия", "NVIDIA RTX 30 серия", "NVIDIA GTX 16 серия", "AMD RX 9000 серия", "AMD RX 7000 серия", "AMD RX 6000 серия", "Intel Arc", "Работни станции (Quadro/Pro)"]',
   1),
  
  ('f803f3ec-bced-41ee-b8f0-cf8c7c50ae35', 'VRAM', 'Видео памет', 'select', true, true,
   '["4GB", "6GB", "8GB", "10GB", "12GB", "16GB", "24GB", "32GB+"]',
   '["4GB", "6GB", "8GB", "10GB", "12GB", "16GB", "24GB", "32GB+"]',
   2),
  
  ('f803f3ec-bced-41ee-b8f0-cf8c7c50ae35', 'Cooler Type', 'Тип охлаждане', 'select', false, true,
   '["Single Fan", "Dual Fan", "Triple Fan", "Blower Style", "Hybrid (Air + AIO)"]',
   '["Един вентилатор", "Два вентилатора", "Три вентилатора", "Blower стил", "Хибрид (въздух + AIO)"]',
   3),
  
  ('f803f3ec-bced-41ee-b8f0-cf8c7c50ae35', 'TDP', 'TDP', 'select', false, true,
   '["Under 150W", "150-200W", "200-250W", "250-300W", "300-350W", "350W+"]',
   '["Под 150W", "150-200W", "200-250W", "250-300W", "300-350W", "Над 350W"]',
   4),
  
  ('f803f3ec-bced-41ee-b8f0-cf8c7c50ae35', 'Brand', 'Марка', 'select', true, true,
   '["ASUS", "MSI", "Gigabyte", "EVGA", "Zotac", "Sapphire", "PowerColor", "XFX", "PNY", "Founders/Reference", "Other"]',
   '["ASUS", "MSI", "Gigabyte", "EVGA", "Zotac", "Sapphire", "PowerColor", "XFX", "PNY", "Founders/Reference", "Друга"]',
   5),
  
  ('f803f3ec-bced-41ee-b8f0-cf8c7c50ae35', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]',
   6);

-- Add attributes for Storage Drives
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('0ae9112b-22bf-4f5e-a679-d606280303b8', 'Storage Type', 'Тип съхранение', 'select', true, true,
   '["NVMe SSD (M.2)", "SATA SSD (2.5\")", "HDD (3.5\")", "HDD (2.5\")", "External SSD", "External HDD", "M.2 SATA"]',
   '["NVMe SSD (M.2)", "SATA SSD (2.5\")", "HDD (3.5\")", "HDD (2.5\")", "Външен SSD", "Външен HDD", "M.2 SATA"]',
   1),
  
  ('0ae9112b-22bf-4f5e-a679-d606280303b8', 'Capacity', 'Капацитет', 'select', true, true,
   '["128GB", "256GB", "500GB", "512GB", "1TB", "2TB", "4TB", "8TB", "12TB+"]',
   '["128GB", "256GB", "500GB", "512GB", "1TB", "2TB", "4TB", "8TB", "12TB+"]',
   2),
  
  ('0ae9112b-22bf-4f5e-a679-d606280303b8', 'Interface', 'Интерфейс', 'select', false, true,
   '["PCIe Gen 5", "PCIe Gen 4", "PCIe Gen 3", "SATA III", "USB 3.2", "USB-C/Thunderbolt"]',
   '["PCIe Gen 5", "PCIe Gen 4", "PCIe Gen 3", "SATA III", "USB 3.2", "USB-C/Thunderbolt"]',
   3),
  
  ('0ae9112b-22bf-4f5e-a679-d606280303b8', 'Read Speed', 'Скорост на четене', 'select', false, true,
   '["Under 500 MB/s", "500-1000 MB/s", "1000-3000 MB/s", "3000-5000 MB/s", "5000-7000 MB/s", "7000MB/s+"]',
   '["Под 500 MB/s", "500-1000 MB/s", "1000-3000 MB/s", "3000-5000 MB/s", "5000-7000 MB/s", "Над 7000MB/s"]',
   4),
  
  ('0ae9112b-22bf-4f5e-a679-d606280303b8', 'Brand', 'Марка', 'select', true, true,
   '["Samsung", "Western Digital", "Seagate", "Crucial", "Kingston", "SK Hynix", "Sabrent", "Corsair", "SanDisk", "Other"]',
   '["Samsung", "Western Digital", "Seagate", "Crucial", "Kingston", "SK Hynix", "Sabrent", "Corsair", "SanDisk", "Друга"]',
   5);

-- Add attributes for Keyboards
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('c70c75a9-781f-439d-9b77-12f67b81ec64', 'Keyboard Type', 'Тип клавиатура', 'select', true, true,
   '["Mechanical", "Membrane", "Scissor", "Optical", "Analog/Hall Effect"]',
   '["Механична", "Мембранна", "Ножична", "Оптична", "Аналогова/Hall Effect"]',
   1),
  
  ('c70c75a9-781f-439d-9b77-12f67b81ec64', 'Size/Layout', 'Размер/Формат', 'select', false, true,
   '["Full Size (100%)", "TKL (80%)", "75%", "65%", "60%", "Numpad"]',
   '["Пълен размер (100%)", "TKL (80%)", "75%", "65%", "60%", "Нумерична"]',
   2),
  
  ('c70c75a9-781f-439d-9b77-12f67b81ec64', 'Switch Type', 'Тип суич', 'select', false, true,
   '["Cherry MX Red", "Cherry MX Blue", "Cherry MX Brown", "Gateron", "Kailh", "Razer", "Romer-G", "Custom/Hot-Swap", "Membrane"]',
   '["Cherry MX Red", "Cherry MX Blue", "Cherry MX Brown", "Gateron", "Kailh", "Razer", "Romer-G", "Custom/Hot-Swap", "Мембрана"]',
   3),
  
  ('c70c75a9-781f-439d-9b77-12f67b81ec64', 'Connection', 'Връзка', 'select', false, true,
   '["Wired USB", "Wireless 2.4GHz", "Bluetooth", "Tri-Mode (USB/2.4GHz/BT)"]',
   '["Кабел USB", "Безжична 2.4GHz", "Bluetooth", "Три режима (USB/2.4GHz/BT)"]',
   4),
  
  ('c70c75a9-781f-439d-9b77-12f67b81ec64', 'RGB Lighting', 'RGB осветление', 'boolean', false, true, '[]', '[]', 5),
  
  ('c70c75a9-781f-439d-9b77-12f67b81ec64', 'Brand', 'Марка', 'select', true, true,
   '["Logitech", "Razer", "Corsair", "SteelSeries", "HyperX", "Ducky", "Keychron", "ASUS ROG", "Wooting", "Other"]',
   '["Logitech", "Razer", "Corsair", "SteelSeries", "HyperX", "Ducky", "Keychron", "ASUS ROG", "Wooting", "Друга"]',
   6);

-- Add attributes for Mice
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('6b048d1b-8dee-4b47-9f38-7f1d5d80f905', 'Mouse Type', 'Тип мишка', 'select', true, true,
   '["Gaming", "Ergonomic", "Ultralight", "MMO/MOBA", "Trackball", "Vertical", "Travel/Compact"]',
   '["Геймърска", "Ергономична", "Ултралека", "MMO/MOBA", "Трекбол", "Вертикална", "Пътна/Компактна"]',
   1),
  
  ('6b048d1b-8dee-4b47-9f38-7f1d5d80f905', 'DPI/Sensor', 'DPI/Сензор', 'select', false, true,
   '["Under 8000 DPI", "8000-16000 DPI", "16000-25000 DPI", "25000+ DPI"]',
   '["Под 8000 DPI", "8000-16000 DPI", "16000-25000 DPI", "Над 25000 DPI"]',
   2),
  
  ('6b048d1b-8dee-4b47-9f38-7f1d5d80f905', 'Connection', 'Връзка', 'select', false, true,
   '["Wired USB", "Wireless 2.4GHz", "Bluetooth", "Tri-Mode (USB/2.4GHz/BT)"]',
   '["Кабел USB", "Безжична 2.4GHz", "Bluetooth", "Три режима (USB/2.4GHz/BT)"]',
   3),
  
  ('6b048d1b-8dee-4b47-9f38-7f1d5d80f905', 'Weight', 'Тегло', 'select', false, true,
   '["Ultralight (Under 60g)", "Light (60-80g)", "Medium (80-100g)", "Heavy (100g+)"]',
   '["Ултралека (под 60г)", "Лека (60-80г)", "Средна (80-100г)", "Тежка (над 100г)"]',
   4),
  
  ('6b048d1b-8dee-4b47-9f38-7f1d5d80f905', 'Buttons', 'Бутони', 'select', false, true,
   '["2-3 Buttons", "4-5 Buttons", "6-8 Buttons", "9+ Buttons (MMO)"]',
   '["2-3 бутона", "4-5 бутона", "6-8 бутона", "9+ бутона (MMO)"]',
   5),
  
  ('6b048d1b-8dee-4b47-9f38-7f1d5d80f905', 'Brand', 'Марка', 'select', true, true,
   '["Logitech", "Razer", "SteelSeries", "Corsair", "Finalmouse", "Pulsar", "Zowie", "ASUS ROG", "Glorious", "Other"]',
   '["Logitech", "Razer", "SteelSeries", "Corsair", "Finalmouse", "Pulsar", "Zowie", "ASUS ROG", "Glorious", "Друга"]',
   6);
;
