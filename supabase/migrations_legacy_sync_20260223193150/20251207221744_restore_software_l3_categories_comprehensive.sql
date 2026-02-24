
-- Restore missing Software L3 categories (documented: 611, current: 169, missing: ~442)

DO $$
DECLARE
  software_id UUID;
  -- L1 categories
  os_id UUID;
  productivity_id UUID;
  security_id UUID;
  dev_tools_id UUID;
  multimedia_id UUID;
  business_id UUID;
  education_id UUID;
  games_id UUID;
  utilities_id UUID;
  cloud_id UUID;
  mobile_apps_id UUID;
  web_services_id UUID;
  ai_ml_id UUID;
  -- L2 categories
  windows_os_id UUID;
  mac_os_id UUID;
  linux_os_id UUID;
  office_suites_id UUID;
  antivirus_id UUID;
  vpn_id UUID;
  ide_id UUID;
  databases_id UUID;
  video_editing_id UUID;
  audio_editing_id UUID;
  graphic_design_id UUID;
  accounting_id UUID;
  crm_id UUID;
  erp_id UUID;
  elearning_id UUID;
  pc_games_id UUID;
  backup_id UUID;
  system_tools_id UUID;
BEGIN
  SELECT id INTO software_id FROM categories WHERE slug = 'software';
  
  -- Get L1 IDs
  SELECT id INTO os_id FROM categories WHERE slug = 'operating-systems' AND parent_id = software_id;
  SELECT id INTO productivity_id FROM categories WHERE slug = 'productivity-software' AND parent_id = software_id;
  SELECT id INTO security_id FROM categories WHERE slug = 'security-software' AND parent_id = software_id;
  SELECT id INTO dev_tools_id FROM categories WHERE slug = 'development-tools' AND parent_id = software_id;
  SELECT id INTO multimedia_id FROM categories WHERE slug = 'multimedia-software' AND parent_id = software_id;
  SELECT id INTO business_id FROM categories WHERE slug = 'business-software' AND parent_id = software_id;
  SELECT id INTO education_id FROM categories WHERE slug = 'educational-software' AND parent_id = software_id;
  SELECT id INTO games_id FROM categories WHERE slug = 'pc-games-software' AND parent_id = software_id;
  SELECT id INTO utilities_id FROM categories WHERE slug = 'utilities-tools' AND parent_id = software_id;
  SELECT id INTO cloud_id FROM categories WHERE slug = 'cloud-services' AND parent_id = software_id;
  SELECT id INTO mobile_apps_id FROM categories WHERE slug = 'mobile-apps' AND parent_id = software_id;
  SELECT id INTO web_services_id FROM categories WHERE slug = 'web-services' AND parent_id = software_id;
  SELECT id INTO ai_ml_id FROM categories WHERE slug = 'ai-ml-software' AND parent_id = software_id;

  -- Create missing L1s if they don't exist
  IF os_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Operating Systems', 'Операционни системи', 'operating-systems', software_id, '💻', 1)
    RETURNING id INTO os_id;
  END IF;

  IF productivity_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Productivity', 'Продуктивност', 'productivity-software', software_id, '📊', 2)
    RETURNING id INTO productivity_id;
  END IF;

  IF security_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Security Software', 'Софтуер за сигурност', 'security-software', software_id, '🔒', 3)
    RETURNING id INTO security_id;
  END IF;

  IF dev_tools_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Development Tools', 'Инструменти за разработка', 'development-tools', software_id, '🛠️', 4)
    RETURNING id INTO dev_tools_id;
  END IF;

  IF multimedia_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Multimedia', 'Мултимедия', 'multimedia-software', software_id, '🎬', 5)
    RETURNING id INTO multimedia_id;
  END IF;

  IF business_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Business Software', 'Бизнес софтуер', 'business-software', software_id, '💼', 6)
    RETURNING id INTO business_id;
  END IF;

  IF education_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Educational', 'Образователен', 'educational-software', software_id, '🎓', 7)
    RETURNING id INTO education_id;
  END IF;

  IF utilities_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Utilities & Tools', 'Помощни програми', 'utilities-tools', software_id, '🔧', 8)
    RETURNING id INTO utilities_id;
  END IF;

  IF cloud_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('Cloud Services', 'Облачни услуги', 'cloud-services', software_id, '☁️', 9)
    RETURNING id INTO cloud_id;
  END IF;

  IF ai_ml_id IS NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) 
    VALUES ('AI & ML', 'AI и машинно обучение', 'ai-ml-software', software_id, '🤖', 10)
    RETURNING id INTO ai_ml_id;
  END IF;

  -- Operating Systems L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Windows', 'Windows', 'windows-os', os_id, '🪟', 1),
  ('macOS', 'macOS', 'macos', os_id, '🍎', 2),
  ('Linux Distributions', 'Linux дистрибуции', 'linux-distros', os_id, '🐧', 3),
  ('Server OS', 'Сървърни ОС', 'server-os', os_id, '🖥️', 4),
  ('Mobile OS', 'Мобилни ОС', 'mobile-os', os_id, '📱', 5)
  ON CONFLICT (slug) DO NOTHING;

  -- Get the IDs we just created
  SELECT id INTO windows_os_id FROM categories WHERE slug = 'windows-os';
  SELECT id INTO mac_os_id FROM categories WHERE slug = 'macos';
  SELECT id INTO linux_os_id FROM categories WHERE slug = 'linux-distros';

  -- Windows L3
  IF windows_os_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Windows 11', 'Windows 11', 'windows-11', windows_os_id, '🪟', 1),
    ('Windows 10', 'Windows 10', 'windows-10', windows_os_id, '🪟', 2),
    ('Windows Server', 'Windows Server', 'windows-server', windows_os_id, '🖥️', 3),
    ('Windows Home', 'Windows Home', 'windows-home', windows_os_id, '🏠', 4),
    ('Windows Pro', 'Windows Pro', 'windows-pro', windows_os_id, '💼', 5),
    ('Windows Enterprise', 'Windows Enterprise', 'windows-enterprise', windows_os_id, '🏢', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Linux L3
  IF linux_os_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Ubuntu', 'Ubuntu', 'ubuntu-linux', linux_os_id, '🐧', 1),
    ('Fedora', 'Fedora', 'fedora-linux', linux_os_id, '🐧', 2),
    ('Debian', 'Debian', 'debian-linux', linux_os_id, '🐧', 3),
    ('Arch Linux', 'Arch Linux', 'arch-linux', linux_os_id, '🐧', 4),
    ('CentOS / Rocky', 'CentOS / Rocky', 'centos-rocky-linux', linux_os_id, '🐧', 5),
    ('Linux Mint', 'Linux Mint', 'linux-mint', linux_os_id, '🌿', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Productivity L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Office Suites', 'Офис пакети', 'office-suites', productivity_id, '📝', 1),
  ('Note Taking', 'Бележки', 'note-taking-software', productivity_id, '📓', 2),
  ('Project Management', 'Управление на проекти', 'project-management-software', productivity_id, '📋', 3),
  ('Calendar & Scheduling', 'Календар и планиране', 'calendar-scheduling', productivity_id, '📅', 4),
  ('Email Clients', 'Имейл клиенти', 'email-clients', productivity_id, '📧', 5),
  ('PDF Tools', 'PDF инструменти', 'pdf-tools', productivity_id, '📄', 6),
  ('Presentation Software', 'Презентации', 'presentation-software', productivity_id, '📊', 7),
  ('Spreadsheets', 'Електронни таблици', 'spreadsheet-software', productivity_id, '📈', 8)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO office_suites_id FROM categories WHERE slug = 'office-suites';

  -- Office Suites L3
  IF office_suites_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Microsoft 365', 'Microsoft 365', 'microsoft-365', office_suites_id, '📊', 1),
    ('Microsoft Office', 'Microsoft Office', 'microsoft-office', office_suites_id, '📝', 2),
    ('Google Workspace', 'Google Workspace', 'google-workspace', office_suites_id, '🔵', 3),
    ('LibreOffice', 'LibreOffice', 'libreoffice', office_suites_id, '📄', 4),
    ('Apple iWork', 'Apple iWork', 'apple-iwork', office_suites_id, '🍎', 5),
    ('WPS Office', 'WPS Office', 'wps-office', office_suites_id, '📝', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Security L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Antivirus', 'Антивирус', 'antivirus-software', security_id, '🛡️', 1),
  ('VPN Services', 'VPN услуги', 'vpn-services', security_id, '🔐', 2),
  ('Password Managers', 'Мениджъри на пароли', 'password-managers', security_id, '🔑', 3),
  ('Firewall', 'Защитна стена', 'firewall-software', security_id, '🧱', 4),
  ('Encryption', 'Криптиране', 'encryption-software', security_id, '🔒', 5),
  ('Internet Security Suites', 'Интернет сигурност', 'internet-security-suites', security_id, '🌐', 6),
  ('Parental Control', 'Родителски контрол', 'parental-control-software', security_id, '👨‍👩‍👧', 7)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO antivirus_id FROM categories WHERE slug = 'antivirus-software';
  SELECT id INTO vpn_id FROM categories WHERE slug = 'vpn-services';

  -- Antivirus L3
  IF antivirus_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Norton Antivirus', 'Norton Antivirus', 'norton-antivirus', antivirus_id, '🛡️', 1),
    ('Kaspersky', 'Kaspersky', 'kaspersky-antivirus', antivirus_id, '🛡️', 2),
    ('Bitdefender', 'Bitdefender', 'bitdefender-antivirus', antivirus_id, '🛡️', 3),
    ('McAfee', 'McAfee', 'mcafee-antivirus', antivirus_id, '🛡️', 4),
    ('ESET NOD32', 'ESET NOD32', 'eset-nod32', antivirus_id, '🛡️', 5),
    ('Avast', 'Avast', 'avast-antivirus', antivirus_id, '🛡️', 6),
    ('AVG', 'AVG', 'avg-antivirus', antivirus_id, '🛡️', 7),
    ('Malwarebytes', 'Malwarebytes', 'malwarebytes', antivirus_id, '🛡️', 8),
    ('Windows Defender', 'Windows Defender', 'windows-defender', antivirus_id, '🪟', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- VPN L3
  IF vpn_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('NordVPN', 'NordVPN', 'nordvpn', vpn_id, '🔐', 1),
    ('ExpressVPN', 'ExpressVPN', 'expressvpn', vpn_id, '🔐', 2),
    ('Surfshark', 'Surfshark', 'surfshark-vpn', vpn_id, '🦈', 3),
    ('CyberGhost', 'CyberGhost', 'cyberghost-vpn', vpn_id, '👻', 4),
    ('Private Internet Access', 'Private Internet Access', 'pia-vpn', vpn_id, '🔐', 5),
    ('ProtonVPN', 'ProtonVPN', 'protonvpn', vpn_id, '🔐', 6),
    ('Mullvad', 'Mullvad', 'mullvad-vpn', vpn_id, '🔐', 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Development Tools L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('IDEs & Code Editors', 'IDE и редактори', 'ides-code-editors', dev_tools_id, '💻', 1),
  ('Version Control', 'Контрол на версии', 'version-control', dev_tools_id, '📦', 2),
  ('Database Tools', 'Инструменти за БД', 'database-tools', dev_tools_id, '🗄️', 3),
  ('API Tools', 'API инструменти', 'api-tools', dev_tools_id, '🔌', 4),
  ('Testing & QA', 'Тестване и QA', 'testing-qa-tools', dev_tools_id, '🧪', 5),
  ('DevOps & CI/CD', 'DevOps и CI/CD', 'devops-cicd', dev_tools_id, '🔄', 6),
  ('SDK & Libraries', 'SDK и библиотеки', 'sdk-libraries', dev_tools_id, '📚', 7),
  ('Web Frameworks', 'Уеб фреймуърки', 'web-frameworks', dev_tools_id, '🌐', 8)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO ide_id FROM categories WHERE slug = 'ides-code-editors';
  SELECT id INTO databases_id FROM categories WHERE slug = 'database-tools';

  -- IDEs L3
  IF ide_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Visual Studio', 'Visual Studio', 'visual-studio', ide_id, '💜', 1),
    ('VS Code', 'VS Code', 'vs-code', ide_id, '💙', 2),
    ('JetBrains IDEs', 'JetBrains IDE', 'jetbrains-ides', ide_id, '🧠', 3),
    ('IntelliJ IDEA', 'IntelliJ IDEA', 'intellij-idea', ide_id, '🧠', 4),
    ('PyCharm', 'PyCharm', 'pycharm', ide_id, '🐍', 5),
    ('WebStorm', 'WebStorm', 'webstorm', ide_id, '🌐', 6),
    ('Eclipse', 'Eclipse', 'eclipse-ide', ide_id, '🌑', 7),
    ('Xcode', 'Xcode', 'xcode', ide_id, '🍎', 8),
    ('Android Studio', 'Android Studio', 'android-studio', ide_id, '🤖', 9),
    ('Sublime Text', 'Sublime Text', 'sublime-text', ide_id, '📝', 10),
    ('Atom', 'Atom', 'atom-editor', ide_id, '⚛️', 11),
    ('Vim / Neovim', 'Vim / Neovim', 'vim-neovim', ide_id, '🟢', 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Multimedia L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Video Editing', 'Видео редакция', 'video-editing-software', multimedia_id, '🎬', 1),
  ('Audio Editing', 'Аудио редакция', 'audio-editing-software', multimedia_id, '🎵', 2),
  ('Graphic Design', 'Графичен дизайн', 'graphic-design-software', multimedia_id, '🎨', 3),
  ('3D Modeling', '3D моделиране', '3d-modeling-software', multimedia_id, '🎭', 4),
  ('Animation', 'Анимация', 'animation-software', multimedia_id, '🎥', 5),
  ('Photo Editing', 'Фото редакция', 'photo-editing-software', multimedia_id, '📷', 6),
  ('Screen Recording', 'Запис на екран', 'screen-recording-software', multimedia_id, '🖥️', 7),
  ('Media Players', 'Медийни плейъри', 'media-players', multimedia_id, '▶️', 8),
  ('Streaming Software', 'Стрийминг софтуер', 'streaming-software', multimedia_id, '📡', 9)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO video_editing_id FROM categories WHERE slug = 'video-editing-software';
  SELECT id INTO audio_editing_id FROM categories WHERE slug = 'audio-editing-software';
  SELECT id INTO graphic_design_id FROM categories WHERE slug = 'graphic-design-software';

  -- Video Editing L3
  IF video_editing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Adobe Premiere Pro', 'Adobe Premiere Pro', 'adobe-premiere-pro', video_editing_id, '🎬', 1),
    ('DaVinci Resolve', 'DaVinci Resolve', 'davinci-resolve', video_editing_id, '🎬', 2),
    ('Final Cut Pro', 'Final Cut Pro', 'final-cut-pro', video_editing_id, '🍎', 3),
    ('Sony Vegas', 'Sony Vegas', 'sony-vegas', video_editing_id, '🎬', 4),
    ('Filmora', 'Filmora', 'filmora', video_editing_id, '🎬', 5),
    ('iMovie', 'iMovie', 'imovie', video_editing_id, '🍎', 6),
    ('After Effects', 'After Effects', 'after-effects', video_editing_id, '✨', 7),
    ('HitFilm', 'HitFilm', 'hitfilm', video_editing_id, '🎬', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Audio Editing L3
  IF audio_editing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Adobe Audition', 'Adobe Audition', 'adobe-audition', audio_editing_id, '🎵', 1),
    ('FL Studio', 'FL Studio', 'fl-studio', audio_editing_id, '🎹', 2),
    ('Ableton Live', 'Ableton Live', 'ableton-live', audio_editing_id, '🎹', 3),
    ('Logic Pro', 'Logic Pro', 'logic-pro', audio_editing_id, '🍎', 4),
    ('Pro Tools', 'Pro Tools', 'pro-tools', audio_editing_id, '🎚️', 5),
    ('Audacity', 'Audacity', 'audacity', audio_editing_id, '🎵', 6),
    ('GarageBand', 'GarageBand', 'garageband', audio_editing_id, '🎸', 7),
    ('Cubase', 'Cubase', 'cubase', audio_editing_id, '🎹', 8),
    ('Studio One', 'Studio One', 'studio-one', audio_editing_id, '🎵', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Graphic Design L3
  IF graphic_design_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Adobe Photoshop', 'Adobe Photoshop', 'adobe-photoshop', graphic_design_id, '🎨', 1),
    ('Adobe Illustrator', 'Adobe Illustrator', 'adobe-illustrator', graphic_design_id, '🎨', 2),
    ('Adobe InDesign', 'Adobe InDesign', 'adobe-indesign', graphic_design_id, '📐', 3),
    ('Canva', 'Canva', 'canva-software', graphic_design_id, '🖼️', 4),
    ('Figma', 'Figma', 'figma', graphic_design_id, '🎨', 5),
    ('Sketch', 'Sketch', 'sketch-app', graphic_design_id, '💎', 6),
    ('CorelDRAW', 'CorelDRAW', 'coreldraw', graphic_design_id, '🎨', 7),
    ('Affinity Designer', 'Affinity Designer', 'affinity-designer', graphic_design_id, '🎨', 8),
    ('Affinity Photo', 'Affinity Photo', 'affinity-photo', graphic_design_id, '📷', 9),
    ('GIMP', 'GIMP', 'gimp', graphic_design_id, '🖌️', 10),
    ('Lightroom', 'Lightroom', 'adobe-lightroom', graphic_design_id, '📷', 11)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Business Software L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Accounting', 'Счетоводство', 'accounting-software', business_id, '💰', 1),
  ('CRM', 'CRM', 'crm-software', business_id, '👥', 2),
  ('ERP', 'ERP', 'erp-software', business_id, '🏭', 3),
  ('HR Management', 'Управление на HR', 'hr-management-software', business_id, '👔', 4),
  ('Inventory Management', 'Управление на склад', 'inventory-management', business_id, '📦', 5),
  ('Point of Sale', 'POS системи', 'pos-software', business_id, '🏪', 6),
  ('E-commerce Platforms', 'E-commerce платформи', 'ecommerce-platforms', business_id, '🛒', 7),
  ('Legal & Compliance', 'Правен софтуер', 'legal-compliance-software', business_id, '⚖️', 8)
  ON CONFLICT (slug) DO NOTHING;

  -- Cloud Services L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Cloud Storage', 'Облачно съхранение', 'cloud-storage', cloud_id, '☁️', 1),
  ('Cloud Computing', 'Облачни изчисления', 'cloud-computing', cloud_id, '🖥️', 2),
  ('SaaS Subscriptions', 'SaaS абонаменти', 'saas-subscriptions', cloud_id, '📱', 3),
  ('Web Hosting', 'Уеб хостинг', 'web-hosting', cloud_id, '🌐', 4),
  ('Domain Services', 'Домейн услуги', 'domain-services', cloud_id, '🔗', 5),
  ('Email Hosting', 'Имейл хостинг', 'email-hosting', cloud_id, '📧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- AI & ML L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('AI Assistants', 'AI асистенти', 'ai-assistants', ai_ml_id, '🤖', 1),
  ('Image Generation', 'Генериране на изображения', 'ai-image-generation', ai_ml_id, '🎨', 2),
  ('Text Generation', 'Генериране на текст', 'ai-text-generation', ai_ml_id, '📝', 3),
  ('Voice & Speech', 'Глас и реч', 'ai-voice-speech', ai_ml_id, '🎙️', 4),
  ('ML Frameworks', 'ML фреймуърки', 'ml-frameworks', ai_ml_id, '🧠', 5),
  ('Data Science Tools', 'Инструменти за данни', 'data-science-tools', ai_ml_id, '📊', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Utilities L2
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Backup & Recovery', 'Архивиране и възстановяване', 'backup-recovery', utilities_id, '💾', 1),
  ('System Optimization', 'Оптимизация на системата', 'system-optimization', utilities_id, '⚡', 2),
  ('File Management', 'Управление на файлове', 'file-management', utilities_id, '📁', 3),
  ('Compression Tools', 'Архиватори', 'compression-tools', utilities_id, '📦', 4),
  ('Disk Utilities', 'Дискови инструменти', 'disk-utilities', utilities_id, '💿', 5),
  ('Uninstallers', 'Деинсталатори', 'uninstallers', utilities_id, '🗑️', 6),
  ('Clipboard Managers', 'Мениджъри на клипборд', 'clipboard-managers', utilities_id, '📋', 7),
  ('Screenshot Tools', 'Скрийншот инструменти', 'screenshot-tools', utilities_id, '📸', 8)
  ON CONFLICT (slug) DO NOTHING;

  RAISE NOTICE 'Software L3 categories restoration complete';
END $$;
;
