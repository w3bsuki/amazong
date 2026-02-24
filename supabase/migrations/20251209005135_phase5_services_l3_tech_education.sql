
-- Phase 5: Services - Tech & Education L3s

-- Tech > IT Support L3s (based on tech-it-services children)
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Computer Repair', 'Network Setup', 'Data Recovery', 'Virus Removal', 'Software Installation', 'Remote IT Support']),
  unnest(ARRAY['it-computer-repair', 'it-network-setup', 'it-data-recovery', 'it-virus-removal', 'it-software-install', 'it-remote-support']),
  (SELECT id FROM categories WHERE slug = 'tech-it-services'),
  unnest(ARRAY['Ремонт на компютри', 'Настройка на мрежа', 'Възстановяване на данни', 'Премахване на вируси', 'Инсталиране на софтуер', 'Отдалечена IT поддръжка']),
  '💻',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Education > Language Tutoring L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['English Tutoring', 'German Tutoring', 'French Tutoring', 'Spanish Tutoring', 'Bulgarian Language', 'Business Language']),
  unnest(ARRAY['tutor-english', 'tutor-german', 'tutor-french', 'tutor-spanish', 'tutor-bulgarian', 'tutor-business-lang']),
  (SELECT id FROM categories WHERE slug = 'education-tutoring'),
  unnest(ARRAY['Английски уроци', 'Немски уроци', 'Френски уроци', 'Испански уроци', 'Български език', 'Бизнес език']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Education > STEM Tutoring L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Math Tutoring', 'Physics Tutoring', 'Chemistry Tutoring', 'Biology Tutoring', 'Computer Science Tutoring', 'Engineering Tutoring']),
  unnest(ARRAY['tutor-math', 'tutor-physics', 'tutor-chemistry', 'tutor-biology', 'tutor-compsci', 'tutor-engineering']),
  (SELECT id FROM categories WHERE slug = 'education-tutoring'),
  unnest(ARRAY['Математика уроци', 'Физика уроци', 'Химия уроци', 'Биология уроци', 'Компютърни науки уроци', 'Инженерство уроци']),
  '🔬',
  generate_series(7, 12)
ON CONFLICT (slug) DO NOTHING;

-- Freelance & Creative L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Logo Design', 'Web Design', 'Illustration', 'Photo Editing', 'Video Production', 'Animation']),
  unnest(ARRAY['freelance-logo', 'freelance-web', 'freelance-illustration', 'freelance-photo', 'freelance-video', 'freelance-animation']),
  (SELECT id FROM categories WHERE slug = 'freelance-creative'),
  unnest(ARRAY['Дизайн на лого', 'Уеб дизайн', 'Илюстрация', 'Фото обработка', 'Видео продукция', 'Анимация']),
  '🎨',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Pet Services L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Dog Walking', 'Pet Sitting', 'Pet Grooming', 'Pet Training', 'Veterinary Services', 'Pet Boarding']),
  unnest(ARRAY['pet-dog-walking', 'pet-sitting', 'pet-grooming', 'pet-training', 'pet-veterinary', 'pet-boarding']),
  (SELECT id FROM categories WHERE slug = 'pet-services'),
  unnest(ARRAY['Разходка на куче', 'Гледане на домашни любимци', 'Грууминг', 'Обучение на животни', 'Ветеринарни услуги', 'Хотел за домашни любимци']),
  '🐕',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Home Services L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Plumbing', 'Electrical', 'HVAC', 'Handyman', 'Landscaping', 'Pest Control']),
  unnest(ARRAY['home-plumbing', 'home-electrical', 'home-hvac', 'home-handyman', 'home-landscaping', 'home-pest']),
  (SELECT id FROM categories WHERE slug = 'home-services'),
  unnest(ARRAY['ВиК услуги', 'Електроуслуги', 'Климатизация', 'Майстор на повикване', 'Озеленяване', 'Контрол на вредители']),
  '🏠',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Moving Services L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Local Moving', 'Long Distance Moving', 'International Moving', 'Packing Services', 'Storage Services', 'Furniture Assembly']),
  unnest(ARRAY['moving-local', 'moving-long', 'moving-international', 'moving-packing', 'moving-storage', 'moving-assembly']),
  (SELECT id FROM categories WHERE slug = 'moving-relocation'),
  unnest(ARRAY['Местно преместване', 'Далечно преместване', 'Международно преместване', 'Опаковане', 'Съхранение', 'Сглобяване на мебели']),
  '📦',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
