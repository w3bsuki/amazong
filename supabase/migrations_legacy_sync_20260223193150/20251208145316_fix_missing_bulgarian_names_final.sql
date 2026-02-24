
-- Fix remaining missing Bulgarian names

-- Kids/Baby
UPDATE categories SET name_bg = 'Грижа за подсичане' WHERE slug = 'diaper-rash';
UPDATE categories SET name_bg = 'Изкуство и занаяти' WHERE slug = 'toys-arts';
UPDATE categories SET name_bg = 'Играчки за яздене' WHERE slug = 'toys-rideon';
UPDATE categories SET name_bg = 'Екшън фигурки' WHERE slug = 'toys-action';
UPDATE categories SET name_bg = 'Игри и пъзели' WHERE slug = 'toys-games-puzzles';

-- Sports
UPDATE categories SET name_bg = 'Футбол' WHERE slug = 'football-soccer';
UPDATE categories SET name_bg = 'Хокей' WHERE slug = 'hockey';
UPDATE categories SET name_bg = 'Волейбол' WHERE slug = 'volleyball';
UPDATE categories SET name_bg = 'Къмпинг и туризъм' WHERE slug = 'camping-hiking';
UPDATE categories SET name_bg = 'Риболов' WHERE slug = 'fishing';
UPDATE categories SET name_bg = 'Лов' WHERE slug = 'hunting';
UPDATE categories SET name_bg = 'Плуване' WHERE slug = 'swimming';
UPDATE categories SET name_bg = 'Сърфиране' WHERE slug = 'surfing';
UPDATE categories SET name_bg = 'Кану и каяк' WHERE slug = 'kayaking';
UPDATE categories SET name_bg = 'Гмуркане и шнорхелинг' WHERE slug = 'diving';
UPDATE categories SET name_bg = 'Баскетбол' WHERE slug = 'basketball';
UPDATE categories SET name_bg = 'Бейзбол' WHERE slug = 'baseball';
UPDATE categories SET name_bg = 'Ръгби' WHERE slug = 'rugby';

-- Supplements
UPDATE categories SET name_bg = 'Протеин на прах' WHERE slug = 'protein-powders';
UPDATE categories SET name_bg = 'Предтренировъчни' WHERE slug = 'pre-workout';
UPDATE categories SET name_bg = 'BCAA аминокиселини' WHERE slug = 'bcaas';
UPDATE categories SET name_bg = 'Креатин' WHERE slug = 'creatine';
UPDATE categories SET name_bg = 'Гейнъри' WHERE slug = 'mass-gainers';

-- iPhone
UPDATE categories SET name_bg = 'iPhone 16 серия' WHERE slug = 'iphone-16-series';
UPDATE categories SET name_bg = 'iPhone 15 серия' WHERE slug = 'iphone-15-series';
UPDATE categories SET name_bg = 'iPhone 12 серия' WHERE slug = 'iphone-12-series';
UPDATE categories SET name_bg = 'iPhone предишни' WHERE slug = 'iphone-legacy';

-- Samsung
UPDATE categories SET name_bg = 'Galaxy S серия' WHERE slug = 'galaxy-s-series';
UPDATE categories SET name_bg = 'Galaxy Z Fold' WHERE slug = 'galaxy-z-fold';
UPDATE categories SET name_bg = 'Galaxy Z Flip' WHERE slug = 'galaxy-z-flip';

-- Fitness
UPDATE categories SET name_bg = 'Силово оборудване' WHERE slug = 'strength-equipment';

-- iPad
UPDATE categories SET name_bg = 'iPad Pro' WHERE slug = 'ipad-pro';
UPDATE categories SET name_bg = 'iPad Air' WHERE slug = 'ipad-air';
UPDATE categories SET name_bg = 'iPad Mini' WHERE slug = 'ipad-mini';
UPDATE categories SET name_bg = 'iPad 10-то поколение' WHERE slug = 'ipad-10th-gen';
;
