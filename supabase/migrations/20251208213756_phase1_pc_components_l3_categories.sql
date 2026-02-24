
-- Phase 1.4: Add L3 PC Components Categories

-- First, let's add key component subcategories under Computer Components L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Graphics Cards', 'Processors', 'RAM Memory', 'Storage Drives', 'Motherboards', 'Power Supplies', 'PC Cases', 'Cooling Solutions']),
  unnest(ARRAY['graphics-cards', 'processors-cpu', 'ram-memory', 'storage-drives', 'motherboards', 'power-supplies-psu', 'pc-cases', 'cooling-solutions']),
  (SELECT id FROM categories WHERE slug = 'pc-components'),
  unnest(ARRAY['Видео Карти', 'Процесори', 'RAM Памет', 'Устройства за Съхранение', 'Дънни Платки', 'Захранващи Блокове', 'Компютърни Кутии', 'Охлаждащи Решения']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;

-- Add GPU Series under Graphics Cards
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['NVIDIA RTX 4090', 'NVIDIA RTX 4080 Super', 'NVIDIA RTX 4080', 'NVIDIA RTX 4070 Ti Super', 'NVIDIA RTX 4070 Super', 'NVIDIA RTX 4070', 'NVIDIA RTX 4060 Ti', 'NVIDIA RTX 4060', 'AMD RX 7900 XTX', 'AMD RX 7900 XT', 'AMD RX 7800 XT', 'AMD RX 7700 XT', 'AMD RX 7600', 'Intel Arc A770', 'Intel Arc A750']),
  unnest(ARRAY['nvidia-rtx-4090', 'nvidia-rtx-4080-super', 'nvidia-rtx-4080', 'nvidia-rtx-4070-ti-super', 'nvidia-rtx-4070-super', 'nvidia-rtx-4070', 'nvidia-rtx-4060-ti', 'nvidia-rtx-4060', 'amd-rx-7900-xtx', 'amd-rx-7900-xt', 'amd-rx-7800-xt', 'amd-rx-7700-xt', 'amd-rx-7600', 'intel-arc-a770', 'intel-arc-a750']),
  (SELECT id FROM categories WHERE slug = 'graphics-cards'),
  unnest(ARRAY['NVIDIA RTX 4090', 'NVIDIA RTX 4080 Super', 'NVIDIA RTX 4080', 'NVIDIA RTX 4070 Ti Super', 'NVIDIA RTX 4070 Super', 'NVIDIA RTX 4070', 'NVIDIA RTX 4060 Ti', 'NVIDIA RTX 4060', 'AMD RX 7900 XTX', 'AMD RX 7900 XT', 'AMD RX 7800 XT', 'AMD RX 7700 XT', 'AMD RX 7600', 'Intel Arc A770', 'Intel Arc A750']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Add CPU Series under Processors
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Intel Core i9 14th Gen', 'Intel Core i7 14th Gen', 'Intel Core i5 14th Gen', 'Intel Core i3 14th Gen', 'AMD Ryzen 9 7000', 'AMD Ryzen 7 7000', 'AMD Ryzen 5 7000', 'AMD Ryzen 9 5000', 'AMD Ryzen 7 5000', 'AMD Ryzen 5 5000', 'AMD Threadripper', 'Intel Xeon', 'Intel Core Ultra Series', 'Apple M3 Chips', 'Apple M2 Chips']),
  unnest(ARRAY['intel-core-i9-14gen', 'intel-core-i7-14gen', 'intel-core-i5-14gen', 'intel-core-i3-14gen', 'amd-ryzen-9-7000', 'amd-ryzen-7-7000', 'amd-ryzen-5-7000', 'amd-ryzen-9-5000', 'amd-ryzen-7-5000', 'amd-ryzen-5-5000', 'amd-threadripper', 'intel-xeon', 'intel-core-ultra', 'apple-m3-chips', 'apple-m2-chips']),
  (SELECT id FROM categories WHERE slug = 'processors-cpu'),
  unnest(ARRAY['Intel Core i9 14-то Поколение', 'Intel Core i7 14-то Поколение', 'Intel Core i5 14-то Поколение', 'Intel Core i3 14-то Поколение', 'AMD Ryzen 9 7000', 'AMD Ryzen 7 7000', 'AMD Ryzen 5 7000', 'AMD Ryzen 9 5000', 'AMD Ryzen 7 5000', 'AMD Ryzen 5 5000', 'AMD Threadripper', 'Intel Xeon', 'Intel Core Ultra Серия', 'Apple M3 Чипове', 'Apple M2 Чипове']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- Add RAM Types under RAM Memory
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['DDR5 RAM', 'DDR4 RAM', 'DDR5 SODIMM', 'DDR4 SODIMM', 'RGB RAM', 'Server RAM ECC', '16GB RAM Kits', '32GB RAM Kits', '64GB RAM Kits', '128GB RAM Kits']),
  unnest(ARRAY['ddr5-ram', 'ddr4-ram', 'ddr5-sodimm', 'ddr4-sodimm', 'rgb-ram', 'server-ram-ecc', '16gb-ram-kits', '32gb-ram-kits', '64gb-ram-kits', '128gb-ram-kits']),
  (SELECT id FROM categories WHERE slug = 'ram-memory'),
  unnest(ARRAY['DDR5 RAM', 'DDR4 RAM', 'DDR5 SODIMM', 'DDR4 SODIMM', 'RGB RAM', 'Сървър RAM ECC', '16GB RAM Комплекти', '32GB RAM Комплекти', '64GB RAM Комплекти', '128GB RAM Комплекти']),
  '🧠'
ON CONFLICT (slug) DO NOTHING;

-- Add Storage Types under Storage Drives
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['NVMe Gen 5 SSD', 'NVMe Gen 4 SSD', 'NVMe Gen 3 SSD', 'SATA SSD', '2.5" SATA HDD', '3.5" Internal HDD', 'M.2 SSD', 'External SSD', 'External HDD', 'NAS Drives']),
  unnest(ARRAY['nvme-gen5-ssd', 'nvme-gen4-ssd', 'nvme-gen3-ssd', 'sata-ssd', '25-sata-hdd', '35-internal-hdd', 'm2-ssd', 'external-ssd', 'external-hdd', 'nas-drives']),
  (SELECT id FROM categories WHERE slug = 'storage-drives'),
  unnest(ARRAY['NVMe Gen 5 SSD', 'NVMe Gen 4 SSD', 'NVMe Gen 3 SSD', 'SATA SSD', '2.5" SATA HDD', '3.5" Вътрешен HDD', 'M.2 SSD', 'Външен SSD', 'Външен HDD', 'NAS Дискове']),
  '💾'
ON CONFLICT (slug) DO NOTHING;

-- Add Motherboard Chipsets under Motherboards
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Intel Z790 Motherboards', 'Intel B760 Motherboards', 'Intel H770 Motherboards', 'AMD X670E Motherboards', 'AMD X670 Motherboards', 'AMD B650E Motherboards', 'AMD B650 Motherboards', 'AMD X570 Motherboards', 'AMD B550 Motherboards', 'Mini-ITX Motherboards', 'Micro-ATX Motherboards', 'ATX Motherboards', 'E-ATX Motherboards']),
  unnest(ARRAY['intel-z790-motherboards', 'intel-b760-motherboards', 'intel-h770-motherboards', 'amd-x670e-motherboards', 'amd-x670-motherboards', 'amd-b650e-motherboards', 'amd-b650-motherboards', 'amd-x570-motherboards', 'amd-b550-motherboards', 'mini-itx-motherboards', 'micro-atx-motherboards', 'atx-motherboards', 'e-atx-motherboards']),
  (SELECT id FROM categories WHERE slug = 'motherboards'),
  unnest(ARRAY['Intel Z790 Дънни Платки', 'Intel B760 Дънни Платки', 'Intel H770 Дънни Платки', 'AMD X670E Дънни Платки', 'AMD X670 Дънни Платки', 'AMD B650E Дънни Платки', 'AMD B650 Дънни Платки', 'AMD X570 Дънни Платки', 'AMD B550 Дънни Платки', 'Mini-ITX Дънни Платки', 'Micro-ATX Дънни Платки', 'ATX Дънни Платки', 'E-ATX Дънни Платки']),
  '🔌'
ON CONFLICT (slug) DO NOTHING;

-- Add PSU Tiers under Power Supplies
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['80+ Titanium PSU', '80+ Platinum PSU', '80+ Gold PSU', '80+ Bronze PSU', '80+ White PSU', 'Modular PSU', 'Semi-Modular PSU', 'Non-Modular PSU', 'SFX PSU', 'ATX 3.0 PSU', '1000W+ PSU', '750W-1000W PSU', '500W-750W PSU']),
  unnest(ARRAY['80plus-titanium-psu', '80plus-platinum-psu', '80plus-gold-psu', '80plus-bronze-psu', '80plus-white-psu', 'modular-psu', 'semi-modular-psu', 'non-modular-psu', 'sfx-psu', 'atx-30-psu', '1000w-plus-psu', '750w-1000w-psu', '500w-750w-psu']),
  (SELECT id FROM categories WHERE slug = 'power-supplies-psu'),
  unnest(ARRAY['80+ Titanium PSU', '80+ Platinum PSU', '80+ Gold PSU', '80+ Bronze PSU', '80+ White PSU', 'Модулен PSU', 'Полу-Модулен PSU', 'Не-Модулен PSU', 'SFX PSU', 'ATX 3.0 PSU', '1000W+ PSU', '750W-1000W PSU', '500W-750W PSU']),
  '⚡'
ON CONFLICT (slug) DO NOTHING;

-- Add PC Case Types under PC Cases
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Full Tower Cases', 'Mid Tower Cases', 'Mini Tower Cases', 'ITX Cases', 'SFF Cases', 'RGB Cases', 'Tempered Glass Cases', 'Mesh Airflow Cases', 'NZXT Cases', 'Corsair Cases', 'Lian Li Cases', 'Fractal Design Cases']),
  unnest(ARRAY['full-tower-cases', 'mid-tower-cases', 'mini-tower-cases', 'itx-cases', 'sff-cases', 'rgb-cases', 'tempered-glass-cases', 'mesh-airflow-cases', 'nzxt-cases', 'corsair-cases', 'lian-li-cases', 'fractal-design-cases']),
  (SELECT id FROM categories WHERE slug = 'pc-cases'),
  unnest(ARRAY['Full Tower Кутии', 'Mid Tower Кутии', 'Mini Tower Кутии', 'ITX Кутии', 'SFF Кутии', 'RGB Кутии', 'Кутии с Темперирано Стъкло', 'Mesh Кутии', 'NZXT Кутии', 'Corsair Кутии', 'Lian Li Кутии', 'Fractal Design Кутии']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;

-- Add Cooling Types under Cooling Solutions
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['AIO Liquid Coolers', 'Custom Water Cooling', 'Tower Air Coolers', 'Low Profile Coolers', '360mm AIO', '280mm AIO', '240mm AIO', '120mm AIO', 'Noctua Coolers', 'Corsair Coolers', 'NZXT Coolers', 'be quiet! Coolers', 'Thermal Paste']),
  unnest(ARRAY['aio-liquid-coolers', 'custom-water-cooling', 'tower-air-coolers', 'low-profile-coolers', '360mm-aio', '280mm-aio', '240mm-aio', '120mm-aio', 'noctua-coolers', 'corsair-coolers', 'nzxt-coolers', 'bequiet-coolers', 'thermal-paste']),
  (SELECT id FROM categories WHERE slug = 'cooling-solutions'),
  unnest(ARRAY['AIO Течно Охлаждане', 'Персонализирано Водно Охлаждане', 'Tower Въздушни Охладители', 'Нископрофилни Охладители', '360mm AIO', '280mm AIO', '240mm AIO', '120mm AIO', 'Noctua Охладители', 'Corsair Охладители', 'NZXT Охладители', 'be quiet! Охладители', 'Термопаста']),
  '❄️'
ON CONFLICT (slug) DO NOTHING;
;
