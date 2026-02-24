-- =====================================================
-- SOFTWARE CATEGORY EXPANSION - Phase 3: L3 Categories (Part 1)
-- Deep subcategories for each L2
-- =====================================================

-- Get L2 parent IDs and insert L3 categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN

-- =====================================================
-- L3 CATEGORIES - OPERATING SYSTEMS
-- =====================================================

-- Windows L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'os-windows';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Windows 11', 'Windows 11', 'windows-11', '🪟', v_parent_id, 1),
('Windows 10', 'Windows 10', 'windows-10', '🪟', v_parent_id, 2),
('Windows 11 Pro', 'Windows 11 Pro', 'windows-11-pro', '🪟', v_parent_id, 3),
('Windows 10 Pro', 'Windows 10 Pro', 'windows-10-pro', '🪟', v_parent_id, 4),
('Windows Home', 'Windows Home', 'windows-home', '🏠', v_parent_id, 5),
('Windows Enterprise', 'Windows Enterprise', 'windows-enterprise', '🏢', v_parent_id, 6),
('Windows Education', 'Windows Education', 'windows-education', '🎓', v_parent_id, 7);

-- macOS L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'os-macos';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('macOS Sequoia', 'macOS Sequoia', 'macos-sequoia', '🍎', v_parent_id, 1),
('macOS Sonoma', 'macOS Sonoma', 'macos-sonoma', '🍎', v_parent_id, 2),
('macOS Ventura', 'macOS Ventura', 'macos-ventura', '🍎', v_parent_id, 3),
('macOS Monterey', 'macOS Monterey', 'macos-monterey', '🍎', v_parent_id, 4),
('macOS Server', 'macOS Server', 'macos-server', '🖥️', v_parent_id, 5);

-- Linux L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'os-linux';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Ubuntu', 'Ubuntu', 'linux-ubuntu', '🐧', v_parent_id, 1),
('Fedora', 'Fedora', 'linux-fedora', '🐧', v_parent_id, 2),
('Debian', 'Debian', 'linux-debian', '🐧', v_parent_id, 3),
('Linux Mint', 'Linux Mint', 'linux-mint', '🐧', v_parent_id, 4),
('CentOS / Rocky', 'CentOS / Rocky', 'linux-centos', '🐧', v_parent_id, 5),
('Arch Linux', 'Arch Linux', 'linux-arch', '🐧', v_parent_id, 6),
('openSUSE', 'openSUSE', 'linux-opensuse', '🐧', v_parent_id, 7),
('Pop!_OS', 'Pop!_OS', 'linux-popos', '🐧', v_parent_id, 8);

-- Server OS L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'os-server';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Windows Server 2022', 'Windows Server 2022', 'server-win-2022', '🖥️', v_parent_id, 1),
('Windows Server 2019', 'Windows Server 2019', 'server-win-2019', '🖥️', v_parent_id, 2),
('Red Hat Enterprise Linux', 'Red Hat Enterprise Linux', 'server-rhel', '🐧', v_parent_id, 3),
('Ubuntu Server', 'Ubuntu Server', 'server-ubuntu', '🐧', v_parent_id, 4),
('VMware ESXi', 'VMware ESXi', 'server-esxi', '🔲', v_parent_id, 5),
('Proxmox VE', 'Proxmox VE', 'server-proxmox', '🔲', v_parent_id, 6);

-- =====================================================
-- L3 CATEGORIES - OFFICE & PRODUCTIVITY
-- =====================================================

-- Office Suites L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-suites';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Microsoft 365', 'Microsoft 365', 'office-ms365', '📦', v_parent_id, 1),
('Microsoft Office 2024', 'Microsoft Office 2024', 'office-2024', '📦', v_parent_id, 2),
('Microsoft Office 2021', 'Microsoft Office 2021', 'office-2021', '📦', v_parent_id, 3),
('LibreOffice', 'LibreOffice', 'office-libre', '📦', v_parent_id, 4),
('WPS Office', 'WPS Office', 'office-wps', '📦', v_parent_id, 5),
('Google Workspace', 'Google Workspace', 'office-google', '📦', v_parent_id, 6),
('Zoho Workplace', 'Zoho Workplace', 'office-zoho', '📦', v_parent_id, 7);

-- PDF Tools L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-pdf';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Adobe Acrobat', 'Adobe Acrobat', 'pdf-acrobat', '📄', v_parent_id, 1),
('PDF Editors', 'PDF редактори', 'pdf-editors', '✏️', v_parent_id, 2),
('PDF Converters', 'PDF конвертори', 'pdf-converters', '🔄', v_parent_id, 3),
('PDF Viewers', 'PDF четци', 'pdf-viewers', '👁️', v_parent_id, 4),
('PDF Merger/Splitter', 'PDF сливане/разделяне', 'pdf-merge', '📑', v_parent_id, 5),
('OCR Software', 'OCR софтуер', 'pdf-ocr', '🔍', v_parent_id, 6),
('Digital Signatures', 'Цифрови подписи', 'pdf-signatures', '✍️', v_parent_id, 7);

-- Note-Taking L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-notes';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Notion', 'Notion', 'notes-notion', '📒', v_parent_id, 1),
('Evernote', 'Evernote', 'notes-evernote', '🐘', v_parent_id, 2),
('OneNote', 'OneNote', 'notes-onenote', '📓', v_parent_id, 3),
('Obsidian', 'Obsidian', 'notes-obsidian', '💎', v_parent_id, 4),
('Roam Research', 'Roam Research', 'notes-roam', '🧠', v_parent_id, 5),
('Bear Notes', 'Bear Notes', 'notes-bear', '🐻', v_parent_id, 6);

-- Project Management L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-project';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Microsoft Project', 'Microsoft Project', 'pm-msproject', '📋', v_parent_id, 1),
('Jira', 'Jira', 'pm-jira', '📋', v_parent_id, 2),
('Asana', 'Asana', 'pm-asana', '📋', v_parent_id, 3),
('Monday.com', 'Monday.com', 'pm-monday', '📋', v_parent_id, 4),
('Trello', 'Trello', 'pm-trello', '📋', v_parent_id, 5),
('ClickUp', 'ClickUp', 'pm-clickup', '📋', v_parent_id, 6),
('Basecamp', 'Basecamp', 'pm-basecamp', '🏕️', v_parent_id, 7);

-- =====================================================
-- L3 CATEGORIES - SECURITY SOFTWARE
-- =====================================================

-- Antivirus L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-antivirus';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Norton Antivirus', 'Norton Antivirus', 'av-norton', '🛡️', v_parent_id, 1),
('Kaspersky', 'Kaspersky', 'av-kaspersky', '🛡️', v_parent_id, 2),
('Bitdefender', 'Bitdefender', 'av-bitdefender', '🛡️', v_parent_id, 3),
('McAfee', 'McAfee', 'av-mcafee', '🛡️', v_parent_id, 4),
('ESET NOD32', 'ESET NOD32', 'av-eset', '🛡️', v_parent_id, 5),
('Avast', 'Avast', 'av-avast', '🛡️', v_parent_id, 6),
('AVG', 'AVG', 'av-avg', '🛡️', v_parent_id, 7),
('Windows Defender', 'Windows Defender', 'av-defender', '🪟', v_parent_id, 8);

-- VPN L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-vpn';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('NordVPN', 'NordVPN', 'vpn-nord', '🔐', v_parent_id, 1),
('ExpressVPN', 'ExpressVPN', 'vpn-express', '🔐', v_parent_id, 2),
('Surfshark', 'Surfshark', 'vpn-surfshark', '🦈', v_parent_id, 3),
('CyberGhost', 'CyberGhost', 'vpn-cyberghost', '👻', v_parent_id, 4),
('ProtonVPN', 'ProtonVPN', 'vpn-proton', '🔐', v_parent_id, 5),
('Private Internet Access', 'Private Internet Access', 'vpn-pia', '🔐', v_parent_id, 6),
('Mullvad VPN', 'Mullvad VPN', 'vpn-mullvad', '🔐', v_parent_id, 7);

-- Password Managers L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-passwords';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('LastPass', 'LastPass', 'pass-lastpass', '🔑', v_parent_id, 1),
('1Password', '1Password', 'pass-1password', '🔑', v_parent_id, 2),
('Bitwarden', 'Bitwarden', 'pass-bitwarden', '🔑', v_parent_id, 3),
('Dashlane', 'Dashlane', 'pass-dashlane', '🔑', v_parent_id, 4),
('Keeper', 'Keeper', 'pass-keeper', '🔑', v_parent_id, 5),
('NordPass', 'NordPass', 'pass-nordpass', '🔑', v_parent_id, 6);

-- =====================================================
-- L3 CATEGORIES - CREATIVE SOFTWARE
-- =====================================================

-- Photo Editing L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-photo';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Adobe Photoshop', 'Adobe Photoshop', 'photo-photoshop', '📸', v_parent_id, 1),
('Adobe Lightroom', 'Adobe Lightroom', 'photo-lightroom', '📸', v_parent_id, 2),
('Affinity Photo', 'Affinity Photo', 'photo-affinity', '📸', v_parent_id, 3),
('Capture One', 'Capture One', 'photo-capture', '📸', v_parent_id, 4),
('GIMP', 'GIMP', 'photo-gimp', '📸', v_parent_id, 5),
('Luminar', 'Luminar', 'photo-luminar', '📸', v_parent_id, 6),
('DxO PhotoLab', 'DxO PhotoLab', 'photo-dxo', '📸', v_parent_id, 7),
('AI Photo Enhancers', 'AI подобрители на снимки', 'photo-ai', '🤖', v_parent_id, 8);

-- Video Editing L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-video';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Adobe Premiere Pro', 'Adobe Premiere Pro', 'video-premiere', '🎬', v_parent_id, 1),
('DaVinci Resolve', 'DaVinci Resolve', 'video-davinci', '🎬', v_parent_id, 2),
('Final Cut Pro', 'Final Cut Pro', 'video-finalcut', '🎬', v_parent_id, 3),
('Vegas Pro', 'Vegas Pro', 'video-vegas', '🎬', v_parent_id, 4),
('Filmora', 'Filmora', 'video-filmora', '🎬', v_parent_id, 5),
('Adobe After Effects', 'Adobe After Effects', 'video-aftereffects', '✨', v_parent_id, 6),
('Camtasia', 'Camtasia', 'video-camtasia', '📹', v_parent_id, 7),
('AI Video Editors', 'AI видео редактори', 'video-ai', '🤖', v_parent_id, 8);

-- Graphic Design L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-graphic';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Adobe Illustrator', 'Adobe Illustrator', 'design-illustrator', '🎨', v_parent_id, 1),
('CorelDRAW', 'CorelDRAW', 'design-corel', '🎨', v_parent_id, 2),
('Affinity Designer', 'Affinity Designer', 'design-affinity', '🎨', v_parent_id, 3),
('Canva Pro', 'Canva Pro', 'design-canva', '🎨', v_parent_id, 4),
('Figma', 'Figma', 'design-figma', '🎨', v_parent_id, 5),
('Sketch', 'Sketch', 'design-sketch', '🎨', v_parent_id, 6),
('InVision', 'InVision', 'design-invision', '🎨', v_parent_id, 7),
('Adobe InDesign', 'Adobe InDesign', 'design-indesign', '📐', v_parent_id, 8);

-- 3D Modeling L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-3d';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Autodesk Maya', 'Autodesk Maya', '3d-maya', '🧊', v_parent_id, 1),
('3ds Max', '3ds Max', '3d-3dsmax', '🧊', v_parent_id, 2),
('Blender', 'Blender', '3d-blender', '🧊', v_parent_id, 3),
('Cinema 4D', 'Cinema 4D', '3d-cinema4d', '🧊', v_parent_id, 4),
('ZBrush', 'ZBrush', '3d-zbrush', '🧊', v_parent_id, 5),
('SketchUp', 'SketchUp', '3d-sketchup', '🧊', v_parent_id, 6),
('Houdini', 'Houdini', '3d-houdini', '🧊', v_parent_id, 7),
('AI 3D Generators', 'AI 3D генератори', '3d-ai', '🤖', v_parent_id, 8);

-- CAD Software L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-cad';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('AutoCAD', 'AutoCAD', 'cad-autocad', '📐', v_parent_id, 1),
('SolidWorks', 'SolidWorks', 'cad-solidworks', '📐', v_parent_id, 2),
('Fusion 360', 'Fusion 360', 'cad-fusion', '📐', v_parent_id, 3),
('CATIA', 'CATIA', 'cad-catia', '📐', v_parent_id, 4),
('Inventor', 'Inventor', 'cad-inventor', '📐', v_parent_id, 5),
('FreeCAD', 'FreeCAD', 'cad-freecad', '📐', v_parent_id, 6),
('Rhino', 'Rhino', 'cad-rhino', '🦏', v_parent_id, 7);

-- Audio Production L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-audio';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Pro Tools', 'Pro Tools', 'audio-protools', '🎵', v_parent_id, 1),
('FL Studio', 'FL Studio', 'audio-flstudio', '🎵', v_parent_id, 2),
('Ableton Live', 'Ableton Live', 'audio-ableton', '🎵', v_parent_id, 3),
('Logic Pro', 'Logic Pro', 'audio-logic', '🎵', v_parent_id, 4),
('Cubase', 'Cubase', 'audio-cubase', '🎵', v_parent_id, 5),
('Audacity', 'Audacity', 'audio-audacity', '🎵', v_parent_id, 6),
('Adobe Audition', 'Adobe Audition', 'audio-audition', '🎵', v_parent_id, 7),
('AI Music Generators', 'AI музикални генератори', 'audio-ai', '🤖', v_parent_id, 8);

-- AI Creative Tools L3
SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-ai';
INSERT INTO categories (name, name_bg, slug, icon, parent_id, display_order) VALUES
('Midjourney', 'Midjourney', 'ai-creative-midjourney', '🤖', v_parent_id, 1),
('DALL-E', 'DALL-E', 'ai-creative-dalle', '🤖', v_parent_id, 2),
('Stable Diffusion', 'Stable Diffusion', 'ai-creative-sd', '🤖', v_parent_id, 3),
('Adobe Firefly', 'Adobe Firefly', 'ai-creative-firefly', '🔥', v_parent_id, 4),
('RunwayML', 'RunwayML', 'ai-creative-runway', '🤖', v_parent_id, 5),
('AI Upscalers', 'AI уголемители', 'ai-creative-upscale', '📈', v_parent_id, 6),
('AI Background Removers', 'AI премахване на фон', 'ai-creative-bg', '✂️', v_parent_id, 7);

END $$;;
