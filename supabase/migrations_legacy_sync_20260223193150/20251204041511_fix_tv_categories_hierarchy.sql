
-- Fix the redundant Телевизори > Телевизори structure
-- Move all TV types directly under the L1 Телевизори category

-- Move OLED TVs to L1 Телевизори
UPDATE categories 
SET parent_id = 'ea62ae60-2f54-47b8-b370-bda69173783f',
    display_order = 1
WHERE slug = 'tv-oled';

-- Move QLED TVs to L1 Телевизори
UPDATE categories 
SET parent_id = 'ea62ae60-2f54-47b8-b370-bda69173783f',
    display_order = 2
WHERE slug = 'tv-qled';

-- Move LED/LCD TVs to L1 Телевизори
UPDATE categories 
SET parent_id = 'ea62ae60-2f54-47b8-b370-bda69173783f',
    display_order = 3
WHERE slug = 'tv-led';

-- Move Smart TVs to L1 Телевизори
UPDATE categories 
SET parent_id = 'ea62ae60-2f54-47b8-b370-bda69173783f',
    display_order = 4
WHERE slug = 'tv-smart';

-- Move 4K/8K TVs to L1 Телевизори
UPDATE categories 
SET parent_id = 'ea62ae60-2f54-47b8-b370-bda69173783f',
    display_order = 5
WHERE slug = 'tv-4k8k';

-- Now delete the redundant "Телевизори" L2 category (it should be empty now)
-- First mark as deprecated in case products reference it
UPDATE categories 
SET name = '[DEPRECATED] Televisions',
    name_bg = '[СКРИТО] Телевизори',
    display_order = 999
WHERE id = '31210ed5-4361-4a6f-8298-98f7f4b7bafe';

-- Update display order for other items under Телевизори L1
UPDATE categories SET display_order = 6 WHERE slug = 'projectors';
UPDATE categories SET display_order = 7 WHERE slug = 'streaming-devices';
UPDATE categories SET display_order = 8 WHERE slug = 'home-theater';
;
