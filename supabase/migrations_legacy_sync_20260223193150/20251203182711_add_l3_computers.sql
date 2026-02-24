
-- L3 for CPUs
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Intel Core i9', 'Intel Core i9', 'cpu-i9', id, 1 FROM categories WHERE slug = 'cpus'
UNION ALL
SELECT 'Intel Core i7', 'Intel Core i7', 'cpu-i7', id, 2 FROM categories WHERE slug = 'cpus'
UNION ALL
SELECT 'Intel Core i5', 'Intel Core i5', 'cpu-i5', id, 3 FROM categories WHERE slug = 'cpus'
UNION ALL
SELECT 'AMD Ryzen 9', 'AMD Ryzen 9', 'cpu-ryzen9', id, 4 FROM categories WHERE slug = 'cpus'
UNION ALL
SELECT 'AMD Ryzen 7', 'AMD Ryzen 7', 'cpu-ryzen7', id, 5 FROM categories WHERE slug = 'cpus'
UNION ALL
SELECT 'AMD Ryzen 5', 'AMD Ryzen 5', 'cpu-ryzen5', id, 6 FROM categories WHERE slug = 'cpus';

-- L3 for GPUs
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'NVIDIA RTX 40 Series', 'NVIDIA RTX 40 серия', 'gpu-rtx40', id, 1 FROM categories WHERE slug = 'gpus'
UNION ALL
SELECT 'NVIDIA RTX 30 Series', 'NVIDIA RTX 30 серия', 'gpu-rtx30', id, 2 FROM categories WHERE slug = 'gpus'
UNION ALL
SELECT 'AMD Radeon RX 7000', 'AMD Radeon RX 7000', 'gpu-rx7000', id, 3 FROM categories WHERE slug = 'gpus'
UNION ALL
SELECT 'AMD Radeon RX 6000', 'AMD Radeon RX 6000', 'gpu-rx6000', id, 4 FROM categories WHERE slug = 'gpus'
UNION ALL
SELECT 'Intel Arc', 'Intel Arc', 'gpu-arc', id, 5 FROM categories WHERE slug = 'gpus';

-- L3 for Storage
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'NVMe SSDs', 'NVMe SSD', 'storage-nvme', id, 1 FROM categories WHERE slug = 'storage'
UNION ALL
SELECT 'SATA SSDs', 'SATA SSD', 'storage-sata-ssd', id, 2 FROM categories WHERE slug = 'storage'
UNION ALL
SELECT 'HDDs', 'Твърди дискове', 'storage-hdd', id, 3 FROM categories WHERE slug = 'storage'
UNION ALL
SELECT 'External Storage', 'Външни устройства', 'storage-external', id, 4 FROM categories WHERE slug = 'storage'
UNION ALL
SELECT 'USB Flash Drives', 'USB флашки', 'storage-usb', id, 5 FROM categories WHERE slug = 'storage'
UNION ALL
SELECT 'Memory Cards', 'Карти памет', 'storage-cards', id, 6 FROM categories WHERE slug = 'storage';

-- L3 for RAM
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'DDR5 RAM', 'DDR5 RAM', 'ram-ddr5', id, 1 FROM categories WHERE slug = 'ram'
UNION ALL
SELECT 'DDR4 RAM', 'DDR4 RAM', 'ram-ddr4', id, 2 FROM categories WHERE slug = 'ram'
UNION ALL
SELECT 'Laptop RAM', 'RAM за лаптоп', 'ram-laptop', id, 3 FROM categories WHERE slug = 'ram'
UNION ALL
SELECT 'RGB RAM', 'RGB RAM', 'ram-rgb', id, 4 FROM categories WHERE slug = 'ram';

-- L3 for Monitors
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Gaming Monitors', 'Геймърски монитори', 'monitors-gaming', id, 1 FROM categories WHERE slug = 'monitors'
UNION ALL
SELECT '4K Monitors', '4K монитори', 'monitors-4k', id, 2 FROM categories WHERE slug = 'monitors'
UNION ALL
SELECT 'Ultrawide Monitors', 'Ultrawide монитори', 'monitors-ultrawide', id, 3 FROM categories WHERE slug = 'monitors'
UNION ALL
SELECT 'Office Monitors', 'Офис монитори', 'monitors-office', id, 4 FROM categories WHERE slug = 'monitors'
UNION ALL
SELECT 'Curved Monitors', 'Извити монитори', 'monitors-curved', id, 5 FROM categories WHERE slug = 'monitors'
UNION ALL
SELECT 'Portable Monitors', 'Преносими монитори', 'monitors-portable', id, 6 FROM categories WHERE slug = 'monitors';
;
