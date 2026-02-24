
-- Fix missing Bulgarian names batch 2

-- Phone & TV
UPDATE categories SET name_bg = 'Стойки за телефон' WHERE slug = 'phone-holders';
UPDATE categories SET name_bg = '4K телевизори' WHERE slug = '4k-tvs';
UPDATE categories SET name_bg = '8K телевизори' WHERE slug = '8k-tvs';
UPDATE categories SET name_bg = 'LED/LCD телевизори' WHERE slug = 'led-lcd-tvs';
UPDATE categories SET name_bg = 'OLED телевизори' WHERE slug = 'oled-tvs';
UPDATE categories SET name_bg = 'QLED телевизори' WHERE slug = 'qled-tvs';

-- PlayStation
UPDATE categories SET name_bg = 'PS5 конзоли' WHERE slug = 'ps5-consoles';
UPDATE categories SET name_bg = 'PS5 игри' WHERE slug = 'ps5-games';
UPDATE categories SET name_bg = 'PS5 контролери' WHERE slug = 'ps5-controllers';
UPDATE categories SET name_bg = 'PS5 аксесоари' WHERE slug = 'ps5-accessories';
UPDATE categories SET name_bg = 'PS4 конзоли' WHERE slug = 'ps4-consoles';
UPDATE categories SET name_bg = 'PS4 игри' WHERE slug = 'ps4-games';
UPDATE categories SET name_bg = 'PlayStation VR2' WHERE slug = 'psvr2';

-- Xbox
UPDATE categories SET name_bg = 'Xbox Series X' WHERE slug = 'xbox-series-x';
UPDATE categories SET name_bg = 'Xbox Series S' WHERE slug = 'xbox-series-s';
UPDATE categories SET name_bg = 'Xbox игри' WHERE slug = 'xbox-games';
UPDATE categories SET name_bg = 'Xbox контролери' WHERE slug = 'xbox-controllers';
UPDATE categories SET name_bg = 'Xbox аксесоари' WHERE slug = 'xbox-accessories';
UPDATE categories SET name_bg = 'Xbox Elite контролери' WHERE slug = 'xbox-elite-controllers';

-- Nintendo
UPDATE categories SET name_bg = 'Nintendo Switch OLED' WHERE slug = 'switch-oled';
UPDATE categories SET name_bg = 'Nintendo Switch' WHERE slug = 'switch-standard';
UPDATE categories SET name_bg = 'Nintendo Switch Lite' WHERE slug = 'switch-lite';
UPDATE categories SET name_bg = 'Switch игри' WHERE slug = 'switch-games';
UPDATE categories SET name_bg = 'Switch контролери' WHERE slug = 'switch-controllers';
UPDATE categories SET name_bg = 'Joy-Con контролери' WHERE slug = 'joycon-controllers';
UPDATE categories SET name_bg = 'Switch аксесоари' WHERE slug = 'switch-accessories';
UPDATE categories SET name_bg = 'Amiibo фигурки' WHERE slug = 'amiibo-figures';

-- VR
UPDATE categories SET name_bg = 'Meta Quest' WHERE slug = 'vr-meta-quest';
UPDATE categories SET name_bg = 'Valve Index' WHERE slug = 'vr-valve-index';

-- Pets
UPDATE categories SET name_bg = 'Транспортни чанти за кучета' WHERE slug = 'dog-carriers';
;
