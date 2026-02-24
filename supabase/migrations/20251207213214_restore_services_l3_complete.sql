-- Restore Services L3 categories

-- Home Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Plumbing', 'home-plumbing', 'ВиК услуги', 1),
  ('Electrical', 'home-electrical', 'Електроуслуги', 2),
  ('HVAC', 'home-hvac', 'Климатизация', 3),
  ('Roofing', 'home-roofing', 'Покривни услуги', 4),
  ('Painting', 'home-painting', 'Бояджийски услуги', 5),
  ('Flooring', 'home-flooring', 'Подови настилки', 6),
  ('Landscaping', 'home-landscaping', 'Озеленяване', 7),
  ('Pest Control', 'home-pest-control', 'Дезинсекция', 8),
  ('Home Security', 'home-security', 'Домашна сигурност', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-home'
ON CONFLICT (slug) DO NOTHING;

-- Professional Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Legal Services', 'professional-legal', 'Правни услуги', 1),
  ('Accounting', 'professional-accounting', 'Счетоводство', 2),
  ('Financial Planning', 'professional-financial', 'Финансово планиране', 3),
  ('Business Consulting', 'professional-consulting', 'Бизнес консултации', 4),
  ('Marketing Services', 'professional-marketing', 'Маркетинг услуги', 5),
  ('HR Services', 'professional-hr', 'HR услуги', 6),
  ('Translation', 'professional-translation', 'Преводачески услуги', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-professional'
ON CONFLICT (slug) DO NOTHING;

-- Tech Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Web Development', 'tech-web-dev', 'Уеб разработка', 1),
  ('Mobile App Development', 'tech-mobile-dev', 'Мобилни приложения', 2),
  ('IT Support', 'tech-it-support', 'IT поддръжка', 3),
  ('Cloud Services', 'tech-cloud', 'Облачни услуги', 4),
  ('Cybersecurity', 'tech-security', 'Киберсигурност', 5),
  ('Data Analysis', 'tech-data', 'Анализ на данни', 6),
  ('AI & ML Services', 'tech-ai', 'AI & ML услуги', 7),
  ('Computer Repair', 'tech-repair', 'Ремонт на компютри', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-tech'
ON CONFLICT (slug) DO NOTHING;

-- Health & Wellness Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Medical Practices', 'health-medical', 'Медицински практики', 1),
  ('Dental Services', 'health-dental', 'Стоматологични услуги', 2),
  ('Mental Health', 'health-mental', 'Психично здраве', 3),
  ('Physical Therapy', 'health-therapy', 'Физиотерапия', 4),
  ('Spa & Massage', 'health-spa', 'СПА и масаж', 5),
  ('Fitness Training', 'health-fitness', 'Фитнес треньори', 6),
  ('Nutrition Services', 'health-nutrition', 'Хранителни консултации', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-health'
ON CONFLICT (slug) DO NOTHING;

-- Education Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Tutoring', 'education-tutoring', 'Частни уроци', 1),
  ('Language Classes', 'education-language', 'Езикови курсове', 2),
  ('Music Lessons', 'education-music', 'Музикални уроци', 3),
  ('Art Classes', 'education-art', 'Художествени курсове', 4),
  ('Test Prep', 'education-test-prep', 'Подготовка за изпити', 5),
  ('Online Courses', 'education-online', 'Онлайн курсове', 6),
  ('Driving Schools', 'education-driving', 'Шофьорски курсове', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-education'
ON CONFLICT (slug) DO NOTHING;

-- Events Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Wedding Planning', 'events-wedding', 'Сватбена организация', 1),
  ('Party Planning', 'events-party', 'Организация на партита', 2),
  ('Catering', 'events-catering', 'Кетъринг', 3),
  ('Photography', 'events-photography', 'Фотография', 4),
  ('Videography', 'events-videography', 'Видеография', 5),
  ('DJ Services', 'events-dj', 'DJ услуги', 6),
  ('Venue Rentals', 'events-venues', 'Наем на зали', 7),
  ('Florists', 'events-florists', 'Флористи', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-events'
ON CONFLICT (slug) DO NOTHING;

-- Automotive Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Auto Repair', 'auto-repair', 'Авторемонт', 1),
  ('Oil Change', 'auto-oil', 'Смяна на масло', 2),
  ('Tire Services', 'auto-tires', 'Гуми', 3),
  ('Car Wash', 'auto-wash', 'Автомивка', 4),
  ('Detailing', 'auto-detailing', 'Детайлинг', 5),
  ('Body Shops', 'auto-body', 'Тенекеджийски услуги', 6),
  ('Towing', 'auto-towing', 'Пътна помощ', 7),
  ('Windshield Repair', 'auto-windshield', 'Ремонт на стъкла', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-automotive'
ON CONFLICT (slug) DO NOTHING;

-- Personal Services L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Hair Salons', 'personal-hair', 'Фризьорски салони', 1),
  ('Nail Salons', 'personal-nails', 'Маникюр салони', 2),
  ('Barbershops', 'personal-barber', 'Бръснарници', 3),
  ('Beauty Services', 'personal-beauty', 'Козметични услуги', 4),
  ('Tailoring', 'personal-tailoring', 'Шивашки услуги', 5),
  ('Dry Cleaning', 'personal-dry-cleaning', 'Химическо чистене', 6),
  ('Pet Services', 'personal-pet', 'Услуги за домашни любимци', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'services-personal'
ON CONFLICT (slug) DO NOTHING;;
