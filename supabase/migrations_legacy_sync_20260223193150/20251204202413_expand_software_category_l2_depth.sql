-- =====================================================
-- SOFTWARE CATEGORY EXPANSION - Phase 2: L2 Categories
-- Target: 250-400 categories, following Steam/G2A/Microsoft Store patterns
-- =====================================================

-- Store L1 IDs for reference
DO $$
DECLARE
  v_software_id UUID := '659a9e6a-4034-403c-bc58-6185d1ee991d';
  v_os_id UUID := '325882ff-9c0d-4b8d-a19d-61b4d5d20fdd';
  v_office_id UUID := 'f7aaa385-2a0f-40d7-aff6-5ce2c532e2c4';
  v_security_id UUID := '44eb0610-6eb2-481f-9556-5b0f9d7f8506';
  v_creative_id UUID := '2103af6f-8f10-4b69-9f5f-b872d5ba8ace';
  v_games_id UUID := '182ae6f5-6b61-4a59-b36c-c6b5515b4153';
  v_webdev_id UUID := '2966b78c-d860-4345-86e2-1329c1e8d0ae';
  
  -- New L1 IDs
  v_utilities_id UUID;
  v_business_id UUID;
  v_education_id UUID;
  v_ai_ml_id UUID;
  v_mobile_id UUID;
  v_cloud_id UUID;
  v_multimedia_id UUID;
  v_scientific_id UUID;
  v_communication_id UUID;
BEGIN

-- =====================================================
-- ADD MISSING L1 CATEGORIES
-- =====================================================

-- L1: Utilities & System Tools
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Utilities & System Tools', 'Помощни програми и системни инструменти', 'utilities-system', '🔧', v_software_id, 7,
  'System optimization, backup, disk management and maintenance tools',
  'Оптимизация на системата, архивиране, управление на дискове и инструменти за поддръжка')
RETURNING id INTO v_utilities_id;

-- L1: Business Software
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Business Software', 'Бизнес софтуер', 'business-software', '💼', v_software_id, 8,
  'ERP, CRM, accounting, invoicing and enterprise management solutions',
  'ERP, CRM, счетоводство, фактуриране и корпоративни решения')
RETURNING id INTO v_business_id;

-- L1: Educational Software
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Educational Software', 'Образователен софтуер', 'educational-software', '📚', v_software_id, 9,
  'E-learning platforms, language learning, coding courses and educational tools',
  'Платформи за обучение, езици, курсове по програмиране и образователни инструменти')
RETURNING id INTO v_education_id;

-- L1: AI & Machine Learning
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'AI & Machine Learning', 'ИИ и машинно обучение', 'ai-machine-learning', '🤖', v_software_id, 10,
  'AI assistants, ML platforms, data science tools, automation and AI-generated content tools',
  'AI асистенти, ML платформи, инструменти за наука за данни, автоматизация и AI-генерирано съдържание')
RETURNING id INTO v_ai_ml_id;

-- L1: Mobile Apps
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Mobile Apps', 'Мобилни приложения', 'mobile-apps', '📱', v_software_id, 11,
  'Android apps, iOS apps, cross-platform mobile applications and subscriptions',
  'Android приложения, iOS приложения, кросплатформени мобилни приложения и абонаменти')
RETURNING id INTO v_mobile_id;

-- L1: Cloud Services & SaaS
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Cloud Services & SaaS', 'Облачни услуги и SaaS', 'cloud-saas', '☁️', v_software_id, 12,
  'Cloud storage, web hosting, domain services, cloud computing platforms',
  'Облачно съхранение, уеб хостинг, домейн услуги, платформи за облачни изчисления')
RETURNING id INTO v_cloud_id;

-- L1: Multimedia Software
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Multimedia Software', 'Мултимедиен софтуер', 'multimedia-software', '🎬', v_software_id, 13,
  'Media players, codecs, screen recorders, streaming and DVD/Blu-ray software',
  'Медийни плейъри, кодеци, запис на екран, стрийминг и DVD/Blu-ray софтуер')
RETURNING id INTO v_multimedia_id;

-- L1: Scientific & Engineering
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Scientific & Engineering', 'Научен и инженерен софтуер', 'scientific-engineering', '🔬', v_software_id, 14,
  'MATLAB, CAE, simulation, GIS, statistical analysis and laboratory software',
  'MATLAB, CAE, симулации, ГИС, статистически анализ и лабораторен софтуер')
RETURNING id INTO v_scientific_id;

-- L1: Communication & Collaboration
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, display_order, description, description_bg)
VALUES (gen_random_uuid(), 'Communication & Collaboration', 'Комуникация и сътрудничество', 'communication-collab', '💬', v_software_id, 15,
  'Video conferencing, team chat, email clients, remote desktop and screen sharing tools',
  'Видеоконференции, екипен чат, имейл клиенти, отдалечен достъп и споделяне на екран')
RETURNING id INTO v_communication_id;

-- =====================================================
-- L2 CATEGORIES - OPERATING SYSTEMS
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Windows', 'Windows', 'os-windows', '🪟', v_os_id, 1),
('macOS', 'macOS', 'os-macos', '🍎', v_os_id, 2),
('Linux Distributions', 'Linux дистрибуции', 'os-linux', '🐧', v_os_id, 3),
('Server Operating Systems', 'Сървърни операционни системи', 'os-server', '🖥️', v_os_id, 4),
('Mobile OS', 'Мобилни ОС', 'os-mobile', '📱', v_os_id, 5),
('Chrome OS', 'Chrome OS', 'os-chromeos', '🌐', v_os_id, 6),
('Legacy & Retro OS', 'Стари и ретро ОС', 'os-legacy', '💾', v_os_id, 7);

-- =====================================================
-- L2 CATEGORIES - OFFICE & PRODUCTIVITY
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Office Suites', 'Офис пакети', 'office-suites', '📦', v_office_id, 1),
('Word Processors', 'Текстообработка', 'office-word', '📝', v_office_id, 2),
('Spreadsheet Software', 'Електронни таблици', 'office-spreadsheet', '📊', v_office_id, 3),
('Presentation Software', 'Презентационен софтуер', 'office-presentation', '📽️', v_office_id, 4),
('Note-Taking Apps', 'Приложения за бележки', 'office-notes', '📒', v_office_id, 5),
('PDF Tools', 'PDF инструменти', 'office-pdf', '📄', v_office_id, 6),
('Email Clients', 'Имейл клиенти', 'office-email', '📧', v_office_id, 7),
('Calendar & Scheduling', 'Календар и планиране', 'office-calendar', '📅', v_office_id, 8),
('Project Management', 'Управление на проекти', 'office-project', '📋', v_office_id, 9),
('Mind Mapping', 'Мисловни карти', 'office-mindmap', '🧠', v_office_id, 10);

-- =====================================================
-- L2 CATEGORIES - SECURITY SOFTWARE
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Antivirus Software', 'Антивирусен софтуер', 'security-antivirus', '🛡️', v_security_id, 1),
('Internet Security Suites', 'Интернет защита', 'security-internet', '🌐', v_security_id, 2),
('VPN Services', 'VPN услуги', 'security-vpn', '🔐', v_security_id, 3),
('Password Managers', 'Мениджъри на пароли', 'security-passwords', '🔑', v_security_id, 4),
('Encryption Software', 'Софтуер за криптиране', 'security-encryption', '🔒', v_security_id, 5),
('Firewall Software', 'Защитни стени', 'security-firewall', '🧱', v_security_id, 6),
('Parental Controls', 'Родителски контрол', 'security-parental', '👨‍👩‍👧', v_security_id, 7),
('Anti-Malware Tools', 'Анти-малуер инструменти', 'security-malware', '🦠', v_security_id, 8),
('Privacy Protection', 'Защита на поверителността', 'security-privacy', '👁️', v_security_id, 9),
('Identity Protection', 'Защита на самоличността', 'security-identity', '🆔', v_security_id, 10);

-- =====================================================
-- L2 CATEGORIES - CREATIVE SOFTWARE
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Photo Editing', 'Редактиране на снимки', 'creative-photo', '📸', v_creative_id, 1),
('Video Editing', 'Видео редактиране', 'creative-video', '🎬', v_creative_id, 2),
('Graphic Design', 'Графичен дизайн', 'creative-graphic', '🎨', v_creative_id, 3),
('3D Modeling & Animation', '3D моделиране и анимация', 'creative-3d', '🧊', v_creative_id, 4),
('CAD Software', 'CAD софтуер', 'creative-cad', '📐', v_creative_id, 5),
('Audio Production', 'Аудио продукция', 'creative-audio', '🎵', v_creative_id, 6),
('Digital Drawing', 'Дигитално рисуване', 'creative-drawing', '✏️', v_creative_id, 7),
('UI/UX Design', 'UI/UX дизайн', 'creative-uiux', '🖼️', v_creative_id, 8),
('Motion Graphics', 'Анимирана графика', 'creative-motion', '🎞️', v_creative_id, 9),
('Typography & Fonts', 'Типография и шрифтове', 'creative-fonts', '🔤', v_creative_id, 10),
('AI Creative Tools', 'AI творчески инструменти', 'creative-ai', '🤖', v_creative_id, 11);

-- =====================================================
-- L2 CATEGORIES - GAMES & ENTERTAINMENT
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Action Games', 'Екшън игри', 'games-action', '🔫', v_games_id, 1),
('RPG Games', 'RPG игри', 'games-rpg', '⚔️', v_games_id, 2),
('Strategy Games', 'Стратегически игри', 'games-strategy', '♟️', v_games_id, 3),
('Simulation Games', 'Симулатори', 'games-simulation', '🚜', v_games_id, 4),
('Sports & Racing', 'Спортни и състезателни', 'games-sports', '🏎️', v_games_id, 5),
('Adventure Games', 'Приключенски игри', 'games-adventure', '🗺️', v_games_id, 6),
('Puzzle Games', 'Пъзел игри', 'games-puzzle', '🧩', v_games_id, 7),
('Indie Games', 'Инди игри', 'games-indie', '🎮', v_games_id, 8),
('VR Games', 'VR игри', 'games-vr', '🥽', v_games_id, 9),
('MMO Games', 'MMO игри', 'games-mmo', '🌍', v_games_id, 10),
('Horror Games', 'Хорър игри', 'games-horror', '👻', v_games_id, 11),
('Game Subscriptions', 'Игрови абонаменти', 'games-subscriptions', '💳', v_games_id, 12),
('Gaming Utilities', 'Игрови помощни програми', 'games-utilities', '🛠️', v_games_id, 13),
('Emulators', 'Емулатори', 'games-emulators', '🕹️', v_games_id, 14),
('Game Streaming', 'Игрови стрийминг', 'games-streaming', '📺', v_games_id, 15);

-- =====================================================
-- L2 CATEGORIES - WEB & DEVELOPMENT
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('IDEs & Code Editors', 'IDE и редактори на код', 'dev-ide', '💻', v_webdev_id, 1),
('Version Control', 'Контрол на версиите', 'dev-vcs', '📊', v_webdev_id, 2),
('Database Tools', 'Инструменти за бази данни', 'dev-database', '🗄️', v_webdev_id, 3),
('API Development', 'API разработка', 'dev-api', '🔌', v_webdev_id, 4),
('Testing & QA', 'Тестване и QA', 'dev-testing', '🧪', v_webdev_id, 5),
('Web Frameworks', 'Уеб фреймуърки', 'dev-frameworks', '🌐', v_webdev_id, 6),
('DevOps Tools', 'DevOps инструменти', 'dev-devops', '⚙️', v_webdev_id, 7),
('Documentation Tools', 'Инструменти за документация', 'dev-docs', '📖', v_webdev_id, 8),
('CMS Platforms', 'CMS платформи', 'dev-cms', '📝', v_webdev_id, 9),
('E-commerce Platforms', 'Платформи за е-търговия', 'dev-ecommerce', '🛒', v_webdev_id, 10),
('Website Builders', 'Създатели на уебсайтове', 'dev-builders', '🏗️', v_webdev_id, 11),
('SEO & Analytics', 'SEO и анализи', 'dev-seo', '📈', v_webdev_id, 12);

-- =====================================================
-- L2 CATEGORIES - UTILITIES & SYSTEM TOOLS
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Backup & Recovery', 'Архивиране и възстановяване', 'util-backup', '💾', v_utilities_id, 1),
('Disk Management', 'Управление на дискове', 'util-disk', '💿', v_utilities_id, 2),
('System Optimization', 'Оптимизация на системата', 'util-optimize', '🚀', v_utilities_id, 3),
('File Recovery', 'Възстановяване на файлове', 'util-recovery', '🔄', v_utilities_id, 4),
('Driver Management', 'Управление на драйвери', 'util-drivers', '🔧', v_utilities_id, 5),
('Uninstallers', 'Деинсталатори', 'util-uninstall', '🗑️', v_utilities_id, 6),
('File Managers', 'Файлови мениджъри', 'util-files', '📁', v_utilities_id, 7),
('Compression Tools', 'Инструменти за компресия', 'util-compress', '📦', v_utilities_id, 8),
('System Monitoring', 'Системен мониторинг', 'util-monitor', '📊', v_utilities_id, 9),
('Clipboard Managers', 'Мениджъри на клипборда', 'util-clipboard', '📋', v_utilities_id, 10),
('Remote Access', 'Отдалечен достъп', 'util-remote', '🌐', v_utilities_id, 11),
('Automation Tools', 'Инструменти за автоматизация', 'util-automation', '⚡', v_utilities_id, 12);

-- =====================================================
-- L2 CATEGORIES - BUSINESS SOFTWARE
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Accounting Software', 'Счетоводен софтуер', 'biz-accounting', '🧮', v_business_id, 1),
('CRM Software', 'CRM софтуер', 'biz-crm', '👥', v_business_id, 2),
('ERP Systems', 'ERP системи', 'biz-erp', '🏢', v_business_id, 3),
('Invoicing & Billing', 'Фактуриране и плащания', 'biz-invoicing', '🧾', v_business_id, 4),
('HR Management', 'Управление на персонала', 'biz-hr', '👔', v_business_id, 5),
('Inventory Management', 'Управление на инвентар', 'biz-inventory', '📦', v_business_id, 6),
('Point of Sale (POS)', 'Системи за продажби (POS)', 'biz-pos', '💰', v_business_id, 7),
('Legal & Compliance', 'Правен софтуер', 'biz-legal', '⚖️', v_business_id, 8),
('Business Intelligence', 'Бизнес интелигентност', 'biz-bi', '📊', v_business_id, 9),
('Time Tracking', 'Проследяване на време', 'biz-time', '⏱️', v_business_id, 10);

-- =====================================================
-- L2 CATEGORIES - EDUCATIONAL SOFTWARE
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('E-Learning Platforms', 'Платформи за обучение', 'edu-elearning', '🎓', v_education_id, 1),
('Language Learning', 'Изучаване на езици', 'edu-language', '🗣️', v_education_id, 2),
('Coding & Programming', 'Програмиране', 'edu-coding', '💻', v_education_id, 3),
('Math & Science', 'Математика и наука', 'edu-math', '🔢', v_education_id, 4),
('Kids Education', 'Детско образование', 'edu-kids', '👶', v_education_id, 5),
('Exam Preparation', 'Подготовка за изпити', 'edu-exams', '📝', v_education_id, 6),
('Typing & Skills', 'Машинопис и умения', 'edu-typing', '⌨️', v_education_id, 7),
('Music & Art Education', 'Музикално и художествено образование', 'edu-music', '🎼', v_education_id, 8),
('Reference & Encyclopedia', 'Справочници и енциклопедии', 'edu-reference', '📚', v_education_id, 9),
('Professional Training', 'Професионално обучение', 'edu-professional', '🏆', v_education_id, 10);

-- =====================================================
-- L2 CATEGORIES - AI & MACHINE LEARNING (KEY CATEGORY!)
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('AI Assistants & Chatbots', 'AI асистенти и чатботове', 'ai-assistants', '🤖', v_ai_ml_id, 1),
('AI Image Generation', 'AI генериране на изображения', 'ai-image-gen', '🖼️', v_ai_ml_id, 2),
('AI Video & Animation', 'AI видео и анимация', 'ai-video', '🎬', v_ai_ml_id, 3),
('AI Audio & Music', 'AI аудио и музика', 'ai-audio', '🎵', v_ai_ml_id, 4),
('AI Writing & Content', 'AI писане и съдържание', 'ai-writing', '✍️', v_ai_ml_id, 5),
('AI Code Generation', 'AI генериране на код', 'ai-code', '💻', v_ai_ml_id, 6),
('ML Platforms & Frameworks', 'ML платформи и фреймуърки', 'ai-ml-platforms', '🧠', v_ai_ml_id, 7),
('Data Science Tools', 'Инструменти за наука за данни', 'ai-data-science', '📊', v_ai_ml_id, 8),
('Automation & RPA', 'Автоматизация и RPA', 'ai-automation', '⚡', v_ai_ml_id, 9),
('AI Development SDKs', 'AI разработка и SDK', 'ai-sdks', '🔧', v_ai_ml_id, 10),
('AI-Generated Content Marketplace', 'Пазар за AI-генерирано съдържание', 'ai-marketplace', '🛒', v_ai_ml_id, 11),
('AI Training & Datasets', 'AI обучение и данни', 'ai-datasets', '📁', v_ai_ml_id, 12);

-- =====================================================
-- L2 CATEGORIES - MOBILE APPS
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Android Apps', 'Android приложения', 'mobile-android', '🤖', v_mobile_id, 1),
('iOS Apps', 'iOS приложения', 'mobile-ios', '🍎', v_mobile_id, 2),
('Cross-Platform Apps', 'Кросплатформени приложения', 'mobile-cross', '📲', v_mobile_id, 3),
('App Subscriptions', 'Абонаменти за приложения', 'mobile-subs', '💳', v_mobile_id, 4),
('Mobile Productivity', 'Мобилна продуктивност', 'mobile-productivity', '📊', v_mobile_id, 5),
('Mobile Games', 'Мобилни игри', 'mobile-games', '🎮', v_mobile_id, 6),
('Social & Communication', 'Социални и комуникационни', 'mobile-social', '💬', v_mobile_id, 7),
('Health & Fitness Apps', 'Приложения за здраве и фитнес', 'mobile-health', '💪', v_mobile_id, 8);

-- =====================================================
-- L2 CATEGORIES - CLOUD SERVICES & SAAS
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Cloud Storage', 'Облачно съхранение', 'cloud-storage', '💾', v_cloud_id, 1),
('Web Hosting', 'Уеб хостинг', 'cloud-hosting', '🌐', v_cloud_id, 2),
('Email Hosting', 'Имейл хостинг', 'cloud-email', '📧', v_cloud_id, 3),
('Domain Services', 'Домейн услуги', 'cloud-domains', '🔗', v_cloud_id, 4),
('Cloud Computing', 'Облачни изчисления', 'cloud-computing', '☁️', v_cloud_id, 5),
('CDN Services', 'CDN услуги', 'cloud-cdn', '🚀', v_cloud_id, 6),
('SaaS Subscriptions', 'SaaS абонаменти', 'cloud-saas-subs', '💳', v_cloud_id, 7),
('Database Hosting', 'Хостинг на бази данни', 'cloud-database', '🗄️', v_cloud_id, 8);

-- =====================================================
-- L2 CATEGORIES - MULTIMEDIA SOFTWARE
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Media Players', 'Медийни плейъри', 'media-players', '▶️', v_multimedia_id, 1),
('Video Converters', 'Видео конвертори', 'media-converters', '🔄', v_multimedia_id, 2),
('Screen Recorders', 'Запис на екран', 'media-screen-rec', '📹', v_multimedia_id, 3),
('DVD & Blu-ray Software', 'DVD и Blu-ray софтуер', 'media-dvd', '📀', v_multimedia_id, 4),
('Codecs & Plugins', 'Кодеци и плъгини', 'media-codecs', '🔌', v_multimedia_id, 5),
('Streaming Software', 'Стрийминг софтуер', 'media-streaming', '📺', v_multimedia_id, 6),
('Audio Players', 'Аудио плейъри', 'media-audio', '🎧', v_multimedia_id, 7),
('Photo Viewers', 'Преглед на снимки', 'media-photo', '🖼️', v_multimedia_id, 8);

-- =====================================================
-- L2 CATEGORIES - SCIENTIFIC & ENGINEERING
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('MATLAB & Alternatives', 'MATLAB и алтернативи', 'sci-matlab', '📐', v_scientific_id, 1),
('CAE & Simulation', 'CAE и симулации', 'sci-cae', '🔧', v_scientific_id, 2),
('GIS & Mapping', 'ГИС и картография', 'sci-gis', '🗺️', v_scientific_id, 3),
('Statistical Analysis', 'Статистически анализ', 'sci-statistics', '📊', v_scientific_id, 4),
('Laboratory Software', 'Лабораторен софтуер', 'sci-lab', '🔬', v_scientific_id, 5),
('Electronic Design', 'Електронен дизайн', 'sci-electronics', '⚡', v_scientific_id, 6),
('Chemical Software', 'Химичен софтуер', 'sci-chemistry', '🧪', v_scientific_id, 7),
('Bioinformatics', 'Биоинформатика', 'sci-bio', '🧬', v_scientific_id, 8);

-- =====================================================
-- L2 CATEGORIES - COMMUNICATION & COLLABORATION
-- =====================================================

INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Video Conferencing', 'Видеоконференции', 'comm-video', '📹', v_communication_id, 1),
('Team Chat', 'Екипен чат', 'comm-chat', '💬', v_communication_id, 2),
('Email Management', 'Управление на имейли', 'comm-email', '📧', v_communication_id, 3),
('Remote Desktop', 'Отдалечен работен плот', 'comm-remote', '🖥️', v_communication_id, 4),
('Screen Sharing', 'Споделяне на екран', 'comm-screen', '📺', v_communication_id, 5),
('VoIP & Calling', 'VoIP и обаждания', 'comm-voip', '📞', v_communication_id, 6),
('Webinar Platforms', 'Уебинар платформи', 'comm-webinar', '🎤', v_communication_id, 7),
('File Sharing', 'Споделяне на файлове', 'comm-files', '📤', v_communication_id, 8);

END $$;;
