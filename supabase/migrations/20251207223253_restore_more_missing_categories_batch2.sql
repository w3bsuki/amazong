
-- Restore more missing L2 and L3 categories - batch 2
DO $$
DECLARE
  -- Software L1 IDs
  v_software_id UUID;
  v_os_id UUID;
  v_business_software_id UUID;
  v_creative_software_id UUID;
  v_security_software_id UUID;
  v_dev_tools_id UUID;
  v_education_software_id UUID;
  -- Wholesale L1 IDs
  v_wholesale_id UUID;
  v_wholesale_electronics_id UUID;
  v_wholesale_clothing_id UUID;
  v_wholesale_home_id UUID;
  v_wholesale_beauty_id UUID;
  v_wholesale_food_id UUID;
  -- Services L1 IDs
  v_services_id UUID;
  v_home_services_id UUID;
  v_professional_services_id UUID;
  v_auto_services_id UUID;
  v_event_services_id UUID;
  v_health_services_id UUID;
  -- Real Estate L1 IDs
  v_real_estate_id UUID;
  v_rentals_id UUID;
  v_property_mgmt_id UUID;
BEGIN
  -- Get Software parent
  SELECT id INTO v_software_id FROM categories WHERE slug = 'software';
  
  -- Get Software L1 IDs
  SELECT id INTO v_os_id FROM categories WHERE slug = 'operating-systems';
  SELECT id INTO v_business_software_id FROM categories WHERE slug = 'business-software';
  SELECT id INTO v_creative_software_id FROM categories WHERE slug = 'creative-software';
  SELECT id INTO v_security_software_id FROM categories WHERE slug = 'security-software';
  SELECT id INTO v_dev_tools_id FROM categories WHERE slug = 'development-tools';
  SELECT id INTO v_education_software_id FROM categories WHERE slug = 'education-software';

  -- Get Wholesale parent
  SELECT id INTO v_wholesale_id FROM categories WHERE slug = 'wholesale';
  
  -- Get Wholesale L1 IDs  
  SELECT id INTO v_wholesale_electronics_id FROM categories WHERE slug = 'wholesale-electronics';
  SELECT id INTO v_wholesale_clothing_id FROM categories WHERE slug = 'wholesale-clothing';
  SELECT id INTO v_wholesale_home_id FROM categories WHERE slug = 'wholesale-home';
  SELECT id INTO v_wholesale_beauty_id FROM categories WHERE slug = 'wholesale-beauty';
  SELECT id INTO v_wholesale_food_id FROM categories WHERE slug = 'wholesale-food';

  -- Get Services parent
  SELECT id INTO v_services_id FROM categories WHERE slug = 'services';
  
  -- Get Services L1 IDs
  SELECT id INTO v_home_services_id FROM categories WHERE slug = 'home-services';
  SELECT id INTO v_professional_services_id FROM categories WHERE slug = 'professional-services';
  SELECT id INTO v_auto_services_id FROM categories WHERE slug = 'auto-services';
  SELECT id INTO v_event_services_id FROM categories WHERE slug = 'event-services';
  SELECT id INTO v_health_services_id FROM categories WHERE slug = 'health-services';

  -- Get Real Estate parent
  SELECT id INTO v_real_estate_id FROM categories WHERE slug = 'real-estate';
  SELECT id INTO v_rentals_id FROM categories WHERE slug = 'rentals';
  SELECT id INTO v_property_mgmt_id FROM categories WHERE slug = 'property-management';

  -- SOFTWARE L2 Categories
  IF v_os_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Windows OS', 'Windows', 'windows-os', v_os_id, 1),
    ('macOS', 'macOS', 'macos', v_os_id, 2),
    ('Linux', 'Linux', 'linux-os', v_os_id, 3),
    ('Server OS', 'Сървърни ОС', 'server-os', v_os_id, 4),
    ('Mobile OS', 'Мобилни ОС', 'mobile-os', v_os_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_business_software_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Office Suites', 'Офис пакети', 'office-suites', v_business_software_id, 1),
    ('Accounting Software', 'Счетоводен софтуер', 'accounting-software', v_business_software_id, 2),
    ('CRM Software', 'CRM софтуер', 'crm-software', v_business_software_id, 3),
    ('Project Management', 'Управление на проекти', 'project-management-software', v_business_software_id, 4),
    ('HR Software', 'HR софтуер', 'hr-software', v_business_software_id, 5),
    ('ERP Software', 'ERP системи', 'erp-software', v_business_software_id, 6),
    ('Inventory Management', 'Управление на инвентар', 'inventory-software', v_business_software_id, 7),
    ('Communication Tools', 'Комуникационни инструменти', 'communication-tools', v_business_software_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_creative_software_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Photo Editing', 'Обработка на снимки', 'photo-editing-software', v_creative_software_id, 1),
    ('Video Editing', 'Видео монтаж', 'video-editing-software', v_creative_software_id, 2),
    ('Audio Production', 'Аудио продукция', 'audio-production-software', v_creative_software_id, 3),
    ('Graphic Design', 'Графичен дизайн', 'graphic-design-software', v_creative_software_id, 4),
    ('3D Modeling', '3D моделиране', '3d-modeling-software', v_creative_software_id, 5),
    ('Animation', 'Анимация', 'animation-software', v_creative_software_id, 6),
    ('Web Design', 'Уеб дизайн', 'web-design-software', v_creative_software_id, 7),
    ('CAD Software', 'CAD софтуер', 'cad-software', v_creative_software_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_security_software_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Antivirus', 'Антивирусен', 'antivirus-software', v_security_software_id, 1),
    ('Firewall', 'Защитна стена', 'firewall-software', v_security_software_id, 2),
    ('VPN', 'VPN', 'vpn-software', v_security_software_id, 3),
    ('Password Managers', 'Мениджъри на пароли', 'password-managers', v_security_software_id, 4),
    ('Encryption', 'Криптиране', 'encryption-software', v_security_software_id, 5),
    ('Backup Software', 'Бекъп софтуер', 'backup-software', v_security_software_id, 6),
    ('Parental Controls', 'Родителски контрол', 'parental-controls', v_security_software_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_dev_tools_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('IDEs', 'IDE', 'ides', v_dev_tools_id, 1),
    ('Code Editors', 'Редактори на код', 'code-editors', v_dev_tools_id, 2),
    ('Version Control', 'Контрол на версии', 'version-control', v_dev_tools_id, 3),
    ('Testing Tools', 'Инструменти за тестване', 'testing-tools', v_dev_tools_id, 4),
    ('Database Tools', 'Инструменти за бази данни', 'database-tools', v_dev_tools_id, 5),
    ('API Tools', 'API инструменти', 'api-tools', v_dev_tools_id, 6),
    ('DevOps Tools', 'DevOps инструменти', 'devops-tools', v_dev_tools_id, 7),
    ('SDKs', 'SDK', 'sdks', v_dev_tools_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- WHOLESALE L2 Categories
  IF v_wholesale_electronics_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wholesale Phones', 'Телефони на едро', 'wholesale-phones', v_wholesale_electronics_id, 1),
    ('Wholesale Computers', 'Компютри на едро', 'wholesale-computers', v_wholesale_electronics_id, 2),
    ('Wholesale Accessories', 'Аксесоари на едро', 'wholesale-electronics-accessories', v_wholesale_electronics_id, 3),
    ('Wholesale Audio', 'Аудио на едро', 'wholesale-audio', v_wholesale_electronics_id, 4),
    ('Wholesale Cameras', 'Камери на едро', 'wholesale-cameras', v_wholesale_electronics_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_wholesale_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wholesale Women''s', 'Дамски на едро', 'wholesale-womens-clothing', v_wholesale_clothing_id, 1),
    ('Wholesale Men''s', 'Мъжки на едро', 'wholesale-mens-clothing', v_wholesale_clothing_id, 2),
    ('Wholesale Kids''', 'Детски на едро', 'wholesale-kids-clothing', v_wholesale_clothing_id, 3),
    ('Wholesale Footwear', 'Обувки на едро', 'wholesale-footwear', v_wholesale_clothing_id, 4),
    ('Wholesale Accessories', 'Аксесоари на едро', 'wholesale-fashion-accessories', v_wholesale_clothing_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- SERVICES L2 Categories
  IF v_home_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Plumbing Services', 'ВиК услуги', 'plumbing-services', v_home_services_id, 1),
    ('Electrical Services', 'Електро услуги', 'electrical-services', v_home_services_id, 2),
    ('HVAC Services', 'Климатизация', 'hvac-services', v_home_services_id, 3),
    ('Cleaning Services', 'Почистване', 'cleaning-services', v_home_services_id, 4),
    ('Landscaping', 'Озеленяване', 'landscaping-services', v_home_services_id, 5),
    ('Moving Services', 'Преместване', 'moving-services', v_home_services_id, 6),
    ('Home Renovation', 'Ремонти', 'home-renovation-services', v_home_services_id, 7),
    ('Pest Control', 'Дезинсекция', 'pest-control-services', v_home_services_id, 8),
    ('Security Systems', 'Охранителни системи', 'security-systems-services', v_home_services_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_professional_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Legal Services', 'Правни услуги', 'legal-services', v_professional_services_id, 1),
    ('Accounting Services', 'Счетоводни услуги', 'accounting-services', v_professional_services_id, 2),
    ('Consulting', 'Консултации', 'consulting-services', v_professional_services_id, 3),
    ('Marketing Services', 'Маркетинг', 'marketing-services', v_professional_services_id, 4),
    ('IT Services', 'IT услуги', 'it-services', v_professional_services_id, 5),
    ('Translation Services', 'Преводи', 'translation-services', v_professional_services_id, 6),
    ('Design Services', 'Дизайн услуги', 'design-services', v_professional_services_id, 7),
    ('Photography', 'Фотография', 'photography-services', v_professional_services_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_auto_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Auto Repair', 'Авторемонт', 'auto-repair-services', v_auto_services_id, 1),
    ('Oil Change', 'Смяна на масло', 'oil-change-services', v_auto_services_id, 2),
    ('Tire Services', 'Гуми', 'tire-services', v_auto_services_id, 3),
    ('Car Wash', 'Автомивка', 'car-wash-services', v_auto_services_id, 4),
    ('Detailing', 'Детайлинг', 'detailing-services', v_auto_services_id, 5),
    ('Towing', 'Пътна помощ', 'towing-services', v_auto_services_id, 6),
    ('Glass Repair', 'Автостъкла', 'glass-repair-services', v_auto_services_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- REAL ESTATE L2 Categories
  IF v_rentals_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Apartment Rentals', 'Апартаменти под наем', 'apartment-rentals', v_rentals_id, 1),
    ('House Rentals', 'Къщи под наем', 'house-rentals', v_rentals_id, 2),
    ('Room Rentals', 'Стаи под наем', 'room-rentals', v_rentals_id, 3),
    ('Office Rentals', 'Офиси под наем', 'office-rentals', v_rentals_id, 4),
    ('Commercial Rentals', 'Търговски под наем', 'commercial-rentals', v_rentals_id, 5),
    ('Vacation Rentals', 'Ваканционни', 'vacation-rentals', v_rentals_id, 6),
    ('Short Term Rentals', 'Краткосрочни', 'short-term-rentals', v_rentals_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'More missing categories restored - batch 2';
END $$;
;
