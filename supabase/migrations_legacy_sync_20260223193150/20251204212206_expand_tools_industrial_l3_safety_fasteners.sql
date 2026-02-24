-- =====================================================
-- L3 Categories for Safety Equipment
-- =====================================================

-- Work Gloves
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Cut-Resistant Gloves', 'Антисрезни ръкавици', 'gloves-cut-resistant', id, '✂️', 1 FROM categories WHERE slug = 'safety-gloves'
UNION ALL
SELECT gen_random_uuid(), 'Welding Gloves', 'Заваръчни ръкавици', 'gloves-welding', id, '🔥', 2 FROM categories WHERE slug = 'safety-gloves'
UNION ALL
SELECT gen_random_uuid(), 'Chemical Resistant Gloves', 'Химически устойчиви', 'gloves-chemical', id, '🧪', 3 FROM categories WHERE slug = 'safety-gloves'
UNION ALL
SELECT gen_random_uuid(), 'Insulated Gloves', 'Изолирани ръкавици', 'gloves-insulated', id, '⚡', 4 FROM categories WHERE slug = 'safety-gloves'
UNION ALL
SELECT gen_random_uuid(), 'Mechanics Gloves', 'Механични ръкавици', 'gloves-mechanics', id, '🔧', 5 FROM categories WHERE slug = 'safety-gloves'
UNION ALL
SELECT gen_random_uuid(), 'Disposable Gloves', 'Еднократни ръкавици', 'gloves-disposable', id, '🧤', 6 FROM categories WHERE slug = 'safety-gloves';

-- Respirators & Masks
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Dust Masks', 'Прахови маски', 'respirators-dust', id, '😷', 1 FROM categories WHERE slug = 'safety-respirators'
UNION ALL
SELECT gen_random_uuid(), 'Half-Face Respirators', 'Полумаски', 'respirators-half-face', id, '🎭', 2 FROM categories WHERE slug = 'safety-respirators'
UNION ALL
SELECT gen_random_uuid(), 'Full-Face Respirators', 'Пълнолицеви маски', 'respirators-full-face', id, '👺', 3 FROM categories WHERE slug = 'safety-respirators'
UNION ALL
SELECT gen_random_uuid(), 'PAPR Systems', 'PAPR системи', 'respirators-papr', id, '💨', 4 FROM categories WHERE slug = 'safety-respirators'
UNION ALL
SELECT gen_random_uuid(), 'Respirator Filters', 'Филтри за респиратори', 'respirators-filters', id, '🔄', 5 FROM categories WHERE slug = 'safety-respirators';

-- Fall Protection
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Safety Harnesses', 'Предпазни колани', 'fall-harnesses', id, '🪢', 1 FROM categories WHERE slug = 'safety-fall-protection'
UNION ALL
SELECT gen_random_uuid(), 'Lanyards', 'Въжета за сигурност', 'fall-lanyards', id, '🔗', 2 FROM categories WHERE slug = 'safety-fall-protection'
UNION ALL
SELECT gen_random_uuid(), 'Self-Retracting Lifelines', 'Ролетки за сигурност', 'fall-srl', id, '🔄', 3 FROM categories WHERE slug = 'safety-fall-protection'
UNION ALL
SELECT gen_random_uuid(), 'Anchors & Connectors', 'Анкери и конектори', 'fall-anchors', id, '⚓', 4 FROM categories WHERE slug = 'safety-fall-protection';

-- =====================================================
-- L3 Categories for Fasteners & Hardware
-- =====================================================

-- Screws
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Wood Screws', 'Винтове за дърво', 'screws-wood', id, '🪵', 1 FROM categories WHERE slug = 'fasteners-screws'
UNION ALL
SELECT gen_random_uuid(), 'Machine Screws', 'Машинни винтове', 'screws-machine', id, '⚙️', 2 FROM categories WHERE slug = 'fasteners-screws'
UNION ALL
SELECT gen_random_uuid(), 'Self-Tapping Screws', 'Самонарезни винтове', 'screws-self-tapping', id, '🔩', 3 FROM categories WHERE slug = 'fasteners-screws'
UNION ALL
SELECT gen_random_uuid(), 'Drywall Screws', 'Винтове за гипсокартон', 'screws-drywall', id, '📦', 4 FROM categories WHERE slug = 'fasteners-screws'
UNION ALL
SELECT gen_random_uuid(), 'Concrete Screws', 'Бетонови винтове', 'screws-concrete', id, '🏗️', 5 FROM categories WHERE slug = 'fasteners-screws'
UNION ALL
SELECT gen_random_uuid(), 'Deck Screws', 'Винтове за тераса', 'screws-deck', id, '🌳', 6 FROM categories WHERE slug = 'fasteners-screws';

-- Bolts
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Hex Bolts', 'Шестостенни болтове', 'bolts-hex', id, '🔩', 1 FROM categories WHERE slug = 'fasteners-bolts'
UNION ALL
SELECT gen_random_uuid(), 'Carriage Bolts', 'Каретни болтове', 'bolts-carriage', id, '🔧', 2 FROM categories WHERE slug = 'fasteners-bolts'
UNION ALL
SELECT gen_random_uuid(), 'Lag Bolts', 'Глухари', 'bolts-lag', id, '🪵', 3 FROM categories WHERE slug = 'fasteners-bolts'
UNION ALL
SELECT gen_random_uuid(), 'U-Bolts', 'U-болтове', 'bolts-u', id, '🔩', 4 FROM categories WHERE slug = 'fasteners-bolts'
UNION ALL
SELECT gen_random_uuid(), 'Eye Bolts', 'Болтове с халка', 'bolts-eye', id, '👁️', 5 FROM categories WHERE slug = 'fasteners-bolts';

-- Anchors
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Concrete Anchors', 'Бетонови анкери', 'anchors-concrete', id, '🏗️', 1 FROM categories WHERE slug = 'fasteners-anchors'
UNION ALL
SELECT gen_random_uuid(), 'Wall Anchors', 'Стенни анкери', 'anchors-wall', id, '🧱', 2 FROM categories WHERE slug = 'fasteners-anchors'
UNION ALL
SELECT gen_random_uuid(), 'Toggle Bolts', 'Пеперуда анкери', 'anchors-toggle', id, '🦋', 3 FROM categories WHERE slug = 'fasteners-anchors'
UNION ALL
SELECT gen_random_uuid(), 'Sleeve Anchors', 'Втулкови анкери', 'anchors-sleeve', id, '📌', 4 FROM categories WHERE slug = 'fasteners-anchors'
UNION ALL
SELECT gen_random_uuid(), 'Drop-In Anchors', 'Забивни анкери', 'anchors-drop-in', id, '⬇️', 5 FROM categories WHERE slug = 'fasteners-anchors'
ON CONFLICT (slug) DO NOTHING;;
