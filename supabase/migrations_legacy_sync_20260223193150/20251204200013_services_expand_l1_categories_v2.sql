-- =====================================================
-- SERVICES & EVENTS EXPANSION - PHASE 2A: NEW L1 CATEGORIES
-- =====================================================
-- Root ID: 4aa24e30-4596-4d22-85e5-7558936163b3
-- Using UUID range: b1c2d3e4-xxxx for Services
-- Avoiding slug conflicts with existing categories

INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- Cleaning Services
('b1c2d3e4-1111-4000-8000-000000000001', 'Cleaning Services', 'Услуги по почистване', 'cleaning-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '🧹', 10),

-- Repairs & Maintenance
('b1c2d3e4-1111-4000-8000-000000000002', 'Repairs & Maintenance', 'Ремонти и поддръжка', 'repairs-maintenance', '4aa24e30-4596-4d22-85e5-7558936163b3', '🔧', 20),

-- Moving & Relocation
('b1c2d3e4-1111-4000-8000-000000000003', 'Moving & Relocation', 'Преместване и транспорт', 'moving-relocation', '4aa24e30-4596-4d22-85e5-7558936163b3', '📦', 30),

-- Wellness Services (avoiding conflict with health-wellness)
('b1c2d3e4-1111-4000-8000-000000000004', 'Wellness Services', 'Уелнес услуги', 'wellness-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '💪', 40),

-- Education & Tutoring
('b1c2d3e4-1111-4000-8000-000000000005', 'Education & Tutoring', 'Образование и уроци', 'education-tutoring', '4aa24e30-4596-4d22-85e5-7558936163b3', '📖', 50),

-- Tech & IT Services
('b1c2d3e4-1111-4000-8000-000000000006', 'Tech & IT Services', 'Технологии и IT услуги', 'tech-it-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '💻', 60),

-- Business Services
('b1c2d3e4-1111-4000-8000-000000000007', 'Business Services', 'Бизнес услуги', 'business-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '📊', 70),

-- Wedding Services
('b1c2d3e4-1111-4000-8000-000000000008', 'Wedding Services', 'Сватбени услуги', 'wedding-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '💒', 80),

-- Legal & Financial
('b1c2d3e4-1111-4000-8000-000000000009', 'Legal & Financial', 'Правни и финансови услуги', 'legal-financial', '4aa24e30-4596-4d22-85e5-7558936163b3', '⚖️', 90),

-- Transportation Services
('b1c2d3e4-1111-4000-8000-000000000010', 'Transportation Services', 'Транспортни услуги', 'transportation-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '🚗', 100),

-- Freelance & Creative
('b1c2d3e4-1111-4000-8000-000000000011', 'Freelance & Creative', 'Фрийланс и творчески услуги', 'freelance-creative', '4aa24e30-4596-4d22-85e5-7558936163b3', '🎨', 110),

-- Construction & Renovation
('b1c2d3e4-1111-4000-8000-000000000012', 'Construction & Renovation', 'Строителство и ремонт', 'construction-renovation', '4aa24e30-4596-4d22-85e5-7558936163b3', '🏗️', 120),

-- Automotive Services
('b1c2d3e4-1111-4000-8000-000000000013', 'Automotive Services', 'Автомобилни услуги', 'automotive-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '🚙', 130),

-- Security Services
('b1c2d3e4-1111-4000-8000-000000000014', 'Security Services', 'Охранителни услуги', 'security-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '🔒', 140),

-- Agricultural Services
('b1c2d3e4-1111-4000-8000-000000000015', 'Agricultural Services', 'Селскостопански услуги', 'agricultural-services', '4aa24e30-4596-4d22-85e5-7558936163b3', '🌾', 150);

-- Update display_order for existing L1 categories
UPDATE categories SET display_order = 200 WHERE id = '13f6f347-37a5-4ca0-94f6-5fbdf4bb953b'; -- Home Services
UPDATE categories SET display_order = 210 WHERE id = '3fbe5be7-e9a2-4b0d-8b8c-c999c7dbfab3'; -- Personal Services
UPDATE categories SET display_order = 220 WHERE id = 'f295266b-24db-4561-a7aa-b36cdb875b91'; -- Pet Services
UPDATE categories SET display_order = 230 WHERE id = '75c64d6e-6c38-4c8f-9124-9f517648216d'; -- Professional Services
UPDATE categories SET display_order = 240 WHERE id = '2adec24f-179d-49f3-81b0-71d278737a55'; -- Lessons & Classes
UPDATE categories SET display_order = 250 WHERE id = '0da75aaa-ae4b-4474-9a1c-0736708c41e3'; -- Events & Entertainment
UPDATE categories SET display_order = 260 WHERE id = '3a1ffadf-d097-4fb3-86f8-6e02f3693d32'; -- Tickets & Events
UPDATE categories SET display_order = 270 WHERE id = 'f90e22dd-bc8b-42b5-babb-3c985a9de633'; -- Gift Cards;
