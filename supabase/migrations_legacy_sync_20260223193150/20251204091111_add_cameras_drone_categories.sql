-- Add more Camera categories under electronics-cameras (a7c14d7c-a6d6-457a-9333-2fa6755ccccd)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- Camera types
('Mirrorless Cameras', 'Безогледални фотоапарати', 'mirrorless-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 1),
('DSLR Cameras', 'DSLR фотоапарати', 'dslr-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 2),
('Compact Cameras', 'Компактни фотоапарати', 'compact-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 3),
('360° Cameras', '360° камери', '360-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 4),
('Instant Cameras', 'Инстант фотоапарати', 'instant-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 5),
('Cinema Cameras', 'Кино камери', 'cinema-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 6),
('Vlogging Cameras', 'Влог камери', 'vlogging-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 7),
-- Camera Lenses
('Wide Angle Lenses', 'Широкоъгълни обективи', 'wide-angle-lenses', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 10),
('Telephoto Lenses', 'Телеобективи', 'telephoto-lenses', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 11),
('Prime Lenses', 'Фикс обективи', 'prime-lenses', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 12),
('Zoom Lenses', 'Зуум обективи', 'zoom-lenses', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 13),
('Macro Lenses', 'Макро обективи', 'macro-lenses', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 14),
-- Drones (more detailed)
('Consumer Drones', 'Дронове за любители', 'consumer-drones', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 20),
('Professional Drones', 'Професионални дронове', 'professional-drones', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 21),
('FPV Drones', 'FPV дронове', 'fpv-drones', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 22),
('Mini Drones', 'Мини дронове', 'mini-drones', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 23),
('Drone Accessories', 'Аксесоари за дронове', 'drone-accessories', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 24),
-- Camera by brand
('Canon Cameras', 'Canon фотоапарати', 'canon-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 30),
('Sony Cameras', 'Sony фотоапарати', 'sony-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 31),
('Nikon Cameras', 'Nikon фотоапарати', 'nikon-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 32),
('Fujifilm Cameras', 'Fujifilm фотоапарати', 'fujifilm-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 33),
('Panasonic Cameras', 'Panasonic фотоапарати', 'panasonic-cameras', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 34),
('DJI Products', 'DJI продукти', 'dji-products', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 35),
('GoPro', 'GoPro', 'gopro', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 36),
-- Camera Accessories
('Tripods & Monopods', 'Статив и моноподове', 'tripods-monopods', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 40),
('Gimbals & Stabilizers', 'Гимбали и стабилизатори', 'gimbals-stabilizers', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 41),
('Memory Cards', 'Карти памет', 'memory-cards', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 42),
('Camera Batteries', 'Батерии за фотоапарати', 'camera-batteries', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 43),
('Camera Bags', 'Чанти за фотоапарати', 'camera-bags', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 44),
('Lens Filters', 'Филтри за обективи', 'lens-filters', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 45),
('Lighting Equipment', 'Осветителна техника', 'lighting-equipment', 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd', 46)
ON CONFLICT (slug) DO NOTHING;;
