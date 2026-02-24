
-- Fix smartphones hierarchy: Consolidate duplicate brands and move accessories

-- 1. Move duplicate iPhone items (if any direct under smartphones) to smartphones-iphone
-- (Already done in previous migration)

-- 2. Consolidate Samsung duplicates - keep smartphones-samsung
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-samsung')
WHERE slug IN ('galaxy-phones')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 3. Consolidate Xiaomi - keep smartphones-xiaomi
-- (Already good)

-- 4. Consolidate Google Pixel - merge to smartphones-pixel  
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-pixel')
WHERE slug = 'smartphones-google'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 5. Consolidate OnePlus duplicates
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-oneplus')
WHERE slug = 'phones-oneplus'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 6. Consolidate Motorola - use smartphones-motorola
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-motorola')
WHERE slug IN ('motorola-phones', 'phones-motorola')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 7. Consolidate Nokia
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-nokia')
WHERE slug = 'nokia-phones'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 8. Consolidate Sony
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-sony')
WHERE slug = 'sony-xperia'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 9. Consolidate Huawei
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-huawei')
WHERE slug = 'huawei-phones'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 10. Consolidate Oppo
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-oppo')
WHERE slug = 'oppo-phones'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 11. Consolidate Realme
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-realme')
WHERE slug = 'realme-phones'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 12. Consolidate Vivo
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-vivo')
WHERE slug = 'vivo-phones'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 13. Consolidate Nothing
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-nothing')
WHERE slug = 'nothing-phone'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 14. Consolidate ASUS ROG
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-asus-rog')
WHERE slug = 'asus-rog-phone'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 15. Move charger/accessory items to electronics-accessories (wrong L1)
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'chargers-cables')
WHERE slug IN ('phones-chargers', 'phones-chargers-fast', 'phones-chargers-wireless')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 16. Move power banks to accessories
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'acc-power-banks')
WHERE slug = 'phones-power-banks'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 17. Move mounts to accessories
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'phone-accessories')
WHERE slug = 'phones-mounts'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- 18. Consolidate budget/5G/android/unlocked/refurbished under smartphones-other
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-other')
WHERE slug IN (
  'android-phones', 'budget-phones', 'phones-budget', 'phones-5g',
  'refurbished-phones', 'phones-refurbished', 'unlocked-phones'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');

-- Keep distinct brand L2s: smartphones-iphone, smartphones-samsung, smartphones-xiaomi, 
-- smartphones-pixel, smartphones-oneplus, smartphones-motorola, smartphones-nokia,
-- smartphones-sony, smartphones-huawei, smartphones-oppo, smartphones-realme,
-- smartphones-vivo, smartphones-nothing, smartphones-asus-rog, smartphones-honor, smartphones-other
;
