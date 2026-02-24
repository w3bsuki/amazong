
-- Phase 5: Services - Comprehensive Attributes

DO $$
DECLARE
  services_id UUID;
BEGIN
  SELECT id INTO services_id FROM categories WHERE slug = 'services';
  
  -- Core Services Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (services_id, 'Service Type', 'Тип услуга', 'select', '["On-site", "Remote", "Both"]', '["На място", "Дистанционно", "И двете"]', false, true, 1),
    (services_id, 'Availability', 'Наличност', 'select', '["Immediate", "Within 24 hours", "Within a week", "By appointment"]', '["Незабавно", "До 24 часа", "До седмица", "По уговорка"]', false, true, 2),
    (services_id, 'Service Area', 'Район на обслужване', 'text', NULL, NULL, false, true, 3),
    (services_id, 'Pricing', 'Ценообразуване', 'select', '["Hourly Rate", "Fixed Price", "Quote Required", "Free Estimate"]', '["Почасово", "Фиксирана цена", "По запитване", "Безплатна оценка"]', false, true, 4),
    (services_id, 'Experience', 'Опит', 'select', '["< 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"]', '["< 1 година", "1-3 години", "3-5 години", "5-10 години", "10+ години"]', false, true, 5),
    (services_id, 'Licensed/Certified', 'Лицензиран/Сертифициран', 'boolean', NULL, NULL, false, true, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- Cleaning Services specific attributes
DO $$
DECLARE
  cleaning_id UUID;
BEGIN
  SELECT id INTO cleaning_id FROM categories WHERE slug = 'cleaning-services';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (cleaning_id, 'Cleaning Type', 'Тип почистване', 'select', '["Standard", "Deep Clean", "Move In/Out", "Post-Construction", "Specialized"]', '["Стандартно", "Основно", "При изнасяне/нанасяне", "След строеж", "Специализирано"]', false, true, 1),
    (cleaning_id, 'Property Size', 'Размер на имота', 'select', '["Studio", "1-2 Bedroom", "3-4 Bedroom", "5+ Bedroom", "Commercial"]', '["Студио", "1-2 стаи", "3-4 стаи", "5+ стаи", "Търговски обект"]', false, true, 2),
    (cleaning_id, 'Frequency', 'Честота', 'select', '["One-time", "Weekly", "Bi-weekly", "Monthly", "Custom"]', '["Еднократно", "Седмично", "Двуседмично", "Месечно", "По поръчка"]', false, true, 3),
    (cleaning_id, 'Eco-Friendly Products', 'Еко продукти', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Automotive Services specific attributes
DO $$
DECLARE
  auto_id UUID;
BEGIN
  SELECT id INTO auto_id FROM categories WHERE slug = 'automotive-services';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (auto_id, 'Vehicle Type', 'Тип превозно средство', 'select', '["Car", "SUV/Truck", "Motorcycle", "Commercial Vehicle", "All Types"]', '["Лек автомобил", "Джип/Пикап", "Мотоциклет", "Търговско превозно", "Всички типове"]', false, true, 1),
    (auto_id, 'Service Warranty', 'Гаранция на услуга', 'select', '["30 days", "90 days", "6 months", "1 year", "Varies"]', '["30 дни", "90 дни", "6 месеца", "1 година", "Различава се"]', false, true, 2),
    (auto_id, 'Mobile Service', 'Мобилен сервиз', 'boolean', NULL, NULL, false, true, 3),
    (auto_id, 'OEM Parts', 'Оригинални части', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Construction & Renovation specific attributes
DO $$
DECLARE
  construction_id UUID;
BEGIN
  SELECT id INTO construction_id FROM categories WHERE slug = 'construction-renovation';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (construction_id, 'Project Size', 'Размер на проект', 'select', '["Small (< $5k)", "Medium ($5k-$25k)", "Large ($25k-$100k)", "Major (> $100k)"]', '["Малък (< 10к лв)", "Среден (10к-50к лв)", "Голям (50к-200к лв)", "Основен (> 200к лв)"]', false, true, 1),
    (construction_id, 'Licensed Contractor', 'Лицензиран изпълнител', 'boolean', NULL, NULL, false, true, 2),
    (construction_id, 'Insurance', 'Застраховка', 'boolean', NULL, NULL, false, true, 3),
    (construction_id, 'Free Estimates', 'Безплатни оценки', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Education & Tutoring specific attributes
DO $$
DECLARE
  edu_id UUID;
BEGIN
  SELECT id INTO edu_id FROM categories WHERE slug = 'education-tutoring';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (edu_id, 'Teaching Mode', 'Начин на обучение', 'select', '["In-person", "Online", "Both"]', '["Присъствено", "Онлайн", "И двете"]', false, true, 1),
    (edu_id, 'Student Level', 'Ниво на ученика', 'select', '["Elementary", "Middle School", "High School", "University", "Adult"]', '["Начално", "Прогимназия", "Гимназия", "Университет", "Възрастен"]', false, true, 2),
    (edu_id, 'Group/Individual', 'Групово/Индивидуално', 'select', '["Individual", "Small Group (2-5)", "Group (6+)", "Both"]', '["Индивидуално", "Малка група (2-5)", "Група (6+)", "И двете"]', false, true, 3),
    (edu_id, 'Certified Teacher', 'Сертифициран учител', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Business Services specific attributes
DO $$
DECLARE
  biz_svc_id UUID;
BEGIN
  SELECT id INTO biz_svc_id FROM categories WHERE slug = 'business-services';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (biz_svc_id, 'Business Type', 'Тип бизнес', 'select', '["Sole Proprietor", "Small Business", "Medium Business", "Enterprise", "All"]', '["Едноличен търговец", "Малък бизнес", "Среден бизнес", "Корпорация", "Всички"]', false, true, 1),
    (biz_svc_id, 'Contract Type', 'Тип договор', 'select', '["Project-based", "Retainer", "Hourly", "Subscription"]', '["По проект", "На ретейнер", "Почасово", "Абонамент"]', false, true, 2),
    (biz_svc_id, 'Industry Experience', 'Индустриален опит', 'text', NULL, NULL, false, true, 3)
  ON CONFLICT DO NOTHING;
END $$;
;
