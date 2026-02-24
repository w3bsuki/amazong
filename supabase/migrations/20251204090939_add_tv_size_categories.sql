-- Get TV category ID first, then add TV by Size L2 and its L3 children
-- Add TV By Size L2 under televisions-category (ea62ae60-2f54-47b8-b370-bda69173783f)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('TV by Size', 'Телевизори по размер', 'tv-by-size', 'ea62ae60-2f54-47b8-b370-bda69173783f', 5),
('TV by Technology', 'Телевизори по технология', 'tv-by-technology', 'ea62ae60-2f54-47b8-b370-bda69173783f', 6),
('TV by Brand', 'Телевизори по марка', 'tv-by-brand', 'ea62ae60-2f54-47b8-b370-bda69173783f', 7),
('TV Accessories', 'Аксесоари за телевизори', 'tv-accessories', 'ea62ae60-2f54-47b8-b370-bda69173783f', 8)
ON CONFLICT (slug) DO NOTHING;;
