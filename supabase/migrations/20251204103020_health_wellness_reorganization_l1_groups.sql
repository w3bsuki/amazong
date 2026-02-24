
-- ============================================================================
-- HEALTH & WELLNESS MAJOR REORGANIZATION
-- Create 5 NEW L1 parent categories to group the existing 25 categories
-- This transforms flat structure into proper hierarchy
-- ============================================================================

-- Health & Wellness parent: d1cdc34b-dc6d-42fc-bab4-47e3cbd3a673

-- Step 1: Create 5 NEW L1 grouping categories
INSERT INTO categories (id, name, name_bg, slug, description, description_bg, parent_id, image_url) VALUES
-- 💊 SUPPLEMENTS - All supplement/vitamin categories
('d1cdc34b-0001-4000-8000-000000000001', 'Supplements & Vitamins', 'Хранителни добавки и витамини', 'supplements-vitamins', 
 'Vitamins, minerals, supplements, and nutritional products for daily health',
 'Витамини, минерали, хранителни добавки и продукти за ежедневно здраве',
 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673', '/categories/supplements.webp'),

-- 🧬 SPECIALTY HEALTH - Gender/age/condition specific
('d1cdc34b-0002-4000-8000-000000000002', 'Specialty & Targeted Health', 'Специализирано здраве', 'specialty-health',
 'Health products targeted for specific demographics, conditions, and life stages',
 'Здравни продукти, насочени към специфични демографски групи, състояния и етапи от живота',
 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673', '/categories/specialty-health.webp'),

-- 🏋️ SPORTS & FITNESS - Performance and fitness
('d1cdc34b-0003-4000-8000-000000000003', 'Sports & Fitness Nutrition', 'Спортно хранене и фитнес', 'sports-fitness-nutrition',
 'Sports nutrition, workout supplements, weight management, and fitness products',
 'Спортно хранене, добавки за тренировка, контрол на теглото и фитнес продукти',
 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673', '/categories/sports-fitness.webp'),

-- 🏥 MEDICAL & CARE - Medical supplies, devices, mobility
('d1cdc34b-0004-4000-8000-000000000004', 'Medical & Personal Care', 'Медицински и лични грижи', 'medical-personal-care',
 'Medical supplies, mobility aids, vision care, and personal care products',
 'Медицински консумативи, помощни средства за мобилност, грижа за зрението и продукти за лични грижи',
 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673', '/categories/medical-care.webp'),

-- 🌿 NATURAL & ALTERNATIVE - CBD, mushrooms, natural remedies
('d1cdc34b-0005-4000-8000-000000000005', 'Natural & Alternative Wellness', 'Натурално и алтернативно здраве', 'natural-alternative-wellness',
 'CBD products, functional mushrooms, adaptogens, and natural wellness remedies',
 'CBD продукти, функционални гъби, адаптогени и натурални здравословни средства',
 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673', '/categories/natural-wellness.webp');

-- Step 2: Re-parent existing L1 categories to become L2 under new groupings

-- 💊 SUPPLEMENTS & VITAMINS (d1cdc34b-0001-4000-8000-000000000001)
-- Moving: Vitamins, Omega, Probiotics, Superfoods, Collagen, Joint, Immune
UPDATE categories SET parent_id = 'd1cdc34b-0001-4000-8000-000000000001' 
WHERE id IN (
  'b2149a58-6db6-43f7-8237-da861e8dbdeb',  -- Vitamins & Supplements
  'f34571c7-67c8-43ee-ad4c-13ae3dafb0c3',  -- Omega & Fish Oils
  '8589bb94-adc4-47d1-9205-685f96c48502',  -- Probiotics & Gut Health
  '0e6a27cb-ab9e-432b-a04c-3bd8137f7fbd',  -- Superfoods & Greens
  'f110696e-6a53-4f8b-9976-2a170f99c962',  -- Collagen & Beauty
  'a0dc2310-5589-4093-bcd7-40f4839c5136',  -- Joint & Mobility
  'd54e4390-f653-4049-9189-2f4e7490f122'   -- Immune Support
);

-- 🧬 SPECIALTY & TARGETED HEALTH (d1cdc34b-0002-4000-8000-000000000002)
-- Moving: Women's, Men's, Children's, Heart, Blood Sugar, Stress, Longevity
UPDATE categories SET parent_id = 'd1cdc34b-0002-4000-8000-000000000002'
WHERE id IN (
  '77fc5c7e-0a8a-4967-8dfc-b247e22e3d65',  -- Women's Health
  '1270c114-f1c5-4a5b-9ee4-81e4eea888c2',  -- Men's Health
  'ca000000-0000-0000-0000-000000000100',  -- Children's Health
  'e283373f-1727-4fe0-91d2-dea0b19c2d35',  -- Heart Health
  '14e37220-d09e-4278-aa7a-576f59e44fcb',  -- Blood Sugar Support
  '2dddfc5d-e7d3-48d2-8b75-77a843306e69',  -- Stress & Mood
  '89aa7b5c-499d-4982-930c-3c14f4b9f57d'   -- Longevity & Anti-Aging
);

-- 🏋️ SPORTS & FITNESS NUTRITION (d1cdc34b-0003-4000-8000-000000000003)
-- Moving: Sports Nutrition, Fitness, Weight, Energy, Therapy
UPDATE categories SET parent_id = 'd1cdc34b-0003-4000-8000-000000000003'
WHERE id IN (
  '7979ce0f-6f61-4911-b38e-0b1ac92c803a',  -- Sports Nutrition
  'fc2fac98-e0c6-4bc0-a9c1-d0c94943e784',  -- Fitness & Nutrition
  'e1da58d8-4d6a-41fb-8d10-bfc58c0524ea',  -- Weight Management
  'df468c6a-1b09-4c91-a515-dc268905d7af',  -- Energy & Nootropics
  '7910e76a-d0ba-4eb0-8a01-f5f3bc76dfd6'   -- Therapy & Recovery
);

-- 🏥 MEDICAL & PERSONAL CARE (d1cdc34b-0004-4000-8000-000000000004)
-- Moving: Medical Supplies, Vision, Mobility, Personal Care
UPDATE categories SET parent_id = 'd1cdc34b-0004-4000-8000-000000000004'
WHERE id IN (
  'ab4a5dff-c805-4d8d-a1d5-a5c399b6ec8a',  -- Medical Supplies
  'a17e101b-a0a1-40c6-9f2b-d7c61bb6c07c',  -- Vision Care
  'f7b8554d-2dfb-4a87-a6ee-f46006d13081',  -- Mobility & Disability
  '3502dfcb-6a8a-432c-b506-3c3fd0eb5a5e'   -- Personal Care
);

-- 🌿 NATURAL & ALTERNATIVE WELLNESS (d1cdc34b-0005-4000-8000-000000000005)
-- Moving: CBD & Mushrooms, Sleep & Relaxation
UPDATE categories SET parent_id = 'd1cdc34b-0005-4000-8000-000000000005'
WHERE id IN (
  'f5231b56-37ef-49dd-9632-5f807e859a35',  -- CBD & Mushrooms
  'c21b1b3f-0329-45b4-ab24-d718ebaacba2'   -- Sleep & Relaxation
);
;
