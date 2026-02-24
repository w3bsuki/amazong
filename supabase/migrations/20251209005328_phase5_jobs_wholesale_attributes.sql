
-- Phase 5: Jobs - Comprehensive Attributes

DO $$
DECLARE
  jobs_id UUID;
BEGIN
  SELECT id INTO jobs_id FROM categories WHERE slug = 'jobs';
  
  -- Core Jobs Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (jobs_id, 'Employment Type', 'Тип заетост', 'select', '["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Temporary"]', '["Пълен работен ден", "Непълен работен ден", "Договор", "Фрийланс", "Стаж", "Временна"]', true, true, 1),
    (jobs_id, 'Experience Level', 'Ниво на опит', 'select', '["Entry Level", "Junior", "Mid-Level", "Senior", "Lead/Manager", "Executive"]', '["Без опит", "Младши", "Средно ниво", "Старши", "Ръководител", "Изпълнителен директор"]', false, true, 2),
    (jobs_id, 'Work Location', 'Местоположение', 'select', '["On-site", "Remote", "Hybrid"]', '["В офис", "Дистанционно", "Хибридно"]', false, true, 3),
    (jobs_id, 'Education Required', 'Изисквано образование', 'select', '["None", "High School", "Bachelor''s", "Master''s", "PhD", "Vocational"]', '["Без", "Средно", "Бакалавър", "Магистър", "Докторат", "Професионално"]', false, true, 4),
    (jobs_id, 'Salary Type', 'Тип заплата', 'select', '["Hourly", "Monthly", "Annual", "Commission", "Negotiable"]', '["Почасово", "Месечно", "Годишно", "Комисионна", "По договаряне"]', false, true, 5),
    (jobs_id, 'Benefits', 'Придобивки', 'text', NULL, NULL, false, true, 6),
    (jobs_id, 'Start Date', 'Начална дата', 'select', '["Immediate", "Within 2 weeks", "Within 1 month", "Flexible"]', '["Незабавно", "До 2 седмици", "До 1 месец", "Гъвкаво"]', false, true, 7)
  ON CONFLICT DO NOTHING;
END $$;

-- IT Jobs specific attributes
DO $$
DECLARE
  it_jobs_id UUID;
BEGIN
  SELECT id INTO it_jobs_id FROM categories WHERE slug = 'it-jobs';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (it_jobs_id, 'Tech Stack', 'Технологии', 'text', NULL, NULL, false, true, 1),
    (it_jobs_id, 'Specialization', 'Специализация', 'select', '["Frontend", "Backend", "Full-Stack", "DevOps", "Data Science", "Mobile", "Security", "QA"]', '["Фронтенд", "Бекенд", "Фул-стек", "DevOps", "Data Science", "Мобилна разработка", "Сигурност", "QA"]', false, true, 2),
    (it_jobs_id, 'Remote Work', 'Дистанционна работа', 'boolean', NULL, NULL, false, true, 3)
  ON CONFLICT DO NOTHING;
END $$;

-- Healthcare Jobs specific attributes
DO $$
DECLARE
  healthcare_jobs_id UUID;
BEGIN
  SELECT id INTO healthcare_jobs_id FROM categories WHERE slug = 'healthcare-jobs';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (healthcare_jobs_id, 'License Required', 'Изисква се лиценз', 'boolean', NULL, NULL, false, true, 1),
    (healthcare_jobs_id, 'Shift Type', 'Тип смяна', 'select', '["Day Shift", "Night Shift", "Rotating", "On-Call", "Flexible"]', '["Дневна смяна", "Нощна смяна", "Ротираща", "На повикване", "Гъвкава"]', false, true, 2),
    (healthcare_jobs_id, 'Specialization', 'Специализация', 'text', NULL, NULL, false, true, 3)
  ON CONFLICT DO NOTHING;
END $$;

-- Phase 5: Wholesale - Comprehensive Attributes

DO $$
DECLARE
  wholesale_id UUID;
BEGIN
  SELECT id INTO wholesale_id FROM categories WHERE slug = 'wholesale';
  
  -- Core Wholesale Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (wholesale_id, 'Minimum Order', 'Минимална поръчка', 'select', '["No Minimum", "10+ units", "50+ units", "100+ units", "500+ units", "1000+ units", "Container"]', '["Без минимум", "10+ бройки", "50+ бройки", "100+ бройки", "500+ бройки", "1000+ бройки", "Контейнер"]', false, true, 1),
    (wholesale_id, 'Pricing Tier', 'Ценова категория', 'select', '["Small Wholesale", "Medium Wholesale", "Large Wholesale", "Bulk/Pallet"]', '["Малък търговец на едро", "Среден търговец на едро", "Голям търговец на едро", "На палет/насипно"]', false, true, 2),
    (wholesale_id, 'Lead Time', 'Срок за доставка', 'select', '["In Stock", "1-3 days", "1-2 weeks", "2-4 weeks", "1-2 months", "Custom"]', '["Наличност", "1-3 дни", "1-2 седмици", "2-4 седмици", "1-2 месеца", "По поръчка"]', false, true, 3),
    (wholesale_id, 'Private Label', 'Частна марка', 'boolean', NULL, NULL, false, true, 4),
    (wholesale_id, 'Dropshipping', 'Дропшипинг', 'boolean', NULL, NULL, false, true, 5),
    (wholesale_id, 'Sample Available', 'Мостри налични', 'boolean', NULL, NULL, false, true, 6),
    (wholesale_id, 'Certifications', 'Сертификати', 'text', NULL, NULL, false, true, 7)
  ON CONFLICT DO NOTHING;
END $$;

-- Wholesale Electronics specific attributes
DO $$
DECLARE
  ws_elec_id UUID;
BEGIN
  SELECT id INTO ws_elec_id FROM categories WHERE slug = 'wholesale-electronics';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (ws_elec_id, 'Warranty', 'Гаранция', 'select', '["No Warranty", "30 Days", "90 Days", "1 Year", "2 Years", "Manufacturer Warranty"]', '["Без гаранция", "30 дни", "90 дни", "1 година", "2 години", "Гаранция от производител"]', false, true, 1),
    (ws_elec_id, 'Condition', 'Състояние', 'select', '["New", "Refurbished", "Open Box", "Grade A", "Grade B", "Mixed"]', '["Ново", "Реновирано", "Отворена кутия", "Клас A", "Клас B", "Смесено"]', false, true, 2),
    (ws_elec_id, 'OEM/Generic', 'OEM/Генерично', 'select', '["OEM/Brand", "Generic/White Label", "Both"]', '["OEM/Марка", "Генерично/Бяла марка", "И двете"]', false, true, 3)
  ON CONFLICT DO NOTHING;
END $$;

-- Wholesale Clothing specific attributes
DO $$
DECLARE
  ws_cloth_id UUID;
BEGIN
  SELECT id INTO ws_cloth_id FROM categories WHERE slug = 'wholesale-clothing';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (ws_cloth_id, 'Size Range', 'Размерен ряд', 'select', '["XS-XL", "S-3XL", "One Size", "Custom Sizes", "Full Range"]', '["XS-XL", "S-3XL", "Един размер", "Персонализирани размери", "Пълен ряд"]', false, true, 1),
    (ws_cloth_id, 'Material', 'Материал', 'text', NULL, NULL, false, true, 2),
    (ws_cloth_id, 'Style', 'Стил', 'select', '["Casual", "Formal", "Sportswear", "Streetwear", "Workwear", "Mixed"]', '["Ежедневен", "Официален", "Спортно облекло", "Стрийтуеър", "Работно облекло", "Смесен"]', false, true, 3),
    (ws_cloth_id, 'Season', 'Сезон', 'select', '["Spring/Summer", "Fall/Winter", "All Season"]', '["Пролет/Лято", "Есен/Зима", "Целогодишно"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Wholesale Food specific attributes
DO $$
DECLARE
  ws_food_id UUID;
BEGIN
  SELECT id INTO ws_food_id FROM categories WHERE slug = 'wholesale-food-bev';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (ws_food_id, 'Storage Requirements', 'Изисквания за съхранение', 'select', '["Ambient", "Refrigerated", "Frozen", "Dry"]', '["Стайна температура", "Хладилно", "Замразено", "Сухо"]', false, true, 1),
    (ws_food_id, 'Shelf Life', 'Срок на годност', 'select', '["< 1 week", "1-4 weeks", "1-6 months", "6-12 months", "1+ year"]', '["< 1 седмица", "1-4 седмици", "1-6 месеца", "6-12 месеца", "1+ година"]', false, true, 2),
    (ws_food_id, 'Organic', 'Био', 'boolean', NULL, NULL, false, true, 3),
    (ws_food_id, 'HACCP Certified', 'HACCP сертифициран', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;
;
