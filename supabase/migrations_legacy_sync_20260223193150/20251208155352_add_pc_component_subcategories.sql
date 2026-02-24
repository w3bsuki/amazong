
-- Add CPU subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, image_url) VALUES
-- Intel CPUs
('Intel Core i3', 'Intel Core i3', 'cpus-intel-i3', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-intel.webp'),
('Intel Core i5', 'Intel Core i5', 'cpus-intel-i5', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-intel.webp'),
('Intel Core i7', 'Intel Core i7', 'cpus-intel-i7', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-intel.webp'),
('Intel Core i9', 'Intel Core i9', 'cpus-intel-i9', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-intel.webp'),
('Intel Core Ultra', 'Intel Core Ultra', 'cpus-intel-ultra', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-intel.webp'),
-- AMD CPUs
('AMD Ryzen 3', 'AMD Ryzen 3', 'cpus-amd-ryzen-3', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-amd.webp'),
('AMD Ryzen 5', 'AMD Ryzen 5', 'cpus-amd-ryzen-5', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-amd.webp'),
('AMD Ryzen 7', 'AMD Ryzen 7', 'cpus-amd-ryzen-7', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-amd.webp'),
('AMD Ryzen 9', 'AMD Ryzen 9', 'cpus-amd-ryzen-9', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-amd.webp'),
('AMD Threadripper', 'AMD Threadripper', 'cpus-amd-threadripper', (SELECT id FROM categories WHERE slug = 'cpus'), '/categories/cpu-amd.webp'),

-- Add GPU subcategories
('NVIDIA GeForce RTX 40 Series', 'NVIDIA GeForce RTX 40 Серия', 'gpus-nvidia-rtx-40', (SELECT id FROM categories WHERE slug = 'gpus'), '/categories/gpu-nvidia.webp'),
('NVIDIA GeForce RTX 30 Series', 'NVIDIA GeForce RTX 30 Серия', 'gpus-nvidia-rtx-30', (SELECT id FROM categories WHERE slug = 'gpus'), '/categories/gpu-nvidia.webp'),
('NVIDIA GeForce RTX 50 Series', 'NVIDIA GeForce RTX 50 Серия', 'gpus-nvidia-rtx-50', (SELECT id FROM categories WHERE slug = 'gpus'), '/categories/gpu-nvidia.webp'),
('AMD Radeon RX 7000 Series', 'AMD Radeon RX 7000 Серия', 'gpus-amd-rx-7000', (SELECT id FROM categories WHERE slug = 'gpus'), '/categories/gpu-amd.webp'),
('AMD Radeon RX 6000 Series', 'AMD Radeon RX 6000 Серия', 'gpus-amd-rx-6000', (SELECT id FROM categories WHERE slug = 'gpus'), '/categories/gpu-amd.webp'),
('Intel Arc', 'Intel Arc', 'gpus-intel-arc', (SELECT id FROM categories WHERE slug = 'gpus'), '/categories/gpu-intel.webp'),

-- Add RAM subcategories
('DDR5 RAM', 'DDR5 RAM', 'ram-ddr5', (SELECT id FROM categories WHERE slug = 'ram'), '/categories/ram.webp'),
('DDR4 RAM', 'DDR4 RAM', 'ram-ddr4', (SELECT id FROM categories WHERE slug = 'ram'), '/categories/ram.webp'),
('DDR3 RAM', 'DDR3 RAM', 'ram-ddr3', (SELECT id FROM categories WHERE slug = 'ram'), '/categories/ram.webp'),
('Laptop RAM', 'RAM за лаптоп', 'ram-laptop', (SELECT id FROM categories WHERE slug = 'ram'), '/categories/ram.webp'),
('RGB RAM', 'RGB RAM', 'ram-rgb', (SELECT id FROM categories WHERE slug = 'ram'), '/categories/ram.webp'),

-- Add Motherboard subcategories
('Intel Motherboards', 'Дънни платки за Intel', 'motherboards-intel', (SELECT id FROM categories WHERE slug = 'motherboards'), '/categories/motherboard.webp'),
('AMD Motherboards', 'Дънни платки за AMD', 'motherboards-amd', (SELECT id FROM categories WHERE slug = 'motherboards'), '/categories/motherboard.webp'),
('ATX Motherboards', 'ATX Дънни платки', 'motherboards-atx', (SELECT id FROM categories WHERE slug = 'motherboards'), '/categories/motherboard.webp'),
('Micro-ATX Motherboards', 'Micro-ATX Дънни платки', 'motherboards-matx', (SELECT id FROM categories WHERE slug = 'motherboards'), '/categories/motherboard.webp'),
('Mini-ITX Motherboards', 'Mini-ITX Дънни платки', 'motherboards-itx', (SELECT id FROM categories WHERE slug = 'motherboards'), '/categories/motherboard.webp'),

-- Add Storage subcategories
('NVMe SSDs', 'NVMe SSD', 'storage-nvme', (SELECT id FROM categories WHERE slug = 'storage'), '/categories/ssd.webp'),
('SATA SSDs', 'SATA SSD', 'storage-sata-ssd', (SELECT id FROM categories WHERE slug = 'storage'), '/categories/ssd.webp'),
('Hard Drives (HDD)', 'Твърди дискове (HDD)', 'storage-hdd', (SELECT id FROM categories WHERE slug = 'storage'), '/categories/hdd.webp'),
('External Storage', 'Външна памет', 'storage-external', (SELECT id FROM categories WHERE slug = 'storage'), '/categories/external-storage.webp'),
('M.2 SSDs', 'M.2 SSD', 'storage-m2', (SELECT id FROM categories WHERE slug = 'storage'), '/categories/ssd.webp'),

-- Add PSU subcategories
('Modular PSUs', 'Модулни захранвания', 'psus-modular', (SELECT id FROM categories WHERE slug = 'psus'), '/categories/psu.webp'),
('Semi-Modular PSUs', 'Полумодулни захранвания', 'psus-semi-modular', (SELECT id FROM categories WHERE slug = 'psus'), '/categories/psu.webp'),
('SFX PSUs', 'SFX захранвания', 'psus-sfx', (SELECT id FROM categories WHERE slug = 'psus'), '/categories/psu.webp'),
('750W+ PSUs', 'Захранвания 750W+', 'psus-750w-plus', (SELECT id FROM categories WHERE slug = 'psus'), '/categories/psu.webp'),
('1000W+ PSUs', 'Захранвания 1000W+', 'psus-1000w-plus', (SELECT id FROM categories WHERE slug = 'psus'), '/categories/psu.webp'),

-- Add PC Case subcategories
('Full Tower Cases', 'Кутии Full Tower', 'pc-cases-full-tower', (SELECT id FROM categories WHERE slug = 'pc-cases'), '/categories/case.webp'),
('Mid Tower Cases', 'Кутии Mid Tower', 'pc-cases-mid-tower', (SELECT id FROM categories WHERE slug = 'pc-cases'), '/categories/case.webp'),
('Mini-ITX Cases', 'Кутии Mini-ITX', 'pc-cases-mini-itx', (SELECT id FROM categories WHERE slug = 'pc-cases'), '/categories/case.webp'),
('RGB Cases', 'RGB кутии', 'pc-cases-rgb', (SELECT id FROM categories WHERE slug = 'pc-cases'), '/categories/case.webp'),
('White Cases', 'Бели кутии', 'pc-cases-white', (SELECT id FROM categories WHERE slug = 'pc-cases'), '/categories/case.webp'),

-- Add CPU Cooler subcategories
('Air Coolers', 'Въздушни охладители', 'cpu-coolers-air', (SELECT id FROM categories WHERE slug = 'cpu-coolers'), '/categories/cooler.webp'),
('AIO Liquid Coolers', 'AIO водно охлаждане', 'cpu-coolers-aio', (SELECT id FROM categories WHERE slug = 'cpu-coolers'), '/categories/aio.webp'),
('240mm AIO', '240mm AIO', 'cpu-coolers-240mm', (SELECT id FROM categories WHERE slug = 'cpu-coolers'), '/categories/aio.webp'),
('360mm AIO', '360mm AIO', 'cpu-coolers-360mm', (SELECT id FROM categories WHERE slug = 'cpu-coolers'), '/categories/aio.webp'),
('Low Profile Coolers', 'Нископрофилни охладители', 'cpu-coolers-low-profile', (SELECT id FROM categories WHERE slug = 'cpu-coolers'), '/categories/cooler.webp');

-- Now propagate attributes from parent categories to all new subcategories
-- CPUs
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'cpus')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cpus');

-- GPUs
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'gpus')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'gpus');

-- RAM
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'ram')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'ram');

-- Motherboards
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'motherboards')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'motherboards');

-- Storage
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'storage')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'storage');

-- PSUs
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'psus')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'psus');

-- PC Cases
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pc-cases')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'pc-cases');

-- CPU Coolers
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, ca.name, ca.name_bg, ca.attribute_type, ca.options, ca.options_bg, ca.is_required, ca.is_filterable, ca.sort_order
FROM categories c
CROSS JOIN category_attributes ca
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'cpu-coolers')
  AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cpu-coolers');
;
