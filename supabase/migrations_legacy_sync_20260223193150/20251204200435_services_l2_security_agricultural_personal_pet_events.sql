-- =====================================================
-- SERVICES L2: SECURITY SERVICES (b1c2d3e4-1111-4000-8000-000000000014)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Alarm Systems
('b1c2d3e4-2015-4000-8000-000000000001', 'Alarm Systems', 'Алармени системи', 'security-alarm', 'b1c2d3e4-1111-4000-8000-000000000014', '🚨', 1),
-- CCTV Installation
('b1c2d3e4-2015-4000-8000-000000000002', 'CCTV Installation', 'Видеонаблюдение', 'security-cctv', 'b1c2d3e4-1111-4000-8000-000000000014', '📹', 2),
-- Security Guards
('b1c2d3e4-2015-4000-8000-000000000003', 'Security Guards', 'Физическа охрана', 'security-guards', 'b1c2d3e4-1111-4000-8000-000000000014', '👮', 3),
-- Access Control
('b1c2d3e4-2015-4000-8000-000000000004', 'Access Control', 'Контрол на достъп', 'security-access-control', 'b1c2d3e4-1111-4000-8000-000000000014', '🔑', 4),
-- Fire Protection
('b1c2d3e4-2015-4000-8000-000000000005', 'Fire Protection', 'Противопожарна защита', 'security-fire', 'b1c2d3e4-1111-4000-8000-000000000014', '🔥', 5),
-- Safe Installation
('b1c2d3e4-2015-4000-8000-000000000006', 'Safe Installation', 'Монтаж на сейфове', 'security-safe', 'b1c2d3e4-1111-4000-8000-000000000014', '🔒', 6),
-- Cybersecurity Services
('b1c2d3e4-2015-4000-8000-000000000007', 'Cybersecurity Services', 'Киберсигурност', 'security-cyber', 'b1c2d3e4-1111-4000-8000-000000000014', '💻', 7),
-- Private Investigation
('b1c2d3e4-2015-4000-8000-000000000008', 'Private Investigation', 'Частно разследване', 'security-investigation', 'b1c2d3e4-1111-4000-8000-000000000014', '🔍', 8);

-- =====================================================
-- SERVICES L2: AGRICULTURAL SERVICES (b1c2d3e4-1111-4000-8000-000000000015)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Farm Equipment Services
('b1c2d3e4-2016-4000-8000-000000000001', 'Farm Equipment Services', 'Услуги за земеделска техника', 'agri-equipment', 'b1c2d3e4-1111-4000-8000-000000000015', '🚜', 1),
-- Crop Spraying
('b1c2d3e4-2016-4000-8000-000000000002', 'Crop Spraying', 'Пръскане на култури', 'agri-spraying', 'b1c2d3e4-1111-4000-8000-000000000015', '🌾', 2),
-- Soil Testing
('b1c2d3e4-2016-4000-8000-000000000003', 'Soil Testing', 'Тестване на почва', 'agri-soil-testing', 'b1c2d3e4-1111-4000-8000-000000000015', '🧪', 3),
-- Irrigation Services
('b1c2d3e4-2016-4000-8000-000000000004', 'Irrigation Services', 'Напоителни системи', 'agri-irrigation', 'b1c2d3e4-1111-4000-8000-000000000015', '💧', 4),
-- Livestock Services
('b1c2d3e4-2016-4000-8000-000000000005', 'Livestock Services', 'Животновъдни услуги', 'agri-livestock', 'b1c2d3e4-1111-4000-8000-000000000015', '🐄', 5),
-- Forestry Services
('b1c2d3e4-2016-4000-8000-000000000006', 'Forestry Services', 'Горски услуги', 'agri-forestry', 'b1c2d3e4-1111-4000-8000-000000000015', '🌲', 6),
-- Beekeeping Services
('b1c2d3e4-2016-4000-8000-000000000007', 'Beekeeping Services', 'Пчеларски услуги', 'agri-beekeeping', 'b1c2d3e4-1111-4000-8000-000000000015', '🐝', 7),
-- Agricultural Consulting
('b1c2d3e4-2016-4000-8000-000000000008', 'Agricultural Consulting', 'Земеделско консултиране', 'agri-consulting', 'b1c2d3e4-1111-4000-8000-000000000015', '📊', 8);

-- =====================================================
-- SERVICES L2: PERSONAL SERVICES (3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Hair Services
('b1c2d3e4-2017-4000-8000-000000000001', 'Hair Services', 'Фризьорски услуги', 'personal-hair', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '💇', 1),
-- Makeup Services
('b1c2d3e4-2017-4000-8000-000000000002', 'Makeup Services', 'Гримьорски услуги', 'personal-makeup', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '💄', 2),
-- Nail Services
('b1c2d3e4-2017-4000-8000-000000000003', 'Nail Services', 'Маникюр и педикюр', 'personal-nails', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '💅', 3),
-- Spa Services
('b1c2d3e4-2017-4000-8000-000000000004', 'Spa Services', 'СПА услуги', 'personal-spa', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '🧖', 4),
-- Tailoring & Alterations
('b1c2d3e4-2017-4000-8000-000000000005', 'Tailoring & Alterations', 'Шивашки услуги', 'personal-tailoring', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '🧵', 5),
-- Shoe Repair
('b1c2d3e4-2017-4000-8000-000000000006', 'Shoe Repair', 'Обущарски услуги', 'personal-shoe-repair', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '👟', 6),
-- Laundry & Dry Cleaning
('b1c2d3e4-2017-4000-8000-000000000007', 'Laundry & Dry Cleaning', 'Пране и химическо чистене', 'personal-laundry', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '👔', 7),
-- Personal Shopping
('b1c2d3e4-2017-4000-8000-000000000008', 'Personal Shopping', 'Личен пазаруващ', 'personal-shopping', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '🛍️', 8),
-- Skincare Services
('b1c2d3e4-2017-4000-8000-000000000009', 'Skincare Services', 'Козметични услуги', 'personal-skincare', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '✨', 9),
-- Tattoo & Piercing
('b1c2d3e4-2017-4000-8000-000000000010', 'Tattoo & Piercing', 'Татуировки и пиърсинг', 'personal-tattoo-piercing', '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3', '🎨', 10);

-- =====================================================
-- SERVICES L2: PET SERVICES (f295266b-24db-4561-a7aa-b36cdb875b91)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Pet Grooming
('b1c2d3e4-2018-4000-8000-000000000001', 'Pet Grooming', 'Грууминг', 'pet-grooming', 'f295266b-24db-4561-a7aa-b36cdb875b91', '✂️', 1),
-- Pet Sitting
('b1c2d3e4-2018-4000-8000-000000000002', 'Pet Sitting', 'Гледане на домашни любимци', 'pet-sitting', 'f295266b-24db-4561-a7aa-b36cdb875b91', '🏠', 2),
-- Dog Walking
('b1c2d3e4-2018-4000-8000-000000000003', 'Dog Walking', 'Разхождане на кучета', 'pet-dog-walking', 'f295266b-24db-4561-a7aa-b36cdb875b91', '🐕', 3),
-- Pet Training
('b1c2d3e4-2018-4000-8000-000000000004', 'Pet Training', 'Обучение на домашни любимци', 'pet-training', 'f295266b-24db-4561-a7aa-b36cdb875b91', '🎓', 4),
-- Veterinary Services
('b1c2d3e4-2018-4000-8000-000000000005', 'Veterinary Services', 'Ветеринарни услуги', 'pet-veterinary', 'f295266b-24db-4561-a7aa-b36cdb875b91', '🏥', 5),
-- Pet Boarding
('b1c2d3e4-2018-4000-8000-000000000006', 'Pet Boarding', 'Хотел за домашни любимци', 'pet-boarding', 'f295266b-24db-4561-a7aa-b36cdb875b91', '🏨', 6),
-- Pet Photography
('b1c2d3e4-2018-4000-8000-000000000007', 'Pet Photography', 'Фотография на домашни любимци', 'pet-photography', 'f295266b-24db-4561-a7aa-b36cdb875b91', '📷', 7),
-- Pet Transport
('b1c2d3e4-2018-4000-8000-000000000008', 'Pet Transport', 'Транспорт на домашни любимци', 'pet-transport', 'f295266b-24db-4561-a7aa-b36cdb875b91', '🚗', 8);

-- =====================================================
-- SERVICES L2: EVENTS & ENTERTAINMENT (0da75aaa-ae4b-4474-9a1c-0736708c41e3)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- DJs & Music
('b1c2d3e4-2019-4000-8000-000000000001', 'DJs & Music', 'Диджеи и музика', 'events-dj-music', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '🎧', 1),
-- Photographers
('b1c2d3e4-2019-4000-8000-000000000002', 'Event Photographers', 'Фотографи за събития', 'events-photographers', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '📸', 2),
-- Videographers
('b1c2d3e4-2019-4000-8000-000000000003', 'Event Videographers', 'Видеооператори за събития', 'events-videographers', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '🎬', 3),
-- Catering
('b1c2d3e4-2019-4000-8000-000000000004', 'Catering Services', 'Кетъринг', 'events-catering', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '🍽️', 4),
-- Event Planning
('b1c2d3e4-2019-4000-8000-000000000005', 'Event Planning', 'Организация на събития', 'events-planning', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '📋', 5),
-- Venues
('b1c2d3e4-2019-4000-8000-000000000006', 'Event Venues', 'Зали за събития', 'events-venues', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '🏛️', 6),
-- Entertainers
('b1c2d3e4-2019-4000-8000-000000000007', 'Entertainers & Performers', 'Артисти и изпълнители', 'events-entertainers', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '🎭', 7),
-- Decorations
('b1c2d3e4-2019-4000-8000-000000000008', 'Event Decorations', 'Декорации за събития', 'events-decorations', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '🎈', 8),
-- Rentals
('b1c2d3e4-2019-4000-8000-000000000009', 'Event Rentals', 'Наем на оборудване', 'events-rentals', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '🎪', 9),
-- Sound & Lighting
('b1c2d3e4-2019-4000-8000-000000000010', 'Sound & Lighting', 'Озвучаване и осветление', 'events-sound-lighting', '0da75aaa-ae4b-4474-9a1c-0736708c41e3', '💡', 10);

-- =====================================================
-- SERVICES L2: LESSONS & CLASSES (2adec24f-179d-49f3-81b0-71d278737a55)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Math & Science
('b1c2d3e4-2020-4000-8000-000000000001', 'Math & Science', 'Математика и природни науки', 'lessons-math-science', '2adec24f-179d-49f3-81b0-71d278737a55', '🔬', 1),
-- Language Learning
('b1c2d3e4-2020-4000-8000-000000000002', 'Language Learning', 'Изучаване на езици', 'lessons-languages', '2adec24f-179d-49f3-81b0-71d278737a55', '🌍', 2),
-- Music Lessons
('b1c2d3e4-2020-4000-8000-000000000003', 'Music Lessons', 'Музикални уроци', 'lessons-music', '2adec24f-179d-49f3-81b0-71d278737a55', '🎵', 3),
-- Art Classes
('b1c2d3e4-2020-4000-8000-000000000004', 'Art Classes', 'Уроци по рисуване', 'lessons-art', '2adec24f-179d-49f3-81b0-71d278737a55', '🎨', 4),
-- Fitness Classes
('b1c2d3e4-2020-4000-8000-000000000005', 'Fitness Classes', 'Фитнес занимания', 'lessons-fitness', '2adec24f-179d-49f3-81b0-71d278737a55', '🏋️', 5),
-- Computer Classes
('b1c2d3e4-2020-4000-8000-000000000006', 'Computer Classes', 'Компютърни курсове', 'lessons-computer', '2adec24f-179d-49f3-81b0-71d278737a55', '💻', 6),
-- Business Skills
('b1c2d3e4-2020-4000-8000-000000000007', 'Business Skills', 'Бизнес умения', 'lessons-business', '2adec24f-179d-49f3-81b0-71d278737a55', '💼', 7),
-- Test Prep
('b1c2d3e4-2020-4000-8000-000000000008', 'Test Preparation', 'Подготовка за изпити', 'lessons-test-prep', '2adec24f-179d-49f3-81b0-71d278737a55', '📝', 8);

-- =====================================================
-- SERVICES L2: PROFESSIONAL SERVICES (75c64d6e-6c38-4c8f-9124-9f517648216d)
-- =====================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Consulting
('b1c2d3e4-2021-4000-8000-000000000001', 'Business Consulting', 'Бизнес консултиране', 'prof-consulting', '75c64d6e-6c38-4c8f-9124-9f517648216d', '💼', 1),
-- Financial Services
('b1c2d3e4-2021-4000-8000-000000000002', 'Financial Services', 'Финансови услуги', 'prof-financial', '75c64d6e-6c38-4c8f-9124-9f517648216d', '💰', 2),
-- Legal Services
('b1c2d3e4-2021-4000-8000-000000000003', 'Legal Services', 'Правни услуги', 'prof-legal', '75c64d6e-6c38-4c8f-9124-9f517648216d', '⚖️', 3),
-- Marketing Services
('b1c2d3e4-2021-4000-8000-000000000004', 'Marketing Services', 'Маркетинг услуги', 'prof-marketing', '75c64d6e-6c38-4c8f-9124-9f517648216d', '📣', 4),
-- HR Services
('b1c2d3e4-2021-4000-8000-000000000005', 'HR Services', 'Човешки ресурси', 'prof-hr', '75c64d6e-6c38-4c8f-9124-9f517648216d', '👥', 5),
-- IT Services
('b1c2d3e4-2021-4000-8000-000000000006', 'IT Services', 'ИТ услуги', 'prof-it', '75c64d6e-6c38-4c8f-9124-9f517648216d', '💻', 6),
-- Design Services
('b1c2d3e4-2021-4000-8000-000000000007', 'Design Services', 'Дизайнерски услуги', 'prof-design', '75c64d6e-6c38-4c8f-9124-9f517648216d', '🎨', 7),
-- Translation Services
('b1c2d3e4-2021-4000-8000-000000000008', 'Translation Services', 'Преводачески услуги', 'prof-translation', '75c64d6e-6c38-4c8f-9124-9f517648216d', '🌐', 8);;
