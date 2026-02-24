-- Phase 2.3: Beauty L3 Categories - Batch 3: Skincare, Hair Care, Makeup Removers
-- Target: Add L3 children to remaining Beauty L2 categories

-- =====================================================
-- SKINCARE L3 CATEGORIES
-- =====================================================

-- Face Moisturizers (skincare-moisturizers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Day Creams', 'Night Creams', 'Gel Moisturizers', 'Lightweight Moisturizers', 'Rich Creams', 'Oil-Free Moisturizers', 'Tinted Moisturizers']),
  unnest(ARRAY['moisturizer-day', 'moisturizer-night', 'moisturizer-gel', 'moisturizer-lightweight', 'moisturizer-rich', 'moisturizer-oilfree', 'moisturizer-tinted']),
  (SELECT id FROM categories WHERE slug = 'skincare-moisturizers'),
  unnest(ARRAY['Дневни кремове', 'Нощни кремове', 'Гел хидратанти', 'Леки хидратанти', 'Богати кремове', 'Без мазнина', 'Оцветени хидратанти']),
  '💧'
ON CONFLICT (slug) DO NOTHING;

-- Face Serums (skincare-serums)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Vitamin C Serums', 'Hyaluronic Acid Serums', 'Retinol Serums', 'Niacinamide Serums', 'Anti-Aging Serums', 'Brightening Serums', 'Acne Serums']),
  unnest(ARRAY['serum-vitaminc', 'serum-hyaluronic', 'serum-retinol', 'serum-niacinamide', 'serum-antiaging', 'serum-brightening', 'serum-acne']),
  (SELECT id FROM categories WHERE slug = 'skincare-serums'),
  unnest(ARRAY['Серуми с витамин C', 'Серуми с хиалуронова киселина', 'Серуми с ретинол', 'Серуми с ниацинамид', 'Анти-ейдж серуми', 'Изсветляващи серуми', 'Серуми за акне']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Face Cleansers (skincare-cleansers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Gel Cleansers', 'Foam Cleansers', 'Cream Cleansers', 'Oil Cleansers', 'Micellar Water', 'Cleansing Balms', 'Exfoliating Cleansers']),
  unnest(ARRAY['cleanser-gel', 'cleanser-foam', 'cleanser-cream', 'cleanser-oil', 'cleanser-micellar', 'cleanser-balm', 'cleanser-exfoliating']),
  (SELECT id FROM categories WHERE slug = 'skincare-cleansers'),
  unnest(ARRAY['Гел за измиване', 'Пяна за измиване', 'Крем за измиване', 'Почистващо масло', 'Мицеларна вода', 'Почистващ балсам', 'Ексфолиращо измиване']),
  '🧼'
ON CONFLICT (slug) DO NOTHING;

-- Face Masks (skincare-masks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sheet Masks', 'Clay Masks', 'Hydrating Masks', 'Peel-Off Masks', 'Overnight Masks', 'Eye Masks', 'Lip Masks']),
  unnest(ARRAY['mask-sheet', 'mask-clay', 'mask-hydrating', 'mask-peeloff', 'mask-overnight', 'mask-eye', 'mask-lip']),
  (SELECT id FROM categories WHERE slug = 'skincare-masks'),
  unnest(ARRAY['Маски платна', 'Глинени маски', 'Хидратиращи маски', 'Пилинг маски', 'Нощни маски', 'Маски за очи', 'Маски за устни']),
  '😷'
ON CONFLICT (slug) DO NOTHING;

-- Toners (skincare-toners)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hydrating Toners', 'Exfoliating Toners', 'Balancing Toners', 'Essence Toners', 'Alcohol-Free Toners', 'Astringent Toners']),
  unnest(ARRAY['toner-hydrating', 'toner-exfoliating', 'toner-balancing', 'toner-essence', 'toner-alcoholfree', 'toner-astringent']),
  (SELECT id FROM categories WHERE slug = 'skincare-toners'),
  unnest(ARRAY['Хидратиращи тонери', 'Ексфолиращи тонери', 'Балансиращи тонери', 'Есенс тонери', 'Без алкохол', 'Стягащи тонери']),
  '💦'
ON CONFLICT (slug) DO NOTHING;

-- Eye Care (skincare-eye-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Eye Creams', 'Eye Serums', 'Eye Gels', 'Eye Masks', 'Dark Circle Treatments', 'Puffiness Treatments']),
  unnest(ARRAY['eyecare-cream', 'eyecare-serum', 'eyecare-gel', 'eyecare-mask', 'eyecare-darkcircle', 'eyecare-puffiness']),
  (SELECT id FROM categories WHERE slug = 'skincare-eye-care'),
  unnest(ARRAY['Кремове за очи', 'Серуми за очи', 'Гелове за очи', 'Маски за очи', 'За тъмни кръгове', 'За подпухналост']),
  '👁️'
ON CONFLICT (slug) DO NOTHING;

-- Lip Care (skincare-lip-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Lip Balms', 'Lip Masks', 'Lip Scrubs', 'Lip Treatments', 'Tinted Lip Balms', 'SPF Lip Care']),
  unnest(ARRAY['lipcare-balm', 'lipcare-mask', 'lipcare-scrub', 'lipcare-treatment', 'lipcare-tinted', 'lipcare-spf']),
  (SELECT id FROM categories WHERE slug = 'skincare-lip-care'),
  unnest(ARRAY['Балсами за устни', 'Маски за устни', 'Скрабове за устни', 'Лечебни грижи', 'Оцветени балсами', 'С SPF защита']),
  '💋'
ON CONFLICT (slug) DO NOTHING;

-- Sunscreen (skincare-sunscreen)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Face Sunscreen', 'Body Sunscreen', 'Tinted Sunscreen', 'Mineral Sunscreen', 'Chemical Sunscreen', 'SPF Moisturizers', 'After Sun']),
  unnest(ARRAY['sunscreen-face', 'sunscreen-body', 'sunscreen-tinted', 'sunscreen-mineral', 'sunscreen-chemical', 'sunscreen-moisturizer', 'sunscreen-aftersun']),
  (SELECT id FROM categories WHERE slug = 'skincare-sunscreen'),
  unnest(ARRAY['За лице', 'За тяло', 'Оцветен', 'Минерален', 'Химичен', 'Хидратанти със SPF', 'След слънце']),
  '☀️'
ON CONFLICT (slug) DO NOTHING;

-- Exfoliators (skincare-exfoliators)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Physical Scrubs', 'Chemical Exfoliants', 'AHA Exfoliants', 'BHA Exfoliants', 'Enzyme Exfoliants', 'Peel Pads']),
  unnest(ARRAY['exfoliant-scrub', 'exfoliant-chemical', 'exfoliant-aha', 'exfoliant-bha', 'exfoliant-enzyme', 'exfoliant-pads']),
  (SELECT id FROM categories WHERE slug = 'skincare-exfoliators'),
  unnest(ARRAY['Физични скрабове', 'Химични ексфолианти', 'AHA ексфолианти', 'BHA ексфолианти', 'Ензимни ексфолианти', 'Пилинг тампони']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Acne Treatments (skincare-acne-treatments)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Spot Treatments', 'Acne Cleansers', 'Acne Serums', 'Acne Patches', 'Acne Kits', 'Acne Masks']),
  unnest(ARRAY['acne-spot', 'acne-cleanser', 'acne-serum', 'acne-patch', 'acne-kit', 'acne-mask']),
  (SELECT id FROM categories WHERE slug = 'skincare-acne-treatments'),
  unnest(ARRAY['Точкови средства', 'Измивания за акне', 'Серуми за акне', 'Пластири за акне', 'Комплекти за акне', 'Маски за акне']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Anti-Aging (skincare-anti-aging)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Retinol Products', 'Peptide Products', 'Collagen Products', 'Firming Products', 'Wrinkle Treatments', 'Anti-Aging Sets']),
  unnest(ARRAY['antiaging-retinol', 'antiaging-peptide', 'antiaging-collagen', 'antiaging-firming', 'antiaging-wrinkle', 'antiaging-sets']),
  (SELECT id FROM categories WHERE slug = 'skincare-anti-aging'),
  unnest(ARRAY['Продукти с ретинол', 'Продукти с пептиди', 'Продукти с колаген', 'Стягащи продукти', 'Против бръчки', 'Анти-ейдж комплекти']),
  '⏰'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- HAIR CARE L3 CATEGORIES
-- =====================================================

-- Shampoo (hc-shampoo and haircare-shampoo)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Volumizing Shampoo', 'Moisturizing Shampoo', 'Clarifying Shampoo', 'Color-Safe Shampoo', 'Dandruff Shampoo', 'Dry Shampoo', 'Sulfate-Free Shampoo']),
  unnest(ARRAY['shampoo-volumizing', 'shampoo-moisturizing', 'shampoo-clarifying', 'shampoo-colorsafe', 'shampoo-dandruff', 'shampoo-dry', 'shampoo-sulfatefree']),
  (SELECT id FROM categories WHERE slug = 'hc-shampoo'),
  unnest(ARRAY['За обем', 'Хидратиращ', 'Дълбоко почистващ', 'За боядисана коса', 'Против пърхот', 'Сух шампоан', 'Без сулфати']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Volumizing', 'Moisturizing', 'Clarifying', 'Color-Safe', 'Dandruff', 'Dry Shampoo']),
  unnest(ARRAY['hcshampoo-vol', 'hcshampoo-moist', 'hcshampoo-clarify', 'hcshampoo-color', 'hcshampoo-dandruff', 'hcshampoo-dry']),
  (SELECT id FROM categories WHERE slug = 'haircare-shampoo'),
  unnest(ARRAY['За обем', 'Хидратиращ', 'Дълбоко почистващ', 'За боядисана коса', 'Против пърхот', 'Сух шампоан']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Conditioner (hc-conditioner and haircare-conditioner)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Daily Conditioner', 'Deep Conditioner', 'Leave-In Conditioner', 'Color-Safe Conditioner', 'Volumizing Conditioner', 'Repairing Conditioner']),
  unnest(ARRAY['conditioner-daily', 'conditioner-deep', 'conditioner-leavein', 'conditioner-colorsafe', 'conditioner-volumizing', 'conditioner-repairing']),
  (SELECT id FROM categories WHERE slug = 'hc-conditioner'),
  unnest(ARRAY['Ежедневен', 'Дълбоко подхранващ', 'Без изплакване', 'За боядисана коса', 'За обем', 'Възстановяващ']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Daily', 'Deep', 'Leave-In', 'Color-Safe', 'Volumizing']),
  unnest(ARRAY['hccond-daily', 'hccond-deep', 'hccond-leavein', 'hccond-colorsafe', 'hccond-volumizing']),
  (SELECT id FROM categories WHERE slug = 'haircare-conditioner'),
  unnest(ARRAY['Ежедневен', 'Дълбоко подхранващ', 'Без изплакване', 'За боядисана коса', 'За обем']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Hair Treatments (hc-treatments and haircare-treatments)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hair Masks', 'Hair Oils', 'Scalp Treatments', 'Protein Treatments', 'Bond Repair', 'Heat Protection', 'Split End Repair']),
  unnest(ARRAY['treatment-mask', 'treatment-oil', 'treatment-scalp', 'treatment-protein', 'treatment-bond', 'treatment-heat', 'treatment-splitend']),
  (SELECT id FROM categories WHERE slug = 'hc-treatments'),
  unnest(ARRAY['Маски за коса', 'Масла за коса', 'За скалп', 'Протеинова терапия', 'Възстановяване на връзки', 'Топлинна защита', 'За цъфнали краища']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hair Masks', 'Hair Oils', 'Scalp Treatments', 'Protein Treatments', 'Heat Protection']),
  unnest(ARRAY['hctreat-mask', 'hctreat-oil', 'hctreat-scalp', 'hctreat-protein', 'hctreat-heat']),
  (SELECT id FROM categories WHERE slug = 'haircare-treatments'),
  unnest(ARRAY['Маски за коса', 'Масла за коса', 'За скалп', 'Протеинова терапия', 'Топлинна защита']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Hair Styling (hc-styling and haircare-styling)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hair Spray', 'Hair Gel', 'Hair Mousse', 'Hair Wax', 'Hair Cream', 'Texturizing Products', 'Curl Products']),
  unnest(ARRAY['styling-spray', 'styling-gel', 'styling-mousse', 'styling-wax', 'styling-cream', 'styling-texture', 'styling-curl']),
  (SELECT id FROM categories WHERE slug = 'hc-styling'),
  unnest(ARRAY['Лак за коса', 'Гел за коса', 'Пяна за коса', 'Восък за коса', 'Крем за коса', 'За текстура', 'За къдрици']),
  '💇'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hair Spray', 'Hair Gel', 'Hair Mousse', 'Hair Wax', 'Curl Products']),
  unnest(ARRAY['hcstyling-spray', 'hcstyling-gel', 'hcstyling-mousse', 'hcstyling-wax', 'hcstyling-curl']),
  (SELECT id FROM categories WHERE slug = 'haircare-styling'),
  unnest(ARRAY['Лак за коса', 'Гел за коса', 'Пяна за коса', 'Восък за коса', 'За къдрици']),
  '💇'
ON CONFLICT (slug) DO NOTHING;

-- Hair Color (hc-color and haircare-color)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Permanent Color', 'Semi-Permanent', 'Temporary Color', 'Root Touch-Up', 'Highlights', 'Hair Bleach', 'Color Care']),
  unnest(ARRAY['haircolor-permanent', 'haircolor-semiperm', 'haircolor-temp', 'haircolor-root', 'haircolor-highlights', 'haircolor-bleach', 'haircolor-care']),
  (SELECT id FROM categories WHERE slug = 'hc-color'),
  unnest(ARRAY['Трайна боя', 'Полутрайна', 'Временна', 'За корени', 'Кичури', 'Изсветлители', 'Грижа за цвят']),
  '🎨'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Permanent', 'Semi-Permanent', 'Temporary', 'Root Touch-Up', 'Highlights']),
  unnest(ARRAY['hccolor-perm', 'hccolor-semi', 'hccolor-temp', 'hccolor-root', 'hccolor-highlights']),
  (SELECT id FROM categories WHERE slug = 'haircare-color'),
  unnest(ARRAY['Трайна боя', 'Полутрайна', 'Временна', 'За корени', 'Кичури']),
  '🎨'
ON CONFLICT (slug) DO NOTHING;

-- Hair Loss (haircare-hair-loss and hc-hairloss)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hair Growth Serums', 'Hair Growth Shampoos', 'Scalp Treatments', 'Hair Supplements', 'Thickening Products']),
  unnest(ARRAY['hairloss-serum', 'hairloss-shampoo', 'hairloss-scalp', 'hairloss-supplements', 'hairloss-thickening']),
  (SELECT id FROM categories WHERE slug = 'haircare-hair-loss'),
  unnest(ARRAY['Серуми за растеж', 'Шампоани за растеж', 'Лечение на скалп', 'Добавки за коса', 'За сгъстяване']),
  '💪'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Growth Serums', 'Growth Shampoos', 'Scalp Treatments', 'Supplements', 'Thickening']),
  unnest(ARRAY['hcloss-serum', 'hcloss-shampoo', 'hcloss-scalp', 'hcloss-supplements', 'hcloss-thickening']),
  (SELECT id FROM categories WHERE slug = 'hc-hairloss'),
  unnest(ARRAY['Серуми за растеж', 'Шампоани за растеж', 'Лечение на скалп', 'Добавки', 'За сгъстяване']),
  '💪'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- MAKEUP L3 CATEGORIES
-- =====================================================

-- Makeup Removers (makeup-removers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cleansing Oils', 'Micellar Water', 'Makeup Wipes', 'Eye Makeup Removers', 'Lip Makeup Removers', 'Cleansing Balms']),
  unnest(ARRAY['remover-oil', 'remover-micellar', 'remover-wipes', 'remover-eye', 'remover-lip', 'remover-balm']),
  (SELECT id FROM categories WHERE slug = 'makeup-removers'),
  unnest(ARRAY['Почистващи масла', 'Мицеларна вода', 'Кърпички', 'За грим за очи', 'За грим за устни', 'Почистващи балсами']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Concealers (makeup-concealers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Liquid Concealers', 'Stick Concealers', 'Color Correctors', 'Under Eye Concealers', 'Full Coverage Concealers', 'Brightening Concealers']),
  unnest(ARRAY['concealer-liquid', 'concealer-stick', 'concealer-corrector', 'concealer-undereye', 'concealer-fullcoverage', 'concealer-brightening']),
  (SELECT id FROM categories WHERE slug = 'makeup-concealers'),
  unnest(ARRAY['Течни коректори', 'Стик коректори', 'Цветни коректори', 'За под очи', 'Пълно покритие', 'Изсветляващи']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Blush (makeup-blush)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Powder Blush', 'Cream Blush', 'Liquid Blush', 'Blush Sticks', 'Blush Palettes']),
  unnest(ARRAY['blush-powder', 'blush-cream', 'blush-liquid', 'blush-stick', 'blush-palette']),
  (SELECT id FROM categories WHERE slug = 'makeup-blush'),
  unnest(ARRAY['Пудра руж', 'Кремообразен руж', 'Течен руж', 'Стик руж', 'Палитри руж']),
  '🌸'
ON CONFLICT (slug) DO NOTHING;

-- Highlighters (makeup-highlighters)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Powder Highlighters', 'Liquid Highlighters', 'Cream Highlighters', 'Stick Highlighters', 'Highlighter Palettes']),
  unnest(ARRAY['highlighter-powder', 'highlighter-liquid', 'highlighter-cream', 'highlighter-stick', 'highlighter-palette']),
  (SELECT id FROM categories WHERE slug = 'makeup-highlighters'),
  unnest(ARRAY['Пудра хайлайтър', 'Течен хайлайтър', 'Кремообразен хайлайтър', 'Стик хайлайтър', 'Палитри хайлайтър']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Bronzers (makeup-bronzers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Powder Bronzers', 'Liquid Bronzers', 'Cream Bronzers', 'Bronzer Sticks', 'Shimmer Bronzers', 'Matte Bronzers']),
  unnest(ARRAY['bronzer-powder', 'bronzer-liquid', 'bronzer-cream', 'bronzer-stick', 'bronzer-shimmer', 'bronzer-matte']),
  (SELECT id FROM categories WHERE slug = 'makeup-bronzers'),
  unnest(ARRAY['Пудра бронзант', 'Течен бронзант', 'Кремообразен бронзант', 'Стик бронзант', 'Сияен бронзант', 'Матов бронзант']),
  '☀️'
ON CONFLICT (slug) DO NOTHING;

-- Eye Makeup categories
-- Eyeshadow (makeup-eyeshadow)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Eyeshadow Palettes', 'Single Shadows', 'Liquid Shadows', 'Cream Shadows', 'Glitter Shadows', 'Shimmer Shadows', 'Matte Shadows']),
  unnest(ARRAY['eyeshadow-palette', 'eyeshadow-single', 'eyeshadow-liquid', 'eyeshadow-cream', 'eyeshadow-glitter', 'eyeshadow-shimmer', 'eyeshadow-matte']),
  (SELECT id FROM categories WHERE slug = 'makeup-eyeshadow'),
  unnest(ARRAY['Палитри сенки', 'Единични сенки', 'Течни сенки', 'Кремообразни сенки', 'Глитер сенки', 'Сияйни сенки', 'Матови сенки']),
  '👁️'
ON CONFLICT (slug) DO NOTHING;

-- Mascara (makeup-mascara)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Volumizing Mascara', 'Lengthening Mascara', 'Waterproof Mascara', 'Curling Mascara', 'Tubing Mascara', 'Colored Mascara', 'Lash Primer']),
  unnest(ARRAY['mascara-volumizing', 'mascara-lengthening', 'mascara-waterproof', 'mascara-curling', 'mascara-tubing', 'mascara-colored', 'mascara-primer']),
  (SELECT id FROM categories WHERE slug = 'makeup-mascara'),
  unnest(ARRAY['За обем', 'За дължина', 'Водоустойчива', 'За извивка', 'Тубинг', 'Цветна', 'Праймер за мигли']),
  '👁️'
ON CONFLICT (slug) DO NOTHING;

-- Eyeliner (makeup-eyeliner)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Liquid Liner', 'Pencil Liner', 'Gel Liner', 'Felt Tip Liner', 'Kohl Liner', 'Waterproof Liner', 'Colored Liner']),
  unnest(ARRAY['eyeliner-liquid', 'eyeliner-pencil', 'eyeliner-gel', 'eyeliner-felttip', 'eyeliner-kohl', 'eyeliner-waterproof', 'eyeliner-colored']),
  (SELECT id FROM categories WHERE slug = 'makeup-eyeliner'),
  unnest(ARRAY['Течна очна линия', 'Молив', 'Гел очна линия', 'Филц очна линия', 'Кол молив', 'Водоустойчива', 'Цветна очна линия']),
  '✏️'
ON CONFLICT (slug) DO NOTHING;

-- Eyebrow Products (makeup-eyebrows)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Brow Pencils', 'Brow Gels', 'Brow Pomades', 'Brow Powders', 'Brow Kits', 'Brow Tints', 'Brow Stencils']),
  unnest(ARRAY['brow-pencil', 'brow-gel', 'brow-pomade', 'brow-powder', 'brow-kit', 'brow-tint', 'brow-stencil']),
  (SELECT id FROM categories WHERE slug = 'makeup-eyebrows'),
  unnest(ARRAY['Моливи за вежди', 'Гелове за вежди', 'Помади за вежди', 'Пудри за вежди', 'Комплекти за вежди', 'Тинт за вежди', 'Шаблони за вежди']),
  '✏️'
ON CONFLICT (slug) DO NOTHING;

-- Lip Products
-- Lipstick (makeup-lipstick)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Matte Lipstick', 'Satin Lipstick', 'Cream Lipstick', 'Sheer Lipstick', 'Liquid Lipstick', 'Long-Wear Lipstick', 'Lipstick Sets']),
  unnest(ARRAY['lipstick-matte', 'lipstick-satin', 'lipstick-cream', 'lipstick-sheer', 'lipstick-liquid', 'lipstick-longwear', 'lipstick-sets']),
  (SELECT id FROM categories WHERE slug = 'makeup-lipstick'),
  unnest(ARRAY['Матово', 'Сатенено', 'Кремообразно', 'Полупрозрачно', 'Течно', 'Дълготрайно', 'Комплекти червила']),
  '💄'
ON CONFLICT (slug) DO NOTHING;

-- Lip Gloss (makeup-lip-gloss)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Shiny Gloss', 'Shimmer Gloss', 'Plumping Gloss', 'Tinted Gloss', 'Clear Gloss', 'Gloss Sets']),
  unnest(ARRAY['gloss-shiny', 'gloss-shimmer', 'gloss-plumping', 'gloss-tinted', 'gloss-clear', 'gloss-sets']),
  (SELECT id FROM categories WHERE slug = 'makeup-lip-gloss'),
  unnest(ARRAY['Блестящ гланц', 'Сияен гланц', 'Уголемяващ гланц', 'Оцветен гланц', 'Прозрачен гланц', 'Комплекти гланцове']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Lip Liner (makeup-lip-liner)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pencil Liner', 'Retractable Liner', 'Clear Liner', 'Lip Liner Sets']),
  unnest(ARRAY['lipliner-pencil', 'lipliner-retractable', 'lipliner-clear', 'lipliner-sets']),
  (SELECT id FROM categories WHERE slug = 'makeup-lip-liner'),
  unnest(ARRAY['Молив', 'Автоматичен молив', 'Прозрачен', 'Комплекти']),
  '✏️'
ON CONFLICT (slug) DO NOTHING;;
