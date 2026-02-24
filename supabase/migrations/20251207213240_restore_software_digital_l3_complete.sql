-- Restore Software & Digital L3 categories

-- Productivity Software L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Office Suites', 'software-office', 'Офис пакети', 1),
  ('Note Taking', 'software-notes', 'Бележки', 2),
  ('Project Management', 'software-project', 'Управление на проекти', 3),
  ('Calendar Apps', 'software-calendar', 'Календари', 4),
  ('Email Clients', 'software-email', 'Имейл клиенти', 5),
  ('Time Tracking', 'software-time', 'Проследяване на време', 6),
  ('Document Scanning', 'software-scanning', 'Сканиране на документи', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-productivity'
ON CONFLICT (slug) DO NOTHING;

-- Design Software L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Photo Editing', 'software-photo', 'Редактиране на снимки', 1),
  ('Video Editing', 'software-video', 'Видео редактиране', 2),
  ('Graphic Design', 'software-graphic', 'Графичен дизайн', 3),
  ('3D Modeling', 'software-3d', '3D моделиране', 4),
  ('Animation', 'software-animation', 'Анимация', 5),
  ('UI/UX Design', 'software-uiux', 'UI/UX дизайн', 6),
  ('CAD Software', 'software-cad', 'CAD софтуер', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-design'
ON CONFLICT (slug) DO NOTHING;

-- Development Software L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('IDEs', 'software-ide', 'Среди за разработка', 1),
  ('Code Editors', 'software-editors', 'Редактори за код', 2),
  ('Version Control', 'software-version', 'Контрол на версиите', 3),
  ('Database Tools', 'software-database', 'Инструменти за бази данни', 4),
  ('API Tools', 'software-api', 'API инструменти', 5),
  ('Testing Tools', 'software-testing', 'Инструменти за тестване', 6),
  ('DevOps Tools', 'software-devops', 'DevOps инструменти', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-development'
ON CONFLICT (slug) DO NOTHING;

-- Security Software L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Antivirus', 'software-antivirus', 'Антивирусни', 1),
  ('VPN Services', 'software-vpn', 'VPN услуги', 2),
  ('Password Managers', 'software-passwords', 'Мениджъри на пароли', 3),
  ('Firewall', 'software-firewall', 'Защитни стени', 4),
  ('Encryption Tools', 'software-encryption', 'Криптиращи инструменти', 5),
  ('Backup Software', 'software-backup', 'Софтуер за бекъп', 6),
  ('Parental Control', 'software-parental', 'Родителски контрол', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-security'
ON CONFLICT (slug) DO NOTHING;

-- Operating Systems L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Windows', 'os-windows', 'Windows', 1),
  ('macOS', 'os-macos', 'macOS', 2),
  ('Linux', 'os-linux', 'Linux', 3),
  ('Chrome OS', 'os-chrome', 'Chrome OS', 4),
  ('Server OS', 'os-server', 'Сървърни ОС', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-os'
ON CONFLICT (slug) DO NOTHING;

-- Digital Media L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Stock Photos', 'digital-stock-photos', 'Стокови снимки', 1),
  ('Stock Videos', 'digital-stock-videos', 'Стокови видеа', 2),
  ('Stock Music', 'digital-stock-music', 'Стокова музика', 3),
  ('Sound Effects', 'digital-sound-fx', 'Звукови ефекти', 4),
  ('Fonts', 'digital-fonts', 'Шрифтове', 5),
  ('Icons & Graphics', 'digital-icons', 'Икони и графики', 6),
  ('Templates', 'digital-templates', 'Шаблони', 7),
  ('3D Assets', 'digital-3d-assets', '3D активи', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-media'
ON CONFLICT (slug) DO NOTHING;

-- Digital Games L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('PC Games', 'digital-pc-games', 'PC игри', 1),
  ('Console Games', 'digital-console-games', 'Конзолни игри', 2),
  ('Mobile Games', 'digital-mobile-games', 'Мобилни игри', 3),
  ('VR Games', 'digital-vr-games', 'VR игри', 4),
  ('Game DLC', 'digital-dlc', 'Допълнения за игри', 5),
  ('In-Game Currency', 'digital-currency', 'Игрова валута', 6),
  ('Gift Cards', 'digital-gift-cards', 'Карти за подаръци', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-games'
ON CONFLICT (slug) DO NOTHING;

-- E-Books & Documents L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Fiction E-Books', 'ebooks-fiction', 'Художествена литература', 1),
  ('Non-Fiction E-Books', 'ebooks-nonfiction', 'Научна литература', 2),
  ('Textbooks', 'ebooks-textbooks', 'Учебници', 3),
  ('Research Papers', 'ebooks-research', 'Научни статии', 4),
  ('Magazines', 'ebooks-magazines', 'Списания', 5),
  ('Comics & Manga', 'ebooks-comics', 'Комикси и манга', 6),
  ('Audiobooks', 'ebooks-audiobooks', 'Аудио книги', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-ebooks'
ON CONFLICT (slug) DO NOTHING;

-- Online Courses L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Programming Courses', 'courses-programming', 'Курсове по програмиране', 1),
  ('Business Courses', 'courses-business', 'Бизнес курсове', 2),
  ('Design Courses', 'courses-design', 'Курсове по дизайн', 3),
  ('Marketing Courses', 'courses-marketing', 'Маркетинг курсове', 4),
  ('Language Courses', 'courses-language', 'Езикови курсове', 5),
  ('Personal Development', 'courses-personal', 'Личностно развитие', 6),
  ('Certification Prep', 'courses-certification', 'Подготовка за сертификати', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'software-courses'
ON CONFLICT (slug) DO NOTHING;;
