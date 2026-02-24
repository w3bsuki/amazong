-- Phase 2.3: Beauty L3 Categories - Batch 1: Skincare, Bath & Body, Oral Care
-- Target: Add L3 children to Beauty L2 categories

-- =====================================================
-- SKINCARE L3 CATEGORIES
-- =====================================================

-- Exfoliators (exfoliators)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Chemical Exfoliators', 'Physical Exfoliators', 'AHA Exfoliators', 'BHA Exfoliators', 'Enzyme Exfoliators', 'Scrubs', 'Peeling Gels']),
  unnest(ARRAY['exfoliator-chemical', 'exfoliator-physical', 'exfoliator-aha', 'exfoliator-bha', 'exfoliator-enzyme', 'exfoliator-scrubs', 'exfoliator-peeling']),
  (SELECT id FROM categories WHERE slug = 'exfoliators'),
  unnest(ARRAY['Химически ексфолианти', 'Физически ексфолианти', 'AHA ексфолианти', 'BHA ексфолианти', 'Ензимни ексфолианти', 'Скрабове', 'Пилинг гелове']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Makeup Removers (makeup-removers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Micellar Water', 'Cleansing Oils', 'Cleansing Balms', 'Makeup Wipes', 'Eye Makeup Removers', 'Waterproof Removers', 'Double Cleansing']),
  unnest(ARRAY['makeup-remover-micellar', 'makeup-remover-oil', 'makeup-remover-balm', 'makeup-remover-wipes', 'makeup-remover-eye', 'makeup-remover-waterproof', 'makeup-remover-double']),
  (SELECT id FROM categories WHERE slug = 'makeup-removers'),
  unnest(ARRAY['Мицеларна вода', 'Почистващи масла', 'Почистващи балсами', 'Мокри кърпички', 'За грим на очи', 'За водоустойчив грим', 'Двойно почистване']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- BATH & BODY L3 CATEGORIES
-- =====================================================

-- Bath & Shower (bb-bath-shower)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Body Wash', 'Shower Gel', 'Bar Soap', 'Bubble Bath', 'Bath Oils', 'Bath Salts', 'Shower Steamers', 'Body Scrubs']),
  unnest(ARRAY['bathshower-bodywash', 'bathshower-showergel', 'bathshower-barsoap', 'bathshower-bubblebath', 'bathshower-oils', 'bathshower-salts', 'bathshower-steamers', 'bathshower-scrubs']),
  (SELECT id FROM categories WHERE slug = 'bb-bath-shower'),
  unnest(ARRAY['Душ гел', 'Душ гел', 'Твърд сапун', 'Пяна за вана', 'Масла за вана', 'Соли за вана', 'Душ бомби', 'Скрабове за тяло']),
  '🛁'
ON CONFLICT (slug) DO NOTHING;

-- Body Care (bb-body-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Body Lotions', 'Body Butters', 'Body Oils', 'Body Serums', 'Firming Creams', 'Stretch Mark Creams', 'Self-Tanners', 'Body Mists']),
  unnest(ARRAY['bodycare-lotions', 'bodycare-butters', 'bodycare-oils', 'bodycare-serums', 'bodycare-firming', 'bodycare-stretchmark', 'bodycare-tanning', 'bodycare-mists']),
  (SELECT id FROM categories WHERE slug = 'bb-body-care'),
  unnest(ARRAY['Лосиони за тяло', 'Масла за тяло', 'Масла за тяло', 'Серуми за тяло', 'Стягащи кремове', 'Кремове за стрии', 'Автобронзанти', 'Мистове за тяло']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Body Lotion (bath-body-lotion)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Daily Moisturizers', 'Intensive Moisturizers', 'Lightweight Lotions', 'Scented Lotions', 'Unscented Lotions', 'Hydrating Lotions', 'Firming Lotions']),
  unnest(ARRAY['bodylotion-daily', 'bodylotion-intensive', 'bodylotion-light', 'bodylotion-scented', 'bodylotion-unscented', 'bodylotion-hydrating', 'bodylotion-firming']),
  (SELECT id FROM categories WHERE slug = 'bath-body-lotion'),
  unnest(ARRAY['Ежедневни хидратанти', 'Интензивни хидратанти', 'Леки лосиони', 'Парфюмирани лосиони', 'Без аромат лосиони', 'Хидратиращи лосиони', 'Стягащи лосиони']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Body Scrubs (bath-body-scrubs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sugar Scrubs', 'Salt Scrubs', 'Coffee Scrubs', 'Charcoal Scrubs', 'Exfoliating Gloves', 'Body Polish']),
  unnest(ARRAY['bodyscrub-sugar', 'bodyscrub-salt', 'bodyscrub-coffee', 'bodyscrub-charcoal', 'bodyscrub-gloves', 'bodyscrub-polish']),
  (SELECT id FROM categories WHERE slug = 'bath-body-scrubs'),
  unnest(ARRAY['Захарни скрабове', 'Солни скрабове', 'Кафени скрабове', 'Въглени скрабове', 'Ексфолиращи ръкавици', 'Полиш за тяло']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Body Wash (bath-body-wash)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Moisturizing Body Wash', 'Exfoliating Body Wash', 'Antibacterial Body Wash', 'Sensitive Skin Body Wash', 'Men''s Body Wash', 'Natural Body Wash']),
  unnest(ARRAY['bodywash-moisturizing', 'bodywash-exfoliating', 'bodywash-antibacterial', 'bodywash-sensitive', 'bodywash-mens', 'bodywash-natural']),
  (SELECT id FROM categories WHERE slug = 'bath-body-wash'),
  unnest(ARRAY['Хидратиращ душ гел', 'Ексфолиращ душ гел', 'Антибактериален душ гел', 'За чувствителна кожа', 'Мъжки душ гел', 'Натурален душ гел']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Body Mists (body-mists)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Floral Mists', 'Fruity Mists', 'Fresh Mists', 'Sweet Mists', 'Shimmer Mists', 'Hydrating Mists']),
  unnest(ARRAY['bodymist-floral', 'bodymist-fruity', 'bodymist-fresh', 'bodymist-sweet', 'bodymist-shimmer', 'bodymist-hydrating']),
  (SELECT id FROM categories WHERE slug = 'body-mists'),
  unnest(ARRAY['Флорални мистове', 'Плодови мистове', 'Свежи мистове', 'Сладки мистове', 'Блестящи мистове', 'Хидратиращи мистове']),
  '💨'
ON CONFLICT (slug) DO NOTHING;

-- Deodorants (bath-deodorants and deodorants)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Roll-On Deodorants', 'Spray Deodorants', 'Stick Deodorants', 'Natural Deodorants', 'Clinical Strength', 'Aluminum-Free']),
  unnest(ARRAY['deodorant-rollon', 'deodorant-spray', 'deodorant-stick', 'deodorant-natural', 'deodorant-clinical', 'deodorant-aluminumfree']),
  (SELECT id FROM categories WHERE slug = 'bath-deodorants'),
  unnest(ARRAY['Дезодоранти рол-он', 'Спрей дезодоранти', 'Стик дезодоранти', 'Натурални дезодоранти', 'Клинични дезодоранти', 'Без алуминий']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Roll-On Deodorants', 'Spray Deodorants', 'Stick Deodorants', 'Natural Deodorants', 'Clinical Strength']),
  unnest(ARRAY['deo-rollon', 'deo-spray', 'deo-stick', 'deo-natural', 'deo-clinical']),
  (SELECT id FROM categories WHERE slug = 'deodorants'),
  unnest(ARRAY['Дезодоранти рол-он', 'Спрей дезодоранти', 'Стик дезодоранти', 'Натурални дезодоранти', 'Клинични дезодоранти']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Deodorants & Antiperspirants (bb-deodorants)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Antiperspirants', 'Deodorants', 'Natural Options', 'Clinical Strength', 'Unscented', 'Long-Lasting']),
  unnest(ARRAY['bbdeo-antiperspirant', 'bbdeo-deodorant', 'bbdeo-natural', 'bbdeo-clinical', 'bbdeo-unscented', 'bbdeo-longlasting']),
  (SELECT id FROM categories WHERE slug = 'bb-deodorants'),
  unnest(ARRAY['Антиперспиранти', 'Дезодоранти', 'Натурални опции', 'Клинична сила', 'Без аромат', 'Дълготрайни']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Hand Care (bath-hand-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hand Creams', 'Hand Lotions', 'Hand Sanitizers', 'Cuticle Oils', 'Hand Masks', 'Hand Scrubs', 'Hand Soaps']),
  unnest(ARRAY['handcare-creams', 'handcare-lotions', 'handcare-sanitizers', 'handcare-cuticle', 'handcare-masks', 'handcare-scrubs', 'handcare-soaps']),
  (SELECT id FROM categories WHERE slug = 'bath-hand-care'),
  unnest(ARRAY['Кремове за ръце', 'Лосиони за ръце', 'Дезинфектанти', 'Масла за кутикули', 'Маски за ръце', 'Скрабове за ръце', 'Сапуни за ръце']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Foot Care (bath-foot-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Foot Creams', 'Foot Scrubs', 'Foot Masks', 'Foot Powders', 'Heel Balms', 'Foot Deodorants', 'Pedicure Tools']),
  unnest(ARRAY['footcare-creams', 'footcare-scrubs', 'footcare-masks', 'footcare-powders', 'footcare-heel', 'footcare-deodorant', 'footcare-tools']),
  (SELECT id FROM categories WHERE slug = 'bath-foot-care'),
  unnest(ARRAY['Кремове за крака', 'Скрабове за крака', 'Маски за крака', 'Пудри за крака', 'Балсами за пети', 'Дезодоранти за крака', 'Инструменти за педикюр']),
  '🦶'
ON CONFLICT (slug) DO NOTHING;

-- Hand & Foot Care (bb-hand-foot)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hand Creams', 'Foot Creams', 'Nail Care', 'Cuticle Care', 'Exfoliating', 'Masks']),
  unnest(ARRAY['bbhandfoor-handcream', 'bbhandfoot-footcream', 'bbhandfoot-nailcare', 'bbhandfoot-cuticle', 'bbhandfoot-exfoliate', 'bbhandfoot-masks']),
  (SELECT id FROM categories WHERE slug = 'bb-hand-foot'),
  unnest(ARRAY['Кремове за ръце', 'Кремове за крака', 'Грижа за нокти', 'Грижа за кутикули', 'Ексфолиране', 'Маски']),
  '🦶'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ORAL CARE L3 CATEGORIES
-- =====================================================

-- Toothpaste (oral-toothpaste and oc-toothpaste)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Whitening Toothpaste', 'Sensitive Teeth', 'Cavity Protection', 'Natural Toothpaste', 'Charcoal Toothpaste', 'Kids Toothpaste', 'Fresh Breath']),
  unnest(ARRAY['toothpaste-whitening', 'toothpaste-sensitive', 'toothpaste-cavity', 'toothpaste-natural', 'toothpaste-charcoal', 'toothpaste-kids', 'toothpaste-freshbreath']),
  (SELECT id FROM categories WHERE slug = 'oral-toothpaste'),
  unnest(ARRAY['Избелваща паста', 'За чувствителни зъби', 'Срещу кариес', 'Натурална паста', 'Паста с въглен', 'Детска паста', 'За свеж дъх']),
  '🦷'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Whitening Toothpaste', 'Sensitive Teeth', 'Cavity Protection', 'Natural Toothpaste', 'Kids Toothpaste']),
  unnest(ARRAY['octoothpaste-whitening', 'octoothpaste-sensitive', 'octoothpaste-cavity', 'octoothpaste-natural', 'octoothpaste-kids']),
  (SELECT id FROM categories WHERE slug = 'oc-toothpaste'),
  unnest(ARRAY['Избелваща паста', 'За чувствителни зъби', 'Срещу кариес', 'Натурална паста', 'Детска паста']),
  '🦷'
ON CONFLICT (slug) DO NOTHING;

-- Toothbrushes (oc-toothbrush)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Manual Toothbrushes', 'Soft Bristles', 'Medium Bristles', 'Kids Toothbrushes', 'Bamboo Toothbrushes', 'Charcoal Toothbrushes']),
  unnest(ARRAY['toothbrush-manual', 'toothbrush-soft', 'toothbrush-medium', 'toothbrush-kids', 'toothbrush-bamboo', 'toothbrush-charcoal']),
  (SELECT id FROM categories WHERE slug = 'oc-toothbrush'),
  unnest(ARRAY['Ръчни четки', 'Меки влакна', 'Средни влакна', 'Детски четки', 'Бамбукови четки', 'Четки с въглен']),
  '🪥'
ON CONFLICT (slug) DO NOTHING;

-- Electric Toothbrushes (electric-toothbrushes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sonic Toothbrushes', 'Oscillating Toothbrushes', 'Oral-B', 'Philips Sonicare', 'Budget Electric', 'Replacement Heads']),
  unnest(ARRAY['electricbrush-sonic', 'electricbrush-oscillating', 'electricbrush-oralb', 'electricbrush-sonicare', 'electricbrush-budget', 'electricbrush-heads']),
  (SELECT id FROM categories WHERE slug = 'electric-toothbrushes'),
  unnest(ARRAY['Звукови четки', 'Осцилиращи четки', 'Oral-B', 'Philips Sonicare', 'Бюджетни електрически', 'Резервни глави']),
  '🪥'
ON CONFLICT (slug) DO NOTHING;

-- Dental Floss (dental-floss and oc-floss)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Waxed Floss', 'Unwaxed Floss', 'Dental Tape', 'Floss Picks', 'Water Flossers', 'Interdental Brushes']),
  unnest(ARRAY['floss-waxed', 'floss-unwaxed', 'floss-tape', 'floss-picks', 'floss-water', 'floss-interdental']),
  (SELECT id FROM categories WHERE slug = 'dental-floss'),
  unnest(ARRAY['Вощиран конец', 'Невощиран конец', 'Дентална лента', 'Клечки с конец', 'Водни иригатори', 'Интердентални четки']),
  '🦷'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Waxed Floss', 'Unwaxed Floss', 'Dental Tape', 'Floss Picks', 'Water Flossers']),
  unnest(ARRAY['ocfloss-waxed', 'ocfloss-unwaxed', 'ocfloss-tape', 'ocfloss-picks', 'ocfloss-water']),
  (SELECT id FROM categories WHERE slug = 'oc-floss'),
  unnest(ARRAY['Вощиран конец', 'Невощиран конец', 'Дентална лента', 'Клечки с конец', 'Водни иригатори']),
  '🦷'
ON CONFLICT (slug) DO NOTHING;

-- Mouthwash (mouthwash)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Antiseptic Mouthwash', 'Whitening Mouthwash', 'Fluoride Mouthwash', 'Natural Mouthwash', 'Alcohol-Free', 'Sensitive Teeth']),
  unnest(ARRAY['mouthwash-antiseptic', 'mouthwash-whitening', 'mouthwash-fluoride', 'mouthwash-natural', 'mouthwash-alcoholfree', 'mouthwash-sensitive']),
  (SELECT id FROM categories WHERE slug = 'mouthwash'),
  unnest(ARRAY['Антисептична вода', 'Избелваща вода', 'Вода с флуорид', 'Натурална вода', 'Без алкохол', 'За чувствителни зъби']),
  '💧'
ON CONFLICT (slug) DO NOTHING;

-- Teeth Whitening (oc-whitening)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Whitening Strips', 'Whitening Pens', 'Whitening Kits', 'Whitening Toothpaste', 'LED Whitening', 'Charcoal Whitening']),
  unnest(ARRAY['whitening-strips', 'whitening-pens', 'whitening-kits', 'whitening-toothpaste', 'whitening-led', 'whitening-charcoal']),
  (SELECT id FROM categories WHERE slug = 'oc-whitening'),
  unnest(ARRAY['Избелващи ленти', 'Избелващи химикалки', 'Избелващи комплекти', 'Избелваща паста', 'LED избелване', 'Избелване с въглен']),
  '✨'
ON CONFLICT (slug) DO NOTHING;;
