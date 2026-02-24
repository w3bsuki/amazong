
-- Fix missing Bulgarian names for Electronics categories
UPDATE categories SET name_bg = 'Процесори (CPU)' WHERE slug = 'cpus' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Памет (RAM)' WHERE slug = 'ram' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Дънни платки' WHERE slug = 'motherboards' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Захранвания (PSU)' WHERE slug = 'psus' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Кутии за компютър' WHERE slug = 'pc-cases' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Охладители за процесор' WHERE slug = 'cpu-coolers' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Вентилатори за кутия' WHERE slug = 'case-fans' AND name_bg IS NULL;

-- Headphones
UPDATE categories SET name_bg = 'Над-ушни слушалки' WHERE slug = 'over-ear-headphones' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'На-ушни слушалки' WHERE slug = 'on-ear-headphones' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Тапи' WHERE slug = 'in-ear-headphones' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Безжични слушалки TWS' WHERE slug = 'tws-earbuds' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Гейминг слушалки' WHERE slug = 'gaming-headsets-audio' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Спортни слушалки' WHERE slug = 'sports-headphones' AND name_bg IS NULL;

-- Speakers
UPDATE categories SET name_bg = 'Bluetooth тонколони' WHERE slug = 'bluetooth-speakers' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Смарт тонколони' WHERE slug = 'smart-speakers-audio' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Компютърни тонколони' WHERE slug = 'computer-speakers' AND name_bg IS NULL;
UPDATE categories SET name_bg = 'Саундбари' WHERE slug = 'soundbars' AND name_bg IS NULL;

-- TVs
UPDATE categories SET name_bg = 'Mini-LED телевизори' WHERE slug = 'mini-led-tvs' AND name_bg IS NULL;

-- Power Banks
UPDATE categories SET name_bg = 'Външни батерии' WHERE slug = 'power-banks' AND name_bg IS NULL;
;
