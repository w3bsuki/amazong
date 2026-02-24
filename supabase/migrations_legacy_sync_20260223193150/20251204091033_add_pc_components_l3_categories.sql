-- Add detailed PC Components L3 under components (71ded4af-a639-4d1b-9261-8d0288a8a095)
-- GPUs
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('NVIDIA RTX 40 Series', 'NVIDIA RTX 40 серия', 'gpus-rtx-40', '71ded4af-a639-4d1b-9261-8d0288a8a095', 1),
('NVIDIA RTX 30 Series', 'NVIDIA RTX 30 серия', 'gpus-rtx-30', '71ded4af-a639-4d1b-9261-8d0288a8a095', 2),
('AMD Radeon RX 7000', 'AMD Radeon RX 7000', 'gpus-rx-7000', '71ded4af-a639-4d1b-9261-8d0288a8a095', 3),
('AMD Radeon RX 6000', 'AMD Radeon RX 6000', 'gpus-rx-6000', '71ded4af-a639-4d1b-9261-8d0288a8a095', 4),
('Intel Arc', 'Intel Arc', 'gpus-intel-arc', '71ded4af-a639-4d1b-9261-8d0288a8a095', 5),
('Workstation GPUs', 'Работни станции GPU', 'gpus-workstation', '71ded4af-a639-4d1b-9261-8d0288a8a095', 6),
-- CPUs
('Intel Core i9', 'Intel Core i9', 'cpus-i9', '71ded4af-a639-4d1b-9261-8d0288a8a095', 10),
('Intel Core i7', 'Intel Core i7', 'cpus-i7', '71ded4af-a639-4d1b-9261-8d0288a8a095', 11),
('Intel Core i5', 'Intel Core i5', 'cpus-i5', '71ded4af-a639-4d1b-9261-8d0288a8a095', 12),
('Intel Core i3', 'Intel Core i3', 'cpus-i3', '71ded4af-a639-4d1b-9261-8d0288a8a095', 13),
('Intel Core Ultra', 'Intel Core Ultra', 'cpus-core-ultra', '71ded4af-a639-4d1b-9261-8d0288a8a095', 14),
('AMD Ryzen 9', 'AMD Ryzen 9', 'cpus-ryzen-9', '71ded4af-a639-4d1b-9261-8d0288a8a095', 15),
('AMD Ryzen 7', 'AMD Ryzen 7', 'cpus-ryzen-7', '71ded4af-a639-4d1b-9261-8d0288a8a095', 16),
('AMD Ryzen 5', 'AMD Ryzen 5', 'cpus-ryzen-5', '71ded4af-a639-4d1b-9261-8d0288a8a095', 17),
('AMD Threadripper', 'AMD Threadripper', 'cpus-threadripper', '71ded4af-a639-4d1b-9261-8d0288a8a095', 18),
-- RAM
('DDR5 RAM', 'DDR5 RAM', 'ram-ddr5', '71ded4af-a639-4d1b-9261-8d0288a8a095', 20),
('DDR4 RAM', 'DDR4 RAM', 'ram-ddr4', '71ded4af-a639-4d1b-9261-8d0288a8a095', 21),
('Laptop RAM (SODIMM)', 'Лаптоп RAM (SODIMM)', 'ram-sodimm', '71ded4af-a639-4d1b-9261-8d0288a8a095', 22),
('Server RAM (ECC)', 'Сървърна RAM (ECC)', 'ram-ecc', '71ded4af-a639-4d1b-9261-8d0288a8a095', 23),
-- Storage
('NVMe SSDs', 'NVMe SSD дискове', 'storage-nvme', '71ded4af-a639-4d1b-9261-8d0288a8a095', 25),
('SATA SSDs', 'SATA SSD дискове', 'storage-sata-ssd', '71ded4af-a639-4d1b-9261-8d0288a8a095', 26),
('Hard Drives (HDD)', 'Твърди дискове (HDD)', 'storage-hdd', '71ded4af-a639-4d1b-9261-8d0288a8a095', 27),
('External Drives', 'Външни дискове', 'storage-external', '71ded4af-a639-4d1b-9261-8d0288a8a095', 28),
-- Motherboards
('Intel Motherboards', 'Intel дънни платки', 'motherboards-intel', '71ded4af-a639-4d1b-9261-8d0288a8a095', 30),
('AMD Motherboards', 'AMD дънни платки', 'motherboards-amd', '71ded4af-a639-4d1b-9261-8d0288a8a095', 31),
('Mini-ITX Motherboards', 'Mini-ITX дънни платки', 'motherboards-mini-itx', '71ded4af-a639-4d1b-9261-8d0288a8a095', 32),
-- PSUs
('Modular PSUs', 'Модулни захранвания', 'psus-modular', '71ded4af-a639-4d1b-9261-8d0288a8a095', 35),
('Semi-Modular PSUs', 'Полу-модулни захранвания', 'psus-semi-modular', '71ded4af-a639-4d1b-9261-8d0288a8a095', 36),
('Non-Modular PSUs', 'Немодулни захранвания', 'psus-non-modular', '71ded4af-a639-4d1b-9261-8d0288a8a095', 37),
-- Cases
('Full Tower Cases', 'Full Tower кутии', 'cases-full-tower', '71ded4af-a639-4d1b-9261-8d0288a8a095', 40),
('Mid Tower Cases', 'Mid Tower кутии', 'cases-mid-tower', '71ded4af-a639-4d1b-9261-8d0288a8a095', 41),
('Mini-ITX Cases', 'Mini-ITX кутии', 'cases-mini-itx', '71ded4af-a639-4d1b-9261-8d0288a8a095', 42),
-- Cooling
('Air Coolers', 'Въздушни охладители', 'cooling-air', '71ded4af-a639-4d1b-9261-8d0288a8a095', 45),
('AIO Liquid Coolers', 'AIO течни охладители', 'cooling-aio', '71ded4af-a639-4d1b-9261-8d0288a8a095', 46),
('Custom Loop Parts', 'Части за custom loop', 'cooling-custom', '71ded4af-a639-4d1b-9261-8d0288a8a095', 47),
('Case Fans', 'Вентилатори за кутии', 'cooling-case-fans', '71ded4af-a639-4d1b-9261-8d0288a8a095', 48),
('Thermal Paste', 'Термопаста', 'cooling-thermal-paste', '71ded4af-a639-4d1b-9261-8d0288a8a095', 49)
ON CONFLICT (slug) DO NOTHING;;
