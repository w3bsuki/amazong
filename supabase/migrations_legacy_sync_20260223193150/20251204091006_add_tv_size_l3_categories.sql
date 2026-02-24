-- Add TV size L3 categories under tv-by-size (0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('32" TVs', '32" телевизори', 'tv-32-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 1),
('40" TVs', '40" телевизори', 'tv-40-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 2),
('43" TVs', '43" телевизори', 'tv-43-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 3),
('50" TVs', '50" телевизори', 'tv-50-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 4),
('55" TVs', '55" телевизори', 'tv-55-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 5),
('58" TVs', '58" телевизори', 'tv-58-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 6),
('65" TVs', '65" телевизори', 'tv-65-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 7),
('70" TVs', '70" телевизори', 'tv-70-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 8),
('75" TVs', '75" телевизори', 'tv-75-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 9),
('77" TVs', '77" телевизори', 'tv-77-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 10),
('83" TVs', '83" телевизори', 'tv-83-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 11),
('85" TVs', '85" телевизори', 'tv-85-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 12),
('98"+ TVs', '98"+ телевизори', 'tv-98-plus-inch', '0c41aae7-b42f-40fb-a5d2-8b52e1c1ccba', 13)
ON CONFLICT (slug) DO NOTHING;

-- Add TV by Technology L3 categories under tv-by-technology (6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('OLED TVs', 'OLED телевизори', 'oled-tvs-new', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 1),
('QLED TVs', 'QLED телевизори', 'qled-tvs-new', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 2),
('QD-OLED TVs', 'QD-OLED телевизори', 'qd-oled-tvs', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 3),
('Mini-LED TVs', 'Mini-LED телевизори', 'mini-led-tvs-new', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 4),
('LED/LCD TVs', 'LED/LCD телевизори', 'led-lcd-tvs-new', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 5),
('NanoCell TVs', 'NanoCell телевизори', 'nanocell-tvs', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 6),
('Crystal UHD TVs', 'Crystal UHD телевизори', 'crystal-uhd-tvs', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 7),
('8K TVs', '8K телевизори', '8k-tvs-new', '6e2b3bf5-fbdc-4b77-a5d5-a9558c7aaaa7', 8)
ON CONFLICT (slug) DO NOTHING;

-- Add TV by Brand L3 categories under tv-by-brand (918d71e8-4b4d-4bf4-9da9-818741035253)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Samsung TVs', 'Samsung телевизори', 'samsung-tvs-new', '918d71e8-4b4d-4bf4-9da9-818741035253', 1),
('LG TVs', 'LG телевизори', 'lg-tvs-new', '918d71e8-4b4d-4bf4-9da9-818741035253', 2),
('Sony TVs', 'Sony телевизори', 'sony-tvs-new', '918d71e8-4b4d-4bf4-9da9-818741035253', 3),
('TCL TVs', 'TCL телевизори', 'tcl-tvs-new', '918d71e8-4b4d-4bf4-9da9-818741035253', 4),
('Hisense TVs', 'Hisense телевизори', 'hisense-tvs-new', '918d71e8-4b4d-4bf4-9da9-818741035253', 5),
('Philips TVs', 'Philips телевизори', 'philips-tvs-new', '918d71e8-4b4d-4bf4-9da9-818741035253', 6),
('Toshiba TVs', 'Toshiba телевизори', 'toshiba-tvs', '918d71e8-4b4d-4bf4-9da9-818741035253', 7),
('Panasonic TVs', 'Panasonic телевизори', 'panasonic-tvs', '918d71e8-4b4d-4bf4-9da9-818741035253', 8)
ON CONFLICT (slug) DO NOTHING;

-- Add TV Accessories L3 under tv-accessories (70266f86-d5ed-4b2e-85fb-2df7d2d14a52)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('TV Mounts & Stands', 'Стойки за телевизори', 'tv-mounts-stands', '70266f86-d5ed-4b2e-85fb-2df7d2d14a52', 1),
('Streaming Devices', 'Стрийминг устройства', 'streaming-devices-new', '70266f86-d5ed-4b2e-85fb-2df7d2d14a52', 2),
('HDMI Cables & Adapters', 'HDMI кабели и адаптери', 'hdmi-cables-adapters', '70266f86-d5ed-4b2e-85fb-2df7d2d14a52', 3),
('Universal Remotes', 'Универсални дистанционни', 'universal-remotes-new', '70266f86-d5ed-4b2e-85fb-2df7d2d14a52', 4),
('TV Antennas', 'Телевизионни антени', 'tv-antennas', '70266f86-d5ed-4b2e-85fb-2df7d2d14a52', 5),
('Screen Cleaners', 'Почистващи препарати за екрани', 'screen-cleaners-new', '70266f86-d5ed-4b2e-85fb-2df7d2d14a52', 6)
ON CONFLICT (slug) DO NOTHING;;
