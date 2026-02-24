
-- ============================================
-- PHASE 17: CLEAN UP TV SUBCATEGORIES
-- These should be ATTRIBUTES not categories!
-- ============================================

-- Keep only meaningful TV subcategories, deprecate the ones that are attributes
-- OLED, QLED, LED, Smart, 4K are all attributes (Display Type, Resolution, Smart TV)

-- Deprecate OLED TVs category
UPDATE categories 
SET name = '[ATTR] OLED TVs',
    name_bg = '[АТРИБУТ] OLED телевизори',
    display_order = 9001
WHERE slug = 'tv-oled';

-- Deprecate QLED TVs category
UPDATE categories 
SET name = '[ATTR] QLED TVs',
    name_bg = '[АТРИБУТ] QLED телевизори',
    display_order = 9002
WHERE slug = 'tv-qled';

-- Deprecate LED TVs category
UPDATE categories 
SET name = '[ATTR] LED TVs',
    name_bg = '[АТРИБУТ] LED телевизори',
    display_order = 9003
WHERE slug = 'tv-led';

-- Deprecate Smart TVs category
UPDATE categories 
SET name = '[ATTR] Smart TVs',
    name_bg = '[АТРИБУТ] Смарт телевизори',
    display_order = 9004
WHERE slug = 'tv-smart';

-- Deprecate 4K/8K TVs category
UPDATE categories 
SET name = '[ATTR] 4K/8K TVs',
    name_bg = '[АТРИБУТ] 4K/8K телевизори',
    display_order = 9005
WHERE slug = 'tv-4k8k';

-- ============================================
-- PHASE 18: CLEAN UP HEADPHONE SUBCATEGORIES
-- ============================================

-- We need to check what headphone subcategories exist and which should be attributes
-- Wireless, ANC, Gaming could be attributes

-- Create proper attributes for Headphones if they don't exist
-- First, let's get the Headphones category ID and add attributes

-- Add "Headphone Type" attribute to Audio category
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001', -- Audio category
  'Headphone Type',
  'Тип слушалки',
  'select',
  true,
  '["Over-Ear", "On-Ear", "In-Ear/Earbuds", "True Wireless (TWS)", "Neckband", "Bone Conduction"]',
  '["Големи (Over-Ear)", "Малки (On-Ear)", "Тапи (In-Ear)", "Безжични тапи (TWS)", "Нашийник", "Костна проводимост"]',
  1
) ON CONFLICT DO NOTHING;

-- Add "Connectivity" attribute
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001', -- Audio category
  'Connectivity',
  'Свързване',
  'multiselect',
  true,
  '["Wired 3.5mm", "Wired USB", "Bluetooth", "2.4GHz Wireless", "Both Wired & Wireless"]',
  '["Кабел 3.5мм", "Кабел USB", "Bluetooth", "2.4GHz безжични", "Кабел и безжични"]',
  2
) ON CONFLICT DO NOTHING;

-- Add "Active Noise Cancelling" attribute
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001', -- Audio category
  'Noise Cancelling',
  'Шумопотискане',
  'select',
  true,
  '["None", "Passive", "Active (ANC)", "Hybrid ANC", "Adaptive ANC"]',
  '["Няма", "Пасивно", "Активно (ANC)", "Хибридно ANC", "Адаптивно ANC"]',
  3
) ON CONFLICT DO NOTHING;

-- Add "Use Case" attribute
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
VALUES (
  'ca000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001', -- Audio category
  'Best For',
  'Подходящи за',
  'multiselect',
  true,
  '["Gaming", "Sports/Running", "Commuting", "Studio/Pro", "Everyday Use", "Calls/Work"]',
  '["Гейминг", "Спорт/бягане", "Пътуване", "Студио/професионални", "Ежедневие", "Разговори/работа"]',
  4
) ON CONFLICT DO NOTHING;

-- Now deprecate the headphone type subcategories since they're now attributes
UPDATE categories 
SET name = '[ATTR] Wireless Headphones',
    name_bg = '[АТРИБУТ] Безжични слушалки',
    display_order = 9010
WHERE slug = 'headphones-wireless';

UPDATE categories 
SET name = '[ATTR] ANC Headphones',
    name_bg = '[АТРИБУТ] С шумопотискане',
    display_order = 9011
WHERE slug = 'headphones-anc';

UPDATE categories 
SET name = '[ATTR] Gaming Headphones',
    name_bg = '[АТРИБУТ] Геймърски слушалки',
    display_order = 9012
WHERE slug = 'headphones-gaming';

UPDATE categories 
SET name = '[ATTR] Sports Headphones',
    name_bg = '[АТРИБУТ] Спортни слушалки',
    display_order = 9013
WHERE slug = 'headphones-sports';

UPDATE categories 
SET name = '[ATTR] Over-Ear Headphones',
    name_bg = '[АТРИБУТ] Големи слушалки',
    display_order = 9014
WHERE slug = 'headphones-overear';

UPDATE categories 
SET name = '[ATTR] Earbuds',
    name_bg = '[АТРИБУТ] Тапи',
    display_order = 9015
WHERE slug = 'headphones-earbuds';
;
