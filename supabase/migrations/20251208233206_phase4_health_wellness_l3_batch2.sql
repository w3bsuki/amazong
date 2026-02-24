-- Phase 4: Health & Wellness - L3 Categories Batch 2 (Sports Nutrition, Natural Wellness)

DO $$
DECLARE
  -- Sports & Fitness Nutrition L2 IDs
  bcaas_id UUID := '2610642a-170a-4b87-ba9a-71f9af4e064e';
  creatine_id UUID := '597f3457-9c4a-4a58-8a6e-bb88de910979';
  energy_id UUID := 'df468c6a-1b09-4c91-a515-dc268905d7af';
  fitness_nutr_id UUID := 'fc2fac98-e0c6-4bc0-a9c1-d0c94943e784';
  mass_id UUID := 'd1716a03-bf1d-400a-bd71-be588240c741';
  preworkout_id UUID := '66197ebc-5aae-4049-8732-45861e327c7f';
  protein_id UUID := '348b257c-a261-48ba-b2a9-b339946f6f01';
  recovery_id UUID := '7910e76a-d0ba-4eb0-8a01-f5f3bc76dfd6';
  -- Natural & Alternative Wellness L2 IDs
  adaptogens_id UUID := '8818005c-e105-48f9-8e6c-211c662424d4';
  aroma_id UUID := 'c88f31ec-10a2-4590-a845-43f1fa970461';
  ayurveda_id UUID := '3c44f859-3ad3-4da7-b2e8-bebba5e14b64';
  cbd_id UUID := 'd1cdc34b-0005-4000-8000-000000000010';
  oils_id UUID := '2cc18fb8-f5a9-444f-9da2-85db16fe8350';
  mushrooms_id UUID := 'fd6e7523-3f1a-4d76-99d1-7e98ec19e163';
  hemp_id UUID := 'b7b44a4e-b552-4c59-9eca-d8e4dd23ef2b';
  homeopathy_id UUID := 'c5b8742d-df11-4fb8-a706-31f6a6d96081';
  -- Specialty Health L2 IDs
  blood_sugar_id UUID := '14e37220-d09e-4278-aa7a-576f59e44fcb';
  childrens_id UUID := 'ca000000-0000-0000-0000-000000000100';
  longevity_id UUID := '89aa7b5c-499d-4982-930c-3c14f4b9f57d';
  mens_id UUID := '1270c114-f1c5-4a5b-9ee4-81e4eea888c2';
  stress_id UUID := '2dddfc5d-e7d3-48d2-8b75-77a843306e69';
  womens_id UUID := '77fc5c7e-0a8a-4967-8dfc-b247e22e3d65';
BEGIN
  -- BCAAs L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('BCAA Powder', 'bcaa-powder', bcaas_id, 'BCAA на прах', '💪', 1),
    ('BCAA Capsules', 'bcaa-capsules', bcaas_id, 'BCAA капсули', '💪', 2),
    ('BCAA Drinks', 'bcaa-drinks', bcaas_id, 'BCAA напитки', '💪', 3),
    ('EAAs', 'bcaa-eaas', bcaas_id, 'Есенциални аминокиселини', '💪', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Creatine L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Creatine Monohydrate', 'creatine-mono', creatine_id, 'Креатин монохидрат', '💪', 1),
    ('Micronized Creatine', 'creatine-micro', creatine_id, 'Микронизиран креатин', '💪', 2),
    ('Creatine HCL', 'creatine-hcl', creatine_id, 'Креатин HCL', '💪', 3),
    ('Creatine Blends', 'creatine-blends', creatine_id, 'Креатинови смеси', '💪', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Energy & Nootropics L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Caffeine Supplements', 'energy-caffeine', energy_id, 'Кофеинови добавки', '⚡', 1),
    ('Focus Supplements', 'energy-focus', energy_id, 'Добавки за фокус', '⚡', 2),
    ('Memory Supplements', 'energy-memory', energy_id, 'Добавки за памет', '⚡', 3),
    ('Brain Boosters', 'energy-brain', energy_id, 'Добавки за мозъка', '⚡', 4),
    ('Energy Drinks', 'energy-drinks', energy_id, 'Енергийни напитки', '⚡', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Mass Gainers L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('High Calorie Gainers', 'mass-high-calorie', mass_id, 'Високо калорични гейнъри', '💪', 1),
    ('Lean Mass Gainers', 'mass-lean', mass_id, 'Гейнъри за чиста маса', '💪', 2),
    ('Natural Mass Gainers', 'mass-natural', mass_id, 'Натурални гейнъри', '💪', 3),
    ('Hardgainer Formulas', 'mass-hardgainer', mass_id, 'Формули за хардгейнъри', '💪', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Pre-Workout L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Stimulant Pre-Workout', 'preworkout-stim', preworkout_id, 'Стимулиращ предтренировъчен', '🔥', 1),
    ('Non-Stim Pre-Workout', 'preworkout-nonstim', preworkout_id, 'Нестимулиращ предтренировъчен', '🔥', 2),
    ('Pump Formulas', 'preworkout-pump', preworkout_id, 'Формули за помпа', '🔥', 3),
    ('Natural Pre-Workout', 'preworkout-natural', preworkout_id, 'Натурален предтренировъчен', '🔥', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Protein Powders L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Whey Protein', 'protein-whey', protein_id, 'Суроватъчен протеин', '💪', 1),
    ('Whey Isolate', 'protein-whey-isolate', protein_id, 'Суроватъчен изолат', '💪', 2),
    ('Casein Protein', 'protein-casein', protein_id, 'Казеинов протеин', '💪', 3),
    ('Plant Protein', 'protein-plant', protein_id, 'Растителен протеин', '💪', 4),
    ('Pea Protein', 'protein-pea', protein_id, 'Грахов протеин', '💪', 5),
    ('Egg Protein', 'protein-egg', protein_id, 'Яйчен протеин', '💪', 6),
    ('Protein Blends', 'protein-blends', protein_id, 'Протеинови смеси', '💪', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Therapy & Recovery L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Post-Workout Recovery', 'recovery-post', recovery_id, 'Следтренировъчно възстановяване', '🔄', 1),
    ('Electrolytes', 'recovery-electrolytes', recovery_id, 'Електролити', '🔄', 2),
    ('Glutamine', 'recovery-glutamine', recovery_id, 'Глутамин', '🔄', 3),
    ('Muscle Recovery', 'recovery-muscle', recovery_id, 'Мускулно възстановяване', '🔄', 4),
    ('Recovery Drinks', 'recovery-drinks', recovery_id, 'Възстановяващи напитки', '🔄', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Adaptogens L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Rhodiola Rosea', 'adapt-rhodiola', adaptogens_id, 'Родиола', '🌿', 1),
    ('Maca Root', 'adapt-maca', adaptogens_id, 'Мака', '🌿', 2),
    ('Holy Basil', 'adapt-holy-basil', adaptogens_id, 'Свещен босилек', '🌿', 3),
    ('Schisandra', 'adapt-schisandra', adaptogens_id, 'Шизандра', '🌿', 4),
    ('Adaptogen Blends', 'adapt-blends', adaptogens_id, 'Адаптогенни смеси', '🌿', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Aromatherapy L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Essential Oil Diffusers', 'aroma-diffusers', aroma_id, 'Дифузери за етерични масла', '🌸', 1),
    ('Relaxation Oils', 'aroma-relaxation', aroma_id, 'Релаксиращи масла', '🌸', 2),
    ('Energy Oils', 'aroma-energy', aroma_id, 'Енергизиращи масла', '🌸', 3),
    ('Sleep Oils', 'aroma-sleep', aroma_id, 'Масла за сън', '🌸', 4),
    ('Oil Blends', 'aroma-blends', aroma_id, 'Смеси от масла', '🌸', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- CBD Products L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('CBD Oil', 'cbd-oil', cbd_id, 'CBD масло', '🌿', 1),
    ('CBD Capsules', 'cbd-capsules', cbd_id, 'CBD капсули', '🌿', 2),
    ('CBD Gummies', 'cbd-gummies', cbd_id, 'CBD бонбони', '🌿', 3),
    ('CBD Topicals', 'cbd-topicals', cbd_id, 'CBD кремове', '🌿', 4),
    ('Full Spectrum CBD', 'cbd-full-spectrum', cbd_id, 'Пълен спектър CBD', '🌿', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Essential Oils L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Lavender Oil', 'oils-lavender', oils_id, 'Лавандулово масло', '💜', 1),
    ('Peppermint Oil', 'oils-peppermint', oils_id, 'Масло от мента', '💜', 2),
    ('Tea Tree Oil', 'oils-tea-tree', oils_id, 'Масло от чаено дърво', '💜', 3),
    ('Eucalyptus Oil', 'oils-eucalyptus', oils_id, 'Евкалиптово масло', '💜', 4),
    ('Frankincense Oil', 'oils-frankincense', oils_id, 'Тамянов ладан', '💜', 5),
    ('Oil Sets', 'oils-sets', oils_id, 'Комплекти масла', '💜', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Functional Mushrooms L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Lion''s Mane', 'mushroom-lions-mane', mushrooms_id, 'Лъвска грива', '🍄', 1),
    ('Reishi', 'mushroom-reishi', mushrooms_id, 'Рейши', '🍄', 2),
    ('Chaga', 'mushroom-chaga', mushrooms_id, 'Чага', '🍄', 3),
    ('Cordyceps', 'mushroom-cordyceps', mushrooms_id, 'Кордицепс', '🍄', 4),
    ('Turkey Tail', 'mushroom-turkey-tail', mushrooms_id, 'Пуешка опашка', '🍄', 5),
    ('Mushroom Blends', 'mushroom-blends', mushrooms_id, 'Смеси от гъби', '🍄', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Blood Sugar Support L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Berberine', 'bloodsugar-berberine', blood_sugar_id, 'Берберин', '📊', 1),
    ('Chromium', 'bloodsugar-chromium', blood_sugar_id, 'Хром', '📊', 2),
    ('Cinnamon Extract', 'bloodsugar-cinnamon', blood_sugar_id, 'Екстракт от канела', '📊', 3),
    ('Blood Sugar Formulas', 'bloodsugar-formulas', blood_sugar_id, 'Формули за кръвна захар', '📊', 4)
  ON CONFLICT (slug) DO NOTHING;

  -- Men's Health L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Testosterone Support', 'mens-testosterone', mens_id, 'Подкрепа на тестостерон', '♂️', 1),
    ('Prostate Health', 'mens-prostate', mens_id, 'Здраве на простатата', '♂️', 2),
    ('Men''s Multivitamins', 'mens-multi', mens_id, 'Мултивитамини за мъже', '♂️', 3),
    ('Men''s Energy', 'mens-energy', mens_id, 'Енергия за мъже', '♂️', 4),
    ('Men''s Fertility', 'mens-fertility', mens_id, 'Фертилност за мъже', '♂️', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Women's Health L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Prenatal Vitamins', 'womens-prenatal', womens_id, 'Пренатални витамини', '♀️', 1),
    ('Hormone Balance', 'womens-hormone', womens_id, 'Хормонален баланс', '♀️', 2),
    ('Iron for Women', 'womens-iron', womens_id, 'Желязо за жени', '♀️', 3),
    ('Women''s Multivitamins', 'womens-multi', womens_id, 'Мултивитамини за жени', '♀️', 4),
    ('Menopause Support', 'womens-menopause', womens_id, 'Подкрепа при менопауза', '♀️', 5),
    ('Women''s Fertility', 'womens-fertility', womens_id, 'Фертилност за жени', '♀️', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Stress & Mood L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Ashwagandha Stress', 'stress-ashwagandha', stress_id, 'Ашваганда за стрес', '🧘', 1),
    ('L-Theanine', 'stress-ltheanine', stress_id, 'L-Теанин', '🧘', 2),
    ('Mood Support', 'stress-mood-support', stress_id, 'Подкрепа на настроението', '🧘', 3),
    ('Anxiety Support', 'stress-anxiety', stress_id, 'Подкрепа при тревожност', '🧘', 4),
    ('Calm Formulas', 'stress-calm', stress_id, 'Успокояващи формули', '🧘', 5)
  ON CONFLICT (slug) DO NOTHING;

END $$;;
