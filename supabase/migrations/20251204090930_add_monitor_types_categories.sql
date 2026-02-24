-- Add monitor type L3 categories under monitors (60665111-9123-4398-9f26-ba4415979752)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- By Refresh Rate
('60Hz Monitors', '60Hz монитори', 'monitors-60hz', '60665111-9123-4398-9f26-ba4415979752', 10),
('75Hz Monitors', '75Hz монитори', 'monitors-75hz', '60665111-9123-4398-9f26-ba4415979752', 11),
('120Hz Monitors', '120Hz монитори', 'monitors-120hz', '60665111-9123-4398-9f26-ba4415979752', 12),
('144Hz Monitors', '144Hz монитори', 'monitors-144hz', '60665111-9123-4398-9f26-ba4415979752', 13),
('165Hz Monitors', '165Hz монитори', 'monitors-165hz', '60665111-9123-4398-9f26-ba4415979752', 14),
('240Hz Monitors', '240Hz монитори', 'monitors-240hz', '60665111-9123-4398-9f26-ba4415979752', 15),
('360Hz Monitors', '360Hz монитори', 'monitors-360hz', '60665111-9123-4398-9f26-ba4415979752', 16),
('500Hz Monitors', '500Hz монитори', 'monitors-500hz', '60665111-9123-4398-9f26-ba4415979752', 17),
-- By Panel Type
('IPS Monitors', 'IPS монитори', 'monitors-ips', '60665111-9123-4398-9f26-ba4415979752', 20),
('VA Monitors', 'VA монитори', 'monitors-va', '60665111-9123-4398-9f26-ba4415979752', 21),
('OLED Monitors', 'OLED монитори', 'monitors-oled', '60665111-9123-4398-9f26-ba4415979752', 22),
('Mini-LED Monitors', 'Mini-LED монитори', 'monitors-miniled', '60665111-9123-4398-9f26-ba4415979752', 23),
('TN Monitors', 'TN монитори', 'monitors-tn', '60665111-9123-4398-9f26-ba4415979752', 24),
-- By Resolution
('8K Monitors', '8K монитори', 'monitors-8k', '60665111-9123-4398-9f26-ba4415979752', 30),
('5K Monitors', '5K монитори', 'monitors-5k', '60665111-9123-4398-9f26-ba4415979752', 31),
('QHD 1440p Monitors', 'QHD 1440p монитори', 'monitors-qhd', '60665111-9123-4398-9f26-ba4415979752', 32),
('Full HD 1080p Monitors', 'Full HD 1080p монитори', 'monitors-fhd', '60665111-9123-4398-9f26-ba4415979752', 33),
-- Super Ultrawide
('Super Ultrawide 32:9', 'Супер широкоекранни 32:9', 'monitors-super-ultrawide', '60665111-9123-4398-9f26-ba4415979752', 40)
ON CONFLICT (slug) DO NOTHING;;
