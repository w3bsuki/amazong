-- Reorder categories for subheader:
-- Replace Toys with Health, add Pets and Real Estate to visible categories
-- New visible order (1-13): Fashion, Electronics, Automotive, Home, Sports, Beauty, Health, Hobbies, Gaming, Computers, Books, Pets, Real Estate

-- Move Health to position 7 (was 14)
UPDATE categories SET display_order = 7 WHERE slug = 'health-wellness';

-- Move Toys to position 14 (was 7) - push down 
UPDATE categories SET display_order = 14 WHERE slug = 'toys';

-- Keep Pets at 12 (already there)
-- UPDATE categories SET display_order = 12 WHERE slug = 'pets';

-- Move Real Estate to position 13 (was 29)
UPDATE categories SET display_order = 13 WHERE slug = 'real-estate';

-- Shift Baby & Kids down (was 13 -> 15)
UPDATE categories SET display_order = 15 WHERE slug = 'baby-kids';

-- Shift Garden down (was 15 -> 16)
UPDATE categories SET display_order = 16 WHERE slug = 'garden-outdoor';

-- Shift Jewelry down (was 16 -> 17)
UPDATE categories SET display_order = 17 WHERE slug = 'jewelry-watches';

-- Shift Collectibles down (was 17 -> 18)
UPDATE categories SET display_order = 18 WHERE slug = 'collectibles';

-- Shift Movies & Music down (was 18 -> 19)
UPDATE categories SET display_order = 19 WHERE slug = 'movies-music';

-- Shift Musical Instruments down (was 19 -> 20)
UPDATE categories SET display_order = 20 WHERE slug = 'musical-instruments';

-- Shift Office & School down (was 20 -> 21)
UPDATE categories SET display_order = 21 WHERE slug = 'office-school';;
