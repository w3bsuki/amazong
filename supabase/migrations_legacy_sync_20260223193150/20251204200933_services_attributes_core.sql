-- =====================================================
-- SERVICES & EVENTS ATTRIBUTES - PHASE 4: CORE ATTRIBUTES
-- Root Category ID: 4aa24e30-4596-4d22-85e5-7558936163b3
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order) VALUES

-- SERVICE TYPE & BASICS
('c1d2e3f4-0001-4000-8000-000000000001', '4aa24e30-4596-4d22-85e5-7558936163b3', 
 'Service Type', 'Тип услуга', 'select', true, true,
 '["One-Time Service", "Recurring Service", "Subscription", "Project-Based", "Consultation", "On-Demand"]'::jsonb,
 '["Еднократна услуга", "Повтаряща се услуга", "Абонамент", "Проектна основа", "Консултация", "При поискване"]'::jsonb,
 'Select service type', 'Изберете тип услуга', 1),

('c1d2e3f4-0001-4000-8000-000000000002', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Provider Type', 'Тип изпълнител', 'select', true, true,
 '["Individual", "Company", "Freelancer", "Agency", "Team"]'::jsonb,
 '["Физическо лице", "Фирма", "Фрийлансър", "Агенция", "Екип"]'::jsonb,
 'Select provider type', 'Изберете тип изпълнител', 2),

('c1d2e3f4-0001-4000-8000-000000000003', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Business Registration', 'Бизнес регистрация', 'select', false, true,
 '["Sole Trader", "Limited Company", "Self-Employed", "Partnership", "Not Registered"]'::jsonb,
 '["Едноличен търговец", "ЕООД/ООД", "Самонает", "Съдружие", "Нерегистриран"]'::jsonb,
 'Select business registration', 'Изберете бизнес регистрация', 3),

-- PRICING
('c1d2e3f4-0001-4000-8000-000000000004', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Pricing Type', 'Тип ценообразуване', 'select', true, true,
 '["Hourly Rate", "Fixed Price", "Daily Rate", "Quote Required", "Starting From", "Package Pricing", "Negotiable"]'::jsonb,
 '["На час", "Фиксирана цена", "На ден", "Оферта при запитване", "Цени от", "Пакетни цени", "По договаряне"]'::jsonb,
 'Select pricing type', 'Изберете тип ценообразуване', 4),

('c1d2e3f4-0001-4000-8000-000000000005', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Minimum Price', 'Минимална цена', 'number', false, true,
 NULL, NULL,
 'Enter minimum price in BGN', 'Въведете минимална цена в лв.', 5),

('c1d2e3f4-0001-4000-8000-000000000006', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Maximum Price', 'Максимална цена', 'number', false, true,
 NULL, NULL,
 'Enter maximum price in BGN', 'Въведете максимална цена в лв.', 6),

('c1d2e3f4-0001-4000-8000-000000000007', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Call-Out Fee', 'Такса за посещение', 'number', false, true,
 NULL, NULL,
 'Enter call-out fee in BGN', 'Въведете такса за посещение в лв.', 7),

('c1d2e3f4-0001-4000-8000-000000000008', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Consultation Fee', 'Такса за консултация', 'number', false, true,
 NULL, NULL,
 'Enter consultation fee in BGN', 'Въведете такса за консултация в лв.', 8),

-- EXPERIENCE & QUALIFICATIONS
('c1d2e3f4-0001-4000-8000-000000000009', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Experience', 'Опит', 'select', false, true,
 '["Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10-20 years", "Over 20 years"]'::jsonb,
 '["Под 1 година", "1-2 години", "3-5 години", "5-10 години", "10-20 години", "Над 20 години"]'::jsonb,
 'Select years of experience', 'Изберете опит в години', 9),

('c1d2e3f4-0001-4000-8000-000000000010', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Certifications', 'Сертификати', 'multiselect', false, true,
 '["Professional License", "Industry Certification", "University Degree", "Trade Certificate", "Safety Certification", "ISO Certified", "None"]'::jsonb,
 '["Професионален лиценз", "Индустриален сертификат", "Университетска степен", "Занаятчийски сертификат", "Сертификат за безопасност", "ISO сертифициран", "Няма"]'::jsonb,
 'Select certifications', 'Изберете сертификати', 10),

('c1d2e3f4-0001-4000-8000-000000000011', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Insurance', 'Застраховка', 'select', false, true,
 '["Fully Insured", "Liability Insurance", "Professional Indemnity", "No Insurance"]'::jsonb,
 '["Пълна застраховка", "Застраховка отговорност", "Професионална отговорност", "Без застраховка"]'::jsonb,
 'Select insurance type', 'Изберете тип застраховка', 11);;
