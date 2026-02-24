
-- Restore massive batch of L3 categories - batch 3 (Wholesale, Services, Real Estate)
DO $$
DECLARE
  -- Wholesale L2 IDs
  v_wholesale_phones_id UUID;
  v_wholesale_computers_id UUID;
  v_wholesale_womens_id UUID;
  v_wholesale_mens_id UUID;
  v_wholesale_kids_id UUID;
  -- Services L2 IDs
  v_plumbing_services_id UUID;
  v_electrical_services_id UUID;
  v_cleaning_services_id UUID;
  v_legal_services_id UUID;
  v_it_services_id UUID;
  v_auto_repair_id UUID;
  -- Real Estate L2 IDs
  v_apartment_rentals_id UUID;
  v_house_rentals_id UUID;
  v_studio_apartments_id UUID;
  v_one_bedroom_id UUID;
  v_offices_id UUID;
BEGIN
  -- Get Wholesale L2 IDs
  SELECT id INTO v_wholesale_phones_id FROM categories WHERE slug = 'wholesale-phones';
  SELECT id INTO v_wholesale_computers_id FROM categories WHERE slug = 'wholesale-computers';
  SELECT id INTO v_wholesale_womens_id FROM categories WHERE slug = 'wholesale-womens-clothing';
  SELECT id INTO v_wholesale_mens_id FROM categories WHERE slug = 'wholesale-mens-clothing';
  SELECT id INTO v_wholesale_kids_id FROM categories WHERE slug = 'wholesale-kids-clothing';

  -- Get Services L2 IDs
  SELECT id INTO v_plumbing_services_id FROM categories WHERE slug = 'plumbing-services';
  SELECT id INTO v_electrical_services_id FROM categories WHERE slug = 'electrical-services';
  SELECT id INTO v_cleaning_services_id FROM categories WHERE slug = 'cleaning-services';
  SELECT id INTO v_legal_services_id FROM categories WHERE slug = 'legal-services';
  SELECT id INTO v_it_services_id FROM categories WHERE slug = 'it-services';
  SELECT id INTO v_auto_repair_id FROM categories WHERE slug = 'auto-repair-services';

  -- Get Real Estate L2 IDs
  SELECT id INTO v_apartment_rentals_id FROM categories WHERE slug = 'apartment-rentals';
  SELECT id INTO v_house_rentals_id FROM categories WHERE slug = 'house-rentals';
  SELECT id INTO v_studio_apartments_id FROM categories WHERE slug = 'studio-apartments';
  SELECT id INTO v_one_bedroom_id FROM categories WHERE slug = 'one-bedroom-apartments';
  SELECT id INTO v_offices_id FROM categories WHERE slug = 'offices-for-sale';

  -- WHOLESALE PHONES L3
  IF v_wholesale_phones_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('iPhone Wholesale', 'iPhone на едро', 'iphone-wholesale', v_wholesale_phones_id, 1),
    ('Samsung Wholesale', 'Samsung на едро', 'samsung-wholesale', v_wholesale_phones_id, 2),
    ('Xiaomi Wholesale', 'Xiaomi на едро', 'xiaomi-wholesale', v_wholesale_phones_id, 3),
    ('OnePlus Wholesale', 'OnePlus на едро', 'oneplus-wholesale', v_wholesale_phones_id, 4),
    ('Refurbished Phones Wholesale', 'Реновирани телефони на едро', 'refurbished-wholesale', v_wholesale_phones_id, 5),
    ('Phone Cases Wholesale', 'Калъфи на едро', 'phone-cases-wholesale', v_wholesale_phones_id, 6),
    ('Chargers Wholesale', 'Зарядни на едро', 'chargers-wholesale', v_wholesale_phones_id, 7),
    ('Screen Protectors Wholesale', 'Скрийн протектори на едро', 'screen-protectors-wholesale', v_wholesale_phones_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- WHOLESALE COMPUTERS L3
  IF v_wholesale_computers_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Laptops Wholesale', 'Лаптопи на едро', 'laptops-wholesale', v_wholesale_computers_id, 1),
    ('Desktops Wholesale', 'Настолни на едро', 'desktops-wholesale', v_wholesale_computers_id, 2),
    ('Tablets Wholesale', 'Таблети на едро', 'tablets-wholesale', v_wholesale_computers_id, 3),
    ('Monitors Wholesale', 'Монитори на едро', 'monitors-wholesale', v_wholesale_computers_id, 4),
    ('Computer Parts Wholesale', 'Компоненти на едро', 'computer-parts-wholesale', v_wholesale_computers_id, 5),
    ('Keyboards Wholesale', 'Клавиатури на едро', 'keyboards-wholesale', v_wholesale_computers_id, 6),
    ('Mice Wholesale', 'Мишки на едро', 'mice-wholesale', v_wholesale_computers_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- WHOLESALE WOMENS CLOTHING L3
  IF v_wholesale_womens_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dresses Wholesale', 'Рокли на едро', 'dresses-wholesale', v_wholesale_womens_id, 1),
    ('Tops Wholesale', 'Топове на едро', 'tops-wholesale', v_wholesale_womens_id, 2),
    ('Pants Wholesale', 'Панталони на едро', 'pants-wholesale', v_wholesale_womens_id, 3),
    ('Skirts Wholesale', 'Поли на едро', 'skirts-wholesale', v_wholesale_womens_id, 4),
    ('Jackets Wholesale', 'Якета на едро', 'jackets-wholesale-womens', v_wholesale_womens_id, 5),
    ('Swimwear Wholesale', 'Бански на едро', 'swimwear-wholesale', v_wholesale_womens_id, 6),
    ('Lingerie Wholesale', 'Бельо на едро', 'lingerie-wholesale', v_wholesale_womens_id, 7),
    ('Activewear Wholesale', 'Спортни дрехи на едро', 'activewear-wholesale', v_wholesale_womens_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- WHOLESALE MENS CLOTHING L3
  IF v_wholesale_mens_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Shirts Wholesale', 'Ризи на едро', 'shirts-wholesale', v_wholesale_mens_id, 1),
    ('T-Shirts Wholesale', 'Тениски на едро', 'tshirts-wholesale', v_wholesale_mens_id, 2),
    ('Pants Wholesale', 'Панталони на едро', 'pants-wholesale-mens', v_wholesale_mens_id, 3),
    ('Suits Wholesale', 'Костюми на едро', 'suits-wholesale', v_wholesale_mens_id, 4),
    ('Jackets Wholesale', 'Якета на едро', 'jackets-wholesale-mens', v_wholesale_mens_id, 5),
    ('Underwear Wholesale', 'Бельо на едро', 'underwear-wholesale', v_wholesale_mens_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- PLUMBING SERVICES L3
  IF v_plumbing_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Drain Cleaning', 'Почистване на канали', 'drain-cleaning', v_plumbing_services_id, 1),
    ('Pipe Repair', 'Ремонт на тръби', 'pipe-repair', v_plumbing_services_id, 2),
    ('Water Heater Services', 'Бойлери', 'water-heater-services', v_plumbing_services_id, 3),
    ('Toilet Repair', 'Ремонт на тоалетни', 'toilet-repair', v_plumbing_services_id, 4),
    ('Faucet Installation', 'Монтаж на батерии', 'faucet-installation', v_plumbing_services_id, 5),
    ('Emergency Plumbing', 'Спешни ВиК услуги', 'emergency-plumbing', v_plumbing_services_id, 6),
    ('Sewer Line Services', 'Канализация', 'sewer-line-services', v_plumbing_services_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ELECTRICAL SERVICES L3
  IF v_electrical_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wiring Services', 'Електрическо окабеляване', 'wiring-services', v_electrical_services_id, 1),
    ('Panel Upgrades', 'Ъпгрейд на табла', 'panel-upgrades', v_electrical_services_id, 2),
    ('Outlet Installation', 'Монтаж на контакти', 'outlet-installation', v_electrical_services_id, 3),
    ('Lighting Installation', 'Монтаж на осветление', 'lighting-installation', v_electrical_services_id, 4),
    ('Electrical Repair', 'Електрически ремонт', 'electrical-repair', v_electrical_services_id, 5),
    ('Generator Services', 'Генератори', 'generator-services', v_electrical_services_id, 6),
    ('Smart Home Wiring', 'Смарт дом окабеляване', 'smart-home-wiring', v_electrical_services_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- CLEANING SERVICES L3
  IF v_cleaning_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('House Cleaning', 'Почистване на дом', 'house-cleaning-service', v_cleaning_services_id, 1),
    ('Office Cleaning', 'Почистване на офис', 'office-cleaning-service', v_cleaning_services_id, 2),
    ('Deep Cleaning', 'Основно почистване', 'deep-cleaning', v_cleaning_services_id, 3),
    ('Carpet Cleaning', 'Почистване на килими', 'carpet-cleaning-service', v_cleaning_services_id, 4),
    ('Window Cleaning', 'Почистване на прозорци', 'window-cleaning', v_cleaning_services_id, 5),
    ('Post-Construction Cleaning', 'Следремонтно почистване', 'post-construction-cleaning', v_cleaning_services_id, 6),
    ('Move-In/Out Cleaning', 'Почистване при преместване', 'move-cleaning', v_cleaning_services_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- LEGAL SERVICES L3
  IF v_legal_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Family Law', 'Семейно право', 'family-law', v_legal_services_id, 1),
    ('Criminal Defense', 'Наказателно право', 'criminal-defense', v_legal_services_id, 2),
    ('Real Estate Law', 'Имотно право', 'real-estate-law', v_legal_services_id, 3),
    ('Business Law', 'Търговско право', 'business-law', v_legal_services_id, 4),
    ('Personal Injury', 'Лични вреди', 'personal-injury-law', v_legal_services_id, 5),
    ('Immigration Law', 'Имиграционно право', 'immigration-law', v_legal_services_id, 6),
    ('Estate Planning', 'Наследствено планиране', 'estate-planning', v_legal_services_id, 7),
    ('Employment Law', 'Трудово право', 'employment-law', v_legal_services_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- IT SERVICES L3
  IF v_it_services_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Computer Repair', 'Ремонт на компютри', 'computer-repair-service', v_it_services_id, 1),
    ('Network Setup', 'Настройка на мрежи', 'network-setup', v_it_services_id, 2),
    ('Data Recovery', 'Възстановяване на данни', 'data-recovery-service', v_it_services_id, 3),
    ('Website Development', 'Уеб разработка', 'website-development', v_it_services_id, 4),
    ('IT Support', 'IT поддръжка', 'it-support', v_it_services_id, 5),
    ('Cloud Services', 'Облачни услуги', 'cloud-services', v_it_services_id, 6),
    ('Cybersecurity', 'Киберсигурност', 'cybersecurity-services', v_it_services_id, 7),
    ('App Development', 'Разработка на приложения', 'app-development', v_it_services_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- AUTO REPAIR L3
  IF v_auto_repair_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Engine Repair', 'Ремонт на двигател', 'engine-repair', v_auto_repair_id, 1),
    ('Brake Service', 'Спирачна система', 'brake-service', v_auto_repair_id, 2),
    ('Transmission Repair', 'Ремонт на скоростна', 'transmission-repair', v_auto_repair_id, 3),
    ('AC Service', 'Климатик', 'ac-service', v_auto_repair_id, 4),
    ('Electrical Repair', 'Авто електроника', 'auto-electrical-repair', v_auto_repair_id, 5),
    ('Suspension Repair', 'Окачване', 'suspension-repair', v_auto_repair_id, 6),
    ('Exhaust Repair', 'Ауспух', 'exhaust-repair', v_auto_repair_id, 7),
    ('Tune-Up Service', 'Профилактика', 'tune-up-service', v_auto_repair_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- APARTMENT RENTALS L3
  IF v_apartment_rentals_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Furnished Apartments', 'Обзаведени апартаменти', 'furnished-apartments', v_apartment_rentals_id, 1),
    ('Unfurnished Apartments', 'Необзаведени апартаменти', 'unfurnished-apartments', v_apartment_rentals_id, 2),
    ('Pet-Friendly Apartments', 'За домашни любимци', 'pet-friendly-apartments', v_apartment_rentals_id, 3),
    ('Luxury Apartments', 'Луксозни апартаменти', 'luxury-apartments-rent', v_apartment_rentals_id, 4),
    ('Student Housing', 'Студентско жилище', 'student-housing', v_apartment_rentals_id, 5),
    ('Senior Housing', 'За възрастни', 'senior-housing', v_apartment_rentals_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- HOUSE RENTALS L3
  IF v_house_rentals_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Single Family Rentals', 'Еднофамилни къщи', 'single-family-rentals', v_house_rentals_id, 1),
    ('Townhouse Rentals', 'Редови къщи', 'townhouse-rentals', v_house_rentals_id, 2),
    ('Villa Rentals', 'Вили под наем', 'villa-rentals', v_house_rentals_id, 3),
    ('Furnished Houses', 'Обзаведени къщи', 'furnished-houses', v_house_rentals_id, 4),
    ('Pet-Friendly Houses', 'За домашни любимци', 'pet-friendly-houses', v_house_rentals_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Massive L3 categories batch 3 restored';
END $$;
;
