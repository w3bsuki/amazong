-- =====================================================
-- SERVICES ATTRIBUTES: EDUCATION, WELLNESS, LEGAL, BULGARIAN MARKET
-- =====================================================

INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, placeholder, placeholder_bg, sort_order) VALUES

-- EDUCATION & TUTORING
('c1d2e3f4-0007-4000-8000-000000000001', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Subject Area', 'Предметна област', 'multiselect', false, true,
 '["Mathematics", "Physics", "Chemistry", "Biology", "Bulgarian Language", "English Language", "German Language", "French Language", "History", "Geography", "IT/Programming", "Music", "Art", "Sports", "Business", "Test Preparation"]'::jsonb,
 '["Математика", "Физика", "Химия", "Биология", "Български език", "Английски език", "Немски език", "Френски език", "История", "География", "IT/Програмиране", "Музика", "Изобразително изкуство", "Спорт", "Бизнес", "Подготовка за изпити"]'::jsonb,
 'Select subjects', 'Изберете предмети', 64),

('c1d2e3f4-0007-4000-8000-000000000002', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Student Level', 'Ниво на ученика', 'multiselect', false, true,
 '["Preschool", "Primary School (1-4)", "Middle School (5-7)", "High School (8-12)", "University", "Adult Learner", "Professional Development"]'::jsonb,
 '["Предучилищно", "Начално училище (1-4 клас)", "Прогимназия (5-7 клас)", "Гимназия (8-12 клас)", "Университет", "Възрастен обучаващ се", "Професионално развитие"]'::jsonb,
 'Select student levels', 'Изберете нива на обучаемите', 65),

('c1d2e3f4-0007-4000-8000-000000000003', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Teaching Method', 'Метод на обучение', 'multiselect', false, true,
 '["One-on-One", "Group Class", "Online Live", "Pre-recorded", "Hybrid", "Intensive Course", "Regular Sessions"]'::jsonb,
 '["Индивидуално", "Групово", "Онлайн на живо", "Предварително записано", "Хибридно", "Интензивен курс", "Редовни сесии"]'::jsonb,
 'Select teaching methods', 'Изберете методи на обучение', 66),

-- HEALTH & WELLNESS
('c1d2e3f4-0007-4000-8000-000000000004', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Wellness Service Type', 'Тип уелнес услуга', 'multiselect', false, true,
 '["Massage", "Yoga", "Pilates", "Personal Training", "Nutrition Consulting", "Life Coaching", "Meditation", "Physiotherapy", "Acupuncture", "Spa Services", "Beauty Treatments", "Mental Health"]'::jsonb,
 '["Масаж", "Йога", "Пилатес", "Персонален треньор", "Хранителни консултации", "Лайф коучинг", "Медитация", "Физиотерапия", "Акупунктура", "СПА услуги", "Козметични процедури", "Психично здраве"]'::jsonb,
 'Select wellness services', 'Изберете уелнес услуги', 67),

('c1d2e3f4-0007-4000-8000-000000000005', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Qualification Level', 'Ниво на квалификация', 'select', false, true,
 '["Certified Professional", "Licensed Practitioner", "Master Level", "Beginner/Student", "Self-Taught", "International Certification"]'::jsonb,
 '["Сертифициран специалист", "Лицензиран практикуващ", "Майстор", "Начинаещ/Студент", "Самоук", "Международен сертификат"]'::jsonb,
 'Select qualification', 'Изберете квалификация', 68),

-- LEGAL & FINANCIAL
('c1d2e3f4-0007-4000-8000-000000000006', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Legal Service Type', 'Тип правна услуга', 'multiselect', false, true,
 '["Corporate Law", "Family Law", "Real Estate Law", "Criminal Defense", "Immigration", "Labor Law", "Tax Law", "Intellectual Property", "Contract Review", "Notary Services", "Legal Consultation"]'::jsonb,
 '["Корпоративно право", "Семейно право", "Имотно право", "Наказателна защита", "Имиграция", "Трудово право", "Данъчно право", "Интелектуална собственост", "Преглед на договори", "Нотариални услуги", "Правни консултации"]'::jsonb,
 'Select legal services', 'Изберете правни услуги', 69),

('c1d2e3f4-0007-4000-8000-000000000007', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Financial Service Type', 'Тип финансова услуга', 'multiselect', false, true,
 '["Accounting", "Tax Preparation", "Bookkeeping", "Financial Planning", "Investment Advisory", "Insurance", "Loan Consulting", "Auditing", "Payroll Services"]'::jsonb,
 '["Счетоводство", "Данъчни декларации", "Счетоводно обслужване", "Финансово планиране", "Инвестиционни съвети", "Застраховане", "Кредитни консултации", "Одит", "Услуги по заплати"]'::jsonb,
 'Select financial services', 'Изберете финансови услуги', 70),

-- BULGARIAN MARKET SPECIFIC
('c1d2e3f4-0007-4000-8000-000000000008', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Contract Type (Bulgarian)', 'Тип договор', 'select', false, true,
 '["Service Agreement", "Work Contract", "Freelance Contract", "One-time Service", "Monthly Subscription", "Annual Contract"]'::jsonb,
 '["Договор за услуга", "Трудов договор", "Граждански договор", "Еднократна услуга", "Месечен абонамент", "Годишен договор"]'::jsonb,
 'Select contract type', 'Изберете тип договор', 71),

('c1d2e3f4-0007-4000-8000-000000000009', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Bulgarian Certifications', 'Български сертификати', 'multiselect', false, true,
 '["BULSTAT Registration", "Trade Register Entry", "Professional Chamber Member", "ISO Certified", "Health Ministry Permit", "Construction License", "Transport License", "Food Safety Certificate"]'::jsonb,
 '["Регистрация по БУЛСТАТ", "Вписване в Търговски регистър", "Член на професионална камара", "ISO сертификат", "Разрешение от МЗ", "Строителен лиценз", "Транспортен лиценз", "Сертификат за безопасност на храни"]'::jsonb,
 'Select certifications', 'Изберете сертификати', 72),

('c1d2e3f4-0007-4000-8000-000000000010', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Emergency Service', 'Спешна услуга', 'select', false, true,
 '["Yes - 24/7", "Yes - Daytime Only", "Yes - Extra Charge", "No - Scheduled Only"]'::jsonb,
 '["Да - 24/7", "Да - Само денем", "Да - С допълнително заплащане", "Не - Само по график"]'::jsonb,
 'Emergency availability', 'Наличност при спешност', 73),

('c1d2e3f4-0007-4000-8000-000000000011', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Service Contract', 'Договор за услуга', 'select', false, true,
 '["Written Contract Provided", "Oral Agreement", "Invoice Only", "Terms on Website"]'::jsonb,
 '["Предоставя се писмен договор", "Устна уговорка", "Само фактура", "Условия в уебсайта"]'::jsonb,
 'Contract provision', 'Осигуряване на договор', 74),

('c1d2e3f4-0007-4000-8000-000000000012', '4aa24e30-4596-4d22-85e5-7558936163b3',
 'Verified Provider', 'Проверен доставчик', 'select', false, true,
 '["Verified", "Pending Verification", "Not Verified"]'::jsonb,
 '["Проверен", "В процес на проверка", "Непроверен"]'::jsonb,
 'Verification status', 'Статус на проверка', 75);;
