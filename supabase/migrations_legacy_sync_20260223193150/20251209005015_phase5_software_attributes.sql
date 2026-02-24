
-- Phase 5: Software - Comprehensive Attributes

DO $$
DECLARE
  software_id UUID;
BEGIN
  SELECT id INTO software_id FROM categories WHERE slug = 'software';
  
  -- Core Software Attributes (L0 level)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (software_id, 'License Type', 'Тип лиценз', 'select', '["Perpetual", "Subscription", "Freemium", "Open Source", "Trial", "OEM"]', '["Безсрочен", "Абонамент", "Фриймиум", "Отворен код", "Пробен", "OEM"]', false, true, 1),
    (software_id, 'Platform', 'Платформа', 'select', '["Windows", "macOS", "Linux", "iOS", "Android", "Web-based", "Cross-platform"]', '["Windows", "macOS", "Linux", "iOS", "Android", "Уеб базиран", "Крос платформен"]', false, true, 2),
    (software_id, 'Users', 'Потребители', 'select', '["Single User", "5 Users", "10 Users", "25 Users", "Unlimited", "Enterprise"]', '["Един потребител", "5 потребители", "10 потребители", "25 потребители", "Неограничени", "Корпоративен"]', false, true, 3),
    (software_id, 'Delivery', 'Доставка', 'select', '["Digital Download", "Physical Media", "Cloud Access", "USB Drive"]', '["Дигитално изтегляне", "Физически носител", "Облачен достъп", "USB устройство"]', false, true, 4),
    (software_id, 'Version', 'Версия', 'text', NULL, NULL, false, true, 5)
  ON CONFLICT DO NOTHING;
END $$;

-- AI & Machine Learning specific attributes
DO $$
DECLARE
  ai_id UUID;
BEGIN
  SELECT id INTO ai_id FROM categories WHERE slug = 'ai-machine-learning';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (ai_id, 'AI Model Type', 'Тип AI модел', 'select', '["GPT", "Stable Diffusion", "DALL-E", "Midjourney", "Claude", "LLaMA", "Custom", "Other"]', '["GPT", "Stable Diffusion", "DALL-E", "Midjourney", "Claude", "LLaMA", "Персонализиран", "Друг"]', false, true, 1),
    (ai_id, 'API Access', 'API достъп', 'boolean', NULL, NULL, false, true, 2),
    (ai_id, 'Training Data Included', 'Включени тренировъчни данни', 'boolean', NULL, NULL, false, true, 3),
    (ai_id, 'Commercial Use', 'Търговска употреба', 'select', '["Allowed", "Restricted", "Not Allowed"]', '["Разрешена", "Ограничена", "Забранена"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Business Software specific attributes
DO $$
DECLARE
  biz_id UUID;
BEGIN
  SELECT id INTO biz_id FROM categories WHERE slug = 'business-software';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (biz_id, 'Company Size', 'Размер на компанията', 'select', '["Freelancer", "Small Business (1-10)", "Medium Business (11-50)", "Enterprise (50+)", "Any Size"]', '["Фрийлансър", "Малък бизнес (1-10)", "Среден бизнес (11-50)", "Корпорация (50+)", "Всякакъв размер"]', false, true, 1),
    (biz_id, 'Cloud/On-Premise', 'Облак/На място', 'select', '["Cloud Only", "On-Premise Only", "Hybrid", "Both Options"]', '["Само облак", "Само на място", "Хибриден", "И двете опции"]', false, true, 2),
    (biz_id, 'Integration Available', 'Налични интеграции', 'text', NULL, NULL, false, true, 3),
    (biz_id, 'Mobile App', 'Мобилно приложение', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Development Tools specific attributes
DO $$
DECLARE
  dev_id UUID;
BEGIN
  SELECT id INTO dev_id FROM categories WHERE slug = 'dev-tools';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (dev_id, 'Language Support', 'Поддържани езици', 'text', NULL, NULL, false, true, 1),
    (dev_id, 'Framework Support', 'Поддържани фреймуърки', 'text', NULL, NULL, false, true, 2),
    (dev_id, 'IDE Integration', 'IDE интеграция', 'select', '["VS Code", "Visual Studio", "JetBrains", "Eclipse", "Multiple", "Standalone"]', '["VS Code", "Visual Studio", "JetBrains", "Eclipse", "Множество", "Самостоятелен"]', false, true, 3),
    (dev_id, 'Open Source', 'Отворен код', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Creative Software specific attributes
DO $$
DECLARE
  creative_id UUID;
BEGIN
  SELECT id INTO creative_id FROM categories WHERE slug = 'creative-software';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (creative_id, 'Skill Level', 'Ниво на умение', 'select', '["Beginner", "Intermediate", "Advanced", "Professional"]', '["Начинаещ", "Среднонапреднал", "Напреднал", "Професионален"]', false, true, 1),
    (creative_id, 'File Formats', 'Файлови формати', 'text', NULL, NULL, false, true, 2),
    (creative_id, 'GPU Acceleration', 'GPU ускорение', 'boolean', NULL, NULL, false, true, 3),
    (creative_id, 'Plugins/Extensions', 'Плъгини/Разширения', 'boolean', NULL, NULL, false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Security Software specific attributes
DO $$
DECLARE
  sec_id UUID;
BEGIN
  SELECT id INTO sec_id FROM categories WHERE slug = 'security-software';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
  VALUES
    (sec_id, 'Protection Type', 'Тип защита', 'select', '["Antivirus", "Firewall", "VPN", "Password Manager", "Full Suite", "Multiple"]', '["Антивирус", "Защитна стена", "VPN", "Мениджър на пароли", "Пълен пакет", "Множество"]', false, true, 1),
    (sec_id, 'Devices Protected', 'Защитени устройства', 'select', '["1 Device", "3 Devices", "5 Devices", "10 Devices", "Unlimited"]', '["1 устройство", "3 устройства", "5 устройства", "10 устройства", "Неограничени"]', false, true, 2),
    (sec_id, 'Real-time Protection', 'Защита в реално време', 'boolean', NULL, NULL, false, true, 3),
    (sec_id, 'Customer Support', 'Клиентска поддръжка', 'select', '["24/7 Support", "Business Hours", "Email Only", "Community"]', '["24/7 поддръжка", "Работно време", "Само имейл", "Общност"]', false, true, 4)
  ON CONFLICT DO NOTHING;
END $$;
;
