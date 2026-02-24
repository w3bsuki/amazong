-- Add L4s for more categories

-- Vinyl Records L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Rock Vinyl', 'vinyl-rock', '35361214-3fca-4d34-9343-1b20932ace8e', 'Rock and classic rock vinyl'),
('Jazz Vinyl', 'vinyl-jazz', '35361214-3fca-4d34-9343-1b20932ace8e', 'Jazz vinyl records'),
('Hip-Hop Vinyl', 'vinyl-hiphop', '35361214-3fca-4d34-9343-1b20932ace8e', 'Hip-hop and rap vinyl'),
('Electronic Vinyl', 'vinyl-electronic', '35361214-3fca-4d34-9343-1b20932ace8e', 'Electronic and EDM vinyl'),
('Classical Vinyl', 'vinyl-classical', '35361214-3fca-4d34-9343-1b20932ace8e', 'Classical music vinyl'),
('Indie Vinyl', 'vinyl-indie', '35361214-3fca-4d34-9343-1b20932ace8e', 'Indie and alternative vinyl'),
('Soundtracks Vinyl', 'vinyl-soundtracks', '35361214-3fca-4d34-9343-1b20932ace8e', 'Movie and game soundtracks'),
('Limited Edition Vinyl', 'vinyl-limited', '35361214-3fca-4d34-9343-1b20932ace8e', 'Limited and colored vinyl')
ON CONFLICT DO NOTHING;

-- Men's Sport Watches L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Dive Watches', 'sportwatch-dive', '7851f5c6-5a20-43c3-8405-392f0709684c', 'Water resistant dive watches'),
('Pilot Watches', 'sportwatch-pilot', '7851f5c6-5a20-43c3-8405-392f0709684c', 'Aviation style watches'),
('Field Watches', 'sportwatch-field', '7851f5c6-5a20-43c3-8405-392f0709684c', 'Military field watches'),
('Racing Watches', 'sportwatch-racing', '7851f5c6-5a20-43c3-8405-392f0709684c', 'Chronograph racing watches'),
('Outdoor Watches', 'sportwatch-outdoor', '7851f5c6-5a20-43c3-8405-392f0709684c', 'GPS and adventure watches')
ON CONFLICT DO NOTHING;

-- Frozen Meals L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Frozen Pizzas', 'frozen-pizza', '0b309413-288f-487f-ad10-39055753922f', 'Frozen pizza varieties'),
('Frozen Dinners', 'frozen-dinners', '0b309413-288f-487f-ad10-39055753922f', 'Complete frozen dinners'),
('Frozen Asian', 'frozen-asian', '0b309413-288f-487f-ad10-39055753922f', 'Asian frozen meals'),
('Frozen Healthy', 'frozen-healthy', '0b309413-288f-487f-ad10-39055753922f', 'Low-calorie healthy options'),
('Frozen Breakfast', 'frozen-breakfast', '0b309413-288f-487f-ad10-39055753922f', 'Frozen breakfast items')
ON CONFLICT DO NOTHING;

-- Organic Produce L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Organic Fruits', 'organic-fruits', 'cd9f7804-2728-4c27-abc3-a9938c51a34f', 'Organic fresh fruits'),
('Organic Vegetables', 'organic-vegetables', 'cd9f7804-2728-4c27-abc3-a9938c51a34f', 'Organic fresh vegetables'),
('Organic Herbs', 'organic-herbs', 'cd9f7804-2728-4c27-abc3-a9938c51a34f', 'Fresh organic herbs'),
('Organic Leafy Greens', 'organic-greens', 'cd9f7804-2728-4c27-abc3-a9938c51a34f', 'Organic salads and greens'),
('Organic Berries', 'organic-berries', 'cd9f7804-2728-4c27-abc3-a9938c51a34f', 'Organic berries')
ON CONFLICT DO NOTHING;

-- Chips & Crisps L4s
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Potato Chips', 'chips-potato', '7036f2f1-f3e3-4814-8afa-28596723177a', 'Classic potato chips'),
('Tortilla Chips', 'chips-tortilla', '7036f2f1-f3e3-4814-8afa-28596723177a', 'Corn tortilla chips'),
('Kettle Chips', 'chips-kettle', '7036f2f1-f3e3-4814-8afa-28596723177a', 'Kettle-cooked chips'),
('Veggie Chips', 'chips-veggie', '7036f2f1-f3e3-4814-8afa-28596723177a', 'Vegetable-based chips'),
('Pita Chips', 'chips-pita', '7036f2f1-f3e3-4814-8afa-28596723177a', 'Baked pita chips')
ON CONFLICT DO NOTHING;

-- CDs L4s (music CDs)
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Rock CDs', 'cd-rock', '8b10e2c4-0c89-4947-8bb9-aacc19c15e3f', 'Rock music CDs'),
('Pop CDs', 'cd-pop', '8b10e2c4-0c89-4947-8bb9-aacc19c15e3f', 'Pop music CDs'),
('Hip-Hop CDs', 'cd-hiphop', '8b10e2c4-0c89-4947-8bb9-aacc19c15e3f', 'Hip-hop and R&B CDs'),
('Country CDs', 'cd-country', '8b10e2c4-0c89-4947-8bb9-aacc19c15e3f', 'Country music CDs'),
('Classical CDs', 'cd-classical', '8b10e2c4-0c89-4947-8bb9-aacc19c15e3f', 'Classical music CDs'),
('Soundtrack CDs', 'cd-soundtrack', '8b10e2c4-0c89-4947-8bb9-aacc19c15e3f', 'Movie and TV soundtracks')
ON CONFLICT DO NOTHING;;
