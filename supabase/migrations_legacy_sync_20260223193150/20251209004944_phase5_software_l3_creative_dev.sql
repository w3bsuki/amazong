
-- Phase 5: Software - Creative & Development Tools L3s

-- Check for creative software L2s and add L3s
-- Creative > Photo Editing L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['RAW Processing', 'Portrait Retouching', 'Batch Processing', 'Photo Effects', 'HDR Software', 'Photo Organizing']),
  unnest(ARRAY['photo-raw', 'photo-portrait', 'photo-batch', 'photo-effects', 'photo-hdr', 'photo-organize']),
  (SELECT id FROM categories WHERE slug = 'photo-editing'),
  unnest(ARRAY['RAW обработка', 'Ретуширане на портрети', 'Пакетна обработка', 'Фото ефекти', 'HDR софтуер', 'Организиране на снимки']),
  '📷',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Creative > Video Editing L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Professional Video Editing', 'Consumer Video Editing', 'Screen Recording', 'Video Converters', 'Video Effects & Plugins', 'Color Grading']),
  unnest(ARRAY['video-pro', 'video-consumer', 'video-screen', 'video-convert', 'video-effects', 'video-color']),
  (SELECT id FROM categories WHERE slug = 'video-editing'),
  unnest(ARRAY['Професионален видео монтаж', 'Потребителски видео монтаж', 'Запис на екран', 'Видео конвертори', 'Видео ефекти и плъгини', 'Цветова корекция']),
  '🎬',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Creative > Audio Production L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['DAW Software', 'VST Plugins', 'Audio Mixing', 'Mastering Software', 'Podcast Software', 'Sample Libraries']),
  unnest(ARRAY['audio-daw', 'audio-vst', 'audio-mixing', 'audio-mastering', 'audio-podcast', 'audio-samples']),
  (SELECT id FROM categories WHERE slug = 'audio-production'),
  unnest(ARRAY['DAW софтуер', 'VST плъгини', 'Миксиране на аудио', 'Софтуер за мастъринг', 'Софтуер за подкасти', 'Библиотеки с проби']),
  '🎵',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Creative > 3D & Animation L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['3D Modeling', '3D Animation', 'Rendering Software', 'Game Engines', 'VFX Software', '3D Assets & Models']),
  unnest(ARRAY['3d-modeling', '3d-animation', '3d-rendering', '3d-game-engine', '3d-vfx', '3d-assets']),
  (SELECT id FROM categories WHERE slug = '3d-animation'),
  unnest(ARRAY['3D моделиране', '3D анимация', 'Софтуер за рендиране', 'Игрови двигатели', 'VFX софтуер', '3D активи и модели']),
  '🎮',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Development > IDEs L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Visual Studio', 'JetBrains IDEs', 'VS Code Extensions', 'Eclipse Plugins', 'Xcode Tools', 'Android Studio']),
  unnest(ARRAY['ide-vstudio', 'ide-jetbrains', 'ide-vscode', 'ide-eclipse', 'ide-xcode', 'ide-android']),
  (SELECT id FROM categories WHERE slug = 'dev-ides'),
  unnest(ARRAY['Visual Studio', 'JetBrains IDEs', 'VS Code разширения', 'Eclipse плъгини', 'Xcode инструменти', 'Android Studio']),
  '💻',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Development > Database Tools L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['SQL Clients', 'NoSQL Tools', 'Database Design', 'Migration Tools', 'Backup & Recovery', 'Performance Tuning']),
  unnest(ARRAY['db-sql-clients', 'db-nosql', 'db-design', 'db-migration', 'db-backup', 'db-performance']),
  (SELECT id FROM categories WHERE slug = 'dev-databases'),
  unnest(ARRAY['SQL клиенти', 'NoSQL инструменти', 'Дизайн на бази данни', 'Инструменти за миграция', 'Резервиране и възстановяване', 'Оптимизация на производителност']),
  '🗄️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Development > Version Control L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Git Clients', 'Git Hosting', 'Code Review Tools', 'CI/CD Tools', 'Merge Tools', 'Git Extensions']),
  unnest(ARRAY['vc-git-clients', 'vc-git-hosting', 'vc-code-review', 'vc-cicd', 'vc-merge', 'vc-git-ext']),
  (SELECT id FROM categories WHERE slug = 'dev-version-control'),
  unnest(ARRAY['Git клиенти', 'Git хостинг', 'Инструменти за код ревю', 'CI/CD инструменти', 'Инструменти за сливане', 'Git разширения']),
  '🔀',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Security > Antivirus L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Home Antivirus', 'Business Antivirus', 'Internet Security Suites', 'Mobile Security', 'Ransomware Protection', 'Real-time Protection']),
  unnest(ARRAY['av-home', 'av-business', 'av-suite', 'av-mobile', 'av-ransomware', 'av-realtime']),
  (SELECT id FROM categories WHERE slug = 'antivirus'),
  unnest(ARRAY['Антивирус за дома', 'Бизнес антивирус', 'Пакети за интернет сигурност', 'Мобилна сигурност', 'Защита от рансъмуер', 'Защита в реално време']),
  '🛡️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Security > VPN L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Personal VPN', 'Business VPN', 'Router VPN', 'VPN Protocols', 'No-Log VPN', 'Streaming VPN']),
  unnest(ARRAY['vpn-personal', 'vpn-business', 'vpn-router', 'vpn-protocols', 'vpn-nolog', 'vpn-streaming']),
  (SELECT id FROM categories WHERE slug = 'vpn-software'),
  unnest(ARRAY['Личен VPN', 'Бизнес VPN', 'Рутер VPN', 'VPN протоколи', 'VPN без логове', 'VPN за стрийминг']),
  '🔐',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
