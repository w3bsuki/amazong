
-- Restore massive batch of L3 categories - batch 2
DO $$
DECLARE
  -- Software L2 IDs
  v_office_suites_id UUID;
  v_accounting_id UUID;
  v_crm_id UUID;
  v_project_mgmt_id UUID;
  v_photo_editing_id UUID;
  v_video_editing_id UUID;
  v_audio_production_id UUID;
  v_graphic_design_id UUID;
  v_antivirus_id UUID;
  v_vpn_id UUID;
  -- Electronics sub-categories
  v_gaming_keyboards_id UUID;
  v_gaming_mice_id UUID;
  v_gaming_headsets_id UUID;
  v_desktop_computers_id UUID;
  v_monitors_id UUID;
  v_printers_id UUID;
  v_external_drives_id UUID;
  v_routers_id UUID;
BEGIN
  -- Get Software L2 IDs
  SELECT id INTO v_office_suites_id FROM categories WHERE slug = 'office-suites';
  SELECT id INTO v_accounting_id FROM categories WHERE slug = 'accounting-software';
  SELECT id INTO v_crm_id FROM categories WHERE slug = 'crm-software';
  SELECT id INTO v_project_mgmt_id FROM categories WHERE slug = 'project-management-software';
  SELECT id INTO v_photo_editing_id FROM categories WHERE slug = 'photo-editing-software';
  SELECT id INTO v_video_editing_id FROM categories WHERE slug = 'video-editing-software';
  SELECT id INTO v_audio_production_id FROM categories WHERE slug = 'audio-production-software';
  SELECT id INTO v_graphic_design_id FROM categories WHERE slug = 'graphic-design-software';
  SELECT id INTO v_antivirus_id FROM categories WHERE slug = 'antivirus-software';
  SELECT id INTO v_vpn_id FROM categories WHERE slug = 'vpn-software';
  
  -- Get Electronics L2 IDs
  SELECT id INTO v_gaming_keyboards_id FROM categories WHERE slug = 'gaming-keyboards';
  SELECT id INTO v_gaming_mice_id FROM categories WHERE slug = 'gaming-mice';
  SELECT id INTO v_gaming_headsets_id FROM categories WHERE slug = 'gaming-headsets';
  SELECT id INTO v_desktop_computers_id FROM categories WHERE slug = 'desktop-computers';
  SELECT id INTO v_monitors_id FROM categories WHERE slug = 'monitors';
  SELECT id INTO v_printers_id FROM categories WHERE slug = 'printers';
  SELECT id INTO v_external_drives_id FROM categories WHERE slug = 'external-hard-drives';
  SELECT id INTO v_routers_id FROM categories WHERE slug = 'routers';

  -- OFFICE SUITES L3
  IF v_office_suites_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Microsoft Office', 'Microsoft Office', 'microsoft-office', v_office_suites_id, 1),
    ('Google Workspace', 'Google Workspace', 'google-workspace', v_office_suites_id, 2),
    ('LibreOffice', 'LibreOffice', 'libreoffice', v_office_suites_id, 3),
    ('Apple iWork', 'Apple iWork', 'apple-iwork', v_office_suites_id, 4),
    ('WPS Office', 'WPS Office', 'wps-office', v_office_suites_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ACCOUNTING SOFTWARE L3
  IF v_accounting_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('QuickBooks', 'QuickBooks', 'quickbooks', v_accounting_id, 1),
    ('Xero', 'Xero', 'xero', v_accounting_id, 2),
    ('FreshBooks', 'FreshBooks', 'freshbooks', v_accounting_id, 3),
    ('Sage', 'Sage', 'sage-accounting', v_accounting_id, 4),
    ('Wave', 'Wave', 'wave-accounting', v_accounting_id, 5),
    ('Zoho Books', 'Zoho Books', 'zoho-books', v_accounting_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- PHOTO EDITING L3
  IF v_photo_editing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Adobe Photoshop', 'Adobe Photoshop', 'adobe-photoshop', v_photo_editing_id, 1),
    ('Adobe Lightroom', 'Adobe Lightroom', 'adobe-lightroom', v_photo_editing_id, 2),
    ('GIMP', 'GIMP', 'gimp', v_photo_editing_id, 3),
    ('Affinity Photo', 'Affinity Photo', 'affinity-photo', v_photo_editing_id, 4),
    ('Capture One', 'Capture One', 'capture-one', v_photo_editing_id, 5),
    ('Luminar', 'Luminar', 'luminar', v_photo_editing_id, 6),
    ('Corel PaintShop', 'Corel PaintShop', 'corel-paintshop', v_photo_editing_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- VIDEO EDITING L3
  IF v_video_editing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Adobe Premiere', 'Adobe Premiere', 'adobe-premiere', v_video_editing_id, 1),
    ('Final Cut Pro', 'Final Cut Pro', 'final-cut-pro', v_video_editing_id, 2),
    ('DaVinci Resolve', 'DaVinci Resolve', 'davinci-resolve', v_video_editing_id, 3),
    ('Sony Vegas', 'Sony Vegas', 'sony-vegas', v_video_editing_id, 4),
    ('iMovie', 'iMovie', 'imovie', v_video_editing_id, 5),
    ('Filmora', 'Filmora', 'filmora', v_video_editing_id, 6),
    ('Camtasia', 'Camtasia', 'camtasia', v_video_editing_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- AUDIO PRODUCTION L3
  IF v_audio_production_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pro Tools', 'Pro Tools', 'pro-tools', v_audio_production_id, 1),
    ('Logic Pro', 'Logic Pro', 'logic-pro', v_audio_production_id, 2),
    ('Ableton Live', 'Ableton Live', 'ableton-live', v_audio_production_id, 3),
    ('FL Studio', 'FL Studio', 'fl-studio', v_audio_production_id, 4),
    ('Audacity', 'Audacity', 'audacity', v_audio_production_id, 5),
    ('GarageBand', 'GarageBand', 'garageband', v_audio_production_id, 6),
    ('Cubase', 'Cubase', 'cubase', v_audio_production_id, 7),
    ('Reason', 'Reason', 'reason-daw', v_audio_production_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GRAPHIC DESIGN L3
  IF v_graphic_design_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Adobe Illustrator', 'Adobe Illustrator', 'adobe-illustrator', v_graphic_design_id, 1),
    ('CorelDRAW', 'CorelDRAW', 'coreldraw', v_graphic_design_id, 2),
    ('Affinity Designer', 'Affinity Designer', 'affinity-designer', v_graphic_design_id, 3),
    ('Inkscape', 'Inkscape', 'inkscape', v_graphic_design_id, 4),
    ('Canva Pro', 'Canva Pro', 'canva-pro', v_graphic_design_id, 5),
    ('Figma', 'Figma', 'figma', v_graphic_design_id, 6),
    ('Sketch', 'Sketch', 'sketch-app', v_graphic_design_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ANTIVIRUS L3
  IF v_antivirus_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Norton', 'Norton', 'norton-antivirus', v_antivirus_id, 1),
    ('McAfee', 'McAfee', 'mcafee', v_antivirus_id, 2),
    ('Kaspersky', 'Kaspersky', 'kaspersky', v_antivirus_id, 3),
    ('Bitdefender', 'Bitdefender', 'bitdefender', v_antivirus_id, 4),
    ('Avast', 'Avast', 'avast', v_antivirus_id, 5),
    ('AVG', 'AVG', 'avg-antivirus', v_antivirus_id, 6),
    ('ESET', 'ESET', 'eset', v_antivirus_id, 7),
    ('Malwarebytes', 'Malwarebytes', 'malwarebytes', v_antivirus_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- VPN L3
  IF v_vpn_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('NordVPN', 'NordVPN', 'nordvpn', v_vpn_id, 1),
    ('ExpressVPN', 'ExpressVPN', 'expressvpn', v_vpn_id, 2),
    ('Surfshark', 'Surfshark', 'surfshark', v_vpn_id, 3),
    ('CyberGhost', 'CyberGhost', 'cyberghost', v_vpn_id, 4),
    ('Private Internet Access', 'Private Internet Access', 'pia-vpn', v_vpn_id, 5),
    ('ProtonVPN', 'ProtonVPN', 'protonvpn', v_vpn_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GAMING KEYBOARDS L3
  IF v_gaming_keyboards_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Mechanical Keyboards', 'Механични клавиатури', 'mechanical-keyboards', v_gaming_keyboards_id, 1),
    ('RGB Keyboards', 'RGB клавиатури', 'rgb-keyboards', v_gaming_keyboards_id, 2),
    ('Wireless Gaming Keyboards', 'Безжични геймърски', 'wireless-gaming-keyboards', v_gaming_keyboards_id, 3),
    ('TKL Keyboards', 'TKL клавиатури', 'tkl-keyboards', v_gaming_keyboards_id, 4),
    ('60% Keyboards', '60% клавиатури', 'compact-keyboards', v_gaming_keyboards_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GAMING MICE L3
  IF v_gaming_mice_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wired Gaming Mice', 'Кабелни геймърски мишки', 'wired-gaming-mice', v_gaming_mice_id, 1),
    ('Wireless Gaming Mice', 'Безжични геймърски мишки', 'wireless-gaming-mice', v_gaming_mice_id, 2),
    ('RGB Gaming Mice', 'RGB геймърски мишки', 'rgb-gaming-mice', v_gaming_mice_id, 3),
    ('Ergonomic Gaming Mice', 'Ергономични геймърски мишки', 'ergonomic-gaming-mice', v_gaming_mice_id, 4),
    ('MMO Gaming Mice', 'MMO геймърски мишки', 'mmo-gaming-mice', v_gaming_mice_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GAMING HEADSETS L3
  IF v_gaming_headsets_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wired Gaming Headsets', 'Кабелни геймърски слушалки', 'wired-gaming-headsets', v_gaming_headsets_id, 1),
    ('Wireless Gaming Headsets', 'Безжични геймърски слушалки', 'wireless-gaming-headsets', v_gaming_headsets_id, 2),
    ('Surround Sound Headsets', 'Съраунд слушалки', 'surround-gaming-headsets', v_gaming_headsets_id, 3),
    ('PC Gaming Headsets', 'PC геймърски слушалки', 'pc-gaming-headsets', v_gaming_headsets_id, 4),
    ('Console Gaming Headsets', 'Конзолни слушалки', 'console-gaming-headsets', v_gaming_headsets_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- DESKTOP COMPUTERS L3
  IF v_desktop_computers_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Budget Desktops', 'Бюджетни настолни', 'budget-desktops', v_desktop_computers_id, 1),
    ('Workstations', 'Работни станции', 'workstations', v_desktop_computers_id, 2),
    ('Gaming Desktops', 'Геймърски настолни', 'gaming-desktops', v_desktop_computers_id, 3),
    ('Business Desktops', 'Бизнес настолни', 'business-desktops', v_desktop_computers_id, 4),
    ('Compact Desktops', 'Компактни настолни', 'compact-desktops', v_desktop_computers_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- MONITORS L3
  IF v_monitors_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gaming Monitors', 'Геймърски монитори', 'gaming-monitors-cat', v_monitors_id, 1),
    ('Ultrawide Monitors', 'Ултраширок монитори', 'ultrawide-monitors', v_monitors_id, 2),
    ('4K Monitors', '4K монитори', '4k-monitors', v_monitors_id, 3),
    ('Curved Monitors', 'Извити монитори', 'curved-monitors', v_monitors_id, 4),
    ('Professional Monitors', 'Професионални монитори', 'professional-monitors', v_monitors_id, 5),
    ('Portable Monitors', 'Преносими монитори', 'portable-monitors', v_monitors_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Massive L3 categories batch 2 restored';
END $$;
;
