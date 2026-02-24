-- Add more headphone types under headphones (f21a988c-6440-462a-970f-7d584434a481)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- Headphone types
('True Wireless Earbuds', 'Безжични слушалки (TWS)', 'tws-earbuds', 'f21a988c-6440-462a-970f-7d584434a481', 1),
('Over-Ear Headphones', 'Наушници Over-Ear', 'over-ear-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 2),
('On-Ear Headphones', 'Наушници On-Ear', 'on-ear-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 3),
('Wired Earbuds', 'Жични слушалки', 'wired-earbuds', 'f21a988c-6440-462a-970f-7d584434a481', 4),
('Noise Cancelling', 'С активно шумопотискане (ANC)', 'anc-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 5),
('Sports & Running', 'Спортни слушалки', 'sports-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 6),
('Studio & DJ', 'Студийни и DJ слушалки', 'studio-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 7),
('Gaming Headsets', 'Гейминг слушалки', 'gaming-headsets-audio', 'f21a988c-6440-462a-970f-7d584434a481', 8),
('Bone Conduction', 'Костна проводимост', 'bone-conduction', 'f21a988c-6440-462a-970f-7d584434a481', 9),
-- By Brand
('AirPods', 'AirPods', 'airpods', 'f21a988c-6440-462a-970f-7d584434a481', 10),
('Sony Headphones', 'Sony слушалки', 'sony-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 11),
('Bose Headphones', 'Bose слушалки', 'bose-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 12),
('Samsung Galaxy Buds', 'Samsung Galaxy Buds', 'galaxy-buds', 'f21a988c-6440-462a-970f-7d584434a481', 13),
('Sennheiser', 'Sennheiser', 'sennheiser-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 14),
('JBL Headphones', 'JBL слушалки', 'jbl-headphones', 'f21a988c-6440-462a-970f-7d584434a481', 15)
ON CONFLICT (slug) DO NOTHING;

-- Add Speakers L2 under audio (a0000000-0000-0000-0000-000000000001)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Speakers', 'Високоговорители', 'speakers', 'a0000000-0000-0000-0000-000000000001', 10),
('Home Audio Systems', 'Домашни аудио системи', 'home-audio-systems', 'a0000000-0000-0000-0000-000000000001', 11),
('Microphones', 'Микрофони', 'microphones-audio', 'a0000000-0000-0000-0000-000000000001', 12),
('Audio Accessories', 'Аудио аксесоари', 'audio-accessories-new', 'a0000000-0000-0000-0000-000000000001', 13)
ON CONFLICT (slug) DO NOTHING;;
