-- Restore Jobs L3 categories

-- Technology Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Software Developer', 'jobs-software-dev', 'Софтуерен разработчик', 1),
  ('Web Developer', 'jobs-web-dev', 'Уеб разработчик', 2),
  ('Mobile Developer', 'jobs-mobile-dev', 'Мобилен разработчик', 3),
  ('Data Scientist', 'jobs-data-scientist', 'Специалист по данни', 4),
  ('DevOps Engineer', 'jobs-devops', 'DevOps инженер', 5),
  ('System Administrator', 'jobs-sysadmin', 'Системен администратор', 6),
  ('QA Engineer', 'jobs-qa', 'QA инженер', 7),
  ('Product Manager', 'jobs-product-manager', 'Продуктов мениджър', 8),
  ('UI/UX Designer', 'jobs-uiux-designer', 'UI/UX дизайнер', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-technology'
ON CONFLICT (slug) DO NOTHING;

-- Sales & Marketing Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Sales Representative', 'jobs-sales-rep', 'Търговски представител', 1),
  ('Account Manager', 'jobs-account-manager', 'Акаунт мениджър', 2),
  ('Marketing Manager', 'jobs-marketing-manager', 'Маркетинг мениджър', 3),
  ('Digital Marketing', 'jobs-digital-marketing', 'Дигитален маркетинг', 4),
  ('Content Writer', 'jobs-content-writer', 'Копирайтър', 5),
  ('SEO Specialist', 'jobs-seo', 'SEO специалист', 6),
  ('Social Media Manager', 'jobs-social-media', 'Социални мрежи мениджър', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-sales-marketing'
ON CONFLICT (slug) DO NOTHING;

-- Healthcare Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Nurse', 'jobs-nurse', 'Медицинска сестра', 1),
  ('Doctor', 'jobs-doctor', 'Лекар', 2),
  ('Pharmacist', 'jobs-pharmacist', 'Фармацевт', 3),
  ('Medical Technician', 'jobs-med-tech', 'Медицински техник', 4),
  ('Therapist', 'jobs-therapist', 'Терапевт', 5),
  ('Dental Professional', 'jobs-dental', 'Стоматолог', 6),
  ('Healthcare Admin', 'jobs-healthcare-admin', 'Администратор здравеопазване', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-healthcare'
ON CONFLICT (slug) DO NOTHING;

-- Finance Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Accountant', 'jobs-accountant', 'Счетоводител', 1),
  ('Financial Analyst', 'jobs-financial-analyst', 'Финансов анализатор', 2),
  ('Bank Teller', 'jobs-bank-teller', 'Банков служител', 3),
  ('Auditor', 'jobs-auditor', 'Одитор', 4),
  ('Investment Banker', 'jobs-investment-banker', 'Инвестиционен банкер', 5),
  ('Financial Planner', 'jobs-financial-planner', 'Финансов консултант', 6),
  ('Tax Specialist', 'jobs-tax-specialist', 'Данъчен специалист', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-finance'
ON CONFLICT (slug) DO NOTHING;

-- Education Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Teacher', 'jobs-teacher', 'Учител', 1),
  ('Professor', 'jobs-professor', 'Професор', 2),
  ('Tutor', 'jobs-tutor', 'Частен учител', 3),
  ('School Administrator', 'jobs-school-admin', 'Училищен администратор', 4),
  ('Librarian', 'jobs-librarian', 'Библиотекар', 5),
  ('Training Specialist', 'jobs-training', 'Специалист обучение', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-education'
ON CONFLICT (slug) DO NOTHING;

-- Construction Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('General Contractor', 'jobs-contractor', 'Главен изпълнител', 1),
  ('Carpenter', 'jobs-carpenter', 'Дърводелец', 2),
  ('Electrician', 'jobs-electrician', 'Електротехник', 3),
  ('Plumber', 'jobs-plumber', 'Водопроводчик', 4),
  ('Welder', 'jobs-welder', 'Заварчик', 5),
  ('Mason', 'jobs-mason', 'Зидар', 6),
  ('Heavy Equipment Operator', 'jobs-heavy-equipment', 'Оператор на техника', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-construction'
ON CONFLICT (slug) DO NOTHING;

-- Hospitality Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Hotel Manager', 'jobs-hotel-manager', 'Хотелски мениджър', 1),
  ('Restaurant Manager', 'jobs-restaurant-manager', 'Ресторантьор', 2),
  ('Chef', 'jobs-chef', 'Готвач', 3),
  ('Bartender', 'jobs-bartender', 'Барман', 4),
  ('Server', 'jobs-server', 'Сервитьор', 5),
  ('Housekeeper', 'jobs-housekeeper', 'Камериерка', 6),
  ('Event Coordinator', 'jobs-event-coordinator', 'Организатор събития', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-hospitality'
ON CONFLICT (slug) DO NOTHING;

-- Remote Jobs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Remote Developer', 'jobs-remote-dev', 'Дистанционен разработчик', 1),
  ('Remote Designer', 'jobs-remote-designer', 'Дистанционен дизайнер', 2),
  ('Remote Customer Service', 'jobs-remote-support', 'Дистанционна поддръжка', 3),
  ('Remote Writer', 'jobs-remote-writer', 'Дистанционен писател', 4),
  ('Remote Marketing', 'jobs-remote-marketing', 'Дистанционен маркетинг', 5),
  ('Remote Sales', 'jobs-remote-sales', 'Дистанционни продажби', 6),
  ('Virtual Assistant', 'jobs-virtual-assistant', 'Виртуален асистент', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'jobs-remote'
ON CONFLICT (slug) DO NOTHING;;
