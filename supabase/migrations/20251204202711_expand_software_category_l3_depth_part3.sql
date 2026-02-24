-- =====================================================
-- SOFTWARE CATEGORY EXPANSION - Phase 3: L3 Categories (Part 3)
-- Educational, Utilities, Cloud, Multimedia, Scientific, Communication
-- =====================================================

DO $$
DECLARE
  v_parent_id UUID;
BEGIN

-- =====================================================
-- L3 CATEGORIES - EDUCATIONAL SOFTWARE
-- =====================================================

-- E-Learning Platforms L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'edu-elearning';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Coursera', 'Coursera', 'elearn-coursera', '🎓', v_parent_id, 1),
('Udemy', 'Udemy', 'elearn-udemy', '📚', v_parent_id, 2),
('LinkedIn Learning', 'LinkedIn Learning', 'elearn-linkedin', '💼', v_parent_id, 3),
('Skillshare', 'Skillshare', 'elearn-skillshare', '🎨', v_parent_id, 4),
('MasterClass', 'MasterClass', 'elearn-masterclass', '⭐', v_parent_id, 5),
('Pluralsight', 'Pluralsight', 'elearn-pluralsight', '💻', v_parent_id, 6);

-- Language Learning L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'edu-language';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Duolingo', 'Duolingo', 'lang-duolingo', '🦉', v_parent_id, 1),
('Babbel', 'Babbel', 'lang-babbel', '🗣️', v_parent_id, 2),
('Rosetta Stone', 'Rosetta Stone', 'lang-rosetta', '🪨', v_parent_id, 3),
('Pimsleur', 'Pimsleur', 'lang-pimsleur', '🎧', v_parent_id, 4),
('Busuu', 'Busuu', 'lang-busuu', '🌍', v_parent_id, 5),
('Bulgarian Language', 'Български език', 'lang-bulgarian', '🇧🇬', v_parent_id, 6);

-- Coding & Programming L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'edu-coding';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Codecademy', 'Codecademy', 'code-codecademy', '💻', v_parent_id, 1),
('freeCodeCamp', 'freeCodeCamp', 'code-freecodecamp', '🏕️', v_parent_id, 2),
('DataCamp', 'DataCamp', 'code-datacamp', '📊', v_parent_id, 3),
('Treehouse', 'Treehouse', 'code-treehouse', '🌲', v_parent_id, 4),
('Frontend Masters', 'Frontend Masters', 'code-fem', '🌐', v_parent_id, 5),
('LeetCode Premium', 'LeetCode Premium', 'code-leetcode', '🧩', v_parent_id, 6);

-- Kids Education L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'edu-kids';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('ABCmouse', 'ABCmouse', 'kids-abcmouse', '🐭', v_parent_id, 1),
('Khan Academy Kids', 'Khan Academy Kids', 'kids-khan', '📚', v_parent_id, 2),
('Scratch', 'Scratch', 'kids-scratch', '🐱', v_parent_id, 3),
('Typing Games', 'Игри за машинопис', 'kids-typing', '⌨️', v_parent_id, 4),
('Math Games', 'Математически игри', 'kids-math', '🔢', v_parent_id, 5),
('Reading Apps', 'Приложения за четене', 'kids-reading', '📖', v_parent_id, 6);

-- =====================================================
-- L3 CATEGORIES - UTILITIES & SYSTEM TOOLS
-- =====================================================

-- Backup & Recovery L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'util-backup';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Acronis True Image', 'Acronis True Image', 'backup-acronis', '💾', v_parent_id, 1),
('EaseUS Todo', 'EaseUS Todo', 'backup-easeus', '💾', v_parent_id, 2),
('Macrium Reflect', 'Macrium Reflect', 'backup-macrium', '💾', v_parent_id, 3),
('Veeam', 'Veeam', 'backup-veeam', '💾', v_parent_id, 4),
('Carbonite', 'Carbonite', 'backup-carbonite', '☁️', v_parent_id, 5),
('Backblaze', 'Backblaze', 'backup-backblaze', '🔥', v_parent_id, 6);

-- Disk Management L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'util-disk';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Partition Managers', 'Мениджъри на дялове', 'disk-partition', '💿', v_parent_id, 1),
('Disk Cloning', 'Клониране на дискове', 'disk-clone', '📀', v_parent_id, 2),
('SSD Tools', 'SSD инструменти', 'disk-ssd', '⚡', v_parent_id, 3),
('Defragmenters', 'Дефрагментатори', 'disk-defrag', '🔧', v_parent_id, 4),
('Disk Cleanup', 'Почистване на дискове', 'disk-cleanup', '🧹', v_parent_id, 5);

-- System Optimization L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'util-optimize';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('CCleaner', 'CCleaner', 'opt-ccleaner', '🧹', v_parent_id, 1),
('IObit Advanced', 'IObit Advanced', 'opt-iobit', '🚀', v_parent_id, 2),
('Glary Utilities', 'Glary Utilities', 'opt-glary', '🔧', v_parent_id, 3),
('Registry Cleaners', 'Почистване на регистри', 'opt-registry', '📋', v_parent_id, 4),
('Memory Optimizers', 'Оптимизатори на памет', 'opt-memory', '💾', v_parent_id, 5),
('Startup Managers', 'Мениджъри на стартиране', 'opt-startup', '🚀', v_parent_id, 6);

-- Compression Tools L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'util-compress';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('WinRAR', 'WinRAR', 'compress-winrar', '📦', v_parent_id, 1),
('7-Zip', '7-Zip', 'compress-7zip', '📦', v_parent_id, 2),
('WinZip', 'WinZip', 'compress-winzip', '📦', v_parent_id, 3),
('PeaZip', 'PeaZip', 'compress-peazip', '📦', v_parent_id, 4),
('Bandizip', 'Bandizip', 'compress-bandizip', '📦', v_parent_id, 5);

-- Remote Access L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'util-remote';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('TeamViewer', 'TeamViewer', 'remote-teamviewer', '🌐', v_parent_id, 1),
('AnyDesk', 'AnyDesk', 'remote-anydesk', '💻', v_parent_id, 2),
('LogMeIn', 'LogMeIn', 'remote-logmein', '🔐', v_parent_id, 3),
('Chrome Remote Desktop', 'Chrome Remote Desktop', 'remote-chrome', '🌐', v_parent_id, 4),
('Parsec', 'Parsec', 'remote-parsec', '🎮', v_parent_id, 5),
('RustDesk', 'RustDesk', 'remote-rustdesk', '🦀', v_parent_id, 6);

-- =====================================================
-- L3 CATEGORIES - CLOUD SERVICES & SAAS
-- =====================================================

-- Cloud Storage L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'cloud-storage';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Google Drive', 'Google Drive', 'storage-gdrive', '📁', v_parent_id, 1),
('Dropbox', 'Dropbox', 'storage-dropbox', '📦', v_parent_id, 2),
('OneDrive', 'OneDrive', 'storage-onedrive', '☁️', v_parent_id, 3),
('iCloud', 'iCloud', 'storage-icloud', '🍎', v_parent_id, 4),
('pCloud', 'pCloud', 'storage-pcloud', '☁️', v_parent_id, 5),
('MEGA', 'MEGA', 'storage-mega', '💾', v_parent_id, 6);

-- Web Hosting L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'cloud-hosting';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Shared Hosting', 'Споделен хостинг', 'host-shared', '🌐', v_parent_id, 1),
('VPS Hosting', 'VPS хостинг', 'host-vps', '🖥️', v_parent_id, 2),
('Dedicated Servers', 'Дедикирани сървъри', 'host-dedicated', '💪', v_parent_id, 3),
('Cloud Hosting', 'Облачен хостинг', 'host-cloud', '☁️', v_parent_id, 4),
('WordPress Hosting', 'WordPress хостинг', 'host-wordpress', '📝', v_parent_id, 5),
('Bulgarian Hosting', 'Български хостинг', 'host-bulgaria', '🇧🇬', v_parent_id, 6);

-- Cloud Computing L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'cloud-computing';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('AWS', 'AWS', 'compute-aws', '🌩️', v_parent_id, 1),
('Google Cloud', 'Google Cloud', 'compute-gcp', '☁️', v_parent_id, 2),
('Microsoft Azure', 'Microsoft Azure', 'compute-azure', '💜', v_parent_id, 3),
('DigitalOcean', 'DigitalOcean', 'compute-do', '💧', v_parent_id, 4),
('Linode', 'Linode', 'compute-linode', '🌐', v_parent_id, 5),
('Vultr', 'Vultr', 'compute-vultr', '🚀', v_parent_id, 6);

-- =====================================================
-- L3 CATEGORIES - MULTIMEDIA SOFTWARE
-- =====================================================

-- Media Players L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'media-players';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('VLC Media Player', 'VLC Media Player', 'player-vlc', '▶️', v_parent_id, 1),
('PotPlayer', 'PotPlayer', 'player-pot', '▶️', v_parent_id, 2),
('MPC-HC', 'MPC-HC', 'player-mpc', '▶️', v_parent_id, 3),
('Plex', 'Plex', 'player-plex', '📺', v_parent_id, 4),
('Kodi', 'Kodi', 'player-kodi', '🏠', v_parent_id, 5);

-- Screen Recorders L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'media-screen-rec';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('OBS Studio', 'OBS Studio', 'rec-obs', '📹', v_parent_id, 1),
('Camtasia', 'Camtasia', 'rec-camtasia', '📹', v_parent_id, 2),
('Bandicam', 'Bandicam', 'rec-bandicam', '📹', v_parent_id, 3),
('ScreenPal', 'ScreenPal', 'rec-screenpal', '📹', v_parent_id, 4),
('ShareX', 'ShareX', 'rec-sharex', '📷', v_parent_id, 5),
('Loom', 'Loom', 'rec-loom', '🎬', v_parent_id, 6);

-- Video Converters L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'media-converters';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('HandBrake', 'HandBrake', 'conv-handbrake', '🔄', v_parent_id, 1),
('FFmpeg Tools', 'FFmpeg инструменти', 'conv-ffmpeg', '🔧', v_parent_id, 2),
('Wondershare', 'Wondershare', 'conv-wondershare', '✨', v_parent_id, 3),
('Format Factory', 'Format Factory', 'conv-format', '🏭', v_parent_id, 4),
('Any Video Converter', 'Any Video Converter', 'conv-anyv', '🔄', v_parent_id, 5);

-- =====================================================
-- L3 CATEGORIES - SCIENTIFIC & ENGINEERING
-- =====================================================

-- MATLAB L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'sci-matlab';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('MATLAB', 'MATLAB', 'math-matlab', '📐', v_parent_id, 1),
('GNU Octave', 'GNU Octave', 'math-octave', '📊', v_parent_id, 2),
('Mathematica', 'Mathematica', 'math-mathematica', '🔢', v_parent_id, 3),
('Maple', 'Maple', 'math-maple', '🍁', v_parent_id, 4),
('SciPy Tools', 'SciPy инструменти', 'math-scipy', '🐍', v_parent_id, 5);

-- Statistical Analysis L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'sci-statistics';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('SPSS', 'SPSS', 'stat-spss', '📊', v_parent_id, 1),
('SAS', 'SAS', 'stat-sas', '📊', v_parent_id, 2),
('Stata', 'Stata', 'stat-stata', '📈', v_parent_id, 3),
('R Studio', 'R Studio', 'stat-rstudio', '📊', v_parent_id, 4),
('JMP', 'JMP', 'stat-jmp', '📉', v_parent_id, 5),
('Minitab', 'Minitab', 'stat-minitab', '📊', v_parent_id, 6);

-- GIS & Mapping L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'sci-gis';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('ArcGIS', 'ArcGIS', 'gis-arcgis', '🗺️', v_parent_id, 1),
('QGIS', 'QGIS', 'gis-qgis', '🌍', v_parent_id, 2),
('Google Earth Pro', 'Google Earth Pro', 'gis-earth', '🌎', v_parent_id, 3),
('MapInfo', 'MapInfo', 'gis-mapinfo', '📍', v_parent_id, 4),
('AutoCAD Map', 'AutoCAD Map', 'gis-autocad', '📐', v_parent_id, 5);

-- =====================================================
-- L3 CATEGORIES - COMMUNICATION & COLLABORATION
-- =====================================================

-- Video Conferencing L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'comm-video';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Zoom', 'Zoom', 'video-zoom', '📹', v_parent_id, 1),
('Microsoft Teams', 'Microsoft Teams', 'video-teams', '💜', v_parent_id, 2),
('Google Meet', 'Google Meet', 'video-meet', '🟢', v_parent_id, 3),
('Webex', 'Webex', 'video-webex', '🔵', v_parent_id, 4),
('GoToMeeting', 'GoToMeeting', 'video-goto', '🎥', v_parent_id, 5);

-- Team Chat L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'comm-chat';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Slack', 'Slack', 'chat-slack', '💬', v_parent_id, 1),
('Microsoft Teams Chat', 'Microsoft Teams Chat', 'chat-teams', '💜', v_parent_id, 2),
('Discord', 'Discord', 'chat-discord', '🎮', v_parent_id, 3),
('Telegram Business', 'Telegram Business', 'chat-telegram', '📱', v_parent_id, 4),
('Mattermost', 'Mattermost', 'chat-mattermost', '💬', v_parent_id, 5);

END $$;;
