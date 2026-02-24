-- Restore category_attributes for Services & Jobs

-- Home Services attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('home-services', 'Service Type', 'Тип услуга', 'select', true, true, '["Plumbing", "Electrical", "Cleaning", "Painting", "Landscaping", "HVAC", "Roofing", "Flooring", "Moving", "Handyman"]', '["ВиК", "Ел. услуги", "Почистване", "Боядисване", "Озеленяване", "Климатизация", "Покриви", "Подове", "Преместване", "Майстор"]', 1),
  ('home-services', 'Service Area', 'Обслужван район', 'text', true, true, '[]', '[]', 2),
  ('home-services', 'Pricing Type', 'Тип ценообразуване', 'select', false, true, '["Hourly Rate", "Fixed Price", "Free Estimate", "Project Based"]', '["Часова ставка", "Фиксирана цена", "Безплатна оценка", "По проект"]', 3),
  ('home-services', 'Availability', 'Наличност', 'select', false, true, '["Weekdays", "Weekends", "Evenings", "24/7", "By Appointment"]', '["Делнични дни", "Уикенди", "Вечери", "24/7", "По уговорка"]', 4),
  ('home-services', 'Experience', 'Опит', 'select', false, true, '["1-2 years", "3-5 years", "5-10 years", "10+ years"]', '["1-2 години", "3-5 години", "5-10 години", "10+ години"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Professional Services attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('professional-services', 'Service Type', 'Тип услуга', 'select', true, true, '["Legal", "Accounting", "Translation", "Marketing", "IT Support", "Consulting", "Design", "Photography", "Tutoring", "Writing"]', '["Правни", "Счетоводство", "Превод", "Маркетинг", "IT поддръжка", "Консултации", "Дизайн", "Фотография", "Уроци", "Писане"]', 1),
  ('professional-services', 'Delivery', 'Изпълнение', 'select', false, true, '["Remote/Online", "On-Site", "Both"]', '["Дистанционно", "На място", "И двете"]', 2),
  ('professional-services', 'Pricing Type', 'Тип ценообразуване', 'select', false, true, '["Hourly Rate", "Fixed Price", "Project Based", "Retainer"]', '["Часова ставка", "Фиксирана цена", "По проект", "Абонамент"]', 3),
  ('professional-services', 'Experience', 'Опит', 'select', false, true, '["1-2 years", "3-5 years", "5-10 years", "10+ years"]', '["1-2 години", "3-5 години", "5-10 години", "10+ години"]', 4),
  ('professional-services', 'Languages', 'Езици', 'multiselect', false, true, '["Bulgarian", "English", "German", "French", "Spanish", "Russian", "Other"]', '["Български", "Английски", "Немски", "Френски", "Испански", "Руски", "Друг"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Events & Entertainment Services attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('events-services', 'Service Type', 'Тип услуга', 'select', true, true, '["DJ", "Catering", "Photography", "Videography", "Event Planning", "Decoration", "Live Music", "MC/Host", "Rentals", "Venue"]', '["DJ", "Кетъринг", "Фотография", "Видеография", "Организация", "Декорация", "Жива музика", "Водещ", "Наем", "Място"]', 1),
  ('events-services', 'Event Types', 'Типове събития', 'multiselect', false, true, '["Weddings", "Corporate", "Birthday", "Graduation", "Baby Shower", "Holiday", "Concert", "Conference"]', '["Сватби", "Корпоративни", "Рожден ден", "Дипломиране", "Baby shower", "Празник", "Концерт", "Конференция"]', 2),
  ('events-services', 'Service Area', 'Обслужван район', 'text', true, true, '[]', '[]', 3),
  ('events-services', 'Pricing Type', 'Тип ценообразуване', 'select', false, true, '["Per Hour", "Per Event", "Package Deals", "Custom Quote"]', '["На час", "На събитие", "Пакетни оферти", "По заявка"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Technology Jobs attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('tech-jobs', 'Position Type', 'Тип позиция', 'select', true, true, '["Software Developer", "Web Developer", "Mobile Developer", "DevOps", "Data Scientist", "QA Engineer", "Product Manager", "UI/UX Designer", "System Admin", "Security Engineer"]', '["Софтуерен разработчик", "Уеб разработчик", "Мобилен разработчик", "DevOps", "Data Scientist", "QA инженер", "Продуктов мениджър", "UI/UX дизайнер", "Системен админ", "Инженер по сигурността"]', 1),
  ('tech-jobs', 'Employment Type', 'Тип заетост', 'select', true, true, '["Full-Time", "Part-Time", "Contract", "Freelance", "Internship"]', '["Пълно работно време", "Непълно работно време", "Договор", "Фрийланс", "Стаж"]', 2),
  ('tech-jobs', 'Work Model', 'Модел на работа', 'select', true, true, '["Remote", "On-Site", "Hybrid"]', '["Дистанционно", "В офис", "Хибридно"]', 3),
  ('tech-jobs', 'Experience Level', 'Ниво на опит', 'select', true, true, '["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Manager"]', '["Начално ниво", "Junior", "Mid-Level", "Senior", "Lead", "Мениджър"]', 4),
  ('tech-jobs', 'Technologies', 'Технологии', 'multiselect', false, true, '["JavaScript", "Python", "Java", "C#", "PHP", "React", "Angular", "Node.js", "AWS", "Docker"]', '["JavaScript", "Python", "Java", "C#", "PHP", "React", "Angular", "Node.js", "AWS", "Docker"]', 5),
  ('tech-jobs', 'Salary Range', 'Заплата', 'text', false, true, '[]', '[]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Healthcare Jobs attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('healthcare-jobs', 'Position Type', 'Тип позиция', 'select', true, true, '["Nurse", "Doctor", "Pharmacist", "Dentist", "Lab Technician", "Therapist", "Medical Assistant", "Caregiver", "Administrator"]', '["Медицинска сестра", "Лекар", "Фармацевт", "Зъболекар", "Лаборант", "Терапевт", "Мед. асистент", "Болногледач", "Администратор"]', 1),
  ('healthcare-jobs', 'Employment Type', 'Тип заетост', 'select', true, true, '["Full-Time", "Part-Time", "Contract", "Per Diem", "Internship"]', '["Пълно работно време", "Непълно работно време", "Договор", "На повикване", "Стаж"]', 2),
  ('healthcare-jobs', 'Shift', 'Смяна', 'select', false, true, '["Day", "Night", "Rotating", "Flexible"]', '["Дневна", "Нощна", "Ротираща", "Гъвкава"]', 3),
  ('healthcare-jobs', 'Experience Level', 'Ниво на опит', 'select', true, true, '["Entry Level", "1-3 years", "3-5 years", "5+ years"]', '["Начално ниво", "1-3 години", "3-5 години", "5+ години"]', 4),
  ('healthcare-jobs', 'Certifications Required', 'Изисквани сертификати', 'multiselect', false, false, '["BLS", "ACLS", "RN License", "Medical Degree", "Specialty Board"]', '["BLS", "ACLS", "Медицинска сестра", "Мед. диплома", "Специалност"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Business & Sales Jobs attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('business-jobs', 'Position Type', 'Тип позиция', 'select', true, true, '["Sales Representative", "Account Manager", "Business Developer", "Marketing Manager", "HR Manager", "Financial Analyst", "Operations Manager", "Project Manager"]', '["Търговски представител", "Account Manager", "Бизнес развитие", "Маркетинг мениджър", "HR мениджър", "Финансов анализатор", "Оперативен мениджър", "Проектен мениджър"]', 1),
  ('business-jobs', 'Employment Type', 'Тип заетост', 'select', true, true, '["Full-Time", "Part-Time", "Contract", "Commission-Based"]', '["Пълно работно време", "Непълно работно време", "Договор", "На комисионна"]', 2),
  ('business-jobs', 'Work Model', 'Модел на работа', 'select', true, true, '["Remote", "On-Site", "Hybrid", "Travel Required"]', '["Дистанционно", "В офис", "Хибридно", "С пътуване"]', 3),
  ('business-jobs', 'Experience Level', 'Ниво на опит', 'select', true, true, '["Entry Level", "Junior", "Mid-Level", "Senior", "Director", "Executive"]', '["Начално ниво", "Junior", "Mid-Level", "Senior", "Директор", "Executive"]', 4),
  ('business-jobs', 'Industry', 'Индустрия', 'select', false, true, '["Tech", "Finance", "Healthcare", "Retail", "Manufacturing", "Real Estate", "Consulting", "Other"]', '["Технологии", "Финанси", "Здравеопазване", "Търговия", "Производство", "Недвижими имоти", "Консултации", "Друго"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
